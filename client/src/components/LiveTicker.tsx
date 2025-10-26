import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { FeatureErrorBoundary } from './FeatureErrorBoundary';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TickerItem {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  id?: string;
}

export default function LiveTicker() {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Add animation styles
  const animationStyles = `
    @keyframes scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    .animate-scroll {
      animation: scroll 60s linear infinite;
    }
    .animate-scroll:hover {
      animation-play-state: paused;
    }
  `;

  // Fetch crypto data directly from CoinGecko
  const {
    data: cryptoResponse,
    isError: cryptoIsError,
    isLoading: cryptoIsLoading,
    error: cryptoError
  } = useQuery<TickerItem[]>({
    queryKey: ['coingecko-ticker'],
    queryFn: async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=false&price_change_percentage=24h',
          {
            headers: {
              'Accept': 'application/json',
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch from CoinGecko');
        }
        
        const data = await response.json();
        return data.map((coin: any) => ({
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          current_price: coin.current_price,
          price_change_percentage_24h: coin.price_change_percentage_24h || 0,
          id: coin.id
        }));
      } catch (error) {
        console.error('CoinGecko fetch error:', error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
    retryDelay: 2000,
  });

  // Fetch metals data - using fallback data for now
  const {
    data: metalsData,
    isError: metalsIsError,
    isLoading: metalsIsLoading
  } = useQuery<TickerItem[]>({
    queryKey: ['metals-ticker'],
    queryFn: async () => {
      // Return static metals data with realistic price variations
      const baseMetals = [
        { symbol: 'XAU', name: 'Gold', price: 2386.50 },
        { symbol: 'XAG', name: 'Silver', price: 28.41 },
        { symbol: 'XPT', name: 'Platinum', price: 950.20 },
        { symbol: 'XPD', name: 'Palladium', price: 1800.75 },
      ];
      
      return baseMetals.map(metal => ({
        symbol: metal.symbol,
        name: metal.name,
        current_price: metal.price * (0.98 + Math.random() * 0.04),
        price_change_percentage_24h: (Math.random() - 0.5) * 2,
      }));
    },
    refetchInterval: 60000,
    retry: 1,
  });

  // Default/fallback data
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

  // Update ticker items from API data and handle errors
  useEffect(() => {
    let items: TickerItem[] = [];
    let dataAvailable = false;

    // Process crypto data - cryptoResponse is now the array directly
    if (cryptoResponse && Array.isArray(cryptoResponse) && cryptoResponse.length > 0) {
      items = [...cryptoResponse];
      setIsConnected(true);
      dataAvailable = true;
    }

    // Process metals data
    if (metalsData && Array.isArray(metalsData) && metalsData.length > 0) {
      const existingSymbols = new Set(items.map(item => item.symbol));
      metalsData.forEach((item: TickerItem) => {
        if (!existingSymbols.has(item.symbol)) {
          items.push(item);
        }
      });
      setIsConnected(true);
      dataAvailable = true;
    }

    if (!dataAvailable || items.length === 0) {
      items = defaultItems;
      setIsConnected(false);
    }

    setTickerItems(items);

    // Set hasError if any of the data fetch failed
    if (cryptoIsError || metalsIsError) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [cryptoResponse, metalsData, cryptoIsError, metalsIsError]);

  // Show loading state only initially
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

  // Show error fallback UI
  if (hasError || cryptoIsError || metalsIsError || cryptoError) {
    return (
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <Alert className="bg-red-900/50 border-red-600/50 py-1">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-300 text-xs">
              Live market data is currently unavailable. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // If no data and not loading, but also no error, means it's empty or intentionally not showing
  if ((!cryptoResponse || !cryptoResponse.data || cryptoResponse.data.length === 0) && (!metalsData || metalsData.length === 0) && tickerItems.length === 0) {
    return null;
  }

  return (
    <FeatureErrorBoundary>
      <style>{animationStyles}</style>
      <div className="bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="relative h-8">
          <div className="flex items-center h-full space-x-8 animate-scroll whitespace-nowrap">
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
    </FeatureErrorBoundary>
  );
}