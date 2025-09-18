import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWebSocket, type CryptoPrice } from '@/hooks/useWebSocket';
import { TrendingUp, TrendingDown, Activity, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { getCryptoLogo } from './CryptoLogos';

interface RealTimePriceWidgetProps {
  symbols?: string[];
  title?: string;
  showChart?: boolean;
  maxItems?: number;
  className?: string;
}

const RealTimePriceWidget: React.FC<RealTimePriceWidgetProps> = ({
  symbols = ['BTC', 'ETH', 'BNB', 'ADA', 'SOL'],
  title = 'Live Prices',
  showChart = true,
  maxItems = 5,
  className = ''
}) => {
  const [displayPrices, setDisplayPrices] = useState<CryptoPrice[]>([]);

  // Memoize symbols to prevent infinite re-renders
  const memoizedSymbols = useMemo(() => symbols, [symbols.join(',')]);

  const { 
    isConnected, 
    isConnecting, 
    connectionError, 
    prices, 
    lastUpdate, 
    connect, 
    getPrice 
  } = useWebSocket({
    symbols: memoizedSymbols,
    autoConnect: true,
    reconnectAttempts: 5,
    reconnectInterval: 3000
  });

  useEffect(() => {
    const filteredPrices = memoizedSymbols
      .map(symbol => getPrice(symbol))
      .filter(Boolean) as CryptoPrice[];

    setDisplayPrices(filteredPrices.slice(0, maxItems));
  }, [prices, maxItems, getPrice, memoizedSymbols]);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3" />;
    if (change < 0) return <TrendingDown className="w-3 h-3" />;
    return <Activity className="w-3 h-3" />;
  };

  const ConnectionStatus = () => (
    <div className="flex items-center space-x-2 text-sm">
      {isConnected ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-green-500">Live</span>
        </>
      ) : isConnecting ? (
        <>
          <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />
          <span className="text-yellow-500">Connecting...</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-red-500" />
          <span className="text-red-500">Offline</span>
        </>
      )}
    </div>
  );

  const PriceRow = ({ crypto }: { crypto: CryptoPrice }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          {getCryptoLogo(crypto.symbol, 'w-6 h-6')}
        </div>
        <div>
          <div className="font-medium text-sm">{crypto.symbol}</div>
          <div className="text-xs text-gray-500">{crypto.name}</div>
        </div>
      </div>

      <div className="text-right">
        <div className="font-medium text-sm">
          {formatPrice(crypto.price)}
        </div>
        <div className={`flex items-center space-x-1 text-xs ${getChangeColor(crypto.change_24h)}`}>
          {getChangeIcon(crypto.change_24h)}
          <span>{formatChange(crypto.change_24h)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <ConnectionStatus />
        </div>
        {lastUpdate && (
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {connectionError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-600 dark:text-red-400">
                {connectionError}
              </span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={connect}
                className="ml-2"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-0">
          {displayPrices.length > 0 ? (
            displayPrices.map((crypto) => (
              <PriceRow key={crypto.symbol} crypto={crypto} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {isConnecting ? (
                <>
                  <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                  <p>Loading price data...</p>
                </>
              ) : (
                <>
                  <Activity className="w-8 h-8 mx-auto mb-2" />
                  <p>No price data available</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={connect}
                    className="mt-2"
                  >
                    Connect
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {displayPrices.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500">Tracked Symbols:</span>
                <span className="ml-1 font-medium">{displayPrices.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <Badge 
                  variant={isConnected ? "default" : "secondary"} 
                  className="ml-1 text-xs"
                >
                  {isConnected ? 'Live' : 'Offline'}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimePriceWidget;