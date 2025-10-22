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
import { useAuth } from '@/hooks/useAuth'
import { useGlobalMessageModal } from '@/contexts/MessageModalContext'
import { useLocation } from "wouter";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useToast } from "@/hooks/use-toast";
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
  const { showMessage } = useGlobalMessageModal();
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

  // WebSocket for real-time price updates
  const { lastMessage } = useWebSocket('/ws/prices');

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        if (data.type === 'price_update') {
          queryClient.setQueryData(['/api/crypto/markets'], (oldData: any) => {
            if (!oldData) return oldData;
            return oldData.map((crypto: any) => 
              crypto.symbol === data.symbol 
                ? { ...crypto, current_price: data.price, price_change_percentage_24h: data.change }
                : crypto
            );
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage, queryClient]);

  // Fetch crypto market data with error handling
  const { data: cryptoResponse, isLoading: cryptoLoading, error: cryptoError } = useQuery({
    queryKey: ['cryptoData'],
    queryFn: async () => {
      const response = await fetch('/api/crypto/market-data');
      if (!response.ok) throw new Error('Failed to fetch crypto data');
      return response.json();
    },
    refetchInterval: 30000,
  });

  // Handle different response formats
  const cryptoData = Array.isArray(cryptoResponse) ? cryptoResponse : cryptoResponse?.data || [];
  const selectedCrypto = Array.isArray(cryptoData) ? cryptoData.find((crypto: any) => crypto.symbol.toUpperCase() === selectedSymbol) : null;


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
        title: "Authentication Required",
        description: "Please login to start trading",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid trading amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) < 0.001) {
      toast({
        title: "Amount Too Small",
        description: "Minimum trading amount is 0.001",
        variant: "destructive",
      });
      return;
    }

    if (priceType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      toast({
        title: "Invalid Limit Price",
        description: "Please enter a valid limit price greater than 0",
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
        description: `You need $${total.toFixed(2)} but only have $${availableCash.toFixed(2)} available.`,
        variant: "destructive",
      });
      return;
    }

    if (orderType === 'sell' && parseFloat(amount) > availableAmount) {
      toast({
        title: "Insufficient Holdings",
        description: `You can only sell up to ${availableAmount} ${selectedSymbol}.`,
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

  // Add comprehensive error handling for crypto data
  if (cryptoLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (cryptoError || !Array.isArray(cryptoData)) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to load trading data</h2>
            <p className="text-gray-600 mb-4">Please check your connection and try again</p>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </div>
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