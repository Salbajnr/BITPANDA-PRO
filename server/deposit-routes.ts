import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { insertDepositSchema, insertSharedWalletAddressSchema } from '@shared/schema';
import path from 'path';
import fs from 'fs';

// Import email service for transaction notifications
import { sendTransactionEmail } from './email-service';

type AuthenticatedRequest = Request & {
  // Relaxed typing to avoid needing global Express.User augmentation
  user: any
};

const router = Router();

// Serve proof files with authentication
router.get('/proof/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get deposit to verify ownership or admin access
    const deposit = await storage.getDepositById(id);
    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    // Check if user owns the deposit or is an admin
    if (deposit.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!deposit.proofImageUrl) {
      return res.status(404).json({ message: "No proof file found" });
    }

    // Serve the file
    const fileName = deposit.proofImageUrl.replace('/uploads/proofs/', '');
    const filePath = path.join(process.cwd(), 'uploads/proofs', fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Proof file not found on disk" });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.error("Serve proof file error:", error);
    res.status(500).json({ message: "Failed to serve proof file" });
  }
});

// Configure multer for proof of payment uploads
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/proofs/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `proof-${uniqueSuffix}${fileExtension}`);
  }
});

const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG, GIF) and PDF files are allowed'));
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

const balanceManipulationSchema = z.object({
  userId: z.string(),
  adjustmentType: z.enum(['add', 'remove', 'set']),
  amount: z.string(), // Keep as string to parse later for validation
  currency: z.string().default('USD'),
  reason: z.string().optional(),
});

// GET /api/deposits/wallet-addresses - Get shared wallet addresses for all cryptocurrencies
router.get('/wallet-addresses', requireAuth, async (req: Request, res: Response) => {
  try {
    let addresses = await storage.getSharedWalletAddresses();

    // If no addresses exist, create default shared addresses
    if (addresses.length === 0) {
      const defaultAddresses = [
        { symbol: 'BTC', name: 'Bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', network: 'mainnet' },
        { symbol: 'ETH', name: 'Ethereum', address: '0x742F96e08A82d6D91F1aE37df26B12C75a1cF86e', network: 'mainnet' },
        { symbol: 'USDT', name: 'Tether', address: '0x742F96e08A82d6D91F1aE37df26B12C75a1cF86e', network: 'ethereum' },
        { symbol: 'BNB', name: 'Binance Coin', address: 'bnb1jw7qkv5r8x3v4x8wqnrzr2t8s5k6g3h7d2f1a0', network: 'bsc' },
        { symbol: 'ADA', name: 'Cardano', address: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a6gtajun6cjskw3', network: 'cardano' },
        { symbol: 'SOL', name: 'Solana', address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', network: 'solana' },
        { symbol: 'XRP', name: 'Ripple', address: 'rDNvpSjsGdPaAHWMKhv8iPtF3mBYYR2PpK', network: 'xrpl' },
        { symbol: 'DOT', name: 'Polkadot', address: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5', network: 'polkadot' },
        { symbol: 'MATIC', name: 'Polygon', address: '0x742F96e08A82d6D91F1aE37df26B12C75a1cF86e', network: 'polygon' },
        { symbol: 'LINK', name: 'Chainlink', address: '0x742F96e08A82d6D91F1aE37df26B12C75a1cF86e', network: 'ethereum' }
      ];

      // Create shared addresses
      for (const addr of defaultAddresses) {
        await storage.createOrUpdateSharedWalletAddress(addr);
      }

      addresses = await storage.getSharedWalletAddresses();
    }

    res.json(addresses);
  } catch (error) {
    console.error("Get wallet addresses error:", error);
    res.status(500).json({ message: "Failed to fetch wallet addresses" });
  }
});

// POST /api/deposits - Create a new deposit request with proof
router.post('/', requireAuth, upload.array('proof_files', 5), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { payment_method, amount, currency, notes } = req.body;

    if (!payment_method || !amount || !currency) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Handle multiple proof files
    const proofUploads = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        proofUploads.push({
          fileName: file.originalname,
          filePath: `/uploads/proofs/${file.filename}`,
          fileSize: file.size,
          mimeType: file.mimetype
        });
      }
    }

    const deposit = await storage.createDeposit({
      userId,
      amount: parseFloat(amount).toString(),
      currency,
      assetType: 'crypto',
      paymentMethod: payment_method,
      status: 'pending',
      proofImageUrl: proofUploads.length > 0 ? proofUploads[0].filePath : null,
      adminNotes: notes || null,
    });

    // Store proof upload metadata if needed
    for (const proof of proofUploads) {
      // You could create a separate proof_uploads table to store metadata
      console.log(`Uploaded proof: ${proof.fileName} (${proof.fileSize} bytes)`);
    }

    res.json({
      success: true,
      deposit: {
        ...deposit,
        proof_uploads: proofUploads
      },
      message: "Deposit request submitted successfully. Please wait for admin approval."
    });
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

// POST /api/deposits/:id/approve - Admin approve deposit with automatic balance update
router.post('/:id/approve', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;
    const { adminNotes } = req.body;

    const deposit = await storage.getDepositById(id);
    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    if (deposit.status !== 'pending') {
      return res.status(400).json({ message: "Deposit has already been processed" });
    }

    // Update deposit status to approved
    const updatedDeposit = await storage.updateDeposit(id, {
      status: 'approved',
      adminNotes: adminNotes || null,
      approvedById: req.user.id,
      approvedAt: new Date(),
    });

    // Automatically add funds to user's balance
    const depositAmount = parseFloat(deposit.amount);

    // Create balance adjustment record
    await storage.createBalanceAdjustment({
      adminId: req.user.id,
      targetUserId: deposit.userId,
      adjustmentType: 'add',
      amount: depositAmount.toString(),
      currency: deposit.currency,
      reason: `Approved deposit #${deposit.id}`,
    });

    // Update user's portfolio balance
    let portfolio = await storage.getPortfolio(deposit.userId);
    if (!portfolio) {
      // Create portfolio if it doesn't exist
      portfolio = await storage.createPortfolio({
        userId: deposit.userId,
        totalValue: depositAmount.toString(),
        availableCash: depositAmount.toString()
      });
    } else {
      // Update existing portfolio
      const newAvailableCash = parseFloat(portfolio.availableCash) + depositAmount;
      const newTotalValue = parseFloat(portfolio.totalValue) + depositAmount;

      await storage.updatePortfolio(portfolio.id, {
        availableCash: newAvailableCash.toString(),
        totalValue: newTotalValue.toString()
      });
    }

    console.log(`✅ Deposit ${id} approved and $${depositAmount} added to user ${deposit.userId} balance`);

    // Fetch user details to send email
    const user = await storage.getUser(deposit.userId);

    // Send email notification for approved deposit
    if (user) {
      try {
        await sendTransactionEmail({
          to: user.email,
          transactionType: 'deposit',
          amount: deposit.amount,
          currency: deposit.currency,
          status: 'Approved',
          transactionId: deposit.id,
        });
        console.log(`✅ Deposit approval email sent to ${user.email}`);
      } catch (emailError) {
        console.error('Failed to send deposit approval email:', emailError);
      }
    }

    res.json({
      success: true,
      deposit: updatedDeposit,
      message: `Deposit approved and $${deposit.amount} added to user balance`
    });
  } catch (error) {
    console.error("Approve deposit error:", error);
    res.status(500).json({ message: "Failed to approve deposit" });
  }
});

// POST /api/deposits/:id/reject - Admin reject deposit
router.post('/:id/reject', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;
    const { rejectionReason, adminNotes } = req.body;

    const deposit = await storage.getDepositById(id);
    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    if (deposit.status !== 'pending') {
      return res.status(400).json({ message: "Deposit has already been processed" });
    }

    // Update deposit status to rejected
    const updatedDeposit = await storage.updateDeposit(id, {
      status: 'rejected',
      rejectionReason: rejectionReason || 'No reason provided',
      adminNotes: adminNotes || null,
      approvedById: req.user.id,
      approvedAt: new Date(),
    });

    // Fetch user details to send email
    const user = await storage.getUser(deposit.userId);

    // Send email notification for rejected deposit
    if (user) {
      try {
        await sendTransactionEmail({
          to: user.email,
          transactionType: 'deposit',
          amount: deposit.amount,
          currency: deposit.currency,
          status: 'Rejected',
          transactionId: deposit.id,
        });
        console.log(`✅ Deposit rejection email sent to ${user.email}`);
      } catch (emailError) {
        console.error('Failed to send deposit rejection email:', emailError);
      }
    }

    res.json({
      success: true,
      deposit: updatedDeposit,
      message: "Deposit rejected"
    });
  } catch (error) {
    console.error("Reject deposit error:", error);
    res.status(500).json({ message: "Failed to reject deposit" });
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

    // Fetch user details to send email
    const user = await storage.getUser(adjustmentData.userId);

    // Send email notification for balance adjustment
    if (user) {
      try {
        await sendTransactionEmail({
          to: user.email,
          transactionType: 'deposit',
          amount: adjustmentData.amount.toString(),
          currency: adjustmentData.currency,
          status: adjustmentData.adjustmentType.charAt(0).toUpperCase() + adjustmentData.adjustmentType.slice(1), // e.g., 'Add', 'Remove', 'Set'
          transactionId: adjustment.id, // Using adjustment ID as transaction ID
        });
        console.log(`✅ Balance adjustment email sent to ${user.email}`);
      } catch (emailError) {
        console.error('Failed to send balance adjustment email:', emailError);
      }
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

// ADMIN BALANCE MANIPULATION ENDPOINTS

// POST /api/deposits/admin/manipulate-balance - Manipulate user balance (admin only)
router.post('/admin/manipulate-balance', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const adjustmentData = balanceManipulationSchema.parse(req.body);
    const amount = parseFloat(adjustmentData.amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Verify target user exists
    const targetUser = await storage.getUser(adjustmentData.userId);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    // Get or create portfolio
    let portfolio = await storage.getPortfolio(adjustmentData.userId);
    if (!portfolio) {
      portfolio = await storage.createPortfolio({
        userId: adjustmentData.userId,
        totalValue: '0',
        availableCash: '0'
      });
    }

    // Calculate new balance
    let newBalance: number;
    let newTotalValue: number;
    const currentBalance = parseFloat(portfolio.availableCash);
    const currentTotal = parseFloat(portfolio.totalValue);

    switch (adjustmentData.adjustmentType) {
      case 'add':
        newBalance = currentBalance + amount;
        newTotalValue = currentTotal + amount;
        break;
      case 'remove':
        newBalance = Math.max(0, currentBalance - amount);
        newTotalValue = Math.max(0, currentTotal - amount);
        break;
      case 'set':
        newBalance = amount;
        newTotalValue = amount;
        break;
      default:
        return res.status(400).json({ message: "Invalid adjustment type" });
    }

    // Update portfolio
    await storage.updatePortfolio(portfolio.id, {
      availableCash: newBalance.toString(),
      totalValue: newTotalValue.toString(),
    });

    // Create balance adjustment record
    const adjustment = await storage.createBalanceAdjustment({
      adminId: req.user.id,
      targetUserId: adjustmentData.userId,
      adjustmentType: adjustmentData.adjustmentType,
      amount: amount.toString(),
      currency: adjustmentData.currency,
      reason: adjustmentData.reason || `Admin ${adjustmentData.adjustmentType} balance adjustment`,
    });

    console.log(`✅ Admin ${req.user.username} ${adjustmentData.adjustmentType}ed ${adjustmentData.currency} ${amount} to user ${targetUser.username}`);

    // Send email notification for balance manipulation
    if (targetUser) {
      try {
        await sendTransactionEmail({
          to: targetUser.email,
          transactionType: 'deposit',
          amount: amount.toString(),
          currency: adjustmentData.currency,
          status: adjustmentData.adjustmentType.charAt(0).toUpperCase() + adjustmentData.adjustmentType.slice(1), // e.g., 'Add', 'Remove', 'Set'
          transactionId: adjustment.id, // Using adjustment ID as transaction ID
        });
        console.log(`✅ Balance manipulation email sent to ${targetUser.email}`);
      } catch (emailError) {
        console.error('Failed to send balance manipulation email:', emailError);
      }
    }

    res.json({
      success: true,
      adjustment,
      newBalance: newBalance.toString(),
      message: `Balance ${adjustmentData.adjustmentType === 'add' ? 'increased' : adjustmentData.adjustmentType === 'remove' ? 'decreased' : 'set'} successfully`,
    });
  } catch (error) {
    console.error('Balance manipulation error:', error);
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Failed to manipulate balance'
    });
  }
});

// GET /api/deposits/admin/user-balance/:userId - Get user's current balance
router.get('/admin/user-balance/:userId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { userId } = req.params;

    // Try to find user by ID or email
    let user = await storage.getUser(userId);
    if (!user) {
      // Try to find by email
      const users = await storage.getAllUsers();
      user = users.find(u => u.email.toLowerCase() === userId.toLowerCase());
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const portfolio = await storage.getPortfolio(user.id);

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      balance: {
        availableCash: parseFloat(portfolio?.availableCash || '0'),
        totalValue: parseFloat(portfolio?.totalValue || '0'),
      }
    });
  } catch (error) {
    console.error('Get user balance error:', error);
    res.status(500).json({ message: 'Failed to fetch user balance' });
  }
});

export default router;