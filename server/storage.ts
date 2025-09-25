import {
  users,
  portfolios,
  holdings,
  transactions,
  deposits,
  withdrawals,
  withdrawalLimits,
  balanceAdjustments,
  notifications,
  priceAlerts,
  newsArticles,
  passwordResetTokens,
  otpTokens,
  kycVerifications,
  supportTickets,
  supportMessages,
  liveChatSessions,
  liveChatMessages,
  userPreferences,
  type User,
  type Portfolio,
  type Holding,
  type Transaction,
  type Deposit,
  type Withdrawal,
  type InsertWithdrawal,
  type InsertPortfolio,
  type InsertHolding,
  type InsertTransaction,
  type UpsertUser,
  type BalanceAdjustment,
  type InsertBalanceAdjustment,
  type Notification,
  type InsertNotification,
  type PriceAlert,
  type InsertPriceAlert,
  type NewsArticle,
  type InsertNewsArticle,
  type PasswordResetToken,
  type InsertPasswordResetToken,
  type OtpToken,
  type InsertOtpToken,
  type KycVerification,
  type InsertKycVerification,
  type SupportTicket,
  type InsertSupportTicket,
  type SupportMessage,
  type InsertSupportMessage,
  type LiveChatSession,
  type InsertLiveChatSession,
  type LiveChatMessage,
  type InsertLiveChatMessage,
  type UserPreferences,
  type InsertUserPreferences
} from '@shared/schema';
import { db } from "./db";
import { eq, desc, gte, lte, asc, count, and, or, sql, ilike, like, sum, inArray, ne } from "drizzle-orm";
import { hashPassword } from "./simple-auth";
import crypto from 'crypto';

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByEmailOrUsername(email: string, username: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<void>;
  deleteUser(userId: string): Promise<void>;

  // Portfolio operations
  getPortfolio(userId: string): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(portfolioId: string, updates: Partial<InsertPortfolio>): Promise<Portfolio>;

  // Holdings operations
  getHoldings(portfolioId: string): Promise<Holding[]>;
  getHolding(portfolioId: string, symbol: string): Promise<Holding | undefined>;
  upsertHolding(holding: InsertHolding): Promise<Holding>;
  deleteHolding(id: string): Promise<void>;
  deleteHolding(portfolioId: string, symbol: string): Promise<void>;

  // Transaction operations
  getTransactions(userId: string, limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: string, limit?: number): Promise<Transaction[]>;
  getAllTransactions(params: { page: number, limit: number, userId?: string, type?: string }): Promise<{ transactions: Transaction[], total: number }>;
  reverseTransaction(transactionId: string, adminId: string, reason: string): Promise<Transaction>;
  getUserTransactionCount(userId: string): Promise<number>;
  updateTransaction(transactionId: string, updates: any): Promise<Transaction | undefined>; // Added for admin feature

  // Admin operations
  getAllUsers(): Promise<User[]>;
  getUsers(options: {
    page: number;
    limit: number;
    search?: string;
    status?: 'active' | 'inactive';
    role?: 'user' | 'admin';
  }): Promise<{ users: User[], pagination: { page: number, limit: number, total: number, pages: number } }>;
  getTransactionsForAdmin(options: {
    page: number;
    limit: number;
    type?: string;
    status?: string;
    userId?: string;
  }): Promise<{ transactions: any[], pagination: { page: number, limit: number, total: number, pages: number } }>;
  updateTransactionStatus(transactionId: string, status: string, reason: string, adminId: string): Promise<boolean>;
  deleteUser(userId: string): Promise<boolean>;
  getPlatformSettings(): Promise<any>;
  updatePlatformSettings(settings: any, adminId: string): Promise<boolean>;
  createAuditLog(logData: {
    adminId: string;
    action: string;
    targetId: string;
    details: any;
    ipAddress: string;
    userAgent: string;
  }): Promise<boolean>;
  getAuditLogs(options: {
    page: number;
    limit: number;
    action?: string;
    userId?: string;
  }): Promise<{ logs: any[], pagination: { page: number, limit: number, total: number, pages: number } }>;
  getSystemAnalytics(period?: string): Promise<any>;
  createBalanceAdjustment(adjustment: InsertBalanceAdjustment): Promise<BalanceAdjustment>;
  getBalanceAdjustments(userId?: string, page?: number, limit?: number): Promise<BalanceAdjustment[]>;
  updatePortfolioBalance(userId: string, amount: number): Promise<void>;

  // Notification operations
  getNotifications(userId: string, limit?: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(notificationId: string): Promise<void>;
  deleteNotification(notificationId: string): Promise<void>;

  // Price alert operations
  getPriceAlerts(userId: string): Promise<PriceAlert[]>;
  createPriceAlert(alert: InsertPriceAlert): Promise<PriceAlert>;
  updatePriceAlert(id: string, updates: Partial<InsertPriceAlert>): Promise<PriceAlert | null>;
  deletePriceAlert(id: string): Promise<void>;
  getPriceAlertById(id: string): Promise<PriceAlert | null>;

  // News operations
  getNewsArticles(limit?: number, category?: string, search?: string): Promise<NewsArticle[]>;
  getNewsArticleById(id: string): Promise<NewsArticle | null>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  updateNewsArticle(id: string, updates: Partial<InsertNewsArticle>): Promise<NewsArticle | null>;
  deleteNewsArticle(id: string): Promise<void>;
  getNewsAnalytics(): Promise<any>;

  // Deposit operations
  createDeposit(deposit: any): Promise<any>;
  getUserDeposits(userId: string, limit?: number): Promise<any[]>;
  getAllDeposits(): Promise<any[]>;
  updateDepositStatus(id: string, status: string, rejectionReason?: string): Promise<any>;

  // Withdrawal operations
  createWithdrawal(withdrawalData: any): Promise<any>;
  getUserWithdrawals(userId: string): Promise<any[]>;
  getAllWithdrawals(): Promise<any[]>;
  getWithdrawalById(id: string): Promise<any>;
  updateWithdrawalStatus(id: string, status: string, adminNotes?: string): Promise<any>;
  confirmWithdrawal(userId: string, token: string): Promise<any>;
  getWithdrawalLimits(userId: string): Promise<any>;
  setWithdrawalLimits(userId: string, limits: { dailyLimit: number; monthlyLimit: number }): Promise<any>;
  calculateWithdrawalFees(amount: number, method: string): Promise<number>;
  getWithdrawalStats(): Promise<any>;
  cancelWithdrawal(userId: string, withdrawalId: string): Promise<boolean>;

  // Analytics operations
  getAnalyticsOverview(): Promise<any>;
  getRevenueAnalytics(period: string): Promise<any[]>;
  getUserAnalytics(period: string): Promise<any>;
  getActiveSessions(): Promise<any[]>;
  invalidateUserSessions(userId: string): Promise<void>;

  // System Configuration operations
  getSystemConfig(): Promise<any>;
  updateSystemConfig(config: any): Promise<any>;

  // Audit operations
  // logAdminAction(action: { adminId: string, action: string, targetUserId?: string, details?: any, timestamp: Date }): Promise<void>;
  // getAuditLogs(params: { page: number, limit: number, action?: string }): Promise<{ logs: any[], total: number }>;
  logAdminAction(action: { // Updated signature to match implementation
    adminId: string;
    action: string;
    targetId?: string;
    targetUserId?: string;
    details?: any;
    timestamp: Date;
  }): Promise<void>;


  // User Preferences operations
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: string, updates: Partial<InsertUserPreferences>): Promise<UserPreferences>;

  // Price Alert operations
  getActivePriceAlerts(): Promise<PriceAlert[]>;

  // Notification operations
  createNotification(data: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string, limit?: number): Promise<Notification[]>;
  markNotificationAsRead(notificationId: string): Promise<void>;
  getUnreadNotificationCount(userId: string): Promise<number>;

  // Investment Plans operations
  getUserInvestmentPlans(userId: string): Promise<any[]>;
  createInvestmentPlan(data: any): Promise<any>;
  updateInvestmentPlan(planId: string, userId: string, updates: any): Promise<any>;
  deleteInvestmentPlan(planId: string, userId: string): Promise<boolean>;
  executeInvestmentPlan(planId: string, userId: string): Promise<any>;
  getInvestmentPlanHistory(planId: string, userId: string): Promise<any[]>;

  // Savings Plans operations
  getUserSavingsPlans(userId: string): Promise<any[]>;
  createSavingsPlan(data: any): Promise<any>;
  updateSavingsPlan(planId: string, userId: string, updates: any): Promise<any>;
  deleteSavingsPlan(planId: string, userId: string): Promise<boolean>;
  addSavingsPlanContribution(planId: string, userId: string, amount: number, isScheduled: boolean): Promise<any>;
  getSavingsPlanPerformance(planId: string, userId: string): Promise<any>;

  // Staking operations
  getUserStakingPositions(userId: string): Promise<any[]>;
  createStakingPosition(data: any): Promise<any>;
  getStakingPosition(positionId: string, userId: string): Promise<any>;
  updateStakingPosition(positionId: string, updates: any): Promise<any>;
  getStakingRewards(userId: string): Promise<any[]>;
  getStakingAnalytics(userId: string): Promise<any>;

  // Lending operations
  getUserLendingPositions(userId: string): Promise<any[]>;
  createLendingPosition(data: any): Promise<any>;
  getLendingPosition(positionId: string, userId: string): Promise<any>;
  updateLendingPosition(positionId: string, updates: any): Promise<any>;
  getUserLoans(userId: string): Promise<any[]>;
  createLoan(data: any): Promise<any>;
  getLoan(loanId: string, userId: string): Promise<any>;
  updateLoan(loanId: string, updates: any): Promise<any>;

  // Trading System Enhancements
  validateOrder(orderData: any): Promise<{ isValid: boolean; message?: string }>;
  calculateTradingFees(amount: number, type: string, orderType: string): Promise<number>;
  executeTrade(tradeData: any): Promise<any>;
  getOpenOrders(userId: string): Promise<any[]>;
  getOrderHistory(userId: string): Promise<any[]>;

  // KYC operations are implemented in the class
}

export class DatabaseStorage implements IStorage {
  // Assuming db is initialized and accessible here, or passed in constructor
  private db = db; // Make db accessible within the class

  private ensureDb() {
    if (!this.db) {
      throw new Error('Database not initialized. Please set DATABASE_URL and restart the application.');
    }
    return this.db;
  }

  isDbConnected(): boolean {
    try {
      return this.db ? true : false;
    } catch (error) {
      return false;
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const db = this.ensureDb();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = this.ensureDb();
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByEmailOrUsername(emailOrUsername: string, username?: string): Promise<User | undefined> {
    const db = this.ensureDb();
    // If we have both parameters (legacy call), use both
    if (username) {
      const [user] = await db
        .select()
        .from(users)
        .where(or(eq(users.email, emailOrUsername), eq(users.username, username)));
      return user;
    }
    // If we have only one parameter, check if it's email or username
    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, emailOrUsername), eq(users.username, emailOrUsername)));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const db = this.ensureDb();
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const db = this.ensureDb();
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getPortfolio(userId: string): Promise<Portfolio | undefined> {
    const db = this.ensureDb();
    const [portfolio] = await db.select().from(portfolios).where(eq(portfolios.userId, userId));
    return portfolio;
  }

  async createPortfolio(portfolioData: InsertPortfolio): Promise<Portfolio> {
    const db = this.ensureDb();
    const [portfolio] = await db.insert(portfolios).values(portfolioData).returning();
    return portfolio;
  }

  async updatePortfolio(portfolioId: string, updates: Partial<InsertPortfolio>): Promise<Portfolio> {
    const db = this.ensureDb();
    const [portfolio] = await db
      .update(portfolios)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(portfolios.id, portfolioId))
      .returning();
    return portfolio;
  }

  async getHoldings(portfolioId: string): Promise<Holding[]> {
    try {
      const db = this.ensureDb();
      return await db.select().from(holdings).where(eq(holdings.portfolioId, portfolioId));
    } catch (error) {
      console.error("Error fetching holdings:", error);
      return [];
    }
  }

  async getHolding(portfolioId: string, symbol: string): Promise<Holding | undefined> {
    const db = this.ensureDb();
    const [holding] = await db
      .select()
      .from(holdings)
      .where(and(eq(holdings.portfolioId, portfolioId), eq(holdings.symbol, symbol)));
    return holding;
  }

  async upsertHolding(holdingData: InsertHolding): Promise<Holding> {
    const existing = await this.getHolding(holdingData.portfolioId, holdingData.symbol);

    if (existing) {
      const db = this.ensureDb();
      const [holding] = await db
        .update(holdings)
        .set({ ...holdingData, updatedAt: new Date() })
        .where(eq(holdings.id, existing.id))
        .returning();
      return holding;
    } else {
      const db = this.ensureDb();
      const [holding] = await db.insert(holdings).values({
        ...holdingData,
        assetType: holdingData.assetType || 'crypto' // Default to crypto for backward compatibility
      }).returning();
      return holding;
    }
  }

  async createHolding(holdingData: InsertHolding): Promise<Holding> {
    const db = this.ensureDb();
    const [holding] = await db.insert(holdings).values(holdingData).returning();
    return holding;
  }

  async updateHolding(holdingId: string, updates: Partial<InsertHolding>): Promise<void> {
    const db = this.ensureDb();
    await db
      .update(holdings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(holdings.id, holdingId));
  }

  async deleteHolding(id: string): Promise<void>;
  async deleteHolding(portfolioId: string, symbol: string): Promise<void>;
  async deleteHolding(idOrPortfolioId: string, symbol?: string): Promise<void> {
    const db = this.ensureDb();
    if (symbol) {
      // Delete by portfolioId and symbol
      await db.delete(holdings).where(and(
        eq(holdings.portfolioId, idOrPortfolioId),
        eq(holdings.symbol, symbol)
      ));
    } else {
      // Delete by id
      await db.delete(holdings).where(eq(holdings.id, idOrPortfolioId));
    }
  }

  async updatePortfolioBalance(userId: string, amount: number): Promise<void> {
    const db = this.ensureDb();
    const [portfolio] = await db.select().from(portfolios).where(eq(portfolios.userId, userId));
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    const currentBalance = parseFloat(portfolio.availableCash);
    const newBalance = currentBalance + amount;

    await db
      .update(portfolios)
      .set({
        availableCash: newBalance.toString(),
        updatedAt: new Date()
      })
      .where(eq(portfolios.id, portfolio.id));
  }

  async getTransactions(userId: string, limit = 50): Promise<Transaction[]> {
    const db = this.ensureDb();
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  // Updated createTransaction method with new fields for enhanced trading
  async createTransaction(data: InsertTransaction): Promise<Transaction> {
    const db = this.ensureDb();
    const [transaction] = await db.insert(transactions).values({
      ...data,
      fee: data.fee || '0',
      orderType: data.orderType || 'market',
      stopLoss: data.stopLoss !== undefined ? data.stopLoss : null,
      takeProfit: data.takeProfit !== undefined ? data.takeProfit : null,
      slippage: data.slippage || '0.5'
    }).returning();
    return transaction;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const db = this.ensureDb();
      await db.update(users).set(updates).where(eq(users.id, userId));
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const db = this.ensureDb();
      // Delete user and cascade will handle related records
      await db.delete(users).where(eq(users.id, userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  async getUserTransactions(userId: string, limit: number = 50): Promise<Transaction[]> {
    try {
      const db = this.ensureDb();
      return await db.select()
        .from(transactions)
        .where(eq(transactions.userId, userId))
        .orderBy(desc(transactions.createdAt))
        .limit(limit);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      return [];
    }
  }

  async getUserTransactionCount(userId: string): Promise<number> {
    try {
      const db = this.ensureDb();
      const [{ count }] = await db
        .select({ count: sql`count(*)` })
        .from(transactions)
        .where(eq(transactions.userId, userId));
      return Number(count);
    } catch (error) {
      console.error("Error counting user transactions:", error);
      return 0;
    }
  }

  async getAllTransactions(params: { page: number, limit: number, userId?: string, type?: string }): Promise<{ transactions: Transaction[], total: number }> {
    try {
      const { page, limit, userId, type } = params;
      const offset = (page - 1) * limit;

      const db = this.ensureDb();
      let query = db.select({
        id: transactions.id,
        userId: transactions.userId,
        type: transactions.type,
        symbol: transactions.symbol,
        amount: transactions.amount,
        price: transactions.price,
        total: transactions.total,
        status: transactions.status,
        createdAt: transactions.createdAt,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName
      }).from(transactions).leftJoin(users, eq(transactions.userId, users.id));

      let countQuery = db.select({ count: sql`count(*)` }).from(transactions);

      const conditions = [];
      if (userId) conditions.push(eq(transactions.userId, userId));
      if (type) conditions.push(eq(transactions.type, type));

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
        countQuery = countQuery.where(and(...conditions));
      }

      const transactionList = await query
        .orderBy(desc(transactions.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await countQuery;

      return { transactions: transactionList, total: Number(count) };
    } catch (error) {
      console.error("Error fetching all transactions:", error);
      return { transactions: [], total: 0 };
    }
  }

  async reverseTransaction(transactionId: string, adminId: string, reason: string): Promise<Transaction> {
    try {
      const db = this.ensureDb();
      const [original] = await db.select().from(transactions).where(eq(transactions.id, transactionId)).limit(1);
      if (!original.length) throw new Error('Transaction not found');

      const reversedTransaction = await db.insert(transactions).values({
        userId: original[0].userId,
        type: original[0].type === 'buy' ? 'sell' : 'buy',
        symbol: original[0].symbol,
        amount: original[0].amount,
        price: original[0].price,
        total: original[0].total,
        status: 'completed'
      }).returning();

      // Log the reversal
      await this.logAdminAction({
        adminId,
        action: 'reverse_transaction',
        details: { originalTransactionId: transactionId, reason },
        timestamp: new Date()
      });

      return reversedTransaction[0];
    } catch (error) {
      console.error("Error reversing transaction:", error);
      throw error;
    }
  }

  // Get all users (admin only)
  async getAllUsers() {
    try {
      const result = await this.db.select().from(users).orderBy(desc(users.createdAt));
      return result.map(user => ({ ...user, password: undefined }));
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }

  // Enhanced user fetching with filters
  async getUsers(options: {
    page: number;
    limit: number;
    search?: string;
    status?: 'active' | 'inactive';
    role?: 'user' | 'admin';
  }) {
    try {
      let query = this.db.select().from(users);

      // Apply filters
      if (options.search) {
        query = query.where(
          or(
            like(users.username, `%${options.search}%`),
            like(users.email, `%${options.search}%`),
            like(users.firstName, `%${options.search}%`),
            like(users.lastName, `%${options.search}%`)
          )
        );
      }

      if (options.status) {
        query = query.where(eq(users.isActive, options.status === 'active'));
      }

      if (options.role) {
        query = query.where(eq(users.role, options.role));
      }

      const offset = (options.page - 1) * options.limit;
      const result = await query
        .limit(options.limit)
        .offset(offset)
        .orderBy(desc(users.createdAt));

      // Get total count for pagination
      let countQuery = this.db.select({ count: count() }).from(users);
      if (options.search) {
        countQuery = countQuery.where(
          or(
            like(users.username, `%${options.search}%`),
            like(users.email, `%${options.search}%`),
            like(users.firstName, `%${options.search}%`),
            like(users.lastName, `%${options.search}%`)
          )
        );
      }
      if (options.status) {
        countQuery = countQuery.where(eq(users.isActive, options.status === 'active'));
      }
      if (options.role) {
        countQuery = countQuery.where(eq(users.role, options.role));
      }

      const totalResult = await countQuery;
      const total = totalResult[0]?.count || 0;

      return {
        users: result.map(user => ({ ...user, password: undefined })),
        pagination: {
          page: options.page,
          limit: options.limit,
          total,
          pages: Math.ceil(total / options.limit)
        }
      };
    } catch (error) {
      console.error("Error getting users with filters:", error);
      throw error;
    }
  }

  async createBalanceAdjustment(adjustment: InsertBalanceAdjustment): Promise<BalanceAdjustment> {
    try {
      const db = this.ensureDb();
      const [adjustment] = await db.insert(balanceAdjustments).values(adjustment).returning();
      return adjustment;
    } catch (error) {
      console.error("Error creating balance adjustment:", error);
      throw new Error("Failed to create balance adjustment");
    }
  }

  async getBalanceAdjustments(userId?: string, page: number = 1, limit: number = 50): Promise<BalanceAdjustment[]> {
    try {
      const offset = (page - 1) * limit;
      const db = this.ensureDb();
      let query = db.select().from(balanceAdjustments);

      if (userId) {
        query = query.where(eq(balanceAdjustments.targetUserId, userId));
      }

      const adjustments = await query
        .orderBy(desc(balanceAdjustments.createdAt))
        .limit(limit)
        .offset(offset);

      return adjustments;
    } catch (error) {
      console.error("Error fetching balance adjustments:", error);
      return [];
    }
  }

  // Get news articles with filtering
  async getNewsArticles(limit: number = 10, category?: string, search?: string): Promise<NewsArticle[]> {
    try {
      const db = this.ensureDb();
      let query = db
        .select()
        .from(newsArticles);

      if (category) {
        query = query.where(eq(newsArticles.source, category));
      }

      if (search) {
        query = query.where(
          or(
            ilike(newsArticles.title, `%${search}%`),
            ilike(newsArticles.content, `%${search}%`)
          )
        );
      }

      const articles = await query
        .orderBy(desc(newsArticles.publishedAt))
        .limit(limit);

      return articles;
    } catch (error) {
      console.error('Error fetching news articles:', error);
      // Return empty array if table doesn't exist
      if (error?.code === '42P01') {
        return [];
      }
      throw error;
    }
  }

  // Get single news article by ID
  async getNewsArticleById(id: string): Promise<NewsArticle | null> {
    try {
      const db = this.ensureDb();
      const article = await db
        .select()
        .from(newsArticles)
        .where(eq(newsArticles.id, id))
        .limit(1);

      return article[0] || null;
    } catch (error) {
      console.error('Error fetching news article:', error);
      throw error;
    }
  }

  async createNewsArticle(articleData: InsertNewsArticle): Promise<NewsArticle> {
    const db = this.ensureDb();
    const [article] = await db.insert(newsArticles).values(articleData).returning();
    return article;
  }

  // Update news article
  async updateNewsArticle(id: string, updates: Partial<InsertNewsArticle>): Promise<NewsArticle | null> {
    try {
      const db = this.ensureDb();
      const updated = await db
        .update(newsArticles)
        .set(updates)
        .where(eq(newsArticles.id, id))
        .returning();

      return updated[0] || null;
    } catch (error) {
      console.error('Error updating news article:', error);
      throw error;
    }
  }

  async deleteNewsArticle(id: string): Promise<void> {
    const db = this.ensureDb();
    await db.delete(newsArticles).where(eq(newsArticles.id, id));
  }

  // Get news analytics
  async getNewsAnalytics() {
    try {
      const db = this.ensureDb();
      const totalArticles = await db
        .select({ count: count() })
        .from(newsArticles);

      const articlesBySource = await db
        .select({
          source: newsArticles.source,
          count: count()
        })
        .from(newsArticles)
        .groupBy(newsArticles.source);

      const recentArticles = await db
        .select({ count: count() })
        .from(newsArticles)
        .where(gte(newsArticles.publishedAt, sql`NOW() - INTERVAL '7 days'`));

      return {
        totalArticles: totalArticles[0]?.count || 0,
        articlesBySource,
        recentArticles: recentArticles[0]?.count || 0
      };
    } catch (error) {
      console.error('Error fetching news analytics:', error);
      throw error;
    }
  }

  // Price Alerts methods
  async createPriceAlert(alertData: InsertPriceAlert): Promise<PriceAlert> {
    try {
      const db = this.ensureDb();
      const [alert] = await db.insert(priceAlerts).values(alertData).returning();
      return alert;
    } catch (error) {
      console.error("Error creating price alert:", error);
      throw error;
    }
  }

  async getUserPriceAlerts(userId: string): Promise<PriceAlert[]> {
    try {
      const db = this.ensureDb();
      const alerts = await db.select()
        .from(priceAlerts)
        .where(eq(priceAlerts.userId, userId))
        .orderBy(desc(priceAlerts.createdAt));
      return alerts;
    } catch (error) {
      console.error("Error getting price alerts:", error);
      throw error;
    }
  }

  async getPriceAlert(userId: string, symbol: string): Promise<PriceAlert | undefined> {
    try {
      const db = this.ensureDb();
      const [alert] = await db.select()
        .from(priceAlerts)
        .where(and(eq(priceAlerts.userId, userId), eq(priceAlerts.symbol, symbol)));
      return alert;
    } catch (error) {
      console.error("Error getting price alert:", error);
      throw error;
    }
  }

  async getPriceAlertById(alertId: string): Promise<PriceAlert | undefined> {
    try {
      const db = this.ensureDb();
      const [alert] = await db.select()
        .from(priceAlerts)
        .where(eq(priceAlerts.id, alertId));
      return alert;
    } catch (error) {
      console.error("Error getting price alert:", error);
      throw error;
    }
  }

  async updatePriceAlert(alertId: string, updates: Partial<InsertPriceAlert>): Promise<PriceAlert> {
    try {
      const db = this.ensureDb();
      const [alert] = await db.update(priceAlerts)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(priceAlerts.id, alertId))
        .returning();
      return alert;
    } catch (error) {
      console.error("Error updating price alert:", error);
      throw error;
    }
  }

  async deletePriceAlert(alertId: string): Promise<void> {
    try {
      const db = this.ensureDb();
      await db.delete(priceAlerts)
        .where(eq(priceAlerts.id, alertId));
    } catch (error) {
      console.error("Error deleting price alert:", error);
      throw error;
    }
  }

  async getActivePriceAlerts(): Promise<any[]> {
    try {
      const alerts = await this.db.select({
        id: priceAlerts.id,
        userId: priceAlerts.userId,
        symbol: priceAlerts.symbol,
        name: priceAlerts.name,
        targetPrice: priceAlerts.targetPrice,
        condition: priceAlerts.condition,
        isActive: priceAlerts.isActive,
        isTriggered: priceAlerts.isTriggered,
        createdAt: priceAlerts.createdAt,
        updatedAt: priceAlerts.updatedAt
      }).from(priceAlerts)
        .where(and(
          eq(priceAlerts.isActive, true),
          eq(priceAlerts.isTriggered, false)
        ));
      return alerts;
    } catch (error) {
      console.error('Error getting active price alerts:', error);
      return [];
    }
  }

  // Get price alerts for user
  async getPriceAlerts(userId: string): Promise<PriceAlert[]> {
    try {
      const db = this.ensureDb();
      const result = await db
        .select()
        .from(priceAlerts)
        .where(eq(priceAlerts.userId, userId))
        .orderBy(desc(priceAlerts.createdAt));

      return result;
    } catch (error) {
      console.error('Error fetching price alerts:', error);
      // Return empty array if table doesn't exist
      if (error?.code === '42P01') {
        return [];
      }
      return [];
    }
  }

  // Get user price alerts (alias for WebSocket compatibility)
  async getUserPriceAlerts(userId: string): Promise<PriceAlert[]> {
    return this.getPriceAlerts(userId);
  }

  // Notification methods
  async createNotification(data: InsertNotification): Promise<Notification> {
    try {
      const db = this.ensureDb();
      const [notification] = await db.insert(notifications).values(data).returning();
      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  async getUserNotifications(userId: string, limit = 20): Promise<Notification[]> {
    try {
      const db = this.ensureDb();
      const userNotifications = await db.select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(limit);
      return userNotifications;
    } catch (error) {
      console.error("Error getting notifications:", error);
      // Return empty array if table doesn't exist
      if (error?.code === '42P01') {
        return [];
      }
      return [];
    }
  }

  async getNotifications(userId: string, limit = 20): Promise<Notification[]> {
    return this.getUserNotifications(userId, limit);
  }

  async getNotification(notificationId: string): Promise<Notification | undefined> {
    try {
      const db = this.ensureDb();
      const [notification] = await db.select()
        .from(notifications)
        .where(eq(notifications.id, notificationId));
      return notification;
    } catch (error) {
      console.error("Error getting notification:", error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const db = this.ensureDb();
      await db.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, notificationId));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    try {
      const db = this.ensureDb();
      const [result] = await db.select({ count: sql`count(*)` })
        .from(notifications)
        .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
      return parseInt(result.count as string) || 0;
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
      return 0;
    }
  }

  // Investment Plans operations
  async getUserInvestmentPlans(userId: string): Promise<any[]> {
    try {
      // Mock implementation - in real app, query investment_plans table
      return [
        {
          id: '1',
          name: 'Bitcoin Dollar-Cost Averaging',
          assetSymbol: 'BTC',
          assetName: 'Bitcoin',
          amount: 50,
          frequency: 'weekly',
          totalInvested: 2400,
          currentValue: 2856,
          nextExecution: '2025-01-22',
          status: 'active'
        }
      ];
    } catch (error) {
      console.error("Error fetching investment plans:", error);
      return [];
    }
  }

  async createInvestmentPlan(data: any): Promise<any> {
    try {
      // Mock implementation
      return {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date(),
        status: 'active'
      };
    } catch (error) {
      console.error("Error creating investment plan:", error);
      throw error;
    }
  }

  async updateInvestmentPlan(planId: string, userId: string, updates: any): Promise<any> {
    try {
      // Mock implementation
      return { id: planId, ...updates, updatedAt: new Date() };
    } catch (error) {
      console.error("Error updating investment plan:", error);
      throw error;
    }
  }

  async deleteInvestmentPlan(planId: string, userId: string): Promise<boolean> {
    try {
      // Mock implementation
      return true;
    } catch (error) {
      console.error("Error deleting investment plan:", error);
      return false;
    }
  }

  async executeInvestmentPlan(planId: string, userId: string): Promise<any> {
    try {
      // Mock implementation
      return {
        executionId: Date.now().toString(),
        planId,
        amount: 50,
        price: 45000,
        executedAt: new Date()
      };
    } catch (error) {
      console.error("Error executing investment plan:", error);
      return null;
    }
  }

  async getInvestmentPlanHistory(planId: string, userId: string): Promise<any[]> {
    try {
      // Mock implementation
      return [
        {
          id: '1',
          planId,
          amount: 50,
          price: 45000,
          executedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      ];
    } catch (error) {
      console.error("Error fetching investment plan history:", error);
      return [];
    }
  }

  // Savings Plans operations
  async getUserSavingsPlans(userId: string): Promise<any[]> {
    try {
      // Mock implementation
      return [
        {
          id: '1',
          name: 'Retirement Fund',
          goal: 'retirement',
          targetAmount: 100000,
          currentAmount: 15000,
          monthlyContribution: 500,
          timeHorizon: 20,
          riskTolerance: 'moderate',
          expectedReturn: '5-8%',
          projectedValue: '125000'
        }
      ];
    } catch (error) {
      console.error("Error fetching savings plans:", error);
      return [];
    }
  }

  async createSavingsPlan(data: any): Promise<any> {
    try {
      return {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date(),
        isActive: true
      };
    } catch (error) {
      console.error("Error creating savings plan:", error);
      throw error;
    }
  }

  async updateSavingsPlan(planId: string, userId: string, updates: any): Promise<any> {
    try {
      return { id: planId, ...updates, updatedAt: new Date() };
    } catch (error) {
      console.error("Error updating savings plan:", error);
      throw error;
    }
  }

  async deleteSavingsPlan(planId: string, userId: string): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      console.error("Error deleting savings plan:", error);
      return false;
    }
  }

  async addSavingsPlanContribution(planId: string, userId: string, amount: number, isScheduled: boolean): Promise<any> {
    try {
      return {
        id: Date.now().toString(),
        planId,
        amount,
        isScheduled,
        contributionDate: new Date()
      };
    } catch (error) {
      console.error("Error adding savings plan contribution:", error);
      return null;
    }
  }

  async getSavingsPlanPerformance(planId: string, userId: string): Promise<any> {
    try {
      return {
        planId,
        totalContributions: 5000,
        currentValue: 5250,
        totalReturn: 250,
        returnPercentage: 5.0,
        monthlyGrowth: [
          { month: 'Jan', value: 1000 },
          { month: 'Feb', value: 2050 },
          { month: 'Mar', value: 3100 },
          { month: 'Apr', value: 4200 },
          { month: 'May', value: 5250 }
        ]
      };
    } catch (error) {
      console.error("Error fetching savings plan performance:", error);
      return null;
    }
  }

  // Staking operations
  async getUserStakingPositions(userId: string): Promise<any[]> {
    try {
      return [
        {
          id: '1',
          assetSymbol: 'ETH',
          amount: '10',
          apy: '5.2%',
          stakingTerm: '90d',
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          status: 'active',
          estimatedRewards: '0.42'
        }
      ];
    } catch (error) {
      console.error("Error fetching staking positions:", error);
      return [];
    }
  }

  async createStakingPosition(data: any): Promise<any> {
    try {
      return {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date()
      };
    } catch (error) {
      console.error("Error creating staking position:", error);
      throw error;
    }
  }

  async getStakingPosition(positionId: string, userId: string): Promise<any> {
    try {
      return {
        id: positionId,
        userId,
        assetSymbol: 'ETH',
        amount: '10',
        apy: '5.2%',
        stakingTerm: '90d',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        status: 'active'
      };
    } catch (error) {
      console.error("Error fetching staking position:", error);
      return null;
    }
  }

  async updateStakingPosition(positionId: string, updates: any): Promise<any> {
    try {
      return { id: positionId, ...updates, updatedAt: new Date() };
    } catch (error) {
      console.error("Error updating staking position:", error);
      throw error;
    }
  }

  async getStakingRewards(userId: string): Promise<any[]> {
    try {
      return [
        {
          id: '1',
          positionId: '1',
          amount: '0.042',
          assetSymbol: 'ETH',
          rewardDate: new Date(),
          type: 'staking_reward'
        }
      ];
    } catch (error) {
      console.error("Error fetching staking rewards:", error);
      return [];
    }
  }

  async getStakingAnalytics(userId: string): Promise<any> {
    try {
      return {
        totalStaked: '50.5',
        totalRewards: '2.34',
        activePositions: 3,
        averageAPY: '6.8%',
        totalValue: '52.84'
      };
    } catch (error) {
      console.error("Error fetching staking analytics:", error);
      return {};
    }
  }

  // Withdrawal operations
  async getUserWithdrawals(userId: string): Promise<any[]> {
    try {
      // Mock implementation - in real app, query withdrawals table
      return [
        {
          id: '1',
          userId,
          amount: '1000.00',
          currency: 'USD',
          withdrawalMethod: 'bank_transfer',
          destinationAddress: 'Bank Account ****1234',
          status: 'pending',
          requestedAt: new Date(),
          fees: '25.00',
          netAmount: '975.00'
        }
      ];
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      return [];
    }
  }

  async getWithdrawalLimits(userId: string): Promise<any> {
    try {
      // Mock implementation - in real app, query withdrawal_limits table
      return {
        dailyLimit: '10000.00',
        monthlyLimit: '50000.00',
        dailyUsed: '0.00',
        monthlyUsed: '0.00'
      };
    } catch (error) {
      console.error("Error fetching withdrawal limits:", error);
      return {
        dailyLimit: '10000.00',
        monthlyLimit: '50000.00',
        dailyUsed: '0.00',
        monthlyUsed: '0.00'
      };
    }
  }

  async calculateWithdrawalFees(amount: number, method: string): Promise<number> {
    try {
      // Calculate fees based on method and amount
      const feeRates = {
        bank_transfer: 0.025, // 2.5%
        crypto_wallet: 0.01, // 1%
        paypal: 0.035, // 3.5%
        other: 0.02 // 2%
      };

      const rate = feeRates[method as keyof typeof feeRates] || 0.02;
      const fee = amount * rate;
      const minFee = 5; // Minimum $5 fee
      const maxFee = 100; // Maximum $100 fee

      return Math.max(minFee, Math.min(fee, maxFee));
    } catch (error) {
      console.error("Error calculating withdrawal fees:", error);
      return 25; // Default fee
    }
  }

  async createWithdrawal(data: any): Promise<any> {
    try {
      // Mock implementation - in real app, insert into withdrawals table
      return {
        id: Date.now().toString(),
        ...data,
        status: 'pending',
        requestedAt: new Date(),
        isConfirmed: false
      };
    } catch (error) {
      console.error("Error creating withdrawal:", error);
      throw error;
    }
  }

  async confirmWithdrawal(userId: string, token: string): Promise<any> {
    try {
      // Mock implementation - in real app, verify token and update withdrawal
      return {
        id: '1',
        userId,
        status: 'under_review',
        isConfirmed: true,
        confirmedAt: new Date()
      };
    } catch (error) {
      console.error("Error confirming withdrawal:", error);
      return null;
    }
  }

  async cancelWithdrawal(userId: string, withdrawalId: string): Promise<boolean> {
    try {
      // Mock implementation - in real app, update withdrawal status to cancelled
      return true;
    } catch (error) {
      console.error("Error cancelling withdrawal:", error);
      return false;
    }
  }

  // Lending operations
  async getUserLendingPositions(userId: string): Promise<any[]> {
    try {
      return [
        {
          id: '1',
          assetSymbol: 'USDC',
          amount: '1000',
          apy: '12.5%',
          startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          status: 'active',
          type: 'lend',
          estimatedEarnings: '5.12'
        }
      ];
    } catch (error) {
      console.error("Error fetching lending positions:", error);
      return [];
    }
  }

  // Chat session operations
  async getActiveChatSession(userId: string): Promise<any> {
    try {
      const db = this.ensureDb();
      const [session] = await db
        .select()
        .from(liveChatSessions)
        .where(and(
          eq(liveChatSessions.userId, userId),
          or(
            eq(liveChatSessions.status, 'waiting'),
            eq(liveChatSessions.status, 'active')
          )
        ))
        .limit(1);

      return session;
    } catch (error) {
      console.error("Error fetching active chat session:", error);
      return null;
    }
  }

  async createChatSession(data: any): Promise<any> {
    try {
      const db = this.ensureDb();
      const [session] = await db
        .insert(liveChatSessions)
        .values({
          userId: data.userId,
          subject: data.subject,
          status: data.status,
          startedAt: new Date()
        })
        .returning();

      return session;
    } catch (error) {
      console.error("Error creating chat session:", error);
      throw error;
    }
  }

  async getChatSession(sessionId: string): Promise<any> {
    try {
      const db = this.ensureDb();
      const [session] = await db
        .select()
        .from(liveChatSessions)
        .where(eq(liveChatSessions.id, sessionId))
        .limit(1);

      return session;
    } catch (error) {
      console.error("Error fetching chat session:", error);
      return null;
    }
  }

  async getChatMessages(sessionId: string): Promise<any[]> {
    try {
      const db = this.ensureDb();
      const messages = await db
        .select()
        .from(liveChatMessages)
        .where(eq(liveChatMessages.sessionId, sessionId))
        .orderBy(liveChatMessages.createdAt);

      return messages;
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      return [];
    }
  }

  async createChatMessage(data: any): Promise<any> {
    try {
      const db = this.ensureDb();
      const [message] = await db
        .insert(liveChatMessages)
        .values({
          sessionId: data.sessionId,
          senderId: data.senderId,
          message: data.message,
          messageType: data.messageType || 'text',
          attachmentUrl: data.attachmentUrl
        })
        .returning();

      return {
        ...message,
        senderName: data.senderName,
        senderRole: data.senderRole,
        attachmentName: data.attachmentName,
        attachmentSize: data.attachmentSize
      };
    } catch (error) {
      console.error("Error creating chat message:", error);
      throw error;
    }
  }

  async updateChatSessionStatus(sessionId: string, status: string, agentId?: string): Promise<any> {
    try {
      const db = this.ensureDb();
      const updateData: any = { status };

      if (agentId && status === 'active') {
        updateData.agentId = agentId;

        // Get agent name
        const agent = await this.getUser(agentId);
        if (agent) {
          updateData.agentName = `${agent.firstName} ${agent.lastName}`;
        }
      }

      if (status === 'ended') {
        updateData.endedAt = new Date();
      }

      const [session] = await db
        .update(liveChatSessions)
        .set(updateData)
        .where(eq(liveChatSessions.id, sessionId))
        .returning();

      return session;
    } catch (error) {
      console.error("Error updating chat session status:", error);
      throw error;
    }
  }

  async endChatSession(sessionId: string): Promise<void> {
    try {
      await this.updateChatSessionStatus(sessionId, 'ended');
    } catch (error) {
      console.error("Error ending chat session:", error);
      throw error;
    }
  }

  async rateChatSession(sessionId: string, rating: number, feedback?: string): Promise<void> {
    try {
      const db = this.ensureDb();
      await db
        .update(liveChatSessions)
        .set({ rating, feedback })
        .where(eq(liveChatSessions.id, sessionId));
    } catch (error) {
      console.error("Error rating chat session:", error);
      throw error;
    }
  }

  async getChatSessions(options: {
    status?: string;
    page: number;
    limit: number;
  }): Promise<any> {
    try {
      const db = this.ensureDb();
      let query = db
        .select({
          session: liveChatSessions,
          user: {
            id: users.id,
            username: users.username,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName
          }
        })
        .from(liveChatSessions)
        .leftJoin(users, eq(liveChatSessions.userId, users.id));

      if (options.status) {
        query = query.where(eq(liveChatSessions.status, options.status));
      }

      const offset = (options.page - 1) * options.limit;
      const sessions = await query
        .orderBy(desc(liveChatSessions.startedAt))
        .limit(options.limit)
        .offset(offset);

      // Get total count
      let countQuery = db.select({ count: count() }).from(liveChatSessions);
      if (options.status) {
        countQuery = countQuery.where(eq(liveChatSessions.status, options.status));
      }

      const totalResult = await countQuery;
      const total = totalResult[0]?.count || 0;

      return {
        sessions: sessions.map(row => ({
          ...row.session,
          user: row.user
        })),
        pagination: {
          page: options.page,
          limit: options.limit,
          total,
          pages: Math.ceil(total / options.limit)
        }
      };
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      return { sessions: [], pagination: { page: 1, limit: options.limit, total: 0, pages: 0 } };
    }
  }

  async assignChatSession(sessionId: string, agentId: string, agentName: string): Promise<void> {
    try {
      await this.updateChatSessionStatus(sessionId, 'active', agentId);
    } catch (error) {
      console.error("Error assigning chat session:", error);
      throw error;
    }
  }

  async notifyAdminsNewChatSession(session: any): Promise<void> {
    try {
      // Get all admin users
      const db = this.ensureDb();
      const admins = await db
        .select()
        .from(users)
        .where(eq(users.role, 'admin'));

      // Create notifications for all admins
      for (const admin of admins) {
        await this.createNotification({
          userId: admin.id,
          type: 'new_chat_session',
          title: 'New Chat Session',
          message: `New support chat session started: ${session.subject}`,
          data: JSON.stringify({ sessionId: session.id, subject: session.subject })
        });
      }
    } catch (error) {
      console.error("Error notifying admins of new chat session:", error);
    }
  }

  async createLendingPosition(data: any): Promise<any> {
    try {
      return {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date()
      };
    } catch (error) {
      console.error("Error creating lending position:", error);
      throw error;
    }
  }

  async getLendingPosition(positionId: string, userId: string): Promise<any> {
    try {
      return {
        id: positionId,
        userId,
        assetSymbol: 'USDC',
        amount: '1000',
        apy: '12.5%',
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        status: 'active'
      };
    } catch (error) {
      console.error("Error fetching lending position:", error);
      return null;
    }
  }

  async updateLendingPosition(positionId: string, updates: any): Promise<any> {
    try {
      return { id: positionId, ...updates, updatedAt: new Date() };
    } catch (error) {
      console.error("Error updating lending position:", error);
      throw error;
    }
  }

  async getUserLoans(userId: string): Promise<any[]> {
    try {
      return [
        {
          id: '1',
          assetSymbol: 'USDC',
          amount: '500',
          collateralSymbol: 'BTC',
          collateralAmount: '0.02',
          interestRate: '8.5',
          loanTerm: '30d',
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          status: 'active'
        }
      ];
    } catch (error) {
      console.error("Error fetching user loans:", error);
      return [];
    }
  }

  async createLoan(data: any): Promise<any> {
    try {
      return {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date()
      };
    } catch (error) {
      console.error("Error creating loan:", error);
      throw error;
    }
  }

  async getLoan(loanId: string, userId: string): Promise<any> {
    try {
      return {
        id: loanId,
        userId,
        assetSymbol: 'USDC',
        amount: '500',
        collateralSymbol: 'BTC',
        collateralAmount: '0.02',
        interestRate: '8.5',
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        status: 'active'
      };
    } catch (error) {
      console.error("Error fetching loan:", error);
      return null;
    }
  }

  async updateLoan(loanId: string, updates: any): Promise<any> {
    try {
      return { id: loanId, ...updates, updatedAt: new Date() };
    } catch (error) {
      console.error("Error updating loan:", error);
      throw error;
    }
  }

  // Deposit methods
  async createDeposit(deposit: any) {
    const db = this.ensureDb();
    const [result] = await db.insert(deposits).values(deposit).returning();
    return result;
  }

  async getUserDeposits(userId: string, limit: number = 5): Promise<any[]> {
    try {
      const db = this.ensureDb();
      return await db.select()
        .from(deposits)
        .where(eq(deposits.userId, userId))
        .orderBy(desc(sql`${deposits.createdAt}`))
        .limit(limit);
    } catch (error) {
      console.error("Error fetching user deposits:", error);
      return [];
    }
  }

  async getAllDeposits() {
    const db = this.ensureDb();
    return await db.select({
      deposit: deposits,
      user: {
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
      }
    })
    .from(deposits)
    .leftJoin(users, eq(deposits.userId, users.id))
    .orderBy(desc(deposits.createdAt));
  }

  async updateDepositStatus(id: string, status: string, rejectionReason?: string) {
    const db = this.ensureDb();
    const [result] = await db
      .update(deposits)
      .set({
        status,
        rejectionReason,
        updatedAt: new Date().toISOString()
      })
      .where(eq(deposits.id, id))
      .returning();
    return result;
  }

  // Withdrawal methods
  async createWithdrawal(withdrawalData: any): Promise<any> {
    try {
      const db = this.ensureDb();
      const [result] = await db.insert(withdrawals).values({
        userId: withdrawalData.userId,
        amount: withdrawalData.amount,
        currency: withdrawalData.currency,
        withdrawalMethod: withdrawalData.withdrawalMethod,
        destinationAddress: withdrawalData.destinationAddress,
        destinationDetails: withdrawalData.destinationDetails,
        status: withdrawalData.status || 'pending',
        fees: withdrawalData.fees || '0',
        netAmount: withdrawalData.netAmount,
        confirmationToken: withdrawalData.confirmationToken,
        confirmationExpiresAt: withdrawalData.confirmationExpiresAt ? new Date(withdrawalData.confirmationExpiresAt) : null,
        requestedAt: new Date(),
        isConfirmed: false
      }).returning();
      return result;
    } catch (error) {
      console.error("Error creating withdrawal:", error);
      throw error;
    }
  }

  async getUserWithdrawals(userId: string): Promise<any[]> {
    try {
      const db = this.ensureDb();
      return await db
        .select()
        .from(withdrawals)
        .where(eq(withdrawals.userId, userId))
        .orderBy(desc(withdrawals.createdAt));
    } catch (error) {
      console.error("Error fetching user withdrawals:", error);
      return [];
    }
  }

  async getAllWithdrawals() {
    try {
      const db = this.ensureDb();
      return await db
        .select({
          id: withdrawals.id,
          userId: withdrawals.userId,
          withdrawalMethod: withdrawals.withdrawalMethod,
          amount: withdrawals.amount,
          currency: withdrawals.currency,
          destinationAddress: withdrawals.destinationAddress,
          destinationDetails: withdrawals.destinationDetails,
          status: withdrawals.status,
          adminNotes: withdrawals.adminNotes,
          fees: withdrawals.fees,
          netAmount: withdrawals.netAmount,
          requestedAt: withdrawals.requestedAt,
          processedAt: withdrawals.processedAt,
          completedAt: withdrawals.completedAt,
          isConfirmed: withdrawals.isConfirmed,
          createdAt: withdrawals.createdAt,
          updatedAt: withdrawals.updatedAt,
          user: {
            username: users.username,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName
          }
        })
        .from(withdrawals)
        .leftJoin(users, eq(withdrawals.userId, users.id))
        .orderBy(desc(withdrawals.createdAt));
    } catch (error) {
      console.error("Error fetching all withdrawals:", error);
      return [];
    }
  }

  async getWithdrawalById(id: string): Promise<any> {
    try {
      const db = this.ensureDb();
      const [result] = await db
        .select()
        .from(withdrawals)
        .where(eq(withdrawals.id, id))
        .limit(1);
      return result;
    } catch (error) {
      console.error("Error fetching withdrawal by ID:", error);
      return null;
    }
  }

  async updateWithdrawalStatus(id: string, status: string, adminNotes?: string): Promise<any> {
    try {
      const db = this.ensureDb();
      const updateData: any = {
        status,
        updatedAt: new Date()
      };

      if (adminNotes) {
        updateData.adminNotes = adminNotes;
      }

      if (status === 'approved') {
        updateData.reviewedAt = new Date();
      } else if (status === 'completed') {
        updateData.completedAt = new Date();
      } else if (status === 'processing') {
        updateData.processedAt = new Date();
      }

      const [result] = await db
        .update(withdrawals)
        .set(updateData)
        .where(eq(withdrawals.id, id))
        .returning();
      return result;
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
      throw error;
    }
  }

  async confirmWithdrawal(userId: string, token: string): Promise<any> {
    try {
      const db = this.ensureDb();

      // Find withdrawal with matching token and user
      const [withdrawal] = await db
        .select()
        .from(withdrawals)
        .where(and(
          eq(withdrawals.userId, userId),
          eq(withdrawals.confirmationToken, token),
          eq(withdrawals.isConfirmed, false)
        ))
        .limit(1);

      if (!withdrawal) {
        return null;
      }

      // Check if token is expired
      if (withdrawal.confirmationExpiresAt && new Date() > withdrawal.confirmationExpiresAt) {
        return null;
      }

      // Update withdrawal to confirmed
      const [confirmed] = await db
        .update(withdrawals)
        .set({
          isConfirmed: true,
          status: 'under_review',
          confirmationToken: null,
          confirmationExpiresAt: null,
          updatedAt: new Date()
        })
        .where(eq(withdrawals.id, withdrawal.id))
        .returning();

      return confirmed;
    } catch (error) {
      console.error("Error confirming withdrawal:", error);
      return null;
    }
  }

  async getWithdrawalLimits(userId: string): Promise<any> {
    try {
      const db = this.ensureDb();

      // Try to get existing limits
      const [limits] = await db
        .select()
        .from(withdrawalLimits)
        .where(eq(withdrawalLimits.userId, userId))
        .limit(1);

      if (limits) {
        return {
          dailyLimit: parseFloat(limits.dailyLimit),
          monthlyLimit: parseFloat(limits.monthlyLimit),
          dailyUsed: parseFloat(limits.dailyUsed),
          monthlyUsed: parseFloat(limits.monthlyUsed)
        };
      }

      // Create default limits if none exist
      const [newLimits] = await db
        .insert(withdrawalLimits)
        .values({
          userId,
          dailyLimit: '10000.00',
          monthlyLimit: '50000.00',
          dailyUsed: '0.00',
          monthlyUsed: '0.00',
          lastResetDate: new Date()
        })
        .returning();

      return {
        dailyLimit: parseFloat(newLimits.dailyLimit),
        monthlyLimit: parseFloat(newLimits.monthlyLimit),
        dailyUsed: parseFloat(newLimits.dailyUsed),
        monthlyUsed: parseFloat(newLimits.monthlyUsed)
      };
    } catch (error) {
      console.error("Error fetching withdrawal limits:", error);
      return {
        dailyLimit: 10000,
        monthlyLimit: 50000,
        dailyUsed: 0,
        monthlyUsed: 0
      };
    }
  }

  async setWithdrawalLimits(userId: string, limits: { dailyLimit: number; monthlyLimit: number }): Promise<any> {
    try {
      const db = this.ensureDb();
      const [result] = await db
        .insert(withdrawalLimits)
        .values({
          userId,
          dailyLimit: limits.dailyLimit.toString(),
          monthlyLimit: limits.monthlyLimit.toString(),
          dailyUsed: '0.00',
          monthlyUsed: '0.00',
          lastResetDate: new Date()
        })
        .onConflictDoUpdate({
          target: withdrawalLimits.userId,
          set: {
            dailyLimit: limits.dailyLimit.toString(),
            monthlyLimit: limits.monthlyLimit.toString(),
            updatedAt: new Date()
          }
        })
        .returning();

      return {
        dailyLimit: parseFloat(result.dailyLimit),
        monthlyLimit: parseFloat(result.monthlyLimit),
        dailyUsed: parseFloat(result.dailyUsed),
        monthlyUsed: parseFloat(result.monthlyUsed)
      };
    } catch (error) {
      console.error("Error setting withdrawal limits:", error);
      throw error;
    }
  }

  async calculateWithdrawalFees(amount: number, method: string): Promise<number> {
    try {
      const feeRates = {
        bank_transfer: 0.015, // 1.5%
        crypto_wallet: 0.005, // 0.5%
        paypal: 0.025, // 2.5%
        mobile_money: 0.02, // 2%
        other: 0.02 // 2%
      };

      const rate = feeRates[method as keyof typeof feeRates] || 0.02;
      const fee = amount * rate;
      const minFee = method === 'crypto_wallet' ? 2 : 5;
      const maxFee = method === 'crypto_wallet' ? 50 : 100;

      return Math.max(minFee, Math.min(fee, maxFee));
    } catch (error) {
      console.error("Error calculating withdrawal fees:", error);
      return 25; // Default fee
    }
  }

  // KYC Verification methods implementation
  async createKycVerification(data: InsertKycVerification): Promise<KycVerification> {
    try {
      const db = this.ensureDb();
      const [kyc] = await db.insert(kycVerifications).values(data).returning();
      return kyc;
    } catch (error) {
      console.error("Error creating KYC verification:", error);
      throw error;
    }
  }

  async getKycVerification(userId: string): Promise<KycVerification | null> {
    try {
      const db = this.ensureDb();
      const [kyc] = await db
        .select()
        .from(kycVerifications)
        .where(eq(kycVerifications.userId, userId))
        .limit(1);
      return kyc || null;
    } catch (error) {
      console.error("Error fetching KYC verification:", error);
      return null;
    }
  }

  async getKycVerificationById(id: string): Promise<KycVerification | null> {
    try {
      const db = this.ensureDb();
      const [kyc] = await db
        .select()
        .from(kycVerifications)
        .where(eq(kycVerifications.id, id))
        .limit(1);
      return kyc || null;
    } catch (error) {
      console.error("Error fetching KYC verification by ID:", error);
      return null;
    }
  }

  async updateKycVerification(id: string, data: Partial<InsertKycVerification>): Promise<KycVerification> {
    try {
      const db = this.ensureDb();
      const [kyc] = await db
        .update(kycVerifications)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(kycVerifications.id, id))
        .returning();
      return kyc;
    } catch (error) {
      console.error("Error updating KYC verification:", error);
      throw error;
    }
  }

  async getAllKycVerifications(options: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'under_review' | 'approved' | 'rejected';
    search?: string;
  }): Promise<{ verifications: any[], pagination: { page: number, limit: number, total: number, pages: number } }> {
    try {
      const { page = 1, limit = 20, status, search } = options;
      const offset = (page - 1) * limit;
      const db = this.ensureDb();

      let query = db
        .select({
          kyc: kycVerifications,
          user: {
            id: users.id,
            email: users.email,
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName
          }
        })
        .from(kycVerifications)
        .leftJoin(users, eq(kycVerifications.userId, users.id));

      const conditions = [];
      if (status) {
        conditions.push(eq(kycVerifications.status, status));
      }
      if (search) {
        conditions.push(
          or(
            ilike(kycVerifications.firstName, `%${search}%`),
            ilike(kycVerifications.lastName, `%${search}%`),
            ilike(users.email, `%${search}%`),
            ilike(users.username, `%${search}%`)
          )
        );
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const verifications = await query
        .orderBy(desc(kycVerifications.createdAt))
        .limit(limit)
        .offset(offset);

      // Get total count
      let countQuery = db.select({ count: count() }).from(kycVerifications);
      if (status) {
        countQuery = countQuery.where(eq(kycVerifications.status, status));
      }

      const totalResult = await countQuery;
      const total = totalResult[0]?.count || 0;

      return {
        verifications: verifications.map(row => ({
          ...row.kyc,
          userEmail: row.user?.email,
          userUsername: row.user?.username
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error("Error fetching all KYC verifications:", error);
      return {
        verifications: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 }
      };
    }
  }

  async getKycStatistics(): Promise<{ total: number; pending: number; underReview: number; approved: number; rejected: number; approvalRate: number }> {
    try {
      const db = this.ensureDb();

      const [total] = await db.select({ count: count() }).from(kycVerifications);
      const [pending] = await db.select({ count: count() }).from(kycVerifications).where(eq(kycVerifications.status, 'pending'));
      const [underReview] = await db.select({ count: count() }).from(kycVerifications).where(eq(kycVerifications.status, 'under_review'));
      const [approved] = await db.select({ count: count() }).from(kycVerifications).where(eq(kycVerifications.status, 'approved'));
      const [rejected] = await db.select({ count: count() }).from(kycVerifications).where(eq(kycVerifications.status, 'rejected'));

      const totalCount = Number(total.count);
      const approvedCount = Number(approved.count);
      const approvalRate = totalCount > 0 ? (approvedCount / totalCount) * 100 : 0;

      return {
        total: totalCount,
        pending: Number(pending.count),
        underReview: Number(underReview.count),
        approved: approvedCount,
        rejected: Number(rejected.count),
        approvalRate: Math.round(approvalRate * 100) / 100
      };
    } catch (error) {
      console.error("Error fetching KYC statistics:", error);
      return {
        total: 0,
        pending: 0,
        underReview: 0,
        approved: 0,
        rejected: 0,
        approvalRate: 0
      };
    }
  }

  async getWithdrawalStats(): Promise<any> {
    try {
      const db = this.ensureDb();

      const totalWithdrawals = await db
        .select({ count: count() })
        .from(withdrawals);

      const pendingWithdrawals = await db
        .select({ count: count() })
        .from(withdrawals)
        .where(eq(withdrawals.status, 'pending'));

      const approvedWithdrawals = await db
        .select({ count: count() })
        .from(withdrawals)
        .where(eq(withdrawals.status, 'approved'));

      const totalVolume = await db
        .select({ total: sum(withdrawals.amount) })
        .from(withdrawals)
        .where(eq(withdrawals.status, 'completed'));

      return {
        totalWithdrawals: Number(totalWithdrawals[0]?.count || 0),
        pendingWithdrawals: Number(pendingWithdrawals[0]?.count || 0),
        approvedWithdrawals: Number(approvedWithdrawals[0]?.count || 0),
        totalVolume: Number(totalVolume[0]?.total || 0)
      };
    } catch (error) {
      console.error("Error fetching withdrawal stats:", error);
      return {
        totalWithdrawals: 0,
        pendingWithdrawals: 0,
        approvedWithdrawals: 0,
        totalVolume: 0
      };
    }
  }

  async cancelWithdrawal(userId: string, withdrawalId: string): Promise<boolean> {
    try {
      const db = this.ensureDb();

      const [result] = await db
        .update(withdrawals)
        .set({
          status: 'cancelled',
          updatedAt: new Date()
        })
        .where(and(
          eq(withdrawals.id, withdrawalId),
          eq(withdrawals.userId, userId),
          or(
            eq(withdrawals.status, 'pending'),
            eq(withdrawals.status, 'pending_confirmation')
          )
        ))
        .returning();

      return !!result;
    } catch (error) {
      console.error("Error cancelling withdrawal:", error);
      return false;
    }
  }

  async getAnalyticsOverview(): Promise<any> {
    try {
      const db = this.ensureDb();
      const [userCount] = await db.select({ count: sql`count(*)` }).from(users);
      const [transactionCount] = await db.select({ count: sql`count(*)` }).from(transactions);
      const [depositCount] = await db.select({ count: sql`count(*)` }).from(deposits);

      const [totalVolume] = await db
        .select({ total: sql`sum(${transactions.total})` })
        .from(transactions)
        .where(eq(transactions.status, 'completed'));

      return {
        totalUsers: Number(userCount.count),
        totalTransactions: Number(transactionCount.count),
        totalDeposits: Number(depositCount.count),
        totalVolume: Number(totalVolume.total || 0)
      };
    } catch (error) {
      console.error("Error fetching analytics overview:", error);
      return { totalUsers: 0, totalTransactions: 0, totalDeposits: 0, totalVolume: 0 };
    }
  }

  async getRevenueAnalytics(period: string): Promise<any[]> {
    try {
      // Mock revenue analytics - in real app, calculate based on transaction fees
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const revenue = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        revenue.push({
          date: date.toISOString().split('T')[0],
          revenue: Math.random() * 10000 + 5000,
          transactions: Math.floor(Math.random() * 100) + 50
        });
      }

      return revenue;
    } catch (error) {
      console.error("Error fetching revenue analytics:", error);
      return [];
    }
  }

  async getUserAnalytics(period: string): Promise<any> {
    try {
      const days = period === '30d' ? 30 : 90;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);

      const db = this.ensureDb();
      const [newUsers] = await db
        .select({ count: sql`count(*)` })
        .from(users)
        .where(gte(users.createdAt, cutoff));

      const [activeUsers] = await db
        .select({ count: sql`count(*)` })
        .from(users)
        .where(and(
          eq(users.isActive, true),
          gte(users.createdAt, cutoff)
        ));

      return {
        newUsers: Number(newUsers.count),
        activeUsers: Number(activeUsers.count),
        growthRate: Math.random() * 20 + 5 // Mock growth rate
      };
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      return { newUsers: 0, activeUsers: 0, growthRate: 0 };
    }
  }

  async getActiveSessions(): Promise<any[]> {
    try {
      // Mock active sessions - in real app, query session store
      return [
        { userId: '1', ip: '192.168.1.1', userAgent: 'Chrome/91.0', lastActivity: new Date() },
        { userId: '2', ip: '192.168.1.2', userAgent: 'Firefox/89.0', lastActivity: new Date() }
      ];
    } catch (error) {
      console.error("Error fetching active sessions:", error);
      return [];
    }
  }

  async invalidateUserSessions(userId: string): Promise<void> {
    try {
      // Mock session invalidation - in real app, clear from session store
      console.log(`Invalidating sessions for user ${userId}`);
    } catch (error) {
      console.error("Error invalidating user sessions:", error);
    }
  }

  async getSystemConfig(): Promise<any> {
    try {
      // Mock system configuration
      return {
        maintenance_mode: false,
        trading_enabled: true,
        max_daily_withdrawal: 50000,
        kyc_required: true,
        api_rate_limit: 100
      };
    } catch (error) {
      console.error("Error fetching system config:", error);
      return {};
    }
  }

  async updateSystemConfig(config: any): Promise<any> {
    try {
      // Mock system config update
      console.log('Updating system config:', config);
      return config;
    } catch (error) {
      console.error("Error updating system config:", error);
      throw error;
    }
  }

  async logAdminAction(action: { adminId: string, action: string, targetId?: string, targetUserId?: string, details?: any, timestamp: Date }): Promise<void> {
    try {
      // This would save to an audit_logs table
      // For now, just log to console
      console.log('Admin action logged:', {
        ...action,
        timestamp: new Date().toISOString()
      });

      // Placeholder for actual audit log creation if using a real DB
      // await this.createAuditLog({
      //   adminId: action.adminId,
      //   action: action.action,
      //   targetId: action.targetUserId || 'N/A',
      //   details: action.details || {},
      //   ipAddress: '', // IP address should ideally be passed or obtained from request context
      //   userAgent: '' // User agent should ideally be passed or obtained from request context
      // });

    } catch (error) {
      console.error("Error logging admin action:", error);
    }
  }

  async getAuditLogs(options: {
    page: number;
    limit: number;
    action?: string;
    userId?: string;
  }): Promise<{ logs: any[], pagination: { page: number, limit: number, total: number, pages: number } }> {
    try {
      // This would query from an audit_logs table
      // For now, return empty results
      return {
        logs: [],
        pagination: {
          page: options.page,
          limit: options.limit,
          total: 0,
          pages: 0
        }
      };
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      throw error;
    }
  }

  // User Preferences operations
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    try {
      const db = this.ensureDb();
      const result = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId))
        .limit(1);

      return result[0];
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      return undefined;
    }
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    try {
      const db = this.ensureDb();
      const result = await db
        .insert(userPreferences)
        .values(preferences)
        .returning();

      return result[0];
    } catch (error) {
      console.error("Error creating user preferences:", error);
      throw error;
    }
  }

  async updateUserPreferences(userId: string, updates: Partial<InsertUserPreferences>): Promise<UserPreferences> {
    try {
      const db = this.ensureDb();

      // Check if preferences exist
      const existing = await this.getUserPreferences(userId);

      if (!existing) {
        // Create new preferences with updates
        return await this.createUserPreferences({ userId, ...updates } as InsertUserPreferences);
      }

      // Update existing preferences
      const result = await db
        .update(userPreferences)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(userPreferences.userId, userId))
        .returning();

      return result[0];
    } catch (error) {
      console.error("Error updating user preferences:", error);
      throw error;
    }
  }

  // Get holdings with current prices
  async getHoldingsWithPrices(portfolioId: string) {
    try {
      const userHoldings = await this.getHoldings(portfolioId);
      // In production, fetch real prices from crypto API
      return userHoldings.map(holding => ({
        ...holding,
        currentPrice: parseFloat(holding.currentPrice),
        totalValue: parseFloat(holding.amount) * parseFloat(holding.currentPrice)
      }));
    } catch (error) {
      console.error("Error fetching holdings with prices:", error);
      return [];
    }
  }

  // Get system analytics
  async getSystemAnalytics(period: string = '30d') {
    try {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // User registration trends
      const userRegistrations = await this.db
        .select({
          date: sql`DATE(${users.createdAt})`.as('date'),
          count: count()
        })
        .from(users)
        .where(gte(users.createdAt, startDate))
        .groupBy(sql`DATE(${users.createdAt})`)
        .orderBy(sql`DATE(${users.createdAt})`);

      // Transaction volume trends
      const transactionVolume = await this.db
        .select({
          date: sql`DATE(${transactions.createdAt})`.as('date'),
          volume: sum(transactions.total),
          count: count()
        })
        .from(transactions)
        .where(gte(transactions.createdAt, startDate))
        .groupBy(sql`DATE(${transactions.createdAt})`)
        .orderBy(sql`DATE(${transactions.createdAt})`);

      // Most traded assets
      const topAssets = await this.db
        .select({
          symbol: transactions.symbol,
          totalVolume: sum(transactions.total),
          transactionCount: count()
        })
        .from(transactions)
        .where(gte(transactions.createdAt, startDate))
        .groupBy(transactions.symbol)
        .orderBy(desc(sum(transactions.total)))
        .limit(10);

      return {
        userRegistrations,
        transactionVolume,
        topAssets,
        period
      };
    } catch (error) {
      console.error("Error getting system analytics:", error);
      throw error;
    }
  }

  // Get transactions for admin monitoring
  async getTransactionsForAdmin(options: {
    page: number;
    limit: number;
    type?: string;
    status?: string;
    userId?: string;
  }) {
    try {
      let query = this.db
        .select({
          id: transactions.id,
          userId: transactions.userId,
          type: transactions.type,
          symbol: transactions.symbol,
          amount: transactions.amount,
          price: transactions.price,
          total: transactions.total,
          status: transactions.status,
          createdAt: transactions.createdAt,
          username: users.username,
          email: users.email
        })
        .from(transactions)
        .leftJoin(users, eq(transactions.userId, users.id));

      // Apply filters
      if (options.type) {
        query = query.where(eq(transactions.type, options.type));
      }
      if (options.status) {
        query = query.where(eq(transactions.status, options.status));
      }
      if (options.userId) {
        query = query.where(eq(transactions.userId, options.userId));
      }

      const offset = (options.page - 1) * options.limit;
      const result = await query
        .limit(options.limit)
        .offset(offset)
        .orderBy(desc(transactions.createdAt));

      // Get total count
      let countQuery = this.db.select({ count: count() }).from(transactions);
      if (options.type) {
        countQuery = countQuery.where(eq(transactions.type, options.type));
      }
      if (options.status) {
        countQuery = countQuery.where(eq(transactions.status, options.status));
      }
      if (options.userId) {
        countQuery = countQuery.where(eq(transactions.userId, options.userId));
      }

      const totalResult = await countQuery;
      const total = totalResult[0]?.count || 0;

      return {
        transactions: result,
        pagination: {
          page: options.page,
          limit: options.limit,
          total,
          pages: Math.ceil(total / options.limit)
        }
      };
    } catch (error) {
      console.error("Error getting transactions for admin:", error);
      throw error;
    }
  }

  // Update transaction status (admin action)
  async updateTransactionStatus(transactionId: string, status: string, reason: string, adminId: string): Promise<boolean> {
    try {
      const updatedTransaction = await this.db
        .update(transactions)
        .set({
          status,
          updatedAt: new Date()
        })
        .where(eq(transactions.id, transactionId))
        .returning();

      // Log admin action
      await this.logAdminAction({
        adminId,
        action: 'transaction_status_update',
        targetId: transactionId,
        details: { status, reason, userId: updatedTransaction[0]?.userId },
        timestamp: new Date()
      });

      return true;
    } catch (error) {
      console.error("Error updating transaction status:", error);
      throw error;
    }
  }

  // Delete user (admin action)
  async deleteUser(userId: string): Promise<boolean> {
    try {
      // Delete user's portfolio first
      const portfolio = await this.getPortfolio(userId);
      if (portfolio) {
        await this.db.delete(holdings).where(eq(holdings.portfolioId, portfolio.id));
        await this.db.delete(portfolios).where(eq(portfolios.id, portfolio.id));
      }

      // Delete user's transactions, deposits, etc.
      await this.db.delete(transactions).where(eq(transactions.userId, userId));
      await this.db.delete(priceAlerts).where(eq(priceAlerts.userId, userId));

      // Finally delete the user
      await this.db.delete(users).where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  // Platform settings management
  async getPlatformSettings() {
    try {
      // This would typically come from a settings table
      // For now, return default settings
      return {
        maintenanceMode: false,
        registrationEnabled: true,
        tradingEnabled: true,
        maxWithdrawalAmount: 50000,
        minDepositAmount: 10,
        tradingFeePercentage: 0.1,
        withdrawalFeePercentage: 0.5,
        supportedCurrencies: ['USD', 'EUR', 'BTC', 'ETH'],
        kycRequired: true,
        apiRateLimits: {
          requests: 1000,
          windowMs: 3600000
        }
      };
    } catch (error) {
      console.error("Error getting platform settings:", error);
      throw error;
    }
  }

  async updatePlatformSettings(settings: any, adminId: string) {
    try {
      // Log the settings change
      await this.createAuditLog({
        adminId,
        action: 'settings_update',
        targetId: 'platform',
        details: settings,
        ipAddress: '', // IP address should ideally be passed or obtained from request context
        userAgent: '' // User agent should ideally be passed or obtained from request context
      });

      // In a real implementation, you'd save these to a settings table
      return true;
    } catch (error) {
      console.error("Error updating platform settings:", error);
      throw error;
    }
  }

  // Audit logging
  async createAuditLog(logData: {
    adminId: string;
    action: string;
    targetId: string;
    details: any;
    ipAddress: string;
    userAgent: string;
  }) {
    try {
      // This would save to an audit_logs table
      // For now, just log to console
      console.log('Audit Log:', {
        ...logData,
        timestamp: new Date().toISOString()
      });

      // In a real implementation, you would insert this into an audit_logs table.
      // Example (assuming an auditLogs table and drizzle-orm):
      // await this.db.insert(auditLogs).values({ ...logData, timestamp: new Date() });

      return true;
    } catch (error) {
      console.error("Error creating audit log:", error);
      throw error;
    }
  }

  // Add this method to create initial users if they don't exist
  async createInitialUsers(): Promise<void> {
    try {
      // Check if demo user already exists
      const existingDemoUser = await this.getUserByEmail('demo@example.com');
      if (existingDemoUser) {
        console.log('✅ Demo users already exist');
        return;
      }

      console.log('🌱 Creating initial test users...');

      // Create demo user with proper password hash
      const demoPasswordHash = await hashPassword('demo123');
      const demoUser = {
        id: 'demo-user-id',
        username: 'demo',
        email: 'demo@example.com',
        password: demoPasswordHash,
        firstName: 'Demo',
        lastName: 'User',
        role: 'user' as const,
        isActive: true,
        isVerified: true,
        phone: '+1234567890',
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.insert(users).values(demoUser).onConflictDoNothing();

      // Create test user with proper password hash
      const testPasswordHash = await hashPassword('test123');
      const testUser = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@bitpanda.com',
        password: testPasswordHash,
        firstName: 'Test',
        lastName: 'User',
        role: 'user' as const,
        isActive: true,
        isVerified: true,
        phone: '+1987654321',
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.insert(users).values(testUser).onConflictDoNothing();

      // Create admin user with proper password hash
      const adminPasswordHash = await hashPassword('admin123');
      const adminUser = {
        id: 'admin-user-id',
        username: 'admin',
        email: 'admin@example.com',
        password: adminPasswordHash,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin' as const,
        isActive: true,
        isVerified: true,
        phone: '+1555000000',
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.insert(users).values(adminUser).onConflictDoNothing();

      console.log('✅ Test users created successfully');
      console.log('📧 Demo User: demo@example.com / demo123');
      console.log('📧 Test User: test@bitpanda.com / test123');
      console.log('👑 Admin User: admin@example.com / admin123');

    } catch (error) {
      console.error('❌ Failed to create initial users:', error);
    }
  }

  // Placeholder methods for Enhanced Trading System
  async validateOrder(orderData: any): Promise<{ isValid: boolean; message?: string }> {
    console.log("Validating order:", orderData);
    // TODO: Implement actual order validation logic
    // - Check for sufficient funds
    // - Check minimum/maximum order sizes
    // - Validate stop-loss/take-profit values
    // - Check for valid symbols and amounts
    return { isValid: true };
  }

  async calculateTradingFees(amount: number, type: string, orderType: string): Promise<number> {
    console.log(`Calculating fees for amount: ${amount}, type: ${type}, orderType: ${orderType}`);
    // TODO: Implement fee calculation logic based on trading volume, user tier, etc.
    let feePercentage = 0.001; // Default 0.1% fee
    if (orderType === 'limit') {
      feePercentage = 0.0008; // Lower fee for limit orders
    }
    return amount * feePercentage;
  }

  async executeTrade(tradeData: any): Promise<any> {
    console.log("Executing trade:", tradeData);
    // TODO: Implement actual trade execution logic
    // - Create transaction records for buy/sell
    // - Update user portfolio and holdings
    // - Handle stop-loss and take-profit triggers
    // - Calculate and deduct fees
    // - Return trade confirmation details
    return { success: true, tradeId: `trade_${Date.now()}` };
  }

  async getOpenOrders(userId: string): Promise<any[]> {
    console.log(`Fetching open orders for user: ${userId}`);
    // TODO: Implement fetching of open orders from a database or order book
    return [];
  }

  async getOrderHistory(userId: string): Promise<any[]> {
    console.log(`Fetching order history for user: ${userId}`);
    // TODO: Implement fetching of order history from a database
    return [];
  }

  // KYC methods are already implemented above

  // Advanced order management
  async createAdvancedOrder(orderData: any) {
    const db = this.ensureDb();
    const order = {
      id: crypto.randomUUID(),
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store in transactions table with advanced order type
    const [transaction] = await db
      .insert(transactions)
      .values({
        userId: orderData.userId,
        symbol: orderData.symbol,
        type: orderData.side,
        amount: orderData.amount.toString(),
        price: (orderData.limitPrice || orderData.triggerPrice || 0).toString(),
        total: (orderData.amount * (orderData.limitPrice || orderData.triggerPrice || 0)).toString(),
        status: 'pending',
        orderType: orderData.type,
        stopLoss: orderData.triggerPrice?.toString(),
        takeProfit: orderData.limitPrice?.toString()
      })
      .returning();

    return transaction;
  }

  async getActiveAdvancedOrders(userId: string) {
    const db = this.ensureDb();
    const userTransactions = await db
      .select()
      .from(transactions)
      .where(and(
        eq(transactions.userId, userId),
        eq(transactions.status, 'pending'),
        ne(transactions.orderType, 'market')
      ))
      .orderBy(desc(transactions.createdAt));

    return userTransactions;
  }

  async cancelAdvancedOrder(orderId: string, userId: string) {
    const db = this.ensureDb();
    const [order] = await db
      .update(transactions)
      .set({ 
        status: 'cancelled',
        updatedAt: new Date()
      })
      .where(and(
        eq(transactions.id, parseInt(orderId)),
        eq(transactions.userId, userId),
        eq(transactions.status, 'pending')
      ))
      .returning();

    return order;
  }

  // Added updateTransaction method
  async updateTransaction(transactionId: string, updates: any): Promise<Transaction | undefined> {
    const db = this.ensureDb();
    const [updatedTransaction] = await db
      .update(transactions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(transactions.id, transactionId))
      .returning();
    return updatedTransaction;
  }

  // Added logAdminAction method (placeholder for audit log creation)
  async logAdminAction(action: {
    adminId: string;
    action: string;
    targetId?: string;
    targetUserId?: string;
    details?: any;
    timestamp: Date;
  }): Promise<void> {
    // In a real implementation, this would save to an audit log table
    console.log('Admin action logged:', {
      ...action,
      timestamp: action.timestamp.toISOString()
    });

    // Placeholder for actual audit log creation if using a real DB
    // For example, if you have an auditLogs table:
    // await this.db.insert(auditLogs).values({
    //   adminId: action.adminId,
    //   action: action.action,
    //   targetId: action.targetId || action.targetUserId || null,
    //   details: action.details || {},
    //   timestamp: action.timestamp,
    //   // ipAddress and userAgent would need to be passed in or obtained from context
    // });
  }

  // Existing getAuditLogs method from the original code
  async getAuditLogs(filters: any = {}): Promise<{ logs: any[], pagination: { page: number, limit: number, total: number, pages: number } }> {
    // In a real implementation, this would query from an audit_logs table
    // For now, return empty results
    return {
      logs: [],
      pagination: { page: 1, limit: 50, total: 0, pages: 0 }
    };
  }
}

export const storage = new DatabaseStorage();