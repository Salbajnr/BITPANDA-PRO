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
  Wallet, TrendingUp, TrendingDown, ArrowUp, ArrowDown,
  Plus, Minus, RefreshCw, DollarSign, Send, 
  Home, BarChart3, Activity, Search, User,
  Eye, EyeOff, ChevronRight, ShieldCheckIcon, ArrowUpIcon
} from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";
import { Redirect } from "wouter";

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
          const isActive = location === item.id || (item.id === "/dashboard" && location === "/");
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
  const [activeTab, setActiveTab] = useState<"winners" | "losers">("winners");
  const [showBalance, setShowBalance] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  const { data: portfolioData, isLoading: portfolioLoading } = useQuery<PortfolioData>({
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
      // Use navigate instead of window.location
      const timer = setTimeout(() => {
        window.location.href = "/auth";
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, toast]);

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
            <div className="w-2 h-2 bg-[#00cc88] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-[#00cc88] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
    { id: "1", symbol: "ZERO", name: "ZeroLend", change: 80.42, price: "€1.24", icon: "🔄" },
    { id: "2", symbol: "REZ", name: "Renzo", change: 54.60, price: "€0.58", icon: "🔄" },
    { id: "3", symbol: "COW", name: "CoW Protocol", change: 32.00, price: "€2.14", icon: "🔄" },
    { id: "4", symbol: "BTC", name: "Bitcoin", change: -5.23, price: "€67,432", icon: "₿" },
    { id: "5", symbol: "ETH", name: "Ethereum", change: -2.14, price: "€3,421", icon: "Ξ" },
  ];

  const portfolioValue = portfolioData?.portfolio?.totalValue || "13.36";
  const portfolioChange = -1.69; // Mock percentage change
  const availableBalance = portfolioData?.portfolio?.availableCash || "0.00";

  const winners = topMovers.filter(m => m.change > 0);
  const losers = topMovers.filter(m => m.change < 0);

  return (
    <DashboardLayout showTicker={true}>
      <PageHeader
        title={`Hello ${user?.firstName || 'Trader'}!`}
        description="Welcome to your trading dashboard"
        actions={
          <Button
            onClick={() => setIsHidden(!isHidden)}
            variant="outline"
            data-testid="button-hide"
          >
            {isHidden ? 'Show' : 'Hide'}
          </Button>
        }
      />

      {/* Portfolio Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Portfolio Value"
          value={
            <div className="flex items-center gap-2">
              <span>{showBalance ? `€${portfolioValue}` : "••••••"}</span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 hover:bg-muted rounded"
                data-testid="toggle-balance"
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
            trend: portfolioChange >= 0 ? 'up' : 'down'
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

      {/* Quick Trade Button */}
      <div className="mb-6">
        <Link to="/trading">
          <Button className="w-full sm:w-auto" data-testid="trade-button">
            <Activity className="mr-2 h-4 w-4" />
            Start Trading
          </Button>
        </Link>
      </div>

      {/* Portfolio Chart Placeholder */}
      <div className="bg-white dark:bg-slate-900 m-4 p-6 rounded-xl shadow-sm">
        <div className="h-32 bg-gradient-to-r from-[#00cc88]/10 to-[#00cc88]/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-8 w-8 text-[#00cc88] mx-auto mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400">Portfolio Chart</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-900 m-4 p-6 rounded-xl shadow-sm">
        <div className="grid grid-cols-3 gap-6">
          <Link to="/deposits" className="text-center" data-testid="link-buy">
            <div className="w-16 h-16 bg-[#00cc88] rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Buy</p>
          </Link>

          <Link to="/withdrawals" className="text-center" data-testid="link-sell">
            <div className="w-16 h-16 bg-[#00cc88] rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
              <Minus className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Sell</p>
          </Link>

          <Link to="/trading" className="text-center" data-testid="link-swap">
            <div className="w-16 h-16 bg-[#00cc88] rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Swap</p>
          </Link>
        </div>
      </div>

      {/* Additional Actions */}
      <div className="bg-white dark:bg-slate-900 m-4 p-6 rounded-xl shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <Link to="/savings-plans" className="text-center" data-testid="link-savings">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2">
              <RefreshCw className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Savings Plan</p>
          </Link>

          <Link to="/staking" className="text-center" data-testid="link-staking">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">%</span>
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Staking</p>
          </Link>
        </div>
      </div>

      {/* Wallet Section */}
      <div className="bg-white dark:bg-slate-900 m-4 p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Wallet</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Available Balance</p>
          </div>
          <Wallet className="h-6 w-6 text-[#00cc88]" />
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">€{availableBalance}</h3>

        <div className="grid grid-cols-3 gap-4">
          <Link to="/deposits" className="text-center" data-testid="link-deposit">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">🏛️</span>
            </div>
            <p className="text-xs font-medium text-slate-900 dark:text-white">Deposit</p>
          </Link>

          <Link to="/withdrawals" className="text-center" data-testid="link-withdraw">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">💸</span>
            </div>
            <p className="text-xs font-medium text-slate-900 dark:text-white">Withdraw</p>
          </Link>

          <Link to="/trading" className="text-center" data-testid="link-send">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2">
              <Send className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
            <p className="text-xs font-medium text-slate-900 dark:text-white">Send</p>
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

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "winners" | "losers")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="winners" data-testid="tab-winners">Winners</TabsTrigger>
              <TabsTrigger value="losers" data-testid="tab-losers">Losers</TabsTrigger>
            </TabsList>

            <TabsContent value="winners">
              <div className="space-y-3">
                {winners.map((mover) => (
                  <div key={mover.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg" data-testid={`mover-card-${mover.symbol}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#00cc88]/10 rounded-full flex items-center justify-center">
                        <span className="text-lg">{mover.icon}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{mover.symbol}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{mover.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900 dark:text-white">{mover.price}</p>
                      <p className="text-sm text-[#00cc88] flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{mover.change}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="losers">
              <div className="space-y-3">
                {losers.map((mover) => (
                  <div key={mover.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg" data-testid={`mover-card-${mover.symbol}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                        <span className="text-lg">{mover.icon}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{mover.symbol}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{mover.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900 dark:text-white">{mover.price}</p>
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

      {/* Bottom Navigation */}
      <BottomNavigation />
    </DashboardLayout>
  );
}