
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAdminAuth } from '@/admin/hooks/useAdminAuth';

interface AdminWebSocketMessage {
  type: string;
  data?: any;
  channel?: string;
  timestamp: number;
  message?: string;
}

interface UseAdminWebSocketOptions {
  channels?: string[];
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export const useAdminWebSocket = (options: UseAdminWebSocketOptions = {}) => {
  const { 
    channels = [], 
    autoConnect = true, 
    reconnectAttempts = 5, 
    reconnectInterval = 3000 
  } = options;

  const { admin } = useAdminAuth();
  const ws = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<AdminWebSocketMessage | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [systemMetrics, setSystemMetrics] = useState<any>(null);
  const [userAnalytics, setUserAnalytics] = useState<any>(null);

  const getWebSocketUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws/admin`;
  };

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    if (!admin) {
      setConnectionError('Admin authentication required');
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const wsUrl = getWebSocketUrl();
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('🔧 Admin WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);
        reconnectCount.current = 0;

        // Authenticate
        ws.current?.send(JSON.stringify({
          type: 'authenticate',
          adminId: admin.id,
          permissions: admin.permissions || []
        }));

        // Subscribe to channels
        if (channels.length > 0) {
          ws.current?.send(JSON.stringify({
            type: 'subscribe',
            channels
          }));
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const message: AdminWebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Error parsing admin WebSocket message:', error);
        }
      };

      ws.current.onerror = (error) => {
        console.error('🔧 Admin WebSocket error:', error);
        setConnectionError('Admin WebSocket connection failed');
        setIsConnecting(false);
      };

      ws.current.onclose = (event) => {
        console.log('🔧 Admin WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);

        if (event.code !== 1000 && reconnectCount.current < reconnectAttempts) {
          attemptReconnect();
        }
      };
    } catch (error) {
      console.error('Error creating admin WebSocket connection:', error);
      setConnectionError('Failed to create admin WebSocket connection');
      setIsConnecting(false);
    }
  }, [admin, channels, reconnectAttempts]);

  const attemptReconnect = useCallback(() => {
    if (reconnectCount.current >= reconnectAttempts) {
      setConnectionError('Max reconnection attempts reached');
      return;
    }

    reconnectCount.current += 1;
    const delay = reconnectInterval * Math.pow(1.5, reconnectCount.current - 1);

    console.log(`🔄 Admin WebSocket reconnecting in ${delay}ms (attempt ${reconnectCount.current}/${reconnectAttempts})`);

    reconnectTimer.current = setTimeout(() => {
      connect();
    }, delay);
  }, [connect, reconnectAttempts, reconnectInterval]);

  const handleMessage = useCallback((message: AdminWebSocketMessage) => {
    setLastMessage(message);

    switch (message.type) {
      case 'authenticated':
        console.log('✅ Admin WebSocket authenticated');
        break;

      case 'dashboard_data':
        setDashboardData(message.data);
        break;

      case 'system_metrics':
        setSystemMetrics(message.data);
        break;

      case 'user_analytics':
        setUserAnalytics(message.data);
        break;

      case 'channel_data':
        if (message.channel === 'user_activity') {
          // Handle user activity data
        } else if (message.channel === 'transaction_monitor') {
          // Handle transaction data
        } else if (message.channel === 'system_health') {
          setSystemMetrics(message.data);
        } else if (message.channel === 'portfolio_updates') {
          // Handle portfolio updates
        } else if (message.channel === 'security_alerts') {
          // Handle security alerts
        }
        break;

      case 'broadcast':
        if (message.channel === 'analytics_dashboard') {
          setSystemMetrics(message.data);
        } else if (message.channel === 'portfolio_updates') {
          // Handle portfolio broadcast
        }
        break;

      case 'critical_alert':
        // Handle critical alerts
        console.warn('🚨 Critical Alert:', message.data);
        break;

      case 'error':
        console.error('❌ Admin WebSocket error:', message.message);
        setConnectionError(message.message || 'Unknown error');
        break;

      default:
        console.log('📨 Unknown admin WebSocket message:', message);
    }
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message: Admin WebSocket is not connected');
    }
  }, []);

  const subscribe = useCallback((newChannels: string[]) => {
    sendMessage({
      type: 'subscribe',
      channels: newChannels
    });
  }, [sendMessage]);

  const unsubscribe = useCallback((channelsToRemove: string[]) => {
    sendMessage({
      type: 'unsubscribe',
      channels: channelsToRemove
    });
  }, [sendMessage]);

  const getDashboardData = useCallback(() => {
    sendMessage({
      type: 'get_dashboard_data'
    });
  }, [sendMessage]);

  const getUserAnalytics = useCallback((userId?: string, timeframe = '24h') => {
    sendMessage({
      type: 'get_user_analytics',
      userId,
      timeframe
    });
  }, [sendMessage]);

  const getSystemMetrics = useCallback(() => {
    sendMessage({
      type: 'get_system_metrics'
    });
  }, [sendMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }

    if (ws.current) {
      ws.current.close(1000, 'Manual disconnect');
      ws.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    reconnectCount.current = 0;
  }, []);

  useEffect(() => {
    if (autoConnect && admin) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, admin, connect, disconnect]);

  return {
    // Connection state
    isConnected,
    isConnecting,
    connectionError,

    // Data
    lastMessage,
    dashboardData,
    systemMetrics,
    userAnalytics,

    // Actions
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    sendMessage,
    getDashboardData,
    getUserAnalytics,
    getSystemMetrics,

    // Statistics
    reconnectAttempts: reconnectCount.current
  };
};
