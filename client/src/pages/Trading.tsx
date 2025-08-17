
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Zap, Target, AlertCircle } from "lucide-react";
import { getCryptoLogo } from "@/components/CryptoLogos";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TradingInterface from "@/components/TradingInterface";
import RealTimeCryptoTable from "@/components/RealTimeCryptoTable";
import { PriceAlertsList } from "@/components/PriceAlertsList";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";

const tradingPairs = [
  { symbol: "BTC", name: "Bitcoin", price: 45234.56, change: 2.34, volume: "28.5B" },
  { symbol: "ETH", name: "Ethereum", price: 2876.43, change: -1.23, volume: "12.8B" },
  { symbol: "BNB", name: "BNB", price: 298.76, change: 3.45, volume: "2.1B" },
  { symbol: "ADA", name: "Cardano", price: 0.4521, change: 1.87, volume: "890M" },
  { symbol: "SOL", name: "Solana", price: 98.32, change: 4.12, volume: "1.2B" },
  { symbol: "XRP", name: "XRP", price: 0.6234, change: -0.45, volume: "1.8B" },
  { symbol: "DOT", name: "Polkadot", price: 7.89, change: 2.15, volume: "456M" },
  { symbol: "DOGE", name: "Dogecoin", price: 0.0823, change: -2.34, volume: "678M" }
];

const orderTypes = [
  { value: "market", label: "Market Order", description: "Execute immediately at current market price" },
  { value: "limit", label: "Limit Order", description: "Execute when price reaches your specified level" },
  { value: "stop-loss", label: "Stop Loss", description: "Sell when price falls below specified level" },
  { value: "take-profit", label: "Take Profit", description: "Sell when price rises above specified level" }
];

const marketStats = {
  totalMarketCap: "$2.1T",
  volume24h: "$89.5B",
  btcDominance: "42.8%",
  activeCoins: "500+"
};

const featuredOrders = [
  { id: 1, pair: "BTC/USD", type: "Buy", amount: "0.5", price: "45,200", status: "Pending" },
  { id: 2, pair: "ETH/USD", type: "Sell", amount: "2.0", price: "2,850", status: "Filled" },
  { id: 3, pair: "BNB/USD", type: "Buy", amount: "10", price: "295", status: "Pending" }
];

export default function Trading() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPair, setSelectedPair] = useState(tradingPairs[0]);
  const [orderType, setOrderType] = useState("market");
  const [tradeType, setTradeType] = useState("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [activeTab, setActiveTab] = useState("trade");

  if (!user) {
    return <Redirect to="/auth" />;
  }

  const handleTrade = () => {
    if (!amount || (orderType !== "market" && !price)) {
      toast({
        title: "Invalid Trade",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Trade Submitted",
      description: `${tradeType.toUpperCase()} order for ${amount} ${selectedPair.symbol} submitted successfully`,
    });

    // Reset form
    setAmount("");
    setPrice("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Trading Pro</h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Advanced cryptocurrency trading with professional tools
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-green-500">
                    <Activity className="w-4 h-4 mr-1" />
                    Live Market
                  </Badge>
                  <Badge variant="outline">
                    <Zap className="w-4 h-4 mr-1" />
                    Fast Execution
                  </Badge>
                </div>
              </div>
            </div>

            {/* Market Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Market Cap</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {marketStats.totalMarketCap}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">24h Volume</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {marketStats.volume24h}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">BTC Dominance</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {marketStats.btcDominance}
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Active Coins</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {marketStats.activeCoins}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="trade">Trade</TabsTrigger>
                <TabsTrigger value="markets">Markets</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="trade" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Trading Interface */}
                  <div className="lg:col-span-2">
                    <TradingInterface />
                  </div>

                  {/* Order Form */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <DollarSign className="w-5 h-5 mr-2" />
                          Place Order
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Trading Pair Selection */}
                        <div>
                          <Label>Trading Pair</Label>
                          <Select value={selectedPair.symbol} onValueChange={(value) => {
                            const pair = tradingPairs.find(p => p.symbol === value);
                            if (pair) setSelectedPair(pair);
                          }}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {tradingPairs.map((pair) => (
                                <SelectItem key={pair.symbol} value={pair.symbol}>
                                  <div className="flex items-center space-x-2">
                                    <img 
                                      src={getCryptoLogo(pair.symbol)} 
                                      alt={pair.name}
                                      className="w-6 h-6"
                                    />
                                    <span>{pair.symbol}/USD</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Order Type */}
                        <div>
                          <Label>Order Type</Label>
                          <Select value={orderType} onValueChange={setOrderType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {orderTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div>
                                    <div className="font-medium">{type.label}</div>
                                    <div className="text-sm text-slate-500">{type.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Buy/Sell Toggle */}
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={tradeType === "buy" ? "default" : "outline"}
                            className={`${tradeType === "buy" ? "bg-green-500 hover:bg-green-600" : ""}`}
                            onClick={() => setTradeType("buy")}
                          >
                            Buy
                          </Button>
                          <Button
                            variant={tradeType === "sell" ? "default" : "outline"}
                            className={`${tradeType === "sell" ? "bg-red-500 hover:bg-red-600" : ""}`}
                            onClick={() => setTradeType("sell")}
                          >
                            Sell
                          </Button>
                        </div>

                        {/* Price Input (for limit orders) */}
                        {orderType !== "market" && (
                          <div>
                            <Label>Price (USD)</Label>
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                            />
                          </div>
                        )}

                        {/* Amount Input */}
                        <div>
                          <Label>Amount ({selectedPair.symbol})</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </div>

                        {/* Order Summary */}
                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Current Price</span>
                            <span className="font-medium">${selectedPair.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Est. Total</span>
                            <span className="font-medium">
                              ${amount && (orderType === "market" ? selectedPair.price : parseFloat(price || "0")) ? 
                                ((parseFloat(amount) || 0) * (orderType === "market" ? selectedPair.price : parseFloat(price || "0"))).toLocaleString() : 
                                "0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Fee (0.1%)</span>
                            <span className="font-medium">
                              ${amount && (orderType === "market" ? selectedPair.price : parseFloat(price || "0")) ? 
                                (((parseFloat(amount) || 0) * (orderType === "market" ? selectedPair.price : parseFloat(price || "0"))) * 0.001).toFixed(2) : 
                                "0.00"}
                            </span>
                          </div>
                        </div>

                        <Button 
                          onClick={handleTrade}
                          className={`w-full ${tradeType === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                        >
                          {tradeType === "buy" ? "Buy" : "Sell"} {selectedPair.symbol}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Recent Orders */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {featuredOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <div>
                                <div className="font-medium">{order.pair}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                  {order.type} {order.amount} @ ${order.price}
                                </div>
                              </div>
                              <Badge variant={order.status === "Filled" ? "default" : "secondary"}>
                                {order.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="markets" className="space-y-6">
                <RealTimeCryptoTable />
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">
                        Order management functionality will be available soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-6">
                <PriceAlertsList />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Trading Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">
                        Advanced trading analytics coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
