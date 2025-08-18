import { useState } from "react";
import { Link, useLocation } from "wouter";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User, Settings, LogOut, Menu, X, 
  TrendingUp, Wallet, Bell, HelpCircle,
  Shield, Users, Database, BarChart3,
  Home, DollarSign, Coins, Award,
  Search, News, BookOpen
} from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-black">BITPANDA PRO</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-green-600">
                    Markets
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px]">
                      <Link href="/markets">
                        <NavigationMenuLink className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                          <TrendingUp className="w-5 h-5 text-green-500" />
                          <div>
                            <div className="font-medium">Crypto Markets</div>
                            <div className="text-sm text-gray-500">Live cryptocurrency prices</div>
                          </div>
                        </NavigationMenuLink>
                      </Link>
                      <Link href="/dual-markets">
                        <NavigationMenuLink className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                          <Coins className="w-5 h-5 text-yellow-500" />
                          <div>
                            <div className="font-medium">Dual Markets</div>
                            <div className="text-sm text-gray-500">Crypto & metals combined</div>
                          </div>
                        </NavigationMenuLink>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/deposits">
                    <NavigationMenuLink className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                      Deposits
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-green-600">
                    Company
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[300px]">
                      <Link href="/about">
                        <NavigationMenuLink className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                          <Home className="w-5 h-5 text-blue-500" />
                          <div>
                            <div className="font-medium">About Us</div>
                            <div className="text-sm text-gray-500">Learn about our mission</div>
                          </div>
                        </NavigationMenuLink>
                      </Link>
                      <Link href="/contact">
                        <NavigationMenuLink className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                          <HelpCircle className="w-5 h-5 text-purple-500" />
                          <div>
                            <div className="font-medium">Contact</div>
                            <div className="text-sm text-gray-500">Get in touch with us</div>
                          </div>
                        </NavigationMenuLink>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600"
            >
              Sign In
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-gray-200">
            <Link href="/markets">
              <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                <TrendingUp className="w-5 h-5" />
                <span>Markets</span>
              </div>
            </Link>
            <Link href="/dual-markets">
              <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                <Coins className="w-5 h-5" />
                <span>Dual Markets</span>
              </div>
            </Link>
            <Link href="/deposits">
              <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                <Wallet className="w-5 h-5" />
                <span>Deposits</span>
              </div>
            </Link>
            <Link href="/about">
              <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                <Home className="w-5 h-5" />
                <span>About</span>
              </div>
            </Link>
            <Link href="/contact">
              <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                <HelpCircle className="w-5 h-5" />
                <span>Contact</span>
              </div>
            </Link>
            
            <div className="pt-4 pb-2 border-t border-gray-200 mt-4">
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600"
                >
                  Sign In
                </Button>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}