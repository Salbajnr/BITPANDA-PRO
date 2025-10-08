import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCryptoData, CryptoData } from "@/hooks/useCryptoData";
import { Link } from "wouter";
import {
  Wallet, TrendingUp, TrendingDown, 
  BarChart3, PieChart, 
  RefreshCw, DollarSign, Activity, 
  Eye, Star, Bell,
  Settings, 
  Users, Globe, Zap, Shield, Award
} from "lucide-react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import QuickStatsGrid from "@/components/QuickStatsGrid";
import NewsSection from "@/components/NewsSection";
import CryptoTable from "@/components/CryptoTable";


export default function Dashboard() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState("portfolio");

  const { marketData, isMarketLoading } = useCryptoData(undefined, 0, 100);
  const { chartData, isChartLoading } = useCryptoData('bitcoin', 7);

  useEffect(() => {
    if (!authLoading && !user) {
      toast({ title: "Authentication Required", description: "Please log in.", variant: "destructive" });
      window.location.href = "/auth";
    }
  }, [user, authLoading, toast]);

  const formattedChartData = chartData?.prices.map((price: [number, number]) => ({
    time: new Date(price[0]).toLocaleDateString(),
    value: price[1]
  })) || [];

  const topMovers = marketData
    .sort((a: CryptoData, b: CryptoData) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);

  const worstMovers = marketData
    .sort((a: CryptoData, b: CryptoData) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5);

  if (authLoading || isMarketLoading) {
    return <div className="flex h-screen items-center justify-center">Loading Dashboard...</div>;
  }

  const sidebarItems = [
    { id: "portfolio", label: "Portfolio Overview", icon: Wallet },
    { id: "market", label: "Market Analysis", icon: BarChart3 },
    { id: "trade", label: "Trade", icon: Activity },
    { id: "news", label: "News & Insights", icon: Globe },
    { id: "account", label: "Account Settings", icon: Settings },
  ];


  return (
    <div className="bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300 min-h-screen">
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-slate-100/40 dark:bg-slate-800/40 lg:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-[60px] items-center border-b px-6">
              <Link to="/" className="flex items-center gap-2 font-semibold">
                <Shield className="h-6 w-6" />
                <span>Pro Trading</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 ${
                      activeSection === item.id ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50" : ""
                    }`}>
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
           <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-slate-100/40 px-6 dark:bg-slate-800/40">
             <Link to="#" className="lg:hidden">
              <Shield className="h-6 w-6" />
              <span className="sr-only">Home</span>
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-semibold"> {sidebarItems.find(item => item.id === activeSection)?.label}</h1>
            </div>
            <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <form className="ml-auto flex-1 sm:flex-initial">
                  <div className="relative">
                  </div>
                </form>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Toggle notifications</span>
                </Button>
                {/* User Dropdown */}
              </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
              {activeSection === "portfolio" && (
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <QuickStatsGrid />
                  </div>
              )}
              {activeSection === "market" && (
                  <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Top Gainers</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {topMovers.map((mover: CryptoData) => (
                              <div key={mover.id} className="flex justify-between items-center mb-2">
                                <span>{mover.name}</span>
                                <span className="text-green-500">+{mover.price_change_percentage_24h.toFixed(2)}%</span>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>Top Losers</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {worstMovers.map((mover: CryptoData) => (
                              <div key={mover.id} className="flex justify-between items-center mb-2">
                                <span>{mover.name}</span>
                                <span className="text-red-500">{mover.price_change_percentage_24h.toFixed(2)}%</span>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                              <CardTitle>Bitcoin 7-Day Chart</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {isChartLoading ? <div>Loading...</div> : 
                                <ResponsiveContainer width="100%" height={150}>
                                  <AreaChart data={formattedChartData}>
                                    <defs>
                                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                      </linearGradient>
                                    </defs>
                                    <Tooltip />
                                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="url(#chartGradient)" />
                                  </AreaChart>
                                </ResponsiveContainer>
                              }
                            </CardContent>
                          </Card>
                      </div>
                      <CryptoTable marketData={marketData} />
                  </div>
              )}
               {activeSection === "news" && ( <NewsSection /> )}
               {activeSection === "trade" && (<div>Trade section under construction</div>)}
               {activeSection === "account" && (<div>Account settings under construction</div>)}
          </main>
        </div>
      </div>
    </div>
  );
}
