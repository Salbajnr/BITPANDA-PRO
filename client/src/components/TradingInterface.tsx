import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function TradingInterface() {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const tradeMutation = useMutation({
    mutationFn: async (tradeData: any) => {
      await apiRequest('POST', '/api/trade', tradeData);
    },
    onSuccess: () => {
      toast({
        title: "Trade Executed",
        description: `${orderType.toUpperCase()} order for ${amount} ${symbol.split('/')[0]} has been placed successfully.`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
      setAmount('');
      setPrice('');
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Trade Failed",
        description: "Unable to execute trade. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTrade = () => {
    if (!amount || !price) {
      toast({
        title: "Invalid Input",
        description: "Please enter both amount and price.",
        variant: "destructive",
      });
      return;
    }

    const baseSymbol = symbol.split('/')[0];
    const total = parseFloat(amount) * parseFloat(price);

    tradeMutation.mutate({
      type: orderType,
      symbol: baseSymbol,
      name: baseSymbol,
      amount: amount,
      price: price,
      total: total.toString(),
      fees: (total * 0.001).toString(), // 0.1% fee
      status: 'completed'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Chart Placeholder */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Market Overview</h3>
            <div className="flex space-x-2">
              <Button size="sm" className="bg-primary text-white">1H</Button>
              <Button size="sm" variant="outline">24H</Button>
              <Button size="sm" variant="outline">7D</Button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="h-64 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Real-time Trading Chart</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Live market data integration coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Trade Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Trade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Trading Pair */}
            <div>
              <Label htmlFor="pair">Trading Pair</Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                  <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                  <SelectItem value="ADA/USDT">ADA/USDT</SelectItem>
                  <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
                  <SelectItem value="DOT/USDT">DOT/USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order Type */}
            <div className="flex space-x-2">
              <Button
                type="button"
                className={`flex-1 ${orderType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-300 dark:bg-slate-600'}`}
                onClick={() => setOrderType('buy')}
              >
                Buy
              </Button>
              <Button
                type="button"
                className={`flex-1 ${orderType === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-300 dark:bg-slate-600'}`}
                onClick={() => setOrderType('sell')}
              >
                Sell
              </Button>
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount">Amount ({symbol.split('/')[0]})</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.0001"
                min="0"
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price">Price (USDT)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Market Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                min="0"
              />
            </div>

            {/* Total */}
            {amount && price && (
              <div>
                <Label>Total</Label>
                <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <span className="font-semibold">
                    ${(parseFloat(amount) * parseFloat(price)).toFixed(2)} USDT
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleTrade}
              disabled={tradeMutation.isPending}
              className={`w-full py-3 font-medium transition-colors ${
                orderType === 'buy'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {tradeMutation.isPending ? 'Processing...' : `Place ${orderType.toUpperCase()} Order`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
