import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Award, 
  PlayCircle,
  BarChart3,
  DollarSign,
  Briefcase,
  GraduationCap,
  Target,
  Users,
  CheckCircle,
  ArrowRight,
  Globe,
  PieChart,
  Coins,
  Building,
  Shield,
  Zap,
  RefreshCw // Import RefreshCw for loading state
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from "@tanstack/react-query"; // Import useQuery for data fetching

interface LessonLevel {
  id: string;
  title: string;
  description: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  position: number;
  color: string;
}

// Dummy Navbar for the loading state, assuming it exists elsewhere
const Navbar = () => (
  <nav className="bg-white shadow-md p-4">
    <div className="container mx-auto">Navbar Placeholder</div>
  </nav>
);


export default function Commodities() {
  const { language, t } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [userProgress, setUserProgress] = useState(0);

  // Fetch real commodities data from API
  const { data: commodities = [], isLoading, error, refetch } = useQuery({
    queryKey: ['/api/metals/market-data'],
    queryFn: async () => {
      const response = await fetch('/api/metals/market-data');
      if (!response.ok) throw new Error('Failed to fetch commodities');
      return response.json();
    },
    refetchInterval: 30000,
    retry: 2
  });

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate user progress
    setUserProgress(25);
  }, []);

  const filteredCommodities = commodities.filter((commodity: any) =>
    (selectedCategory === "all" || commodity.category === selectedCategory) &&
    (commodity.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     commodity.symbol?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading commodities data...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-red-500">Error loading commodities data. Please try again later.</p>
          <Button onClick={() => refetch()} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Investment Academy
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Learn the fundamentals of investing, trading, and financial instruments. 
              Master portfolio management, securities, commodities, and financial markets.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <BookOpen className="w-5 h-5 mr-2" />
                68 Lessons
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Clock className="w-5 h-5 mr-2" />
                Self-Paced
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Award className="w-5 h-5 mr-2" />
                Certified
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Commodities Trading Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Trade Precious Metals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCommodities.map((commodity: any) => (
              <Card key={commodity.symbol} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{commodity.name}</span>
                    <Badge>{commodity.symbol}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      ${commodity.price?.toFixed(2) || 'N/A'}
                    </div>
                    <div className={`text-sm ${commodity.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {commodity.change24h >= 0 ? '+' : ''}{commodity.change24h?.toFixed(2)}%
                    </div>
                    <Button className="w-full mt-4" onClick={() => window.location.href = `/metals-trading?symbol=${commodity.symbol}`}>
                      Trade {commodity.symbol}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of learners who have mastered investing fundamentals, 
              trading strategies, and portfolio management through our comprehensive academy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-blue-600">
                <GraduationCap className="w-5 h-5 mr-2" />
                Start Learning
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}