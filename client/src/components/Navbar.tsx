import { useState } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User, Settings, LogOut, Menu, X,
  TrendingUp, Wallet, Bell, HelpCircle,
  Shield, Users, Database, BarChart3,
  Home, DollarSign, Coins, Award,
  Search, Newspaper, BookOpen, ChevronDown,
  CreditCard, Smartphone, Globe
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Bitpanda Style */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <img 
                  src="/src/assets/bitpanda-logo.svg" 
                  alt="BITPANDA PRO" 
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold text-foreground">BITPANDA PRO</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Bitpanda Pattern */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="space-x-6">
                {/* Invest Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-green-600 dark:hover:text-green-400 font-medium bg-transparent">
                    Invest
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[500px] lg:w-[600px] lg:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3">Cryptocurrencies</h4>
                        <NavigationMenuLink asChild>
                          <span className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer">
                            <Link to="/markets" className="w-full h-full flex items-center justify-center">
                              Markets
                            </Link>
                          </span>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <span className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer">
                            <Link to="/dual-markets" className="w-full h-full flex items-center justify-center">
                              Crypto Indices
                            </Link>
                          </span>
                        </NavigationMenuLink>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3">Traditional Assets</h4>
                        <NavigationMenuLink asChild>
                          <span className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer">
                            <Link to="/stocks" className="w-full h-full flex items-center justify-center">
                              Stocks
                            </Link>
                          </span>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <span className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer">
                            <Link to="/etfs" className="w-full h-full flex items-center justify-center">
                              ETFs
                            </Link>
                          </span>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Learn Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-green-600 dark:hover:text-green-400 font-medium bg-transparent">
                    Learn
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px]">
                      <NavigationMenuLink asChild>
                        <span className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer">
                          <Link to="/academy" className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-card-foreground">BITPANDA PRO Academy</div>
                              <div className="text-sm text-muted-foreground">Learn about crypto and investing</div>
                            </div>
                          </Link>
                        </span>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <span className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer">
                          <Link to="/news" className="w-full h-full flex items-center justify-center">
                            <Newspaper className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-card-foreground">Market News</div>
                              <div className="text-sm text-muted-foreground">Latest financial news and insights</div>
                            </div>
                          </Link>
                        </span>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <span className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer">
                          <Link to="/tutorials" className="w-full h-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-card-foreground">Getting Started</div>
                              <div className="text-sm text-muted-foreground">Step-by-step tutorials</div>
                            </div>
                          </Link>
                        </span>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Company Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-green-600 dark:hover:text-green-400 font-medium bg-transparent">
                    Company
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[350px]">
                      <NavigationMenuLink asChild>
                        <span className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer">
                          <Link to="/about-us" className="w-full h-full flex items-center justify-center">
                            <Home className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-card-foreground">About Us</div>
                              <div className="text-sm text-muted-foreground">Learn more about our mission and team</div>
                            </div>
                          </Link>
                        </span>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <span className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer">
                          <Link to="/careers" className="w-full h-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-card-foreground">Careers</div>
                              <div className="text-sm text-muted-foreground">Join our team and build the future</div>
                            </div>
                          </Link>
                        </span>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <span className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer">
                          <Link to="/press" className="w-full h-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-red-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-card-foreground">Press</div>
                              <div className="text-sm text-muted-foreground">Latest news and press releases</div>
                            </div>
                          </Link>
                        </span>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <span className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer">
                          <Link to="/help-center" className="w-full h-full flex items-center justify-center">
                            <HelpCircle className="w-5 h-5 text-purple-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-card-foreground">Help Center</div>
                              <div className="text-sm text-muted-foreground">Find answers to common questions</div>
                            </div>
                          </Link>
                        </span>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Simple Link */}
                <NavigationMenuItem>
                  <Link href="/precious-metals">
                    <NavigationMenuLink className="text-foreground hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium">
                      Metals
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/trading">
                    <NavigationMenuLink className="text-foreground hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium">
                      Trading
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-green-600 font-medium"
            >
              Log in
            </Button>
            <Button
              className="btn-3d bg-green-500 hover:bg-green-600 text-white font-semibold px-6"
            >
              Sign up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="px-4 pt-4 pb-6 space-y-6 bg-white">
            {/* Invest Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Invest</h3>
              <div className="space-y-3 pl-4">
                <Link href="/markets">
                  <div className="flex items-center space-x-3 py-2 text-gray-700 hover:text-green-600">
                    <TrendingUp className="w-5 h-5" />
                    <span>Cryptocurrencies</span>
                  </div>
                </Link>
                <Link href="/stocks">
                  <div className="flex items-center space-x-3 py-2 text-gray-700 hover:text-green-600">
                    <BarChart3 className="w-5 h-5" />
                    <span>Stocks</span>
                  </div>
                </Link>
                <Link href="/etfs">
                  <div className="flex items-center space-x-3 py-2 text-gray-700 hover:text-green-600">
                    <Database className="w-5 h-5" />
                    <span>ETFs</span>
                  </div>
                </Link>
                <Link href="/investment-plans">
                  <div className="flex items-center space-x-3 py-2 text-gray-700 hover:text-green-600">
                    <DollarSign className="w-5 h-5" />
                    <span>Investment Plans</span>
                  </div>
                </Link>
                <Link
                  to="/commodities"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Commodities
                </Link>
                <Link
                  to="/stocks"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Stocks
                </Link>
                <Link
                  to="/precious-metals"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Precious Metals
                </Link>
              </div>
            </div>

            {/* Learn Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Learn</h3>
              <div className="space-y-3 pl-4">
                <Link href="/academy">
                  <div className="flex items-center space-x-3 py-2 text-gray-700 hover:text-green-600">
                    <BookOpen className="w-5 h-5" />
                    <span>Academy</span>
                  </div>
                </Link>
                <Link href="/news">
                  <div className="flex items-center space-x-3 py-2 text-gray-700 hover:text-green-600">
                    <Newspaper className="w-5 h-5" />
                    <span>News</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Company Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Company</h3>
              <div className="space-y-3 pl-4">
                <Link href="/about">
                  <div className="flex items-center space-x-3 py-2 text-gray-700 hover:text-green-600">
                    <Home className="w-5 h-5" />
                    <span>About</span>
                  </div>
                </Link>
                <Link href="/careers">
                  <div className="flex items-center space-x-3 py-2 text-gray-700 hover:text-green-600">
                    <Users className="w-5 h-5" />
                    <span>Careers</span>
                  </div>
                </Link>
                <Link href="/security">
                  <div className="flex items-center space-x-3 py-2 text-gray-700 hover:text-green-600">
                    <Shield className="w-5 h-5" />
                    <span>Security</span>
                  </div>
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600"
                >
                  Log in
                </Button>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold">
                  Sign up
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}