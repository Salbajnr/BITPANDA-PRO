
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceAlertsList } from '@/components/PriceAlertsList';
import { NotificationCenter } from '@/components/NotificationCenter';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'wouter';
import { Bell, Settings, TrendingUp, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function Alerts() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect to="/auth" />;
  }

  const { data: alertsData = [] } = useQuery({
    queryKey: ['/api/alerts'],
    queryFn: async () => {
      const response = await fetch('/api/alerts', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return response.json();
    },
  });

  const { data: notificationsData = [] } = useQuery({
    queryKey: ['/api/alerts/notifications'],
    queryFn: async () => {
      const response = await fetch('/api/alerts/notifications', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return response.json();
    },
  });

  const activeAlerts = alertsData.filter((alert: any) => alert.isActive);
  const unreadNotifications = notificationsData.filter((notification: any) => !notification.isRead);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Price Alerts & Notifications
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Stay informed about price movements and market changes
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Active Alerts</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {activeAlerts.length}
                      </p>
                    </div>
                    <Bell className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Total Alerts</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {alertsData.length}
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Unread Notifications</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {unreadNotifications.length}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="alerts" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="alerts" className="space-y-6">
                <PriceAlertsList />
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <NotificationCenter />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
