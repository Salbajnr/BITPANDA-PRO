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
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ScrollArea } from "@/components/ui/scroll-area";
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

          {/* Desktop Navigation - Enhanced Menubar */}
          <div className="hidden lg:flex items-center space-x-2">
            <Menubar className="border-none bg-transparent shadow-none space-x-1">
              {/* Invest Menu */}
              <MenubarMenu>
                <MenubarTrigger className="text-foreground hover:text-green-600 dark:hover:text-green-400 font-medium bg-transparent transition-all duration-300 px-4 py-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 data-[state=open]:bg-green-50 dark:data-[state=open]:bg-green-900/20 focus:bg-green-50 dark:focus:bg-green-900/20 cursor-pointer flex items-center gap-2 border-none">
                  <TrendingUp className="w-4 h-4" />
                  Invest
                  <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </MenubarTrigger>
                <MenubarContent className="w-[580px] p-4 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl animate-in slide-in-from-top-2 duration-200">
                  <ScrollArea className="h-auto max-h-[400px]">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground">
                          <Coins className="w-4 h-4 text-green-600" />
                          Cryptocurrencies
                        </div>
                        <MenubarItem className="p-0 cursor-pointer">
                          <Link to="/markets" className="w-full block p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200">
                            <div className="font-medium text-foreground">Markets</div>
                            <div className="text-xs text-muted-foreground">Trade 600+ cryptocurrencies</div>
                          </Link>
                        </MenubarItem>
                        <MenubarItem className="p-0 cursor-pointer">
                          <Link to="/dual-markets" className="w-full block p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200">
                            <div className="font-medium text-foreground">Crypto Indices</div>
                            <div className="text-xs text-muted-foreground">Diversified crypto portfolios</div>
                          </Link>
                        </MenubarItem>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground">
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                          Traditional Assets
                        </div>
                        <MenubarItem className="p-0 cursor-pointer">
                          <Link to="/stocks" className="w-full block p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                            <div className="font-medium text-foreground">Stocks</div>
                            <div className="text-xs text-muted-foreground">Global stock markets</div>
                          </Link>
                        </MenubarItem>
                        <MenubarItem className="p-0 cursor-pointer">
                          <Link to="/etfs" className="w-full block p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                            <div className="font-medium text-foreground">ETFs</div>
                            <div className="text-xs text-muted-foreground">Exchange-traded funds</div>
                          </Link>
                        </MenubarItem>
                        <MenubarItem className="p-0 cursor-pointer">
                          <Link to="/precious-metals" className="w-full block p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200">
                            <div className="font-medium text-foreground">Precious Metals</div>
                            <div className="text-xs text-muted-foreground">Gold, Silver & more</div>
                          </Link>
                        </MenubarItem>
                      </div>
                    </div>
                  </ScrollArea>
                </MenubarContent>
              </MenubarMenu>

              {/* Learn Menu */}
              <MenubarMenu>
                <MenubarTrigger className="text-foreground hover:text-green-600 dark:hover:text-green-400 font-medium bg-transparent transition-all duration-300 px-4 py-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 data-[state=open]:bg-green-50 dark:data-[state=open]:bg-green-900/20 focus:bg-green-50 dark:focus:bg-green-900/20 cursor-pointer flex items-center gap-2 border-none">
                  <BookOpen className="w-4 h-4" />
                  Learn
                  <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </MenubarTrigger>
                <MenubarContent className="w-[420px] p-4 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1">
                    <MenubarItem className="p-0 cursor-pointer">
                      <Link to="/academy" className="w-full flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200">
                        <BookOpen className="w-5 h-5 text-green-500 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                        <div>
                          <div className="font-medium text-foreground">Academy</div>
                          <div className="text-xs text-muted-foreground">Learn crypto and investing basics</div>
                        </div>
                      </Link>
                    </MenubarItem>
                    <MenubarItem className="p-0 cursor-pointer">
                      <Link to="/news" className="w-full flex items-start gap-3 p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                        <Newspaper className="w-5 h-5 text-blue-500 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                        <div>
                          <div className="font-medium text-foreground">Market News</div>
                          <div className="text-xs text-muted-foreground">Latest financial insights</div>
                        </div>
                      </Link>
                    </MenubarItem>
                    <MenubarItem className="p-0 cursor-pointer">
                      <Link to="/tutorials" className="w-full flex items-start gap-3 p-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200">
                        <Users className="w-5 h-5 text-purple-500 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                        <div>
                          <div className="font-medium text-foreground">Getting Started</div>
                          <div className="text-xs text-muted-foreground">Step-by-step guides</div>
                        </div>
                      </Link>
                    </MenubarItem>
                  </div>
                </MenubarContent>
              </MenubarMenu>

              {/* Company Menu */}
              <MenubarMenu>
                <MenubarTrigger className="text-foreground hover:text-green-600 dark:hover:text-green-400 font-medium bg-transparent transition-all duration-300 px-4 py-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 data-[state=open]:bg-green-50 dark:data-[state=open]:bg-green-900/20 focus:bg-green-50 dark:focus:bg-green-900/20 cursor-pointer flex items-center gap-2 border-none">
                  Company
                  <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </MenubarTrigger>
                <MenubarContent className="w-[380px] p-4 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1">
                    <MenubarItem className="p-0 cursor-pointer">
                      <Link to="/about-us" className="w-full flex items-start gap-3 p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                        <Home className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-foreground">About Us</div>
                          <div className="text-xs text-muted-foreground">Learn more about our mission and team</div>
                        </div>
                      </Link>
                    </MenubarItem>
                    <MenubarItem className="p-0 cursor-pointer">
                      <Link to="/careers" className="w-full flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200">
                        <Users className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-foreground">Careers</div>
                          <div className="text-xs text-muted-foreground">Join our team and build the future</div>
                        </div>
                      </Link>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem className="p-0 cursor-pointer">
                      <Link to="/press" className="w-full flex items-start gap-3 p-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200">
                        <Shield className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-foreground">Press</div>
                          <div className="text-xs text-muted-foreground">Latest news and press releases</div>
                        </div>
                      </Link>
                    </MenubarItem>
                    <MenubarItem className="p-0 cursor-pointer">
                      <Link to="/help-center" className="w-full flex items-start gap-3 p-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200">
                        <HelpCircle className="w-5 h-5 text-purple-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-foreground">Help Center</div>
                          <div className="text-xs text-muted-foreground">Find answers to common questions</div>
                        </div>
                      </Link>
                    </MenubarItem>
                  </div>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>

            {/* Quick Action Links */}
            <div className="flex items-center space-x-2 ml-4">
              <Link to="/trading">
                <Button variant="ghost" size="sm" className="text-foreground hover:text-green-600 dark:hover:text-green-400 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Trading
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Portfolio
                </Button>
              </Link>
            </div>
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
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative w-10 h-10 rounded-xl transition-all duration-300 hover:bg-accent"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <Menu 
                  className={`h-5 w-5 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`}
                />
                <X 
                  className={`h-5 w-5 absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`}
                />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border/30 animate-in slide-in-from-top-2 duration-300 ease-out">
          <ScrollArea className="h-[calc(100vh-4rem)] w-full">
            <div className="px-4 pt-4 pb-6 space-y-6 bg-background/98 backdrop-blur-xl">
              {/* Quick Actions Bar */}
              <div className="flex items-center gap-2 mb-4">
                <Link to="/trading" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 rounded-xl">
                    <BarChart3 className="w-4 h-4" />
                    Trading
                  </Button>
                </Link>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 rounded-xl">
                    <Wallet className="w-4 h-4" />
                    Portfolio
                  </Button>
                </Link>
              </div>

              {/* Collapsible Invest Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    Invest
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/markets" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-900/20 border border-green-200/50 dark:border-green-800/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <Coins className="w-6 h-6 text-green-600 mb-2" />
                      <div className="font-medium text-sm">Crypto</div>
                      <div className="text-xs text-muted-foreground">600+ assets</div>
                    </div>
                  </Link>
                  <Link to="/stocks" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <BarChart3 className="w-6 h-6 text-blue-600 mb-2" />
                      <div className="font-medium text-sm">Stocks</div>
                      <div className="text-xs text-muted-foreground">Global markets</div>
                    </div>
                  </Link>
                  <Link to="/etfs" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-900/20 border border-purple-200/50 dark:border-purple-800/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <Database className="w-6 h-6 text-purple-600 mb-2" />
                      <div className="font-medium text-sm">ETFs</div>
                      <div className="text-xs text-muted-foreground">Funds</div>
                    </div>
                  </Link>
                  <Link to="/precious-metals" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/10 dark:to-yellow-900/20 border border-yellow-200/50 dark:border-yellow-800/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <Award className="w-6 h-6 text-yellow-600 mb-2" />
                      <div className="font-medium text-sm">Metals</div>
                      <div className="text-xs text-muted-foreground">Gold & Silver</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Learn Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  Learn
                </h3>
                <div className="space-y-2">
                  <Link to="/academy" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-card hover:bg-accent transition-all duration-300 border border-border/50">
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Academy</div>
                        <div className="text-sm text-muted-foreground">Crypto & investing basics</div>
                      </div>
                    </div>
                  </Link>
                  <Link to="/news" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-card hover:bg-accent transition-all duration-300 border border-border/50">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <Newspaper className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Market News</div>
                        <div className="text-sm text-muted-foreground">Latest insights</div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Company Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Home className="w-4 h-4 text-purple-600" />
                  </div>
                  Company
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card hover:bg-accent transition-all duration-300 border border-border/50">
                      <Home className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-sm">About Us</div>
                        <div className="text-xs text-muted-foreground">Our mission & team</div>
                      </div>
                    </div>
                  </Link>
                  <Link to="/careers" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card hover:bg-accent transition-all duration-300 border border-border/50">
                      <Users className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-sm">Careers</div>
                        <div className="text-xs text-muted-foreground">Join our team</div>
                      </div>
                    </div>
                  </Link>
                  <Link to="/help-center" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card hover:bg-accent transition-all duration-300 border border-border/50">
                      <HelpCircle className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-medium text-sm">Help Center</div>
                        <div className="text-xs text-muted-foreground">Get support</div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* CTA Section */}
              <div className="pt-6 border-t border-border/30 space-y-3">
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-border hover:border-green-500 hover:text-green-600 transition-all duration-300 h-12"
                  >
                    Log in
                  </Button>
                </Link>
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl h-12 transform hover:scale-105">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollArea>
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