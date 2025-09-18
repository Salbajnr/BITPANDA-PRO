
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
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Redirect } from "wouter";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
  currentPrice?: number;
}

export default function Alerts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    targetPrice: '',
    condition: 'above' as 'above' | 'below'
  });

  if (!user) {
    return <Redirect to="/auth" />;
  }

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['/api/alerts'],
    queryFn: async () => {
      const response = await fetch('/api/alerts', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return response.json();
    }
  });

  const createAlertMutation = useMutation({
    mutationFn: async (alertData: any) => {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(alertData)
      });
      if (!response.ok) throw new Error('Failed to create alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      setShowCreateForm(false);
      setNewAlert({ symbol: '', targetPrice: '', condition: 'above' });
      toast({
        title: "Alert created",
        description: "Your price alert has been created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive",
      });
    }
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to delete alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: "Alert deleted",
        description: "Your price alert has been deleted",
      });
    }
  });

  const toggleAlertMutation = useMutation({
    mutationFn: async ({ alertId, isActive }: { alertId: string, isActive: boolean }) => {
      const response = await fetch(`/api/alerts/${alertId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive })
      });
      if (!response.ok) throw new Error('Failed to toggle alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    }
  });

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlert.symbol || !newAlert.targetPrice) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    createAlertMutation.mutate({
      symbol: newAlert.symbol.toUpperCase(),
      targetPrice: parseFloat(newAlert.targetPrice),
      condition: newAlert.condition
    });
  };

  const getAlertStatus = (alert: PriceAlert) => {
    if (alert.triggeredAt) return 'triggered';
    if (!alert.isActive) return 'inactive';
    return 'active';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'triggered':
        return <Badge className="bg-blue-100 text-blue-800">Triggered</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getConditionIcon = (condition: string) => {
    return condition === 'above' ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </main>
          </div>
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Price Alerts
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Get notified when your favorite cryptocurrencies reach target prices
                </p>
              </div>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </div>

            {/* Create Alert Form */}
            {showCreateForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Create Price Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateAlert} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="symbol">Cryptocurrency</Label>
                      <Input
                        id="symbol"
                        placeholder="e.g., BTC"
                        value={newAlert.symbol}
                        onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                        className="uppercase"
                      />
                    </div>
                    <div>
                      <Label htmlFor="condition">Condition</Label>
                      <Select
                        value={newAlert.condition}
                        onValueChange={(value: 'above' | 'below') => setNewAlert({ ...newAlert, condition: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="above">Price goes above</SelectItem>
                          <SelectItem value="below">Price goes below</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="targetPrice">Target Price ($)</Label>
                      <Input
                        id="targetPrice"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newAlert.targetPrice}
                        onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button type="submit" disabled={createAlertMutation.isPending}>
                        {createAlertMutation.isPending ? 'Creating...' : 'Create Alert'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowCreateForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Alerts List */}
            {alerts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No alerts yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Create your first price alert to get notified when cryptocurrencies reach your target prices
                  </p>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Alert
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {alerts.map((alert: PriceAlert) => (
                  <Card key={alert.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {alert.symbol}
                            </span>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {alert.symbol} {alert.condition} ${alert.targetPrice.toLocaleString()}
                              </h3>
                              {getConditionIcon(alert.condition)}
                              {getStatusBadge(getAlertStatus(alert))}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Created {new Date(alert.createdAt).toLocaleDateString()}
                              </div>
                              {alert.currentPrice && (
                                <div>
                                  Current: ${alert.currentPrice.toLocaleString()}
                                </div>
                              )}
                              {alert.triggeredAt && (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <CheckCircle className="h-3 w-3" />
                                  Triggered {new Date(alert.triggeredAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={alert.isActive}
                            onCheckedChange={(checked) =>
                              toggleAlertMutation.mutate({ alertId: alert.id, isActive: checked })
                            }
                            disabled={!!alert.triggeredAt}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteAlertMutation.mutate(alert.id)}
                            disabled={deleteAlertMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Alert Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Bell className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {alerts.filter((a: PriceAlert) => a.isActive && !a.triggeredAt).length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Active Alerts</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {alerts.filter((a: PriceAlert) => a.triggeredAt).length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Triggered</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {alerts.filter((a: PriceAlert) => !a.isActive && !a.triggeredAt).length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Inactive</div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
