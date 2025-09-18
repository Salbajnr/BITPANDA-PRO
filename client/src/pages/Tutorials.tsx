
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Play, Clock, User, Star, BookOpen, TrendingUp, Shield, Wallet } from 'lucide-react';

const Tutorials = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Tutorials', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'beginner', name: 'Beginner', icon: <User className="h-4 w-4" /> },
    { id: 'trading', name: 'Trading', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'security', name: 'Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'wallet', name: 'Wallet', icon: <Wallet className="h-4 w-4" /> }
  ];

  const tutorials = [
    {
      id: 1,
      title: "Getting Started with BITPANDA PRO",
      description: "Complete guide to setting up your account and making your first trade",
      duration: "12 min",
      difficulty: "Beginner",
      category: "beginner",
      rating: 4.8,
      thumbnail: "/api/placeholder/300/200",
      isNew: true
    },
    {
      id: 2,
      title: "Understanding Technical Analysis",
      description: "Learn how to read charts and identify trading opportunities",
      duration: "25 min",
      difficulty: "Intermediate",
      category: "trading",
      rating: 4.9,
      thumbnail: "/api/placeholder/300/200",
      isNew: false
    },
    {
      id: 3,
      title: "Setting Up Two-Factor Authentication",
      description: "Secure your account with 2FA and other security measures",
      duration: "8 min",
      difficulty: "Beginner",
      category: "security",
      rating: 4.7,
      thumbnail: "/api/placeholder/300/200",
      isNew: false
    },
    {
      id: 4,
      title: "Advanced Order Types",
      description: "Master stop-loss, take-profit, and advanced trading orders",
      duration: "18 min",
      difficulty: "Advanced",
      category: "trading",
      rating: 4.6,
      thumbnail: "/api/placeholder/300/200",
      isNew: true
    },
    {
      id: 5,
      title: "Crypto Wallet Management",
      description: "How to manage your cryptocurrency wallets safely",
      duration: "15 min",
      difficulty: "Intermediate",
      category: "wallet",
      rating: 4.8,
      thumbnail: "/api/placeholder/300/200",
      isNew: false
    },
    {
      id: 6,
      title: "Risk Management Strategies",
      description: "Protect your investments with proper risk management",
      duration: "22 min",
      difficulty: "Intermediate",
      category: "trading",
      rating: 4.9,
      thumbnail: "/api/placeholder/300/200",
      isNew: false
    }
  ];

  const filteredTutorials = selectedCategory === 'all' 
    ? tutorials 
    : tutorials.filter(tutorial => tutorial.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-green-100 text-green-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BITPANDA PRO Tutorials
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Master trading with our comprehensive video tutorials and guides
          </p>
        </div>

        {/* Featured Tutorial */}
        <Card className="mb-8 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="relative h-64 md:h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Play className="h-16 w-16 text-white" />
                <Badge className="absolute top-4 left-4 bg-red-500">Featured</Badge>
              </div>
            </div>
            <div className="md:w-1/2 p-6">
              <h2 className="text-2xl font-bold mb-4">Complete Trading Masterclass</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                A comprehensive course covering everything from basic concepts to advanced trading strategies. 
                Perfect for traders at any level looking to improve their skills.
              </p>
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  2.5 hours
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-green-500" />
                  4.9 (1,234 reviews)
                </span>
              </div>
              <Button size="lg">Start Learning</Button>
            </div>
          </div>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>

        {/* Tutorials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <Card key={tutorial.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <Play className="h-12 w-12 text-gray-500" />
                </div>
                {tutorial.isNew && (
                  <Badge className="absolute top-2 left-2 bg-blue-500">New</Badge>
                )}
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {tutorial.duration}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{tutorial.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                  {tutorial.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <Badge className={getDifficultyColor(tutorial.difficulty)}>
                    {tutorial.difficulty}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 text-green-500" />
                    {tutorial.rating}
                  </span>
                </div>
                <Button className="w-full" variant="outline">
                  Watch Tutorial
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Path Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Recommended Learning Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Start with Basics</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Learn platform fundamentals and account setup
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 dark:text-green-400 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Practice Trading</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Start with demo trading and basic strategies
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Advanced Techniques</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Master advanced analysis and risk management
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tutorials;

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Play, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Users, 
  Star,
  ArrowRight,
  Target,
  TrendingUp,
  Shield,
  DollarSign,
  BarChart3,
  Lightbulb,
  Award,
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';

const tutorials = [
  {
    id: 1,
    title: "Getting Started with BITPANDA PRO",
    description: "Learn the basics of navigating our platform and setting up your account",
    duration: "15 min",
    difficulty: "Beginner",
    lessons: 5,
    completed: 0,
    category: "Basics",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop",
    topics: ["Account Setup", "Platform Navigation", "Security Settings", "First Deposit", "Basic Interface"]
  },
  {
    id: 2,
    title: "Cryptocurrency Trading Fundamentals",
    description: "Master the fundamentals of buying, selling, and trading cryptocurrencies",
    duration: "25 min",
    difficulty: "Beginner",
    lessons: 8,
    completed: 3,
    category: "Trading",
    thumbnail: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=300&h=200&fit=crop",
    topics: ["Market Orders", "Limit Orders", "Reading Charts", "Risk Management", "Order Book", "Trade Execution", "Portfolio Management", "Trading Psychology"]
  },
  {
    id: 3,
    title: "Technical Analysis Basics",
    description: "Learn to read charts, identify patterns, and make informed trading decisions",
    duration: "35 min",
    difficulty: "Intermediate",
    lessons: 10,
    completed: 0,
    category: "Analysis",
    thumbnail: "https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=300&h=200&fit=crop",
    topics: ["Candlestick Charts", "Support & Resistance", "Moving Averages", "RSI", "MACD", "Volume Analysis", "Chart Patterns", "Trend Lines", "Fibonacci Retracements", "Trading Signals"]
  },
  {
    id: 4,
    title: "Portfolio Management Strategies",
    description: "Discover how to build and manage a diversified cryptocurrency portfolio",
    duration: "20 min",
    difficulty: "Intermediate",
    lessons: 6,
    completed: 6,
    category: "Portfolio",
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop",
    topics: ["Asset Allocation", "Diversification", "Risk Assessment", "Rebalancing", "Performance Tracking", "Tax Considerations"]
  },
  {
    id: 5,
    title: "Advanced Trading Strategies",
    description: "Explore sophisticated trading techniques and advanced market analysis",
    duration: "45 min",
    difficulty: "Advanced",
    lessons: 12,
    completed: 0,
    category: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1642543348186-0b8b47a2e102?w=300&h=200&fit=crop",
    topics: ["Scalping", "Swing Trading", "DCA Strategies", "Arbitrage", "Options Trading", "Derivatives", "Market Making", "Algorithmic Trading", "Risk Models", "Advanced Indicators", "Position Sizing", "Trade Automation"]
  },
  {
    id: 6,
    title: "Security & Risk Management",
    description: "Protect your investments with proper security measures and risk management",
    duration: "18 min",
    difficulty: "Beginner",
    lessons: 7,
    completed: 2,
    category: "Security",
    thumbnail: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=300&h=200&fit=crop",
    topics: ["2FA Setup", "Secure Passwords", "Phishing Protection", "Cold Storage", "Risk Assessment", "Stop Losses", "Position Limits"]
  }
];

const categories = ["All", "Basics", "Trading", "Analysis", "Portfolio", "Advanced", "Security"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

export default function Tutorials() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const filteredTutorials = tutorials.filter(tutorial => {
    const categoryMatch = selectedCategory === "All" || tutorial.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === "All" || tutorial.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const learningPaths = [
    {
      title: "Complete Beginner Path",
      description: "Perfect for those new to cryptocurrency trading",
      tutorials: [1, 6, 2],
      duration: "58 min",
      icon: <Target className="w-6 h-6" />
    },
    {
      title: "Technical Trader Path",
      description: "Focus on chart analysis and technical strategies",
      tutorials: [3, 5, 4],
      duration: "100 min",
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      title: "Portfolio Manager Path", 
      description: "Learn to build and manage investment portfolios",
      tutorials: [4, 2, 6],
      duration: "63 min",
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            BITPANDA PRO Tutorials
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Master cryptocurrency trading with our comprehensive step-by-step tutorials. 
            From basics to advanced strategies, learn at your own pace.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Play className="w-5 h-5 mr-2 text-blue-600" />
              50+ Video Lessons
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-600" />
              10,000+ Students
            </div>
            <div className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600" />
              Completion Certificates
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="tutorials" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="tutorials">All Tutorials</TabsTrigger>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          </TabsList>

          <TabsContent value="paths">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Structured Learning Paths</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Follow our curated learning paths designed to take you from beginner to expert
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {learningPaths.map((path, index) => (
                  <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          {path.icon}
                        </div>
                        <Badge variant="outline">{path.duration}</Badge>
                      </div>
                      <CardTitle className="text-xl">{path.title}</CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        {path.tutorials.map((tutorialId, idx) => {
                          const tutorial = tutorials.find(t => t.id === tutorialId);
                          return tutorial ? (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mr-3 font-semibold">
                                  {idx + 1}
                                </div>
                                {tutorial.title}
                              </span>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          ) : null;
                        })}
                      </div>
                      <Button className="w-full group-hover:bg-primary/90 transition-colors">
                        Start Learning Path
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tutorials">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-muted-foreground self-center">Category:</span>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-muted-foreground self-center">Level:</span>
                {difficulties.map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tutorials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map((tutorial) => (
                <Card key={tutorial.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img
                      src={tutorial.thumbnail}
                      alt={tutorial.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                        <Play className="w-6 h-6 text-gray-800 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className={getDifficultyColor(tutorial.difficulty)}>
                        {tutorial.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                        {tutorial.title}
                      </CardTitle>
                      {tutorial.completed === tutorial.lessons && (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {tutorial.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {tutorial.duration}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {tutorial.lessons} lessons
                      </div>
                    </div>

                    {tutorial.completed > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="text-muted-foreground">
                            {tutorial.completed}/{tutorial.lessons} completed
                          </span>
                        </div>
                        <Progress value={getProgressPercentage(tutorial.completed, tutorial.lessons)} className="h-2" />
                      </div>
                    )}

                    <Button 
                      className="w-full group-hover:bg-primary/90 transition-colors"
                      variant={tutorial.completed === tutorial.lessons ? "outline" : "default"}
                    >
                      {tutorial.completed === tutorial.lessons ? (
                        <>
                          <Award className="w-4 h-4 mr-2" />
                          Review Tutorial
                        </>
                      ) : tutorial.completed > 0 ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Continue Learning
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Tutorial
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
