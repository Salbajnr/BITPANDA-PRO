
import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';
import { nanoid } from 'nanoid';

const router = Router();

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        role: string;
      };
    }
  }
}

type AuthenticatedRequest = Request & { user: NonNullable<Request['user']> };

const createWithdrawalSchema = z.object({
  payment_method: z.string().min(1, "Payment method is required"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("USD"),
  destination_address: z.string().min(1, "Destination address is required"),
  destination_details: z.string().optional(),
  notes: z.string().optional(),
});

// Create withdrawal request
router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const withdrawalData = createWithdrawalSchema.parse(req.body);

    // Check if user has sufficient balance
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(400).json({ error: "Portfolio not found" });
    }

    const availableBalance = parseFloat(portfolio.availableCash);
    if (withdrawalData.amount > availableBalance) {
      return res.status(400).json({ 
        error: "Insufficient funds",
        available: availableBalance,
        requested: withdrawalData.amount
      });
    }

    const withdrawal = await storage.createWithdrawal({
      userId,
      paymentMethod: withdrawalData.payment_method,
      amount: withdrawalData.amount.toString(),
      currency: withdrawalData.currency,
      destinationAddress: withdrawalData.destination_address,
      destinationDetails: withdrawalData.destination_details || null,
      notes: withdrawalData.notes || null,
      status: 'pending',
      transactionId: nanoid(16),
    });

    // Temporarily hold the funds (reduce available cash)
    const newAvailableCash = availableBalance - withdrawalData.amount;
    await storage.updatePortfolio(portfolio.id, {
      availableCash: newAvailableCash.toString()
    });

    res.json(withdrawal);
  } catch (error) {
    console.error("Create withdrawal error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Validation error",
        details: error.errors 
      });
    }
    res.status(500).json({ error: "Failed to create withdrawal" });
  }
});

// Get user withdrawals
router.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const withdrawals = await storage.getUserWithdrawals(userId);
    res.json(withdrawals);
  } catch (error) {
    console.error("Get withdrawals error:", error);
    res.status(500).json({ error: "Failed to fetch withdrawals" });
  }
});

// Get all withdrawals (admin only)
router.get('/all', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await storage.getUser(req.user!.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }

    const withdrawals = await storage.getAllWithdrawals();
    res.json(withdrawals);
  } catch (error) {
    console.error("Get all withdrawals error:", error);
    res.status(500).json({ error: "Failed to fetch withdrawals" });
  }
});

// Update withdrawal status (admin only)
router.patch('/:id/status', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await storage.getUser(req.user!.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const withdrawal = await storage.updateWithdrawalStatus(id, status, adminNotes);
    
    if (!withdrawal) {
      return res.status(404).json({ error: "Withdrawal not found" });
    }

    // If rejected, refund the held amount to available cash
    if (status === 'rejected') {
      const portfolio = await storage.getPortfolio(withdrawal.userId);
      if (portfolio) {
        const newAvailableCash = parseFloat(portfolio.availableCash) + parseFloat(withdrawal.amount);
        await storage.updatePortfolio(portfolio.id, {
          availableCash: newAvailableCash.toString()
        });
      }
    }

    // If approved, deduct from total value as well
    if (status === 'approved') {
      const portfolio = await storage.getPortfolio(withdrawal.userId);
      if (portfolio) {
        const newTotalValue = parseFloat(portfolio.totalValue) - parseFloat(withdrawal.amount);
        await storage.updatePortfolio(portfolio.id, {
          totalValue: Math.max(0, newTotalValue).toString()
        });
      }
    }

    res.json(withdrawal);
  } catch (error) {
    console.error("Update withdrawal status error:", error);
    res.status(500).json({ error: "Failed to update withdrawal status" });
  }
});

export default router;
