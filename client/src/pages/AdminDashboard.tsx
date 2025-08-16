import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Users, DollarSign, TrendingUp, Shield, Bell, Settings, 
  Search, Plus, ArrowUp, ArrowDown, CheckSquare, Trash2,
  Activity, MessageCircle, PieChart, Clock, ChevronLeft, ChevronRight,
  MoreHorizontal, Sun, Moon, Ban, RotateCcw, Eye, Download,
  AlertTriangle, UserCheck, Lock, Unlock, RefreshCw, CreditCard
} from "lucide-react";
import logoPath from '@/assets/logo.jpeg';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  portfolio?: {
    totalValue: string;
    availableCash: string;
  };
  recentTransactions?: any[];
  recentDeposits?: any[];
  totalTransactions?: number;
}

interface Transaction {
  id: string;
  userId: string;
  type: string;
  symbol: string;
  amount: string;
  price: string;
  total: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [balanceAdjustment, setBalanceAdjustment] = useState({
    type: 'add' as 'add' | 'remove' | 'set',
    amount: '',
    reason: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch users with pagination
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["/api/admin/users", currentPage, searchTerm],
    queryFn: () => apiRequest(`/api/admin/users?page=${currentPage}&search=${encodeURIComponent(searchTerm)}`),
    retry: 1,
  });

  // Fetch analytics overview
  const { data: analyticsData } = useQuery({
    queryKey: ["/api/admin/analytics/overview"],
    queryFn: () => apiRequest("/api/admin/analytics/overview"),
    retry: 1,
  });

  // Fetch transactions
  const { data: transactionsData } = useQuery({
    queryKey: ["/api/admin/transactions", currentPage],
    queryFn: () => apiRequest(`/api/admin/transactions?page=${currentPage}&limit=20`),
    retry: 1,
  });

  // Fetch balance adjustments
  const { data: adjustmentsData } = useQuery({
    queryKey: ["/api/admin/balance-adjustments"],
    queryFn: () => apiRequest("/api/admin/balance-adjustments"),
    retry: 1,
  });

  // Balance adjustment mutation
  const adjustBalanceMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/balance-adjustment", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Balance adjusted successfully",
      });
      refetchUsers();
      setSelectedUser(null);
      setBalanceAdjustment({ type: 'add', amount: '', reason: '' });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to adjust balance",
        variant: "destructive",
      });
    },
  });

  // User suspension mutation
  const suspendUserMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: string, reason: string }) => 
      apiRequest(`/api/admin/users/${userId}/suspend`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User suspended successfully",
      });
      refetchUsers();
    },
  });

  // User reactivation mutation
  const reactivateUserMutation = useMutation({
    mutationFn: (userId: string) => 
      apiRequest(`/api/admin/users/${userId}/reactivate`, {
        method: "POST",
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User reactivated successfully",
      });
      refetchUsers();
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => 
      apiRequest(`/api/admin/users/${userId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      refetchUsers();
    },
  });

  // Force logout mutation
  const forceLogoutMutation = useMutation({
    mutationFn: (userId: string) => 
      apiRequest(`/api/admin/security/force-logout/${userId}`, {
        method: "POST",
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User sessions terminated",
      });
    },
  });

  // Reverse transaction mutation
  const reverseTransactionMutation = useMutation({
    mutationFn: ({ transactionId, reason }: { transactionId: string, reason: string }) => 
      apiRequest(`/api/admin/transactions/${transactionId}/reverse`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction reversed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
    },
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      toast({
        title: "Access Denied",
        description: "Admin access required",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [user, authLoading, toast]);

  const handleBalanceAdjustment = () => {
    if (!selectedUser || !balanceAdjustment.amount) return;

    adjustBalanceMutation.mutate({
      targetUserId: selectedUser.id,
      adjustmentType: balanceAdjustment.type,
      amount: balanceAdjustment.amount,
      currency: 'USD',
      reason: balanceAdjustment.reason,
    });
  };

  const handleSuspendUser = (user: User, reason: string) => {
    suspendUserMutation.mutate({ userId: user.id, reason });
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: PieChart },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'transactions', label: 'Transaction Control', icon: Activity },
    { id: 'analytics', label: 'Platform Analytics', icon: TrendingUp },
    { id: 'security', label: 'Security Center', icon: Shield },
    { id: 'system', label: 'System Settings', icon: Settings },
  ];

  const users = usersData?.users || [];
  const totalUsers = usersData?.pagination?.total || 0;
  const transactions = transactionsData?.transactions || [];
  const analytics = analyticsData || {};
  const adjustments = adjustmentsData?.adjustments || [];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex h-screen">
        {/* Enhanced Sidebar */}
        <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-lg">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={logoPath} alt="BITPANDA PRO" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">Admin Control</span>
                <p className="text-xs text-slate-500">Full Platform Management</p>
              </div>
            </div>
          </div>

          <div className="flex-1 py-6">
            <nav className="space-y-2 px-4">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary font-medium shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <IconComponent className={`mr-3 h-5 w-5 ${
                      activeSection === item.id ? 'text-primary' : 'text-slate-500'
                    }`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Header */}
          <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between px-8 py-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {sidebarItems.find(item => item.id === activeSection)?.label}
                </h1>
                <p className="text-slate-500">Advanced admin controls and monitoring</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className="bg-green-100 text-green-800">
                  System Online
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => queryClient.invalidateQueries()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Data
                </Button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            {/* Dashboard Section */}
            {activeSection === 'dashboard' && (
              <div className="space-y-8">
                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100">Total Users</p>
                          <p className="text-3xl font-bold">{analytics.totalUsers?.toLocaleString() || '0'}</p>
                        </div>
                        <Users className="h-12 w-12 text-blue-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100">Total Volume</p>
                          <p className="text-3xl font-bold">${(analytics.totalVolume / 1000000)?.toFixed(1) || '0'}M</p>
                        </div>
                        <TrendingUp className="h-12 w-12 text-green-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100">Transactions</p>
                          <p className="text-3xl font-bold">{analytics.totalTransactions?.toLocaleString() || '0'}</p>
                        </div>
                        <Activity className="h-12 w-12 text-purple-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100">Deposits</p>
                          <p className="text-3xl font-bold">{analytics.totalDeposits?.toLocaleString() || '0'}</p>
                        </div>
                        <DollarSign className="h-12 w-12 text-orange-200" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Administrative Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button 
                        className="h-20 flex flex-col gap-2"
                        onClick={() => setActiveSection('users')}
                      >
                        <Users className="h-6 w-6" />
                        Manage Users
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex flex-col gap-2"
                        onClick={() => setActiveSection('transactions')}
                      >
                        <Activity className="h-6 w-6" />
                        View Transactions
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex flex-col gap-2"
                        onClick={() => setActiveSection('analytics')}
                      >
                        <TrendingUp className="h-6 w-6" />
                        Analytics
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex flex-col gap-2"
                        onClick={() => setActiveSection('security')}
                      >
                        <Shield className="h-6 w-6" />
                        Security
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Balance Adjustments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {adjustments.slice(0, 5).map((adj: any) => (
                          <div key={adj.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div>
                              <p className="font-medium">
                                {adj.adjustmentType.charAt(0).toUpperCase() + adj.adjustmentType.slice(1)} ${adj.amount}
                              </p>
                              <p className="text-sm text-slate-500">{new Date(adj.createdAt).toLocaleString()}</p>
                            </div>
                            <Badge variant={adj.adjustmentType === 'add' ? 'default' : 'destructive'}>
                              {adj.adjustmentType}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>System Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Trading System</span>
                          <Badge className="bg-green-100 text-green-800">Online</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>User Registration</span>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Deposit Processing</span>
                          <Badge className="bg-green-100 text-green-800">Running</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>API Services</span>
                          <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Enhanced User Management */}
            {activeSection === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search users by name, email, or username..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Users
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add User
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New User</DialogTitle>
                          <DialogDescription>Create a new user account</DialogDescription>
                        </DialogHeader>
                        {/* Add user form would go here */}
                        <DialogFooter>
                          <Button>Create User</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                          <tr>
                            <th className="text-left p-4">User</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Balance</th>
                            <th className="text-left p-4">Transactions</th>
                            <th className="text-left p-4">Joined</th>
                            <th className="text-right p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user: User) => (
                            <tr key={user.id} className="border-t border-slate-200 dark:border-slate-700">
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                      {user.firstName?.[0]}{user.lastName?.[0]}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-semibold">{user.firstName} {user.lastName}</p>
                                    <p className="text-sm text-slate-500">{user.email}</p>
                                    <p className="text-xs text-slate-400">@{user.username}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                  {user.isActive ? 'Active' : 'Suspended'}
                                </Badge>
                                {user.role === 'admin' && (
                                  <Badge className="ml-1 bg-purple-100 text-purple-800">Admin</Badge>
                                )}
                              </td>
                              <td className="p-4">
                                <p className="font-semibold">${user.portfolio?.totalValue || '0.00'}</p>
                                <p className="text-sm text-slate-500">Cash: ${user.portfolio?.availableCash || '0.00'}</p>
                              </td>
                              <td className="p-4">
                                <p className="font-semibold">{user.totalTransactions || 0}</p>
                                <p className="text-sm text-slate-500">Total trades</p>
                              </td>
                              <td className="p-4">
                                <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                              </td>
                              <td className="p-4">
                                <div className="flex justify-end space-x-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setSelectedUser(user)}
                                      >
                                        <DollarSign className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Adjust Balance - {user.firstName} {user.lastName}</DialogTitle>
                                        <DialogDescription>
                                          Current balance: ${user.portfolio?.totalValue || '0.00'}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div>
                                          <label className="text-sm font-medium">Adjustment Type</label>
                                          <Select 
                                            value={balanceAdjustment.type} 
                                            onValueChange={(value: any) => setBalanceAdjustment(prev => ({...prev, type: value}))}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="add">Add Funds</SelectItem>
                                              <SelectItem value="remove">Remove Funds</SelectItem>
                                              <SelectItem value="set">Set Balance</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Amount ($)</label>
                                          <Input
                                            type="number"
                                            placeholder="Enter amount"
                                            value={balanceAdjustment.amount}
                                            onChange={(e) => setBalanceAdjustment(prev => ({...prev, amount: e.target.value}))}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Reason</label>
                                          <Textarea
                                            placeholder="Enter reason for adjustment"
                                            value={balanceAdjustment.reason}
                                            onChange={(e) => setBalanceAdjustment(prev => ({...prev, reason: e.target.value}))}
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button 
                                          onClick={handleBalanceAdjustment}
                                          disabled={adjustBalanceMutation.isPending}
                                        >
                                          {adjustBalanceMutation.isPending ? 'Processing...' : 'Apply Adjustment'}
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => forceLogoutMutation.mutate(user.id)}
                                    disabled={forceLogoutMutation.isPending}
                                  >
                                    <Lock className="h-4 w-4" />
                                  </Button>

                                  {user.isActive ? (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                          <Ban className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Suspend User</DialogTitle>
                                          <DialogDescription>
                                            Suspend {user.firstName} {user.lastName}?
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <div>
                                            <Label htmlFor="suspension-reason">Reason for suspension</Label>
                                            <Textarea 
                                              id="suspension-reason"
                                              placeholder="Reason for suspension..." 
                                            />
                                          </div>
                                        </div>
                                        <DialogFooter>
                                          <Button 
                                            variant="destructive"
                                            onClick={() => handleSuspendUser(user, 'Admin suspension')}
                                          >
                                            Suspend User
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => reactivateUserMutation.mutate(user.id)}
                                    >
                                      <UserCheck className="h-4 w-4" />
                                    </Button>
                                  )}

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-4 border-t">
                      <div className="text-sm text-slate-500">
                        Showing {users.length} of {totalUsers} users
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          disabled={users.length < 20}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Transaction Management */}
            {activeSection === 'transactions' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Management</CardTitle>
                    <CardDescription>Monitor and control all platform transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Transaction ID</th>
                            <th className="text-left p-2">User</th>
                            <th className="text-left p-2">Type</th>
                            <th className="text-left p-2">Symbol</th>
                            <th className="text-left p-2">Amount</th>
                            <th className="text-left p-2">Total</th>
                            <th className="text-left p-2">Status</th>
                            <th className="text-left p-2">Date</th>
                            <th className="text-right p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((tx: Transaction) => (
                            <tr key={tx.id} className="border-b">
                              <td className="p-2 font-mono text-sm">{tx.id.slice(0, 8)}...</td>
                              <td className="p-2">{tx.userId.slice(0, 8)}...</td>
                              <td className="p-2">
                                <Badge variant={tx.type === 'buy' ? 'default' : 'secondary'}>
                                  {tx.type.toUpperCase()}
                                </Badge>
                              </td>
                              <td className="p-2">{tx.symbol}</td>
                              <td className="p-2">{tx.amount}</td>
                              <td className="p-2">${tx.total}</td>
                              <td className="p-2">
                                <Badge className="bg-green-100 text-green-800">{tx.status}</Badge>
                              </td>
                              <td className="p-2">{new Date(tx.createdAt).toLocaleString()}</td>
                              <td className="p-2 text-right">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <RotateCcw className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Reverse Transaction</DialogTitle>
                                      <DialogDescription>
                                        This will create a reverse transaction for {tx.symbol}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="reversal-reason">Reason for reversal</Label>
                                        <Textarea 
                                          id="reversal-reason"
                                          placeholder="Reason for reversal..." 
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button 
                                        variant="destructive"
                                        onClick={() => reverseTransactionMutation.mutate({
                                          transactionId: tx.id,
                                          reason: 'Admin reversal'
                                        })}
                                      >
                                        Reverse Transaction
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Other sections placeholder */}
            {!['dashboard', 'users', 'transactions'].includes(activeSection) && (
              <Card>
                <CardHeader>
                  <CardTitle>{sidebarItems.find(item => item.id === activeSection)?.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">This section is under development</p>
                    <p className="text-sm text-slate-400 mt-2">Advanced features coming soon</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}