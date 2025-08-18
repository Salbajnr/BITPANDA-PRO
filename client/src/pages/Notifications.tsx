import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Mail, 
  Smartphone,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Trash2,
  MarkAsRead
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'price_alert' | 'trade_execution' | 'news' | 'system' | 'security';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
}

interface NotificationSettings {
  email: {
    priceAlerts: boolean;
    tradeExecutions: boolean;
    news: boolean;
    systemUpdates: boolean;
    securityAlerts: boolean;
  };
  push: {
    priceAlerts: boolean;
    tradeExecutions: boolean;
    news: boolean;
    systemUpdates: boolean;
    securityAlerts: boolean;
  };
  frequency: 'instant' | 'hourly' | 'daily' | 'weekly';
}

export default function Notifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  if (!user) {
    return <Redirect to="/auth" />;
  }

  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications', filter],
    queryFn: async () => {
      const response = await fetch(`/api/notifications?filter=${filter}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return response.json();
    }
  });

  const { data: settings } = useQuery({
    queryKey: ['/api/notifications/settings'],
    queryFn: async () => {
      const response = await fetch('/api/notifications/settings', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch notification settings');
      return response.json();
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to mark notification as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to mark all notifications as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to delete notification');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: NotificationSettings) => {
      const response = await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newSettings)
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/settings'] });
      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been saved",
      });
    }
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'price_alert':
        return <TrendingUp className="h-4 w-4" />;
      case 'trade_execution':
        return <DollarSign className="h-4 w-4" />;
      case 'news':
        return <Bell className="h-4 w-4" />;
      case 'security':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Notifications
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage your alerts and notification preferences
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => markAllAsReadMutation.mutate()}
                    disabled={markAllAsReadMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
                <Badge variant="secondary">
                  {unreadCount} unread
                </Badge>
              </div>
            </div>

            <Tabs defaultValue="notifications" className="space-y-6">
              <TabsList>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                {/* Filter Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === 'unread' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('unread')}
                  >
                    Unread ({unreadCount})
                  </Button>
                  <Button
                    variant={filter === 'read' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('read')}
                  >
                    Read
                  </Button>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                  {notifications.length > 0 ? (
                    notifications.map((notification: Notification) => (
                      <Card key={notification.id} className={`${!notification.isRead ? 'border-blue-200 bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)} text-white`}>
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-slate-900 dark:text-white">
                                    {notification.title}
                                  </h3>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {notification.type.replace('_', ' ').toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Clock className="h-3 w-3" />
                                  {new Date(notification.createdAt).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => markAsReadMutation.mutate(notification.id)}
                                  disabled={markAsReadMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteNotificationMutation.mutate(notification.id)}
                                disabled={deleteNotificationMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Bell className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg">No notifications</p>
                        <p className="text-slate-400 text-sm mt-2">
                          You're all caught up! New notifications will appear here.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                {settings && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email Notifications */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Mail className="h-5 w-5" />
                          Email Notifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-price">Price Alerts</Label>
                          <Switch
                            id="email-price"
                            checked={settings.email?.priceAlerts || false}
                            onCheckedChange={(checked) => {
                              const newSettings = {
                                ...settings,
                                email: { ...settings.email, priceAlerts: checked }
                              };
                              updateSettingsMutation.mutate(newSettings);
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-trade">Trade Executions</Label>
                          <Switch
                            id="email-trade"
                            checked={settings.email?.tradeExecutions || false}
                            onCheckedChange={(checked) => {
                              const newSettings = {
                                ...settings,
                                email: { ...settings.email, tradeExecutions: checked }
                              };
                              updateSettingsMutation.mutate(newSettings);
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-news">News Updates</Label>
                          <Switch
                            id="email-news"
                            checked={settings.email?.news || false}
                            onCheckedChange={(checked) => {
                              const newSettings = {
                                ...settings,
                                email: { ...settings.email, news: checked }
                              };
                              updateSettingsMutation.mutate(newSettings);
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-system">System Updates</Label>
                          <Switch
                            id="email-system"
                            checked={settings.email?.systemUpdates || false}
                            onCheckedChange={(checked) => {
                              const newSettings = {
                                ...settings,
                                email: { ...settings.email, systemUpdates: checked }
                              };
                              updateSettingsMutation.mutate(newSettings);
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-security">Security Alerts</Label>
                          <Switch
                            id="email-security"
                            checked={settings.email?.securityAlerts || false}
                            onCheckedChange={(checked) => {
                              const newSettings = {
                                ...settings,
                                email: { ...settings.email, securityAlerts: checked }
                              };
                              updateSettingsMutation.mutate(newSettings);
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Push Notifications */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Smartphone className="h-5 w-5" />
                          Push Notifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-price">Price Alerts</Label>
                          <Switch
                            id="push-price"
                            checked={settings.push?.priceAlerts || false}
                            onCheckedChange={(checked) => {
                              const newSettings = {
                                ...settings,
                                push: { ...settings.push, priceAlerts: checked }
                              };
                              updateSettingsMutation.mutate(newSettings);
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-trade">Trade Executions</Label>
                          <Switch
                            id="push-trade"
                            checked={settings.push?.tradeExecutions || false}
                            onCheckedChange={(checked) => {
                              const newSettings = {
                                ...settings,
                                push: { ...settings.push, tradeExecutions: checked }
                              };
                              updateSettingsMutation.mutate(newSettings);
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-news">News Updates</Label>
                          <Switch
                            id="push-news"
                            checked={settings.push?.news || false}
                            onCheckedChange={(checked) => {
                              const newSettings = {
                                ...settings,
                                push: { ...settings.push, news: checked }
                              };
                              updateSettingsMutation.mutate(newSettings);
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-system">System Updates</Label>
                          <Switch
                            id="push-system"
                            checked={settings.push?.systemUpdates || false}
                            onCheckedChange={(checked) => {
                              const newSettings = {
                                ...settings,
                                push: { ...settings.push, systemUpdates: checked }
                              };
                              updateSettingsMutation.mutate(newSettings);
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-security">Security Alerts</Label>
                          <Switch
                            id="push-security"
                            checked={settings.push?.securityAlerts || false}
                            onCheckedChange={(checked) => {
                              const newSettings = {
                                ...settings,
                                push: { ...settings.push, securityAlerts: checked }
                              };
                              updateSettingsMutation.mutate(newSettings);
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}