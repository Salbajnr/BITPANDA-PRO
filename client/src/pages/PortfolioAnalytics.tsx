import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUpIcon, TrendingDownIcon, PieChartIcon, BarChart3Icon,
  DollarSignIcon, CalendarIcon, TargetIcon, ActivityIcon
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
         XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PortfolioStats {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  totalInvested: number;
  availableCash: number;
  dayChange: number;
  dayChangePercentage: number;
}

interface HoldingAnalysis {
  symbol: string;
  name: string;
  amount: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  allocation: number;
  averagePurchasePrice: number;
  currentPrice: number;
}

interface PerformanceData {
  date: string;
  totalValue: number;
  invested: number;
  gainLoss: number;
}

const mockPerformanceData: PerformanceData[] = [
  { date: '2024-01', totalValue: 10000, invested: 10000, gainLoss: 0 },
  { date: '2024-02', totalValue: 10500, invested: 10200, gainLoss: 300 },
  { date: '2024-03', totalValue: 9800, invested: 10200, gainLoss: -400 },
  { date: '2024-04', totalValue: 11200, invested: 10500, gainLoss: 700 },
  { date: '2024-05', totalValue: 12100, invested: 11000, gainLoss: 1100 },
  { date: '2024-06', totalValue: 11800, invested: 11000, gainLoss: 800 },
  { date: '2024-07', totalValue: 13500, invested: 12000, gainLoss: 1500 },
  { date: '2024-08', totalValue: 14200, invested: 12500, gainLoss: 1700 },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

export default function PortfolioAnalytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');

  const { data: portfolioData, isLoading } = useQuery({
    queryKey: ["/api/portfolio"],
    retry: false,
    enabled: !!user,
  });

  const portfolioStats: PortfolioStats = {
    totalValue: 14200,
    totalGainLoss: 1700,
    totalGainLossPercentage: 13.6,
    totalInvested: 12500,
    availableCash: 2300,
    dayChange: 245,
    dayChangePercentage: 1.75,
  };

  const holdingsAnalysis: HoldingAnalysis[] = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0.3245,
      currentValue: 8500,
      gainLoss: 1200,
      gainLossPercentage: 16.5,
      allocation: 59.9,
      averagePurchasePrice: 22000,
      currentPrice: 26200,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 5.67,
      currentValue: 3200,
      gainLoss: 350,
      gainLossPercentage: 12.3,
      allocation: 22.5,
      averagePurchasePrice: 503,
      currentPrice: 565,
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      amount: 8500,
      currentValue: 2500,
      gainLoss: 150,
      gainLossPercentage: 6.4,
      allocation: 17.6,
      averagePurchasePrice: 0.276,
      currentPrice: 0.294,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const pieChartData = holdingsAnalysis.map((holding, index) => ({
    name: holding.symbol,
    value: holding.allocation,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Portfolio Analytics
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Detailed analysis of your investment performance
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {['7d', '30d', '90d', '1y', 'all'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range as typeof timeRange)}
              data-testid={`button-timerange-${range}`}
            >
              {range.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioStats.totalValue.toLocaleString()}</div>
            <div className={`text-xs flex items-center ${
              portfolioStats.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {portfolioStats.dayChange >= 0 ? (
                <TrendingUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDownIcon className="h-3 w-3 mr-1" />
              )}
              {portfolioStats.dayChangePercentage > 0 ? '+' : ''}{portfolioStats.dayChangePercentage}% today
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
            <TargetIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              portfolioStats.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {portfolioStats.totalGainLoss >= 0 ? '+' : ''}${portfolioStats.totalGainLoss.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {portfolioStats.totalGainLossPercentage >= 0 ? '+' : ''}{portfolioStats.totalGainLossPercentage}% overall
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioStats.totalInvested.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              Capital deployed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Cash</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioStats.availableCash.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              Ready to invest
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3Icon className="h-5 w-5" />
              Portfolio Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `$${value.toLocaleString()}`, 
                    name === 'totalValue' ? 'Total Value' : 
                    name === 'invested' ? 'Invested' : 'Gain/Loss'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalValue" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="gainLoss" 
                  stackId="2"
                  stroke="#06b6d4" 
                  fill="#06b6d4" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={holding.gainLoss >= 0 ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {holding.gainLoss >= 0 ? '+' : ''}${holding.gainLoss}
                    </Badge>
                    <span className={`text-xs ${
                      holding.gainLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {holding.gainLossPercentage >= 0 ? '+' : ''}{holding.gainLossPercentage}%
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {holding.allocation}% of portfolio
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}