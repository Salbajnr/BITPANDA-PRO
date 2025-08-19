
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin,
  Shield,
  Scale,
  Globe
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Imprint() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Scale className="w-4 h-4" />
              <span>🇦🇹 Austrian Financial Market Authority regulated</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Legal Information
              <span className="text-green-600 block mt-2">Imprint & Company Details</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Legal information and regulatory details for BITPANDA PRO Technology GmbH
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Company Information */}
            <Card className="border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Building className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">BITPANDA PRO Technology GmbH</h3>
                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p>Campus 2, Jakov-Lind-Straße 2</p>
                          <p>1020 Vienna, Austria</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-green-600" />
                        <p>+43 1 123 456 789</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-green-600" />
                        <p>legal@bitpanda.com</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-green-600" />
                        <p>www.bitpanda.com</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Legal Details</h3>
                    <div className="space-y-3 text-gray-600">
                      <div>
                        <span className="font-medium">Commercial Register:</span>
                        <p>FN 423018 k</p>
                      </div>
                      
                      <div>
                        <span className="font-medium">Register Court:</span>
                        <p>Commercial Court Vienna</p>
                      </div>
                      
                      <div>
                        <span className="font-medium">VAT Number:</span>
                        <p>ATU68776402</p>
                      </div>
                      
                      <div>
                        <span className="font-medium">Business Purpose:</span>
                        <p>Financial Technology Services</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Management */}
            <Card className="border border-gray-200">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Management Board</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Eric Demuth</h3>
                    <p className="text-gray-600">Chief Executive Officer</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Paul Klanschek</h3>
                    <p className="text-gray-600">Chief Technology Officer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regulatory Information */}
            <Card className="border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Regulatory Information</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Financial Market Authority (FMA)</h3>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-gray-700 mb-2">
                        BITPANDA PRO Technology GmbH is licensed and regulated by the Austrian Financial Market Authority (FMA).
                      </p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">License Number:</span> BMF-IG-23/2017</p>
                        <p><span className="font-medium">License Type:</span> Payment Institution</p>
                        <p><span className="font-medium">Regulatory Authority:</span> Finanzmarktaufsicht (FMA)</p>
                        <p><span className="font-medium">Authority Address:</span> Otto-Wagner-Platz 5, 1090 Vienna, Austria</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Deposit Protection</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        Customer deposits are protected up to €100,000 per customer by the Austrian Deposit Guarantee Scheme 
                        in accordance with the Austrian Banking Act.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Supervision</h3>
                    <p className="text-gray-700">
                      Our activities are supervised by the Austrian Financial Market Authority (FMA) and 
                      comply with European Union financial regulations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="border border-gray-200">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Important Information</h2>
                
                <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                  <p>
                    <strong>Risk Warning:</strong> Trading in cryptocurrencies, stocks, and other financial instruments 
                    involves substantial risk and may not be suitable for all investors. Past performance is not indicative 
                    of future results. You should carefully consider whether trading is suitable for you in light of your 
                    circumstances, knowledge, and financial resources.
                  </p>
                  
                  <p>
                    <strong>No Investment Advice:</strong> The information provided on this platform does not constitute 
                    investment advice, financial advice, trading advice, or any other sort of advice. You should not treat 
                    any of the platform content as such.
                  </p>
                  
                  <p>
                    <strong>Jurisdiction:</strong> This website is operated from Austria and is intended for users in 
                    jurisdictions where such use is permitted by local law. Users are responsible for compliance with 
                    applicable local laws and regulations.
                  </p>
                  
                  <p>
                    <strong>Copyright:</strong> All content, trademarks, and intellectual property on this website are 
                    owned by BITPANDA PRO Technology GmbH unless otherwise indicated. Unauthorized use is prohibited.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border border-gray-200">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact & Support</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">General Inquiries</h3>
                    <p className="text-gray-600 text-sm">support@bitpanda.com</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Scale className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Legal & Compliance</h3>
                    <p className="text-gray-600 text-sm">legal@bitpanda.com</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
                    <p className="text-gray-600 text-sm">security@bitpanda.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
