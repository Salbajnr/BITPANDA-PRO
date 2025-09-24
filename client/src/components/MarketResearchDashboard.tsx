
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
  author: string;
  publishedAt: string;
  category: string;
  premium: boolean;
  downloadUrl?: string;
  readTime: number;
  rating: number;
  views: number;
  tags: string[];
  summary: string;
  keyFindings: string[];
  recommendations: string[];
}

interface AnalystInsight {
  id: string;
  analyst: {
    name: string;
    title: string;
    firm: string;
    rating: number;
    photo: string;
  };
  title: string;
  content: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  priceTarget?: number;
  timeHorizon: string;
  publishedAt: string;
  likes: number;
  comments: number;
  assets: string[];
}

interface LiveCommentary {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  author: string;
  priority: 'high' | 'medium' | 'low';
  assets: string[];
  impact: 'positive' | 'negative' | 'neutral';
}

interface Podcast {
  id: string;
  title: string;
  description: string;
  host: string;
  duration: number;
  publishedAt: string;
  audioUrl: string;
  thumbnail: string;
  category: string;
  episode: number;
  season: number;
  guests?: string[];
  transcript?: string;
  keyTopics: string[];
}

export default function MarketResearchDashboard() {
  const [reports, setReports] = useState<MarketReport[]>([]);
  const [insights, setInsights] = useState<AnalystInsight[]>([]);
  const [liveCommentary, setLiveCommentary] = useState<LiveCommentary[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketData();
    
    // Simulate live commentary updates
    const interval = setInterval(fetchLiveCommentary, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      // Mock data - replace with actual API calls
      setReports([
        {
          id: '1',
          title: 'Q4 2024 Cryptocurrency Market Outlook',
          description: 'Comprehensive analysis of market trends, institutional adoption, and regulatory developments',
          author: 'Dr. Sarah Chen',
          publishedAt: new Date().toISOString(),
          category: 'Market Analysis',
          premium: true,
          readTime: 15,
          rating: 4.8,
          views: 2341,
          tags: ['Bitcoin', 'Ethereum', 'Institutional', 'Regulation'],
          summary: 'The cryptocurrency market is positioned for significant growth in Q4 2024, driven by institutional adoption and clearer regulatory frameworks.',
          keyFindings: [
            'Institutional adoption increased by 300% in 2024',
            'Bitcoin correlation with traditional assets decreased to 0.2',
            'DeFi TVL expected to reach $500B by year-end'
          ],
          recommendations: [
            'Increase allocation to blue-chip cryptocurrencies',
            'Monitor regulatory developments closely',
            'Consider DeFi exposure through established protocols'
          ]
        },
        {
          id: '2',
          title: 'DeFi Protocol Analysis: Yield Opportunities',
          description: 'In-depth research on current DeFi yield farming opportunities and risk assessment',
          author: 'Michael Rodriguez',
          publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'DeFi Research',
          premium: false,
          readTime: 12,
          rating: 4.6,
          views: 1829,
          tags: ['DeFi', 'Yield Farming', 'Risk Management'],
          summary: 'Current DeFi protocols offer attractive yields, but careful risk assessment is crucial for sustainable returns.',
          keyFindings: [
            'Average DeFi yields range from 5-15% APY',
            'Smart contract risks remain primary concern',
            'Liquidity provision shows most consistent returns'
          ],
          recommendations: [
            'Diversify across multiple protocols',
            'Monitor TVL and audit status',
            'Start with established platforms'
          ]
        }
      ]);

      setInsights([
        {
          id: '1',
          analyst: {
            name: 'Elena Vasquez',
            title: 'Chief Crypto Strategist',
            firm: 'BlockCapital Research',
            rating: 4.9,
            photo: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=100'
          },
          title: 'Bitcoin Breaking Key Resistance at $68,000',
          content: 'Technical analysis suggests Bitcoin is forming a bullish pennant pattern with strong volume confirmation. The break above $68,000 could signal the start of the next major leg up.',
          sentiment: 'bullish',
          confidence: 85,
          priceTarget: 78000,
          timeHorizon: '3 months',
          publishedAt: new Date().toISOString(),
          likes: 234,
          comments: 67,
          assets: ['Bitcoin']
        },
        {
          id: '2',
          analyst: {
            name: 'James Patterson',
            title: 'Senior Market Analyst',
            firm: 'CryptoFund Analytics',
            rating: 4.7,
            photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
          },
          title: 'Ethereum 2.0 Staking Yields Attracting Institutions',
          content: 'With staking yields stabilizing around 4-5% and increasing institutional demand, Ethereum presents a compelling risk-adjusted return profile.',
          sentiment: 'bullish',
          confidence: 78,
          timeHorizon: '6 months',
          publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          likes: 189,
          comments: 42,
          assets: ['Ethereum']
        }
      ]);

      setPodcasts([
        {
          id: '1',
          title: 'Crypto Market Weekly: ETF Approvals and Market Impact',
          description: 'Discussion on recent ETF approvals and their long-term impact on cryptocurrency adoption',
          host: 'Alex Thompson',
          duration: 2340, // seconds
          publishedAt: new Date().toISOString(),
          audioUrl: '#',
          thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300',
          category: 'Market Analysis',
          episode: 156,
          season: 3,
          guests: ['Dr. Sarah Chen', 'Michael Rodriguez'],
          keyTopics: ['ETF Approvals', 'Institutional Adoption', 'Market Trends']
        },
        {
          id: '2',
          title: 'DeFi Deep Dive: Protocol Revenue and Sustainability',
          description: 'Analyzing the revenue models of major DeFi protocols and their long-term sustainability',
          host: 'Maria Santos',
          duration: 1890,
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          audioUrl: '#',
          thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300',
          category: 'DeFi',
          episode: 89,
          season: 2,
          guests: ['Elena Vasquez'],
          keyTopics: ['DeFi Protocols', 'Revenue Models', 'Tokenomics']
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching market data:', error);
      setLoading(false);
    }
  };

  const fetchLiveCommentary = async () => {
    // Simulate live commentary updates
    const newCommentary: LiveCommentary = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      title: 'Bitcoin Volume Spike Detected',
      content: 'Unusual trading volume detected in Bitcoin markets. 24h volume up 45% from average.',
      author: 'Market Monitor',
      priority: 'high',
      assets: ['Bitcoin'],
      impact: 'positive'
    };

    setLiveCommentary(prev => [newCommentary, ...prev.slice(0, 9)]);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-600 bg-green-100';
      case 'bearish': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'border-l-green-500 bg-green-50';
      case 'negative': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const togglePodcast = (podcastId: string) => {
    setCurrentlyPlaying(currentlyPlaying === podcastId ? null : podcastId);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Market Research & News
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Expert analysis, live commentary, and exclusive research reports
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search reports, insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Live Market Commentary */}
        <Card className="mb-8 border-l-4 border-l-blue-500">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Live Market Commentary
              </CardTitle>
              <Badge variant="outline" className="animate-pulse">
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {liveCommentary.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-3 rounded-lg border-l-4 ${getImpactColor(comment.impact)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{comment.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{comment.content}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(comment.timestamp).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span>{comment.author}</span>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${comment.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}
                    >
                      {comment.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Research Reports
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Analyst Insights
            </TabsTrigger>
            <TabsTrigger value="podcasts" className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              Podcasts
            </TabsTrigger>
            <TabsTrigger value="commentary" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Live Commentary
            </TabsTrigger>
          </TabsList>

          {/* Research Reports */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{report.title}</CardTitle>
                        <CardDescription>{report.description}</CardDescription>
                      </div>
                      {report.premium && (
                        <Badge className="bg-yellow-500 hover:bg-yellow-500">
                          <Award className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center gap-4">
                          <span>By {report.author}</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{report.readTime} min read</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{report.views}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{report.rating}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {report.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-sm text-slate-600">{report.summary}</p>

                      <div className="flex items-center justify-between pt-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <BookOpen className="h-4 w-4 mr-2" />
                              Read Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{report.title}</DialogTitle>
                              <DialogDescription>
                                {report.description}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-semibold mb-2">Key Findings</h4>
                                <ul className="space-y-1">
                                  {report.keyFindings.map((finding, index) => (
                                    <li key={index} className="text-sm flex items-start gap-2">
                                      <Target className="h-3 w-3 mt-1 text-blue-600 shrink-0" />
                                      {finding}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Recommendations</h4>
                                <ul className="space-y-1">
                                  {report.recommendations.map((rec, index) => (
                                    <li key={index} className="text-sm flex items-start gap-2">
                                      <Star className="h-3 w-3 mt-1 text-green-600 shrink-0" />
                                      {rec}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button size="sm" disabled={report.premium}>
                          <Download className="h-4 w-4 mr-2" />
                          {report.premium ? 'Premium Only' : 'Download PDF'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analyst Insights */}
          <TabsContent value="insights">
            <div className="space-y-6">
              {insights.map((insight) => (
                <Card key={insight.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={insight.analyst.photo}
                        alt={insight.analyst.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{insight.title}</h3>
                            <div className="text-sm text-slate-600">
                              <span className="font-medium">{insight.analyst.name}</span>
                              <span className="mx-1">•</span>
                              <span>{insight.analyst.title}</span>
                              <span className="mx-1">•</span>
                              <span>{insight.analyst.firm}</span>
                            </div>
                          </div>
                          <Badge className={getSentimentColor(insight.sentiment)}>
                            {insight.sentiment}
                          </Badge>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300 mb-4">{insight.content}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            <span>Confidence: {insight.confidence}%</span>
                          </div>
                          {insight.priceTarget && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              <span>Target: ${insight.priceTarget.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{insight.timeHorizon}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {insight.assets.map((asset) => (
                              <Badge key={asset} variant="outline" className="text-xs">
                                {asset}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>{insight.likes} likes</span>
                            <span>{insight.comments} comments</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Podcasts */}
          <TabsContent value="podcasts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {podcasts.map((podcast) => (
                <Card key={podcast.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={podcast.thumbnail}
                        alt={podcast.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Button
                        size="sm"
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
                        onClick={() => togglePodcast(podcast.id)}
                      >
                        {currentlyPlaying === podcast.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{podcast.title}</h3>
                          <p className="text-sm text-slate-600">
                            Season {podcast.season} • Episode {podcast.episode}
                          </p>
                        </div>
                        <Badge variant="secondary">{podcast.category}</Badge>
                      </div>

                      <p className="text-sm text-slate-600 mb-4">{podcast.description}</p>

                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Volume2 className="h-3 w-3" />
                          <span>{formatDuration(podcast.duration)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{podcast.host}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(podcast.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {podcast.guests && podcast.guests.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-1">Guests:</p>
                          <div className="flex flex-wrap gap-1">
                            {podcast.guests.map((guest) => (
                              <Badge key={guest} variant="outline" className="text-xs">
                                {guest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1 mb-4">
                        {podcast.keyTopics.map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Transcript
                        </Button>
                        <Button size="sm" onClick={() => togglePodcast(podcast.id)}>
                          {currentlyPlaying === podcast.id ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Play
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Live Commentary Tab */}
          <TabsContent value="commentary">
            <Card>
              <CardHeader>
                <CardTitle>Real-Time Market Commentary</CardTitle>
                <CardDescription>
                  Live updates and analysis from our research team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liveCommentary.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-lg border-l-4 ${getImpactColor(comment.impact)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{comment.title}</h4>
                          <p className="text-slate-600 mb-3">{comment.content}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(comment.timestamp).toLocaleString()}</span>
                            </div>
                            <span>•</span>
                            <span>{comment.author}</span>
                            <span>•</span>
                            <div className="flex gap-1">
                              {comment.assets.map((asset) => (
                                <Badge key={asset} variant="outline" className="text-xs">
                                  {asset}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`${comment.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}
                        >
                          {comment.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
