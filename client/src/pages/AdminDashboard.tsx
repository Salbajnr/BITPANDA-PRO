
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, DollarSign, TrendingUp, Shield, Bell, Settings, 
  Search, Plus, ArrowUp, ArrowDown, Globe, CheckSquare,
  UserPlus, ArrowRightLeft, Megaphone, BarChart3, Edit, Trash2,
  Activity, MessageCircle, PieChart, Clock, ChevronLeft, ChevronRight,
  MoreHorizontal, Sun, Moon
} from "lucide-react";
import logoPath from '@/assets/logo.jpeg';

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    retry: false,
  });

  const { data: adjustments = [] } = useQuery({
    queryKey: ["/api/admin/adjustments"],
    retry: false,
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

  // Theme toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('admin-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('admin-theme', 'dark');
    }
  };

  if (authLoading || usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const totalUsers = users.length;
  const totalPortfolioValue = users.reduce((sum: number, u: any) => sum + (parseFloat(u.portfolio?.totalValue || '0')), 0);
  const recentAdjustments = adjustments.slice(0, 5);
  const activeSessions = Math.floor(totalUsers * 0.7);
  const pendingActions = 12;

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'balance', label: 'Balance Simulation', icon: DollarSign },
    { id: 'transactions', label: 'Transaction Management', icon: ArrowRightLeft },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'news', label: 'News Feed Management', icon: MessageCircle },
    { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
  ];

  const getPageTitle = () => {
    const item = sidebarItems.find(item => item.id === activeSection);
    return item ? item.label : 'Admin Dashboard';
  };

  const filteredUsers = users.filter((u: any) => 
    u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock chart data
  const chartData = [
    { day: 'Mon', value: 120 },
    { day: 'Tue', value: 200 },
    { day: 'Wed', value: 150 },
    { day: 'Thu', value: 170 },
    { day: 'Fri', value: 220 },
    { day: 'Sat', value: 180 },
    { day: 'Sun', value: 250 }
  ];
  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
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

      {/* Crypto grid background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30" 
           style={{
             backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(93,92,222,0.1) 1px, transparent 0)',
             backgroundSize: '40px 40px'
           }}>
      </div>

      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-lg">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={logoPath} alt="BITPANDA PRO" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">BITPANDA PRO Admin</span>
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
                        ? 'bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary dark:text-primary font-medium shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 hover:shadow-sm'
                    }`}
                  >
                    <IconComponent className={`mr-3 h-5 w-5 ${
                      activeSection === item.id ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
                    }`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="p-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div className="ml-3">
                <div className="font-medium text-slate-900 dark:text-white">Admin User</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between px-8 py-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getPageTitle()}</h1>
              </div>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Bell className="h-6 w-6 text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
                <div className="relative">
                  <Settings className="h-6 w-6 text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors" />
                </div>
                
                {/* Theme Toggle */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleTheme}
                    className="relative w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow-md transform transition-transform duration-300 ${
                      isDarkMode ? 'translate-x-7' : 'translate-x-0'
                    }`}>
                      {isDarkMode ? (
                        <Moon className="w-4 h-4 text-slate-700 m-1" />
                      ) : (
                        <Sun className="w-4 h-4 text-yellow-500 m-1" />
                      )}
                    </div>
                  </button>
                </div>
                
                <div className="w-px h-8 bg-slate-200 dark:border-slate-700"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-900">
            {/* Dashboard Section */}
            {activeSection === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="transition-all hover:shadow-lg hover:scale-105 duration-200 border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 mb-2 text-sm">Total Users</div>
                          <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalUsers.toLocaleString()}</div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center">
                          <Users className="text-primary text-xl" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center text-sm text-green-500">
                          <ArrowUp className="mr-1 h-4 w-4" />
                          <span>12.4% increase</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="transition-all hover:shadow-lg hover:scale-105 duration-200 border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 mb-2 text-sm">Simulated Volume</div>
                          <div className="text-3xl font-bold text-slate-900 dark:text-white">${(totalPortfolioValue / 1000000).toFixed(1)}M</div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center">
                          <BarChart3 className="text-green-500 text-xl" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center text-sm text-green-500">
                          <ArrowUp className="mr-1 h-4 w-4" />
                          <span>8.2% increase</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="transition-all hover:shadow-lg hover:scale-105 duration-200 border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 mb-2 text-sm">Active Sessions</div>
                          <div className="text-3xl font-bold text-slate-900 dark:text-white">{activeSessions.toLocaleString()}</div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
                          <Globe className="text-blue-500 text-xl" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center text-sm text-red-500">
                          <ArrowDown className="mr-1 h-4 w-4" />
                          <span>3.1% decrease</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="transition-all hover:shadow-lg hover:scale-105 duration-200 border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 mb-2 text-sm">Pending Actions</div>
                          <div className="text-3xl font-bold text-slate-900 dark:text-white">{pendingActions}</div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 flex items-center justify-center">
                          <CheckSquare className="text-yellow-500 text-xl" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center text-sm text-green-500">
                          <ArrowUp className="mr-1 h-4 w-4" />
                          <span>5.3% increase</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">Platform Activity</CardTitle>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Last 7 days</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-end space-x-3 px-4">
                        {chartData.map((data, index) => {
                          const height = (data.value / maxValue) * 200;
                          return (
                            <div key={data.day} className="flex flex-col items-center flex-1">
                              <div
                                className="w-full rounded-t-lg transition-all duration-700 ease-out"
                                style={{
                                  height: `${height}px`,
                                  background: 'linear-gradient(to top, #5D5CDE, #22C55E)',
                                  animationDelay: `${index * 100}ms`
                                }}
                              ></div>
                              <div className="text-slate-500 dark:text-slate-400 text-sm mt-2">{data.day}</div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">Recent Activity</CardTitle>
                        <Button variant="link" className="text-primary p-0 hover:text-primary/80">View all</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center mr-3">
                            <UserPlus className="text-primary h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">New user registered</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">John Doe signed up 2 hours ago</div>
                          </div>
                        </div>
                        <div className="flex items-start p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center mr-3">
                            <ArrowRightLeft className="text-green-500 h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">Large trade executed</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">BTC/USD trade of $250,000 completed</div>
                          </div>
                        </div>
                        <div className="flex items-start p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500/10 to-orange-500/10 flex items-center justify-center mr-3">
                            <Megaphone className="text-yellow-500 h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">New announcement</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">"System Maintenance" published</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                  <CardHeader>
                    <CardTitle className="text-xl">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button variant="outline" className="h-24 flex flex-col bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-md transition-all duration-200">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center mb-2">
                          <UserPlus className="text-primary h-5 w-5" />
                        </div>
                        <span className="text-slate-900 dark:text-white">Add User</span>
                      </Button>
                      <Button variant="outline" className="h-24 flex flex-col bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-md transition-all duration-200">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center mb-2">
                          <DollarSign className="text-green-500 h-5 w-5" />
                        </div>
                        <span className="text-slate-900 dark:text-white">Adjust Balances</span>
                      </Button>
                      <Button variant="outline" className="h-24 flex flex-col bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-md transition-all duration-200">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 flex items-center justify-center mb-2">
                          <Megaphone className="text-yellow-500 h-5 w-5" />
                        </div>
                        <span className="text-slate-900 dark:text-white">Post Announcement</span>
                      </Button>
                      <Button variant="outline" className="h-24 flex flex-col bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-md transition-all duration-200">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mb-2">
                          <BarChart3 className="text-blue-500 h-5 w-5" />
                        </div>
                        <span className="text-slate-900 dark:text-white">Generate Report</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* User Management Section */}
            {activeSection === 'users' && (
              <div className="animate-in fade-in duration-500">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-2xl">User Management</CardTitle>
                      <div className="flex space-x-3">
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary"
                          />
                          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        </div>
                        <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md">
                          <Plus className="mr-2 h-4 w-4" /> Add User
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-700">
                            <th className="pb-3 font-medium">User</th>
                            <th className="pb-3 font-medium">Email</th>
                            <th className="pb-3 font-medium">Status</th>
                            <th className="pb-3 font-medium">Balance</th>
                            <th className="pb-3 font-medium">Joined</th>
                            <th className="pb-3 text-right font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user: any, index: number) => (
                            <tr key={user.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="py-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center mr-3">
                                    <span className="text-white font-medium text-sm">
                                      {user.firstName?.[0]}{user.lastName?.[0]}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-slate-900 dark:text-white">
                                      {user.firstName} {user.lastName}
                                    </div>
                                    <div className="text-sm text-slate-500">ID: {user.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 text-slate-600 dark:text-slate-400">{user.email}</td>
                              <td className="py-4">
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                  Active
                                </Badge>
                              </td>
                              <td className="py-4 text-slate-600 dark:text-slate-400 font-medium">
                                ${user.portfolio?.totalValue || '0.00'}
                              </td>
                              <td className="py-4 text-slate-600 dark:text-slate-400">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-4 text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-slate-500 dark:text-slate-400">Showing 1-{filteredUsers.length} of {totalUsers} users</div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="w-8 h-8 p-0 bg-primary text-white">1</Button>
                        <Button variant="outline" size="sm" className="w-8 h-8 p-0">2</Button>
                        <Button variant="outline" size="sm" className="w-8 h-8 p-0">3</Button>
                        <Button variant="outline" size="sm" className="w-8 h-8 p-0">4</Button>
                        <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Balance Simulation Section */}
            {activeSection === 'balance' && (
              <div className="animate-in fade-in duration-500">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-2xl">Balance Simulation</CardTitle>
                      <CardDescription>Adjust user balances for simulation purposes</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {recentAdjustments.length > 0 ? recentAdjustments.map((adj: any) => (
                        <div key={adj.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                              adj.adjustmentType === 'add' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' :
                              adj.adjustmentType === 'remove' ? 'bg-red-100 text-red-600 dark:bg-red-900/20' :
                              'bg-blue-100 text-blue-600 dark:bg-blue-900/20'
                            }`}>
                              <DollarSign className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {adj.adjustmentType.charAt(0).toUpperCase() + adj.adjustmentType.slice(1)} ${adj.amount}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {new Date(adj.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant={adj.adjustmentType === 'add' ? 'default' : 'destructive'} className="capitalize">
                            {adj.adjustmentType}
                          </Badge>
                        </div>
                      )) : (
                        <div className="text-center py-8">
                          <DollarSign className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                          <p className="text-slate-500">No balance adjustments yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Placeholder for other sections */}
            {!['dashboard', 'users', 'balance'].includes(activeSection) && (
              <div className="animate-in fade-in duration-500">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                  <CardHeader>
                    <CardTitle className="text-2xl">{getPageTitle()}</CardTitle>
                    <CardDescription>This section is coming soon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500">This feature is under development</p>
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
