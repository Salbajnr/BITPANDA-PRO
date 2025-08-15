
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

