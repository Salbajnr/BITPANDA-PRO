import { useState, useEffect, useRef, useCallback } from 'react';
import { CryptoApiService, CryptoTicker } from '../services/cryptoApi';

interface PriceData {
  symbol: string;
  price: number;
  change_24h: number;
  volume_24h: number;
  timestamp: number;
  high_24h?: number;
  low_24h?: number;
  market_cap?: number;
}

interface PriceAlert {
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  triggered: boolean;
}

export function useRealTimePrice(symbols: string[], enableAlerts = false) {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [alertsTriggered, setAlertsTriggered] = useState<PriceAlert[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 10;

  // Price alert management
  const addPriceAlert = useCallback((symbol: string, targetPrice: number, condition: 'above' | 'below') => {
    setPriceAlerts(prev => [
      ...prev.filter(alert => !(alert.symbol === symbol && alert.condition === condition)),
      { symbol, targetPrice, condition, triggered: false }
    ]);
  }, []);

  const removePriceAlert = useCallback((symbol: string, condition: 'above' | 'below') => {
    setPriceAlerts(prev => prev.filter(alert => !(alert.symbol === symbol && alert.condition === condition)));
  }, []);

  // Check price alerts
  const checkPriceAlerts = useCallback((newPrice: PriceData) => {
    if (!enableAlerts) return;

    setPriceAlerts(prev => {
      const updatedAlerts = prev.map(alert => {
        if (alert.symbol === newPrice.symbol && !alert.triggered) {
          const shouldTrigger =
            (alert.condition === 'above' && newPrice.price >= alert.targetPrice) ||
            (alert.condition === 'below' && newPrice.price <= alert.targetPrice);

          if (shouldTrigger) {
            // Add to triggered alerts
            setAlertsTriggered(prevTriggered => [...prevTriggered, { ...alert, triggered: true }]);

            // Show notification if possible
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`Price Alert: ${alert.symbol}`, {
                body: `${alert.symbol} is now ${alert.condition} $${alert.targetPrice} (Current: $${newPrice.price.toFixed(2)})`,
                icon: '/favicon.ico'
              });
            }

            return { ...alert, triggered: true };
          }
        }
        return alert;
      });

      return updatedAlerts;
    });
  }, [enableAlerts]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN ||
        wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Check if we've exceeded max reconnect attempts
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.log('❌ Max reconnection attempts reached');
      setConnectionError('Unable to connect to real-time price service');
      return;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected for price updates');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;

        // Subscribe to price updates for the symbols
        if (symbols.length > 0) {
          wsRef.current?.send(JSON.stringify({
            type: 'subscribe',
            symbols: symbols
          }));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'price_update') {
            const priceData: PriceData = {
              symbol: data.symbol,
              price: data.price,
              change_24h: data.change_24h || 0,
              volume_24h: data.volume_24h || 0,
              timestamp: data.timestamp,
              high_24h: data.high_24h,
              low_24h: data.low_24h,
              market_cap: data.market_cap
            };

            setPrices(prev => ({
              ...prev,
              [data.symbol]: priceData
            }));

            // Check price alerts
            checkPriceAlerts(priceData);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        setIsConnected(false);

        // Attempt to reconnect if the close was not intentional (e.g., server error)
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          const reconnectDelay = Math.pow(2, reconnectAttemptsRef.current) * 1000; // Exponential backoff
          console.log(`Attempting to reconnect in ${reconnectDelay / 1000}s... (Attempt ${reconnectAttemptsRef.current})`);
          reconnectTimeoutRef.current = setTimeout(connect, reconnectDelay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionError('Max reconnect attempts reached. Please try again later.');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error - using fallback data');
        setIsConnected(false); // Ensure state reflects disconnection
        // Trigger a reconnect attempt on error
        if (reconnectTimeoutRef.current === null) {
          reconnectAttemptsRef.current++;
          const reconnectDelay = Math.pow(2, reconnectAttemptsRef.current) * 1000;
          console.log(`Attempting to reconnect after error in ${reconnectDelay / 1000}s... (Attempt ${reconnectAttemptsRef.current})`);
          reconnectTimeoutRef.current = setTimeout(connect, reconnectDelay);
        }
      };
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setConnectionError('Failed to connect - using fallback data');
      setIsConnected(false);
    }
  }, [symbols, checkPriceAlerts]); // Removed 'connect' from dependency array as it causes infinite loop

  // Fallback to API data when WebSocket is not available or fails
  useEffect(() => {
    if (!isConnected && symbols.length > 0) {
      const fetchFallbackData = async () => {
        try {
          // Fetch more detailed data if available
          const detailedPrices = await CryptoApiService.getMultiplePrices(symbols);
          const fallbackPrices: Record<string, PriceData> = {};

          symbols.forEach(symbol => {
            const priceInfo = detailedPrices[symbol];
            if (priceInfo) {
              fallbackPrices[symbol.toLowerCase()] = {
                symbol: symbol.toLowerCase(),
                price: priceInfo.usd,
                change_24h: priceInfo.usd_24h_change || 0,
                volume_24h: priceInfo.usd_24h_vol || 0,
                high_24h: priceInfo.usd_24h_high,
                low_24h: priceInfo.usd_24h_low,
                market_cap: priceInfo.usd_market_cap,
                timestamp: Date.now()
              };
            } else {
              // Use realistic mock data as last resort if API fails for a symbol
              const basePrice = symbol === 'bitcoin' ? 45000 :
                              symbol === 'ethereum' ? 2500 :
                              Math.random() * 1000 + 100;

              fallbackPrices[symbol.toLowerCase()] = {
                symbol: symbol.toLowerCase(),
                price: basePrice * (0.98 + Math.random() * 0.04),
                change_24h: (Math.random() - 0.5) * 10,
                volume_24h: Math.random() * 1000000000,
                high_24h: basePrice * 1.05,
                low_24h: basePrice * 0.95,
                market_cap: Math.random() * 50000000000,
                timestamp: Date.now()
              };
            }
          });

          setPrices(fallbackPrices);
          // If using fallback, also check alerts with the fetched data
          Object.values(fallbackPrices).forEach(checkPriceAlerts);

        } catch (error) {
          console.error('Error fetching fallback data:', error);
          setConnectionError('Failed to fetch fallback data');
        }
      };

      fetchFallbackData();

      // Periodic updates every 30 seconds when WebSocket is not connected
      const interval = setInterval(fetchFallbackData, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, symbols, checkPriceAlerts]); // Include dependencies

  // Effect to manage WebSocket connection lifecycle
  useEffect(() => {
    if (symbols.length > 0) {
      connect(); // Initial connection attempt
    }

    // Cleanup function
    return () => {
      if (wsRef.current) {
        // Send unsubscribe message if connected
        if (wsRef.current.readyState === WebSocket.OPEN) {
          try {
            wsRef.current.send(JSON.stringify({ type: 'unsubscribe', symbols: symbols }));
          } catch (e) {
            console.error("Error sending unsubscribe message on cleanup:", e);
          }
        }
        // Clear the WebSocket connection
        wsRef.current.close(1000, 'Component unmounting');
        wsRef.current = null; // Clear the ref
      }
      // Clear any pending reconnect timeouts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [symbols, connect]); // Re-run effect if symbols change

  return {
    prices,
    isConnected,
    connectionError,
    priceAlerts,
    alertsTriggered,
    getPrice: (symbol: string) => prices[symbol.toLowerCase()]?.price || 0,
    getPriceChange: (symbol: string) => prices[symbol.toLowerCase()]?.change_24h || 0,
    getVolume: (symbol: string) => prices[symbol.toLowerCase()]?.volume_24h || 0,
    getHigh24h: (symbol: string) => prices[symbol.toLowerCase()]?.high_24h || 0,
    getLow24h: (symbol: string) => prices[symbol.toLowerCase()]?.low_24h || 0,
    getMarketCap: (symbol: string) => prices[symbol.toLowerCase()]?.market_cap || 0,
    addPriceAlert,
    removePriceAlert,
    clearTriggeredAlerts: () => setAlertsTriggered([]),
    subscribe: (newSymbols: string[]) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'subscribe',
          symbols: newSymbols
        }));
      } else {
        console.warn("Cannot subscribe: WebSocket is not open.");
      }
    },
    unsubscribe: (symbolsToRemove: string[]) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'unsubscribe',
          symbols: symbolsToRemove
        }));
      } else {
        console.warn("Cannot unsubscribe: WebSocket is not open.");
      }
    }
  };
}