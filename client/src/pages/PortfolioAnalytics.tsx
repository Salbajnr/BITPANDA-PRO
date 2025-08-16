
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
  DollarSign,
  Percent,
  Target,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface PortfolioData {
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPercentage: number;
  dayPnL: number;
  dayPnLPercentage: number;
  holdings: Holding[];
  performance: PerformanceData[];
  allocation: AllocationData[];
}

interface Holding {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  currentPrice: number;
  averageCost: number;
  totalValue: number;
  totalCost: number;
  pnl: number;
  pnlPercentage: number;
  allocation: number;
  image: string;
}

interface PerformanceData {
  date: string;
  value: number;
  pnl: number;
}

interface AllocationData {
  symbol: string;
  name: string;
  percentage: number;
  value: number;
  color: string;
}

export default function PortfolioAnalytics() {
  const { user } = useAuth();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    fetchPortfolioData();
  }, [timeframe]);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/portfolio/analytics?timeframe=${timeframe}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setPortfolioData(data);
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const getColorForAllocation = (index: number) => {
    const colors = [
      '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6',
      '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6B7280'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No Portfolio Data
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Start trading to see your portfolio analytics
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Portfolio Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Detailed insights into your trading performance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={timeframe === '24h' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('24h')}
              >
                24H
              </Button>
              <Button
                variant={timeframe === '7d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('7d')}
              >
                7D
              </Button>
              <Button
                variant={timeframe === '30d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('30d')}
              >
                30D
              </Button>
              <Button
                variant={timeframe === '1y' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('1y')}
              >
                1Y
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={fetchPortfolioData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(portfolioData.totalValue)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Cost: {formatCurrency(portfolioData.totalCost)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Total P&L
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                portfolioData.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(portfolioData.totalPnL)}
              </div>
              <div className={`text-sm mt-1 flex items-center ${
                portfolioData.totalPnLPercentage >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {portfolioData.totalPnLPercentage >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {formatPercentage(portfolioData.totalPnLPercentage)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                24H P&L
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                portfolioData.dayPnL >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(portfolioData.dayPnL)}
              </div>
              <div className={`text-sm mt-1 flex items-center ${
                portfolioData.dayPnLPercentage >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {portfolioData.dayPnLPercentage >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {formatPercentage(portfolioData.dayPnLPercentage)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center">
                <PieChart className="h-4 w-4 mr-2" />
                Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {portfolioData.holdings.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Cryptocurrencies
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Portfolio Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600 dark:text-slate-400">
                        Performance chart will be displayed here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Performers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {portfolioData.holdings
                    .filter(h => h.pnlPercentage > 0)
                    .sort((a, b) => b.pnlPercentage - a.pnlPercentage)
                    .slice(0, 3)
                    .map((holding) => (
                      <div key={holding.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={holding.image}
                            alt={holding.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {holding.symbol}
                            </div>
                            <div className="text-sm text-slate-500">
                              {holding.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-600 font-medium">
                            +{holding.pnlPercentage.toFixed(2)}%
                          </div>
                          <div className="text-sm text-slate-500">
                            {formatCurrency(holding.pnl)}
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* Biggest Losers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Biggest Losers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {portfolioData.holdings
                    .filter(h => h.pnlPercentage < 0)
                    .sort((a, b) => a.pnlPercentage - b.pnlPercentage)
                    .slice(0, 3)
                    .map((holding) => (
                      <div key={holding.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={holding.image}
                            alt={holding.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {holding.symbol}
                            </div>
                            <div className="text-sm text-slate-500">
                              {holding.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-red-600 font-medium">
                            {holding.pnlPercentage.toFixed(2)}%
                          </div>
                          <div className="text-sm text-slate-500">
                            {formatCurrency(holding.pnl)}
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="holdings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                          Asset
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                          Amount
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                          Current Price
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                          Total Value
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                          P&L
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                          Allocation
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioData.holdings.map((holding) => (
                        <tr key={holding.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={holding.image}
                                alt={holding.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">
                                  {holding.symbol}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {holding.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-right py-4 px-4 text-slate-900 dark:text-white">
                            {holding.amount.toLocaleString()}
                          </td>
                          <td className="text-right py-4 px-4 text-slate-900 dark:text-white">
                            {formatCurrency(holding.currentPrice)}
                          </td>
                          <td className="text-right py-4 px-4 text-slate-900 dark:text-white">
                            {formatCurrency(holding.totalValue)}
                          </td>
                          <td className={`text-right py-4 px-4 ${
                            holding.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <div>{formatCurrency(holding.pnl)}</div>
                            <div className="text-sm">
                              {formatPercentage(holding.pnlPercentage)}
                            </div>
                          </td>
                          <td className="text-right py-4 px-4">
                            <div className="flex items-center justify-end space-x-2">
                              <Progress 
                                value={holding.allocation} 
                                className="w-16 h-2"
                              />
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {holding.allocation.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allocation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600 dark:text-slate-400">
                        Pie chart will be displayed here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Allocation Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {portfolioData.allocation.map((item, index) => (
                    <div key={item.symbol} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: getColorForAllocation(index) }}
                        />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {item.symbol}
                          </div>
                          <div className="text-sm text-slate-500">
                            {item.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {item.percentage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-500">
                          {formatCurrency(item.value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historical Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Historical performance chart will be displayed here
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      Showing portfolio value over time with P&L tracking
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
