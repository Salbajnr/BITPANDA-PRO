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
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!enabled) {
      return;
    }

    // Close existing connection first
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        return; // Already connected or connecting
      }
      wsRef.current.close();
      wsRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('🔌 Real-time prices WebSocket connected');

        // Wait a bit for connection to be fully established
        setTimeout(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            // Subscribe to price updates for major cryptocurrencies
            const subscribeMessage = {
              type: 'subscribe',
              symbols: ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE', 'DOT', 'AVAX', 'LINK']
            };

            wsRef.current.send(JSON.stringify(subscribeMessage));
            // Assuming setConnectionStatus is meant to be setIsConnected or similar
            // For now, let's stick to the original state management for isConnected
            // setConnectionStatus('connected'); // This line was removed as it's not defined in the original state
          }
        }, 100);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'price_update' && Array.isArray(message.data)) {
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
          } else if (message.type === 'connection') {
            console.log('📡 WebSocket connection established');
            // This might be where setConnectionStatus was intended to be used if it existed.
            // For now, we rely on onopen and onclose for isConnected state.
            setIsConnected(true); // Ensure connected state is true on explicit connection message
          } else if (message.type === 'error') {
            console.error('WebSocket error:', message.message);
            setConnectionError(message.message);
            setIsConnected(false); // Ensure disconnected state on error message
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('🔌 Real-time prices WebSocket disconnected:', event.code);
        setIsConnected(false);
        setIsConnecting(false);
        onConnectionChange?.(false);

        // Attempt to reconnect if not a manual disconnect
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          attemptReconnect();
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionError('Max reconnection attempts reached');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('🔌 Real-time prices WebSocket error:', error);
        setConnectionError('Connection failed');
        setIsConnecting(false);
        setIsConnected(false); // Ensure disconnected state on error
        onConnectionChange?.(false);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('Failed to create connection');
      setIsConnecting(false);
      setIsConnected(false); // Ensure disconnected state on error
    }
  }, [enabled, symbols, onPriceUpdate, onConnectionChange, prices]); // Added prices to dependency array as it's used in onmessage

  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      return;
    }

    reconnectAttemptsRef.current += 1;
    const delay = Math.pow(2, reconnectAttemptsRef.current - 1) * 1000; // Exponential backoff

    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);

    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, delay);
  }, [connect, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      // Remove event listeners to prevent reconnection
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      wsRef.current.onopen = null;
      
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close(1000, 'Manual disconnect');
      }
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    reconnectAttemptsRef.current = 0;
    onConnectionChange?.(false);
  }, [onConnectionChange]);

  const subscribe = useCallback((newSymbols: string[]) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        symbols: newSymbols
      }));
    }
  }, []);

  const unsubscribe = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'unsubscribe'
      }));
    }
  }, []);

  // Auto-connect when enabled and symbols change
  useEffect(() => {
    if (enabled && symbols.length > 0) {
      connect();
    } else if (!enabled) {
      disconnect();
    }

    return () => {
      // Cleanup on unmount or dependency change
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
          wsRef.current.close(1000, 'Component cleanup');
        }
        wsRef.current = null;
      }
      
      reconnectAttemptsRef.current = 0;
    };
  }, [enabled, symbols.join(','), connect]);

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
    subscribe,
    unsubscribe,

    // Helpers
    getPrice,
    getPriceData,
    getChange,

    // Stats
    connectedSymbols: symbols,
    totalSymbols: prices.size
  };
}