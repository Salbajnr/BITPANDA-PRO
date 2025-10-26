
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  Newspaper,
  ArrowRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Link } from 'wouter';
import { newsApi } from '@/services/newsApi';

interface FetchStatus {
  success: boolean;
  source: 'bitpanda-blog' | 'fallback';
  lastFetch: string;
  articlesCount: number;
  error?: string;
}

interface NewsWidgetProps {
  limit?: number;
  showHeader?: boolean;
  category?: string;
}

export default function NewsWidget({ 
  limit = 5, 
  showHeader = true, 
  category = 'all' 
}: NewsWidgetProps) {
  const { data: newsData, isLoading } = useQuery({
    queryKey: ['widget-crypto-news', category, limit],
    queryFn: () => newsApi.getCryptoNews(category, limit),
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });

  const { data: fetchStatus } = useQuery<FetchStatus>({
    queryKey: ['news-fetch-status'],
    queryFn: async () => {
      const response = await fetch('/api/news/status');
      if (!response.ok) throw new Error('Failed to fetch status');
      return response.json();
    },
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'negative': return <TrendingDown className="h-3 w-3 text-red-600" />;
      default: return <Newspaper className="h-3 w-3 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-800">
        {showHeader && (
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-blue-600" />
                Latest News
              </CardTitle>
              <div className="animate-pulse h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-4">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      {showHeader && (
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Newspaper className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Latest News
            </CardTitle>
            <Link to="/news">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                View All
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <CardDescription className="flex items-center gap-2">
            <span>Stay updated with crypto market developments</span>
            {fetchStatus && (
              <Badge 
                variant={fetchStatus.success ? "default" : "secondary"} 
                className={`text-xs ${fetchStatus.success ? 'bg-green-600' : 'bg-orange-500'}`}
              >
                {fetchStatus.success ? (
                  <><CheckCircle2 className="h-3 w-3 mr-1" /> Bitpanda Blog</>
                ) : (
                  <><XCircle className="h-3 w-3 mr-1" /> {fetchStatus.error ? 'Error' : 'Fallback'}</>
                )}
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
      )}
      
      <CardContent className={showHeader ? "pt-0" : ""}>
        <div className="space-y-4">
          {newsData?.articles?.map((article, index) => (
            <div 
              key={article.id} 
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
              onClick={() => window.open(article.url === '#' ? `https://example.com/news/${article.id}` : article.url, '_blank')}
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-12 h-12 rounded object-cover shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=48';
                  }}
                />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  {getSentimentIcon(article.sentiment)}
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h4>
                </div>
                
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-2">
                  {article.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>{article.source.name}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(article.publishedAt)}</span>
                    </div>
                  </div>
                  
                  {article.coins && article.coins.length > 0 && (
                    <div className="flex gap-1">
                      {article.coins.slice(0, 2).map(coin => (
                        <Badge key={coin} variant="secondary" className="text-xs px-1.5 py-0.5">
                          {coin.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0" />
            </div>
          ))}
        </div>
        
        {newsData?.articles?.length === 0 && (
          <div className="text-center py-8">
            <Newspaper className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              No news articles available
            </p>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Link to="/news">
            <Button variant="outline" className="w-full">
              Read More News
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
