import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route
          path="/dashboard"
          element={
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
              <Navigate to="/auth" />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
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