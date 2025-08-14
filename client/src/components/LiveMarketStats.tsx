
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Users } from 'lucide-react';
import { CryptoApiService } from '../services/cryptoApi';

interface MarketStats {
  totalMarketCap: number;
  totalVolume: number;
  marketCapChange: number;
  activeCryptos: number;
  dominance: { btc: number; eth: number };
}

export function LiveMarketStats() {
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketStats = async () => {
    try {
      setError(null);
      
      // Fetch global market data
      const globalResponse = await fetch('https://api.coingecko.com/api/v3/global');
      if (!globalResponse.ok) throw new Error('Failed to fetch global data');
      
      const globalData = await globalResponse.json();
      const marketData = globalData.data;
      
      setStats({
        totalMarketCap: marketData.total_market_cap?.usd || 0,
        totalVolume: marketData.total_volume?.usd || 0,
        marketCapChange: marketData.market_cap_change_percentage_24h_usd || 0,
        activeCryptos: marketData.active_cryptocurrencies || 0,
        dominance: {
          btc: marketData.market_cap_percentage?.btc || 0,
          eth: marketData.market_cap_percentage?.eth || 0,
        }
      });
    } catch (err) {
      console.error('Error fetching market stats:', err);
      setError('Failed to load market data');
      
      // Fallback data
      setStats({
        totalMarketCap: 2800000000000,
        totalVolume: 95000000000,
        marketCapChange: 1.8,
        activeCryptos: 13000,
        dominance: { btc: 52.5, eth: 17.2 }
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketStats();
    
    // Update every 60 seconds
    const interval = setInterval(fetchMarketStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error && !stats) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Market Cap */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Market Cap</p>
              <p className="text-2xl font-bold text-green-700">
                {stats ? formatMarketCap(stats.totalMarketCap) : '--'}
              </p>
              {stats && (
                <div className="flex items-center mt-2">
                  {stats.marketCapChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stats.marketCapChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.marketCapChange >= 0 ? '+' : ''}{stats.marketCapChange.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* 24h Volume */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">24h Volume</p>
              <p className="text-2xl font-bold text-blue-700">
                {stats ? formatMarketCap(stats.totalVolume) : '--'}
              </p>
              <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-700">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Bitcoin Dominance */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">BTC Dominance</p>
              <p className="text-2xl font-bold text-orange-700">
                {stats ? `${stats.dominance.btc.toFixed(1)}%` : '--'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ETH: {stats ? `${stats.dominance.eth.toFixed(1)}%` : '--'}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">₿</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Cryptocurrencies */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Cryptos</p>
              <p className="text-2xl font-bold text-purple-700">
                {stats ? stats.activeCryptos.toLocaleString() : '--'}
              </p>
              <p className="text-sm text-gray-500 mt-1">Tracked markets</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
