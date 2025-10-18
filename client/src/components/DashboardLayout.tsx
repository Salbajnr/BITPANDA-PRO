import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'wouter';
import { LoadingSpinner } from './ui/loading-spinner';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}