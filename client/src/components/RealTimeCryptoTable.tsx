import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CryptoApiService, CryptoPrice } from '../services/cryptoApi';
import { useRealTimePrice } from '../hooks/useRealTimePrice';
import { TrendingUp, TrendingDown, Search, Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface RealTimeCryptoTableProps {
  onTradeClick?: (crypto: CryptoPrice) => void;
  limit?: number;
  showWatchlist?: boolean;
}

export function RealTimeCryptoTable({ 
  onTradeClick, 
  limit = 50, 
  showWatchlist = true 
}: RealTimeCryptoTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<keyof CryptoPrice>('market_cap_rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data: cryptos = [], isLoading, error } = useQuery({
    queryKey: ['top-cryptos', limit],
    queryFn: () => CryptoApiService.getTopCryptos(limit),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const symbols = cryptos.map(crypto => crypto.id);
  const { prices, isConnected, getPrice, getChange } = useRealTimePrice(symbols);

  // Load watchlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('crypto-watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  const toggleWatchlist = (cryptoId: string) => {
    const newWatchlist = watchlist.includes(cryptoId)
      ? watchlist.filter(id => id !== cryptoId)
      : [...watchlist, cryptoId];
    
    setWatchlist(newWatchlist);
    localStorage.setItem('crypto-watchlist', JSON.stringify(newWatchlist));
  };

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCryptos = [...filteredCryptos].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Use real-time price if available
    if (sortBy === 'current_price') {
      aValue = getPrice(a.id) || a.current_price;
      bValue = getPrice(b.id) || b.current_price;
    }

    if (typeof aValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue);
    }

    const numA = Number(aValue) || 0;
    const numB = Number(bValue) || 0;
    
    return sortOrder === 'asc' ? numA - numB : numB - numA;
  });

  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    if (price < 100) return price.toFixed(2);
    return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Failed to load cryptocurrency data</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white">Live Markets</h2>
          <Badge 
            variant={isConnected ? "default" : "destructive"}
            className="px-3 py-1"
          >
            {isConnected ? "● LIVE" : "● OFFLINE"}
          </Badge>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search cryptocurrencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64 bg-gray-800 border-gray-700 text-white"
            data-testid="input-crypto-search"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button 
                    onClick={() => {
                      setSortBy('market_cap_rank');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                    className="text-gray-300 hover:text-white font-medium text-sm uppercase tracking-wide"
                    data-testid="button-sort-rank"
                  >
                    #
                  </button>
                </th>
                {showWatchlist && <th className="px-2 py-4"></th>}
                <th className="px-6 py-4 text-left">
                  <button 
                    onClick={() => {
                      setSortBy('name');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                    className="text-gray-300 hover:text-white font-medium text-sm uppercase tracking-wide"
                    data-testid="button-sort-name"
                  >
                    Name
                  </button>
                </th>
                <th className="px-6 py-4 text-right">
                  <button 
                    onClick={() => {
                      setSortBy('current_price');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                    className="text-gray-300 hover:text-white font-medium text-sm uppercase tracking-wide"
                    data-testid="button-sort-price"
                  >
                    Price
                  </button>
                </th>
                <th className="px-6 py-4 text-right">
                  <button 
                    onClick={() => {
                      setSortBy('price_change_percentage_24h');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                    className="text-gray-300 hover:text-white font-medium text-sm uppercase tracking-wide"
                    data-testid="button-sort-change"
                  >
                    24h Change
                  </button>
                </th>
                <th className="px-6 py-4 text-right">
                  <button 
                    onClick={() => {
                      setSortBy('market_cap');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                    className="text-gray-300 hover:text-white font-medium text-sm uppercase tracking-wide"
                    data-testid="button-sort-marketcap"
                  >
                    Market Cap
                  </button>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-gray-300 font-medium text-sm uppercase tracking-wide">
                    Action
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td colSpan={showWatchlist ? 7 : 6} className="px-6 py-4">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-gray-700 h-8 w-8"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                sortedCryptos.map((crypto) => {
                  const realTimePrice = getPrice(crypto.id);
                  const realTimeChange = getChange(crypto.id);
                  const currentPrice = realTimePrice || crypto.current_price;
                  const priceChange = realTimeChange || crypto.price_change_percentage_24h;
                  const isPositive = priceChange >= 0;

                  return (
                    <tr key={crypto.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                        data-testid={`row-crypto-${crypto.symbol}`}>
                      <td className="px-6 py-4 text-gray-400 font-medium">
                        {crypto.market_cap_rank}
                      </td>
                      {showWatchlist && (
                        <td className="px-2 py-4">
                          <button
                            onClick={() => toggleWatchlist(crypto.id)}
                            className="text-gray-400 hover:text-green-400 transition-colors"
                            data-testid={`button-watchlist-${crypto.symbol}`}
                          >
                            {watchlist.includes(crypto.id) ? (
                              <Star className="h-4 w-4 fill-current text-green-400" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={crypto.image} 
                            alt={crypto.name}
                            className="h-8 w-8 rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9zdmc+Cjwvc3ZnPgo=';
                            }}
                          />
                          <div>
                            <div className="text-white font-medium">{crypto.name}</div>
                            <div className="text-gray-400 text-sm uppercase">{crypto.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-white font-medium" data-testid={`text-price-${crypto.symbol}`}>
                          ${formatPrice(currentPrice)}
                        </span>
                        {realTimePrice && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            LIVE
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`flex items-center justify-end space-x-1 ${
                          isPositive ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {isPositive ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span className="font-medium" data-testid={`text-change-${crypto.symbol}`}>
                            {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-300">
                        {formatMarketCap(crypto.market_cap)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          onClick={() => onTradeClick?.(crypto)}
                          variant="outline"
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
                          data-testid={`button-trade-${crypto.symbol}`}
                        >
                          Trade
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}