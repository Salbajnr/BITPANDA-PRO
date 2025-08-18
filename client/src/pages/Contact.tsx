import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Mail, Phone, MapPin, Clock, 
  MessageSquare, HelpCircle, Shield, Users 
} from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <LiveTicker />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-black mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our platform? Need help with your account? 
            Our team is here to assist you 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-black">
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        type="text"
                        placeholder="John"
                        className="border-gray-300 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        type="text"
                        placeholder="Doe"
                        className="border-gray-300 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="border-gray-300 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="How can we help you?"
                      className="border-gray-300 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your question or issue in detail..."
                      rows={6}
                      className="border-gray-300 focus:border-green-500"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-black">
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-black">Email Support</h3>
                    <p className="text-gray-600">support@bitpandapro.com</p>
                    <p className="text-sm text-gray-500">Response within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-black">Phone Support</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Available 24/7</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MessageSquare className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-black">Live Chat</h3>
                    <p className="text-gray-600">Available on our platform</p>
                    <p className="text-sm text-gray-500">Instant response</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-black">Headquarters</h3>
                    <p className="text-gray-600">
                      123 Financial District<br />
                      New York, NY 10004<br />
                      United States
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-black flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-green-500" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium text-black">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium text-black">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium text-black">Closed</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Note:</strong> Our trading platform and live chat support 
                    are available 24/7, even outside business hours.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Help */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-black">
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium text-black">FAQ</h4>
                    <p className="text-sm text-gray-600">Find answers to common questions</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-500" />
                  <div>
                    <h4 className="font-medium text-black">Security Center</h4>
                    <p className="text-sm text-gray-600">Learn about our security measures</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-purple-500" />
                  <div>
                    <h4 className="font-medium text-black">Community</h4>
                    <p className="text-sm text-gray-600">Join our user community</p>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full border-green-500 text-green-600 hover:bg-green-50"
                >
                  Visit Help Center
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
