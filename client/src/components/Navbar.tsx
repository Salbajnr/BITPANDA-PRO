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
  CreditCard, Smartphone, Globe, ArrowUp, Target
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
    <nav className={`bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'shadow-lg'
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
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">BITPANDAPRO</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Professional Menubar */}
          <div className="hidden lg:flex items-center space-x-1">
            <Menubar className="border-none bg-transparent shadow-none space-x-1">
              {/* Invest Menu */}
              <MenubarMenu>
                <MenubarTrigger className="group text-foreground hover:text-green-600 dark:hover:text-green-400 font-medium bg-transparent transition-all duration-300 px-4 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 data-[state=open]:bg-green-50 dark:data-[state=open]:bg-green-900/20 focus:bg-green-50 dark:focus:bg-green-900/20 cursor-pointer flex items-center gap-2 border-none text-sm">
                  <TrendingUp className="w-4 h-4" />
                  Invest
                  <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </MenubarTrigger>
                <MenubarContent className="w-[620px] p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 shadow-2xl rounded-2xl animate-in slide-in-from-top-2 duration-200 mt-2">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Digital Assets
                      </div>
                      <MenubarItem className="p-0">
                        <button
                          onClick={() => navigate('/markets')}
                          className="w-full text-left group flex items-start gap-4 p-4 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 border border-transparent hover:border-green-200 dark:hover:border-green-800"
                        >
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Coins className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">Cryptocurrencies</div>
                            <div className="text-xs text-muted-foreground mt-1">Trade 600+ digital currencies</div>
                          </div>
                        </button>
                      </MenubarItem>
                      <MenubarItem className="p-0">
                        <button
                          onClick={() => navigate('/dual-markets')}
                          className="w-full text-left group flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                        >
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Target className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">Crypto Indices</div>
                            <div className="text-xs text-muted-foreground mt-1">Diversified crypto portfolios</div>
                          </div>
                        </button>
                      </MenubarItem>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Traditional Assets
                      </div>
                      <MenubarItem className="p-0">
                        <button
                          onClick={() => navigate('/stocks')}
                          className="w-full text-left group flex items-start gap-4 p-4 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
                        >
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <BarChart3 className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">Stocks</div>
                            <div className="text-xs text-muted-foreground mt-1">Global stock markets</div>
                          </div>
                        </button>
                      </MenubarItem>
                      <MenubarItem className="p-0">
                        <button
                          onClick={() => navigate('/etfs')}
                          className="w-full text-left group flex items-start gap-4 p-4 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                        >
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Database className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">ETFs</div>
                            <div className="text-xs text-muted-foreground mt-1">Exchange-traded funds</div>
                          </div>
                        </button>
                      </MenubarItem>
                      <MenubarItem className="p-0">
                        <button
                          onClick={() => navigate('/precious-metals')}
                          className="w-full text-left group flex items-start gap-4 p-4 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200 border border-transparent hover:border-yellow-200 dark:hover:border-yellow-800"
                        >
                          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Award className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">Precious Metals</div>
                            <div className="text-xs text-muted-foreground mt-1">Gold, Silver & more</div>
                          </div>
                        </button>
                      </MenubarItem>
                    </div>
                  </div>
                </MenubarContent>
              </MenubarMenu>

              {/* Learn Menu */}
              <MenubarMenu>
                <MenubarTrigger className="group text-foreground hover:text-green-600 dark:hover:text-green-400 font-medium bg-transparent transition-all duration-300 px-4 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 data-[state=open]:bg-green-50 dark:data-[state=open]:bg-green-900/20 focus:bg-green-50 dark:focus:bg-green-900/20 cursor-pointer flex items-center gap-2 border-none text-sm">
                  <BookOpen className="w-4 h-4" />
                  Learn
                  <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </MenubarTrigger>
                <MenubarContent className="w-[420px] p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 shadow-2xl rounded-2xl animate-in slide-in-from-top-2 duration-200 mt-2">
                  <div className="space-y-3">
                    <MenubarItem
                      className="p-0 cursor-pointer"
                      onClick={() => navigate('/academy')}
                    >
                      <div className="w-full flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 border border-transparent hover:border-green-200 dark:hover:border-green-800 group">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <BookOpen className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Academy</div>
                          <div className="text-xs text-muted-foreground mt-1">Learn crypto and investing basics</div>
                        </div>
                      </div>
                    </MenubarItem>
                    <MenubarItem
                      className="p-0 cursor-pointer"
                      onClick={() => navigate('/news')}
                    >
                      <div className="w-full flex items-start gap-3 p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 group">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Newspaper className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Market News</div>
                          <div className="text-xs text-muted-foreground mt-1">Latest financial insights</div>
                        </div>
                      </div>
                    </MenubarItem>
                    <MenubarItem
                      className="p-0 cursor-pointer"
                      onClick={() => navigate('/tutorials')}
                    >
                      <div className="w-full flex items-start gap-3 p-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 border border-transparent hover:border-purple-200 dark:hover:border-purple-800 group">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Users className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Getting Started</div>
                          <div className="text-xs text-muted-foreground mt-1">Step-by-step guides</div>
                        </div>
                      </div>
                    </MenubarItem>
                  </div>
                </MenubarContent>
              </MenubarMenu>

              {/* Company Menu */}
              <MenubarMenu>
                <MenubarTrigger className="group text-foreground hover:text-green-600 dark:hover:text-green-400 font-medium bg-transparent transition-all duration-300 px-4 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 data-[state=open]:bg-green-50 dark:data-[state=open]:bg-green-900/20 focus:bg-green-50 dark:focus:bg-green-900/20 cursor-pointer flex items-center gap-2 border-none text-sm">
                  Company
                  <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </MenubarTrigger>
                <MenubarContent className="w-[380px] p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 shadow-2xl rounded-2xl animate-in slide-in-from-top-2 duration-200 mt-2">
                  <div className="space-y-3">
                    <MenubarItem
                      className="p-0 cursor-pointer"
                      onClick={() => navigate('/about-us')}
                    >
                      <div className="w-full flex items-start gap-3 p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 group">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Home className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">About Us</div>
                          <div className="text-xs text-muted-foreground mt-1">Learn more about our mission and team</div>
                        </div>
                      </div>
                    </MenubarItem>
                    <MenubarItem
                      className="p-0 cursor-pointer"
                      onClick={() => navigate('/careers')}
                    >
                      <div className="w-full flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 border border-transparent hover:border-green-200 dark:hover:border-green-800 group">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Users className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Careers</div>
                          <div className="text-xs text-muted-foreground mt-1">Join our team and build the future</div>
                        </div>
                      </div>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem
                      className="p-0 cursor-pointer"
                      onClick={() => navigate('/press')}
                    >
                      <div className="w-full flex items-start gap-3 p-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 border border-transparent hover:border-red-200 dark:hover:border-red-800 group">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Shield className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Press</div>
                          <div className="text-xs text-muted-foreground mt-1">Latest news and press releases</div>
                        </div>
                      </div>
                    </MenubarItem>
                    <MenubarItem
                      className="p-0 cursor-pointer"
                      onClick={() => navigate('/help-center')}
                    >
                      <div className="w-full flex items-start gap-3 p-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 border border-transparent hover:border-purple-200 dark:hover:border-purple-800 group">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <HelpCircle className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Help Center</div>
                          <div className="text-xs text-muted-foreground mt-1">Find answers to common questions</div>
                        </div>
                      </div>
                    </MenubarItem>
                  </div>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>

            {/* Quick Action Links */}
            <div className="flex items-center space-x-2 ml-4">
              <Link to="/trading">
                <Button variant="ghost" size="sm" className="text-foreground hover:text-green-600 dark:hover:text-green-400 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Trading
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2">
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
                className="text-foreground hover:text-blue-600 font-medium transition-all duration-200 px-4 py-2.5 rounded-xl"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-green-600 font-medium transition-all duration-200 px-4 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                Log in
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 rounded-xl"
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
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => {
                    navigate('/trading');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium transition-all duration-200 hover:from-green-600 hover:to-green-700 active:scale-95"
                >
                  <BarChart3 className="w-4 h-4" />
                  Trade Now
                </button>
                <button
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 text-blue-700 rounded-xl font-medium transition-all duration-200 hover:bg-blue-100 active:scale-95 border border-blue-200"
                >
                  <Wallet className="w-4 h-4" />
                  Portfolio
                </button>
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