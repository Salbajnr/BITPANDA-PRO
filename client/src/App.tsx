import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Landing from "@/pages/Landing";
import EnhancedLanding from "@/pages/EnhancedLanding";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
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
import TradingPro from "./pages/TradingPro";
import Orders from "./pages/Orders";
import Security from "./pages/Security";
import HelpCenter from './pages/HelpCenter';
import Tutorials from './pages/Tutorials';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Deposit from "./pages/Deposit";
import DepositHistory from "./pages/DepositHistory";
import AdminDepositManagement from "./pages/AdminDepositManagement";
import AdminBalanceManagement from "./pages/AdminBalanceManagement";
import Academy from "@/pages/Academy";
import News from './pages/News';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={() => user ? <Redirect to="/dashboard" /> : <EnhancedLanding />} />
      <Route path="/classic" component={() => user ? <Redirect to="/dashboard" /> : <Landing />} />
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

      <Route path="/trading-pro" component={TradingPro} />
      <Route path="/orders" component={Orders} />
      <Route path="/security" component={Security} />
      <Route path="/help-center" component={HelpCenter} />
      <Route path="/tutorials" component={Tutorials} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/careers" component={Careers} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/deposit" component={Deposit} />
      <Route path="/deposit-history" component={DepositHistory} />
      
      <Route path="/admin/deposits" component={AdminDepositManagement} />
      <Route path="/admin/balance" component={AdminBalanceManagement} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/academy" component={Academy} />
      <Route path="/news" component={News} />
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