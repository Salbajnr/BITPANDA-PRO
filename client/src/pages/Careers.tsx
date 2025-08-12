
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MapPin, Clock, Users, Briefcase, Heart, Coffee, Laptop, Globe } from 'lucide-react';

const Careers = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = [
    { id: 'all', name: 'All Positions', count: 12 },
    { id: 'engineering', name: 'Engineering', count: 5 },
    { id: 'product', name: 'Product', count: 2 },
    { id: 'design', name: 'Design', count: 1 },
    { id: 'marketing', name: 'Marketing', count: 2 },
    { id: 'sales', name: 'Sales', count: 2 }
  ];

  const benefits = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness programs"
    },
    {
      icon: <Coffee className="h-8 w-8 text-brown-500" />,
      title: "Work-Life Balance",
      description: "Flexible working hours, unlimited vacation, and remote work options"
    },
    {
      icon: <Laptop className="h-8 w-8 text-blue-500" />,
      title: "Latest Technology",
      description: "Top-tier equipment and tools to help you do your best work"
    },
    {
      icon: <Globe className="h-8 w-8 text-green-500" />,
      title: "Global Opportunities",
      description: "Work with international teams and travel opportunities"
    }
  ];

  const positions = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "engineering",
      location: "Vienna, Austria",
      type: "Full-time",
      experience: "5+ years",
      description: "Build and maintain our trading platform frontend using React and TypeScript."
    },
    {
      id: 2,
      title: "Backend Engineer",
      department: "engineering",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      description: "Develop scalable backend systems for our trading infrastructure."
    },
    {
      id: 3,
      title: "Product Manager",
      department: "product",
      location: "Vienna, Austria",
      type: "Full-time",
      experience: "4+ years",
      description: "Lead product strategy and development for our mobile trading app."
    },
    {
      id: 4,
      title: "UX/UI Designer",
      department: "design",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      description: "Design intuitive user experiences for our trading platform."
    },
    {
      id: 5,
      title: "DevOps Engineer",
      department: "engineering",
      location: "Vienna, Austria",
      type: "Full-time",
      experience: "4+ years",
      description: "Manage and improve our cloud infrastructure and deployment processes."
    },
    {
      id: 6,
      title: "Marketing Manager",
      department: "marketing",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      description: "Develop and execute marketing strategies to grow our user base."
    }
  ];

  const filteredPositions = selectedDepartment === 'all' 
    ? positions 
    : positions.filter(position => position.department === selectedDepartment);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join BITPANDA PRO
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Help us revolutionize the future of trading. We're looking for passionate individuals 
            who want to make a difference in the financial technology space.
          </p>
          <Button size="lg">View Open Positions</Button>
        </div>

        {/* Company Culture */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Why Work With Us?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Amazing Team</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Work alongside brilliant minds from diverse backgrounds who are passionate about innovation.
                </p>
              </div>
              <div>
                <Briefcase className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Growth Opportunities</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Advance your career with mentorship, training, and leadership opportunities.
                </p>
              </div>
              <div>
                <Globe className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Global Impact</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your work will impact millions of users worldwide and shape the future of finance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits & Perks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Department Filter */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">Open Positions</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {departments.map((dept) => (
              <Button
                key={dept.id}
                variant={selectedDepartment === dept.id ? "default" : "outline"}
                onClick={() => setSelectedDepartment(dept.id)}
                className="flex items-center gap-2"
              >
                {dept.name}
                <Badge variant="secondary" className="text-xs">
                  {dept.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid gap-6 mb-16">
          {filteredPositions.map((position) => (
            <Card key={position.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{position.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {position.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {position.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {position.experience}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <Badge className="mb-2 capitalize">{position.department}</Badge>
                    <div>
                      <Button>Apply Now</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">Don't See a Perfect Match?</h2>
            <p className="text-xl mb-8">
              We're always looking for talented individuals. Send us your resume and let us know how you'd like to contribute.
            </p>
            <Button size="lg" variant="secondary">
              Send Your Resume
            </Button>
          </CardContent>
        </Card>

        {/* Office Locations */}
        <Card className="mt-16">
          <CardHeader>
            <CardTitle className="text-center">Our Offices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-semibold text-lg mb-2">Vienna, Austria</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">Headquarters</p>
                <p className="text-sm text-gray-500">Wiedner Hauptstraße 94, 1050 Vienna</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">London, UK</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">European Hub</p>
                <p className="text-sm text-gray-500">25 Canada Square, Canary Wharf</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Remote</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">Work from Anywhere</p>
                <p className="text-sm text-gray-500">Multiple time zones supported</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Careers;
