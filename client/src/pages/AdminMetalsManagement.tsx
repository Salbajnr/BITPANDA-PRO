
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  Eye,
  Edit,
  AlertTriangle,
  Activity,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface MetalTransaction {
  id: string;
  userId: string;
  username: string;
  email: string;
  type: 'buy' | 'sell';
  symbol: string;
  amount: string;
  price: string;
  total: string;
  status: string;
  createdAt: string;
}

interface MetalStats {
  totalVolume: number;
  totalTransactions: number;
  totalUsers: number;
  topMetals: Array<{
    symbol: string;
    name: string;
    volume: number;
    transactions: number;
  }>;
}

interface UserHolding {
  userId: string;
  username: string;
  email: string;
  symbol: string;
  name: string;
  amount: string;
  value: number;
  profitLoss: number;
}

export default function AdminMetalsManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [transactions, setTransactions] = useState<MetalTransaction[]>([]);
  const [stats, setStats] = useState<MetalStats | null>(null);
  const [userHoldings, setUserHoldings] = useState<UserHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('');
  
  // Price override state
  const [priceOverride, setPriceOverride] = useState({
    symbol: '',
    price: '',
    reason: ''
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTransactions(),
        fetchStats(),
        fetchUserHoldings()
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/metals-trading/admin/transactions', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats for now - in production, create dedicated endpoint
      const mockStats: MetalStats = {
        totalVolume: 1250000,
        totalTransactions: 847,
        totalUsers: 234,
        topMetals: [
          { symbol: 'XAU', name: 'Gold', volume: 750000, transactions: 456 },
          { symbol: 'XAG', name: 'Silver', volume: 320000, transactions: 234 },
          { symbol: 'XPT', name: 'Platinum', volume: 120000, transactions: 98 },
          { symbol: 'XPD', name: 'Palladium', volume: 60000, transactions: 59 }
        ]
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchUserHoldings = async () => {
    try {
      // Mock user holdings for now - in production, create dedicated endpoint
      const mockHoldings: UserHolding[] = [
        {
          userId: '1',
          username: 'john_doe',
          email: 'john@example.com',
          symbol: 'XAU',
          name: 'Gold',
          amount: '2.5',
          value: 5114.18,
          profitLoss: 234.18
        },
        {
          userId: '2',
          username: 'jane_smith',
          email: 'jane@example.com',
          symbol: 'XAG',
          name: 'Silver',
          amount: '50.0',
          value: 1244.50,
          profitLoss: -45.50
        }
      ];
      setUserHoldings(mockHoldings);
    } catch (error) {
      console.error('Failed to fetch user holdings:', error);
    }
  };

  const handlePriceOverride = async () => {
    try {
      const response = await fetch('/api/metals-trading/admin/price-override', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(priceOverride)
      });

      if (response.ok) {
        toast({
          title: "Price Override Logged",
          description: "Price override has been recorded for audit purposes",
          variant: "default"
        });
        setPriceOverride({ symbol: '', price: '', reason: '' });
      } else {
        throw new Error('Failed to log price override');
      }
    } catch (error) {
      console.error('Error logging price override:', error);
      toast({
        title: "Error",
        description: "Failed to log price override",
        variant: "destructive"
      });
    }
  };

  if (!user || user.role !== 'admin') {
    return <div>Access denied. Admin privileges required.</div>;
  }

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Metals Management</h1>
            <p className="text-xl text-gray-600">Admin dashboard for precious metals oversight</p>
          </div>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Volume</p>
                  <p className="text-2xl font-bold">${stats?.totalVolume.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold">{stats?.totalTransactions}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold">{stats?.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Top Metal</p>
                  <p className="text-2xl font-bold">{stats?.topMetals[0]?.name}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="holdings">User Holdings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Metal Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={tx.type === 'buy' ? 'default' : 'secondary'}>
                              {tx.type.toUpperCase()}
                            </Badge>
                            <span className="font-semibold">{tx.symbol}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-sm">{tx.username}</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(tx.createdAt).toLocaleDateString()} • {tx.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${parseFloat(tx.total).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">
                            {tx.amount} oz @ ${parseFloat(tx.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Holdings Tab */}
          <TabsContent value="holdings">
            <Card>
              <CardHeader>
                <CardTitle>User Holdings Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userHoldings.map((holding, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{holding.name}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-sm">{holding.username}</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {holding.amount} oz • {holding.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${holding.value.toFixed(2)}</p>
                          <p className={`text-sm ${
                            holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-500'
                          }`}>
                            {holding.profitLoss >= 0 ? '+' : ''}${holding.profitLoss.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Metal Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.topMetals.map((metal) => (
                      <div key={metal.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold">{metal.name}</p>
                          <p className="text-sm text-gray-500">{metal.symbol}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${metal.volume.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{metal.transactions} transactions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trading Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-lg font-semibold text-blue-800">Daily Volume</p>
                      <p className="text-2xl font-bold text-blue-900">$125,400</p>
                      <p className="text-sm text-blue-600">+12.5% from yesterday</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-lg font-semibold text-green-800">Active Traders</p>
                      <p className="text-2xl font-bold text-green-900">68</p>
                      <p className="text-sm text-green-600">+8 new today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Price Override
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                        <span className="text-sm text-yellow-800">
                          Price overrides are logged for audit purposes
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Metal Symbol</label>
                      <Input
                        value={priceOverride.symbol}
                        onChange={(e) => setPriceOverride({...priceOverride, symbol: e.target.value})}
                        placeholder="e.g., XAU, XAG"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Override Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={priceOverride.price}
                        onChange={(e) => setPriceOverride({...priceOverride, price: e.target.value})}
                        placeholder="New price per ounce"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Reason</label>
                      <Input
                        value={priceOverride.reason}
                        onChange={(e) => setPriceOverride({...priceOverride, reason: e.target.value})}
                        placeholder="Reason for price override"
                      />
                    </div>

                    <Button 
                      onClick={handlePriceOverride}
                      className="w-full"
                      disabled={!priceOverride.symbol || !priceOverride.price || !priceOverride.reason}
                    >
                      Log Price Override
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trading Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Metal Trading</p>
                          <p className="text-sm text-gray-500">Enable/disable metal trading</p>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Price Feeds</p>
                          <p className="text-sm text-gray-500">Real-time price updates</p>
                        </div>
                        <Badge variant="default">Connected</Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Storage Fees</p>
                          <p className="text-sm text-gray-500">Monthly storage charges</p>
                        </div>
                        <Badge variant="secondary">$2.50/oz/month</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, TrendingUp, TrendingDown, RefreshCw, 
  Plus, Edit, Trash2, AlertTriangle, CheckCircle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { LoadingCard } from "@/components/LoadingCard";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";

interface Metal {
  id: string;
  symbol: string;
  name: string;
  currentPrice: string;
  change24h: string;
  isActive: boolean;
  lastUpdated: string;
}

export default function AdminMetalsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMetal, setSelectedMetal] = useState<Metal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [metalForm, setMetalForm] = useState({
    symbol: '',
    name: '',
    currentPrice: '',
    isActive: true
  });

  const { data: metals, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/metals/admin/all'],
    queryFn: () => apiRequest('GET', '/api/metals/admin/all'),
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/metals/admin/stats'],
    queryFn: () => apiRequest('GET', '/api/metals/admin/stats'),
  });

  const updatePriceMutation = useMutation({
    mutationFn: ({ id, price }: { id: string; price: string }) =>
      apiRequest('PATCH', `/api/metals/admin/${id}/price`, { price }),
    onSuccess: () => {
      toast({ title: "Price updated", description: "Metal price has been updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/metals/admin/all'] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiRequest('PATCH', `/api/metals/admin/${id}/status`, { isActive }),
    onSuccess: () => {
      toast({ title: "Status updated", description: "Metal status has been updated" });
      queryClient.invalidateQueries({ queryKey: ['/api/metals/admin/all'] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <LoadingCard count={4} height="h-24" />
        </div>
        <LoadingCard count={1} height="h-96" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Failed to load metals data" onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Precious Metals Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage precious metals prices and availability
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Prices
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Metals</p>
                  <p className="text-2xl font-bold">{stats.totalMetals || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active</p>
                  <p className="text-2xl font-bold">{stats.activeMetals || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg 24h Change</p>
                  <p className="text-2xl font-bold">{stats.avgChange24h || '0'}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Volume</p>
                  <p className="text-2xl font-bold">${stats.totalVolume || '0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Precious Metals</CardTitle>
        </CardHeader>
        <CardContent>
          {!metals || metals.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title="No Metals Found"
              description="No precious metals have been added to the system yet"
              actionLabel="Add Metal"
              onAction={() => setIsDialogOpen(true)}
            />
          ) : (
            <div className="space-y-4">
              {metals.map((metal: Metal) => (
                <div key={metal.id} className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-lg">{metal.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{metal.symbol}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">${metal.currentPrice}</p>
                        <p className={`text-sm ${parseFloat(metal.change24h) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {parseFloat(metal.change24h) >= 0 ? '+' : ''}{metal.change24h}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={metal.isActive ? 'default' : 'secondary'}>
                        {metal.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActiveMutation.mutate({ id: metal.id, isActive: !metal.isActive })}
                      >
                        {metal.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMetal(metal);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMetal ? 'Edit Metal' : 'Add Metal'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Symbol</Label>
              <Input
                value={metalForm.symbol}
                onChange={(e) => setMetalForm({ ...metalForm, symbol: e.target.value })}
                placeholder="e.g., XAU"
              />
            </div>
            <div>
              <Label>Name</Label>
              <Input
                value={metalForm.name}
                onChange={(e) => setMetalForm({ ...metalForm, name: e.target.value })}
                placeholder="e.g., Gold"
              />
            </div>
            <div>
              <Label>Current Price</Label>
              <Input
                type="number"
                value={metalForm.currentPrice}
                onChange={(e) => setMetalForm({ ...metalForm, currentPrice: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
