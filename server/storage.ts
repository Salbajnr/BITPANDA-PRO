import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // ✅ Avoid IPv6 ENETUNREACH on Render

// Only load .env if DATABASE_URL is not already set (prefer environment variables)
import dotenv from "dotenv";
if (!process.env.DATABASE_URL) {
  dotenv.config();
}

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, and } from 'drizzle-orm';
import * as schema from "../shared/schema"; // adjust path if needed

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("❌ DATABASE_URL is not set in environment variables.");
}

// ✅ Append sslmode for hosted DBs
const connectionString = databaseUrl.includes("sslmode=")
  ? databaseUrl
  : `${databaseUrl}?sslmode=no-verify`;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Render uses managed SSL certs
  },
});

// ✅ Initialize Drizzle ORM
export const db = drizzle(pool, { schema });

// ✅ Optional singleton class for structured usage
class DatabaseStorage {
  async createAuditLog(data: any) { return { id: 'auditId', ...data }; }
  async getNewsArticleById(id: string) { return { id, title: '', description: '', category: '', coins: [], content: '', createdAt: new Date() }; }
  async updateNewsArticle(id: string, data: any) { return { id, ...data }; }
  async getNewsAnalytics() { return { total: 0, views: 0, shares: 0 }; }
  async getHoldings(portfolioId: string) { return [{ id: 'holdingId', portfolioId, symbol: '', amount: '0', name: '', averagePurchasePrice: '0' }]; }
  async getActivePriceAlerts() { return []; }
  async updatePriceAlert(id: string, data: any) { return { id, ...data }; }
  async createNotification(data: any) { return { id: 'notificationId', ...data }; }
  async getUserAlerts(userId: string) { return []; }
  async createAlert(data: any) { return { id: 'alertId', ...data }; }
  async getTransactions(userId: string) { return []; }
  isDbConnected() { return true; }
  async createPortfolio(data: any) { return { id: 'portfolioId', ...data, availableCash: '0' }; }
  async getUserByEmailOrUsername(email: string, username: string) { return { id: 'userId', email, username, password: '', role: 'user', isActive: true, firstName: '', lastName: '' }; }
  async getUserByEmail(email: string) { return { id: 'userId', email, username: '', password: '', role: 'user', isActive: true, firstName: '', lastName: '' }; }
  async getUserByUsername(username: string) { return { id: 'userId', email: '', username, password: '', role: 'user', isActive: true, firstName: '', lastName: '' }; }
  async createUser(data: any) { return { id: 'userId', ...data, password: '', role: 'user', isActive: true, firstName: '', lastName: '' }; }
  async getAllUsers() { return [{ id: 'userId', email: '', username: '', password: '', role: 'user', isActive: true, firstName: '', lastName: '' }]; }
  async createBalanceAdjustment(data: any) { return { id: 'adjustmentId', ...data }; }
  async logAdminAction(data: any) { return { id: 'logId', ...data }; }
  async getBalanceAdjustments(userId: string) { return []; }
  async createNewsArticle(data: any) { return { id: 'newsId', ...data }; }
  async deleteNewsArticle(id: string) { return { id }; }
  async getNewsArticles(limit?: number) { return []; }
  async createSavingsPlan(data: any) { return { id: 'planId', ...data, userId: data.userId || '', status: 'active', totalSaved: '0' }; }
  async getUserSavingsPlans(userId: string) { return [{ id: 'planId', userId, status: 'active', totalSaved: '0' }]; }
  async deleteSavingsPlan(planId: string) { return { id: planId }; }
  // --- MISSING METHODS (STUBS, TODO: IMPLEMENT) ---
  async getUser(userId: string) { return { id: userId, password: '', role: 'user' }; }
  async getSavingsPlanById(planId: string) { return { id: planId, status: 'active' }; }
  async updateSavingsPlan(planId: string, data: any) { return { id: planId, ...data }; }
  async updateUser(userId: string, data: any) { return { id: userId, ...data }; }
  async getUserSettings(userId: string) { return { userId }; }
  async updateUserSettings(userId: string, data: any) { return { userId, ...data }; }
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
  async deleteHolding(portfolioId: string, symbol: string) { return { portfolioId, symbol }; }
  async getUserTransactions(userId: string, limit?: number) { return []; }
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

export const storage = new DatabaseStorage();