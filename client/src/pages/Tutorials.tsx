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
      description: "Master limit orders, stop-loss, and take-profit orders",
      duration: "18 min",
      difficulty: "Advanced",
      category: "trading",
      rating: 4.6,
      thumbnail: "/api/placeholder/300/200",
      isNew: false
    },
    {
      id: 5,
      title: "Wallet Management Best Practices",
      description: "Learn how to safely store and manage your cryptocurrency",
      duration: "15 min",
      difficulty: "Intermediate",
      category: "wallet",
      rating: 4.8,
      thumbnail: "/api/placeholder/300/200",
      isNew: true
    }
  ];

  const filteredTutorials = selectedCategory === 'all' 
    ? tutorials 
    : tutorials.filter(tutorial => tutorial.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trading Tutorials
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Master cryptocurrency trading with our comprehensive video tutorials and guides
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTutorials.map((tutorial) => (
            <Card key={tutorial.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img 
                  src={tutorial.thumbnail} 
                  alt={tutorial.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-t-lg">
                  <Play className="h-12 w-12 text-white" />
                </div>
                {tutorial.isNew && (
                  <Badge className="absolute top-2 right-2 bg-blue-600">
                    New
                  </Badge>
                )}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {tutorial.duration}
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getDifficultyColor(tutorial.difficulty)}>
                    {tutorial.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {tutorial.rating}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                  {tutorial.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {tutorial.description}
                </p>
                
                <Button className="w-full" variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Tutorial
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Path */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader>
            <CardTitle className="text-center">
              Recommended Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Learn Basics</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Start with platform navigation and basic concepts
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