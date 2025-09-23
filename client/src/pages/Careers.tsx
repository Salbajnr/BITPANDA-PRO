import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { 
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Briefcase,
  Star,
  Send,
  Building,
  Globe,
  Heart,
  Trophy,
  Zap,
  Coffee
} from 'lucide-react';

export default function Careers() {
  const [, setLocation] = useLocation();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    coverLetter: '',
    experience: '',
    portfolio: ''
  });

  const jobOpenings = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Vienna, Austria',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Join our frontend team to build the next generation of crypto trading interfaces.',
      requirements: ['React', 'TypeScript', 'Tailwind CSS', 'WebSocket APIs'],
      salary: '€70,000 - €90,000'
    },
    {
      id: '2',
      title: 'Blockchain Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Mid-level',
      description: 'Build and maintain our blockchain infrastructure and smart contracts.',
      requirements: ['Solidity', 'Web3', 'Node.js', 'Ethereum'],
      salary: '€80,000 - €100,000'
    },
    {
      id: '3',
      title: 'Product Manager',
      department: 'Product',
      location: 'Vienna, Austria',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Lead product strategy for our crypto trading platform.',
      requirements: ['Product Management', 'Crypto Knowledge', 'Analytics', 'Leadership'],
      salary: '€75,000 - €95,000'
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Mid-level',
      description: 'Maintain and scale our trading infrastructure.',
      requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      salary: '€65,000 - €85,000'
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance and wellness programs'
    },
    {
      icon: Coffee,
      title: 'Flexible Work',
      description: 'Remote work options and flexible schedules'
    },
    {
      icon: Trophy,
      title: 'Career Growth',
      description: 'Professional development and learning opportunities'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Work with cutting-edge blockchain technology'
    }
  ];

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Application submitted:', applicationForm);
    // Handle application submission
  };

  const handleApplyClick = (jobId: string) => {
    setSelectedJob(jobId);
    setApplicationForm(prev => ({
      ...prev,
      position: jobOpenings.find(job => job.id === jobId)?.title || ''
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setLocation('/')}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Building className="w-8 h-8 text-green-500" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">BITPANDA PRO</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Careers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Join Our <span className="text-green-500">Mission</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
            Be part of the team that's revolutionizing cryptocurrency trading. 
            We're looking for passionate individuals to help shape the future of digital finance.
          </p>
          <div className="flex items-center justify-center space-x-8 text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>50+ Team Members</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Remote Friendly</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>4.8/5 Employee Rating</span>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Why Work With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Job Openings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Open Positions
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-slate-900 dark:text-white mb-2">
                        {job.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">{job.experience}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    {job.description}
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Requirements:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {job.salary}
                    </span>
                    <Button 
                      onClick={() => handleApplyClick(job.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Form */}
        {selectedJob && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900 dark:text-white">
                Apply for Position
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400">
                Position: {jobOpenings.find(job => job.id === selectedJob)?.title}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApplicationSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={applicationForm.firstName}
                      onChange={(e) => setApplicationForm(prev => ({
                        ...prev,
                        firstName: e.target.value
                      }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={applicationForm.lastName}
                      onChange={(e) => setApplicationForm(prev => ({
                        ...prev,
                        lastName: e.target.value
                      }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={applicationForm.email}
                      onChange={(e) => setApplicationForm(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={applicationForm.phone}
                      onChange={(e) => setApplicationForm(prev => ({
                        ...prev,
                        phone: e.target.value
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select 
                    value={applicationForm.experience}
                    onValueChange={(value) => setApplicationForm(prev => ({
                      ...prev,
                      experience: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid-level (2-5 years)</SelectItem>
                      <SelectItem value="senior">Senior (5+ years)</SelectItem>
                      <SelectItem value="lead">Lead/Principal (8+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio/LinkedIn URL</Label>
                  <Input
                    id="portfolio"
                    type="url"
                    placeholder="https://..."
                    value={applicationForm.portfolio}
                    onChange={(e) => setApplicationForm(prev => ({
                      ...prev,
                      portfolio: e.target.value
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter *</Label>
                  <Textarea
                    id="coverLetter"
                    rows={6}
                    placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                    value={applicationForm.coverLetter}
                    onChange={(e) => setApplicationForm(prev => ({
                      ...prev,
                      coverLetter: e.target.value
                    }))}
                    required
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setSelectedJob(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}