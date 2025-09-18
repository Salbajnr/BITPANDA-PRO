import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { getCryptoLogo } from "@/components/CryptoLogos";
import {
  TrendingUp, TrendingDown, ArrowUpDown, Wallet,
  DollarSign, Activity, Clock, Target, Zap,
  AlertCircle, CheckCircle, RefreshCw, BarChart3
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface OrderData {
  symbol: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  amount: number;
  price?: number;
}

interface Portfolio {
  totalValue: string;
  availableCash: string;
}

interface Holding {
  symbol: string;
  name: string;
  amount: string;
  averagePurchasePrice: string;
  currentPrice: string;
}

export default function Trading() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, navigate] = useLocation();
  
  // Get symbol from URL params
  const urlParams = new URLSearchParams(location.split('?')[1]);
  const initialSymbol = urlParams.get('symbol') || 'BTC';
  
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol.toUpperCase());
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [priceType, setPriceType] = useState<'market' | 'limit'>('market');
  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch crypto market data
  const { data: cryptoData, isLoading: cryptoLoading } = useQuery({
    queryKey: ['/api/crypto/markets'],
    queryFn: () => api.get('/crypto/markets'),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch user portfolio
  const { data: portfolioData, isLoading: portfolioLoading } = useQuery({
    queryKey: ['/api/portfolio'],
    queryFn: () => api.get('/portfolio'),
    enabled: !!user,
  });

  // Fetch price history for chart
  const { data: priceHistory } = useQuery({
    queryKey: ['/api/crypto/history', selectedSymbol],
    queryFn: () => api.get(`/crypto/history/${selectedSymbol}`),
    refetchInterval: 30000,
  });

  // Execute trade mutation
  const tradeMutation = useMutation({
    mutationFn: (orderData: OrderData) => api.post('/trading/execute', orderData),
    onSuccess: () => {
      toast({
        title: "Trade Executed",
        description: `${orderType.toUpperCase()} order for ${amount} ${selectedSymbol} completed successfully`,
      });
      setAmount('');
      setLimitPrice('');
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
    },
    onError: (error: any) => {
      toast({
        title: "Trade Failed",
        description: error.message || "Failed to execute trade",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const selectedCrypto = cryptoData?.find((crypto: any) => crypto.symbol.toUpperCase() === selectedSymbol);
  const currentPrice = selectedCrypto?.current_price || 0;
  const priceChange = selectedCrypto?.price_change_percentage_24h || 0;

  const userHolding = portfolioData?.holdings?.find((holding: Holding) => 
    holding.symbol.toUpperCase() === selectedSymbol
  );

  const calculateTotal = () => {
    const amountNum = parseFloat(amount) || 0;
    const price = priceType === 'market' ? currentPrice : (parseFloat(limitPrice) || currentPrice);
    return amountNum * price;
  };

  const handleTrade = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to start trading",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (priceType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid limit price",
        variant: "destructive",
      });
      return;
    }

    const total = calculateTotal();
    const availableCash = parseFloat(portfolioData?.portfolio?.availableCash || '0');
    const availableAmount = parseFloat(userHolding?.amount || '0');

    if (orderType === 'buy' && total > availableCash) {
      toast({
        title: "Insufficient Funds",
        description: `You need $${total.toFixed(2)} but only have $${availableCash.toFixed(2)} available`,
        variant: "destructive",
      });
      return;
    }

    if (orderType === 'sell' && parseFloat(amount) > availableAmount) {
      toast({
        title: "Insufficient Holdings",
        description: `You can only sell up to ${availableAmount} ${selectedSymbol}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const orderData: OrderData = {
      symbol: selectedSymbol,
      type: orderType,
      orderType: priceType,
      amount: parseFloat(amount),
      ...(priceType === 'limit' && { price: parseFloat(limitPrice) }),
    };

    tradeMutation.mutate(orderData);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border border-gray-200">
            <CardContent className="p-8 text-center">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-black mb-2">Login Required</h3>
              <p className="text-gray-600 mb-6">
                Please login to access the trading platform
              </p>
              <Button onClick={() => navigate('/auth')} className="bg-green-500 hover:bg-green-600">
                Login to Trade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Trading Platform</h1>
          <p className="text-xl text-gray-600">
            Buy and sell cryptocurrencies with real-time market data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trading Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Symbol Selection */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-black">Select Cryptocurrency</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select a cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptoData?.map((crypto: any) => (
                      <SelectItem key={crypto.symbol} value={crypto.symbol.toUpperCase()}>
                        <div className="flex items-center space-x-2">
                          <img 
                            src={getCryptoLogo(crypto.symbol)} 
                            alt={crypto.name}
                            className="w-6 h-6"
                          />
                          <span>{crypto.name} ({crypto.symbol.toUpperCase()})</span>
                          <span className="text-gray-500">${crypto.current_price.toLocaleString()}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Price Chart */}
            {selectedCrypto && (
              <Card className="border border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={getCryptoLogo(selectedSymbol)} 
                        alt={selectedCrypto.name}
                        className="w-10 h-10"
                      />
                      <div>
                        <CardTitle className="text-xl font-bold text-black">
                          {selectedCrypto.name} ({selectedSymbol})
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-black">
                            ${currentPrice.toLocaleString()}
                          </span>
                          <div className={`flex items-center ${
                            priceChange >= 0 ? 'text-green-600' : 'text-red-500'
                          }`}>
                            {priceChange >= 0 ? 
                              <TrendingUp className="w-4 h-4 mr-1" /> : 
                              <TrendingDown className="w-4 h-4 mr-1" />
                            }
                            <span className="font-medium">
                              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {priceHistory && priceHistory.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={priceHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="timestamp" 
                          stroke="#6b7280"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          fontSize={12}
                          domain={['dataMin * 0.99', 'dataMax * 1.01']}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#22c55e" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-300 flex items-center justify-center">
                      <p className="text-gray-500">Price chart loading...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Order Form */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-black">Place Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Type Selection */}
                <Tabs value={orderType} onValueChange={(value) => setOrderType(value as 'buy' | 'sell')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                      Buy
                    </TabsTrigger>
                    <TabsTrigger value="sell" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                      Sell
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Price Type Selection */}
                <div className="space-y-2">
                  <Label className="text-black font-medium">Order Type</Label>
                  <Select value={priceType} onValueChange={(value) => setPriceType(value as 'market' | 'limit')}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market Order</SelectItem>
                      <SelectItem value="limit">Limit Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label className="text-black font-medium">Amount ({selectedSymbol})</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border-gray-300 focus:border-green-500"
                  />
                  {userHolding && orderType === 'sell' && (
                    <p className="text-sm text-gray-500">
                      Available: {parseFloat(userHolding.amount).toFixed(8)} {selectedSymbol}
                    </p>
                  )}
                </div>

                {/* Limit Price Input */}
                {priceType === 'limit' && (
                  <div className="space-y-2">
                    <Label className="text-black font-medium">Limit Price (USD)</Label>
                    <Input
                      type="number"
                      placeholder={currentPrice.toString()}
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(e.target.value)}
                      className="border-gray-300 focus:border-green-500"
                    />
                  </div>
                )}

                {/* Order Summary */}
                {amount && (
                  <Card className="bg-gray-50 border border-gray-200">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium text-black">{amount} {selectedSymbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium text-black">
                            ${(priceType === 'market' ? currentPrice : (parseFloat(limitPrice) || currentPrice)).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-bold text-black text-lg">
                            ${calculateTotal().toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleTrade}
                  disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
                  className={`w-full py-3 text-lg font-semibold ${
                    orderType === 'buy' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : orderType === 'buy' ? (
                    <TrendingUp className="w-4 h-4 mr-2" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-2" />
                  )}
                  {isSubmitting ? 'Processing...' : `${orderType.toUpperCase()} ${selectedSymbol}`}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio & Holdings */}
          <div className="space-y-6">
            {/* Portfolio Summary */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-black">Portfolio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {portfolioLoading ? (
                  <div className="text-center py-4">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-green-500" />
                    <p className="text-gray-500">Loading portfolio...</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Value:</span>
                        <span className="font-bold text-black text-lg">
                          ${parseFloat(portfolioData?.portfolio?.totalValue || '0').toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available Cash:</span>
                        <span className="font-medium text-green-600">
                          ${parseFloat(portfolioData?.portfolio?.availableCash || '0').toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Holdings */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-black">Your Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                {portfolioData?.holdings?.length > 0 ? (
                  <div className="space-y-3">
                    {portfolioData.holdings.map((holding: Holding) => (
                      <div key={holding.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={getCryptoLogo(holding.symbol)} 
                            alt={holding.name}
                            className="w-8 h-8"
                          />
                          <div>
                            <div className="font-medium text-black">{holding.name}</div>
                            <div className="text-sm text-gray-500">{holding.symbol.toUpperCase()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-black">
                            {parseFloat(holding.amount).toFixed(6)}
                          </div>
                          <div className="text-sm text-gray-500">
                            ${(parseFloat(holding.amount) * parseFloat(holding.currentPrice)).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">No holdings yet</p>
                    <p className="text-sm text-gray-400">Start trading to build your portfolio</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-black">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('/portfolio')} 
                  variant="outline" 
                  className="w-full justify-start border-gray-300 hover:border-green-500"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Portfolio
                </Button>
                <Button 
                  onClick={() => navigate('/transactions')} 
                  variant="outline" 
                  className="w-full justify-start border-gray-300 hover:border-green-500"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Transaction History
                </Button>
                <Button 
                  onClick={() => navigate('/alerts')} 
                  variant="outline" 
                  className="w-full justify-start border-gray-300 hover:border-green-500"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Price Alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  ShoppingCart,
  Target,
  Clock,
  BarChart3,
  Activity,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Zap
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  market_cap: number;
  total_volume: number;
}

export default function Trading() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [total, setTotal] = useState(0);

  if (!user) {
    return <Redirect to="/auth" />;
  }

  const { data: cryptoData = [], isLoading } = useQuery({
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

  const { data: portfolio } = useQuery({
    queryKey: ['/api/portfolio'],
    queryFn: async () => {
      const response = await fetch('/api/portfolio', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch portfolio');
      return response.json();
    }
  });

  const executeTradeMutation = useMutation({
    mutationFn: async (tradeData: any) => {
      const response = await fetch('/api/trading/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(tradeData)
      });
      if (!response.ok) throw new Error('Failed to execute trade');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Trade Executed",
        description: "Your trade has been successfully executed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
      // Reset form
      setAmount('');
      setPrice('');
      setTotal(0);
    },
    onError: (error: any) => {
      toast({
        title: "Trade Failed",
        description: error.message || "Failed to execute trade",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (selectedAsset && amount) {
      const currentPrice = orderType === 'market' ? selectedAsset.current_price : parseFloat(price) || 0;
      setTotal(parseFloat(amount) * currentPrice);
    }
  }, [amount, price, selectedAsset, orderType]);

  const handleTrade = () => {
    if (!selectedAsset || !amount) {
      toast({
        title: "Missing Information",
        description: "Please select an asset and enter amount",
        variant: "destructive",
      });
      return;
    }

    if (orderType === 'limit' && !price) {
      toast({
        title: "Missing Price",
        description: "Please enter a price for limit orders",
        variant: "destructive",
      });
      return;
    }

    const tradeData = {
      symbol: selectedAsset.symbol,
      type: tradeType,
      orderType,
      amount: parseFloat(amount),
      price: orderType === 'limit' ? parseFloat(price) : selectedAsset.current_price
    };

    executeTradeMutation.mutate(tradeData);
  };

  // Mock chart data
  const chartData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    price: selectedAsset ? selectedAsset.current_price * (0.95 + Math.random() * 0.1) : 0
  }));

  const availableCash = portfolio?.portfolio?.availableCash ? parseFloat(portfolio.portfolio.availableCash) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Trading
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Buy and sell cryptocurrencies with real-time market data
              </p>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Asset Selection */}
              <div className="col-span-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Select Asset
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-8">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                        <p>Loading assets...</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {cryptoData.slice(0, 20).map((asset: CryptoAsset) => (
                          <div
                            key={asset.id}
                            onClick={() => setSelectedAsset(asset)}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedAsset?.id === asset.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <img src={asset.image} alt={asset.name} className="w-8 h-8" />
                                <div>
                                  <div className="font-semibold">{asset.symbol.toUpperCase()}</div>
                                  <div className="text-sm text-gray-500">{asset.name}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">${asset.current_price.toLocaleString()}</div>
                                <div className={`text-sm flex items-center ${
                                  asset.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {asset.price_change_percentage_24h >= 0 ? (
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3 mr-1" />
                                  )}
                                  {asset.price_change_percentage_24h.toFixed(2)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <div className="col-span-5">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        {selectedAsset ? `${selectedAsset.symbol.toUpperCase()} Chart` : 'Select an Asset'}
                      </span>
                      {selectedAsset && (
                        <Badge className={selectedAsset.price_change_percentage_24h >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {selectedAsset.price_change_percentage_24h >= 0 ? '+' : ''}{selectedAsset.price_change_percentage_24h.toFixed(2)}%
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedAsset ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="price" 
                              stroke="#3b82f6" 
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p>Select an asset to view chart</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Trading Panel */}
              <div className="col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Place Order
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Buy/Sell Tabs */}
                    <Tabs value={tradeType} onValueChange={(value: any) => setTradeType(value)}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="buy" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                          Buy
                        </TabsTrigger>
                        <TabsTrigger value="sell" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                          Sell
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    {/* Order Type */}
                    <div>
                      <Label>Order Type</Label>
                      <Select value={orderType} onValueChange={(value: any) => setOrderType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market Order</SelectItem>
                          <SelectItem value="limit">Limit Order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Amount */}
                    <div>
                      <Label>Amount ({selectedAsset?.symbol.toUpperCase() || 'Asset'})</Label>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.00000001"
                      />
                    </div>

                    {/* Price (for limit orders) */}
                    {orderType === 'limit' && (
                      <div>
                        <Label>Price (USD)</Label>
                        <Input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder={selectedAsset?.current_price.toString() || '0.00'}
                          step="0.01"
                        />
                      </div>
                    )}

                    {/* Total */}
                    <div>
                      <Label>Total (USD)</Label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-lg font-semibold">
                          ${total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Available Balance */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span>Available Cash:</span>
                        <span className="font-semibold">${availableCash.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Trade Button */}
                    <Button
                      onClick={handleTrade}
                      disabled={!selectedAsset || !amount || executeTradeMutation.isPending}
                      className={`w-full ${
                        tradeType === 'buy' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {executeTradeMutation.isPending ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : tradeType === 'buy' ? (
                        <ShoppingCart className="w-4 h-4 mr-2" />
                      ) : (
                        <DollarSign className="w-4 h-4 mr-2" />
                      )}
                      {executeTradeMutation.isPending ? 'Processing...' : `${tradeType.toUpperCase()} ${selectedAsset?.symbol.toUpperCase() || 'Asset'}`}
                    </Button>

                    {/* Risk Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <div className="text-xs text-yellow-800">
                          <strong>Risk Warning:</strong> Cryptocurrency trading involves significant risk. Only trade with funds you can afford to lose.
                        </div>
                      </div>
                    </div>
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
