
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Clock, 
  Users, 
  Briefcase, 
  Heart, 
  Zap, 
  Globe, 
  TrendingUp,
  ArrowRight,
  Star
} from "lucide-react";

export default function Careers() {
  const openPositions = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Vienna, Austria",
      type: "Full-time",
      experience: "5+ years",
      description: "Join our frontend team to build the next generation of crypto trading interfaces.",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"]
    },
    {
      id: 2,
      title: "Blockchain Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      description: "Work on cutting-edge blockchain infrastructure and smart contracts.",
      skills: ["Solidity", "Web3", "Node.js", "Python"]
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "Vienna, Austria",
      type: "Full-time",
      experience: "4+ years",
      description: "Lead product strategy for our crypto trading platform.",
      skills: ["Product Strategy", "Analytics", "User Research", "Agile"]
    },
    {
      id: 4,
      title: "UX/UI Designer",
      department: "Design",
      location: "Vienna, Austria / Remote",
      type: "Full-time",
      experience: "3+ years",
      description: "Create intuitive and beautiful user experiences for crypto traders.",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"]
    },
    {
      id: 5,
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "4+ years",
      description: "Build and maintain our cloud infrastructure and deployment pipelines.",
      skills: ["AWS", "Kubernetes", "Docker", "Terraform"]
    },
    {
      id: 6,
      title: "Security Engineer",
      department: "Security",
      location: "Vienna, Austria",
      type: "Full-time",
      experience: "5+ years",
      description: "Ensure the security of our platform and user assets.",
      skills: ["Penetration Testing", "Cryptography", "Security Auditing", "Python"]
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs"
    },
    {
      icon: Zap,
      title: "Innovation Time",
      description: "20% time for personal projects and learning"
    },
    {
      icon: Globe,
      title: "Remote Friendly",
      description: "Flexible work arrangements and remote options"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Clear career paths and professional development"
    }
  ];

  const values = [
    {
      title: "Transparency",
      description: "We believe in open communication and honest feedback at all levels."
    },
    {
      title: "Innovation",
      description: "We're always pushing boundaries and exploring new possibilities in crypto."
    },
    {
      title: "Security First",
      description: "Security is at the core of everything we build and every decision we make."
    },
    {
      title: "User Centric",
      description: "Our users' success is our success. We build with them in mind."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border-b border-slate-700/50">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Briefcase className="w-12 h-12 text-green-400 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Join Our Team
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Shape the future of cryptocurrency trading and help millions of users 
            access the digital asset economy. Join BITPANDA PRO and be part of the revolution.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              <Users className="w-4 h-4 mr-2" />
              200+ Team Members
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Globe className="w-4 h-4 mr-2" />
              15+ Countries
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Star className="w-4 h-4 mr-2" />
              4.8/5 Employee Rating
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Company Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              These core principles guide everything we do at BITPANDA PRO
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-slate-800/40 backdrop-blur-xl border-slate-700/50 hover:border-green-500/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Work With Us?</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We offer more than just a job - we provide an environment where you can thrive
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="bg-slate-800/40 backdrop-blur-xl border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group">
                  <CardHeader className="text-center pb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-white text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Open Positions</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Find your next opportunity and help us build the future of finance
            </p>
          </div>
          <div className="space-y-6">
            {openPositions.map((position) => (
              <Card key={position.id} className="bg-slate-800/40 backdrop-blur-xl border-slate-700/50 hover:border-green-500/50 transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <CardTitle className="text-white text-xl mb-2 group-hover:text-green-400 transition-colors">
                        {position.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {position.department}
                        </Badge>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          <MapPin className="w-3 h-3 mr-1" />
                          {position.location}
                        </Badge>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          <Clock className="w-3 h-3 mr-1" />
                          {position.type}
                        </Badge>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white group-hover:scale-105 transition-transform">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4 leading-relaxed">
                    {position.description}
                  </p>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-400 mb-2">Required Experience:</p>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                      {position.experience}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400 mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {position.skills.map((skill, skillIndex) => (
                        <Badge 
                          key={skillIndex} 
                          variant="outline" 
                          className="border-green-500/30 text-green-400 bg-green-500/10"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30 backdrop-blur-xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl font-bold text-white mb-4">
                Ready to Join Our Mission?
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
                Don't see a perfect match? We're always looking for talented individuals who share our passion 
                for innovation and excellence. Send us your resume and let's talk about how you can contribute 
                to the future of cryptocurrency trading.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                  <Briefcase className="w-5 h-5 mr-2" />
                  View All Positions
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                >
                  Send General Application
                </Button>
              </div>
              <p className="text-sm text-slate-400">
                Questions about working at BITPANDA PRO? 
                <a href="/contact" className="text-green-400 hover:text-green-300 ml-1 underline">
                  Contact our HR team
                </a>
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
