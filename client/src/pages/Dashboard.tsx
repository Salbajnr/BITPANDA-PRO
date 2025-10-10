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
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, toast, navigate]);

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

  // Mock data for demo
  const topMovers: TopMover[] = [
    {
      id: "1",
      symbol: "ZERO",
      name: "ZeroLend",
      change: 80.42,
      price: "€1.24",
      icon: "🔄",
    },
    {
      id: "2",
      symbol: "REZ",
      name: "Renzo",
      change: 54.6,
      price: "€0.58",
      icon: "🔄",
    },
    {
      id: "3",
      symbol: "COW",
      name: "CoW Protocol",
      change: 32.0,
      price: "€2.14",
      icon: "🔄",
    },
    {
      id: "4",
      symbol: "BTC",
      name: "Bitcoin",
      change: -5.23,
      price: "€67,432",
      icon: "₿",
    },
    {
      id: "5",
      symbol: "ETH",
      name: "Ethereum",
      change: -2.14,
      price: "€3,421",
      icon: "Ξ",
    },
  ];

  const portfolioValue = portfolioData?.portfolio?.totalValue || "13.36";
  const portfolioChange = -1.69; // Mock percentage change
  const availableBalance = portfolioData?.portfolio?.availableCash || "0.00";
  const winners = topMovers.filter((m) => m.change > 0);
  const losers = topMovers.filter((m) => m.change < 0);

  return (
    <DashboardLayout showTicker={true}>
      {/* Status Bar */}
      <div className="h-8 flex items-center justify-end px-4 py-2">
        <div className="flex space-x-2">
          <span className="text-xs">📶</span>
          <span className="text-xs">🔋</span>
          <span className="text-xs">9:41</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20">
        {/* Header */}
        <div className="px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Bitcoin</h1>
            <div className="w-10 h-10 bg-[#f7931a] rounded-full flex items-center justify-center text-white font-bold">
              ₿
            </div>
          </div>

          {/* Price Display */}
          <div className="text-center mb-8">
            <div className="text-4xl font-bold mb-2">102.326,25 €</div>
            <div className="flex justify-center items-center space-x-2 text-green-500">
              <ArrowUp className="h-4 w-4" />
              <span>0,89% +1.152,00 € (1D)</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="px-4 mb-6">
          <div className="h-40 bg-gray-100 rounded-lg relative">
            <svg
              viewBox="0 0 100 30"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <polyline
                points="0,20 5,18 10,22 15,19 20,21 25,17 30,23 35,20 40,25 45,22 50,28 55,24 60,30 65,27 70,25 75,29 80,26 85,28 90,30 95,27 100,25"
                stroke="#00d395"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>101.200,22 €</span>
              <span>102.326,25 €</span>
            </div>
          </div>
        </div>

        {/* Time Selector */}
        <div className="flex justify-around border-b mb-6 px-4">
          {["1D", "7D", "30D", "6M", "1Y", "Max"].map((period) => (
            <button
              key={period}
              className={`py-2 text-sm ${activeTab === period.toLowerCase() ? "text-black border-b-2 border-green-500" : "text-gray-400"}`}
              onClick={() =>
                setActiveTab(period.toLowerCase() as "winners" | "losers")
              }
            >
              {period}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-4 px-4 mb-8">
          {[
            {
              icon: <Plus className="h-6 w-6" />,
              label: "Buy",
              color: "bg-green-500",
            },
            {
              icon: <RefreshCw className="h-6 w-6" />,
              label: "Swap",
              color: "bg-gray-800",
            },
            {
              icon: <Minus className="h-6 w-6" />,
              label: "Sell",
              color: "bg-red-500",
            },
            {
              icon: <span className="text-xl">⋯</span>,
              label: "More",
              color: "bg-gray-300",
            },
          ].map((action, index) => (
            <Link
              key={index}
              to={
                action.label === "Buy"
                  ? "/deposits"
                  : action.label === "Sell"
                    ? "/withdrawals"
                    : action.label === "Swap"
                      ? "/trading"
                      : "#"
              }
              className="flex flex-col items-center"
            >
              <div
                className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mb-1`}
              >
                {action.icon}
              </div>
              <span className="text-xs">{action.label}</span>
            </Link>
          ))}
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

        {/* Top Movers */}
        <div className="bg-white dark:bg-slate-900 m-4 rounded-xl shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Top Movers in 1 Day
            </h3>
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "winners" | "losers")
              }
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="winners" data-testid="tab-winners">
                  Winners
                </TabsTrigger>
                <TabsTrigger value="losers" data-testid="tab-losers">
                  Losers
                </TabsTrigger>
              </TabsList>
              <TabsContent value="winners">
                <div className="space-y-3">
                  {winners.map((mover) => (
                    <div
                      key={mover.id}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      data-testid={`mover-card-${mover.symbol}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#00cc88]/10 rounded-full flex items-center justify-center">
                          <span className="text-lg">{mover.icon}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {mover.symbol}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {mover.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {mover.price}
                        </p>
                        <p className="text-sm text-[#00cc88] flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />+{mover.change}
                          %
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="losers">
                <div className="space-y-3">
                  {losers.map((mover) => (
                    <div
                      key={mover.id}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      data-testid={`mover-card-${mover.symbol}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                          <span className="text-lg">{mover.icon}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {mover.symbol}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {mover.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {mover.price}
                        </p>
                        <p className="text-sm text-red-500 flex items-center">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          {mover.change}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </DashboardLayout>
  );
}
