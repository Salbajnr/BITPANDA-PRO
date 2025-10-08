import { useState } from "react";
import { Switch, Route, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/useAuth";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import NotFound from "@/pages/not-found";

// Page Imports
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import Trading from "./pages/Trading";
import AdvancedTrading from "./pages/AdvancedTrading";
import TransactionHistory from "./pages/TransactionHistory";
import Watchlist from "./pages/Watchlist";
import RiskManagement from "./pages/RiskManagement";
import TaxReporting from "./pages/TaxReporting";
import ApiManagement from "./pages/APIManagement";
import Notifications from "./pages/Notifications";
import PriceAlerts from "./pages/Alerts";
import News from "./pages/News";
import UserSettings from "./pages/UserSettings";
import HelpCenter from "./pages/HelpCenter";
import AboutUs from "./pages/AboutUs";
import LiveSupport from "./pages/LiveSupport";

// Admin Page Imports
import AdminBalanceManagement from "./pages/AdminBalanceManagement";
import AdminDepositManagement from "./pages/AdminDepositManagement";
import AdminNewsManagement from "./pages/AdminNewsManagement";
import AdminLogin from "./pages/AdminLogin";

// Auth Pages
import Auth from "./pages/Auth";

// Static Pages
import LandingNew from "./pages/LandingNew";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

  const renderRoutes = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-screen text-2xl font-bold">Loading...</div>;
    }

    if (isAuthenticated) {
      const isAdmin = user?.role === 'admin';

      return (
        <div className="flex h-screen bg-background">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-6">
              <Switch>
                <Route path="/" nest>
                  <Redirect to="/dashboard" />
                </Route>
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/analytics" component={Analytics} />
                <Route path="/trading" component={Trading} />
                <Route path="/advanced-trading" component={AdvancedTrading} />
                <Route path="/transactions" component={TransactionHistory} />
                <Route path="/watchlist" component={Watchlist} />
                <Route path="/risk-management" component={RiskManagement} />
                <Route path="/tax-reporting" component={TaxReporting} />
                <Route path="/api-management" component={ApiManagement} />
                <Route path="/notifications" component={Notifications} />
                <Route path="/alerts" component={PriceAlerts} />
                <Route path="/news" component={News} />
                <Route path="/settings" component={UserSettings} />
                <Route path="/help" component={HelpCenter} />
                <Route path="/about" component={AboutUs} />
                <Route path="/support" component={LiveSupport} />

                {/* Admin Routes */}
                {isAdmin && (
                  <>
                    <Route path="/admin" component={AdminDashboard} />
                    <Route path="/admin-balance" component={AdminBalanceManagement} />
                    <Route path="/admin-deposits" component={AdminDepositManagement} />
                    <Route path="/admin-news" component={AdminNewsManagement} />
                  </>
                )}

                <Route>
                  <NotFound />
                </Route>
              </Switch>
            </main>
          </div>
        </div>
      );
    }

    // Unauthenticated user routes
    return (
      <Switch>
        <Route path="/" component={LandingNew} />
        <Route path="/auth/:action" component={Auth} />
        <Route path="/auth"> <Redirect to="/auth/login" /> </Route>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/about" component={AboutUs} />
        <Route> <NotFound /> </Route>
      </Switch>
    );
  };

  return (
    <>
      {renderRoutes()}
      <Toaster />
    </>
  );
}
