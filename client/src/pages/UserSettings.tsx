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