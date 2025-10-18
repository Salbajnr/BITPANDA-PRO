import { sql } from 'drizzle-orm';
import { boolean, decimal, index, jsonb, pgEnum, pgTable, text, timestamp, varchar, numeric, integer, serial, json, } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from 'nanoid';
// Helper function to generate a unique ID
const generateUniqueId = () => nanoid();
// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable("sessions", {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
}, (table) => [index("IDX_session_expire").on(table.expire)]);
// Enums for the platform
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const assetTypeEnum = pgEnum('asset_type', ['crypto', 'metal']);
export const transactionTypeEnum = pgEnum('transaction_type', ['buy', 'sell', 'deposit', 'withdrawal']);
export const depositStatusEnum = pgEnum('deposit_status', ['pending', 'approved', 'rejected']);
export const paymentMethodEnum = pgEnum('payment_method', ['binance', 'bybit', 'crypto_com', 'bank_transfer', 'other']);
// User storage table
export const users = pgTable("users", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    username: varchar("username").unique().notNull(),
    email: varchar("email").unique().notNull(),
    password: varchar("password").notNull(),
    firstName: varchar("first_name").default('').notNull(),
    lastName: varchar("last_name").default('').notNull(),
    profileImageUrl: varchar("profile_image_url"),
    supabaseUid: varchar("supabase_uid").unique(),
    displayName: varchar("display_name"),
    photoURL: varchar("photo_url"),
    role: userRoleEnum("role").default('user').notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    walletBalance: decimal("wallet_balance", { precision: 20, scale: 8 }).notNull().default('0'),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// User portfolios
export const portfolios = pgTable("portfolios", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    totalValue: decimal("total_value", { precision: 20, scale: 8 }).default('0.00').notNull(),
    availableCash: decimal("available_cash", { precision: 20, scale: 8 }).default('0.00').notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Holdings (both crypto and metals)
export const holdings = pgTable("holdings", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    portfolioId: varchar("portfolio_id").references(() => portfolios.id, { onDelete: 'cascade' }).notNull(),
    assetType: assetTypeEnum("asset_type").notNull(),
    symbol: varchar("symbol", { length: 10 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
    averagePurchasePrice: decimal("average_purchase_price", { precision: 20, scale: 8 }).notNull(),
    currentPrice: decimal("current_price", { precision: 20, scale: 8 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Trading transactions (enhanced for both crypto and metals)
export const transactions = pgTable('transactions', {
    id: text('id').primaryKey().default(sql `gen_random_uuid()`),
    userId: text('user_id').notNull().references(() => users.id),
    type: transactionTypeEnum('type').notNull(),
    assetType: assetTypeEnum('asset_type').notNull(),
    symbol: text('symbol').notNull(),
    amount: decimal('amount', { precision: 20, scale: 8 }).notNull(),
    price: decimal('price', { precision: 20, scale: 8 }).notNull(),
    total: decimal('total', { precision: 20, scale: 8 }).notNull(),
    status: text('status').notNull().default('pending'), // 'pending', 'completed', 'failed'
    fees: decimal('fees', { precision: 20, scale: 8 }).default('0').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Enhanced deposits with proof of payment
export const deposits = pgTable('deposits', {
    id: text('id').primaryKey().default(sql `gen_random_uuid()`),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    amount: numeric('amount', { precision: 20, scale: 8 }).notNull(),
    currency: text('currency').notNull().default('USD'),
    assetType: assetTypeEnum('asset_type').notNull().default('crypto'),
    paymentMethod: paymentMethodEnum('payment_method').notNull(),
    status: depositStatusEnum('status').notNull().default('pending'),
    rejectionReason: text('rejection_reason'),
    proofImageUrl: text('proof_image_url'), // URL to uploaded proof of payment
    adminNotes: text('admin_notes'),
    approvedById: text('approved_by_id').references(() => users.id),
    approvedAt: timestamp('approved_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Precious metals pricing table
export const metalsPricing = pgTable('metals_pricing', {
    id: text('id').primaryKey().default(sql `gen_random_uuid()`),
    symbol: text('symbol').notNull(), // 'GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'
    name: text('name').notNull(),
    pricePerOunce: numeric('price_per_ounce', { precision: 20, scale: 8 }).notNull(),
    changePercent24h: numeric('change_percent_24h', { precision: 10, scale: 4 }),
    lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});
// Platform settings and admin controls
export const platformSettings = pgTable('platform_settings', {
    id: text('id').primaryKey().default(sql `gen_random_uuid()`),
    key: text('key').notNull().unique(),
    value: text('value').notNull(),
    description: text('description'),
    updatedById: text('updated_by_id').references(() => users.id),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// User preferences and settings
export const userSettings = pgTable('user_settings', {
    id: text('id').primaryKey().default(sql `gen_random_uuid()`),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
    preferredCurrency: text('preferred_currency').default('USD').notNull(),
    emailNotifications: boolean('email_notifications').default(true).notNull(),
    priceAlerts: boolean('price_alerts').default(true).notNull(),
    darkMode: boolean('dark_mode').default(false).notNull(),
    language: text('language').default('en').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const balanceAdjustments = pgTable('balance_adjustments', {
    id: text('id').primaryKey().default(sql `gen_random_uuid()`),
    adminId: text('admin_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    targetUserId: text('target_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    adjustmentType: text('adjustment_type').notNull(), // 'add', 'remove', 'set'
    amount: numeric('amount', { precision: 20, scale: 8 }).notNull(),
    currency: text('currency').notNull().default('USD'),
    reason: text('reason'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
// Shared wallet addresses - all users will use same addresses
export const sharedWalletAddresses = pgTable('shared_wallet_addresses', {
    id: text('id').primaryKey().default(sql `gen_random_uuid()`),
    symbol: text('symbol').notNull().unique(), // BTC, ETH, USDT, etc.
    name: text('name').notNull(), // Bitcoin, Ethereum, Tether, etc.
    address: text('address').notNull(),
    network: text('network').notNull(), // mainnet, polygon, bsc, etc.
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// News articles
export const newsArticles = pgTable("news_articles", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
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
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    token: varchar("token").unique().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    used: boolean("used").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
// OTP verification tokens
export const otpTokens = pgTable("otp_tokens", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
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
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
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
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    title: varchar("title").notNull(),
    description: text("description").notNull(),
    category: varchar("category").notNull(), // 'technical', 'account', 'trading', 'kyc', 'general'
    priority: ticketPriorityEnum("priority").default('medium').notNull(),
    status: ticketStatusEnum("status").default('open').notNull(),
    assignedTo: varchar("assigned_to").references(() => users.id),
    attachmentUrls: jsonb("attachment_urls").$type().default([]),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Support ticket messages/chat
export const supportMessages = pgTable("support_messages", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    ticketId: varchar("ticket_id").references(() => supportTickets.id, { onDelete: 'cascade' }).notNull(),
    senderId: varchar("sender_id").references(() => users.id).notNull(),
    message: text("message").notNull(),
    isInternal: boolean("is_internal").default(false).notNull(), // true for admin-only notes
    attachmentUrls: jsonb("attachment_urls").$type().default([]),
    createdAt: timestamp("created_at").defaultNow(),
});
// Withdrawal status and method enums
export const withdrawalStatusEnum = pgEnum('withdrawal_status', ['pending', 'under_review', 'approved', 'rejected', 'processing', 'completed', 'failed']);
export const withdrawalMethodEnum = pgEnum('withdrawal_method', ['bank_transfer', 'crypto_wallet', 'paypal', 'other']);
// Withdrawals table
export const withdrawals = pgTable('withdrawals', {
    id: text('id').primaryKey().default(sql `gen_random_uuid()`),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    amount: numeric('amount', { precision: 20, scale: 8 }).notNull(),
    currency: text('currency').notNull().default('USD'),
    withdrawalMethod: withdrawalMethodEnum('withdrawal_method').notNull(),
    destinationAddress: text('destination_address'), // Bank account, wallet address, etc.
    destinationDetails: jsonb('destination_details'), // Additional details like routing number, etc.
    status: withdrawalStatusEnum('status').notNull().default('pending'),
    requestedAt: timestamp('requested_at').defaultNow().notNull(),
    processedAt: timestamp('processed_at'),
    completedAt: timestamp('completed_at'),
    rejectionReason: text('rejection_reason'),
    adminNotes: text('admin_notes'),
    transactionHash: text('transaction_hash'), // For crypto withdrawals
    fees: numeric('fees', { precision: 20, scale: 8 }).default('0').notNull(),
    netAmount: numeric('net_amount', { precision: 20, scale: 8 }).notNull(), // Amount after fees
    reviewedById: text('reviewed_by_id').references(() => users.id),
    reviewedAt: timestamp('reviewed_at'),
    confirmationToken: text('confirmation_token'), // For email confirmation
    confirmationExpiresAt: timestamp('confirmation_expires_at'),
    isConfirmed: boolean('is_confirmed').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Withdrawal limits table
export const withdrawalLimits = pgTable('withdrawal_limits', {
    id: text('id').primaryKey().default(sql `gen_random_uuid()`),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
    dailyLimit: numeric('daily_limit', { precision: 20, scale: 8 }).default('10000').notNull(),
    monthlyLimit: numeric('monthly_limit', { precision: 20, scale: 8 }).default('50000').notNull(),
    dailyUsed: numeric('daily_used', { precision: 20, scale: 8 }).default('0').notNull(),
    monthlyUsed: numeric('monthly_used', { precision: 20, scale: 8 }).default('0').notNull(),
    lastResetDate: timestamp('last_reset_date').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Live chat sessions
export const liveChatSessions = pgTable("live_chat_sessions", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    agentId: varchar("agent_id").references(() => users.id),
    agentName: varchar("agent_name"),
    status: varchar("status").default('waiting').notNull(), // 'waiting', 'active', 'ended'
    subject: varchar("subject"),
    startedAt: timestamp("started_at").defaultNow(),
    endedAt: timestamp("ended_at"),
    rating: integer("rating"), // 1-5 stars
    feedback: text("feedback"),
});
// Live chat messages
export const liveChatMessages = pgTable("live_chat_messages", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    sessionId: varchar("session_id").references(() => liveChatSessions.id, { onDelete: 'cascade' }).notNull(),
    senderId: varchar("sender_id").references(() => users.id).notNull(),
    message: text("message").notNull(),
    messageType: varchar("message_type").default('text').notNull(), // 'text', 'image', 'file', 'system'
    attachmentUrl: varchar("attachment_url"),
    createdAt: timestamp("created_at").defaultNow(),
});
// User preferences and settings
export const userPreferences = pgTable("user_preferences", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
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
// Price Alerts Table
export const priceAlerts = pgTable("price_alerts", {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    symbol: text("symbol").notNull(),
    targetPrice: text("target_price").notNull(),
    alertType: text("alert_type").notNull().default('above'), // 'above' or 'below'
    isActive: boolean("is_active").default(true),
    isTriggered: boolean("is_triggered").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});
// Investment Plans
export const investmentPlans = pgTable("investment_plans", {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    planId: text("plan_id").notNull(),
    planName: text("plan_name").notNull(),
    amount: text("amount").notNull(),
    currentValue: text("current_value").notNull(),
    expectedReturn: text("expected_return"),
    actualReturn: text("actual_return"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at").defaultNow(),
});
// Savings Plans
export const savingsPlans = pgTable("savings_plans", {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    planId: text("plan_id").notNull(),
    planName: text("plan_name").notNull(),
    amount: text("amount").notNull(),
    frequency: text("frequency").notNull(),
    totalSaved: text("total_saved").notNull().default("0"),
    interestEarned: text("interest_earned").notNull().default("0"),
    nextDeposit: timestamp("next_deposit"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    autoDeposit: boolean("auto_deposit").default(false),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at").defaultNow(),
});
// Staking Positions
export const stakingPositions = pgTable("staking_positions", {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    assetSymbol: text("asset_symbol").notNull(),
    amount: text("amount").notNull(),
    apy: text("apy").notNull(),
    stakingTerm: text("staking_term").notNull(),
    autoReinvest: boolean("auto_reinvest").default(false),
    totalRewards: text("total_rewards").default("0"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at").defaultNow(),
});
// Lending Positions
export const lendingPositions = pgTable("lending_positions", {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    assetSymbol: text("asset_symbol").notNull(),
    amount: text("amount").notNull(),
    apy: text("apy").notNull(),
    type: text("type").notNull(), // 'lend' or 'borrow'
    totalEarned: text("total_earned").default("0"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at").defaultNow(),
});
// Loans
export const loans = pgTable("loans", {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    assetSymbol: text("asset_symbol").notNull(),
    amount: text("amount").notNull(),
    collateralSymbol: text("collateral_symbol").notNull(),
    collateralAmount: text("collateral_amount").notNull(),
    interestRate: text("interest_rate").notNull(),
    loanTerm: text("loan_term").notNull(),
    totalInterest: text("total_interest").default("0"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    repaymentDate: timestamp("repayment_date"),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at").defaultNow(),
});
// Audit Logs
export const auditLogs = pgTable("audit_logs", {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    adminId: text("admin_id").notNull().references(() => users.id),
    action: text("action").notNull(),
    targetId: text("target_id"),
    targetUserId: text("target_user_id").references(() => users.id),
    details: text("details"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    timestamp: timestamp("timestamp").notNull().defaultNow(),
});
// Notification schema and types
export const notifications = pgTable('notifications', {
    id: serial('id').primaryKey(),
    userId: varchar('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 50 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    read: boolean('read').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});
export const priceHistory = pgTable('price_history', {
    id: serial('id').primaryKey(),
    symbol: varchar('symbol', { length: 20 }).notNull(),
    price: numeric('price', { precision: 20, scale: 8 }).notNull(),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
    symbolIdx: index('price_history_symbol_idx').on(table.symbol),
    timestampIdx: index('price_history_timestamp_idx').on(table.timestamp),
}));
export const insertNotificationSchema = createInsertSchema(notifications);
export const selectNotificationSchema = createSelectSchema(notifications);
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
export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export const insertWithdrawalLimitSchema = createInsertSchema(withdrawalLimits).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export const insertSharedWalletAddressSchema = createInsertSchema(sharedWalletAddresses).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export const insertInvestmentPlanSchema = createInsertSchema(investmentPlans).omit({
    id: true,
    createdAt: true,
});
export const insertSavingsPlanSchema = createInsertSchema(savingsPlans).omit({
    id: true,
    createdAt: true,
});
export const insertStakingPositionSchema = createInsertSchema(stakingPositions).omit({
    id: true,
    createdAt: true,
});
export const insertLendingPositionSchema = createInsertSchema(lendingPositions).omit({
    id: true,
    createdAt: true,
});
export const insertLoanSchema = createInsertSchema(loans).omit({
    id: true,
    createdAt: true,
});
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
    id: true,
    timestamp: true,
});
// New tables for watchlist and advanced orders
export const watchlist = pgTable('watchlist', {
    id: text('id').primaryKey().$defaultFn(() => nanoid()),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    symbols: text('symbols').array().notNull().default(sql `'{}'`),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export const advancedOrders = pgTable('advanced_orders', {
    id: text('id').primaryKey().$defaultFn(() => nanoid()),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    symbol: text('symbol').notNull(),
    orderType: text('order_type').notNull(), // 'limit', 'stop_loss', 'take_profit', 'trailing_stop'
    side: text('side').notNull(), // 'buy', 'sell'
    amount: text('amount').notNull(),
    triggerPrice: text('trigger_price'),
    limitPrice: text('limit_price'),
    trailingPercent: text('trailing_percent'),
    status: text('status').notNull().default('pending'), // 'pending', 'triggered', 'filled', 'cancelled'
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    filledAt: timestamp('filled_at'),
});
// API Keys schema and types
export const apiKeys = pgTable("api_keys", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    keyHash: text("key_hash").notNull().unique(),
    permissions: json("permissions").$type().notNull(),
    isActive: boolean("is_active").notNull().default(true),
    rateLimit: integer("rate_limit").notNull().default(1000),
    lastUsed: timestamp("last_used"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const adminActionLogs = pgTable("admin_action_logs", {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    adminId: text("admin_id").notNull().references(() => users.id),
    action: text("action").notNull(),
    targetId: text("target_id"),
    targetUserId: text("target_user_id").references(() => users.id),
    details: text("details"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    timestamp: timestamp("timestamp").notNull().defaultNow(),
});
