import { Route, Switch, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
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
import Features from "@/pages/Features";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import UserAgreement from "@/pages/UserAgreement";
import CryptoIndices from "@/pages/CryptoIndices";
import SavingsPlans from "@/pages/SavingsPlans";
import Press from "@/pages/Press";
import Imprint from "@/pages/Imprint";
import Tutorials from "@/pages/Tutorials";
import { lazy, Suspense } from 'react';

// Additional pages imported in the changes
import Analytics from "@/pages/Analytics";
import Alerts from "@/pages/Alerts";
import Notifications from "@/pages/Notifications";
import TaxReporting from "@/pages/TaxReporting";
import RiskManagement from "@/pages/RiskManagement";
import AdvancedTrading from "@/pages/AdvancedTrading";
import APIManagement from "@/pages/APIManagement";
import DualMarkets from "@/pages/DualMarkets";

// Admin Pages
import AdminBalanceManagement from "@/pages/AdminBalanceManagement";
import AdminDepositManagement from "@/pages/AdminDepositManagement";

// Lazy loaded components
const PreciousMetals = lazy(() => import("./pages/PreciousMetals"));
const MetalsTrading = lazy(() => import("./pages/MetalsTrading"));
const AdminMetalsManagement = lazy(() => import("./pages/AdminMetalsManagement"));
const AdminChatManagement = lazy(() => import("./pages/AdminChatManagement"));
const AdminNewsManagement = lazy(() => import("./pages/AdminNewsManagement"));
const Commodities = lazy(() => import("./pages/Commodities"));

// Loading component for lazy routes
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
}

// Layout wrapper for public pages
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LiveTicker />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

// Layout wrapper for authenticated pages (no navbar)
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Redirect to="/dashboard" />;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <Switch>
            {/* Public Routes */}
            <Route path="/" component={() => <PublicLayout><Landing /></PublicLayout>} />
            <Route path="/home" component={() => <PublicLayout><Landing /></PublicLayout>} />
            <Route path="/auth" component={() => <PublicLayout><Auth /></PublicLayout>} />
            <Route path="/markets" component={() => <PublicLayout><Markets /></PublicLayout>} />
            <Route path="/news" component={() => <PublicLayout><News /></PublicLayout>} />
            <Route path="/about" component={() => <PublicLayout><About /></PublicLayout>} />
            <Route path="/features" component={() => <PublicLayout><Features /></PublicLayout>} />
            <Route path="/help" component={() => <PublicLayout><Help /></PublicLayout>} />
            <Route path="/contact" component={() => <PublicLayout><Contact /></PublicLayout>} />
            <Route path="/privacy" component={() => <PublicLayout><Privacy /></PublicLayout>} />
            <Route path="/terms" component={() => <PublicLayout><Terms /></PublicLayout>} />

            {/* Investment Routes */}
            <Route path="/stocks" component={Stocks} />
            <Route path="/etfs" component={Etfs} />
            <Route path="/crypto-indices" component={CryptoIndices} />
            <Route path="/precious-metals" component={() => <Suspense fallback={<LoadingSpinner />}><PreciousMetals /></Suspense>} />
            <Route path="/savings-plans" component={SavingsPlans} />
            <Route path="/metals-trading" component={() => <Suspense fallback={<LoadingSpinner />}><MetalsTrading /></Suspense>} />
            <Route path="/commodities" component={() => <Suspense fallback={<LoadingSpinner />}><Commodities /></Suspense>} />
            <Route path="/dual-markets" component={DualMarkets} />

            {/* Information Routes */}
            <Route path="/api-docs" component={API} />
            <Route path="/press" component={Press} />
            <Route path="/imprint" component={Imprint} />
            <Route path="/careers" component={Careers} />
            <Route path="/academy" component={Academy} />
            <Route path="/help-center" component={HelpCenter} />
            <Route path="/user-agreement" component={UserAgreement} />
            <Route path="/tutorials" component={Tutorials} />
            <Route path="/security" component={Security} />
            <Route path="/investor-protection" component={InvestorProtection} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/verify-otp/:type/:email" component={OtpVerification} />
            <Route path="/reset-password/:token" component={ResetPassword} />
            <Route path="/api" component={API} />
            <Route path="/ecosystem" component={Ecosystem} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" component={() => <ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/portfolio" component={() => <ProtectedRoute><PortfolioTracker /></ProtectedRoute>} />
            <Route path="/analytics" component={() => <ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/trading" component={() => <ProtectedRoute><Trading /></ProtectedRoute>} />
            <Route path="/advanced-trading" component={() => <ProtectedRoute><AdvancedTrading /></ProtectedRoute>} />
            <Route path="/transactions" component={() => <ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
            <Route path="/orders" component={() => <ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/watchlist" component={() => <ProtectedRoute><Watchlist /></ProtectedRoute>} />
            <Route path="/alerts" component={() => <ProtectedRoute><Alerts /></ProtectedRoute>} />
            <Route path="/notifications" component={() => <ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/deposits" component={() => <ProtectedRoute><Deposits /></ProtectedRoute>} />
            <Route path="/withdrawals" component={() => <ProtectedRoute><Withdrawals /></ProtectedRoute>} />
            <Route path="/tax-reporting" component={() => <ProtectedRoute><TaxReporting /></ProtectedRoute>} />
            <Route path="/risk-management" component={() => <ProtectedRoute><RiskManagement /></ProtectedRoute>} />
            <Route path="/api-management" component={() => <ProtectedRoute><APIManagement /></ProtectedRoute>} />
            <Route path="/settings" component={() => <ProtectedRoute><UserSettings /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" component={() => <AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/dashboard" component={() => <AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" component={() => <AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/news" component={() => <AdminRoute><Suspense fallback={<LoadingSpinner />}><AdminNewsManagement /></Suspense></AdminRoute>} />
            <Route path="/admin/news-management" component={() => <AdminRoute><Suspense fallback={<LoadingSpinner />}><AdminNewsManagement /></Suspense></AdminRoute>} />
            <Route path="/admin/balances" component={() => <AdminRoute><AdminBalanceManagement /></AdminRoute>} />
            <Route path="/admin/balance-management" component={() => <AdminRoute><AdminBalanceManagement /></AdminRoute>} />
            <Route path="/admin/deposits" component={() => <AdminRoute><AdminDepositManagement /></AdminRoute>} />
            <Route path="/admin/deposit-management" component={() => <AdminRoute><AdminDepositManagement /></AdminRoute>} />
            <Route path="/admin/withdrawals" component={() => <AdminRoute><AdminWithdrawalManagement /></AdminRoute>} />
            <Route path="/admin/withdrawal-management" component={() => <AdminRoute><AdminWithdrawalManagement /></AdminRoute>} />
            <Route path="/admin/chat" component={() => <AdminRoute><Suspense fallback={<LoadingSpinner />}><AdminChatManagement /></Suspense></AdminRoute>} />
            <Route path="/admin/chat-management" component={() => <AdminRoute><Suspense fallback={<LoadingSpinner />}><AdminChatManagement /></Suspense></AdminRoute>} />
            <Route path="/admin/metals" component={() => <AdminRoute><Suspense fallback={<LoadingSpinner />}><AdminMetalsManagement /></Suspense></AdminRoute>} />
            <Route path="/admin/metals-management" component={() => <AdminRoute><Suspense fallback={<LoadingSpinner />}><AdminMetalsManagement /></Suspense></AdminRoute>} />

            {/* 404 Route */}
            <Route component={NotFound} />
          </Switch>

          <Toaster />
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}