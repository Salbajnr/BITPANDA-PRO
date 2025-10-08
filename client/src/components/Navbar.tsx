import { useState, useEffect } from "react";
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
  User, Menu, X,
  TrendingUp, Wallet, Bell, HelpCircle,
  Shield, Users, Database, BarChart3,
  Home, Coins, Award,
  Newspaper, BookOpen, ArrowUp
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-lg bg-background/98 backdrop-blur-xl' : 'shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 cursor-pointer">
              <img src="/src/assets/bitpanda-logo.svg" alt="BITPANDA PRO" className="w-8 h-8" />
              <span className="text-xl font-bold text-foreground">BITPANDA PRO</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList className="space-x-4">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-green-600 font-medium bg-transparent">
                    <TrendingUp className="w-4 h-4 mr-2" /> Invest
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[600px] lg:grid-cols-2">
                        <Link to="/markets" className="group block p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
                          <div className="font-medium text-foreground group-hover:text-green-600">Markets</div>
                          <div className="text-sm text-muted-foreground">Trade 600+ cryptocurrencies</div>
                        </Link>
                        <Link to="/crypto-indices" className="group block p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
                          <div className="font-medium text-foreground group-hover:text-green-600">Crypto Indices</div>
                          <div className="text-sm text-muted-foreground">Diversified crypto portfolios</div>
                        </Link>
                         <Link to="/dual-markets" className="group block p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
                          <div className="font-medium text-foreground group-hover:text-green-600">Dual Markets</div>
                          <div className="text-sm text-muted-foreground">High-yield investment products</div>
                        </Link>
                        <Link to="/stocks" className="group block p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <div className="font-medium text-foreground group-hover:text-blue-600">Stocks</div>
                          <div className="text-sm text-muted-foreground">Global stock markets</div>
                        </Link>
                        <Link to="/etfs" className="group block p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <div className="font-medium text-foreground group-hover:text-blue-600">ETFs</div>
                          <div className="text-sm text-muted-foreground">Exchange-traded funds</div>
                        </Link>
                        <Link to="/commodities" className="group block p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                          <div className="font-medium text-foreground group-hover:text-yellow-600">Commodities</div>
                          <div className="text-sm text-muted-foreground">Invest in raw materials</div>
                        </Link>
                        <Link to="/precious-metals" className="group block p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                          <div className="font-medium text-foreground group-hover:text-yellow-600">Precious Metals</div>
                          <div className="text-sm text-muted-foreground">Gold, Silver & more</div>
                        </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                 <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-green-600 font-medium bg-transparent">
                    Features
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[600px] lg:grid-cols-2">
                       <Link to="/advanced-trading" className="group block p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
                        <div className="font-medium text-foreground group-hover:text-green-600">Advanced Trading</div>
                        <div className="text-sm text-muted-foreground">Pro tools for expert traders</div>
                      </Link>
                      <Link to="/investment-plans" className="group block p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
                        <div className="font-medium text-foreground group-hover:text-green-600">Investment Plans</div>
                        <div className="text-sm text-muted-foreground">Automate your investments</div>
                      </Link>
                       <Link to="/savings-plans" className="group block p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
                        <div className="font-medium text-foreground group-hover:text-green-600">Savings Plans</div>
                        <div className="text-sm text-muted-foreground">Build wealth over time</div>
                      </Link>
                      <Link to="/risk-management" className="group block p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
                        <div className="font-medium text-foreground group-hover:text-green-600">Risk Management</div>
                        <div className="text-sm text-muted-foreground">Tools to protect your portfolio</div>
                      </Link>
                       <Link to="/portfolio-analytics" className="group block p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <div className="font-medium text-foreground group-hover:text-blue-600">Portfolio Analytics</div>
                        <div className="text-sm text-muted-foreground">In-depth portfolio insights</div>
                      </Link>
                      <Link to="/tax-reporting" className="group block p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <div className="font-medium text-foreground group-hover:text-blue-600">Tax Reporting</div>
                        <div className="text-sm text-muted-foreground">Simplify your tax returns</div>
                      </Link>
                       <Link to="/alerts" className="group block p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <div className="font-medium text-foreground group-hover:text-blue-600">Price Alerts</div>
                        <div className="text-sm text-muted-foreground">Never miss a market move</div>
                      </Link>
                       <Link to="/notifications" className="group block p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <div className="font-medium text-foreground group-hover:text-blue-600">Notifications</div>
                        <div className="text-sm text-muted-foreground">Stay up-to-date</div>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-green-600 font-medium bg-transparent">
                    <BookOpen className="w-4 h-4 mr-2" /> Learn
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-2 p-6 w-[400px]">
                      <Link to="/academy" className="group block p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
                          <div className="font-medium text-foreground group-hover:text-green-600">Academy</div>
                          <div className="text-sm text-muted-foreground">Learn crypto and investing basics</div>
                      </Link>
                      <Link to="/news" className="group block p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <div className="font-medium text-foreground group-hover:text-blue-600">Market News</div>
                          <div className="text-sm text-muted-foreground">Latest financial insights</div>
                      </Link>
                      <Link to="/tutorials" className="group block p-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
                          <div className="font-medium text-foreground group-hover:text-purple-600">Getting Started</div>
                          <div className="text-sm text-muted-foreground">Step-by-step guides</div>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-green-600 font-medium bg-transparent">
                    Company
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[350px]">
                       <Link to="/about-us" className="group block p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <div className="font-medium text-foreground group-hover:text-blue-600">About Us</div>
                        <div className="text-sm text-muted-foreground">Our mission & team</div>
                      </Link>
                      <Link to="/careers" className="group block p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
                        <div className="font-medium text-foreground group-hover:text-green-600">Careers</div>
                        <div className="text-sm text-muted-foreground">Join our growing team</div>
                      </Link>
                      <Link to="/press" className="group block p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                        <div className="font-medium text-foreground group-hover:text-red-600">Press</div>
                        <div className="text-sm text-muted-foreground">News and media resources</div>
                      </Link>
                      <Link to="/contact" className="group block p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
                        <div className="font-medium text-foreground group-hover:text-purple-600">Contact</div>
                        <div className="text-sm text-muted-foreground">Get in touch with us</div>
                      </Link>
                      <Link to="/imprint" className="group block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/20">
                        <div className="font-medium text-foreground group-hover:text-gray-600">Imprint</div>
                        <div className="text-sm text-muted-foreground">Legal information</div>
                      </Link>
                      <Link to="/privacy" className="group block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/20">
                        <div className="font-medium text-foreground group-hover:text-gray-600">Privacy Policy</div>
                        <div className="text-sm text-muted-foreground">How we handle your data</div>
                      </Link>
                       <Link to="/terms" className="group block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/20">
                        <div className="font-medium text-foreground group-hover:text-gray-600">Terms of Service</div>
                        <div className="text-sm text-muted-foreground">Our terms and conditions</div>
                      </Link>
                      <Link to="/user-agreement" className="group block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/20">
                        <div className="font-medium text-foreground group-hover:text-gray-600">User Agreement</div>
                        <div className="text-sm text-muted-foreground">Your rights and obligations</div>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                 <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-green-600 font-medium bg-transparent">
                    Developers
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px]">
                       <Link to="/api-management" className="group block p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                        <div className="font-medium text-foreground group-hover:text-indigo-600">API Management</div>
                        <div className="text-sm text-muted-foreground">Manage your API keys</div>
                      </Link>
                      <Link to="/api-docs" className="group block p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                        <div className="font-medium text-foreground group-hover:text-indigo-600">API Documentation</div>
                        <div className="text-sm text-muted-foreground">Integrate with our services</div>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            <ThemeToggle />
            <Link href="/help-center">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-blue-600 font-medium">
                <HelpCircle className="w-4 h-4 mr-2" /> Help
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-green-600 font-medium">
                Log in
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-6 shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="lg:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-4 pb-6 space-y-6 bg-background/98 backdrop-blur-xl">
            {/* Mobile Nav Items */}
            <div className="pt-6 border-t border-border">
              <div className="space-y-3">
                <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full"> Log in </Button>
                </Link>
                <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
          size="sm"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </nav>
  );
}
