import React from 'react';

interface StepIndicatorProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}

export function StepIndicator({ number, title, description, isLast = false }: StepIndicatorProps) {
  return (
    <div className="relative bg-card border border-border rounded-xl p-6 fade-in">
      {/* Arrow connector (hidden on mobile) */}
      {!isLast && (
        <div className="absolute right-0 top-1/2 transform translate-x-5 -translate-y-1/2 text-accent text-2xl font-bold hidden lg:block">
          →
        </div>
      )}
      
      {/* Step number */}
      <div className="inline-flex items-center justify-center w-10 h-10 border-2 border-accent rounded-full text-accent font-bold text-lg mb-4 bg-accent/10">
        {number}
      </div>
      
      <div className="space-y-2">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}