import { useState, useEffect, useCallback } from 'react';
import { CryptoApiService, CryptoTicker } from '../services/cryptoApi';

interface PriceData {
  [symbol: string]: {
    price: number;
    change_24h: number;
    volume_24h: number;
    timestamp: number;
  };
}

export function useRealTimePrice(symbols: string[]) {
  const [prices, setPrices] = useState<PriceData>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePrice = useCallback((ticker: CryptoTicker) => {
    setPrices(prev => ({
      ...prev,
      [ticker.symbol.toLowerCase()]: {
        price: ticker.price,
        change_24h: ticker.change_24h,
        volume_24h: ticker.volume_24h,
        timestamp: ticker.timestamp
      }
    }));
  }, []);

  useEffect(() => {
    if (symbols.length === 0) return;

    setIsConnected(true);
    setError(null);

    // Create WebSocket-like connection for real-time updates
    const socket = CryptoApiService.createPriceSocket(symbols, updatePrice);

    if (!socket) {
      setError('Failed to connect to price feed');
      setIsConnected(false);
      return;
    }

    // Initial price fetch
    const fetchInitialPrices = async () => {
      try {
        for (const symbol of symbols) {
          const price = await CryptoApiService.getCryptoPrice(symbol);
          if (price > 0) {
            updatePrice({
              symbol: symbol.toUpperCase(),
              price,
              change_24h: 0,
              volume_24h: 0,
              timestamp: Date.now()
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch initial prices:', err);
      }
    };

    fetchInitialPrices();

    return () => {
      socket?.close();
      setIsConnected(false);
    };
  }, [symbols, updatePrice]);

  return {
    prices,
    isConnected,
    error,
    getPrice: (symbol: string) => prices[symbol.toLowerCase()]?.price || 0,
    getChange: (symbol: string) => prices[symbol.toLowerCase()]?.change_24h || 0,
    getVolume: (symbol: string) => prices[symbol.toLowerCase()]?.volume_24h || 0
  };
}