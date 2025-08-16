
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Search, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  Newspaper,
  Filter,
  Globe,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { newsApi, NewsArticle } from '@/services/newsApi';

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NewsArticle[]>([]);

  const { data: newsData, isLoading, error, refetch } = useQuery({
    queryKey: ['crypto-news', selectedCategory],
    queryFn: () => newsApi.getCryptoNews(selectedCategory, 50),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const categories = newsApi.getNewsCategories();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = await newsApi.searchNews(searchQuery);
      setSearchResults(results.articles);
    } else {
      setSearchResults([]);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return publishedDate.toLocaleDateString();
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'negative': return 'bg-red-100 text-red-700 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-3 w-3" />;
      case 'negative': return <TrendingDown className="h-3 w-3" />;
      default: return <Globe className="h-3 w-3" />;
    }
  };

  const NewsCard = ({ article }: { article: NewsArticle }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {article.urlToImage && (
            <div className="lg:w-1/3">
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 lg:h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400';
                }}
              />
            </div>
          )}
          
          <div className="lg:w-2/3 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {article.title}
              </h3>
              {article.sentiment && (
                <Badge variant="outline" className={`${getSentimentColor(article.sentiment)} flex items-center gap-1 shrink-0`}>
                  {getSentimentIcon(article.sentiment)}
                  {article.sentiment}
                </Badge>
              )}
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2">
              {article.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Newspaper className="h-3 w-3" />
                  <span>{article.source.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(article.publishedAt)}</span>
                </div>
              </div>
              
              {article.coins && article.coins.length > 0 && (
                <div className="flex gap-1">
                  {article.coins.slice(0, 3).map(coin => (
                    <Badge key={coin} variant="secondary" className="text-xs">
                      {coin.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-0"
                onClick={() => window.open(article.url === '#' ? `https://example.com/news/${article.id}` : article.url, '_blank')}
              >
                Read full article
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
              
              <Button variant="outline" size="sm">
                <ExternalLink className="h-3 w-3 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Newspaper className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Crypto News
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Stay updated with the latest cryptocurrency news and market insights
              </p>
            </div>
          </div>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search crypto news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="outline">
              <Filter className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Categories and Content */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-9 w-full mb-6 bg-white dark:bg-slate-800">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="text-xs lg:text-sm capitalize"
              >
                {category === 'all' ? 'All News' : category.replace('-', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Search Results ({searchResults.length})
              </h2>
              <div className="space-y-4">
                {searchResults.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="mt-4"
              >
                Clear Search
              </Button>
            </div>
          )}

          {/* Category Content */}
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="w-32 h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Failed to load news. Please try again.
                    </p>
                    <Button onClick={() => refetch()} variant="outline">
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Featured Article */}
                  {newsData?.articles && newsData.articles.length > 0 && (
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-blue-600 hover:bg-blue-600">Featured</Badge>
                          <Badge variant="outline">Latest</Badge>
                        </div>
                        <NewsCard article={newsData.articles[0]} />
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* News List */}
                  <div className="space-y-4">
                    {newsData?.articles?.slice(1).map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                  
                  {/* Load More */}
                  {newsData?.articles && newsData.articles.length >= 10 && (
                    <div className="text-center pt-6">
                      <Button variant="outline" size="lg">
                        Load More Articles
                        <Calendar className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
