
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, Shield, TrendingDown, TrendingUp, 
  Eye, Ban, CheckCircle, Clock, DollarSign, Users,
  Activity, RefreshCw, Settings, Lock, Unlock
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface RiskAlert {
  id: string;
  userId: string;
  username: string;
  email: string;
  riskType: 'high_volume' | 'suspicious_pattern' | 'kyc_mismatch' | 'location_anomaly' | 'velocity_check';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  amount?: string;
  currency?: string;
  timestamp: string;
  status: 'active' | 'reviewing' | 'resolved' | 'false_positive';
  assignedTo?: string;
  notes?: string;
}

interface RiskRule {
  id: string;
  name: string;
  description: string;
  riskType: string;
  threshold: number;
  timeframe: string;
  action: 'alert' | 'block' | 'review';
  isActive: boolean;
  createdAt: string;
}

export default function AdminRiskManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAlert, setSelectedAlert] = useState<RiskAlert | null>(null);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    riskType: '',
    threshold: 0,
    timeframe: '24h',
    action: 'alert'
  });
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch risk alerts
  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['/api/admin/risk/alerts', filterSeverity, filterStatus],
    queryFn: () => apiRequest(`/api/admin/risk/alerts?severity=${filterSeverity}&status=${filterStatus}`),
    refetchInterval: 30000,
  });

  // Fetch risk rules
  const { data: rulesData, isLoading: rulesLoading } = useQuery({
    queryKey: ['/api/admin/risk/rules'],
    queryFn: () => apiRequest('/api/admin/risk/rules'),
  });

  // Fetch risk statistics
  const { data: statsData } = useQuery({
    queryKey: ['/api/admin/risk/statistics'],
    queryFn: () => apiRequest('/api/admin/risk/statistics'),
    refetchInterval: 60000,
  });

  // Update alert status mutation
  const updateAlertMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      apiRequest(`/api/admin/risk/alerts/${id}`, {
        method: 'PATCH',
        body: { status, notes }
      }),
    onSuccess: () => {
      toast({
        title: "Alert Updated",
        description: "Risk alert status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/risk/alerts'] });
      setSelectedAlert(null);
    },
  });

  // Create risk rule mutation
  const createRuleMutation = useMutation({
    mutationFn: (ruleData: any) =>
      apiRequest('/api/admin/risk/rules', {
        method: 'POST',
        body: ruleData
      }),
    onSuccess: () => {
      toast({
        title: "Risk Rule Created",
        description: "New risk monitoring rule has been created.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/risk/rules'] });
      setNewRule({ name: '', description: '', riskType: '', threshold: 0, timeframe: '24h', action: 'alert' });
    },
  });

  // Toggle rule status mutation
  const toggleRuleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiRequest(`/api/admin/risk/rules/${id}/toggle`, {
        method: 'POST',
        body: { isActive }
      }),
    onSuccess: () => {
      toast({
        title: "Rule Updated",
        description: "Risk rule status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/risk/rules'] });
    },
  });

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: 'bg-blue-100 text-blue-800 border-blue-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      critical: 'bg-red-100 text-red-800 border-red-300'
    };
    
    return (
      <Badge className={variants[severity as keyof typeof variants] || variants.low}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-red-100 text-red-800 border-red-300',
      reviewing: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      resolved: 'bg-green-100 text-green-800 border-green-300',
      false_positive: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.active}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getRiskIcon = (riskType: string) => {
    switch (riskType) {
      case 'high_volume': return <TrendingUp className="h-4 w-4" />;
      case 'suspicious_pattern': return <AlertTriangle className="h-4 w-4" />;
      case 'kyc_mismatch': return <Shield className="h-4 w-4" />;
      case 'location_anomaly': return <Eye className="h-4 w-4" />;
      case 'velocity_check': return <Activity className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const alerts = alertsData?.alerts || [];
  const rules = rulesData?.rules || [];
  const stats = statsData || {
    totalAlerts: 0,
    activeAlerts: 0,
    criticalAlerts: 0,
    resolvedToday: 0,
    avgResolutionTime: '0h',
    falsePositiveRate: 0
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Risk Management Center</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor and manage platform security risks</p>
        </div>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/risk'] })}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Risk Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold">{stats.totalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">{stats.activeAlerts}</p>
              </div>
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-orange-600">{stats.criticalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolvedToday}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
                <p className="text-2xl font-bold">{stats.avgResolutionTime}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">False Positive</p>
                <p className="text-2xl font-bold">{stats.falsePositiveRate}%</p>
              </div>
              <TrendingDown className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Risk Alerts</TabsTrigger>
          <TabsTrigger value="rules">Risk Rules</TabsTrigger>
          <TabsTrigger value="analytics">Risk Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label htmlFor="severity-filter">Filter by Severity</Label>
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <Label htmlFor="status-filter">Filter by Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="reviewing">Under Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="false_positive">False Positive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Alerts ({alerts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {alertsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  ))}
                </div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No risk alerts found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert: RiskAlert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getRiskIcon(alert.riskType)}
                          <div className={`w-3 h-3 rounded-full ${
                            alert.severity === 'critical' ? 'bg-red-500' :
                            alert.severity === 'high' ? 'bg-orange-500' :
                            alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{alert.username}</span>
                            {getSeverityBadge(alert.severity)}
                            {getStatusBadge(alert.status)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{alert.description}</p>
                          <p className="text-xs text-gray-500">
                            {alert.email} • {new Date(alert.timestamp).toLocaleString()}
                            {alert.amount && ` • ${alert.currency} ${alert.amount}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedAlert(alert)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Risk Alert Details</DialogTitle>
                            </DialogHeader>
                            {selectedAlert && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>User</Label>
                                    <p className="font-medium">{selectedAlert.username} ({selectedAlert.email})</p>
                                  </div>
                                  <div>
                                    <Label>Risk Type</Label>
                                    <p className="font-medium">{selectedAlert.riskType.replace('_', ' ').toUpperCase()}</p>
                                  </div>
                                  <div>
                                    <Label>Severity</Label>
                                    <div className="mt-1">{getSeverityBadge(selectedAlert.severity)}</div>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <div className="mt-1">{getStatusBadge(selectedAlert.status)}</div>
                                  </div>
                                  <div className="col-span-2">
                                    <Label>Description</Label>
                                    <p className="font-medium">{selectedAlert.description}</p>
                                  </div>
                                  {selectedAlert.amount && (
                                    <div>
                                      <Label>Amount</Label>
                                      <p className="font-medium">{selectedAlert.currency} {selectedAlert.amount}</p>
                                    </div>
                                  )}
                                  <div>
                                    <Label>Timestamp</Label>
                                    <p className="font-medium">{new Date(selectedAlert.timestamp).toLocaleString()}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor="admin-notes">Admin Notes</Label>
                                  <Textarea
                                    id="admin-notes"
                                    placeholder="Add notes about this alert..."
                                    defaultValue={selectedAlert.notes || ''}
                                  />
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => updateAlertMutation.mutate({
                                      id: selectedAlert.id,
                                      status: 'reviewing',
                                      notes: (document.getElementById('admin-notes') as HTMLTextAreaElement)?.value
                                    })}
                                    className="flex-1"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Mark as Reviewing
                                  </Button>
                                  <Button
                                    onClick={() => updateAlertMutation.mutate({
                                      id: selectedAlert.id,
                                      status: 'resolved',
                                      notes: (document.getElementById('admin-notes') as HTMLTextAreaElement)?.value
                                    })}
                                    variant="outline"
                                    className="flex-1"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Resolve
                                  </Button>
                                  <Button
                                    onClick={() => updateAlertMutation.mutate({
                                      id: selectedAlert.id,
                                      status: 'false_positive',
                                      notes: (document.getElementById('admin-notes') as HTMLTextAreaElement)?.value
                                    })}
                                    variant="destructive"
                                    className="flex-1"
                                  >
                                    <Ban className="h-4 w-4 mr-2" />
                                    False Positive
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create New Rule */}
            <Card>
              <CardHeader>
                <CardTitle>Create Risk Rule</CardTitle>
                <CardDescription>Set up automated risk monitoring rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input
                    id="rule-name"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    placeholder="Enter rule name..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="rule-description">Description</Label>
                  <Textarea
                    id="rule-description"
                    value={newRule.description}
                    onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    placeholder="Describe what this rule monitors..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="risk-type">Risk Type</Label>
                    <Select value={newRule.riskType} onValueChange={(value) => setNewRule({ ...newRule, riskType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high_volume">High Volume Trading</SelectItem>
                        <SelectItem value="suspicious_pattern">Suspicious Pattern</SelectItem>
                        <SelectItem value="kyc_mismatch">KYC Mismatch</SelectItem>
                        <SelectItem value="location_anomaly">Location Anomaly</SelectItem>
                        <SelectItem value="velocity_check">Velocity Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="threshold">Threshold</Label>
                    <Input
                      id="threshold"
                      type="number"
                      value={newRule.threshold}
                      onChange={(e) => setNewRule({ ...newRule, threshold: parseFloat(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeframe">Timeframe</Label>
                    <Select value={newRule.timeframe} onValueChange={(value) => setNewRule({ ...newRule, timeframe: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 Hour</SelectItem>
                        <SelectItem value="24h">24 Hours</SelectItem>
                        <SelectItem value="7d">7 Days</SelectItem>
                        <SelectItem value="30d">30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="action">Action</Label>
                    <Select value={newRule.action} onValueChange={(value) => setNewRule({ ...newRule, action: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alert">Create Alert</SelectItem>
                        <SelectItem value="block">Block Action</SelectItem>
                        <SelectItem value="review">Require Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button
                  onClick={() => createRuleMutation.mutate(newRule)}
                  disabled={!newRule.name || !newRule.riskType || createRuleMutation.isPending}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Rule
                </Button>
              </CardContent>
            </Card>

            {/* Existing Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Active Risk Rules ({rules.filter((r: RiskRule) => r.isActive).length})</CardTitle>
              </CardHeader>
              <CardContent>
                {rulesLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {rules.map((rule: RiskRule) => (
                      <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{rule.name}</span>
                            {rule.isActive ? (
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{rule.description}</p>
                          <p className="text-xs text-gray-400">
                            {rule.riskType} • Threshold: {rule.threshold} • {rule.timeframe}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={rule.isActive}
                            onCheckedChange={(checked) => toggleRuleMutation.mutate({ id: rule.id, isActive: checked })}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium">High Volume Trading</p>
                        <p className="text-sm text-gray-600">47 alerts this week</p>
                      </div>
                    </div>
                    <TrendingUp className="h-5 w-5 text-red-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium">Suspicious Patterns</p>
                        <p className="text-sm text-gray-600">23 alerts this week</p>
                      </div>
                    </div>
                    <TrendingDown className="h-5 w-5 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Location Anomalies</p>
                        <p className="text-sm text-gray-600">12 alerts this week</p>
                      </div>
                    </div>
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolution Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Resolution Time</span>
                    <span className="text-lg font-bold">{stats.avgResolutionTime}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">False Positive Rate</span>
                    <span className="text-lg font-bold text-yellow-600">{stats.falsePositiveRate}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Alerts Resolved Today</span>
                    <span className="text-lg font-bold text-green-600">{stats.resolvedToday}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Critical Alerts Open</span>
                    <span className="text-lg font-bold text-red-600">{stats.criticalAlerts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
