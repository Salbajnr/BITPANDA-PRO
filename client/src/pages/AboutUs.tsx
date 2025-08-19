
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, Award, Globe, Shield, TrendingUp, Heart, Target, Zap } from 'lucide-react';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Alexander Pangerl",
      role: "CEO & Co-Founder",
      image: "/api/placeholder/150/150",
      description: "Visionary leader with 15+ years in fintech and blockchain technology."
    },
    {
      name: "Paul Klanschek",
      role: "CTO & Co-Founder", 
      image: "/api/placeholder/150/150",
      description: "Technical architect behind our innovative trading platform and security infrastructure."
    },
    {
      name: "Sarah Mueller",
      role: "Head of Compliance",
      image: "/api/placeholder/150/150",
      description: "Regulatory expert ensuring BITPANDA PRO meets highest European standards."
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Product",
      image: "/api/placeholder/150/150",
      description: "Product strategist focused on delivering exceptional user experiences."
    }
  ];

  const milestones = [
    {
      year: "2014",
      title: "Company Founded",
      description: "BITPANDA was established in Vienna with a vision to democratize investing."
    },
    {
      year: "2019",
      title: "BITPANDA PRO Launch",
      description: "Launched professional trading platform for advanced users and institutions."
    },
    {
      year: "2021",
      title: "Series B Funding",
      description: "Raised €170M to expand across Europe and enhance platform capabilities."
    },
    {
      year: "2023",
      title: "1M+ Users",
      description: "Reached over 1 million verified users across European markets."
    },
    {
      year: "2024",
      title: "Advanced Features",
      description: "Introduced AI-powered analytics and institutional-grade trading tools."
    }
  ];

  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security First",
      description: "Bank-grade security with multi-layer protection for your digital assets."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "European Excellence",
      description: "Fully regulated and compliant with European financial standards."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "User-Centric",
      description: "Everything we build is designed with our users' needs at the center."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Innovation",
      description: "Continuously pushing boundaries in digital asset trading technology."
    }
  ];

  const stats = [
    { number: "1M+", label: "Active Users", icon: <Users className="h-6 w-6" /> },
    { number: "€50B+", label: "Trading Volume", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "27", label: "European Countries", icon: <Globe className="h-6 w-6" /> },
    { number: "99.9%", label: "Uptime", icon: <Award className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About BITPANDA PRO
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We're on a mission to democratize investing and make digital assets accessible to everyone. 
            Founded in Vienna, Austria, BITPANDA PRO has grown to become Europe's leading digital 
            asset trading platform, serving over 1 million users across 27 countries.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="h-6 w-6 text-blue-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To democratize investing by providing everyone with easy, secure, and cost-effective 
                access to digital assets. We believe that financial innovation should benefit everyone, 
                not just institutions, and we're committed to building products that empower individual 
                investors to take control of their financial future.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Award className="h-6 w-6 text-purple-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To become the most trusted and innovative digital asset platform in Europe, 
                setting the standard for security, compliance, and user experience. We envision 
                a future where digital assets are seamlessly integrated into everyday financial 
                services, enabling new forms of value creation and economic participation.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4 text-blue-600">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Company Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {milestone.year}
                  </div>
                </div>
                <Card className="flex-1 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Regulatory Compliance */}
        <Card className="mb-16 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <Shield className="h-12 w-12 text-green-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Regulatory Excellence</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  BITPANDA PRO is fully licensed and regulated by the Austrian Financial Market Authority (FMA) 
                  and operates under strict European Union financial regulations including MiFID II and GDPR.
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Licensed Investment Firm under Austrian law</li>
                  <li>• Full compliance with MiFID II regulations</li>
                  <li>• GDPR compliant data protection</li>
                  <li>• Regular audits by independent third parties</li>
                  <li>• Member of Austrian investor compensation scheme</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Want to Learn More?</h2>
            <p className="text-xl mb-6 opacity-90">
              Get in touch with our team to learn more about BITPANDA PRO 
              and how we're revolutionizing digital asset trading.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Contact Sales
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                View Careers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutUs;
