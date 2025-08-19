import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Landing from "@/pages/Landing";
import Markets from "@/pages/Markets";
import Deposits from "@/pages/Deposits";
import About from "@/pages/About";
import Features from "@/pages/Features";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import TransactionHistory from "@/pages/TransactionHistory";
import UserSettings from "@/pages/UserSettings";
import PortfolioAnalytics from './pages/PortfolioAnalytics';
import PortfolioTracker from './pages/PortfolioTracker';
import Watchlist from "@/pages/Watchlist";
import Help from "@/pages/Help";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OtpVerification from "./pages/OtpVerification";
import KycVerification from "./pages/KycVerification";
import LiveSupport from "./pages/LiveSupport";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Auth from "./pages/Auth";
import Trading from "./pages/Trading";
import Orders from "./pages/Orders";
import Security from "./pages/Security";
import HelpCenter from './pages/HelpCenter';
import Tutorials from './pages/Tutorials';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import UserAgreement from './pages/UserAgreement';
import Contact from './pages/Contact';
import Deposit from "./pages/Deposit";
import DepositHistory from "./pages/DepositHistory";
import AdminDepositManagement from "./pages/AdminDepositManagement";
import AdminBalanceManagement from "./pages/AdminBalanceManagement";
import AdminNewsManagement from './pages/AdminNewsManagement';
import Academy from "@/pages/Academy";
import News from './pages/News';
import DualMarkets from './pages/DualMarkets';
import { lazy } from 'react';
import PreciousMetals from "@/pages/PreciousMetals";
import Commodities from "@/pages/Commodities";
import InvestmentPlans from './pages/InvestmentPlans';
import Stocks from "./pages/Stocks";
import TaxReporting from "./pages/TaxReporting";
import AdvancedTrading from "./pages/AdvancedTrading";
import APIManagement from "./pages/APIManagement";
import RiskManagement from "./pages/RiskManagement";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Etfs from "./pages/Etfs";
import CryptoIndices from "./pages/CryptoIndices";
import ApiDocumentation from "./pages/ApiDocumentation";
import Press from "./pages/Press";
import Imprint from "./pages/Imprint";


function AppContent() {
  const { user, isLoading, error } = useAuth();

  // For migration demo, show the platform immediately without waiting for auth
  // This allows users to see the successful migration result
  const shouldShowApp = true; // Set to true to bypass loading screen

  if (isLoading && !shouldShowApp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            BITPANDA PRO
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Loading your crypto trading platform...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/markets" component={Markets} />
      <Route path="/stocks" element={<Stocks />} />
      <Route path="/etfs" component={Etfs} />
      <Route path="/precious-metals" element={<PreciousMetals />} />
      <Route path="/commodities" element={<Commodities />} />
      <Route path="/investment-plans" element={<InvestmentPlans />} />
      <Route path="/dual-markets" component={DualMarkets} />
      <Route path="/deposits" component={Deposits} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/features" component={Features} />
      <Route path="/auth" component={() => user ? <Redirect to="/dashboard" /> : <Auth />} />
      <Route path="/auth-admin" component={() => user && user.role === 'admin' ? <Redirect to="/admin" /> : <Auth isAdmin={true} />} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password/:token" component={ResetPassword} />
      <Route path="/verify-otp/:type/:email" component={OtpVerification} />
      <Route
        path="/dashboard"
        component={() =>
          user ? (
            user.role === 'admin' ? (
              <Redirect to="/admin" />
            ) : (
              <Dashboard />
            )
          ) : (
            <Redirect to="/auth" />
          )
        }
      />
      <Route
        path="/admin"
        component={() =>
          user && user.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <Redirect to="/auth-admin" />
          )
        }
      />

      {/* User Dashboard Routes */}
      <Route
        path="/transactions"
        component={() =>
          user ? (
            <TransactionHistory />
          ) : (
            <Redirect to="/auth" />
          )
        }
      />

      <Route
        path="/settings"
        component={() =>
          user ? (
            <UserSettings />
          ) : (
            <Redirect to="/auth" />
          )
        }
      />

      <Route
        path="/analytics"
        component={() =>
          user ? (
            <PortfolioAnalytics />
          ) : (
            <Redirect to="/auth" />
          )
        }
      />

      <Route path="/portfolio-tracker" component={PortfolioTracker} />
      <Route path="/watchlist" component={Watchlist} />

      <Route
        path="/help"
        component={() =>
          user ? (
            <Help />
          ) : (
            <div className="min-h-screen bg-background">
              <Navbar />
              <main className="flex-1 p-6">
                <Help />
              </main>
            </div>
          )
        }
      />

      <Route
        path="/kyc"
        component={() =>
          user ? (
            <KycVerification />
          ) : (
            <Redirect to="/auth" />
          )
        }
      />

      <Route
        path="/support"
        component={() =>
          user ? (
            <LiveSupport />
          ) : (
            <div className="min-h-screen bg-background">
              <Navbar />
              <main className="flex-1 p-6">
                <LiveSupport />
              </main>
            </div>
          )
        }
      />

      <Route path="/trading" component={Trading} />
      <Route path="/orders" component={Orders} />
      <Route path="/alerts" component={lazy(() => import("./pages/Alerts"))} />
      <Route path="/security" component={Security} />
      <Route path="/help-center" component={HelpCenter} />
      <Route path="/tutorials" component={Tutorials} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/careers" component={Careers} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/user-agreement" element={<UserAgreement />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/help" element={<Help />} />
      <Route path="/features" element={<Features />} />
      <Route path="/deposit" component={Deposit} />
      <Route path="/deposit-history" component={DepositHistory} />
      <Route path="/crypto-indices" component={CryptoIndices} />
      <Route path="/api" component={ApiDocumentation} />
      <Route path="/press" component={Press} />
      <Route path="/imprint" component={Imprint} />

      <Route path="/admin/deposits" component={AdminDepositManagement} />
      <Route path="/admin/balance" component={AdminBalanceManagement} />
      <Route path="/admin/news-management" component={() =>
        user && user.role === 'admin' ? (
          <AdminNewsManagement />
        ) : (
          <Redirect to="/auth-admin" />
        )
      } />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/academy" component={Academy} />
      <Route path="/news" component={News} />
      <Route path="/tax-reporting" component={() =>
        user ? (
          <TaxReporting />
        ) : (
          <Redirect to="/auth" />
        )
      } />
      <Route path="/advanced-trading" component={() =>
        user ? (
          <AdvancedTrading />
        ) : (
          <Redirect to="/auth" />
        )
      } />
      <Route path="/api-management" component={() =>
        user ? (
          <APIManagement />
        ) : (
          <Redirect to="/auth" />
        )
      } />
      <Route path="/risk-management" component={() =>
        user ? (
          <RiskManagement />
        ) : (
          <Redirect to="/auth" />
        )
      } />
      <Route path="/analytics" component={() =>
        user ? (
          <Analytics />
        ) : (
          <Redirect to="/auth" />
        )
      } />
      <Route path="/notifications" component={() =>
        user ? (
          <Notifications />
        ) : (
          <Redirect to="/auth" />
        )
      } />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <AppContent />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;