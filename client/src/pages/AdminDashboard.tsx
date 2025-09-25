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
  AlertTriangle, UserCheck, Lock, Unlock, RefreshCw, CreditCard, Save, UserPlus,
  FileText, Banknote, Award, ShieldCheck, Mail, XCircle, CheckCircleIcon, XCircleIcon, Monitor
} from "lucide-react";
import logoPath from '@/assets/logo.jpeg';
import AdminSystemHealthMonitor from '@/components/AdminSystemHealthMonitor';
import AdminUserActivityTracker from '@/components/AdminUserActivityTracker';
import AdminQuickActions from '@/components/AdminQuickActions';
import AdminRiskManagement from '@/components/AdminRiskManagement'; // Assuming this component exists
import AdminComplianceDashboard from '@/components/AdminComplianceDashboard'; // Assuming this component exists
import AdminServerMonitoring from '@/components/AdminServerMonitoring'; // Assuming this component exists

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
  username?: string;
  email?: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState('dashboard');

  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Enhanced state for user management
  const [searchTerm, setSearchTerm] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Selected user and balance adjustment state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [balanceAdjustment, setBalanceAdjustment] = useState({
    type: 'add',
    amount: '',
    reason: ''
  });

  // Analytics state
  const [analyticsPeriod, setAnalyticsPeriod] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState({
    userRegistrations: [],
    transactionVolume: [],
    topAssets: []
  });

  // Transaction monitoring state
  const [transactionsData, setTransactionsData] = useState({
    transactions: [],
    pagination: { page: 1, limit: 20, total: 0, pages: 0 }
  });
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('');
  const [transactionStatusFilter, setTransactionStatusFilter] = useState('');
  const [transactionUserSearch, setTransactionUserSearch] = useState('');

  // Platform settings state
  const [platformSettings, setPlatformSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    tradingEnabled: true,
    kycRequired: true,
    tradingFeePercentage: 0.1,
    withdrawalFeePercentage: 0.5,
    minDepositAmount: 10,
    maxWithdrawalAmount: 50000
  });

  // Fetch users with pagination
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: [`/api/admin/users?page=${currentPage}&search=${encodeURIComponent(searchTerm)}&status=${userStatusFilter}&role=${userRoleFilter}`],
    retry: 1,
  });

  // Fetch analytics overview
  const { data: analyticsOverviewData } = useQuery({
    queryKey: ["/api/admin/analytics/overview"],
    retry: 1,
  });

  // Fetch transactions
  const { data: transactionsDataQuery } = useQuery({
    queryKey: [`/api/admin/transactions?page=${currentPage}&limit=20&type=${transactionTypeFilter}&status=${transactionStatusFilter}&user=${encodeURIComponent(transactionUserSearch)}`],
    retry: 1,
  });

  // Fetch balance adjustments
  const { data: adjustmentsData } = useQuery({
    queryKey: ["/api/admin/balance-adjustments"],
    retry: 1,
  });

  // Balance adjustment mutation
  const adjustBalanceMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/balance-adjustment", data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Balance adjusted successfully",
      });
      refetchUsers();
      setSelectedUser(null);
      setBalanceAdjustment({ type: 'add', amount: '', reason: '' });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
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
      apiRequest("POST", `/api/admin/users/${userId}/suspend`, { reason }),
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
      apiRequest("POST", `/api/admin/users/${userId}/reactivate`),
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
      apiRequest("DELETE", `/api/admin/users/${userId}`),
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
      apiRequest("POST", `/api/admin/security/force-logout/${userId}`),
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
      apiRequest("POST", `/api/admin/transactions/${transactionId}/reverse`, { reason }),
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

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(platformSettings),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Settings saved successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Error saving settings",
        variant: "destructive",
      });
    }
  };

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
    { id: 'kyc', label: 'KYC Management', icon: ShieldCheck },
    { id: 'transactions', label: 'Transaction Control', icon: Activity },
    { id: 'analytics', label: 'Platform Analytics', icon: TrendingUp },
    { id: 'system-health', label: 'System Health', icon: Activity },
    { id: 'user-activity', label: 'User Activity', icon: Users },
    { id: 'quick-actions', label: 'Quick Actions', icon: CheckSquare },
    { id: 'security', label: 'Security Center', icon: Shield },
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'api-management', label: 'API Management', icon: CreditCard },
    { id: 'risk-management', label: 'Risk Management', icon: Shield },
    { id: 'compliance', label: 'Compliance', icon: Award },
    { id: 'server-monitoring', label: 'Server Monitoring', icon: Monitor },
    { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
  ];

  const usersList = (usersData as any)?.users || [];
  const totalUsers = (usersData as any)?.pagination?.total || 0;
  const transactions = (transactionsDataQuery as any)?.transactions || [];
  const analyticsOverview = analyticsOverviewData || {};
  const adjustments = (adjustmentsData as any)?.adjustments || [];

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
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => queryClient.invalidateQueries()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Data
                </Button>
                <div className="hidden md:flex items-center space-x-2">
                  <a href="/admin/balance-management" className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-lg hover:bg-orange-200 transition-colors">
                    Balance Mgmt
                  </a>
                  <a href="/admin/news-management" className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors">
                    News Mgmt
                  </a>
                  <a href="/admin/withdrawal-management" className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors">
                    Withdrawals
                  </a>
                  <a href="/admin/kyc" className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors">
                    KYC Management
                  </a>
                </div>
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
                          <p className="text-3xl font-bold">{(analyticsOverview as any)?.totalUsers?.toLocaleString() || '0'}</p>
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
                          <p className="text-3xl font-bold">${((analyticsOverview as any)?.totalVolume / 1000000)?.toFixed(1) || '0'}M</p>
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
                          <p className="text-3xl font-bold">{(analyticsOverview as any)?.totalTransactions?.toLocaleString() || '0'}</p>
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
                          <p className="text-3xl font-bold">{(analyticsOverview as any)?.totalDeposits?.toLocaleString() || '0'}</p>
                        </div>
                        <DollarSign className="h-12 w-12 text-orange-200" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>

                {/* User Filters */}
                <div className="flex gap-4">
                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* User Table */}
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
                          {usersList.map((user: User) => (
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

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => reactivateUserMutation.mutate(user.id)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <UserCheck className="h-4 w-4" />
                                  </Button>

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
                        Showing {usersList.length} of {totalUsers} users
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
                          disabled={usersList.length < 20}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Transaction Monitoring Section */}
            {activeSection === 'transactions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction Monitoring</h2>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                {/* Transaction Filters */}
                <div className="flex gap-4">
                  <select
                    value={transactionTypeFilter}
                    onChange={(e) => setTransactionTypeFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="">All Types</option>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
                  <select
                    value={transactionStatusFilter}
                    onChange={(e) => setTransactionStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                  <Input
                    placeholder="Search by user..."
                    value={transactionUserSearch}
                    onChange={(e) => setTransactionUserSearch(e.target.value)}
                    className="w-64"
                  />
                </div>

                {/* Transactions Table */}
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Asset
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Value
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {transactions.map((transaction: Transaction) => (
                            <tr key={transaction.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium">{transaction.username}</div>
                                  <div className="text-sm text-gray-500">{transaction.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={transaction.type === 'buy' ? 'default' : 'secondary'}>
                                  {transaction.type?.toUpperCase()}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {transaction.symbol}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {parseFloat(transaction.amount || '0').toFixed(8)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                ${parseFloat(transaction.total || '0').toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge
                                  variant={
                                    transaction.status === 'completed' ? 'default' :
                                    transaction.status === 'pending' ? 'secondary' : 'destructive'
                                  }
                                >
                                  {transaction.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      View Details
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Reverse Transaction</DialogTitle>
                                      <DialogDescription>
                                        This will create a reverse transaction for {transaction.symbol}
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
                                          transactionId: transaction.id,
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

            {/* Advanced Analytics Section */}
            {activeSection === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Analytics</h2>

                {/* Analytics Period Selector */}
                <div className="flex gap-2">
                  {['7d', '30d', '90d'].map((period) => (
                    <Button
                      key={period}
                      variant={analyticsPeriod === period ? 'default' : 'outline'}
                      onClick={() => setAnalyticsPeriod(period)}
                    >
                      {period.toUpperCase()}
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* User Registration Trends */}
                  <Card>
                    <CardHeader>
                      <CardTitle>User Registrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-gray-500">
                        {analyticsData.userRegistrations ? (
                          <div className="w-full">
                            <p>Daily registrations over {analyticsPeriod}</p>
                            {/* Chart would be rendered here */}
                          </div>
                        ) : (
                          "Loading user registration data..."
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Transaction Volume */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Transaction Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-gray-500">
                        {analyticsData.transactionVolume ? (
                          <div className="w-full">
                            <p>Trading volume over {analyticsPeriod}</p>
                            {/* Chart would be rendered here */}
                          </div>
                        ) : (
                          "Loading transaction volume data..."
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Assets */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Most Traded Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analyticsData.topAssets && analyticsData.topAssets.length > 0 ? (
                        <div className="space-y-3">
                          {analyticsData.topAssets.slice(0, 5).map((asset: any, index) => (
                            <div key={asset.symbol} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <span className="font-semibold text-lg">#{index + 1}</span>
                                <span className="font-medium">{asset.symbol}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">${parseFloat(asset.totalVolume || '0').toLocaleString()}</div>
                                <div className="text-sm text-gray-500">{asset.transactionCount} trades</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Loading top assets data...</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Security Center Section */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-100">Security Alerts</p>
                          <p className="text-3xl font-bold">3</p>
                        </div>
                        <AlertTriangle className="h-12 w-12 text-red-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100">Failed Logins</p>
                          <p className="text-3xl font-bold">47</p>
                        </div>
                        <Lock className="h-12 w-12 text-orange-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100">Active Sessions</p>
                          <p className="text-3xl font-bold">1,247</p>
                        </div>
                        <UserCheck className="h-12 w-12 text-green-200" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Security Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { event: 'Multiple failed login attempts', user: 'user@example.com', time: '2 minutes ago', severity: 'high' },
                          { event: 'Unusual login location', user: 'jane@example.com', time: '15 minutes ago', severity: 'medium' },
                          { event: 'Password changed', user: 'admin@example.com', time: '1 hour ago', severity: 'low' },
                          { event: 'Large withdrawal attempted', user: 'trader@example.com', time: '2 hours ago', severity: 'high' },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                item.severity === 'high' ? 'bg-red-500' :
                                item.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                              <div>
                                <p className="font-medium">{item.event}</p>
                                <p className="text-sm text-slate-500">{item.user}</p>
                              </div>
                            </div>
                            <span className="text-xs text-slate-500">{item.time}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Security Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button className="w-full justify-start" variant="outline">
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend Suspicious Account
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Shield className="h-4 w-4 mr-2" />
                          Enable 2FA for All Users
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Lock className="h-4 w-4 mr-2" />
                          Force Password Reset
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <UserCheck className="h-4 w-4 mr-2" />
                          Review KYC Documents
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* System Settings Section */}
            {activeSection === 'system' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Platform Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Maintenance Mode</label>
                        <input 
                          type="checkbox"
                          checked={platformSettings.maintenanceMode}
                          onChange={(e) => setPlatformSettings({
                            ...platformSettings,
                            maintenanceMode: e.target.checked
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Registration Enabled</label>
                        <input 
                          type="checkbox"
                          checked={platformSettings.registrationEnabled}
                          onChange={(e) => setPlatformSettings({
                            ...platformSettings,
                            registrationEnabled: e.target.checked
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Trading Enabled</label>
                        <input 
                          type="checkbox"
                          checked={platformSettings.tradingEnabled}
                          onChange={(e) => setPlatformSettings({
                            ...platformSettings,
                            tradingEnabled: e.target.checked
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">KYC Required</label>
                        <input 
                          type="checkbox"
                          checked={platformSettings.kycRequired}
                          onChange={(e) => setPlatformSettings({
                            ...platformSettings,
                            kycRequired: e.target.checked
                          })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Fee Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Fee Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Trading Fee (%)</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={platformSettings.tradingFeePercentage}
                          onChange={(e) => setPlatformSettings({
                            ...platformSettings,
                            tradingFeePercentage: parseFloat(e.target.value)
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Withdrawal Fee (%)</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={platformSettings.withdrawalFeePercentage}
                          onChange={(e) => setPlatformSettings({
                            ...platformSettings,
                            withdrawalFeePercentage: parseFloat(e.target.value)
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Min Deposit Amount</label>
                        <Input
                          type="number"
                          value={platformSettings.minDepositAmount}
                          onChange={(e) => setPlatformSettings({
                            ...platformSettings,
                            minDepositAmount: parseFloat(e.target.value)
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Max Withdrawal Amount</label>
                        <Input
                          type="number"
                          value={platformSettings.maxWithdrawalAmount}
                          onChange={(e) => setPlatformSettings({
                            ...platformSettings,
                            maxWithdrawalAmount: parseFloat(e.target.value)
                          })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings} className="bg-green-500 hover:bg-green-600">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </div>
            )}

            {/* System Health Section */}
            {activeSection === 'system-health' && (
              <AdminSystemHealthMonitor />
            )}

            {/* Server Monitoring Section */}
            {activeSection === 'server-monitoring' && (
              <AdminServerMonitoring />
            )}

            {/* User Activity Section */}
            {activeSection === 'user-activity' && <AdminUserActivityTracker />}

            {/* Quick Actions Section */}
            {activeSection === 'quick-actions' && <AdminQuickActions />}

            {/* API Management Section */}
            {activeSection === 'api-management' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Active API Keys</p>
                          <p className="text-3xl font-bold">247</p>
                        </div>
                        <CreditCard className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">API Calls Today</p>
                          <p className="text-3xl font-bold">1.2M</p>
                        </div>
                        <Activity className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Rate Limited</p>
                          <p className="text-3xl font-bold">12</p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Error Rate</p>
                          <p className="text-3xl font-bold">0.2%</p>
                        </div>
                        <XCircle className="h-8 w-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top API Endpoints</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { endpoint: '/api/crypto/market-data', calls: '245K', avgTime: '120ms' },
                          { endpoint: '/api/portfolio', calls: '189K', avgTime: '340ms' },
                          { endpoint: '/api/trading/order', calls: '156K', avgTime: '450ms' },
                          { endpoint: '/api/user/auth', calls: '98K', avgTime: '230ms' },
                          { endpoint: '/api/admin/users', calls: '12K', avgTime: '180ms' }
                        ].map((api, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{api.endpoint}</p>
                              <p className="text-xs text-slate-500">{api.calls} calls today</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{api.avgTime}</p>
                              <p className="text-xs text-slate-500">avg response</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>API Key Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button className="w-full justify-start" variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Generate New API Key
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View API Documentation
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure Rate Limits
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Ban className="h-4 w-4 mr-2" />
                          Revoke Suspended Keys
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Notification Center Section */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Pending Notifications</p>
                          <p className="text-3xl font-bold">47</p>
                        </div>
                        <Bell className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Sent Today</p>
                          <p className="text-3xl font-bold">1,247</p>
                        </div>
                        <Mail className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Failed Delivery</p>
                          <p className="text-3xl font-bold">12</p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Broadcast Notification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="notification-type">Notification Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select notification type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="system">System Maintenance</SelectItem>
                            <SelectItem value="security">Security Alert</SelectItem>
                            <SelectItem value="promotion">Promotion</SelectItem>
                            <SelectItem value="update">Platform Update</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="notification-title">Title</Label>
                        <Input placeholder="Enter notification title..." />
                      </div>

                      <div>
                        <Label htmlFor="notification-message">Message</Label>
                        <Textarea placeholder="Enter notification message..." rows={4} />
                      </div>

                      <div className="flex space-x-3">
                        <Button className="flex-1">
                          <Bell className="h-4 w-4 mr-2" />
                          Send to All Users
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Users className="h-4 w-4 mr-2" />
                          Send to Specific Users
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Audit Logs Section */}
            {activeSection === 'audit-logs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h2>
                  <div className="flex space-x-3">
                    <Select>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="login">User Login</SelectItem>
                        <SelectItem value="trade">Trading</SelectItem>
                        <SelectItem value="admin">Admin Actions</SelectItem>
                        <SelectItem value="security">Security Events</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Logs
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {[
                        { 
                          timestamp: '2024-01-15 14:30:25', 
                          user: 'admin@bitpanda.com', 
                          action: 'User balance adjusted', 
                          details: 'Added $1,000 to user john@example.com',
                          severity: 'medium',
                          ip: '192.168.1.100'
                        },
                        { 
                          timestamp: '2024-01-15 14:28:12', 
                          user: 'jane@example.com', 
                          action: 'Large withdrawal initiated', 
                          details: 'Withdrawal of $50,000 to bank account',
                          severity: 'high',
                          ip: '203.0.113.45'
                        },
                        { 
                          timestamp: '2024-01-15 14:25:08', 
                          user: 'trader@example.com', 
                          action: 'Multiple failed login attempts', 
                          details: '5 consecutive failed login attempts',
                          severity: 'high',
                          ip: '198.51.100.22'
                        },
                        { 
                          timestamp: '2024-01-15 14:20:33', 
                          user: 'admin@bitpanda.com', 
                          action: 'KYC document approved', 
                          details: 'Approved KYC for user mike@example.com',
                          severity: 'low',
                          ip: '192.168.1.100'
                        },
                        { 
                          timestamp: '2024-01-15 14:15:17', 
                          user: 'system', 
                          action: 'Automated price update', 
                          details: 'Updated market prices for 150 cryptocurrencies',
                          severity: 'low',
                          ip: 'internal'
                        }
                      ].map((log, index) => (
                        <div key={index} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 border-b">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${
                              log.severity === 'high' ? 'bg-red-500' :
                              log.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}></div>
                            <div>
                              <p className="font-medium">{log.action}</p>
                              <p className="text-sm text-slate-500">{log.details}</p>
                              <p className="text-xs text-slate-400">{log.user} • {log.ip}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{log.timestamp}</p>
                            <Badge variant={log.severity === 'high' ? 'destructive' : log.severity === 'medium' ? 'secondary' : 'default'}>
                              {log.severity}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Risk Management Section */}
            {activeSection === 'risk-management' && (
              <AdminRiskManagement />
            )}

            {/* Compliance Dashboard Section */}
            {activeSection === 'compliance' && (
              <AdminComplianceDashboard />
            )}

            {/* KYC Section */}
            {activeSection === 'kyc' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">KYC Verification Management</h2>
                  <Button onClick={() => window.open('/admin/kyc', '_blank')} className="bg-green-500 hover:bg-green-600">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Open Full KYC Management
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>KYC Overview</CardTitle>
                    <CardDescription>
                      Manage user identity verification requests and compliance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-gray-600">Pending</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-gray-600">Under Review</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircleIcon className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-gray-600">Approved</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <XCircleIcon className="h-8 w-8 mx-auto mb-2 text-red-500" />
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-gray-600">Rejected</div>
                      </div>
                    </div>

                    <div className="text-center py-8">
                      <ShieldCheck className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4">No KYC verifications pending review</p>
                      <Button onClick={() => window.open('/admin/kyc', '_blank')} variant="outline">
                        Open Full KYC Management Portal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Default/Placeholder Section */}
            {!['dashboard', 'users', 'transactions', 'analytics', 'system-health', 'user-activity', 'quick-actions', 'security', 'system', 'api-management', 'risk-management', 'compliance', 'server-monitoring', 'audit-logs', 'kyc'].includes(activeSection) && (
              <Card>
                <CardHeader>
                  <CardTitle>{sidebarItems.find(item => item.id === activeSection)?.label || 'Section'}</CardTitle>
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