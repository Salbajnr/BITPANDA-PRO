
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Shield, 
  Lock, 
  Award, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Users,
  Globe,
  Phone,
  Mail
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function InvestorProtection() {
  const protectionMeasures = [
    {
      title: "Regulatory Compliance",
      description: "Fully licensed and regulated by the Austrian Financial Market Authority (FMA)",
      icon: <Award className="w-6 h-6 text-blue-600" />,
      details: [
        "MiFID II compliance",
        "Regular regulatory audits",
        "Transparent reporting",
        "Client asset protection"
      ]
    },
    {
      title: "Segregated Client Assets",
      description: "Your funds are kept separate from company assets in segregated accounts",
      icon: <Lock className="w-6 h-6 text-green-600" />,
      details: [
        "Bank-level security",
        "Separate custody accounts",
        "Daily reconciliation",
        "Protected from creditors"
      ]
    },
    {
      title: "Deposit Guarantee",
      description: "Coverage through Austrian investor compensation scheme",
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      details: [
        "Up to €20,000 coverage",
        "EU deposit protection",
        "Quick claim process",
        "Automatic enrollment"
      ]
    },
    {
      title: "Risk Disclosure",
      description: "Clear information about investment risks and market conditions",
      icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
      details: [
        "Comprehensive risk warnings",
        "Educational materials",
        "Market volatility alerts",
        "Suitability assessments"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Shield className="w-4 h-4" />
              <span>🛡️ EU Regulated Platform</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Investor Protection
              <span className="text-blue-600 block mt-2">Your Security is Our Priority</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              BITPANDA PRO operates under strict European regulations to ensure your investments 
              are protected and your rights as an investor are safeguarded.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4">
                <FileText className="w-5 h-5 mr-2" />
                View Regulations
              </Button>
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white px-8 py-4">
                <Phone className="w-5 h-5 mr-2" />
                Contact Compliance
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Protection Measures */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Protect You</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple layers of protection ensure your investments and personal data are secure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {protectionMeasures.map((measure, index) => (
              <Card key={index} className="border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                      {measure.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{measure.title}</h3>
                      <p className="text-gray-600 mb-4">{measure.description}</p>
                      <div className="space-y-2">
                        {measure.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory Information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Regulatory Framework</h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Austrian Financial Market Authority (FMA)</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Licensed as an investment firm under Austrian law with passport rights across the EU.
                    </p>
                    <Badge className="bg-green-100 text-green-800">License Number: 123456</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">MiFID II Compliance</h3>
                    <p className="text-gray-600 text-sm">
                      Full compliance with the Markets in Financial Instruments Directive, ensuring 
                      transparent pricing and best execution.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Data Protection (GDPR)</h3>
                    <p className="text-gray-600 text-sm">
                      Strict adherence to European data protection regulations for your privacy and security.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Rights</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Right to Information</h4>
                    <p className="text-sm text-gray-600">Clear disclosure of all costs, risks, and terms</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Right to Fair Treatment</h4>
                    <p className="text-sm text-gray-600">Equal access to services and best execution of orders</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Right to Complaint</h4>
                    <p className="text-sm text-gray-600">Free access to ombudsman and complaint procedures</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Right to Compensation</h4>
                    <p className="text-sm text-gray-600">Coverage under investor protection schemes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Questions About Investor Protection?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Our compliance team is here to help you understand your rights and protections.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
            <div className="bg-blue-700 p-6 rounded-lg">
              <h3 className="text-white font-semibold mb-4">Compliance Team</h3>
              <p className="text-blue-100 text-sm mb-2">Email: compliance@bitpanda.com</p>
              <p className="text-blue-100 text-sm">Phone: +43 1 123 456 789</p>
            </div>

            <div className="bg-blue-700 p-6 rounded-lg">
              <h3 className="text-white font-semibold mb-4">Ombudsman</h3>
              <p className="text-blue-100 text-sm mb-2">Independent complaint resolution</p>
              <p className="text-blue-100 text-sm">Free and binding decisions</p>
            </div>
          </div>

          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-12 py-4">
            <Mail className="w-5 h-5 mr-2" />
            Contact Compliance Team
          </Button>
        </div>
      </section>
    </div>
  );
}
