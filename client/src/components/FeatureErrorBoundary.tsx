
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

interface FeatureErrorBoundaryProps {
  children: React.ReactNode;
  featureName?: string;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showErrorDetails?: boolean;
}

interface FeatureErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  isDismissed: boolean;
}

export class FeatureErrorBoundary extends React.Component<
  FeatureErrorBoundaryProps,
  FeatureErrorBoundaryState
> {
  constructor(props: FeatureErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      isDismissed: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<FeatureErrorBoundaryState> {
    console.error('FeatureErrorBoundary: Error caught', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { featureName, onError } = this.props;
    
    console.error(`FeatureErrorBoundary [${featureName || 'Unknown Feature'}]:`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    this.setState({ errorInfo });

    if (onError) {
      onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      isDismissed: false
    });
  };

  handleDismiss = () => {
    this.setState({ isDismissed: true });
  };

  render() {
    const { children, featureName, fallback, showErrorDetails = false } = this.props;
    const { hasError, error, errorInfo, isDismissed } = this.state;

    if (hasError && !isDismissed) {
      // Use custom fallback if provided
      if (fallback) {
        return <>{fallback}</>;
      }

      // Default error UI
      return (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
                  {featureName ? `${featureName} Error` : 'Feature Error'}
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  This feature encountered an error and couldn't load properly. 
                  You can try reloading it or continue using other features.
                </p>

                {showErrorDetails && error && import.meta.env.DEV && (
                  <details className="mb-3">
                    <summary className="cursor-pointer text-xs text-red-600 dark:text-red-400 hover:underline">
                      Error Details (Development)
                    </summary>
                    <pre className="mt-2 text-xs bg-red-100 dark:bg-red-900/20 p-2 rounded overflow-auto max-h-32 text-red-800 dark:text-red-200">
                      {error.message}
                      {error.stack && '\n\n' + error.stack}
                      {errorInfo?.componentStack && '\n\nComponent Stack:' + errorInfo.componentStack}
                    </pre>
                  </details>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    onClick={this.handleRetry}
                    size="sm"
                    variant="outline"
                    className="text-red-700 border-red-300 hover:bg-red-100 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/20"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                  <Button
                    onClick={this.handleDismiss}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // If dismissed, don't render anything
    if (isDismissed) {
      return null;
    }

    return children;
  }
}
