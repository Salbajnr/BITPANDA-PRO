import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Markets from "@/pages/Markets";
import Trading from "@/pages/Trading";
import Deposits from "@/pages/Deposits";
import Withdrawals from "@/pages/Withdrawals";
import AdminWithdrawalManagement from "@/pages/AdminWithdrawalManagement";
import PortfolioTracker from './pages/PortfolioTracker';
import PortfolioAnalytics from './pages/PortfolioAnalytics';
import UserSettings from "@/pages/UserSettings";
import TransactionHistory from "@/pages/TransactionHistory";
import Watchlist from "@/pages/Watchlist";
import Help from "@/pages/Help";
import LiveSupport from "@/pages/LiveSupport";
import Security from "./pages/Security";
import Orders from "./pages/Orders";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/Auth";
import AdminLogin from "@/pages/AdminLogin";
import Academy from "@/pages/Academy";
import News from "@/pages/News";
import About from "@/pages/About";
import Careers from "@/pages/Careers";
import HelpCenter from "@/pages/HelpCenter";
import Stocks from "@/pages/Stocks";
import Etfs from "@/pages/Etfs";
import InvestorProtection from "@/pages/InvestorProtection";
import API from "@/pages/API";
import Ecosystem from "@/pages/Ecosystem";
import ForgotPassword from "@/pages/ForgotPassword";
import OtpVerification from "@/pages/OtpVerification";
import ResetPassword from "@/pages/ResetPassword";
import { lazy } from 'react';

const PreciousMetals = lazy(() => import("./pages/PreciousMetals"));
const MetalsTrading = lazy(() => import("./pages/MetalsTrading"));
const AdminMetalsManagement = lazy(() => import("./pages/AdminMetalsManagement"));
const AdminChatManagement = lazy(() => import("./pages/AdminChatManagement"));
const AdminNewsManagement = lazy(() => import("./pages/AdminNewsManagement"));
const Commodities = lazy(() => import("./pages/Commodities"));

// Layout wrapper for public pages
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

// Layout wrapper for authenticated pages (no navbar)
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {children}
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public auth routes - always accessible with navbar */}
      <Route path="/auth">
        <PublicLayout>
          <Auth />
        </PublicLayout>
      </Route>
      <Route path="/forgot-password">
        <PublicLayout>
          <ForgotPassword />
        </PublicLayout>
      </Route>
      <Route path="/verify-otp/:type/:email" component={OtpVerification} />
      <Route path="/reset-password/:token" component={ResetPassword} />

      {/* Public routes - always accessible with navbar */}
      <Route path="/academy">
        <PublicLayout>
          <Academy />
        </PublicLayout>
      </Route>
      <Route path="/news">
        <PublicLayout>
          <News />
        </PublicLayout>
      </Route>
      <Route path="/about">
        <PublicLayout>
          <About />
        </PublicLayout>
      </Route>
      <Route path="/careers">
        <PublicLayout>
          <Careers />
        </PublicLayout>
      </Route>
      <Route path="/help-center">
        <PublicLayout>
          <HelpCenter />
        </PublicLayout>
      </Route>
      <Route path="/stocks">
        <PublicLayout>
          <Stocks />
        </PublicLayout>
      </Route>
      <Route path="/etfs">
        <PublicLayout>
          <Etfs />
        </PublicLayout>
      </Route>
      <Route path="/investor-protection">
        <PublicLayout>
          <InvestorProtection />
        </PublicLayout>
      </Route>
      <Route path="/api">
        <PublicLayout>
          <API />
        </PublicLayout>
      </Route>
      <Route path="/ecosystem">
        <PublicLayout>
          <Ecosystem />
        </PublicLayout>
      </Route>
      <Route path="/precious-metals" component={PreciousMetals} />
      <Route path="/metals-trading" component={MetalsTrading} />
      <Route path="/commodities" component={Commodities} />

      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/">
            <PublicLayout>
              <Landing />
            </PublicLayout>
          </Route>
          <Route path="/admin">
            <PublicLayout>
              <AdminLogin />
            </PublicLayout>
          </Route>
        </>
      ) : (
        <>
          {/* Authenticated routes - no navbar, custom layouts */}
          <Route path="/">
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          </Route>
          <Route path="/dashboard">
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          </Route>
          <Route path="/admin">
            <AuthenticatedLayout>
              <AdminDashboard />
            </AuthenticatedLayout>
          </Route>
          <Route path="/markets">
            <AuthenticatedLayout>
              <Markets />
            </AuthenticatedLayout>
          </Route>
          <Route path="/trading">
            <AuthenticatedLayout>
              <Trading />
            </AuthenticatedLayout>
          </Route>
          <Route path="/deposits">
            <AuthenticatedLayout>
              <Deposits />
            </AuthenticatedLayout>
          </Route>
          <Route path="/withdrawals">
            <AuthenticatedLayout>
              <Withdrawals />
            </AuthenticatedLayout>
          </Route>
          <Route path="/admin/news" component={AdminNewsManagement} />
          <Route path="/admin/metals" component={AdminMetalsManagement} />
          <Route path="/admin/withdrawals" component={AdminWithdrawalManagement} />
          <Route path="/admin/chat" component={AdminChatManagement} />
          <Route path="/portfolio">
            <AuthenticatedLayout>
              <PortfolioTracker />
            </AuthenticatedLayout>
          </Route>
          <Route path="/analytics">
            <AuthenticatedLayout>
              <PortfolioAnalytics />
            </AuthenticatedLayout>
          </Route>
          <Route path="/settings">
            <AuthenticatedLayout>
              <UserSettings />
            </AuthenticatedLayout>
          </Route>
          <Route path="/transactions">
            <AuthenticatedLayout>
              <TransactionHistory />
            </AuthenticatedLayout>
          </Route>
          <Route path="/watchlist">
            <AuthenticatedLayout>
              <Watchlist />
            </AuthenticatedLayout>
          </Route>
          <Route path="/help">
            <AuthenticatedLayout>
              <Help />
            </AuthenticatedLayout>
          </Route>
          <Route path="/support">
            <AuthenticatedLayout>
              <LiveSupport />
            </AuthenticatedLayout>
          </Route>
          <Route path="/security">
            <AuthenticatedLayout>
              <Security />
            </AuthenticatedLayout>
          </Route>
          <Route path="/orders">
            <AuthenticatedLayout>
              <Orders />
            </AuthenticatedLayout>
          </Route>
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}