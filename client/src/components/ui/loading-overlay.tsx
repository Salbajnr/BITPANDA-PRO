
import { LoadingScreen } from "@/components/LoadingScreen";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export function LoadingOverlay({ isLoading, message, progress }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
          <div className="flex flex-col items-center space-y-6">
            {/* Animated logo */}
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center animate-pulse">
              <img
                src="/src/assets/bitpanda-logo.svg"
                alt="BITPANDA PRO"
                className="w-10 h-10"
              />
            </div>

            {/* Spinner */}
            <div className="relative">
              <div className="w-12 h-12 border-4 border-muted rounded-full animate-spin">
                <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
              </div>
            </div>

            {/* Message */}
            <div className="text-center space-y-2">
              <p className="text-foreground font-medium">
                {message || "Loading..."}
              </p>
              {progress !== undefined && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
