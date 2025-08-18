
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, DollarSign, Calculator, Target, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CryptoApiService } from '@/services/cryptoApi';

interface TradingInterfaceProps {
  selectedSymbol?: string;
  onTradeComplete?: () => void;
}

export default function TradingInterface({ selectedSymbol, onTradeComplete }: TradingInterfaceProps) {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [symbol, setSymbol] = useState(selectedSymbol || 'BTC');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current price
  const { data: currentPrice, isLoading: priceLoading } = useQuery({
    queryKey: ['crypto-price', symbol.toLowerCase()],
    queryFn: () => CryptoApiService.getPrice(symbol.toLowerCase()),
    refetchInterval: 5000,
  });

  // Get user portfolio
  const { data: portfolio } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => api.get('/api/portfolio').then(res => res.data),
  });

  // Execute trade mutation
  const tradeMutation = useMutation({
    mutationFn: (tradeData: any) => api.post('/api/trade', tradeData),
    onSuccess: () => {
      toast({
        title: 'Trade Executed',
        description: `Successfully ${tradeType === 'buy' ? 'bought' : 'sold'} ${amount} ${symbol}`,
      });
      setAmount('');
      setPrice('');
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['holdings'] });
      onTradeComplete?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Trade Failed',
        description: error.response?.data?.message || 'Failed to execute trade',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (currentPrice && orderType === 'market') {
      setPrice(currentPrice.price.toString());
    }
  }, [currentPrice, orderType]);

  const handleTrade = () => {
    if (!amount || !price || !symbol) {
      toast({
        title: 'Invalid Input',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const tradeAmount = parseFloat(amount);
    const tradePrice = parseFloat(price);
    const total = tradeAmount * tradePrice;

    if (tradeType === 'buy' && portfolio && total > parseFloat(portfolio.availableCash)) {
      toast({
        title: 'Insufficient Funds',
        description: 'You do not have enough cash for this trade',
        variant: 'destructive',
      });
      return;
    }

    tradeMutation.mutate({
      type: tradeType,
      symbol: symbol.toUpperCase(),
      amount: tradeAmount.toString(),
      price: tradePrice.toString(),
      total: total.toString(),
      orderType,
    });
  };

  const totalValue = amount && price ? (parseFloat(amount) * parseFloat(price)).toFixed(2) : '0.00';
  const availableCash = portfolio?.availableCash ? parseFloat(portfolio.availableCash) : 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Trading Interface
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={tradeType} onValueChange={(value) => setTradeType(value as 'buy' | 'sell')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="text-green-600">Buy</TabsTrigger>
            <TabsTrigger value="sell" className="text-red-600">Sell</TabsTrigger>
          </TabsList>

          <TabsContent value={tradeType} className="space-y-4">
            {/* Symbol Selection */}
            <div className="space-y-2">
              <Label htmlFor="symbol">Cryptocurrency</Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="ADA">Cardano (ADA)</SelectItem>
                  <SelectItem value="DOT">Polkadot (DOT)</SelectItem>
                  <SelectItem value="SOL">Solana (SOL)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order Type */}
            <div className="space-y-2">
              <Label htmlFor="orderType">Order Type</Label>
              <Select value={orderType} onValueChange={(value) => setOrderType(value as 'market' | 'limit')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Current Price Display */}
            {currentPrice && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Current Price:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">${currentPrice.price.toFixed(2)}</span>
                  <Badge variant={currentPrice.change_24h >= 0 ? 'default' : 'destructive'}>
                    {currentPrice.change_24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(currentPrice.change_24h).toFixed(2)}%
                  </Badge>
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ({symbol})</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.00000001"
                min="0"
              />
            </div>

            {/* Price Input */}
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={orderType === 'market'}
                step="0.01"
                min="0"
              />
            </div>

            <Separator />

            {/* Trade Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Value:</span>
                <span className="font-semibold">${totalValue}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Cash:</span>
                <span className="font-semibold">${availableCash.toFixed(2)}</span>
              </div>
              {tradeType === 'buy' && parseFloat(totalValue) > availableCash && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Insufficient funds
                </div>
              )}
            </div>

            {/* Execute Trade Button */}
            <Button
              onClick={handleTrade}
              disabled={
                tradeMutation.isPending ||
                !amount ||
                !price ||
                (tradeType === 'buy' && parseFloat(totalValue) > availableCash)
              }
              className={`w-full ${tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {tradeMutation.isPending ? (
                'Processing...'
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  {tradeType === 'buy' ? 'Buy' : 'Sell'} {symbol}
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
