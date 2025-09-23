
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Users, Award, Globe, Shield, TrendingUp, Heart, Target, Zap,
  Building, MapPin, Mail, Phone, Calendar, CheckCircle, ExternalLink
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function AboutUs() {
  const stats = [
    { number: "500K+", label: "Active Users", icon: <Users className="h-6 w-6" /> },
    { number: "€2B+", label: "Trading Volume", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "27", label: "European Countries", icon: <Globe className="h-6 w-6" /> },
    { number: "99.9%", label: "Uptime", icon: <Award className="h-6 w-6" /> }
  ];

  const teamMembers = [
    {
      name: "Alexander Pangerl",
      role: "CEO & Co-Founder",
      description: "Visionary leader with 15+ years in fintech and blockchain technology. Previously led digital transformation at major European banks.",
      expertise: ["FinTech Strategy", "Digital Banking", "Blockchain Innovation"]
    },
    {
      name: "Paul Klanschek",
      role: "CTO & Co-Founder", 
      description: "Technical architect behind our innovative trading platform and security infrastructure. Former senior engineer at leading tech companies.",
      expertise: ["System Architecture", "Cybersecurity", "Platform Engineering"]
    },
    {
      name: "Sarah Mueller",
      role: "Head of Compliance",
      description: "Regulatory expert ensuring BITPANDA PRO meets highest European standards. 12+ years in financial services compliance.",
      expertise: ["EU Financial Regulation", "Risk Management", "Compliance Operations"]
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Product",
      description: "Product strategist focused on delivering exceptional user experiences. Expert in user-centered design and product development.",
      expertise: ["Product Strategy", "User Experience", "Market Research"]
    },
    {
      name: "Dr. Lisa Chen",
      role: "Head of Research",
      description: "Leading our market research and educational content development. PhD in Economics with focus on digital currencies.",
      expertise: ["Market Analysis", "Educational Content", "Economic Research"]
    },
    {
      name: "Thomas Weber",
      role: "Head of Security",
      description: "Cybersecurity expert ensuring platform safety and user protection. Former security consultant for major financial institutions.",
      expertise: ["Cybersecurity", "Risk Assessment", "Infrastructure Security"]
    }
  ];

  const milestones = [
    {
      year: "2014",
      title: "Company Founded",
      description: "BITPANDA was established in Vienna with a vision to democratize investing and make digital assets accessible to everyone."
    },
    {
      year: "2017",
      title: "European Expansion",
      description: "Expanded operations across Europe, obtaining regulatory licenses and building partnerships with local financial institutions."
    },
    {
      year: "2019",
      title: "BITPANDA PRO Launch",
      description: "Launched professional trading platform for advanced users, institutions, and educational purposes with advanced features."
    },
    {
      year: "2021",
      title: "Series B Funding",
      description: "Raised €170M in Series B funding to accelerate growth, expand product offerings, and enhance platform capabilities."
    },
    {
      year: "2022",
      title: "Educational Initiative",
      description: "Launched comprehensive educational programs and simulation platform to improve financial literacy across Europe."
    },
    {
      year: "2023",
      title: "500K+ Users Milestone",
      description: "Reached over 500,000 verified users across European markets, establishing ourselves as a leading platform."
    },
    {
      year: "2024",
      title: "Advanced Features & AI",
      description: "Introduced AI-powered analytics, advanced trading tools, and expanded educational resources for professional development."
    }
  ];

  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security First",
      description: "Bank-grade security with multi-layer protection, regular audits, and comprehensive insurance coverage for peace of mind."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "European Excellence",
      description: "Fully regulated and compliant with European financial standards, operating under strict regulatory oversight."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "User-Centric Design",
      description: "Everything we build is designed with our users' needs at the center, ensuring intuitive and accessible experiences."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Innovation & Technology",
      description: "Continuously pushing boundaries in digital asset technology while maintaining stability and reliability."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Focus",
      description: "Building a strong community of learners and investors through education, support, and shared knowledge."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Educational Mission",
      description: "Committed to improving financial literacy and providing accessible education about digital assets and investing."
    }
  ];

  const offices = [
    {
      city: "Vienna",
      country: "Austria",
      type: "Headquarters",
      address: "Campus 2, Jakov-Lind-Straße 2, 1020 Vienna",
      employees: 200,
      established: "2014"
    },
    {
      city: "London",
      country: "United Kingdom",
      type: "European Operations",
      address: "25 Old Broad Street, London EC2N 1HN",
      employees: 80,
      established: "2018"
    },
    {
      city: "Barcelona",
      country: "Spain",
      type: "Southern Europe Hub",
      address: "Carrer de Mallorca, 401, 08013 Barcelona",
      employees: 60,
      established: "2020"
    }
  ];

  const certifications = [
    "ISO 27001 - Information Security Management",
    "SOC 2 Type II - Security & Availability",
    "PCI DSS Level 1 - Payment Card Industry",
    "GDPR Compliant - Data Protection",
    "Austrian FMA Licensed",
    "EU MiFID II Compliant"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Building className="w-4 h-4" />
              <span>🏢 About BITPANDA PRO</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Democratizing
              <span className="text-blue-600 block mt-2">Digital Asset Education</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              We're on a mission to make digital asset education accessible to everyone. 
              Founded in Vienna, Austria, BITPANDA PRO has grown to become Europe's leading 
              cryptocurrency education and simulation platform, serving over 500,000 users across 27 countries.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                Founded in 2014
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-green-500" />
                500K+ users served
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-2 text-purple-500" />
                EU regulated platform
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-blue-600" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">
                  To democratize financial education by providing everyone with easy, secure, and cost-effective 
                  access to digital asset learning. We believe that financial innovation should benefit everyone, 
                  not just institutions.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We're committed to building educational tools that empower individuals 
                  to understand and navigate the digital financial landscape with confidence and knowledge.
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
                <p className="text-gray-600 leading-relaxed mb-4">
                  To become the most trusted and innovative digital asset education platform in Europe, 
                  setting the standard for financial literacy, security, and user experience.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We envision a future where digital financial literacy is universal, 
                  enabling new forms of economic participation and financial empowerment for all.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6 text-blue-600">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A decade of innovation and growth in digital asset education
            </p>
          </div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {milestone.year}
                  </div>
                </div>
                <Card className="flex-1 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the experts driving our mission forward
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {member.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {member.expertise.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Global Offices */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Global Presence</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our offices across Europe serving our diverse community
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{office.city}, {office.country}</h3>
                      <Badge variant="outline">{office.type}</Badge>
                    </div>
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                      {office.address}
                    </p>
                    <p className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      {office.employees} employees
                    </p>
                    <p className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      Established {office.established}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory Compliance */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex-shrink-0">
                  <Shield className="h-16 w-16 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">Regulatory Excellence & Compliance</h2>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    BITPANDA PRO operates under strict European Union regulations and maintains the highest 
                    standards of compliance, security, and user protection. Our commitment to regulatory 
                    excellence ensures a safe and trustworthy environment for all users.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Join Our Mission</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Be part of the digital asset education revolution. Whether you're learning, 
            building, or leading, there's a place for you at BITPANDA PRO.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              <Users className="w-5 h-5 mr-2" />
              Join Our Team
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
