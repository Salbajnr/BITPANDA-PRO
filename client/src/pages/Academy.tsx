
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Star,
  Search,
  TrendingUp,
  Shield,
  DollarSign,
  BarChart3,
  Lightbulb,
  Award,
  CheckCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";

const courses = [
  {
    id: 1,
    title: "Cryptocurrency Fundamentals",
    description: "Learn the basics of blockchain technology, Bitcoin, and major cryptocurrencies.",
    duration: "2 hours",
    level: "Beginner",
    students: 12500,
    rating: 4.8,
    lessons: 8,
    category: "Crypto Basics",
    icon: TrendingUp,
    color: "text-green-600"
  },
  {
    id: 2,
    title: "Investment Strategies",
    description: "Discover proven investment strategies for building long-term wealth.",
    duration: "3 hours",
    level: "Intermediate",
    students: 8900,
    rating: 4.9,
    lessons: 12,
    category: "Investing",
    icon: BarChart3,
    color: "text-blue-600"
  },
  {
    id: 3,
    title: "Risk Management",
    description: "Learn how to protect your investments and manage portfolio risk effectively.",
    duration: "1.5 hours",
    level: "Intermediate",
    students: 6700,
    rating: 4.7,
    lessons: 6,
    category: "Risk Management",
    icon: Shield,
    color: "text-purple-600"
  },
  {
    id: 4,
    title: "Trading Psychology",
    description: "Master the mental aspects of trading and overcome emotional decision-making.",
    duration: "2.5 hours",
    level: "Advanced",
    students: 4200,
    rating: 4.6,
    lessons: 10,
    category: "Psychology",
    icon: Lightbulb,
    color: "text-orange-600"
  },
  {
    id: 5,
    title: "Portfolio Diversification",
    description: "Build a balanced portfolio across different asset classes and markets.",
    duration: "2 hours",
    level: "Beginner",
    students: 9800,
    rating: 4.8,
    lessons: 9,
    category: "Portfolio",
    icon: DollarSign,
    color: "text-green-600"
  },
  {
    id: 6,
    title: "Advanced Technical Analysis",
    description: "Deep dive into chart patterns, indicators, and technical trading strategies.",
    duration: "4 hours",
    level: "Advanced",
    students: 3100,
    rating: 4.9,
    lessons: 16,
    category: "Technical Analysis",
    icon: BarChart3,
    color: "text-red-600"
  }
];

const achievements = [
  {
    title: "First Steps",
    description: "Complete your first course",
    icon: CheckCircle,
    unlocked: true
  },
  {
    title: "Knowledge Seeker",
    description: "Complete 5 courses",
    icon: BookOpen,
    unlocked: false
  },
  {
    title: "Expert Trader",
    description: "Complete all advanced courses",
    icon: Award,
    unlocked: false
  }
];

const categories = ["All", "Crypto Basics", "Investing", "Risk Management", "Psychology", "Portfolio", "Technical Analysis"];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function Academy() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-blue-100 text-blue-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            BITPANDA PRO Academy
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Master cryptocurrency trading and investment with our comprehensive learning platform. 
            From basics to advanced strategies, we've got you covered.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-600" />
              50,000+ Students
            </div>
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              50+ Courses
            </div>
            <div className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600" />
              Expert Instructors
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-background"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-background"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className={`${achievement.unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <CardContent className="p-6 text-center">
                  <achievement.icon className={`w-12 h-12 mx-auto mb-4 ${achievement.unlocked ? 'text-green-600' : 'text-gray-400'}`} />
                  <h3 className="font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {achievement.unlocked && (
                    <Badge className="mt-3 bg-green-100 text-green-800">Unlocked</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              Courses ({filteredCourses.length})
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="enhanced-card group cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <course.icon className={`w-12 h-12 ${course.color} mb-4`} />
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>
                  <CardTitle className="group-hover:text-green-600 transition-colors">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{course.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {course.lessons} lessons
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {course.rating}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      {course.students.toLocaleString()} students
                    </div>
                  </div>

                  <Button className="w-full group-hover:bg-green-600 transition-colors">
                    <Play className="w-4 h-4 mr-2" />
                    Start Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
