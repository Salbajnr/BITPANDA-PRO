
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SSENotification {
  type: string;
  data?: any;
  message?: string;
  timestamp: number;
}

interface UseSSENotificationsOptions {
  autoConnect?: boolean;
  showToasts?: boolean;
}

export const useSSENotifications = (options: UseSSENotificationsOptions = {}) => {
  const { autoConnect = true, showToasts = true } = options;
  const { user } = useAuth();
  const { toast } = useToast();
  const eventSource = useRef<EventSource | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<SSENotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const connect = useCallback(() => {
    if (eventSource.current) {
      return; // Already connected
    }

    if (!user) {
      setConnectionError('User authentication required');
      return;
    }

    try {
      eventSource.current = new EventSource('/api/sse/notifications/stream', {
        withCredentials: true
      });

      eventSource.current.onopen = () => {
        console.log('📡 SSE notifications connected');
        setIsConnected(true);
        setConnectionError(null);
      };

      eventSource.current.onmessage = (event) => {
        try {
          const notification: SSENotification = JSON.parse(event.data);
          handleNotification(notification);
        } catch (error) {
          console.error('Error parsing SSE notification:', error);
        }
      };

      eventSource.current.onerror = (error) => {
        console.error('📡 SSE notifications error:', error);
        setConnectionError('SSE connection failed');
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Error creating SSE connection:', error);
      setConnectionError('Failed to create SSE connection');
    }
  }, [user]);

  const handleNotification = useCallback((notification: SSENotification) => {
    console.log('📡 SSE notification received:', notification);

    // Add to notifications list
    setNotifications(prev => [notification, ...prev].slice(0, 100)); // Keep last 100
    setUnreadCount(prev => prev + 1);

    // Show toast for certain notification types
    if (showToasts) {
      switch (notification.type) {
        case 'push_notification':
          if (notification.data?.notification) {
            const notif = notification.data.notification;
            toast({
              title: notif.title,
              description: notif.message,
              variant: notif.priority === 'critical' ? 'destructive' : 'default',
            });
          }
          break;

        case 'portfolio_update':
          if (notification.data?.changePercent) {
            const change = notification.data.changePercent;
            const isPositive = change >= 0;
            toast({
              title: 'Portfolio Update',
              description: `Your portfolio ${isPositive ? 'gained' : 'lost'} ${Math.abs(change).toFixed(2)}%`,
              variant: isPositive ? 'default' : 'destructive',
            });
          }
          break;

        case 'critical_alert':
          toast({
            title: 'Security Alert',
            description: notification.message || 'A security event has occurred',
            variant: 'destructive',
          });
          break;

        case 'system_alert':
          toast({
            title: 'System Notification',
            description: notification.message || 'System update',
            variant: 'default',
          });
          break;
      }
    }

    // Browser push notification for critical alerts
    if (notification.type === 'critical_alert' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Security Alert', {
        body: notification.message || 'A critical security event has occurred',
        icon: '/logo.jpeg',
        tag: 'security-alert'
      });
    }
  }, [showToasts, toast]);

  const disconnect = useCallback(() => {
    if (eventSource.current) {
      eventSource.current.close();
      eventSource.current = null;
    }
    setIsConnected(false);
    setConnectionError(null);
  }, []);

  const markAsRead = useCallback((count = 1) => {
    setUnreadCount(prev => Math.max(0, prev - count));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  return {
    // Connection state
    isConnected,
    connectionError,

    // Notifications
    notifications,
    unreadCount,

    // Actions
    connect,
    disconnect,
    markAsRead,
    clearNotifications,
    requestNotificationPermission
  };
};
