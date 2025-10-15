import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import LiveTicker from "./LiveTicker";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showTicker?: boolean;
  className?: string;
}

export function DashboardLayout({ 
  children, 
  showSidebar = false, 
  showTicker = true,
  className 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {showTicker && <LiveTicker />}

      <div className="flex">
        {showSidebar && (
          <aside className="w-64 min-h-screen bg-card border-r border-border">
            <Sidebar />
          </aside>
        )}

        <main className={cn(
          "flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6",
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}