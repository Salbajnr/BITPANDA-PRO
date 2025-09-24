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
  BarChart3,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
  Bell,
  Calculator,
  Target,
  Key,
  Activity,
  AlertTriangle,
  ArrowDownLeft,
  FileText
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Dummy SidebarMenuButton component for demonstration purposes
// In a real app, this would likely be imported from a UI library
const SidebarMenuButton = ({ children, isActive, onClick }: { children: React.ReactNode; isActive: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full px-3 py-2 rounded-lg transition-colors",
      isActive
        ? "bg-primary text-white"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
    )}
  >
    {children}
  </button>
);

// Dummy navigate function for demonstration purposes
const navigate = (path: string) => console.log(`Navigating to ${path}`);


interface SidebarProps {
  portfolioData?: any;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ portfolioData, isOpen = false, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  const portfolio = portfolioData?.portfolio;
  const totalValue = portfolio ? parseFloat(portfolio.totalValue) : 0;
  const dailyChange = totalValue * 0.0229; // Mock 2.29% daily change

  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: LineChart },
    { href: "/analytics", label: "Portfolio Analytics", icon: BarChart3 },
    { href: "/trading", label: "Trading", icon: TrendingUp },
    { href: "/advanced-trading", label: "Advanced Trading", icon: Target },
    { href: "/transactions", label: "Transaction History", icon: History },
    { href: "/watchlist", label: "Watchlist", icon: Wallet },
    { href: "/risk-management", label: "Risk Management", icon: AlertTriangle },
    { href: "/tax-reporting", label: "Tax Reporting", icon: Calculator },
    { href: "/api-management", label: "API Management", icon: Key },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/alerts", label: "Price Alerts", icon: Activity },
    { href: "/news", label: "News", icon: Newspaper },
    { href: "/research", label: "Research", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: User },
    { href: "/help", label: "Help", icon: Shield },
  ];

  const adminItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/kyc", label: "KYC Management", icon: ShieldCheck },
    { href: "/admin/transactions", label: "Transaction Monitor", icon: Activity },
    { href: "/admin/deposits", label: "Deposits", icon: DollarSign },
    { href: "/admin/withdrawals", label: "Withdrawals", icon: ArrowDownLeft },
    { href: "/admin/balance-management", label: "Balance Management", icon: Wallet },
    { href: "/admin/news-management", label: "News Management", icon: FileText },
  ];

  // Placeholder for currentPath and navigate if not defined in the original context
  // In a real application, these would come from a routing library like Wouter or React Router
  const currentPath = location; 

  return (
    <>
      {/* Desktop Sidebar */}
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
              {/* Added News Management Link */}
              <SidebarMenuButton 
                isActive={currentPath === '/admin/news-management'}
                onClick={() => navigate('/admin/news-management')}
              >
                <Newspaper className="mr-2 h-4 w-4" />
                News Management
              </SidebarMenuButton>
            </nav>
          </div>
        )}
      </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <aside className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-green-600 flex items-center justify-center">
                    <img src="/client/src/assets/logo.jpeg" alt="BITPANDA PRO" className="w-6 h-6 rounded-full" />
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">BITPANDA PRO</span>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

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
                      <a 
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                          isActive 
                            ? "bg-primary text-white" 
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        )}
                        onClick={onClose}
                      >
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
                          <a 
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                              isActive
                                ? "bg-red-500 text-white"
                                : "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            )}
                            onClick={onClose}
                          >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </a>
                        </Link>
                      );
                    })}
                    {/* Added News Management Link */}
                    <SidebarMenuButton 
                      isActive={currentPath === '/admin/news-management'}
                      onClick={() => navigate('/admin/news-management')}
                    >
                      <Newspaper className="mr-2 h-4 w-4" />
                      News Management
                    </SidebarMenuButton>
                  </nav>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}