import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Search, Star, StarOff } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { Link } from 'wouter';

interface MarketAsset {
  id?: string;
  symbol: string;
  name: string;
  current_price?: number;
  price?: number;
  price_change_percentage_24h?: number;
  changePercent24h?: number;
  market_cap?: number;
  volume_24h?: number;
  type: 'crypto' | 'metal';
}

export default function Markets() {
  const { isAuthenticated } = useAuth();
  const [cryptoData, setCryptoData] = useState<MarketAsset[]>([]);
  const [metalsData, setMetalsData] = useState<MarketAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    fetchMarketData();
    if (isAuthenticated) {
      fetchWatchlist();
    }
  }, [isAuthenticated]);

  const fetchMarketData = async () => {
    try {
      const [cryptoResponse, metalsResponse] = await Promise.all([
        fetch('/api/crypto/trending'),
        fetch('/api/metals/prices')
      ]);

      if (cryptoResponse.ok) {
        const crypto = await cryptoResponse.json();
        setCryptoData(crypto.map((coin: any) => ({ ...coin, type: 'crypto' as const })));
      }

      if (metalsResponse.ok) {
        const metals = await metalsResponse.json();
        setMetalsData(metals.map((metal: any) => ({ ...metal, type: 'metal' as const })));
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWatchlist = async () => {
    try {
      const response = await fetch('/api/watchlist');
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data.map((item: any) => item.symbol));
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  const toggleWatchlist = async (symbol: string) => {
    if (!isAuthenticated) return;

    try {
      const isInWatchlist = watchlist.includes(symbol);
      const method = isInWatchlist ? 'DELETE' : 'POST';
      const response = await fetch('/api/watchlist', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol })
      });

      if (response.ok) {
        setWatchlist(prev => 
          isInWatchlist 
            ? prev.filter(s => s !== symbol)
            : [...prev, symbol]
        );
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  const formatPrice = (price: number, type: 'crypto' | 'metal') => {
    if (type === 'metal') {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return price > 1 ? `$${price.toFixed(2)}` : `$${price.toFixed(6)}`;
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </span>
    );
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toFixed(0)}`;
  };

  const filterAssets = (assets: MarketAsset[]) => {
    return assets.filter(asset => 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const AssetRow = ({ asset }: { asset: MarketAsset }) => {
    const price = asset.current_price || asset.price || 0;
    const change = asset.price_change_percentage_24h || asset.changePercent24h || 0;
    const isInWatchlist = watchlist.includes(asset.symbol);

    return (
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50" data-testid={`asset-row-${asset.symbol}`}>
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleWatchlist(asset.symbol)}
              className="p-1 h-6 w-6"
              data-testid={`watchlist-${asset.symbol}`}
            >
              {isInWatchlist ? 
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" /> : 
                <StarOff className="h-4 w-4 text-slate-400" />
              }
            </Button>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold" data-testid={`symbol-${asset.symbol}`}>{asset.symbol}</span>
              <Badge variant={asset.type === 'crypto' ? 'default' : 'secondary'}>
                {asset.type === 'crypto' ? 'CRYPTO' : 'METAL'}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{asset.name}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-semibold" data-testid={`price-${asset.symbol}`}>
            {formatPrice(price, asset.type)}
            {asset.type === 'metal' && <span className="text-sm text-slate-500 ml-1">/oz</span>}
          </div>
          <div data-testid={`change-${asset.symbol}`}>
            {formatChange(change)}
          </div>
        </div>

        {asset.type === 'crypto' && (
          <div className="text-right hidden md:block">
            <div className="text-sm font-medium" data-testid={`market-cap-${asset.symbol}`}>
              {asset.market_cap ? formatVolume(asset.market_cap) : 'N/A'}
            </div>
            <p className="text-xs text-slate-500">Market Cap</p>
          </div>
        )}

        {asset.type === 'crypto' && (
          <div className="text-right hidden lg:block">
            <div className="text-sm font-medium" data-testid={`volume-${asset.symbol}`}>
              {asset.volume_24h ? formatVolume(asset.volume_24h) : 'N/A'}
            </div>
            <p className="text-xs text-slate-500">24h Volume</p>
          </div>
        )}

        <div className="flex space-x-2">
          <Link href={`/trading?symbol=${asset.symbol}&type=${asset.type}`}>
            <Button size="sm" data-testid={`trade-${asset.symbol}`}>
              Trade
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48" />
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Markets</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Live prices for cryptocurrencies and precious metals
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="search-input"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">All Markets</TabsTrigger>
          <TabsTrigger value="crypto" data-testid="tab-crypto">Cryptocurrencies</TabsTrigger>
          <TabsTrigger value="metals" data-testid="tab-metals">Precious Metals</TabsTrigger>
          {isAuthenticated && (
            <TabsTrigger value="watchlist" data-testid="tab-watchlist">Watchlist</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Markets</CardTitle>
              <CardDescription>
                Combined view of cryptocurrency and precious metals markets
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0" data-testid="all-markets-list">
                {[...filterAssets(cryptoData), ...filterAssets(metalsData)].map((asset, index) => (
                  <AssetRow key={`${asset.symbol}-${index}`} asset={asset} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crypto">
          <Card>
            <CardHeader>
              <CardTitle>Cryptocurrencies</CardTitle>
              <CardDescription>
                Live cryptocurrency prices and market data
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0" data-testid="crypto-list">
                {filterAssets(cryptoData).map((asset, index) => (
                  <AssetRow key={`crypto-${asset.symbol}-${index}`} asset={asset} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metals">
          <Card>
            <CardHeader>
              <CardTitle>Precious Metals</CardTitle>
              <CardDescription>
                Live precious metals prices per ounce
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0" data-testid="metals-list">
                {filterAssets(metalsData).map((asset, index) => (
                  <AssetRow key={`metal-${asset.symbol}-${index}`} asset={asset} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAuthenticated && (
          <TabsContent value="watchlist">
            <Card>
              <CardHeader>
                <CardTitle>My Watchlist</CardTitle>
                <CardDescription>
                  Assets you're tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0" data-testid="watchlist">
                  {[...cryptoData, ...metalsData]
                    .filter(asset => watchlist.includes(asset.symbol))
                    .map((asset, index) => (
                      <AssetRow key={`watchlist-${asset.symbol}-${index}`} asset={asset} />
                    ))}
                  {watchlist.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      No assets in your watchlist yet. Start by clicking the star icon next to any asset.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}