
import { Route, Switch, Redirect, Router } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MessageModalProvider } from '@/contexts/MessageModalContext';
import { useAdminAuth } from "@/admin/hooks/useAdminAuth";
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Admin Pages
import AdminLogin from "@/admin/pages/AdminLogin";
import AdminDashboard from "@/admin/pages/AdminDashboard";
import AdminUsers from "@/admin/pages/AdminUsers";
import AdminKycManagement from "@/admin/pages/AdminKycManagement";
import AdminBalanceManagement from "@/admin/pages/AdminBalanceManagement";
import AdminDepositManagement from "@/admin/pages/AdminDepositManagement";
import AdminWithdrawalManagement from "@/admin/pages/AdminWithdrawalManagement";
import AdminNewsManagement from "@/admin/pages/AdminNewsManagement";
import AdminChatManagement from "@/admin/pages/AdminChatManagement";
import AdminMetalsManagement from "@/admin/pages/AdminMetalsManagement";
import AdminTransactionMonitor from "@/admin/pages/AdminTransactionMonitor";

// Loading component
const LoadingScreen = ({ message }: { message: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mb-4"></div>
    <p className="text-lg text-foreground">{message}</p>
  </div>
);

// Protected route wrapper for admin
function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return <LoadingScreen message="Verifying admin access..." />;
  }

  if (!admin) {
    return <Redirect to="/admin/login" />;
  }

  return <>{children}</>;
}

export default function AdminApp() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MessageModalProvider>
            <TooltipProvider>
              <Router base="/admin">
                <Switch>
                  {/* Admin Login */}
                  <Route path="/login" component={AdminLogin} />
                  
                  {/* Protected Admin Routes */}
                  <Route path="/" component={() => (
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  )} />
                  
                  <Route path="/dashboard" component={() => (
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  )} />
                  
                  <Route path="/users" component={() => (
                    <AdminProtectedRoute>
                      <AdminUsers />
                    </AdminProtectedRoute>
                  )} />
                  
                  <Route path="/kyc" component={() => (
                    <AdminProtectedRoute>
                      <AdminKycManagement />
                    </AdminProtectedRoute>
                  )} />
                  
                  <Route path="/balance-management" component={() => (
                    <AdminProtectedRoute>
                      <AdminBalanceManagement />
                    </AdminProtectedRoute>
                  )} />
                  
                  <Route path="/deposits" component={() => (
                    <AdminProtectedRoute>
                      <AdminDepositManagement />
                    </AdminProtectedRoute>
                  )} />
                  
                  <Route path="/withdrawals" component={() => (
                    <AdminProtectedRoute>
                      <AdminWithdrawalManagement />
                    </AdminProtectedRoute>
                  )} />
                  
                  <Route path="/news" component={() => (
                    <AdminProtectedRoute>
                      <AdminNewsManagement />
                    </AdminProtectedRoute>
                  )} />
                  
                  <Route path="/chat" component={() => (
                    <AdminProtectedRoute>
                      <AdminChatManagement />
                    </AdminProtectedRoute>
                  )} />
                  
                  <Route path="/metals" component={() => (
                    <AdminProtectedRoute>
                      <AdminMetalsManagement />
                    </AdminProtectedRoute>
                  )} />
                  
                  <Route path="/transactions" component={() => (
                    <AdminProtectedRoute>
                      <AdminTransactionMonitor />
                    </AdminProtectedRoute>
                  )} />
                  
                  {/* Fallback */}
                  <Route component={() => <Redirect to="/admin/dashboard" />} />
                </Switch>
              </Router>
              <Toaster />
            </TooltipProvider>
          </MessageModalProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
