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

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Bitpanda Style */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">BITPANDA PRO</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Bitpanda Pattern */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="space-x-6">
                {/* Invest Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-green-600 font-medium bg-transparent">
                    Invest
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[500px] lg:w-[600px] lg:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Cryptocurrencies</h4>
                        <NavigationMenuLink asChild>
                          <Link href="/markets" className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                            <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-900">Crypto Trading</div>
                              <div className="text-sm text-gray-500">Trade Bitcoin, Ethereum and 350+ cryptocurrencies</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="/dual-markets" className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                            <Coins className="w-5 h-5 text-yellow-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-900">Crypto Indices</div>
                              <div className="text-sm text-gray-500">Diversified crypto portfolios</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Traditional Assets</h4>
                        <NavigationMenuLink asChild>
                          <Link href="/stocks" className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                            <BarChart3 className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-900">Stocks</div>
                              <div className="text-sm text-gray-500">Invest in fractional shares</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => navigate('/etfs')}>
                          <BarChart3 className="w-5 h-5 text-purple-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">ETFs</div>
                            <div className="text-sm text-gray-500">Exchange-traded funds</div>
                          </div>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Learn Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-green-600 font-medium bg-transparent">
                    Learn
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px]">
                      <NavigationMenuLink asChild>
                        <Link href="/academy" className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                          <BookOpen className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">BITPANDA PRO Academy</div>
                            <div className="text-sm text-gray-500">Learn about crypto and investing</div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/news" className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                          <Newspaper className="w-5 h-5 text-blue-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Market News</div>
                            <div className="text-sm text-gray-500">Latest financial news and insights</div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/tutorials" className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                          <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Getting Started</div>
                            <div className="text-sm text-gray-500">Step-by-step tutorials</div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Company Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-green-600 font-medium bg-transparent">
                    Company
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[350px]">
                      <NavigationMenuLink asChild>
                        <Link href="/about" className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                          <Home className="w-5 h-5 text-blue-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">About BITPANDA PRO</div>
                            <div className="text-sm text-gray-500">Our mission and values</div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/careers" className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                          <Users className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Careers</div>
                            <div className="text-sm text-gray-500">Join our team</div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/security" className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                          <Shield className="w-5 h-5 text-red-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Security</div>
                            <div className="text-sm text-gray-500">Your assets are safe</div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/help" className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                          <HelpCircle className="w-5 h-5 text-purple-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Help Centre</div>
                            <div className="text-sm text-gray-500">Support and FAQ</div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Simple Link */}
                <NavigationMenuItem>
                  <Link href="/deposits">
                    <NavigationMenuLink className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                      Pro
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/investment-plans" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                      Investment Plans
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              Log in
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6"
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