import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  StopCircle,
  Clock,
  BarChart3,
  Activity,
  Zap,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AdvancedOrder {
  id: string;
  symbol: string;
  type: 'limit' | 'stop_loss' | 'take_profit' | 'trailing_stop';
  side: 'buy' | 'sell';
  amount: number;
  triggerPrice?: number;
  limitPrice?: number;
  trailingAmount?: number;
  status: 'pending' | 'filled' | 'cancelled';
  createdAt: Date;
}

export default function AdvancedTrading() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [orderType, setOrderType] = useState<'limit' | 'stop_loss' | 'take_profit' | 'trailing_stop'>('limit');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [triggerPrice, setTriggerPrice] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [trailingAmount, setTrailingAmount] = useState('');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [leverage, setLeverage] = useState([1]);
  const [timeInForce, setTimeInForce] = useState('GTC');

  if (!user) {
    return <Redirect to="/auth" />;
  }

  const { data: marketData } = useQuery({
    queryKey: ['/api/crypto/market-data'],
    queryFn: async () => {
      const response = await fetch('/api/crypto/market-data', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch market data');
      return response.json();
    },
    refetchInterval: 5000
  });

  const { data: activeOrders = [] } = useQuery({
    queryKey: ['/api/trading/orders/active'],
    queryFn: async () => {
      const response = await fetch('/api/trading/orders/active', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch active orders');
      return response.json();
    }
  });

  const { data: orderBook } = useQuery({
    queryKey: ['/api/trading/orderbook', selectedSymbol],
    queryFn: async () => {
      const response = await fetch(`/api/trading/orderbook/${selectedSymbol}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch order book');
      return response.json();
    },
    refetchInterval: 2000
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch('/api/trading/advanced-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error('Failed to place order');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trading/orders/active'] });
      // Reset form
      setAmount('');
      setTriggerPrice('');
      setLimitPrice('');
      setTrailingAmount('');
    }
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await fetch(`/api/trading/orders/${orderId}/cancel`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to cancel order');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trading/orders/active'] });
    }
  });

  const currentPrice = marketData?.find((crypto: any) => crypto.symbol === selectedSymbol)?.current_price || 0;

  const handlePlaceOrder = () => {
    const orderData = {
      symbol: selectedSymbol,
      type: orderType,
      side,
      amount: parseFloat(amount),
      triggerPrice: triggerPrice ? parseFloat(triggerPrice) : undefined,
      limitPrice: limitPrice ? parseFloat(limitPrice) : undefined,
      trailingAmount: trailingAmount ? parseFloat(trailingAmount) : undefined,
      timeInForce,
      leverage: leverage[0]
    };

    placeOrderMutation.mutate(orderData);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Advanced Trading
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Professional trading tools and advanced order types
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={isAdvancedMode}
                  onCheckedChange={setIsAdvancedMode}
                />
                <Label>Advanced Mode</Label>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Order Form */}
              <div className="col-span-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Advanced Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Symbol Selection */}
                    <div>
                      <Label>Trading Pair</Label>
                      <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {marketData?.slice(0, 10).map((crypto: any) => (
                            <SelectItem key={crypto.id} value={crypto.symbol.toUpperCase()}>
                              {crypto.symbol.toUpperCase()}/USD
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Order Type */}
                    <div>
                      <Label>Order Type</Label>
                      <Select value={orderType} onValueChange={(value: any) => setOrderType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="limit">Limit Order</SelectItem>
                          <SelectItem value="stop_loss">Stop Loss</SelectItem>
                          <SelectItem value="take_profit">Take Profit</SelectItem>
                          <SelectItem value="trailing_stop">Trailing Stop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Buy/Sell */}
                    <Tabs value={side} onValueChange={(value: any) => setSide(value)}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="buy" className="data-[state=active]:bg-green-500">
                          Buy
                        </TabsTrigger>
                        <TabsTrigger value="sell" className="data-[state=active]:bg-red-500">
                          Sell
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    {/* Amount */}
                    <div>
                      <Label>Amount ({selectedSymbol})</Label>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    {/* Conditional Fields */}
                    {(orderType === 'stop_loss' || orderType === 'take_profit') && (
                      <div>
                        <Label>Trigger Price (USD)</Label>
                        <Input
                          type="number"
                          value={triggerPrice}
                          onChange={(e) => setTriggerPrice(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    )}

                    {orderType === 'limit' && (
                      <div>
                        <Label>Limit Price (USD)</Label>
                        <Input
                          type="number"
                          value={limitPrice}
                          onChange={(e) => setLimitPrice(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    )}

                    {orderType === 'trailing_stop' && (
                      <div>
                        <Label>Trailing Amount (%)</Label>
                        <Input
                          type="number"
                          value={trailingAmount}
                          onChange={(e) => setTrailingAmount(e.target.value)}
                          placeholder="5.0"
                        />
                      </div>
                    )}

                    {/* Advanced Options */}
                    {isAdvancedMode && (
                      <>
                        <div>
                          <Label>Leverage: {leverage[0]}x</Label>
                          <Slider
                            value={leverage}
                            onValueChange={setLeverage}
                            max={10}
                            min={1}
                            step={0.1}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label>Time in Force</Label>
                          <Select value={timeInForce} onValueChange={setTimeInForce}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GTC">Good Till Cancelled</SelectItem>
                              <SelectItem value="IOC">Immediate or Cancel</SelectItem>
                              <SelectItem value="FOK">Fill or Kill</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    {/* Submit */}
                    <Button 
                      onClick={handlePlaceOrder}
                      disabled={placeOrderMutation.isPending || !amount}
                      className={`w-full ${side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      {placeOrderMutation.isPending ? 'Placing...' : `Place ${side.toUpperCase()} Order`}
                    </Button>

                    {/* Current Price */}
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Current Price
                        </span>
                        <span className="font-bold">
                          ${currentPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Book */}
              <div className="col-span-4">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Order Book - {selectedSymbol}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orderBook ? (
                      <div className="space-y-4">
                        {/* Asks (Sell Orders) */}
                        <div>
                          <h4 className="text-sm font-medium text-red-600 mb-2">Asks (Sell)</h4>
                          <div className="space-y-1">
                            {orderBook.asks?.slice(0, 5).map((ask: any, index: number) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-red-600">${ask[0]}</span>
                                <span className="text-slate-600">{ask[1]}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Current Price */}
                        <div className="py-2 px-3 bg-slate-100 dark:bg-slate-800 rounded text-center">
                          <span className="font-bold">${currentPrice.toLocaleString()}</span>
                        </div>

                        {/* Bids (Buy Orders) */}
                        <div>
                          <h4 className="text-sm font-medium text-green-600 mb-2">Bids (Buy)</h4>
                          <div className="space-y-1">
                            {orderBook.bids?.slice(0, 5).map((bid: any, index: number) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-green-600">${bid[0]}</span>
                                <span className="text-slate-600">{bid[1]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BarChart3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">Loading order book...</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Active Orders */}
              <div className="col-span-4">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Active Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activeOrders.length > 0 ? (
                      <div className="space-y-3">
                        {activeOrders.map((order: AdvancedOrder) => (
                          <div key={order.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant={order.side === 'buy' ? 'default' : 'destructive'}>
                                  {order.side.toUpperCase()}
                                </Badge>
                                <Badge variant="outline">
                                  {order.type.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => cancelOrderMutation.mutate(order.id)}
                                disabled={cancelOrderMutation.isPending}
                              >
                                Cancel
                              </Button>
                            </div>
                            <div className="text-sm space-y-1">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Symbol:</span>
                                <span>{order.symbol}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Amount:</span>
                                <span>{order.amount}</span>
                              </div>
                              {order.triggerPrice && (
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Trigger:</span>
                                  <span>${order.triggerPrice}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No active orders</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}