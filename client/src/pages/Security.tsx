
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Shield, 
  Smartphone, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle,
  Lock,
  Award,
  Users,
  Globe,
  FileCheck,
  Zap,
  Clock,
  Database,
  Server,
  Layers
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function Security() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      // API call to change password would go here
      toast({
        title: "Success",
        description: "Password changed successfully",
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      });
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      // API call to enable/disable 2FA would go here
      setTwoFactorEnabled(enabled);
      toast({
        title: "Success",
        description: enabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update two-factor authentication",
        variant: "destructive",
      });
    }
  };

  const securityFeatures = [
    {
      title: "Financial Transparency",
      description: "We are a leading crypto investment platform, we believe in doing things the right way, not the easy way, which is why we choose to be fully transparent, and to have our funds and business practices regularly validated by external parties.",
      status: "active",
      icon: <FileCheck className="h-8 w-8" />
    },
    {
      title: "User Data Protection",
      description: "BitpandaPro only processes your personal data for the purposes permitted according to data protection laws. We do not use personal data for automated decision-making, including profiling, and we have several security measures in place to make sure your data is safely stored and processed.",
      status: "active",
      icon: <Shield className="h-8 w-8" />
    },
    {
      title: "Asset Protection",
      description: "We prioritise keeping your assets safe, incorporating multiple security measures to protect them from potential threats. Crypto assets are stored in highly-secure cold storage facilities that are examined by an external auditor. Your assets are yours.",
      status: "active",
      icon: <Database className="h-8 w-8" />
    },
    {
      title: "Advanced Encryption",
      description: "BitpandaPro infrastructure and systems are secured with the most modern encryption technologies and supported by our dedicated security teams.",
      status: "active",
      icon: <Lock className="h-8 w-8" />
    },
    {
      title: "24/7 Coverage",
      description: "As the markets are open 24/7, so are we. Our Operations, Security and Engineering teams operate on a 24/7 coverage model to respond to any changes within the markets.",
      status: "active",
      icon: <Clock className="h-8 w-8" />
    }
  ];

  const certifications = [
    {
      title: "ISO 27001 Certified",
      description: "Best-in-class security certification proving our commitment to industry standards",
      badge: "ISO 27001",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    },
    {
      title: "SOC 2 Type 1",
      description: "Demonstrates our ongoing commitment to the highest security and compliance standards",
      badge: "SOC 2",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    }
  ];

  const benefitStats = [
    {
      title: "+7,000,000",
      description: "users",
      icon: <Users className="h-8 w-8 text-white" />
    },
    {
      title: "7.7k",
      description: "trusted reviews",
      icon: <Award className="h-8 w-8 text-white" />
    },
    {
      title: "All",
      description: "our funds are regularly validated",
      icon: <Shield className="h-8 w-8 text-white" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section - Bitpanda Style */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold uppercase tracking-tight">
                Why your assets are safe with us
              </h1>
              <p className="text-lg lg:text-xl text-green-100">
                Customer safety is our first goal - this is how we approach security.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-64 h-64 lg:w-80 lg:h-80 bg-green-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-32 h-32 lg:w-40 lg:h-40 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefitStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Security Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 uppercase">
              Security at BitpandaPro
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 uppercase">
              Best-in-class Security
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Possessing internally maintained security programs is one thing, but having them measure up to industry standards and validating them by achieving best-in-class certifications is another.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <Badge className={`mb-4 ${cert.color}`}>
                    {cert.badge}
                  </Badge>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {cert.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {cert.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Security Settings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 uppercase">
                Keeping your account secure
              </h2>
            </div>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Key className="h-5 w-5" />
                  Password Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5" />
                  Two-Factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={handleTwoFactorToggle}
                  />
                </div>

                {twoFactorEnabled && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Two-factor authentication is enabled
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Receive security alerts via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Receive security alerts via SMS
                    </p>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Overview Sidebar */}
          <div className="space-y-6">
            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Security</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Strong
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Security Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Use a unique, strong password with at least 8 characters
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Enable two-factor authentication for extra security
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Keep your contact information updated
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Review your account activity regularly
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Never share your API keys with anyone
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Use different keys for different applications
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Additional Security Features */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Security</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                      <Server className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">Cold Storage</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Funds stored offline for maximum security
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">Global Compliance</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Meeting international security standards
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">Multi-Layer Security</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Multiple security layers protect your assets
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
