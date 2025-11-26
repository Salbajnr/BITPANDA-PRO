// server/storage.ts
import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // ✅ Avoid IPv6 ENETUNREACH on Render

import dotenv from "dotenv";
import { z } from "zod";
import { db, pool } from "./db"; // Shared db instance
import * as schema from "../shared/schema";

// Load .env if not production
if (process.env.NODE_ENV !== "production") dotenv.config();

// Environment validation
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32).optional(),
  SESSION_SECRET: z.string().min(32).optional(),
  SESSION_SECRET_REFRESH: z.string().min(32).optional(),
  COINGECKO_API_KEY: z.string().optional(),
  SENDERGRID_API_KEY: z.string().optional(),
  METALS_API_KEY: z.string().optional()
});

const env = envSchema.safeParse(process.env);
if (!env.success) {
  console.warn("⚠️ Environment validation warnings:", JSON.stringify(env.error.format(), null, 2));
  console.log("🎭 Some features may be limited in demo mode");
}

const DATABASE_URL = env.success ? env.data.DATABASE_URL : process.env.DATABASE_URL;
const NODE_ENV = (env.success ? env.data.NODE_ENV : process.env.NODE_ENV) || "production";

// Database type
type DatabaseType = typeof db;

/**
 * Core database storage class
 * Handles all CRUD operations with proper error handling
 */
class DatabaseStorage {
  public db = db;
  public schema = schema;

  private async withConnection<T>(fn: (db: DatabaseType) => Promise<T>): Promise<T> {
    if (!db) throw new Error("Database not initialized.");
    try {
      return await fn(db);
    } catch (err: any) {
      console.error("Database operation failed:", err);
      throw err;
    }
  }

  // ----------------------------
  // User Methods
  // ----------------------------
  async getUser(userId: string) {
    return this.withConnection(async (db) => {
      const [user] = await db.select().from(schema.users).where(schema.users.id.eq(userId)).limit(1);
      if (!user) throw new Error("User not found");
      return user;
    });
  }

  async getUserByEmail(email: string) {
    return this.withConnection(async (db) => {
      const [user] = await db.select().from(schema.users).where(schema.users.email.eq(email)).limit(1);
      return user || null;
    });
  }

  async createUser(data: any) {
    return this.withConnection(async (db) => {
      const bcrypt = await import("bcrypt");
      const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : null;
      const [user] = await db
        .insert(schema.users)
        .values({
          ...data,
          password: hashedPassword,
          role: data.role || "user",
          isActive: data.isActive ?? true,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      if (!user) throw new Error("Failed to create user");
      return user;
    });
  }

  async updateUser(userId: string, updates: any) {
    return this.withConnection(async (db) => {
      const [updated] = await db.update(schema.users).set({ ...updates, updatedAt: new Date() }).where(schema.users.id.eq(userId)).returning();
      if (!updated) throw new Error("User not found");
      return updated;
    });
  }

  // ----------------------------
  // Investment / Savings Methods
  // ----------------------------
  async getInvestmentById(id: string) {
    return this.withConnection(async (db) => {
      const [plan] = await db.select().from(schema.savingsPlans).where(schema.savingsPlans.id.eq(id)).limit(1);
      if (!plan) throw new Error("Investment not found");
      return plan;
    });
  }

  async createInvestment(data: any) {
    return this.withConnection(async (db) => {
      const [investment] = await db.insert(schema.savingsPlans).values({
        ...data,
        status: data.status || "active",
        totalSaved: "0",
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      if (!investment) throw new Error("Failed to create investment");
      return investment;
    });
  }

  async updateInvestment(id: string, updates: any) {
    return this.withConnection(async (db) => {
      const [updated] = await db.update(schema.savingsPlans).set({ ...updates, updatedAt: new Date() }).where(schema.savingsPlans.id.eq(id)).returning();
      if (!updated) throw new Error("Failed to update investment");
      return updated;
    });
  }

  async deleteInvestment(id: string) {
    return this.withConnection(async (db) => {
      const [deleted] = await db.delete(schema.savingsPlans).where(schema.savingsPlans.id.eq(id)).returning();
      return !!deleted;
    });
  }

  async getAllUserSavingsPlans() {
    return this.withConnection(async (db) => {
      return await db.select().from(schema.savingsPlans).orderBy(schema.savingsPlans.createdAt.desc());
    });
  }

  // ----------------------------
  // Withdrawal Methods
  // ----------------------------
  async getUserWithdrawals(userId: string) {
    return this.withConnection(async (db) => db.select().from(schema.withdrawals).where(schema.withdrawals.userId.eq(userId)));
  }

  async createWithdrawal(data: any) {
    return this.withConnection(async (db) => {
      const [withdrawal] = await db.insert(schema.withdrawals).values({ ...data, createdAt: new Date() }).returning();
      return withdrawal;
    });
  }

  async updateWithdrawalStatus(id: string, status: string, notes?: string) {
    return this.withConnection(async (db) => {
      const [updated] = await db.update(schema.withdrawals).set({ status, adminNotes: notes, updatedAt: new Date() }).where(schema.withdrawals.id.eq(id)).returning();
      return updated;
    });
  }

  // ----------------------------
  // Portfolio Methods
  // ----------------------------
  async getPortfolio(userId: string) {
    return this.withConnection(async (db) => {
      const [portfolio] = await db.select().from(schema.portfolios).where(schema.portfolios.userId.eq(userId));
      return portfolio;
    });
  }

  async updatePortfolio(portfolioId: string, updates: any) {
    return this.withConnection(async (db) => {
      const [updated] = await db.update(schema.portfolios).set(updates).where(schema.portfolios.id.eq(portfolioId)).returning();
      return updated;
    });
  }

  // ----------------------------
  // General helpers & stubs
  // ----------------------------
  async isDbConnected() {
    return !!db;
  }
  async getAllUsers() { return []; }
  async getActivePriceAlerts() { return []; }
  async createNotification(data: any) { return { id: `notif-${Date.now()}`, ...data }; }
  async getTransactions(userId: string) { return []; }

  // ----------------------------
  // Extend as needed...
  // ----------------------------
}

// Export a singleton storage instance
export const storage: DatabaseStorage = new DatabaseStorage();