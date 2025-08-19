
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  ExternalLink, 
  Calendar,
  User,
  Award,
  Newspaper,
  FileText,
  Image,
  Mail
} from "lucide-react";
import Navbar from "@/components/Navbar";

const pressReleases = [
  {
    date: "2024-03-15",
    title: "BITPANDA PRO Reaches 2 Million Users Milestone",
    excerpt: "European cryptocurrency platform continues rapid growth with expanded trading options and enhanced security features.",
    category: "Company News",
    downloadUrl: "#"
  },
  {
    date: "2024-02-28",
    title: "BITPANDA PRO Launches ETF Trading for European Investors",
    excerpt: "Platform adds over 500 ETFs to investment options, providing diversified portfolio opportunities for retail investors.",
    category: "Product Launch",
    downloadUrl: "#"
  },
  {
    date: "2024-02-10",
    title: "BITPANDA PRO Receives 'Best Crypto Platform 2024' Award",
    excerpt: "Recognition from European Financial Technology Awards highlights platform's innovation and user experience.",
    category: "Awards",
    downloadUrl: "#"
  },
  {
    date: "2024-01-22",
    title: "New Precious Metals Trading Available on BITPANDA PRO",
    excerpt: "Users can now trade gold, silver, platinum, and palladium alongside cryptocurrencies and traditional assets.",
    category: "Product Launch",
    downloadUrl: "#"
  },
  {
    date: "2024-01-08",
    title: "BITPANDA PRO Expands to Three New European Markets",
    excerpt: "Platform launches services in Poland, Czech Republic, and Hungary, increasing European presence.",
    category: "Expansion",
    downloadUrl: "#"
  }
];

const mediaAssets = [
  {
    title: "BITPANDA PRO Logo Pack",
    description: "High-resolution logos in various formats (PNG, SVG, EPS)",
    type: "Logo",
    size: "2.5 MB",
    downloadUrl: "#"
  },
  {
    title: "Executive Photos",
    description: "Professional headshots of key executives and founders",
    type: "Photos",
    size: "15 MB",
    downloadUrl: "#"
  },
  {
    title: "Product Screenshots",
    description: "High-quality screenshots of platform interface and mobile app",
    type: "Screenshots",
    size: "8.2 MB",
    downloadUrl: "#"
  },
  {
    title: "Company Fact Sheet",
    description: "Key statistics, milestones, and company information",
    type: "Document",
    size: "1.2 MB",
    downloadUrl: "#"
  }
];

const awards = [
  {
    year: "2024",
    award: "Best Crypto Platform",
    organization: "European Financial Technology Awards",
    description: "Recognized for innovation in cryptocurrency trading and user experience"
  },
  {
    year: "2023",
    award: "Most Trusted Exchange",
    organization: "Crypto Excellence Awards",
    description: "Awarded for security, regulatory compliance, and customer trust"
  },
  {
    year: "2023",
    award: "Innovation in Finance",
    organization: "Austrian FinTech Awards",
    description: "Recognition for advancing financial technology in Europe"
  },
  {
    year: "2022",
    award: "Fastest Growing Platform",
    organization: "European Crypto Awards",
    description: "Acknowledged for rapid user growth and market expansion"
  }
];

export default function Press() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Newspaper className="w-4 h-4" />
              <span>📰 Press & Media Center</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Press Center
              <span className="text-green-600 block mt-2">Latest news and resources</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Get the latest news, press releases, and media assets from BITPANDA PRO. Your source for company updates and industry insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4">
                <Mail className="w-5 h-5 mr-2" />
                Media Contact
              </Button>
              <Button variant="outline" size="lg" className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white px-8 py-4">
                <Download className="w-5 h-5 mr-2" />
                Download Media Kit
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Press Releases</h2>
            <p className="text-lg text-gray-600">Stay updated with our latest announcements and company news</p>
          </div>

          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <Card key={index} className="border border-gray-200 hover:border-green-300 transition-all duration-200 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {release.category}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(release.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{release.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{release.excerpt}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Read More
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white">
              View All Press Releases
            </Button>
          </div>
        </div>
      </section>

      {/* Media Assets */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Media Assets</h2>
            <p className="text-lg text-gray-600">Download high-quality images, logos, and brand assets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaAssets.map((asset, index) => (
              <Card key={index} className="border border-gray-200 hover:border-green-300 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          {asset.type === "Logo" && <Image className="w-5 h-5 text-green-600" />}
                          {asset.type === "Photos" && <User className="w-5 h-5 text-green-600" />}
                          {asset.type === "Screenshots" && <Image className="w-5 h-5 text-green-600" />}
                          {asset.type === "Document" && <FileText className="w-5 h-5 text-green-600" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{asset.title}</h3>
                          <p className="text-sm text-gray-500">{asset.size}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{asset.description}</p>
                    </div>

                    <Button size="sm" variant="outline" className="ml-4">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Awards & Recognition</h2>
            <p className="text-lg text-gray-600">Industry recognition for excellence and innovation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {awards.map((award, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-gray-900">{award.award}</h3>
                        <Badge variant="outline">{award.year}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{award.organization}</p>
                      <p className="text-sm text-gray-600">{award.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Media Inquiries</h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            For press inquiries, interviews, or additional information, please contact our media team.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-green-700 p-6 rounded-lg">
              <h3 className="text-white font-semibold mb-4">General Media Inquiries</h3>
              <p className="text-green-100 text-sm mb-2">Email: press@bitpanda.com</p>
              <p className="text-green-100 text-sm">Phone: +43 1 123 456 789</p>
            </div>

            <div className="bg-green-700 p-6 rounded-lg">
              <h3 className="text-white font-semibold mb-4">Executive Interviews</h3>
              <p className="text-green-100 text-sm mb-2">Email: executives@bitpanda.com</p>
              <p className="text-green-100 text-sm">Response time: 24-48 hours</p>
            </div>
          </div>

          <div className="mt-10">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-12 py-4">
              <Mail className="w-5 h-5 mr-2" />
              Contact Media Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
