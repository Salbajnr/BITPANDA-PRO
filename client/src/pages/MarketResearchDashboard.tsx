
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Clock, 
  Download, 
  Eye,
  Search,
  Filter,
  Star,
  Calendar,
  Headphones,
  Play,
  Pause,
  Volume2,
  ExternalLink,
  BookOpen,
  Target,
  Award,
  Zap
} from 'lucide-react';

interface MarketReport {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'fundamental' | 'sentiment' | 'macro';
  publishedAt: string;
  author: string;
  rating: number;
  downloadCount: number;
  premium: boolean;
}

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
}

const MarketResearchDashboard = () => {
  const [reports, setReports] = useState<MarketReport[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    setTimeout(() => {
      setReports([
        {
          id: '1',
          title: 'Bitcoin Technical Analysis Q1 2024',
          description: 'Comprehensive technical analysis covering key support and resistance levels',
          category: 'technical',
          publishedAt: '2024-01-15',
          author: 'John Doe',
          rating: 4.5,
          downloadCount: 1250,
          premium: false
        },
        {
          id: '2',
          title: 'Ethereum Market Sentiment Report',
          description: 'Analysis of market sentiment and investor behavior patterns',
          category: 'sentiment',
          publishedAt: '2024-01-14',
          author: 'Jane Smith',
          rating: 4.2,
          downloadCount: 890,
          premium: true
        },
        {
          id: '3',
          title: 'Macro Economic Impact on Crypto Markets',
          description: 'How global economic factors influence cryptocurrency prices',
          category: 'macro',
          publishedAt: '2024-01-13',
          author: 'Mike Johnson',
          rating: 4.8,
          downloadCount: 2100,
          premium: true
        }
      ]);

      setMarketData([
        { symbol: 'BTC', price: 43250, change24h: 2.5, volume: 18500000000, marketCap: 847000000000 },
        { symbol: 'ETH', price: 2640, change24h: -1.2, volume: 8200000000, marketCap: 317000000000 },
        { symbol: 'BNB', price: 315, change24h: 3.1, volume: 1200000000, marketCap: 47000000000 }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    return `$${num.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Market Research Dashboard</h1>
        <p className="text-muted-foreground">
          Access comprehensive market analysis, reports, and real-time data
        </p>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {marketData.map((data) => (
          <Card key={data.symbol}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{data.symbol}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{formatNumber(data.price)}</div>
                <div className={`flex items-center text-sm ${data.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {data.change24h >= 0 ? '+' : ''}{data.change24h}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Vol: {formatNumber(data.volume)}
                </div>
                <div className="text-sm text-muted-foreground">
                  MCap: {formatNumber(data.marketCap)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">Research Reports</TabsTrigger>
          <TabsTrigger value="analytics">Live Analytics</TabsTrigger>
          <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={selectedCategory === 'technical' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('technical')}
                size="sm"
              >
                Technical
              </Button>
              <Button
                variant={selectedCategory === 'fundamental' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('fundamental')}
                size="sm"
              >
                Fundamental
              </Button>
              <Button
                variant={selectedCategory === 'sentiment' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('sentiment')}
                size="sm"
              >
                Sentiment
              </Button>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant={report.premium ? 'default' : 'secondary'}>
                      {report.premium ? 'Premium' : 'Free'}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm">{report.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      {report.author}
                      <Clock className="h-4 w-4 ml-4 mr-2" />
                      {new Date(report.publishedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {report.downloadCount} downloads
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Live Market Analytics</CardTitle>
              <CardDescription>Real-time market data and analysis tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Live analytics dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="podcasts">
          <Card>
            <CardHeader>
              <CardTitle>Market Podcasts</CardTitle>
              <CardDescription>Expert discussions and market analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Headphones className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Podcast section coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
              <CardDescription>Daily market insights and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Market insights coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketResearchDashboard;
