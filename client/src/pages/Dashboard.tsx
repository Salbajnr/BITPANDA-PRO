
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "wouter";

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
}

interface TopMover {
  id: string;
  symbol: string;
  name: string;
  change: number;
}

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"winners" | "losers">("winners");

  const { data: portfolioData, isLoading: portfolioLoading } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
    retry: false,
    enabled: !!user,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access your dashboard",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 1000);
    }
  }, [user, authLoading, toast]);

  if (authLoading || portfolioLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Mock data for top movers
  const topMovers: TopMover[] = [
    { id: "1", symbol: "VSN", name: "Vision", change: 66.83 },
    { id: "2", symbol: "REZ", name: "Renzo", change: 38.42 },
    { id: "3", symbol: "HPOS10I", name: "HarryPotterOb...", change: 31.37 },
  ];

  const totalPortfolioValue = portfolioData?.portfolio?.totalValue
    ? parseFloat(portfolioData.portfolio.totalValue)
    : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Greeting and Balance */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Hallo {user?.firstName || "Heike"}!
          </h1>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <span className="text-slate-500 dark:text-slate-400">🔔</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-slate-900 dark:text-white">
            {totalPortfolioValue.toLocaleString("de-DE", {
              style: "currency",
              currency: "EUR",
            })}
          </div>
          <div className="text-sm text-red-500">▼ 0,73 % in 1 Tag</div>
        </div>

        {/* Trade Button */}
        <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-6 mb-6">
          Trade
        </Button>

        {/* Promo Cards */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <Card className="bg-slate-100 dark:bg-slate-800">
            <CardContent className="p-2 text-center">
              <div className="w-full h-16 bg-slate-300 dark:bg-slate-700 rounded mb-2"></div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Vision (VSN) ist live
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-100 dark:bg-slate-800">
            <CardContent className="p-2 text-center">
              <div className="w-full h-16 bg-slate-300 dark:bg-slate-700 rounded mb-2"></div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Bitcoin-Allzeithoch
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-100 dark:bg-slate-800">
            <CardContent className="p-2 text-center">
              <div className="w-full h-16 bg-slate-300 dark:bg-slate-700 rounded mb-2"></div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Gewinne ein Bitcoin
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Top Movers Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Top-Mover in 1 Tag
            </h2>
            <Link href="#" className="text-sm text-green-500">
              Mehr anzeigen
            </Link>
          </div>

          <div className="flex mb-4">
            <Button
              variant={activeTab === "winners" ? "default" : "outline"}
              className={`flex-1 rounded-r-none ${
                activeTab === "winners"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
              onClick={() => setActiveTab("winners")}
            >
              Gewinner
            </Button>
            <Button
              variant={activeTab === "losers" ? "default" : "outline"}
              className={`flex-1 rounded-l-none ${
                activeTab === "losers"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
              onClick={() => setActiveTab("losers")}
            >
              Verlierer
            </Button>
          </div>

          {/* Top Movers List */}
          <div className="space-y-2">
            {topMovers.map((mover) => (
              <Card
                key={mover.id}
                className="bg-slate-50 dark:bg-slate-800 p-3 flex items-center"
              >
                <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700 mr-3"></div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {mover.symbol} {mover.name}
                  </p>
                </div>
                <div
                  className={`font-medium ${
                    mover.change > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {mover.change > 0 ? "▲" : "▼"} {Math.abs(mover.change)}%
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
    </div>
  );
}
