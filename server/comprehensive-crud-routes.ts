
import { Router } from 'express';
import { requireAuth, requireAdmin } from './simple-auth';
import { storage } from './storage';
import { z } from 'zod';

const router = Router();

// Generic CRUD operations for admin users

// Users CRUD (Admin only)
router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await storage.getAllUsers();
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

router.get('/users/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await storage.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

router.patch('/users/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    await storage.updateUser(id, updates);
    const updatedUser = await storage.getUser(id);

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

router.delete('/users/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await storage.deleteUser(req.params.id);
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// Transactions CRUD
router.get('/transactions', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.role === 'admin' ? req.query.userId as string : req.user!.id;
    const transactions = await storage.getUserTransactions(userId || req.user!.id);
    
    res.json({
      success: true,
      data: transactions,
      count: transactions.length
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
});

router.get('/transactions/:id', requireAuth, async (req, res) => {
  try {
    const transaction = await storage.getTransaction(req.params.id);
    
    // Check if user owns this transaction or is admin
    if (!transaction || (transaction.userId !== req.user!.id && req.user!.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction'
    });
  }
});

// Holdings CRUD
router.get('/holdings', requireAuth, async (req, res) => {
  try {
    const portfolio = await storage.getPortfolio(req.user!.id);
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    const holdings = await storage.getHoldings(portfolio.id);
    res.json({
      success: true,
      data: holdings,
      count: holdings.length
    });
  } catch (error) {
    console.error('Get holdings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch holdings'
    });
  }
});

router.patch('/holdings/:symbol', requireAuth, async (req, res) => {
  try {
    const portfolio = await storage.getPortfolio(req.user!.id);
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    const { symbol } = req.params;
    const updates = req.body;

    await storage.upsertHolding({
      portfolioId: portfolio.id,
      symbol,
      ...updates
    });

    const updatedHolding = await storage.getHolding(portfolio.id, symbol);
    res.json({
      success: true,
      data: updatedHolding
    });
  } catch (error) {
    console.error('Update holding error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update holding'
    });
  }
});

// Alerts CRUD operations
router.post('/alerts', requireAuth, async (req, res) => {
  try {
    const alertData = {
      userId: req.user!.id,
      ...req.body
    };

    const alert = await storage.createAlert(alertData);
    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create alert'
    });
  }
});

router.patch('/alerts/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verify alert ownership
    const alert = await storage.getAlert(id);
    if (!alert || (alert.userId !== req.user!.id && req.user!.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    await storage.updateAlert(id, updates);
    const updatedAlert = await storage.getAlert(id);

    res.json({
      success: true,
      data: updatedAlert
    });
  } catch (error) {
    console.error('Update alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update alert'
    });
  }
});

export default router;
