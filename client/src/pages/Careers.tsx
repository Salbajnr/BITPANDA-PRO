
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, ArrowRight, Building, Heart, Target, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";

const jobOpenings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Vienna, Austria",
    type: "Full-time",
    description: "Join our frontend team to build the next generation of our trading platform using React and TypeScript.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Crypto trading knowledge"],
    remote: true
  },
  {
    id: 2,
    title: "Blockchain Security Engineer",
    department: "Security",
    location: "Remote",
    type: "Full-time",
    description: "Help secure our blockchain infrastructure and smart contract implementations.",
    requirements: ["Blockchain security expertise", "Smart contract auditing", "Penetration testing"],
    remote: true
  },
  {
    id: 3,
    title: "Product Manager - Trading",
    department: "Product",
    location: "Vienna, Austria",
    type: "Full-time",
    description: "Lead the product strategy for our advanced trading features and user experience.",
    requirements: ["Product management experience", "Trading platform knowledge", "User research skills"],
    remote: false
  },
  {
    id: 4,
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Berlin, Germany",
    type: "Full-time",
    description: "Scale our infrastructure to handle millions of trading transactions per second.",
    requirements: ["Kubernetes expertise", "AWS/GCP experience", "High-scale systems"],
    remote: true
  }
];

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health insurance, mental health support, and wellness programs"
  },
  {
    icon: Target,
    title: "Professional Growth",
    description: "Learning budget, conference attendance, and internal mentorship programs"
  },
  {
    icon: Users,
    title: "Inclusive Culture",
    description: "Diverse team with 40+ nationalities and strong commitment to equality"
  },
  {
    icon: Zap,
    title: "Innovation Focus",
    description: "Work with cutting-edge technology and shape the future of finance"
  }
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Join the Future of Finance
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Build the next generation of cryptocurrency trading platforms with a team of passionate innovators. 
            Help millions of users worldwide access the decentralized economy.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="outline" className="bg-green-400/10 text-green-400 border-green-400/20 px-4 py-2">
              🌍 Remote-First
            </Badge>
            <Badge variant="outline" className="bg-blue-400/10 text-blue-400 border-blue-400/20 px-4 py-2">
              💰 Competitive Salary
            </Badge>
            <Badge variant="outline" className="bg-purple-400/10 text-purple-400 border-purple-400/20 px-4 py-2">
              🚀 Equity Options
            </Badge>
            <Badge variant="outline" className="bg-orange-400/10 text-orange-400 border-orange-400/20 px-4 py-2">
              📚 Learning Budget
            </Badge>
          </div>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Work With Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                    <p className="text-slate-400 text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Open Positions</h2>
          <div className="grid gap-6">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-700/40 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-white group-hover:text-green-400 transition-colors duration-300">
                        {job.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400 mt-2">
                        {job.description}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={job.remote ? "default" : "secondary"} 
                      className={job.remote ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                    >
                      {job.remote ? "Remote" : "On-site"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {job.department}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-2">Requirements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex-1"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20 backdrop-blur-sm">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-white mb-4">Don't See Your Role?</h2>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                We're always looking for exceptional talent. Send us your resume and tell us how you'd like to contribute to the future of cryptocurrency trading.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Send Your Application
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
