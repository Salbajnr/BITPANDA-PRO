import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  Target,
  Activity,
  Award,
  Zap
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

export default function Analytics() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('portfolio_value');

  if (!user) {
    return <Redirect to="/auth" />;
  }

  const { data: analyticsData } = useQuery({
    queryKey: ['/api/analytics/overview', timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/overview?timeframe=${timeframe}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    }
  });

  const { data: performanceData } = useQuery({
    queryKey: ['/api/analytics/performance', timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/performance?timeframe=${timeframe}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch performance data');
      return response.json();
    }
  });

  const { data: tradingStats } = useQuery({
    queryKey: ['/api/analytics/trading-stats', timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/trading-stats?timeframe=${timeframe}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch trading stats');
      return response.json();
    }
  });

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Portfolio Analytics
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Comprehensive analysis of your trading performance
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 3 months</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Key Metrics */}
            {analyticsData && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total Return</p>
                        <p className={`text-2xl font-bold ${analyticsData.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercent(analyticsData.totalReturn)}
                        </p>
                      </div>
                      {analyticsData.totalReturn >= 0 ? (
                        <TrendingUp className="h-8 w-8 text-green-500" />
                      ) : (
                        <TrendingDown className="h-8 w-8 text-red-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Portfolio Value</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {formatCurrency(analyticsData.portfolioValue)}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Win Rate</p>
                        <p className="text-2xl font-bold text-green-600">
                          {analyticsData.winRate.toFixed(1)}%
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Sharpe Ratio</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {analyticsData.sharpeRatio.toFixed(2)}
                        </p>
                      </div>
                      <Award className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Tabs defaultValue="performance" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="allocation">Allocation</TabsTrigger>
                <TabsTrigger value="trading">Trading Stats</TabsTrigger>
                <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              </TabsList>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-12 gap-6">
                  {/* Portfolio Performance Chart */}
                  <Card className="col-span-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Portfolio Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {performanceData?.length > 0 ? (
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip 
                                formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']}
                                labelFormatter={(label) => `Date: ${label}`}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#22c55e" 
                                fill="#22c55e" 
                                fillOpacity={0.2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="h-64 flex items-center justify-center">
                          <p className="text-slate-500">No performance data available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Performance Metrics */}
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Key Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {analyticsData && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Best Day</span>
                            <span className="font-medium text-green-600">
                              {formatPercent(analyticsData.bestDay)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Worst Day</span>
                            <span className="font-medium text-red-600">
                              {formatPercent(analyticsData.worstDay)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Volatility</span>
                            <span className="font-medium">
                              {analyticsData.volatility.toFixed(2)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Max Drawdown</span>
                            <span className="font-medium text-orange-600">
                              {formatPercent(analyticsData.maxDrawdown)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Calmar Ratio</span>
                            <span className="font-medium">
                              {analyticsData.calmarRatio.toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Allocation Tab */}
              <TabsContent value="allocation" className="space-y-6">
                <div className="grid grid-cols-12 gap-6">
                  <Card className="col-span-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Asset Allocation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analyticsData?.allocation?.length > 0 ? (
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={analyticsData.allocation}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {analyticsData.allocation.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="h-64 flex items-center justify-center">
                          <p className="text-slate-500">No allocation data available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="col-span-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Top Holdings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analyticsData?.topHoldings?.length > 0 ? (
                        <div className="space-y-3">
                          {analyticsData.topHoldings.map((holding: any, index: number) => (
                            <div key={holding.symbol} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {holding.symbol.slice(0, 2)}
                                </div>
                                <span className="font-medium">{holding.symbol}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{formatCurrency(holding.value)}</div>
                                <div className="text-sm text-slate-600">
                                  {holding.percentage.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-500">No holdings data available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Trading Stats Tab */}
              <TabsContent value="trading" className="space-y-6">
                <div className="grid grid-cols-12 gap-6">
                  <Card className="col-span-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Trading Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {tradingStats?.dailyTrades?.length > 0 ? (
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tradingStats.dailyTrades}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="trades" fill="#3b82f6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="h-64 flex items-center justify-center">
                          <p className="text-slate-500">No trading data available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Trading Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {tradingStats && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Total Trades</span>
                            <span className="font-medium">{tradingStats.totalTrades}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Winning Trades</span>
                            <span className="font-medium text-green-600">
                              {tradingStats.winningTrades}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Losing Trades</span>
                            <span className="font-medium text-red-600">
                              {tradingStats.losingTrades}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Avg Win</span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(tradingStats.avgWin)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Avg Loss</span>
                            <span className="font-medium text-red-600">
                              {formatCurrency(tradingStats.avgLoss)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Profit Factor</span>
                            <span className="font-medium">
                              {tradingStats.profitFactor.toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Risk Analysis Tab */}
              <TabsContent value="risk" className="space-y-6">
                <div className="grid grid-cols-12 gap-6">
                  <Card className="col-span-12">
                    <CardHeader>
                      <CardTitle>Risk Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <BarChart3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">Risk analysis coming soon</p>
                        <p className="text-sm text-slate-400 mt-2">
                          Advanced risk metrics and stress testing
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}