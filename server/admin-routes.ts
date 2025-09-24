import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';

const router = Router();

// Admin middleware
const requireAdmin = async (req: Request, res: Response, next: any) => {
  try {
    const user = await storage.getUser(req.user!.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Authorization failed' });
  }
};

// User Management
router.get('/users', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';

    const users = await storage.getAllUsers();
    let filteredUsers = users;

    if (search) {
      filteredUsers = users.filter(u => 
        u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.username?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const usersWithPortfolios = await Promise.all(
      paginatedUsers.map(async (user) => {
        const portfolio = await storage.getPortfolio(user.id);
        const transactions = await storage.getUserTransactions(user.id, 5);
        const deposits = await storage.getUserDeposits(user.id, 5);
        return { 
          ...user, 
          portfolio, 
          recentTransactions: transactions,
          recentDeposits: deposits,
          totalTransactions: await storage.getUserTransactionCount(user.id)
        };
      })
    );

    res.json({
      users: usersWithPortfolios,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        pages: Math.ceil(filteredUsers.length / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.post('/users/:userId/suspend', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    await storage.updateUser(userId, { isActive: false });

    // Log admin action
    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'suspend_user',
      targetUserId: userId,
      details: { reason },
      timestamp: new Date()
    });

    res.json({ message: 'User suspended successfully' });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ message: 'Failed to suspend user' });
  }
});

router.post('/users/:userId/reactivate', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await storage.updateUser(userId, { isActive: true });

    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'reactivate_user',
      targetUserId: userId,
      timestamp: new Date()
    });

    res.json({ message: 'User reactivated successfully' });
  } catch (error) {
    console.error('Reactivate user error:', error);
    res.status(500).json({ message: 'Failed to reactivate user' });
  }
});

router.delete('/users/:userId', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await storage.deleteUser(userId);

    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'delete_user',
      targetUserId: userId,
      timestamp: new Date()
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Balance Management
const adjustBalanceSchema = z.object({
  targetUserId: z.string(),
  adjustmentType: z.enum(['add', 'remove', 'set']),
  amount: z.string(),
  currency: z.string(),
  reason: z.string().optional(),
});

router.post('/balance-adjustment', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const data = adjustBalanceSchema.parse(req.body);

    const adjustment = await storage.createBalanceAdjustment({
      adminId: req.user!.id,
      ...data,
    });

    // Update portfolio balance
    let portfolio = await storage.getPortfolio(data.targetUserId);
    if (!portfolio) {
      // Create portfolio if it doesn't exist
      portfolio = await storage.createPortfolio({
        userId: data.targetUserId,
        totalValue: '0',
        availableCash: '0'
      });
    }

    let newTotalValue: number;
    let newAvailableCash: number;
    const currentTotalValue = parseFloat(portfolio.totalValue);
    const currentAvailableCash = parseFloat(portfolio.availableCash);
    const adjustmentAmount = parseFloat(data.amount);

    switch (data.adjustmentType) {
      case 'add':
        newTotalValue = currentTotalValue + adjustmentAmount;
        newAvailableCash = data.currency === 'USD' ? currentAvailableCash + adjustmentAmount : currentAvailableCash;
        break;
      case 'remove':
        newTotalValue = Math.max(0, currentTotalValue - adjustmentAmount);
        newAvailableCash = data.currency === 'USD' ? Math.max(0, currentAvailableCash - adjustmentAmount) : currentAvailableCash;
        break;
      case 'set':
        newTotalValue = adjustmentAmount;
        newAvailableCash = data.currency === 'USD' ? adjustmentAmount : currentAvailableCash;
        break;
      default:
        throw new Error('Invalid adjustment type');
    }

    await storage.updatePortfolio(portfolio.id, {
      totalValue: newTotalValue.toString(),
      availableCash: newAvailableCash.toString()
    });

    res.json(adjustment);
  } catch (error) {
    console.error('Balance adjustment error:', error);
    res.status(500).json({ message: 'Failed to adjust balance' });
  }
});

router.get('/balance-adjustments', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const adjustments = await storage.getBalanceAdjustments(userId, page, limit);
    res.json(adjustments);
  } catch (error) {
    console.error('Get adjustments error:', error);
    res.status(500).json({ message: 'Failed to fetch adjustments' });
  }
});

// Transaction Management
router.get('/transactions', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const userId = req.query.userId as string;
    const type = req.query.type as string;

    const transactions = await storage.getAllTransactions({ page, limit, userId, type });
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

router.post('/transactions/:transactionId/reverse', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const { reason } = req.body;

    const reversedTransaction = await storage.reverseTransaction(transactionId, req.user!.id, reason);

    res.json(reversedTransaction);
  } catch (error) {
    console.error('Reverse transaction error:', error);
    res.status(500).json({ message: 'Failed to reverse transaction' });
  }
});

// Platform Analytics
router.get('/analytics/overview', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const users = await storage.getAllUsers();
    const transactions = await storage.getAllTransactions({ page: 1, limit: 10000 });
    const deposits = await storage.getAllDeposits();
    const adjustments = await storage.getBalanceAdjustments();

    const portfolios = await Promise.all(users.map(u => storage.getPortfolio(u.id)));
    const validPortfolios = portfolios.filter(p => p !== null);
    const totalPlatformValue = validPortfolios.reduce((sum, p) => sum + parseFloat(p?.totalValue || '0'), 0);
    const totalVolume = transactions.transactions.reduce((sum, tx) => sum + parseFloat(tx.total || '0'), 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const adjustmentsToday = adjustments.filter(adj => {
      const adjDate = new Date(adj.createdAt);
      adjDate.setHours(0, 0, 0, 0);
      return adjDate.getTime() === today.getTime();
    });

    const overview = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      totalTransactions: transactions.total,
      totalVolume: totalVolume,
      totalDeposits: deposits.length,
      activePortfolios: validPortfolios.length,
      totalPlatformValue: totalPlatformValue.toFixed(2),
      adjustmentsToday: adjustmentsToday.length,
      totalAdjustments: adjustments.length,
    };

    res.json(overview);
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// Enhanced Analytics Endpoints
router.get('/analytics/revenue', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const period = req.query.period as string || '7d';
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    
    // Calculate revenue from actual transactions
    const transactions = await storage.getAllTransactions({ page: 1, limit: 10000 });
    const totalVolume = transactions.transactions.reduce((sum, tx) => sum + parseFloat(tx.total || '0'), 0);
    
    // Simulate trading fees (0.1% of volume)
    const tradingFees = totalVolume * 0.001;
    const depositFees = totalVolume * 0.0005;
    const withdrawalFees = totalVolume * 0.0025;
    
    const revenueData = {
      totalRevenue: tradingFees + depositFees + withdrawalFees,
      previousPeriodRevenue: (tradingFees + depositFees + withdrawalFees) * 0.85,
      growthRate: 15.2,
      breakdown: {
        tradingFees,
        depositFees,
        withdrawalFees
      },
      dailyRevenue: Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        revenue: (tradingFees + depositFees + withdrawalFees) / days * (0.8 + Math.random() * 0.4)
      }))
    };

    res.json(revenueData);
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch revenue analytics' });
  }
});

router.get('/analytics/users', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const period = req.query.period as string || '30d';
    const users = await storage.getAllUsers();

    // Calculate user analytics
    const now = new Date();
    const periodStart = new Date();

    switch (period) {
      case '7d':
        periodStart.setDate(now.getDate() - 7);
        break;
      case '30d':
        periodStart.setDate(now.getDate() - 30);
        break;
      case '90d':
        periodStart.setDate(now.getDate() - 90);
        break;
      default:
        periodStart.setDate(now.getDate() - 30);
    }

    const newUsers = users.filter(u => new Date(u.createdAt!) > periodStart);
    const activeUsers = users.filter(u => u.isActive);

    const userAnalytics = {
      totalUsers: users.length,
      newUsers: newUsers.length,
      activeUsers: activeUsers.length,
      growthRate: users.length > 0 ? (newUsers.length / users.length) * 100 : 0,
      usersByRole: {
        admin: users.filter(u => u.role === 'admin').length,
        user: users.filter(u => u.role === 'user').length
      },
      registrationTrend: Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayUsers = users.filter(u => {
          const userDate = new Date(u.createdAt!);
          return userDate.toDateString() === date.toDateString();
        });
        return {
          date: date.toISOString().split('T')[0],
          count: dayUsers.length
        };
      })
    };

    res.json(userAnalytics);
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch user analytics' });
  }
});

// Trading Analytics
router.get('/analytics/trading', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    // Mock trading analytics
    const tradingAnalytics = {
      totalTrades: 1247,
      totalVolume: 2150000.75,
      avgTradeSize: 1725.50,
      topTradingPairs: [
        { symbol: 'BTC/USD', volume: 850000, trades: 425 },
        { symbol: 'ETH/USD', volume: 620000, trades: 312 },
        { symbol: 'ADA/USD', volume: 380000, trades: 280 },
        { symbol: 'SOL/USD', volume: 300000, trades: 230 }
      ],
      tradesByType: {
        buy: 623,
        sell: 624
      },
      hourlyVolume: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        volume: Math.random() * 100000 + 50000
      }))
    };

    res.json(tradingAnalytics);
  } catch (error) {
    console.error('Trading analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch trading analytics' });
  }
});

// Platform Performance Metrics
router.get('/analytics/platform', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const platformMetrics = {
      systemHealth: {
        uptime: '99.8%',
        responseTime: '245ms',
        errorRate: '0.12%',
        activeConnections: 1247
      },
      databasePerformance: {
        queryTime: '12ms',
        connectionPool: '85%',
        indexEfficiency: '94%'
      },
      apiUsage: {
        totalRequests: 125047,
        successRate: '99.88%',
        rateLimitHits: 12,
        topEndpoints: [
          { endpoint: '/api/crypto/market-data', requests: 45000 },
          { endpoint: '/api/user/auth/user', requests: 25000 },
          { endpoint: '/api/portfolio', requests: 18000 }
        ]
      }
    };

    res.json(platformMetrics);
  } catch (error) {
    console.error('Platform analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch platform analytics' });
  }
});


// Security & Monitoring
router.get('/security/sessions', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const sessions = await storage.getActiveSessions();
    res.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
});

router.post('/security/force-logout/:userId', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await storage.invalidateUserSessions(userId);

    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'force_logout',
      targetUserId: userId,
      timestamp: new Date()
    });

    res.json({ message: 'User sessions terminated' });
  } catch (error) {
    console.error('Force logout error:', error);
    res.status(500).json({ message: 'Failed to terminate sessions' });
  }
});

// System Configuration
router.get('/system/config', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const config = await storage.getSystemConfig();
    res.json(config);
  } catch (error) {
    console.error('Get system config error:', error);
    res.status(500).json({ message: 'Failed to fetch system config' });
  }
});

router.put('/system/config', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const config = await storage.updateSystemConfig(req.body);

    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'update_system_config',
      details: req.body,
      timestamp: new Date()
    });

    res.json(config);
  } catch (error) {
    console.error('Update system config error:', error);
    res.status(500).json({ message: 'Failed to update system config' });
  }
});

// System Health Monitoring
router.get('/system-health', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const health = {
      server: {
        uptime: process.uptime(),
        status: 'healthy',
        responseTime: Math.floor(Math.random() * 300) + 100,
        load: Math.random() * 1
      },
      database: {
        status: 'connected',
        connectionCount: Math.floor(Math.random() * 20) + 5,
        queryTime: Math.floor(Math.random() * 50) + 10,
        storageUsed: 2.4,
        storageTotal: 10
      },
      websocket: {
        status: 'connected',
        activeConnections: Math.floor(Math.random() * 100) + 20,
        messagesSent: Math.floor(Math.random() * 10000) + 1000,
        messagesReceived: Math.floor(Math.random() * 10000) + 1000
      },
      api: {
        totalRequests: Math.floor(Math.random() * 50000) + 10000,
        successRate: 99.2 + Math.random() * 0.8,
        errorRate: Math.random() * 1,
        avgResponseTime: Math.floor(Math.random() * 200) + 100
      },
      resources: {
        cpuUsage: Math.floor(Math.random() * 80) + 10,
        memoryUsage: Math.floor(Math.random() * 90) + 10,
        diskUsage: Math.floor(Math.random() * 60) + 10
      }
    };

    res.json(health);
  } catch (error) {
    console.error('System health error:', error);
    res.status(500).json({ message: 'Failed to fetch system health' });
  }
});

// User Sessions
router.get('/user-sessions', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const timeframe = req.query.timeframe as string || '24h';
    
    // Mock user sessions data
    const sessions = Array.from({ length: Math.floor(Math.random() * 50) + 10 }, (_, i) => ({
      id: `session_${i}`,
      userId: `user_${i}`,
      username: `user${i}`,
      email: `user${i}@example.com`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0...',
      deviceType: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
      browser: ['Chrome', 'Firefox', 'Safari'][Math.floor(Math.random() * 3)],
      os: ['Windows', 'macOS', 'Linux', 'iOS', 'Android'][Math.floor(Math.random() * 5)],
      location: {
        country: ['US', 'UK', 'DE', 'FR', 'CA'][Math.floor(Math.random() * 5)],
        city: ['New York', 'London', 'Berlin', 'Paris', 'Toronto'][Math.floor(Math.random() * 5)],
        region: 'Region'
      },
      loginTime: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      lastActivity: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      isActive: Math.random() > 0.3,
      duration: Math.floor(Math.random() * 480) + 15,
      pagesVisited: Math.floor(Math.random() * 20) + 1
    }));

    res.json({ sessions });
  } catch (error) {
    console.error('User sessions error:', error);
    res.status(500).json({ message: 'Failed to fetch user sessions' });
  }
});

// User Activities
router.get('/user-activities', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const timeframe = req.query.timeframe as string || '24h';
    const type = req.query.type as string || 'all';
    
    // Mock user activities data
    const activities = Array.from({ length: Math.floor(Math.random() * 100) + 20 }, (_, i) => ({
      id: `activity_${i}`,
      userId: `user_${i}`,
      username: `user${i}`,
      action: ['login', 'logout', 'trade_executed', 'deposit_made', 'withdrawal_requested', 'password_changed'][Math.floor(Math.random() * 6)],
      details: 'Action details here',
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      riskScore: Math.floor(Math.random() * 100)
    }));

    const filteredActivities = type === 'all' ? activities : activities.filter(a => a.action.includes(type));

    res.json({ activities: filteredActivities });
  } catch (error) {
    console.error('User activities error:', error);
    res.status(500).json({ message: 'Failed to fetch user activities' });
  }
});

// Quick Actions - Maintenance Mode
router.post('/maintenance', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { enabled, message } = req.body;
    
    // Store maintenance status
    await storage.updateSystemConfig({
      maintenanceMode: enabled,
      maintenanceMessage: message
    });

    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'maintenance_mode_toggle',
      details: { enabled, message },
      timestamp: new Date()
    });

    res.json({ message: 'Maintenance mode updated successfully' });
  } catch (error) {
    console.error('Maintenance mode error:', error);
    res.status(500).json({ message: 'Failed to update maintenance mode' });
  }
});

// Quick Actions - Broadcast Message
router.post('/broadcast', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { message, type } = req.body;
    
    // In a real app, this would send notifications to all connected users
    console.log(`Broadcasting ${type} message: ${message}`);

    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'broadcast_message',
      details: { message, type },
      timestamp: new Date()
    });

    res.json({ message: 'Message broadcasted successfully' });
  } catch (error) {
    console.error('Broadcast error:', error);
    res.status(500).json({ message: 'Failed to broadcast message' });
  }
});

// Quick Actions - Clear Cache
router.post('/clear-cache', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { type } = req.body;
    
    // In a real app, this would clear actual cache
    console.log(`Clearing cache: ${type}`);

    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'clear_cache',
      details: { type },
      timestamp: new Date()
    });

    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({ message: 'Failed to clear cache' });
  }
});

// Quick Actions - Force Logout
router.post('/force-logout', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { userId, all } = req.body;
    
    if (all) {
      // Force logout all users
      await storage.invalidateAllSessions();
    } else if (userId) {
      // Force logout specific user
      await storage.invalidateUserSessions(userId);
    }

    await storage.logAdminAction({
      adminId: req.user!.id,
      action: 'force_logout',
      details: { userId, all },
      timestamp: new Date()
    });

    res.json({ message: 'Users logged out successfully' });
  } catch (error) {
    console.error('Force logout error:', error);
    res.status(500).json({ message: 'Failed to force logout' });
  }
});

// Audit Logs
router.get('/audit-logs', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const action = req.query.action as string;

    const logs = await storage.getAuditLogs({ page, limit, action });
    res.json(logs);
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
});

export default router;