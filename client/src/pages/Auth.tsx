import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useGlobalMessageModal } from "@/contexts/MessageModalContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, Link } from "wouter";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/lib/firebase";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  CheckCircle, 
  ArrowLeft,
  Shield,
  Sparkles,
  Chrome
} from "lucide-react";

// Assuming Navbar is a default export, this import should be adjusted if not.
// If Navbar was intended to be imported, the original code was missing its import.
// For the purpose of this fix, I will assume the import was intended and correctly
// formatted for a default export. If it was a named export, the original code
// would have had an issue with the export in Navbar.tsx itself.
// import Navbar from "@/components/Navbar.tsx"; // Uncomment and adjust path if Navbar is needed here.

interface LoginData {
  emailOrUsername: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export default function Auth() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [userLoginForm, setUserLoginForm] = useState<LoginData>({ emailOrUsername: "", password: "" });

  const [registerForm, setRegisterForm] = useState<RegisterData>({ 
    username: "", 
    email: "", 
    password: "", 
    firstName: "", 
    lastName: "", 
    phone: "" 
  });
  const { toast } = useToast();
  const { showMessage } = useGlobalMessageModal();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const userLoginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await apiRequest("POST", "/api/user/auth/login", data);
      return res;
    },
    onSuccess: async (data) => {
      showMessage(
        "Login Successful",
        `Welcome back, ${data.user.firstName}!`,
        "success"
      );
      
      // Invalidate and refetch auth state
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      await queryClient.refetchQueries({ queryKey: ["auth-user"] });
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    },
    onError: (error: any) => {
      showMessage(
        "Login Failed",
        error.message || "Invalid credentials. Please check your email/username and password.",
        "error"
      );
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/auth/send-otp", {
        email,
        type: 'registration'
      });
      return res;
    },
    onSuccess: (data, email) => {
      showMessage(
        "Verification Code Sent",
        "Please check your email for the verification code.",
        "success"
      );
      // Navigate to OTP verification page
      navigate(`/verify-otp/registration/${encodeURIComponent(email)}`);
    },
    onError: (error: any) => {
      showMessage(
        "Failed to Send Code",
        error.message || "Unable to send verification code. Please try again.",
        "error"
      );
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const res = await apiRequest("POST", "/api/user/auth/register", data);
      return res;
    },
    onSuccess: (data) => {
      showMessage(
        "Registration Successful",
        "Your account has been created successfully! Redirecting to your dashboard...",
        "success"
      );
      // Invalidate queries to refresh auth state
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      
      // Navigate using React Router
      navigate('/dashboard');
    },
    onError: (error: any) => {
      showMessage(
        "Registration Failed",
        error.message || "Unable to create your account. Please try again.",
        "error"
      );
    },
  });

  // Handle redirect in useEffect
  useEffect(() => {
    if (!authLoading && user) {
      const timer = setTimeout(() => {
        const redirectPath = user.role === 'admin' ? '/admin' : '/dashboard';
        navigate(redirectPath);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [user, authLoading, navigate]);

  // NOW conditional returns are safe (all hooks called above)
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLoginForm.emailOrUsername || !userLoginForm.password) {
      showMessage(
        "Missing Information",
        "Please fill in all fields to continue.",
        "warning"
      );
      return;
    }
    userLoginMutation.mutate(userLoginForm);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!registerForm.firstName || !registerForm.lastName || !registerForm.username || 
        !registerForm.email || !registerForm.password) {
      showMessage(
        "Missing Information",
        "Please fill in all required fields to create your account.",
        "warning"
      );
      return;
    }

    if (registerForm.password.length < 6) {
      showMessage(
        "Weak Password",
        "Your password must be at least 6 characters long for security.",
        "warning"
      );
      return;
    }

    // Store registration data in sessionStorage for later use
    sessionStorage.setItem('pendingRegistration', JSON.stringify(registerForm));
    
    // Send OTP to email for verification
    sendOtpMutation.mutate(registerForm.email);
  };

  const handleGoogleAuth = async () => {
    try {
      // Firebase sign-in
      const result = await signInWithGoogle();
      
      if (result && result.user) {
        // Get Firebase ID token
        const idToken = await result.user.getIdToken();
        
        // Sync with backend
        const syncResponse = await apiRequest("POST", "/api/auth/firebase-sync", { idToken });
        
        showMessage(
          "Login Successful",
          `Welcome${syncResponse.user?.firstName ? ', ' + syncResponse.user.firstName : ''}! Redirecting to your dashboard...`,
          "success"
        );
        
        // Invalidate queries to refresh auth state
        await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
        await queryClient.refetchQueries({ queryKey: ["auth-user"] });
        
        // Navigate to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
    } catch (error: any) {
      console.error("Google auth error:", error);
      showMessage(
        "Google Sign-In Failed",
        error.message || "Unable to sign in with Google. Please try again.",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,197,94,0.1),transparent)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Back to home link */}
          <div className="mb-8">
            <Link href="/">
              <Button 
                variant="ghost" 
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm transition-all duration-300" 
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <img
                  src="/src/assets/bitpanda-logo.svg"
                  alt="BITPANDA PRO"
                  className="w-12 h-12 drop-shadow-xl"
                />
                <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  BITPANDA PRO
                </h1>
                <div className="flex items-center justify-center mt-1">
                  <Sparkles className="w-3 h-3 text-green-400 mr-1" />
                  <span className="text-xs text-green-400 font-medium">PROFESSIONAL TRADING</span>
                </div>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Your gateway to crypto trading</p>
          </div>

          {/* Main Auth Card */}
          <Card className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border-slate-200 dark:border-slate-700/50 shadow-xl dark:shadow-2xl ring-1 ring-slate-200 dark:ring-slate-700/20">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-gray-900 dark:text-white font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                Access your trading dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 dark:bg-slate-700/30 backdrop-blur-sm border border-slate-200 dark:border-slate-600/50">
                  <TabsTrigger 
                    value="login" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-6">
                  <form onSubmit={handleUserLogin} className="space-y-5" data-testid="form-login">
                    <div className="space-y-2">
                      <Label htmlFor="emailOrUsername" className="text-gray-700 dark:text-slate-300 font-medium">
                        Email or Username
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-green-400 transition-colors" />
                        <Input
                          id="emailOrUsername"
                          type="text"
                          placeholder="Enter your email or username"
                          value={userLoginForm.emailOrUsername}
                          onChange={(e) => setUserLoginForm({ ...userLoginForm, emailOrUsername: e.target.value })}
                          className="pl-10 h-12 bg-white dark:bg-slate-700/30 border border-slate-300 dark:border-slate-600/50 text-gray-900 dark:text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                          data-testid="input-email-username"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 dark:text-slate-300 font-medium">
                        Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-green-400 transition-colors" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={userLoginForm.password}
                          onChange={(e) => setUserLoginForm({ ...userLoginForm, password: e.target.value })}
                          className="pl-10 pr-10 h-12 bg-white dark:bg-slate-700/30 border border-slate-300 dark:border-slate-600/50 text-gray-900 dark:text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                          data-testid="input-password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <Link href="/forgot-password">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-500 hover:text-green-600 hover:bg-green-100 p-0 h-auto font-medium"
                          data-testid="link-forgot-password"
                        >
                          Forgot password?
                        </Button>
                      </Link>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]" 
                      disabled={userLoginMutation.isPending}
                      data-testid="button-login"
                    >
                      {userLoginMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Signing in...
                        </div>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-300 dark:border-slate-600/50" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-slate-800/40 px-2 text-slate-500 dark:text-slate-400">Or continue with</span>
                      </div>
                    </div>

                    {/* Google Sign In */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleAuth}
                      className="w-full h-12 border-slate-300 dark:border-slate-600/50 bg-white dark:bg-slate-700/20 hover:bg-slate-50 dark:hover:bg-slate-700/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
                      data-testid="button-google-signin"
                    >
                      <Chrome className="w-5 h-5 mr-2" />
                      Sign in with Google
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-6">
                  <form onSubmit={handleRegister} className="space-y-5" data-testid="form-register">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-700 dark:text-slate-300 font-medium">
                          First Name *
                        </Label>
                        <div className="relative group">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-green-400 transition-colors" />
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            value={registerForm.firstName}
                            onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                            className="pl-10 h-12 bg-white dark:bg-slate-700/30 border border-slate-300 dark:border-slate-600/50 text-gray-900 dark:text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                            data-testid="input-firstname"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-700 dark:text-slate-300 font-medium">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={registerForm.lastName}
                          onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                          className="h-12 bg-white dark:bg-slate-700/30 border border-slate-300 dark:border-slate-600/50 text-gray-900 dark:text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                          data-testid="input-lastname"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-gray-700 dark:text-slate-300 font-medium">
                        Username *
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-green-400 transition-colors" />
                        <Input
                          id="username"
                          type="text"
                          placeholder="johndoe"
                          value={registerForm.username}
                          onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                          className="pl-10 h-12 bg-white dark:bg-slate-700/30 border border-slate-300 dark:border-slate-600/50 text-gray-900 dark:text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                          data-testid="input-username"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 dark:text-slate-300 font-medium">
                        Email *
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-green-400 transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                          className="pl-10 h-12 bg-white dark:bg-slate-700/30 border border-slate-300 dark:border-slate-600/50 text-gray-900 dark:text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                          data-testid="input-register-email"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 dark:text-slate-300 font-medium">
                        Phone (Optional)
                      </Label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-green-400 transition-colors" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={registerForm.phone}
                          onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                          className="pl-10 h-12 bg-white dark:bg-slate-700/30 border border-slate-300 dark:border-slate-600/50 text-gray-900 dark:text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                          data-testid="input-phone"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-gray-700 dark:text-slate-300 font-medium">
                        Password *
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-green-400 transition-colors" />
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password (min. 6 characters)"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                          className="pl-10 pr-10 h-12 bg-white dark:bg-slate-700/30 border border-slate-300 dark:border-slate-600/50 text-gray-900 dark:text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                          data-testid="input-register-password"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                          data-testid="button-toggle-register-password"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-4 border border-slate-200 dark:border-slate-600/30">
                      <p className="text-xs text-gray-700 dark:text-slate-400 font-medium mb-2">Password requirements:</p>
                      <ul className="text-xs text-gray-600 dark:text-slate-400 space-y-1">
                        <li className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                          At least 6 characters long
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                          Mix of letters and numbers recommended
                        </li>
                      </ul>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]" 
                      disabled={sendOtpMutation.isPending || registerMutation.isPending}
                      data-testid="button-register"
                    >
                      {sendOtpMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Sending verification code...
                        </div>
                      ) : registerMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Creating account...
                        </div>
                      ) : (
                        <>
                          <User className="w-4 h-4 mr-2" />
                          Create Account
                        </>
                      )}
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-300 dark:border-slate-600/50" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-slate-800/40 px-2 text-slate-500 dark:text-slate-400">Or continue with</span>
                      </div>
                    </div>

                    {/* Google Sign Up */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleAuth}
                      className="w-full h-12 border-slate-300 dark:border-slate-600/50 bg-white dark:bg-slate-700/20 hover:bg-slate-50 dark:hover:bg-slate-700/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
                      data-testid="button-google-signup"
                    >
                      <Chrome className="w-5 h-5 mr-2" />
                      Sign up with Google
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Security Notice */}
              <div className="bg-gradient-to-r from-blue-50/50 to-green-50/50 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-300 font-medium mb-1">Secure & Professional</p>
                    <p className="text-xs text-blue-500/80 dark:text-blue-400/80 leading-relaxed">
                      Your data is protected with enterprise-grade security. Experience professional crypto trading with BITPANDA PRO.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}