import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  RefreshCw,
  DollarSign,
  Send,
  Home,
  BarChart3,
  Activity,
  Search,
  User,
  Eye,
  EyeOff,
  ChevronRight,
  ShieldCheckIcon,
  ArrowUpIcon,
  AlertCircle,
} from "lucide-react";
import { Link, useLocation, useRoute, useLocation as useNavigate } from "wouter";
import { Redirect } from "wouter";

// Get navigate function
function useNavigation() {
  const [, setLocation] = useLocation();
  return setLocation;
}

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
}

interface TopMover {
  id: string;
  symbol: string;
  name: string;
  change: number;
  price: string;
  icon: string;
}

// Bottom Navigation Component
function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { id: "/dashboard", label: "Home", icon: Home },
    { id: "/portfolio", label: "Portfolio", icon: BarChart3 },
    { id: "/trading", label: "Trade", icon: Activity },
    { id: "/markets", label: "Discover", icon: Search },
    { id: "/settings", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            location === item.id ||
            (item.id === "/dashboard" && location === "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.id}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigation();
  const [activeTab, setActiveTab] = useState<"winners" | "losers">("winners");
  const [showBalance, setShowBalance] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");
  const { data: portfolioData, isLoading: portfolioLoading } =
    useQuery<PortfolioData>({
      queryKey: ["/api/portfolio"],
      retry: false,
      enabled: !!user,
    });

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access your dashboard",
        variant: "destructive",
      });
      const timer = setTimeout(() => {
        navigate('/auth');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, toast, navigate]);

  // Redirect admin users to admin panel
  useEffect(() => {
    if (!authLoading && user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || portfolioLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="text-center max-w-md">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-[#00cc88] mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#00cc88] animate-pulse"></div>
          </div>
          <h3 className="mt-6 text-lg font-semibold text-slate-700 dark:text-slate-300">
            Loading your dashboard
          </h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Preparing your trading environment...
          </p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-[#00cc88] rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-[#00cc88] rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-[#00cc88] rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Fetch real top movers data
  const [topMovers, setTopMovers] = useState<TopMover[]>([]);
  
  useEffect(() => {
    const fetchTopMovers = async () => {
      try {
        const response = await fetch('/api/crypto/top-movers');
        if (response.ok) {
          const data = await response.json();
          setTopMovers(data);
        } else {
          throw new Error('Failed to fetch top movers');
        }
      } catch (error) {
        console.warn('Using fallback top movers data:', error);
        // Fallback data
        setTopMovers([
          { id: "1", symbol: "BTC", name: "Bitcoin", change: -5.23, price: "€67,432", icon: "₿" },
          { id: "2", symbol: "ETH", name: "Ethereum", change: -2.14, price: "€3,421", icon: "Ξ" },
          { id: "3", symbol: "SOL", name: "Solana", change: 8.42, price: "€124", icon: "◎" },
          { id: "4", symbol: "ADA", name: "Cardano", change: 4.6, price: "€0.58", icon: "₳" },
          { id: "5", symbol: "DOT", name: "Polkadot", change: 2.0, price: "€6.14", icon: "●" },
        ]);
      }
    };
    
    fetchTopMovers();
  }, []);

  const portfolioValue = portfolioData?.portfolio?.totalValue || "13.36";
  const portfolioChange = -1.69; // Mock percentage change
  const availableBalance = portfolioData?.portfolio?.availableCash || "0.00";
  const dayChange = parseFloat(portfolioValue) * (portfolioChange / 100);
  const winners = topMovers.filter((m) => m.change > 0);
  const losers = topMovers.filter((m) => m.change < 0);

  return (
    <DashboardLayout showTicker={true}>
      {/* Professional Trading Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Trading Dashboard</h1>
              <p className="text-sm text-slate-400">Real-time market overview</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Activity className="h-3 w-3 mr-1" />
                Live Markets
              </Badge>
              <div className="text-right">
                <div className="text-xs text-slate-400">Server Time</div>
                <div className="text-sm font-mono text-white">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20 bg-slate-950">
        {/* Professional Portfolio Overview */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Portfolio Value */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100 text-sm">Portfolio Value</span>
                  <Wallet className="h-4 w-4 text-blue-200" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">
                    {showBalance ? `€${portfolioValue}` : "••••••"}
                  </span>
                  <button onClick={() => setShowBalance(!showBalance)} className="text-blue-200 hover:text-white">
                    {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {portfolioChange >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-300" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-300" />
                  )}
                  <span className={`text-sm ${portfolioChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)}% (24h)
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Available Balance */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Available Cash</span>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">€{availableBalance}</div>
                <div className="text-xs text-slate-400 mt-2">Ready to trade</div>
              </CardContent>
            </Card>

            {/* Total P&L */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Total P&L</span>
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                </div>
                <div className={`text-2xl font-bold ${dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {dayChange >= 0 ? '+' : ''}€{Math.abs(dayChange).toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 mt-2">Since yesterday</div>
              </CardContent>
            </Card>

            {/* Active Positions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Active Positions</span>
                  <Activity className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {portfolioData?.holdings?.length || 0}
                </div>
                <div className="text-xs text-slate-400 mt-2">Assets held</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Professional Trading Chart */}
        <div className="px-6 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="border-b border-slate-700">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Portfolio Performance</CardTitle>
                <div className="flex items-center gap-2">
                  {["1H", "24H", "7D", "30D", "1Y"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedTimeframe(period)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        selectedTimeframe === period
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-64 bg-slate-900 rounded-lg relative overflow-hidden">
                {/* Simulated candlestick chart background */}
                <div className="absolute inset-0 flex items-end justify-around p-4">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const height = Math.random() * 80 + 20;
                    const isPositive = Math.random() > 0.5;
                    return (
                      <div
                        key={i}
                        className={`w-2 ${isPositive ? 'bg-green-500' : 'bg-red-500'} opacity-60 hover:opacity-100 transition-opacity`}
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
                {/* Price line overlay */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <polyline
                    points="0,120 50,110 100,125 150,105 200,115 250,95 300,110 350,90 400,105 450,85 500,95 550,75 600,85 650,70 700,80 750,65 800,75"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <polyline
                    points="0,120 50,110 100,125 150,105 200,115 250,95 300,110 350,90 400,105 450,85 500,95 550,75 600,85 650,70 700,80 750,65 800,75 800,300 0,300"
                    fill="url(#gradient)"
                    opacity="0.3"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-t border-slate-700/50" />
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-4 text-xs text-slate-400">
                <span>Low: €{(parseFloat(portfolioValue) * 0.95).toFixed(2)}</span>
                <span>High: €{(parseFloat(portfolioValue) * 1.05).toFixed(2)}</span>
                <span>Vol: €{(parseFloat(portfolioValue) * 2.3).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Professional Quick Actions */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/deposits">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 flex flex-col items-center gap-2">
                <Plus className="h-5 w-5" />
                <span className="text-sm font-medium">Buy Crypto</span>
              </Button>
            </Link>
            <Link to="/withdrawals">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-6 flex flex-col items-center gap-2">
                <Minus className="h-5 w-5" />
                <span className="text-sm font-medium">Sell Crypto</span>
              </Button>
            </Link>
            <Link to="/trading">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 flex flex-col items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                <span className="text-sm font-medium">Trade</span>
              </Button>
            </Link>
            <Link to="/transactions">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 flex flex-col items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm font-medium">History</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* About Section */}
        <div className="px-4 mb-8">
          <h2 className="text-lg font-semibold mb-2">About BTC</h2>
          <p className="text-sm text-gray-600 mb-2">
            Bitcoin is the most popular cryptocurrency, both in terms of
            mainstream awareness as well as buy and sell volume. It is based on
            an open-source technology and operates on a decentralized network
            using blockchain technology.
          </p>
          <button className="text-sm text-blue-500 flex items-center">
            Read more <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 px-4 mb-8">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Daily High</div>
            <div className="font-medium">102.326,25 €</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Daily Low</div>
            <div className="font-medium">101.200,22 €</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Volatility (1M)</div>
            <div className="font-medium">91%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Market Cap</div>
            <div className="font-medium">183₄ €</div>
          </div>
        </div>

        {/* Portfolio Statistics */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Portfolio Value"
              value={
                <div className="flex items-center gap-2">
                  <span>{showBalance ? `€${portfolioValue}` : "••••••"}</span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    {showBalance ? (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              }
              icon={Wallet}
              change={{
                value: `${Math.abs(portfolioChange)}%`,
                trend: portfolioChange >= 0 ? "up" : "down",
              }}
              description="24h change"
            />
            <StatCard
              title="Available Cash"
              value={`€${availableBalance}`}
              icon={DollarSign}
              description="Ready to trade"
            />
            <StatCard
              title="Active Holdings"
              value={portfolioData?.holdings?.length?.toString() || "0"}
              icon={BarChart3}
              description="Asset positions"
            />
          </div>
        </div>

        {/* Quick Trade Button */}
        <div className="px-4 mb-6">
          <Link to="/trading" className="block">
            <Button className="w-full" data-testid="trade-button">
              <Activity className="mr-2 h-4 w-4" />
              Start Trading
            </Button>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 m-4 p-6 rounded-xl shadow-sm">
          <div className="grid grid-cols-3 gap-6">
            <Link to="/deposits" className="text-center" data-testid="link-buy">
              <div className="w-16 h-16 bg-[#00cc88] rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Buy
              </p>
            </Link>
            <Link
              to="/withdrawals"
              className="text-center"
              data-testid="link-sell"
            >
              <div className="w-16 h-16 bg-[#00cc88] rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                <Minus className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Sell
              </p>
            </Link>
            <Link to="/trading" className="text-center" data-testid="link-swap">
              <div className="w-16 h-16 bg-[#00cc88] rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                <RefreshCw className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Swap
              </p>
            </Link>
          </div>
        </div>

        {/* Wallet Section */}
        <div className="bg-white dark:bg-slate-900 m-4 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Wallet
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Available Balance
              </p>
            </div>
            <Wallet className="h-6 w-6 text-[#00cc88]" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            €{availableBalance}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <Link
              to="/deposits"
              className="text-center"
              data-testid="link-deposit"
            >
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">🏛️</span>
              </div>
              <p className="text-xs font-medium text-slate-900 dark:text-white">
                Deposit
              </p>
            </Link>
            <Link
              to="/withdrawals"
              className="text-center"
              data-testid="link-withdraw"
            >
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">💸</span>
              </div>
              <p className="text-xs font-medium text-slate-900 dark:text-white">
                Withdraw
              </p>
            </Link>
            <Link to="/trading" className="text-center" data-testid="link-send">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <Send className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </div>
              <p className="text-xs font-medium text-slate-900 dark:text-white">
                Send
              </p>
            </Link>
          </div>
          <Button
            variant="outline"
            className="w-full mt-4 text-[#00cc88] border-[#00cc88] hover:bg-[#00cc88] hover:text-white"
            data-testid="button-deposit-free"
          >
            Free Deposit
          </Button>
        </div>

        {/* Promotions */}
        <div className="bg-white dark:bg-slate-900 m-4 p-6 rounded-xl shadow-sm">
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Save 20% on trading fees
              </p>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="button-trading-fees"
              >
                Get Started →
              </Button>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
                Earn up to 30% rewards by staking your assets
              </p>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                data-testid="button-staking-rewards"
              >
                Stake →
              </Button>
            </div>
          </div>
        </div>

        {/* Professional Market Movers */}
        <div className="px-6 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="border-b border-slate-700">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Market Movers (24h)</CardTitle>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Live Data
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "winners" | "losers")}>
                <TabsList className="w-full grid grid-cols-2 bg-slate-900 border-b border-slate-700 rounded-none">
                  <TabsTrigger 
                    value="winners" 
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-none"
                    data-testid="tab-winners"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Top Gainers
                  </TabsTrigger>
                  <TabsTrigger 
                    value="losers" 
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none"
                    data-testid="tab-losers"
                  >
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Top Losers
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="winners" className="m-0">
                  <div className="divide-y divide-slate-700">
                    {winners.map((mover, index) => (
                      <div
                        key={mover.id}
                        className="flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors cursor-pointer"
                        data-testid={`mover-card-${mover.symbol}`}
                        onClick={() => navigate(`/trading?symbol=${mover.symbol}`)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-slate-500 font-mono text-sm">#{index + 1}</div>
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                            {mover.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{mover.symbol}</p>
                            <p className="text-xs text-slate-400">{mover.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">{mover.price}</p>
                          <div className="flex items-center gap-1 text-green-400">
                            <TrendingUp className="h-3 w-3" />
                            <span className="text-sm font-medium">+{mover.change}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="losers" className="m-0">
                  <div className="divide-y divide-slate-700">
                    {losers.map((mover, index) => (
                      <div
                        key={mover.id}
                        className="flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors cursor-pointer"
                        data-testid={`mover-card-${mover.symbol}`}
                        onClick={() => navigate(`/trading?symbol=${mover.symbol}`)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-slate-500 font-mono text-sm">#{index + 1}</div>
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                            {mover.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{mover.symbol}</p>
                            <p className="text-xs text-slate-400">{mover.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">{mover.price}</p>
                          <div className="flex items-center gap-1 text-red-400">
                            <TrendingDown className="h-3 w-3" />
                            <span className="text-sm font-medium">{mover.change}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </DashboardLayout>
  );
}