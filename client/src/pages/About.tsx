import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useLocation } from "wouter";
import { 
  Users, Target, Award, Globe, 
  TrendingUp, Shield, Zap, Heart 
} from "lucide-react";

export default function About() {
  const [, navigate] = useLocation();

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "Your assets and data are protected with bank-grade security measures."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Cutting-edge technology powering seamless trading experiences."
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Built with traders in mind, from beginners to professionals."
    },
    {
      icon: Heart,
      title: "Trust & Transparency",
      description: "Clear communication and honest practices in everything we do."
    }
  ];

  const milestones = [
    { year: "2024", title: "Platform Launch", description: "BITPANDA PRO goes live" },
    { year: "2024", title: "100K+ Users", description: "Reached our first major milestone" },
    { year: "2024", title: "Multi-Asset Support", description: "Added metals and commodities" },
    { year: "2025", title: "Global Expansion", description: "Operating in 50+ countries" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
            About BITPANDA PRO
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Building the Future of
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"> Investing</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            BITPANDA PRO is Europe's leading investment platform, making it easy for everyone to invest in crypto, stocks, ETFs, and more.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <Target className="w-12 h-12 text-green-400 mb-4" />
              <CardTitle className="text-2xl text-white">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                To democratize access to digital assets and empower individuals worldwide with the tools and knowledge to participate in the future of finance.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <Globe className="w-12 h-12 text-purple-400 mb-4" />
              <CardTitle className="text-2xl text-white">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                A world where everyone has equal opportunity to build wealth through transparent, secure, and innovative financial technology.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                <CardContent className="p-6 text-center">
                  <value.icon className="w-10 h-10 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-slate-300 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Our Journey</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-400 mb-2">{milestone.year}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{milestone.title}</h3>
                  <p className="text-slate-300 text-sm">{milestone.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Growing Community</h2>
          <p className="text-slate-300 mb-8">Start your trading journey with BITPANDA PRO today</p>
          <Button 
            onClick={() => navigate('/auth')}
            size="lg" 
            className="bg-green-600 hover:bg-green-700"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}