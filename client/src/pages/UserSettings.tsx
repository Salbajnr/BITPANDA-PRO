import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  UserIcon, MailIcon, LockIcon, BellIcon, MoonIcon, SunIcon,
  ShieldIcon, CreditCardIcon, SaveIcon, EditIcon
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  tradingAlerts: boolean;
  priceAlerts: boolean;
  newsUpdates: boolean;
  marketingEmails: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
}

export default function UserSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'preferences'>('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: '',
    lastName: '',
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    tradingAlerts: true,
    priceAlerts: false,
    newsUpdates: true,
    marketingEmails: false,
  });
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: 24,
    loginNotifications: true,
  });
  
  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    setIsDarkMode(theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<UserProfile>) =>
      apiRequest('/api/auth/profile', { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: typeof passwordForm) =>
      apiRequest('/api/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    updatePasswordMutation.mutate(passwordForm);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldIcon },
    { id: 'preferences', label: 'Preferences', icon: CreditCardIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Account Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your account preferences and security settings
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <UserIcon className="h-4 w-4" />
          {user?.role?.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-primary/10 border-r-2 border-primary text-primary' 
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                    data-testid={`tab-${tab.id}`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                        data-testid="input-username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <LockIcon className="h-5 w-5" />
                      Change Password
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          data-testid="input-current-password"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          data-testid="input-new-password"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          data-testid="input-confirm-password"
                        />
                      </div>
                    </div>
                    <Button 
                      type="button"
                      onClick={handlePasswordSubmit}
                      disabled={updatePasswordMutation.isPending}
                      data-testid="button-change-password"
                    >
                      <LockIcon className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={updateProfileMutation.isPending} data-testid="button-save-profile">
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellIcon className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <Label htmlFor={key} className="text-base font-medium">
                          {key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
                        </Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                          {key === 'tradingAlerts' && 'Get notified when your trades are executed'}
                          {key === 'priceAlerts' && 'Receive alerts when prices reach your targets'}
                          {key === 'newsUpdates' && 'Stay updated with the latest crypto news'}
                          {key === 'marketingEmails' && 'Receive promotional content and offers'}
                        </p>
                      </div>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) =>
                          setNotificationSettings(prev => ({...prev, [key]: checked}))
                        }
                        data-testid={`switch-${key}`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldIcon className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorEnabled}
                      onCheckedChange={(checked) =>
                        setSecuritySettings(prev => ({...prev, twoFactorEnabled: checked}))
                      }
                      data-testid="switch-two-factor"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Login Notifications</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Get notified when someone logs into your account
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.loginNotifications}
                      onCheckedChange={(checked) =>
                        setSecuritySettings(prev => ({...prev, loginNotifications: checked}))
                      }
                      data-testid="switch-login-notifications"
                    />
                  </div>

                  <div>
                    <Label className="text-base font-medium">Session Timeout</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Automatically log out after inactivity (hours)
                    </p>
                    <Input
                      type="number"
                      min="1"
                      max="168"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) =>
                        setSecuritySettings(prev => ({...prev, sessionTimeout: parseInt(e.target.value)}))
                      }
                      className="w-32"
                      data-testid="input-session-timeout"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCardIcon className="h-5 w-5" />
                  App Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium flex items-center gap-2">
                        {isDarkMode ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
                        Dark Mode
                      </Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Switch between light and dark themes
                      </p>
                    </div>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={toggleTheme}
                      data-testid="switch-dark-mode"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff,
  Camera,
  Save,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Smartphone
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  country?: string;
  city?: string;
  avatar?: string;
}

interface NotificationSettings {
  emailNotifications: {
    priceAlerts: boolean;
    tradeExecutions: boolean;
    newsUpdates: boolean;
    marketAnalysis: boolean;
  };
  pushNotifications: {
    priceAlerts: boolean;
    tradeExecutions: boolean;
    securityAlerts: boolean;
  };
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
}

export default function UserSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  if (!user) {
    return <Redirect to="/auth" />;
  }

  const { data: profile, isLoading } = useQuery({
    queryKey: ['/api/user/profile'],
    queryFn: async () => {
      const response = await fetch('/api/user/profile', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    }
  });

  const { data: notificationSettings } = useQuery({
    queryKey: ['/api/user/notification-settings'],
    queryFn: async () => {
      const response = await fetch('/api/user/notification-settings', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch notification settings');
      return response.json();
    }
  });

  const { data: securitySettings } = useQuery({
    queryKey: ['/api/user/security-settings'],
    queryFn: async () => {
      const response = await fetch('/api/user/security-settings', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch security settings');
      return response.json();
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
    }
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: async (data: NotificationSettings) => {
      const response = await fetch('/api/user/notification-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update notification settings');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to change password');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  });

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Settings
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your account settings and preferences
              </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Preferences
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={profile?.avatar} />
                        <AvatarFallback className="text-lg">
                          {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          defaultValue={profile?.firstName}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          defaultValue={profile?.lastName}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        defaultValue={profile?.username}
                        placeholder="Enter your username"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          defaultValue={profile?.email}
                          placeholder="Enter your email"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          defaultValue={profile?.phone}
                          placeholder="Enter your phone number"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="country"
                            defaultValue={profile?.country}
                            placeholder="Enter your country"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="city"
                            defaultValue={profile?.city}
                            placeholder="Enter your city"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="dateOfBirth"
                          type="date"
                          defaultValue={profile?.dateOfBirth}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={() => updateProfileMutation.mutate({})}
                      disabled={updateProfileMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Price Alerts</Label>
                        <p className="text-sm text-gray-500">Get notified when prices reach your target</p>
                      </div>
                      <Switch defaultChecked={notificationSettings?.emailNotifications?.priceAlerts} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Trade Executions</Label>
                        <p className="text-sm text-gray-500">Notifications for completed trades</p>
                      </div>
                      <Switch defaultChecked={notificationSettings?.emailNotifications?.tradeExecutions} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>News Updates</Label>
                        <p className="text-sm text-gray-500">Latest cryptocurrency news and updates</p>
                      </div>
                      <Switch defaultChecked={notificationSettings?.emailNotifications?.newsUpdates} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Market Analysis</Label>
                        <p className="text-sm text-gray-500">Weekly market analysis and insights</p>
                      </div>
                      <Switch defaultChecked={notificationSettings?.emailNotifications?.marketAnalysis} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Push Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Price Alerts</Label>
                        <p className="text-sm text-gray-500">Instant notifications for price movements</p>
                      </div>
                      <Switch defaultChecked={notificationSettings?.pushNotifications?.priceAlerts} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Trade Executions</Label>
                        <p className="text-sm text-gray-500">Real-time trade confirmations</p>
                      </div>
                      <Switch defaultChecked={notificationSettings?.pushNotifications?.tradeExecutions} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Security Alerts</Label>
                        <p className="text-sm text-gray-500">Important security notifications</p>
                      </div>
                      <Switch defaultChecked={notificationSettings?.pushNotifications?.securityAlerts} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          placeholder="Enter current password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          placeholder="Enter new password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        placeholder="Confirm new password"
                      />
                    </div>

                    <Button 
                      onClick={handlePasswordChange}
                      disabled={changePasswordMutation.isPending}
                    >
                      Change Password
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch defaultChecked={securitySettings?.twoFactorEnabled} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Login Notifications</Label>
                        <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                      </div>
                      <Switch defaultChecked={securitySettings?.loginNotifications} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Display Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Language</Label>
                      <select className="w-full mt-1 p-2 border rounded-md">
                        <option value="en">English</option>
                        <option value="de">German</option>
                        <option value="fr">French</option>
                        <option value="es">Spanish</option>
                      </select>
                    </div>
                    <div>
                      <Label>Timezone</Label>
                      <select className="w-full mt-1 p-2 border rounded-md">
                        <option value="UTC">UTC</option>
                        <option value="CET">CET (Central European Time)</option>
                        <option value="EST">EST (Eastern Standard Time)</option>
                        <option value="PST">PST (Pacific Standard Time)</option>
                      </select>
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <select className="w-full mt-1 p-2 border rounded-md">
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Trading Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Advanced Trading Interface</Label>
                        <p className="text-sm text-gray-500">Show advanced trading tools and charts</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Sound Notifications</Label>
                        <p className="text-sm text-gray-500">Play sounds for trade executions and alerts</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-refresh Data</Label>
                        <p className="text-sm text-gray-500">Automatically refresh market data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
