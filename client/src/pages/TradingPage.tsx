
import { getCryptoLogo } from "@/components/CryptoLogos";
import { DollarSign, BarChart2, List, ClipboardList, TrendingUp, ChevronDown, LayoutGrid, Maximize2, Minimize2, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TradingPage() {
  const [selectedPair, setSelectedPair] = useState({ symbol: "BTC/USD", name: "Bitcoin" });
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [layoutMode, setLayoutMode] = useState<"standard" | "compact" | "professional">("standard");

  const mockOrderBook = {
    bids: [
      { price: 43250.00, amount: 0.5, total: 21625.00 },
      { price: 43249.50, amount: 1.2, total: 51900.00 },
      { price: 43248.80, amount: 0.8, total: 34600.00 },
      { price: 43248.20, amount: 0.3, total: 12974.46 },
      { price: 43247.90, amount: 0.9, total: 38923.11 },
    ],
    asks: [
      { price: 43251.20, amount: 0.6, total: 25950.60 },
      { price: 43252.00, amount: 1.0, total: 43252.00 },
      { price: 43253.50, amount: 0.7, total: 30277.45 },
      { price: 43254.80, amount: 0.4, total: 17301.92 },
      { price: 43255.20, amount: 0.8, total: 34604.16 },
    ]
  };

  const mockRecentTrades = [
    { time: "10:30:15", price: 43250.80, amount: 0.15, type: "buy" },
    { time: "10:30:10", price: 43250.20, amount: 0.30, type: "sell" },
    { time: "10:30:05", price: 43249.90, amount: 0.25, type: "buy" },
    { time: "10:29:58", price: 43249.50, amount: 0.45, type: "sell" },
    { time: "10:29:45", price: 43248.80, amount: 0.20, type: "buy" },
    { time: "10:29:32", price: 43248.60, amount: 0.35, type: "buy" },
  ];

  const mockPortfolio = {
    totalBalance: 5245.89,
    availableCash: 2340.50,
    totalPnL: 12.5,
    openOrders: 2,
    todaysPnL: 156.30
  };

  const mockPositions = [
    { symbol: "BTC", amount: 0.05234, value: 2263.45, pnl: 8.5 },
    { symbol: "ETH", amount: 1.2567, value: 3124.67, pnl: -2.3 },
    { symbol: "ADA", amount: 450.00, value: 189.50, pnl: 15.2 }
  ];

  const TradingChart = () => (
    <Card className="h-full bg-[#161A1E] border-[#2B2F36]">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white">Chart</h2>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">1m</Badge>
            <Badge variant="outline" className="text-xs">5m</Badge>
            <Badge variant="secondary" className="text-xs">15m</Badge>
            <Badge variant="outline" className="text-xs">1h</Badge>
            <Badge variant="outline" className="text-xs">4h</Badge>
            <Badge variant="outline" className="text-xs">1d</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-[#8B949E]">
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-[#8B949E]">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full h-[400px] bg-[#1E2329] flex items-center justify-center text-[#8B949E] rounded-b-xl">
          <div className="text-center">
            <BarChart2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">TradingView Chart</p>
            <p className="text-sm opacity-70">Advanced charting will be integrated here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const OrderBookWidget = () => (
    <Card className="h-full bg-[#161A1E] border-[#2B2F36]">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg">Order Book</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-4 text-xs text-[#8B949E] mb-2">
            <span>Price (USD)</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Total</span>
          </div>
          
          {/* Asks */}
          <div className="space-y-1 mb-3">
            {mockOrderBook.asks.reverse().map((ask, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 text-xs hover:bg-[#2B2F36] p-1 rounded">
                <span className="text-[#F84638] font-mono">{ask.price.toFixed(2)}</span>
                <span className="text-white text-right font-mono">{ask.amount}</span>
                <span className="text-[#8B949E] text-right font-mono">{ask.total.toFixed(0)}</span>
              </div>
            ))}
          </div>

          {/* Current Price */}
          <div className="text-center py-2 border-t border-b border-[#2B2F36] mb-3">
            <span className="text-white font-bold text-lg">43,250.50</span>
            <span className="text-[#00D4AA] text-sm ml-2">+0.25%</span>
          </div>

          {/* Bids */}
          <div className="space-y-1">
            {mockOrderBook.bids.map((bid, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 text-xs hover:bg-[#2B2F36] p-1 rounded">
                <span className="text-[#00D4AA] font-mono">{bid.price.toFixed(2)}</span>
                <span className="text-white text-right font-mono">{bid.amount}</span>
                <span className="text-[#8B949E] text-right font-mono">{bid.total.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const OrderFormWidget = () => (
    <Card className="h-full bg-[#161A1E] border-[#2B2F36]">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg">Place Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#2B2F36]">
            <TabsTrigger value="buy" className="data-[state=active]:bg-[#00D4AA] data-[state=active]:text-black">
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-[#F84638] data-[state=active]:text-white">
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={orderType === 'market' ? 'default' : 'outline'}
                onClick={() => setOrderType('market')}
                className={orderType === 'market' ? 'bg-[#FFB82F] text-black' : 'border-[#2B2F36] text-white'}
              >
                Market
              </Button>
              <Button
                size="sm"
                variant={orderType === 'limit' ? 'default' : 'outline'}
                onClick={() => setOrderType('limit')}
                className={orderType === 'limit' ? 'bg-[#FFB82F] text-black' : 'border-[#2B2F36] text-white'}
              >
                Limit
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[#8B949E] text-sm block mb-1">Amount (BTC)</label>
                <input
                  type="number"
                  value={buyAmount || ''}
                  onChange={(e) => setBuyAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#1E2329] p-3 rounded-lg border border-[#2B2F36] text-white text-sm"
                  placeholder="0.00000000"
                />
              </div>

              {orderType === 'limit' && (
                <div>
                  <label className="text-[#8B949E] text-sm block mb-1">Price (USD)</label>
                  <input
                    type="number"
                    className="w-full bg-[#1E2329] p-3 rounded-lg border border-[#2B2F36] text-white text-sm"
                    placeholder="43,250.50"
                  />
                </div>
              )}

              <div>
                <label className="text-[#8B949E] text-sm block mb-1">Total (USD)</label>
                <input
                  type="number"
                  value={(buyAmount * 43250.50).toFixed(2)}
                  readOnly
                  className="w-full bg-[#1E2329] p-3 rounded-lg border border-[#2B2F36] text-white text-sm opacity-70"
                />
              </div>

              <div className="flex gap-2 text-xs">
                <Button size="sm" variant="outline" className="flex-1 border-[#2B2F36] text-[#8B949E]">25%</Button>
                <Button size="sm" variant="outline" className="flex-1 border-[#2B2F36] text-[#8B949E]">50%</Button>
                <Button size="sm" variant="outline" className="flex-1 border-[#2B2F36] text-[#8B949E]">75%</Button>
                <Button size="sm" variant="outline" className="flex-1 border-[#2B2F36] text-[#8B949E]">100%</Button>
              </div>

              <Button className="w-full bg-[#00D4AA] text-white font-semibold hover:bg-[#00B39F] py-3">
                Buy BTC
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={orderType === 'market' ? 'default' : 'outline'}
                onClick={() => setOrderType('market')}
                className={orderType === 'market' ? 'bg-[#FFB82F] text-black' : 'border-[#2B2F36] text-white'}
              >
                Market
              </Button>
              <Button
                size="sm"
                variant={orderType === 'limit' ? 'default' : 'outline'}
                onClick={() => setOrderType('limit')}
                className={orderType === 'limit' ? 'bg-[#FFB82F] text-black' : 'border-[#2B2F36] text-white'}
              >
                Limit
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[#8B949E] text-sm block mb-1">Amount (BTC)</label>
                <input
                  type="number"
                  value={sellAmount || ''}
                  onChange={(e) => setSellAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#1E2329] p-3 rounded-lg border border-[#2B2F36] text-white text-sm"
                  placeholder="0.00000000"
                />
              </div>

              {orderType === 'limit' && (
                <div>
                  <label className="text-[#8B949E] text-sm block mb-1">Price (USD)</label>
                  <input
                    type="number"
                    className="w-full bg-[#1E2329] p-3 rounded-lg border border-[#2B2F36] text-white text-sm"
                    placeholder="43,250.50"
                  />
                </div>
              )}

              <div>
                <label className="text-[#8B949E] text-sm block mb-1">Total (USD)</label>
                <input
                  type="number"
                  value={(sellAmount * 43250.50).toFixed(2)}
                  readOnly
                  className="w-full bg-[#1E2329] p-3 rounded-lg border border-[#2B2F36] text-white text-sm opacity-70"
                />
              </div>

              <div className="flex gap-2 text-xs">
                <Button size="sm" variant="outline" className="flex-1 border-[#2B2F36] text-[#8B949E]">25%</Button>
                <Button size="sm" variant="outline" className="flex-1 border-[#2B2F36] text-[#8B949E]">50%</Button>
                <Button size="sm" variant="outline" className="flex-1 border-[#2B2F36] text-[#8B949E]">75%</Button>
                <Button size="sm" variant="outline" className="flex-1 border-[#2B2F36] text-[#8B949E]">100%</Button>
              </div>

              <Button className="w-full bg-[#F84638] text-white font-semibold hover:bg-[#D93D30] py-3">
                Sell BTC
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  const RecentTradesWidget = () => (
    <Card className="h-full bg-[#161A1E] border-[#2B2F36]">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg">Recent Trades</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-4 text-xs text-[#8B949E] mb-2">
            <span>Time</span>
            <span className="text-right">Price</span>
            <span className="text-right">Amount</span>
          </div>
          <div className="space-y-1">
            {mockRecentTrades.map((trade, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 text-xs hover:bg-[#2B2F36] p-1 rounded">
                <span className="text-[#8B949E] font-mono">{trade.time}</span>
                <span className={`text-right font-mono ${trade.type === 'buy' ? 'text-[#00D4AA]' : 'text-[#F84638]'}`}>
                  {trade.price.toFixed(2)}
                </span>
                <span className="text-white text-right font-mono">{trade.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PortfolioWidget = () => (
    <Card className="h-full bg-[#161A1E] border-[#2B2F36]">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg">Portfolio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-[#1E2329] rounded-lg">
            <p className="text-[#8B949E] text-xs">Total Balance</p>
            <p className="text-white font-bold text-lg">${mockPortfolio.totalBalance.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-[#1E2329] rounded-lg">
            <p className="text-[#8B949E] text-xs">Available Cash</p>
            <p className="text-white font-bold text-lg">${mockPortfolio.availableCash.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#8B949E]">Total P&L</span>
            <span className="text-[#00D4AA] font-semibold">+{mockPortfolio.totalPnL}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8B949E]">Today's P&L</span>
            <span className="text-[#00D4AA] font-semibold">+${mockPortfolio.todaysPnL}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8B949E]">Open Orders</span>
            <span className="text-white font-semibold">{mockPortfolio.openOrders}</span>
          </div>
        </div>

        <div className="border-t border-[#2B2F36] pt-4">
          <p className="text-[#8B949E] text-sm mb-2">Positions</p>
          <div className="space-y-2">
            {mockPositions.map((position, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6">{getCryptoLogo(position.symbol, 24)}</div>
                  <span className="text-white font-medium">{position.symbol}</span>
                </div>
                <div className="text-right">
                  <p className="text-white">${position.value.toFixed(2)}</p>
                  <p className={position.pnl >= 0 ? 'text-[#00D4AA]' : 'text-[#F84638]'}>
                    {position.pnl >= 0 ? '+' : ''}{position.pnl}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const MarketDataWidget = () => (
    <Card className="h-full bg-[#161A1E] border-[#2B2F36]">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg">Market Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[#8B949E]">24h High</p>
            <p className="text-white font-semibold">$43,456.78</p>
          </div>
          <div>
            <p className="text-[#8B949E]">24h Low</p>
            <p className="text-white font-semibold">$42,890.12</p>
          </div>
          <div>
            <p className="text-[#8B949E]">24h Volume</p>
            <p className="text-white font-semibold">28,459 BTC</p>
          </div>
          <div>
            <p className="text-[#8B949E]">Market Cap</p>
            <p className="text-white font-semibold">$847.2B</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      {/* Header */}
      <div className="border-b border-[#2B2F36] bg-[#161A1E]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center">
                {getCryptoLogo("BTC", 40)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{selectedPair.symbol}</h1>
                <p className="text-[#8B949E] text-sm">{selectedPair.name}</p>
              </div>
              <div className="text-lg px-3 py-1 rounded-full bg-[#2B2F36] text-white font-semibold">
                $43,250.50
              </div>
              <div className="flex items-center text-[#00D4AA] text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +2.4%
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={layoutMode} onValueChange={(value: any) => setLayoutMode(value)}>
                <SelectTrigger className="w-40 bg-[#2B2F36] border-[#2B2F36] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Layout</SelectItem>
                  <SelectItem value="compact">Compact Layout</SelectItem>
                  <SelectItem value="professional">Professional Layout</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="ghost" className="text-white border border-[#2B2F36] hover:bg-[#2B2F36]">
                <Settings className="w-4 h-4 mr-2" />
                Layout Settings
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Trading Interface */}
      <div className="flex-1 p-6">
        {layoutMode === "standard" && (
          <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-140px)] gap-6">
            {/* Left Panel - Chart */}
            <ResizablePanel defaultSize={65} minSize={50}>
              <ResizablePanelGroup direction="vertical" className="gap-4">
                <ResizablePanel defaultSize={75} minSize={60}>
                  <TradingChart />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={25} minSize={20}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                    <RecentTradesWidget />
                    <MarketDataWidget />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Right Panel - Trading Tools */}
            <ResizablePanel defaultSize={35} minSize={25} maxSize={45}>
              <ResizablePanelGroup direction="vertical" className="gap-4">
                <ResizablePanel defaultSize={40} minSize={30}>
                  <OrderFormWidget />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={35} minSize={25}>
                  <OrderBookWidget />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={25} minSize={20}>
                  <PortfolioWidget />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}

        {layoutMode === "compact" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
            <div className="lg:col-span-2">
              <TradingChart />
            </div>
            <div className="space-y-4">
              <div className="h-1/3">
                <OrderFormWidget />
              </div>
              <div className="h-1/3">
                <OrderBookWidget />
              </div>
              <div className="h-1/3">
                <PortfolioWidget />
              </div>
            </div>
          </div>
        )}

        {layoutMode === "professional" && (
          <ResizablePanelGroup direction="vertical" className="h-[calc(100vh-140px)] gap-4">
            {/* Top Row */}
            <ResizablePanel defaultSize={70} minSize={60}>
              <ResizablePanelGroup direction="horizontal" className="gap-4">
                <ResizablePanel defaultSize={50} minSize={40}>
                  <TradingChart />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={25} minSize={20}>
                  <OrderBookWidget />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={25} minSize={20}>
                  <OrderFormWidget />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Bottom Row */}
            <ResizablePanel defaultSize={30} minSize={25}>
              <ResizablePanelGroup direction="horizontal" className="gap-4">
                <ResizablePanel defaultSize={33} minSize={25}>
                  <RecentTradesWidget />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={33} minSize={25}>
                  <PortfolioWidget />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={34} minSize={25}>
                  <MarketDataWidget />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
}
