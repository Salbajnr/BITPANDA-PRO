
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, Smartphone, Key, Globe, Clock, CheckCircle, 
  AlertTriangle, Lock, Unlock, Monitor, Eye, EyeOff 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function Security() {
  const { user } = useAuth();
  const [show2FACode, setShow2FACode] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [withdrawalConfirmation, setWithdrawalConfirmation] = useState(true);

  // Mock security data
  const securityEvents = [
    {
      id: 1,
      type: "login",
      description: "Successful login",
      location: "New York, US",
      ip: "192.168.1.1",
      device: "Chrome on Windows",
      timestamp: "2024-01-15T10:30:00Z",
      status: "success"
    },
    {
      id: 2,
      type: "password_change",
      description: "Password changed",
      location: "New York, US",
      ip: "192.168.1.1",
      device: "Chrome on Windows",
      timestamp: "2024-01-14T15:45:00Z",
      status: "success"
    },
    {
      id: 3,
      type: "failed_login",
      description: "Failed login attempt",
      location: "Unknown",
      ip: "45.123.45.67",
      device: "Unknown",
      timestamp: "2024-01-13T20:15:00Z",
      status: "warning"
    }
  ];

  const activeDevices = [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "New York, US",
      ip: "192.168.1.1",
      lastActive: "2024-01-15T10:30:00Z",
      current: true
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "New York, US",
      ip: "192.168.1.2",
      lastActive: "2024-01-14T18:20:00Z",
      current: false
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Access Denied</h2>
          <p className="text-slate-600 dark:text-slate-400">Please log in to access security settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300">
      <Navbar />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Security Center</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage your account security and privacy settings
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Security Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Security Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">85/100</div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">Good Security Level</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Strong Password
                        </span>
                        <span className="text-green-600">+20</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          Email Verified
                        </span>
                        <span className="text-green-600">+15</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                          2FA Disabled
                        </span>
                        <span className="text-yellow-600">-15</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Security Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Enable 2FA
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Monitor className="h-4 w-4 mr-2" />
                    Review Active Sessions
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Globe className="h-4 w-4 mr-2" />
                    Download Security Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Two-Factor Authentication */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="h-5 w-5 mr-2" />
                  Two-Factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Authenticator App</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Add an extra layer of security using an authenticator app
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
                
                {twoFactorEnabled && (
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Setup Instructions:</h4>
                    <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      <li>1. Download an authenticator app (Google Authenticator, Authy)</li>
                      <li>2. Scan the QR code below with your app</li>
                      <li>3. Enter the 6-digit code to verify</li>
                    </ol>
                    
                    <div className="mt-4 p-4 bg-white dark:bg-slate-700 rounded border text-center">
                      <div className="w-32 h-32 bg-slate-200 dark:bg-slate-600 mx-auto mb-2 rounded"></div>
                      <p className="text-xs text-slate-500">QR Code will appear here</p>
                    </div>
                    
                    <div className="mt-4">
                      <Label htmlFor="verification-code">Verification Code</Label>
                      <div className="flex space-x-2 mt-1">
                        <Input 
                          id="verification-code"
                          type={show2FACode ? "text" : "password"}
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShow2FACode(!show2FACode)}
                        >
                          {show2FACode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button size="sm">Verify</Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Security Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Login Notifications</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Get notified of new login attempts
                    </p>
                  </div>
                  <Switch
                    checked={loginNotifications}
                    onCheckedChange={setLoginNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Withdrawal Confirmation</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Require email confirmation for withdrawals
                    </p>
                  </div>
                  <Switch
                    checked={withdrawalConfirmation}
                    onCheckedChange={setWithdrawalConfirmation}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="flex items-center">
                        <Monitor className="h-8 w-8 text-slate-400 mr-3" />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white flex items-center">
                            {device.device}
                            {device.current && (
                              <Badge variant="default" className="ml-2 text-xs">Current</Badge>
                            )}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {device.location} • {device.ip}
                          </div>
                          <div className="text-xs text-slate-500">
                            Last active: {new Date(device.lastActive).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      {!device.current && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Events */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityEvents.map((event) => (
                    <div key={event.id} className="flex items-start p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        event.status === 'success' ? 'bg-green-100 text-green-600' :
                        event.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {event.type === 'login' && <Globe className="h-4 w-4" />}
                        {event.type === 'password_change' && <Key className="h-4 w-4" />}
                        {event.type === 'failed_login' && <AlertTriangle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {event.description}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {event.location} • {event.ip} • {event.device}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

import React from 'react';
import { Shield } from "lucide-react";

export default function Security() {
    return (
        <div className="min-h-screen bg-[#0B0E11] text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Security
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                    Learn about our state-of-the-art bank-grade security measures.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <Shield className="w-12 h-12 text-green-500 mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">Comprehensive Protection</h2>
                        <p className="text-gray-400">Ensuring the safety and security of your assets.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

