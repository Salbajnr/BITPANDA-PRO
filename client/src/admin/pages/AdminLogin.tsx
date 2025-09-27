
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApiRequest } from "@/admin/lib/adminApiClient";
import { useLocation } from "wouter";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";

interface LoginData {
  emailOrUsername: string;
  password: string;
}

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [adminLoginForm, setAdminLoginForm] = useState<LoginData>({ emailOrUsername: "", password: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const adminLoginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await adminApiRequest("POST", "/auth/login", data);
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-auth"] });
      toast({
        title: "Admin login successful",
        description: `Welcome back, Admin ${data.admin.firstName}!`,
      });
      setLocation('/admin/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Admin login failed",
        description: error.message || "Invalid admin credentials",
        variant: "destructive",
      });
    },
  });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminLoginForm.emailOrUsername || !adminLoginForm.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    adminLoginMutation.mutate(adminLoginForm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-red-50 dark:from-red-950/20 dark:via-background dark:to-red-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">ADMIN PANEL</h1>
          <p className="text-muted-foreground">Administrative portal for BITPANDA PRO</p>
        </div>

        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">Admin Access</CardTitle>
            <CardDescription>Sign in to access the administrative dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-emailOrUsername">Email or Username</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="admin-emailOrUsername"
                    type="text"
                    placeholder="Enter admin email or username"
                    value={adminLoginForm.emailOrUsername}
                    onChange={(e) => setAdminLoginForm({ ...adminLoginForm, emailOrUsername: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={adminLoginForm.password}
                    onChange={(e) => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700" 
                disabled={adminLoginMutation.isPending}
              >
                {adminLoginMutation.isPending ? "Signing in..." : "Sign In as Admin"}
              </Button>

              <div className="text-center pt-4">
                <a
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  ← Back to Main Site
                </a>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>This page is for authorized administrators only.</p>
        </div>
      </div>
    </div>
  );
}
