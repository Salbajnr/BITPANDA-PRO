
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { 
  Code, 
  Key, 
  Book, 
  Zap,
  Shield,
  Globe,
  Copy,
  ExternalLink,
  Terminal,
  Database,
  Settings,
  CheckCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function API() {
  const [activeEndpoint, setActiveEndpoint] = useState('market-data');

  const endpoints = [
    {
      id: 'market-data',
      title: 'Market Data',
      method: 'GET',
      path: '/api/v1/market-data',
      description: 'Real-time cryptocurrency market data',
      response: `{
  "data": [
    {
      "symbol": "BTC",
      "price": 43256.78,
      "change_24h": 2.45,
      "volume": 28394857392
    }
  ]
}`
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      method: 'GET',
      path: '/api/v1/portfolio',
      description: 'User portfolio information',
      response: `{
  "portfolio": {
    "total_value": 15420.67,
    "available_cash": 5420.67,
    "holdings": [...]
  }
}`
    },
    {
      id: 'trading',
      title: 'Execute Trade',
      method: 'POST',
      path: '/api/v1/trading/execute',
      description: 'Execute buy or sell orders',
      response: `{
  "order_id": "ord_123456",
  "status": "executed",
  "amount": 0.5,
  "price": 43256.78
}`
    }
  ];

  const codeExamples = {
    javascript: `// JavaScript/Node.js
const response = await fetch('https://api.bitpandapro.com/v1/market-data', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,
    python: `# Python
import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.bitpandapro.com/v1/market-data',
    headers=headers
)

data = response.json()
print(data)`,
    curl: `# cURL
curl -X GET "https://api.bitpandapro.com/v1/market-data" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Code className="w-4 h-4" />
              <span>🚀 REST API v1.0</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Developer API
              <span className="text-blue-600 block mt-2">Build with BITPANDA PRO</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Powerful REST API for building trading applications, portfolio management tools, 
              and market data integrations. Get started in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4">
                <Key className="w-5 h-5 mr-2" />
                Get API Key
              </Button>
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white px-8 py-4">
                <Book className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Data</h3>
              <p className="text-sm text-gray-600">Live market data with WebSocket support</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
              <p className="text-sm text-gray-600">OAuth 2.0 and API key authentication</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Comprehensive</h3>
              <p className="text-sm text-gray-600">Full trading and portfolio management</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Global</h3>
              <p className="text-sm text-gray-600">99.9% uptime with global CDN</p>
            </div>
          </div>
        </div>
      </section>

      {/* API Documentation */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {endpoints.map((endpoint) => (
                      <button
                        key={endpoint.id}
                        onClick={() => setActiveEndpoint(endpoint.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          activeEndpoint === endpoint.id
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{endpoint.title}</div>
                            <div className="text-sm text-gray-500">{endpoint.path}</div>
                          </div>
                          <Badge variant={endpoint.method === 'GET' ? 'default' : 'destructive'}>
                            {endpoint.method}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Rate Limits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Public endpoints:</span>
                      <span className="text-sm font-medium">100/min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Private endpoints:</span>
                      <span className="text-sm font-medium">1000/min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">WebSocket:</span>
                      <span className="text-sm font-medium">No limit</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="examples">Code Examples</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>
                          {endpoints.find(e => e.id === activeEndpoint)?.title}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Badge variant={endpoints.find(e => e.id === activeEndpoint)?.method === 'GET' ? 'default' : 'destructive'}>
                            {endpoints.find(e => e.id === activeEndpoint)?.method}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Endpoint</h4>
                          <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                            {endpoints.find(e => e.id === activeEndpoint)?.path}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Description</h4>
                          <p className="text-gray-600">
                            {endpoints.find(e => e.id === activeEndpoint)?.description}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Authentication</h4>
                          <p className="text-gray-600 text-sm">
                            Requires API key in Authorization header: Bearer YOUR_API_KEY
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="examples" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Code Examples</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="javascript" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                          <TabsTrigger value="python">Python</TabsTrigger>
                          <TabsTrigger value="curl">cURL</TabsTrigger>
                        </TabsList>

                        {Object.entries(codeExamples).map(([lang, code]) => (
                          <TabsContent key={lang} value={lang} className="mt-4">
                            <div className="relative">
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                                <code>{code}</code>
                              </pre>
                              <Button
                                size="sm"
                                variant="outline"
                                className="absolute top-2 right-2"
                                onClick={() => navigator.clipboard.writeText(code)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="response" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Example Response</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{endpoints.find(e => e.id === activeEndpoint)?.response}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => navigator.clipboard.writeText(endpoints.find(e => e.id === activeEndpoint)?.response || '')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Getting Started</h2>
            <p className="text-lg text-gray-600">Start building with our API in just a few steps</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Create an Account</h3>
                <p className="text-gray-600">Sign up for a BITPANDA PRO developer account to get started.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Generate API Key</h3>
                <p className="text-gray-600">Create your API key from the developer dashboard with appropriate permissions.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Make Your First Call</h3>
                <p className="text-gray-600">Test the API with our interactive documentation and start building.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Building?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of developers using our API to build the next generation of trading applications.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-12 py-4">
              <Key className="w-5 h-5 mr-2" />
              Get API Access
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-12 py-4">
              <ExternalLink className="w-5 h-5 mr-2" />
              View Full Docs
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
