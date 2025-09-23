
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Globe, 
  Heart, 
  Lightbulb,
  TrendingUp,
  Coffee,
  Gamepad2,
  GraduationCap,
  Shield,
  Zap,
  Award
} from 'lucide-react';
import { Link } from 'wouter';

const jobOpenings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Vienna, Austria",
    type: "Full-time",
    description: "Join our frontend team to build the next generation of crypto trading interfaces using React and TypeScript.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Financial UI experience preferred"],
    posted: "2 days ago"
  },
  {
    id: 2,
    title: "Blockchain Security Engineer", 
    department: "Security",
    location: "Remote",
    type: "Full-time",
    description: "Help secure our platform and smart contracts while building the future of decentralized finance.",
    requirements: ["Solidity expertise", "Security audit experience", "DeFi knowledge"],
    posted: "1 week ago"
  },
  {
    id: 3,
    title: "Product Manager - Trading",
    department: "Product",
    location: "Vienna, Austria",
    type: "Full-time", 
    description: "Lead product strategy for our professional trading platform used by millions of traders worldwide.",
    requirements: ["Product management experience", "Trading platform knowledge", "Data-driven mindset"],
    posted: "3 days ago"
  },
  {
    id: 4,
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Vienna, Austria / Remote",
    type: "Full-time",
    description: "Scale our infrastructure to handle millions of users and billions in trading volume.",
    requirements: ["Kubernetes experience", "AWS/Cloud expertise", "CI/CD pipelines"],
    posted: "5 days ago"
  },
  {
    id: 5,
    title: "Compliance Officer",
    department: "Legal & Compliance", 
    location: "Vienna, Austria",
    type: "Full-time",
    description: "Ensure our platform meets regulatory requirements across multiple European jurisdictions.",
    requirements: ["Financial compliance background", "European regulations knowledge", "Legal degree preferred"],
    posted: "1 week ago"
  },
  {
    id: 6,
    title: "UX Designer",
    department: "Design",
    location: "Vienna, Austria",
    type: "Full-time",
    description: "Design intuitive experiences for both beginner and professional crypto traders.",
    requirements: ["5+ years UX design", "Fintech experience", "User research skills"],
    posted: "4 days ago"
  }
];

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health insurance, mental health support, and wellness programs",
    color: "text-red-500"
  },
  {
    icon: Coffee,
    title: "Work-Life Balance", 
    description: "Flexible working hours, remote work options, and unlimited vacation policy",
    color: "text-orange-500"
  },
  {
    icon: TrendingUp,
    title: "Growth & Development",
    description: "Learning budget, conference attendance, and internal mentorship programs",
    color: "text-green-500"
  },
  {
    icon: Gamepad2,
    title: "Fun & Culture",
    description: "Team events, game rooms, and a vibrant office culture in the heart of Vienna",
    color: "text-purple-500"
  },
  {
    icon: Award,
    title: "Competitive Package",
    description: "Competitive salary, equity options, and performance-based bonuses",
    color: "text-blue-500"
  },
  {
    icon: Shield,
    title: "Security & Stability",
    description: "Job security in a growing company with strong financial backing",
    color: "text-gray-500"
  }
];

const values = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We're constantly pushing the boundaries of what's possible in financial technology"
  },
  {
    icon: Users,
    title: "Customer Centric", 
    description: "Every decision we make is focused on delivering value to our users"
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "We build products that our users can trust with their financial future"
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "We're democratizing access to financial services across Europe and beyond"
  }
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
            <Users className="w-4 h-4 mr-2" />
            Join Our Team
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Shape the Future of Finance
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Join Europe's leading crypto platform and help democratize access to digital assets for millions of users worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
              <MapPin className="w-5 h-5 mr-2" />
              View Open Positions
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Heart className="w-5 h-5 mr-2" />
              Learn About Our Culture
            </Button>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">7M+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Team Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">15+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">€50B+</div>
              <div className="text-gray-600">Assets Under Management</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're more than just a crypto platform. We're a team of passionate individuals working towards a common goal.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <value.icon className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Work With Us?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer competitive benefits and a supportive environment where you can grow your career.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <benefit.icon className={`w-10 h-10 mb-4 ${benefit.color}`} />
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find your next opportunity and help us build the future of finance.
            </p>
          </div>
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary">{job.department}</Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline">{job.type}</Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        Posted {job.posted}
                      </div>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    {job.description}
                  </CardDescription>
                  <div>
                    <h4 className="font-semibold mb-2">Key Requirements:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Hiring Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've designed our process to be thorough yet respectful of your time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Application</h3>
              <p className="text-gray-600">Submit your application and we'll review it within 48 hours</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Phone Screening</h3>
              <p className="text-gray-600">Brief call to discuss your background and interest</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Technical Interview</h3>
              <p className="text-gray-600">Deep dive into your technical skills and experience</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Final Interview</h3>
              <p className="text-gray-600">Meet the team and discuss culture fit</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Our Mission?</h2>
          <p className="text-xl mb-8 opacity-90">
            Don't see the perfect role? We're always looking for exceptional talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
              <Users className="w-5 h-5 mr-2" />
              Browse All Positions
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Heart className="w-5 h-5 mr-2" />
              Send Us Your CV
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
