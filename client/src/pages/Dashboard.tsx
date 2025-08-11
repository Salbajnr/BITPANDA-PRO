import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import QuickStatsGrid from "@/components/QuickStatsGrid";
import TradingInterface from "@/components/TradingInterface";
import CryptoTable from "@/components/CryptoTable";
import NewsSection from "@/components/NewsSection";

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();

  const { data: portfolioData, isLoading: portfolioLoading } = useQuery({
    queryKey: ["/api/portfolio"],
    retry: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, authLoading, toast]);

  if (authLoading || portfolioLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300">
      <Navbar />
      
      <div className="flex h-screen pt-16">
        <Sidebar portfolioData={portfolioData} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Welcome back, {user?.firstName || 'Trader'}!
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Here's what's happening with your investments today.
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    <i className="fas fa-plus mr-2"></i>New Trade
                  </button>
                </div>
              </div>
            </div>

            <QuickStatsGrid portfolioData={portfolioData} />
            <TradingInterface />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              <CryptoTable />
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your Holdings</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Asset</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {portfolioData?.holdings?.map((holding: any) => (
                        <tr key={holding.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-xs font-bold">
                                  {holding.symbol.substring(0, 2)}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">{holding.symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                            {parseFloat(holding.amount).toFixed(4)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                            ${(parseFloat(holding.amount) * parseFloat(holding.currentPrice)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      {(!portfolioData?.holdings || portfolioData.holdings.length === 0) && (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                            No holdings yet. Start trading to build your portfolio!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <NewsSection />
          </div>
        </main>
      </div>
    </div>
  );
}
