
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Database, Cookie, Mail, Phone } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-300 mb-6">
              Your privacy is fundamental to us. Learn how we protect and process your personal data.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p className="text-sm text-slate-200">
                <strong>Last Updated:</strong> January 2025 | <strong>Effective Date:</strong> January 1, 2025
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Data Collection */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Database className="h-6 w-6" />
                  Data Collection & Processing
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-200 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-white">Personal Data We Collect:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Account Information:</strong> Name, email address, phone number, date of birth</li>
                    <li><strong>Identity Verification:</strong> Government ID, passport, proof of address (KYC/AML compliance)</li>
                    <li><strong>Financial Information:</strong> Bank account details, payment history, transaction records</li>
                    <li><strong>Trading Data:</strong> Portfolio holdings, trading history, investment preferences</li>
                    <li><strong>Technical Data:</strong> IP address, device information, browser type, usage analytics</li>
                    <li><strong>Communication Data:</strong> Customer service interactions, feedback, support tickets</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-white">Legal Basis for Processing:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Contract Performance:</strong> Processing necessary to provide trading services</li>
                    <li><strong>Legal Compliance:</strong> KYC, AML, tax reporting, regulatory obligations</li>
                    <li><strong>Legitimate Interest:</strong> Security, fraud prevention, service improvement</li>
                    <li><strong>Consent:</strong> Marketing communications, optional data processing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-6 w-6" />
                  Your GDPR Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-200 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-white">Data Subject Rights:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li><strong>Access:</strong> Request copies of your personal data</li>
                      <li><strong>Rectification:</strong> Correct inaccurate information</li>
                      <li><strong>Erasure:</strong> Request deletion of your data</li>
                      <li><strong>Restriction:</strong> Limit processing of your data</li>
                      <li><strong>Portability:</strong> Transfer data to another service</li>
                      <li><strong>Objection:</strong> Object to certain processing activities</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-white">How to Exercise Rights:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Email: <span className="text-blue-400">privacy@bitpanda-pro.com</span></li>
                      <li>Contact Form: Available in your account settings</li>
                      <li>Written Request: Our registered office address</li>
                      <li>Response Time: Within 30 days of receipt</li>
                      <li>Verification: Identity confirmation may be required</li>
                      <li>Appeals: Contact supervisory authority if unsatisfied</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="h-6 w-6" />
                  Data Sharing & Third Parties
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-200 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-white">We Share Data With:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Regulatory Authorities:</strong> Financial conduct authorities, tax agencies, law enforcement</li>
                    <li><strong>Service Providers:</strong> Payment processors, identity verification, cloud services</li>
                    <li><strong>Professional Advisors:</strong> Lawyers, accountants, auditors (under confidentiality)</li>
                    <li><strong>Business Partners:</strong> Liquidity providers, market data vendors (anonymized data only)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-white">International Transfers:</h4>
                  <p>We may transfer your data outside the EU/EEA to countries with adequate protection or using appropriate safeguards such as Standard Contractual Clauses (SCCs).</p>
                </div>
              </CardContent>
            </Card>

            {/* Cookies & Tracking */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Cookie className="h-6 w-6" />
                  Cookies & Tracking Technologies
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-200 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-white">Types of Cookies:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li><strong>Essential:</strong> Required for platform functionality</li>
                      <li><strong>Performance:</strong> Analytics and usage statistics</li>
                      <li><strong>Functional:</strong> Remember preferences and settings</li>
                      <li><strong>Marketing:</strong> Targeted advertising (with consent)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-white">Cookie Management:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Consent banner on first visit</li>
                      <li>Cookie preference center in settings</li>
                      <li>Browser-level cookie controls</li>
                      <li>Opt-out links for third-party tracking</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-6 w-6" />
                  Data Security & Retention
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-200 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-white">Security Measures:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>End-to-end encryption for sensitive data transmission</li>
                    <li>Multi-factor authentication and access controls</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Employee training and data handling procedures</li>
                    <li>Incident response and breach notification protocols</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-white">Data Retention Periods:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Account Data:</strong> Duration of account + 7 years (regulatory requirements)</li>
                    <li><strong>Transaction Records:</strong> 10 years from transaction date</li>
                    <li><strong>KYC Documentation:</strong> 5 years after account closure</li>
                    <li><strong>Marketing Data:</strong> Until consent withdrawal + 3 years</li>
                    <li><strong>Technical Logs:</strong> 2 years for security and debugging</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Mail className="h-6 w-6" />
                  Contact & Data Protection Officer
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-200 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-white">Data Protection Officer:</h4>
                    <ul className="space-y-1">
                      <li>Email: dpo@bitpanda-pro.com</li>
                      <li>Address: BITPANDA PRO GmbH</li>
                      <li>Kärntner Ring 12, 1010 Vienna, Austria</li>
                      <li>Phone: +43 1 234 5678</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-white">Supervisory Authority:</h4>
                    <ul className="space-y-1">
                      <li>Austrian Data Protection Authority</li>
                      <li>Wickenburggasse 8, 1080 Vienna</li>
                      <li>Email: dsb@dsb.gv.at</li>
                      <li>Phone: +43 1 531 15 202525</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Policy Updates</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-200">
                <p>
                  We may update this Privacy Policy periodically to reflect changes in our practices, 
                  technology, legal requirements, or other factors. We will notify you of material 
                  changes through email or platform notifications at least 30 days before they take effect.
                </p>
                <p className="mt-4 text-sm">
                  <strong>Version History:</strong> This is version 1.0 of our Privacy Policy, 
                  effective January 1, 2025.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
