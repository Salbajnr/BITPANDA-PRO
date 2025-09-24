
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, Clock, MapPin, Activity, Eye, LogIn, LogOut,
  Smartphone, Monitor, Tablet, Globe, RefreshCw, Filter,
  TrendingUp, AlertCircle, Calendar
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface UserSession {
  id: string;
  userId: string;
  username: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  location: {
    country: string;
    city: string;
    region: string;
  };
  loginTime: string;
  lastActivity: string;
  isActive: boolean;
  duration: number;
  pagesVisited: number;
}

interface UserActivity {
  id: string;
  userId: string;
  username: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  riskScore: number;
}

export default function AdminUserActivityTracker() {
  const [timeFilter, setTimeFilter] = useState('24h');
  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');

  // Fetch active sessions
  const { data: sessionsData, isLoading: sessionsLoading, refetch: refetchSessions } = useQuery({
    queryKey: ['/api/admin/user-sessions', timeFilter],
    queryFn: () => apiRequest(`/api/admin/user-sessions?timeframe=${timeFilter}`),
    refetchInterval: 30000,
  });

  // Fetch recent activities
  const { data: activitiesData, isLoading: activitiesLoading, refetch: refetchActivities } = useQuery({
    queryKey: ['/api/admin/user-activities', timeFilter, activityFilter],
    queryFn: () => apiRequest(`/api/admin/user-activities?timeframe=${timeFilter}&type=${activityFilter}`),
    refetchInterval: 60000,
  });

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getRiskBadge = (score: number) => {
    if (score >= 80) return <Badge variant="destructive">High Risk</Badge>;
    if (score >= 50) return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
    return <Badge variant="default">Low Risk</Badge>;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const sessions: UserSession[] = sessionsData?.sessions || [];
  const activities: UserActivity[] = activitiesData?.activities || [];
  const stats = {
    totalActiveSessions: sessions.filter(s => s.isActive).length,
    totalSessions: sessions.length,
    uniqueUsers: new Set(sessions.map(s => s.userId)).size,
    suspiciousActivities: activities.filter(a => a.riskScore >= 70).length
  };

  const filteredActivities = activities.filter(activity => 
    activity.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Activity Tracker</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor user sessions and activities in real-time</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => { refetchSessions(); refetchActivities(); }} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalActiveSessions}</div>
            <p className="text-xs text-gray-500">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Unique Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.uniqueUsers}</div>
            <p className="text-xs text-gray-500">In timeframe</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalSessions}</div>
            <p className="text-xs text-gray-500">All sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Suspicious Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.suspiciousActivities}</div>
            <p className="text-xs text-gray-500">High risk actions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active User Sessions</CardTitle>
              <CardDescription>Real-time monitoring of user sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-600">Loading sessions...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getDeviceIcon(session.deviceType)}
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <div>
                          <div className="font-medium">{session.username}</div>
                          <div className="text-sm text-gray-500">{session.email}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {session.location.city}, {session.location.country}
                          </div>
                          <div>{session.browser} on {session.os}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          Duration: {formatDuration(session.duration)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {session.pagesVisited} pages visited
                        </div>
                        <div className="text-xs text-gray-500">
                          Last: {new Date(session.lastActivity).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="login">Login Events</SelectItem>
                <SelectItem value="trading">Trading Actions</SelectItem>
                <SelectItem value="transfer">Transfers</SelectItem>
                <SelectItem value="security">Security Events</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent User Activities</CardTitle>
              <CardDescription>Track user actions and detect suspicious behavior</CardDescription>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-600">Loading activities...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{activity.username}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{activity.action}</div>
                          <div className="text-xs text-gray-500">{activity.details}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {getRiskBadge(activity.riskScore)}
                        <div className="text-right text-xs text-gray-500">
                          <div>{new Date(activity.timestamp).toLocaleString()}</div>
                          <div>IP: {activity.ipAddress}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['desktop', 'mobile', 'tablet'].map((device) => {
                    const count = sessions.filter(s => s.deviceType === device).length;
                    const percentage = sessions.length > 0 ? (count / sessions.length) * 100 : 0;
                    return (
                      <div key={device} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getDeviceIcon(device)}
                          <span className="capitalize">{device}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(sessions.map(s => `${s.location.city}, ${s.location.country}`))).slice(0, 5).map((location) => {
                    const count = sessions.filter(s => `${s.location.city}, ${s.location.country}` === location).length;
                    return (
                      <div key={location} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>{location}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
