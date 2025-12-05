import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";
import { eq, and, or } from "drizzle-orm";

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });

// Interfaces for types
type UserId = string;
type PortfolioId = string;
type HoldingId = string;
type TransactionId = string;
type WithdrawalId = string;
type DepositId = string;

// ---------------- USERS ----------------
export class DatabaseStorage {
  db: NodePgDatabase<typeof schema>;

  constructor(db: NodePgDatabase<typeof schema>) {
    this.db = db;
  }

  // Users
  async getUser(id: UserId) {
    return this.db.query.users.findFirst({ where: eq(schema.users.id, id) });
  }

  async getUserByEmail(email: string) {
    return this.db.query.users.findFirst({ where: eq(schema.users.email, email) });
  }

  async getUserByEmailOrUsername(emailOrUsername: string) {
    return this.db.query.users.findFirst({
      where: or(
        eq(schema.users.email, emailOrUsername),
        eq(schema.users.username, emailOrUsername)
      ),
    });
  }

  async verifyPassword(userId: string, password: string) {
    const user = await this.getUser(userId);
    if (!user || !user.password) return false;

    const bcrypt = await import('bcrypt');
    return bcrypt.compare(password, user.password);
  }

  async updateUser(id: UserId, data: Partial<typeof schema.users.$inferSelect>) {
    const result = await this.db.update(schema.users).set(data).where(eq(schema.users.id, id)).returning();
    return result[0];
  }

  async deleteUser(id: UserId) {
    return this.db.delete(schema.users).where(eq(schema.users.id, id));
  }

  // User Settings
  async getUserSettings(userId: UserId) {
    return this.db.query.userSettings.findFirst({ where: eq(schema.userSettings.userId, userId) });
  }

  async createUserSettings(data: Partial<typeof schema.userSettings.$inferSelect>) {
    return this.db.insert(schema.userSettings).values(data).returning();
  }

  async updateUserSettings(userId: UserId, data: Partial<typeof schema.userSettings.$inferSelect>) {
    const result = await this.db.update(schema.userSettings).set(data).where(eq(schema.userSettings.userId, userId)).returning();
    return result[0];
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
    return this.db.query.portfolios.findFirst({ where: eq(schema.portfolios.id, id) });
  }

  async updatePortfolio(id: PortfolioId, data: Partial<typeof schema.portfolios.$inferSelect>) {
    return this.db.update(schema.portfolios).set(data).where(eq(schema.portfolios.id, id));
  }

  // ---------------- HOLDINGS ----------------
  async getHolding(portfolioId: PortfolioId, symbol: string) {
    return this.db.query.holdings.findFirst({ where: and(eq(schema.holdings.portfolioId, portfolioId), eq(schema.holdings.symbol, symbol)) });
  }

  async getHoldingById(id: HoldingId) {
    return this.db.query.holdings.findFirst({ where: eq(schema.holdings.id, id) });
  }

  async upsertHolding(data: Partial<typeof schema.holdings.$inferSelect>) {
    return this.db
      .insert(schema.holdings)
      .values(data)
      .onConflictDoUpdate({
        target: schema.holdings.id,
        set: data,
      })
      .returning();
  }

  async deleteHolding(portfolioId: PortfolioId, symbol: string) {
    return this.db.delete(schema.holdings).where(and(eq(schema.holdings.portfolioId, portfolioId), eq(schema.holdings.symbol, symbol)));
  }

  // ---------------- TRANSACTIONS ----------------
  async getUserTransactions(userId: UserId) {
    return this.db.query.transactions.findMany({ where: eq(schema.transactions.userId, userId) });
  }

  async createTransaction(data: Partial<typeof schema.transactions.$inferSelect>) {
    return this.db.insert(schema.transactions).values(data).returning();
  }

  // ---------------- WATCHLIST ----------------
  async getUserWatchlist(userId: UserId) {
    // Implement based on your watchlist table
    return [];
  }

  async addToWatchlist(userId: UserId, symbol: string, name?: string) {
    // Implement based on your watchlist table
    return { userId, symbol, name };
  }

  async removeFromWatchlist(userId: UserId, symbol: string) {
    // Implement based on your watchlist table
    return true;
  }

  // ---------------- DEPOSITS ----------------
  async getDeposit(id: DepositId) {
    return this.db.query.deposits.findFirst({ where: eq(schema.deposits.id, id) });
  }

  async createDeposit(data: Partial<typeof schema.deposits.$inferSelect>) {
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
    return this.db.query.transactions.findMany({ where: and(eq(schema.transactions.userId, userId), eq(schema.transactions.type, 'withdrawal')) });
  }

  async getAllWithdrawals() {
    return this.db.query.transactions.findMany({ where: eq(schema.transactions.type, 'withdrawal') });
  }

  async getWithdrawalById(id: WithdrawalId) {
    return this.db.query.transactions.findFirst({ where: eq(schema.transactions.id, id) });
  }

  async createWithdrawal(data: Partial<typeof schema.transactions.$inferSelect>) {
    return this.db.insert(schema.transactions).values(data).returning();
  }

  async updateWithdrawalStatus(id: WithdrawalId, status: string, adminNotes?: string) {
    const updateData: any = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    const result = await this.db.update(schema.transactions).set(updateData).where(eq(schema.transactions.id, id)).returning();
    return result[0];
  }

  async confirmWithdrawal(userId: UserId, token: string) {
    // Find withdrawal with matching token and user
    const withdrawal = await this.db.query.transactions.findFirst({
      where: and(
        eq(schema.transactions.userId, userId),
        eq(schema.transactions.type, 'withdrawal')
      ),
    });
    return withdrawal;
  }

  async updatePortfolioBalance(userId: UserId, amountChange: number) {
    const portfolio = await this.db.query.portfolios.findFirst({ where: eq(schema.portfolios.userId, userId) });
    if (portfolio) {
      const newCash = parseFloat(portfolio.availableCash) + amountChange;
      await this.updatePortfolio(portfolio.id, { availableCash: newCash.toString() });
    }
  }

  async calculateWithdrawalFees(amount: number, method?: string) {
    // Example: 0.5% fee, can vary by method
    const feeRate = method === 'crypto_wallet' ? 0.002 : 0.005;
    return amount * feeRate;
  }

  async getWithdrawalLimits(userId?: UserId) {
    // Retrieve from platformSettings table
    const limit = await this.db.query.platformSettings.findFirst({ where: eq(schema.platformSettings.key, 'withdrawal_limit') });
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
    return this.db.query.metalsPricing.findFirst({ where: eq(schema.metalsPricing.symbol, symbol) });
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