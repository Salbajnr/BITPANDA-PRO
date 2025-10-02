
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Server, Database, Wifi, HardDrive, Cpu, MemoryStick, 
  Activity, AlertTriangle, CheckCircle, Clock, RefreshCw,
  TrendingUp, TrendingDown, Zap, Globe, Shield, Monitor
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ServerMetrics {
  server: {
    uptime: string;
    status: 'healthy' | 'warning' | 'critical';
    responseTime: number;
    load: number;
    processes: number;
    connections: number;
  };
  database: {
    status: 'connected' | 'disconnected' | 'slow';
    connectionCount: number;
    queryTime: number;
    storageUsed: number;
    storageTotal: number;
    transactionsPerSecond: number;
  };
  api: {
    totalRequests: number;
    successRate: number;
    errorRate: number;
    avgResponseTime: number;
    rateLimit: number;
    rateLimitUsed: number;
  };
  resources: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkIn: number;
    networkOut: number;
  };
  security: {
    activeThreats: number;
    blockedIPs: number;
    failedLogins: number;
    sslStatus: 'valid' | 'warning' | 'expired';
    sslExpiry: string;
  };
  performance: {
    requestsPerMinute: number;
    errorCount: number;
    slowQueries: number;
    cacheHitRate: number;
  };
}

interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error' | 'degraded';
  uptime: string;
  version: string;
  lastChecked: string;
  dependencies: string[];
}

export default function AdminServerMonitoring() {
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch server metrics
  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/server/metrics'],
    queryFn: () => apiRequest('/api/admin/server/metrics'),
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  // Fetch service status
  const { data: servicesData } = useQuery({
    queryKey: ['/api/admin/server/services'],
    queryFn: () => apiRequest('/api/admin/server/services'),
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  // Fetch performance history
  const { data: performanceData } = useQuery({
    queryKey: ['/api/admin/server/performance-history'],
    queryFn: () => apiRequest('/api/admin/server/performance-history'),
    refetchInterval: autoRefresh ? 60000 : false,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
      case 'connected':
      case 'valid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
      case 'degraded':
      case 'slow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
      case 'error':
      case 'stopped':
      case 'disconnected':
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResourceColor = (usage: number) => {
    if (usage > 90) return 'bg-red-500';
    if (usage > 75) return 'bg-orange-500';
    if (usage > 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const serverMetrics: ServerMetrics = metrics || {
    server: { uptime: '0', status: 'healthy', responseTime: 0, load: 0, processes: 0, connections: 0 },
    database: { status: 'connected', connectionCount: 0, queryTime: 0, storageUsed: 0, storageTotal: 0, transactionsPerSecond: 0 },
    api: { totalRequests: 0, successRate: 0, errorRate: 0, avgResponseTime: 0, rateLimit: 1000, rateLimitUsed: 0 },
    resources: { cpuUsage: 0, memoryUsage: 0, diskUsage: 0, networkIn: 0, networkOut: 0 },
    security: { activeThreats: 0, blockedIPs: 0, failedLogins: 0, sslStatus: 'valid', sslExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() },
    performance: { requestsPerMinute: 0, errorCount: 0, slowQueries: 0, cacheHitRate: 95 }
  };

  const services: ServiceStatus[] = servicesData?.services || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Server Monitoring</h2>
          <p className="text-gray-600 dark:text-gray-400">Real-time server performance and health monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <label className="text-sm">Auto-refresh:</label>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
          </div>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Server className="h-4 w-4 mr-2" />
              Server Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className={getStatusColor(serverMetrics.server.status)}>
                {serverMetrics.server.status.toUpperCase()}
              </Badge>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Uptime: {serverMetrics.server.uptime}</div>
                <div>Response: {serverMetrics.server.responseTime}ms</div>
                <div>Load: {serverMetrics.server.load.toFixed(2)}</div>
                <div>Processes: {serverMetrics.server.processes}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className={getStatusColor(serverMetrics.database.status)}>
                {serverMetrics.database.status.toUpperCase()}
              </Badge>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Connections: {serverMetrics.database.connectionCount}</div>
                <div>Query Time: {serverMetrics.database.queryTime}ms</div>
                <div>TPS: {serverMetrics.database.transactionsPerSecond}</div>
                <div>Storage: {((serverMetrics.database.storageUsed / serverMetrics.database.storageTotal) * 100).toFixed(1)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              API Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-lg font-bold text-green-600">
                {serverMetrics.api.successRate.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Requests: {serverMetrics.api.totalRequests.toLocaleString()}</div>
                <div>Avg Response: {serverMetrics.api.avgResponseTime}ms</div>
                <div>Error Rate: {serverMetrics.api.errorRate.toFixed(2)}%</div>
                <div>Rate Limit: {((serverMetrics.api.rateLimitUsed / serverMetrics.api.rateLimit) * 100).toFixed(1)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className={getStatusColor(serverMetrics.security.sslStatus)}>
                SSL {serverMetrics.security.sslStatus.toUpperCase()}
              </Badge>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Threats: {serverMetrics.security.activeThreats}</div>
                <div>Blocked IPs: {serverMetrics.security.blockedIPs}</div>
                <div>Failed Logins: {serverMetrics.security.failedLogins}</div>
                <div>SSL Expiry: {serverMetrics.security.sslExpiry ? new Date(serverMetrics.security.sslExpiry).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="resources" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Cpu className="h-4 w-4 mr-2" />
                  CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-2xl font-bold">{serverMetrics.resources.cpuUsage.toFixed(1)}%</span>
                    <Badge variant={serverMetrics.resources.cpuUsage > 80 ? 'destructive' : 'default'}>
                      {serverMetrics.resources.cpuUsage > 80 ? 'High' : serverMetrics.resources.cpuUsage > 60 ? 'Medium' : 'Normal'}
                    </Badge>
                  </div>
                  <Progress 
                    value={serverMetrics.resources.cpuUsage} 
                    className="h-3"
                  />
                  <div className="text-xs text-gray-500">
                    Load Average: {serverMetrics.server.load.toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <MemoryStick className="h-4 w-4 mr-2" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-2xl font-bold">{serverMetrics.resources.memoryUsage.toFixed(1)}%</span>
                    <Badge variant={serverMetrics.resources.memoryUsage > 80 ? 'destructive' : 'default'}>
                      {serverMetrics.resources.memoryUsage > 80 ? 'High' : serverMetrics.resources.memoryUsage > 60 ? 'Medium' : 'Normal'}
                    </Badge>
                  </div>
                  <Progress 
                    value={serverMetrics.resources.memoryUsage} 
                    className="h-3"
                  />
                  <div className="text-xs text-gray-500">
                    Available: {(100 - serverMetrics.resources.memoryUsage).toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Disk Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-2xl font-bold">{serverMetrics.resources.diskUsage.toFixed(1)}%</span>
                    <Badge variant={serverMetrics.resources.diskUsage > 80 ? 'destructive' : 'default'}>
                      {serverMetrics.resources.diskUsage > 80 ? 'High' : serverMetrics.resources.diskUsage > 60 ? 'Medium' : 'Normal'}
                    </Badge>
                  </div>
                  <Progress 
                    value={serverMetrics.resources.diskUsage} 
                    className="h-3"
                  />
                  <div className="text-xs text-gray-500">
                    Free: {(100 - serverMetrics.resources.diskUsage).toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Network Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Network In</span>
                    </div>
                    <span className="font-medium">{formatBytes(serverMetrics.resources.networkIn)}/s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Network Out</span>
                    </div>
                    <span className="font-medium">{formatBytes(serverMetrics.resources.networkOut)}/s</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Usage</span>
                    <span className="font-medium">
                      {serverMetrics.database.storageUsed.toFixed(1)}GB / {serverMetrics.database.storageTotal.toFixed(1)}GB
                    </span>
                  </div>
                  <Progress 
                    value={(serverMetrics.database.storageUsed / serverMetrics.database.storageTotal) * 100} 
                    className="h-2"
                  />
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                    <div>Connections: {serverMetrics.database.connectionCount}</div>
                    <div>Query Time: {serverMetrics.database.queryTime}ms</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
              <CardDescription>Monitor all platform services and dependencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        service.status === 'running' ? 'bg-green-500' :
                        service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-gray-500">Version: {service.version}</p>
                        <p className="text-xs text-gray-400">
                          Dependencies: {service.dependencies.join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(service.status)}>
                        {service.status.toUpperCase()}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        <div>Uptime: {service.uptime}</div>
                        <div>Checked: {new Date(service.lastChecked).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Requests/Min</p>
                    <p className="text-2xl font-bold">{serverMetrics.performance.requestsPerMinute}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Error Count</p>
                    <p className="text-2xl font-bold text-red-600">{serverMetrics.performance.errorCount}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Slow Queries</p>
                    <p className="text-2xl font-bold text-orange-600">{serverMetrics.performance.slowQueries}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cache Hit Rate</p>
                    <p className="text-2xl font-bold text-green-600">{serverMetrics.performance.cacheHitRate}%</p>
                  </div>
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Performance charts and trends will be displayed here</p>
                <p className="text-sm">Historical data visualization coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>Recent system events and error logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Server started successfully</span>
                  </div>
                  <span className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Database connection established</span>
                  </div>
                  <span className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">High CPU usage detected (85%)</span>
                  </div>
                  <span className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
