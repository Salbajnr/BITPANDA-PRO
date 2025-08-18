
import React from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import NewsManagementPanel from '@/components/NewsManagementPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, TrendingUp, Users, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

function NewsStatsSection() {
  const { data: newsStats } = useQuery({
    queryKey: ['/api/news/analytics'],
    queryFn: async () => {
      const response = await fetch('/api/news/analytics', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch news stats');
      return response.json();
    }
  });

  const stats = {
    totalArticles: newsStats?.totalArticles || 0,
    publishedToday: newsStats?.publishedToday || 0,
    totalViews: newsStats?.totalViews || 0,
    engagementRate: newsStats?.engagementRate || 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
          <Newspaper className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalArticles}</div>
          <p className="text-xs text-muted-foreground">
            All time articles
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Published Today</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.publishedToday}</div>
          <p className="text-xs text-muted-foreground">
            Published today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Total article views
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Engagement</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.engagementRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            User engagement rate
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminNewsManagement() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    News Management
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Create and manage platform news and updates
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Newspaper className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <NewsStatsSection />

            {/* News Management Panel */}
            <NewsManagementPanel />
          </main>
        </div>
      </div>
    </div>
  );
}
