
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Shield, Users, Globe, Award, TrendingUp, Lock, Zap, Heart, CheckCircle } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { label: "Team Members", value: "700+", icon: <Users className="h-6 w-6" /> },
    { label: "Nationalities", value: "50+", icon: <Globe className="h-6 w-6" /> },
    { label: "Active Users", value: "7M+", icon: <TrendingUp className="h-6 w-6" /> },
    { label: "Years Experience", value: "8+", icon: <Award className="h-6 w-6" /> }
  ];

  const founders = [
    {
      name: "Eric Demuth",
      position: "CEO & Co-Founder",
      image: "/client/src/assets/IMG_5624.jpeg",
      bio: "Visionary leader with extensive experience in fintech and digital transformation.",
      twitter: "@eric_demuth"
    },
    {
      name: "Paul Klanschek", 
      position: "CEO & Co-Founder",
      image: "/client/src/assets/IMG_5625.jpeg",
      bio: "Technology expert driving innovation in cryptocurrency and blockchain solutions.",
      twitter: "@TwinWinNerD"
    },
    {
      name: "Christian Trummer",
      position: "Chief Scientist",
      image: "/client/src/assets/IMG_5626.jpeg", 
      bio: "Research leader advancing the scientific foundations of digital asset trading.",
      twitter: "@christiant5r"
    }
  ];

  const values = [
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Security First",
      description: "We implement the highest security standards to protect your assets and personal information with state-of-the-art technology."
    },
    {
      icon: <Zap className="h-8 w-8 text-green-500" />,
      title: "Innovation",
      description: "Constantly evolving our platform with cutting-edge technology and pioneering new solutions in digital finance."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Customer Focus", 
      description: "Your success is our success. We're committed to providing exceptional support and user-centric solutions."
    },
    {
      icon: <Lock className="h-8 w-8 text-purple-500" />,
      title: "Transparency",
      description: "Open communication and honest practices in everything we do, building trust through accountability."
    }
  ];

  const features = [
    "Buy, sell or swap 3,000+ digital assets like crypto, stocks, precious metals, ETFs and crypto indices",
    "Automate regular investments with savings plans",
    "Invest in any asset on BitpandaPro from €1",
    "Wide range of payment and payout providers",
    "Use EUR, CHF, GBP, USD, PLN, DKK, SEK, HUF or CZK to pay or cash out",
    "Fully regulated and compliant with European Union financial regulations"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Investing. Now available to everyone.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
            At BitpandaPro, we see investing differently. Today's financial system is complex, exclusive and expensive - making it hard for the typical person to start investing. So, we're building a platform without digital walls and complex barriers. A platform that empowers you to see new possibilities for your money - and helps make them a reality.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button size="lg" className="mr-4">Join Our Community</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>

        {/* Founders Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Founders</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {founders.map((founder, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    <img 
                      src={founder.image} 
                      alt={founder.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.innerHTML = `<span class="text-white text-2xl font-bold">${founder.name.split(' ').map(n => n[0]).join('')}</span>`;
                      }}
                    />
                  </div>
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{founder.position}</span>
                  <h3 className="font-semibold text-lg mb-1">{founder.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{founder.bio}</p>
                  <a href={`https://twitter.com/${founder.twitter.replace('@', '')}`} 
                     className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                    {founder.twitter}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4 text-blue-500">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-2 text-blue-600">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Who We Are Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Who We Are</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-4xl mx-auto">
            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                BitpandaPro was founded in 2014 in Vienna, Austria with the aim of making investing accessible for everyone. Our goal since day one was to reimagine what it means to invest, by making simple, easy-to-use financial products for everyone.
              </p>
              <p>
                Now, with more than 700 team members and 7 million users, we're one of the most successful fintechs in Europe. With a PSD2 payment service provider licence and E-Money licence, state-of-the-art security and streamlined user experience, we make it possible for both first-time investors and seasoned experts to invest in what they believe in.
              </p>
              <p>
                Our user-friendly, trade-everything platform empowers you to invest in the stocks, cryptocurrencies, metals, commodities and crypto indices you want — with any amount of money.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="mb-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">We're changing the way the world views investing</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              BitpandaPro is backed by a team of world-class experts and the best technology talent. To stay at the forefront of innovation, we're always working on strengthening our position as Europe's leading retail investment platform.
            </p>
            <Button size="lg" variant="secondary">
              Join Our Team
            </Button>
          </CardContent>
        </Card>

        {/* What We Do Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-6">What We Do</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-12 max-w-4xl mx-auto">
            Our user-friendly, trade-everything platform empowers you to invest in the stocks, cryptocurrencies and metals you want, with any amount of money.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">{feature}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Start Investing Today
            </Button>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
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

        {/* Mission Statement */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white mb-16">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              To empower individuals worldwide with professional-grade trading tools, educational resources, and secure infrastructure needed to participate in the global financial markets with confidence.
            </p>
            <Button size="lg" variant="secondary">
              Start Trading Today
            </Button>
          </CardContent>
        </Card>

        {/* Regulatory Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Regulatory Compliance</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-green-500" />
            </div>
            <p className="text-lg mb-4">
              BitpandaPro GmbH is a registered digital assets service provider with the Austrian Financial Market Authority (FMA).
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Licensed and supervised by the Austrian Financial Market Authority (FMA) under FM-GwG and with the French Autorité des marchés financiers (AMF) under PACTE law. The BitpandaPro Payments GmbH holds a PSD2 licence.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutUs;
