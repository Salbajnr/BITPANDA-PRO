import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Markets from "@/pages/Markets";
import Trading from "@/pages/Trading";
import Deposits from "@/pages/Deposits";
import PortfolioTracker from './pages/PortfolioTracker';
import PortfolioAnalytics from './pages/PortfolioAnalytics';
import UserSettings from "@/pages/UserSettings";
import TransactionHistory from "@/pages/TransactionHistory";
import Watchlist from "@/pages/Watchlist";
import Help from "@/pages/Help";
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
import APIManagement from "./pages/APIManagement";
import AboutUs from "./pages/AboutUs";
import AdminBalanceManagement from "./pages/AdminBalanceManagement";
import AdminDepositManagement from "./pages/AdminDepositManagement";
import AdminNewsManagement from "./pages/AdminNewsManagement";
import AdvancedTrading from "./pages/AdvancedTrading";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import ApiDocumentation from "./pages/ApiDocumentation";
import Commodities from "./pages/Commodities";
import Contact from "./pages/Contact";
import CryptoIndices from "./pages/CryptoIndices";
import DepositHistory from "./pages/DepositHistory";
import DualMarkets from "./pages/DualMarkets";
import Features from "./pages/Features";
import ForgotPassword from "./pages/ForgotPassword";
import Imprint from "./pages/Imprint";
import InvestmentPlans from "./pages/InvestmentPlans";
import KycVerification from "./pages/KycVerification";
import LandingNew from "./pages/LandingNew";
import LiveSupport from "./pages/LiveSupport";
import Notifications from "./pages/Notifications";
import OtpVerification from "./pages/OtpVerification";
import PreciousMetals from "./pages/PreciousMetals";
import Press from "./pages/Press";
import Privacy from "./pages/Privacy";
import ResetPassword from "./pages/ResetPassword";
import RiskManagement from "./pages/RiskManagement";
import SavingsPlans from "./pages/SavingsPlans";
import TaxReporting from "./pages/TaxReporting";
import Terms from "./pages/Terms";
import Tutorials from "./pages/Tutorials";
import UserAgreement from "./pages/UserAgreement";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public routes - always accessible */}
      <Route path="/academy" component={Academy} />
      <Route path="/news" component={News} />
      <Route path="/about" component={About} />
      <Route path="/careers" component={Careers} />
      <Route path="/help-center" component={HelpCenter} />
      <Route path="/stocks" component={Stocks} />
      <Route path="/etfs" component={Etfs} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/otp-verification" component={OtpVerification} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/contact" component={Contact} />
      <Route path="/imprint" component={Imprint} />
      <Route path="/press" component={Press} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/user-agreement" component={UserAgreement} />
      
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/auth" component={Auth} />
          <Route path="/admin" component={AdminLogin} />
          <Route path="/landing-new" component={LandingNew} />

        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/markets" component={Markets} />
          <Route path="/trading" component={Trading} />
          <Route path="/deposits" component={Deposits} />
          <Route path="/portfolio" component={PortfolioTracker} />
          <Route path="/analytics" component={PortfolioAnalytics} />
          <Route path="/settings" component={UserSettings} />
          <Route path="/transactions" component={TransactionHistory} />
          <Route path="/watchlist" component={Watchlist} />
          <Route path="/help" component={Help} />
          <Route path="/security" component={Security} />
          <Route path="/orders" component={Orders} />
          <Route path="/api-management" component={APIManagement} />
          <Route path="/admin-balance" component={AdminBalanceManagement} />
          <Route path="/admin-deposits" component={AdminDepositManagement} />
          <Route path="/admin-news" component={AdminNewsManagement} />
          <Route path="/advanced-trading" component={AdvancedTrading} />
          <Route path="/alerts" component={Alerts} />
          <Route path="/analytics-page" component={Analytics} />
          <Route path="/api-docs" component={ApiDocumentation} />
          <Route path="/commodities" component={Commodities} />
          <Route path="/crypto-indices" component={CryptoIndices} />
          <Route path="/deposit-history" component={DepositHistory} />
          <Route path="/dual-markets" component={DualMarkets} />
          <Route path="/features" component={Features} />
          <Route path="/investment-plans" component={InvestmentPlans} />
          <Route path="/kyc" component={KycVerification} />
          <Route path="/live-support" component={LiveSupport} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/precious-metals" component={PreciousMetals} />
          <Route path="/risk-management" component={RiskManagement} />
          <Route path="/savings-plans" component={SavingsPlans} />
          <Route path="/tax-reporting" component={TaxReporting} />
          <Route path="/tutorials" component={Tutorials} />
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
