import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wifi, WifiOff } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useRealTimePrices } from "../hooks/useRealTimePrices";

interface TickerItem {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
}

export default function LiveTicker() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [fallbackData, setFallbackData] = useState<CryptoPrice[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);


  // Fetch crypto data for ticker
  const { data: cryptoData, isError: cryptoIsError, isLoading: cryptoIsLoading } = useQuery<TickerItem[]>({
    queryKey: ['/api/crypto/market-data'],
    queryFn: () => api.get('/api/crypto/market-data'),
    refetchInterval: 30000,
  });

  // Fetch metals data for ticker
  const { data: metalsData, isError: metalsIsError, isLoading: metalsIsLoading } = useQuery<TickerItem[]>({
    queryKey: ['/api/metals/market-data'],
    queryFn: () => api.get('/api/metals/market-data'),
    refetchInterval: 60000,
  });

  // Get real-time price updates for top crypto symbols
  const topCryptoSymbols = ['BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'DOT', 'MATIC', 'AVAX', 'LINK', 'UNI'];

  const { 
    pricesMap: realTimePrices,
    isConnected: isRealTimeConnected,
    getPrice,
    getChange
  } = useRealTimePrices({
    symbols: topCryptoSymbols,
    enabled: true
  });


  // Fallback data when WebSocket fails
  const defaultPrices: CryptoPrice[] = [
    { symbol: 'BTC', price: 67234.50, change24h: 1234.50, changePercent24h: 1.87 },
    { symbol: 'ETH', price: 3456.78, change24h: -45.23, changePercent24h: -1.29 },
    { symbol: 'BNB', price: 598.45, change24h: 12.34, changePercent24h: 2.10 },
    { symbol: 'XRP', price: 0.6234, change24h: 0.0123, changePercent24h: 2.01 },
    { symbol: 'ADA', price: 0.4567, change24h: -0.0089, changePercent24h: -1.91 },
    { symbol: 'SOL', price: 178.90, change24h: 5.67, changePercent24h: 3.27 }
  ];

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;
    let connectionAttempts = 0;
    const maxAttempts = 3;

    // Set fallback data immediately
    setFallbackData(defaultPrices);

    const connect = () => {
      if (connectionAttempts >= maxAttempts) {
        console.log('Max connection attempts reached, using fallback data');
        setPrices(defaultPrices);
        return;
      }

      try {
        connectionAttempts++;
        ws = new WebSocket(`ws://${window.location.host}/ws/prices`);

        const connectionTimer = setTimeout(() => {
          if (ws.readyState === WebSocket.CONNECTING) {
            ws.close();
            console.log('Connection timeout, using fallback data');
            setPrices(defaultPrices);
          }
        }, 3000);

        ws.onopen = () => {
          clearTimeout(connectionTimer);
          console.log('LiveTicker WebSocket connected');
          setIsConnected(true);
          connectionAttempts = 0; // Reset on successful connection
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'price_update' && data.prices) {
              setPrices(data.prices);
            }
          } catch (error) {
            console.error('Error parsing price data:', error);
          }
        };

        ws.onclose = () => {
          clearTimeout(connectionTimer);
          console.log('LiveTicker WebSocket disconnected');
          setIsConnected(false);

          if (connectionAttempts < maxAttempts) {
            reconnectTimeout = setTimeout(connect, 2000);
          } else {
            setPrices(defaultPrices);
          }
        };

        ws.onerror = (error) => {
          clearTimeout(connectionTimer);
          console.error('LiveTicker WebSocket error:', error);
          setIsConnected(false);
          setPrices(defaultPrices);
        };
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        setIsConnected(false);
        setPrices(defaultPrices);
      }
    };

    connect();

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // Combine and prepare ticker data with real-time updates
  const tickerItems: TickerItem[] = [
    // Crypto data with real-time price updates
    ...(Array.isArray(cryptoData) ? cryptoData.slice(0, 10).map(item => {
      const realtimePrice = getPrice(item.symbol.toUpperCase());
      const realtimeChange = getChange(item.symbol.toUpperCase());

      return {
        ...item,
        current_price: realtimePrice > 0 ? realtimePrice : item.current_price,
        price_change_percentage_24h: realtimeChange !== 0 ? realtimeChange : item.price_change_percentage_24h
      };
    }) : []),
    // Metals data (no real-time updates available)
    ...(Array.isArray(metalsData) ? metalsData.slice(0, 3) : [])
  ];

  // Auto-scroll through ticker items
  useEffect(() => {
    if (tickerItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [tickerItems.length]);


  // Use fallback data if no prices available from WebSocket
  const displayPrices = prices.length > 0 ? prices : fallbackData;

  if (displayPrices.length === 0 && cryptoIsLoading && metalsIsLoading) {
    return (
      <div className="bg-gray-50 border-b border-gray-200 py-2 px-4">
        <div className="flex items-center justify-center text-gray-500 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-green-600 mr-2"></div>
          Loading market data...
        </div>
      </div>
    );
  }

  if (cryptoIsError || metalsIsError) {
    return (
      <div className="bg-red-50 border-b border-red-200 py-2 px-4">
        <div className="flex items-center justify-center text-red-600 text-sm">
          <span>Market data temporarily unavailable</span>
        </div>
      </div>
    );
  }

  if (tickerItems.length === 0 && displayPrices.length === 0) {
    return (
      <div className="bg-secondary dark:bg-gray-900 text-foreground py-2 overflow-hidden">
        <div className="animate-pulse flex items-center justify-center">
          <span className="text-sm">No market data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-x-auto scrollbar-hide space-x-8">
            {tickerItems.map((item, index) => {
              const isPositive = (item.price_change_percentage_24h || 0) >= 0;
              const formattedPrice = typeof item.current_price === 'number' 
                ? item.current_price.toLocaleString(undefined, { 
                    minimumFractionDigits: item.current_price < 1 ? 6 : 2, 
                    maximumFractionDigits: item.current_price < 1 ? 6 : 2 
                  }) 
                : '0.00';

              return (
                <span key={index} className="flex items-center space-x-2 flex-shrink-0">
                  <span className="font-semibold text-gray-100">{item.symbol}</span>
                  <span className="text-white font-medium">
                    ${formattedPrice}
                  </span>
                  <span className={`text-xs font-medium flex items-center ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <span className="mr-1">{isPositive ? '▲' : '▼'}</span>
                    {Math.abs(item.price_change_percentage_24h || 0).toFixed(2)}%
                  </span>
                  {/* Show real-time indicator for crypto */}
                  {topCryptoSymbols.includes(item.symbol.toUpperCase()) && isRealTimeConnected && (
                    <span className="text-xs text-blue-400 opacity-60">●</span>
                  )}
                </span>
              );
            })}
          </div>

          {/* Connection Status Indicator */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {isConnected ? (
              <div className="flex items-center space-x-1 text-green-400">
                <Wifi className="h-3 w-3" />
                <span className="text-xs">Live</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-yellow-400">
                <WifiOff className="h-3 w-3" />
                <span className="text-xs">Offline</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}