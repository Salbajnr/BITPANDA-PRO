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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { Leaf, Moon, Sun, Bell, User, LogOut, Shield, ChevronDown, Menu, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const navigationData = {
    Products: [
      { label: "Financial Instruments", href: "/products/financial-instruments" },
      { label: "Forex", href: "/products/forex" },
      { label: "Cryptocurrencies", href: "/products/cryptocurrencies" },
      { label: "Indices", href: "/products/indices" },
      { label: "Shares", href: "/products/shares" },
      { label: "Commodities", href: "/products/commodities" }
    ],
    Trading: [
      { label: "Account Type", href: "/trading/account-type" },
      { label: "Deposit and Withdrawal", href: "/trading/deposit-withdrawal" },
      { label: "Leverage and Margin", href: "/trading/leverage-margin" },
      { label: "Copytrading", href: "/trading/copytrading" }
    ],
    Academy: [
      { label: "Trading Basics", href: "/academy/basics" },
      { label: "Advanced Strategies", href: "/academy/advanced" },
      { label: "Market Analysis", href: "/academy/analysis" },
      { label: "Risk Management", href: "/academy/risk-management" }
    ],
    News: [
      { label: "Economic Calendar", href: "/news/economic-calendar" },
      { label: "Promotions", href: "/news/promotions" },
      { label: "Events", href: "/news/events" },
      { label: "Blogs", href: "/news/blogs" }
    ],
    Company: [
      { label: "About Us", href: "/company/about" },
      { label: "Why Us", href: "/company/why-us" },
      { label: "Contact Us", href: "/company/contact" },
      { label: "Regulations", href: "/company/regulations" }
    ],
    Partnership: [
      { label: "Partner Program", href: "/partnership/program" },
      { label: "Affiliate", href: "/partnership/affiliate" },
      { label: "IB Program", href: "/partnership/ib-program" }
    ]
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

          {/* Desktop Navigation Menu */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {Object.entries(navigationData).map(([category, items]) => (
                <NavigationMenuItem key={category}>
                  <NavigationMenuTrigger className="text-slate-600 dark:text-slate-300 hover:text-primary">
                    {category}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {items.map((item) => (
                        <NavigationMenuLink key={item.href} asChild>
                          <Link href={item.href}>
                            <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">{item.label}</div>
                            </a>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}

              {user?.role === 'admin' && (
                <NavigationMenuItem>
                  <Link href="/admin">
                    <NavigationMenuLink className="text-red-500 font-medium flex items-center px-4 py-2">
                      <Shield className="w-4 h-4 mr-1" />
                      Admin Panel
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 dark:text-slate-300"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Right Side Controls */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-slate-600 dark:text-slate-300"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {user ? (
              <>
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
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth">
                  <Button variant="ghost" className="text-slate-600 dark:text-slate-300">
                    LOG IN
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="bg-primary hover:bg-primary/90">
                    SIGN UP
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Navigation Items */}
              {Object.entries(navigationData).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <div className="font-medium text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                    {category}
                  </div>
                  <div className="pl-4 space-y-2">
                    {items.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <a 
                          className="block text-slate-600 dark:text-slate-300 hover:text-primary py-1"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Mobile Admin Link */}
              {user?.role === 'admin' && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Link href="/admin">
                    <a 
                      className="flex items-center text-red-500 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Panel
                    </a>
                  </Link>
                </div>
              )}

              {/* Mobile Auth Buttons */}
              {!user && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                  <Link href="/auth">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-slate-600 dark:text-slate-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      LOG IN
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      SIGN UP
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile User Menu */}
              {user && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                      <AvatarFallback>
                        {user?.firstName?.charAt(0) || "U"}{user?.lastName?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {user?.firstName || "Trader"}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}

              {/* Mobile Theme Toggle */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="w-full justify-start text-slate-600 dark:text-slate-300"
                >
                  {theme === "dark" ? <Sun className="mr-2 h-5 w-5" /> : <Moon className="mr-2 h-5 w-5" />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>
              </div>
            </div>
          </div>
        )}
        </div>
    </header>
  );
}