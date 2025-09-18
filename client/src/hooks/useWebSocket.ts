
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './useAuth';

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  volume_24h: number;
  market_cap: number;
  last_updated: string;
}

interface PriceAlert {
  symbol: string;
  price: number;
  alertType: 'above' | 'below';
  targetPrice: number;
}

interface WebSocketMessage {
  type: 'connection' | 'price_update' | 'price_alert' | 'error' | 'authenticated';
  data?: CryptoPrice[] | PriceAlert;
  message?: string;
  timestamp: number;
  clientId?: string;
}

interface UseWebSocketOptions {
  symbols?: string[];
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const { 
    symbols = [], 
    autoConnect = true, 
    reconnectAttempts = 5, 
    reconnectInterval = 3000 
  } = options;
  
  const { user } = useAuth();
  const ws = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [prices, setPrices] = useState<Map<string, CryptoPrice>>(new Map());
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const getWebSocketUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws/prices`;
  };

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const wsUrl = getWebSocketUrl();
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('🔌 WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);
        reconnectCount.current = 0;

        // Authenticate if user is logged in
        if (user?.id) {
          ws.current?.send(JSON.stringify({
            type: 'authenticate',
            userId: user.id
          }));
        }

        // Subscribe to symbols if provided
        if (symbols.length > 0) {
          ws.current?.send(JSON.stringify({
            type: 'subscribe',
            symbols,
            userId: user?.id
          }));
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);

        // Attempt to reconnect unless it was a manual disconnect
        if (event.code !== 1000 && reconnectCount.current < reconnectAttempts) {
          attemptReconnect();
        }
      };

      ws.current.onerror = (error) => {
        console.error('🔌 WebSocket error:', error);
        setConnectionError('WebSocket connection failed');
        setIsConnecting(false);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionError('Failed to create WebSocket connection');
      setIsConnecting(false);
    }
  }, [symbols, user?.id, reconnectAttempts]);

  const attemptReconnect = useCallback(() => {
    if (reconnectCount.current >= reconnectAttempts) {
      setConnectionError('Max reconnection attempts reached');
      return;
    }

    reconnectCount.current += 1;
    const delay = reconnectInterval * Math.pow(1.5, reconnectCount.current - 1); // Exponential backoff
    
    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${reconnectCount.current}/${reconnectAttempts})`);
    
    reconnectTimer.current = setTimeout(() => {
      connect();
    }, delay);
  }, [connect, reconnectAttempts, reconnectInterval]);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'connection':
        console.log('📡 WebSocket connection established:', message.message);
        break;

      case 'price_update':
        if (Array.isArray(message.data)) {
          const newPrices = new Map(prices);
          message.data.forEach((price: CryptoPrice) => {
            newPrices.set(price.symbol, price);
          });
          setPrices(newPrices);
          setLastUpdate(new Date());
        }
        break;

      case 'price_alert':
        if (message.data && 'symbol' in message.data) {
          const alertData = message.data as PriceAlert;
          // You can handle alerts here (show notification, etc.)
          console.log('🚨 Price Alert:', alertData);
          
          // Create browser notification if permission granted
          if (Notification.permission === 'granted') {
            new Notification(`Price Alert: ${alertData.symbol}`, {
              body: `${alertData.symbol} has ${alertData.alertType === 'above' ? 'exceeded' : 'dropped below'} $${alertData.targetPrice.toFixed(2)}`,
              icon: '/logo.jpeg'
            });
          }
        }
        break;

      case 'authenticated':
        console.log('✅ WebSocket authenticated:', message.message);
        break;

      case 'error':
        console.error('❌ WebSocket error:', message.message);
        setConnectionError(message.message || 'Unknown error');
        break;

      default:
        console.log('📨 Unknown WebSocket message:', message);
    }
  }, [prices]);

  const subscribe = useCallback((newSymbols: string[]) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'subscribe',
        symbols: newSymbols,
        userId: user?.id
      }));
    }
  }, [user?.id]);

  const unsubscribe = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'unsubscribe'
      }));
    }
  }, []);

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

  const getPrice = useCallback((symbol: string): CryptoPrice | null => {
    return prices.get(symbol.toUpperCase()) || null;
  }, [prices]);

  const getAllPrices = useCallback((): CryptoPrice[] => {
    return Array.from(prices.values());
  }, [prices]);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Update subscription when symbols change
  useEffect(() => {
    if (isConnected && symbols.length > 0) {
      subscribe(symbols);
    }
  }, [symbols.join(','), isConnected]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    // Connection state
    isConnected,
    isConnecting,
    connectionError,
    
    // Price data
    prices: getAllPrices(),
    pricesMap: prices,
    lastUpdate,
    getPrice,
    
    // Actions
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    
    // Statistics
    connectedSymbols: symbols,
    reconnectAttempts: reconnectCount.current
  };
};

export type { CryptoPrice, PriceAlert };
