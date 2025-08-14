import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CryptoPrice } from "../services/cryptoApi";
import { useRealTimePrice } from "../hooks/useRealTimePrice";
import { TrendingUp, TrendingDown, X, Activity, DollarSign } from "lucide-react";

interface TradingInterfaceProps {
  crypto: CryptoPrice;
  onClose: () => void;
}

export function TradingInterface({ crypto, onClose }: TradingInterfaceProps) {
  const [orderType, setOrderType] = useState("market");
  const [amount, setAmount] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [activeTab, setActiveTab] = useState("buy");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { getPrice, getChange, isConnected } = useRealTimePrice([crypto.id]);
  const currentPrice = getPrice(crypto.id) || crypto.current_price;
  const priceChange = getChange(crypto.id) || crypto.price_change_percentage_24h;

  const tradeMutation = useMutation({
    mutationFn: async (tradeData: {
      type: 'buy' | 'sell';
      symbol: string;
      name: string;
      amount: string;
      price: string;
      orderType: string;
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
        description: `${variables.type === 'buy' ? 'Bought' : 'Sold'} ${variables.amount} ${variables.symbol.toUpperCase()} at $${Number(variables.price).toLocaleString()}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      setAmount("");
      setLimitPrice("");
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

  const handleTrade = (type: 'buy' | 'sell') => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (orderType === "limit" && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid limit price",
        variant: "destructive",
      });
      return;
    }

    tradeMutation.mutate({
      type,
      symbol: crypto.symbol,
      name: crypto.name,
      amount,
      price: tradePrice.toString(),
      orderType,
    });
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

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
        {/* Order Type Selector */}
        <div className="space-y-2">
          <Label className="text-gray-300">Order Type</Label>
          <Tabs value={orderType} onValueChange={setOrderType} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="market" data-testid="button-market-order">Market</TabsTrigger>
              <TabsTrigger value="limit" data-testid="button-limit-order">Limit</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Buy/Sell Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="buy" className="data-[state=active]:bg-green-600" data-testid="button-buy-tab">
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-red-600" data-testid="button-sell-tab">
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4 mt-4">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="buy-amount" className="text-gray-300">
                Amount ({crypto.symbol.toUpperCase()})
              </Label>
              <Input
                id="buy-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                data-testid="input-trade-amount"
              />
            </div>

            {/* Limit Price Input */}
            {orderType === "limit" && (
              <div className="space-y-2">
                <Label htmlFor="buy-price" className="text-gray-300">
                  Limit Price (USD)
                </Label>
                <Input
                  id="buy-price"
                  type="number"
                  placeholder="0.00"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid="input-limit-price"
                />
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-gray-800 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price:</span>
                <span className="text-white">${formatPrice(tradePrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Amount:</span>
                <span className="text-white">{amount || '0'} {crypto.symbol.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm font-medium border-t border-gray-700 pt-2">
                <span className="text-gray-300">Total:</span>
                <span className="text-white">${estimatedTotal.toLocaleString()}</span>
              </div>
            </div>

            <Button
              onClick={() => handleTrade('buy')}
              disabled={tradeMutation.isPending || !amount}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              data-testid="button-execute-buy"
            >
              {tradeMutation.isPending ? (
                <Activity className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <DollarSign className="h-4 w-4 mr-2" />
              )}
              {tradeMutation.isPending ? 'Processing...' : `Buy ${crypto.symbol.toUpperCase()}`}
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4 mt-4">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="sell-amount" className="text-gray-300">
                Amount ({crypto.symbol.toUpperCase()})
              </Label>
              <Input
                id="sell-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                data-testid="input-sell-amount"
              />
            </div>

            {/* Limit Price Input */}
            {orderType === "limit" && (
              <div className="space-y-2">
                <Label htmlFor="sell-price" className="text-gray-300">
                  Limit Price (USD)
                </Label>
                <Input
                  id="sell-price"
                  type="number"
                  placeholder="0.00"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid="input-sell-limit-price"
                />
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-gray-800 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price:</span>
                <span className="text-white">${formatPrice(tradePrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Amount:</span>
                <span className="text-white">{amount || '0'} {crypto.symbol.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm font-medium border-t border-gray-700 pt-2">
                <span className="text-gray-300">Total:</span>
                <span className="text-white">${estimatedTotal.toLocaleString()}</span>
              </div>
            </div>

            <Button
              onClick={() => handleTrade('sell')}
              disabled={tradeMutation.isPending || !amount}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              data-testid="button-execute-sell"
            >
              {tradeMutation.isPending ? (
                <Activity className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <DollarSign className="h-4 w-4 mr-2" />
              )}
              {tradeMutation.isPending ? 'Processing...' : `Sell ${crypto.symbol.toUpperCase()}`}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
                    <Badge variant={selectedCryptoData.price_change_percentage_24h >= 0 ? "default" : "destructive"} className="ml-2">
                      {selectedCryptoData.price_change_percentage_24h >= 0 ? '+' : ''}
                      {selectedCryptoData.price_change_percentage_24h.toFixed(2)}%
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  step="0.00000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="order-type">Order Type</Label>
                <Select value={orderType} onValueChange={setOrderType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="limit">Limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {orderType === "limit" && (
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              )}

              <div className="flex flex-col justify-end">
                {estimatedTotal > 0 && (
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Total: ${estimatedTotal.toLocaleString()}
                  </div>
                )}
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handleTrade('buy')}
                  disabled={tradeMutation.isPending}
                >
                  {tradeMutation.isPending ? 'Processing...' : 'Buy'}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="crypto-select-sell">Cryptocurrency</Label>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crypto" />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptoData.map((crypto) => (
                      <SelectItem key={crypto.id} value={crypto.id}>
                        <div className="flex items-center">
                          <img src={crypto.image} alt={crypto.name} className="w-4 h-4 mr-2" />
                          {crypto.name} ({crypto.symbol.toUpperCase()})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCryptoData && (
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    ${selectedCryptoData.current_price.toLocaleString()}
                    <Badge variant={selectedCryptoData.price_change_percentage_24h >= 0 ? "default" : "destructive"} className="ml-2">
                      {selectedCryptoData.price_change_percentage_24h >= 0 ? '+' : ''}
                      {selectedCryptoData.price_change_percentage_24h.toFixed(2)}%
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="amount-sell">Amount</Label>
                <Input
                  id="amount-sell"
                  type="number"
                  placeholder="0.00"
                  step="0.00000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="order-type-sell">Order Type</Label>
                <Select value={orderType} onValueChange={setOrderType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="limit">Limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {orderType === "limit" && (
                <div>
                  <Label htmlFor="price-sell">Price ($)</Label>
                  <Input
                    id="price-sell"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              )}

              <div className="flex flex-col justify-end">
                {estimatedTotal > 0 && (
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Total: ${estimatedTotal.toLocaleString()}
                  </div>
                )}
                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => handleTrade('sell')}
                  disabled={tradeMutation.isPending}
                >
                  {tradeMutation.isPending ? 'Processing...' : 'Sell'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}