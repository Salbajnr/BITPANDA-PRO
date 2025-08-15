
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Award, CheckCircle, Users, BarChart3, Lock, Globe, Star } from 'lucide-react';

interface ShowcaseItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  step?: number;
}

const ShowcaseItem: React.FC<ShowcaseItemProps> = ({ title, description, icon, step }) => (
  <div className="fintech-card card-content-wrapper">
    {step && (
      <div className="step-indicator">
        {step}
      </div>
    )}
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-primary to-bitpanda-green-dark flex items-center justify-center text-white">
        {icon}
      </div>
      <div>
        <h3 className="text-card-title">{title}</h3>
        <Badge variant="fintech" className="mt-1">Trusted</Badge>
      </div>
    </div>
    <p className="text-card-description">{description}</p>
  </div>
);

const TrustElement: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="text-center p-4">
    <div className="regulatory-seal mx-auto mb-3">
      {icon}
    </div>
    <div className="text-lg font-bold text-bitpanda-text">{value}</div>
    <div className="text-sm text-bitpanda-secondary">{label}</div>
  </div>
);

export const VisualIdentityShowcase: React.FC = () => {
  const features = [
    {
      title: "Bank-Grade Security",
      description: "Military-grade encryption and multi-layer security protocols protect your investments 24/7.",
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: "EU Regulated",
      description: "Licensed and regulated by European financial authorities with full compliance.",
      icon: <Award className="w-6 h-6" />
    },
    {
      title: "Trusted Platform", 
      description: "Over 4 million users trust our platform for their cryptocurrency investments.",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Advanced Analytics",
      description: "Professional-grade tools and real-time market data for informed decisions.",
      icon: <BarChart3 className="w-6 h-6" />
    }
  ];

  const steps = [
    {
      title: "Quick Registration",
      description: "Create your account in minutes with our streamlined onboarding process.",
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      title: "Secure Verification", 
      description: "Complete identity verification with our secure, automated system.",
      icon: <Lock className="w-6 h-6" />
    },
    {
      title: "Start Trading",
      description: "Begin investing immediately with our intuitive trading interface.",
      icon: <Star className="w-6 h-6" />
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="contrast-header text-center rounded-2xl mb-16">
          <div className="relative z-10">
            <Badge variant="trust" className="mb-4">
              EU REGULATED PLATFORM
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Modern Fintech Design
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Experience banking-grade security with a clean, accessible interface designed for both beginners and professionals.
            </p>
          </div>
        </div>

        {/* Trust & Security Visual Elements */}
        <div className="fintech-section rounded-2xl p-8 mb-16">
          <div className="relative z-10">
            <h3 className="text-section-header text-center mb-12">Trust & Security</h3>
            <div className="grid md:grid-cols-4 gap-8">
              <TrustElement
                label="EU License"
                value="BaFin"
                icon={<Shield className="w-8 h-8" />}
              />
              <TrustElement
                label="Insurance"
                value="€100M"
                icon={<Award className="w-8 h-8" />}
              />
              <TrustElement
                label="Users"
                value="4M+"
                icon={<Users className="w-8 h-8" />}
              />
              <TrustElement
                label="Countries"
                value="180+"
                icon={<Globe className="w-8 h-8" />}
              />
            </div>
          </div>
        </div>

        {/* Responsive Card Layouts */}
        <div className="mb-16">
          <h3 className="text-section-header-green text-center mb-12">Visual Clarity & Accessibility</h3>
          <div className="responsive-card-grid">
            {features.map((feature, index) => (
              <ShowcaseItem
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>

        {/* Step-by-Step Visual Process */}
        <div className="mb-16">
          <h3 className="text-section-header text-center mb-12">Clear Step-by-Step Process</h3>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <ShowcaseItem
                    title={step.title}
                    description={step.description}
                    icon={step.icon}
                    step={index + 1}
                  />
                  {index < steps.length - 1 && (
                    <div className="step-connector mt-6 hidden md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Button Styling */}
        <div className="text-center">
          <h3 className="text-section-header mb-8">Enhanced User Experience</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="fintech-button-primary accessible-focus">
              Get Started Now
            </Button>
            <Button className="fintech-button-secondary accessible-focus">
              Learn More
            </Button>
          </div>
          <p className="text-caption mt-6 max-w-2xl mx-auto">
            Every element is designed with accessibility in mind, featuring clear contrast ratios, 
            intuitive navigation, and responsive layouts that work seamlessly across all devices.
          </p>
        </div>

      </div>
    </div>
  );
};

export default VisualIdentityShowcase;
