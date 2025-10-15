import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // ✅ Avoid IPv6 ENETUNREACH on Render

import "dotenv/config";
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

  async updateWithdrawalStatus(id: string, status: string, notes?: string) {
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