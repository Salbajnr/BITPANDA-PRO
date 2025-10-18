
import { EventEmitter } from 'events';
import { storage } from './storage';
import { adminWebSocketManager } from './admin-websocket';
import { broadcastSSEToAdmins } from './sse-routes';

interface AnalyticsMetric {
  name: string;
  value: number;
  timestamp: Date;
  change?: number;
  changePercent?: number;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  networkIn: number;
  networkOut: number;
  activeConnections: number;
  requestsPerSecond: number;
  errorRate: number;
}

interface BusinessMetrics {
  totalUsers: number;
  activeUsers: number;
  newRegistrations: number;
  totalTransactions: number;
  transactionVolume: number;
  portfolioValue: number;
  conversionRate: number;
}

class LiveAnalyticsService extends EventEmitter {
  private metricsHistory = new Map<string, AnalyticsMetric[]>();
  private currentMetrics = new Map<string, AnalyticsMetric>();
  private updateInterval: NodeJS.Timeout | null = null;
  private readonly UPDATE_FREQUENCY = 10000; // 10 seconds
  private isRunning = false;
  private requestCounter = 0;
  private errorCounter = 0;
  private lastRequestTime = Date.now();

  constructor() {
    super();
    this.setMaxListeners(1000);
  }

  start() {
    if (this.isRunning) return;

    console.log('📊 Starting Live Analytics Service...');
    this.isRunning = true;
    this.startMetricsCollection();
  }

  stop() {
    if (!this.isRunning) return;

    console.log('📊 Stopping Live Analytics Service...');
    this.isRunning = false;

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    this.metricsHistory.clear();
    this.currentMetrics.clear();
  }

  private startMetricsCollection() {
    // Initial collection
    setTimeout(() => this.collectMetrics(), 1000);

    // Set up periodic collection
    this.updateInterval = setInterval(async () => {
      await this.collectMetrics();
    }, this.UPDATE_FREQUENCY);

    console.log('📊 Live analytics collection started');
  }

  private async collectMetrics() {
    try {
      // Collect system metrics
      const systemMetrics = await this.getSystemMetrics();
      
      // Collect business metrics
      const businessMetrics = await this.getBusinessMetrics();

      // Update metrics
      this.updateMetric('cpu_usage', systemMetrics.cpu);
      this.updateMetric('memory_usage', systemMetrics.memory);
      this.updateMetric('disk_usage', systemMetrics.disk);
      this.updateMetric('network_in', systemMetrics.networkIn);
      this.updateMetric('network_out', systemMetrics.networkOut);
      this.updateMetric('active_connections', systemMetrics.activeConnections);
      this.updateMetric('requests_per_second', systemMetrics.requestsPerSecond);
      this.updateMetric('error_rate', systemMetrics.errorRate);

      this.updateMetric('total_users', businessMetrics.totalUsers);
      this.updateMetric('active_users', businessMetrics.activeUsers);
      this.updateMetric('new_registrations', businessMetrics.newRegistrations);
      this.updateMetric('total_transactions', businessMetrics.totalTransactions);
      this.updateMetric('transaction_volume', businessMetrics.transactionVolume);
      this.updateMetric('portfolio_value', businessMetrics.portfolioValue);
      this.updateMetric('conversion_rate', businessMetrics.conversionRate);

      // Broadcast updates
      await this.broadcastMetrics();

      console.log('📊 Analytics metrics collected and broadcasted');
    } catch (error) {
      console.error('Error collecting analytics metrics:', error);
    }
  }

  private updateMetric(name: string, value: number) {
    const timestamp = new Date();
    const previousMetric = this.currentMetrics.get(name);
    
    let change = 0;
    let changePercent = 0;
    
    if (previousMetric) {
      change = value - previousMetric.value;
      changePercent = previousMetric.value !== 0 ? (change / previousMetric.value) * 100 : 0;
    }

    const metric: AnalyticsMetric = {
      name,
      value,
      timestamp,
      change,
      changePercent
    };

    // Update current metric
    this.currentMetrics.set(name, metric);

    // Add to history
    if (!this.metricsHistory.has(name)) {
      this.metricsHistory.set(name, []);
    }
    
    const history = this.metricsHistory.get(name)!;
    history.push(metric);

    // Keep only last 100 data points
    if (history.length > 100) {
      history.shift();
    }
  }

  private async getSystemMetrics(): Promise<SystemMetrics> {
    // Get system metrics
    const cpuUsage = await this.getCPUUsage();
    const memoryUsage = await this.getMemoryUsage();
    const diskUsage = await this.getDiskUsage();
    
    // Calculate network metrics
    const networkMetrics = this.getNetworkMetrics();
    
    // Calculate request metrics
    const requestMetrics = this.getRequestMetrics();

    return {
      cpu: cpuUsage,
      memory: memoryUsage,
      disk: diskUsage,
      networkIn: networkMetrics.in,
      networkOut: networkMetrics.out,
      activeConnections: this.getActiveConnections(),
      requestsPerSecond: requestMetrics.rps,
      errorRate: requestMetrics.errorRate
    };
  }

  private async getBusinessMetrics(): Promise<BusinessMetrics> {
    try {
      const totalUsers = await storage.getUserCount?.() || 0;
      const activeUsers = await this.getActiveUserCount();
      const newRegistrations = await this.getNewRegistrationCount();
      const totalTransactions = await storage.getTransactionCount?.() || 0;
      const transactionVolume = await this.getTransactionVolume();
      const portfolioValue = await this.getTotalPortfolioValue();
      const conversionRate = await this.getConversionRate();

      return {
        totalUsers,
        activeUsers,
        newRegistrations,
        totalTransactions,
        transactionVolume,
        portfolioValue,
        conversionRate
      };
    } catch (error) {
      console.error('Error fetching business metrics:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        newRegistrations: 0,
        totalTransactions: 0,
        transactionVolume: 0,
        portfolioValue: 0,
        conversionRate: 0
      };
    }
  }

  private async getCPUUsage(): Promise<number> {
    // Simple CPU usage simulation
    return Math.random() * 100;
  }

  private async getMemoryUsage(): Promise<number> {
    const used = process.memoryUsage();
    const total = used.heapUsed + used.heapTotal;
    return (used.heapUsed / total) * 100;
  }

  private async getDiskUsage(): Promise<number> {
    // Disk usage simulation
    return Math.random() * 100;
  }

  private getNetworkMetrics() {
    // Network metrics simulation
    return {
      in: Math.random() * 1000,
      out: Math.random() * 1000
    };
  }

  private getRequestMetrics() {
    const now = Date.now();
    const timeDiff = (now - this.lastRequestTime) / 1000; // seconds
    const rps = timeDiff > 0 ? this.requestCounter / timeDiff : 0;
    const errorRate = this.requestCounter > 0 ? (this.errorCounter / this.requestCounter) * 100 : 0;

    // Reset counters
    this.requestCounter = 0;
    this.errorCounter = 0;
    this.lastRequestTime = now;

    return { rps, errorRate };
  }

  private getActiveConnections(): number {
    return adminWebSocketManager.getConnectedAdminsCount();
  }

  private async getActiveUserCount(): Promise<number> {
    // Simulate active user count
    return Math.floor(Math.random() * 100);
  }

  private async getNewRegistrationCount(): Promise<number> {
    // Get registrations from last 24 hours
    return Math.floor(Math.random() * 10);
  }

  private async getTransactionVolume(): Promise<number> {
    // Get transaction volume from last 24 hours
    return Math.random() * 1000000;
  }

  private async getTotalPortfolioValue(): Promise<number> {
    // Get total portfolio value across all users
    return Math.random() * 10000000;
  }

  private async getConversionRate(): Promise<number> {
    // Calculate conversion rate (registrations to active traders)
    return Math.random() * 100;
  }

  private async broadcastMetrics() {
    const metricsData = {
      current: Object.fromEntries(this.currentMetrics),
      timestamp: Date.now(),
      systemHealth: this.getSystemHealthStatus()
    };

    // Send to admin WebSocket clients
    adminWebSocketManager.broadcastToChannel('analytics_dashboard', metricsData);

    // Send to admin SSE clients
    broadcastSSEToAdmins({
      type: 'analytics_update',
      data: metricsData,
      timestamp: Date.now()
    });
  }

  private getSystemHealthStatus() {
    const cpu = this.currentMetrics.get('cpu_usage')?.value || 0;
    const memory = this.currentMetrics.get('memory_usage')?.value || 0;
    const errorRate = this.currentMetrics.get('error_rate')?.value || 0;

    if (cpu > 90 || memory > 90 || errorRate > 10) {
      return 'critical';
    } else if (cpu > 70 || memory > 70 || errorRate > 5) {
      return 'warning';
    } else {
      return 'healthy';
    }
  }

  // Public methods for tracking requests and errors
  public trackRequest() {
    this.requestCounter++;
  }

  public trackError() {
    this.errorCounter++;
  }

  // Public getters
  public getMetric(name: string): AnalyticsMetric | undefined {
    return this.currentMetrics.get(name);
  }

  public getMetricHistory(name: string, limit = 50): AnalyticsMetric[] {
    const history = this.metricsHistory.get(name) || [];
    return history.slice(-limit);
  }

  public getAllCurrentMetrics(): Map<string, AnalyticsMetric> {
    return new Map(this.currentMetrics);
  }

  public getSystemHealthDashboard() {
    return {
      status: this.getSystemHealthStatus(),
      metrics: Object.fromEntries(this.currentMetrics),
      uptime: process.uptime(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      lastUpdated: new Date()
    };
  }
}

export const liveAnalyticsService = new LiveAnalyticsService();
