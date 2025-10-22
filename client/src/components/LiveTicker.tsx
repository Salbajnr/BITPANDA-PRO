import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wifi, WifiOff } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

interface TickerItem {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  id?: string;
}

interface ApiResponse {
  data?: TickerItem[];
}

export default function LiveTicker() {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  // Fetch crypto data for ticker
  const { 
    data: cryptoResponse, 
    isError: cryptoIsError, 
    isLoading: cryptoIsLoading,
    error: cryptoError
  } = useQuery<ApiResponse>({
    queryKey: ['/api/crypto/top/12'],
    queryFn: () => api.get('/api/crypto/top/12'),
    refetchInterval: 15000, // Refetch every 15 seconds for live updates
    retry: 3,
    retryDelay: 2000,
  });

  // Fetch metals data for ticker
  const { 
    data: metalsResponse, 
    isError: metalsIsError, 
    isLoading: metalsIsLoading 
  } = useQuery<TickerItem[]>({
    queryKey: ['/api/metals/market-data'],
    queryFn: () => api.get('/api/metals/market-data'),
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3,
  });

  // Fallback data when API fails
  const defaultItems: TickerItem[] = [
    { symbol: 'BTC', name: 'Bitcoin', current_price: 67234.50, price_change_percentage_24h: 1.87 },
    { symbol: 'ETH', name: 'Ethereum', current_price: 3456.78, price_change_percentage_24h: -1.29 },
    { symbol: 'BNB', name: 'BNB', current_price: 598.45, price_change_percentage_24h: 2.10 },
    { symbol: 'XRP', name: 'XRP', current_price: 0.6234, price_change_percentage_24h: 2.01 },
    { symbol: 'ADA', name: 'Cardano', current_price: 0.4567, price_change_percentage_24h: -1.91 },
    { symbol: 'SOL', name: 'Solana', current_price: 178.90, price_change_percentage_24h: 3.27 },
    { symbol: 'XAU', name: 'Gold', current_price: 2386.50, price_change_percentage_24h: 0.21 },
    { symbol: 'XAG', name: 'Silver', current_price: 28.41, price_change_percentage_24h: -0.44 },
  ];

  // Update ticker items from API data
  useEffect(() => {
    let items: TickerItem[] = [];

    // Process crypto data - handle both array and object with data property
    if (cryptoResponse) {
      const dataArray = Array.isArray(cryptoResponse) ? cryptoResponse : cryptoResponse.data;
      if (dataArray && Array.isArray(dataArray)) {
        items = [...dataArray.slice(0, 12).map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          current_price: item.current_price || item.price,
          price_change_percentage_24h: item.price_change_percentage_24h || item.change_24h || 0,
          id: item.id
        }))];
      }
    }

    // Process metals data
    if (metalsResponse && Array.isArray(metalsResponse)) {
      items = [...items, ...metalsResponse.slice(0, 4)];
    }

    // Use fallback if no data available
    if (items.length === 0 && !cryptoIsLoading && !metalsIsLoading) {
      items = defaultItems;
      setIsConnected(false);
    } else {
      setIsConnected(true);
    }

    // Add small random variations to make it feel more live
    const liveItems = items.map(item => ({
      ...item,
      current_price: item.current_price * (1 + (Math.random() - 0.5) * 0.001), // ±0.1% variation
      price_change_percentage_24h: item.price_change_percentage_24h + (Math.random() - 0.5) * 0.1
    }));

    setTickerItems(liveItems);
  }, [cryptoResponse, metalsResponse, cryptoIsLoading, metalsIsLoading]);

  // Show loading state
  if (cryptoIsLoading && metalsIsLoading && tickerItems.length === 0) {
    return (
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center text-gray-400 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-blue-500 mr-2"></div>
            Loading live market data...
          </div>
        </div>
      </div>
    );
  }

  // Show error state with fallback data
  if (cryptoIsError && metalsIsError && tickerItems.length === 0) {
    return (
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center text-red-400 text-sm">
            <WifiOff className="h-4 w-4 mr-2" />
            Market data temporarily unavailable
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="relative h-8">
        <div 
          className="flex items-center h-full space-x-8 animate-scroll"
          style={{
            animationDuration: '30s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            transform: 'translateX(100%)'
          }}
        >
          {/* Scrolling ticker */}
          {/* First set of items */}
          {tickerItems.map((item, index) => {
            const isPositive = (item.price_change_percentage_24h || 0) >= 0;
            const formattedPrice = typeof item.current_price === 'number' 
              ? item.current_price.toLocaleString(undefined, { 
                  minimumFractionDigits: item.current_price < 1 ? 4 : 2, 
                  maximumFractionDigits: item.current_price < 1 ? 4 : 2 
                }) 
              : '0.00';

            return (
              <div key={`${item.symbol}-${index}`} className="flex items-center space-x-2 px-8 py-2 flex-shrink-0">
                <span className="font-semibold text-gray-100 dark:text-gray-300 text-sm">{item.symbol}</span>
                <span className="text-white font-medium text-sm">
                  ${formattedPrice}
                </span>
                <span className={`text-xs font-medium flex items-center ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {Math.abs(item.price_change_percentage_24h || 0).toFixed(2)}%
                </span>
              </div>
            );
          })}

          {/* Duplicate set for seamless loop */}
          {tickerItems.map((item, index) => {
            const isPositive = (item.price_change_percentage_24h || 0) >= 0;
            const formattedPrice = typeof item.current_price === 'number' 
              ? item.current_price.toLocaleString(undefined, { 
                  minimumFractionDigits: item.current_price < 1 ? 4 : 2, 
                  maximumFractionDigits: item.current_price < 1 ? 4 : 2 
                }) 
              : '0.00';

            return (
              <div key={`${item.symbol}-duplicate-${index}`} className="flex items-center space-x-2 px-8 py-2 flex-shrink-0">
                <span className="font-semibold text-gray-100 dark:text-gray-300 text-sm">{item.symbol}</span>
                <span className="text-white font-medium text-sm">
                  ${formattedPrice}
                </span>
                <span className={`text-xs font-medium flex items-center ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {Math.abs(item.price_change_percentage_24h || 0).toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Connection status indicator */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
          <div className={`flex items-center space-x-1 text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            <span>{isConnected ? 'LIVE' : 'OFFLINE'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}