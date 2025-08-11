import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, PieChart, Target, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuickStatsGridProps {
  portfolioData?: {
    portfolio?: {
      totalValue: string;
      availableCash: string;
    };
    holdings?: Array<{
      symbol: string;
      amount: string;
      currentPrice: string;
      averagePurchasePrice: string;
    }>;
  };
}

export default function QuickStatsGrid({ portfolioData }: QuickStatsGridProps) {
  const totalValue = parseFloat(portfolioData?.portfolio?.totalValue || "10000");
  const availableCash = parseFloat(portfolioData?.portfolio?.availableCash || "10000");

  const holdingsValue = portfolioData?.holdings?.reduce((total, holding) => {
    return total + (parseFloat(holding.amount) * parseFloat(holding.currentPrice));
  }, 0) || 0;

  const totalInvested = portfolioData?.holdings?.reduce((total, holding) => {
    return total + (parseFloat(holding.amount) * parseFloat(holding.averagePurchasePrice));
  }, 0) || 0;

  const totalPortfolioValue = holdingsValue + availableCash;
  const unrealizedPnL = holdingsValue - totalInvested;
  const unrealizedPnLPercent = totalInvested > 0 ? (unrealizedPnL / totalInvested) * 100 : 0;

  // Calculate portfolio allocation
  const cashAllocation = totalPortfolioValue > 0 ? (availableCash / totalPortfolioValue) * 100 : 100;
  const investedAllocation = 100 - cashAllocation;

  const dayChange = totalPortfolioValue * (Math.random() * 0.06 - 0.03); // Random 24h change between -3% and +3%
  const dayChangePercent = totalPortfolioValue > 0 ? (dayChange / totalPortfolioValue) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-muted-foreground">
              ${availableCash.toLocaleString()} cash
            </p>
            <Badge variant="outline" className="text-xs">
              {cashAllocation.toFixed(1)}%
            </Badge>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
      </Card>

      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">24h Change</CardTitle>
          {dayChange >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {dayChange >= 0 ? '+' : ''}${Math.abs(dayChange).toLocaleString()}
          </div>
          <p className={`text-xs ${dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {dayChange >= 0 ? '+' : ''}{dayChangePercent.toFixed(2)}%
          </p>
        </CardContent>
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${dayChange >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </Card>

      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {unrealizedPnL >= 0 ? '+' : ''}${Math.abs(unrealizedPnL).toLocaleString()}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className={`text-xs ${unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {unrealizedPnL >= 0 ? '+' : ''}{unrealizedPnLPercent.toFixed(2)}%
            </p>
            <Badge variant={unrealizedPnL >= 0 ? "default" : "destructive"} className="text-xs">
              {portfolioData?.holdings?.length || 0} assets
            </Badge>
          </div>
        </CardContent>
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${unrealizedPnL >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </Card>

      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Holdings Value</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${holdingsValue.toLocaleString()}</div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-muted-foreground">
              ${totalInvested.toLocaleString()} invested
            </p>
            <Badge variant="outline" className="text-xs">
              {investedAllocation.toFixed(1)}%
            </Badge>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      </Card>
    </div>
  );
}