import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';

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
import { storage } from './storage';
import multer from 'multer';
import { nanoid } from 'nanoid';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const createDepositSchema = z.object({
  amount: z.string(),
  currency: z.string(),
  paymentMethod: z.string(),
  network: z.string().optional(),
});

// Create deposit request
router.post('/', requireAuth, upload.single('screenshot'), async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const depositData = createDepositSchema.parse(req.body);

    const deposit = await storage.createDeposit({
      userId,
      amount: depositData.amount,
      currency: depositData.currency,
      paymentMethod: depositData.paymentMethod,
      network: depositData.network || null,
      screenshot: req.file?.filename || null,
      status: 'pending',
      transactionId: nanoid(16),
    });

    res.json(deposit);
  } catch (error) {
    console.error("Create deposit error:", error);
    res.status(500).json({ message: "Failed to create deposit" });
  }
});

// Get user deposits
router.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const deposits = await storage.getUserDeposits(userId);
    res.json(deposits);
  } catch (error) {
    console.error("Get deposits error:", error);
    res.status(500).json({ message: "Failed to fetch deposits" });
  }
});

// Get all deposits (admin only)
router.get('/all', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await storage.getUser(req.user!.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const deposits = await storage.getAllDeposits();
    res.json(deposits);
  } catch (error) {
    console.error("Get all deposits error:", error);
    res.status(500).json({ message: "Failed to fetch deposits" });
  }
});

// Update deposit status (admin only)
router.patch('/:id/status', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await storage.getUser(req.user!.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const deposit = await storage.updateDepositStatus(id, status, rejectionReason);

    if (status === 'completed') {
      // Update user portfolio
      const portfolio = await storage.getPortfolio(deposit.userId);
      if (portfolio) {
        const newBalance = parseFloat(portfolio.availableCash) + parseFloat(deposit.amount);
        await storage.updatePortfolio(portfolio.id, { 
          availableCash: newBalance.toString(),
          totalValue: newBalance.toString()
        });
      }
    }

    res.json(deposit);
  } catch (error) {
    console.error("Update deposit status error:", error);
    res.status(500).json({ message: "Failed to update deposit status" });
  }
});

export default router;