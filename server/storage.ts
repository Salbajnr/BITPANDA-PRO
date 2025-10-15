import {
  users,
  portfolios,
  holdings,
  transactions,
  deposits,
  balanceAdjustments,
  sharedWalletAddresses,
  newsArticles,
  passwordResetTokens,
  otpTokens,
  kycVerifications,
  supportTickets,
  supportMessages,
  liveChatSessions,
  liveChatMessages,
  userPreferences,
  priceAlerts,
  notifications,
  withdrawals,
  withdrawalLimits,
  apiKeys,
  auditLogs,
  type User,
  type InsertUser,
  type Portfolio,
  type InsertPortfolio,
  type Holding,
  type InsertHolding,
  type Transaction,
  type InsertTransaction,
  type Deposit,
  type InsertDeposit,
  type BalanceAdjustment,
  type InsertBalanceAdjustment,
  type SharedWalletAddress,
  type InsertSharedWalletAddress,
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
  type InsertUserPreferences,
  type PriceAlert,
  type InsertPriceAlert,
  type Notification,
  type InsertNotification,
  type Withdrawal,
  type InsertWithdrawal,
  type WithdrawalLimit,
  type InsertWithdrawalLimit
} from "@shared/schema";
import { db } from "./db";
import {
  eq,
  desc,
  gte,
  ilike,
  like,
  count,
  and,
  or,
  sql,
  sum,
  ne,
  inArray,
  asc
} from "drizzle-orm";
import { hashPassword } from "./simple-auth";
import { verifyPassword } from "./simple-auth";
import { nanoid } from "nanoid";
import crypto from "crypto";

const generateId = () => nanoid();

type UpsertUser = InsertUser;

export interface IStorage {
  // (Only listing commonly used methods here; full implementation below)
  isDbConnected(): boolean;

  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmailOrUsername(value: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<void>;
  updateUserFirebaseUid(userId: string, firebaseUid: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;

  // Portfolio & holdings
  getPortfolio(userId: string): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(portfolioId: string, updates: Partial<InsertPortfolio>): Promise<Portfolio>;
  getHoldings(portfolioId: string): Promise<Holding[]>;
  getHolding(portfolioId: string, symbol: string): Promise<Holding | undefined>;
  upsertHolding(holding: InsertHolding): Promise<Holding>;
  createHolding(holding: InsertHolding): Promise<Holding>;
  updateHolding(holdingId: string, updates: Partial<InsertHolding>): Promise<void>;
  deleteHolding(idOrPortfolioId: string, symbol?: string): Promise<void>;

  // Transactions
  getTransactions(userId: string, limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: string, limit?: number): Promise<Transaction[]>;
  getAllTransactions(params: { page: number; limit: number; userId?: string; type?: string }): Promise<{ transactions: Transaction[]; total: number }>;
  reverseTransaction(transactionId: string, adminId: string, reason: string): Promise<Transaction>;
  getUserTransactionCount(userId: string): Promise<number>;
  updateTransaction(transactionId: string, updates: any): Promise<Transaction | undefined>;

  // Deposits
  createDeposit(deposit: InsertDeposit): Promise<Deposit>;
  getUserDeposits(userId: string, limit?: number): Promise<Deposit[]>;
  getAllDeposits(): Promise<any[]>;
  getDepositById(id: string): Promise<Deposit | null>;
  updateDeposit(id: string, updates: Partial<InsertDeposit>): Promise<Deposit>;

  // Withdrawals
  createWithdrawal(withdrawalData: any): Promise<any>;
  getUserWithdrawals(userId: string): Promise<any[]>;
  getAllWithdrawals(): Promise<any[]>;
  getWithdrawalById(id: string): Promise<any>;
  updateWithdrawalStatus(id: string, status: string, adminNotes?: string): Promise<any>;
  confirmWithdrawal(userId: string, token: string): Promise<any>;
  getWithdrawalLimits(userId: string): Promise<any>;
  setWithdrawalLimits(userId: string, limits: { dailyLimit: number; monthlyLimit: number }): Promise<any>;
  calculateWithdrawalFees(amount: number, method: string): Promise<number>;
  cancelWithdrawal(userId: string, withdrawalId: string): Promise<boolean>;

  // Price alerts & notifications
  getPriceAlerts(userId: string): Promise<PriceAlert[]>;
  createPriceAlert(alert: InsertPriceAlert): Promise<PriceAlert>;
  updatePriceAlert(id: string, updates: Partial<InsertPriceAlert>): Promise<PriceAlert | null>;
  deletePriceAlert(id: string): Promise<void>;
  getPriceAlertById(id: string): Promise<PriceAlert | null>;

  getNotifications(userId: string, limit?: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(notificationId: string): Promise<void>;
  deleteNotification(notificationId: string): Promise<void>;
  getUnreadNotificationCount(userId: string): Promise<number>;

  // News
  getNewsArticles(limit?: number, category?: string, search?: string): Promise<NewsArticle[]>;
  getNewsArticleById(id: string): Promise<NewsArticle | null>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  updateNewsArticle(id: string, updates: Partial<InsertNewsArticle>): Promise<NewsArticle | null>;
  deleteNewsArticle(id: string): Promise<void>;
  getNewsAnalytics(): Promise<any>;

  // KYC
  createKycVerification(data: InsertKycVerification): Promise<KycVerification>;
  getKycVerification(userId: string): Promise<KycVerification | null>;
  updateKycVerification(id: string, data: Partial<InsertKycVerification>): Promise<KycVerification>;

  // Admin / Analytics / Audit operations
  getAllUsers(): Promise<User[]>;
  getUsers(options: { page: number; limit: number; search?: string; status?: 'active' | 'inactive'; role?: 'user' | 'admin' }): Promise<{ users: User[]; pagination: any }>;
  logAdminAction(action: { adminId: string; action: string; targetId?: string; targetUserId?: string; details?: any; timestamp: Date }): Promise<void>;
  createAuditLog(logData: { adminId: string; action: string; targetId: string; details: any; ipAddress: string; userAgent: string }): Promise<boolean>;
  getAuditLogs(options: { page: number; limit: number; action?: string; userId?: string }): Promise<{ logs: any[]; pagination: any }>;

  // Misc / placeholders
  createInitialUsers(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  private db = db;

  private ensureDb() {
    if (!this.db) {
      throw new Error("Database not initialized. Please set DATABASE_URL and restart the application.");
    }
    return this.db;
  }

  isDbConnected(): boolean {
    try {
      return !!this.db;
    } catch {
      return false;
    }
  }

  /* ---------------------------
     User methods
  ----------------------------*/
  async getUser(id: string): Promise<User | undefined> {
    const db = this.ensureDb();
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = this.ensureDb();
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = this.ensureDb();
    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return user;
  }

  async getUserByEmailOrUsername(value: string): Promise<User | undefined> {
    const db = this.ensureDb();
    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, value), eq(users.username, value)))
      .limit(1);
    return user;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const db = this.ensureDb();
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid)).limit(1);
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
          updatedAt: new Date()
        }
      })
      .returning();
    return user;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const db = this.ensureDb();
    await db.update(users).set({ ...updates, updatedAt: new Date() }).where(eq(users.id, userId));
  }

  async updateUserFirebaseUid(userId: string, firebaseUid: string): Promise<void> {
    const db = this.ensureDb();
    await db.update(users).set({ firebaseUid, updatedAt: new Date() }).where(eq(users.id, userId));
  }

  async deleteUser(userId: string): Promise<void> {
    const db = this.ensureDb();
    await db.delete(users).where(eq(users.id, userId));
  }

  /* ---------------------------
     Portfolio & Holdings
  ----------------------------*/
  async getPortfolio(userId: string): Promise<Portfolio | undefined> {
    const db = this.ensureDb();
    const [portfolio] = await db.select().from(portfolios).where(eq(portfolios.userId, userId)).limit(1);
    return portfolio;
  }

  async createPortfolio(portfolioData: InsertPortfolio): Promise<Portfolio> {
    const db = this.ensureDb();
    const [portfolio] = await db.insert(portfolios).values(portfolioData).returning();
    return portfolio;
  }

  async updatePortfolio(portfolioId: string, updates: Partial<InsertPortfolio>): Promise<Portfolio> {
    const db = this.ensureDb();
    const [portfolio] = await db.update(portfolios).set({ ...updates, updatedAt: new Date() }).where(eq(portfolios.id, portfolioId)).returning();
    return portfolio;
  }

  async getHoldings(portfolioId: string): Promise<Holding[]> {
    const db = this.ensureDb();
    try {
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
      .where(and(eq(holdings.portfolioId, portfolioId), eq(holdings.symbol, symbol)))
      .limit(1);
    return holding;
  }

  async upsertHolding(holdingData: InsertHolding): Promise<Holding> {
    const existing = await this.getHolding(holdingData.portfolioId, holdingData.symbol);
    const db = this.ensureDb();
    if (existing) {
      const [holding] = await db.update(holdings).set({ ...holdingData, updatedAt: new Date() }).where(eq(holdings.id, existing.id)).returning();
      return holding;
    } else {
      const [holding] = await db.insert(holdings).values({ ...holdingData, assetType: holdingData.assetType ?? "crypto" }).returning();
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
    await db.update(holdings).set({ ...updates, updatedAt: new Date() }).where(eq(holdings.id, holdingId));
  }

  async deleteHolding(idOrPortfolioId: string, symbol?: string): Promise<void> {
    const db = this.ensureDb();
    if (symbol) {
      await db.delete(holdings).where(and(eq(holdings.portfolioId, idOrPortfolioId), eq(holdings.symbol, symbol)));
    } else {
      await db.delete(holdings).where(eq(holdings.id, idOrPortfolioId));
    }
  }

  async updatePortfolioBalance(userId: string, amount: number): Promise<void> {
    const db = this.ensureDb();
    const [portfolio] = await db.select().from(portfolios).where(eq(portfolios.userId, userId)).limit(1);
    if (!portfolio) throw new Error("Portfolio not found");
    const current = parseFloat(String(portfolio.availableCash || "0"));
    const newVal = (current + amount).toString();
    await db.update(portfolios).set({ availableCash: newVal, updatedAt: new Date() }).where(eq(portfolios.id, portfolio.id));
  }

  /* ---------------------------
     Transactions
  ----------------------------*/
  async getTransactions(userId: string, limit = 50): Promise<Transaction[]> {
    const db = this.ensureDb();
    return await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt)).limit(limit);
  }

  async createTransaction(data: InsertTransaction): Promise<Transaction> {
    const db = this.ensureDb();
    const [transaction] = await db.insert(transactions).values({
      ...data,
      id: data.id ?? generateId(),
      fee: data.fee ?? "0",
      orderType: data.orderType ?? "market",
      stopLoss: data.stopLoss ?? null,
      takeProfit: data.takeProfit ?? null,
      slippage: data.slippage ?? "0"
    }).returning();
    return transaction;
  }

  async getUserTransactions(userId: string, limit = 50): Promise<Transaction[]> {
    const db = this.ensureDb();
    return await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt)).limit(limit);
  }

  async getUserTransactionCount(userId: string): Promise<number> {
    const db = this.ensureDb();
    const [row] = await db.select({ count: sql`count(*)` }).from(transactions).where(eq(transactions.userId, userId));
    return Number(row?.count ?? 0);
  }

  async getAllTransactions(params: { page: number; limit: number; userId?: string; type?: string }): Promise<{ transactions: Transaction[]; total: number }> {
    const db = this.ensureDb();
    const { page, limit, userId, type } = params;
    const offset = (page - 1) * limit;

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
      email: users.email
    }).from(transactions).leftJoin(users, eq(transactions.userId, users.id));

    const conditions: any[] = [];
    if (userId) conditions.push(eq(transactions.userId, userId));
    if (type) conditions.push(eq(transactions.type, type));
    if (conditions.length) query = query.where(and(...conditions));

    const transactionList = await query.orderBy(desc(transactions.createdAt)).limit(limit).offset(offset);
    let countQuery = db.select({ count: sql`count(*)` }).from(transactions);
    if (conditions.length) countQuery = countQuery.where(and(...conditions));
    const [{ count: totalCount }] = await countQuery;
    return { transactions: transactionList, total: Number(totalCount ?? 0) };
  }

  async reverseTransaction(transactionId: string, adminId: string, reason: string): Promise<Transaction> {
    const db = this.ensureDb();
    const [orig] = await db.select().from(transactions).where(eq(transactions.id, transactionId)).limit(1);
    if (!orig) throw new Error("Transaction not found");

    const [reversed] = await db.insert(transactions).values({
      id: generateId(),
      userId: orig.userId,
      type: orig.type === "buy" ? "sell" : "buy",
      symbol: orig.symbol,
      amount: orig.amount,
      price: orig.price,
      total: orig.total,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    await this.logAdminAction({
      adminId,
      action: "reverse_transaction",
      targetId: transactionId,
      details: { reason },
      timestamp: new Date()
    });

    return reversed;
  }

  async updateTransaction(transactionId: string, updates: any): Promise<Transaction | undefined> {
    const db = this.ensureDb();
    const [updated] = await db.update(transactions).set({ ...updates, updatedAt: new Date() }).where(eq(transactions.id, transactionId)).returning();
    return updated;
  }

  /* ---------------------------
     Deposits
  ----------------------------*/
  async createDeposit(depositData: InsertDeposit): Promise<Deposit> {
    const db = this.ensureDb();
    const [deposit] = await db.insert(deposits).values({
      ...depositData,
      id: depositData.id ?? generateId(),
      createdAt: depositData.createdAt ?? new Date(),
      updatedAt: depositData.updatedAt ?? new Date()
    }).returning();
    return deposit;
  }

  async getDepositById(id: string): Promise<Deposit | null> {
    const db = this.ensureDb();
    const [deposit] = await db.select().from(deposits).where(eq(deposits.id, id)).limit(1);
    return deposit ?? null;
  }

  async getUserDeposits(userId: string, limit?: number): Promise<Deposit[]> {
    const db = this.ensureDb();
    let q = db.select().from(deposits).where(eq(deposits.userId, userId)).orderBy(desc(deposits.createdAt));
    if (limit) q = q.limit(limit);
    return await q;
  }

  async getAllDeposits(): Promise<any[]> {
    const db = this.ensureDb();
    return await db.select({
      id: deposits.id,
      userId: deposits.userId,
      amount: deposits.amount,
      currency: deposits.currency,
      status: deposits.status,
      createdAt: deposits.createdAt,
      username: users.username,
      email: users.email
    }).from(deposits).leftJoin(users, eq(deposits.userId, users.id)).orderBy(desc(deposits.createdAt));
  }

  async updateDeposit(id: string, updates: Partial<InsertDeposit>): Promise<Deposit> {
    const db = this.ensureDb();
    const [deposit] = await db.update(deposits).set({ ...updates, updatedAt: new Date() }).where(eq(deposits.id, id)).returning();
    return deposit;
  }

  /* ---------------------------
     Shared Wallet Addresses
  ----------------------------*/
  async getSharedWalletAddresses(): Promise<SharedWalletAddress[]> {
    const db = this.ensureDb();
    return await db.select().from(sharedWalletAddresses).where(eq(sharedWalletAddresses.isActive, true));
  }

  async createOrUpdateSharedWalletAddress(addressData: InsertSharedWalletAddress): Promise<SharedWalletAddress> {
    const db = this.ensureDb();
    const [existing] = await db.select().from(sharedWalletAddresses).where(eq(sharedWalletAddresses.symbol, addressData.symbol)).limit(1);
    if (existing) {
      const [updated] = await db.update(sharedWalletAddresses).set({ ...addressData, updatedAt: new Date() }).where(eq(sharedWalletAddresses.symbol, addressData.symbol)).returning();
      return updated;
    } else {
      const [created] = await db.insert(sharedWalletAddresses).values(addressData).returning();
      return created;
    }
  }

  /* ---------------------------
     Withdrawals
  ----------------------------*/
  async createWithdrawal(withdrawalData: any): Promise<any> {
    const db = this.ensureDb();
    const [result] = await db.insert(withdrawals).values({
      id: withdrawalData.id ?? generateId(),
      userId: withdrawalData.userId,
      amount: withdrawalData.amount,
      currency: withdrawalData.currency,
      withdrawalMethod: withdrawalData.withdrawalMethod,
      destinationAddress: withdrawalData.destinationAddress,
      destinationDetails: withdrawalData.destinationDetails ?? null,
      status: withdrawalData.status ?? "pending",
      fees: withdrawalData.fees ?? "0",
      netAmount: withdrawalData.netAmount ?? null,
      confirmationToken: withdrawalData.confirmationToken ?? null,
      confirmationExpiresAt: withdrawalData.confirmationExpiresAt ? new Date(withdrawalData.confirmationExpiresAt) : null,
      requestedAt: new Date(),
      isConfirmed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return result;
  }

  async getUserWithdrawals(userId: string): Promise<any[]> {
    const db = this.ensureDb();
    return await db.select().from(withdrawals).where(eq(withdrawals.userId, userId)).orderBy(desc(withdrawals.createdAt));
  }

  async getAllWithdrawals(): Promise<any[]> {
    const db = this.ensureDb();
    return await db.select({
      id: withdrawals.id,
      userId: withdrawals.userId,
      amount: withdrawals.amount,
      currency: withdrawals.currency,
      status: withdrawals.status,
      requestedAt: withdrawals.requestedAt,
      processedAt: withdrawals.processedAt,
      completedAt: withdrawals.completedAt,
      username: users.username,
      email: users.email
    }).from(withdrawals).leftJoin(users, eq(withdrawals.userId, users.id)).orderBy(desc(withdrawals.createdAt));
  }

  async getWithdrawalById(id: string): Promise<any> {
    const db = this.ensureDb();
    const [row] = await db.select().from(withdrawals).where(eq(withdrawals.id, id)).limit(1);
    return row ?? null;
  }

  async updateWithdrawalStatus(id: string, status: string, adminNotes?: string): Promise<any> {
    const db = this.ensureDb();
    const updateData: any = { status, updatedAt: new Date() };
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (status === "approved") updateData.reviewedAt = new Date();
    if (status === "processing") updateData.processedAt = new Date();
    if (status === "completed") updateData.completedAt = new Date();

    const [result] = await db.update(withdrawals).set(updateData).where(eq(withdrawals.id, id)).returning();
    return result;
  }

  async confirmWithdrawal(userId: string, token: string): Promise<any> {
    const db = this.ensureDb();
    const [withdrawal] = await db.select().from(withdrawals).where(and(eq(withdrawals.userId, userId), eq(withdrawals.confirmationToken, token))).limit(1);
    if (!withdrawal) return null;
    if (withdrawal.confirmationExpiresAt && new Date() > new Date(withdrawal.confirmationExpiresAt)) return null;

    const [confirmed] = await db.update(withdrawals).set({
      isConfirmed: true,
      status: "under_review",
      confirmationToken: null,
      confirmationExpiresAt: null,
      updatedAt: new Date()
    }).where(eq(withdrawals.id, withdrawal.id)).returning();
    return confirmed;
  }

  async getWithdrawalLimits(userId: string): Promise<any> {
    const db = this.ensureDb();
    const [limits] = await db.select().from(withdrawalLimits).where(eq(withdrawalLimits.userId, userId)).limit(1);
    if (limits) {
      return {
        dailyLimit: parseFloat(String(limits.dailyLimit || "0")),
        monthlyLimit: parseFloat(String(limits.monthlyLimit || "0")),
        dailyUsed: parseFloat(String(limits.dailyUsed || "0")),
        monthlyUsed: parseFloat(String(limits.monthlyUsed || "0"))
      };
    }

    const [newLimits] = await db.insert(withdrawalLimits).values({
      userId,
      dailyLimit: "10000.00",
      monthlyLimit: "50000.00",
      dailyUsed: "0.00",
      monthlyUsed: "0.00",
      lastResetDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    return {
      dailyLimit: parseFloat(String(newLimits.dailyLimit)),
      monthlyLimit: parseFloat(String(newLimits.monthlyLimit)),
      dailyUsed: parseFloat(String(newLimits.dailyUsed)),
      monthlyUsed: parseFloat(String(newLimits.monthlyUsed))
    };
  }

  async setWithdrawalLimits(userId: string, limits: { dailyLimit: number; monthlyLimit: number }): Promise<any> {
    const db = this.ensureDb();
    const [result] = await db.insert(withdrawalLimits).values({
      userId,
      dailyLimit: String(limits.dailyLimit),
      monthlyLimit: String(limits.monthlyLimit),
      dailyUsed: "0.00",
      monthlyUsed: "0.00",
      lastResetDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }).onConflictDoUpdate({
      target: withdrawalLimits.userId,
      set: {
        dailyLimit: String(limits.dailyLimit),
        monthlyLimit: String(limits.monthlyLimit),
        updatedAt: new Date()
      }
    }).returning();

    return {
      dailyLimit: parseFloat(String(result.dailyLimit)),
      monthlyLimit: parseFloat(String(result.monthlyLimit)),
      dailyUsed: parseFloat(String(result.dailyUsed)),
      monthlyUsed: parseFloat(String(result.monthlyUsed))
    };
  }

  async calculateWithdrawalFees(amount: number, method: string): Promise<number> {
    try {
      const feeRates: Record<string, number> = {
        bank_transfer: 0.015,
        crypto_wallet: 0.005,
        paypal: 0.025,
        mobile_money: 0.02,
        other: 0.02
      };
      const rate = feeRates[method] ?? 0.02;
      const fee = amount * rate;
      const minFee = method === "crypto_wallet" ? 2 : 5;
      const maxFee = method === "crypto_wallet" ? 50 : 100;
      return Math.max(minFee, Math.min(fee, maxFee));
    } catch (error) {
      console.error("Error calculating withdrawal fees:", error);
      return 25;
    }
  }

  async cancelWithdrawal(userId: string, withdrawalId: string): Promise<boolean> {
    const db = this.ensureDb();
    const [result] = await db.update(withdrawals).set({ status: "cancelled", updatedAt: new Date() }).where(and(eq(withdrawals.id, withdrawalId), eq(withdrawals.userId, userId))).returning();
    return !!result;
  }

  /* ---------------------------
     Price alerts & Notifications
  ----------------------------*/
  async createPriceAlert(alertData: InsertPriceAlert): Promise<PriceAlert> {
    const db = this.ensureDb();
    const [alert] = await db.insert(priceAlerts).values({ ...alertData, id: alertData.id ?? generateId(), createdAt: new Date(), updatedAt: new Date() }).returning();
    return alert;
  }

  async getPriceAlerts(userId: string): Promise<PriceAlert[]> {
    const db = this.ensureDb();
    return await db.select().from(priceAlerts).where(eq(priceAlerts.userId, userId)).orderBy(desc(priceAlerts.createdAt));
  }

  async getPriceAlertById(id: string): Promise<PriceAlert | null> {
    const db = this.ensureDb();
    const [alert] = await db.select().from(priceAlerts).where(eq(priceAlerts.id, id)).limit(1);
    return alert ?? null;
  }

  async updatePriceAlert(id: string, updates: Partial<InsertPriceAlert>): Promise<PriceAlert | null> {
    const db = this.ensureDb();
    const [alert] = await db.update(priceAlerts).set({ ...updates, updatedAt: new Date() }).where(eq(priceAlerts.id, id)).returning();
    return alert ?? null;
  }

  async deletePriceAlert(id: string): Promise<void> {
    const db = this.ensureDb();
    await db.delete(priceAlerts).where(eq(priceAlerts.id, id));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const db = this.ensureDb();
    const [n] = await db.insert(notifications).values({ ...notification, id: notification.id ?? generateId(), createdAt: new Date(), updatedAt: new Date() }).returning();
    return n;
  }

  async getNotifications(userId: string, limit = 20): Promise<Notification[]> {
    const db = this.ensureDb();
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const db = this.ensureDb();
    await db.update(notifications).set({ isRead: true, updatedAt: new Date() }).where(eq(notifications.id, notificationId));
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const db = this.ensureDb();
    await db.delete(notifications).where(eq(notifications.id, notificationId));
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const db = this.ensureDb();
    const [row] = await db.select({ count: sql`count(*)` }).from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return Number(row?.count ?? 0);
  }

  /* ---------------------------
     News
  ----------------------------*/
  async getNewsArticles(limit = 10, category?: string, search?: string): Promise<NewsArticle[]> {
    const db = this.ensureDb();
    let q = db.select().from(newsArticles);
    if (category) q = q.where(eq(newsArticles.source, category));
    if (search) q = q.where(or(ilike(newsArticles.title, `%${search}%`), ilike(newsArticles.content, `%${search}%`)));
    return await q.orderBy(desc(newsArticles.publishedAt)).limit(limit);
  }

  async getNewsArticleById(id: string): Promise<NewsArticle | null> {
    const db = this.ensureDb();
    const [row] = await db.select().from(newsArticles).where(eq(newsArticles.id, id)).limit(1);
    return row ?? null;
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const db = this.ensureDb();
    const [created] = await db.insert(newsArticles).values({ ...article, id: article.id ?? generateId(), createdAt: new Date(), updatedAt: new Date() }).returning();
    return created;
  }

  async updateNewsArticle(id: string, updates: Partial<InsertNewsArticle>): Promise<NewsArticle | null> {
    const db = this.ensureDb();
    const [updated] = await db.update(newsArticles).set({ ...updates, updatedAt: new Date() }).where(eq(newsArticles.id, id)).returning();
    return updated ?? null;
  }

  async deleteNewsArticle(id: string): Promise<void> {
    const db = this.ensureDb();
    await db.delete(newsArticles).where(eq(newsArticles.id, id));
  }

  async getNewsAnalytics(): Promise<any> {
    const db = this.ensureDb();
    const [total] = await db.select({ count: count() }).from(newsArticles);
    const bySource = await db.select({ source: newsArticles.source, count: count() }).from(newsArticles).groupBy(newsArticles.source);
    const [recent] = await db.select({ count: count() }).from(newsArticles).where(gte(newsArticles.publishedAt, sql`NOW() - INTERVAL '7 days'`));
    return {
      totalArticles: Number(total?.count ?? 0),
      articlesBySource: bySource,
      recentArticles: Number(recent?.count ?? 0)
    };
  }

  /* ---------------------------
     KYC
  ----------------------------*/
  async createKycVerification(data: InsertKycVerification): Promise<KycVerification> {
    const db = this.ensureDb();
    const [kyc] = await db.insert(kycVerifications).values({ ...data, id: data.id ?? generateId(), createdAt: new Date(), updatedAt: new Date() }).returning();
    return kyc;
  }

  async getKycVerification(userId: string): Promise<KycVerification | null> {
    const db = this.ensureDb();
    const [kyc] = await db.select().from(kycVerifications).where(eq(kycVerifications.userId, userId)).limit(1);
    return kyc ?? null;
  }

  async updateKycVerification(id: string, data: Partial<InsertKycVerification>): Promise<KycVerification> {
    const db = this.ensureDb();
    const [kyc] = await db.update(kycVerifications).set({ ...data, updatedAt: new Date() }).where(eq(kycVerifications.id, id)).returning();
    return kyc;
  }

  /* ---------------------------
     Admin, Audit & Analytics
  ----------------------------*/
  async getAllUsers(): Promise<User[]> {
    const db = this.ensureDb();
    const result = await db.select().from(users).orderBy(desc(users.createdAt));
    // hide passwords
    return result.map(u => ({ ...u, password: undefined } as unknown as User));
  }

  async getUsers(options: { page: number; limit: number; search?: string; status?: 'active' | 'inactive'; role?: 'user' | 'admin' }): Promise<{ users: User[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const db = this.ensureDb();
    const { page, limit, search, status, role } = options;
    let q = db.select().from(users);

    if (search) {
      q = q.where(or(like(users.username, `%${search}%`), like(users.email, `%${search}%`), like(users.firstName, `%${search}%`), like(users.lastName, `%${search}%`)));
    }
    if (status) q = q.where(eq(users.isActive, status === "active"));
    if (role) q = q.where(eq(users.role, role));

    const offset = (page - 1) * limit;
    const rows = await q.orderBy(desc(users.createdAt)).limit(limit).offset(offset);

    let countQuery = db.select({ count: count() }).from(users);
    if (search) countQuery = countQuery.where(or(like(users.username, `%${search}%`), like(users.email, `%${search}%`), like(users.firstName, `%${search}%`), like(users.lastName, `%${search}%`)));
    if (status) countQuery = countQuery.where(eq(users.isActive, status === "active"));
    if (role) countQuery = countQuery.where(eq(users.role, role));

    const [{ count: totalCount }] = await countQuery;
    const total = Number(totalCount ?? 0);

    return {
      users: rows.map(r => ({ ...r, password: undefined } as unknown as User)),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async logAdminAction(action: { adminId: string; action: string; targetId?: string; targetUserId?: string; details?: any; timestamp: Date }): Promise<void> {
    const db = this.ensureDb();
    try {
      await db.insert(auditLogs).values({
        id: generateId(),
        adminId: action.adminId,
        action: action.action,
        targetId: action.targetId ?? null,
        targetUserId: action.targetUserId ?? null,
        details: action.details ? JSON.stringify(action.details) : null,
        timestamp: action.timestamp,
        createdAt: new Date()
      });
    } catch (error) {
      console.error("Error logging admin action:", error);
    }
  }

  async createAuditLog(logData: { adminId: string; action: string; targetId: string; details: any; ipAddress: string; userAgent: string }): Promise<boolean> {
    const db = this.ensureDb();
    try {
      await db.insert(auditLogs).values({
        id: generateId(),
        adminId: logData.adminId,
        action: logData.action,
        targetId: logData.targetId,
        details: JSON.stringify(logData.details),
        ipAddress: logData.ipAddress,
        userAgent: logData.userAgent,
        timestamp: new Date(),
        createdAt: new Date()
      });
      return true;
    } catch (error) {
      console.error("Error creating audit log:", error);
      return false;
    }
  }

  async getAuditLogs(options: { page: number; limit: number; action?: string; userId?: string }): Promise<{ logs: any[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const db = this.ensureDb();
    const { page, limit, action, userId } = options;
    let q = db.select().from(auditLogs);
    if (action) q = q.where(eq(auditLogs.action, action));
    if (userId) q = q.where(eq(auditLogs.adminId, userId));
    const offset = (page - 1) * limit;
    const rows = await q.orderBy(desc(auditLogs.timestamp)).limit(limit).offset(offset);
    const [{ count: totalCount }] = await db.select({ count: count() }).from(auditLogs);
    const total = Number(totalCount ?? 0);
    return { logs: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async getAnalyticsOverview(): Promise<any> {
    const db = this.ensureDb();
    const [userCount] = await db.select({ count: sql`count(*)` }).from(users);
    const [transactionCount] = await db.select({ count: sql`count(*)` }).from(transactions);
    const [depositCount] = await db.select({ count: sql`count(*)` }).from(deposits);
    const [totalVolume] = await db.select({ total: sum(transactions.total) }).from(transactions).where(eq(transactions.status, "completed"));
    return {
      totalUsers: Number(userCount?.count ?? 0),
      totalTransactions: Number(transactionCount?.count ?? 0),
      totalDeposits: Number(depositCount?.count ?? 0),
      totalVolume: Number(totalVolume?.total ?? 0)
    };
  }

  async getRevenueAnalytics(period: string): Promise<any[]> {
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const revenue: any[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      revenue.push({
        date: date.toISOString().split("T")[0],
        revenue: Math.round(Math.random() * 10000 + 5000),
        transactions: Math.floor(Math.random() * 100) + 50
      });
    }
    return revenue;
  }

  /* ---------------------------
     System helpers & initial data
  ----------------------------*/
  async createInitialUsers(): Promise<void> {
    try {
      const existingDemo = await this.getUserByEmail("demo@example.com");
      if (existingDemo) return;

      const demoPasswordHash = await hashPassword("demo123");
      await this.db.insert(users).values({
        id: "demo-user-id",
        username: "demo",
        email: "demo@example.com",
        password: demoPasswordHash,
        firstName: "Demo",
        lastName: "User",
        role: "user",
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }).onConflictDoNothing();

      const testPasswordHash = await hashPassword("test123");
      await this.db.insert(users).values({
        id: "test-user-id",
        username: "testuser",
        email: "test@bitpanda.com",
        password: testPasswordHash,
        firstName: "Test",
        lastName: "User",
        role: "user",
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }).onConflictDoNothing();

      const adminPasswordHash = await hashPassword("admin123");
      await this.db.insert(users).values({
        id: "admin-user-id",
        username: "admin",
        email: "admin@example.com",
        password: adminPasswordHash,
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }).onConflictDoNothing();

      console.log("✅ Initial demo/test/admin users created (if they were missing)");
    } catch (error) {
      console.error("Failed to create initial users:", error);
    }
  }
}

export const storage = new DatabaseStorage();