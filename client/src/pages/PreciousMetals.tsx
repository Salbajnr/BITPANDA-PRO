
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Star,
  DollarSign,
  Shield,
  Coins,
  Award,
  BarChart3
} from "lucide-react";
import Navbar from "@/components/Navbar";

const metals = [
  { 
    symbol: "XAU", 
    name: "Gold", 
    price: 2045.67, 
    change: 1.8,
    unit: "per oz",
    description: "Store of value and hedge against inflation",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100"
  },
  { 
    symbol: "XAG", 
    name: "Silver", 
    price: 24.89, 
    change: -0.5,
    unit: "per oz", 
    description: "Industrial metal with investment appeal",
    color: "text-gray-600",
    bgColor: "bg-gray-100"
  },
  { 
    symbol: "XPT", 
    name: "Platinum", 
    price: 1056.34, 
    change: 2.3,
    unit: "per oz",
    description: "Rare metal used in automotive industry",
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  { 
    symbol: "XPD", 
    name: "Palladium", 
    price: 1234.78, 
    change: -1.2,
    unit: "per oz",
    description: "Critical for automotive catalysts",
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  }
];

export default function PreciousMetals() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Precious Metals</h1>
          <p className="text-xl text-gray-600">
            Protect your wealth with physical precious metals investment
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-gray-200">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inflation Hedge</h3>
              <p className="text-gray-600">Protect your purchasing power against currency devaluation</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Physical Ownership</h3>
              <p className="text-gray-600">Own allocated precious metals stored in secure vaults</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Diversification</h3>
              <p className="text-gray-600">Add non-correlated assets to your investment portfolio</p>
            </CardContent>
          </Card>
        </div>

        {/* Market Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metals.map((metal, index) => (
              <Card key={metal.symbol} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${metal.bgColor} rounded-lg flex items-center justify-center`}>
                      <Coins className={`w-6 h-6 ${metal.color}`} />
                    </div>
                    <Button variant="ghost" size="sm">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 text-lg">{metal.name}</h3>
                    <p className="text-sm text-gray-500 uppercase">{metal.symbol}</p>
                  </div>

                  <div className="mb-4">
                    <div className="font-bold text-gray-900 text-xl">
                      ${metal.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{metal.unit}</div>
                    <div className={`text-sm flex items-center font-medium mt-1 ${
                      metal.change >= 0 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {metal.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {metal.change >= 0 ? '+' : ''}{metal.change}%
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{metal.description}</p>

                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Buy {metal.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How it works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Metal</h3>
              <p className="text-gray-600">Select from gold, silver, platinum, or palladium based on your investment goals</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Purchase & Store</h3>
              <p className="text-gray-600">We purchase and store your metals in secure, insured vaults on your behalf</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sell Anytime</h3>
              <p className="text-gray-600">Sell your holdings instantly at current market prices whenever you want</p>
            </div>
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-blue-50 rounded-lg p-8 mb-8">
          <div className="text-center mb-6">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your metals are safe</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All precious metals are stored in high-security vaults and are fully insured. 
              You own allocated metal, not a paper certificate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Secure Storage</h4>
                <p className="text-sm text-gray-600">High-security vaults in multiple locations</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                <Award className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Fully Insured</h4>
                <p className="text-sm text-gray-600">Comprehensive insurance coverage</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                <Coins className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Allocated Metal</h4>
                <p className="text-sm text-gray-600">You own specific, identified metal bars</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Regular Audits</h4>
                <p className="text-sm text-gray-600">Independent third-party audits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Start investing in precious metals today
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Diversify your portfolio and protect your wealth with physical precious metals. 
            Start from just €25 with no storage fees for the first year.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white px-8">
              Start Investing
            </Button>
            <Button size="lg" variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-white px-8">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
