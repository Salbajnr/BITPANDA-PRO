import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiService } from "@/lib/api";
import Navbar from "@/components/Navbar";
import {
  Wallet, TrendingUp, TrendingDown, ArrowUp, ArrowDown,
  BarChart3, PieChart, Search, Bell, ExternalLink,
  RefreshCw, DollarSign, Activity, Coins, Target,
  Clock, Calendar, Eye, Star, Plus, Minus,
  AlertTriangle, Info, Settings, Download, Share2,
  Bookmark, Filter, SortDesc, MoreVertical, Users,
  Globe, Zap, Shield, Award, TrendingDownIcon
} from "lucide-react";
import { Link } from "wouter";
import NotificationCenter from "@/components/NotificationCenter";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import CryptoTable from "@/components/CryptoTable";
import QuickStatsGrid from "@/components/QuickStatsGrid";
import NewsSection from "@/components/NewsSection";
import { LiveMarketStats } from "@/components/LiveMarketStats";
import { useRealTimePrice } from "@/hooks/useRealTimePrice";


interface PortfolioData {
  portfolio: {
    id: string;
    totalValue: string;
    availableCash: string;
    userId: string;
  };
  holdings: Array<{
    id: string;
    symbol: string;
    name: string;
    amount: string;
    averagePurchasePrice: string;
    currentPrice: string;
  }>;
  transactions: Array<{
    id: string;
    type: string;
    symbol: string;
    amount: string;
    price: string;
    total: string;
    createdAt: string;
  }>;
}

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
  market_cap_rank: number;
  total_volume: number;
}

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  imageUrl?: string;
}

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState("portfolio");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [portfolioView, setPortfolioView] = useState("overview");
  const queryClient = useQueryClient();

  const { data: portfolioData, isLoading: portfolioLoading } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
    retry: false,
    enabled: !!user,
  });

  const { data: cryptoData = [], isLoading: cryptoLoading } = useQuery<CryptoData[]>({
    queryKey: ['crypto-data'],
    queryFn: async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1');
      return response.json();
    },
    refetchInterval: 30000,
  });

  const { data: newsArticles = [] } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news'],
    queryFn: async () => {
      const response = await fetch('/api/news?limit=5');
      return response.json();
    },
    refetchInterval: 60000,
  });

  // Mock watchlist data - in real app this would come from API
  const [watchlist, setWatchlist] = useState([
    { symbol: 'BTC', alertPrice: 45000, currentPrice: 43256 },
    { symbol: 'ETH', alertPrice: 2600, currentPrice: 2543 },
    { symbol: 'ADA', alertPrice: 0.60, currentPrice: 0.52 }
  ]);

  // Trading mutation
  // Get symbols from holdings for real-time prices
  const holdingSymbols = portfolioData?.holdings?.map(h => h.symbol) || [];
  const { prices: realTimePrices, getPrice, isConnected } = useRealTimePrice(holdingSymbols);

  // Calculate real performance metrics with holdings data
  const calculatePortfolioMetrics = () => {
    if (!portfolioData?.holdings || portfolioData.holdings.length === 0) {
      return {
        dailyChange: 0,
        dailyChangePercent: 0,
        weeklyChange: 0,
        monthlyChange: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0
      };
    }

    let totalCurrentValue = 0;
    let totalInvestedValue = 0;
    
    portfolioData.holdings.forEach(holding => {
      const currentValue = parseFloat(holding.amount) * parseFloat(holding.currentPrice);
      const investedValue = parseFloat(holding.amount) * parseFloat(holding.averagePurchasePrice);
      
      totalCurrentValue += currentValue;
      totalInvestedValue += investedValue;
    });

    const totalGainLoss = totalCurrentValue - totalInvestedValue;
    const totalGainLossPercent = totalInvestedValue > 0 ? (totalGainLoss / totalInvestedValue) * 100 : 0;
    
    // Simulate daily/weekly/monthly changes based on current performance
    const dailyChange = totalCurrentValue * (Math.random() * 0.06 - 0.03); // -3% to +3%
    const dailyChangePercent = totalCurrentValue > 0 ? (dailyChange / totalCurrentValue) * 100 : 0;
    const weeklyChange = totalCurrentValue * (Math.random() * 0.15 - 0.05); // -5% to +10%
    const monthlyChange = totalCurrentValue * (Math.random() * 0.25 - 0.05); // -5% to +20%

    return {
      dailyChange,
      dailyChangePercent,
      weeklyChange,
      monthlyChange,
      totalGainLoss,
      totalGainLossPercent
    };
  };

  const tradeMutation = useMutation({
    mutationFn: async (data: { symbol: string; type: 'buy' | 'sell'; amount: number }) => {
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      toast({
        title: "Trade Executed",
        description: "Your trade has been successfully executed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, authLoading, toast]);

  if (authLoading || portfolioLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading BITPANDA PRO dashboard...</p>
        </div>
      </div>
    );
  }

  const totalPortfolioValue = portfolioData?.portfolio?.totalValue ?
    parseFloat(portfolioData.portfolio.totalValue) : 0;
  const availableCash = portfolioData?.portfolio?.availableCash ?
    parseFloat(portfolioData.portfolio.availableCash) : 0;
  const investedValue = totalPortfolioValue - availableCash;
  
  // Calculate portfolio metrics
  const portfolioMetrics = calculatePortfolioMetrics();
  const dailyChange = portfolioMetrics.dailyChange;
  const weeklyChange = portfolioMetrics.weeklyChange;
  const monthlyChange = portfolioMetrics.monthlyChange;

  // Generate mock chart data based on timeframe
  const getChartData = (timeframe: string) => {
    const dataPoints = timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
    const baseValue = totalPortfolioValue;
    return Array.from({ length: dataPoints }, (_, i) => ({
      time: timeframe === '24h' ? `${i}:00` : timeframe === '7d' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] : `Day ${i + 1}`,
      value: baseValue * (0.9 + Math.random() * 0.2)
    }));
  };

  const chartData = getChartData(selectedTimeframe);
  const maxValue = Math.max(...chartData.map(d => d.value));

  const filteredCrypto = cryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate portfolio allocation
  const portfolioAllocation = portfolioData?.holdings?.map(holding => {
    const value = parseFloat(holding.amount) * parseFloat(holding.currentPrice);
    const percentage = (value / investedValue) * 100;
    return {
      symbol: holding.symbol,
      name: holding.name,
      value,
      percentage,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };
  }) || [];

  const sidebarItems = [
    { id: "portfolio", label: "Portfolio Overview", icon: Wallet },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "transactions", label: "Transactions", icon: Activity },
    { id: "market", label: "Market Analysis", icon: BarChart3 },
    { id: "watchlist", label: "Watchlist", icon: Eye },
    { id: "news", label: "News & Insights", icon: Globe },
    { id: "account", label: "Account Settings", icon: Settings },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300 min-h-screen">
      {/* Floating Crypto Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-16 h-16 opacity-10 animate-bounce" style={{animationDelay: '0.5s'}}>
          <div className="w-full h-full bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">₿</span>
          </div>
        </div>
        <div className="absolute top-[25%] right-[10%] w-12 h-12 opacity-10 animate-bounce" style={{animationDelay: '1.5s'}}>
          <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">Ξ</span>
          </div>
        </div>
        <div className="absolute top-[60%] left-[15%] w-10 h-10 opacity-10 animate-bounce" style={{animationDelay: '2.5s'}}>
          <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
        </div>
        <div className="absolute top-[40%] right-[25%] w-8 h-8 opacity-10 animate-bounce" style={{animationDelay: '3s'}}>
          <div className="w-full h-full bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
        </div>
      </div>

      <Navbar />

      <div className="flex h-screen pt-16 relative z-10">
        {/* Enhanced Sidebar */}
        <div className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-green-600 flex items-center justify-center">
                <img src="/client/src/assets/logo.jpeg" alt="BITPANDA PRO" className="w-8 h-8 rounded-lg" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">BITPANDA PRO</span>
                <div className="text-sm text-slate-500 dark:text-slate-400">Professional Trading</div>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-green-600 flex items-center justify-center">
                  <span className="text-white font-bold">{user?.firstName?.charAt(0) || 'U'}</span>
                </div>
                <div className="ml-3">
                  <div className="font-medium text-slate-900 dark:text-white text-sm">
                    {user?.firstName || 'User'} {user?.lastName || ''}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Portfolio: ${totalPortfolioValue.toLocaleString()}
                  </div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 text-xs">Pro</Badge>
            </div>
          </div>

          <div className="flex-1 py-4">
            <nav className="space-y-1 px-4">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                      activeSection === item.id
                        ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Stats in Sidebar */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 dark:text-slate-400">24h Change</span>
                <span className="text-xs text-green-600 font-medium">+${dailyChange.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 dark:text-slate-400">Active Positions</span>
                <span className="text-xs text-slate-900 dark:text-white font-medium">{portfolioData?.holdings?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Header with Actions */}
          <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {activeSection === "portfolio" && "Portfolio Overview"}
                  {activeSection === "performance" && "Performance Analytics"}
                  {activeSection === "transactions" && "Transaction History"}
                  {activeSection === "market" && "Market Analysis"}
                  {activeSection === "watchlist" && "Watchlist"}
                  {activeSection === "news" && "News & Market Insights"}
                  {activeSection === "account" && "Account Settings"}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Welcome back, {user?.firstName || 'Trader'}! Here's your trading overview.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <NotificationCenter />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Portfolio Overview Section */}
            {activeSection === "portfolio" && (
              <div className="space-y-6">
                {/* Live Market Stats */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Live Market Overview</h2>
                    <Badge variant="default" className="bg-green-600">
                      <Activity className="h-4 w-4 mr-2" />
                      Real-time
                    </Badge>
                  </div>
                  <LiveMarketStats />
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 mb-2">Total Balance</div>
                          <div className="text-3xl font-bold text-slate-900 dark:text-white">
                            ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center text-sm text-green-600">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              <span>{dailyChangePercent.toFixed(1)}% today</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary/20 to-green-500/20 flex items-center justify-center">
                          <Wallet className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-green-500"></div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 mb-2">Available Cash</div>
                          <div className="text-3xl font-bold text-slate-900 dark:text-white">
                            ${availableCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="mt-2">
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              Ready to invest
                            </div>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500/20 to-blue-500/20 flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 mb-2">24h P&L</div>
                          <div className={`text-3xl font-bold ${portfolioMetrics.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {portfolioMetrics.dailyChange >= 0 ? '+' : ''}${Math.abs(portfolioMetrics.dailyChange).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="mt-2">
                            <div className={`flex items-center text-sm ${portfolioMetrics.dailyChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {portfolioMetrics.dailyChangePercent >= 0 ? 
                                <TrendingUp className="h-4 w-4 mr-1" /> : 
                                <TrendingDown className="h-4 w-4 mr-1" />
                              }
                              <span>{portfolioMetrics.dailyChangePercent >= 0 ? '+' : ''}{portfolioMetrics.dailyChangePercent.toFixed(2)}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 mb-2">Total P&L</div>
                          <div className={`text-3xl font-bold ${portfolioMetrics.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {portfolioMetrics.totalGainLoss >= 0 ? '+' : ''}${Math.abs(portfolioMetrics.totalGainLoss).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="mt-2">
                            <div className={`flex items-center text-sm ${portfolioMetrics.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {portfolioMetrics.totalGainLossPercent >= 0 ? 
                                <TrendingUp className="h-4 w-4 mr-1" /> : 
                                <TrendingDown className="h-4 w-4 mr-1" />
                              }
                              <span>{portfolioMetrics.totalGainLossPercent >= 0 ? '+' : ''}{portfolioMetrics.totalGainLossPercent.toFixed(2)}%</span>
                            </div>
                          </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl ${portfolioMetrics.totalGainLoss >= 0 ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-r from-red-500/20 to-pink-500/20'} flex items-center justify-center`}>
                          {portfolioMetrics.totalGainLoss >= 0 ? 
                            <TrendingUp className="h-6 w-6 text-green-500" /> : 
                            <TrendingDown className="h-6 w-6 text-red-500" />
                          }
                        </div>
                      </div>
                      <div className={`absolute bottom-0 left-0 right-0 h-1 ${portfolioMetrics.totalGainLoss >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'}`}></div>
                    </CardContent>
                  </Card>
                </div>

                {/* Portfolio Chart and Allocation */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Portfolio Performance</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={selectedTimeframe === '24h' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTimeframe('24h')}
                          >
                            24H
                          </Button>
                          <Button
                            variant={selectedTimeframe === '7d' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTimeframe('7d')}
                          >
                            7D
                          </Button>
                          <Button
                            variant={selectedTimeframe === '30d' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTimeframe('30d')}
                          >
                            30D
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{ 'my3dChart': { color: '#FF5733' } }}>
                        <ResponsiveContainer width="100%" height={400}>
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="var(--color-my3dChart)" strokeDasharray="5 5" strokeWidth={3} />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {portfolioAllocation.slice(0, 5).map((asset) => (
                          <div key={asset.symbol} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className="w-4 h-4 rounded-full mr-3"
                                style={{ backgroundColor: asset.color }}
                              ></div>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white text-sm">{asset.symbol}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{asset.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-slate-900 dark:text-white text-sm font-medium">
                                {asset.percentage.toFixed(1)}%
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                ${asset.value.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                        {portfolioAllocation.length === 0 && (
                          <div className="text-center py-8">
                            <PieChart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <div className="text-slate-500 dark:text-slate-400 text-sm">
                              No holdings yet. Start trading to see your allocation.
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions Grid */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      <Link href="/trading-pro">
                        <Button variant="outline" className="h-24 flex flex-col items-center group hover:border-primary">
                          <Activity className="h-6 w-6 mb-2 text-primary group-hover:scale-110 transition-transform" />
                          <span className="text-sm">Trade Now</span>
                        </Button>
                      </Link>
                      <div className="flex space-x-4">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3"
                          onClick={() => window.location.href = '/deposit'}
                        >
                          <Plus className="mr-2 h-5 w-5" />
                          Deposit Funds
                        </Button>
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-3"
                        >
                          <Plus className="mr-2 h-5 w-5" />
                          Start Trading
                        </Button>
                      </div>
                      <Button variant="outline" className="h-24 flex flex-col items-center group hover:border-yellow-500">
                        <ArrowUp className="h-6 w-6 mb-2 text-yellow-500 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">Withdraw</span>
                      </Button>
                      <Link href="/analytics">
                        <Button variant="outline" className="h-24 flex flex-col items-center group hover:border-blue-500">
                          <BarChart3 className="h-6 w-6 mb-2 text-blue-500 group-hover:scale-110 transition-transform" />
                          <span className="text-sm">Analytics</span>
                        </Button>
                      </Link>
                      <Button variant="outline" className="h-24 flex flex-col items-center group hover:border-purple-500">
                        <Star className="h-6 w-6 mb-2 text-purple-500 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">Watchlist</span>
                      </Button>
                      <Button variant="outline" className="h-24 flex flex-col items-center group hover:border-orange-500">
                        <Bell className="h-6 w-6 mb-2 text-orange-500 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">Alerts</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Performance Section */}
            {activeSection === "performance" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 mb-2">7D Performance</div>
                          <div className="text-2xl font-bold text-green-600">
                            +${weeklyChange.toFixed(2)}
                          </div>
                          <div className="text-sm text-green-600">+8.7%</div>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 mb-2">30D Performance</div>
                          <div className="text-2xl font-bold text-green-600">
                            +${monthlyChange.toFixed(2)}
                          </div>
                          <div className="text-sm text-green-600">+15.6%</div>
                        </div>
                        <BarChart3 className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 mb-2">Best Performer</div>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {portfolioData?.holdings?.[0]?.symbol || 'N/A'}
                          </div>
                          <div className="text-sm text-green-600">+24.3%</div>
                        </div>
                        <Award className="h-8 w-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Performance Charts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Performance Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="assets">By Asset</TabsTrigger>
                        <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
                        <TabsTrigger value="comparison">Comparison</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Sharpe Ratio</h4>
                            <div className="text-2xl font-bold text-green-600">1.85</div>
                            <div className="text-sm text-slate-500">Excellent</div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Max Drawdown</h4>
                            <div className="text-2xl font-bold text-red-600">-8.2%</div>
                            <div className="text-sm text-slate-500">Low risk</div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="assets">
                        <div className="space-y-4">
                          {portfolioData?.holdings?.map((holding) => (
                            <div key={holding.id} className="flex justify-between items-center p-4 border rounded-lg">
                              <div>
                                <div className="font-medium">{holding.symbol}</div>
                                <div className="text-sm text-slate-500">{holding.name}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-green-600 font-medium">+12.4%</div>
                                <div className="text-sm text-slate-500">This month</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Watchlist Section */}
            {activeSection === "watchlist" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Your Watchlist</CardTitle>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Asset
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {watchlist.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <span className="text-primary text-xs font-bold">{item.symbol.substring(0, 2)}</span>
                            </div>
                            <div>
                              <div className="font-medium">{item.symbol}</div>
                              <div className="text-sm text-slate-500">Alert: ${item.alertPrice}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${item.currentPrice}</div>
                            <Badge variant={item.currentPrice > item.alertPrice ? "default" : "destructive"}>
                              {item.currentPrice > item.alertPrice ? 'Above' : 'Below'} target
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* News Section */}
            {activeSection === "news" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Latest Market News</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {newsArticles.length > 0 ? newsArticles.map((article) => (
                        <div key={article.id} className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900 dark:text-white mb-2">{article.title}</h4>
                              <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{article.content.substring(0, 150)}...</p>
                              <div className="flex items-center text-xs text-slate-500">
                                <Badge variant="outline" className="mr-2">{article.category}</Badge>
                                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-8">
                          <Globe className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                          <div className="text-slate-500 dark:text-slate-400">No news articles available</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Market Analysis Section */}
            {activeSection === "market" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Market Overview</CardTitle>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <Input
                            placeholder="Search assets..."
                            className="pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {cryptoLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-center space-x-4 animate-pulse">
                            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                              <th className="pb-3 font-medium">Rank</th>
                              <th className="pb-3 font-medium">Asset</th>
                              <th className="pb-3 font-medium">Price</th>
                              <th className="pb-3 font-medium">24h Change</th>
                              <th className="pb-3 font-medium">Market Cap</th>
                              <th className="pb-3 font-medium">Volume</th>
                              <th className="pb-3 text-right font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCrypto.slice(0, 15).map((crypto) => (
                              <tr key={crypto.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                                <td className="py-4">
                                  <div className="font-medium text-slate-500">#{crypto.market_cap_rank}</div>
                                </td>
                                <td className="py-4">
                                  <div className="flex items-center">
                                    <img
                                      src={crypto.image}
                                      alt={crypto.name}
                                      className="w-8 h-8 rounded-full mr-3"
                                      onError={(e) => {
                                        e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="%23e5e7eb"/></svg>`;
                                      }}
                                    />
                                    <div>
                                      <div className="font-medium text-slate-900 dark:text-white">{crypto.name}</div>
                                      <div className="text-sm text-slate-500 dark:text-slate-400">{crypto.symbol.toUpperCase()}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 text-slate-900 dark:text-white">
                                  ${crypto.current_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-4">
                                  <Badge
                                    variant={crypto.price_change_percentage_24h >= 0 ? "default" : "destructive"}
                                    className={crypto.price_change_percentage_24h >= 0 ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                                  >
                                    {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                                    {crypto.price_change_percentage_24h.toFixed(2)}%
                                  </Badge>
                                </td>
                                <td className="py-4 text-slate-900 dark:text-white">
                                  ${(crypto.market_cap / 1e9).toFixed(1)}B
                                </td>
                                <td className="py-4 text-slate-900 dark:text-white">
                                  ${(crypto.total_volume / 1e6).toFixed(1)}M
                                </td>
                                <td className="py-4 text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    <Button size="sm" variant="outline">
                                      <Star className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm">
                                      Trade
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Transactions Section */}
            {activeSection === "transactions" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Transaction History</CardTitle>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <Input
                            placeholder="Search transactions..."
                            className="pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                            <th className="pb-3 font-medium">Date</th>
                            <th className="pb-3 font-medium">Type</th>
                            <th className="pb-3 font-medium">Asset</th>
                            <th className="pb-3 font-medium">Amount</th>
                            <th className="pb-3 font-medium">Price</th>
                            <th className="pb-3 font-medium">Total</th>
                            <th className="pb-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {portfolioData?.transactions?.map((transaction) => (
                            <tr key={transaction.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                              <td className="py-4 text-slate-900 dark:text-white">
                                <div className="font-medium">{new Date(transaction.createdAt).toLocaleDateString()}</div>
                                <div className="text-sm text-slate-500">{new Date(transaction.createdAt).toLocaleTimeString()}</div>
                              </td>
                              <td className="py-4">
                                <Badge variant={transaction.type === 'buy' ? 'default' : 'destructive'}>
                                  {transaction.type.toUpperCase()}
                                </Badge>
                              </td>
                              <td className="py-4 text-slate-900 dark:text-white font-medium">
                                {transaction.symbol}
                              </td>
                              <td className="py-4 text-slate-900 dark:text-white">
                                {parseFloat(transaction.amount).toFixed(6)}
                              </td>
                              <td className="py-4 text-slate-900 dark:text-white">
                                ${parseFloat(transaction.price).toFixed(2)}
                              </td>
                              <td className="py-4 text-slate-900 dark:text-white font-medium">
                                ${parseFloat(transaction.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-4">
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                  Completed
                                </Badge>
                              </td>
                            </tr>
                          ))}
                          {(!portfolioData?.transactions || portfolioData.transactions.length === 0) && (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400">
                                No transactions yet. Start trading to see your activity here!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Account Settings Section */}
            {activeSection === "account" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-slate-500 dark:text-slate-400 text-sm mb-2">Full Name</label>
                        <Input
                          value={`${user?.firstName || ''} ${user?.lastName || ''}`}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 dark:text-slate-400 text-sm mb-2">Email</label>
                        <Input
                          value={user?.email || ''}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 dark:text-slate-400 text-sm mb-2">Username</label>
                        <Input
                          value={user?.username || ''}
                          disabled
                        />
                      </div>
                      <Link href="/settings">
                        <Button>Edit Profile</Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Security & Privacy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Link href="/security">
                        <Button variant="outline" className="w-full justify-start">
                          <Shield className="h-4 w-4 mr-2" />
                          <span>Security Settings</span>
                          <ExternalLink className="h-4 w-4 ml-auto" />
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        <span>Two-Factor Authentication</span>
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Zap className="h-4 w-4 mr-2" />
                        <span>API Keys</span>
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Eye className="h-4 w-4 mr-2" />
                        <span>Privacy Settings</span>
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Links Grid */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Link href="/help">
                        <Button variant="outline" className="h-20 flex flex-col items-center hover:border-blue-500">
                          <Info className="h-6 w-6 mb-2 text-blue-500" />
                          <span>Help Center</span>
                        </Button>
                      </Link>
                      <Link href="/support">
                        <Button variant="outline" className="h-20 flex flex-col items-center hover:border-green-500">
                          <Users className="h-6 w-6 mb-2 text-green-500" />
                          <span>Live Support</span>
                        </Button>
                      </Link>
                      <Link href="/kyc">
                        <Button variant="outline" className="h-20 flex flex-col items-center hover:border-yellow-500">
                          <Shield className="h-6 w-6 mb-2 text-yellow-500" />
                          <span>KYC Verification</span>
                        </Button>
                      </Link>
                      <Button variant="outline" className="h-20 flex flex-col items-center hover:border-purple-500">
                        <Download className="h-6 w-6 mb-2 text-purple-500" />
                        <span>Tax Reports</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}