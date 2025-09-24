import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, Phone, MapPin, MessageCircle, Clock, 
  Building, Users, Globe, Shield, Award
} from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              We're here to help. Reach out through any of our contact methods 
              and our expert team will assist you promptly.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Methods */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Get in Touch</CardTitle>
                  <CardDescription className="text-slate-300">
                    Multiple ways to reach our support team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Live Chat</h4>
                      <p className="text-sm text-slate-300 mb-2">
                        Available 24/7 for immediate assistance
                      </p>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Start Chat
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Email Support</h4>
                      <p className="text-sm text-slate-300 mb-1">
                        support@bitpanda-pro.com
                      </p>
                      <p className="text-xs text-slate-400">
                        Response within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Phone Support</h4>
                      <p className="text-sm text-slate-300 mb-1">
                        +43 1 234 5678
                      </p>
                      <p className="text-xs text-slate-400">
                        Mon-Fri, 9:00-18:00 CET
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Office Information */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Building className="h-5 w-5" />
                    Office Locations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Headquarters</h4>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-slate-400 mt-1 flex-shrink-0" />
                      <div className="text-sm text-slate-300">
                        <p>BITPANDA PRO GmbH</p>
                        <p>Kärntner Ring 12</p>
                        <p>1010 Vienna, Austria</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">London Office</h4>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-slate-400 mt-1 flex-shrink-0" />
                      <div className="text-sm text-slate-300">
                        <p>25 Old Broad Street</p>
                        <p>London EC2N 1HN</p>
                        <p>United Kingdom</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Clock className="h-5 w-5" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>Live Chat:</span>
                    <span>24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone Support:</span>
                    <span>Mon-Fri, 9:00-18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span>24-hour response</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency:</span>
                    <span>24/7</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Send us a Message</CardTitle>
                  <CardDescription className="text-slate-300">
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        First Name *
                      </label>
                      <Input 
                        placeholder="Your first name"
                        className="bg-white/5 border-white/20 text-white placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Last Name *
                      </label>
                      <Input 
                        placeholder="Your last name"
                        className="bg-white/5 border-white/20 text-white placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Email Address *
                      </label>
                      <Input 
                        type="email"
                        placeholder="your.email@example.com"
                        className="bg-white/5 border-white/20 text-white placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Phone Number
                      </label>
                      <Input 
                        type="tel"
                        placeholder="+43 1 234 5678"
                        className="bg-white/5 border-white/20 text-white placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Subject *
                    </label>
                    <Input 
                      placeholder="Brief description of your inquiry"
                      className="bg-white/5 border-white/20 text-white placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Department
                    </label>
                    <select className="w-full p-2 rounded-md bg-white/5 border border-white/20 text-white">
                      <option value="">Select a department</option>
                      <option value="support">General Support</option>
                      <option value="technical">Technical Issues</option>
                      <option value="account">Account Management</option>
                      <option value="trading">Trading Support</option>
                      <option value="security">Security Concerns</option>
                      <option value="compliance">Compliance & Legal</option>
                      <option value="business">Business Inquiries</option>
                      <option value="press">Press & Media</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Message *
                    </label>
                    <Textarea 
                      placeholder="Please provide detailed information about your inquiry..."
                      rows={6}
                      className="bg-white/5 border-white/20 text-white placeholder-slate-400"
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="privacy" 
                      className="mt-1"
                    />
                    <label htmlFor="privacy" className="text-sm text-slate-300">
                      I agree to the processing of my personal data in accordance with the{" "}
                      <a href="/privacy" className="text-blue-400 hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
                  <CardContent className="pt-6">
                    <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                    <h4 className="font-semibold text-white mb-1">Expert Team</h4>
                    <p className="text-xs text-slate-300">
                      Our certified professionals are here to help
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
                  <CardContent className="pt-6">
                    <Globe className="h-8 w-8 text-green-400 mx-auto mb-3" />
                    <h4 className="font-semibold text-white mb-1">Global Reach</h4>
                    <p className="text-xs text-slate-300">
                      Serving customers worldwide, 24/7
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
                  <CardContent className="pt-6">
                    <Shield className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                    <h4 className="font-semibold text-white mb-1">Secure Communication</h4>
                    <p className="text-xs text-slate-300">
                      All communications are encrypted
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}