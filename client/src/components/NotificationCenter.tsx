import { useState, useEffect } from 'react';
import { Bell, X, TrendingUp, TrendingDown, AlertTriangle, Info, CheckCircle, DollarSign, Shield, Globe, Settings, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
  id: string;
  type: 'trade' | 'price_alert' | 'news' | 'system' | 'deposit' | 'security';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationSettings {
  priceAlerts: boolean;
  portfolioUpdates: boolean;
  securityAlerts: boolean;
  newsUpdates: boolean;
  tradingAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export default function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'trade' | 'alerts'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    priceAlerts: true,
    portfolioUpdates: true,
    securityAlerts: true,
    newsUpdates: false,
    tradingAlerts: true,
    emailNotifications: true,
    pushNotifications: false
  });

  // Mock notifications - in real app this would come from API
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'trade',
        title: 'Trade Executed Successfully',
        message: 'Your BUY order for 0.01 BTC has been executed at $43,250.50',
        timestamp: new Date(Date.now() - 2 * 60000),
        read: false,
        priority: 'high',
        metadata: { symbol: 'BTC', amount: '0.01', price: 43250.50 }
      },
      {
        id: '2',
        type: 'price_alert',
        title: 'Price Alert Triggered',
        message: 'Bitcoin has reached your target price of $43,000. Current price: $43,250',
        timestamp: new Date(Date.now() - 5 * 60000),
        read: false,
        priority: 'medium',
        metadata: { symbol: 'BTC', targetPrice: 43000, currentPrice: 43250 }
      },
      {
        id: '3',
        type: 'deposit',
        title: 'Deposit Confirmed',
        message: 'Your deposit of $1,000 USD has been processed and added to your account',
        timestamp: new Date(Date.now() - 15 * 60000),
        read: false,
        priority: 'high',
        metadata: { amount: 1000, currency: 'USD' }
      },
      {
        id: '4',
        type: 'security',
        title: 'New Login Detected',
        message: 'A new login was detected from Chrome on Windows. If this wasn\'t you, please secure your account',
        timestamp: new Date(Date.now() - 30 * 60000),
        read: true,
        priority: 'critical',
        metadata: { device: 'Chrome on Windows', location: 'New York, US' }
      },
      {
        id: '5',
        type: 'news',
        title: 'Market Update',
        message: 'Bitcoin reaches new monthly high amid institutional buying pressure',
        timestamp: new Date(Date.now() - 60 * 60000),
        read: true,
        priority: 'low',
        metadata: { category: 'market_news' }
      },
      {
        id: '6',
        type: 'system',
        title: 'Scheduled Maintenance',
        message: 'Trading will be temporarily unavailable on Jan 20th from 2:00-4:00 AM UTC for system maintenance',
        timestamp: new Date(Date.now() - 2 * 60 * 60000),
        read: false,
        priority: 'medium',
        metadata: { maintenanceStart: '2024-01-20T02:00:00Z', maintenanceEnd: '2024-01-20T04:00:00Z' }
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    // Filter by type
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'trade' && notification.type !== 'trade') return false;
    if (filter === 'alerts' && !['price_alert', 'security'].includes(notification.type)) return false;

    // Filter by search term
    if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'trade': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'price_alert': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'news': return <Globe className="h-4 w-4 text-blue-500" />;
      case 'deposit': return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'security': return <Shield className="h-4 w-4 text-red-500" />;
      case 'system': return <Settings className="h-4 w-4 text-gray-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/20';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/20';
      case 'medium': return 'bg-green-100 dark:bg-green-900/20';
      case 'low': return 'bg-gray-100 dark:bg-gray-900/20';
      default: return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-500 border-0">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <Check className="h-4 w-4 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Badge variant="outline" className="text-xs">
                  {unreadCount} new
                </Badge>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="space-y-2 mt-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-8 text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
                  <SelectTrigger className="h-8 text-xs flex-1">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="trade">Trades</SelectItem>
                    <SelectItem value="alerts">Alerts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm">No notifications found</p>
                  {searchTerm && (
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting your search or filter
                    </p>
                  )}
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    } ${notification.priority === 'critical' ? 'border-l-4 border-l-red-500' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`mt-1 p-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-slate-900">
                              {notification.title}
                            </p>
                            {notification.priority === 'critical' && (
                              <Badge variant="destructive" className="text-xs px-1 py-0">
                                Critical
                              </Badge>
                            )}
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-slate-400">
                              {formatTimeAgo(notification.timestamp)}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {notification.type.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="h-7 w-7 p-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="h-7 w-7 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredNotifications.length > 0 && (
              <div className="p-3 border-t bg-slate-50">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View All Notifications
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}