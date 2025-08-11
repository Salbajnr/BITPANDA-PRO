import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ApiService } from "@/lib/api";

export default function TradingInterface() {
  const [orderType, setOrderType] = useState("market");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cryptoData = [] } = useQuery({
    queryKey: ['crypto-prices'],
    queryFn: () => ApiService.get('/api/crypto-prices'), // Changed to use ApiService
    refetchInterval: 30000,
  });

  const tradeMutation = useMutation({
    mutationFn: async (tradeData: {
      type: 'buy' | 'sell';
      symbol: string;
      amount: string;
      price: string;
      total: string;
      name?: string;
    }) => {
      // Assuming ApiService handles the POST request to /api/trade
      return ApiService.post('/api/trade', tradeData);
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Trade Executed",
        description: `Successfully ${variables.type === 'buy' ? 'bought' : 'sold'} ${variables.amount} ${variables.symbol.toUpperCase()}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setAmount("");
      setPrice("");
      setSelectedCrypto(""); // Reset selected crypto as well
    },
    onError: (error: any) => { // Changed error type to any for broader compatibility
      toast({
        title: "Trade Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const selectedCryptoData = cryptoData.find(crypto => crypto.id === selectedCrypto);
  const currentPrice = selectedCryptoData?.current_price || 0;
  const estimatedTotal = parseFloat(amount || "0") * (orderType === "market" ? currentPrice : parseFloat(price || "0"));

  const handleTrade = (type: 'buy' | 'sell') => {
    if (!selectedCrypto || !amount) {
      toast({
        title: "Missing Information",
        description: "Please select a cryptocurrency and enter an amount",
        variant: "destructive",
      });
      return;
    }

    const tradePrice = orderType === "market" ? currentPrice.toString() : price;
    if (!tradePrice || parseFloat(tradePrice) <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    tradeMutation.mutate({
      type,
      symbol: selectedCryptoData?.symbol || selectedCrypto,
      amount,
      price: tradePrice,
      name: selectedCryptoData?.name || selectedCrypto,
      total: (parseFloat(amount) * parseFloat(tradePrice)).toString(),
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Quick Trade</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="crypto-select">Cryptocurrency</Label>
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