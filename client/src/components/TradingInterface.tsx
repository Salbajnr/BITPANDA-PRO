import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, DollarSign, Percent, Calculator, Activity, AlertTriangle, Target, Shield, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CryptoPrice, CryptoApiService } from "../services/cryptoApi";
import { useRealTimePrice } from "../hooks/useRealTimePrice";


interface TradingInterfaceProps {
  crypto: CryptoPrice;
  onClose: () => void;
}

export function TradingInterface({ crypto, onClose }: TradingInterfaceProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop_loss' | 'take_profit'>('market');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState("");
  const [limitPrice, setLimitPrice] = useState('');
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useStopLoss, setUseStopLoss] = useState(false);
  const [useTakeProfit, setUseTakeProfit] = useState(false);
  const [slippage, setSlippage] = useState('0.5');
  const [fees, setFees] = useState({ tradingFee: 0, netTotal: 0 });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { getPrice, getPriceChange, isConnected } = useRealTimePrice([crypto.id]);
  const currentPrice = getPrice(crypto.id) || crypto.current_price;
  const priceChange = getPriceChange(crypto.id) || crypto.price_change_percentage_24h;

  const tradeMutation = useMutation({
    mutationFn: async (tradeData: {
      type: 'buy' | 'sell';
      symbol: string;
      name: string;
      amount: string;
      price: string;
      orderType: string;
      stopLoss?: string;
      takeProfit?: string;
      slippage?: string;
    }) => {
      const response = await fetch('/api/trading/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradeData),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Trade execution failed');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Trade Executed Successfully",
        description: `${variables.type === 'buy' ? 'Bought' : 'Sold'} ${variables.amount} ${variables.symbol.toUpperCase()}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      setAmount("");
      setLimitPrice("");
      setStopLoss("");
      setTakeProfit("");
      setUseStopLoss(false);
      setUseTakeProfit(false);
    },
    onError: (error: any) => {
      toast({
        title: "Trade Failed",
        description: error.message || "Failed to execute trade",
        variant: "destructive",
      });
    },
  });

  const tradePrice = orderType === "market" ? currentPrice : parseFloat(limitPrice || "0");
  const estimatedTotal = parseFloat(amount || "0") * tradePrice;
  const isPositiveChange = priceChange >= 0;

  // Auto-update limit price when switching to limit order
  useEffect(() => {
    if (orderType === "limit" && !limitPrice) {
      setLimitPrice(currentPrice.toString());
    }
  }, [orderType, currentPrice, limitPrice]);

  // Calculate fees and net total
  useEffect(() => {
    if (amount && (orderType === "market" || limitPrice)) {
      const calculateFees = async () => {
        try {
          const price = orderType === "market" ? currentPrice : parseFloat(limitPrice || "0");
          const response = await fetch('/api/trading/calculate-fees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: parseFloat(amount),
              price: price,
              type: tradeType
            }),
            credentials: 'include',
          });

          if (response.ok) {
            const feeData = await response.json();
            setFees({
              tradingFee: parseFloat(feeData.tradingFee),
              netTotal: parseFloat(feeData.netTotal)
            });
          }
        } catch (error) {
          console.error('Failed to calculate fees:', error);
        }
      };

      calculateFees();
    }
  }, [amount, limitPrice, orderType, currentPrice, tradeType]);

  const handleTrade = async () => {
    const selectedCrypto = crypto; // Use the crypto prop directly
    const amountNum = parseFloat(amount);
    const priceNum = orderType === 'market' ? currentPrice : parseFloat(limitPrice || "0"); // Use limitPrice for limit orders

    // Basic validation
    if (!selectedCrypto || !amountNum || amountNum <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (orderType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid limit price",
        variant: "destructive",
      });
      return;
    }

    if (orderType === "stop_loss" && (!stopLoss || parseFloat(stopLoss) <= 0)) {
      toast({
        title: "Invalid Stop Loss Price",
        description: "Please enter a valid stop loss price",
        variant: "destructive",
      });
      return;
    }

    if (orderType === "take_profit" && (!takeProfit || parseFloat(takeProfit) <= 0)) {
      toast({
        title: "Invalid Take Profit Price",
        description: "Please enter a valid take profit price",
        variant: "destructive",
      });
      return;
    }

    const total = amountNum * priceNum;

    // Validate minimum trade value (e.g., $10)
    if (total < 10) {
      toast({
        title: "Minimum Trade Value",
        description: "Minimum trade value is $10",
        variant: "destructive",
      });
      return;
    }

    // Check for sufficient funds (buy orders)
    if (tradeType === 'buy') {
      // TODO: Get user's available cash from portfolio
      const availableCash = 10000; // Placeholder
      if (total > availableCash) {
        toast({
          title: "Insufficient Funds",
          description: `You need $${total.toFixed(2)} but only have $${availableCash.toFixed(2)}`,
          variant: "destructive",
        });
        return;
      }
    }

    // Check for sufficient holdings (sell orders)
    if (tradeType === 'sell') {
      // TODO: Get user's holdings for this crypto
      const holdings = 0; // Placeholder
      if (amountNum > holdings) {
        toast({
          title: "Insufficient Holdings",
          description: `You're trying to sell ${amountNum} ${selectedCrypto.symbol} but only have ${holdings}`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true); // Use isLoading for the mutation

    try {
      const response = await fetch('/api/trading/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          symbol: selectedCrypto.symbol,
          type: tradeType,
          orderType,
          amount: amountNum.toString(),
          price: priceNum.toString(),
          stopLoss: useStopLoss ? stopLoss : undefined,
          takeProfit: useTakeProfit ? takeProfit : undefined,
          slippage,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Trade Executed Successfully",
          description: `${tradeType === 'buy' ? 'Bought' : 'Sold'} ${amountNum} ${selectedCrypto.symbol} at $${result.executionPrice}`,
        });

        // Reset form
        setAmount("");
        setLimitPrice("");
        setStopLoss("");
        setTakeProfit("");
        setUseStopLoss(false);
        setUseTakeProfit(false);

        // Refresh portfolio data
        queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
        queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to execute trade');
      }
    } catch (error) {
      console.error('Trading error:', error);
      toast({
        title: "Trade Failed",
        description: error instanceof Error ? error.message : 'An error occurred while executing the trade',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // Set isLoading to false
    }
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const displayPrice = orderType === "market" ? currentPrice : parseFloat(limitPrice || "0");
  const displayTotal = parseFloat(amount || "0") * displayPrice;


  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={crypto.image}
            alt={crypto.name}
            className="h-8 w-8 rounded-full"
          />
          <div>
            <CardTitle className="text-white">{crypto.name}</CardTitle>
            <p className="text-sm text-gray-400 uppercase">{crypto.symbol}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-lg font-bold text-white">
              ${formatPrice(currentPrice)}
              {isConnected && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  LIVE
                </Badge>
              )}
            </p>
            <div className={`flex items-center text-sm ${
              isPositiveChange ? 'text-green-400' : 'text-red-400'
            }`}>
              {isPositiveChange ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {isPositiveChange ? '+' : ''}{priceChange.toFixed(2)}%
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            data-testid="button-close-trading"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs value={tradeType} onValueChange={(value: 'buy' | 'sell') => setTradeType(value)}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="buy" className="data-[state=active]:bg-green-600" data-testid="button-buy-tab">
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-red-600" data-testid="button-sell-tab">
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value={tradeType} className="space-y-4 mt-4">
            {/* Order Form Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="orderType">Order Type</Label>
                <Select value={orderType} onValueChange={(value: any) => setOrderType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select order type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">🚀 Market Order</SelectItem>
                    <SelectItem value="limit">🎯 Limit Order</SelectItem>
                    <SelectItem value="stop_loss">🛡️ Stop Loss</SelectItem>
                    <SelectItem value="take_profit">💰 Take Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount ({crypto.symbol.toUpperCase()})</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-trade-amount"
                  />
                </div>

                <div>
                  <Label htmlFor="price">
                    {orderType === 'market' ? 'Current Price' :
                     orderType === 'limit' ? 'Limit Price' :
                     orderType === 'stop_loss' ? 'Stop Price' : 'Target Price'} (USD)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={orderType === 'market' ? formatPrice(currentPrice) : orderType === 'limit' ? limitPrice : orderType === 'stop_loss' ? stopLoss : takeProfit}
                    onChange={(e) => {
                      if (orderType === 'limit') setLimitPrice(e.target.value);
                      else if (orderType === 'stop_loss') setStopLoss(e.target.value);
                      else if (orderType === 'take_profit') setTakeProfit(e.target.value);
                    }}
                    disabled={orderType === 'market'}
                    className="bg-gray-800 border-gray-700 text-white disabled:opacity-50"
                    data-testid={orderType === 'limit' ? "input-limit-price" : orderType === 'stop_loss' ? "input-stop-loss-price" : orderType === 'take_profit' ? "input-take-profit-price" : "input-price"}
                  />
                </div>
              </div>

              {/* Advanced Options */}
              <div className="border rounded-lg p-4 space-y-3 bg-slate-50 dark:bg-slate-800">
                <h4 className="font-medium text-sm">Advanced Options</h4>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    <Label htmlFor="useStopLoss" className="text-sm">Stop Loss</Label>
                  </div>
                  <Switch
                    id="useStopLoss"
                    checked={useStopLoss}
                    onCheckedChange={setUseStopLoss}
                  />
                </div>

                {useStopLoss && (
                  <Input
                    type="number"
                    placeholder="Stop loss price"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-green-500" />
                    <Label htmlFor="useTakeProfit" className="text-sm">Take Profit</Label>
                  </div>
                  <Switch
                    id="useTakeProfit"
                    checked={useTakeProfit}
                    onCheckedChange={setUseTakeProfit}
                  />
                </div>

                {useTakeProfit && (
                  <Input
                    type="number"
                    placeholder="Take profit price"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                )}

                <div>
                  <Label htmlFor="slippage" className="text-sm">Slippage Tolerance (%)</Label>
                  <Select value={slippage} onValueChange={setSlippage}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.1">0.1%</SelectItem>
                      <SelectItem value="0.5">0.5%</SelectItem>
                      <SelectItem value="1.0">1.0%</SelectItem>
                      <SelectItem value="3.0">3.0%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="total">Total (USD)</Label>
                <Input
                  id="total"
                  type="number"
                  placeholder="0.00"
                  value={displayTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  readOnly
                  className="bg-gray-800 border-gray-700 text-white opacity-50 cursor-not-allowed"
                />
              </div>

              {/* Order Preview */}
              <div className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20">
                <h5 className="font-medium text-sm mb-2">Order Preview</h5>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Order Type:</span>
                    <span className="font-medium">{orderType.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gross Total:</span>
                    <span className="font-medium">${displayTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Trading Fee (0.1%):</span>
                    <span>${fees.tradingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Net Total:</span>
                    <span>${fees.netTotal.toFixed(2)}</span>
                  </div>
                  {useStopLoss && (
                    <div className="flex justify-between text-red-600">
                      <span>Stop Loss:</span>
                      <span>${parseFloat(stopLoss || "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {useTakeProfit && (
                    <div className="flex justify-between text-green-600">
                      <span>Take Profit:</span>
                      <span>${parseFloat(takeProfit || "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleTrade}
                disabled={isLoading || !amount || (orderType === 'limit' && !limitPrice) || (orderType === "stop_loss" && useStopLoss && !stopLoss) || (orderType === "take_profit" && useTakeProfit && !takeProfit)}
                className={`w-full ${tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                data-testid={tradeType === 'buy' ? "button-execute-buy" : "button-execute-sell"}
              >
                {isLoading ? (
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <DollarSign className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Processing...' : `${tradeType.toUpperCase()} ${crypto.symbol.toUpperCase()}`}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}