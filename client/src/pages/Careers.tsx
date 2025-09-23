
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Users, Award, Briefcase, Heart, Zap, Globe } from "lucide-react";

const jobOpenings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Vienna, Austria",
    type: "Full-time",
    description: "Join our frontend team to build the next generation of crypto trading interfaces using React and TypeScript.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Trading platform experience preferred"],
    benefits: ["Competitive salary", "Equity package", "Remote work options"]
  },
  {
    id: 2,
    title: "Blockchain Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Work on our core blockchain infrastructure and smart contract development.",
    requirements: ["Solidity expertise", "DeFi protocol experience", "Security-focused mindset"],
    benefits: ["Top market salary", "Crypto bonuses", "Conference budget"]
  },
  {
    id: 3,
    title: "Product Manager - Trading",
    department: "Product",
    location: "Vienna, Austria",
    type: "Full-time",
    description: "Lead product strategy for our professional trading platform and advanced order types.",
    requirements: ["5+ years product management", "Financial services background", "Trading platform experience"],
    benefits: ["Ownership of key products", "Cross-functional leadership", "Growth opportunities"]
  },
  {
    id: 4,
    title: "Compliance Officer",
    department: "Legal & Compliance",
    location: "Vienna, Austria",
    type: "Full-time",
    description: "Ensure regulatory compliance across all markets and help expand into new jurisdictions.",
    requirements: ["Regulatory compliance experience", "Financial services law", "Multi-jurisdiction knowledge"],
    benefits: ["Regulatory expertise development", "International exposure", "Legal education support"]
  },
  {
    id: 5,
    title: "UX/UI Designer",
    department: "Design",
    location: "Vienna, Austria / Remote",
    type: "Full-time",
    description: "Design intuitive and powerful interfaces for both beginner and professional traders.",
    requirements: ["5+ years UX/UI design", "Financial product design", "Design system experience"],
    benefits: ["Creative freedom", "Design conference budget", "Latest design tools"]
  },
  {
    id: 6,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Scale our infrastructure to handle millions of transactions and ensure 99.99% uptime.",
    requirements: ["Kubernetes expertise", "AWS/GCP experience", "High-availability systems"],
    benefits: ["Infrastructure ownership", "On-call compensation", "Technology training budget"]
  }
];

const companyValues = [
  {
    icon: <Heart className="h-8 w-8 text-red-500" />,
    title: "Customer First",
    description: "Everything we do is centered around providing the best possible experience for our users."
  },
  {
    icon: <Zap className="h-8 w-8 text-yellow-500" />,
    title: "Innovation",
    description: "We continuously push the boundaries of what's possible in the crypto and financial space."
  },
  {
    icon: <Users className="h-8 w-8 text-blue-500" />,
    title: "Teamwork",
    description: "We believe the best results come from diverse teams working together towards common goals."
  },
  {
    icon: <Globe className="h-8 w-8 text-green-500" />,
    title: "Global Impact",
    description: "Our work helps democratize access to financial services worldwide."
  }
];

const benefits = [
  "Competitive salary and equity packages",
  "Comprehensive health insurance",
  "Flexible working arrangements",
  "Professional development budget",
  "Gym membership and wellness programs",
  "Free lunch and snacks",
  "Latest technology and equipment",
  "Conference and education allowance",
  "Parental leave policies",
  "Mental health support",
  "Team building events",
  "Crypto investment matching"
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Join the Future of Finance
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Be part of a team that's democratizing access to financial services and building 
            the infrastructure for the next generation of digital assets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Briefcase className="w-5 h-5 mr-2" />
              View Open Positions
            </Button>
            <Button variant="outline" size="lg">
              Learn About Our Culture
            </Button>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do and help us build a company where everyone can thrive.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <Card key={index} className="text-center border-2 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-muted-foreground">
              Join our growing team and help shape the future of cryptocurrency trading.
            </p>
          </div>
          
          <div className="grid gap-6">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <CardDescription className="text-base mb-4">
                        {job.description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {job.department}
                        </Badge>
                        <Badge variant="outline">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {job.type}
                        </Badge>
                      </div>
                    </div>
                    <Button className="shrink-0">
                      Apply Now
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {job.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 shrink-0"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Benefits:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {job.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 shrink-0"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Perks */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Benefits & Perks</h2>
            <p className="text-muted-foreground">
              We invest in our people with comprehensive benefits and unique perks.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Culture</h2>
              <p className="text-muted-foreground mb-6">
                We're building more than just a company – we're creating a community of passionate 
                individuals who believe in the transformative power of cryptocurrency and blockchain technology.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Continuous Learning</h4>
                    <p className="text-sm text-muted-foreground">
                      Stay at the forefront of technology with dedicated learning time and education budgets.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Work-Life Balance</h4>
                    <p className="text-sm text-muted-foreground">
                      Flexible schedules and remote work options to help you do your best work.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Diversity & Inclusion</h4>
                    <p className="text-sm text-muted-foreground">
                      We celebrate diverse perspectives and create an inclusive environment for all.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                <h3 className="font-semibold mb-2">Remote-First</h3>
                <p className="text-sm text-muted-foreground">
                  Work from anywhere in the world with occasional team meetups and annual company retreats.
                </p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
                <h3 className="font-semibold mb-2">Innovation Time</h3>
                <p className="text-sm text-muted-foreground">
                  Dedicated time each week to work on passion projects and explore new technologies.
                </p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                <h3 className="font-semibold mb-2">Impact Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Your work directly impacts millions of users and helps democratize financial services.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Application Process</h2>
            <p className="text-muted-foreground">
              Our hiring process is designed to be transparent, fair, and efficient.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Apply</h3>
              <p className="text-sm text-muted-foreground">
                Submit your application with your resume and cover letter.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Screen</h3>
              <p className="text-sm text-muted-foreground">
                Initial phone or video call to discuss your background and interest.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Interview</h3>
              <p className="text-sm text-muted-foreground">
                Technical and behavioral interviews with team members.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Offer</h3>
              <p className="text-sm text-muted-foreground">
                Reference checks and offer discussion with our team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
          <p className="text-muted-foreground mb-8">
            Don't see a position that fits? We're always looking for exceptional talent. 
            Reach out and let's discuss how you can contribute to our mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Browse All Positions
            </Button>
            <Button variant="outline" size="lg">
              Send Us Your Resume
            </Button>
          </div>
          
          <Separator className="my-8" />
          
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Questions about working at BITPANDA PRO?</p>
            <p>
              Email us at <a href="mailto:careers@bitpanda-pro.com" className="text-primary hover:underline">careers@bitpanda-pro.com</a> 
              {" "}or connect with our team on LinkedIn.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
