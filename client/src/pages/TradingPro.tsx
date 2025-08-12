
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, TrendingDown, Activity, BarChart3, 
  Zap, Target, Clock, DollarSign 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

export default function TradingPro() {
  const { user } = useAuth();
  const [selectedPair, setSelectedPair] = useState("BTC/USD");
  const [orderType, setOrderType] = useState("market");
  const [orderSide, setOrderSide] = useState("buy");

  const { data: cryptoData = [] } = useQuery({
    queryKey: ['crypto-data'],
    queryFn: async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1');
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Access Denied</h2>
          <p className="text-slate-600 dark:text-slate-400">Please log in to access the trading platform.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <Navbar />
      
      <div className="pt-16">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Professional Trading</h1>
            <p className="text-slate-600 dark:text-slate-400">Advanced trading interface with real-time data</p>
          </div>

          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
            {/* Trading Pairs */}
            <div className="col-span-2">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Markets</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {cryptoData.slice(0, 10).map((crypto: any) => (
                      <div 
                        key={crypto.id}
                        onClick={() => setSelectedPair(`${crypto.symbol.toUpperCase()}/USD`)}
                        className={`p-3 cursor-pointer transition-colors ${
                          selectedPair === `${crypto.symbol.toUpperCase()}/USD` 
                            ? 'bg-primary/10 border-l-2 border-primary' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-sm">{crypto.symbol.toUpperCase()}/USD</div>
                            <div className="text-xs text-slate-500">${crypto.current_price.toFixed(2)}</div>
                          </div>
                          <Badge variant={crypto.price_change_percentage_24h >= 0 ? "default" : "destructive"} className="text-xs">
                            {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart Area */}
            <div className="col-span-7">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{selectedPair}</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">1M</Button>
                      <Button variant="outline" size="sm">5M</Button>
                      <Button variant="outline" size="sm">1H</Button>
                      <Button size="sm">1D</Button>
                      <Button variant="outline" size="sm">1W</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Advanced chart integration coming soon</p>
                    <p className="text-sm text-slate-400">TradingView integration will be added here</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Panel */}
            <div className="col-span-3">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Place Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs value={orderSide} onValueChange={setOrderSide}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="buy" className="text-green-600">Buy</TabsTrigger>
                      <TabsTrigger value="sell" className="text-red-600">Sell</TabsTrigger>
                    </TabsList>
                    
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label>Order Type</Label>
                        <Select value={orderType} onValueChange={setOrderType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="market">Market</SelectItem>
                            <SelectItem value="limit">Limit</SelectItem>
                            <SelectItem value="stop">Stop Loss</SelectItem>
                            <SelectItem value="take-profit">Take Profit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {orderType === 'limit' && (
                        <div>
                          <Label>Price (USD)</Label>
                          <Input type="number" placeholder="0.00" />
                        </div>
                      )}
                      
                      <div>
                        <Label>Amount</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      
                      <div>
                        <Label>Total (USD)</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      
                      <Button 
                        className={`w-full ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                      >
                        {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedPair.split('/')[0]}
                      </Button>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Order Book & Recent Trades */}
            <div className="col-span-6">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Order Book</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 h-64">
                    <div>
                      <h4 className="text-sm font-medium text-red-600 mb-2">Asks (Sell Orders)</h4>
                      <div className="space-y-1">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="text-red-600">{(50000 + i * 50).toLocaleString()}</span>
                            <span className="text-slate-500">{(Math.random() * 2).toFixed(4)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-green-600 mb-2">Bids (Buy Orders)</h4>
                      <div className="space-y-1">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="text-green-600">{(49950 - i * 50).toLocaleString()}</span>
                            <span className="text-slate-500">{(Math.random() * 2).toFixed(4)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Trades */}
            <div className="col-span-6">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className={Math.random() > 0.5 ? 'text-green-600' : 'text-red-600'}>
                          {(50000 + (Math.random() - 0.5) * 1000).toFixed(2)}
                        </span>
                        <span className="text-slate-500">{(Math.random() * 2).toFixed(4)}</span>
                        <span className="text-slate-400">{new Date().toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
