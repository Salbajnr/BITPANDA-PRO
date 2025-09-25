import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { insertDepositSchema, insertSharedWalletAddressSchema } from '@shared/schema';

type AuthenticatedRequest = Request & { 
  user: NonNullable<Express.User>
};

const router = Router();

// Configure multer for proof of payment uploads
const upload = multer({
  dest: 'uploads/proofs/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// Validation schemas
const createDepositSchema = z.object({
  amount: z.string().transform((val) => parseFloat(val)),
  currency: z.string(),
  symbol: z.string(), // Crypto symbol (BTC, ETH, etc.)
  paymentMethod: z.enum(['binance', 'bybit', 'crypto_com', 'bank_transfer', 'other']),
});

const approveDepositSchema = z.object({
  approved: z.boolean(),
  adminNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
});

const balanceAdjustmentSchema = z.object({
  userId: z.string(),
  adjustmentType: z.enum(['add', 'remove', 'set']),
  amount: z.string().transform((val) => parseFloat(val)),
  currency: z.string().default('USD'),
  reason: z.string(),
});

// GET /api/deposits/wallet-addresses - Get shared wallet addresses for all cryptocurrencies
router.get('/wallet-addresses', requireAuth, async (req: Request, res: Response) => {
  try {
    const addresses = await storage.getSharedWalletAddresses();
    res.json(addresses);
  } catch (error) {
    console.error("Get wallet addresses error:", error);
    res.status(500).json({ message: "Failed to fetch wallet addresses" });
  }
});

// POST /api/deposits - Create a new deposit request
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const depositData = createDepositSchema.parse(req.body);

    const deposit = await storage.createDeposit({
      userId,
      amount: depositData.amount.toString(),
      currency: depositData.currency,
      assetType: 'crypto',
      paymentMethod: depositData.paymentMethod,
      status: 'pending',
    });

    res.json(deposit);
  } catch (error) {
    console.error("Create deposit error:", error);
    res.status(500).json({ message: "Failed to create deposit request" });
  }
});

// POST /api/deposits/:id/proof - Upload proof of payment
router.post('/:id/proof', requireAuth, upload.single('proof'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify this deposit belongs to the user
    const deposit = await storage.getDepositById(id);
    if (!deposit || deposit.userId !== userId) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Proof of payment image is required" });
    }

    // Update deposit with proof image URL
    const updatedDeposit = await storage.updateDeposit(id, {
      proofImageUrl: req.file.filename,
      status: 'pending', // Ready for admin review
    });

    res.json(updatedDeposit);
  } catch (error) {
    console.error("Upload proof error:", error);
    res.status(500).json({ message: "Failed to upload proof of payment" });
  }
});

// GET /api/deposits - Get user's deposit history
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const deposits = await storage.getUserDeposits(userId);
    res.json(deposits);
  } catch (error) {
    console.error("Get deposits error:", error);
    res.status(500).json({ message: "Failed to fetch deposits" });
  }
});

// ADMIN ROUTES
// GET /api/deposits/admin/all - Get all deposits for admin review
router.get('/admin/all', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const deposits = await storage.getAllDeposits();
    res.json(deposits);
  } catch (error) {
    console.error("Get all deposits error:", error);
    res.status(500).json({ message: "Failed to fetch deposits" });
  }
});

// POST /api/deposits/:id/approve - Admin approve/reject deposit
router.post('/:id/approve', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;
    const approvalData = approveDepositSchema.parse(req.body);

    const deposit = await storage.getDepositById(id);
    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    // Update deposit status
    const updatedDeposit = await storage.updateDeposit(id, {
      status: approvalData.approved ? 'approved' : 'rejected',
      adminNotes: approvalData.adminNotes,
      rejectionReason: approvalData.rejectionReason,
      approvedById: req.user.id,
      approvedAt: new Date(),
    });

    // If approved, update user's balance (we'll implement manual balance adjustment)
    if (approvalData.approved) {
      // Note: Admin will manually adjust balance after approval
      console.log(`Deposit ${id} approved. Admin should manually adjust user balance.`);
    }

    res.json(updatedDeposit);
  } catch (error) {
    console.error("Approve deposit error:", error);
    res.status(500).json({ message: "Failed to approve/reject deposit" });
  }
});

// POST /api/deposits/admin/adjust-balance - Admin manually adjust user balance
router.post('/admin/adjust-balance', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const adjustmentData = balanceAdjustmentSchema.parse(req.body);

    // Create balance adjustment record
    const adjustment = await storage.createBalanceAdjustment({
      adminId: req.user.id,
      targetUserId: adjustmentData.userId,
      adjustmentType: adjustmentData.adjustmentType,
      amount: adjustmentData.amount.toString(),
      currency: adjustmentData.currency,
      reason: adjustmentData.reason,
    });

    // Update user's portfolio balance
    const portfolio = await storage.getPortfolio(adjustmentData.userId);
    if (portfolio) {
      let newBalance: number;
      const currentBalance = parseFloat(portfolio.availableCash);
      
      switch (adjustmentData.adjustmentType) {
        case 'add':
          newBalance = currentBalance + adjustmentData.amount;
          break;
        case 'remove':
          newBalance = currentBalance - adjustmentData.amount;
          break;
        case 'set':
          newBalance = adjustmentData.amount;
          break;
        default:
          throw new Error('Invalid adjustment type');
      }

      await storage.updatePortfolio(portfolio.id, {
        availableCash: newBalance.toString(),
        totalValue: newBalance.toString(),
      });
    }

    res.json({
      adjustment,
      message: `Balance ${adjustmentData.adjustmentType === 'add' ? 'increased' : adjustmentData.adjustmentType === 'remove' ? 'decreased' : 'set'} successfully`,
    });
  } catch (error) {
    console.error("Balance adjustment error:", error);
    res.status(500).json({ message: "Failed to adjust balance" });
  }
});

// GET /api/deposits/admin/balance-adjustments - Get balance adjustment history
router.get('/admin/balance-adjustments', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const adjustments = await storage.getBalanceAdjustments();
    res.json(adjustments);
  } catch (error) {
    console.error("Get balance adjustments error:", error);
    res.status(500).json({ message: "Failed to fetch balance adjustments" });
  }
});

// ADMIN WALLET MANAGEMENT
// POST /api/deposits/admin/wallet-addresses - Add/update shared wallet address
router.post('/admin/wallet-addresses', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const walletData = insertSharedWalletAddressSchema.parse(req.body);
    const address = await storage.createOrUpdateSharedWalletAddress(walletData);
    
    res.json(address);
  } catch (error) {
    console.error("Create wallet address error:", error);
    res.status(500).json({ message: "Failed to create wallet address" });
  }
});

export default router;