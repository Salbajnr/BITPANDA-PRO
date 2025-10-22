
import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldIcon, CheckCircleIcon, RotateCcwIcon, TimerIcon, ArrowLeftIcon, Sparkles } from "lucide-react";

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
      const pendingRegistrationData = sessionStorage.getItem('pendingRegistration');
      
      if (pendingRegistrationData) {
        try {
          const registrationData = JSON.parse(pendingRegistrationData);
          
          const res = await apiRequest('/api/user/auth/register', {
            method: 'POST',
            body: registrationData
          });
          
          sessionStorage.removeItem('pendingRegistration');
          
          toast({
            title: "Registration Complete",
            description: "Your account has been created successfully!",
          });
          
          setLocation("/dashboard");
        } catch (error: any) {
          toast({
            title: "Registration Failed",
            description: error.message || "Unable to complete registration. Please try again.",
            variant: "destructive",
          });
          
          setLocation("/auth");
        }
      } else {
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
      <div className="min-h-screen bg-white dark:bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,197,94,0.1),transparent)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        
        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <Card className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border-slate-200 dark:border-slate-700/50 shadow-xl dark:shadow-2xl">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="h-8 w-8 text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">Verification Complete</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Your identity has been successfully verified
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {type === 'registration' && "You can now sign in to your account"}
                      {type === 'password_reset' && "You can now reset your password"}
                      {type === '2fa' && "You can now access your account"}
                    </p>
                  </div>

                  <Button
                    onClick={handleContinue}
                    className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                    data-testid="button-continue"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,197,94,0.1),transparent)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/auth">
              <Button
                variant="ghost"
                className="text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm transition-all duration-300"
                size="sm"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>

          <Card className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border-slate-200 dark:border-slate-700/50 shadow-xl dark:shadow-2xl">
            <CardHeader>
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="relative">
                    <img
                      src="/bitpanda-logo.svg"
                      alt="BITPANDA PRO"
                      className="w-12 h-12 drop-shadow-xl"
                    />
                    <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                      BITPANDA PRO
                    </h1>
                    <div className="flex items-center justify-center mt-1">
                      <Sparkles className="w-3 h-3 text-green-400 mr-1" />
                      <span className="text-xs text-green-400 font-medium">SECURE VERIFICATION</span>
                    </div>
                  </div>
                </div>
              </div>
              <CardTitle className="flex items-center text-gray-900 dark:text-white justify-center">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                  <ShieldIcon className="h-5 w-5 text-blue-400" />
                </div>
                {getTitle()}
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 text-center">
                {getDescription()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-gray-700 dark:text-slate-300">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(value);
                    }}
                    className="text-center text-2xl font-mono tracking-widest bg-white dark:bg-slate-700/30 border-slate-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 h-14"
                    maxLength={6}
                    required
                    data-testid="input-otp"
                  />
                </div>

                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600/50">
                  {timeLeft > 0 ? (
                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
                      <TimerIcon className="w-4 h-4" />
                      Code expires in {formatTime(timeLeft)}
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                      <TimerIcon className="w-4 h-4" />
                      Code has expired. Please request a new one.
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
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
                    disabled={resendOtpMutation.isPending || timeLeft > 240}
                    className="w-full bg-white dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600/50"
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
                    <Link href="/help-center">
                      <span className="text-blue-500 hover:text-blue-600 cursor-pointer font-medium">
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
    </div>
  );
}
