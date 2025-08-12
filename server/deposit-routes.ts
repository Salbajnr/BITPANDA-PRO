
import { eq, desc } from 'drizzle-orm';
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from './db.js';
import { deposits, users, notifications } from '../shared/schema.js';
import { requireAuth, requireAdmin } from './auth.js';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/deposits';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'proof-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Payment method configurations
const paymentMethods = {
  bybit: {
    name: 'Bybit',
    logo: 'https://img.bybit.com/web/logo/logo.png',
    url: 'https://www.bybit.com',
    currencies: ['BTC', 'ETH', 'USDT', 'USDC', 'BNB'],
  },
  binance: {
    name: 'Binance',
    logo: 'https://bin.bnbstatic.com/static/images/common/logo.png',
    url: 'https://www.binance.com',
    currencies: ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'ADA', 'SOL'],
  },
  'crypto.com': {
    name: 'Crypto.com',
    logo: 'https://crypto.com/favicon.ico',
    url: 'https://crypto.com',
    currencies: ['BTC', 'ETH', 'USDT', 'USDC', 'CRO'],
  },
  okx: {
    name: 'OKX',
    logo: 'https://www.okx.com/favicon.ico',
    url: 'https://www.okx.com',
    currencies: ['BTC', 'ETH', 'USDT', 'USDC', 'OKB'],
  },
  kucoin: {
    name: 'KuCoin',
    logo: 'https://www.kucoin.com/favicon.ico',
    url: 'https://www.kucoin.com',
    currencies: ['BTC', 'ETH', 'USDT', 'USDC', 'KCS'],
  },
};

// Generate mock deposit addresses (in production, these would come from the actual exchanges)
const generateDepositAddress = (method: string, currency: string): string => {
  const prefixes = {
    BTC: ['1', '3', 'bc1'],
    ETH: ['0x'],
    USDT: ['0x'],
    USDC: ['0x'],
    BNB: ['bnb'],
    ADA: ['addr1'],
    SOL: [''],
    CRO: ['0x'],
    OKB: ['0x'],
    KCS: ['0x'],
  };

  const prefix = prefixes[currency as keyof typeof prefixes]?.[0] || '0x';
  const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  if (currency === 'BTC' && prefix === 'bc1') {
    return `bc1q${randomString.substring(0, 39)}`;
  }
  if (currency === 'ADA') {
    return `addr1${randomString.substring(0, 60)}`;
  }
  if (prefix === '0x') {
    return `0x${randomString.substring(0, 40)}`;
  }
  if (currency === 'BNB') {
    return `bnb${randomString.substring(0, 39)}`;
  }
  
  return `${prefix}${randomString.substring(0, 34)}`;
};

// Get available payment methods
router.get('/payment-methods', requireAuth, (req, res) => {
  res.json(paymentMethods);
});

// Generate deposit address
router.post('/generate-address', requireAuth, async (req, res) => {
  try {
    const { paymentMethod, cryptocurrency } = req.body;

    if (!paymentMethods[paymentMethod as keyof typeof paymentMethods]) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    const method = paymentMethods[paymentMethod as keyof typeof paymentMethods];
    if (!method.currencies.includes(cryptocurrency)) {
      return res.status(400).json({ error: 'Cryptocurrency not supported by this payment method' });
    }

    const depositAddress = generateDepositAddress(paymentMethod, cryptocurrency);

    res.json({
      address: depositAddress,
      method: method,
      cryptocurrency,
      externalUrl: method.url,
    });
  } catch (error) {
    console.error('Generate address error:', error);
    res.status(500).json({ error: 'Failed to generate deposit address' });
  }
});

// Create deposit request
router.post('/create', requireAuth, upload.single('proofFile'), async (req, res) => {
  try {
    const { paymentMethod, cryptocurrency, depositAmount, depositAddress, transactionHash } = req.body;
    const userId = req.user.id;

    let proofOfPayment = '';
    let proofType = '';

    if (req.file) {
      proofOfPayment = req.file.path;
      proofType = 'file';
    } else if (transactionHash) {
      proofOfPayment = transactionHash;
      proofType = 'hash';
    } else {
      return res.status(400).json({ error: 'Either proof file or transaction hash is required' });
    }

    const [deposit] = await db.insert(deposits).values({
      userId,
      paymentMethod,
      cryptocurrency,
      depositAmount,
      depositAddress,
      proofOfPayment,
      proofType,
      status: 'pending',
    }).returning();

    // Create notification for user
    await db.insert(notifications).values({
      userId,
      title: 'Deposit Submitted',
      message: `Your deposit request for ${depositAmount} ${cryptocurrency} has been submitted and is pending review.`,
      type: 'deposit',
      relatedId: deposit.id,
    });

    res.json({
      success: true,
      depositId: deposit.id,
      message: 'Deposit request submitted successfully',
    });
  } catch (error) {
    console.error('Create deposit error:', error);
    res.status(500).json({ error: 'Failed to create deposit request' });
  }
});

// Get user's deposits
router.get('/my-deposits', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userDeposits = await db.select().from(deposits).where(eq(deposits.userId, userId)).orderBy(desc(deposits.createdAt));
    res.json(userDeposits);
  } catch (error) {
    console.error('Get deposits error:', error);
    res.status(500).json({ error: 'Failed to fetch deposits' });
  }
});

// Admin routes
router.get('/admin/all', requireAdmin, async (req, res) => {
  try {
    const allDeposits = await db.select({
      deposit: deposits,
      user: {
        id: users.id,
        email: users.email,
        name: users.name,
      }
    }).from(deposits)
      .leftJoin(users, eq(deposits.userId, users.id))
      .orderBy(desc(deposits.createdAt));

    res.json(allDeposits);
  } catch (error) {
    console.error('Get all deposits error:', error);
    res.status(500).json({ error: 'Failed to fetch all deposits' });
  }
});

// Admin approve/reject deposit
router.post('/admin/:depositId/review', requireAdmin, async (req, res) => {
  try {
    const { depositId } = req.params;
    const { action, rejectionReason } = req.body; // action: 'approve' | 'reject'
    const adminId = req.user.id;

    const [deposit] = await db.select().from(deposits).where(eq(deposits.id, depositId));
    
    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found' });
    }

    if (deposit.status !== 'pending') {
      return res.status(400).json({ error: 'Deposit has already been reviewed' });
    }

    if (action === 'approve') {
      // Update deposit status
      await db.update(deposits)
        .set({
          status: 'approved',
          approvedBy: adminId,
          approvedAt: new Date(),
        })
        .where(eq(deposits.id, depositId));

      // Update user wallet balance
      await db.update(users)
        .set({
          walletBalance: sql`${users.walletBalance} + ${deposit.depositAmount}`,
        })
        .where(eq(users.id, deposit.userId));

      // Create approval notification
      await db.insert(notifications).values({
        userId: deposit.userId,
        title: 'Deposit Approved',
        message: `Your deposit of ${deposit.depositAmount} ${deposit.cryptocurrency} has been approved and added to your wallet.`,
        type: 'deposit',
        relatedId: depositId,
      });

    } else if (action === 'reject') {
      await db.update(deposits)
        .set({
          status: 'rejected',
          rejectionReason: rejectionReason || 'Deposit verification failed',
          approvedBy: adminId,
          approvedAt: new Date(),
        })
        .where(eq(deposits.id, depositId));

      // Create rejection notification
      await db.insert(notifications).values({
        userId: deposit.userId,
        title: 'Deposit Rejected',
        message: `Your deposit has been rejected. Reason: ${rejectionReason || 'Deposit verification failed'}`,
        type: 'deposit',
        relatedId: depositId,
      });
    }

    res.json({ success: true, message: `Deposit ${action}d successfully` });
  } catch (error) {
    console.error('Review deposit error:', error);
    res.status(500).json({ error: 'Failed to review deposit' });
  }
});

// Get user notifications
router.get('/notifications', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userNotifications = await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
    
    res.json(userNotifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.post('/notifications/:notificationId/read', requireAuth, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId) && eq(notifications.userId, userId));

    res.json({ success: true });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

export default router;
