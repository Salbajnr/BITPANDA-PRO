
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bell, Check, Trash2, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCryptoLogo } from './CryptoLogos';

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: {
    alertId?: string;
    symbol?: string;
    currentPrice?: number;
    targetPrice?: number;
    condition?: 'above' | 'below';
  };
}

function NotificationCenter() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['/api/alerts/notifications'],
    queryFn: async () => {
      const response = await fetch('/api/alerts/notifications', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      return response.json();
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/alerts/notifications/${notificationId}/read`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to mark notification as read');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts/notifications'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark notification as read",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getNotificationIcon = (notification: Notification) => {
    if (notification.type === 'price_alert') {
      if (notification.data?.condition === 'above') {
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      } else {
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      }
    }
    return <Bell className="h-5 w-5 text-blue-500" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Notification Center</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your recent price alerts and system notifications
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Notifications Yet
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              When your price alerts trigger, you'll see notifications here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification: Notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all ${
                notification.isRead 
                  ? 'border-gray-200 dark:border-gray-700' 
                  : 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {notification.data?.symbol ? (
                        <img
                          src={getCryptoLogo(notification.data.symbol)}
                          alt={notification.data.symbol}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        getNotificationIcon(notification)
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                        )}
                        {notification.data?.symbol && (
                          <Badge variant="outline" className="text-xs">
                            {notification.data.symbol.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>

                      {notification.data?.currentPrice && notification.data?.targetPrice && (
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Current: {formatPrice(notification.data.currentPrice)}</span>
                          <span>Target: {formatPrice(notification.data.targetPrice)}</span>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 mt-2">
                        {formatDate(notification.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {!notification.isRead && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsReadMutation.mutate(notification.id)}
                        disabled={markAsReadMutation.isPending}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
