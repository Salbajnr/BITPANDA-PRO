import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, TrendingUp, Shield, Zap } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="text-primary text-2xl mr-2" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">Eco Trading Pro</span>
            </div>
            <Button onClick={handleLogin} className="bg-primary hover:bg-primary-dark">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Professional Crypto Trading Platform
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
            Experience the future of cryptocurrency trading with real-time market data, 
            advanced analytics, and professional-grade tools designed for modern investors.
          </p>
          <Button onClick={handleLogin} size="lg" className="bg-primary hover:bg-primary-dark text-white">
            Start Trading Now
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose Eco Trading Pro?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Advanced features for professional cryptocurrency trading
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Real-Time Market Data</CardTitle>
                <CardDescription>
                  Get live cryptocurrency prices and market movements with professional-grade charts and analytics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Secure Trading</CardTitle>
                <CardDescription>
                  Bank-level security with encrypted transactions and secure wallet management for peace of mind.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Execute trades instantly with our optimized trading engine and real-time order processing.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Join thousands of traders who trust Eco Trading Pro for their cryptocurrency investments.
          </p>
          <Button onClick={handleLogin} size="lg" className="bg-primary hover:bg-primary-dark text-white">
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 dark:bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Leaf className="text-primary text-2xl mr-2" />
              <span className="text-xl font-bold">Eco Trading Pro</span>
            </div>
            <p className="text-slate-400">
              © 2024 Eco Trading Pro. Professional cryptocurrency trading platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
