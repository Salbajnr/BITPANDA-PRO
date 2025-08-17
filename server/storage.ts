import {
  users,
  portfolios,
  holdings,
  transactions,
  balanceAdjustments,
  newsArticles,
  deposits, // Added deposits schema import
  userPreferences,
  priceAlerts, // Assuming priceAlerts schema is available
  notifications, // Assuming notifications schema is available
  type User,
  type UpsertUser,
  type Portfolio,
  type InsertPortfolio,
  type Holding,
  type InsertHolding,
  type Transaction,
  type InsertTransaction,
  type BalanceAdjustment,
  type InsertBalanceAdjustment,
  type NewsArticle,
  type InsertNewsArticle,
  type UserPreferences,
  type InsertUserPreferences,
  type PriceAlert, // Assuming PriceAlert type is available
  type InsertPriceAlert, // Assuming InsertPriceAlert type is available
  type Notification, // Assuming Notification type is available
  type InsertNotification, // Assuming InsertNotification type is available
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, gte, lte, asc, count, and, or, sql, ilike } from "drizzle-orm";

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

  // Admin operations
  getAllUsers(): Promise<User[]>;
  createBalanceAdjustment(adjustment: InsertBalanceAdjustment): Promise<BalanceAdjustment>;
  getBalanceAdjustments(userId?: string, page?: number, limit?: number): Promise<BalanceAdjustment[]>;
  updatePortfolioBalance(userId: string, amount: number): Promise<void>;

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
  logAdminAction(action: { adminId: string, action: string, targetUserId?: string, details?: any, timestamp: Date }): Promise<void>;
  getAuditLogs(params: { page: number, limit: number, action?: string }): Promise<{ logs: any[], total: number }>;

  // User Preferences operations
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: string, updates: Partial<InsertUserPreferences>): Promise<UserPreferences>;

  // Price Alert operations
  createPriceAlert(data: InsertPriceAlert): Promise<PriceAlert>;
  getUserPriceAlerts(userId: string): Promise<PriceAlert[]>;
  getPriceAlert(userId: string, symbol: string): Promise<PriceAlert | undefined>;
  getPriceAlertById(alertId: string): Promise<PriceAlert | undefined>;
  updatePriceAlert(alertId: string, updates: Partial<InsertPriceAlert>): Promise<PriceAlert>;
  deletePriceAlert(alertId: string): Promise<void>;
  getActivePriceAlerts(): Promise<PriceAlert[]>;

  // Notification operations
  createNotification(data: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string, limit?: number): Promise<Notification[]>;
  markNotificationAsRead(notificationId: string): Promise<void>;
  getUnreadNotificationCount(userId: string): Promise<number>;
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

  async getUserByEmailOrUsername(email: string, username: string): Promise<User | undefined> {
    const db = this.ensureDb();
    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)));
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
      const [holding] = await db.insert(holdings).values(holdingData).returning();
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

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const db = this.ensureDb();
    const [transaction] = await db.insert(transactions).values(transactionData).returning();
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
      let query = db.select().from(transactions);
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

  async getAllUsers(): Promise<User[]> {
    try {
      const db = this.ensureDb();
      return await db.select().from(users).orderBy(desc(users.createdAt));
    } catch (error) {
      console.error("Error fetching all users:", error);
      return [];
    }
  }

  async createBalanceAdjustment(data: InsertBalanceAdjustment): Promise<BalanceAdjustment> {
    try {
      const db = this.ensureDb();
      const [adjustment] = await db.insert(balanceAdjustments).values(data).returning();
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
      let query = this.db
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
      throw error;
    }
  }

  // Get single news article by ID
  async getNewsArticleById(id: string): Promise<NewsArticle | null> {
    try {
      const article = await this.db
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
      const updated = await this.db
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
      const totalArticles = await this.db
        .select({ count: count() })
        .from(newsArticles);

      const articlesBySource = await this.db
        .select({
          source: newsArticles.source,
          count: count()
        })
        .from(newsArticles)
        .groupBy(newsArticles.source);

      const recentArticles = await this.db
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

  async getActivePriceAlerts(): Promise<PriceAlert[]> {
    try {
      const db = this.ensureDb();
      const alerts = await db.select()
        .from(priceAlerts)
        .where(and(eq(priceAlerts.isActive, true), eq(priceAlerts.isTriggered, false)));
      return alerts;
    } catch (error) {
      console.error("Error getting active price alerts:", error);
      throw error;
    }
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
      throw error;
    }
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

  async logAdminAction(action: { adminId: string, action: string, targetUserId?: string, details?: any, timestamp: Date }): Promise<void> {
    try {
      // Mock admin action logging - in real app, store in audit table
      console.log('Admin action logged:', action);
    } catch (error) {
      console.error("Error logging admin action:", error);
    }
  }

  async getAuditLogs(params: { page: number, limit: number, action?: string }): Promise<{ logs: any[], total: number }> {
    try {
      // Mock audit logs
      const logs = [
        { id: '1', adminId: 'admin1', action: 'suspend_user', targetUserId: 'user1', timestamp: new Date(), details: {} },
        { id: '2', adminId: 'admin1', action: 'balance_adjustment', targetUserId: 'user2', timestamp: new Date(), details: {} }
      ];

      return { logs, total: logs.length };
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      return { logs: [], total: 0 };
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
}

export const storage = new DatabaseStorage();