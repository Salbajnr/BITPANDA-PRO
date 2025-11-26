// storage.ts (extended with reporting helpers)
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";
import { inArray, and, sql } from "drizzle-orm";
import { InferModel } from "drizzle-orm";

// --- Initialize database with self-signed SSL support ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // allows self-signed certs
  },
});

export const db = drizzle(pool);

// --- Type Definitions ---
type UserFull = InferModel<typeof schema.users> & {
  portfolios?: PortfolioFull[];
  transactions?: TransactionFull[];
  deposits?: DepositFull[];
  balanceAdjustments?: BalanceAdjustmentFull[];
};
type PortfolioFull = InferModel<typeof schema.portfolios> & { holdings?: HoldingFull[] };
type HoldingFull = InferModel<typeof schema.holdings>;
type TransactionFull = InferModel<typeof schema.transactions>;
type DepositFull = InferModel<typeof schema.deposits>;
type BalanceAdjustmentFull = InferModel<typeof schema.balanceAdjustments>;

// --- Storage Class ---
class DatabaseStorage {
  // --- Get User by ID with all relations ---
  async getUserById(userId: string): Promise<UserFull | null> {
    const user = await db.select().from(schema.users).where(schema.users.id.eq(userId)).get();
    if (!user) return null;

    const portfolios = await db.select().from(schema.portfolios).where(schema.portfolios.userId.eq(userId));
    const portfolioIds = portfolios.map(p => p.id);
    const allHoldings = await db.select().from(schema.holdings).where(inArray(schema.holdings.portfolioId, portfolioIds));
    const portfoliosWithHoldings = portfolios.map(p => ({
      ...p,
      holdings: allHoldings.filter(h => h.portfolioId === p.id),
    }));

    const transactions = await db.select().from(schema.transactions).where(schema.transactions.userId.eq(userId));
    const deposits = await db.select().from(schema.deposits).where(schema.deposits.userId.eq(userId));
    const balanceAdjustments = await db.select().from(schema.balanceAdjustments).where(schema.balanceAdjustments.targetUserId.eq(userId));

    return {
      ...user,
      portfolios: portfoliosWithHoldings,
      transactions,
      deposits,
      balanceAdjustments,
    };
  }

  // --- Generic Get All with optional filters ---
  async getAll<T extends keyof typeof schema>(
    table: T,
    filter?: Partial<InferModel<typeof schema[T]>>,
    options?: { limit?: number; offset?: number }
  ): Promise<any[]> {
    let query = db.select().from(schema[table]);
    if (filter) {
      for (const key in filter) {
        // @ts-ignore
        query = query.where(schema[table][key].eq(filter[key]));
      }
    }
    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset) query = query.offset(options.offset);
    return query.all();
  }

  // --- Create/Insert record ---
  async create<T extends keyof typeof schema>(
    table: T,
    data: Partial<InferModel<typeof schema[T]>>
  ): Promise<any> {
    return db.insert(schema[table]).values(data).returning().get();
  }

  // --- Update record ---
  async update<T extends keyof typeof schema>(
    table: T,
    id: string,
    data: Partial<InferModel<typeof schema[T]>>
  ): Promise<any> {
    return db.update(schema[table])
      .set(data)
      .where(schema[table].id.eq(id))
      .returning()
      .get();
  }

  // --- Delete record ---
  async delete<T extends keyof typeof schema>(table: T, id: string): Promise<void> {
    await db.delete(schema[table]).where(schema[table].id.eq(id));
  }

  // --- Transactional Nested Insert Example ---
  async createUserFull(userData: Partial<UserFull>, portfoliosData: Partial<PortfolioFull & { holdings?: HoldingFull[] }>[], transactionsData?: Partial<TransactionFull>[], depositsData?: Partial<DepositFull>[], balanceAdjustmentsData?: Partial<BalanceAdjustmentFull>[]) {
    return db.transaction(async (tx) => {
      const user = await tx.insert(schema.users).values(userData).returning().get();

      for (const p of portfoliosData) {
        const portfolio = await tx.insert(schema.portfolios).values({ ...p, userId: user.id }).returning().get();
        if (p.holdings?.length) {
          for (const h of p.holdings) {
            await tx.insert(schema.holdings).values({ ...h, portfolioId: portfolio.id });
          }
        }
      }

      if (transactionsData?.length) {
        for (const t of transactionsData) {
          await tx.insert(schema.transactions).values({ ...t, userId: user.id });
        }
      }

      if (depositsData?.length) {
        for (const d of depositsData) {
          await tx.insert(schema.deposits).values({ ...d, userId: user.id });
        }
      }

      if (balanceAdjustmentsData?.length) {
        for (const b of balanceAdjustmentsData) {
          await tx.insert(schema.balanceAdjustments).values({ ...b, targetUserId: user.id });
        }
      }

      return user;
    });
  }

  // --- Reporting & Analytics Helpers ---

  // Get transactions by portfolio
  async getTransactionsByPortfolio(portfolioId: string, options?: { assetType?: string; limit?: number; startDate?: Date; endDate?: Date }) {
    let query = db.select().from(schema.transactions).where(schema.transactions.portfolioId.eq(portfolioId));
    if (options?.assetType) query = query.where(schema.transactions.assetType.eq(options.assetType));
    if (options?.startDate) query = query.where(schema.transactions.createdAt.gte(options.startDate));
    if (options?.endDate) query = query.where(schema.transactions.createdAt.lte(options.endDate));
    if (options?.limit) query = query.limit(options.limit);
    return query.all();
  }

  // Get deposits by status, user, and date range
  async getDeposits(options?: { status?: string; userId?: string; startDate?: Date; endDate?: Date }) {
    let query = db.select().from(schema.deposits);
    if (options?.status) query = query.where(schema.deposits.status.eq(options.status));
    if (options?.userId) query = query.where(schema.deposits.userId.eq(options.userId));
    if (options?.startDate) query = query.where(schema.deposits.createdAt.gte(options.startDate));
    if (options?.endDate) query = query.where(schema.deposits.createdAt.lte(options.endDate));
    return query.all();
  }

  // Get portfolio summary (total value & available cash)
  async getPortfolioSummary(userId: string) {
    const portfolios = await db.select().from(schema.portfolios).where(schema.portfolios.userId.eq(userId));
    const portfolioIds = portfolios.map(p => p.id);
    const holdings = await db.select().from(schema.holdings).where(inArray(schema.holdings.portfolioId, portfolioIds));

    const summary = portfolios.map(p => {
      const portfolioHoldings = holdings.filter(h => h.portfolioId === p.id);
      const totalHoldingsValue = portfolioHoldings.reduce((sum, h) => sum + parseFloat(h.currentPrice.toString()) * parseFloat(h.amount.toString()), 0);
      return {
        portfolioId: p.id,
        totalValue: parseFloat(p.totalValue.toString()) + totalHoldingsValue,
        availableCash: parseFloat(p.availableCash.toString()),
        holdingsCount: portfolioHoldings.length,
      };
    });
    return summary;
  }
}

// --- Export singleton ---
export const storage = new DatabaseStorage();