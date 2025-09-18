
import { Router } from 'express';
import { requireAuth } from './simple-auth';
import { storage } from './storage';
import { z } from 'zod';
import crypto from 'crypto';

const router = Router();

// Validation schemas
const createWithdrawalSchema = z.object({
  amount: z.string().min(1),
  currency: z.string().default('USD'),
  withdrawalMethod: z.enum(['bank_transfer', 'crypto_wallet', 'paypal', 'other']),
  destinationAddress: z.string().min(1),
  destinationDetails: z.record(z.any()).optional(),
});

const confirmWithdrawalSchema = z.object({
  token: z.string().min(1),
});

// Get user withdrawals
router.get('/', requireAuth, async (req, res) => {
  try {
    const withdrawals = await storage.getUserWithdrawals(req.user!.id);
    res.json(withdrawals);
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    res.status(500).json({ message: 'Failed to fetch withdrawals' });
  }
});

// Get withdrawal limits
router.get('/limits', requireAuth, async (req, res) => {
  try {
    const limits = await storage.getWithdrawalLimits(req.user!.id);
    res.json(limits);
  } catch (error) {
    console.error('Error fetching withdrawal limits:', error);
    res.status(500).json({ message: 'Failed to fetch withdrawal limits' });
  }
});

// Calculate withdrawal fees
router.post('/calculate-fees', requireAuth, async (req, res) => {
  try {
    const { amount, method } = req.body;
    const fees = await storage.calculateWithdrawalFees(parseFloat(amount), method);
    res.json({ 
      fees: fees.toString(),
      netAmount: (parseFloat(amount) - fees).toString()
    });
  } catch (error) {
    console.error('Error calculating fees:', error);
    res.status(500).json({ message: 'Failed to calculate fees' });
  }
});

// Request withdrawal
router.post('/request', requireAuth, async (req, res) => {
  try {
    const validatedData = createWithdrawalSchema.parse(req.body);
    const amount = parseFloat(validatedData.amount);

    // Check user balance
    const portfolio = await storage.getPortfolio(req.user!.id);
    if (!portfolio || parseFloat(portfolio.availableCash) < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Check withdrawal limits
    const limits = await storage.getWithdrawalLimits(req.user!.id);
    if (limits.dailyUsed + amount > limits.dailyLimit) {
      return res.status(400).json({ message: 'Daily withdrawal limit exceeded' });
    }
    if (limits.monthlyUsed + amount > limits.monthlyLimit) {
      return res.status(400).json({ message: 'Monthly withdrawal limit exceeded' });
    }

    // Calculate fees
    const fees = await storage.calculateWithdrawalFees(amount, validatedData.withdrawalMethod);
    const netAmount = amount - fees;

    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const confirmationExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create withdrawal request
    const withdrawal = await storage.createWithdrawal({
      userId: req.user!.id,
      amount: amount.toString(),
      currency: validatedData.currency,
      withdrawalMethod: validatedData.withdrawalMethod,
      destinationAddress: validatedData.destinationAddress,
      destinationDetails: validatedData.destinationDetails,
      fees: fees.toString(),
      netAmount: netAmount.toString(),
      confirmationToken,
      confirmationExpiresAt: confirmationExpiresAt.toISOString(),
      status: 'pending'
    });

    // TODO: Send confirmation email with token

    res.json({ 
      message: 'Withdrawal request created. Please check your email to confirm.',
      withdrawalId: withdrawal.id,
      requiresConfirmation: true
    });
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid request data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create withdrawal request' });
  }
});

// Confirm withdrawal
router.post('/confirm', requireAuth, async (req, res) => {
  try {
    const { token } = confirmWithdrawalSchema.parse(req.body);

    const withdrawal = await storage.confirmWithdrawal(req.user!.id, token);
    if (!withdrawal) {
      return res.status(400).json({ message: 'Invalid or expired confirmation token' });
    }

    res.json({ 
      message: 'Withdrawal confirmed successfully. Your request is now under review.',
      withdrawal
    });
  } catch (error) {
    console.error('Error confirming withdrawal:', error);
    res.status(500).json({ message: 'Failed to confirm withdrawal' });
  }
});

// Cancel withdrawal (only if pending)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const success = await storage.cancelWithdrawal(req.user!.id, id);
    
    if (!success) {
      return res.status(400).json({ message: 'Cannot cancel withdrawal' });
    }

    res.json({ message: 'Withdrawal cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling withdrawal:', error);
    res.status(500).json({ message: 'Failed to cancel withdrawal' });
  }
});

export default router;
