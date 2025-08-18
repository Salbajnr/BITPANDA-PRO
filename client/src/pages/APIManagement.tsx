import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Shield,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  isActive: boolean;
  lastUsed?: Date;
  createdAt: Date;
  expiresAt?: Date;
}

export default function APIManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  if (!user) {
    return <Redirect to="/auth" />;
  }

  const { data: apiKeys = [] } = useQuery({
    queryKey: ['/api/user/api-keys'],
    queryFn: async () => {
      const response = await fetch('/api/user/api-keys', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch API keys');
      return response.json();
    }
  });

  const { data: keyUsage = [] } = useQuery({
    queryKey: ['/api/user/api-usage'],
    queryFn: async () => {
      const response = await fetch('/api/user/api-usage', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch API usage');
      return response.json();
    }
  });

  const createKeyMutation = useMutation({
    mutationFn: async (keyData: { name: string; permissions: string[] }) => {
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(keyData)
      });
      if (!response.ok) throw new Error('Failed to create API key');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/api-keys'] });
      setIsCreateDialogOpen(false);
      setNewKeyName('');
      setSelectedPermissions([]);
      toast({
        title: "API Key Created",
        description: "Your new API key has been generated successfully.",
      });
    }
  });

  const revokeKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const response = await fetch(`/api/user/api-keys/${keyId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to revoke API key');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/api-keys'] });
      toast({
        title: "API Key Revoked",
        description: "The API key has been permanently revoked.",
      });
    }
  });

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API key has been copied to your clipboard.",
    });
  };

  const permissions = [
    { id: 'read', label: 'Read Portfolio', description: 'View portfolio balances and holdings' },
    { id: 'trade', label: 'Place Orders', description: 'Create and cancel trading orders' },
    { id: 'withdraw', label: 'Withdraw Funds', description: 'Initiate withdrawals' },
    { id: 'deposit', label: 'View Deposits', description: 'Access deposit information' },
    { id: 'history', label: 'Transaction History', description: 'View transaction records' }
  ];

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your API key.",
        variant: "destructive"
      });
      return;
    }

    if (selectedPermissions.length === 0) {
      toast({
        title: "Error", 
        description: "Please select at least one permission.",
        variant: "destructive"
      });
      return;
    }

    createKeyMutation.mutate({
      name: newKeyName,
      permissions: selectedPermissions
    });
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permission) 
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const formatKey = (key: string, show: boolean) => {
    if (show) return key;
    return key.slice(0, 8) + '•'.repeat(24) + key.slice(-8);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  API Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage your API keys and monitor usage
                </p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create API Key
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New API Key</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="key-name">Key Name</Label>
                      <Input
                        id="key-name"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="My Trading Bot"
                      />
                    </div>
                    
                    <div>
                      <Label>Permissions</Label>
                      <div className="space-y-3 mt-2">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              id={permission.id}
                              checked={selectedPermissions.includes(permission.id)}
                              onChange={() => togglePermission(permission.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Label htmlFor={permission.id} className="font-medium">
                                {permission.label}
                              </Label>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateKey} disabled={createKeyMutation.isPending}>
                        {createKeyMutation.isPending ? 'Creating...' : 'Create API Key'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Usage Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Total API Keys</p>
                      <p className="text-2xl font-bold">{apiKeys.length}</p>
                    </div>
                    <Key className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Active Keys</p>
                      <p className="text-2xl font-bold text-green-600">
                        {apiKeys.filter((key: APIKey) => key.isActive).length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Requests Today</p>
                      <p className="text-2xl font-bold">{keyUsage.requestsToday || 0}</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Rate Limit</p>
                      <p className="text-2xl font-bold">1000/h</p>
                    </div>
                    <Shield className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* API Keys List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Your API Keys
                </CardTitle>
              </CardHeader>
              <CardContent>
                {apiKeys.length > 0 ? (
                  <div className="space-y-4">
                    {apiKeys.map((apiKey: APIKey) => (
                      <div key={apiKey.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{apiKey.name}</h3>
                            <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                              {apiKey.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                            >
                              {showKeys[apiKey.id] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(apiKey.key)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => revokeKeyMutation.mutate(apiKey.id)}
                              disabled={revokeKeyMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded font-mono text-sm">
                            {formatKey(apiKey.key, showKeys[apiKey.id] || false)}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {apiKey.permissions.map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permissions.find(p => p.id === permission)?.label || permission}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                            <span>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                            {apiKey.lastUsed && (
                              <span>Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Key className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No API keys created yet</p>
                    <p className="text-sm text-slate-400 mt-2">
                      Create your first API key to start programmatic trading
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="mt-6 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                      Security Best Practices
                    </h3>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                      <li>• Never share your API keys with anyone</li>
                      <li>• Use different keys for different applications</li>
                      <li>• Regularly rotate your API keys</li>
                      <li>• Only grant necessary permissions</li>
                      <li>• Monitor your API usage regularly</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}