import { useState, useEffect, useCallback } from 'react';
import { CryptoApiService, CryptoTicker } from '../services/cryptoApi';

interface PriceData {
  symbol: string;
  price: number;
  change_24h: number;
  volume_24h: number;
  timestamp: number;
}

export function useRealTimePrice(symbols: string[]) {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWebSocket = useCallback(() => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        console.log('WebSocket connected for real-time prices');
        setIsConnected(true);
        setError(null);

        // Subscribe to price updates for the symbols
        websocket.send(JSON.stringify({
          type: 'subscribe',
          symbols: symbols
        }));
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'price_update') {
            setPrices(prev => ({
              ...prev,
              [data.symbol.toLowerCase()]: {
                symbol: data.symbol.toLowerCase(),
                price: data.price,
                change_24h: data.change_24h,
                volume_24h: data.volume_24h,
                timestamp: data.timestamp
              }
            }));
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      websocket.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error - using fallback data');
        setIsConnected(false);
      };

      setWs(websocket);
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setError('Failed to connect - using fallback data');
    }
  }, [symbols]);

  // Fallback to mock data when WebSocket is not available
  useEffect(() => {
    if (!isConnected && symbols.length > 0) {
      const interval = setInterval(() => {
        const mockPrices: Record<string, PriceData> = {};
        symbols.forEach(symbol => {
          mockPrices[symbol.toLowerCase()] = {
            symbol: symbol.toLowerCase(),
            price: Math.random() * 50000 + 20000,
            change_24h: (Math.random() - 0.5) * 10,
            volume_24h: Math.random() * 1000000000,
            timestamp: Date.now()
          };
        });
        setPrices(mockPrices);
      }, 5000);

      return () => clearInterval(interval);
    } else if (isConnected) {
      // Clear mock data interval if WebSocket connects
      setPrices({});
    }
  }, [isConnected, symbols]);

  useEffect(() => {
    if (symbols.length > 0) {
      connectWebSocket();
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [symbols, connectWebSocket]);

  return {
    prices,
    isConnected,
    error,
    getPrice: (symbol: string) => prices[symbol.toLowerCase()]?.price || 0,
    getChange: (symbol: string) => prices[symbol.toLowerCase()]?.change_24h || 0,
    getVolume: (symbol: string) => prices[symbol.toLowerCase()]?.volume_24h || 0
  };
}