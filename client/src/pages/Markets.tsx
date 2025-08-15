import React, { useState, useEffect } from 'react';
import { RealTimeCryptoTable } from '../components/RealTimeCryptoTable';
import { useQuery } from '@tanstack/react-query';
import { CryptoApiService } from '../services/cryptoApi';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function Markets() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  const { data: marketData } = useQuery({
    queryKey: ['market-data'],
    queryFn: () => CryptoApiService.getMarketData(),
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: topCryptos = [] } = useQuery({
    queryKey: ['top-cryptos-market', 100],
    queryFn: () => CryptoApiService.getTopCryptos(100),
    refetchInterval: 30000,
  });

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const gainers = topCryptos
    .filter(crypto => crypto.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 10);

  const losers = topCryptos
    .filter(crypto => crypto.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 10);

  const totalMarketCap = marketData?.total_market_cap?.usd || 2800000000000;
  const totalVolume = marketData?.total_volume?.usd || 95000000000;
  const marketCapChange = marketData?.market_cap_change_percentage_24h_usd || 1.8;

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-bitpanda-text">
              Cryptocurrency Markets
            </h1>
            <p className="text-xl text-gray-600">
              Live market data and comprehensive crypto analysis
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="default" className="bg-green-600 px-4 py-2">
              <Activity className="h-4 w-4 mr-2" />
              Live Data
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Globe className="h-4 w-4 mr-2" />
              Global Markets
            </Badge>
          </div>
        </div>

        {/* Market Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Market Cap</p>
                <p className="text-2xl font-bold text-white">
                  {formatLargeNumber(totalMarketCap)}
                </p>
                <div className={`flex items-center text-sm ${
                  marketCapChange >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {marketCapChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {marketCapChange >= 0 ? '+' : ''}{marketCapChange.toFixed(2)}%
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">24h Trading Volume</p>
                <p className="text-2xl font-bold text-white">
                  {formatLargeNumber(totalVolume)}
                </p>
                <p className="text-blue-400 text-sm">+12.5%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Bitcoin Dominance</p>
                <p className="text-2xl font-bold text-white">54.2%</p>
                <p className="text-orange-400 text-sm">BTC</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-400" />
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Cryptocurrencies</p>
                <p className="text-2xl font-bold text-white">13,450</p>
                <p className="text-purple-400 text-sm">+2.1% weekly</p>
              </div>
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Market Categories */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 max-w-md">
            <TabsTrigger value="all" data-testid="tab-all-markets">All Markets</TabsTrigger>
            <TabsTrigger value="gainers" data-testid="tab-gainers">Top Gainers</TabsTrigger>
            <TabsTrigger value="losers" data-testid="tab-losers">Top Losers</TabsTrigger>
            <TabsTrigger value="volume" data-testid="tab-volume">High Volume</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <RealTimeCryptoTable 
              limit={100}
              showWatchlist={true}
            />
          </TabsContent>

          <TabsContent value="gainers" className="mt-6">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                  Top Gainers (24h)
                </h3>
              </div>
              <div className="divide-y divide-gray-800">
                {gainers.map((crypto, index) => (
                  <div key={crypto.id} className="flex items-center justify-between p-4 hover:bg-gray-800/50"
                       data-testid={`gainer-${crypto.symbol}`}>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400 font-medium w-6">#{index + 1}</span>
                      <img src={crypto.image} alt={crypto.name} className="h-6 w-6" />
                      <div>
                        <p className="text-white font-medium">{crypto.name}</p>
                        <p className="text-gray-400 text-sm uppercase">{crypto.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">
                        ${crypto.current_price.toLocaleString()}
                      </p>
                      <p className="text-green-400 text-sm font-medium">
                        +{crypto.price_change_percentage_24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="losers" className="mt-6">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <TrendingDown className="h-5 w-5 text-red-400 mr-2" />
                  Top Losers (24h)
                </h3>
              </div>
              <div className="divide-y divide-gray-800">
                {losers.map((crypto, index) => (
                  <div key={crypto.id} className="flex items-center justify-between p-4 hover:bg-gray-800/50"
                       data-testid={`loser-${crypto.symbol}`}>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400 font-medium w-6">#{index + 1}</span>
                      <img src={crypto.image} alt={crypto.name} className="h-6 w-6" />
                      <div>
                        <p className="text-white font-medium">{crypto.name}</p>
                        <p className="text-gray-400 text-sm uppercase">{crypto.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">
                        ${crypto.current_price.toLocaleString()}
                      </p>
                      <p className="text-red-400 text-sm font-medium">
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="volume" className="mt-6">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <BarChart3 className="h-5 w-5 text-blue-400 mr-2" />
                  Highest 24h Volume
                </h3>
              </div>
              <div className="divide-y divide-gray-800">
                {topCryptos
                  .sort((a, b) => b.total_volume - a.total_volume)
                  .slice(0, 10)
                  .map((crypto, index) => (
                    <div key={crypto.id} className="flex items-center justify-between p-4 hover:bg-gray-800/50"
                         data-testid={`volume-${crypto.symbol}`}>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-400 font-medium w-6">#{index + 1}</span>
                        <img src={crypto.image} alt={crypto.name} className="h-6 w-6" />
                        <div>
                          <p className="text-white font-medium">{crypto.name}</p>
                          <p className="text-gray-400 text-sm uppercase">{crypto.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">
                          ${crypto.current_price.toLocaleString()}
                        </p>
                        <p className="text-blue-400 text-sm font-medium">
                          Vol: {formatLargeNumber(crypto.total_volume)}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Markets;