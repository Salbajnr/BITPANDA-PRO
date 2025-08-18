
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
  Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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

export default function Commodities() {
  const { language, t } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [userProgress, setUserProgress] = useState(0);

  // Investment levels inspired by Bitpanda Academy
  const investmentLevels: LessonLevel[] = [
    {
      id: 'all',
      title: 'All Levels',
      description: 'Complete investment education journey',
      count: 68,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      icon: <Globe className="w-6 h-6" />
    },
    {
      id: 'financial-planning',
      title: 'Financial Planning',
      description: 'Explore the fundamentals of personal finance and wealth management',
      count: 15,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      icon: <PieChart className="w-6 h-6" />
    },
    {
      id: 'investing',
      title: 'Investing',
      description: 'Learn fundamentals of investing, trading, and financial instruments',
      count: 68,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      id: 'cryptocurrency',
      title: 'Cryptocurrency',
      description: 'Explore the essentials of the exciting world of cryptocurrency',
      count: 45,
      color: 'bg-gradient-to-r from-orange-500 to-yellow-500',
      icon: <Coins className="w-6 h-6" />
    },
    {
      id: 'blockchain',
      title: 'Blockchain & Emerging Tech',
      description: 'Learn about blockchain, AI, Web3, NFTs, and digital innovation',
      count: 32,
      color: 'bg-gradient-to-r from-violet-500 to-purple-500',
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'security',
      title: 'Crypto Security',
      description: 'Security practices for safeguarding digital assets',
      count: 18,
      color: 'bg-gradient-to-r from-red-500 to-pink-500',
      icon: <Shield className="w-6 h-6" />
    }
  ];

  // Sample lessons based on Bitpanda Academy content
  const lessons: Lesson[] = [
    {
      id: 1,
      title: "What is market capitalisation (market cap) and why does it matter?",
      description: "The term 'market capitalisation' or 'market cap' is an important metric in the evaluation of the market value of a cryptocurrency.",
      duration: "7 min",
      level: "Investing",
      position: 1,
      color: "#BBFFB2"
    },
    {
      id: 2,
      title: "The difference between a cryptocurrency broker and an exchange",
      description: "Compare crypto brokers and exchanges to find the right trading platform for your needs—considering pricing, flexibility and ease of use.",
      duration: "9 min",
      level: "Investing",
      position: 2,
      color: "#FFE8B2"
    },
    {
      id: 3,
      title: "How to start trading cryptocurrencies",
      description: "When trading crypto, you buy and sell cryptocurrencies such as Bitcoin on the exchange. How can you learn crypto trading?",
      duration: "10 min",
      level: "Investing",
      position: 3,
      color: "#B2ECFF"
    },
    {
      id: 4,
      title: "What are market orders, limit orders, stop limit orders?",
      description: "Learn how market, limit and stop-limit orders work to trade smarter in stocks and crypto. Understand the risks, benefits and timing involved.",
      duration: "13 min",
      level: "Investing",
      position: 4,
      color: "#B2C8FF"
    },
    {
      id: 5,
      title: "What are candlesticks in cryptocurrency trading?",
      description: "An overview of the topic of candlesticks trading patterns: definition, explanation, examples & tips.",
      duration: "9 min",
      level: "Investing",
      position: 5,
      color: "#FFC3B2"
    },
    {
      id: 6,
      title: "What are commodities and how do people invest in them?",
      description: "Commodities are physical assets that are used to manufacture products.",
      duration: "4 min",
      level: "Investing",
      position: 30,
      color: "#FFC3B2"
    },
    {
      id: 7,
      title: "What is a stock?",
      description: "A stock represents a small portion of ownership in a company.",
      duration: "3 min",
      level: "Investing",
      position: 9,
      color: "#B2C8FF"
    },
    {
      id: 8,
      title: "What is an exchange-traded fund (ETF)?",
      description: "An exchange-traded fund (ETF) is made up of different securities tracking an index.",
      duration: "3 min",
      level: "Investing",
      position: 18,
      color: "#B2ECFF"
    }
  ];

  const investmentCategories = [
    {
      title: "Cryptocurrency Trading",
      icon: <Coins className="w-8 h-8" />,
      topics: ["Market Cap Analysis", "Broker vs Exchange", "Order Types", "Technical Analysis"],
      color: "from-orange-400 to-yellow-500"
    },
    {
      title: "Traditional Investments",
      icon: <Building className="w-8 h-8" />,
      topics: ["Stocks & Shares", "ETFs & Funds", "Bonds & Fixed Income", "Commodities"],
      color: "from-blue-400 to-purple-500"
    },
    {
      title: "Portfolio Management",
      icon: <BarChart3 className="w-8 h-8" />,
      topics: ["Risk Management", "Diversification", "Asset Allocation", "Performance Tracking"],
      color: "from-green-400 to-blue-500"
    },
    {
      title: "Financial Planning",
      icon: <Target className="w-8 h-8" />,
      topics: ["Budgeting", "Emergency Funds", "Investment Goals", "Retirement Planning"],
      color: "from-purple-400 to-pink-500"
    }
  ];

  useEffect(() => {
    // Simulate user progress
    setUserProgress(25);
  }, []);

  const filteredLessons = selectedLevel === 'all' 
    ? lessons 
    : lessons.filter(lesson => lesson.level.toLowerCase() === selectedLevel);

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
        {/* Progress Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              Your Learning Progress
            </CardTitle>
            <CardDescription>
              Track your journey through the Investment Academy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{userProgress}% Complete</span>
              </div>
              <Progress value={userProgress} className="h-3" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">17</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">51</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">3</div>
                  <div className="text-sm text-muted-foreground">Certificates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">142</div>
                  <div className="text-sm text-muted-foreground">Study Hours</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Investment Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investmentCategories.map((category, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Levels */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Learning Levels</h2>
          <Tabs value={selectedLevel} onValueChange={setSelectedLevel} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8">
              {investmentLevels.map((level) => (
                <TabsTrigger key={level.id} value={level.id} className="flex items-center gap-2">
                  {level.icon}
                  <span className="hidden md:inline">{level.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {investmentLevels.map((level) => (
              <TabsContent key={level.id} value={level.id}>
                <Card className={`${level.color} text-white mb-8`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      {level.icon}
                      {level.title}
                    </CardTitle>
                    <CardDescription className="text-white/90 text-lg">
                      {level.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="text-black">
                        {level.count} Lessons
                      </Badge>
                      <Badge variant="secondary" className="text-black">
                        Self-Paced Learning
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Lessons Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {lesson.level}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {lesson.duration}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Lesson {lesson.position}
                    </span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {lesson.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {lesson.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" className="group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Lesson
                    </Button>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
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
