
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
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, Shield, AlertCircle, CheckCircle, Clock, 
  Download, Upload, Eye, Edit, Trash2, RefreshCw,
  BarChart3, TrendingUp, Users, DollarSign, Calendar,
  Search, Filter, Plus, Settings, Lock, Unlock
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface ComplianceReport {
  id: string;
  type: 'aml' | 'kyc' | 'transaction' | 'tax' | 'regulatory';
  title: string;
  description: string;
  status: 'draft' | 'pending_review' | 'approved' | 'submitted' | 'filed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  createdBy: string;
  assignedTo?: string;
  completionPercentage: number;
  lastUpdated: string;
  submissionDate?: string;
  requirements: string[];
  documents: string[];
}

interface ComplianceMetric {
  id: string;
  category: string;
  metric: string;
  value: number;
  target: number;
  status: 'compliant' | 'warning' | 'non_compliant';
  lastChecked: string;
  description: string;
}

interface RegulatoryUpdate {
  id: string;
  title: string;
  summary: string;
  effectiveDate: string;
  jurisdiction: string;
  impact: 'low' | 'medium' | 'high';
  status: 'active' | 'pending' | 'archived';
  actionRequired: boolean;
  assignedTo?: string;
}

export default function AdminComplianceDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch compliance reports
  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ['/api/admin/compliance/reports', filterType, filterStatus, searchTerm],
    queryFn: () => apiRequest(`/api/admin/compliance/reports?type=${filterType}&status=${filterStatus}&search=${searchTerm}`),
  });

  // Fetch compliance metrics
  const { data: metricsData } = useQuery({
    queryKey: ['/api/admin/compliance/metrics'],
    queryFn: () => apiRequest('/api/admin/compliance/metrics'),
    refetchInterval: 300000, // 5 minutes
  });

  // Fetch regulatory updates
  const { data: updatesData } = useQuery({
    queryKey: ['/api/admin/compliance/regulatory-updates'],
    queryFn: () => apiRequest('/api/admin/compliance/regulatory-updates'),
  });

  // Fetch compliance statistics
  const { data: statsData } = useQuery({
    queryKey: ['/api/admin/compliance/statistics'],
    queryFn: () => apiRequest('/api/admin/compliance/statistics'),
    refetchInterval: 60000,
  });

  // Update report status mutation
  const updateReportMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      apiRequest(`/api/admin/compliance/reports/${id}`, {
        method: 'PATCH',
        body: { status, notes }
      }),
    onSuccess: () => {
      toast({
        title: "Report Updated",
        description: "Compliance report status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/compliance/reports'] });
    },
  });

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: (reportType: string) =>
      apiRequest('/api/admin/compliance/generate-report', {
        method: 'POST',
        body: { type: reportType }
      }),
    onSuccess: () => {
      toast({
        title: "Report Generated",
        description: "New compliance report has been generated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/compliance/reports'] });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'bg-gray-100 text-gray-800 border-gray-300',
      pending_review: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      submitted: 'bg-blue-100 text-blue-800 border-blue-300',
      filed: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.draft}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      urgent: 'bg-red-100 text-red-800 border-red-300'
    };
    
    return (
      <Badge className={variants[priority as keyof typeof variants] || variants.medium}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const getComplianceStatusBadge = (status: string) => {
    const variants = {
      compliant: 'bg-green-100 text-green-800 border-green-300',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      non_compliant: 'bg-red-100 text-red-800 border-red-300'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.warning}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const reports = reportsData?.reports || [];
  const metrics = metricsData?.metrics || [];
  const updates = updatesData?.updates || [];
  const stats = statsData || {
    totalReports: 0,
    pendingReports: 0,
    overdueReports: 0,
    complianceScore: 0,
    lastAuditDate: null,
    nextAuditDate: null
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Compliance Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor regulatory compliance and manage reports</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => generateReportMutation.mutate('monthly')}
            disabled={generateReportMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/compliance'] })}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className="text-3xl font-bold text-green-600">{stats.complianceScore}%</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={stats.complianceScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-3xl font-bold">{stats.totalReports}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingReports}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Reports</p>
                <p className="text-3xl font-bold text-red-600">{stats.overdueReports}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
          <TabsTrigger value="metrics">Compliance Metrics</TabsTrigger>
          <TabsTrigger value="regulatory">Regulatory Updates</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="aml">AML Reports</SelectItem>
                    <SelectItem value="kyc">KYC Reports</SelectItem>
                    <SelectItem value="transaction">Transaction Reports</SelectItem>
                    <SelectItem value="tax">Tax Reports</SelectItem>
                    <SelectItem value="regulatory">Regulatory Reports</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="filed">Filed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports ({reports.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  ))}
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No compliance reports found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report: ComplianceReport) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{report.title}</span>
                            {getStatusBadge(report.status)}
                            {getPriorityBadge(report.priority)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{report.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>Due: {new Date(report.dueDate).toLocaleDateString()}</span>
                            <span>Created by: {report.createdBy}</span>
                            <span>Progress: {report.completionPercentage}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Progress value={report.completionPercentage} className="w-20" />
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Compliance Report Details</DialogTitle>
                            </DialogHeader>
                            {selectedReport && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Report Title</Label>
                                    <p className="font-medium">{selectedReport.title}</p>
                                  </div>
                                  <div>
                                    <Label>Type</Label>
                                    <p className="font-medium capitalize">{selectedReport.type}</p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                                  </div>
                                  <div>
                                    <Label>Priority</Label>
                                    <div className="mt-1">{getPriorityBadge(selectedReport.priority)}</div>
                                  </div>
                                  <div>
                                    <Label>Due Date</Label>
                                    <p className="font-medium">{new Date(selectedReport.dueDate).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <Label>Progress</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Progress value={selectedReport.completionPercentage} className="flex-1" />
                                      <span className="text-sm font-medium">{selectedReport.completionPercentage}%</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label>Description</Label>
                                  <p className="text-sm">{selectedReport.description}</p>
                                </div>
                                
                                <div>
                                  <Label>Requirements</Label>
                                  <ul className="list-disc list-inside text-sm space-y-1">
                                    {selectedReport.requirements.map((req, index) => (
                                      <li key={index}>{req}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div>
                                  <Label>Documents</Label>
                                  <div className="space-y-2">
                                    {selectedReport.documents.map((doc, index) => (
                                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                                        <span className="text-sm">{doc}</span>
                                        <Button variant="outline" size="sm">
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => updateReportMutation.mutate({
                                      id: selectedReport.id,
                                      status: 'approved'
                                    })}
                                    className="flex-1"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() => updateReportMutation.mutate({
                                      id: selectedReport.id,
                                      status: 'submitted'
                                    })}
                                    variant="outline"
                                    className="flex-1"
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Submit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    className="flex-1"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
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

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Metrics</CardTitle>
              <CardDescription>Real-time monitoring of compliance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {metrics.map((metric: ComplianceMetric) => (
                  <div key={metric.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{metric.metric}</h4>
                      {getComplianceStatusBadge(metric.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{metric.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Value</span>
                        <span className="font-medium">{metric.value}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Target</span>
                        <span className="font-medium">{metric.target}</span>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} />
                      <p className="text-xs text-gray-500">
                        Last checked: {new Date(metric.lastChecked).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regulatory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Updates</CardTitle>
              <CardDescription>Stay informed about regulatory changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {updates.map((update: RegulatoryUpdate) => (
                  <div key={update.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{update.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          update.impact === 'high' ? 'bg-red-100 text-red-800' :
                          update.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {update.impact.toUpperCase()} IMPACT
                        </Badge>
                        {update.actionRequired && (
                          <Badge variant="destructive">ACTION REQUIRED</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{update.summary}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Jurisdiction: {update.jurisdiction}</span>
                      <span>Effective: {new Date(update.effectiveDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>Complete audit log of compliance activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Last Audit Completed</p>
                    <p className="text-sm text-gray-600">
                      {stats.lastAuditDate ? new Date(stats.lastAuditDate).toLocaleDateString() : 'No audit completed'}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium">Next Scheduled Audit</p>
                    <p className="text-sm text-gray-600">
                      {stats.nextAuditDate ? new Date(stats.nextAuditDate).toLocaleDateString() : 'Not scheduled'}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Audit Trail
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
