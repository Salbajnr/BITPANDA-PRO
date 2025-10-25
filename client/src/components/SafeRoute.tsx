
import { ErrorBoundary } from './ErrorBoundary';
import { ReactNode } from 'react';

interface SafeRouteProps {
  children: ReactNode;
}

export function SafeRoute({ children }: SafeRouteProps) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
