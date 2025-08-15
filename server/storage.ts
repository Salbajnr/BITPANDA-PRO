import {
  users,
  portfolios,
  holdings,
  transactions,
  balanceAdjustments,
  newsArticles,
  deposits, // Added deposits schema import
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, gte } from "drizzle-orm";

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
  deleteHolding(portfolioId: string, symbol: string): Promise<void>; // Added for specific holding deletion

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
  getBalanceAdjustments(userId?: string, page?: number, limit?: number): Promise<{ adjustments: BalanceAdjustment[], total: number }>;
  updatePortfolioBalance(userId: string, amount: number): Promise<void>;

  // News operations
  getNewsArticles(limit?: number): Promise<NewsArticle[]>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  deleteNewsArticle(id: string): Promise<void>;

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
}

export class DatabaseStorage implements IStorage {
  // Assuming db is initialized and accessible here, or passed in constructor
  private db = db; // Make db accessible within the class

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByEmailOrUsername(email: string, username: string): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await this.db.insert(users).values(userData).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await this.db
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
    const [portfolio] = await this.db.select().from(portfolios).where(eq(portfolios.userId, userId));
    return portfolio;
  }

  async createPortfolio(portfolioData: InsertPortfolio): Promise<Portfolio> {
    const [portfolio] = await this.db.insert(portfolios).values(portfolioData).returning();
    return portfolio;
  }

  async updatePortfolio(portfolioId: string, updates: Partial<InsertPortfolio>): Promise<Portfolio> {
    const [portfolio] = await this.db
      .update(portfolios)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(portfolios.id, portfolioId))
      .returning();
    return portfolio;
  }

  async getHoldings(portfolioId: string): Promise<Holding[]> {
    return await this.db.select().from(holdings).where(eq(holdings.portfolioId, portfolioId));
  }

  async getHolding(portfolioId: string, symbol: string): Promise<Holding | undefined> {
    const [holding] = await this.db
      .select()
      .from(holdings)
      .where(and(eq(holdings.portfolioId, portfolioId), eq(holdings.symbol, symbol)));
    return holding;
  }

  async upsertHolding(holdingData: InsertHolding): Promise<Holding> {
    const existing = await this.getHolding(holdingData.portfolioId, holdingData.symbol);

    if (existing) {
      const [holding] = await this.db
        .update(holdings)
        .set({ ...holdingData, updatedAt: new Date() })
        .where(eq(holdings.id, existing.id))
        .returning();
      return holding;
    } else {
      const [holding] = await this.db.insert(holdings).values(holdingData).returning();
      return holding;
    }
  }

  async createHolding(holdingData: InsertHolding): Promise<Holding> {
    const [holding] = await this.db.insert(holdings).values(holdingData).returning();
    return holding;
  }

  async updateHolding(holdingId: string, updates: Partial<InsertHolding>): Promise<void> {
    await this.db
      .update(holdings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(holdings.id, holdingId));
  }

  async deleteHolding(id: string): Promise<void> {
    await this.db.delete(holdings).where(eq(holdings.id, id));
  }

  async deleteHolding(portfolioId: string, symbol: string): Promise<void> {
    await this.db.delete(holdings).where(and(
      eq(holdings.portfolioId, portfolioId),
      eq(holdings.symbol, symbol)
    ));
  }

  async updatePortfolioBalance(userId: string, amount: number): Promise<void> {
    const [portfolio] = await this.db.select().from(portfolios).where(eq(portfolios.userId, userId));
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    const currentBalance = parseFloat(portfolio.availableCash);
    const newBalance = currentBalance + amount;

    await this.db
      .update(portfolios)
      .set({
        availableCash: newBalance.toString(),
        updatedAt: new Date()
      })
      .where(eq(portfolios.id, portfolio.id));
  }

  async getTransactions(userId: string, limit = 50): Promise<Transaction[]> {
    return await this.db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const [transaction] = await this.db.insert(transactions).values(transactionData).returning();
    return transaction;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      await this.db.update(users).set(updates).where(eq(users.id, userId));
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      // Delete user and cascade will handle related records
      await this.db.delete(users).where(eq(users.id, userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  async getUserTransactions(userId: string, limit: number = 50): Promise<Transaction[]> {
    try {
      return await this.db.select()
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
      const [{ count }] = await this.db
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

      let query = this.db.select().from(transactions);
      let countQuery = this.db.select({ count: sql`count(*)` }).from(transactions);

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
      const original = await this.db.select().from(transactions).where(eq(transactions.id, transactionId)).limit(1);
      if (!original.length) throw new Error('Transaction not found');

      const reversedTransaction = await this.db.insert(transactions).values({
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
      return await this.db.select().from(users).orderBy(desc(users.createdAt));
    } catch (error) {
      console.error("Error fetching all users:", error);
      return [];
    }
  }

  async createBalanceAdjustment(adjustmentData: InsertBalanceAdjustment): Promise<BalanceAdjustment> {
    const [adjustment] = await this.db.insert(balanceAdjustments).values(adjustmentData).returning();
    return adjustment;
  }

  async getBalanceAdjustments(userId?: string, page: number = 1, limit: number = 50): Promise<{ adjustments: BalanceAdjustment[], total: number }> {
    try {
      const offset = (page - 1) * limit;
      let query = this.db.select().from(balanceAdjustments);

      if (userId) {
        query = query.where(eq(balanceAdjustments.targetUserId, userId));
      }

      const adjustments = await query
        .orderBy(desc(balanceAdjustments.createdAt))
        .limit(limit)
        .offset(offset);

      const totalQuery = this.db.select({ count: sql`count(*)` }).from(balanceAdjustments);
      if (userId) {
        totalQuery.where(eq(balanceAdjustments.targetUserId, userId));
      }

      const [{ count }] = await totalQuery;

      return { adjustments, total: Number(count) };
    } catch (error) {
      console.error("Error fetching balance adjustments:", error);
      return { adjustments: [], total: 0 };
    }
  }

  async getNewsArticles(limit = 10): Promise<NewsArticle[]> {
    return await this.db
      .select()
      .from(newsArticles)
      .orderBy(desc(newsArticles.publishedAt))
      .limit(limit);
  }

  async createNewsArticle(articleData: InsertNewsArticle): Promise<NewsArticle> {
    const [article] = await this.db.insert(newsArticles).values(articleData).returning();
    return article;
  }

  async deleteNewsArticle(id: string): Promise<void> {
    await this.db.delete(newsArticles).where(eq(newsArticles.id, id));
  }

  // Deposit methods
  async createDeposit(deposit: any) {
    const [result] = await this.db.insert(deposits).values(deposit).returning();
    return result;
  }

  async getUserDeposits(userId: string, limit: number = 5): Promise<any[]> {
    try {
      return await this.db.select()
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
    return await this.db.select({
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
    const [result] = await this.db
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
      const [userCount] = await this.db.select({ count: sql`count(*)` }).from(users);
      const [transactionCount] = await this.db.select({ count: sql`count(*)` }).from(transactions);
      const [depositCount] = await this.db.select({ count: sql`count(*)` }).from(deposits);

      const [totalVolume] = await this.db
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

      const [newUsers] = await this.db
        .select({ count: sql`count(*)` })
        .from(users)
        .where(gte(users.createdAt, cutoff));

      const [activeUsers] = await this.db
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
}

export const storage = new DatabaseStorage();