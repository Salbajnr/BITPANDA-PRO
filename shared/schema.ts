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
  walletBalance: decimal("wallet_balance", { precision: 20, scale: 8 }).notNull().default('0'),
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
export const transactions = pgTable('transactions', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type').notNull(), // 'buy', 'sell', 'deposit', 'withdrawal'
  symbol: text('symbol').notNull(),
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull(),
  price: decimal('price', { precision: 20, scale: 8 }).notNull(),
  total: decimal('total', { precision: 20, scale: 8 }).notNull(),
  status: text('status').notNull().default('pending'), // 'pending', 'completed', 'failed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Deposits
export const deposits = pgTable('deposits', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: text('user_id').notNull().references(() => users.id),
  paymentMethod: text('payment_method').notNull(), // 'bybit', 'binance', 'crypto.com', 'okx', 'kucoin'
  cryptocurrency: text('cryptocurrency').notNull(), // 'BTC', 'ETH', 'USDT', etc.
  depositAmount: decimal('deposit_amount', { precision: 20, scale: 8 }).notNull(),
  depositAddress: text('deposit_address').notNull(),
  proofOfPayment: text('proof_of_payment'), // file path or transaction hash
  proofType: text('proof_type'), // 'file', 'hash'
  status: text('status').notNull().default('pending'), // 'pending', 'approved', 'rejected'
  rejectionReason: text('rejection_reason'),
  approvedBy: text('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(), // 'deposit', 'withdrawal', 'trade', 'security', 'general'
  isRead: boolean('is_read').notNull().default(false),
  relatedId: text('related_id'), // reference to deposit/transaction id
  createdAt: timestamp('created_at').defaultNow().notNull(),
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

// Password reset tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: varchar("token").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// OTP verification tokens
export const otpTokens = pgTable("otp_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull(),
  token: varchar("token", { length: 6 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'registration', 'password_reset', '2fa'
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false).notNull(),
  attempts: decimal("attempts", { precision: 2, scale: 0 }).default('0').notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// KYC verification status enum
export const kycStatusEnum = pgEnum('kyc_status', ['pending', 'under_review', 'approved', 'rejected']);

// KYC verification
export const kycVerifications = pgTable("kyc_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  nationality: varchar("nationality").notNull(),
  address: text("address").notNull(),
  city: varchar("city").notNull(),
  postalCode: varchar("postal_code").notNull(),
  country: varchar("country").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  documentType: varchar("document_type").notNull(), // 'passport', 'driver_license', 'national_id'
  documentNumber: varchar("document_number").notNull(),
  documentFrontImageUrl: varchar("document_front_image_url").notNull(),
  documentBackImageUrl: varchar("document_back_image_url"),
  selfieImageUrl: varchar("selfie_image_url").notNull(),
  status: kycStatusEnum("status").default('pending').notNull(),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  rejectionReason: text("rejection_reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Support ticket status enum
export const ticketStatusEnum = pgEnum('ticket_status', ['open', 'in_progress', 'resolved', 'closed']);
export const ticketPriorityEnum = pgEnum('ticket_priority', ['low', 'medium', 'high', 'urgent']);

// Support tickets
export const supportTickets = pgTable("support_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(), // 'technical', 'account', 'trading', 'kyc', 'general'
  priority: ticketPriorityEnum("priority").default('medium').notNull(),
  status: ticketStatusEnum("status").default('open').notNull(),
  assignedTo: varchar("assigned_to").references(() => users.id),
  attachmentUrls: jsonb("attachment_urls").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Support ticket messages/chat
export const supportMessages = pgTable("support_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: varchar("ticket_id").references(() => supportTickets.id, { onDelete: 'cascade' }).notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  isInternal: boolean("is_internal").default(false).notNull(), // true for admin-only notes
  attachmentUrls: jsonb("attachment_urls").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Live chat sessions
export const liveChatSessions = pgTable("live_chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  agentId: varchar("agent_id").references(() => users.id),
  status: varchar("status").default('waiting').notNull(), // 'waiting', 'active', 'ended'
  subject: varchar("subject"),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  rating: decimal("rating", { precision: 2, scale: 1 }), // 1.0 to 5.0
  feedback: text("feedback"),
});

// Live chat messages
export const liveChatMessages = pgTable("live_chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => liveChatSessions.id, { onDelete: 'cascade' }).notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  messageType: varchar("message_type").default('text').notNull(), // 'text', 'image', 'file', 'system'
  attachmentUrl: varchar("attachment_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User preferences and settings
export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  emailNotifications: boolean("email_notifications").default(true).notNull(),
  tradingAlerts: boolean("trading_alerts").default(true).notNull(),
  priceAlerts: boolean("price_alerts").default(false).notNull(),
  newsUpdates: boolean("news_updates").default(true).notNull(),
  marketingEmails: boolean("marketing_emails").default(false).notNull(),
  twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
  sessionTimeout: decimal("session_timeout", { precision: 3, scale: 0 }).default('24').notNull(), // hours
  loginNotifications: boolean("login_notifications").default(true).notNull(),
  theme: varchar("theme").default('light').notNull(), // 'light', 'dark', 'auto'
  language: varchar("language").default('en').notNull(),
  timezone: varchar("timezone").default('UTC').notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  deposits: many(deposits),
  notifications: many(notifications),
  transactions: many(transactions),
}));

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  user: one(users, {
    fields: [portfolios.userId],
    references: [users.id],
  }),
  holdings: many(holdings),
}));

export const holdingsRelations = relations(holdings, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [holdings.portfolioId],
    references: [portfolios.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const depositsRelations = relations(deposits, ({ one }) => ({
  user: one(users, {
    fields: [deposits.userId],
    references: [users.id],
  }),
  approvedBy: one(users, {
    fields: [deposits.approvedBy],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
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
  updatedAt: true,
});

export const insertDepositSchema = createInsertSchema(deposits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
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

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  createdAt: true,
});

export const insertOtpTokenSchema = createInsertSchema(otpTokens).omit({
  id: true,
  createdAt: true,
});

export const insertKycVerificationSchema = createInsertSchema(kycVerifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupportMessageSchema = createInsertSchema(supportMessages).omit({
  id: true,
  createdAt: true,
});

export const insertLiveChatSessionSchema = createInsertSchema(liveChatSessions).omit({
  id: true,
  startedAt: true,
});

export const insertLiveChatMessageSchema = createInsertSchema(liveChatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
export type Deposit = typeof deposits.$inferSelect;
export type InsertDeposit = z.infer<typeof insertDepositSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type BalanceAdjustment = typeof balanceAdjustments.$inferSelect;
export type InsertBalanceAdjustment = z.infer<typeof insertBalanceAdjustmentSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type OtpToken = typeof otpTokens.$inferSelect;
export type InsertOtpToken = z.infer<typeof insertOtpTokenSchema>;
export type KycVerification = typeof kycVerifications.$inferSelect;
export type InsertKycVerification = z.infer<typeof insertKycVerificationSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportMessage = typeof supportMessages.$inferSelect;
export type InsertSupportMessage = z.infer<typeof insertSupportMessageSchema>;
export type LiveChatSession = typeof liveChatSessions.$inferSelect;
export type InsertLiveChatSession = z.infer<typeof insertLiveChatSessionSchema>;
export type LiveChatMessage = typeof liveChatMessages.$inferSelect;
export type InsertLiveChatMessage = z.infer<typeof insertLiveChatMessageSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;