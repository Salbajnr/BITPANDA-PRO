import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, PieChart, DollarSign } from "lucide-react";

interface QuickStatsGridProps {
  portfolioData?: any;
}

export default function QuickStatsGrid({ portfolioData }: QuickStatsGridProps) {
  const portfolio = portfolioData?.portfolio;
  const holdings = portfolioData?.holdings || [];
  
  const totalBalance = portfolio ? parseFloat(portfolio.totalValue) : 0;
  const availableCash = portfolio ? parseFloat(portfolio.availableCash) : 0;
  const dailyChange = totalBalance * 0.0229; // Mock 2.29% daily change
  const activePositions = holdings.length;

  const stats = [
    {
      title: "Total Balance",
      value: `$${totalBalance.toFixed(2)}`,
      change: "+2.29% from yesterday",
      icon: Wallet,
      bgColor: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600"
    },
    {
      title: "Today's P&L",
      value: `+$${dailyChange.toFixed(2)}`,
      change: "+2.29%",
      icon: TrendingUp,
      bgColor: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600"
    },
    {
      title: "Active Positions",
      value: activePositions.toString(),
      change: "3 pending orders",
      icon: PieChart,
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600"
    },
    {
      title: "Available Cash",
      value: `$${availableCash.toFixed(2)}`,
      change: "Ready to trade",
      icon: DollarSign,
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
      iconColor: "text-amber-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
