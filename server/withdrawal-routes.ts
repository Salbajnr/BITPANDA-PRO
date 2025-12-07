import { Router } from 'express';
import { requireAuth, requireAdmin } from './simple-auth';
import { storage } from './storage';
import { z } from 'zod';
import crypto from 'crypto';
import { sendTransactionEmail } from './email-service';

const router = Router();

// Validation schemas
const createWithdrawalSchema = z.object({
  amount: z.string().min(1),
  currency: z.string().default('USD'),
  withdrawalMethod: z.enum(['bank_transfer', 'crypto_wallet', 'paypal', 'mobile_money', 'other']),
  destinationAddress: z.string().min(1),
  // z.record requires key and value types in this Zod version
  destinationDetails: z.record(z.string(), z.any()).optional(),
  notes: z.string().optional(),
});

const confirmWithdrawalSchema = z.object({
  token: z.string().min(1),
});

const adminActionSchema = z.object({
  adminNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
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

// Get all withdrawals (admin only)
router.get('/all', requireAuth, requireAdmin, async (req, res) => {
  try {
    const withdrawals = await storage.getAllWithdrawals();
    res.json(withdrawals);
  } catch (error) {
    console.error('Error fetching all withdrawals:', error);
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

    // Check minimum withdrawal amount
    if (amount < 10) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is $10' });
    }

    // Check user balance
    const portfolio = await storage.getPortfolio(req.user!.id);
    if (!portfolio || parseFloat(portfolio.availableCash) < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Check withdrawal limits
    const limitValue = await storage.getWithdrawalLimits(req.user!.id);
    const dailyLimit = parseFloat(limitValue || '1000');

    if (amount > dailyLimit) {
      return res.status(400).json({
        message: `Withdrawal limit exceeded. Daily limit: $${dailyLimit.toFixed(2)}`
      });
    }

    // Calculate fees
    const fees = await storage.calculateWithdrawalFees(amount, validatedData.withdrawalMethod);
    const netAmount = amount - fees;

    if (netAmount <= 0) {
      return res.status(400).json({ message: 'Net amount after fees must be greater than zero' });
    }

    // Generate confirmation token (for email verification)
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const confirmationExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Create withdrawal request
    const withdrawalResult = await storage.createWithdrawal({
      userId: req.user!.id,
      amount: amount.toString(),
      type: 'withdrawal',
      assetType: 'crypto',
      symbol: 'USD',
      price: '1',
      total: amount.toString(),
      status: 'pending_confirmation',
      fees: fees.toString()
    });

    const withdrawal = withdrawalResult[0];

    // Reserve funds by reducing available balance
    await storage.updatePortfolioBalance(req.user!.id, -amount);

    // Send confirmation email with token
    try {
      await sendTransactionEmail({
        to: req.user!.email,
        transactionType: 'withdrawal',
        amount: amount.toString(),
        currency: validatedData.currency,
        transactionId: withdrawal.id,
        status: 'Pending'
      });
      console.log(`✅ Withdrawal confirmation email sent to ${req.user!.email} for withdrawal ${withdrawal.id}`);
    } catch (emailError) {
      console.error('Failed to send withdrawal confirmation email:', emailError);
      // Optionally, you might want to handle this error more gracefully,
      // perhaps by marking the withdrawal as 'confirmation_email_failed'
      // or providing a way for the user to resend the email.
    }


    res.json({
      message: 'Withdrawal request created. Please check your email to confirm within 30 minutes.',
      withdrawalId: withdrawal.id,
      requiresConfirmation: true,
      fees: fees.toString(),
      netAmount: netAmount.toString(),
      expiresAt: confirmationExpiresAt.toISOString()
    });
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    const { formatErrorForResponse } = await import('./lib/errorUtils');
    const formatted = formatErrorForResponse(error);
    if ((error as any)?.errors) {
      return res.status(400).json({ message: 'Invalid request data', errors: formatted });
    }
    res.status(500).json({ message: 'Failed to create withdrawal request', error: formatted });
  }
});

// Confirm withdrawal via email token
router.post('/confirm', requireAuth, async (req, res) => {
  try {
    const { token } = confirmWithdrawalSchema.parse(req.body);

    const withdrawal = await storage.confirmWithdrawal(req.user!.id, token);
    if (!withdrawal) {
      return res.status(400).json({ message: 'Invalid or expired confirmation token' });
    }

    // Update withdrawal status to under_review
    await storage.updateWithdrawalStatus(withdrawal.id, 'under_review', 'Confirmed by user, awaiting admin review');

    // Send email notification for confirmed withdrawal
    try {
      await sendTransactionEmail({
        to: req.user!.email,
        transactionType: 'withdrawal',
        amount: withdrawal.amount,
        currency: 'USD',
        status: 'Under Review',
        transactionId: withdrawal.id
      });
      console.log(`✅ Withdrawal confirmed email sent to ${req.user!.email} for withdrawal ${withdrawal.id}`);
    } catch (emailError) {
      console.error('Failed to send withdrawal confirmed email:', emailError);
    }

    res.json({
      message: 'Withdrawal confirmed successfully. Your request is now under review by our team.',
      withdrawal: {
        ...withdrawal,
        status: 'under_review'
      }
    });
  } catch (error) {
    console.error('Error confirming withdrawal:', error);
    res.status(500).json({ message: 'Failed to confirm withdrawal' });
  }
});

// Admin: Approve withdrawal
router.post('/:id/approve', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = adminActionSchema.parse(req.body);

    const withdrawal = await storage.getWithdrawalById(id);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    const user = await storage.getUser(withdrawal.userId);
    if (!user) {
      console.error(`User not found for withdrawal ${id}`);
      return res.status(404).json({ message: 'User not found for this withdrawal' });
    }

    const updatedWithdrawal = await storage.updateWithdrawalStatus(
      id,
      'approved',
      adminNotes || 'Withdrawal approved by admin'
    );

    // TODO: Process actual withdrawal (send funds to user's destination)
    // For now, we'll mark it as processing
    const processingWithdrawal = await storage.updateWithdrawalStatus(id, 'processing', 'Processing withdrawal to destination');

    // Log admin action
    console.log(`Admin ${req.user!.id} approved withdrawal ${id}`);

    // Send email notification for approved withdrawal
    try {
      await sendTransactionEmail({
        to: user.email,
        transactionType: 'withdrawal',
        amount: withdrawal.amount,
        currency: 'USD',
        status: 'Approved',
        transactionId: id
      });
      console.log(`✅ Withdrawal approved email sent to ${user.email} for withdrawal ${id}`);
    } catch (emailError) {
      console.error('Failed to send withdrawal approved email:', emailError);
    }

    res.json({
      message: 'Withdrawal approved and processing initiated',
      withdrawal: {
        ...processingWithdrawal,
        status: 'processing'
      }
    });
  } catch (error) {
    console.error('Error approving withdrawal:', error);
    res.status(500).json({ message: 'Failed to approve withdrawal' });
  }
});

// Admin: Reject withdrawal
router.post('/:id/reject', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes, rejectionReason } = adminActionSchema.parse(req.body);

    const withdrawal = await storage.getWithdrawalById(id);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    const user = await storage.getUser(withdrawal.userId);
    if (!user) {
      console.error(`User not found for withdrawal ${id}`);
      return res.status(404).json({ message: 'User not found for this withdrawal' });
    }

    // Refund the reserved amount back to user's balance
    const userPortfolio = await storage.getPortfolio(withdrawal.userId);
    if (userPortfolio) {
      const newBalance = parseFloat(userPortfolio.availableCash) + parseFloat(withdrawal.amount);
      await storage.updatePortfolio(userPortfolio.id, { availableCash: newBalance.toString() });
    }

    // Update withdrawal status
    const updatedWithdrawal = await storage.updateWithdrawalStatus(
      id,
      'rejected',
      adminNotes || rejectionReason || 'Withdrawal rejected by admin'
    );

    // Log admin action
    console.log(`Admin ${req.user!.id} rejected withdrawal ${id}: ${rejectionReason}`);

    // Send email notification for rejected withdrawal
    try {
      await sendTransactionEmail({
        to: user.email,
        transactionType: 'withdrawal',
        amount: updatedWithdrawal.amount,
        currency: 'USD',
        status: 'Rejected',
        transactionId: id
      });
      console.log(`✅ Withdrawal rejected email sent to ${user.email} for withdrawal ${id}`);
    } catch (emailError) {
      console.error('Failed to send withdrawal rejected email:', emailError);
    }

    res.json({
      message: 'Withdrawal rejected and funds returned to user account',
      withdrawal: updatedWithdrawal,
      refundedAmount: withdrawal.amount
    });
  } catch (error) {
    console.error('Error rejecting withdrawal:', error);
    res.status(500).json({ message: 'Failed to reject withdrawal' });
  }
});

// Admin: Complete withdrawal (mark as completed)
router.post('/:id/complete', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = adminActionSchema.parse(req.body);

    const withdrawal = await storage.getWithdrawalById(id);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    const user = await storage.getUser(withdrawal.userId);
    if (!user) {
      console.error(`User not found for withdrawal ${id}`);
      return res.status(404).json({ message: 'User not found for this withdrawal' });
    }

    const updatedWithdrawal = await storage.updateWithdrawalStatus(
      id,
      'completed',
      adminNotes || 'Withdrawal successfully completed'
    );

    // Log admin action
    console.log(`Admin ${req.user!.id} completed withdrawal ${id}`);

    // Send email notification for completed withdrawal
    try {
      await sendTransactionEmail({
        to: user.email,
        transactionType: 'withdrawal',
        amount: updatedWithdrawal.amount,
        currency: 'USD',
        status: 'Completed',
        transactionId: id
      });
      console.log(`✅ Withdrawal completed email sent to ${user.email} for withdrawal ${id}`);
    } catch (emailError) {
      console.error('Failed to send withdrawal completed email:', emailError);
    }

    res.json({
      message: 'Withdrawal marked as completed',
      withdrawal: updatedWithdrawal
    });
  } catch (error) {
    console.error('Error completing withdrawal:', error);
    res.status(500).json({ message: 'Failed to complete withdrawal' });
  }
});

// Cancel withdrawal (only if pending or pending_confirmation)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawal = await storage.getWithdrawalById(id);

    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    if (withdrawal.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!['pending', 'pending_confirmation'].includes(withdrawal.status)) {
      return res.status(400).json({ message: 'Cannot cancel withdrawal in current status' });
    }

    // Refund the reserved amount back to user's balance
    const userPortfolio = await storage.getPortfolio(req.user!.id);
    if (userPortfolio) {
      const newBalance = parseFloat(userPortfolio.availableCash) + parseFloat(withdrawal.amount);
      await storage.updatePortfolio(userPortfolio.id, { availableCash: newBalance.toString() });
    }

    // Update withdrawal status
    const updatedWithdrawal = await storage.updateWithdrawalStatus(id, 'rejected', 'Cancelled by user');

    // Send email notification for cancelled withdrawal
    try {
      await sendTransactionEmail({
        to: req.user!.email,
        transactionType: 'withdrawal',
        amount: updatedWithdrawal.amount,
        currency: 'USD',
        status: 'Cancelled',
        transactionId: id
      });
      console.log(`✅ Withdrawal cancelled email sent to ${req.user!.email} for withdrawal ${id}`);
    } catch (emailError) {
      console.error('Failed to send withdrawal cancelled email:', emailError);
    }

    res.json({
      message: 'Withdrawal cancelled successfully and funds returned to your account',
      withdrawal: updatedWithdrawal,
      refundedAmount: withdrawal.amount
    });
  } catch (error) {
    console.error('Error cancelling withdrawal:', error);
    res.status(500).json({ message: 'Failed to cancel withdrawal' });
  }
});

// Get withdrawal statistics (admin only)
router.get('/stats', requireAuth, requireAdmin, async (req, res) => {
  try {
    const stats = await storage.getWithdrawalStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching withdrawal stats:', error);
    res.status(500).json({ message: 'Failed to fetch withdrawal statistics' });
  }
});

// Set withdrawal limits for user (admin only)
router.post('/limits/:userId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { dailyLimit, monthlyLimit } = req.body;

    // Set daily limit (simplified - in real app you'd have separate daily/monthly tracking)
    const limits = await storage.setWithdrawalLimits(parseFloat(dailyLimit));

    res.json({
      message: 'Withdrawal limits updated successfully',
      limits: {
        dailyLimit: parseFloat(dailyLimit),
        monthlyLimit: parseFloat(monthlyLimit)
      }
    });
  } catch (error) {
    console.error('Error updating withdrawal limits:', error);
    res.status(500).json({ message: 'Failed to update withdrawal limits' });
  }
});

export default router;