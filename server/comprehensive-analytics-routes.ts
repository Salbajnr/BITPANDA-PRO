
import { Router, Request, Response } from 'express';
import { requireAuth } from './simple-auth';
import { storage } from './storage';

const router = Router();

// Get comprehensive user analytics
router.get('/overview', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    // Fetch all user data
    const [portfolio, holdings, transactions, deposits, withdrawals, alerts, watchlist] = await Promise.all([
      storage.getPortfolio(userId),
      storage.getPortfolio(userId).then(p => p ? storage.getHoldings(p.id) : []),
      storage.getUserTransactions(userId, 100),
      storage.getUserDeposits(userId),
      storage.getUserWithdrawals(userId),
      storage.getUserAlerts(userId),
      storage.getUserWatchlist(userId)
    ]);

    // Calculate analytics
    const analytics = {
      portfolio: {
        totalValue: portfolio?.totalValue || '0',
        availableCash: portfolio?.availableCash || '0',
        holdingsCount: holdings.length,
      },
      trading: {
        totalTransactions: transactions.length,
        buyOrders: transactions.filter(t => t.type === 'buy').length,
        sellOrders: transactions.filter(t => t.type === 'sell').length,
        totalVolume: transactions.reduce((sum, t) => sum + parseFloat(t.total), 0),
      },
      deposits: {
        total: deposits.length,
        pending: deposits.filter(d => d.status === 'pending').length,
        approved: deposits.filter(d => d.status === 'approved').length,
        rejected: deposits.filter(d => d.status === 'rejected').length,
        totalAmount: deposits
          .filter(d => d.status === 'approved')
          .reduce((sum, d) => sum + parseFloat(d.amount), 0),
      },
      withdrawals: {
        total: withdrawals.length,
        pending: withdrawals.filter(w => w.status === 'pending').length,
        completed: withdrawals.filter(w => w.status === 'completed').length,
        totalAmount: withdrawals
          .filter(w => w.status === 'completed')
          .reduce((sum, w) => sum + parseFloat(w.amount), 0),
      },
      alerts: {
        total: alerts.length,
        active: alerts.filter(a => a.isActive).length,
        triggered: alerts.filter(a => a.isTriggered).length,
      },
      watchlist: {
        total: watchlist.length,
      },
    };

    res.json(analytics);
  } catch (error) {
    console.error('Comprehensive analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// Get activity timeline
router.get('/timeline', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 50;

    const [transactions, deposits, withdrawals] = await Promise.all([
      storage.getUserTransactions(userId, limit),
      storage.getUserDeposits(userId),
      storage.getUserWithdrawals(userId)
    ]);

    // Combine and sort by date
    const timeline = [
      ...transactions.map(t => ({
        id: t.id,
        type: 'transaction',
        action: t.type,
        amount: t.total,
        symbol: t.symbol,
        timestamp: t.createdAt,
      })),
      ...deposits.map(d => ({
        id: d.id,
        type: 'deposit',
        action: 'deposit',
        amount: d.amount,
        status: d.status,
        timestamp: d.createdAt,
      })),
      ...withdrawals.map(w => ({
        id: w.id,
        type: 'withdrawal',
        action: 'withdrawal',
        amount: w.amount,
        status: w.status,
        timestamp: w.createdAt,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    res.json(timeline);
  } catch (error) {
    console.error('Activity timeline error:', error);
    res.status(500).json({ message: 'Failed to fetch activity timeline' });
  }
});

export default router;
