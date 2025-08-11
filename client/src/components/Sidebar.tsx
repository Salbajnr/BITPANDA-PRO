import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LineChart, 
  ArrowLeftRight, 
  Wallet, 
  History, 
  Newspaper, 
  User,
  Shield,
  Users,
  DollarSign,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  portfolioData?: any;
}

export default function Sidebar({ portfolioData }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  const portfolio = portfolioData?.portfolio;
  const totalValue = portfolio ? parseFloat(portfolio.totalValue) : 0;
  const dailyChange = totalValue * 0.0229; // Mock 2.29% daily change

  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: LineChart },
    { href: "#trading", label: "Trading", icon: ArrowLeftRight },
    { href: "#portfolio", label: "Portfolio", icon: Wallet },
    { href: "#history", label: "History", icon: History },
    { href: "#news", label: "News", icon: Newspaper },
    { href: "#profile", label: "Profile", icon: User },
  ];

  const adminItems = [
    { href: "/admin", label: "Manage Users", icon: Users },
    { href: "#admin-balances", label: "Simulate Balances", icon: DollarSign },
    { href: "#admin-analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden lg:block">
      <div className="p-6">
        {/* Quick Portfolio Summary */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-4 text-white mb-6">
          <h3 className="text-sm font-medium opacity-90">Portfolio Value</h3>
          <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          <div className="text-sm opacity-90">
            <span className="text-green-300">+${dailyChange.toFixed(2)} (+2.29%)</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                )}>
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Admin Panel
            </h4>
            <nav className="space-y-2">
              {adminItems.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <a className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-red-500 text-white"
                        : "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    )}>
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </a>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
}
