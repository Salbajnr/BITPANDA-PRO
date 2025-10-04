
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Key, Copy, RefreshCw, Trash2, Eye, EyeOff, 
  Activity, AlertTriangle, CheckCircle, Clock,
  TrendingUp, BarChart3, Settings
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  userId: string;
  permissions: string[];
  rateLimit: number;
  isActive: boolean;
  lastUsed?: string;
  createdAt: string;
  expiresAt?: string;
}

export default function AdminAPIManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);

  // Fetch API usage statistics
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/api-management/stats'],
    queryFn: () => apiRequest('GET', '/api/admin/api-management/stats'),
  });

  // Fetch all API keys
  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ['/api/admin/api-management/keys'],
    queryFn: () => apiRequest('GET', '/api/admin/api-management/keys'),
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            API Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Monitor and manage API keys and usage
          </p>
        </div>
        <Button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/api-management'] })}
          variant="outline"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total API Keys</p>
                  <p className="text-2xl font-bold">{stats.totalKeys || 0}</p>
                </div>
                <Key className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Keys</p>
                  <p className="text-2xl font-bold">{stats.activeKeys || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Requests (24h)</p>
                  <p className="text-2xl font-bold">{stats.totalRequests || 0}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Error Rate</p>
                  <p className="text-2xl font-bold">{stats.errorRate || 0}%</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="keys">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All API Keys</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  ))}
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="text-center py-12">
                  <Key className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">No API keys found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((key: ApiKey) => (
                    <div key={key.id} className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Key className="h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="font-semibold">{key.name}</h3>
                            <p className="text-sm text-slate-500">
                              Created {new Date(key.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={key.isActive ? "default" : "secondary"}>
                            {key.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <code className="flex-1 bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm font-mono">
                            {showKeys[key.id] ? key.key : '••••••••••••••••••••••••••••••••'}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowKeys({ ...showKeys, [key.id]: !showKeys[key.id] })}
                          >
                            {showKeys[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(key.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Rate Limit:</span>
                            <p className="font-medium">{key.rateLimit} req/min</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Last Used:</span>
                            <p className="font-medium">
                              {key.lastUsed ? new Date(key.lastUsed).toLocaleString() : 'Never'}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-500">Expires:</span>
                            <p className="font-medium">
                              {key.expiresAt ? new Date(key.expiresAt).toLocaleDateString() : 'Never'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">Usage analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Default Rate Limit</Label>
                  <Input type="number" defaultValue="100" placeholder="Requests per minute" />
                </div>
                <div>
                  <Label>API Version</Label>
                  <Input defaultValue="v1" readOnly />
                </div>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
