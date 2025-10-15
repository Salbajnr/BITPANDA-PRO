
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

// Global WebSocket connection manager to prevent multiple connections
class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocket | null = null;
  private subscribers = new Set<string>();
  private callbacks = new Map<string, {
    onPriceUpdate?: (price: PriceData) => void;
    onConnectionChange?: (connected: boolean) => void;
    setPrices: (prices: Map<string, PriceData>) => void;
    setIsConnected: (connected: boolean) => void;
    setIsConnecting: (connecting: boolean) => void;
    setConnectionError: (error: string | null) => void;
    setLastUpdate: (date: Date | null) => void;
  }>();
  private prices = new Map<string, PriceData>();
  private isConnected = false;
  private isConnecting = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  subscribe(id: string, callbacks: any) {
    this.subscribers.add(id);
    this.callbacks.set(id, callbacks);
    
    // Send current prices to new subscriber
    callbacks.setPrices(new Map(this.prices));
    callbacks.setIsConnected(this.isConnected);
    callbacks.setIsConnecting(this.isConnecting);
    
    // Start connection if not already connected
    if (!this.isConnected && !this.isConnecting && this.subscribers.size === 1) {
      this.connect();
    }
  }

  unsubscribe(id: string) {
    this.subscribers.delete(id);
    this.callbacks.delete(id);
    
    // Close connection if no more subscribers
    if (this.subscribers.size === 0) {
      this.disconnect();
    }
  }

  private connect() {
    if (this.isConnecting || this.isConnected) return;

    this.setConnecting(true);
    this.setConnectionError(null);

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;
      
      console.log(`🔌 WebSocketManager connecting to: ${wsUrl}`);

      this.ws = new WebSocket(wsUrl);

      const connectionTimeout = setTimeout(() => {
        if (this.isConnecting && this.ws) {
          console.log('⏰ WebSocket connection timeout');
          this.ws.close();
        }
      }, 5000);

      this.ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('✅ WebSocketManager connected successfully');
        this.isConnected = true;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.setConnected(true);
        this.setConnecting(false);

        // Subscribe to price updates
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            type: 'subscribe',
            symbols: ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL']
          }));
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'price_update') {
            if (Array.isArray(message.data)) {
              message.data.forEach((priceData: PriceData) => {
                this.handlePriceUpdate(priceData);
              });
            } else if (message.symbol && message.price) {
              this.handlePriceUpdate({
                symbol: message.symbol.toUpperCase(),
                price: message.price,
                change_24h: message.change_24h || 0,
                volume_24h: message.volume_24h || 0,
                market_cap: message.market_cap,
                timestamp: message.timestamp || Date.now()
              });
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('🔌 WebSocketManager disconnected:', event.code);
        this.isConnected = false;
        this.isConnecting = false;
        this.setConnected(false);
        this.setConnecting(false);

        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts && this.subscribers.size > 0) {
          this.attemptReconnect();
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.setConnectionError('Connection failed - using fallback data');
        }
      };

      this.ws.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error('🔌 WebSocketManager error:', error);
        this.isConnected = false;
        this.isConnecting = false;
        this.setConnectionError('Connection failed');
        this.setConnecting(false);
        this.setConnected(false);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.setConnectionError('Failed to create connection');
      this.setConnecting(false);
      this.setConnected(false);
    }
  }

  private handlePriceUpdate(priceData: PriceData) {
    const normalizedSymbol = priceData.symbol.toUpperCase();
    this.prices.set(normalizedSymbol, {
      ...priceData,
      symbol: normalizedSymbol
    });

    // Notify all subscribers
    this.callbacks.forEach(callback => {
      callback.setPrices(new Map(this.prices));
      callback.setLastUpdate(new Date());
      callback.onPriceUpdate?.(priceData);
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;

    this.reconnectAttempts += 1;
    const delay = Math.pow(2, this.reconnectAttempts - 1) * 2000;

    console.log(`🔄 WebSocketManager reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      if (!this.isConnected && this.subscribers.size > 0) {
        this.connect();
      }
    }, delay);
  }

  private disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;
      this.ws.onopen = null;
      
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close(1000, 'Manager disconnect');
      }
      this.ws = null;
    }

    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.setConnected(false);
    this.setConnecting(false);
  }

  private setConnected(connected: boolean) {
    this.callbacks.forEach(callback => {
      callback.setIsConnected(connected);
      callback.onConnectionChange?.(connected);
    });
  }

  private setConnecting(connecting: boolean) {
    this.callbacks.forEach(callback => {
      callback.setIsConnecting(connecting);
    });
  }

  private setConnectionError(error: string | null) {
    this.callbacks.forEach(callback => {
      callback.setConnectionError(error);
    });
  }
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

  const subscriberId = useRef<string>(Math.random().toString(36));
  const wsManager = useRef<WebSocketManager>(WebSocketManager.getInstance());

  // Connect when enabled
  useEffect(() => {
    if (enabled && symbols.length > 0) {
      wsManager.current.subscribe(subscriberId.current, {
        onPriceUpdate,
        onConnectionChange,
        setPrices,
        setIsConnected,
        setIsConnecting,
        setConnectionError,
        setLastUpdate
      });

      return () => {
        wsManager.current.unsubscribe(subscriberId.current);
      };
    }
  }, [enabled, symbols.join(','), onPriceUpdate, onConnectionChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wsManager.current.unsubscribe(subscriberId.current);
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
    prices: getAllPrices(),
    pricesMap: prices,
    isConnected,
    isConnecting,
    connectionError,
    lastUpdate,
    getPrice,
    getPriceData,
    getChange,
    connectedSymbols: symbols,
    totalSymbols: prices.size
  };
}
