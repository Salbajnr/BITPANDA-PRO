import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  StarIcon, SearchIcon, PlusIcon, TrendingUpIcon, TrendingDownIcon,
  BellIcon, TrashIcon, EyeIcon, AlertTriangleIcon, DollarSignIcon
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
  sparkline_in_7d: { price: number[] };
}

interface WatchlistItem {
  id: string;
  userId: string;
  symbol: string;
  name: string;
  targetPrice?: number;
  alertEnabled: boolean;
  addedAt: string;
}

interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
}

// Mock data for demonstration
const mockCryptoData: CryptoAsset[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 26200,
    price_change_24h: 450.25,
    price_change_percentage_24h: 1.75,
    market_cap: 509000000000,
    volume_24h: 12500000000,
    sparkline_in_7d: { price: [25500, 25800, 26000, 25900, 26100, 26300, 26200] }
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    current_price: 1650,
    price_change_24h: -15.30,
    price_change_percentage_24h: -0.92,
    market_cap: 198000000000,
    volume_24h: 6200000000,
    sparkline_in_7d: { price: [1680, 1670, 1660, 1650, 1645, 1655, 1650] }
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    current_price: 0.294,
    price_change_24h: 0.0086,
    price_change_percentage_24h: 3.01,
    market_cap: 10300000000,
    volume_24h: 185000000,
    sparkline_in_7d: { price: [0.285, 0.288, 0.290, 0.292, 0.291, 0.293, 0.294] }
  }
];

export default function Watchlist() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [targetPrice, setTargetPrice] = useState("");

  const { data: watchlistItems = [], isLoading } = useQuery<WatchlistItem[]>({
    queryKey: ["/api/watchlist"],
    retry: false,
    enabled: !!user,
  });

  const { data: priceAlerts = [] } = useQuery<PriceAlert[]>({
    queryKey: ["/api/price-alerts"],
    retry: false,
    enabled: !!user,
  });

  const addToWatchlistMutation = useMutation({
    mutationFn: (data: { symbol: string; name: string; targetPrice?: number }) =>
      apiRequest('/api/watchlist', { method: 'POST', body: data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Added to watchlist",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      setShowAddForm(false);
      setSelectedSymbol("");
      setTargetPrice("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add to watchlist",
        variant: "destructive",
      });
    },
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/watchlist/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Removed from watchlist",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove from watchlist",
        variant: "destructive",
      });
    },
  });

  const setPriceAlertMutation = useMutation({
    mutationFn: (data: { symbol: string; targetPrice: number; condition: 'above' | 'below' }) =>
      apiRequest('/api/price-alerts', { method: 'POST', body: data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Price alert set",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/price-alerts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to set price alert",
        variant: "destructive",
      });
    },
  });

  const filteredCrypto = mockCryptoData.filter(crypto => 
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToWatchlist = (crypto: CryptoAsset) => {
    addToWatchlistMutation.mutate({
      symbol: crypto.symbol.toUpperCase(),
      name: crypto.name,
      targetPrice: targetPrice ? parseFloat(targetPrice) : undefined
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Watchlist
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Track your favorite cryptocurrencies and set price alerts
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          data-testid="button-add-watchlist"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add to Watchlist
        </Button>
      </div>

      {/* Price Alerts Summary */}
      {priceAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellIcon className="h-5 w-5" />
              Active Price Alerts ({priceAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {priceAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                  data-testid={`alert-${alert.symbol}`}
                >
                  <div className="flex items-center space-x-2">
                    <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{alert.symbol}</span>
                  </div>
                  <div className="text-sm">
                    {alert.condition} ${alert.targetPrice.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add to Watchlist Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add to Watchlist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search cryptocurrencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-crypto"
                />
              </div>

              {searchTerm && (
                <div className="max-h-60 overflow-y-auto border rounded-lg">
                  {filteredCrypto.map((crypto) => (
                    <div
                      key={crypto.id}
                      className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b last:border-b-0"
                      data-testid={`crypto-option-${crypto.symbol}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-bold text-xs text-primary">
                            {crypto.symbol.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{crypto.name}</div>
                          <div className="text-sm text-slate-500">
                            ${crypto.current_price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm ${
                          crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddToWatchlist(crypto)}
                          disabled={addToWatchlistMutation.isPending}
                          data-testid={`button-add-${crypto.symbol}`}
                        >
                          <StarIcon className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Watchlist Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EyeIcon className="h-5 w-5" />
            Your Watchlist ({watchlistItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {watchlistItems.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <StarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Your watchlist is empty</p>
              <p className="text-sm">Add cryptocurrencies to track their performance</p>
            </div>
          ) : (
            <div className="space-y-4">
              {watchlistItems.map((item) => {
                const cryptoData = mockCryptoData.find(c => c.symbol === item.symbol.toLowerCase());
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    data-testid={`watchlist-item-${item.symbol}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-sm text-primary">{item.symbol}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {item.name}
                        </div>
                        {item.targetPrice && (
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Target: ${item.targetPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {cryptoData && (
                        <div className="text-right">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            ${cryptoData.current_price.toLocaleString()}
                          </div>
                          <div className={`text-sm flex items-center ${
                            cryptoData.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {cryptoData.price_change_percentage_24h >= 0 ? (
                              <TrendingUpIcon className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDownIcon className="h-3 w-3 mr-1" />
                            )}
                            {cryptoData.price_change_percentage_24h >= 0 ? '+' : ''}{cryptoData.price_change_percentage_24h.toFixed(2)}%
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const price = cryptoData?.current_price || 0;
                            setPriceAlertMutation.mutate({
                              symbol: item.symbol,
                              targetPrice: price * 1.1, // 10% above current price
                              condition: 'above'
                            });
                          }}
                          data-testid={`button-alert-${item.symbol}`}
                        >
                          <BellIcon className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromWatchlistMutation.mutate(item.id)}
                          disabled={removeFromWatchlistMutation.isPending}
                          data-testid={`button-remove-${item.symbol}`}
                        >
                          <TrashIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
