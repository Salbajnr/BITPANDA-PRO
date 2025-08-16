
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
    
    const portfolio = await storage.getPortfolio(data.targetUserId);
    if (portfolio) {
      let newValue: number;
      const currentValue = parseFloat(portfolio.totalValue);
      const adjustmentAmount = parseFloat(data.amount);
      
      switch (data.adjustmentType) {
        case 'add':
          newValue = currentValue + adjustmentAmount;
          break;
        case 'remove':
          newValue = Math.max(0, currentValue - adjustmentAmount);
          break;
        case 'set':
          newValue = adjustmentAmount;
          break;
        default:
          throw new Error('Invalid adjustment type');
      }
      
      await storage.updatePortfolio(portfolio.id, {
        totalValue: newValue.toString(),
        availableCash: data.currency === 'USD' ? newValue.toString() : portfolio.availableCash
      });
    }
    
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
    const overview = await storage.getAnalyticsOverview();
    res.json(overview);
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

router.get('/analytics/revenue', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const period = req.query.period as string || '7d';
    const revenue = await storage.getRevenueAnalytics(period);
    res.json(revenue);
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch revenue analytics' });
  }
});

router.get('/analytics/users', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const period = req.query.period as string || '30d';
    const userAnalytics = await storage.getUserAnalytics(period);
    res.json(userAnalytics);
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch user analytics' });
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
