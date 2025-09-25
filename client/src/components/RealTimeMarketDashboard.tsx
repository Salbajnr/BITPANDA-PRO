
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/useWebSocket";
import { getCryptoLogo } from "@/components/CryptoLogos";
import { 
  TrendingUp, TrendingDown, DollarSign, Activity,
  AlertTriangle, Star, Zap, Globe
} from "lucide-react";

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  volume_24h: number;
  market_cap: number;
  price_change_percentage_7d: number;
  sparkline_7d?: number[];
}

interface TopMover {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  type: 'gainer' | 'loser';
}

export default function RealTimeMarketDashboard() {
  const { prices, isConnected, lastUpdate } = useWebSocket();
  const [activeTab, setActiveTab] = useState('overview');
  const [marketStats, setMarketStats] = useState({
    totalMarketCap: 0,
    totalVolume: 0,
    btcDominance: 0,
    activeAssets: 0
  });

  // Convert WebSocket data to market data format
  const marketData: MarketData[] = Array.from(prices.values()).map(price => ({
    symbol: price.symbol,
    name: price.name || price.symbol,
    price: price.price,
    change_24h: price.change_24h,
    volume_24h: price.volume_24h,
    market_cap: price.market_cap,
    price_change_percentage_7d: price.change_24h * 1.2, // Mock 7d data
    sparkline_7d: generateSparkline(price.price, price.change_24h)
  }));

  // Calculate market statistics
  useEffect(() => {
    if (marketData.length > 0) {
      const totalMarketCap = marketData.reduce((sum, asset) => sum + asset.market_cap, 0);
      const totalVolume = marketData.reduce((sum, asset) => sum + asset.volume_24h, 0);
      const btcMarketCap = marketData.find(asset => asset.symbol === 'BTC')?.market_cap || 0;
      const btcDominance = totalMarketCap > 0 ? (btcMarketCap / totalMarketCap) * 100 : 0;

      setMarketStats({
        totalMarketCap,
        totalVolume,
        btcDominance,
        activeAssets: marketData.length
      });
    }
  }, [marketData]);

  const getTopMovers = (type: 'gainers' | 'losers'): TopMover[] => {
    return marketData
      .sort((a, b) => type === 'gainers' ? b.change_24h - a.change_24h : a.change_24h - b.change_24h)
      .slice(0, 5)
      .map(asset => ({
        symbol: asset.symbol,
        name: asset.name,
        price: asset.price,
        change_24h: asset.change_24h,
        type: type === 'gainers' ? 'gainer' : 'loser'
      }));
  };

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  function generateSparkline(price: number, change: number): number[] {
    const points = 7;
    const sparkline = [];
    const basePrice = price / (1 + change / 100);
    
    for (let i = 0; i < points; i++) {
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const dayPrice = basePrice * (1 + (change / 100) * (i / (points - 1)) + variation);
      sparkline.push(dayPrice);
    }
    
    return sparkline;
  }

  const MiniSparkline = ({ data }: { data: number[] }) => {
    if (!data || data.length < 2) return null;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    
    if (range === 0) return <div className="w-16 h-8" />;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 28 - ((value - min) / range) * 24;
      return `${x},${y}`;
    }).join(' ');
    
    const isPositive = data[data.length - 1] >= data[0];
    
    return (
      <svg width="60" height="28" className="inline-block">
        <polyline
          fill="none"
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected to live market data' : 'Disconnected'}
          </span>
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
        <Badge variant={isConnected ? "default" : "destructive"}>
          <Activity className="w-3 h-3 mr-1" />
          {isConnected ? 'Live' : 'Offline'}
        </Badge>
      </div>

      {/* Market Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Market Cap</p>
                <p className="text-lg font-bold">{formatMarketCap(marketStats.totalMarketCap)}</p>
              </div>
              <Globe className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">24h Volume</p>
                <p className="text-lg font-bold">{formatMarketCap(marketStats.totalVolume)}</p>
              </div>
              <Activity className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">BTC Dominance</p>
                <p className="text-lg font-bold">{marketStats.btcDominance.toFixed(1)}%</p>
              </div>
              <DollarSign className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Assets</p>
                <p className="text-lg font-bold">{marketStats.activeAssets}</p>
              </div>
              <Zap className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
          <TabsTrigger value="losers">Top Losers</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live Market Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketData.slice(0, 10).map((asset) => (
                  <div key={asset.symbol} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <img 
                        src={getCryptoLogo(asset.symbol)} 
                        alt={asset.symbol}
                        className="w-8 h-8"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/32/64748b/ffffff?text=${asset.symbol.charAt(0)}`;
                        }}
                      />
                      <div>
                        <p className="font-medium">{asset.symbol}</p>
                        <p className="text-sm text-muted-foreground">{asset.name}</p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <MiniSparkline data={asset.sparkline_7d} />
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(asset.price)}</p>
                      <div className="flex items-center gap-1">
                        {asset.change_24h >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <span className={`text-sm ${asset.change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {asset.change_24h >= 0 ? '+' : ''}{asset.change_24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gainers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <TrendingUp className="h-5 w-5" />
                Top Gainers (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTopMovers('gainers').map((asset, index) => (
                  <div key={asset.symbol} className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <img 
                        src={getCryptoLogo(asset.symbol)} 
                        alt={asset.symbol}
                        className="w-8 h-8"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/32/64748b/ffffff?text=${asset.symbol.charAt(0)}`;
                        }}
                      />
                      <div>
                        <p className="font-medium">{asset.symbol}</p>
                        <p className="text-sm text-muted-foreground">{asset.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(asset.price)}</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-sm text-green-500">
                          +{asset.change_24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="losers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <TrendingDown className="h-5 w-5" />
                Top Losers (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTopMovers('losers').map((asset, index) => (
                  <div key={asset.symbol} className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <img 
                        src={getCryptoLogo(asset.symbol)} 
                        alt={asset.symbol}
                        className="w-8 h-8"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/32/64748b/ffffff?text=${asset.symbol.charAt(0)}`;
                        }}
                      />
                      <div>
                        <p className="font-medium">{asset.symbol}</p>
                        <p className="text-sm text-muted-foreground">{asset.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(asset.price)}</p>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="h-3 w-3 text-red-500" />
                        <span className="text-sm text-red-500">
                          {asset.change_24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watchlist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Your Watchlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No assets in your watchlist yet</p>
                <Button className="mt-4" variant="outline">
                  Add Assets to Watchlist
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
