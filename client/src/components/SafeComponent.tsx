
import React from 'react';
import { FeatureErrorBoundary } from './FeatureErrorBoundary';

interface SafeComponentProps {
  children: React.ReactNode;
  name?: string;
  fallback?: React.ReactNode;
  showErrorDetails?: boolean;
}

/**
 * A wrapper component that catches errors in child components
 * without crashing the entire application
 */
export function SafeComponent({ 
  children, 
  name, 
  fallback,
  showErrorDetails = false 
}: SafeComponentProps) {
  return (
    <FeatureErrorBoundary 
      featureName={name}
      fallback={fallback}
      showErrorDetails={showErrorDetails}
    >
      {children}
    </FeatureErrorBoundary>
  );
}

/**
 * HOC to wrap any component with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    name?: string;
    fallback?: React.ReactNode;
    showErrorDetails?: boolean;
  }
) {
  return function SafeWrappedComponent(props: P) {
    return (
      <FeatureErrorBoundary 
        featureName={options?.name || Component.displayName || Component.name}
        fallback={options?.fallback}
        showErrorDetails={options?.showErrorDetails}
      >
        <Component {...props} />
      </FeatureErrorBoundary>
    );
  };
}
