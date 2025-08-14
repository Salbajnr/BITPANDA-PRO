import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart,
  ArrowUp, ArrowDown, Target, AlertTriangle, Star, Calendar,
  Shield, Activity, Award, RefreshCw, Download, Eye, TrendingUpIcon
} from "lucide-react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Cell, AreaChart, Area, BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from "recharts";
import { useState } from "react";

interface PortfolioData {
  portfolio: {
    id: string;
    totalValue: string;
    availableCash: string;
    userId: string;
  };
  holdings: Array<{
    id: string;
    symbol: string;
    name: string;
    amount: string;
    averagePurchasePrice: string;
    currentPrice: string;
  }>;
  transactions: Array<{
    id: string;
    type: string;
    symbol: string;
    amount: string;
    price: string;
    total: string;
    createdAt: string;
  }>;
}

interface RiskMetrics {
  sharpeRatio: number;
  volatility: number;
  maxDrawdown: number;
  beta: number;
  alpha: number;
  riskScore: number;
}

export default function PortfolioAnalytics() {
  const { user } = useAuth();
  const [timeFrame, setTimeFrame] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState('overview');

  const { data: portfolioData, isLoading } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
    retry: false,
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading portfolio analytics...</p>
        </div>
      </div>
    );
  }

  const totalValue = parseFloat(portfolioData?.portfolio?.totalValue || '0');
  const availableCash = parseFloat(portfolioData?.portfolio?.availableCash || '0');
  const investedValue = totalValue - availableCash;

  // Calculate portfolio metrics
  const holdingsAnalysis = portfolioData?.holdings?.map(holding => {
    const amount = parseFloat(holding.amount);
    const currentPrice = parseFloat(holding.currentPrice);
    const avgPrice = parseFloat(holding.averagePurchasePrice);
    const currentValue = amount * currentPrice;
    const investedAmount = amount * avgPrice;
    const pnl = currentValue - investedAmount;
    const pnlPercentage = (pnl / investedAmount) * 100;

    return {
      ...holding,
      amount,
      currentPrice,
      averagePurchasePrice: avgPrice,
      currentValue,
      investedAmount,
      pnl,
      pnlPercentage,
      allocation: investedValue > 0 ? (currentValue / investedValue) * 100 : 0,
    };
  }) || [];

  // Mock enhanced performance data with more metrics
  const performanceData = Array.from({ length: 30 }, (_, i) => {
    const baseValue = totalValue * (0.95 + Math.random() * 0.1);
    return {
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: baseValue,
      change: (Math.random() - 0.5) * 1000,
      benchmark: baseValue * (0.98 + Math.random() * 0.04), // Mock market benchmark
      volume: Math.random() * 50000 + 10000,
    };
  });

  // Mock risk metrics
  const riskMetrics: RiskMetrics = {
    sharpeRatio: 1.85,
    volatility: 18.5,
    maxDrawdown: -8.2,
    beta: 1.12,
    alpha: 4.3,
    riskScore: 7.5, // Out of 10
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  const pieData = holdingsAnalysis.map((holding, index) => ({
    name: holding.symbol,
    value: holding.currentValue,
    color: COLORS[index % COLORS.length],
    percentage: holding.allocation,
  }));

  // Risk analysis radar chart data
  const riskRadarData = [
    { metric: 'Volatility', score: 100 - riskMetrics.volatility, fullMark: 100 },
    { metric: 'Liquidity', score: 85, fullMark: 100 },
    { metric: 'Diversification', score: Math.min(holdingsAnalysis.length * 20, 100), fullMark: 100 },
    { metric: 'Performance', score: Math.max(0, Math.min(100, (riskMetrics.sharpeRatio / 3) * 100)), fullMark: 100 },
    { metric: 'Stability', score: Math.max(0, 100 + riskMetrics.maxDrawdown), fullMark: 100 },
  ];

  const totalPnL = holdingsAnalysis.reduce((sum, holding) => sum + holding.pnl, 0);
  const totalPnLPercentage = investedValue > 0 ? (totalPnL / investedValue) * 100 : 0;

  // Top performers and losers
  const topPerformers = [...holdingsAnalysis].sort((a, b) => b.pnlPercentage - a.pnlPercentage).slice(0, 3);
  const topLosers = [...holdingsAnalysis].sort((a, b) => a.pnlPercentage - b.pnlPercentage).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Portfolio Analytics</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Comprehensive analysis of your investment performance and risk metrics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {(['7d', '30d', '90d', '1y'] as const).map((period) => (
                <Button
                  key={period}
                  variant={timeFrame === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeFrame(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Enhanced Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Total Portfolio Value</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    ${totalValue.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 text-sm">+12.5% (24h)</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Total P&L</p>
                  <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    {totalPnL >= 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {totalPnLPercentage >= 0 ? '+' : ''}{totalPnLPercentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  totalPnL >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {totalPnL >= 0 ? (
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-red-500" />
                  )}
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                totalPnL >= 0 ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Sharpe Ratio</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {riskMetrics.sharpeRatio.toFixed(2)}
                  </p>
                  <div className="flex items-center mt-2">
                    <Award className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-yellow-500 text-sm">Excellent</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Risk Score</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {riskMetrics.riskScore.toFixed(1)}/10
                  </p>
                  <div className="flex items-center mt-2">
                    <Shield className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-orange-500 text-sm">Moderate</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Diversification</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {holdingsAnalysis.length}
                  </p>
                  <div className="flex items-center mt-2">
                    <PieChart className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="text-purple-500 text-sm">Assets</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500"></div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Portfolio vs Benchmark
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          `$${Number(value).toLocaleString()}`,
                          name === 'value' ? 'Portfolio' : 'Benchmark'
                        ]}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name="Portfolio" />
                      <Area type="monotone" dataKey="benchmark" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.1} name="Benchmark" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Asset Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Asset Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pieData.length > 0 ? (
                    <div className="space-y-4">
                      <ResponsiveContainer width="100%" height={250}>
                        <RechartsPieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Value']} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                      <div className="grid grid-cols-2 gap-2">
                        {pieData.map((entry, index) => (
                          <div key={entry.name} className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: entry.color }}
                            ></div>
                            <span className="text-sm">{entry.name}</span>
                            <span className="text-sm text-slate-500 ml-auto">
                              {entry.percentage.toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-slate-500">
                      <div className="text-center">
                        <PieChart className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                        <p>No holdings to display</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Top Performers and Losers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="h-5 w-5" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPerformers.map((holding, index) => (
                      <div key={holding.symbol} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{holding.symbol}</p>
                            <p className="text-sm text-slate-500">{holding.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            +{holding.pnlPercentage.toFixed(2)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <TrendingDown className="h-5 w-5" />
                    Underperformers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topLosers.map((holding, index) => (
                      <div key={holding.symbol} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-bold text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{holding.symbol}</p>
                            <p className="text-sm text-slate-500">{holding.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive">
                            {holding.pnlPercentage.toFixed(2)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Sharpe Ratio</p>
                      <p className="text-2xl font-bold text-green-600">{riskMetrics.sharpeRatio}</p>
                      <p className="text-xs text-slate-500">Excellent performance</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Max Drawdown</p>
                      <p className="text-2xl font-bold text-red-600">{riskMetrics.maxDrawdown}%</p>
                      <p className="text-xs text-slate-500">Low risk</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Volatility</p>
                      <p className="text-2xl font-bold text-yellow-600">{riskMetrics.volatility}%</p>
                      <p className="text-xs text-slate-500">Moderate</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Beta</p>
                      <p className="text-2xl font-bold text-blue-600">{riskMetrics.beta}</p>
                      <p className="text-xs text-slate-500">Market correlation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={riskRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Risk Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="holdings" className="space-y-6">
            {/* Holdings Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Holdings Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {holdingsAnalysis.map((holding) => (
                    <div
                      key={holding.symbol}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      data-testid={`holding-${holding.symbol}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-bold text-sm text-primary">{holding.symbol}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {holding.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {holding.amount} {holding.symbol} @ ${holding.averagePurchasePrice.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          ${holding.currentValue.toLocaleString()}
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                          <Badge
                            variant={holding.pnl >= 0 ? 'default' : 'destructive'}
                            className={holding.pnl >= 0 ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                          >
                            {holding.pnl >= 0 ? '+' : ''}${holding.pnl.toFixed(2)}
                          </Badge>
                          <Badge variant="outline">
                            {holding.pnlPercentage >= 0 ? '+' : ''}{holding.pnlPercentage.toFixed(2)}%
                          </Badge>
                        </div>
                        <div className="w-24">
                          <Progress value={holding.allocation} className="h-2" />
                          <span className="text-xs text-slate-500">{holding.allocation.toFixed(1)}%</span>
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