
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  Book, 
  Key, 
  Shield, 
  Zap,
  Copy,
  ExternalLink,
  CheckCircle,
  Terminal,
  Globe,
  Lock
} from "lucide-react";
import Navbar from "@/components/Navbar";

const apiEndpoints = [
  {
    method: "GET",
    endpoint: "/api/v1/markets",
    description: "Get all available markets and trading pairs",
    parameters: [
      { name: "limit", type: "integer", description: "Number of results (max 100)" },
      { name: "offset", type: "integer", description: "Pagination offset" }
    ]
  },
  {
    method: "GET",
    endpoint: "/api/v1/ticker/{symbol}",
    description: "Get real-time price data for a specific symbol",
    parameters: [
      { name: "symbol", type: "string", description: "Trading pair symbol (e.g., BTC-EUR)" }
    ]
  },
  {
    method: "POST",
    endpoint: "/api/v1/orders",
    description: "Place a new order",
    parameters: [
      { name: "symbol", type: "string", description: "Trading pair symbol" },
      { name: "side", type: "string", description: "Order side (buy/sell)" },
      { name: "type", type: "string", description: "Order type (market/limit)" },
      { name: "amount", type: "decimal", description: "Order amount" }
    ]
  },
  {
    method: "GET",
    endpoint: "/api/v1/account/balance",
    description: "Get account balance information",
    parameters: []
  },
  {
    method: "GET",
    endpoint: "/api/v1/orders",
    description: "Get order history",
    parameters: [
      { name: "status", type: "string", description: "Filter by order status" },
      { name: "limit", type: "integer", description: "Number of results" }
    ]
  }
];

const codeExamples = {
  javascript: `// Initialize BITPANDA PRO API client
// Authentication with BITPANDA PRO API
const headers = {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
};

// Get market data
const response = await fetch('https://api.bitpandapro.com/v1/markets', {
  headers
});
const markets = await response.json();

// Place a buy order
const order = await client.createOrder({
  symbol: 'BTC-EUR',
  side: 'buy',
  type: 'market',
  amount: 0.01
});`,
  python: `# Install: pip install bitpanda-pro-api
from bitpanda_pro import BitpandaProClient

client = BitpandaProClient(
    api_key='your-api-key',
    api_secret='your-api-secret',
    sandbox=True
)

# Get market data
markets = client.get_markets()
print(markets)

# Place a buy order
order = client.create_order(
    symbol='BTC-EUR',
    side='buy',
    order_type='market',
    amount=0.01
)`,
  curl: `# Get market data
curl -X GET "https://api.bitpanda.com/v1/markets" \\
  -H "X-API-KEY: your-api-key" \\
  -H "Content-Type: application/json"

# Place an order
curl -X POST "https://api.bitpanda.com/v1/orders" \\
  -H "X-API-KEY: your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "symbol": "BTC-EUR",
    "side": "buy",
    "type": "market",
    "amount": "0.01"
  }'`
};

export default function ApiDocumentation() {
  const [activeCode, setActiveCode] = useState("javascript");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Code className="w-4 h-4" />
              <span>🚀 RESTful API with WebSocket support</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              BITPANDA PRO API
              <span className="text-green-600 block mt-2">Build powerful trading applications</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Access our full suite of trading and market data APIs. Build custom applications, trading bots, and integrate BITPANDA PRO into your systems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4">
                Get API Key
              </Button>
              <Button variant="outline" size="lg" className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white px-8 py-4">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Start</h2>
            <p className="text-lg text-gray-600">Get started with the BITPANDA PRO API in minutes</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Code Examples</h3>
              
              <Tabs value={activeCode} onValueChange={setActiveCode} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>
                
                {Object.entries(codeExamples).map(([lang, code]) => (
                  <TabsContent key={lang} value={lang}>
                    <div className="relative">
                      <pre className="bg-gray-900 text-green-400 p-6 rounded-lg text-sm overflow-x-auto">
                        <code>{code}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-green-400 hover:text-green-300"
                        onClick={() => copyToClipboard(code)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Getting Started Steps</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Create API Keys</h4>
                    <p className="text-gray-600">Generate your API key and secret in your account settings</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Install SDK</h4>
                    <p className="text-gray-600">Use our official SDKs or make direct HTTP requests</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Make Your First Call</h4>
                    <p className="text-gray-600">Start with public endpoints, then authenticate for trading</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Go Live</h4>
                    <p className="text-gray-600">Test in sandbox, then switch to production</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">API Endpoints</h2>
            <p className="text-lg text-gray-600">Core endpoints for trading and market data</p>
          </div>

          <div className="space-y-4">
            {apiEndpoints.map((endpoint, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant={endpoint.method === "GET" ? "secondary" : "default"} 
                               className={endpoint.method === "GET" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-lg font-mono font-semibold text-gray-900">{endpoint.endpoint}</code>
                      </div>
                      <p className="text-gray-600 mb-4">{endpoint.description}</p>
                      
                      {endpoint.parameters.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Parameters:</h4>
                          <div className="space-y-1">
                            {endpoint.parameters.map((param, idx) => (
                              <div key={idx} className="text-sm">
                                <code className="text-green-600 font-mono">{param.name}</code>
                                <span className="text-gray-500 mx-2">({param.type})</span>
                                <span className="text-gray-600">{param.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Button variant="outline" size="sm">
                        Try it out
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">API Features</h2>
            <p className="text-xl text-gray-600">Everything you need for professional trading applications</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">High Performance</h3>
              <p className="text-gray-600">Low latency trading with real-time WebSocket feeds</p>
            </Card>

            <Card className="text-center p-8 border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure</h3>
              <p className="text-gray-600">Industry-standard security with API key authentication</p>
            </Card>

            <Card className="text-center p-8 border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Access</h3>
              <p className="text-gray-600">Access all BITPANDA PRO markets and features via API</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to start building?</h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Get your API keys and start integrating BITPANDA PRO into your applications today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-12 py-4">
              Get API Keys
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600 px-12 py-4">
              Read Documentation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
