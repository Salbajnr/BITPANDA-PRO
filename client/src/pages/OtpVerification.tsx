import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldIcon, CheckCircleIcon, RotateCcwIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function OtpVerification() {
  const { type, email } = useParams<{ type: string; email: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isSuccess, setIsSuccess] = useState(false);

  const decodedEmail = decodeURIComponent(email || "");

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const verifyOtpMutation = useMutation({
    mutationFn: (data: { email: string; token: string; type: string }) =>
      apiRequest('/api/auth/verify-otp', { 
        method: 'POST', 
        body: data 
      }),
    onSuccess: () => {
      setIsSuccess(true);
      toast({
        title: "Verification successful",
        description: "Your OTP has been verified successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid OTP code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: (data: { email: string; type: string }) =>
      apiRequest('/api/auth/resend-otp', { 
        method: 'POST', 
        body: data 
      }),
    onSuccess: () => {
      setTimeLeft(300); // Reset timer
      setOtp(""); // Clear OTP input
      toast({
        title: "OTP resent",
        description: "A new verification code has been sent to your email.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to resend",
        description: error.message || "Could not resend OTP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    if (!type || !decodedEmail) {
      toast({
        title: "Invalid verification link",
        description: "This verification link is invalid or malformed",
        variant: "destructive",
      });
      return;
    }

    verifyOtpMutation.mutate({ 
      email: decodedEmail, 
      token: otp, 
      type: type as 'registration' | 'password_reset' | '2fa'
    });
  };

  const handleResend = () => {
    if (!type || !decodedEmail) {
      toast({
        title: "Cannot resend",
        description: "Invalid email or verification type",
        variant: "destructive",
      });
      return;
    }

    resendOtpMutation.mutate({ 
      email: decodedEmail, 
      type: type as 'registration' | 'password_reset' | '2fa'
    });
  };

  const handleContinue = () => {
    if (type === 'registration') {
      setLocation("/auth");
    } else if (type === 'password_reset') {
      setLocation("/auth");
    } else {
      setLocation("/dashboard");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTitle = () => {
    switch (type) {
      case 'registration':
        return 'Complete Registration';
      case 'password_reset':
        return 'Verify Reset Code';
      case '2fa':
        return 'Two-Factor Authentication';
      default:
        return 'Verify Your Identity';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'registration':
        return `We've sent a verification code to ${decodedEmail} to complete your registration.`;
      case 'password_reset':
        return `Enter the verification code sent to ${decodedEmail} to continue with password reset.`;
      case '2fa':
        return `Enter the verification code sent to ${decodedEmail} for additional security.`;
      default:
        return `Enter the verification code sent to ${decodedEmail}.`;
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircleIcon className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Verification Complete</CardTitle>
              <CardDescription>
                Your identity has been successfully verified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {type === 'registration' && "You can now sign in to your account"}
                  {type === 'password_reset' && "You can now reset your password"}
                  {type === '2fa' && "You can now access your account"}
                </p>
                
                <Button 
                  onClick={handleContinue}
                  className="w-full bg-green-600 hover:bg-green-700"
                  data-testid="button-continue"
                >
                  Continue
                </Button>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldIcon className="mr-2 h-5 w-5" />
              {getTitle()}
            </CardTitle>
            <CardDescription>
              {getDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                  }}
                  className="text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                  required
                  data-testid="input-otp"
                />
              </div>

              <div className="text-center">
                {timeLeft > 0 ? (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Code expires in {formatTime(timeLeft)}
                  </p>
                ) : (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Code has expired. Please request a new one.
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={verifyOtpMutation.isPending || otp.length !== 6}
                data-testid="button-verify-otp"
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
            
            <div className="mt-6 space-y-3">
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={handleResend}
                  disabled={resendOtpMutation.isPending || timeLeft > 240} // Allow resend after 1 minute
                  className="w-full"
                  data-testid="button-resend-otp"
                >
                  <RotateCcwIcon className="h-4 w-4 mr-2" />
                  {resendOtpMutation.isPending ? "Resending..." : "Resend Code"}
                </Button>
                {timeLeft > 240 && (
                  <p className="text-xs text-slate-500 mt-1">
                    Wait {formatTime(timeLeft - 240)} before requesting a new code
                  </p>
                )}
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Having trouble?{" "}
                  <Link href="/support">
                    <span className="text-primary hover:underline cursor-pointer">
                      Contact Support
                    </span>
                  </Link>
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Demo Mode:</strong> Use test codes: 123456, 111111, or 000000
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}