
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
  RefreshCw, DollarSign, Activity, Coins, Target
} from "lucide-react";
import { Link } from "wouter";

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
}

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState("portfolio");
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: portfolioData, isLoading: portfolioLoading } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
    retry: false,
    enabled: !!user,
  });

  const { data: cryptoData = [], isLoading: cryptoLoading } = useQuery<CryptoData[]>({
    queryKey: ['crypto-data'],
    queryFn: async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1');
      return response.json();
    },
    refetchInterval: 30000,
  });

  // Mock trading mutation
  const tradeMutation = useMutation({
    mutationFn: async (data: { symbol: string; type: 'buy' | 'sell'; amount: number }) => {
      // Simulate API call
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
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalPortfolioValue = portfolioData?.portfolio?.totalValue ? 
    parseFloat(portfolioData.portfolio.totalValue) : 0;
  const availableCash = portfolioData?.portfolio?.availableCash ? 
    parseFloat(portfolioData.portfolio.availableCash) : 0;
  const investedValue = totalPortfolioValue - availableCash;

  // Calculate 24h change (mock calculation)
  const dailyChange = totalPortfolioValue * 0.024; // 2.4% mock change
  const dailyChangePercent = 2.4;

  // Generate mock chart data
  const chartData = [
    { day: 'Mon', value: totalPortfolioValue * 0.92 },
    { day: 'Tue', value: totalPortfolioValue * 0.95 },
    { day: 'Wed', value: totalPortfolioValue * 0.93 },
    { day: 'Thu', value: totalPortfolioValue * 0.97 },
    { day: 'Fri', value: totalPortfolioValue * 0.99 },
    { day: 'Sat', value: totalPortfolioValue * 0.96 },
    { day: 'Sun', value: totalPortfolioValue }
  ];
  const maxValue = Math.max(...chartData.map(d => d.value));

  const filteredCrypto = cryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sidebarItems = [
    { id: "portfolio", label: "Portfolio", icon: Wallet },
    { id: "transactions", label: "Transactions", icon: Activity },
    { id: "market", label: "Market", icon: BarChart3 },
    { id: "account", label: "Account Settings", icon: Target },
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
      </div>

      <Navbar />
      
      <div className="flex h-screen pt-16 relative z-10">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-green-600 flex items-center justify-center">
                <img src="/client/src/assets/logo.jpeg" alt="BITPANDA PRO" className="w-8 h-8 rounded-full" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">BITPANDA PRO</span>
            </div>
          </div>
          
          <div className="flex-1 py-6">
            <nav className="space-y-1 px-4">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                      activeSection === item.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="p-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-green-600 flex items-center justify-center">
                <span className="text-white font-bold">{user?.firstName?.charAt(0) || 'U'}</span>
              </div>
              <div className="ml-3">
                <div className="font-medium text-slate-900 dark:text-white">
                  {user?.firstName || 'User'} {user?.lastName || ''}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {user?.email || 'user@bitpandapro.com'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            {/* Portfolio Section */}
            {activeSection === "portfolio" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Welcome back, {user?.firstName || 'Trader'}!
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Here's what's happening with your investments today.
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 mb-2">Total Balance</div>
                          <div className="text-3xl font-bold text-slate-900 dark:text-white">
                            ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Wallet className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center text-sm text-green-600">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>{dailyChangePercent.toFixed(1)}% increase</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 mb-2">Portfolio Value</div>
                          <div className="text-3xl font-bold text-slate-900 dark:text-white">
                            ${investedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <Coins className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center text-sm text-green-600">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>3.8% increase</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 mb-2">24h Change</div>
                          <div className="text-3xl font-bold text-slate-900 dark:text-white">
                            +${dailyChange.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-blue-500" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center text-sm text-green-600">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>2.1% increase</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts and Holdings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        Portfolio Performance
                        <span className="text-sm text-slate-500 dark:text-slate-400">Last 7 days</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-end space-x-2">
                        {chartData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                              className="w-full bg-gradient-to-t from-primary to-green-500 rounded-t-md transition-all duration-1000"
                              style={{ height: `${(data.value / maxValue) * 180}px` }}
                            ></div>
                            <div className="text-slate-500 dark:text-slate-400 text-sm mt-2">{data.day}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        Your Holdings
                        <Link href="/analytics">
                          <Button variant="ghost" size="sm" className="text-primary">
                            View details <ExternalLink className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {portfolioData?.holdings?.slice(0, 3).map((holding) => {
                          const value = parseFloat(holding.amount) * parseFloat(holding.currentPrice);
                          const percentage = (value / investedValue) * 100;
                          
                          return (
                            <div key={holding.id} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                  <span className="text-primary text-xs font-bold">
                                    {holding.symbol.substring(0, 2)}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900 dark:text-white">{holding.symbol}</div>
                                  <div className="text-sm text-slate-500 dark:text-slate-400">
                                    {percentage.toFixed(1)}% of portfolio
                                  </div>
                                </div>
                              </div>
                              <div className="text-slate-900 dark:text-white">
                                ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </div>
                            </div>
                          );
                        })}
                        {(!portfolioData?.holdings || portfolioData.holdings.length === 0) && (
                          <div className="text-center py-8">
                            <div className="text-slate-500 dark:text-slate-400">
                              No holdings yet. Start trading to build your portfolio!
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Link href="/trading-pro">
                        <Button variant="outline" className="h-20 flex flex-col items-center">
                          <Activity className="h-6 w-6 mb-2 text-primary" />
                          <span>Trade</span>
                        </Button>
                      </Link>
                      <Button variant="outline" className="h-20 flex flex-col items-center">
                        <ArrowDown className="h-6 w-6 mb-2 text-green-500" />
                        <span>Deposit</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center">
                        <ArrowUp className="h-6 w-6 mb-2 text-yellow-500" />
                        <span>Withdraw</span>
                      </Button>
                      <Link href="/analytics">
                        <Button variant="outline" className="h-20 flex flex-col items-center">
                          <PieChart className="h-6 w-6 mb-2 text-blue-500" />
                          <span>Analytics</span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Transactions Section */}
            {activeSection === "transactions" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Transactions</h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Track your trading activity and portfolio changes
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Transaction History</CardTitle>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input
                          placeholder="Search transactions..."
                          className="pl-10 w-64"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
                            <th className="pb-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {portfolioData?.transactions?.slice(0, 5).map((transaction) => (
                            <tr key={transaction.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                              <td className="py-4 text-slate-900 dark:text-white">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-4 text-slate-900 dark:text-white capitalize">
                                {transaction.type}
                              </td>
                              <td className="py-4 text-slate-900 dark:text-white">
                                {transaction.symbol}
                              </td>
                              <td className="py-4 text-slate-900 dark:text-white">
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
                              <td colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400">
                                No transactions yet. Start trading to see your activity here!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-6 flex justify-center">
                      <Link href="/transactions">
                        <Button variant="outline">
                          View All Transactions
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Market Section */}
            {activeSection === "market" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Market Overview</h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Real-time cryptocurrency prices and market data
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Live Market Data</CardTitle>
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
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {cryptoLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-center space-x-4 animate-pulse">
                            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
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
                              <th className="pb-3 font-medium">Asset</th>
                              <th className="pb-3 font-medium">Price</th>
                              <th className="pb-3 font-medium">24h Change</th>
                              <th className="pb-3 font-medium">Market Cap</th>
                              <th className="pb-3 text-right font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCrypto.slice(0, 10).map((crypto) => (
                              <tr key={crypto.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
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
                                <td className="py-4 text-right">
                                  <Button 
                                    size="sm"
                                    onClick={() => {
                                      toast({
                                        title: "Trade Feature",
                                        description: `Navigate to Trading Pro to trade ${crypto.symbol.toUpperCase()}`,
                                      });
                                    }}
                                  >
                                    Trade
                                  </Button>
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

            {/* Account Settings Section */}
            {activeSection === "account" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Manage your profile and security settings
                  </p>
                </div>

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
                          <span>Security Settings</span>
                          <ExternalLink className="h-4 w-4 ml-auto" />
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full justify-start">
                        <span>Two-Factor Authentication</span>
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <span>API Keys</span>
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <span>Privacy Settings</span>
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Link href="/help">
                        <Button variant="outline" className="h-20 flex flex-col items-center">
                          <span className="text-2xl mb-2">📚</span>
                          <span>Help Center</span>
                        </Button>
                      </Link>
                      <Link href="/support">
                        <Button variant="outline" className="h-20 flex flex-col items-center">
                          <span className="text-2xl mb-2">💬</span>
                          <span>Live Support</span>
                        </Button>
                      </Link>
                      <Link href="/kyc">
                        <Button variant="outline" className="h-20 flex flex-col items-center">
                          <span className="text-2xl mb-2">🔒</span>
                          <span>KYC Verification</span>
                        </Button>
                      </Link>
                      <Button variant="outline" className="h-20 flex flex-col items-center">
                        <span className="text-2xl mb-2">📄</span>
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
