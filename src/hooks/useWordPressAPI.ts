import { useState, useEffect } from 'react';

// WordPress API Types
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
      media_details: {
        width: number;
        height: number;
        sizes: {
          [key: string]: {
            source_url: string;
            width: number;
            height: number;
          };
        };
      };
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
    author?: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
  };
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

// Transformed types for the app
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
  slug: string;
  link: string;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// Configuration
interface WordPressConfig {
  baseUrl: string;
  username?: string;
  password?: string;
  apiKey?: string;
}

// Default configuration - replace with your WordPress site URL
const DEFAULT_CONFIG: WordPressConfig = {
  baseUrl: 'https://marilianoticia.com.br', // Replace with your WordPress site
};

class WordPressAPI {
  private config: WordPressConfig;

  constructor(config: WordPressConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${this.config.baseUrl}/wp-json/wp/v2/${endpoint}`);
    
    // Add common parameters
    const searchParams = new URLSearchParams({
      _embed: 'true', // Include embedded data (featured images, categories, etc.)
      ...params
    });

    url.search = searchParams.toString();

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        }
      });

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('WordPress API request failed:', error);
      throw error;
    }
  }

  async getPosts(params: {
    page?: number;
    per_page?: number;
    categories?: number[];
    search?: string;
    orderby?: 'date' | 'modified' | 'title' | 'relevance';
    order?: 'asc' | 'desc';
  } = {}): Promise<WordPressPost[]> {
    const queryParams: Record<string, any> = {
      per_page: 10,
      orderby: 'date',
      order: 'desc',
      ...params
    };

    if (params.categories && params.categories.length > 0) {
      queryParams.categories = params.categories.join(',');
    }

    return this.makeRequest('posts', queryParams);
  }

  async getPost(id: number | string): Promise<WordPressPost> {
    return this.makeRequest(`posts/${id}`);
  }

  async getCategories(): Promise<WordPressCategory[]> {
    return this.makeRequest('categories', { per_page: 100 });
  }

  async getCategory(id: number | string): Promise<WordPressCategory> {
    return this.makeRequest(`categories/${id}`);
  }

  // Transform WordPress post to app format
  transformPost(post: WordPressPost): NewsItem {
    const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
    const categories = post._embedded?.['wp:term']?.[0] || [];
    const author = post._embedded?.author?.[0];

    return {
      id: post.id.toString(),
      title: this.decodeHtml(post.title.rendered),
      excerpt: this.stripHtml(post.excerpt.rendered),
      content: post.content.rendered,
      image: featuredImage?.source_url || '',
      category: categories[0]?.name || 'Notícias',
      date: post.date,
      author: author?.name || 'Redação',
      slug: post.slug,
      link: post.link
    };
  }

  // Transform WordPress category to app format
  transformCategory(category: WordPressCategory): NewsCategory {
    return {
      id: category.id.toString(),
      name: category.name,
      slug: category.slug,
      count: category.count
    };
  }

  private decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  private stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
}

// Hooks
export function useWordPressPosts(params: {
  page?: number;
  per_page?: number;
  categories?: number[];
  search?: string;
  enabled?: boolean;
} = {}) {
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = new WordPressAPI();

  useEffect(() => {
    if (params.enabled === false) return;

    let isMounted = true;

    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);
        
        const wpPosts = await api.getPosts(params);
        
        if (isMounted) {
          const transformedPosts = wpPosts.map(post => api.transformPost(post));
          setPosts(transformedPosts);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch posts');
          console.error('Error fetching WordPress posts:', err);
          
          // Fallback to mock data on error
          setPosts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [params.page, params.per_page, params.search, JSON.stringify(params.categories), params.enabled]);

  return { posts, loading, error, refetch: () => window.location.reload() };
}

export function useWordPressCategories() {
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = new WordPressAPI();

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);
        
        const wpCategories = await api.getCategories();
        
        if (isMounted) {
          const transformedCategories = wpCategories.map(cat => api.transformCategory(cat));
          setCategories(transformedCategories);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch categories');
          console.error('Error fetching WordPress categories:', err);
          
          // Fallback to empty array on error
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, loading, error };
}

export function useWordPressPost(id: string | number | null) {
  const [post, setPost] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = new WordPressAPI();

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    async function fetchPost() {
      try {
        setLoading(true);
        setError(null);
        
        const wpPost = await api.getPost(id);
        
        if (isMounted) {
          const transformedPost = api.transformPost(wpPost);
          setPost(transformedPost);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch post');
          console.error('Error fetching WordPress post:', err);
          setPost(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { post, loading, error };
}

export default WordPressAPI;