
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet, TrendingUp, TrendingDown, ArrowUp, ArrowDown,
  BarChart3, PieChart, Bell, DollarSign, Activity, 
  Eye, Star, Plus, Target, Clock, Users, Globe, 
  Settings, LogOut, Menu, X, Search, Filter, RefreshCw
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { NotificationCenter } from "@/components/NotificationCenter";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { LiveMarketStats } from "@/components/LiveMarketStats";
import { useRealTimePrice } from "@/hooks/useRealTimePrice";
import NewsWidget from '@/components/NewsWidget';
import { PriceAlertsList } from '@/components/PriceAlertsList';
import RealTimePriceWidget from "@/components/RealTimePriceWidget";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

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

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  imageUrl?: string;
}

// Dashboard Sidebar Component
function DashboardSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [location, navigate] = useLocation();
  const { user } = useAuth();

  const sidebarItems = [
    { id: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "/portfolio", label: "Portfolio", icon: Wallet },
    { id: "/analytics", label: "Analytics", icon: TrendingUp },
    { id: "/trading", label: "Trading", icon: Activity },
    { id: "/transactions", label: "Transactions", icon: Clock },
    { id: "/watchlist", label: "Watchlist", icon: Eye },
    { id: "/markets", label: "Markets", icon: Globe },
    { id: "/news", label: "News", icon: Globe },
    { id: "/settings", label: "Settings", icon: Settings },
  ];

  const adminItems = user?.role === 'admin' ? [
    { id: "/admin", label: "Admin Panel", icon: Users },
  ] : [];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <img src="/client/src/assets/logo.jpeg" alt="BITPANDA PRO" className="w-6 h-6 rounded-lg" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">BITPANDA PRO</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Professional Trading</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{user?.firstName?.charAt(0) || 'U'}</span>
              </div>
              <div className="ml-3">
                <div className="font-medium text-slate-900 dark:text-white text-sm">
                  {user?.firstName || 'User'} {user?.lastName || ''}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.role === 'admin' ? 'Administrator' : 'Trader'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.id || (item.id === "/dashboard" && location === "/");
              return (
                <Link key={item.id} href={item.id}>
                  <a className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}>
                    <Icon className={cn(
                      "mr-3 h-5 w-5 transition-colors",
                      isActive ? "text-green-600 dark:text-green-400" : "text-slate-400 group-hover:text-slate-500"
                    )} />
                    {item.label}
                  </a>
                </Link>
              );
            })}
            
            {adminItems.length > 0 && (
              <>
                <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Administration
                  </p>
                </div>
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.id;
                  return (
                    <Link key={item.id} href={item.id}>
                      <a className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                      )}>
                        <Icon className={cn(
                          "mr-3 h-5 w-5 transition-colors",
                          isActive ? "text-red-600 dark:text-red-400" : "text-slate-400 group-hover:text-slate-500"
                        )} />
                        {item.label}
                      </a>
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 p-4">
            <Link href="/auth">
              <Button variant="ghost" size="sm" className="w-full justify-start text-slate-600 dark:text-slate-300">
                <LogOut className="mr-3 h-4 w-4" />
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                  <img src="/client/src/assets/logo.jpeg" alt="BITPANDA PRO" className="w-5 h-5 rounded" />
                </div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">BITPANDA PRO</h1>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="px-2 py-4 space-y-1">
              {[...sidebarItems, ...adminItems].map((item) => {
                const Icon = item.icon;
                const isActive = location === item.id || (item.id === "/dashboard" && location === "/");
                return (
                  <Link key={item.id} href={item.id}>
                    <a 
                      onClick={onClose}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </a>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

// Dashboard Header Component
function DashboardHeader({ onMobileMenuToggle }: { onMobileMenuToggle: () => void }) {
  const { user } = useAuth();
  
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 lg:pl-64">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 lg:ml-0">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome back, {user?.firstName || 'Trader'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <NotificationCenter />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: portfolioData, isLoading: portfolioLoading } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
    retry: false,
    enabled: !!user,
  });

  const { data: newsArticles = [] } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news'],
    queryFn: async () => {
      const response = await fetch('/api/news?limit=5');
      return response.json();
    },
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access your dashboard",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 1000);
      return;
    }
  }, [user, authLoading, toast]);

  if (authLoading || portfolioLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalPortfolioValue = portfolioData?.portfolio?.totalValue ?
    parseFloat(portfolioData.portfolio.totalValue) : 0;
  const availableCash = portfolioData?.portfolio?.availableCash ?
    parseFloat(portfolioData.portfolio.availableCash) : 0;

  // Calculate mock performance metrics
  const dailyChange = totalPortfolioValue * 0.0229; // Mock 2.29% daily change
  const dailyChangePercent = 2.29;

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 dark:bg-slate-900">
      <DashboardSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none lg:pl-64">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Wallet className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-slate-500 truncate">Total Balance</dt>
                          <dd className="text-2xl font-bold text-slate-900 dark:text-white">
                            ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <DollarSign className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-slate-500 truncate">Available Cash</dt>
                          <dd className="text-2xl font-bold text-slate-900 dark:text-white">
                            ${availableCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-slate-500 truncate">24h Change</dt>
                          <dd className="text-2xl font-bold text-green-600">
                            +${dailyChange.toFixed(2)}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Activity className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-slate-500 truncate">Active Positions</dt>
                          <dd className="text-2xl font-bold text-slate-900 dark:text-white">
                            {portfolioData?.holdings?.length || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Link href="/trading">
                    <Button className="w-full h-20 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700">
                      <Activity className="h-6 w-6 mb-2" />
                      <span>Trade</span>
                    </Button>
                  </Link>
                  <Link href="/deposits">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                      <Plus className="h-6 w-6 mb-2" />
                      <span>Deposit</span>
                    </Button>
                  </Link>
                  <Link href="/analytics">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                      <BarChart3 className="h-6 w-6 mb-2" />
                      <span>Analytics</span>
                    </Button>
                  </Link>
                  <Link href="/watchlist">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                      <Eye className="h-6 w-6 mb-2" />
                      <span>Watchlist</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Portfolio Performance Chart */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[
                            { time: '00:00', value: totalPortfolioValue * 0.95 },
                            { time: '04:00', value: totalPortfolioValue * 0.97 },
                            { time: '08:00', value: totalPortfolioValue * 0.98 },
                            { time: '12:00', value: totalPortfolioValue * 1.01 },
                            { time: '16:00', value: totalPortfolioValue * 1.02 },
                            { time: '20:00', value: totalPortfolioValue },
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Sidebar Widgets */}
                <div className="space-y-6">
                  <PriceAlertsList />
                  <RealTimePriceWidget 
                    symbols={['BTC', 'ETH', 'BNB']}
                    title="Top Holdings"
                    maxItems={3}
                  />
                  <NewsWidget />
                </div>
              </div>

              {/* Holdings & Recent Transactions */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Holdings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Holdings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {portfolioData?.holdings?.slice(0, 5).map((holding) => (
                        <div key={holding.id} className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mr-3">
                              <span className="text-white text-xs font-bold">{holding.symbol.slice(0, 2)}</span>
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">{holding.symbol}</div>
                              <div className="text-sm text-slate-500">{holding.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-slate-900 dark:text-white">
                              {parseFloat(holding.amount).toFixed(4)}
                            </div>
                            <div className="text-sm text-slate-500">
                              ${(parseFloat(holding.amount) * parseFloat(holding.currentPrice)).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!portfolioData?.holdings || portfolioData.holdings.length === 0) && (
                        <div className="text-center py-8 text-slate-500">
                          No holdings yet. Start trading to see your portfolio here.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {portfolioData?.transactions?.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              transaction.type === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {transaction.type === 'buy' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                {transaction.type.toUpperCase()} {transaction.symbol}
                              </div>
                              <div className="text-sm text-slate-500">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-slate-900 dark:text-white">
                              ${parseFloat(transaction.total).toFixed(2)}
                            </div>
                            <Badge className="bg-green-100 text-green-700 text-xs">Completed</Badge>
                          </div>
                        </div>
                      ))}
                      {(!portfolioData?.transactions || portfolioData.transactions.length === 0) && (
                        <div className="text-center py-8 text-slate-500">
                          No transactions yet. Your trading activity will appear here.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
