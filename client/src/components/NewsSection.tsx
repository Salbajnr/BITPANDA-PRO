import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  excerpt?: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  sourceUrl?: string;
}

export default function NewsSection() {
  const { data: newsArticles = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news'],
    retry: false,
  });

  // Use news from backend API only

  const displayNews = newsArticles.length > 0 ? newsArticles : fallbackNews;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest Crypto News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden animate-pulse">
                <div className="w-full h-32 bg-slate-200 dark:bg-slate-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Latest Crypto News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayNews.slice(0, 6).map((article) => (
            <article key={article.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {article.imageUrl && (
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    // Fallback to a generic crypto image if image fails to load
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200';
                  }}
                />
              )}
              <div className="p-4">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                  {article.title}
                </h4>
                {article.excerpt && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                  <Badge variant="secondary" className="text-xs">
                    {article.source}
                  </Badge>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatTimeAgo(article.publishedAt)}</span>
                  </div>
                </div>
                {article.sourceUrl && (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-xs text-primary hover:text-primary-dark"
                  >
                    Read more <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        
        {displayNews.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>No news articles available at the moment.</p>
            <p className="text-sm mt-2">Check back later for the latest crypto updates.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
