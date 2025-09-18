
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Star,
  DollarSign,
  Shield,
  Coins,
  Award,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  History,
  PieChart,
  Calculator
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface MetalPrice {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  unit: string;
  last_updated: string;
}

interface MetalHolding {
  id: string;
  symbol: string;
  name: string;
  amount: string;
  averagePurchasePrice: string;
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  amount: string;
  price: string;
  total: string;
  status: string;
  createdAt: string;
}

export default function MetalsTrading() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [metals, setMetals] = useState<MetalPrice[]>([]);
  const [holdings, setHoldings] = useState<MetalHolding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [tradeLoading, setTradeLoading] = useState(false);
  
  // Trade form state
  const [selectedMetal, setSelectedMetal] = useState<MetalPrice | null>(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeTotal, setTradeTotal] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  
  // Portfolio state
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [availableCash, setAvailableCash] = useState(0);

  useEffect(() => {
    fetchMetalPrices();
    fetchHoldings();
    fetchTransactions();
    fetchPortfolio();
  }, []);

  const fetchMetalPrices = async () => {
    try {
      const response = await fetch('/api/metals/top/10');
      if (response.ok) {
        const data = await response.json();
        setMetals(data);
      }
    } catch (error) {
      console.error('Failed to fetch metal prices:', error);
    }
  };

  const fetchHoldings = async () => {
    try {
      const response = await fetch('/api/metals-trading/holdings', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setHoldings(data);
      }
    } catch (error) {
      console.error('Failed to fetch holdings:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/metals-trading/history', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setAvailableCash(parseFloat(data.availableCash));
        setPortfolioValue(parseFloat(data.totalValue));
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    }
  };

  const calculateTradeTotal = (amount: string, price: number) => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return '';
    return (amt * price).toFixed(2);
  };

  const handleAmountChange = (amount: string) => {
    setTradeAmount(amount);
    if (selectedMetal) {
      const total = calculateTradeTotal(amount, selectedMetal.price);
      setTradeTotal(total);
    }
  };

  const executeTrade = async () => {
    if (!selectedMetal || !tradeAmount || !tradeTotal) {
      toast({
        title: "Error",
        description: "Please fill in all trade details",
        variant: "destructive"
      });
      return;
    }

    setTradeLoading(true);

    try {
      const endpoint = `/api/metals-trading/${tradeType}`;
      const payload = {
        symbol: selectedMetal.symbol,
        name: selectedMetal.name,
        amount: tradeAmount,
        price: selectedMetal.price.toString(),
        total: tradeTotal
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Trade Successful",
          description: data.message,
          variant: "default"
        });

        // Reset form
        setTradeAmount('');
        setTradeTotal('');
        setSelectedMetal(null);

        // Refresh data
        await Promise.all([
          fetchHoldings(),
          fetchTransactions(),
          fetchPortfolio()
        ]);
      } else {
        toast({
          title: "Trade Failed",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Trade execution error:', error);
      toast({
        title: "Error",
        description: "Failed to execute trade",
        variant: "destructive"
      });
    } finally {
      setTradeLoading(false);
    }
  };

  const getMetalColor = (symbol: string) => {
    const colors = {
      XAU: "text-yellow-600",
      XAG: "text-gray-600", 
      XPT: "text-blue-600",
      XPD: "text-purple-600"
    };
    return colors[symbol as keyof typeof colors] || "text-gray-600";
  };

  const totalHoldingsValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
  const totalProfitLoss = holdings.reduce((sum, holding) => sum + holding.profitLoss, 0);
  const totalProfitLossPercent = totalHoldingsValue > 0 ? (totalProfitLoss / (totalHoldingsValue - totalProfitLoss)) * 100 : 0;

  if (!user) {
    return <div>Please log in to access metals trading</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Metals Trading</h1>
          <p className="text-xl text-gray-600">
            Trade precious metals with real-time pricing and secure storage
          </p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Metals Value</p>
                  <p className="text-2xl font-bold">${totalHoldingsValue.toFixed(2)}</p>
                </div>
                <PieChart className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Cash</p>
                  <p className="text-2xl font-bold">${availableCash.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total P&L</p>
                  <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    ${totalProfitLoss.toFixed(2)}
                  </p>
                </div>
                {totalProfitLoss >= 0 ? (
                  <TrendingUp className="w-8 h-8 text-green-600" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">P&L Percentage</p>
                  <p className={`text-2xl font-bold ${totalProfitLossPercent >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {totalProfitLossPercent.toFixed(2)}%
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="trade" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trade">Trade</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
          </TabsList>

          {/* Trade Tab */}
          <TabsContent value="trade">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Metal Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Metal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metals.map((metal) => (
                      <div
                        key={metal.symbol}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedMetal?.symbol === metal.symbol 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedMetal(metal)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{metal.name}</h3>
                            <p className="text-sm text-gray-500">{metal.symbol}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${metal.price.toFixed(2)}</p>
                            <p className={`text-sm ${
                              metal.change_24h >= 0 ? 'text-green-600' : 'text-red-500'
                            }`}>
                              {metal.change_24h >= 0 ? '+' : ''}{metal.change_24h.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trade Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Trade Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Button
                        variant={tradeType === 'buy' ? 'default' : 'outline'}
                        onClick={() => setTradeType('buy')}
                        className="flex-1"
                      >
                        Buy
                      </Button>
                      <Button
                        variant={tradeType === 'sell' ? 'default' : 'outline'}
                        onClick={() => setTradeType('sell')}
                        className="flex-1"
                      >
                        Sell
                      </Button>
                    </div>

                    {selectedMetal && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold">{selectedMetal.name}</p>
                        <p className="text-2xl font-bold">${selectedMetal.price.toFixed(2)}/oz</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Amount (ounces)
                      </label>
                      <Input
                        type="number"
                        step="0.001"
                        value={tradeAmount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="Enter amount"
                        disabled={!selectedMetal}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Total Cost
                      </label>
                      <Input
                        type="text"
                        value={tradeTotal ? `$${tradeTotal}` : ''}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>

                    {tradeType === 'buy' && tradeTotal && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm text-yellow-800">
                            Available: ${availableCash.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={executeTrade}
                      disabled={!selectedMetal || !tradeAmount || tradeLoading}
                      className="w-full"
                    >
                      {tradeLoading ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedMetal?.name || 'Metal'}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Holdings Tab */}
          <TabsContent value="holdings">
            <Card>
              <CardHeader>
                <CardTitle>Your Metal Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                {holdings.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No metal holdings found</p>
                ) : (
                  <div className="space-y-4">
                    {holdings.map((holding) => (
                      <div key={holding.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{holding.name}</h3>
                            <p className="text-sm text-gray-500">{holding.amount} oz</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${holding.currentValue.toFixed(2)}</p>
                            <p className={`text-sm ${
                              holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-500'
                            }`}>
                              {holding.profitLoss >= 0 ? '+' : ''}${holding.profitLoss.toFixed(2)} 
                              ({holding.profitLossPercent.toFixed(2)}%)
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span>Avg Price: ${parseFloat(holding.averagePurchasePrice).toFixed(2)}</span>
                          </div>
                          <div>
                            <span>Current: ${holding.currentPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Trading History</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No trading history found</p>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={tx.type === 'buy' ? 'default' : 'secondary'}>
                                {tx.type.toUpperCase()}
                              </Badge>
                              <span className="font-semibold">{tx.symbol}</span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${parseFloat(tx.total).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">
                              {tx.amount} oz @ ${parseFloat(tx.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Tab */}
          <TabsContent value="market">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Market Prices
                  <Button onClick={fetchMetalPrices} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {metals.map((metal) => (
                    <div key={metal.symbol} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{metal.name}</h3>
                          <p className="text-sm text-gray-500">{metal.symbol}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">${metal.price.toFixed(2)}</p>
                          <p className={`text-sm flex items-center ${
                            metal.change_24h >= 0 ? 'text-green-600' : 'text-red-500'
                          }`}>
                            {metal.change_24h >= 0 ? (
                              <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            {metal.change_24h >= 0 ? '+' : ''}{metal.change_24h.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
