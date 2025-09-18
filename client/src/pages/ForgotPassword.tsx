
import { useState } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon, MailIcon, CheckCircleIcon, KeyIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) =>
      apiRequest('/api/auth/forgot-password', { 
        method: 'POST', 
        body: { email } 
      }),
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "If an account with that email exists, we've sent you a password reset link.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    forgotPasswordMutation.mutate(email);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
              <CardDescription className="text-slate-400">
                We've sent password reset instructions to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-slate-400 space-y-2 p-4 bg-slate-700/30 rounded-lg">
                <p className="flex items-center justify-center gap-2">
                  <MailIcon className="w-4 h-4" />
                  Check your inbox and spam folder
                </p>
                <p className="flex items-center justify-center gap-2">
                  <KeyIcon className="w-4 h-4" />
                  The reset link expires in 1 hour
                </p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button
                  onClick={() => forgotPasswordMutation.mutate(email)}
                  variant="outline"
                  disabled={forgotPasswordMutation.isPending}
                  className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                  data-testid="button-resend-email"
                >
                  {forgotPasswordMutation.isPending ? "Resending..." : "Resend Email"}
                </Button>
                
                <Link href="/auth">
                  <Button 
                    variant="ghost" 
                    className="w-full text-slate-400 hover:text-white hover:bg-slate-700/50" 
                    data-testid="button-back-to-login"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to login link */}
        <div className="mb-6">
          <Link href="/auth">
            <Button variant="ghost" className="text-slate-400 hover:text-white" size="sm">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </Link>
        </div>

        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                <MailIcon className="h-5 w-5 text-blue-400" />
              </div>
              Forgot Password
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                disabled={forgotPasswordMutation.isPending}
                data-testid="button-send-reset-link"
              >
                {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                Remember your password?{" "}
                <Link href="/auth">
                  <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
                    Sign in
                  </span>
                </Link>
              </p>
            </div>

            {/* Demo Notice */}
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800/50 rounded-lg">
              <p className="text-xs text-blue-300 text-center">
                <strong>Demo Mode:</strong> Check console for reset links in development
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
