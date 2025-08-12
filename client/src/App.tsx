import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import Landing from "@/pages/Landing";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Features from "@/pages/Features";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import TransactionHistory from "@/pages/TransactionHistory";
import UserSettings from "@/pages/UserSettings";
import PortfolioAnalytics from "@/pages/PortfolioAnalytics";
import Watchlist from "@/pages/Watchlist";
import Help from "@/pages/Help";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import OtpVerification from "@/pages/OtpVerification";
import KycVerification from "@/pages/KycVerification";
import LiveSupport from "@/pages/LiveSupport";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Auth from "@/pages/Auth";

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
      <Route path="/" component={() => user ? <Redirect to="/dashboard" /> : <Landing />} />
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
              <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex">
                  <Sidebar />
                  <main className="flex-1 p-6">
                    <Dashboard />
                  </main>
                </div>
              </div>
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
            <div className="min-h-screen bg-background">
              <Navbar />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                  <TransactionHistory />
                </main>
              </div>
            </div>
          ) : (
            <Redirect to="/auth" />
          )
        }
      />
      
      <Route
        path="/settings"
        component={() =>
          user ? (
            <div className="min-h-screen bg-background">
              <Navbar />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                  <UserSettings />
                </main>
              </div>
            </div>
          ) : (
            <Redirect to="/auth" />
          )
        }
      />
      
      <Route
        path="/analytics"
        component={() =>
          user ? (
            <div className="min-h-screen bg-background">
              <Navbar />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                  <PortfolioAnalytics />
                </main>
              </div>
            </div>
          ) : (
            <Redirect to="/auth" />
          )
        }
      />
      
      <Route
        path="/watchlist"
        component={() =>
          user ? (
            <div className="min-h-screen bg-background">
              <Navbar />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                  <Watchlist />
                </main>
              </div>
            </div>
          ) : (
            <Redirect to="/auth" />
          )
        }
      />
      
      <Route
        path="/help"
        component={() =>
          user ? (
            <div className="min-h-screen bg-background">
              <Navbar />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                  <Help />
                </main>
              </div>
            </div>
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
            <div className="min-h-screen bg-background">
              <Navbar />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                  <KycVerification />
                </main>
              </div>
            </div>
          ) : (
            <Redirect to="/auth" />
          )
        }
      />
      
      <Route
        path="/support"
        component={() =>
          user ? (
            <div className="min-h-screen bg-background">
              <Navbar />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                  <LiveSupport />
                </main>
              </div>
            </div>
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
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;