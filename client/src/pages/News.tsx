import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  ExternalLink, 
  Newspaper,
  ArrowRight,
  Star
} from 'lucide-react';
import { newsApi, NewsArticle } from '@/services/newsApi';

const staticArticles = [
  {
    id: 'what-is-bitpanda',
    title: 'What is Bitpanda and how does it work?',
    description: 'Bitpanda is a digital investment platform that allows you to invest in a wide variety of assets, from cryptocurrencies and stocks to precious metals and more.',
    url: '#',
    urlToImage: '/src/assets/IMG_5553.jpeg',
    source: { name: 'Bitpanda Academy' },
    publishedAt: new Date().toISOString(),
    category: 'investing-101',
    featured: true,
  },
  {
    id: 'how-to-start-investing',
    title: 'How to start investing on Bitpanda?',
    description: 'Getting started with investing on Bitpanda is a straightforward process. This guide will walk you through the essential steps to begin your investment journey.',
    url: '#', 
    urlToImage: '/src/assets/IMG_5554.jpeg',
    source: { name: 'Bitpanda Academy' },
    publishedAt: new Date().toISOString(),
    category: 'investing-101',
    featured: true,
  },
  {
    id: 'understanding-crypto',
    title: 'Understanding Cryptocurrencies',
    description: 'A deep dive into the world of cryptocurrencies, explaining the technology behind them and their potential as an investment asset.',
    url: '#',
    urlToImage: '/src/assets/IMG_5555.jpeg',
    source: { name: 'Bitpanda Academy' },
    publishedAt: new Date().toISOString(),
    category: 'market-analysis',
  },
  {
    id: 'diversification-strategies',
    title: 'Portfolio Diversification Strategies',
    description: 'Learn how to spread your investments across various assets to reduce risk and improve potential returns.',
    url: '#',
    urlToImage: '/src/assets/IMG_5556.jpeg',
    source: { name: 'Bitpanda Academy' },
    publishedAt: new Date().toISOString(),
    category: 'pro-tips',
  }
];

export default function News() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all-news');

  const { data: newsData, isLoading, error } = useQuery({
    queryKey: ['crypto-news'],
    queryFn: () => newsApi.getCryptoNews('all', 20),
  });

  const allArticles = [...staticArticles, ...(newsData?.articles || [])];

  const filteredArticles = allArticles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const NewsCard = ({ article, isFeatured }: { article: NewsArticle; isFeatured?: boolean }) => (
    <Card className={`group hover:shadow-xl transition-all duration-300 ${isFeatured ? 'bg-secondary' : 'bg-card'}`}>
      <CardContent className="p-0">
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => { e.currentTarget.src = '/src/assets/IMG_5553.jpeg'; }}
        />
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Badge variant={isFeatured ? 'default' : 'secondary'}>{article.source.name}</Badge>
            {isFeatured && <Star className="h-5 w-5 text-yellow-400 fill-current" />}
          </div>
          <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
            {article.description}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
            <span>{formatTimeAgo(article.publishedAt)}</span>
            <Button asChild variant="ghost" size="sm" className="group-hover:text-primary">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read More <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
            News & Insights
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            Your source for the latest updates, market analysis, and educational content in the world of digital assets.
          </p>
        </header>

        {/* Search and Filter */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg rounded-full shadow-sm"
            />
          </div>
        </div>
        
        {/* Featured Articles */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Featured Reading</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {staticArticles.filter(a => a.featured).map(article => (
              <NewsCard key={article.id} article={article as NewsArticle} isFeatured />
            ))}
          </div>
        </section>

        {/* All News Section */}
        <section>
           <h2 className="text-3xl font-bold mb-6 text-center">Latest News</h2>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="w-full h-48 bg-muted rounded-t-lg"></div>
                    <CardContent className="p-6 space-y-3">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-6 bg-muted rounded w-full"></div>
                      <div className="h-12 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : error ? (
             <div className="text-center py-12">
                <p className="text-red-500">Failed to load news. Please try again later.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map(article => (
                <NewsCard key={article.id || article.title} article={article as NewsArticle} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
