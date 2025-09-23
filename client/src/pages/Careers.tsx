
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Briefcase, Heart, Globe, Zap, Target } from 'lucide-react';

const jobOpenings = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Vienna, Austria",
    type: "Full-time",
    description: "Join our core platform team to build the next generation of crypto trading infrastructure.",
    requirements: ["5+ years experience", "React & Node.js", "PostgreSQL", "Microservices"],
    remote: true
  },
  {
    id: 2,
    title: "Blockchain Security Engineer",
    department: "Security",
    location: "Remote Europe",
    type: "Full-time", 
    description: "Ensure the highest security standards for our cryptocurrency platform and user funds.",
    requirements: ["Blockchain security expertise", "Smart contract auditing", "Penetration testing", "DeFi protocols"],
    remote: true
  },
  {
    id: 3,
    title: "Senior Product Manager",
    department: "Product",
    location: "Vienna, Austria",
    type: "Full-time",
    description: "Drive product strategy and roadmap for our trading and investment products.",
    requirements: ["5+ years product management", "Fintech experience", "Data-driven approach", "User research"],
    remote: false
  },
  {
    id: 4,
    title: "Compliance Specialist",
    department: "Legal & Compliance",
    location: "Vienna, Austria", 
    type: "Full-time",
    description: "Navigate regulatory requirements across European markets for crypto asset services.",
    requirements: ["Legal/compliance background", "EU financial regulations", "MiCA knowledge", "Risk assessment"],
    remote: false
  },
  {
    id: 5,
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Remote Europe",
    type: "Full-time",
    description: "Scale our infrastructure to handle millions of users and high-frequency trading.",
    requirements: ["Kubernetes", "AWS/GCP", "CI/CD pipelines", "Monitoring & alerting"],
    remote: true
  },
  {
    id: 6,
    title: "UX/UI Designer",
    department: "Design",
    location: "Vienna, Austria",
    type: "Full-time",
    description: "Create intuitive and beautiful experiences for complex financial products.",
    requirements: ["5+ years UX/UI design", "Fintech experience", "Design systems", "User testing"],
    remote: true
  }
];

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health insurance, mental health support, and wellness programs"
  },
  {
    icon: Globe,
    title: "Remote-First Culture",
    description: "Work from anywhere in Europe with flexible hours and quarterly team meetups"
  },
  {
    icon: Zap,
    title: "Learning & Development",
    description: "Annual learning budget, conference attendance, and internal knowledge sharing"
  },
  {
    icon: Target,
    title: "Equity & Bonuses",
    description: "Competitive salary, performance bonuses, and equity participation in company growth"
  },
  {
    icon: Users,
    title: "Inclusive Environment",
    description: "Diverse team from 30+ countries with focus on psychological safety and inclusion"
  },
  {
    icon: Briefcase,
    title: "Career Growth",
    description: "Clear progression paths, mentorship programs, and leadership development opportunities"
  }
];

const Careers: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Join the Future of
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"> Finance</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Help us democratize access to digital assets and build the infrastructure for the next generation of financial services.
          </p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
            View Open Positions
          </Button>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Work at BITPANDA PRO?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              We're building the most trusted and innovative crypto platform in Europe, with a team that values excellence, innovation, and user-centricity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-slate-300">
              Join our team of world-class professionals building the future of finance
            </p>
          </div>

          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">
                          {job.title}
                        </h3>
                        <Badge variant="secondary" className="bg-green-600 text-white">
                          {job.department}
                        </Badge>
                        {job.remote && (
                          <Badge variant="outline" className="border-blue-400 text-blue-400">
                            Remote OK
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-slate-300 text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </div>
                      </div>

                      <p className="text-slate-300 mb-3">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="border-slate-500 text-slate-300">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Hiring Process
            </h2>
            <p className="text-lg text-slate-300">
              We believe in a fair, transparent, and efficient hiring process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Apply</h3>
              <p className="text-slate-300 text-sm">
                Submit your application with CV and cover letter
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Screen</h3>
              <p className="text-slate-300 text-sm">
                Initial call with HR to discuss your background and interests
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Interview</h3>
              <p className="text-slate-300 text-sm">
                Technical and cultural fit interviews with the team
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Offer</h3>
              <p className="text-slate-300 text-sm">
                Receive your offer and join our amazing team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Don't See Your Perfect Role?
              </h2>
              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                We're always looking for exceptional talent. Send us your CV and let us know how you'd like to contribute to the future of finance.
              </p>
              <Button size="lg" variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100">
                Send Us Your CV
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Careers;
