
import { useState, useEffect, useRef, useCallback } from 'react';

interface PriceData {
  symbol: string;
  price: number;
  change_24h: number;
  volume_24h: number;
  market_cap?: number;
  timestamp: number;
}

interface UseRealTimePricesOptions {
  symbols: string[];
  enabled?: boolean;
  onPriceUpdate?: (price: PriceData) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export function useRealTimePrices({
  symbols,
  enabled = true,
  onPriceUpdate,
  onConnectionChange
}: UseRealTimePricesOptions) {
  const [prices, setPrices] = useState<Map<string, PriceData>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 3; // Reduced from 5
  const connectionStateRef = useRef<'disconnected' | 'connecting' | 'connected'>('disconnected');

  const connect = useCallback(() => {
    if (!enabled || connectionStateRef.current !== 'disconnected') {
      return;
    }

    // Close existing connection first
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    connectionStateRef.current = 'connecting';
    setIsConnecting(true);
    setConnectionError(null);

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;
      
      console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);

      wsRef.current = new WebSocket(wsUrl);

      // Connection timeout
      const connectionTimeout = setTimeout(() => {
        if (connectionStateRef.current === 'connecting' && wsRef.current) {
          console.log('⏰ WebSocket connection timeout');
          wsRef.current.close();
        }
      }, 5000);

      wsRef.current.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('🔌 Real-time prices WebSocket connected');
        connectionStateRef.current = 'connected';
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttemptsRef.current = 0;
        onConnectionChange?.(true);

        // Subscribe to price updates
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'subscribe',
            symbols: ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE', 'DOT', 'AVAX', 'LINK']
          }));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'price_update') {
            if (Array.isArray(message.data)) {
              const newPrices = new Map(prices);
              
              message.data.forEach((priceData: PriceData) => {
                const normalizedSymbol = priceData.symbol.toUpperCase();
                newPrices.set(normalizedSymbol, {
                  ...priceData,
                  symbol: normalizedSymbol
                });
                onPriceUpdate?.(priceData);
              });

              setPrices(newPrices);
              setLastUpdate(new Date());
            } else if (message.symbol && message.price) {
              // Single price update
              const priceData: PriceData = {
                symbol: message.symbol.toUpperCase(),
                price: message.price,
                change_24h: message.change_24h || 0,
                volume_24h: message.volume_24h || 0,
                market_cap: message.market_cap,
                timestamp: message.timestamp || Date.now()
              };

              setPrices(prev => new Map(prev).set(priceData.symbol, priceData));
              setLastUpdate(new Date());
              onPriceUpdate?.(priceData);
            }
          } else if (message.type === 'connection') {
            console.log('📡 WebSocket connection confirmed');
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('🔌 Real-time prices WebSocket disconnected:', event.code);
        connectionStateRef.current = 'disconnected';
        setIsConnected(false);
        setIsConnecting(false);
        onConnectionChange?.(false);

        // Only attempt to reconnect for abnormal closures and within retry limit
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          attemptReconnect();
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionError('Connection failed - using API data only');
        }
      };

      wsRef.current.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error('🔌 Real-time prices WebSocket error:', error);
        connectionStateRef.current = 'disconnected';
        setConnectionError('Connection failed');
        setIsConnecting(false);
        setIsConnected(false);
        onConnectionChange?.(false);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      connectionStateRef.current = 'disconnected';
      setConnectionError('Failed to create connection');
      setIsConnecting(false);
      setIsConnected(false);
    }
  }, [enabled, onPriceUpdate, onConnectionChange]);

  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      return;
    }

    reconnectAttemptsRef.current += 1;
    const delay = Math.pow(2, reconnectAttemptsRef.current - 1) * 2000; // Exponential backoff starting at 2s

    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);

    reconnectTimeoutRef.current = setTimeout(() => {
      if (connectionStateRef.current === 'disconnected') {
        connect();
      }
    }, delay);
  }, [connect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      wsRef.current.onopen = null;
      
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close(1000, 'Manual disconnect');
      }
      wsRef.current = null;
    }

    connectionStateRef.current = 'disconnected';
    setIsConnected(false);
    setIsConnecting(false);
    reconnectAttemptsRef.current = 0;
    onConnectionChange?.(false);
  }, [onConnectionChange]);

  // Auto-connect when enabled and symbols change
  useEffect(() => {
    if (enabled && symbols.length > 0) {
      // Small delay to prevent rapid reconnections
      const connectTimeout = setTimeout(() => {
        connect();
      }, 100);
      
      return () => clearTimeout(connectTimeout);
    } else if (!enabled) {
      disconnect();
    }
  }, [enabled, symbols.join(','), connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.onerror = null;
        wsRef.current.onmessage = null;
        wsRef.current.onopen = null;
        
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close(1000, 'Component cleanup');
        }
        wsRef.current = null;
      }
      
      connectionStateRef.current = 'disconnected';
      reconnectAttemptsRef.current = 0;
    };
  }, []);

  // Helper functions
  const getPrice = useCallback((symbol: string): number => {
    return prices.get(symbol.toUpperCase())?.price || 0;
  }, [prices]);

  const getPriceData = useCallback((symbol: string): PriceData | null => {
    return prices.get(symbol.toUpperCase()) || null;
  }, [prices]);

  const getChange = useCallback((symbol: string): number => {
    return prices.get(symbol.toUpperCase())?.change_24h || 0;
  }, [prices]);

  const getAllPrices = useCallback((): PriceData[] => {
    return Array.from(prices.values());
  }, [prices]);

  return {
    // State
    prices: getAllPrices(),
    pricesMap: prices,
    isConnected,
    isConnecting,
    connectionError,
    lastUpdate,

    // Actions
    connect,
    disconnect,

    // Helpers
    getPrice,
    getPriceData,
    getChange,

    // Stats
    connectedSymbols: symbols,
    totalSymbols: prices.size
  };
}
