import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // ✅ Avoid IPv6 ENETUNREACH on Render

// Load environment variables
import dotenv from "dotenv";
import { z } from "zod";

// Load .env file if not in production
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Validate environment variables - make most fields optional for demo mode
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters").optional(),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters").optional(),
  SESSION_SECRET_REFRESH: z.string().min(32, "SESSION_SECRET_REFRESH must be at least 32 characters").optional(),
  COINGECKO_API_KEY: z.string().optional(),
  SENDERGRID_API_KEY: z.string().optional(),
  METALS_API_KEY: z.string().optional()
});

// Validate environment variables
const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.warn("⚠️ Environment validation warnings:", JSON.stringify(env.error.format(), null, 2));
  console.log("🎭 Some features may be limited in demo mode");
}

// Now TypeScript knows the shape of process.env
const DATABASE_URL = env.success ? env.data.DATABASE_URL : process.env.DATABASE_URL;
const NODE_ENV = (env.success ? env.data.NODE_ENV : process.env.NODE_ENV) || "development";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, and, sql, gte, lte, inArray, or, like, isNull, isNotNull, desc } from 'drizzle-orm';
import * as schema from "../shared/schema";
import { db, pool } from "./db"; // Use the shared database connection

// Re-export db for convenience
export { db };

// Type for the database
type DatabaseType = typeof db;

// Database storage implementation with proper error handling
class DatabaseStorage {
  private async withConnection<T>(fn: (db: DatabaseType) => Promise<T>): Promise<T> {
    try {
      return await fn(db);
    } catch (error: any) {
      console.error('Database operation failed:', error);
      throw error;
    }
  }

  // --- Investment Plan Methods ---
  async getInvestmentById(id: string) {
    return this.withConnection(async (db) => {
      const [investment] = await db
        .select()
        .from(schema.savingsPlans) // Using savingsPlans instead of investments
        .where(eq(schema.savingsPlans.id, id))
        .limit(1);

      if (!investment) {
        throw new Error('Investment not found');
      }
      return investment;
    });
  }

  async updateInvestment(id: string, updateData: any) {
    return this.withConnection(async (db) => {
      const [updated] = await db
        .update(schema.savingsPlans) // Using savingsPlans instead of investments
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(schema.savingsPlans.id, id))
        .returning();

      if (!updated) {
        throw new Error('Failed to update investment');
      }
      return updated;
    });
  }

  async deleteInvestment(id: string) {
    return this.withConnection(async (db) => {
      const [deleted] = await db
        .delete(schema.savingsPlans) // Using savingsPlans instead of investments
        .where(eq(schema.savingsPlans.id, id))
        .returning({ id: schema.savingsPlans.id });

      return !!deleted;
    });
  }

  // Plan template management methods
  async getInvestmentPlanTemplates() {
    // Return mock templates since we don't have a dedicated templates table
    return [
      {
        id: 'conservative-growth',
        name: 'Conservative Growth',
        description: 'Low-risk investment plan with steady returns',
        minInvestment: 100,
        expectedReturn: 7.5,
        duration: 12,
        riskLevel: 'low',
        category: 'Bonds & Fixed Income',
        features: ['Government bonds', 'Capital preservation', 'Quarterly dividends', 'Low volatility'],
        isActive: true,
        totalInvested: 2500000,
        totalInvestors: 1250
      },
      {
        id: 'balanced-portfolio',
        name: 'Balanced Portfolio',
        description: 'Diversified mix of stocks and bonds',
        minInvestment: 500,
        expectedReturn: 12.0,
        duration: 18,
        riskLevel: 'medium',
        category: 'Mixed Assets',
        features: ['60/40 allocation', 'Professional management', 'Monthly rebalancing', 'Global diversification'],
        isActive: true,
        totalInvested: 5750000,
        totalInvestors: 2100
      }
    ];
  }

  async createInvestmentPlanTemplate(data: any) {
    // In production, this would create a record in a templates table
    return { id: `plan-${Date.now()}`, ...data };
  }

  async updateInvestmentPlanTemplate(id: string, data: any) {
    // In production, this would update the templates table
    return { id, ...data };
  }

  async deleteInvestmentPlanTemplate(id: string) {
    // In production, this would delete from templates table
    return true;
  }

  async getSavingsPlanTemplates() {
    return [
      {
        id: 'basic-saver',
        name: 'Basic Saver',
        description: 'Start your savings journey',
        minAmount: 10,
        maxAmount: 500,
        frequency: 'monthly',
        interestRate: 3.5,
        compounding: 'monthly',
        minDuration: 6,
        maxDuration: 60,
        category: 'Beginner',
        features: ['No minimum balance fees', 'Easy access', 'Mobile integration', 'Educational resources'],
        isActive: true
      }
    ];
  }

  async createSavingsPlanTemplate(data: any) {
    return { id: `savings-${Date.now()}`, ...data };
  }

  async updateSavingsPlanTemplate(id: string, data: any) {
    return { id, ...data };
  }

  async deleteSavingsPlanTemplate(id: string) {
    return true;
  }

  async getAllUserInvestmentPlans() {
    return this.withConnection(async (db) => {
      const plans = await db
        .select()
        .from(schema.investmentPlans)
        .orderBy(desc(schema.investmentPlans.createdAt));

      return plans;
    });
  }

  async getAllUserSavingsPlans() {
    return this.withConnection(async (db) => {
      const plans = await db
        .select()
        .from(schema.savingsPlans)
        .orderBy(desc(schema.savingsPlans.createdAt));

      return plans;
    });
  }

  async updateInvestmentPlanReturns(planId: string, data: { actualReturn: string; currentValue: string }) {
    return this.withConnection(async (db) => {
      const [updated] = await db
        .update(schema.investmentPlans)
        .set(data)
        .where(eq(schema.investmentPlans.id, planId))
        .returning();

      return updated;
    });
  }

  async updateSavingsPlanInterest(planId: string, data: { interestEarned: string; totalSaved: string }) {
    return this.withConnection(async (db) => {
      const [updated] = await db
        .update(schema.savingsPlans)
        .set(data)
        .where(eq(schema.savingsPlans.id, planId))
        .returning();

      return updated;
    });
  }

  async createInvestment(data: any) {
    return this.withConnection(async (db) => {
      const [newInvestment] = await db
        .insert(schema.savingsPlans) // Using savingsPlans instead of investments
        .values({
          ...data,
          status: data.status || 'active',
          totalSaved: '0',
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      if (!newInvestment) {
        throw new Error('Failed to create investment');
      }
      return newInvestment;
    });
  }

  async getUserInvestments(userId: string) {
    return this.withConnection(async (db) => {
      return await db
        .select()
        .from(schema.savingsPlans) // Using savingsPlans instead of investments
        .where(eq(schema.savingsPlans.userId, userId));
    });
  }

  // --- KYC Methods ---
  async getKycVerification(userId: string) {
    return this.withConnection(async (db) => {
      const [kyc] = await db
        .select()
        .from(schema.kycVerifications)
        .where(eq(schema.kycVerifications.userId, userId))
        .limit(1);

      if (!kyc) {
        throw new Error('KYC verification not found');
      }
      return kyc;
    });
  }

  async updateKycVerification(id: string, data: any) {
    return this.withConnection(async (db) => {
      const [updated] = await db
        .update(schema.kycVerifications)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.kycVerifications.id, id))
        .returning();

      if (!updated) {
        throw new Error('Failed to update KYC verification');
      }
      return updated;
    });
  }

  async createKycVerification(data: any) {
    return this.withConnection(async (db) => {
      const [newKyc] = await db
        .insert(schema.kycVerifications)
        .values({
          ...data,
          status: 'pending',
          reviewedAt: null,
          reviewedBy: null,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      if (!newKyc) {
        throw new Error('Failed to create KYC verification');
      }
      return newKyc;
    });
  }

  async getAllKycVerifications(filter: any) { return []; }
  async getKycVerificationById(id: string) { return { id, userId: '', status: 'pending' }; }
  async getKycStatistics() { return {}; }

  // --- Lending/Loan Methods ---
  async getUserLendingPositions(userId: string) { return []; }
  async createLendingPosition(data: any) { return { id: 'lendId', ...data }; }
  async createLoan(data: any) { return { id: 'loanId', ...data }; }
  async getUserLoans(userId: string) { return []; }
  async getLoan(loanId: string, userId: string) { return { id: loanId, userId }; }
  async updateLoan(loanId: string, data: any) { return { id: loanId, ...data }; }
  async getLendingPosition(positionId: string, userId: string) { return { id: positionId, userId }; }
  async updateLendingPosition(positionId: string, data: any) { return { id: positionId, ...data }; }
  async createAuditLog(data: any) { return { id: 'auditId', ...data }; }
  async getNewsArticleById(id: string) { return { id, title: '', description: '', category: '', coins: [], content: '', createdAt: new Date() }; }
  async updateNewsArticle(id: string, data: any) { return { id, ...data }; }
  async getNewsAnalytics() { return { total: 0, views: 0, shares: 0 }; }
  async getHoldings(portfolioId: string) { return [{ id: 'holdingId', portfolioId, symbol: '', amount: '0', name: '', averagePurchasePrice: '0' }]; }
  async getActivePriceAlerts() {
    return await this.withConnection(async (db) => {
      const result = await db
        .select()
        .from(schema.priceAlerts)
        .where(eq(schema.priceAlerts.isActive, true));

      return Array.isArray(result) ? result : [];
    });
  }
  async updatePriceAlert(id: string, data: any) {
    return this.withConnection(async (db) => {
      const [updatedAlert] = await db
        .update(schema.priceAlerts)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(schema.priceAlerts.id, id))
        .returning();

      if (!updatedAlert) {
        throw new Error('Price alert not found');
      }
      return updatedAlert;
    });
  }
  async createNotification(data: any) { return { id: 'notificationId', ...data }; }
  async getUserAlerts(userId: string) { return []; }
  async createAlert(data: any) { return { id: 'alertId', ...data }; }
  async getTransactions(userId: string) { return []; }
  async getAllTransactions(opts?: { page?: number; limit?: number; type?: string }) { return { transactions: [], total: 0 }; }
  isDbConnected() { return true; }
  // Portfolio Methods
  async createPortfolio(data: any) {
    return this.withConnection(async (db) => {
      const [portfolio] = await db
        .insert(schema.portfolios)
        .values({
          ...data,
          availableCash: '0',
          totalValue: '0',
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      if (!portfolio) {
        throw new Error('Failed to create portfolio');
      }
      return portfolio;
    });
  }
  async getUserByEmail(email: string) {
    return this.withConnection(async (db) => {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1);
      return user || null;
    });
  }

  async getUserByUsername(username: string) {
    return this.withConnection(async (db) => {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.username, username))
        .limit(1);
      return user || null;
    });
  }

  // OAuth Provider Lookup Methods
  async getUserByGoogleId(googleId: string) {
    return this.withConnection(async (db) => {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.googleId, googleId))
        .limit(1);
      return user || null;
    });
  }

  async getUserByFacebookId(facebookId: string) {
    return this.withConnection(async (db) => {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.facebookId, facebookId))
        .limit(1);
      return user || null;
    });
  }

  async getUserByAppleId(appleId: string) {
    return this.withConnection(async (db) => {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.appleId, appleId))
        .limit(1);
      return user || null;
    });
  }
  async createUser(data: any) {
    return this.withConnection(async (db) => {
      // Only hash password if provided (OAuth users don't have passwords)
      const hashedPassword = data.password ? await this.hashPassword(data.password) : null;
      const [newUser] = await db
        .insert(schema.users)
        .values({
          ...data,
          password: hashedPassword,
          role: data.role || 'user',
          isActive: data.isActive !== undefined ? data.isActive : true,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      if (!newUser) {
        throw new Error('Failed to create user');
      }
      return newUser;
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const bcrypt = await import('bcrypt');
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
  async getAllUsers() { return [{ id: 'userId', email: '', username: '', password: '', role: 'user', isActive: true, firstName: '', lastName: '', createdAt: new Date(), lastLogin: new Date() }]; }
  async createBalanceAdjustment(data: any) { return { id: 'adjustmentId', ...data }; }
  async logAdminAction(data: any) { return { id: 'logId', ...data }; }
  async createNewsArticle(data: any) { return { id: 'newsId', ...data }; }
  async deleteNewsArticle(id: string) { return { id }; }
  async getNewsArticles(limit?: number) { return []; }
  async createSavingsPlan(data: any) {
    return this.withConnection(async (db) => {
      const [savingsPlan] = await db
        .insert(schema.savingsPlans)
        .values({
          ...data,
          status: 'active',
          totalSaved: '0',
          currentAmount: '0',
          targetAmount: data.targetAmount || '0',
          startDate: data.startDate || new Date(),
          endDate: data.endDate || null,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      if (!savingsPlan) {
        throw new Error('Failed to create savings plan');
      }
      return savingsPlan;
    });
  }
  async getUserSavingsPlans(userId: string) {
    return this.withConnection(async (db) => {
      return await db
        .select()
        .from(schema.savingsPlans)
        .where(eq(schema.savingsPlans.userId, userId))
        .orderBy(schema.savingsPlans.createdAt);
    });
  }
  async deleteSavingsPlan(planId: string) {
    return this.withConnection(async (db) => {
      const [deletedPlan] = await db
        .delete(schema.savingsPlans)
        .where(eq(schema.savingsPlans.id, planId))
        .returning({ id: schema.savingsPlans.id });

      if (!deletedPlan) {
        throw new Error('Savings plan not found or already deleted');
      }
      return deletedPlan;
    });
  }
  // --- User Management Methods ---
  async getUser(userId: string) {
    return this.withConnection(async (db) => {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, userId))
        .limit(1);

      if (!user) {
        throw new Error('User not found');
      }
      return user;
    });
  }
  async getUserByEmailOrUsername(emailOrUsername: string) {
    return this.withConnection(async (db) => {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(
          emailOrUsername.includes('@')
            ? eq(schema.users.email, emailOrUsername)
            : eq(schema.users.username, emailOrUsername)
        )
        .limit(1);

      return user || null;
    });
  }
  async verifyPassword(userId: string, password: string) {
    return this.withConnection(async (db) => {
      const user = await this.getUser(userId);
      if (!user) return false;

      // In production, use bcrypt.compare
      const bcrypt = await import('bcrypt');
      return bcrypt.compare(password, user.password);
    });
  }
  async getSavingsPlanById(planId: string) { return { id: planId, status: 'active' }; }
  async updateSavingsPlan(planId: string, data: any) { return { id: planId, ...data }; }
  async updateUser(userId: string, data: any) {
    return this.withConnection(async (db) => {
      const [updatedUser] = await db
        .update(schema.users)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.users.id, userId))
        .returning();

      if (!updatedUser) {
        throw new Error('User not found');
      }
      return updatedUser;
    });
  }
  async getUserSettings(userId: string) {
    return this.withConnection(async (db) => {
      const [settings] = await db
        .select()
        .from(schema.userSettings)
        .where(eq(schema.userSettings.userId, userId))
        .limit(1);

      return settings;
    });
  }

  async createUserSettings(data: any) {
    return this.withConnection(async (db) => {
      const [settings] = await db
        .insert(schema.userSettings)
        .values({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      return settings;
    });
  }

  async updateUserSettings(userId: string, data: any) {
    return this.withConnection(async (db) => {
      // Try to update first
      const [updated] = await db
        .update(schema.userSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.userSettings.userId, userId))
        .returning();

      // If no row was updated, create new settings
      if (!updated) {
        return this.createUserSettings({ userId, ...data });
      }

      return updated;
    });
  }
  async getUserNotifications(userId: string) { return []; }
  async markNotificationAsRead(id: string) { return { id, read: true }; }
  async deleteUser(userId: string) { return { id: userId }; }
  async getUserWatchlist(userId: string) { return { userId, symbols: [] }; }
  async addToWatchlist(userId: string, symbol: string, name: string) { return { userId, symbol, name }; }
  async removeFromWatchlist(userId: string, symbol: string) { return { userId, symbol }; }
  async getUserStakingPositions(userId: string) { return []; }
  async getHolding(portfolioId: string, symbol: string) { return { id: 'holdingId', portfolioId, symbol, amount: '0', name: '', averagePurchasePrice: '0' }; }
  async createStakingPosition(data: any) { return { id: 'stakeId', ...data }; }
  async updateHolding(holdingId: string, data: any) { return { id: holdingId, ...data }; }
  async getStakingRewards(userId: string) { return []; }
  async getStakingAnalytics(userId: string) { return {}; }
  async getStakingPosition(positionId: string, userId: string) { return { id: positionId, userId, amount: '0', status: 'active', assetSymbol: '', rewards: 0 }; }
  async updateStakingPosition(positionId: string, data: any) { return { id: positionId, ...data }; }
  async createTransaction(data: any) { return { id: 'txId', ...data }; }
  async upsertHolding(data: any) { return { id: 'holdingId', ...data }; }
  // Accept either (portfolioId, symbol) OR a single holdingId string
  async deleteHolding(arg1: string, arg2?: string) {
    if (arg2) {
      // portfolioId, symbol
      return { portfolioId: arg1, symbol: arg2 };
    }
    // holdingId
    return { id: arg1 };
  }
  async getUserTransactions(userId: string, limit?: number) { return []; }
  async getUserTransactionCount(userId: string) { return 0; }
  async getUserDeposits(userId: string, limit?: number) { return []; }
  async getAllDeposits() { return []; }
  async reverseTransaction(transactionId: string, adminId: string, reason?: string) {
    return { id: transactionId, reversed: true, reason };
  }
  async getBalanceAdjustments(userId?: string, page?: number, limit?: number) {
    if (userId) return [];
    return [];
  }
  // Missing methods needed by other modules
  async getActiveUsers() { return []; }
  async createSecurityLog(data: any) { return { id: 'securityLogId', ...data }; }
  async getTransactionCount() { return 0; }
  async getActiveSessions() { return []; }
  async invalidateUserSessions(userId: string) { return true; }
  async invalidateAllSessions() { return true; }
  async getSystemConfig() { return {}; }
  async updateSystemConfig(config: any) { return config; }
  async updateTransaction(txId: string, data: any) { return { id: txId, ...data }; }
  async getAuditLogs(filter?: any) { return []; }
  async getApiKeyById(id: string) { return { id, userId: '', key: '', status: 'active' }; }
  async revokeApiKey(id: string) { return { id, status: 'revoked' }; }
  async createApiKey(data: any) { return { id: 'apiKeyId', ...data }; }
  async getUserApiKeys(userId: string) { return []; }
  async deleteApiKey(id: string) { return true; }
  async getApiUsage(apiKeyId: string) { return { requests: 0, lastUsed: new Date() }; }
  async updateApiKey(id: string, data: any) { return { id, ...data }; }
  async getApiKeyUsageStats(id: string) { return { total: 0, daily: 0, monthly: 0 }; }
  async getApiKeyByHash(hash: string) { return { id: 'keyId', userId: '', hash, status: 'active' }; }
  async updateApiKeyLastUsed(id: string) { return true; }
  async getActiveChatSession(userId: string) { return null; }
  async createChatSession(data: any) { return { id: 'sessionId', ...data }; }
  async notifyAdminsNewChatSession(sessionId: string) { return true; }
  async getChatSession(id: string) { return { id, userId: '', status: 'active' }; }
  async getChatMessages(sessionId: string) { return []; }
  async createChatMessage(data: any) { return { id: 'msgId', ...data }; }
  async updateChatSessionStatus(id: string, status: string) { return { id, status }; }
  async endChatSession(id: string) { return { id, status: 'closed' }; }
  async rateChatSession(id: string, rating: number, feedback?: string) { return { id, rating, feedback }; }
  // --- END STUBS ---
  public db = db;
  public schema = schema;

  // Withdrawal methods
  async getUserWithdrawals(userId: string) {
    return await db.select().from(schema.withdrawals).where(eq(schema.withdrawals.userId, userId));
  }

  async getAllWithdrawals() {
    return await db.select().from(schema.withdrawals);
  }

  async getWithdrawalLimits(userId: string) {
    const [limits] = await db.select().from(schema.withdrawalLimits).where(eq(schema.withdrawalLimits.userId, userId));
    return limits || {
      dailyLimit: '10000',
      monthlyLimit: '50000',
      dailyUsed: '0',
      monthlyUsed: '0',
      lastResetDate: new Date()
    };
  }

  async calculateWithdrawalFees(amount: number, method: string) {
    const feePercentage = 0.005; // 0.5% fee
    return amount * feePercentage;
  }

  async getPortfolio(userId: string) {
    const [portfolio] = await db.select().from(schema.portfolios).where(eq(schema.portfolios.userId, userId));
    return portfolio;
  }

  async updatePortfolio(portfolioId: string, updates: any) {
    const [updated] = await db.update(schema.portfolios).set(updates).where(eq(schema.portfolios.id, portfolioId)).returning();
    return updated;
  }

  async updatePortfolioBalance(userId: string, amount: number) {
    const portfolio = await this.getPortfolio(userId);
    if (portfolio) {
      const newBalance = parseFloat(portfolio.availableCash) + amount;
      await db.update(schema.portfolios)
        .set({ availableCash: newBalance.toString() })
        .where(eq(schema.portfolios.id, portfolio.id));
    }
  }

  async createWithdrawal(data: any) {
    const [withdrawal] = await db.insert(schema.withdrawals).values(data).returning();
    return withdrawal;
  }

  async confirmWithdrawal(userId: string, token: string) {
    const [withdrawal] = await db.select().from(schema.withdrawals)
      .where(and(
        eq(schema.withdrawals.userId, userId),
        eq(schema.withdrawals.confirmationToken, token),
        eq(schema.withdrawals.isConfirmed, false)
      ));

    if (withdrawal && new Date(withdrawal.confirmationExpiresAt!) > new Date()) {
      const [updated] = await db.update(schema.withdrawals)
        .set({ isConfirmed: true })
        .where(eq(schema.withdrawals.id, withdrawal.id))
        .returning();
      return updated;
    }
    return null;
  }

  async updateWithdrawalStatus(id: string, status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'processing' | 'completed' | 'failed', notes?: string) {
    const [withdrawal] = await db.update(schema.withdrawals)
      .set({
        status,
        adminNotes: notes,
        updatedAt: new Date()
      })
      .where(eq(schema.withdrawals.id, id))
      .returning();
    return withdrawal;
  }

  async getWithdrawalById(id: string) {
    const [withdrawal] = await db.select().from(schema.withdrawals).where(eq(schema.withdrawals.id, id));
    return withdrawal;
  }

  async getWithdrawalStats() {
    const withdrawals = await db.select().from(schema.withdrawals);
    return {
      total: withdrawals.length,
      pending: withdrawals.filter(w => w.status === 'pending').length,
      approved: withdrawals.filter(w => w.status === 'approved').length,
      rejected: withdrawals.filter(w => w.status === 'rejected').length
    };
  }

  async setWithdrawalLimits(userId: string, limits: { dailyLimit: number; monthlyLimit: number }) {
    const existing = await db.select().from(schema.withdrawalLimits).where(eq(schema.withdrawalLimits.userId, userId));

    if (existing.length > 0) {
      const [updated] = await db.update(schema.withdrawalLimits)
        .set({
          dailyLimit: limits.dailyLimit.toString(),
          monthlyLimit: limits.monthlyLimit.toString(),
          updatedAt: new Date()
        })
        .where(eq(schema.withdrawalLimits.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(schema.withdrawalLimits)
        .values({
          userId,
          dailyLimit: limits.dailyLimit.toString(),
          monthlyLimit: limits.monthlyLimit.toString()
        })
        .returning();
      return created;
    }
  }
}

// Export as `any` to avoid wide breaking type-errors during incremental fixes.
// We'll tighten this type later.
export const storage: any = new DatabaseStorage();