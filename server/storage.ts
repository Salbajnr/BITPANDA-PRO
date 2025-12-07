import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";
import { eq, and, or, sql } from "drizzle-orm";

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
    const [result] = await this.db.update(schema.users).set(data).where(eq(schema.users.id, id)).returning();
    return result;
  }

  async deleteUser(id: UserId) {
    return this.db.delete(schema.users).where(eq(schema.users.id, id));
  }

  async createUser(data: typeof schema.users.$inferInsert) {
    const [result] = await this.db.insert(schema.users).values(data).returning();
    return result;
  }

  // User Settings
  async getUserSettings(userId: UserId) {
    return this.db.query.userSettings.findFirst({ where: eq(schema.userSettings.userId, userId) });
  }

  async createUserSettings(data: typeof schema.userSettings.$inferInsert) {
    const [result] = await this.db.insert(schema.userSettings).values(data).returning();
    return result;
  }

  async updateUserSettings(userId: UserId, data: Partial<typeof schema.userSettings.$inferInsert>) {
    const existing = await this.db.query.userSettings.findFirst({ where: eq(schema.userSettings.userId, userId) });
    if (existing) {
      const [result] = await this.db.update(schema.userSettings).set(data).where(eq(schema.userSettings.userId, userId)).returning();
      return result;
    } else {
      const [result] = await this.db.insert(schema.userSettings).values({ userId, ...data } as typeof schema.userSettings.$inferInsert).returning();
      return result;
    }
  }

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

  async updatePortfolio(id: PortfolioId, data: Partial<typeof schema.portfolios.$inferInsert>) {
    return this.db.update(schema.portfolios).set(data).where(eq(schema.portfolios.id, id));
  }

  // ---------------- HOLDINGS ----------------
  async getHolding(portfolioId: PortfolioId, symbol: string) {
    return this.db.query.holdings.findFirst({ where: and(eq(schema.holdings.portfolioId, portfolioId), eq(schema.holdings.symbol, symbol)) });
  }

  async getHoldings(portfolioId: PortfolioId) {
    return this.db.query.holdings.findMany({ where: eq(schema.holdings.portfolioId, portfolioId) });
  }

  async getHoldingById(id: HoldingId) {
    return this.db.query.holdings.findFirst({ where: eq(schema.holdings.id, id) });
  }

  async upsertHolding(data: typeof schema.holdings.$inferInsert) {
    const [result] = await this.db
      .insert(schema.holdings)
      .values(data)
      .onConflictDoUpdate({
        target: schema.holdings.id,
        set: data,
      })
      .returning();
    return result;
  }

  async updateHolding(id: HoldingId, data: Partial<typeof schema.holdings.$inferInsert>) {
    const [result] = await this.db.update(schema.holdings).set(data).where(eq(schema.holdings.id, id)).returning();
    return result;
  }

  async deleteHolding(portfolioId: PortfolioId, symbol: string) {
    return this.db.delete(schema.holdings).where(and(eq(schema.holdings.portfolioId, portfolioId), eq(schema.holdings.symbol, symbol)));
  }

  // ---------------- TRANSACTIONS ----------------
  async getUserTransactions(userId: UserId, limit?: number) {
    if (limit) {
      const result = await this.db.select().from(schema.transactions).where(eq(schema.transactions.userId, userId)).limit(limit);
      return result;
    }
    return this.db.query.transactions.findMany({ where: eq(schema.transactions.userId, userId) });
  }

  async getAllTransactions(options?: { page?: number; limit?: number; type?: string }) {
    const { page = 1, limit = 50, type } = options || {};
    const offset = (page - 1) * limit;
    
    let query: any = this.db.select().from(schema.transactions);
    if (type) {
      query = query.where(eq(schema.transactions.type, type as any));
    }
    
    const result = await query.limit(limit).offset(offset);
    return result;
  }

  async createTransaction(data: typeof schema.transactions.$inferInsert) {
    const [result] = await this.db.insert(schema.transactions).values(data).returning();
    return result;
  }

  // ---------------- WATCHLIST ----------------
  async getUserWatchlist(userId: UserId) {
    return this.db.query.watchlist.findMany({ where: eq(schema.watchlist.userId, userId) });
  }

  async addToWatchlist(data: typeof schema.watchlist.$inferInsert) {
    const [result] = await this.db.insert(schema.watchlist).values(data).returning();
    return result;
  }

  async getWatchlistItem(id: string) {
    return this.db.query.watchlist.findFirst({ where: eq(schema.watchlist.id, id) });
  }

  async updateWatchlistItem(id: string, data: Partial<typeof schema.watchlist.$inferInsert>) {
    const [result] = await this.db.update(schema.watchlist).set(data).where(eq(schema.watchlist.id, id)).returning();
    return result;
  }

  // removeFromWatchlist - consolidated at end of class

  // ---------------- DEPOSITS ----------------
  async getDeposit(id: DepositId) {
    return this.db.query.deposits.findFirst({ where: eq(schema.deposits.id, id) });
  }

  async createDeposit(data: typeof schema.deposits.$inferInsert) {
    const [result] = await this.db.insert(schema.deposits).values(data).returning();
    return result;
  }

  async updateDepositStatus(id: DepositId, status: typeof schema.depositStatusEnum.enumValues[number], adminNotes?: string) {
    const updateData: any = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    return this.db
      .update(schema.deposits)
      .set(updateData)
      .where(eq(schema.deposits.id, id));
  }

  // ---------------- WITHDRAWALS ----------------
  async getUserWithdrawals(userId: UserId) {
    return this.db.query.transactions.findMany({ where: and(eq(schema.transactions.userId, userId), eq(schema.transactions.type, 'withdrawal' as any)) });
  }

  async getAllWithdrawals() {
    return this.db.query.transactions.findMany({ where: eq(schema.transactions.type, 'withdrawal' as any) });
  }

  async getWithdrawalById(id: WithdrawalId) {
    return this.db.query.transactions.findFirst({ where: eq(schema.transactions.id, id) });
  }

  async createWithdrawal(data: typeof schema.transactions.$inferInsert) {
    const [result] = await this.db.insert(schema.transactions).values(data).returning();
    return result;
  }

  async updateWithdrawalStatus(id: WithdrawalId, status: string, adminNotes?: string) {
    const updateData: any = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    const [result] = await this.db.update(schema.transactions).set(updateData).where(eq(schema.transactions.id, id)).returning();
    return result;
  }

  async confirmWithdrawal(userId: UserId, token: string) {
    // Find withdrawal with matching token and user
    const withdrawal = await this.db.query.transactions.findFirst({
      where: and(
        eq(schema.transactions.userId, userId),
        eq(schema.transactions.type, 'withdrawal' as any)
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
    const total = await this.db.select({ total: schema.transactions.amount }).from(schema.transactions).where(eq(schema.transactions.type, 'withdrawal' as any));
    return total;
  }

  // ---------------- METALS ----------------
  async getMetalPrice(symbol: string) {
    return this.db.query.metalsPricing.findFirst({ where: eq(schema.metalsPricing.symbol, symbol) });
  }

  async updateMetalPrice(symbol: string, price: number) {
    return this.db.update(schema.metalsPricing).set({ pricePerOunce: price.toString() }).where(eq(schema.metalsPricing.symbol, symbol));
  }

  // ---------------- BALANCE ADJUSTMENTS ----------------
  async adjustUserBalance(adminId: UserId, targetUserId: UserId, type: 'add' | 'remove' | 'set', amount: number) {
    const [result] = await this.db.insert(schema.balanceAdjustments).values({
      adminId,
      targetUserId,
      adjustmentType: type,
      amount: amount.toString(),
    } as typeof schema.balanceAdjustments.$inferInsert).returning();
    return result;
  }

  // ---------------- NEWS ----------------
  async getNewsArticles(limit?: number) {
    const query = this.db.select().from(schema.newsArticles).orderBy(sql`created_at DESC`);
    if (limit) {
      const result = await query.limit(limit);
      return result;
    }
    const result = await query;
    return result;
  }

  async getNewsArticleById(id: string) {
    return this.db.query.newsArticles.findFirst({ where: eq(schema.newsArticles.id, id) });
  }

  async createNewsArticle(data: typeof schema.newsArticles.$inferInsert) {
    const [result] = await this.db.insert(schema.newsArticles).values(data).returning();
    return result;
  }

  async updateNewsArticle(id: string, data: Partial<typeof schema.newsArticles.$inferInsert>) {
    const [result] = await this.db.update(schema.newsArticles).set(data).where(eq(schema.newsArticles.id, id)).returning();
    return result;
  }

  async deleteNewsArticle(id: string) {
    return this.db.delete(schema.newsArticles).where(eq(schema.newsArticles.id, id));
  }

  async getNewsAnalytics() {
    const all = await this.db.select().from(schema.newsArticles);
    return {
      totalArticles: all.length,
      publishedToday: 0,
      totalViews: 0,
      engagementRate: 0,
    };
  }

  // ---------------- NOTIFICATIONS ----------------
  async createNotification(data: typeof schema.notifications.$inferInsert) {
    const [result] = await this.db.insert(schema.notifications).values(data).returning();
    return result;
  }

  async getNotificationById(id: number) {
    return this.db.query.notifications.findFirst({ where: eq(schema.notifications.id, id) });
  }

  async updateNotification(id: number, data: Partial<typeof schema.notifications.$inferInsert>) {
    const [result] = await this.db.update(schema.notifications).set(data).where(eq(schema.notifications.id, id)).returning();
    return result;
  }

  async deleteNotification(id: number) {
    return this.db.delete(schema.notifications).where(eq(schema.notifications.id, id));
  }

  async markAllNotificationsRead(userId: string) {
    return this.db.update(schema.notifications).set({ read: true }).where(eq(schema.notifications.userId, userId));
  }

  async getNotificationPreferences(userId: string) {
    return this.db.query.userPreferences.findFirst({ where: eq(schema.userPreferences.userId, userId) });
  }

  async updateNotificationPreferences(userId: string, data: Partial<typeof schema.userPreferences.$inferInsert>) {
    const existing = await this.db.query.userPreferences.findFirst({ where: eq(schema.userPreferences.userId, userId) });
    if (existing) {
      const [result] = await this.db.update(schema.userPreferences).set(data).where(eq(schema.userPreferences.userId, userId)).returning();
      return result;
    } else {
      const [result] = await this.db.insert(schema.userPreferences).values({ userId, ...data } as typeof schema.userPreferences.$inferInsert).returning();
      return result;
    }
  }

  // ---------------- KYC ----------------
  async getKycVerificationById(id: string) {
    return this.db.query.kycVerifications.findFirst({ where: eq(schema.kycVerifications.id, id) });
  }

  async updateKycVerification(id: string, data: Partial<typeof schema.kycVerifications.$inferInsert>) {
    const [result] = await this.db.update(schema.kycVerifications).set(data).where(eq(schema.kycVerifications.id, id)).returning();
    return result;
  }

  async getKycStatistics() {
    const all = await this.db.select().from(schema.kycVerifications);
    const approved = all.filter(k => k.status === 'approved').length;
    const pending = all.filter(k => k.status === 'pending').length;
    const rejected = all.filter(k => k.status === 'rejected').length;
    
    return {
      total: all.length,
      approved,
      pending,
      rejected,
      approvalRate: all.length > 0 ? (approved / all.length) * 100 : 0
    };
  }

  // LENDING ----------------
  async getUserLendingPositions(userId: string) {
    return this.db.query.lendingPositions.findMany({ where: eq(schema.lendingPositions.userId, userId) });
  }

  async getLendingPosition(id: string, userId?: string) {
    if (userId) {
      return this.db.query.lendingPositions.findFirst({ where: and(eq(schema.lendingPositions.id, id), eq(schema.lendingPositions.userId, userId)) });
    }
    return this.db.query.lendingPositions.findFirst({ where: eq(schema.lendingPositions.id, id) });
  }

  async createLendingPosition(data: typeof schema.lendingPositions.$inferInsert) {
    const [result] = await this.db.insert(schema.lendingPositions).values(data).returning();
    return result;
  }

  async updateLendingPosition(id: string, data: Partial<typeof schema.lendingPositions.$inferInsert>) {
    const [result] = await this.db.update(schema.lendingPositions).set(data).where(eq(schema.lendingPositions.id, id)).returning();
    return result;
  }

  async createLoan(data: typeof schema.loans.$inferInsert) {
    const [result] = await this.db.insert(schema.loans).values(data).returning();
    return result;
  }

  async getLoan(id: string, userId?: string) {
    if (userId) {
      return this.db.query.loans.findFirst({ where: and(eq(schema.loans.id, id), eq(schema.loans.userId, userId)) });
    }
    return this.db.query.loans.findFirst({ where: eq(schema.loans.id, id) });
  }

  async getUserLoans(userId: string) {
    return this.db.query.loans.findMany({ where: eq(schema.loans.userId, userId) });
  }

  async updateLoan(id: string, data: Partial<typeof schema.loans.$inferInsert>) {
    const [result] = await this.db.update(schema.loans).set(data).where(eq(schema.loans.id, id)).returning();
    return result;
  }

  // ---------------- ALERTS ----------------
  async getUserAlerts(userId: string) {
    return this.db.query.priceAlerts.findMany({ where: eq(schema.priceAlerts.userId, userId) });
  }

  async createAlert(data: typeof schema.priceAlerts.$inferInsert) {
    const [result] = await this.db.insert(schema.priceAlerts).values(data).returning();
    return result;
  }

  async getAlertById(id: string) {
    return this.db.query.priceAlerts.findFirst({ where: eq(schema.priceAlerts.id, id) });
  }

  async updateAlert(id: string, data: Partial<typeof schema.priceAlerts.$inferInsert>) {
    const [result] = await this.db.update(schema.priceAlerts).set(data).where(eq(schema.priceAlerts.id, id)).returning();
    return result;
  }

  async updatePriceAlert(id: string, data: Partial<typeof schema.priceAlerts.$inferInsert>) {
    const [result] = await this.db.update(schema.priceAlerts).set(data).where(eq(schema.priceAlerts.id, id)).returning();
    return result;
  }

  async getPriceAlertById(id: string) {
    return this.db.query.priceAlerts.findFirst({ where: eq(schema.priceAlerts.id, id) });
  }

  async deleteAlert(id: string) {
    return this.db.delete(schema.priceAlerts).where(eq(schema.priceAlerts.id, id));
  }

  async getActivePriceAlerts() {
    return this.db.query.priceAlerts.findMany({ where: eq(schema.priceAlerts.isActive, true) });
  }

  // ---------------- ADMIN/AUDIT ----------------
  async logAdminAction(data: typeof schema.auditLogs.$inferInsert) {
    const [result] = await this.db.insert(schema.auditLogs).values(data).returning();
    return result;
  }

  async createAuditLog(data: typeof schema.auditLogs.$inferInsert) {
    const [result] = await this.db.insert(schema.auditLogs).values(data).returning();
    return result;
  }

  // ---------------- ANALYTICS ----------------
  async getUserCount() {
    const [result] = await this.db.select({ count: sql<number>`count(*)` }).from(schema.users);
    return result.count;
  }

  async getTransactionCount() {
    const [result] = await this.db.select({ count: sql<number>`count(*)` }).from(schema.transactions);
    return result.count;
  }

  // ---------------- GOOGLE/FACEBOOK/APPLE AUTH ----------------
  async getUserByGoogleId(googleId: string) {
    return this.db.query.users.findFirst({ where: eq(schema.users.googleId, googleId) });
  }

  async getUserByFacebookId(facebookId: string) {
    return this.db.query.users.findFirst({ where: eq(schema.users.facebookId, facebookId) });
  }

  async getUserByAppleId(appleId: string) {
    return this.db.query.users.findFirst({ where: eq(schema.users.appleId, appleId) });
  }

  // ---------------- ACTIVE USERS ----------------
  async getActiveUsers() {
    return this.db.query.users.findMany({ where: eq(schema.users.isActive, true) });
  }

  // Additional methods to fix TypeScript errors
  async getUserByUsername(username: string) {
    return this.db.query.users.findFirst({ where: eq(schema.users.username, username) });
  }

  async getAllUsers() {
    return this.db.select().from(schema.users);
  }

  async createPortfolio(data: typeof schema.portfolios.$inferInsert) {
    const [result] = await this.db.insert(schema.portfolios).values(data).returning();
    return result;
  }

  async createSecurityLog(data: typeof schema.adminActionLogs.$inferInsert) {
    const [result] = await this.db.insert(schema.adminActionLogs).values(data).returning();
    return result;
  }

  async logSecurityEvent(data: typeof schema.adminActionLogs.$inferInsert) {
    const [result] = await this.db.insert(schema.adminActionLogs).values(data).returning();
    return result;
  }

  async getRateLimitEntry(key: string) {
    // Implementation would depend on how rate limiting is stored
    return null;
  }

  async setRateLimitEntry(key: string, entry: any) {
    // Implementation would depend on how rate limiting is stored
    return true;
  }

  async isDbConnected() {
    try {
      await this.db.select().from(schema.users).limit(1);
      return true;
    } catch (error) {
      return false;
    }
  }

  // ---------------- STAKING ----------------
  async getStakingPosition(id: string, userId: string) {
    return this.db.query.stakingPositions.findFirst({ 
      where: and(
        eq(schema.stakingPositions.id, id),
        eq(schema.stakingPositions.userId, userId)
      ) 
    });
  }

  async getStakingRewards(userId: string) {
    // Implementation would depend on how rewards are calculated/stored
    return [];
  }

  async getStakingAnalytics(userId: string) {
    // Implementation would depend on how analytics are calculated/stored
    return {};
  }

  // ---------------- API KEYS ----------------
  async getUserApiKeys(userId: string) {
    return this.db.query.apiKeys.findMany({ where: eq(schema.apiKeys.userId, userId) });
  }

  async createApiKey(data: typeof schema.apiKeys.$inferInsert) {
    const [result] = await this.db.insert(schema.apiKeys).values(data).returning();
    return result;
  }

  async getApiKeyById(id: string) {
    return this.db.query.apiKeys.findFirst({ where: eq(schema.apiKeys.id, id) });
  }

  async updateApiKey(id: string, data: Partial<typeof schema.apiKeys.$inferInsert>) {
    const [result] = await this.db.update(schema.apiKeys).set(data).where(eq(schema.apiKeys.id, id)).returning();
    return result;
  }

  async revokeApiKey(id: string) {
    const [result] = await this.db.update(schema.apiKeys).set({ isActive: false }).where(eq(schema.apiKeys.id, id)).returning();
    return result;
  }

  // Social methods
  async followUser(userId: string, targetUserId: string) {
    // Implementation would depend on how following is stored
    return true;
  }

  async unfollowUser(userId: string, targetUserId: string) {
    // Implementation would depend on how following is stored
    return true;
  }

  async isFollowing(userId: string, targetUserId: string) {
    // Implementation would depend on how following is stored
    return false;
  }

  async getUserFollowing(userId: string) {
    // Implementation would depend on how following is stored
    return [];
  }

  async getUserFollowers(userId: string) {
    // Implementation would depend on how followers are stored
    return [];
  }

  // Friend request methods
  async getFriendRequest(userId: string, targetUserId: string) {
    // Implementation would depend on how friend requests are stored
    return null;
  }

  async getFriendRequestById(id: string) {
    // Implementation would depend on how friend requests are stored
    return null;
  }

  async createFriendRequest(data: any) {
    // Implementation would depend on how friend requests are stored
    return null;
  }

  async updateFriendRequest(id: string, data: any) {
    // Implementation would depend on how friend requests are stored
    return null;
  }

  async getIncomingFriendRequests(userId: string) {
    // Implementation would depend on how friend requests are stored
    return [];
  }

  async createFriendship(userId: string, targetUserId: string) {
    // Implementation would depend on how friendships are stored
    return true;
  }

  async removeFriendship(userId: string, targetUserId: string) {
    // Implementation would depend on how friendships are stored
    return true;
  }

  async getUserFriends(userId: string) {
    // Implementation would depend on how friendships are stored
    return [];
  }

  // Watchlist methods - accept data object
  async removeFromWatchlist(data: { userId?: string; symbol?: string } | string) {
    // Handle both cases - new API expects id, old API expects object or just id
    if (typeof data === 'string') {
      return this.db.delete(schema.watchlist).where(eq(schema.watchlist.id, data as any));
    } 
  }

  // Investment plans methods
  async getInvestmentById(id: string) {
    return this.db.query.investmentPlans.findFirst({ where: eq(schema.investmentPlans.id, id) });
  }

  async deleteInvestment(id: string) {
    return this.db.delete(schema.investmentPlans).where(eq(schema.investmentPlans.id, id));
  }

  async updateInvestment(id: string, data: Partial<typeof schema.investmentPlans.$inferInsert>) {
    const [result] = await this.db.update(schema.investmentPlans).set(data).where(eq(schema.investmentPlans.id, id)).returning();
    return result;
  }

  async getUserInvestments(userId: string) {
    return this.db.query.investmentPlans.findMany({ where: eq(schema.investmentPlans.userId, userId) });
  }

  async createInvestment(data: typeof schema.investmentPlans.$inferInsert) {
    const [result] = await this.db.insert(schema.investmentPlans).values(data).returning();
    return result;
  }

  // Savings plans methods
  async getSavingsPlanById(id: string) {
    return this.db.query.savingsPlans.findFirst({ where: eq(schema.savingsPlans.id, id) });
  }

  async updateSavingsPlan(id: string, data: Partial<typeof schema.savingsPlans.$inferInsert>) {
    const [result] = await this.db.update(schema.savingsPlans).set(data).where(eq(schema.savingsPlans.id, id)).returning();
    return result;
  }

  async deleteSavingsPlan(id: string) {
    return this.db.delete(schema.savingsPlans).where(eq(schema.savingsPlans.id, id));
  }

  async getUserSavingsPlans(userId: string) {
    return this.db.query.savingsPlans.findMany({ where: eq(schema.savingsPlans.userId, userId) });
  }

  async createSavingsPlan(data: typeof schema.savingsPlans.$inferInsert) {
    const [result] = await this.db.insert(schema.savingsPlans).values(data).returning();
    return result;
  }

  // KYC methods
  async getKycVerification(userId: string) {
    return this.db.query.kycVerifications.findFirst({ where: eq(schema.kycVerifications.userId, userId) });
  }

  async createKycVerification(data: typeof schema.kycVerifications.$inferInsert) {
    const [result] = await this.db.insert(schema.kycVerifications).values(data).returning();
    return result;
  }

  async getAllKycVerifications(options?: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 50 } = options || {};
    const offset = (page - 1) * limit;

    let query: any = this.db.select().from(schema.kycVerifications);
    if (status) {
      query = query.where(eq(schema.kycVerifications.status, status as any));
    }

    const result = await query.limit(limit).offset(offset);
    return result;
  }

  // Balance adjustments methods
  async createBalanceAdjustment(data: typeof schema.balanceAdjustments.$inferInsert) {
    const [result] = await this.db.insert(schema.balanceAdjustments).values(data).returning();
    return result;
  }

  async getBalanceAdjustments(userId?: string) {
    if (userId) {
      return this.db.query.balanceAdjustments.findMany({ where: eq(schema.balanceAdjustments.targetUserId, userId) });
    }
    return this.db.select().from(schema.balanceAdjustments);
  }
}

// Export singleton instance
export const storage = new DatabaseStorage(db);