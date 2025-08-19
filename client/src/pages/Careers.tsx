
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { 
  MapPin, Calendar, Users, Code, Briefcase, DollarSign, 
  Globe, Heart, Star, TrendingUp, Coffee, Laptop,
  ArrowRight, Search, Filter, Clock, CheckCircle,
  Building, Award, Target, Zap, Shield, Headphones
} from 'lucide-react';

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const jobListings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Vienna, Austria',
      type: 'Full-time',
      level: 'Senior',
      salary: '€70,000 - €90,000',
      posted: '2 days ago',
      description: 'Build cutting-edge crypto trading interfaces using React, TypeScript, and modern web technologies.',
      requirements: ['5+ years React experience', 'TypeScript expertise', 'Crypto/Fintech background preferred'],
      remote: true
    },
    {
      id: 2,
      title: 'Blockchain Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      level: 'Mid-Senior',
      salary: '€80,000 - €120,000',
      posted: '1 week ago',
      description: 'Develop smart contracts and DeFi protocols for our crypto platform.',
      requirements: ['Solidity expertise', 'DeFi protocol knowledge', 'Web3 development experience'],
      remote: true
    },
    {
      id: 3,
      title: 'Product Manager - Crypto Trading',
      department: 'Product',
      location: 'New York, USA',
      type: 'Full-time',
      level: 'Senior',
      salary: '$140,000 - $180,000',
      posted: '3 days ago',
      description: 'Lead product strategy for our crypto trading platform and drive user experience improvements.',
      requirements: ['5+ years product management', 'Crypto trading knowledge', 'User research experience'],
      remote: false
    },
    {
      id: 4,
      title: 'Security Engineer',
      department: 'Security',
      location: 'Singapore',
      type: 'Full-time',
      level: 'Senior',
      salary: 'S$120,000 - S$160,000',
      posted: '5 days ago',
      description: 'Ensure the security of our crypto platform and protect user assets.',
      requirements: ['Cybersecurity expertise', 'Penetration testing', 'Blockchain security knowledge'],
      remote: true
    },
    {
      id: 5,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Vienna, Austria',
      type: 'Full-time',
      level: 'Mid',
      salary: '€50,000 - €70,000',
      posted: '1 week ago',
      description: 'Create intuitive and beautiful interfaces for our crypto trading platform.',
      requirements: ['Figma expertise', 'Fintech design experience', 'User research skills'],
      remote: true
    },
    {
      id: 6,
      title: 'Data Scientist',
      department: 'Analytics',
      location: 'Remote',
      type: 'Full-time',
      level: 'Senior',
      salary: '€75,000 - €100,000',
      posted: '4 days ago',
      description: 'Analyze crypto market data and build predictive models for trading insights.',
      requirements: ['Python/R expertise', 'Machine learning', 'Financial data analysis'],
      remote: true
    }
  ];

  const departments = ['all', 'Engineering', 'Product', 'Design', 'Security', 'Analytics', 'Marketing', 'Operations'];
  const locations = ['all', 'Vienna, Austria', 'New York, USA', 'Singapore', 'Remote'];

  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Competitive Salary',
      description: 'Market-leading compensation packages with equity options'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance and wellness programs'
    },
    {
      icon: <Laptop className="w-6 h-6" />,
      title: 'Remote Flexibility',
      description: 'Work from anywhere with flexible hours and remote-first culture'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Learning Budget',
      description: '€3,000 annual budget for courses, conferences, and certifications'
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: 'Office Perks',
      description: 'Premium coffee, free meals, and modern office spaces'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Team',
      description: 'Work with talented people from over 40 countries'
    }
  ];

  const companyValues = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Innovation First',
      description: 'We push boundaries and embrace cutting-edge technology to revolutionize crypto trading.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Collaboration',
      description: 'We believe diverse perspectives and open communication drive the best results.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Security Minded',
      description: 'Security and trust are at the core of everything we build and deliver.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Move Fast',
      description: 'We iterate quickly, learn from failures, and adapt to market changes rapidly.'
    }
  ];

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Junior': return 'bg-green-100 text-green-800';
      case 'Mid': return 'bg-blue-100 text-blue-800';
      case 'Senior': return 'bg-purple-100 text-purple-800';
      case 'Mid-Senior': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Join Our Mission
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Help us build the future of cryptocurrency trading. We're looking for passionate individuals 
            who want to make financial services accessible to everyone.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span>500+ Employees</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-500" />
              <span>40+ Countries</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-purple-500" />
              <span>5 Global Offices</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="jobs" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="jobs">Open Positions</TabsTrigger>
            <TabsTrigger value="culture">Our Culture</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="process">Hiring Process</TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <div className="space-y-8">
              
              {/* Job Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search positions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept}>
                            {dept === 'all' ? 'All Departments' : dept}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        {locations.map(location => (
                          <option key={location} value={location}>
                            {location === 'all' ? 'All Locations' : location}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Filter className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Job Results Summary */}
              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-300">
                  Showing {filteredJobs.length} of {jobListings.length} positions
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Updated daily</span>
                </div>
              </div>

              {/* Job Listings */}
              <div className="grid gap-6">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <Badge className={getLevelColor(job.level)}>
                              {job.level}
                            </Badge>
                            {job.remote && (
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                Remote OK
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              <span>{job.department}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{job.posted}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{job.salary}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {job.description}
                          </p>
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Key Requirements:</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.requirements.map((req, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="ml-6">
                          <Button className="bg-green-500 hover:bg-green-600">
                            Apply Now
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredJobs.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No positions found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria or check back later for new openings.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Culture Tab */}
          <TabsContent value="culture">
            <div className="space-y-12">
              
              {/* Company Values */}
              <div>
                <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {companyValues.map((value, index) => (
                    <Card key={index} className="text-center">
                      <CardContent className="p-6">
                        <div className="flex justify-center mb-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                            {value.icon}
                          </div>
                        </div>
                        <h3 className="font-semibold mb-2">{value.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{value.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Team Spotlight */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Meet Our Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">Engineering Team</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Passionate developers building the future of crypto trading with cutting-edge technology.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Star className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">Product Team</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        User-focused product managers and designers creating intuitive trading experiences.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Shield className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">Security Team</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Dedicated security experts ensuring the safety of user assets and platform integrity.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Work Environment */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Remote-First Culture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      We believe great work can happen anywhere. Our remote-first approach gives you the 
                      flexibility to work from wherever you're most productive.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Flexible working hours across time zones</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Home office setup stipend</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Regular team meetups and offsites</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Growth & Learning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      We invest in your professional development with learning opportunities, 
                      mentorship programs, and career advancement paths.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>€3,000 annual learning budget</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Conference attendance and speaking opportunities</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Internal mentorship and career coaching</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits">
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Why Work at BITPANDA PRO</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  We offer comprehensive benefits and perks to support your well-being, 
                  growth, and work-life balance.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          {benefit.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{benefit.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Additional Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Complete Benefits Package</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4">Health & Wellness</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Premium health insurance (100% covered)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Dental and vision coverage</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Mental health support and counseling</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Gym membership reimbursement</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4">Financial Benefits</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Competitive salary with annual reviews</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Equity options in company growth</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Performance bonuses</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Retirement savings matching</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Hiring Process Tab */}
          <TabsContent value="process">
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Our Hiring Process</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  We've designed our hiring process to be transparent, efficient, and focused on 
                  finding the right cultural and technical fit.
                </p>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                        1
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">Application Review</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          Our recruitment team reviews your application and resume. We look for relevant experience, 
                          cultural fit indicators, and passion for crypto/fintech.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>Timeline: 2-3 business days</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                        2
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">Initial Phone/Video Screen</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          A 30-minute conversation with our recruitment team to discuss your background, 
                          motivation, and answer any questions about the role.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>Timeline: 30 minutes</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
                        3
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">Technical Assessment</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          Role-specific technical evaluation (coding challenge, design portfolio review, 
                          or case study presentation) to assess your technical skills.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>Timeline: 1-2 hours</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                        4
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">Team Interview</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          Meet with your potential teammates and manager. We'll discuss collaboration style, 
                          problem-solving approach, and team dynamics.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>Timeline: 45-60 minutes</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-semibold">
                        5
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">Final Interview & Offer</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          Final conversation with senior leadership to discuss vision, career goals, 
                          and mutual expectations. If successful, we'll extend an offer within 24 hours.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>Timeline: 30-45 minutes</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Interview Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Interview Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">What We Look For</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Passion for crypto and financial technology</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Problem-solving and analytical thinking</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Collaborative mindset and communication skills</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Continuous learning attitude</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">How to Prepare</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span>Research our platform and mission</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span>Prepare specific examples from your experience</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span>Think about questions you'd like to ask us</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span>Be ready to discuss your career goals</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact for Questions */}
              <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
                <CardContent className="p-8 text-center">
                  <Headphones className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Have Questions?</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Our talent team is here to help you through the process.
                  </p>
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Contact Talent Team
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Careers;
