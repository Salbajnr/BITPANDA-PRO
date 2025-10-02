import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center">
      <Loader2 className="h-32 w-32 animate-spin text-primary mb-4" />
      <p className="text-lg text-foreground">{message}</p>
    </div>
  );
}

export { LoadingScreen };