import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">404</h1>
          <h2 className="text-xl font-semibold text-foreground mb-4">Page Not Found</h2>

          <p className="text-sm text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="space-y-2">
            <Button onClick={() => setLocation('/')} className="w-full">
              Go Home
            </Button>
            <Button onClick={() => window.history.back()} variant="outline" className="w-full">
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
