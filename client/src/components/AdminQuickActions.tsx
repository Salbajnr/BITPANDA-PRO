
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, MessageSquare, AlertTriangle, Users, Mail, 
  Settings, Database, Shield, RefreshCw, Bell,
  UserCheck, Ban, DollarSign, FileText, Server
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function AdminQuickActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [actionData, setActionData] = useState<any>({});

  // System maintenance mutation
  const maintenanceMutation = useMutation({
    mutationFn: (data: { enabled: boolean; message?: string }) =>
      apiRequest('/api/admin/maintenance', { method: 'POST', body: data }),
    onSuccess: () => {
      toast({ title: "Maintenance mode updated", description: "System maintenance settings have been updated." });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/system-status'] });
    },
  });

  // Broadcast message mutation
  const broadcastMutation = useMutation({
    mutationFn: (data: { message: string; type: 'info' | 'warning' | 'success' | 'error' }) =>
      apiRequest('/api/admin/broadcast', { method: 'POST', body: data }),
    onSuccess: () => {
      toast({ title: "Message broadcasted", description: "Your message has been sent to all users." });
      setSelectedAction(null);
      setActionData({});
    },
  });

  // Cache clear mutation
  const clearCacheMutation = useMutation({
    mutationFn: (cacheType: string) =>
      apiRequest('/api/admin/clear-cache', { method: 'POST', body: { type: cacheType } }),
    onSuccess: () => {
      toast({ title: "Cache cleared", description: "System cache has been cleared successfully." });
    },
  });

  // Force user logout mutation
  const forceLogoutMutation = useMutation({
    mutationFn: (data: { userId?: string; all?: boolean }) =>
      apiRequest('/api/admin/force-logout', { method: 'POST', body: data }),
    onSuccess: () => {
      toast({ title: "Users logged out", description: "Selected users have been logged out." });
      setSelectedAction(null);
      setActionData({});
    },
  });

  const quickActions = [
    {
      id: 'maintenance',
      title: 'Maintenance Mode',
      description: 'Enable/disable system maintenance',
      icon: Settings,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      id: 'broadcast',
      title: 'Broadcast Message',
      description: 'Send message to all users',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 'clear-cache',
      title: 'Clear Cache',
      description: 'Clear system cache',
      icon: RefreshCw,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 'force-logout',
      title: 'Force Logout',
      description: 'Log out specific users',
      icon: UserCheck,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      id: 'backup',
      title: 'System Backup',
      description: 'Create system backup',
      icon: Database,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 'security-scan',
      title: 'Security Scan',
      description: 'Run security audit',
      icon: Shield,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  const handleQuickAction = (actionId: string) => {
    setSelectedAction(actionId);
    setActionData({});
  };

  const executeAction = () => {
    switch (selectedAction) {
      case 'maintenance':
        maintenanceMutation.mutate({
          enabled: actionData.enabled,
          message: actionData.message,
        });
        break;
      case 'broadcast':
        broadcastMutation.mutate({
          message: actionData.message,
          type: actionData.type || 'info',
        });
        break;
      case 'clear-cache':
        clearCacheMutation.mutate(actionData.cacheType || 'all');
        break;
      case 'force-logout':
        forceLogoutMutation.mutate({
          userId: actionData.userId,
          all: actionData.all,
        });
        break;
      default:
        toast({ title: "Action not implemented", description: "This action is coming soon." });
        setSelectedAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quick Actions</h2>
        <p className="text-gray-600 dark:text-gray-400">Perform common administrative tasks quickly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Dialog key={action.id} open={selectedAction === action.id} onOpenChange={(open) => !open && setSelectedAction(null)}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${action.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{action.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                      </div>
                      <Zap className="h-4 w-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <IconComponent className={`h-5 w-5 ${action.color}`} />
                    <span>{action.title}</span>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Maintenance Mode Dialog */}
                  {selectedAction === 'maintenance' && (
                    <>
                      <div className="space-y-2">
                        <Label>Maintenance Status</Label>
                        <div className="flex space-x-2">
                          <Button
                            variant={actionData.enabled ? 'default' : 'outline'}
                            onClick={() => setActionData({ ...actionData, enabled: true })}
                            size="sm"
                          >
                            Enable
                          </Button>
                          <Button
                            variant={!actionData.enabled ? 'default' : 'outline'}
                            onClick={() => setActionData({ ...actionData, enabled: false })}
                            size="sm"
                          >
                            Disable
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maintenance-message">Maintenance Message</Label>
                        <Textarea
                          id="maintenance-message"
                          placeholder="System is under maintenance. Please try again later."
                          value={actionData.message || ''}
                          onChange={(e) => setActionData({ ...actionData, message: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {/* Broadcast Message Dialog */}
                  {selectedAction === 'broadcast' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="broadcast-message">Message</Label>
                        <Textarea
                          id="broadcast-message"
                          placeholder="Enter your message to all users..."
                          value={actionData.message || ''}
                          onChange={(e) => setActionData({ ...actionData, message: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Message Type</Label>
                        <div className="flex space-x-2">
                          {['info', 'success', 'warning', 'error'].map((type) => (
                            <Button
                              key={type}
                              variant={actionData.type === type ? 'default' : 'outline'}
                              onClick={() => setActionData({ ...actionData, type })}
                              size="sm"
                              className="capitalize"
                            >
                              {type}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Clear Cache Dialog */}
                  {selectedAction === 'clear-cache' && (
                    <div className="space-y-2">
                      <Label>Cache Type</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {['all', 'user-data', 'market-data', 'api-cache'].map((type) => (
                          <Button
                            key={type}
                            variant={actionData.cacheType === type ? 'default' : 'outline'}
                            onClick={() => setActionData({ ...actionData, cacheType: type })}
                            size="sm"
                            className="capitalize"
                          >
                            {type.replace('-', ' ')}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Force Logout Dialog */}
                  {selectedAction === 'force-logout' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="user-id">User ID (optional)</Label>
                        <Input
                          id="user-id"
                          placeholder="Leave empty to logout all users"
                          value={actionData.userId || ''}
                          onChange={(e) => setActionData({ ...actionData, userId: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="logout-all"
                          checked={actionData.all || false}
                          onChange={(e) => setActionData({ ...actionData, all: e.target.checked })}
                        />
                        <Label htmlFor="logout-all">Logout all users</Label>
                      </div>
                    </>
                  )}

                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={executeAction}
                      disabled={
                        maintenanceMutation.isPending ||
                        broadcastMutation.isPending ||
                        clearCacheMutation.isPending ||
                        forceLogoutMutation.isPending
                      }
                      className="flex-1"
                    >
                      {(maintenanceMutation.isPending || broadcastMutation.isPending || clearCacheMutation.isPending || forceLogoutMutation.isPending) ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Zap className="h-4 w-4 mr-2" />
                      )}
                      Execute
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedAction(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>

      {/* Recent Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Actions</CardTitle>
          <CardDescription>Your recent administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'Cache cleared', type: 'system', time: '2 minutes ago', status: 'success' },
              { action: 'Broadcast message sent', type: 'communication', time: '15 minutes ago', status: 'success' },
              { action: 'User force logout', type: 'security', time: '1 hour ago', status: 'success' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant={item.status === 'success' ? 'default' : 'destructive'}>
                    {item.status}
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">{item.action}</p>
                    <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
