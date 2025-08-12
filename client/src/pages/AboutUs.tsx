
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Shield, Users, Globe, Award, TrendingUp, Lock, Zap, Heart } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { label: "Active Users", value: "2M+", icon: <Users className="h-6 w-6" /> },
    { label: "Countries Served", value: "150+", icon: <Globe className="h-6 w-6" /> },
    { label: "Daily Volume", value: "$500M+", icon: <TrendingUp className="h-6 w-6" /> },
    { label: "Years of Experience", value: "8+", icon: <Award className="h-6 w-6" /> }
  ];

  const values = [
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Security First",
      description: "We implement the highest security standards to protect your assets and personal information."
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Innovation",
      description: "Constantly evolving our platform with cutting-edge technology and features."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Customer Focus",
      description: "Your success is our success. We're committed to providing exceptional support."
    },
    {
      icon: <Lock className="h-8 w-8 text-green-500" />,
      title: "Transparency",
      description: "Open communication and honest practices in everything we do."
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      position: "CEO & Founder",
      image: "/api/placeholder/150/150",
      bio: "Former Goldman Sachs executive with 15+ years in financial technology."
    },
    {
      name: "Michael Chen",
      position: "CTO",
      image: "/api/placeholder/150/150",
      bio: "Blockchain pioneer and former lead engineer at major tech companies."
    },
    {
      name: "Elena Rodriguez",
      position: "Head of Security",
      image: "/api/placeholder/150/150",
      bio: "Cybersecurity expert with extensive experience in financial services."
    },
    {
      name: "David Kim",
      position: "Head of Trading",
      image: "/api/placeholder/150/150",
      bio: "Former hedge fund manager with deep expertise in algorithmic trading."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About BITPANDA PRO
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            We're revolutionizing the way people trade cryptocurrencies and financial instruments. 
            Our mission is to make professional trading accessible to everyone, everywhere.
          </p>
          <Button size="lg" className="mr-4">Join Our Community</Button>
          <Button size="lg" variant="outline">Learn More</Button>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Our Story Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-4xl mx-auto">
            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                Founded in 2016, BITPANDA PRO began as a vision to democratize access to professional-grade 
                trading tools. Our founders, experienced traders and technologists, recognized the gap between 
                institutional and retail trading platforms.
              </p>
              <p>
                What started as a small team in Vienna has grown into a global platform trusted by millions 
                of users worldwide. We've consistently pushed the boundaries of what's possible in financial 
                technology, introducing innovative features that empower traders at every level.
              </p>
              <p>
                Today, we continue to lead the industry with our commitment to security, innovation, and 
                user experience. Our platform processes billions of dollars in trading volume monthly, 
                serving customers across 150+ countries.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              To empower individuals worldwide with professional-grade trading tools, 
              educational resources, and secure infrastructure needed to participate 
              in the global financial markets with confidence.
            </p>
            <Button size="lg" variant="secondary">
              Start Trading Today
            </Button>
          </CardContent>
        </Card>

        {/* Regulatory Info */}
        <Card className="mt-16">
          <CardHeader>
            <CardTitle className="text-center">Regulatory Compliance</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-green-500" />
            </div>
            <p className="text-lg mb-4">
              BITPANDA PRO is fully regulated and compliant with European Union financial regulations.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Licensed and supervised by the Austrian Financial Market Authority (FMA) 
              and operates under strict European regulatory frameworks including MiFID II.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutUs;
