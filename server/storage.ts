import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";
import { eq, and } from "drizzle-orm/expressions";

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export const db: NodePgDatabase = drizzle(pool);

// Interfaces for types
type UserId = string;
type PortfolioId = string;
type HoldingId = string;
type TransactionId = string;
type WithdrawalId = string;
type DepositId = string;

// ---------------- USERS ----------------
export class DatabaseStorage {
  db: NodePgDatabase;

  constructor(db: NodePgDatabase) {
    this.db = db;
  }

  // Users
  async getUser(id: UserId) {
    return this.db.select().from(schema.users).where(eq(schema.users.id, id)).get();
  }

  async getUserByEmail(email: string) {
    return this.db.select().from(schema.users).where(eq(schema.users.email, email)).get();
  }

  async updateUser(id: UserId, data: Partial<typeof schema.users._inferModel>) {
    return this.db.update(schema.users).set(data).where(eq(schema.users.id, id));
  }

  async deleteUser(id: UserId) {
    return this.db.delete(schema.users).where(eq(schema.users.id, id));
  }

  // User Settings
  async getUserSettings(userId: UserId) {
    return this.db.select().from(schema.userSettings).where(eq(schema.userSettings.userId, userId)).get();
  }

  async createUserSettings(data: Partial<typeof schema.userSettings._inferModel>) {
    return this.db.insert(schema.userSettings).values(data).returning();
  }

  async updateUserSettings(userId: UserId, data: Partial<typeof schema.userSettings._inferModel>) {
    return this.db.update(schema.userSettings).set(data).where(eq(schema.userSettings.userId, userId));
  }

  // Notifications (placeholder)
  async getUserNotifications(userId: UserId) {
    // Implement based on your notifications table
    return [];
  }

  async markNotificationAsRead(notificationId: string) {
    // Implement based on your notifications table
    return true;
  }

  // ---------------- PORTFOLIOS ----------------
  async getPortfolio(id: PortfolioId) {
    return this.db.select().from(schema.portfolios).where(eq(schema.portfolios.id, id)).get();
  }

  async updatePortfolio(id: PortfolioId, data: Partial<typeof schema.portfolios._inferModel>) {
    return this.db.update(schema.portfolios).set(data).where(eq(schema.portfolios.id, id));
  }

  // ---------------- HOLDINGS ----------------
  async getHolding(id: HoldingId) {
    return this.db.select().from(schema.holdings).where(eq(schema.holdings.id, id)).get();
  }

  async upsertHolding(data: Partial<typeof schema.holdings._inferModel>) {
    return this.db
      .insert(schema.holdings)
      .values(data)
      .onConflictDoUpdate({
        target: schema.holdings.id,
        set: data,
      })
      .returning();
  }

  async deleteHolding(id: HoldingId) {
    return this.db.delete(schema.holdings).where(eq(schema.holdings.id, id));
  }

  // ---------------- TRANSACTIONS ----------------
  async getUserTransactions(userId: UserId) {
    return this.db.select().from(schema.transactions).where(eq(schema.transactions.userId, userId));
  }

  async createTransaction(data: Partial<typeof schema.transactions._inferModel>) {
    return this.db.insert(schema.transactions).values(data).returning();
  }

  // ---------------- WATCHLIST ----------------
  async getUserWatchlist(userId: UserId) {
    // Implement based on your watchlist table
    return [];
  }

  async addToWatchlist(userId: UserId, symbol: string) {
    // Implement based on your watchlist table
    return true;
  }

  async removeFromWatchlist(userId: UserId, symbol: string) {
    // Implement based on your watchlist table
    return true;
  }

  // ---------------- DEPOSITS ----------------
  async getDeposit(id: DepositId) {
    return this.db.select().from(schema.deposits).where(eq(schema.deposits.id, id)).get();
  }

  async createDeposit(data: Partial<typeof schema.deposits._inferModel>) {
    return this.db.insert(schema.deposits).values(data).returning();
  }

  async updateDepositStatus(id: DepositId, status: string, adminNotes?: string) {
    return this.db
      .update(schema.deposits)
      .set({ status, adminNotes })
      .where(eq(schema.deposits.id, id));
  }

  // ---------------- WITHDRAWALS ----------------
  async getUserWithdrawals(userId: UserId) {
    return this.db.select().from(schema.transactions).where(and(eq(schema.transactions.userId, userId), eq(schema.transactions.type, 'withdrawal')));
  }

  async getWithdrawalById(id: WithdrawalId) {
    return this.db.select().from(schema.transactions).where(eq(schema.transactions.id, id)).get();
  }

  async createWithdrawal(data: Partial<typeof schema.transactions._inferModel>) {
    return this.db.insert(schema.transactions).values(data).returning();
  }

  async updateWithdrawalStatus(id: WithdrawalId, status: string) {
    return this.db.update(schema.transactions).set({ status }).where(eq(schema.transactions.id, id));
  }

  async calculateWithdrawalFees(amount: number) {
    // Example: 0.5% fee
    return amount * 0.005;
  }

  async getWithdrawalLimits() {
    // Retrieve from platformSettings table
    const limit = await this.db.select().from(schema.platformSettings).where(eq(schema.platformSettings.key, 'withdrawal_limit')).get();
    return limit?.value || '1000';
  }

  async setWithdrawalLimits(limit: number) {
    return this.db
      .update(schema.platformSettings)
      .set({ value: limit.toString() })
      .where(eq(schema.platformSettings.key, 'withdrawal_limit'));
  }

  async getWithdrawalStats() {
    // Aggregate withdrawals
    const total = await this.db.select({ total: schema.transactions.amount }).from(schema.transactions).where(eq(schema.transactions.type, 'withdrawal'));
    return total;
  }

  // ---------------- METALS ----------------
  async getMetalPrice(symbol: string) {
    return this.db.select().from(schema.metalsPricing).where(eq(schema.metalsPricing.symbol, symbol)).get();
  }

  async updateMetalPrice(symbol: string, price: number) {
    return this.db.update(schema.metalsPricing).set({ pricePerOunce: price }).where(eq(schema.metalsPricing.symbol, symbol));
  }

  // ---------------- BALANCE ADJUSTMENTS ----------------
  async adjustUserBalance(adminId: UserId, targetUserId: UserId, type: 'add' | 'remove' | 'set', amount: number) {
    return this.db.insert(schema.balanceAdjustments).values({
      adminId,
      targetUserId,
      adjustmentType: type,
      amount,
    }).returning();
  }
}

// Export singleton instance
export const storage = new DatabaseStorage(db);