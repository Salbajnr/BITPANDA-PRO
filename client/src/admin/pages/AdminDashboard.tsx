
import { useAdminAuth } from "@/admin/hooks/useAdminAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { adminApiRequest } from "@/admin/lib/adminApiClient";
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
import AdminRiskManagement from '@/components/AdminRiskManagement';
import AdminComplianceDashboard from '@/components/AdminComplianceDashboard';
import AdminServerMonitoring from '@/components/AdminServerMonitoring';
import { cn } from '@/lib/utils';

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
  const { admin, isLoading: authLoading } = useAdminAuth();
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
    queryKey: [`/users?page=${currentPage}&search=${encodeURIComponent(searchTerm)}&status=${userStatusFilter}&role=${userRoleFilter}`],
    queryFn: () => adminApiRequest("GET", `/users?page=${currentPage}&search=${encodeURIComponent(searchTerm)}&status=${userStatusFilter}&role=${userRoleFilter}`),
    retry: 1,
  });

  // Fetch analytics overview
  const { data: analyticsOverviewData } = useQuery({
    queryKey: ["/analytics/overview"],
    queryFn: () => adminApiRequest("GET", "/analytics/overview"),
    retry: 1,
  });

  // Fetch transactions
  const { data: transactionsDataQuery } = useQuery({
    queryKey: [`/transactions?page=${currentPage}&limit=20&type=${transactionTypeFilter}&status=${transactionStatusFilter}&user=${encodeURIComponent(transactionUserSearch)}`],
    queryFn: () => adminApiRequest("GET", `/transactions?page=${currentPage}&limit=20&type=${transactionTypeFilter}&status=${transactionStatusFilter}&user=${encodeURIComponent(transactionUserSearch)}`),
    retry: 1,
  });

  // Fetch balance adjustments
  const { data: adjustmentsData } = useQuery({
    queryKey: ["/balance-adjustments"],
    queryFn: () => adminApiRequest("GET", "/balance-adjustments"),
    retry: 1,
  });

  // Balance adjustment mutation
  const adjustBalanceMutation = useMutation({
    mutationFn: (data: any) => adminApiRequest("POST", "/balance-adjustment", data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Balance adjusted successfully",
      });
      refetchUsers();
      setSelectedUser(null);
      setBalanceAdjustment({ type: 'add', amount: '', reason: '' });
      queryClient.invalidateQueries({ queryKey: ["/users"] });
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
      adminApiRequest("POST", `/users/${userId}/suspend`, { reason }),
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
      adminApiRequest("POST", `/users/${userId}/reactivate`),
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
      adminApiRequest("DELETE", `/users/${userId}`),
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
      adminApiRequest("POST", `/security/force-logout/${userId}`),
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
      adminApiRequest("POST", `/transactions/${transactionId}/reverse`, { reason }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction reversed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/transactions"] });
    },
  });

  useEffect(() => {
    if (!authLoading && !admin) {
      toast({
        title: "Access Denied",
        description: "Admin access required",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 500);
      return;
    }
  }, [admin, authLoading, toast]);

  const handleSaveSettings = async () => {
    try {
      await adminApiRequest('PATCH', '/settings', platformSettings);
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">You don't have admin access</p>
          <Button onClick={() => window.location.href = '/auth'}>Go to Login</Button>
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
                  <a href="/admin/news" className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors">
                    News Mgmt
                  </a>
                  <a href="/admin/withdrawals" className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors">
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

            {/* Other sections would be here... */}
            {activeSection === 'users' && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">User Management</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Navigate to <a href="/admin/users" className="text-primary underline">/admin/users</a> for full user management
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
