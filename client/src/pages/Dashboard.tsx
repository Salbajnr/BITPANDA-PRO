
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet, TrendingUp, TrendingDown, ArrowUp, ArrowDown,
  BarChart3, PieChart, Bell, DollarSign, Activity, 
  Eye, Star, Plus, Target, Clock, Users, Globe, 
  Settings, LogOut, Menu, X, Search, Filter, RefreshCw,
  Shield, FileText
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
}

interface TopMover {
  id: string;
  symbol: string;
  name: string;
  change: number;
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
    { id: "/advanced-trading", label: "Advanced Trading", icon: Target },
    { id: "/transactions", label: "Transactions", icon: Clock },
    { id: "/orders", label: "Orders", icon: Activity },
    { id: "/watchlist", label: "Watchlist", icon: Eye },
    { id: "/alerts", label: "Price Alerts", icon: Bell },
    { id: "/deposits", label: "Deposits", icon: DollarSign },
    { id: "/withdrawals", label: "Withdrawals", icon: DollarSign },
    { id: "/markets", label: "Markets", icon: Globe },
    { id: "/news", label: "News", icon: Globe },
    { id: "/risk-management", label: "Risk Management", icon: Shield },
    { id: "/tax-reporting", label: "Tax Reporting", icon: FileText },
    { id: "/api-management", label: "API Management", icon: Settings },
    { id: "/notifications", label: "Notifications", icon: Bell },
    { id: "/settings", label: "Settings", icon: Settings },
  ];

  const adminItems = user?.role === 'admin' ? [
    { id: "/admin", label: "Admin Panel", icon: Users },
  ] : [];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-40">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                <img src="/src/assets/logo.jpeg" alt="BITPANDA PRO" className="w-5 h-5 rounded-lg" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">BITPANDA PRO</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Professional Trading</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{user?.firstName?.charAt(0) || 'U'}</span>
              </div>
              <div className="ml-3 min-w-0">
                <div className="font-medium text-slate-900 dark:text-white text-sm truncate">
                  {user?.firstName || 'User'} {user?.lastName || ''}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
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
                  <button className={cn(
                    "w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}>
                    <Icon className={cn(
                      "mr-3 h-5 w-5 transition-colors flex-shrink-0",
                      isActive ? "text-green-600 dark:text-green-400" : "text-slate-400 group-hover:text-slate-500"
                    )} />
                    <span className="truncate">{item.label}</span>
                  </button>
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
                      <button className={cn(
                        "w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                      )}>
                        <Icon className={cn(
                          "mr-3 h-5 w-5 transition-colors flex-shrink-0",
                          isActive ? "text-red-600 dark:text-red-400" : "text-slate-400 group-hover:text-slate-500"
                        )} />
                        <span className="truncate">{item.label}</span>
                      </button>
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
                <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Sign Out</span>
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                  <img src="/src/assets/logo.jpeg" alt="BITPANDA PRO" className="w-5 h-5 rounded" />
                </div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">BITPANDA PRO</h1>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile User Info */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{user?.firstName?.charAt(0) || 'U'}</span>
                </div>
                <div className="ml-3 min-w-0">
                  <div className="font-medium text-slate-900 dark:text-white text-sm truncate">
                    {user?.firstName || 'User'} {user?.lastName || ''}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user?.role === 'admin' ? 'Administrator' : 'Trader'}
                  </div>
                </div>
              </div>
            </div>

            <nav className="px-2 py-4 space-y-1 overflow-y-auto h-[calc(100vh-200px)]">
              {[...sidebarItems, ...adminItems].map((item) => {
                const Icon = item.icon;
                const isActive = location === item.id || (item.id === "/dashboard" && location === "/");
                return (
                  <Link key={item.id} href={item.id}>
                    <button
                      onClick={onClose}
                      className={cn(
                        "w-full group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
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
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 lg:ml-64 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center min-w-0">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 lg:hidden flex-shrink-0"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 lg:ml-0 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
              Welcome back, {user?.firstName || 'Trader'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Refresh</span>
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
  const [activeTab, setActiveTab] = useState<"winners" | "losers">("winners");

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
      setTimeout(() => {
        window.location.href = "/auth";
      }, 1000);
    }
  }, [user, authLoading, toast]);

  if (authLoading || portfolioLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Mock data for top movers
  const topMovers: TopMover[] = [
    { id: "1", symbol: "VSN", name: "Vision", change: 66.83 },
    { id: "2", symbol: "REZ", name: "Renzo", change: 38.42 },
    { id: "3", symbol: "HPOS10I", name: "HarryPotterOb...", change: 31.37 },
  ];

  const totalPortfolioValue = portfolioData?.portfolio?.totalValue
    ? parseFloat(portfolioData.portfolio.totalValue)
    : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Greeting and Balance */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Hallo {user?.firstName || "Heike"}!
          </h1>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <span className="text-slate-500 dark:text-slate-400">🔔</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-slate-900 dark:text-white">
            {totalPortfolioValue.toLocaleString("de-DE", {
              style: "currency",
              currency: "EUR",
            })}
          </div>
          <div className="text-sm text-red-500">▼ 0,73 % in 1 Tag</div>
        </div>

        {/* Trade Button */}
        <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-6 mb-6">
          Trade
        </Button>

        {/* Promo Cards */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <Card className="bg-slate-100 dark:bg-slate-800">
            <CardContent className="p-2 text-center">
              <div className="w-full h-16 bg-slate-300 dark:bg-slate-700 rounded mb-2"></div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Vision (VSN) ist live
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-100 dark:bg-slate-800">
            <CardContent className="p-2 text-center">
              <div className="w-full h-16 bg-slate-300 dark:bg-slate-700 rounded mb-2"></div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Bitcoin-Allzeithoch
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-100 dark:bg-slate-800">
            <CardContent className="p-2 text-center">
              <div className="w-full h-16 bg-slate-300 dark:bg-slate-700 rounded mb-2"></div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Gewinne ein Bitcoin
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Top Movers Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Top-Mover in 1 Tag
            </h2>
            <Link href="#" className="text-sm text-green-500">
              Mehr anzeigen
            </Link>
          </div>

          <div className="flex mb-4">
            <Button
              variant={activeTab === "winners" ? "default" : "outline"}
              className={`flex-1 rounded-r-none ${
                activeTab === "winners"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
              onClick={() => setActiveTab("winners")}
            >
              Gewinner
            </Button>
            <Button
              variant={activeTab === "losers" ? "default" : "outline"}
              className={`flex-1 rounded-l-none ${
                activeTab === "losers"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
              onClick={() => setActiveTab("losers")}
            >
              Verlierer
            </Button>
          </div>

          {/* Top Movers List */}
          <div className="space-y-2">
            {topMovers.map((mover) => (
              <Card
                key={mover.id}
                className="bg-slate-50 dark:bg-slate-800 p-3 flex items-center"
              >
                <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700 mr-3"></div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {mover.symbol} {mover.name}
                  </p>
                </div>
                <div
                  className={`font-medium ${
                    mover.change > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {mover.change > 0 ? "▲" : "▼"} {Math.abs(mover.change)}%
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
    </div>
  );
}
