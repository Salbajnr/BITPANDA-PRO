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
import InvestorProtection from "@/pages/InvestorProtection";
import API from "@/pages/API";
import Ecosystem from "@/pages/Ecosystem";

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
      <Route path="/investor-protection" component={InvestorProtection} />
      <Route path="/api" component={API} />
      <Route path="/ecosystem" component={Ecosystem} />


      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/auth" component={Auth} />
          <Route path="/admin" component={AdminLogin} />
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