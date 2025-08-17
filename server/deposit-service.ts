import { db } from './db';
import { deposits, users, portfolios } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';
import multer from 'multer';
import path from 'path';

export interface DepositRequest {
  userId: string;
  amount: number;
  currency: string;
  assetType: 'crypto' | 'metal';
  paymentMethod: 'binance' | 'bybit' | 'crypto_com' | 'bank_transfer' | 'other';
  proofImageUrl?: string;
}

export interface DepositApproval {
  depositId: string;
  adminId: string;
  approved: boolean;
  adminNotes?: string;
  rejectionReason?: string;
}

// Configure multer for proof of payment uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/proofs');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `proof-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

export const uploadProof = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  }
});

class DepositService {
  async createDeposit(depositData: DepositRequest) {
    try {
      console.log('Creating deposit:', depositData);
      
      const [newDeposit] = await db
        .insert(deposits)
        .values({
          userId: depositData.userId,
          amount: depositData.amount.toString(),
          currency: depositData.currency,
          assetType: depositData.assetType,
          paymentMethod: depositData.paymentMethod,
          proofImageUrl: depositData.proofImageUrl,
          status: 'pending'
        })
        .returning();

      console.log('Deposit created:', newDeposit);
      return newDeposit;
    } catch (error) {
      console.error('Error creating deposit:', error);
      throw new Error('Failed to create deposit request');
    }
  }

  async getUserDeposits(userId: string) {
    try {
      return await db
        .select()
        .from(deposits)
        .where(eq(deposits.userId, userId))
        .orderBy(desc(deposits.createdAt));
    } catch (error) {
      console.error('Error fetching user deposits:', error);
      throw new Error('Failed to fetch deposits');
    }
  }

  async getPendingDeposits() {
    try {
      return await db
        .select({
          id: deposits.id,
          userId: deposits.userId,
          amount: deposits.amount,
          currency: deposits.currency,
          assetType: deposits.assetType,
          paymentMethod: deposits.paymentMethod,
          proofImageUrl: deposits.proofImageUrl,
          status: deposits.status,
          createdAt: deposits.createdAt,
          username: users.username,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName
        })
        .from(deposits)
        .leftJoin(users, eq(deposits.userId, users.id))
        .where(eq(deposits.status, 'pending'))
        .orderBy(desc(deposits.createdAt));
    } catch (error) {
      console.error('Error fetching pending deposits:', error);
      throw new Error('Failed to fetch pending deposits');
    }
  }

  async approveDeposit(approval: DepositApproval) {
    try {
      console.log('Processing deposit approval:', approval);

      const [deposit] = await db
        .select()
        .from(deposits)
        .where(eq(deposits.id, approval.depositId));

      if (!deposit) {
        throw new Error('Deposit not found');
      }

      if (deposit.status !== 'pending') {
        throw new Error('Deposit is not in pending status');
      }

      // Update deposit status
      const [updatedDeposit] = await db
        .update(deposits)
        .set({
          status: approval.approved ? 'approved' : 'rejected',
          approvedById: approval.adminId,
          approvedAt: new Date(),
          adminNotes: approval.adminNotes,
          rejectionReason: approval.rejectionReason
        })
        .where(eq(deposits.id, approval.depositId))
        .returning();

      // If approved, add funds to user's portfolio
      if (approval.approved) {
        await this.addFundsToPortfolio(deposit.userId, parseFloat(deposit.amount));
      }

      console.log('Deposit updated:', updatedDeposit);
      return updatedDeposit;
    } catch (error) {
      console.error('Error approving deposit:', error);
      throw error;
    }
  }

  private async addFundsToPortfolio(userId: string, amount: number) {
    try {
      // Find user's portfolio
      const [portfolio] = await db
        .select()
        .from(portfolios)
        .where(eq(portfolios.userId, userId));

      if (!portfolio) {
        // Create portfolio if it doesn't exist
        await db
          .insert(portfolios)
          .values({
            userId,
            totalValue: amount.toString(),
            availableCash: amount.toString()
          });
      } else {
        // Update existing portfolio
        const newAvailableCash = parseFloat(portfolio.availableCash) + amount;
        const newTotalValue = parseFloat(portfolio.totalValue) + amount;

        await db
          .update(portfolios)
          .set({
            availableCash: newAvailableCash.toString(),
            totalValue: newTotalValue.toString(),
            updatedAt: new Date()
          })
          .where(eq(portfolios.id, portfolio.id));
      }

      console.log(`Added $${amount} to user ${userId} portfolio`);
    } catch (error) {
      console.error('Error adding funds to portfolio:', error);
      throw new Error('Failed to add funds to portfolio');
    }
  }

  async getDepositById(id: string) {
    try {
      const [deposit] = await db
        .select({
          id: deposits.id,
          userId: deposits.userId,
          amount: deposits.amount,
          currency: deposits.currency,
          assetType: deposits.assetType,
          paymentMethod: deposits.paymentMethod,
          proofImageUrl: deposits.proofImageUrl,
          status: deposits.status,
          rejectionReason: deposits.rejectionReason,
          adminNotes: deposits.adminNotes,
          approvedAt: deposits.approvedAt,
          createdAt: deposits.createdAt,
          username: users.username,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          approvedByUser: users.username // This will be the admin who approved
        })
        .from(deposits)
        .leftJoin(users, eq(deposits.userId, users.id))
        .where(eq(deposits.id, id));

      return deposit;
    } catch (error) {
      console.error('Error fetching deposit by ID:', error);
      throw new Error('Failed to fetch deposit');
    }
  }

  async getAllDeposits(limit: number = 50, offset: number = 0) {
    try {
      return await db
        .select({
          id: deposits.id,
          userId: deposits.userId,
          amount: deposits.amount,
          currency: deposits.currency,
          assetType: deposits.assetType,
          paymentMethod: deposits.paymentMethod,
          status: deposits.status,
          createdAt: deposits.createdAt,
          approvedAt: deposits.approvedAt,
          username: users.username,
          email: users.email
        })
        .from(deposits)
        .leftJoin(users, eq(deposits.userId, users.id))
        .orderBy(desc(deposits.createdAt))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error('Error fetching all deposits:', error);
      throw new Error('Failed to fetch deposits');
    }
  }

  async getDepositStats() {
    try {
      // This is a simplified version - in production you'd use proper aggregation queries
      const allDeposits = await db.select().from(deposits);
      
      const totalDeposits = allDeposits.length;
      const pendingDeposits = allDeposits.filter(d => d.status === 'pending').length;
      const approvedDeposits = allDeposits.filter(d => d.status === 'approved').length;
      const rejectedDeposits = allDeposits.filter(d => d.status === 'rejected').length;
      
      const totalAmount = allDeposits
        .filter(d => d.status === 'approved')
        .reduce((sum, d) => sum + parseFloat(d.amount), 0);

      return {
        totalDeposits,
        pendingDeposits,
        approvedDeposits,
        rejectedDeposits,
        totalAmount
      };
    } catch (error) {
      console.error('Error fetching deposit stats:', error);
      throw new Error('Failed to fetch deposit statistics');
    }
  }
}

export const depositService = new DepositService();