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
      <Route
        path="/dashboard"
        component={() =>
          user ? (
            <div className="min-h-screen bg-background">
              <Navbar />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                  {user.role === 'admin' ? <AdminDashboard /> : <Dashboard />}
                </main>
              </div>
            </div>
          ) : (
            <Redirect to="/auth" />
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