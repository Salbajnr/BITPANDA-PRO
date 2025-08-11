import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Leaf, Moon, Sun, Bell, User, LogOut, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Leaf className="text-primary text-2xl mr-2" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">BITPANDA PRO</span>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/dashboard">
              <a className="text-primary font-medium">Dashboard</a>
            </Link>
            <a href="#trading" className="text-slate-600 dark:text-slate-300 hover:text-primary">Trading</a>
            <a href="#portfolio" className="text-slate-600 dark:text-slate-300 hover:text-primary">Portfolio</a>
            <a href="#news" className="text-slate-600 dark:text-slate-300 hover:text-primary">News</a>
            {user?.role === 'admin' && (
              <Link href="/admin">
                <a className="text-red-500 font-medium flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Admin Panel
                </a>
              </Link>
            )}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-slate-600 dark:text-slate-300"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-slate-600 dark:text-slate-300">
              <Bell className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                    <AvatarFallback>
                      {user?.firstName?.charAt(0) || "U"}{user?.lastName?.charAt(0) || ""}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {user?.firstName || "Trader"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <Link href="/admin">
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
