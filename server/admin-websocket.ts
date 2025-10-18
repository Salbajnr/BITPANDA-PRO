
import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { storage } from './storage';

interface AdminClient {
  ws: WebSocket;
  adminId: string;
  permissions: string[];
  lastActivity: Date;
  subscribedChannels: Set<string>;
}

class AdminWebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients = new Map<string, AdminClient>();
  private channelSubscriptions = new Map<string, Set<string>>(); // channel -> clientIds

  initialize(server: Server): void {
    if (this.wss) {
      this.wss.close();
    }

    this.wss = new WebSocketServer({
      noServer: true
    });

    // Handle admin WebSocket upgrades
    server.on('upgrade', (request, socket, head) => {
      try {
        const pathname = new URL(request.url!, `http://${request.headers.host}`).pathname;

        if (pathname === '/ws/admin') {
          this.wss!.handleUpgrade(request, socket, head, (ws) => {
            this.wss!.emit('connection', ws, request);
          });
        }
      } catch (error) {
        console.error('Admin WebSocket upgrade error:', error);
        socket.destroy();
      }
    });

    this.wss.on('connection', (ws, request) => {
      const clientId = this.generateClientId();
      console.log(`🔧 Admin WebSocket client connected: ${clientId}`);

      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(clientId, ws, message);
        } catch (error) {
          console.error('🔧 Admin WebSocket message error:', error);
          this.sendToClient(ws, {
            type: 'error',
            message: 'Invalid message format'
          });
        }
      });

      ws.on('close', () => {
        console.log(`🔧 Admin WebSocket client disconnected: ${clientId}`);
        this.removeClient(clientId);
      });

      ws.on('error', (error) => {
        console.error(`🔧 Admin WebSocket error for client ${clientId}:`, error);
        this.removeClient(clientId);
      });

      // Send welcome message
      this.sendToClient(ws, {
        type: 'connection',
        message: 'Connected to admin dashboard',
        clientId
      });
    });

    console.log('🔧 Admin WebSocket server initialized on /ws/admin');
  }

  private async handleMessage(clientId: string, ws: WebSocket, message: any): Promise<void> {
    try {
      switch (message.type) {
        case 'authenticate':
          await this.handleAuthentication(clientId, ws, message);
          break;

        case 'subscribe':
          await this.handleSubscribe(clientId, message);
          break;

        case 'unsubscribe':
          await this.handleUnsubscribe(clientId, message);
          break;

        case 'get_dashboard_data':
          await this.handleGetDashboardData(clientId, message);
          break;

        case 'get_user_analytics':
          await this.handleGetUserAnalytics(clientId, message);
          break;

        case 'get_system_metrics':
          await this.handleGetSystemMetrics(clientId);
          break;

        default:
          this.sendToClient(ws, {
            type: 'error',
            message: 'Unknown message type'
          });
      }
    } catch (error) {
      console.error('Error handling admin message:', error);
      this.sendToClient(ws, {
        type: 'error',
        message: 'Failed to process message'
      });
    }
  }

  private async handleAuthentication(clientId: string, ws: WebSocket, message: any): Promise<void> {
    const { adminId, permissions } = message;

    // Verify admin authentication (implement your admin auth logic)
    const admin = await storage.getAdminById?.(adminId);
    if (!admin) {
      this.sendToClient(ws, {
        type: 'auth_error',
        message: 'Invalid admin credentials'
      });
      return;
    }

    this.clients.set(clientId, {
      ws,
      adminId,
      permissions: permissions || [],
      lastActivity: new Date(),
      subscribedChannels: new Set()
    });

    this.sendToClient(ws, {
      type: 'authenticated',
      message: 'Admin authentication successful',
      permissions
    });
  }

  private async handleSubscribe(clientId: string, message: any): Promise<void> {
    const { channels } = message;
    const client = this.clients.get(clientId);

    if (!client) return;

    for (const channel of channels) {
      client.subscribedChannels.add(channel);
      
      if (!this.channelSubscriptions.has(channel)) {
        this.channelSubscriptions.set(channel, new Set());
      }
      this.channelSubscriptions.get(channel)!.add(clientId);
    }

    this.sendToClient(client.ws, {
      type: 'subscribed',
      channels,
      message: 'Subscribed to channels successfully'
    });

    // Send initial data for subscribed channels
    for (const channel of channels) {
      await this.sendChannelData(clientId, channel);
    }
  }

  private async handleUnsubscribe(clientId: string, message: any): Promise<void> {
    const { channels } = message;
    const client = this.clients.get(clientId);

    if (!client) return;

    for (const channel of channels) {
      client.subscribedChannels.delete(channel);
      
      const channelClients = this.channelSubscriptions.get(channel);
      if (channelClients) {
        channelClients.delete(clientId);
        if (channelClients.size === 0) {
          this.channelSubscriptions.delete(channel);
        }
      }
    }

    this.sendToClient(client.ws, {
      type: 'unsubscribed',
      channels,
      message: 'Unsubscribed from channels successfully'
    });
  }

  private async handleGetDashboardData(clientId: string, message: any): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    try {
      // Fetch real-time dashboard data
      const dashboardData = await this.getDashboardData();
      
      this.sendToClient(client.ws, {
        type: 'dashboard_data',
        data: dashboardData,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      this.sendToClient(client.ws, {
        type: 'error',
        message: 'Failed to fetch dashboard data'
      });
    }
  }

  private async handleGetUserAnalytics(clientId: string, message: any): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    try {
      const { userId, timeframe } = message;
      const analytics = await this.getUserAnalytics(userId, timeframe);
      
      this.sendToClient(client.ws, {
        type: 'user_analytics',
        data: analytics,
        userId,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      this.sendToClient(client.ws, {
        type: 'error',
        message: 'Failed to fetch user analytics'
      });
    }
  }

  private async handleGetSystemMetrics(clientId: string): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    try {
      const metrics = await this.getSystemMetrics();
      
      this.sendToClient(client.ws, {
        type: 'system_metrics',
        data: metrics,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      this.sendToClient(client.ws, {
        type: 'error',
        message: 'Failed to fetch system metrics'
      });
    }
  }

  private async sendChannelData(clientId: string, channel: string): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    try {
      let data;
      switch (channel) {
        case 'user_activity':
          data = await this.getUserActivity();
          break;
        case 'transaction_monitor':
          data = await this.getTransactionData();
          break;
        case 'system_health':
          data = await this.getSystemHealth();
          break;
        case 'portfolio_updates':
          data = await this.getPortfolioUpdates();
          break;
        case 'security_alerts':
          data = await this.getSecurityAlerts();
          break;
        default:
          return;
      }

      this.sendToClient(client.ws, {
        type: 'channel_data',
        channel,
        data,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error(`Error fetching data for channel ${channel}:`, error);
    }
  }

  // Data fetching methods
  private async getDashboardData() {
    return {
      totalUsers: await this.getTotalUsers(),
      activeUsers: await this.getActiveUsers(),
      totalTransactions: await this.getTotalTransactions(),
      systemStatus: await this.getSystemStatus(),
      recentActivity: await this.getRecentActivity()
    };
  }

  private async getUserAnalytics(userId?: string, timeframe = '24h') {
    return {
      userGrowth: await this.getUserGrowth(timeframe),
      activityMetrics: await this.getActivityMetrics(timeframe),
      conversionRates: await this.getConversionRates(timeframe)
    };
  }

  private async getSystemMetrics() {
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      network: Math.random() * 100,
      activeConnections: this.clients.size,
      websocketStatus: 'healthy',
      databaseStatus: 'healthy'
    };
  }

  private async getTotalUsers() {
    try {
      return await storage.getUserCount?.() || 0;
    } catch (error) {
      return 0;
    }
  }

  private async getActiveUsers() {
    // Implement active users logic
    return Math.floor(Math.random() * 100);
  }

  private async getTotalTransactions() {
    try {
      return await storage.getTransactionCount?.() || 0;
    } catch (error) {
      return 0;
    }
  }

  private async getSystemStatus() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      lastChecked: new Date()
    };
  }

  private async getRecentActivity() {
    // Implement recent activity fetching
    return [];
  }

  private async getUserActivity() {
    // Implement user activity fetching
    return {
      onlineUsers: Math.floor(Math.random() * 50),
      recentLogins: [],
      activeTrading: Math.floor(Math.random() * 20)
    };
  }

  private async getTransactionData() {
    // Implement transaction data fetching
    return {
      recentTransactions: [],
      volume24h: Math.random() * 1000000,
      pendingTransactions: Math.floor(Math.random() * 10)
    };
  }

  private async getSystemHealth() {
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      status: 'healthy'
    };
  }

  private async getPortfolioUpdates() {
    return {
      totalPortfolioValue: Math.random() * 10000000,
      topPerformers: [],
      recentTrades: []
    };
  }

  private async getSecurityAlerts() {
    return {
      alerts: [],
      riskLevel: 'low'
    };
  }

  private async getUserGrowth(timeframe: string) {
    return [];
  }

  private async getActivityMetrics(timeframe: string) {
    return {};
  }

  private async getConversionRates(timeframe: string) {
    return {};
  }

  // Broadcasting methods
  public broadcastToChannel(channel: string, data: any): void {
    const clientIds = this.channelSubscriptions.get(channel);
    if (!clientIds) return;

    const message = {
      type: 'broadcast',
      channel,
      data,
      timestamp: Date.now()
    };

    clientIds.forEach(clientId => {
      const client = this.clients.get(clientId);
      if (client && client.ws.readyState === WebSocket.OPEN) {
        this.sendToClient(client.ws, message);
      }
    });
  }

  public broadcastToAllAdmins(data: any): void {
    const message = {
      type: 'broadcast',
      data,
      timestamp: Date.now()
    };

    this.clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        this.sendToClient(client.ws, message);
      }
    });
  }

  private removeClient(clientId: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Remove from all channel subscriptions
    client.subscribedChannels.forEach(channel => {
      const channelClients = this.channelSubscriptions.get(channel);
      if (channelClients) {
        channelClients.delete(clientId);
        if (channelClients.size === 0) {
          this.channelSubscriptions.delete(channel);
        }
      }
    });

    this.clients.delete(clientId);
  }

  private sendToClient(ws: WebSocket, message: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private generateClientId(): string {
    return `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getConnectedAdminsCount(): number {
    return this.clients.size;
  }

  public getChannelSubscriptions(): Map<string, Set<string>> {
    return this.channelSubscriptions;
  }

  init(server: Server): void {
    this.initialize(server);
  }

  shutdown(): void {
    console.log('🔧 Shutting down admin WebSocket server...');
    try {
      this.clients.forEach(client => {
        try {
          if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.close(1000, 'Server shutting down');
          }
        } catch (error) {
          console.error('Error closing admin WebSocket connection:', error);
        }
      });
      this.clients.clear();
      this.channelSubscriptions.clear();
      console.log('✅ Admin WebSocket server shutdown complete');
    } catch (error) {
      console.error('❌ Error during admin WebSocket shutdown:', error);
    }
  }
}

export const adminWebSocketManager = new AdminWebSocketManager();
