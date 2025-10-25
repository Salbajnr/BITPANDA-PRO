import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldIcon, CheckCircleIcon, RotateCcwIcon, TimerIcon, ArrowLeftIcon } from "lucide-react";

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

  const handleContinue = async () => {
    if (type === 'registration') {
      // Get pending registration data from sessionStorage
      const pendingRegistrationData = sessionStorage.getItem('pendingRegistration');
      
      if (pendingRegistrationData) {
        try {
          const registrationData = JSON.parse(pendingRegistrationData);
          
          // Complete the registration
          const res = await apiRequest('/api/user/auth/register', {
            method: 'POST',
            body: registrationData
          });
          
          // Clear pending registration
          sessionStorage.removeItem('pendingRegistration');
          
          toast({
            title: "Registration Complete",
            description: "Your account has been created successfully!",
          });
          
          // Navigate to dashboard
          setLocation("/dashboard");
        } catch (error: any) {
          toast({
            title: "Registration Failed",
            description: error.message || "Unable to complete registration. Please try again.",
            variant: "destructive",
          });
          
          // Send back to auth page
          setLocation("/auth");
        }
      } else {
        // No pending registration, just go to auth
        setLocation("/auth");
      }
    } else if (type === 'password_reset') {
      setLocation(`/reset-password/${otp}`);
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
      <div className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white">Verification Complete</CardTitle>
              <CardDescription className="text-slate-400">
                Your identity has been successfully verified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-900/20 border border-green-800/50 rounded-lg">
                  <p className="text-sm text-green-300">
                    {type === 'registration' && "You can now sign in to your account"}
                    {type === 'password_reset' && "You can now reset your password"}
                    {type === '2fa' && "You can now access your account"}
                  </p>
                </div>

                <Button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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
    <div className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
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
                <ShieldIcon className="h-5 w-5 text-blue-400" />
              </div>
              {getTitle()}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {getDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-slate-300">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                  }}
                  className="text-center text-2xl font-mono tracking-widest bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                  maxLength={6}
                  required
                  data-testid="input-otp"
                />
              </div>

              <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                {timeLeft > 0 ? (
                  <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
                    <TimerIcon className="w-4 h-4" />
                    Code expires in {formatTime(timeLeft)}
                  </p>
                ) : (
                  <p className="text-sm text-red-400 flex items-center justify-center gap-2">
                    <TimerIcon className="w-4 h-4" />
                    Code has expired. Please request a new one.
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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
                  className="w-full bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
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
                <p className="text-sm text-slate-400">
                  Having trouble?{" "}
                  <Link href="/help-center">
                    <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
                      Contact Support
                    </span>
                  </Link>
                </p>
              </div>

              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}