import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <div 
      className="group relative bg-card border border-border rounded-xl p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent/10 fade-in overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top border animation */}
      <div className="absolute top-0 left-0 w-full h-1 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      
      {/* Icon container with background */}
      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      
      <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-3">
        {title}
      </h3>
      
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}