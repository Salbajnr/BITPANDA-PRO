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
  CreditCard, Smartphone, Globe, ArrowUp
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll events for navbar styling and back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 20);
      setShowBackToTop(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'shadow-lg bg-background/98 backdrop-blur-xl' 
        : 'shadow-sm'
    }`}>
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

          {/* Desktop Navigation - Improved UX */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList className="space-x-4">
                {/* Invest Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-green-600 dark:hover:text-green-400 font-medium bg-transparent transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Invest
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[500px] lg:w-[600px] lg:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                          <Coins className="w-4 h-4 mr-2 text-green-600" />
                          Cryptocurrencies
                        </h4>
                        <div className="space-y-2">
                          <Link to="/markets" className="group block p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200">
                            <div className="font-medium text-foreground group-hover:text-green-600">Markets</div>
                            <div className="text-sm text-muted-foreground">Trade 600+ cryptocurrencies</div>
                          </Link>
                          <Link to="/dual-markets" className="group block p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200">
                            <div className="font-medium text-foreground group-hover:text-green-600">Crypto Indices</div>
                            <div className="text-sm text-muted-foreground">Diversified crypto portfolios</div>
                          </Link>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                          <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
                          Traditional Assets
                        </h4>
                        <div className="space-y-2">
                          <Link to="/stocks" className="group block p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                            <div className="font-medium text-foreground group-hover:text-blue-600">Stocks</div>
                            <div className="text-sm text-muted-foreground">Global stock markets</div>
                          </Link>
                          <Link to="/etfs" className="group block p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                            <div className="font-medium text-foreground group-hover:text-blue-600">ETFs</div>
                            <div className="text-sm text-muted-foreground">Exchange-traded funds</div>
                          </Link>
                          <Link to="/precious-metals" className="group block p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200">
                            <div className="font-medium text-foreground group-hover:text-yellow-600">Precious Metals</div>
                            <div className="text-sm text-muted-foreground">Gold, Silver & more</div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Learn Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-green-600 dark:hover:text-green-400 font-medium bg-transparent transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Learn
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-2 p-6 w-[400px]">
                      <Link to="/academy" className="group block p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200">
                        <div className="flex items-start space-x-3">
                          <BookOpen className="w-5 h-5 text-green-500 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                          <div>
                            <div className="font-medium text-foreground group-hover:text-green-600">Academy</div>
                            <div className="text-sm text-muted-foreground">Learn crypto and investing basics</div>
                          </div>
                        </div>
                      </Link>
                      <Link to="/news" className="group block p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                        <div className="flex items-start space-x-3">
                          <Newspaper className="w-5 h-5 text-blue-500 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                          <div>
                            <div className="font-medium text-foreground group-hover:text-blue-600">Market News</div>
                            <div className="text-sm text-muted-foreground">Latest financial insights</div>
                          </div>
                        </div>
                      </Link>
                      <Link to="/tutorials" className="group block p-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200">
                        <div className="flex items-start space-x-3">
                          <Users className="w-5 h-5 text-purple-500 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                          <div>
                            <div className="font-medium text-foreground group-hover:text-purple-600">Getting Started</div>
                            <div className="text-sm text-muted-foreground">Step-by-step guides</div>
                          </div>
                        </div>
                      </Link>
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

                {/* Quick Links */}
                <NavigationMenuItem>
                  <Link href="/trading">
                    <NavigationMenuLink className="text-foreground hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Trading
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/dashboard">
                    <NavigationMenuLink className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center">
                      <Wallet className="w-4 h-4 mr-2" />
                      Portfolio
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <ThemeToggle />
            <Link href="/help-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-blue-600 font-medium transition-all duration-200"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-green-600 font-medium transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                Log in
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </Button>
            </Link>
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
        <div className="lg:hidden border-t border-border animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-4 pb-6 space-y-6 bg-background/98 backdrop-blur-xl">
            {/* Invest Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Invest
              </h3>
              <div className="space-y-2 pl-4">
                <Link href="/markets" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-3 py-3 px-3 text-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200">
                    <Coins className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Cryptocurrencies</div>
                      <div className="text-sm text-muted-foreground">600+ digital assets</div>
                    </div>
                  </div>
                </Link>
                <Link href="/stocks" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-3 py-3 px-3 text-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200">
                    <BarChart3 className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Stocks</div>
                      <div className="text-sm text-muted-foreground">Global markets</div>
                    </div>
                  </div>
                </Link>
                <Link href="/etfs" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-3 py-3 px-3 text-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200">
                    <Database className="w-5 h-5" />
                    <div>
                      <div className="font-medium">ETFs</div>
                      <div className="text-sm text-muted-foreground">Exchange-traded funds</div>
                    </div>
                  </div>
                </Link>
                <Link href="/precious-metals" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-3 py-3 px-3 text-foreground hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-all duration-200">
                    <Award className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Precious Metals</div>
                      <div className="text-sm text-muted-foreground">Gold, Silver & more</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Learn Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                Learn
              </h3>
              <div className="space-y-2 pl-4">
                <Link href="/academy" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-3 py-3 px-3 text-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200">
                    <BookOpen className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Academy</div>
                      <div className="text-sm text-muted-foreground">Crypto & investing basics</div>
                    </div>
                  </div>
                </Link>
                <Link href="/news" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-3 py-3 px-3 text-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200">
                    <Newspaper className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Market News</div>
                      <div className="text-sm text-muted-foreground">Latest insights</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Company Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                <Home className="w-5 h-5 mr-2 text-purple-600" />
                Company
              </h3>
              <div className="space-y-2 pl-4">
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-3 py-3 px-3 text-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200">
                    <Home className="w-5 h-5" />
                    <div>
                      <div className="font-medium">About Us</div>
                      <div className="text-sm text-muted-foreground">Our mission & team</div>
                    </div>
                  </div>
                </Link>
                <Link href="/careers" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-3 py-3 px-3 text-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200">
                    <Users className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Careers</div>
                      <div className="text-sm text-muted-foreground">Join our team</div>
                    </div>
                  </div>
                </Link>
                <Link href="/help-center" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-3 py-3 px-3 text-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200">
                    <HelpCircle className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Help Center</div>
                      <div className="text-sm text-muted-foreground">Get support</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <div className="space-y-3">
                <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-border hover:border-green-500 hover:text-green-600 transition-all duration-200"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg transition-all duration-200">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-in slide-in-from-bottom-2"
          size="sm"
          data-testid="button-back-to-top"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </nav>
  );
}