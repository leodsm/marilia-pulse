import { useState, useEffect } from 'react';
import { Heart, Search, User, Share2, Bookmark, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Types
interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
}

interface StoryCategory {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  news: NewsItem[];
}

// Mock data - in production this would come from WordPress API
const mockNews: NewsItem[] = [
  {
    id: 'mercado-livre',
    title: 'Mercado Livre agenda solenidade para início das atividades em Marília',
    excerpt: 'Evento acontece na manhã desta quarta-feira (14), no novo centro de distribuição.',
    content: `<p><strong>MARÍLIA -</strong> O Mercado Livre, gigante do comércio eletrônico na América Latina, agendou para a manhã desta quarta-feira (14), às 10h, a solenidade que marca o início oficial das atividades de seu novo centro de distribuição em Marília. O evento contará com a presença de autoridades e executivos da empresa.</p><p>O novo centro logístico, localizado estrategicamente às margens da rodovia, promete otimizar as entregas na região, gerando empregos e movimentando a economia local. A expectativa é que a operação comece de forma gradual, aumentando a capacidade conforme a demanda regional.</p><p>A chegada da empresa foi celebrada por lideranças locais como um marco para o desenvolvimento de Marília, posicionando a cidade como um importante polo logístico no interior de São Paulo.</p>`,
    image: 'https://marilianoticia.com.br/wp-content/uploads/2025/08/mercado-livre-ok-768x576.jpg',
    category: 'Economia',
    date: '2025-08-14',
    author: 'Redação ComMarília'
  },
  {
    id: 'fabio-conte',
    title: 'Morre o jornalista e apresentador Fábio Conte, aos 42 anos',
    excerpt: 'Profissional estava internado e lutava contra um câncer.',
    content: `<p><strong>MARÍLIA -</strong> A comunicação de Marília está de luto. Morreu na noite desta terça-feira (13), aos 42 anos, o jornalista e apresentador Fábio Conte. Ele estava internado e lutava contra um câncer.</p><p>Com uma carreira marcada pela versatilidade e carisma, Fábio atuou em diversas emissoras de rádio e televisão da cidade, tornando-se um rosto conhecido e querido pelo público. Sua partida gerou uma onda de comoção nas redes sociais, com homenagens de colegas de profissão, amigos e espectadores.</p><p>O velório acontece no Velório Municipal e o sepultamento está previsto para o final da tarde desta quarta-feira (14), no Cemitério da Saudade.</p>`,
    image: 'https://marilianoticia.com.br/wp-content/uploads/2025/08/489435781_2291614727876947_4869630662561411372_n.jpg',
    category: 'Luto',
    date: '2025-08-13',
    author: 'Redação ComMarília'
  },
  {
    id: 'transito',
    title: 'Zona Oeste de Marília recebe ação para reduzir lentidão no trânsito',
    excerpt: 'Alterações visam melhorar o fluxo de veículos em horários de pico.',
    content: `<p><strong>MARÍLIA -</strong> A Emdurb (Empresa de Mobilidade Urbana de Marília) iniciou uma série de alterações no trânsito da zona Oeste da cidade, com o objetivo de diminuir os congestionamentos em horários de pico. As mudanças incluem a implantação de novos semáforos inteligentes e a conversão de algumas ruas para mão única.</p><p>O foco principal da ação é a Avenida Tiradentes e seus cruzamentos, que concentram grande parte do fluxo de veículos da região. Segundo a Emdurb, os novos semáforos são sincronizados e se ajustam ao volume de tráfego em tempo real, prometendo maior fluidez.</p><p>Agentes de trânsito estão no local para orientar os motoristas durante o período de adaptação. A expectativa é que os primeiros resultados positivos sejam sentidos já nas próximas semanas.</p>`,
    image: 'https://marilianoticia.com.br/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-12-at-10.48.01-768x576.jpeg',
    category: 'Trânsito',
    date: '2025-08-12',
    author: 'Redação ComMarília'
  },
  {
    id: 'sacolinhas',
    title: 'Mudança em lei não garante sacolinhas gratuitas em Marília',
    excerpt: 'Nova legislação estadual não se sobrepõe à lei municipal existente.',
    content: `<p><strong>MARÍLIA -</strong> Uma nova lei estadual que regulamenta a distribuição de sacolas plásticas em São Paulo gerou dúvidas nos consumidores de Marília. No entanto, a mudança não garante a gratuidade das sacolinhas na cidade, pois a legislação municipal, que permite a cobrança, continua em vigor.</p><p>A lei estadual foca em questões ambientais, exigindo que as sacolas sejam feitas de material mais resistente e com maior percentual de conteúdo reciclado. A decisão sobre a cobrança ou não do item permanece a critério de cada município.</p><p>Em Marília, a lei que permite aos supermercados cobrarem pelas sacolas foi aprovada em 2019. Portanto, a prática continuará sendo permitida, e os estabelecimentos podem seguir cobrando pelo produto.</p>`,
    image: 'https://marilianoticia.com.br/wp-content/uploads/2025/07/sacola-04-768x511.jpg',
    category: 'Cidade',
    date: '2025-07-30',
    author: 'Redação ComMarília'
  }
];

const storyCategories: StoryCategory[] = [
  {
    id: 'ultimas',
    name: 'Últimas',
    icon: mockNews[0].image,
    gradient: 'category-news',
    news: mockNews.slice(0, 3)
  },
  {
    id: 'luto',
    name: 'Luto',
    icon: mockNews[1].image,
    gradient: 'category-obituary',
    news: [mockNews[1]]
  },
  {
    id: 'cidade',
    name: 'Cidade',
    icon: mockNews[3].image,
    gradient: 'category-city',
    news: [mockNews[3]]
  },
  {
    id: 'transito',
    name: 'Trânsito',
    icon: mockNews[2].image,
    gradient: 'category-traffic',
    news: [mockNews[2]]
  }
];

// Components
const NewsCard = ({ news, onClick }: { news: NewsItem; onClick: () => void }) => (
  <div className="news-card cursor-pointer group" onClick={onClick}>
    <div className="flex items-center p-4 space-x-4">
      <img 
        className="h-24 w-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" 
        src={news.image} 
        alt={news.title}
      />
      <div className="flex-1 min-w-0">
        <div className={`uppercase tracking-wide text-xs font-semibold mb-1 ${
          news.category === 'Economia' ? 'text-[hsl(var(--news-economy))]' :
          news.category === 'Luto' ? 'text-[hsl(var(--news-obituary))]' :
          news.category === 'Cidade' ? 'text-[hsl(var(--news-city))]' :
          news.category === 'Trânsito' ? 'text-[hsl(var(--news-traffic))]' :
          'text-primary'
        }`}>
          {news.category}
        </div>
        <h3 className="text-lg leading-tight font-bold text-card-foreground mb-2 line-clamp-2">
          {news.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {news.excerpt}
        </p>
      </div>
    </div>
  </div>
);

const StoryItem = ({ category, onClick }: { category: StoryCategory; onClick: () => void }) => (
  <div className="text-center flex-shrink-0 group w-20 cursor-pointer" onClick={onClick}>
    <div className={`w-16 h-16 mx-auto p-1 rounded-full ${category.gradient} group-hover:scale-105 transition-transform duration-300`}>
      <div className="bg-white h-full w-full rounded-full flex items-center justify-center p-1">
        <img 
          className="w-full h-full object-cover rounded-full" 
          src={category.icon} 
          alt={`${category.name} stories`}
        />
      </div>
    </div>
    <span className={`text-xs font-medium mt-2 block ${
      category.id === 'ultimas' ? 'text-primary font-bold' : 'text-muted-foreground'
    }`}>
      {category.name}
    </span>
  </div>
);

export default function NewsPortal() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedStory, setSelectedStory] = useState<{ category: StoryCategory; index: number } | null>(null);
  const [likedNews, setLikedNews] = useState<Set<string>>(new Set());
  const [savedNews, setSavedNews] = useState<Set<string>>(new Set());

  const openNews = (news: NewsItem) => {
    setSelectedNews(news);
    document.body.style.overflow = 'hidden';
  };

  const closeNews = () => {
    setSelectedNews(null);
    document.body.style.overflow = '';
  };

  const openStory = (category: StoryCategory) => {
    setSelectedStory({ category, index: 0 });
    document.body.style.overflow = 'hidden';
  };

  const closeStory = () => {
    setSelectedStory(null);
    document.body.style.overflow = '';
  };

  const nextStory = () => {
    if (selectedStory && selectedStory.index < selectedStory.category.news.length - 1) {
      setSelectedStory({
        ...selectedStory,
        index: selectedStory.index + 1
      });
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (selectedStory && selectedStory.index > 0) {
      setSelectedStory({
        ...selectedStory,
        index: selectedStory.index - 1
      });
    }
  };

  const toggleLike = (newsId: string) => {
    setLikedNews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(newsId)) {
        newSet.delete(newsId);
      } else {
        newSet.add(newsId);
      }
      return newSet;
    });
  };

  const toggleSave = (newsId: string) => {
    setSavedNews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(newsId)) {
        newSet.delete(newsId);
      } else {
        newSet.add(newsId);
      }
      return newSet;
    });
  };

  const shareContent = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedNews?.title || 'ComMarília',
        text: selectedNews?.excerpt || 'Portal de notícias de Marília',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  // Auto-advance stories
  useEffect(() => {
    if (selectedStory) {
      const timer = setTimeout(nextStory, 5000);
      return () => clearTimeout(timer);
    }
  }, [selectedStory]);

  return (
    <div className="max-w-md mx-auto bg-card shadow-xl min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border bg-card">
        <h1 className="text-3xl font-bold text-gradient">
          ComMarília
        </h1>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-600">
            <User className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Stories Navigation */}
      <nav className="p-4 border-b border-border bg-card">
        <div className="flex space-x-4 overflow-x-auto no-scrollbar">
          {storyCategories.map((category) => (
            <StoryItem 
              key={category.id} 
              category={category} 
              onClick={() => openStory(category)} 
            />
          ))}
        </div>
      </nav>

      {/* News List */}
      <main className="p-4 space-y-4 bg-background">
        {mockNews.map((news) => (
          <NewsCard 
            key={news.id} 
            news={news} 
            onClick={() => openNews(news)} 
          />
        ))}
      </main>

      {/* News Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 modal-backdrop" onClick={closeNews}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl shadow-2xl max-w-md mx-auto h-[95vh] transform transition-transform duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-30 bg-muted/80 backdrop-blur-sm"
              onClick={closeNews}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="h-full overflow-y-auto no-scrollbar pt-8 p-4 pb-20">
              <img 
                src={selectedNews.image} 
                alt={selectedNews.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-bold text-card-foreground mb-4">
                {selectedNews.title}
              </h2>
              <div 
                className="text-card-foreground space-y-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedNews.content }}
              />
            </div>

            {/* Floating Action Buttons */}
            <div className="absolute bottom-4 right-4 flex flex-col space-y-3 z-30">
              <Button
                variant="ghost"
                size="sm"
                className="w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full shadow-lg hover:text-red-500"
                onClick={() => toggleLike(selectedNews.id)}
              >
                <Heart className={`h-5 w-5 ${likedNews.has(selectedNews.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full shadow-lg hover:text-blue-500"
                onClick={shareContent}
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full shadow-lg hover:text-green-600"
                onClick={() => toggleSave(selectedNews.id)}
              >
                <Bookmark className={`h-5 w-5 ${savedNews.has(selectedNews.id) ? 'fill-green-600 text-green-600' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black" onClick={closeStory}>
          <div 
            className="relative h-full w-full max-w-md mx-auto flex flex-col justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress bars */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
              {selectedStory.category.news.map((_, index) => (
                <div key={index} className="h-1 bg-white/30 rounded-full flex-1">
                  <div 
                    className={`h-1 bg-white rounded-full transition-all duration-300 ${
                      index < selectedStory.index ? 'w-full' : 
                      index === selectedStory.index ? 'progress-bar-animation' : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white z-30"
              onClick={closeStory}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Story content */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${selectedStory.category.news[selectedStory.index].image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="relative z-10 h-full w-full flex flex-col justify-end p-6 text-white">
              <Button
                variant="secondary"
                className="mb-4 bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30 self-start"
                onClick={() => {
                  closeStory();
                  setTimeout(() => openNews(selectedStory.category.news[selectedStory.index]), 300);
                }}
              >
                Matéria Completa
              </Button>
              
              <h3 className="text-2xl font-bold mb-2">
                {selectedStory.category.news[selectedStory.index].title}
              </h3>
              <p className="text-lg opacity-90">
                {selectedStory.category.news[selectedStory.index].excerpt}
              </p>

              {/* Story actions */}
              <div className="absolute right-6 bottom-6 flex flex-col space-y-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-red-400"
                  onClick={() => toggleLike(selectedStory.category.news[selectedStory.index].id)}
                >
                  <Heart className={`h-7 w-7 ${likedNews.has(selectedStory.category.news[selectedStory.index].id) ? 'fill-red-400 text-red-400' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-blue-400"
                  onClick={shareContent}
                >
                  <Share2 className="h-7 w-7" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-green-400"
                  onClick={() => toggleSave(selectedStory.category.news[selectedStory.index].id)}
                >
                  <Bookmark className={`h-7 w-7 ${savedNews.has(selectedStory.category.news[selectedStory.index].id) ? 'fill-green-400 text-green-400' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Touch areas for navigation */}
            <div className="absolute inset-0 flex z-10">
              <div className="w-1/3" onClick={prevStory} />
              <div className="w-2/3" onClick={nextStory} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}