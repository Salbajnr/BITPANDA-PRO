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
import { eq, desc, and, or } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByEmailOrUsername(email: string, username: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

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

  // Admin operations
  getAllUsers(): Promise<User[]>;
  createBalanceAdjustment(adjustment: InsertBalanceAdjustment): Promise<BalanceAdjustment>;
  getBalanceAdjustments(targetUserId?: string): Promise<BalanceAdjustment[]>;

  // News operations
  getNewsArticles(limit?: number): Promise<NewsArticle[]>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  deleteNewsArticle(id: string): Promise<void>;

  // Deposit operations
  createDeposit(deposit: any): Promise<any>;
  getUserDeposits(userId: string): Promise<any[]>;
  getAllDeposits(): Promise<any[]>;
  updateDepositStatus(id: string, status: string, rejectionReason?: string): Promise<any>;
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

  async getAllUsers(): Promise<User[]> {
    return await this.db.select().from(users).where(eq(users.isActive, true));
  }

  async createBalanceAdjustment(adjustmentData: InsertBalanceAdjustment): Promise<BalanceAdjustment> {
    const [adjustment] = await this.db.insert(balanceAdjustments).values(adjustmentData).returning();
    return adjustment;
  }

  async getBalanceAdjustments(targetUserId?: string): Promise<BalanceAdjustment[]> {
    const query = this.db.select().from(balanceAdjustments);

    if (targetUserId) {
      return await query.where(eq(balanceAdjustments.targetUserId, targetUserId))
        .orderBy(desc(balanceAdjustments.createdAt));
    }

    return await query.orderBy(desc(balanceAdjustments.createdAt));
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

  async getUserDeposits(userId: string) {
    return await this.db.select().from(deposits).where(eq(deposits.userId, userId)).orderBy(desc(deposits.createdAt));
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
}

export const storage = new DatabaseStorage();