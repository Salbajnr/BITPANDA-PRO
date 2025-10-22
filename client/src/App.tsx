import { Route, Switch, Redirect, Router, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { MessageModalProvider } from '@/contexts/MessageModalContext';
import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Markets from "@/pages/Markets";
import Trading from "@/pages/Trading";
import Deposits from "@/pages/Deposits";
import Withdrawals from "@/pages/Withdrawals";
import PortfolioTracker from './pages/PortfolioTracker';
import UserSettings from "@/pages/UserSettings";
import TransactionHistory from "@/pages/TransactionHistory";
import Watchlist from "@/pages/Watchlist";
import Help from "@/pages/Help";
import LiveSupport from "@/pages/LiveSupport";
import Security from "./pages/Security";
import Orders from "./pages/Orders";
import NotFound from "@/pages/not-found";
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
import { lazy, Suspense, useEffect } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FeatureErrorBoundary } from '@/components/FeatureErrorBoundary';
import { queryClient } from "./lib/queryClient";

// Additional pages imported in the changes
import Analytics from "@/pages/Analytics";
import Alerts from "@/pages/Alerts";
import Notifications from "@/pages/Notifications";
import TaxReporting from "@/pages/TaxReporting";
import RiskManagement from "@/pages/RiskManagement";
import AdvancedTrading from "@/pages/AdvancedTrading";
import APIManagement from "@/pages/APIManagement";
import DualMarkets from "@/pages/DualMarkets";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLogin from "@/pages/AdminLogin";
import KycVerification from "./pages/KycVerification";
import AssetDetails from "./pages/AssetDetails";
import MarketResearchDashboard from "./pages/MarketResearchDashboard";

// Lazy load InvestmentPlans
const InvestmentPlans = lazy(() => import("@/pages/InvestmentPlans"));

// Lazy loaded components
const PreciousMetals = lazy(() => import("./pages/PreciousMetals"));
const MetalsTrading = lazy(() => import("./pages/MetalsTrading"));
const AdminMetalsManagement = lazy(() => import("@/pages/AdminMetalsManagement"));
const AdminChatManagement = lazy(() => import("./pages/AdminChatManagement"));
const AdminNewsManagement = lazy(() => import("./pages/AdminNewsManagement"));
const Commodities = lazy(() => import("./pages/Commodities"));
const AdminTransactionMonitor = lazy(() => import("@/pages/AdminTransactionMonitor"));
const AdminUsers = lazy(() => import("@/pages/AdminUsers"));
const AdminBalanceManagement = lazy(() => import("@/pages/AdminBalanceManagement"));
const AdminWithdrawalManagement = lazy(() => import("@/pages/AdminWithdrawalManagement"));
const AdminKycManagement = lazy(() => import("@/pages/AdminKycManagement"));
const AdminDepositManagement = lazy(() => import("@/pages/AdminDepositManagement"));

// Placeholder for the new LoadingScreen component
const LoadingScreen = ({ message }: { message: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mb-4"></div>
    <p className="text-lg text-foreground">{message}</p>
  </div>
);

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
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/auth');
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return <LoadingScreen message="Authenticating user..." />;
  }

  if (!user) {
    return null;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}

// Routes component to be rendered inside Router
function Routes() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" exact component={() => <PublicLayout><Landing /></PublicLayout>} />
      <Route path="/home" component={() => <PublicLayout><Landing /></PublicLayout>} />
      <Route path="/auth" component={() => <PublicLayout><Auth /></PublicLayout>} />
      <Route path="/markets" component={() => <PublicLayout><Markets /></PublicLayout>} />
      <Route path="/news" component={() => <PublicLayout><News /></PublicLayout>} />
      <Route path="/research" component={() => <PublicLayout><Suspense fallback={<LoadingSpinner />}><MarketResearchDashboard /></Suspense></PublicLayout>} />
      <Route path="/about" component={() => <PublicLayout><About /></PublicLayout>} />
      <Route path="/features" component={() => <PublicLayout><Features /></PublicLayout>} />
      <Route path="/help" component={() => <PublicLayout><Help /></PublicLayout>} />
      <Route path="/contact" component={() => <PublicLayout><Contact /></PublicLayout>} />
      <Route path="/privacy" component={() => <PublicLayout><Privacy /></PublicLayout>} />
      <Route path="/terms" component={() => <PublicLayout><Terms /></PublicLayout>} />

      {/* Investment Routes */}
      <Route path="/stocks" component={() => <PublicLayout><Stocks /></PublicLayout>} />
      <Route path="/etfs" component={() => <PublicLayout><Etfs /></PublicLayout>} />
      <Route path="/crypto-indices" component={() => <PublicLayout><CryptoIndices /></PublicLayout>} />
      <Route path="/precious-metals" component={() => <PublicLayout><Suspense fallback={<LoadingSpinner />}><PreciousMetals /></Suspense></PublicLayout>} />
      <Route path="/savings-plans" component={() => <PublicLayout><SavingsPlans /></PublicLayout>} />
      <Route path="/about-us" component={() => <PublicLayout><About /></PublicLayout>} />
      <Route path="/investment-plans" component={() => (
        <ProtectedRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <InvestmentPlans />
          </Suspense>
        </ProtectedRoute>
      )} />
      <Route path="/metals-trading" component={() => <Suspense fallback={<LoadingSpinner />}><MetalsTrading /></Suspense>} />
      <Route path="/commodities" component={() => <Suspense fallback={<LoadingSpinner />}><Commodities /></Suspense>} />
      <Route path="/dual-markets" component={DualMarkets} />

      {/* Information Routes */}
      <Route path="/api-docs" component={() => <PublicLayout><API /></PublicLayout>} />
      <Route path="/press" component={() => <PublicLayout><Press /></PublicLayout>} />
      <Route path="/imprint" component={() => <PublicLayout><Imprint /></PublicLayout>} />
      <Route path="/careers" component={() => <PublicLayout><Careers /></PublicLayout>} />
      <Route path="/academy" component={() => <PublicLayout><Academy /></PublicLayout>} />
      <Route path="/help-center" component={() => <PublicLayout><HelpCenter /></PublicLayout>} />
      <Route path="/user-agreement" component={() => <PublicLayout><UserAgreement /></PublicLayout>} />
      <Route path="/tutorials" component={() => <PublicLayout><Tutorials /></PublicLayout>} />
      <Route path="/security" component={() => <PublicLayout><Security /></PublicLayout>} />
      <Route path="/investor-protection" component={() => <PublicLayout><InvestorProtection /></PublicLayout>} />
      <Route path="/forgot-password" component={() => <PublicLayout><ForgotPassword /></PublicLayout>} />
      <Route path="/verify-otp/:type/:email" component={OtpVerification} />
      <Route path="/reset-password/:token" component={ResetPassword} />
      <Route path="/api" component={() => <PublicLayout><API /></PublicLayout>} />
      <Route path="/ecosystem" component={() => <PublicLayout><Ecosystem /></PublicLayout>} />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" component={() => (
        <ProtectedRoute>
          <FeatureErrorBoundary featureName="Dashboard">
            <Dashboard />
          </FeatureErrorBoundary>
        </ProtectedRoute>
      )} />
      <Route path="/portfolio" component={() => (
        <ProtectedRoute>
          <FeatureErrorBoundary featureName="Portfolio Tracker">
            <PortfolioTracker />
          </FeatureErrorBoundary>
        </ProtectedRoute>
      )} />
      <Route path="/analytics" component={() => (
        <ProtectedRoute>
          <FeatureErrorBoundary featureName="Analytics">
            <Analytics />
          </FeatureErrorBoundary>
        </ProtectedRoute>
      )} />
      <Route path="/trading" component={() => (
        <ProtectedRoute>
          <FeatureErrorBoundary featureName="Trading">
            <Trading />
          </FeatureErrorBoundary>
        </ProtectedRoute>
      )} />
      <Route path="/advanced-trading" component={() => (
        <ProtectedRoute>
          <FeatureErrorBoundary featureName="Advanced Trading">
            <AdvancedTrading />
          </FeatureErrorBoundary>
        </ProtectedRoute>
      )} />
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

      {/* KYC Verification Route */}
      <Route path="/kyc-verification" component={() => <ProtectedRoute><KycVerification /></ProtectedRoute>} />

      {/* Asset Details Route - Available to all users */}
      <Route path="/asset/:symbol" component={({ params }) => <AssetDetails symbol={params.symbol} />} />
      <Route path="/landing" component={Landing} />

      {/* Admin Login - separate page accessible at /admin-login */}
      <Route path="/admin-login" component={() => <PublicLayout><AdminLogin /></PublicLayout>} />

      {/* Admin routes - redirect to separate admin app */}
      <Route path="/admin/:rest*" component={() => {
        window.location.href = '/admin.html';
        return null;
      }} />

      {/* 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <LanguageProvider>
              <MessageModalProvider>
                <Router>
                  <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
                    <Routes />
                  </div>
                </Router>
              </MessageModalProvider>
            </LanguageProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}