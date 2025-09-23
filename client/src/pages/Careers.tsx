import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, ArrowRight, Briefcase, Heart, Zap, Globe } from 'lucide-react';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

const jobPositions: JobPosition[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'Vienna, Austria',
    type: 'Full-time',
    level: 'Senior',
    description: 'Join our engineering team to build the next generation of cryptocurrency trading platforms.',
    requirements: [
      '5+ years of experience with React and Node.js',
      'Experience with blockchain technologies',
      'Strong understanding of financial systems',
      'Excellent problem-solving skills'
    ],
    benefits: [
      'Competitive salary and equity',
      'Flexible working hours',
      'Health insurance',
      'Professional development budget'
    ]
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid-Senior',
    description: 'Lead product strategy and development for our trading platform features.',
    requirements: [
      '3+ years of product management experience',
      'Understanding of cryptocurrency markets',
      'Strong analytical skills',
      'Experience with agile methodologies'
    ],
    benefits: [
      'Remote-first culture',
      'Stock options',
      'Learning and development opportunities',
      'Annual team retreats'
    ]
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'Berlin, Germany',
    type: 'Full-time',
    level: 'Mid-level',
    description: 'Design intuitive and beautiful user experiences for our trading platform.',
    requirements: [
      '3+ years of UX/UI design experience',
      'Proficiency in Figma and design systems',
      'Experience with financial applications',
      'Strong portfolio demonstrating design thinking'
    ],
    benefits: [
      'Creative freedom',
      'Top-tier design tools',
      'Mentorship opportunities',
      'Conference attendance budget'
    ]
  }
];

const companyValues = [
  {
    icon: Heart,
    title: 'Customer First',
    description: 'We put our customers at the center of everything we do'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We constantly push boundaries and embrace new technologies'
  },
  {
    icon: Users,
    title: 'Teamwork',
    description: 'We believe in the power of collaboration and diverse perspectives'
  },
  {
    icon: Globe,
    title: 'Global Impact',
    description: 'We aim to democratize access to financial opportunities worldwide'
  }
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Join the Future of Finance
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Be part of a team that's revolutionizing how people interact with digital assets.
              Build innovative solutions that empower millions of users worldwide.
            </p>
            <Button size="lg" variant="secondary" className="gap-2">
              View Open Positions
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Company Values */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Our Values
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companyValues.map((value, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <value.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Open Positions
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Find your next opportunity with us
          </p>
        </div>

        <div className="space-y-6">
          {jobPositions.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {job.title}
                      </h3>
                      <Badge variant="secondary">{job.level}</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.department}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 mb-4">
                      {job.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                          Requirements:
                        </h4>
                        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          {job.requirements.slice(0, 2).map((req, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-600 mt-1">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                          Benefits:
                        </h4>
                        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          {job.benefits.slice(0, 2).map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="lg:ml-6">
                    <Button className="w-full lg:w-auto gap-2">
                      Apply Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Don't See Your Role?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion for innovation.
              Send us your resume and let us know how you'd like to contribute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                Send Resume
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900">
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Why Work With Us?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Growth & Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Continuous learning opportunities, mentorship programs, and conference attendance to help you grow professionally.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Global Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Work on products that are used by millions of people worldwide and shape the future of digital finance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-blue-600" />
                Work-Life Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Flexible working arrangements, generous PTO, and a culture that values your personal well-being.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}