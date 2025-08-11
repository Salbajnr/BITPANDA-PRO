import { sql } from 'drizzle-orm';
import {
  boolean,
  decimal,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User roles enum
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('user').notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User portfolios
export const portfolios = pgTable("portfolios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  totalValue: decimal("total_value", { precision: 20, scale: 8 }).default('0.00').notNull(),
  availableCash: decimal("available_cash", { precision: 20, scale: 8 }).default('0.00').notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Crypto holdings
export const holdings = pgTable("holdings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  portfolioId: varchar("portfolio_id").references(() => portfolios.id, { onDelete: 'cascade' }).notNull(),
  symbol: varchar("symbol", { length: 10 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  averagePurchasePrice: decimal("average_purchase_price", { precision: 20, scale: 8 }).notNull(),
  currentPrice: decimal("current_price", { precision: 20, scale: 8 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Trading transactions
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  portfolioId: varchar("portfolio_id").references(() => portfolios.id, { onDelete: 'cascade' }).notNull(),
  type: varchar("type", { length: 10 }).notNull(), // 'buy' or 'sell'
  symbol: varchar("symbol", { length: 10 }).notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  total: decimal("total", { precision: 20, scale: 8 }).notNull(),
  fees: decimal("fees", { precision: 20, scale: 8 }).default('0').notNull(),
  status: varchar("status", { length: 20 }).default('completed').notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin balance adjustments (for simulation)
export const balanceAdjustments = pgTable("balance_adjustments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").references(() => users.id).notNull(),
  targetUserId: varchar("target_user_id").references(() => users.id).notNull(),
  adjustmentType: varchar("adjustment_type", { length: 20 }).notNull(), // 'add', 'remove', 'set'
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

// News articles
export const newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content"),
  excerpt: text("excerpt"),
  imageUrl: varchar("image_url"),
  source: varchar("source", { length: 100 }).notNull(),
  sourceUrl: varchar("source_url"),
  publishedAt: timestamp("published_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  portfolio: one(portfolios, {
    fields: [users.id],
    references: [portfolios.userId],
  }),
  adminAdjustments: many(balanceAdjustments, {
    relationName: 'adminAdjustments',
  }),
  targetAdjustments: many(balanceAdjustments, {
    relationName: 'targetAdjustments',
  }),
}));

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  user: one(users, {
    fields: [portfolios.userId],
    references: [users.id],
  }),
  holdings: many(holdings),
  transactions: many(transactions),
}));

export const holdingsRelations = relations(holdings, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [holdings.portfolioId],
    references: [portfolios.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [transactions.portfolioId],
    references: [portfolios.id],
  }),
}));

export const balanceAdjustmentsRelations = relations(balanceAdjustments, ({ one }) => ({
  admin: one(users, {
    fields: [balanceAdjustments.adminId],
    references: [users.id],
    relationName: 'adminAdjustments',
  }),
  targetUser: one(users, {
    fields: [balanceAdjustments.targetUserId],
    references: [users.id],
    relationName: 'targetAdjustments',
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHoldingSchema = createInsertSchema(holdings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertBalanceAdjustmentSchema = createInsertSchema(balanceAdjustments).omit({
  id: true,
  createdAt: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Holding = typeof holdings.$inferSelect;
export type InsertHolding = z.infer<typeof insertHoldingSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type BalanceAdjustment = typeof balanceAdjustments.$inferSelect;
export type InsertBalanceAdjustment = z.infer<typeof insertBalanceAdjustmentSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
