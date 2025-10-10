var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  assetTypeEnum: () => assetTypeEnum,
  auditLogs: () => auditLogs,
  balanceAdjustments: () => balanceAdjustments,
  balanceAdjustmentsRelations: () => balanceAdjustmentsRelations,
  depositStatusEnum: () => depositStatusEnum,
  deposits: () => deposits,
  holdings: () => holdings,
  holdingsRelations: () => holdingsRelations,
  insertAuditLogSchema: () => insertAuditLogSchema,
  insertBalanceAdjustmentSchema: () => insertBalanceAdjustmentSchema,
  insertDepositSchema: () => insertDepositSchema,
  insertHoldingSchema: () => insertHoldingSchema,
  insertInvestmentPlanSchema: () => insertInvestmentPlanSchema,
  insertKycVerificationSchema: () => insertKycVerificationSchema,
  insertLendingPositionSchema: () => insertLendingPositionSchema,
  insertLiveChatMessageSchema: () => insertLiveChatMessageSchema,
  insertLiveChatSessionSchema: () => insertLiveChatSessionSchema,
  insertLoanSchema: () => insertLoanSchema,
  insertNewsArticleSchema: () => insertNewsArticleSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertOtpTokenSchema: () => insertOtpTokenSchema,
  insertPasswordResetTokenSchema: () => insertPasswordResetTokenSchema,
  insertPortfolioSchema: () => insertPortfolioSchema,
  insertSavingsPlanSchema: () => insertSavingsPlanSchema,
  insertSharedWalletAddressSchema: () => insertSharedWalletAddressSchema,
  insertStakingPositionSchema: () => insertStakingPositionSchema,
  insertSupportMessageSchema: () => insertSupportMessageSchema,
  insertSupportTicketSchema: () => insertSupportTicketSchema,
  insertTransactionSchema: () => insertTransactionSchema,
  insertUserPreferencesSchema: () => insertUserPreferencesSchema,
  insertUserSchema: () => insertUserSchema,
  insertWithdrawalLimitSchema: () => insertWithdrawalLimitSchema,
  insertWithdrawalSchema: () => insertWithdrawalSchema,
  investmentPlans: () => investmentPlans,
  kycStatusEnum: () => kycStatusEnum,
  kycVerifications: () => kycVerifications,
  lendingPositions: () => lendingPositions,
  liveChatMessages: () => liveChatMessages,
  liveChatSessions: () => liveChatSessions,
  loans: () => loans,
  metalsPricing: () => metalsPricing,
  newsArticles: () => newsArticles,
  notifications: () => notifications,
  otpTokens: () => otpTokens,
  passwordResetTokens: () => passwordResetTokens,
  paymentMethodEnum: () => paymentMethodEnum,
  platformSettings: () => platformSettings,
  portfolios: () => portfolios,
  portfoliosRelations: () => portfoliosRelations,
  priceAlerts: () => priceAlerts,
  priceHistory: () => priceHistory,
  savingsPlans: () => savingsPlans,
  selectNotificationSchema: () => selectNotificationSchema,
  sessions: () => sessions,
  sharedWalletAddresses: () => sharedWalletAddresses,
  stakingPositions: () => stakingPositions,
  supportMessages: () => supportMessages,
  supportTickets: () => supportTickets,
  ticketPriorityEnum: () => ticketPriorityEnum,
  ticketStatusEnum: () => ticketStatusEnum,
  transactionTypeEnum: () => transactionTypeEnum,
  transactions: () => transactions,
  transactionsRelations: () => transactionsRelations,
  userPreferences: () => userPreferences,
  userRoleEnum: () => userRoleEnum,
  userSettings: () => userSettings,
  users: () => users,
  usersRelations: () => usersRelations,
  withdrawalLimits: () => withdrawalLimits,
  withdrawalMethodEnum: () => withdrawalMethodEnum,
  withdrawalStatusEnum: () => withdrawalStatusEnum,
  withdrawals: () => withdrawals
});
import { sql } from "drizzle-orm";
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
  numeric,
  integer,
  serial,
  uniqueIndex
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";
var sessions, userRoleEnum, assetTypeEnum, transactionTypeEnum, depositStatusEnum, paymentMethodEnum, users, portfolios, holdings, transactions, deposits, metalsPricing, platformSettings, userSettings, balanceAdjustments, sharedWalletAddresses, newsArticles, passwordResetTokens, otpTokens, kycStatusEnum, kycVerifications, ticketStatusEnum, ticketPriorityEnum, supportTickets, supportMessages, withdrawalStatusEnum, withdrawalMethodEnum, withdrawals, withdrawalLimits, liveChatSessions, liveChatMessages, userPreferences, priceAlerts, investmentPlans, savingsPlans, stakingPositions, lendingPositions, loans, auditLogs, notifications, priceHistory, insertNotificationSchema, selectNotificationSchema, usersRelations, portfoliosRelations, holdingsRelations, transactionsRelations, balanceAdjustmentsRelations, insertUserSchema, insertPortfolioSchema, insertHoldingSchema, insertTransactionSchema, insertDepositSchema, insertBalanceAdjustmentSchema, insertNewsArticleSchema, insertPasswordResetTokenSchema, insertOtpTokenSchema, insertKycVerificationSchema, insertSupportTicketSchema, insertSupportMessageSchema, insertLiveChatSessionSchema, insertLiveChatMessageSchema, insertUserPreferencesSchema, insertWithdrawalSchema, insertWithdrawalLimitSchema, insertSharedWalletAddressSchema, insertInvestmentPlanSchema, insertSavingsPlanSchema, insertStakingPositionSchema, insertLendingPositionSchema, insertLoanSchema, insertAuditLogSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    sessions = pgTable(
      "sessions",
      {
        sid: varchar("sid").primaryKey(),
        sess: jsonb("sess").notNull(),
        expire: timestamp("expire").notNull()
      },
      (table) => [index("IDX_session_expire").on(table.expire)]
    );
    userRoleEnum = pgEnum("user_role", ["user", "admin"]);
    assetTypeEnum = pgEnum("asset_type", ["crypto", "metal"]);
    transactionTypeEnum = pgEnum("transaction_type", ["buy", "sell", "deposit", "withdrawal"]);
    depositStatusEnum = pgEnum("deposit_status", ["pending", "approved", "rejected"]);
    paymentMethodEnum = pgEnum("payment_method", ["binance", "bybit", "crypto_com", "bank_transfer", "other"]);
    users = pgTable("users", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      username: varchar("username").unique().notNull(),
      email: varchar("email").unique().notNull(),
      password: varchar("password").notNull(),
      firstName: varchar("first_name").default("").notNull(),
      lastName: varchar("last_name").default("").notNull(),
      profileImageUrl: varchar("profile_image_url"),
      firebaseUid: varchar("firebase_uid").unique(),
      displayName: varchar("display_name"),
      photoURL: varchar("photo_url"),
      role: userRoleEnum("role").default("user").notNull(),
      isActive: boolean("is_active").default(true).notNull(),
      walletBalance: decimal("wallet_balance", { precision: 20, scale: 8 }).notNull().default("0"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    portfolios = pgTable("portfolios", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      totalValue: decimal("total_value", { precision: 20, scale: 8 }).default("0.00").notNull(),
      availableCash: decimal("available_cash", { precision: 20, scale: 8 }).default("0.00").notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    holdings = pgTable("holdings", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      portfolioId: varchar("portfolio_id").references(() => portfolios.id, { onDelete: "cascade" }).notNull(),
      assetType: assetTypeEnum("asset_type").notNull(),
      symbol: varchar("symbol", { length: 10 }).notNull(),
      name: varchar("name", { length: 100 }).notNull(),
      amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
      averagePurchasePrice: decimal("average_purchase_price", { precision: 20, scale: 8 }).notNull(),
      currentPrice: decimal("current_price", { precision: 20, scale: 8 }).notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    transactions = pgTable("transactions", {
      id: text("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: text("user_id").notNull().references(() => users.id),
      type: transactionTypeEnum("type").notNull(),
      assetType: assetTypeEnum("asset_type").notNull(),
      symbol: text("symbol").notNull(),
      amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
      price: decimal("price", { precision: 20, scale: 8 }).notNull(),
      total: decimal("total", { precision: 20, scale: 8 }).notNull(),
      status: text("status").notNull().default("pending"),
      // 'pending', 'completed', 'failed'
      fees: decimal("fees", { precision: 20, scale: 8 }).default("0").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    deposits = pgTable("deposits", {
      id: text("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      amount: numeric("amount", { precision: 20, scale: 8 }).notNull(),
      currency: text("currency").notNull().default("USD"),
      assetType: assetTypeEnum("asset_type").notNull().default("crypto"),
      paymentMethod: paymentMethodEnum("payment_method").notNull(),
      status: depositStatusEnum("status").notNull().default("pending"),
      rejectionReason: text("rejection_reason"),
      proofImageUrl: text("proof_image_url"),
      // URL to uploaded proof of payment
      adminNotes: text("admin_notes"),
      approvedById: text("approved_by_id").references(() => users.id),
      approvedAt: timestamp("approved_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    metalsPricing = pgTable("metals_pricing", {
      id: text("id").primaryKey().default(sql`gen_random_uuid()`),
      symbol: text("symbol").notNull(),
      // 'GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'
      name: text("name").notNull(),
      pricePerOunce: numeric("price_per_ounce", { precision: 20, scale: 8 }).notNull(),
      changePercent24h: numeric("change_percent_24h", { precision: 10, scale: 4 }),
      lastUpdated: timestamp("last_updated").defaultNow().notNull()
    });
    platformSettings = pgTable("platform_settings", {
      id: text("id").primaryKey().default(sql`gen_random_uuid()`),
      key: text("key").notNull().unique(),
      value: text("value").notNull(),
      description: text("description"),
      updatedById: text("updated_by_id").references(() => users.id),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    userSettings = pgTable("user_settings", {
      id: text("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
      preferredCurrency: text("preferred_currency").default("USD").notNull(),
      emailNotifications: boolean("email_notifications").default(true).notNull(),
      priceAlerts: boolean("price_alerts").default(true).notNull(),
      darkMode: boolean("dark_mode").default(false).notNull(),
      language: text("language").default("en").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    balanceAdjustments = pgTable("balance_adjustments", {
      id: text("id").primaryKey().default(sql`gen_random_uuid()`),
      adminId: text("admin_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      targetUserId: text("target_user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      adjustmentType: text("adjustment_type").notNull(),
      // 'add', 'remove', 'set'
      amount: numeric("amount", { precision: 20, scale: 8 }).notNull(),
      currency: text("currency").notNull().default("USD"),
      reason: text("reason"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    sharedWalletAddresses = pgTable("shared_wallet_addresses", {
      id: text("id").primaryKey().default(sql`gen_random_uuid()`),
      symbol: text("symbol").notNull().unique(),
      // BTC, ETH, USDT, etc.
      name: text("name").notNull(),
      // Bitcoin, Ethereum, Tether, etc.
      address: text("address").notNull(),
      network: text("network").notNull(),
      // mainnet, polygon, bsc, etc.
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    newsArticles = pgTable("news_articles", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      title: varchar("title", { length: 500 }).notNull(),
      content: text("content"),
      excerpt: text("excerpt"),
      imageUrl: varchar("image_url"),
      source: varchar("source", { length: 100 }).notNull(),
      sourceUrl: varchar("source_url"),
      publishedAt: timestamp("published_at").notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    passwordResetTokens = pgTable("password_reset_tokens", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      token: varchar("token").unique().notNull(),
      expiresAt: timestamp("expires_at").notNull(),
      used: boolean("used").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    otpTokens = pgTable("otp_tokens", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      email: varchar("email").notNull(),
      token: varchar("token", { length: 6 }).notNull(),
      type: varchar("type", { length: 20 }).notNull(),
      // 'registration', 'password_reset', '2fa'
      expiresAt: timestamp("expires_at").notNull(),
      used: boolean("used").default(false).notNull(),
      attempts: decimal("attempts", { precision: 2, scale: 0 }).default("0").notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    kycStatusEnum = pgEnum("kyc_status", ["pending", "under_review", "approved", "rejected"]);
    kycVerifications = pgTable("kyc_verifications", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
      firstName: varchar("first_name").notNull(),
      lastName: varchar("last_name").notNull(),
      dateOfBirth: timestamp("date_of_birth").notNull(),
      nationality: varchar("nationality").notNull(),
      address: text("address").notNull(),
      city: varchar("city").notNull(),
      postalCode: varchar("postal_code").notNull(),
      country: varchar("country").notNull(),
      phoneNumber: varchar("phone_number").notNull(),
      documentType: varchar("document_type").notNull(),
      // 'passport', 'driver_license', 'national_id'
      documentNumber: varchar("document_number").notNull(),
      documentFrontImageUrl: varchar("document_front_image_url").notNull(),
      documentBackImageUrl: varchar("document_back_image_url"),
      selfieImageUrl: varchar("selfie_image_url").notNull(),
      status: kycStatusEnum("status").default("pending").notNull(),
      reviewedBy: varchar("reviewed_by").references(() => users.id),
      reviewedAt: timestamp("reviewed_at"),
      rejectionReason: text("rejection_reason"),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    ticketStatusEnum = pgEnum("ticket_status", ["open", "in_progress", "resolved", "closed"]);
    ticketPriorityEnum = pgEnum("ticket_priority", ["low", "medium", "high", "urgent"]);
    supportTickets = pgTable("support_tickets", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      title: varchar("title").notNull(),
      description: text("description").notNull(),
      category: varchar("category").notNull(),
      // 'technical', 'account', 'trading', 'kyc', 'general'
      priority: ticketPriorityEnum("priority").default("medium").notNull(),
      status: ticketStatusEnum("status").default("open").notNull(),
      assignedTo: varchar("assigned_to").references(() => users.id),
      attachmentUrls: jsonb("attachment_urls").$type().default([]),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    supportMessages = pgTable("support_messages", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      ticketId: varchar("ticket_id").references(() => supportTickets.id, { onDelete: "cascade" }).notNull(),
      senderId: varchar("sender_id").references(() => users.id).notNull(),
      message: text("message").notNull(),
      isInternal: boolean("is_internal").default(false).notNull(),
      // true for admin-only notes
      attachmentUrls: jsonb("attachment_urls").$type().default([]),
      createdAt: timestamp("created_at").defaultNow()
    });
    withdrawalStatusEnum = pgEnum("withdrawal_status", ["pending", "under_review", "approved", "rejected", "processing", "completed", "failed"]);
    withdrawalMethodEnum = pgEnum("withdrawal_method", ["bank_transfer", "crypto_wallet", "paypal", "other"]);
    withdrawals = pgTable("withdrawals", {
      id: text("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      amount: numeric("amount", { precision: 20, scale: 8 }).notNull(),
      currency: text("currency").notNull().default("USD"),
      withdrawalMethod: withdrawalMethodEnum("withdrawal_method").notNull(),
      destinationAddress: text("destination_address"),
      // Bank account, wallet address, etc.
      destinationDetails: jsonb("destination_details"),
      // Additional details like routing number, etc.
      status: withdrawalStatusEnum("status").notNull().default("pending"),
      requestedAt: timestamp("requested_at").defaultNow().notNull(),
      processedAt: timestamp("processed_at"),
      completedAt: timestamp("completed_at"),
      rejectionReason: text("rejection_reason"),
      adminNotes: text("admin_notes"),
      transactionHash: text("transaction_hash"),
      // For crypto withdrawals
      fees: numeric("fees", { precision: 20, scale: 8 }).default("0").notNull(),
      netAmount: numeric("net_amount", { precision: 20, scale: 8 }).notNull(),
      // Amount after fees
      reviewedById: text("reviewed_by_id").references(() => users.id),
      reviewedAt: timestamp("reviewed_at"),
      confirmationToken: text("confirmation_token"),
      // For email confirmation
      confirmationExpiresAt: timestamp("confirmation_expires_at"),
      isConfirmed: boolean("is_confirmed").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    withdrawalLimits = pgTable("withdrawal_limits", {
      id: text("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
      dailyLimit: numeric("daily_limit", { precision: 20, scale: 8 }).default("10000").notNull(),
      monthlyLimit: numeric("monthly_limit", { precision: 20, scale: 8 }).default("50000").notNull(),
      dailyUsed: numeric("daily_used", { precision: 20, scale: 8 }).default("0").notNull(),
      monthlyUsed: numeric("monthly_used", { precision: 20, scale: 8 }).default("0").notNull(),
      lastResetDate: timestamp("last_reset_date").defaultNow().notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    liveChatSessions = pgTable("live_chat_sessions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      agentId: varchar("agent_id").references(() => users.id),
      agentName: varchar("agent_name"),
      status: varchar("status").default("waiting").notNull(),
      // 'waiting', 'active', 'ended'
      subject: varchar("subject"),
      startedAt: timestamp("started_at").defaultNow(),
      endedAt: timestamp("ended_at"),
      rating: integer("rating"),
      // 1-5 stars
      feedback: text("feedback")
    });
    liveChatMessages = pgTable("live_chat_messages", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      sessionId: varchar("session_id").references(() => liveChatSessions.id, { onDelete: "cascade" }).notNull(),
      senderId: varchar("sender_id").references(() => users.id).notNull(),
      message: text("message").notNull(),
      messageType: varchar("message_type").default("text").notNull(),
      // 'text', 'image', 'file', 'system'
      attachmentUrl: varchar("attachment_url"),
      createdAt: timestamp("created_at").defaultNow()
    });
    userPreferences = pgTable("user_preferences", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
      emailNotifications: boolean("email_notifications").default(true).notNull(),
      tradingAlerts: boolean("trading_alerts").default(true).notNull(),
      priceAlerts: boolean("price_alerts").default(false).notNull(),
      newsUpdates: boolean("news_updates").default(true).notNull(),
      marketingEmails: boolean("marketing_emails").default(false).notNull(),
      twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
      sessionTimeout: decimal("session_timeout", { precision: 3, scale: 0 }).default("24").notNull(),
      // hours
      loginNotifications: boolean("login_notifications").default(true).notNull(),
      theme: varchar("theme").default("light").notNull(),
      // 'light', 'dark', 'auto'
      language: varchar("language").default("en").notNull(),
      timezone: varchar("timezone").default("UTC").notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    priceAlerts = pgTable("price_alerts", {
      id: text("id").primaryKey().$defaultFn(() => nanoid()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      symbol: text("symbol").notNull(),
      targetPrice: text("target_price").notNull(),
      alertType: text("alert_type").notNull().default("above"),
      // 'above' or 'below'
      isActive: boolean("is_active").default(true),
      isTriggered: boolean("is_triggered").default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    investmentPlans = pgTable("investment_plans", {
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
      createdAt: timestamp("created_at").defaultNow()
    });
    savingsPlans = pgTable("savings_plans", {
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
      createdAt: timestamp("created_at").defaultNow()
    });
    stakingPositions = pgTable("staking_positions", {
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
      createdAt: timestamp("created_at").defaultNow()
    });
    lendingPositions = pgTable("lending_positions", {
      id: text("id").primaryKey().$defaultFn(() => nanoid()),
      userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      assetSymbol: text("asset_symbol").notNull(),
      amount: text("amount").notNull(),
      apy: text("apy").notNull(),
      type: text("type").notNull(),
      // 'lend' or 'borrow'
      totalEarned: text("total_earned").default("0"),
      startDate: timestamp("start_date").notNull(),
      endDate: timestamp("end_date"),
      status: text("status").notNull().default("active"),
      createdAt: timestamp("created_at").defaultNow()
    });
    loans = pgTable("loans", {
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
      createdAt: timestamp("created_at").defaultNow()
    });
    auditLogs = pgTable("audit_logs", {
      id: text("id").primaryKey().$defaultFn(() => nanoid()),
      adminId: text("admin_id").notNull().references(() => users.id),
      action: text("action").notNull(),
      targetId: text("target_id"),
      targetUserId: text("target_user_id").references(() => users.id),
      details: text("details"),
      ipAddress: text("ip_address"),
      userAgent: text("user_agent"),
      timestamp: timestamp("timestamp").notNull().defaultNow()
    });
    notifications = pgTable("notifications", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      type: varchar("type", { length: 50 }).notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      message: text("message").notNull(),
      read: boolean("read").default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    priceHistory = pgTable("price_history", {
      id: serial("id").primaryKey(),
      symbol: varchar("symbol", { length: 20 }).notNull(),
      price: numeric("price", { precision: 20, scale: 8 }).notNull(),
      timestamp: timestamp("timestamp").defaultNow().notNull()
    }, (table) => ({
      symbolTimestampIdx: uniqueIndex("symbol_timestamp_idx").on(table.symbol, table.timestamp)
    }));
    insertNotificationSchema = createInsertSchema(notifications);
    selectNotificationSchema = createSelectSchema(notifications);
    usersRelations = relations(users, ({ one, many }) => ({
      portfolio: one(portfolios, {
        fields: [users.id],
        references: [portfolios.userId]
      }),
      adminAdjustments: many(balanceAdjustments, {
        relationName: "adminAdjustments"
      }),
      targetAdjustments: many(balanceAdjustments, {
        relationName: "targetAdjustments"
      }),
      transactions: many(transactions)
    }));
    portfoliosRelations = relations(portfolios, ({ one, many }) => ({
      user: one(users, {
        fields: [portfolios.userId],
        references: [users.id]
      }),
      holdings: many(holdings)
    }));
    holdingsRelations = relations(holdings, ({ one }) => ({
      portfolio: one(portfolios, {
        fields: [holdings.portfolioId],
        references: [portfolios.id]
      })
    }));
    transactionsRelations = relations(transactions, ({ one }) => ({
      user: one(users, {
        fields: [transactions.userId],
        references: [users.id]
      })
    }));
    balanceAdjustmentsRelations = relations(balanceAdjustments, ({ one }) => ({
      admin: one(users, {
        fields: [balanceAdjustments.adminId],
        references: [users.id],
        relationName: "adminAdjustments"
      }),
      targetUser: one(users, {
        fields: [balanceAdjustments.targetUserId],
        references: [users.id],
        relationName: "targetAdjustments"
      })
    }));
    insertUserSchema = createInsertSchema(users).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPortfolioSchema = createInsertSchema(portfolios).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertHoldingSchema = createInsertSchema(holdings).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertTransactionSchema = createInsertSchema(transactions).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertDepositSchema = createInsertSchema(deposits).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertBalanceAdjustmentSchema = createInsertSchema(balanceAdjustments).omit({
      id: true,
      createdAt: true
    });
    insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
      id: true,
      createdAt: true
    });
    insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
      id: true,
      createdAt: true
    });
    insertOtpTokenSchema = createInsertSchema(otpTokens).omit({
      id: true,
      createdAt: true
    });
    insertKycVerificationSchema = createInsertSchema(kycVerifications).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertSupportMessageSchema = createInsertSchema(supportMessages).omit({
      id: true,
      createdAt: true
    });
    insertLiveChatSessionSchema = createInsertSchema(liveChatSessions).omit({
      id: true,
      startedAt: true
    });
    insertLiveChatMessageSchema = createInsertSchema(liveChatMessages).omit({
      id: true,
      createdAt: true
    });
    insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertWithdrawalSchema = createInsertSchema(withdrawals).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertWithdrawalLimitSchema = createInsertSchema(withdrawalLimits).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertSharedWalletAddressSchema = createInsertSchema(sharedWalletAddresses).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertInvestmentPlanSchema = createInsertSchema(investmentPlans).omit({
      id: true,
      createdAt: true
    });
    insertSavingsPlanSchema = createInsertSchema(savingsPlans).omit({
      id: true,
      createdAt: true
    });
    insertStakingPositionSchema = createInsertSchema(stakingPositions).omit({
      id: true,
      createdAt: true
    });
    insertLendingPositionSchema = createInsertSchema(lendingPositions).omit({
      id: true,
      createdAt: true
    });
    insertLoanSchema = createInsertSchema(loans).omit({
      id: true,
      createdAt: true
    });
    insertAuditLogSchema = createInsertSchema(auditLogs).omit({
      id: true,
      timestamp: true
    });
  }
});

// server/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import { sql as sql2 } from "drizzle-orm";
import postgres from "postgres";
var databaseUrl, pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error("\u26A0\uFE0F  No database URL found. Please set DATABASE_URL in Secrets.");
      console.error("\u{1F527} The app will continue but database operations will fail until a database URL is set.");
    } else {
      console.log("\u{1F50C} Attempting to connect to database...");
      console.log("\u{1F4CD} Using database: Supabase PostgreSQL");
      try {
        const urlPattern = /^postgresql:\/\/([^:]+):([^@]+)@(.+)$/;
        const match = databaseUrl.match(urlPattern);
        if (match) {
          const [, username, password, rest] = match;
          const needsEncoding = /[?@$#&%/:=]/.test(password) && !/%.{2}/.test(password);
          if (needsEncoding) {
            const encodedPassword = encodeURIComponent(password);
            databaseUrl = `postgresql://${username}:${encodedPassword}@${rest}`;
            console.log("\u{1F527} Encoded special characters in password");
          }
        }
      } catch (err) {
        console.error("\u274C Error processing database URL:", err);
      }
    }
    pool = databaseUrl ? postgres(databaseUrl, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
      max_lifetime: 60 * 30
    }) : null;
    db = pool ? drizzle(pool, { schema: schema_exports }) : drizzle({}, { schema: schema_exports });
    if (pool) {
      const testConnection = async (retries = 3) => {
        for (let i = 0; i < retries; i++) {
          try {
            await db.execute(sql2`SELECT 1`);
            console.log("\u2705 Database connected successfully");
            return;
          } catch (err) {
            console.error(`\u274C Database connection attempt ${i + 1} failed:`, err.message);
            if (i === retries - 1) {
              console.error("\u{1F527} Please check your DATABASE_URL in Secrets");
              console.error("\u26A0\uFE0F  Database operations will be limited until connection is restored");
            } else {
              console.log(`\u{1F504} Retrying in 2 seconds...`);
              await new Promise((resolve) => setTimeout(resolve, 2e3));
            }
          }
        }
      };
      testConnection();
    } else {
      console.warn("\u26A0\uFE0F Running without database - some features will be limited");
    }
  }
});

// server/simple-auth.ts
var simple_auth_exports = {};
__export(simple_auth_exports, {
  hashPassword: () => hashPassword,
  loadUser: () => loadUser,
  requireAdmin: () => requireAdmin,
  requireAuth: () => requireAuth,
  verifyPassword: () => verifyPassword
});
import bcrypt from "bcrypt";
async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
var requireAuth, requireAdmin, loadUser;
var init_simple_auth = __esm({
  "server/simple-auth.ts"() {
    "use strict";
    init_storage();
    requireAuth = (req, res, next) => {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      if (!user.isActive) {
        return res.status(401).json({ message: "Account is disabled" });
      }
      next();
    };
    requireAdmin = async (req, res, next) => {
      try {
        if (!req.user || !req.user.id) {
          return res.status(401).json({ message: "Authentication required" });
        }
        const user = await storage.getUser(req.user.id);
        if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }
        next();
      } catch (error) {
        console.error("Admin check error:", error);
        res.status(500).json({ message: "Authorization failed" });
      }
    };
    loadUser = async (req, res, next) => {
      try {
        const sessionData = req.session;
        if (sessionData?.userId) {
          const user = await storage.getUser(sessionData.userId);
          if (user && user.isActive) {
            req.user = {
              id: user.id,
              email: user.email,
              username: user.username,
              role: user.role,
              isActive: user.isActive,
              firstName: user.firstName,
              lastName: user.lastName
            };
          } else if (user && !user.isActive) {
            req.session?.destroy((err) => {
              if (err) {
                console.error("Error destroying session:", err);
              }
            });
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
      next();
    };
  }
});

// server/storage.ts
import { eq, desc, gte, count, and, or, sql as sql3, ilike, like, sum, ne } from "drizzle-orm";
import crypto from "crypto";
import { nanoid as nanoid2 } from "nanoid";
var DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    init_simple_auth();
    DatabaseStorage = class {
      // Assuming db is initialized and accessible here, or passed in constructor
      db = db;
      // Make db accessible within the class
      ensureDb() {
        if (!this.db) {
          throw new Error("Database not initialized. Please set DATABASE_URL and restart the application.");
        }
        return this.db;
      }
      isDbConnected() {
        try {
          return this.db ? true : false;
        } catch (error) {
          return false;
        }
      }
      async getUser(id) {
        const db2 = this.ensureDb();
        const [user] = await db2.select().from(users).where(eq(users.id, id));
        return user;
      }
      async getUserByEmail(email) {
        const db2 = this.ensureDb();
        const [user] = await db2.select().from(users).where(eq(users.email, email));
        return user;
      }
      async getUserByUsername(username) {
        const db2 = this.ensureDb();
        const [user] = await db2.select().from(users).where(eq(users.username, username));
        return user;
      }
      async getUserByEmailOrUsername(emailOrUsername, username) {
        const db2 = this.ensureDb();
        if (username) {
          const [user2] = await db2.select().from(users).where(or(eq(users.email, emailOrUsername), eq(users.username, username)));
          return user2;
        }
        const [user] = await db2.select().from(users).where(or(eq(users.email, emailOrUsername), eq(users.username, emailOrUsername)));
        return user;
      }
      async getUserByFirebaseUid(firebaseUid) {
        const db2 = this.ensureDb();
        const [user] = await db2.select().from(users).where(eq(users.firebaseUid, firebaseUid));
        return user;
      }
      async updateUserFirebaseUid(userId, firebaseUid) {
        const db2 = this.ensureDb();
        await db2.update(users).set({ firebaseUid }).where(eq(users.id, userId));
      }
      async createUser(userData) {
        const db2 = this.ensureDb();
        const [user] = await db2.insert(users).values(userData).returning();
        return user;
      }
      async upsertUser(userData) {
        const db2 = this.ensureDb();
        const [user] = await db2.insert(users).values(userData).onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }).returning();
        return user;
      }
      async getPortfolio(userId) {
        const db2 = this.ensureDb();
        const [portfolio] = await db2.select().from(portfolios).where(eq(portfolios.userId, userId));
        return portfolio;
      }
      async createPortfolio(portfolioData) {
        const db2 = this.ensureDb();
        const [portfolio] = await db2.insert(portfolios).values(portfolioData).returning();
        return portfolio;
      }
      async updatePortfolio(portfolioId, updates) {
        const db2 = this.ensureDb();
        const [portfolio] = await db2.update(portfolios).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(portfolios.id, portfolioId)).returning();
        return portfolio;
      }
      async getHoldings(portfolioId) {
        try {
          const db2 = this.ensureDb();
          return await db2.select().from(holdings).where(eq(holdings.portfolioId, portfolioId));
        } catch (error) {
          console.error("Error fetching holdings:", error);
          return [];
        }
      }
      async getHolding(portfolioId, symbol) {
        const db2 = this.ensureDb();
        const [holding] = await db2.select().from(holdings).where(and(eq(holdings.portfolioId, portfolioId), eq(holdings.symbol, symbol)));
        return holding;
      }
      async upsertHolding(holdingData) {
        const existing = await this.getHolding(holdingData.portfolioId, holdingData.symbol);
        if (existing) {
          const db2 = this.ensureDb();
          const [holding] = await db2.update(holdings).set({ ...holdingData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(holdings.id, existing.id)).returning();
          return holding;
        } else {
          const db2 = this.ensureDb();
          const [holding] = await db2.insert(holdings).values({
            ...holdingData,
            assetType: holdingData.assetType || "crypto"
            // Default to crypto for backward compatibility
          }).returning();
          return holding;
        }
      }
      async createHolding(holdingData) {
        const db2 = this.ensureDb();
        const [holding] = await db2.insert(holdings).values(holdingData).returning();
        return holding;
      }
      async updateHolding(holdingId, updates) {
        const db2 = this.ensureDb();
        await db2.update(holdings).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(holdings.id, holdingId));
      }
      async deleteHolding(idOrPortfolioId, symbol) {
        const db2 = this.ensureDb();
        if (symbol) {
          await db2.delete(holdings).where(and(
            eq(holdings.portfolioId, idOrPortfolioId),
            eq(holdings.symbol, symbol)
          ));
        } else {
          await db2.delete(holdings).where(eq(holdings.id, idOrPortfolioId));
        }
      }
      async updatePortfolioBalance(userId, amount) {
        const db2 = this.ensureDb();
        const [portfolio] = await db2.select().from(portfolios).where(eq(portfolios.userId, userId));
        if (!portfolio) {
          throw new Error("Portfolio not found");
        }
        const currentBalance = parseFloat(portfolio.availableCash);
        const newBalance = currentBalance + amount;
        await db2.update(portfolios).set({
          availableCash: newBalance.toString(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(portfolios.id, portfolio.id));
      }
      async getTransactions(userId, limit = 50) {
        const db2 = this.ensureDb();
        return await db2.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt)).limit(limit);
      }
      // Updated createTransaction method with new fields for enhanced trading
      async createTransaction(data) {
        const db2 = this.ensureDb();
        const [transaction] = await db2.insert(transactions).values({
          ...data,
          fee: data.fee || "0",
          orderType: data.orderType || "market",
          stopLoss: data.stopLoss !== void 0 ? data.stopLoss : null,
          takeProfit: data.takeProfit !== void 0 ? data.takeProfit : null,
          slippage: data.slippage || "0.5"
        }).returning();
        return transaction;
      }
      async updateUser(userId, updates) {
        try {
          const db2 = this.ensureDb();
          await db2.update(users).set(updates).where(eq(users.id, userId));
        } catch (error) {
          console.error("Error updating user:", error);
          throw error;
        }
      }
      async verifyPassword(userId, password) {
        try {
          const user = await this.getUser(userId);
          if (!user || !user.password) {
            return false;
          }
          const { verifyPassword: verifyPassword2 } = await Promise.resolve().then(() => (init_simple_auth(), simple_auth_exports));
          return await verifyPassword2(password, user.password);
        } catch (error) {
          console.error("Error verifying password:", error);
          return false;
        }
      }
      async deleteUser(userId) {
        try {
          const db2 = this.ensureDb();
          await db2.delete(users).where(eq(users.id, userId));
        } catch (error) {
          console.error("Error deleting user:", error);
          throw error;
        }
      }
      async getUserTransactions(userId, limit = 50) {
        try {
          const db2 = this.ensureDb();
          return await db2.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt)).limit(limit);
        } catch (error) {
          console.error("Error fetching user transactions:", error);
          return [];
        }
      }
      async getUserTransactionCount(userId) {
        try {
          const db2 = this.ensureDb();
          const [{ count: count2 }] = await db2.select({ count: sql3`count(*)` }).from(transactions).where(eq(transactions.userId, userId));
          return Number(count2);
        } catch (error) {
          console.error("Error counting user transactions:", error);
          return 0;
        }
      }
      async getAllTransactions(params) {
        try {
          const { page, limit, userId, type } = params;
          const offset = (page - 1) * limit;
          const db2 = this.ensureDb();
          let query = db2.select({
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
          let countQuery = db2.select({ count: sql3`count(*)` }).from(transactions);
          const conditions = [];
          if (userId) conditions.push(eq(transactions.userId, userId));
          if (type) conditions.push(eq(transactions.type, type));
          if (conditions.length > 0) {
            query = query.where(and(...conditions));
            countQuery = countQuery.where(and(...conditions));
          }
          const transactionList = await query.orderBy(desc(transactions.createdAt)).limit(limit).offset(offset);
          const [{ count: count2 }] = await countQuery;
          return { transactions: transactionList, total: Number(count2) };
        } catch (error) {
          console.error("Error fetching all transactions:", error);
          return { transactions: [], total: 0 };
        }
      }
      async reverseTransaction(transactionId, adminId, reason) {
        try {
          const db2 = this.ensureDb();
          const [original] = await db2.select().from(transactions).where(eq(transactions.id, transactionId)).limit(1);
          if (!original.length) throw new Error("Transaction not found");
          const reversedTransaction = await db2.insert(transactions).values({
            userId: original[0].userId,
            type: original[0].type === "buy" ? "sell" : "buy",
            symbol: original[0].symbol,
            amount: original[0].amount,
            price: original[0].price,
            total: original[0].total,
            status: "completed"
          }).returning();
          await this.logAdminAction({
            adminId,
            action: "reverse_transaction",
            details: { originalTransactionId: transactionId, reason },
            timestamp: /* @__PURE__ */ new Date()
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
          return result.map((user) => ({ ...user, password: void 0 }));
        } catch (error) {
          console.error("Error getting all users:", error);
          throw error;
        }
      }
      // Enhanced user fetching with filters
      async getUsers(options) {
        try {
          let query = this.db.select().from(users);
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
            query = query.where(eq(users.isActive, options.status === "active"));
          }
          if (options.role) {
            query = query.where(eq(users.role, options.role));
          }
          const offset = (options.page - 1) * options.limit;
          const result = await query.limit(options.limit).offset(offset).orderBy(desc(users.createdAt));
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
            countQuery = countQuery.where(eq(users.isActive, options.status === "active"));
          }
          if (options.role) {
            countQuery = countQuery.where(eq(users.role, options.role));
          }
          const totalResult = await countQuery;
          const total = totalResult[0]?.count || 0;
          return {
            users: result.map((user) => ({ ...user, password: void 0 })),
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
      async createBalanceAdjustment(adjustment) {
        try {
          const db2 = this.ensureDb();
          const [adjustment2] = await db2.insert(balanceAdjustments).values(adjustment2).returning();
          return adjustment2;
        } catch (error) {
          console.error("Error creating balance adjustment:", error);
          throw new Error("Failed to create balance adjustment");
        }
      }
      async getBalanceAdjustments(userId, page = 1, limit = 50) {
        try {
          const offset = (page - 1) * limit;
          const db2 = this.ensureDb();
          let query = db2.select().from(balanceAdjustments);
          if (userId) {
            query = query.where(eq(balanceAdjustments.targetUserId, userId));
          }
          const adjustments = await query.orderBy(desc(balanceAdjustments.createdAt)).limit(limit).offset(offset);
          return adjustments;
        } catch (error) {
          console.error("Error fetching balance adjustments:", error);
          return [];
        }
      }
      // Get news articles with filtering
      async getNewsArticles(limit = 10, category, search) {
        try {
          const db2 = this.ensureDb();
          let query = db2.select().from(newsArticles);
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
          const articles = await query.orderBy(desc(newsArticles.publishedAt)).limit(limit);
          return articles;
        } catch (error) {
          console.error("Error fetching news articles:", error);
          if (error?.code === "42P01") {
            return [];
          }
          throw error;
        }
      }
      // Get single news article by ID
      async getNewsArticleById(id) {
        try {
          const db2 = this.ensureDb();
          const article = await db2.select().from(newsArticles).where(eq(newsArticles.id, id)).limit(1);
          return article[0] || null;
        } catch (error) {
          console.error("Error fetching news article:", error);
          throw error;
        }
      }
      async createNewsArticle(articleData) {
        const db2 = this.ensureDb();
        const [article] = await db2.insert(newsArticles).values(articleData).returning();
        return article;
      }
      // Update news article
      async updateNewsArticle(id, updates) {
        try {
          const db2 = this.ensureDb();
          const updated = await db2.update(newsArticles).set(updates).where(eq(newsArticles.id, id)).returning();
          return updated[0] || null;
        } catch (error) {
          console.error("Error updating news article:", error);
          throw error;
        }
      }
      async deleteNewsArticle(id) {
        const db2 = this.ensureDb();
        await db2.delete(newsArticles).where(eq(newsArticles.id, id));
      }
      // Get news analytics
      async getNewsAnalytics() {
        try {
          const db2 = this.ensureDb();
          const totalArticles = await db2.select({ count: count() }).from(newsArticles);
          const articlesBySource = await db2.select({
            source: newsArticles.source,
            count: count()
          }).from(newsArticles).groupBy(newsArticles.source);
          const recentArticles = await db2.select({ count: count() }).from(newsArticles).where(gte(newsArticles.publishedAt, sql3`NOW() - INTERVAL '7 days'`));
          return {
            totalArticles: totalArticles[0]?.count || 0,
            articlesBySource,
            recentArticles: recentArticles[0]?.count || 0
          };
        } catch (error) {
          console.error("Error fetching news analytics:", error);
          throw error;
        }
      }
      // Price Alerts methods
      async createPriceAlert(alertData) {
        try {
          const db2 = this.ensureDb();
          const [alert] = await db2.insert(priceAlerts).values(alertData).returning();
          return alert;
        } catch (error) {
          console.error("Error creating price alert:", error);
          throw error;
        }
      }
      async getUserPriceAlerts(userId) {
        try {
          const db2 = this.ensureDb();
          return await db2.select().from(priceAlerts).where(eq(priceAlerts.userId, userId));
        } catch (error) {
          console.error("Error fetching user price alerts:", error);
          return [];
        }
      }
      async getPriceAlert(userId, symbol) {
        try {
          const db2 = this.ensureDb();
          const [alert] = await db2.select().from(priceAlerts).where(and(eq(priceAlerts.userId, userId), eq(priceAlerts.symbol, symbol)));
          return alert;
        } catch (error) {
          console.error("Error getting price alert:", error);
          throw error;
        }
      }
      async getPriceAlertById(alertId) {
        try {
          const db2 = this.ensureDb();
          const [alert] = await db2.select().from(priceAlerts).where(eq(priceAlerts.id, alertId));
          return alert;
        } catch (error) {
          console.error("Error getting price alert:", error);
          throw error;
        }
      }
      async updatePriceAlert(alertId, updates) {
        try {
          const db2 = this.ensureDb();
          const [alert] = await db2.update(priceAlerts).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(priceAlerts.id, alertId)).returning();
          return alert;
        } catch (error) {
          console.error("Error updating price alert:", error);
          throw error;
        }
      }
      async deletePriceAlert(alertId) {
        try {
          const db2 = this.ensureDb();
          await db2.delete(priceAlerts).where(eq(priceAlerts.id, alertId));
        } catch (error) {
          console.error("Error deleting price alert:", error);
          throw error;
        }
      }
      async logAdminAction(action) {
        try {
          const db2 = this.ensureDb();
          const { auditLogs: auditLogs2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
          await db2.insert(auditLogs2).values({
            adminId: action.adminId,
            action: action.action,
            targetId: action.targetId,
            targetUserId: action.targetUserId,
            details: action.details ? JSON.stringify(action.details) : null,
            timestamp: action.timestamp
          });
        } catch (error) {
          console.error("Error logging admin action:", error);
        }
      }
      async getActivePriceAlerts() {
        try {
          const db2 = this.ensureDb();
          const alerts = await db2.select().from(priceAlerts).where(and(
            eq(priceAlerts.isActive, true),
            eq(priceAlerts.isTriggered, false)
          ));
          return alerts;
        } catch (error) {
          console.error("Error getting active price alerts:", error);
          if (error?.code === "42P01") {
            return [];
          }
          return [];
        }
      }
      // Get price alerts for user
      async getPriceAlerts(userId) {
        try {
          const db2 = this.ensureDb();
          const result = await db2.select().from(priceAlerts).where(eq(priceAlerts.userId, userId)).orderBy(desc(priceAlerts.createdAt));
          return result;
        } catch (error) {
          console.error("Error fetching price alerts:", error);
          if (error?.code === "42P01") {
            return [];
          }
          return [];
        }
      }
      // Get user price alerts (alias for WebSocket compatibility)
      async getUserPriceAlerts(userId) {
        return this.getPriceAlerts(userId);
      }
      // Notification methods
      async createNotification(data) {
        try {
          const db2 = this.ensureDb();
          const [notification] = await db2.insert(notifications).values(data).returning();
          return notification;
        } catch (error) {
          console.error("Error creating notification:", error);
          throw error;
        }
      }
      async getUserNotifications(userId, limit = 20) {
        try {
          const db2 = this.ensureDb();
          const userNotifications = await db2.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
          return userNotifications;
        } catch (error) {
          console.error("Error getting notifications:", error);
          if (error?.code === "42P01") {
            return [];
          }
          return [];
        }
      }
      async getNotifications(userId, limit = 20) {
        return this.getUserNotifications(userId, limit);
      }
      async getNotification(notificationId) {
        try {
          const db2 = this.ensureDb();
          const [notification] = await db2.select().from(notifications).where(eq(notifications.id, notificationId));
          return notification;
        } catch (error) {
          console.error("Error getting notification:", error);
          throw error;
        }
      }
      async markNotificationAsRead(notificationId) {
        try {
          const db2 = this.ensureDb();
          await db2.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
        } catch (error) {
          console.error("Error marking notification as read:", error);
          throw error;
        }
      }
      async getUnreadNotificationCount(userId) {
        try {
          const db2 = this.ensureDb();
          const [result] = await db2.select({ count: sql3`count(*)` }).from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
          return parseInt(result.count) || 0;
        } catch (error) {
          console.error("Error fetching unread notification count:", error);
          return 0;
        }
      }
      // Investment Plans operations
      async getUserInvestmentPlans(userId) {
        try {
          return [
            {
              id: "1",
              name: "Bitcoin Dollar-Cost Averaging",
              assetSymbol: "BTC",
              assetName: "Bitcoin",
              amount: 50,
              frequency: "weekly",
              totalInvested: 2400,
              currentValue: 2856,
              nextExecution: "2025-01-22",
              status: "active"
            }
          ];
        } catch (error) {
          console.error("Error fetching investment plans:", error);
          return [];
        }
      }
      async createInvestmentPlan(data) {
        try {
          return {
            id: Date.now().toString(),
            ...data,
            createdAt: /* @__PURE__ */ new Date(),
            status: "active"
          };
        } catch (error) {
          console.error("Error creating investment plan:", error);
          throw error;
        }
      }
      async updateInvestmentPlan(planId, userId, updates) {
        try {
          return { id: planId, ...updates, updatedAt: /* @__PURE__ */ new Date() };
        } catch (error) {
          console.error("Error updating investment plan:", error);
          throw error;
        }
      }
      async deleteInvestmentPlan(planId, userId) {
        try {
          return true;
        } catch (error) {
          console.error("Error deleting investment plan:", error);
          return false;
        }
      }
      async executeInvestmentPlan(planId, userId) {
        try {
          return {
            executionId: Date.now().toString(),
            planId,
            amount: 50,
            price: 45e3,
            executedAt: /* @__PURE__ */ new Date()
          };
        } catch (error) {
          console.error("Error executing investment plan:", error);
          return null;
        }
      }
      async getInvestmentPlanHistory(planId, userId) {
        try {
          return [
            {
              id: "1",
              planId,
              amount: 50,
              price: 45e3,
              executedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3)
            }
          ];
        } catch (error) {
          console.error("Error fetching investment plan history:", error);
          return [];
        }
      }
      // Savings Plans operations
      async getUserSavingsPlans(userId) {
        try {
          return [
            {
              id: "1",
              name: "Retirement Fund",
              goal: "retirement",
              targetAmount: 1e5,
              currentAmount: 15e3,
              monthlyContribution: 500,
              timeHorizon: 20,
              riskTolerance: "moderate",
              expectedReturn: "5-8%",
              projectedValue: "125000"
            }
          ];
        } catch (error) {
          console.error("Error fetching savings plans:", error);
          return [];
        }
      }
      async createSavingsPlan(data) {
        try {
          return {
            id: Date.now().toString(),
            ...data,
            createdAt: /* @__PURE__ */ new Date(),
            isActive: true
          };
        } catch (error) {
          console.error("Error creating savings plan:", error);
          throw error;
        }
      }
      async updateSavingsPlan(planId, userId, updates) {
        try {
          return { id: planId, ...updates, updatedAt: /* @__PURE__ */ new Date() };
        } catch (error) {
          console.error("Error updating savings plan:", error);
          throw error;
        }
      }
      async deleteSavingsPlan(planId, userId) {
        try {
          return true;
        } catch (error) {
          console.error("Error deleting savings plan:", error);
          return false;
        }
      }
      async addSavingsPlanContribution(planId, userId, amount, isScheduled) {
        try {
          return {
            id: Date.now().toString(),
            planId,
            amount,
            isScheduled,
            contributionDate: /* @__PURE__ */ new Date()
          };
        } catch (error) {
          console.error("Error adding savings plan contribution:", error);
          return null;
        }
      }
      async getSavingsPlanPerformance(planId, userId) {
        try {
          return {
            planId,
            totalContributions: 5e3,
            currentValue: 5250,
            totalReturn: 250,
            returnPercentage: 5,
            monthlyGrowth: [
              { month: "Jan", value: 1e3 },
              { month: "Feb", value: 2050 },
              { month: "Mar", value: 3100 },
              { month: "Apr", value: 4200 },
              { month: "May", value: 5250 }
            ]
          };
        } catch (error) {
          console.error("Error fetching savings plan performance:", error);
          return null;
        }
      }
      // Staking operations
      async getUserStakingPositions(userId) {
        try {
          return [
            {
              id: "1",
              assetSymbol: "ETH",
              amount: "10",
              apy: "5.2%",
              stakingTerm: "90d",
              startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3),
              endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1e3),
              status: "active",
              estimatedRewards: "0.42"
            }
          ];
        } catch (error) {
          console.error("Error fetching staking positions:", error);
          return [];
        }
      }
      async createStakingPosition(data) {
        try {
          return {
            id: Date.now().toString(),
            ...data,
            createdAt: /* @__PURE__ */ new Date()
          };
        } catch (error) {
          console.error("Error creating staking position:", error);
          throw error;
        }
      }
      async getStakingPosition(positionId, userId) {
        try {
          return {
            id: positionId,
            userId,
            assetSymbol: "ETH",
            amount: "10",
            apy: "5.2%",
            stakingTerm: "90d",
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3),
            status: "active"
          };
        } catch (error) {
          console.error("Error fetching staking position:", error);
          return null;
        }
      }
      async updateStakingPosition(positionId, updates) {
        try {
          return { id: positionId, ...updates, updatedAt: /* @__PURE__ */ new Date() };
        } catch (error) {
          console.error("Error updating staking position:", error);
          throw error;
        }
      }
      async getStakingRewards(userId) {
        try {
          return [
            {
              id: "1",
              positionId: "1",
              amount: "0.042",
              assetSymbol: "ETH",
              rewardDate: /* @__PURE__ */ new Date(),
              type: "staking_reward"
            }
          ];
        } catch (error) {
          console.error("Error fetching staking rewards:", error);
          return [];
        }
      }
      async getStakingAnalytics(userId) {
        try {
          return {
            totalStaked: "50.5",
            totalRewards: "2.34",
            activePositions: 3,
            averageAPY: "6.8%",
            totalValue: "52.84"
          };
        } catch (error) {
          console.error("Error fetching staking analytics:", error);
          return {};
        }
      }
      // Withdrawal operations
      async getUserWithdrawals(userId) {
        try {
          return [
            {
              id: "1",
              userId,
              amount: "1000.00",
              currency: "USD",
              withdrawalMethod: "bank_transfer",
              destinationAddress: "Bank Account ****1234",
              status: "pending",
              requestedAt: /* @__PURE__ */ new Date(),
              fees: "25.00",
              netAmount: "975.00"
            }
          ];
        } catch (error) {
          console.error("Error fetching withdrawals:", error);
          return [];
        }
      }
      async getWithdrawalLimits(userId) {
        try {
          return {
            dailyLimit: "10000.00",
            monthlyLimit: "50000.00",
            dailyUsed: "0.00",
            monthlyUsed: "0.00"
          };
        } catch (error) {
          console.error("Error fetching withdrawal limits:", error);
          return {
            dailyLimit: "10000.00",
            monthlyLimit: "50000.00",
            dailyUsed: "0.00",
            monthlyUsed: "0.00"
          };
        }
      }
      async calculateWithdrawalFees(amount, method) {
        try {
          const feeRates = {
            bank_transfer: 0.025,
            // 2.5%
            crypto_wallet: 0.01,
            // 1%
            paypal: 0.035,
            // 3.5%
            other: 0.02
            // 2%
          };
          const rate = feeRates[method] || 0.02;
          const fee = amount * rate;
          const minFee = 5;
          const maxFee = 100;
          return Math.max(minFee, Math.min(fee, maxFee));
        } catch (error) {
          console.error("Error calculating withdrawal fees:", error);
          return 25;
        }
      }
      async createWithdrawal(data) {
        try {
          return {
            id: Date.now().toString(),
            ...data,
            status: "pending",
            requestedAt: /* @__PURE__ */ new Date(),
            isConfirmed: false
          };
        } catch (error) {
          console.error("Error creating withdrawal:", error);
          throw error;
        }
      }
      async confirmWithdrawal(userId, token) {
        try {
          return {
            id: "1",
            userId,
            status: "under_review",
            isConfirmed: true,
            confirmedAt: /* @__PURE__ */ new Date()
          };
        } catch (error) {
          console.error("Error confirming withdrawal:", error);
          return null;
        }
      }
      async cancelWithdrawal(userId, withdrawalId) {
        try {
          return true;
        } catch (error) {
          console.error("Error cancelling withdrawal:", error);
          return false;
        }
      }
      // Lending operations
      async getUserLendingPositions(userId) {
        try {
          return [
            {
              id: "1",
              assetSymbol: "USDC",
              amount: "1000",
              apy: "12.5%",
              startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1e3),
              status: "active",
              type: "lend",
              estimatedEarnings: "5.12"
            }
          ];
        } catch (error) {
          console.error("Error fetching lending positions:", error);
          return [];
        }
      }
      // Chat session operations
      async getActiveChatSession(userId) {
        try {
          const db2 = this.ensureDb();
          const [session2] = await db2.select().from(liveChatSessions).where(and(
            eq(liveChatSessions.userId, userId),
            or(
              eq(liveChatSessions.status, "waiting"),
              eq(liveChatSessions.status, "active")
            )
          )).limit(1);
          return session2;
        } catch (error) {
          console.error("Error fetching active chat session:", error);
          return null;
        }
      }
      async createChatSession(data) {
        try {
          const db2 = this.ensureDb();
          const [session2] = await db2.insert(liveChatSessions).values({
            userId: data.userId,
            subject: data.subject,
            status: data.status,
            startedAt: /* @__PURE__ */ new Date()
          }).returning();
          return session2;
        } catch (error) {
          console.error("Error creating chat session:", error);
          throw error;
        }
      }
      async getChatSession(sessionId) {
        try {
          const db2 = this.ensureDb();
          const [session2] = await db2.select().from(liveChatSessions).where(eq(liveChatSessions.id, sessionId)).limit(1);
          return session2;
        } catch (error) {
          console.error("Error fetching chat session:", error);
          return null;
        }
      }
      async getChatMessages(sessionId) {
        try {
          const db2 = this.ensureDb();
          const messages = await db2.select().from(liveChatMessages).where(eq(liveChatMessages.sessionId, sessionId)).orderBy(liveChatMessages.createdAt);
          return messages;
        } catch (error) {
          console.error("Error fetching chat messages:", error);
          return [];
        }
      }
      async createChatMessage(data) {
        try {
          const db2 = this.ensureDb();
          const [message] = await db2.insert(liveChatMessages).values({
            sessionId: data.sessionId,
            senderId: data.senderId,
            message: data.message,
            messageType: data.messageType || "text",
            attachmentUrl: data.attachmentUrl
          }).returning();
          return message;
        } catch (error) {
          console.error("Error creating chat message:", error);
          throw error;
        }
      }
      async updateChatSessionStatus(sessionId, status, agentId) {
        try {
          const db2 = this.ensureDb();
          await db2.update(liveChatSessions).set({
            status,
            agentId,
            endedAt: status === "ended" ? /* @__PURE__ */ new Date() : void 0
          }).where(eq(liveChatSessions.id, sessionId));
        } catch (error) {
          console.error("Error updating chat session status:", error);
          throw error;
        }
      }
      async endChatSession(sessionId) {
        try {
          const db2 = this.ensureDb();
          await db2.update(liveChatSessions).set({
            status: "ended",
            endedAt: /* @__PURE__ */ new Date()
          }).where(eq(liveChatSessions.id, sessionId));
        } catch (error) {
          console.error("Error ending chat session:", error);
          throw error;
        }
      }
      async getChatSessions(options) {
        try {
          const db2 = this.ensureDb();
          let query = db2.select({
            id: liveChatSessions.id,
            userId: liveChatSessions.userId,
            agentId: liveChatSessions.agentId,
            status: liveChatSessions.status,
            subject: liveChatSessions.subject,
            startedAt: liveChatSessions.startedAt,
            endedAt: liveChatSessions.endedAt,
            user: {
              username: users.username,
              email: users.email,
              firstName: users.firstName,
              lastName: users.lastName
            }
          }).from(liveChatSessions).leftJoin(users, eq(liveChatSessions.userId, users.id));
          if (options.status) {
            query = query.where(eq(liveChatSessions.status, options.status));
          }
          const sessions2 = await query.orderBy(liveChatSessions.startedAt).limit(options.limit || 20).offset((options.page - 1) * (options.limit || 20));
          return { sessions: sessions2 };
        } catch (error) {
          console.error("Error fetching chat sessions:", error);
          return { sessions: [] };
        }
      }
      async assignChatSession(sessionId, agentId, agentName) {
        try {
          const db2 = this.ensureDb();
          await db2.update(liveChatSessions).set({
            agentId,
            status: "active"
          }).where(eq(liveChatSessions.id, sessionId));
        } catch (error) {
          console.error("Error assigning chat session:", error);
          throw error;
        }
      }
      async notifyAdminsNewChatSession(session2) {
        console.log(`New chat session created: ${session2.id}`);
      }
      async rateChatSession(sessionId, rating, feedback) {
        try {
          const db2 = this.ensureDb();
          await db2.update(liveChatSessions).set({ rating, feedback }).where(eq(liveChatSessions.id, sessionId));
        } catch (error) {
          console.error("Error rating chat session:", error);
          throw error;
        }
      }
      async getChatSession(sessionId) {
        try {
          const db2 = this.ensureDb();
          const [session2] = await db2.select().from(liveChatSessions).where(eq(liveChatSessions.id, sessionId)).limit(1);
          return session2;
        } catch (error) {
          console.error("Error fetching chat session:", error);
          return null;
        }
      }
      async getChatMessages(sessionId) {
        try {
          const db2 = this.ensureDb();
          const messages = await db2.select().from(liveChatMessages).where(eq(liveChatMessages.sessionId, sessionId)).orderBy(liveChatMessages.createdAt);
          return messages;
        } catch (error) {
          console.error("Error fetching chat messages:", error);
          return [];
        }
      }
      async createChatMessage(data) {
        try {
          const db2 = this.ensureDb();
          const [message] = await db2.insert(liveChatMessages).values({
            sessionId: data.sessionId,
            senderId: data.senderId,
            message: data.message,
            messageType: data.messageType || "text",
            attachmentUrl: data.attachmentUrl
          }).returning();
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
      async updateChatSessionStatus(sessionId, status, agentId) {
        try {
          const db2 = this.ensureDb();
          const updateData = { status };
          if (agentId && status === "active") {
            updateData.agentId = agentId;
            const agent = await this.getUser(agentId);
            if (agent) {
              updateData.agentName = `${agent.firstName} ${agent.lastName}`;
            }
          }
          if (status === "ended") {
            updateData.endedAt = /* @__PURE__ */ new Date();
          }
          const [session2] = await db2.update(liveChatSessions).set(updateData).where(eq(liveChatSessions.id, sessionId)).returning();
          return session2;
        } catch (error) {
          console.error("Error updating chat session status:", error);
          throw error;
        }
      }
      async endChatSession(sessionId) {
        try {
          await this.updateChatSessionStatus(sessionId, "ended");
        } catch (error) {
          console.error("Error ending chat session:", error);
          throw error;
        }
      }
      async rateChatSession(sessionId, rating, feedback) {
        try {
          const db2 = this.ensureDb();
          await db2.update(liveChatSessions).set({ rating, feedback }).where(eq(liveChatSessions.id, sessionId));
        } catch (error) {
          console.error("Error rating chat session:", error);
          throw error;
        }
      }
      async getChatSessions(options) {
        try {
          const db2 = this.ensureDb();
          let query = db2.select({
            session: liveChatSessions,
            user: {
              id: users.id,
              email: users.email,
              username: users.username,
              firstName: users.firstName,
              lastName: users.lastName
            }
          }).from(liveChatSessions).leftJoin(users, eq(liveChatSessions.userId, users.id));
          if (options.status) {
            query = query.where(eq(liveChatSessions.status, options.status));
          }
          const offset = (options.page - 1) * options.limit;
          const sessions2 = await query.orderBy(desc(liveChatSessions.startedAt)).limit(options.limit).offset(offset);
          let countQuery = db2.select({ count: count() }).from(liveChatSessions);
          if (options.status) {
            countQuery = countQuery.where(eq(liveChatSessions.status, options.status));
          }
          const totalResult = await countQuery;
          const total = totalResult[0]?.count || 0;
          return {
            sessions: sessions2.map((row) => ({
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
      async assignChatSession(sessionId, agentId, agentName) {
        try {
          await this.updateChatSessionStatus(sessionId, "active", agentId);
        } catch (error) {
          console.error("Error assigning chat session:", error);
          throw error;
        }
      }
      async notifyAdminsNewChatSession(session2) {
        try {
          const db2 = this.ensureDb();
          const admins = await db2.select().from(users).where(eq(users.role, "admin"));
          for (const admin of admins) {
            await this.createNotification({
              userId: admin.id,
              type: "new_chat_session",
              title: "New Chat Session",
              message: `New support chat session started: ${session2.subject}`,
              data: JSON.stringify({ sessionId: session2.id, subject: session2.subject })
            });
          }
        } catch (error) {
          console.error("Error notifying admins of new chat session:", error);
        }
      }
      async createLendingPosition(data) {
        try {
          return {
            id: Date.now().toString(),
            ...data,
            createdAt: /* @__PURE__ */ new Date()
          };
        } catch (error) {
          console.error("Error creating lending position:", error);
          throw error;
        }
      }
      async getLendingPosition(positionId, userId) {
        try {
          return {
            id: positionId,
            userId,
            assetSymbol: "USDC",
            amount: "1000",
            apy: "12.5%",
            startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1e3),
            status: "active"
          };
        } catch (error) {
          console.error("Error fetching lending position:", error);
          return null;
        }
      }
      async updateLendingPosition(positionId, updates) {
        try {
          return { id: positionId, ...updates, updatedAt: /* @__PURE__ */ new Date() };
        } catch (error) {
          console.error("Error updating lending position:", error);
          throw error;
        }
      }
      async getUserLoans(userId) {
        try {
          return [
            {
              id: "1",
              assetSymbol: "USDC",
              amount: "500",
              collateralSymbol: "BTC",
              collateralAmount: "0.02",
              interestRate: "8.5",
              loanTerm: "30d",
              startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1e3),
              endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1e3),
              status: "active"
            }
          ];
        } catch (error) {
          console.error("Error fetching user loans:", error);
          return [];
        }
      }
      async createLoan(data) {
        try {
          return {
            id: Date.now().toString(),
            ...data,
            createdAt: /* @__PURE__ */ new Date()
          };
        } catch (error) {
          console.error("Error creating loan:", error);
          throw error;
        }
      }
      async getLoan(loanId, userId) {
        try {
          return {
            id: loanId,
            userId,
            assetSymbol: "USDC",
            amount: "500",
            collateralSymbol: "BTC",
            collateralAmount: "0.02",
            interestRate: "8.5",
            startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1e3),
            status: "active"
          };
        } catch (error) {
          console.error("Error fetching loan:", error);
          return null;
        }
      }
      async updateLoan(loanId, updates) {
        try {
          return { id: loanId, ...updates, updatedAt: /* @__PURE__ */ new Date() };
        } catch (error) {
          console.error("Error updating loan:", error);
          throw error;
        }
      }
      // Deposit methods
      async createDeposit(depositData) {
        const [deposit] = await this.db.insert(deposits).values({
          ...depositData,
          id: nanoid2(),
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return deposit;
      }
      async getDepositById(id) {
        const [deposit] = await this.db.select().from(deposits).where(eq(deposits.id, id)).limit(1);
        return deposit || null;
      }
      async getUserDeposits(userId, limit) {
        let query = this.db.select().from(deposits).where(eq(deposits.userId, userId)).orderBy(desc(deposits.createdAt));
        if (limit) {
          query = query.limit(limit);
        }
        return await query;
      }
      async getAllDeposits() {
        return await this.db.select({
          id: deposits.id,
          userId: deposits.userId,
          amount: deposits.amount,
          currency: deposits.currency,
          assetType: deposits.assetType,
          paymentMethod: deposits.paymentMethod,
          status: deposits.status,
          proofImageUrl: deposits.proofImageUrl,
          adminNotes: deposits.adminNotes,
          rejectionReason: deposits.rejectionReason,
          approvedAt: deposits.approvedAt,
          createdAt: deposits.createdAt,
          updatedAt: deposits.updatedAt,
          username: users.username,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName
        }).from(deposits).leftJoin(users, eq(deposits.userId, users.id)).orderBy(desc(deposits.createdAt));
      }
      async updateDeposit(id, updates) {
        const [deposit] = await this.db.update(deposits).set({
          ...updates,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(deposits.id, id)).returning();
        return deposit;
      }
      // Shared wallet address methods
      async getSharedWalletAddresses() {
        try {
          const db2 = this.ensureDb();
          return await db2.select().from(sharedWalletAddresses).where(eq(sharedWalletAddresses.isActive, true)).orderBy(sharedWalletAddresses.symbol);
        } catch (error) {
          console.error("Error fetching shared wallet addresses:", error);
          return [];
        }
      }
      async createOrUpdateSharedWalletAddress(addressData) {
        try {
          const db2 = this.ensureDb();
          const [existing] = await db2.select().from(sharedWalletAddresses).where(eq(sharedWalletAddresses.symbol, addressData.symbol));
          if (existing) {
            const [updated] = await db2.update(sharedWalletAddresses).set({
              ...addressData,
              updatedAt: /* @__PURE__ */ new Date()
            }).where(eq(sharedWalletAddresses.symbol, addressData.symbol)).returning();
            return updated;
          } else {
            const [created] = await db2.insert(sharedWalletAddresses).values(addressData).returning();
            return created;
          }
        } catch (error) {
          console.error("Error creating/updating shared wallet address:", error);
          throw error;
        }
      }
      // Withdrawal methods
      async createWithdrawal(withdrawalData) {
        try {
          const db2 = this.ensureDb();
          const [result] = await db2.insert(withdrawals).values({
            userId: withdrawalData.userId,
            amount: withdrawalData.amount,
            currency: withdrawalData.currency,
            withdrawalMethod: withdrawalData.withdrawalMethod,
            destinationAddress: withdrawalData.destinationAddress,
            destinationDetails: withdrawalData.destinationDetails,
            status: withdrawalData.status || "pending",
            fees: withdrawalData.fees || "0",
            netAmount: withdrawalData.netAmount,
            confirmationToken: withdrawalData.confirmationToken,
            confirmationExpiresAt: withdrawalData.confirmationExpiresAt ? new Date(withdrawalData.confirmationExpiresAt) : null,
            requestedAt: /* @__PURE__ */ new Date(),
            isConfirmed: false
          }).returning();
          return result;
        } catch (error) {
          console.error("Error creating withdrawal:", error);
          throw error;
        }
      }
      async getUserWithdrawals(userId) {
        try {
          const db2 = this.ensureDb();
          return await db2.select().from(withdrawals).where(eq(withdrawals.userId, userId)).orderBy(desc(withdrawals.createdAt));
        } catch (error) {
          console.error("Error fetching user withdrawals:", error);
          return [];
        }
      }
      async getAllWithdrawals() {
        try {
          const db2 = this.ensureDb();
          return await db2.select({
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
          }).from(withdrawals).leftJoin(users, eq(withdrawals.userId, users.id)).orderBy(desc(withdrawals.createdAt));
        } catch (error) {
          console.error("Error fetching all withdrawals:", error);
          return [];
        }
      }
      async getWithdrawalById(id) {
        try {
          const db2 = this.ensureDb();
          const [result] = await db2.select().from(withdrawals).where(eq(withdrawals.id, id)).limit(1);
          return result;
        } catch (error) {
          console.error("Error fetching withdrawal by ID:", error);
          return null;
        }
      }
      async updateWithdrawalStatus(id, status, adminNotes) {
        try {
          const db2 = this.ensureDb();
          const updateData = {
            status,
            updatedAt: /* @__PURE__ */ new Date()
          };
          if (adminNotes) {
            updateData.adminNotes = adminNotes;
          }
          if (status === "approved") {
            updateData.reviewedAt = /* @__PURE__ */ new Date();
          } else if (status === "completed") {
            updateData.completedAt = /* @__PURE__ */ new Date();
          } else if (status === "processing") {
            updateData.processedAt = /* @__PURE__ */ new Date();
          }
          const [result] = await db2.update(withdrawals).set(updateData).where(eq(withdrawals.id, id)).returning();
          return result;
        } catch (error) {
          console.error("Error updating withdrawal status:", error);
          throw error;
        }
      }
      async confirmWithdrawal(userId, token) {
        try {
          const db2 = this.ensureDb();
          const [withdrawal] = await db2.select().from(withdrawals).where(and(
            eq(withdrawals.userId, userId),
            eq(withdrawals.confirmationToken, token),
            eq(withdrawals.isConfirmed, false)
          )).limit(1);
          if (!withdrawal) {
            return null;
          }
          if (withdrawal.confirmationExpiresAt && /* @__PURE__ */ new Date() > withdrawal.confirmationExpiresAt) {
            return null;
          }
          const [confirmed] = await db2.update(withdrawals).set({
            isConfirmed: true,
            status: "under_review",
            confirmationToken: null,
            confirmationExpiresAt: null,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(withdrawals.id, withdrawal.id)).returning();
          return confirmed;
        } catch (error) {
          console.error("Error confirming withdrawal:", error);
          return null;
        }
      }
      async getWithdrawalLimits(userId) {
        try {
          const db2 = this.ensureDb();
          const [limits] = await db2.select().from(withdrawalLimits).where(eq(withdrawalLimits.userId, userId)).limit(1);
          if (limits) {
            return {
              dailyLimit: parseFloat(limits.dailyLimit),
              monthlyLimit: parseFloat(limits.monthlyLimit),
              dailyUsed: parseFloat(limits.dailyUsed),
              monthlyUsed: parseFloat(limits.monthlyUsed)
            };
          }
          const [newLimits] = await db2.insert(withdrawalLimits).values({
            userId,
            dailyLimit: "10000.00",
            monthlyLimit: "50000.00",
            dailyUsed: "0.00",
            monthlyUsed: "0.00",
            lastResetDate: /* @__PURE__ */ new Date()
          }).returning();
          return {
            dailyLimit: parseFloat(newLimits.dailyLimit),
            monthlyLimit: parseFloat(newLimits.monthlyLimit),
            dailyUsed: parseFloat(newLimits.dailyUsed),
            monthlyUsed: parseFloat(newLimits.monthlyUsed)
          };
        } catch (error) {
          console.error("Error fetching withdrawal limits:", error);
          return {
            dailyLimit: 1e4,
            monthlyLimit: 5e4,
            dailyUsed: 0,
            monthlyUsed: 0
          };
        }
      }
      async setWithdrawalLimits(userId, limits) {
        try {
          const db2 = this.ensureDb();
          const [result] = await db2.insert(withdrawalLimits).values({
            userId,
            dailyLimit: limits.dailyLimit.toString(),
            monthlyLimit: limits.monthlyLimit.toString(),
            dailyUsed: "0.00",
            monthlyUsed: "0.00",
            lastResetDate: /* @__PURE__ */ new Date()
          }).onConflictDoUpdate({
            target: withdrawalLimits.userId,
            set: {
              dailyLimit: limits.dailyLimit.toString(),
              monthlyLimit: limits.monthlyLimit.toString(),
              updatedAt: /* @__PURE__ */ new Date()
            }
          }).returning();
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
      async calculateWithdrawalFees(amount, method) {
        try {
          const feeRates = {
            bank_transfer: 0.015,
            // 1.5%
            crypto_wallet: 5e-3,
            // 0.5%
            paypal: 0.025,
            // 2.5%
            mobile_money: 0.02,
            // 2%
            other: 0.02
            // 2%
          };
          const rate = feeRates[method] || 0.02;
          const fee = amount * rate;
          const minFee = method === "crypto_wallet" ? 2 : 5;
          const maxFee = method === "crypto_wallet" ? 50 : 100;
          return Math.max(minFee, Math.min(fee, maxFee));
        } catch (error) {
          console.error("Error calculating withdrawal fees:", error);
          return 25;
        }
      }
      // KYC Verification methods implementation
      async createKycVerification(data) {
        try {
          const db2 = this.ensureDb();
          const [kyc] = await db2.insert(kycVerifications).values(data).returning();
          return kyc;
        } catch (error) {
          console.error("Error creating KYC verification:", error);
          throw error;
        }
      }
      async getKycVerification(userId) {
        try {
          const db2 = this.ensureDb();
          const [kyc] = await db2.select().from(kycVerifications).where(eq(kycVerifications.userId, userId)).limit(1);
          return kyc || null;
        } catch (error) {
          console.error("Error fetching KYC verification:", error);
          return null;
        }
      }
      async getKycVerificationById(id) {
        try {
          const db2 = this.ensureDb();
          const [kyc] = await db2.select().from(kycVerifications).where(eq(kycVerifications.id, id)).limit(1);
          return kyc || null;
        } catch (error) {
          console.error("Error fetching KYC verification by ID:", error);
          return null;
        }
      }
      async updateKycVerification(id, data) {
        try {
          const db2 = this.ensureDb();
          const [kyc] = await db2.update(kycVerifications).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(kycVerifications.id, id)).returning();
          return kyc;
        } catch (error) {
          console.error("Error updating KYC verification:", error);
          throw error;
        }
      }
      async getAllKycVerifications(options) {
        try {
          const { page = 1, limit = 20, status, search } = options;
          const offset = (page - 1) * limit;
          const db2 = this.ensureDb();
          let query = db2.select({
            kyc: kycVerifications,
            user: {
              id: users.id,
              email: users.email,
              username: users.username,
              firstName: users.firstName,
              lastName: users.lastName
            }
          }).from(kycVerifications).leftJoin(users, eq(kycVerifications.userId, users.id));
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
          const verifications = await query.orderBy(desc(kycVerifications.createdAt)).limit(limit).offset(offset);
          let countQuery = db2.select({ count: count() }).from(kycVerifications);
          if (status) {
            countQuery = countQuery.where(eq(kycVerifications.status, status));
          }
          const totalResult = await countQuery;
          const total = totalResult[0]?.count || 0;
          return {
            verifications: verifications.map((row) => ({
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
      async getKycStatistics() {
        try {
          const db2 = this.ensureDb();
          const [total] = await db2.select({ count: count() }).from(kycVerifications);
          const [pending] = await db2.select({ count: count() }).from(kycVerifications).where(eq(kycVerifications.status, "pending"));
          const [underReview] = await db2.select({ count: count() }).from(kycVerifications).where(eq(kycVerifications.status, "under_review"));
          const [approved] = await db2.select({ count: count() }).from(kycVerifications).where(eq(kycVerifications.status, "approved"));
          const [rejected] = await db2.select({ count: count() }).from(kycVerifications).where(eq(kycVerifications.status, "rejected"));
          const totalCount = Number(total.count);
          const approvedCount = Number(approved.count);
          const approvalRate = totalCount > 0 ? approvedCount / totalCount * 100 : 0;
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
      async getWithdrawalStats() {
        try {
          const db2 = this.ensureDb();
          const totalWithdrawals = await db2.select({ count: count() }).from(withdrawals);
          const pendingWithdrawals = await db2.select({ count: count() }).from(withdrawals).where(eq(withdrawals.status, "pending"));
          const approvedWithdrawals = await db2.select({ count: count() }).from(withdrawals).where(eq(withdrawals.status, "approved"));
          const totalVolume = await db2.select({ total: sum(withdrawals.amount) }).from(withdrawals).where(eq(withdrawals.status, "completed"));
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
      async cancelWithdrawal(userId, withdrawalId) {
        try {
          const db2 = this.ensureDb();
          const [result] = await db2.update(withdrawals).set({
            status: "cancelled",
            updatedAt: /* @__PURE__ */ new Date()
          }).where(and(
            eq(withdrawals.id, withdrawalId),
            eq(withdrawals.userId, userId),
            or(
              eq(withdrawals.status, "pending"),
              eq(withdrawals.status, "pending_confirmation")
            )
          )).returning();
          return !!result;
        } catch (error) {
          console.error("Error cancelling withdrawal:", error);
          return false;
        }
      }
      async getAnalyticsOverview() {
        try {
          const db2 = this.ensureDb();
          const [userCount] = await db2.select({ count: sql3`count(*)` }).from(users);
          const [transactionCount] = await db2.select({ count: sql3`count(*)` }).from(transactions);
          const [depositCount] = await db2.select({ count: sql3`count(*)` }).from(deposits);
          const [totalVolume] = await db2.select({ total: sql3`sum(${transactions.total})` }).from(transactions).where(eq(transactions.status, "completed"));
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
      async getRevenueAnalytics(period) {
        try {
          const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
          const revenue = [];
          for (let i = days - 1; i >= 0; i--) {
            const date = /* @__PURE__ */ new Date();
            date.setDate(date.getDate() - i);
            revenue.push({
              date: date.toISOString().split("T")[0],
              revenue: Math.random() * 1e4 + 5e3,
              transactions: Math.floor(Math.random() * 100) + 50
            });
          }
          return revenue;
        } catch (error) {
          console.error("Error fetching revenue analytics:", error);
          return [];
        }
      }
      async getUserAnalytics(period) {
        try {
          const days = period === "30d" ? 30 : 90;
          const cutoff = /* @__PURE__ */ new Date();
          cutoff.setDate(cutoff.getDate() - days);
          const db2 = this.ensureDb();
          const [newUsers] = await db2.select({ count: sql3`count(*)` }).from(users).where(gte(users.createdAt, cutoff));
          const [activeUsers] = await db2.select({ count: sql3`count(*)` }).from(users).where(and(
            eq(users.isActive, true),
            gte(users.createdAt, cutoff)
          ));
          return {
            newUsers: Number(newUsers.count),
            activeUsers: Number(activeUsers.count),
            growthRate: Math.random() * 20 + 5
            // Mock growth rate
          };
        } catch (error) {
          console.error("Error fetching user analytics:", error);
          return { newUsers: 0, activeUsers: 0, growthRate: 0 };
        }
      }
      async getActiveSessions() {
        try {
          return [
            { userId: "1", ip: "192.168.1.1", userAgent: "Chrome/91.0", lastActivity: /* @__PURE__ */ new Date() },
            { userId: "2", ip: "192.168.1.2", userAgent: "Firefox/89.0", lastActivity: /* @__PURE__ */ new Date() }
          ];
        } catch (error) {
          console.error("Error fetching active sessions:", error);
          return [];
        }
      }
      async invalidateUserSessions(userId) {
        try {
          console.log(`Invalidating sessions for user ${userId}`);
        } catch (error) {
          console.error("Error invalidating user sessions:", error);
        }
      }
      async invalidateAllSessions() {
        try {
          console.log("Invalidating all user sessions");
        } catch (error) {
          console.error("Error invalidating all sessions:", error);
        }
      }
      async getSystemConfig() {
        try {
          return {
            maintenance_mode: false,
            trading_enabled: true,
            max_daily_withdrawal: 5e4,
            kyc_required: true,
            api_rate_limit: 100
          };
        } catch (error) {
          console.error("Error fetching system config:", error);
          return {};
        }
      }
      async updateSystemConfig(config2) {
        try {
          console.log("Updating system config:", config2);
          return config2;
        } catch (error) {
          console.error("Error updating system config:", error);
          throw error;
        }
      }
      // Audit operations
      async logAdminAction(action) {
        try {
          const db2 = this.ensureDb();
          const { auditLogs: auditLogs2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
          await db2.insert(auditLogs2).values({
            adminId: action.adminId,
            action: action.action,
            targetId: action.targetId,
            targetUserId: action.targetUserId,
            details: action.details ? JSON.stringify(action.details) : null,
            timestamp: action.timestamp
          });
        } catch (error) {
          console.error("Error logging admin action:", error);
        }
      }
      async createAuditLog(logData) {
        try {
          const db2 = this.ensureDb();
          const { auditLogs: auditLogs2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
          await db2.insert(auditLogs2).values({
            ...logData,
            details: JSON.stringify(logData.details),
            timestamp: /* @__PURE__ */ new Date()
          });
          return true;
        } catch (error) {
          console.error("Error creating audit log:", error);
          return false;
        }
      }
      async getAuditLogs(options) {
        try {
          const db2 = this.ensureDb();
          const { auditLogs: auditLogs2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
          let query = db2.select().from(auditLogs2);
          if (options.action) {
            query = query.where(eq(auditLogs2.action, options.action));
          }
          if (options.userId) {
            query = query.where(eq(auditLogs2.adminId, options.userId));
          }
          const offset = (options.page - 1) * options.limit;
          const logs = await query.orderBy(desc(auditLogs2.timestamp)).limit(options.limit).offset(offset);
          const [{ count: count2 }] = await db2.select({ count: sql3`count(*)` }).from(auditLogs2);
          return {
            logs,
            pagination: {
              page: options.page,
              limit: options.limit,
              total: Number(count2),
              pages: Math.ceil(Number(count2) / options.limit)
            }
          };
        } catch (error) {
          console.error("Error fetching audit logs:", error);
          return { logs: [], pagination: { page: 1, limit: 50, total: 0, pages: 0 } };
        }
      }
      // User Preferences operations
      async getUserPreferences(userId) {
        try {
          const db2 = this.ensureDb();
          const result = await db2.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);
          return result[0];
        } catch (error) {
          console.error("Error fetching user preferences:", error);
          return void 0;
        }
      }
      async createUserPreferences(preferences) {
        try {
          const db2 = this.ensureDb();
          const result = await db2.insert(userPreferences).values(preferences).returning();
          return result[0];
        } catch (error) {
          console.error("Error creating user preferences:", error);
          throw error;
        }
      }
      async updateUserPreferences(userId, updates) {
        try {
          const db2 = this.ensureDb();
          const existing = await this.getUserPreferences(userId);
          if (!existing) {
            return await this.createUserPreferences({ userId, ...updates });
          }
          const result = await db2.update(userPreferences).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(userPreferences.userId, userId)).returning();
          return result[0];
        } catch (error) {
          console.error("Error updating user preferences:", error);
          throw error;
        }
      }
      // Get holdings with current prices
      async getHoldingsWithPrices(portfolioId) {
        try {
          const userHoldings = await this.getHoldings(portfolioId);
          return userHoldings.map((holding) => ({
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
      async getSystemAnalytics(period = "30d") {
        try {
          const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
          const startDate = /* @__PURE__ */ new Date();
          startDate.setDate(startDate.getDate() - days);
          const userRegistrations = await this.db.select({
            date: sql3`DATE(${users.createdAt})`.as("date"),
            count: count()
          }).from(users).where(gte(users.createdAt, startDate)).groupBy(sql3`DATE(${users.createdAt})`).orderBy(sql3`DATE(${users.createdAt})`);
          const transactionVolume = await this.db.select({
            date: sql3`DATE(${transactions.createdAt})`.as("date"),
            volume: sum(transactions.total),
            count: count()
          }).from(transactions).where(gte(transactions.createdAt, startDate)).groupBy(sql3`DATE(${transactions.createdAt})`).orderBy(sql3`DATE(${transactions.createdAt})`);
          const topAssets = await this.db.select({
            symbol: transactions.symbol,
            totalVolume: sum(transactions.total),
            transactionCount: count()
          }).from(transactions).where(gte(transactions.createdAt, startDate)).groupBy(transactions.symbol).orderBy(desc(sum(transactions.total))).limit(10);
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
      async getTransactionsForAdmin(options) {
        try {
          let query = this.db.select({
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
          const result = await query.limit(options.limit).offset(offset).orderBy(desc(transactions.createdAt));
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
      async updateTransactionStatus(transactionId, status, reason, adminId) {
        try {
          const updatedTransaction = await this.db.update(transactions).set({
            status,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(transactions.id, transactionId)).returning();
          await this.logAdminAction({
            adminId,
            action: "transaction_status_update",
            targetId: transactionId,
            details: { status, reason, userId: updatedTransaction[0]?.userId },
            timestamp: /* @__PURE__ */ new Date()
          });
          return true;
        } catch (error) {
          console.error("Error updating transaction status:", error);
          throw error;
        }
      }
      // Delete user (admin action)
      async deleteUser(userId) {
        try {
          const portfolio = await this.getPortfolio(userId);
          if (portfolio) {
            await this.db.delete(holdings).where(eq(holdings.portfolioId, portfolio.id));
            await this.db.delete(portfolios).where(eq(portfolios.id, portfolio.id));
          }
          await this.db.delete(transactions).where(eq(transactions.userId, userId));
          await this.db.delete(priceAlerts).where(eq(priceAlerts.userId, userId));
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
          return {
            maintenanceMode: false,
            registrationEnabled: true,
            tradingEnabled: true,
            maxWithdrawalAmount: 5e4,
            minDepositAmount: 10,
            tradingFeePercentage: 0.1,
            withdrawalFeePercentage: 0.5,
            supportedCurrencies: ["USD", "EUR", "BTC", "ETH"],
            kycRequired: true,
            apiRateLimits: {
              requests: 1e3,
              windowMs: 36e5
            }
          };
        } catch (error) {
          console.error("Error getting platform settings:", error);
          throw error;
        }
      }
      async updatePlatformSettings(settings, adminId) {
        try {
          await this.createAuditLog({
            adminId,
            action: "settings_update",
            targetId: "platform",
            details: settings,
            ipAddress: "",
            // IP address should ideally be passed or obtained from request context
            userAgent: ""
            // User agent should ideally be passed or obtained from request context
          });
          return true;
        } catch (error) {
          console.error("Error updating platform settings:", error);
          throw error;
        }
      }
      // Audit logging
      async logAdminAction(action) {
        console.log("Admin action logged:", {
          ...action,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      async getAuditLogs(options) {
        return {
          logs: [],
          pagination: {
            page: options.page,
            limit: options.limit,
            total: 0,
            pages: 0
          }
        };
      }
      // Add this method to create initial users if they don't exist
      async createInitialUsers() {
        try {
          const existingDemoUser = await this.getUserByEmail("demo@example.com");
          if (existingDemoUser) {
            console.log("\u2705 Demo users already exist");
            return;
          }
          console.log("\u{1F331} Creating initial test users...");
          const demoPasswordHash = await hashPassword("demo123");
          const demoUser = {
            id: "demo-user-id",
            username: "demo",
            email: "demo@example.com",
            password: demoPasswordHash,
            firstName: "Demo",
            lastName: "User",
            role: "user",
            isActive: true,
            isVerified: true,
            phone: "+1234567890",
            profileImageUrl: null,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          };
          await db.insert(users).values(demoUser).onConflictDoNothing();
          const testPasswordHash = await hashPassword("test123");
          const testUser = {
            id: "test-user-id",
            username: "testuser",
            email: "test@bitpanda.com",
            password: testPasswordHash,
            firstName: "Test",
            lastName: "User",
            role: "user",
            isActive: true,
            isVerified: true,
            phone: "+1987654321",
            profileImageUrl: null,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          };
          await db.insert(users).values(testUser).onConflictDoNothing();
          const adminPasswordHash = await hashPassword("admin123");
          const adminUser = {
            id: "admin-user-id",
            username: "admin",
            email: "admin@example.com",
            password: adminPasswordHash,
            firstName: "Admin",
            lastName: "User",
            role: "admin",
            isActive: true,
            isVerified: true,
            phone: "+1555000000",
            profileImageUrl: null,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          };
          await db.insert(users).values(adminUser).onConflictDoNothing();
          console.log("\u2705 Test users created successfully");
          console.log("\u{1F4E7} Demo User: demo@example.com / demo123");
          console.log("\u{1F4E7} Test User: test@bitpanda.com / test123");
          console.log("\u{1F451} Admin User: admin@example.com / admin123");
        } catch (error) {
          console.error("\u274C Failed to create initial users:", error);
        }
      }
      // Placeholder methods for Enhanced Trading System
      async validateOrder(orderData) {
        console.log("Validating order:", orderData);
        return { isValid: true };
      }
      async calculateTradingFees(amount, type, orderType) {
        console.log(`Calculating fees for amount: ${amount}, type: ${type}, orderType: ${orderType}`);
        let feePercentage = 1e-3;
        if (orderType === "limit") {
          feePercentage = 8e-4;
        }
        return amount * feePercentage;
      }
      async executeTrade(tradeData) {
        console.log("Executing trade:", tradeData);
        return { success: true, tradeId: `trade_${Date.now()}` };
      }
      async getOpenOrders(userId) {
        console.log(`Fetching open orders for user: ${userId}`);
        return [];
      }
      async getOrderHistory(userId) {
        console.log(`Fetching order history for user: ${userId}`);
        return [];
      }
      // KYC methods are already implemented above
      // Advanced order management
      async createAdvancedOrder(orderData) {
        const db2 = this.ensureDb();
        const order = {
          id: crypto.randomUUID(),
          ...orderData,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        const [transaction] = await db2.insert(transactions).values({
          userId: orderData.userId,
          symbol: orderData.symbol,
          type: orderData.side,
          amount: orderData.amount.toString(),
          price: (orderData.limitPrice || orderData.triggerPrice || 0).toString(),
          total: (orderData.amount * (orderData.limitPrice || orderData.triggerPrice || 0)).toString(),
          status: "pending",
          orderType: orderData.type,
          stopLoss: orderData.triggerPrice?.toString(),
          takeProfit: orderData.limitPrice?.toString()
        }).returning();
        return transaction;
      }
      async getActiveAdvancedOrders(userId) {
        const db2 = this.ensureDb();
        const userTransactions = await db2.select().from(transactions).where(and(
          eq(transactions.userId, userId),
          eq(transactions.status, "pending"),
          ne(transactions.orderType, "market")
        )).orderBy(desc(transactions.createdAt));
        return userTransactions;
      }
      async cancelAdvancedOrder(orderId, userId) {
        const db2 = this.ensureDb();
        const [order] = await db2.update(transactions).set({
          status: "cancelled",
          updatedAt: /* @__PURE__ */ new Date()
        }).where(and(
          eq(transactions.id, parseInt(orderId)),
          eq(transactions.userId, userId),
          eq(transactions.status, "pending")
        )).returning();
        return order;
      }
      // Added updateTransaction method
      async updateTransaction(transactionId, updates) {
        const db2 = this.ensureDb();
        const [updatedTransaction] = await db2.update(transactions).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(transactions.id, transactionId)).returning();
        return updatedTransaction;
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/config.ts
var config, config_default;
var init_config = __esm({
  "server/config.ts"() {
    "use strict";
    config = {
      // CoinGecko API - free tier has rate limits
      coinGeckoApiKey: process.env.COINGECKO_API_KEY || "",
      // NewsAPI key for real news data
      newsApiKey: process.env.NEWS_API_KEY || "",
      // Database
      databaseUrl: process.env.DATABASE_URL || "",
      // Server settings
      port: process.env.PORT || 5e3,
      nodeEnv: process.env.NODE_ENV || "development",
      // Rate limiting
      rateLimitWindow: 15 * 60 * 1e3,
      // 15 minutes
      rateLimitMax: 100,
      // requests per window
      // WebSocket settings
      wsHeartbeatInterval: 3e4,
      // 30 seconds
      priceUpdateInterval: 3e4,
      // 30 seconds for free tier APIs
      // Cache settings
      cacheTimeout: 3e4,
      // 30 seconds
      newsApiCacheTimeout: 3e5,
      // 5 minutes
      // API URLs
      coinGeckoBaseUrl: "https://api.coingecko.com/api/v3",
      newsApiBaseUrl: "https://newsapi.org/v2",
      cryptoPanicBaseUrl: "https://cryptopanic.com/api/v1"
    };
    config_default = config;
  }
});

// server/crypto-service.ts
var crypto_service_exports = {};
__export(crypto_service_exports, {
  cryptoService: () => cryptoService
});
var CryptoService, cryptoService;
var init_crypto_service = __esm({
  "server/crypto-service.ts"() {
    "use strict";
    init_config();
    CryptoService = class {
      baseUrl = config_default.coinGeckoBaseUrl;
      cache = /* @__PURE__ */ new Map();
      cacheTimeout = config_default.cacheTimeout;
      rateLimitDelay = 1100;
      // 1.1 second between requests for free tier
      lastRequestTime = 0;
      apiKey = config_default.coinGeckoApiKey;
      rateLimitInfo = {
        remaining: 100,
        resetTime: Date.now() + 6e4,
        used: 0,
        limit: 100
      };
      requestQueue = [];
      isProcessingQueue = false;
      // Enhanced symbol mapping with more cryptocurrencies
      CRYPTO_IDS = {
        "BTC": "bitcoin",
        "ETH": "ethereum",
        "BNB": "binancecoin",
        "ADA": "cardano",
        "SOL": "solana",
        "XRP": "ripple",
        "DOT": "polkadot",
        "DOGE": "dogecoin",
        "AVAX": "avalanche-2",
        "MATIC": "matic-network",
        "LINK": "chainlink",
        "UNI": "uniswap",
        "LTC": "litecoin",
        "ALGO": "algorand",
        "VET": "vechain",
        "ICP": "internet-computer",
        "FIL": "filecoin",
        "TRX": "tron",
        "ETC": "ethereum-classic",
        "XLM": "stellar",
        "ATOM": "cosmos",
        "NEAR": "near",
        "MANA": "decentraland",
        "SAND": "the-sandbox",
        "APE": "apecoin",
        "CRO": "cronos",
        "LRC": "loopring",
        "ENJ": "enjincoin",
        "BAT": "basic-attention-token",
        "ZEC": "zcash"
      };
      isValidCacheEntry(entry) {
        return Date.now() - entry.timestamp < this.cacheTimeout;
      }
      updateRateLimitInfo(headers) {
        const remaining = headers.get("x-ratelimit-remaining");
        const limit = headers.get("x-ratelimit-limit");
        const reset = headers.get("x-ratelimit-reset");
        if (remaining) this.rateLimitInfo.remaining = parseInt(remaining);
        if (limit) this.rateLimitInfo.limit = parseInt(limit);
        if (reset) this.rateLimitInfo.resetTime = parseInt(reset) * 1e3;
        console.log(`\u{1F504} Rate limit: ${this.rateLimitInfo.remaining}/${this.rateLimitInfo.limit} remaining`);
      }
      async processRequestQueue() {
        if (this.isProcessingQueue || this.requestQueue.length === 0) return;
        this.isProcessingQueue = true;
        while (this.requestQueue.length > 0) {
          if (this.rateLimitInfo.remaining <= 1) {
            const waitTime = Math.max(0, this.rateLimitInfo.resetTime - Date.now());
            console.log(`\u23F3 Rate limit reached, waiting ${waitTime}ms`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
          }
          const request = this.requestQueue.shift();
          if (request) {
            await request();
            await new Promise((resolve) => setTimeout(resolve, this.rateLimitDelay));
          }
        }
        this.isProcessingQueue = false;
      }
      async rateLimitedFetch(url) {
        return new Promise((resolve, reject) => {
          const executeRequest = async () => {
            try {
              const now = Date.now();
              const timeSinceLastRequest = now - this.lastRequestTime;
              if (timeSinceLastRequest < this.rateLimitDelay) {
                await new Promise((resolve2) => setTimeout(resolve2, this.rateLimitDelay - timeSinceLastRequest));
              }
              this.lastRequestTime = Date.now();
              const headers = {
                "Accept": "application/json",
                "User-Agent": "BitpandaPro/1.0 (Professional Trading Platform)"
              };
              if (this.apiKey) {
                headers["x-cg-pro-api-key"] = this.apiKey;
              }
              console.log(`\u{1F310} Fetching: ${url}`);
              const response = await fetch(url, { headers });
              this.updateRateLimitInfo(response.headers);
              resolve(response);
            } catch (error) {
              reject(error);
            }
          };
          this.requestQueue.push(executeRequest);
          this.processRequestQueue();
        });
      }
      async getMarketData(symbols, limit = 50) {
        const cacheKey = `market-${symbols?.join(",") || "all"}-${limit}`;
        const cachedData = this.cache.get(cacheKey);
        if (cachedData && this.isValidCacheEntry(cachedData)) {
          console.log(`\u{1F4CB} Cache hit for ${cacheKey}`);
          return cachedData.data;
        }
        try {
          let url = `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=1h,24h,7d`;
          if (symbols && symbols.length > 0) {
            const coinIds = symbols.map((s) => this.CRYPTO_IDS[s.toUpperCase()] || s.toLowerCase()).join(",");
            url += `&ids=${coinIds}`;
          }
          const response = await this.rateLimitedFetch(url);
          if (response.status === 429) {
            console.warn("\u26A0\uFE0F Rate limited, using cached data or fallback");
            return this.getFallbackData(limit);
          }
          if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          if (!Array.isArray(data)) {
            throw new Error("Invalid response format from CoinGecko");
          }
          const transformedData = data.map((coin) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            current_price: coin.current_price || 0,
            market_cap: coin.market_cap || 0,
            market_cap_rank: coin.market_cap_rank || 0,
            fully_diluted_valuation: coin.fully_diluted_valuation,
            total_volume: coin.total_volume || 0,
            high_24h: coin.high_24h || coin.current_price,
            low_24h: coin.low_24h || coin.current_price,
            price_change_24h: coin.price_change_24h || 0,
            price_change_percentage_24h: coin.price_change_percentage_24h || 0,
            price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency,
            price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
            market_cap_change_24h: coin.market_cap_change_24h,
            market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
            circulating_supply: coin.circulating_supply,
            total_supply: coin.total_supply,
            max_supply: coin.max_supply,
            ath: coin.ath,
            ath_change_percentage: coin.ath_change_percentage,
            ath_date: coin.ath_date,
            atl: coin.atl,
            atl_change_percentage: coin.atl_change_percentage,
            atl_date: coin.atl_date,
            roi: coin.roi,
            last_updated: coin.last_updated,
            image: coin.image
          }));
          this.cache.set(cacheKey, { data: transformedData, timestamp: Date.now() });
          console.log(`\u2705 Fetched ${transformedData.length} cryptocurrencies`);
          return transformedData;
        } catch (error) {
          console.error("\u274C Error fetching crypto market data:", error);
          return this.getFallbackData(limit);
        }
      }
      async getPrice(symbol) {
        const cacheKey = `price_${symbol.toLowerCase()}`;
        const cached = this.cache.get(cacheKey);
        if (cached && this.isValidCacheEntry(cached)) {
          return cached.data;
        }
        try {
          const coinId = this.CRYPTO_IDS[symbol.toUpperCase()] || symbol.toLowerCase();
          const response = await this.rateLimitedFetch(
            `${this.baseUrl}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true&include_last_updated_at=true`
          );
          if (response.status === 429) {
            console.warn(`\u26A0\uFE0F Rate limited for ${symbol}, using fallback`);
            return this.getFallbackPrice(symbol);
          }
          if (!response.ok) {
            console.error(`\u274C CoinGecko API error for ${symbol}: ${response.status}`);
            return this.getFallbackPrice(symbol);
          }
          const data = await response.json();
          const priceData = data[coinId];
          if (!priceData) {
            console.warn(`\u26A0\uFE0F No price data found for ${symbol}`);
            return this.getFallbackPrice(symbol);
          }
          const cryptoPrice = {
            symbol: symbol.toUpperCase(),
            name: this.getCryptoName(symbol),
            price: priceData.usd,
            change_24h: priceData.usd_24h_change || 0,
            volume_24h: priceData.usd_24h_vol || 0,
            market_cap: priceData.usd_market_cap || 0,
            last_updated: (/* @__PURE__ */ new Date()).toISOString()
          };
          this.cache.set(cacheKey, { data: cryptoPrice, timestamp: Date.now() });
          return cryptoPrice;
        } catch (error) {
          console.error(`\u274C Error fetching price for ${symbol}:`, error);
          return this.getFallbackPrice(symbol);
        }
      }
      async getPrices(symbols) {
        const batchSize = 10;
        const results = [];
        for (let i = 0; i < symbols.length; i += batchSize) {
          const batch = symbols.slice(i, i + batchSize);
          const batchPromises = batch.map((symbol) => this.getPrice(symbol));
          const batchResults = await Promise.all(batchPromises);
          results.push(...batchResults.filter(Boolean));
          if (i + batchSize < symbols.length) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }
        return results;
      }
      // Get price history for charting
      async getPriceHistory(symbol, period = "24h") {
        const cacheKey = `history_${symbol}_${period}`;
        const cached = this.cache.get(cacheKey);
        if (cached && this.isValidCacheEntry(cached)) {
          return cached.data;
        }
        try {
          let days = "1";
          if (period === "7d") days = "7";
          if (period === "30d") days = "30";
          if (period === "1y") days = "365";
          const coinId = this.CRYPTO_IDS[symbol.toUpperCase()] || symbol.toLowerCase();
          const response = await this.rateLimitedFetch(
            `${this.baseUrl}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${days === "1" ? "hourly" : "daily"}`
          );
          if (response.status === 429) {
            console.warn(`\u26A0\uFE0F Rate limited for ${symbol} history, using fallback`);
            return this.getFallbackPriceHistory(symbol);
          }
          if (!response.ok) {
            throw new Error(`API responded with ${response.status}`);
          }
          const data = await response.json();
          if (data.prices && Array.isArray(data.prices)) {
            const formattedData = data.prices.map(([timestamp2, price]) => ({
              timestamp: new Date(timestamp2).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit"
              }),
              price: parseFloat(price.toFixed(2))
            }));
            this.cache.set(cacheKey, { data: formattedData, timestamp: Date.now() });
            return formattedData;
          }
          throw new Error("Invalid price history data");
        } catch (error) {
          console.error("\u274C Error fetching price history:", error);
          return this.getFallbackPriceHistory(symbol);
        }
      }
      // Get trending cryptocurrencies
      async getTrendingCryptos() {
        const cacheKey = "trending";
        const cached = this.cache.get(cacheKey);
        if (cached && this.isValidCacheEntry(cached)) {
          return cached.data;
        }
        try {
          const response = await this.rateLimitedFetch(`${this.baseUrl}/search/trending`);
          if (response.status === 429) {
            console.warn("\u26A0\uFE0F Rate limited for trending, using fallback");
            return this.getFallbackTrendingData();
          }
          if (!response.ok) {
            throw new Error(`API responded with ${response.status}`);
          }
          const data = await response.json();
          if (data.coins && Array.isArray(data.coins)) {
            const trending = data.coins.map((coin) => ({
              id: coin.item.id,
              symbol: coin.item.symbol,
              name: coin.item.name,
              market_cap_rank: coin.item.market_cap_rank,
              small: coin.item.small
            }));
            this.cache.set(cacheKey, { data: trending, timestamp: Date.now() });
            return trending;
          }
          throw new Error("Invalid trending data");
        } catch (error) {
          console.error("\u274C Error fetching trending data:", error);
          return this.getFallbackTrendingData();
        }
      }
      // Fallback methods and utility functions
      getFallbackPrice(symbol) {
        const fallbackPrices = {
          "BTC": 45e3,
          "ETH": 2800,
          "BNB": 350,
          "ADA": 0.5,
          "SOL": 100,
          "XRP": 0.6,
          "DOT": 7,
          "DOGE": 0.08,
          "AVAX": 25,
          "MATIC": 0.9
        };
        const basePrice = fallbackPrices[symbol.toUpperCase()] || Math.random() * 1e3 + 100;
        return {
          symbol: symbol.toUpperCase(),
          name: this.getCryptoName(symbol),
          price: basePrice * (0.95 + Math.random() * 0.1),
          change_24h: (Math.random() - 0.5) * 10,
          volume_24h: Math.random() * 1e9,
          market_cap: Math.random() * 1e11,
          last_updated: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      getFallbackData(limit) {
        const fallbackCoins = [
          { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 45e3, rank: 1 },
          { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 2800, rank: 2 },
          { id: "binancecoin", symbol: "BNB", name: "BNB", price: 350, rank: 3 },
          { id: "cardano", symbol: "ADA", name: "Cardano", price: 0.5, rank: 4 },
          { id: "solana", symbol: "SOL", name: "Solana", price: 100, rank: 5 },
          { id: "ripple", symbol: "XRP", name: "XRP", price: 0.6, rank: 6 },
          { id: "polkadot", symbol: "DOT", name: "Polkadot", price: 7, rank: 7 },
          { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", price: 0.08, rank: 8 },
          { id: "avalanche-2", symbol: "AVAX", name: "Avalanche", price: 25, rank: 9 },
          { id: "matic-network", symbol: "MATIC", name: "Polygon", price: 0.9, rank: 10 }
        ];
        return fallbackCoins.slice(0, limit).map((coin) => ({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          current_price: coin.price * (0.95 + Math.random() * 0.1),
          market_cap: coin.price * 21e6 * coin.rank,
          market_cap_rank: coin.rank,
          total_volume: Math.random() * 1e9,
          price_change_percentage_24h: (Math.random() - 0.5) * 10,
          image: `https://assets.coingecko.com/coins/images/${coin.rank}/large/${coin.symbol.toLowerCase()}.png`,
          last_updated: (/* @__PURE__ */ new Date()).toISOString()
        }));
      }
      getFallbackPriceHistory(symbol) {
        const basePrice = symbol === "bitcoin" ? 45e3 : symbol === "ethereum" ? 2800 : 420;
        const data = [];
        for (let i = 23; i >= 0; i--) {
          const variance = (Math.random() - 0.5) * 0.05;
          const price = basePrice * (1 + variance);
          data.push({
            timestamp: new Date(Date.now() - i * 60 * 60 * 1e3).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit"
            }),
            price: parseFloat(price.toFixed(2))
          });
        }
        return data;
      }
      getFallbackTrendingData() {
        return [
          {
            id: "bitcoin",
            symbol: "btc",
            name: "Bitcoin",
            market_cap_rank: 1,
            small: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
          },
          {
            id: "ethereum",
            symbol: "eth",
            name: "Ethereum",
            market_cap_rank: 2,
            small: "https://assets.coingecko.com/coins/images/279/small/ethereum.png"
          }
        ];
      }
      getCryptoName(symbol) {
        const names = {
          "BTC": "Bitcoin",
          "ETH": "Ethereum",
          "BNB": "BNB",
          "ADA": "Cardano",
          "SOL": "Solana",
          "XRP": "XRP",
          "DOT": "Polkadot",
          "DOGE": "Dogecoin",
          "AVAX": "Avalanche",
          "MATIC": "Polygon",
          "LINK": "Chainlink",
          "UNI": "Uniswap",
          "LTC": "Litecoin",
          "ALGO": "Algorand",
          "VET": "VeChain",
          "ICP": "Internet Computer",
          "FIL": "Filecoin",
          "TRX": "TRON",
          "ETC": "Ethereum Classic",
          "XLM": "Stellar"
        };
        return names[symbol.toUpperCase()] || symbol.toUpperCase();
      }
      clearCache() {
        this.cache.clear();
        console.log("\u{1F5D1}\uFE0F Cache cleared");
      }
      getCacheSize() {
        return this.cache.size;
      }
      getRateLimitInfo() {
        return { ...this.rateLimitInfo };
      }
    };
    cryptoService = new CryptoService();
  }
});

// server/metals-service.ts
var MetalsService, metalsService;
var init_metals_service = __esm({
  "server/metals-service.ts"() {
    "use strict";
    MetalsService = class {
      cache = /* @__PURE__ */ new Map();
      CACHE_TTL = 3e5;
      // 5 minutes for metals (less volatile)
      API_BASE = "https://metals-api.com/api";
      API_KEY = process.env.METALS_API_KEY;
      // Precious metals with their display names
      METAL_INFO = {
        "XAU": { name: "Gold", unit: "oz" },
        "XAG": { name: "Silver", unit: "oz" },
        "XPT": { name: "Platinum", unit: "oz" },
        "XPD": { name: "Palladium", unit: "oz" },
        "COPPER": { name: "Copper", unit: "lb" },
        "ALUMINUM": { name: "Aluminum", unit: "lb" },
        "ZINC": { name: "Zinc", unit: "lb" },
        "NICKEL": { name: "Nickel", unit: "lb" },
        "LEAD": { name: "Lead", unit: "lb" },
        "TIN": { name: "Tin", unit: "lb" }
      };
      async getPrice(symbol) {
        const cached = this.cache.get(symbol);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
          return cached.data;
        }
        try {
          if (!this.API_KEY) {
            console.warn("METALS_API_KEY not configured, using fallback data");
            return this.getFallbackPrice(symbol);
          }
          const response = await fetch(
            `${this.API_BASE}/latest?access_key=${this.API_KEY}&base=USD&symbols=${symbol.toUpperCase()}`
          );
          if (!response.ok) {
            throw new Error(`API responded with ${response.status}`);
          }
          const data = await response.json();
          if (!data.success || !data.rates[symbol.toUpperCase()]) {
            console.warn(`No price data found for ${symbol}`);
            return this.getFallbackPrice(symbol);
          }
          const rate = data.rates[symbol.toUpperCase()];
          const price = 1 / rate;
          const metalPrice = {
            symbol: symbol.toUpperCase(),
            name: this.getMetalName(symbol),
            price,
            change_24h: this.generateRealisticChange(),
            // API doesn't provide 24h change
            unit: this.getMetalUnit(symbol),
            last_updated: (/* @__PURE__ */ new Date()).toISOString()
          };
          this.cache.set(symbol, { data: metalPrice, timestamp: Date.now() });
          return metalPrice;
        } catch (error) {
          console.error(`Error fetching price for ${symbol}:`, error);
          return this.getFallbackPrice(symbol);
        }
      }
      async getPrices(symbols) {
        const prices = await Promise.all(
          symbols.map((symbol) => this.getPrice(symbol))
        );
        return prices.filter(Boolean);
      }
      async getTopMetals(limit = 10) {
        const cacheKey = `top_${limit}`;
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
          return cached.data;
        }
        try {
          const topMetals = Object.keys(this.METAL_INFO).slice(0, limit);
          const prices = await this.getPrices(topMetals);
          this.cache.set(cacheKey, { data: prices, timestamp: Date.now() });
          return prices;
        } catch (error) {
          console.error("Error fetching top metals:", error);
          return this.getFallbackTopMetals(limit);
        }
      }
      // Get market data for metals dashboard
      async getMarketData() {
        const cacheKey = "market_data";
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
          return cached.data;
        }
        try {
          const metals = await this.getTopMetals(10);
          const marketData = metals.map((metal) => ({
            id: metal.symbol.toLowerCase(),
            symbol: metal.symbol,
            name: metal.name,
            current_price: metal.price,
            price_change_percentage_24h: metal.change_24h,
            unit: metal.unit,
            market_type: "metals",
            last_updated: metal.last_updated
          }));
          this.cache.set(cacheKey, { data: marketData, timestamp: Date.now() });
          return marketData;
        } catch (error) {
          console.error("Error fetching metals market data:", error);
          return this.getFallbackMarketData();
        }
      }
      // Get price history for charting
      async getPriceHistory(symbol, period = "24h") {
        const cacheKey = `history_${symbol}_${period}`;
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
          return cached.data;
        }
        const currentPrice = await this.getPrice(symbol);
        if (!currentPrice) {
          return this.getFallbackPriceHistory(symbol);
        }
        const history = this.generateRealisticHistory(currentPrice.price, period);
        this.cache.set(cacheKey, { data: history, timestamp: Date.now() });
        return history;
      }
      getFallbackPrice(symbol) {
        const fallbackPrices = {
          "XAU": 2e3,
          // Gold per oz
          "XAG": 24,
          // Silver per oz
          "XPT": 950,
          // Platinum per oz
          "XPD": 1800,
          // Palladium per oz
          "COPPER": 4.2,
          // Copper per lb
          "ALUMINUM": 0.85,
          // Aluminum per lb
          "ZINC": 1.15,
          // Zinc per lb
          "NICKEL": 8.5,
          // Nickel per lb
          "LEAD": 0.95,
          // Lead per lb
          "TIN": 15.5
          // Tin per lb
        };
        const basePrice = fallbackPrices[symbol.toUpperCase()] || 100;
        return {
          symbol: symbol.toUpperCase(),
          name: this.getMetalName(symbol),
          price: basePrice * (0.95 + Math.random() * 0.1),
          // ±5% variance
          change_24h: this.generateRealisticChange(),
          unit: this.getMetalUnit(symbol),
          last_updated: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      getFallbackMarketData() {
        return [
          {
            id: "xau",
            symbol: "XAU",
            name: "Gold",
            current_price: 2e3,
            price_change_percentage_24h: 0.5,
            unit: "oz",
            market_type: "metals",
            last_updated: (/* @__PURE__ */ new Date()).toISOString()
          },
          {
            id: "xag",
            symbol: "XAG",
            name: "Silver",
            current_price: 24,
            price_change_percentage_24h: 1.2,
            unit: "oz",
            market_type: "metals",
            last_updated: (/* @__PURE__ */ new Date()).toISOString()
          },
          {
            id: "xpt",
            symbol: "XPT",
            name: "Platinum",
            current_price: 950,
            price_change_percentage_24h: -0.8,
            unit: "oz",
            market_type: "metals",
            last_updated: (/* @__PURE__ */ new Date()).toISOString()
          }
        ];
      }
      getFallbackTopMetals(limit) {
        const topMetals = [
          { symbol: "XAU", name: "Gold", price: 2e3, unit: "oz" },
          { symbol: "XAG", name: "Silver", price: 24, unit: "oz" },
          { symbol: "XPT", name: "Platinum", price: 950, unit: "oz" },
          { symbol: "XPD", name: "Palladium", price: 1800, unit: "oz" },
          { symbol: "COPPER", name: "Copper", price: 4.2, unit: "lb" },
          { symbol: "ALUMINUM", name: "Aluminum", price: 0.85, unit: "lb" },
          { symbol: "ZINC", name: "Zinc", price: 1.15, unit: "lb" },
          { symbol: "NICKEL", name: "Nickel", price: 8.5, unit: "lb" },
          { symbol: "LEAD", name: "Lead", price: 0.95, unit: "lb" },
          { symbol: "TIN", name: "Tin", price: 15.5, unit: "lb" }
        ];
        return topMetals.slice(0, limit).map((metal) => ({
          ...metal,
          price: metal.price * (0.95 + Math.random() * 0.1),
          change_24h: this.generateRealisticChange(),
          last_updated: (/* @__PURE__ */ new Date()).toISOString()
        }));
      }
      getFallbackPriceHistory(symbol) {
        const basePrice = this.getFallbackPrice(symbol).price;
        return this.generateRealisticHistory(basePrice, "24h");
      }
      generateRealisticHistory(currentPrice, period) {
        const data = [];
        let points = 24;
        let interval = 60 * 60 * 1e3;
        if (period === "7d") {
          points = 7;
          interval = 24 * 60 * 60 * 1e3;
        } else if (period === "30d") {
          points = 30;
          interval = 24 * 60 * 60 * 1e3;
        } else if (period === "1y") {
          points = 365;
          interval = 24 * 60 * 60 * 1e3;
        }
        let price = currentPrice;
        for (let i = points - 1; i >= 0; i--) {
          const variance = (Math.random() - 0.5) * 0.02;
          price = price * (1 + variance);
          data.push({
            timestamp: new Date(Date.now() - i * interval).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit"
            }),
            price: parseFloat(price.toFixed(2))
          });
        }
        return data;
      }
      generateRealisticChange() {
        return (Math.random() - 0.5) * 4;
      }
      getMetalName(symbol) {
        const info = this.METAL_INFO[symbol.toUpperCase()];
        return info?.name || symbol.toUpperCase();
      }
      getMetalUnit(symbol) {
        const info = this.METAL_INFO[symbol.toUpperCase()];
        return info?.unit || "unit";
      }
      clearCache() {
        this.cache.clear();
      }
      getCacheSize() {
        return this.cache.size;
      }
    };
    metalsService = new MetalsService();
  }
});

// server/metals-trading-routes.ts
var metals_trading_routes_exports = {};
__export(metals_trading_routes_exports, {
  default: () => metals_trading_routes_default
});
import { Router as Router10 } from "express";
import { z as z5 } from "zod";
var router10, buyMetalSchema, sellMetalSchema, metals_trading_routes_default;
var init_metals_trading_routes = __esm({
  "server/metals-trading-routes.ts"() {
    "use strict";
    init_simple_auth();
    init_storage();
    init_metals_service();
    router10 = Router10();
    buyMetalSchema = z5.object({
      symbol: z5.string().min(1),
      amount: z5.string().min(1),
      price: z5.string().min(1),
      total: z5.string().min(1),
      name: z5.string().min(1),
      orderType: z5.enum(["market", "limit"]).default("market")
    });
    sellMetalSchema = z5.object({
      symbol: z5.string().min(1),
      amount: z5.string().min(1),
      price: z5.string().min(1),
      total: z5.string().min(1)
    });
    router10.post("/buy", requireAuth, async (req, res) => {
      try {
        const userId = req.user.id;
        const tradeData = buyMetalSchema.parse(req.body);
        const portfolio = await storage.getPortfolio(userId);
        if (!portfolio) {
          return res.status(404).json({ message: "Portfolio not found" });
        }
        const availableCash = parseFloat(portfolio.availableCash);
        const totalCost = parseFloat(tradeData.total);
        if (availableCash < totalCost) {
          return res.status(400).json({
            message: "Insufficient funds",
            available: availableCash,
            required: totalCost
          });
        }
        const currentPrice = await metalsService.getPrice(tradeData.symbol);
        if (!currentPrice) {
          return res.status(400).json({ message: "Metal price not available" });
        }
        const transaction = await storage.createTransaction({
          userId,
          type: "buy",
          assetType: "metal",
          symbol: tradeData.symbol,
          amount: tradeData.amount,
          price: tradeData.price,
          total: tradeData.total,
          status: "completed",
          fees: "0"
        });
        const existingHolding = await storage.getHolding(portfolio.id, tradeData.symbol);
        if (existingHolding) {
          const newAmount = parseFloat(existingHolding.amount) + parseFloat(tradeData.amount);
          const newAverage = (parseFloat(existingHolding.averagePurchasePrice) * parseFloat(existingHolding.amount) + parseFloat(tradeData.amount) * parseFloat(tradeData.price)) / newAmount;
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            assetType: "metal",
            symbol: tradeData.symbol,
            name: tradeData.name,
            amount: newAmount.toString(),
            averagePurchasePrice: newAverage.toString(),
            currentPrice: currentPrice.price.toString()
          });
        } else {
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            assetType: "metal",
            symbol: tradeData.symbol,
            name: tradeData.name,
            amount: tradeData.amount,
            averagePurchasePrice: tradeData.price,
            currentPrice: currentPrice.price.toString()
          });
        }
        const newCash = availableCash - totalCost;
        await storage.updatePortfolio(portfolio.id, {
          availableCash: newCash.toString(),
          totalValue: (parseFloat(portfolio.totalValue) + totalCost).toString()
        });
        await storage.createNotification({
          userId,
          type: "trade_complete",
          title: "Metal Purchase Successful",
          message: `Successfully purchased ${tradeData.amount}oz of ${tradeData.name} at $${tradeData.price}/oz`,
          isRead: false
        });
        res.json({
          transaction,
          message: "Metal purchase completed successfully",
          newBalance: newCash
        });
      } catch (error) {
        console.error("Error buying metal:", error);
        if (error instanceof z5.ZodError) {
          return res.status(400).json({ message: "Invalid input data", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to complete metal purchase" });
      }
    });
    router10.post("/sell", requireAuth, async (req, res) => {
      try {
        const userId = req.user.id;
        const tradeData = sellMetalSchema.parse(req.body);
        const portfolio = await storage.getPortfolio(userId);
        if (!portfolio) {
          return res.status(404).json({ message: "Portfolio not found" });
        }
        const holding = await storage.getHolding(portfolio.id, tradeData.symbol);
        if (!holding) {
          return res.status(400).json({ message: "You don't own this metal" });
        }
        const availableAmount = parseFloat(holding.amount);
        const sellAmount = parseFloat(tradeData.amount);
        if (availableAmount < sellAmount) {
          return res.status(400).json({
            message: "Insufficient metal amount",
            available: availableAmount,
            requested: sellAmount
          });
        }
        const currentPrice = await metalsService.getPrice(tradeData.symbol);
        if (!currentPrice) {
          return res.status(400).json({ message: "Metal price not available" });
        }
        const transaction = await storage.createTransaction({
          userId,
          type: "sell",
          assetType: "metal",
          symbol: tradeData.symbol,
          amount: tradeData.amount,
          price: tradeData.price,
          total: tradeData.total,
          status: "completed",
          fees: "0"
        });
        const newAmount = availableAmount - sellAmount;
        if (newAmount > 0) {
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            assetType: "metal",
            symbol: tradeData.symbol,
            name: holding.name,
            amount: newAmount.toString(),
            averagePurchasePrice: holding.averagePurchasePrice,
            currentPrice: currentPrice.price.toString()
          });
        } else {
          await storage.deleteHolding(portfolio.id, tradeData.symbol);
        }
        const newCash = parseFloat(portfolio.availableCash) + parseFloat(tradeData.total);
        await storage.updatePortfolio(portfolio.id, {
          availableCash: newCash.toString(),
          totalValue: (parseFloat(portfolio.totalValue) - parseFloat(tradeData.total)).toString()
        });
        await storage.createNotification({
          userId,
          type: "trade_complete",
          title: "Metal Sale Successful",
          message: `Successfully sold ${tradeData.amount}oz of ${holding.name} at $${tradeData.price}/oz`,
          isRead: false
        });
        res.json({
          transaction,
          message: "Metal sale completed successfully",
          newBalance: newCash
        });
      } catch (error) {
        console.error("Error selling metal:", error);
        if (error instanceof z5.ZodError) {
          return res.status(400).json({ message: "Invalid input data", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to complete metal sale" });
      }
    });
    router10.get("/holdings", requireAuth, async (req, res) => {
      try {
        const userId = req.user.id;
        const portfolio = await storage.getPortfolio(userId);
        if (!portfolio) {
          return res.status(404).json({ message: "Portfolio not found" });
        }
        const holdings2 = await storage.getHoldings(portfolio.id);
        const metalHoldings = holdings2.filter((h) => h.assetType === "metal");
        const holdingsWithPrices = await Promise.all(
          metalHoldings.map(async (holding) => {
            const currentPrice = await metalsService.getPrice(holding.symbol);
            const currentValue = parseFloat(holding.amount) * (currentPrice?.price || parseFloat(holding.currentPrice));
            const purchaseValue = parseFloat(holding.amount) * parseFloat(holding.averagePurchasePrice);
            const profitLoss = currentValue - purchaseValue;
            const profitLossPercent = profitLoss / purchaseValue * 100;
            return {
              ...holding,
              currentPrice: currentPrice?.price || parseFloat(holding.currentPrice),
              currentValue,
              profitLoss,
              profitLossPercent
            };
          })
        );
        res.json(holdingsWithPrices);
      } catch (error) {
        console.error("Error fetching metal holdings:", error);
        res.status(500).json({ message: "Failed to fetch metal holdings" });
      }
    });
    router10.get("/history", requireAuth, async (req, res) => {
      try {
        const userId = req.user.id;
        const transactions2 = await storage.getUserTransactions(userId, 100);
        const metalTransactions = transactions2.filter((t) => t.assetType === "metal");
        res.json(metalTransactions);
      } catch (error) {
        console.error("Error fetching metal trading history:", error);
        res.status(500).json({ message: "Failed to fetch trading history" });
      }
    });
    router10.get("/admin/transactions", requireAuth, requireAdmin, async (req, res) => {
      try {
        const { page = 1, limit = 50 } = req.query;
        const transactions2 = await storage.getAllTransactions({
          page: parseInt(page),
          limit: parseInt(limit),
          type: "buy"
        });
        const metalTransactions = transactions2.transactions.filter((t) => t.assetType === "metal");
        res.json({
          transactions: metalTransactions,
          total: metalTransactions.length
        });
      } catch (error) {
        console.error("Error fetching admin metal transactions:", error);
        res.status(500).json({ message: "Failed to fetch transactions" });
      }
    });
    router10.post("/admin/price-override", requireAuth, requireAdmin, async (req, res) => {
      try {
        const { symbol, price, reason } = req.body;
        await storage.createAuditLog({
          adminId: req.user.id,
          action: "metal_price_override",
          targetId: symbol,
          details: { symbol, price, reason },
          ipAddress: req.ip || "",
          userAgent: req.get("User-Agent") || ""
        });
        res.json({ message: "Price override logged successfully" });
      } catch (error) {
        console.error("Error processing price override:", error);
        res.status(500).json({ message: "Failed to process price override" });
      }
    });
    metals_trading_routes_default = router10;
  }
});

// server/market-research-routes.ts
var market_research_routes_exports = {};
__export(market_research_routes_exports, {
  default: () => market_research_routes_default
});
import { Router as Router11 } from "express";
var router11, marketReports, analystInsights, liveCommentary, podcasts, market_research_routes_default;
var init_market_research_routes = __esm({
  "server/market-research-routes.ts"() {
    "use strict";
    router11 = Router11();
    marketReports = [
      {
        id: "1",
        title: "Q4 2024 Cryptocurrency Market Outlook",
        description: "Comprehensive analysis of market trends, institutional adoption, and regulatory developments",
        author: "Dr. Sarah Chen",
        authorBio: "Former Goldman Sachs strategist with 15+ years in financial markets",
        publishedAt: (/* @__PURE__ */ new Date()).toISOString(),
        category: "Market Analysis",
        premium: true,
        downloadUrl: "/api/research/download/1",
        readTime: 15,
        rating: 4.8,
        views: 2341,
        tags: ["Bitcoin", "Ethereum", "Institutional", "Regulation"],
        summary: "The cryptocurrency market is positioned for significant growth in Q4 2024, driven by institutional adoption and clearer regulatory frameworks.",
        content: `
      # Q4 2024 Cryptocurrency Market Outlook

      ## Executive Summary
      The cryptocurrency market enters Q4 2024 with unprecedented institutional backing and regulatory clarity. Our analysis indicates a strong bullish trajectory for major cryptocurrencies, supported by fundamental improvements in adoption and infrastructure.

      ## Key Market Drivers
      
      ### Institutional Adoption
      - Major pension funds allocating 2-5% to crypto
      - Corporate treasuries increasing Bitcoin holdings
      - Traditional banks launching crypto custody services

      ### Regulatory Environment
      - Clear frameworks emerging in major jurisdictions
      - ETF approvals creating easier access
      - Stablecoin regulations providing certainty

      ### Technical Infrastructure
      - Layer 2 solutions improving scalability
      - Cross-chain bridges enhancing interoperability
      - DeFi protocols maturing with better security

      ## Market Predictions

      ### Bitcoin (BTC)
      - Target: $85,000 - $100,000 by year-end
      - Key resistance: $75,000
      - Support levels: $58,000, $52,000

      ### Ethereum (ETH)
      - Target: $4,500 - $5,200 by year-end
      - Shanghai upgrade effects still materializing
      - Strong DeFi ecosystem growth

      ### Altcoin Outlook
      - Layer 1 protocols showing strength
      - AI and RWA tokens gaining traction
      - Meme coins remaining volatile

      ## Risk Factors
      - Macroeconomic headwinds
      - Regulatory surprises
      - Technical vulnerabilities
      - Market manipulation concerns

      ## Investment Recommendations
      
      ### Conservative Portfolio (60% allocation)
      - 40% Bitcoin
      - 35% Ethereum
      - 25% Diversified altcoins

      ### Aggressive Portfolio (20% allocation)
      - 30% Bitcoin
      - 25% Ethereum
      - 45% High-growth altcoins

      ### Risk Management
      - Dollar-cost averaging for entries
      - Stop-losses at key support levels
      - Portfolio rebalancing quarterly
      - Position sizing based on conviction

      ## Conclusion
      Q4 2024 presents a unique opportunity for cryptocurrency investors. The combination of institutional adoption, regulatory clarity, and technical improvements creates a favorable environment for sustained growth.
    `,
        keyFindings: [
          "Institutional adoption increased by 300% in 2024",
          "Bitcoin correlation with traditional assets decreased to 0.2",
          "DeFi TVL expected to reach $500B by year-end",
          "Regulatory clarity improving in major markets",
          "Layer 2 adoption growing 400% year-over-year"
        ],
        recommendations: [
          "Increase allocation to blue-chip cryptocurrencies",
          "Monitor regulatory developments closely",
          "Consider DeFi exposure through established protocols",
          "Implement systematic rebalancing strategy",
          "Maintain 10-20% cash for opportunities"
        ],
        methodology: "Technical analysis, on-chain metrics, institutional flow analysis, regulatory assessment",
        riskRating: "Medium-High",
        timeHorizon: "3-6 months"
      },
      {
        id: "2",
        title: "DeFi Protocol Analysis: Yield Opportunities & Risk Assessment",
        description: "In-depth research on current DeFi yield farming opportunities and comprehensive risk analysis",
        author: "Michael Rodriguez",
        authorBio: "DeFi researcher and former Ethereum Foundation contributor",
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString(),
        category: "DeFi Research",
        premium: false,
        downloadUrl: "/api/research/download/2",
        readTime: 12,
        rating: 4.6,
        views: 1829,
        tags: ["DeFi", "Yield Farming", "Risk Management", "Smart Contracts"],
        summary: "Current DeFi protocols offer attractive yields, but careful risk assessment is crucial for sustainable returns.",
        content: `
      # DeFi Protocol Analysis: Yield Opportunities & Risk Assessment

      ## Overview
      The DeFi landscape has matured significantly, offering various yield opportunities across lending, liquidity provision, and staking. This report analyzes the current state of DeFi yields and associated risks.

      ## Top Yield Opportunities

      ### Lending Protocols
      1. **Aave**: 3-8% APY on stablecoins
      2. **Compound**: 2-6% APY with COMP rewards
      3. **Euler**: Higher risk, 4-12% APY

      ### DEX Liquidity Provision
      1. **Uniswap V3**: 5-25% APY (concentrated liquidity)
      2. **Curve**: 4-15% APY (stable pairs)
      3. **Balancer**: 6-20% APY (weighted pools)

      ### Liquid Staking
      1. **Lido**: 4-5% APY (stETH)
      2. **Rocket Pool**: 4-5% APY (rETH)
      3. **Frax**: 5-6% APY (sfrxETH)

      ## Risk Analysis Framework

      ### Smart Contract Risk
      - Code audit quality and recency
      - Bug bounty programs
      - Historical security incidents
      - TVL and maturity metrics

      ### Liquidity Risk
      - Pool depth and trading volume
      - Impermanent loss calculations
      - Exit liquidity scenarios
      - Slippage analysis

      ### Regulatory Risk
      - Compliance status
      - Geographic restrictions
      - Token classification issues
      - Potential regulatory changes

      ## Protocol Deep Dives

      ### Uniswap V3 Analysis
      **Pros:**
      - Concentrated liquidity increases capital efficiency
      - Strong brand and adoption
      - Decentralized governance
      - Multiple fee tiers

      **Cons:**
      - Impermanent loss risk
      - Active management required
      - Gas costs for rebalancing
      - Complex position management

      **Risk Rating:** Medium
      **Recommended Allocation:** 5-15% of DeFi portfolio

      ### Aave Analysis
      **Pros:**
      - Battle-tested protocol
      - Strong safety module
      - Multiple asset support
      - Flash loan capabilities

      **Cons:**
      - Variable rate volatility
      - Liquidation risks
      - Governance token exposure
      - Centralization concerns

      **Risk Rating:** Low-Medium
      **Recommended Allocation:** 20-40% of DeFi portfolio

      ## Yield Optimization Strategies

      ### Conservative Strategy (60% allocation)
      - 40% Stablecoin lending (Aave/Compound)
      - 30% Liquid staking (Lido/Rocket Pool)
      - 30% Low-risk LP positions (Curve stable pairs)

      ### Balanced Strategy (30% allocation)
      - 25% Stablecoin lending
      - 25% Liquid staking
      - 25% Medium-risk LP positions
      - 25% Yield farming with rewards

      ### Aggressive Strategy (10% allocation)
      - 20% Concentrated liquidity (Uniswap V3)
      - 30% High-yield farming
      - 25% New protocol exposure
      - 25% Leveraged positions

      ## Risk Management Best Practices

      ### Diversification
      - Spread across multiple protocols
      - Mix of yield strategies
      - Different asset categories
      - Geographic protocol diversity

      ### Monitoring
      - Daily TVL checks
      - Yield rate tracking
      - Risk parameter changes
      - Protocol upgrade announcements

      ### Position Sizing
      - Never exceed 20% in single protocol
      - Limit new protocol exposure to 5%
      - Maintain emergency fund
      - Regular rebalancing schedule

      ## Conclusion
      DeFi yields remain attractive despite market volatility. Success requires disciplined risk management, continuous monitoring, and adaptive strategies. Focus on proven protocols while maintaining exposure to innovation.
    `,
        keyFindings: [
          "Average DeFi yields range from 3-15% APY across categories",
          "Smart contract risks remain primary concern for investors",
          "Liquidity provision shows most consistent risk-adjusted returns",
          "Protocol maturity strongly correlates with risk reduction",
          "Regulatory clarity needed for institutional adoption"
        ],
        recommendations: [
          "Diversify across multiple established protocols",
          "Monitor TVL changes and audit status regularly",
          "Start with conservative strategies before increasing risk",
          "Maintain 20-30% of portfolio in stablecoins",
          "Use position sizing to manage protocol concentration"
        ],
        methodology: "Protocol analysis, yield tracking, risk modeling, historical performance review",
        riskRating: "Medium",
        timeHorizon: "1-3 months"
      }
    ];
    analystInsights = [
      {
        id: "1",
        analyst: {
          name: "Elena Vasquez",
          title: "Chief Crypto Strategist",
          firm: "BlockCapital Research",
          rating: 4.9,
          bio: "Former JPMorgan derivatives trader, 12+ years in crypto markets",
          photo: "https://images.unsplash.com/photo-1494790108755-2616b332e234?w=100",
          achievements: ["Top 1% crypto analysts 2023", "95% accuracy rate", "Featured in WSJ, Bloomberg"],
          totalInsights: 156,
          followers: 12400
        },
        title: "Bitcoin Breaking Key Resistance at $68,000 - Next Target $78,000",
        content: `Technical analysis reveals Bitcoin is forming a classic bullish pennant pattern with strong volume confirmation above $68,000. 

Key technical indicators:
\u2022 RSI showing healthy momentum without overbought conditions
\u2022 Volume profile supporting the breakout
\u2022 50-day MA providing strong support at $64,500
\u2022 Options flow indicating bullish sentiment

The break above $68,000 removes a significant resistance level that has been tested multiple times. Next major resistance sits at $75,000-$78,000 range, which coincides with the 1.618 Fibonacci extension from the previous cycle low.

Risk management: Stop-loss below $64,000 for swing trades. Position sizing should account for potential 15-20% drawdowns even in bullish scenarios.`,
        sentiment: "bullish",
        confidence: 85,
        priceTarget: 78e3,
        stopLoss: 64e3,
        timeHorizon: "2-3 months",
        publishedAt: (/* @__PURE__ */ new Date()).toISOString(),
        likes: 234,
        comments: 67,
        shares: 45,
        assets: ["Bitcoin"],
        tags: ["Technical Analysis", "Breakout", "Resistance", "Volume"],
        chartUrl: "/api/charts/btc-analysis-1",
        updateCount: 3,
        accuracy: 89
      },
      {
        id: "2",
        analyst: {
          name: "James Patterson",
          title: "Senior Market Analyst",
          firm: "CryptoFund Analytics",
          rating: 4.7,
          bio: "Former BlackRock portfolio manager, institutional crypto specialist",
          photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
          achievements: ["Institutional Analyst of the Year 2023", "CFA Charterholder"],
          totalInsights: 203,
          followers: 8900
        },
        title: "Ethereum 2.0 Staking Yields Creating Institutional FOMO",
        content: `Ethereum's post-merge staking environment is attracting significant institutional attention as yields stabilize around 4-5% with potential for 6%+ during high network activity periods.

Key institutional drivers:
\u2022 Predictable yield generation comparable to traditional fixed income
\u2022 Lower correlation to equity markets than expected
\u2022 ESG compliance through proof-of-stake mechanism
\u2022 Regulatory clarity improving in major jurisdictions

Recent developments suggest major pension funds are completing their due diligence process for ETH allocation. The upcoming Dencun upgrade should further reduce L2 costs, driving more activity and higher staking rewards.

Institution positioning indicates accumulation phase, with custody solutions reporting 300% increase in ETH deposits over past quarter.`,
        sentiment: "bullish",
        confidence: 78,
        priceTarget: 4200,
        timeHorizon: "4-6 months",
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1e3).toISOString(),
        likes: 189,
        comments: 42,
        shares: 31,
        assets: ["Ethereum"],
        tags: ["Staking", "Institutional", "Yield", "ETH2.0"],
        chartUrl: "/api/charts/eth-analysis-1",
        updateCount: 1,
        accuracy: 87
      }
    ];
    liveCommentary = [
      {
        id: "1",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        title: "Bitcoin Volume Surge: 24h Volume Up 45%",
        content: "Unusual trading volume detected across major exchanges. Institutional-sized orders contributing to increased activity. Watch for potential breakout above $68,500.",
        author: "Market Monitor Bot",
        authorType: "automated",
        priority: "high",
        assets: ["Bitcoin"],
        impact: "positive",
        sourceData: {
          volume24h: 285e8,
          volumeChange: 45.2,
          largeOrders: 156,
          exchangesAffected: ["Coinbase", "Binance", "Kraken"]
        }
      }
    ];
    podcasts = [
      {
        id: "1",
        title: "Crypto Market Weekly: ETF Approvals and Market Impact",
        description: "Deep dive into recent ETF approvals and their long-term impact on cryptocurrency adoption and institutional investment flows",
        host: "Alex Thompson",
        hostBio: "Former CNBC anchor, crypto journalist since 2017",
        duration: 2340,
        // seconds
        publishedAt: (/* @__PURE__ */ new Date()).toISOString(),
        audioUrl: "/api/podcasts/audio/1",
        thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300",
        category: "Market Analysis",
        episode: 156,
        season: 3,
        guests: [
          {
            name: "Dr. Sarah Chen",
            title: "Market Analyst",
            bio: "Former Goldman Sachs strategist"
          },
          {
            name: "Michael Rodriguez",
            title: "DeFi Researcher",
            bio: "Ethereum Foundation contributor"
          }
        ],
        transcript: "Full transcript available after authentication...",
        keyTopics: ["ETF Approvals", "Institutional Adoption", "Market Trends", "Regulation"],
        chapters: [
          { title: "ETF Market Overview", timestamp: 0 },
          { title: "Institutional Impact Analysis", timestamp: 420 },
          { title: "Future Outlook", timestamp: 1200 },
          { title: "Q&A Session", timestamp: 1800 }
        ],
        downloads: 4521,
        rating: 4.7,
        reviews: 89
      }
    ];
    router11.get("/reports", async (req, res) => {
      try {
        const { category, premium, author, limit = 10, offset = 0 } = req.query;
        let filteredReports = [...marketReports];
        if (category && category !== "all") {
          filteredReports = filteredReports.filter(
            (report) => report.category.toLowerCase() === category.toString().toLowerCase()
          );
        }
        if (premium !== void 0) {
          filteredReports = filteredReports.filter(
            (report) => report.premium === (premium === "true")
          );
        }
        if (author) {
          filteredReports = filteredReports.filter(
            (report) => report.author.toLowerCase().includes(author.toString().toLowerCase())
          );
        }
        const startIndex = parseInt(offset.toString());
        const endIndex = startIndex + parseInt(limit.toString());
        const paginatedReports = filteredReports.slice(startIndex, endIndex);
        res.json({
          reports: paginatedReports,
          total: filteredReports.length,
          hasMore: endIndex < filteredReports.length
        });
      } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Failed to fetch research reports" });
      }
    });
    router11.get("/reports/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const report = marketReports.find((r) => r.id === id);
        if (!report) {
          return res.status(404).json({ message: "Research report not found" });
        }
        report.views += 1;
        res.json(report);
      } catch (error) {
        console.error("Error fetching report:", error);
        res.status(500).json({ message: "Failed to fetch research report" });
      }
    });
    router11.get("/insights", async (req, res) => {
      try {
        const { analyst, sentiment, asset, limit = 10, offset = 0 } = req.query;
        let filteredInsights = [...analystInsights];
        if (analyst) {
          filteredInsights = filteredInsights.filter(
            (insight) => insight.analyst.name.toLowerCase().includes(analyst.toString().toLowerCase())
          );
        }
        if (sentiment && sentiment !== "all") {
          filteredInsights = filteredInsights.filter(
            (insight) => insight.sentiment === sentiment
          );
        }
        if (asset) {
          filteredInsights = filteredInsights.filter(
            (insight) => insight.assets.some((a) => a.toLowerCase().includes(asset.toString().toLowerCase()))
          );
        }
        const startIndex = parseInt(offset.toString());
        const endIndex = startIndex + parseInt(limit.toString());
        const paginatedInsights = filteredInsights.slice(startIndex, endIndex);
        res.json({
          insights: paginatedInsights,
          total: filteredInsights.length,
          hasMore: endIndex < filteredInsights.length
        });
      } catch (error) {
        console.error("Error fetching insights:", error);
        res.status(500).json({ message: "Failed to fetch analyst insights" });
      }
    });
    router11.get("/commentary", async (req, res) => {
      try {
        const { priority, asset, limit = 20 } = req.query;
        let filteredCommentary = [...liveCommentary];
        if (priority && priority !== "all") {
          filteredCommentary = filteredCommentary.filter(
            (comment) => comment.priority === priority
          );
        }
        if (asset) {
          filteredCommentary = filteredCommentary.filter(
            (comment) => comment.assets.some((a) => a.toLowerCase().includes(asset.toString().toLowerCase()))
          );
        }
        filteredCommentary.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        const limitedCommentary = filteredCommentary.slice(0, parseInt(limit.toString()));
        res.json({
          commentary: limitedCommentary,
          total: filteredCommentary.length
        });
      } catch (error) {
        console.error("Error fetching commentary:", error);
        res.status(500).json({ message: "Failed to fetch live commentary" });
      }
    });
    router11.post("/commentary", async (req, res) => {
      try {
        const { title, content, author, priority, assets, impact } = req.body;
        if (!title || !content || !author) {
          return res.status(400).json({ message: "Missing required fields" });
        }
        const newCommentary = {
          id: Date.now().toString(),
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          title,
          content,
          author,
          authorType: "manual",
          priority: priority || "medium",
          assets: assets || [],
          impact: impact || "neutral"
        };
        liveCommentary.unshift(newCommentary);
        if (liveCommentary.length > 100) {
          liveCommentary = liveCommentary.slice(0, 100);
        }
        res.status(201).json(newCommentary);
      } catch (error) {
        console.error("Error adding commentary:", error);
        res.status(500).json({ message: "Failed to add live commentary" });
      }
    });
    router11.get("/podcasts", async (req, res) => {
      try {
        const { category, host, limit = 10, offset = 0 } = req.query;
        let filteredPodcasts = [...podcasts];
        if (category && category !== "all") {
          filteredPodcasts = filteredPodcasts.filter(
            (podcast) => podcast.category.toLowerCase() === category.toString().toLowerCase()
          );
        }
        if (host) {
          filteredPodcasts = filteredPodcasts.filter(
            (podcast) => podcast.host.toLowerCase().includes(host.toString().toLowerCase())
          );
        }
        const startIndex = parseInt(offset.toString());
        const endIndex = startIndex + parseInt(limit.toString());
        const paginatedPodcasts = filteredPodcasts.slice(startIndex, endIndex);
        res.json({
          podcasts: paginatedPodcasts,
          total: filteredPodcasts.length,
          hasMore: endIndex < filteredPodcasts.length
        });
      } catch (error) {
        console.error("Error fetching podcasts:", error);
        res.status(500).json({ message: "Failed to fetch podcasts" });
      }
    });
    router11.get("/podcasts/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const podcast = podcasts.find((p) => p.id === id);
        if (!podcast) {
          return res.status(404).json({ message: "Podcast not found" });
        }
        res.json(podcast);
      } catch (error) {
        console.error("Error fetching podcast:", error);
        res.status(500).json({ message: "Failed to fetch podcast" });
      }
    });
    router11.get("/search", async (req, res) => {
      try {
        const { query, type = "all", limit = 20 } = req.query;
        if (!query) {
          return res.status(400).json({ message: "Search query is required" });
        }
        const searchTerm = query.toString().toLowerCase();
        const results = {
          reports: [],
          insights: [],
          podcasts: [],
          commentary: []
        };
        if (type === "all" || type === "reports") {
          results.reports = marketReports.filter(
            (report) => report.title.toLowerCase().includes(searchTerm) || report.description.toLowerCase().includes(searchTerm) || report.author.toLowerCase().includes(searchTerm) || report.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
          );
        }
        if (type === "all" || type === "insights") {
          results.insights = analystInsights.filter(
            (insight) => insight.title.toLowerCase().includes(searchTerm) || insight.content.toLowerCase().includes(searchTerm) || insight.analyst.name.toLowerCase().includes(searchTerm) || insight.assets.some((asset) => asset.toLowerCase().includes(searchTerm))
          );
        }
        if (type === "all" || type === "podcasts") {
          results.podcasts = podcasts.filter(
            (podcast) => podcast.title.toLowerCase().includes(searchTerm) || podcast.description.toLowerCase().includes(searchTerm) || podcast.host.toLowerCase().includes(searchTerm) || podcast.keyTopics.some((topic) => topic.toLowerCase().includes(searchTerm))
          );
        }
        if (type === "all" || type === "commentary") {
          results.commentary = liveCommentary.filter(
            (comment) => comment.title.toLowerCase().includes(searchTerm) || comment.content.toLowerCase().includes(searchTerm) || comment.assets.some((asset) => asset.toLowerCase().includes(searchTerm))
          );
        }
        res.json(results);
      } catch (error) {
        console.error("Error searching content:", error);
        res.status(500).json({ message: "Failed to search content" });
      }
    });
    router11.get("/analytics", async (req, res) => {
      try {
        const analytics = {
          totalReports: marketReports.length,
          premiumReports: marketReports.filter((r) => r.premium).length,
          totalInsights: analystInsights.length,
          totalPodcasts: podcasts.length,
          totalCommentary: liveCommentary.length,
          topCategories: [
            { name: "Market Analysis", count: 1 },
            { name: "DeFi Research", count: 1 },
            { name: "Technical Analysis", count: 2 }
          ],
          topAnalysts: analystInsights.map((i) => ({
            name: i.analyst.name,
            firm: i.analyst.firm,
            rating: i.analyst.rating,
            insights: 1
          })),
          recentActivity: {
            reports: marketReports.length,
            insights: analystInsights.length,
            podcasts: podcasts.length,
            commentary: liveCommentary.filter(
              (c) => new Date(c.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1e3
            ).length
          }
        };
        res.json(analytics);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({ message: "Failed to fetch analytics" });
      }
    });
    market_research_routes_default = router11;
  }
});

// server/staking-routes.ts
var staking_routes_exports = {};
__export(staking_routes_exports, {
  default: () => staking_routes_default
});
import { Router as Router12 } from "express";
import { z as z6 } from "zod";
function calculateEndDate(term) {
  const now = /* @__PURE__ */ new Date();
  const endDate = new Date(now);
  switch (term) {
    case "flexible":
      return endDate;
    // No fixed end date
    case "30d":
      endDate.setDate(now.getDate() + 30);
      break;
    case "60d":
      endDate.setDate(now.getDate() + 60);
      break;
    case "90d":
      endDate.setDate(now.getDate() + 90);
      break;
    case "180d":
      endDate.setDate(now.getDate() + 180);
      break;
    case "365d":
      endDate.setDate(now.getDate() + 365);
      break;
  }
  return endDate;
}
async function calculateStakingRewards(position) {
  const startDate = new Date(position.startDate);
  const now = /* @__PURE__ */ new Date();
  const daysStaked = Math.floor((now.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24));
  const annualRate = parseFloat(position.apy.replace("%", "")) / 100;
  const dailyRate = annualRate / 365;
  const rewards = parseFloat(position.amount) * dailyRate * daysStaked;
  return Math.max(0, rewards);
}
var router12, createStakeSchema, stakingPools, staking_routes_default;
var init_staking_routes = __esm({
  "server/staking-routes.ts"() {
    "use strict";
    init_simple_auth();
    init_storage();
    router12 = Router12();
    createStakeSchema = z6.object({
      assetSymbol: z6.string().min(1).max(10),
      amount: z6.number().min(1e-3),
      stakingTerm: z6.enum(["flexible", "30d", "60d", "90d", "180d", "365d"]),
      autoReinvest: z6.boolean().default(false)
    });
    stakingPools = [
      {
        symbol: "BTC",
        name: "Bitcoin",
        apy: "4.5%",
        minAmount: 1e-3,
        maxAmount: 100,
        terms: ["flexible", "30d", "60d", "90d"],
        description: "Stake Bitcoin and earn rewards"
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        apy: "5.2%",
        minAmount: 0.01,
        maxAmount: 1e3,
        terms: ["flexible", "30d", "60d", "90d", "180d"],
        description: "Ethereum 2.0 staking rewards"
      },
      {
        symbol: "ADA",
        name: "Cardano",
        apy: "4.8%",
        minAmount: 10,
        maxAmount: 1e5,
        terms: ["flexible", "60d", "90d", "180d", "365d"],
        description: "Cardano delegation rewards"
      },
      {
        symbol: "DOT",
        name: "Polkadot",
        apy: "12.5%",
        minAmount: 1,
        maxAmount: 1e4,
        terms: ["flexible", "90d", "180d", "365d"],
        description: "Polkadot nomination rewards"
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        apy: "8.0%",
        minAmount: 1,
        maxAmount: 1e6,
        terms: ["flexible", "30d", "60d", "90d", "180d", "365d"],
        description: "Stable coin staking with high yields"
      }
    ];
    router12.get("/pools", requireAuth, async (req, res) => {
      try {
        res.json(stakingPools);
      } catch (error) {
        console.error("Error fetching staking pools:", error);
        res.status(500).json({ message: "Failed to fetch staking pools" });
      }
    });
    router12.get("/positions", requireAuth, async (req, res) => {
      try {
        const stakes = await storage.getUserStakingPositions(req.user.id);
        res.json(stakes);
      } catch (error) {
        console.error("Error fetching staking positions:", error);
        res.status(500).json({ message: "Failed to fetch staking positions" });
      }
    });
    router12.post("/stake", requireAuth, async (req, res) => {
      try {
        const stakeData = createStakeSchema.parse(req.body);
        const pool2 = stakingPools.find((p) => p.symbol === stakeData.assetSymbol);
        if (!pool2) {
          return res.status(400).json({ message: "Invalid staking asset" });
        }
        if (stakeData.amount < pool2.minAmount || stakeData.amount > pool2.maxAmount) {
          return res.status(400).json({
            message: `Amount must be between ${pool2.minAmount} and ${pool2.maxAmount} ${pool2.symbol}`
          });
        }
        if (!pool2.terms.includes(stakeData.stakingTerm)) {
          return res.status(400).json({ message: "Invalid staking term for this asset" });
        }
        const portfolio = await storage.getPortfolio(req.user.id);
        if (!portfolio) {
          return res.status(404).json({ message: "Portfolio not found" });
        }
        const holding = await storage.getHolding(portfolio.id, stakeData.assetSymbol);
        if (!holding || parseFloat(holding.amount) < stakeData.amount) {
          return res.status(400).json({ message: "Insufficient balance" });
        }
        const stake = await storage.createStakingPosition({
          userId: req.user.id,
          assetSymbol: stakeData.assetSymbol,
          amount: stakeData.amount.toString(),
          apy: pool2.apy,
          stakingTerm: stakeData.stakingTerm,
          autoReinvest: stakeData.autoReinvest,
          startDate: /* @__PURE__ */ new Date(),
          endDate: calculateEndDate(stakeData.stakingTerm),
          status: "active"
        });
        await storage.updateHolding(holding.id, {
          amount: (parseFloat(holding.amount) - stakeData.amount).toString()
        });
        res.json(stake);
      } catch (error) {
        console.error("Error creating stake:", error);
        if (error instanceof z6.ZodError) {
          return res.status(400).json({ message: "Invalid input data", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to create stake" });
      }
    });
    router12.post("/unstake/:positionId", requireAuth, async (req, res) => {
      try {
        const position = await storage.getStakingPosition(req.params.positionId, req.user.id);
        if (!position) {
          return res.status(404).json({ message: "Staking position not found" });
        }
        if (position.status !== "active") {
          return res.status(400).json({ message: "Position is not active" });
        }
        const rewards = await calculateStakingRewards(position);
        await storage.updateStakingPosition(req.params.positionId, {
          status: "completed",
          endDate: /* @__PURE__ */ new Date(),
          totalRewards: rewards.toString()
        });
        const portfolio = await storage.getPortfolio(req.user.id);
        if (portfolio) {
          const holding = await storage.getHolding(portfolio.id, position.assetSymbol);
          if (holding) {
            const newAmount = parseFloat(holding.amount) + parseFloat(position.amount) + rewards;
            await storage.updateHolding(holding.id, {
              amount: newAmount.toString()
            });
          }
        }
        res.json({
          message: "Successfully unstaked",
          originalAmount: position.amount,
          rewards,
          totalReturned: parseFloat(position.amount) + rewards
        });
      } catch (error) {
        console.error("Error unstaking:", error);
        res.status(500).json({ message: "Failed to unstake position" });
      }
    });
    router12.get("/rewards", requireAuth, async (req, res) => {
      try {
        const rewards = await storage.getStakingRewards(req.user.id);
        res.json(rewards);
      } catch (error) {
        console.error("Error fetching staking rewards:", error);
        res.status(500).json({ message: "Failed to fetch rewards" });
      }
    });
    router12.get("/analytics", requireAuth, async (req, res) => {
      try {
        const analytics = await storage.getStakingAnalytics(req.user.id);
        res.json(analytics);
      } catch (error) {
        console.error("Error fetching staking analytics:", error);
        res.status(500).json({ message: "Failed to fetch analytics" });
      }
    });
    staking_routes_default = router12;
  }
});

// server/lending-routes.ts
var lending_routes_exports = {};
__export(lending_routes_exports, {
  default: () => lending_routes_default
});
import { Router as Router13 } from "express";
import { z as z7 } from "zod";
function calculateLoanEndDate(term) {
  const now = /* @__PURE__ */ new Date();
  const endDate = new Date(now);
  switch (term) {
    case "7d":
      endDate.setDate(now.getDate() + 7);
      break;
    case "14d":
      endDate.setDate(now.getDate() + 14);
      break;
    case "30d":
      endDate.setDate(now.getDate() + 30);
      break;
    case "60d":
      endDate.setDate(now.getDate() + 60);
      break;
    case "90d":
      endDate.setDate(now.getDate() + 90);
      break;
    case "180d":
      endDate.setDate(now.getDate() + 180);
      break;
  }
  return endDate;
}
async function calculateLoanInterest(loan) {
  const startDate = new Date(loan.startDate);
  const now = /* @__PURE__ */ new Date();
  const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24));
  const annualRate = parseFloat(loan.interestRate) / 100;
  const dailyRate = annualRate / 365;
  const interest = parseFloat(loan.amount) * dailyRate * daysElapsed;
  return Math.max(0, interest);
}
async function calculateLendingInterest(position) {
  const startDate = new Date(position.startDate);
  const now = /* @__PURE__ */ new Date();
  const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24));
  const annualRate = parseFloat(position.apy.replace("%", "")) / 100;
  const dailyRate = annualRate / 365;
  const interest = parseFloat(position.amount) * dailyRate * daysElapsed;
  return Math.max(0, interest);
}
var router13, createLoanSchema, lendingPools, collateralRatios, lending_routes_default;
var init_lending_routes = __esm({
  "server/lending-routes.ts"() {
    "use strict";
    init_simple_auth();
    init_storage();
    router13 = Router13();
    createLoanSchema = z7.object({
      assetSymbol: z7.string().min(1).max(10),
      amount: z7.number().min(1),
      collateralSymbol: z7.string().min(1).max(10),
      collateralAmount: z7.number().min(1e-3),
      loanTerm: z7.enum(["7d", "14d", "30d", "60d", "90d", "180d"]),
      interestRate: z7.number().min(0.01).max(50)
    });
    lendingPools = [
      {
        symbol: "USDC",
        name: "USD Coin",
        apy: "12.5%",
        minAmount: 100,
        maxAmount: 1e5,
        availableLiquidity: 5e5,
        description: "Lend USDC to earn high yields"
      },
      {
        symbol: "USDT",
        name: "Tether",
        apy: "11.8%",
        minAmount: 100,
        maxAmount: 1e5,
        availableLiquidity: 75e4,
        description: "Stable lending with USDT"
      },
      {
        symbol: "DAI",
        name: "Dai",
        apy: "10.2%",
        minAmount: 100,
        maxAmount: 5e4,
        availableLiquidity: 25e4,
        description: "Decentralized stablecoin lending"
      },
      {
        symbol: "BTC",
        name: "Bitcoin",
        apy: "6.5%",
        minAmount: 1e-3,
        maxAmount: 10,
        availableLiquidity: 50,
        description: "Lend Bitcoin for steady returns"
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        apy: "7.2%",
        minAmount: 0.01,
        maxAmount: 100,
        availableLiquidity: 500,
        description: "Ethereum lending pool"
      }
    ];
    collateralRatios = {
      "BTC": 150,
      // 150% collateral required
      "ETH": 150,
      "USDC": 110,
      "USDT": 110,
      "DAI": 110
    };
    router13.get("/pools", requireAuth, async (req, res) => {
      try {
        res.json(lendingPools);
      } catch (error) {
        console.error("Error fetching lending pools:", error);
        res.status(500).json({ message: "Failed to fetch lending pools" });
      }
    });
    router13.get("/positions", requireAuth, async (req, res) => {
      try {
        const positions = await storage.getUserLendingPositions(req.user.id);
        res.json(positions);
      } catch (error) {
        console.error("Error fetching lending positions:", error);
        res.status(500).json({ message: "Failed to fetch lending positions" });
      }
    });
    router13.post("/lend", requireAuth, async (req, res) => {
      try {
        const { assetSymbol, amount } = req.body;
        const pool2 = lendingPools.find((p) => p.symbol === assetSymbol);
        if (!pool2) {
          return res.status(400).json({ message: "Invalid lending asset" });
        }
        if (amount < pool2.minAmount || amount > pool2.maxAmount) {
          return res.status(400).json({
            message: `Amount must be between ${pool2.minAmount} and ${pool2.maxAmount} ${pool2.symbol}`
          });
        }
        const portfolio = await storage.getPortfolio(req.user.id);
        if (!portfolio) {
          return res.status(404).json({ message: "Portfolio not found" });
        }
        const holding = await storage.getHolding(portfolio.id, assetSymbol);
        if (!holding || parseFloat(holding.amount) < amount) {
          return res.status(400).json({ message: "Insufficient balance" });
        }
        const position = await storage.createLendingPosition({
          userId: req.user.id,
          assetSymbol,
          amount: amount.toString(),
          apy: pool2.apy,
          startDate: /* @__PURE__ */ new Date(),
          status: "active",
          type: "lend"
        });
        await storage.updateHolding(holding.id, {
          amount: (parseFloat(holding.amount) - amount).toString()
        });
        res.json(position);
      } catch (error) {
        console.error("Error creating lending position:", error);
        res.status(500).json({ message: "Failed to create lending position" });
      }
    });
    router13.post("/borrow", requireAuth, async (req, res) => {
      try {
        const loanData = createLoanSchema.parse(req.body);
        const requiredRatio = collateralRatios[loanData.collateralSymbol];
        if (!requiredRatio) {
          return res.status(400).json({ message: "Invalid collateral asset" });
        }
        const collateralValue = loanData.collateralAmount;
        const loanValue = loanData.amount;
        const actualRatio = collateralValue / loanValue * 100;
        if (actualRatio < requiredRatio) {
          return res.status(400).json({
            message: `Insufficient collateral. Required: ${requiredRatio}%, Provided: ${actualRatio.toFixed(2)}%`
          });
        }
        const portfolio = await storage.getPortfolio(req.user.id);
        if (!portfolio) {
          return res.status(404).json({ message: "Portfolio not found" });
        }
        const collateralHolding = await storage.getHolding(portfolio.id, loanData.collateralSymbol);
        if (!collateralHolding || parseFloat(collateralHolding.amount) < loanData.collateralAmount) {
          return res.status(400).json({ message: "Insufficient collateral balance" });
        }
        const loan = await storage.createLoan({
          userId: req.user.id,
          assetSymbol: loanData.assetSymbol,
          amount: loanData.amount.toString(),
          collateralSymbol: loanData.collateralSymbol,
          collateralAmount: loanData.collateralAmount.toString(),
          interestRate: loanData.interestRate.toString(),
          loanTerm: loanData.loanTerm,
          startDate: /* @__PURE__ */ new Date(),
          endDate: calculateLoanEndDate(loanData.loanTerm),
          status: "active"
        });
        await storage.updateHolding(collateralHolding.id, {
          amount: (parseFloat(collateralHolding.amount) - loanData.collateralAmount).toString()
        });
        const borrowedHolding = await storage.getHolding(portfolio.id, loanData.assetSymbol);
        if (borrowedHolding) {
          await storage.updateHolding(borrowedHolding.id, {
            amount: (parseFloat(borrowedHolding.amount) + loanData.amount).toString()
          });
        } else {
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            assetType: "crypto",
            symbol: loanData.assetSymbol,
            name: loanData.assetSymbol,
            amount: loanData.amount.toString(),
            averagePurchasePrice: "0",
            currentPrice: "0"
          });
        }
        res.json(loan);
      } catch (error) {
        console.error("Error creating loan:", error);
        if (error instanceof z7.ZodError) {
          return res.status(400).json({ message: "Invalid input data", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to create loan" });
      }
    });
    router13.get("/loans", requireAuth, async (req, res) => {
      try {
        const loans2 = await storage.getUserLoans(req.user.id);
        res.json(loans2);
      } catch (error) {
        console.error("Error fetching loans:", error);
        res.status(500).json({ message: "Failed to fetch loans" });
      }
    });
    router13.post("/repay/:loanId", requireAuth, async (req, res) => {
      try {
        const { amount } = req.body;
        const loan = await storage.getLoan(req.params.loanId, req.user.id);
        if (!loan) {
          return res.status(404).json({ message: "Loan not found" });
        }
        if (loan.status !== "active") {
          return res.status(400).json({ message: "Loan is not active" });
        }
        const interest = await calculateLoanInterest(loan);
        const totalOwed = parseFloat(loan.amount) + interest;
        if (amount < totalOwed) {
          return res.status(400).json({
            message: `Insufficient repayment. Total owed: ${totalOwed.toFixed(6)} ${loan.assetSymbol}`
          });
        }
        const portfolio = await storage.getPortfolio(req.user.id);
        if (!portfolio) {
          return res.status(404).json({ message: "Portfolio not found" });
        }
        const holding = await storage.getHolding(portfolio.id, loan.assetSymbol);
        if (!holding || parseFloat(holding.amount) < totalOwed) {
          return res.status(400).json({ message: "Insufficient balance to repay loan" });
        }
        await storage.updateLoan(req.params.loanId, {
          status: "repaid",
          repaymentDate: /* @__PURE__ */ new Date(),
          totalInterest: interest.toString()
        });
        await storage.updateHolding(holding.id, {
          amount: (parseFloat(holding.amount) - totalOwed).toString()
        });
        const collateralHolding = await storage.getHolding(portfolio.id, loan.collateralSymbol);
        if (collateralHolding) {
          await storage.updateHolding(collateralHolding.id, {
            amount: (parseFloat(collateralHolding.amount) + parseFloat(loan.collateralAmount)).toString()
          });
        }
        res.json({
          message: "Loan repaid successfully",
          principal: loan.amount,
          interest,
          totalPaid: totalOwed
        });
      } catch (error) {
        console.error("Error repaying loan:", error);
        res.status(500).json({ message: "Failed to repay loan" });
      }
    });
    router13.post("/withdraw/:positionId", requireAuth, async (req, res) => {
      try {
        const position = await storage.getLendingPosition(req.params.positionId, req.user.id);
        if (!position) {
          return res.status(404).json({ message: "Lending position not found" });
        }
        if (position.status !== "active") {
          return res.status(400).json({ message: "Position is not active" });
        }
        const interest = await calculateLendingInterest(position);
        await storage.updateLendingPosition(req.params.positionId, {
          status: "completed",
          endDate: /* @__PURE__ */ new Date(),
          totalEarned: interest.toString()
        });
        const portfolio = await storage.getPortfolio(req.user.id);
        if (portfolio) {
          const holding = await storage.getHolding(portfolio.id, position.assetSymbol);
          if (holding) {
            const newAmount = parseFloat(holding.amount) + parseFloat(position.amount) + interest;
            await storage.updateHolding(holding.id, {
              amount: newAmount.toString()
            });
          }
        }
        res.json({
          message: "Successfully withdrawn from lending position",
          principal: position.amount,
          interest,
          totalReturned: parseFloat(position.amount) + interest
        });
      } catch (error) {
        console.error("Error withdrawing from lending position:", error);
        res.status(500).json({ message: "Failed to withdraw from position" });
      }
    });
    lending_routes_default = router13;
  }
});

// server/investment-plans-routes.ts
var investment_plans_routes_exports = {};
__export(investment_plans_routes_exports, {
  default: () => investment_plans_routes_default
});
import { Router as Router14 } from "express";
import { z as z8 } from "zod";
var router14, investmentSchema, investment_plans_routes_default;
var init_investment_plans_routes = __esm({
  "server/investment-plans-routes.ts"() {
    "use strict";
    init_simple_auth();
    init_storage();
    router14 = Router14();
    investmentSchema = z8.object({
      planId: z8.string(),
      amount: z8.number().positive()
    });
    router14.get("/", async (req, res) => {
      try {
        const plans = [
          {
            id: "conservative-growth",
            name: "Conservative Growth",
            description: "Low-risk investment plan with steady returns",
            minInvestment: 100,
            expectedReturn: 7.5,
            duration: 12,
            riskLevel: "low",
            category: "Bonds & Fixed Income",
            features: [
              "Government bonds and high-grade corporate bonds",
              "Capital preservation focus",
              "Quarterly dividends",
              "Low volatility"
            ],
            isActive: true,
            totalInvested: 25e5,
            totalInvestors: 1250
          },
          {
            id: "balanced-portfolio",
            name: "Balanced Portfolio",
            description: "Diversified mix of stocks and bonds for moderate growth",
            minInvestment: 500,
            expectedReturn: 12,
            duration: 18,
            riskLevel: "medium",
            category: "Mixed Assets",
            features: [
              "60% stocks, 40% bonds allocation",
              "Professional portfolio management",
              "Monthly rebalancing",
              "Global diversification"
            ],
            isActive: true,
            totalInvested: 575e4,
            totalInvestors: 2100
          },
          {
            id: "growth-equity",
            name: "Growth Equity",
            description: "High-growth potential with focus on emerging markets",
            minInvestment: 1e3,
            expectedReturn: 18.5,
            duration: 24,
            riskLevel: "high",
            category: "Equity",
            features: [
              "Growth stocks and tech companies",
              "Emerging markets exposure",
              "Active management strategy",
              "High potential returns"
            ],
            isActive: true,
            totalInvested: 32e5,
            totalInvestors: 890
          },
          {
            id: "crypto-diversified",
            name: "Crypto Diversified",
            description: "Cryptocurrency portfolio with major digital assets",
            minInvestment: 250,
            expectedReturn: 25,
            duration: 12,
            riskLevel: "high",
            category: "Cryptocurrency",
            features: [
              "Bitcoin and Ethereum focus",
              "DeFi protocol investments",
              "Institutional custody",
              "Weekly rebalancing"
            ],
            isActive: true,
            totalInvested: 18e5,
            totalInvestors: 720
          },
          {
            id: "dividend-income",
            name: "Dividend Income",
            description: "Focus on dividend-paying stocks for regular income",
            minInvestment: 750,
            expectedReturn: 9.2,
            duration: 15,
            riskLevel: "medium",
            category: "Dividend Stocks",
            features: [
              "High dividend yield stocks",
              "Monthly income distribution",
              "Dividend aristocrats focus",
              "Reinvestment options"
            ],
            isActive: true,
            totalInvested: 41e5,
            totalInvestors: 1560
          },
          {
            id: "esg-sustainable",
            name: "ESG Sustainable",
            description: "Environmental, social, and governance focused investments",
            minInvestment: 500,
            expectedReturn: 11.8,
            duration: 20,
            riskLevel: "medium",
            category: "ESG",
            features: [
              "Sustainable business practices",
              "Climate-focused investments",
              "Social impact measurement",
              "Long-term value creation"
            ],
            isActive: true,
            totalInvested: 29e5,
            totalInvestors: 1340
          }
        ];
        res.json(plans);
      } catch (error) {
        console.error("Get investment plans error:", error);
        res.status(500).json({ message: "Failed to fetch investment plans" });
      }
    });
    router14.post("/invest", requireAuth, async (req, res) => {
      try {
        const data = investmentSchema.parse(req.body);
        const userId = req.user.id;
        const portfolio = await storage.getPortfolio(userId);
        if (!portfolio) {
          return res.status(400).json({ message: "Portfolio not found" });
        }
        const availableCash = parseFloat(portfolio.availableCash);
        if (availableCash < data.amount) {
          return res.status(400).json({ message: "Insufficient balance" });
        }
        const investment = {
          id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          planId: data.planId,
          investedAmount: data.amount,
          currentValue: data.amount,
          startDate: (/* @__PURE__ */ new Date()).toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3).toISOString(),
          // 1 year from now
          status: "active",
          expectedReturn: 12,
          // Default expected return
          actualReturn: 0,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        const newAvailableCash = availableCash - data.amount;
        await storage.updatePortfolio(portfolio.id, {
          availableCash: newAvailableCash.toString()
        });
        res.json(investment);
      } catch (error) {
        console.error("Create investment error:", error);
        res.status(500).json({ message: "Failed to create investment" });
      }
    });
    router14.get("/my-investments", requireAuth, async (req, res) => {
      try {
        const userId = req.user.id;
        const mockInvestments = [
          {
            id: "inv_1",
            planId: "balanced-portfolio",
            planName: "Balanced Portfolio",
            investedAmount: 5e3,
            currentValue: 5420,
            startDate: "2024-01-15T00:00:00.000Z",
            endDate: "2025-01-15T00:00:00.000Z",
            status: "active",
            expectedReturn: 12,
            actualReturn: 8.4
          },
          {
            id: "inv_2",
            planId: "dividend-income",
            planName: "Dividend Income",
            investedAmount: 2500,
            currentValue: 2680,
            startDate: "2024-03-01T00:00:00.000Z",
            endDate: "2025-06-01T00:00:00.000Z",
            status: "active",
            expectedReturn: 9.2,
            actualReturn: 7.2
          }
        ];
        res.json(mockInvestments);
      } catch (error) {
        console.error("Get user investments error:", error);
        res.status(500).json({ message: "Failed to fetch user investments" });
      }
    });
    investment_plans_routes_default = router14;
  }
});

// server/savings-plans-routes.ts
var savings_plans_routes_exports = {};
__export(savings_plans_routes_exports, {
  default: () => savings_plans_routes_default
});
import { Router as Router15 } from "express";
import { z as z9 } from "zod";
var router15, savingsPlanSchema, savings_plans_routes_default;
var init_savings_plans_routes = __esm({
  "server/savings-plans-routes.ts"() {
    "use strict";
    init_simple_auth();
    router15 = Router15();
    savingsPlanSchema = z9.object({
      planId: z9.string(),
      amount: z9.number().positive(),
      frequency: z9.enum(["daily", "weekly", "monthly"]),
      duration: z9.number().positive(),
      autoDeposit: z9.boolean()
    });
    router15.get("/", async (req, res) => {
      try {
        const plans = [
          {
            id: "basic-saver",
            name: "Basic Saver",
            description: "Start your savings journey with our entry-level plan",
            minAmount: 10,
            maxAmount: 500,
            frequency: "monthly",
            interestRate: 3.5,
            compounding: "monthly",
            minDuration: 6,
            maxDuration: 60,
            category: "Beginner",
            features: [
              "No minimum balance fees",
              "Easy withdrawal access",
              "Mobile app integration",
              "Educational resources"
            ],
            isActive: true
          },
          {
            id: "smart-saver",
            name: "Smart Saver",
            description: "Intelligent savings with automated optimization",
            minAmount: 50,
            maxAmount: 2e3,
            frequency: "weekly",
            interestRate: 4.2,
            compounding: "monthly",
            minDuration: 12,
            maxDuration: 60,
            category: "Popular",
            features: [
              "AI-powered saving recommendations",
              "Automatic round-up features",
              "Goal-based saving targets",
              "Higher interest rates"
            ],
            isActive: true
          },
          {
            id: "premium-saver",
            name: "Premium Saver",
            description: "Maximum returns for serious savers",
            minAmount: 100,
            maxAmount: 5e3,
            frequency: "daily",
            interestRate: 5.8,
            compounding: "quarterly",
            minDuration: 24,
            maxDuration: 120,
            category: "Premium",
            features: [
              "Premium interest rates",
              "Dedicated savings advisor",
              "Flexible withdrawal options",
              "Investment opportunities"
            ],
            isActive: true
          },
          {
            id: "goal-oriented",
            name: "Goal-Oriented Saver",
            description: "Save for specific life goals with targeted strategies",
            minAmount: 25,
            maxAmount: 1e3,
            frequency: "monthly",
            interestRate: 4,
            compounding: "monthly",
            minDuration: 6,
            maxDuration: 60,
            category: "Goal-Based",
            features: [
              "Customizable saving goals",
              "Progress tracking",
              "Milestone rewards",
              "Flexible contributions"
            ],
            isActive: true
          },
          {
            id: "emergency-fund",
            name: "Emergency Fund Builder",
            description: "Build your financial safety net systematically",
            minAmount: 20,
            maxAmount: 800,
            frequency: "weekly",
            interestRate: 3.8,
            compounding: "monthly",
            minDuration: 3,
            maxDuration: 36,
            category: "Emergency",
            features: [
              "Quick access when needed",
              "No penalties for emergency withdrawals",
              "Automatic emergency detection",
              "Financial planning tools"
            ],
            isActive: true
          },
          {
            id: "vacation-saver",
            name: "Vacation Saver",
            description: "Save for your dream vacation with travel-focused benefits",
            minAmount: 30,
            maxAmount: 1500,
            frequency: "monthly",
            interestRate: 4.5,
            compounding: "monthly",
            minDuration: 6,
            maxDuration: 24,
            category: "Lifestyle",
            features: [
              "Travel reward partnerships",
              "Currency conversion tools",
              "Destination planning assistance",
              "Bonus interest for travel goals"
            ],
            isActive: true
          }
        ];
        res.json(plans);
      } catch (error) {
        console.error("Get savings plans error:", error);
        res.status(500).json({ message: "Failed to fetch savings plans" });
      }
    });
    router15.post("/create", requireAuth, async (req, res) => {
      try {
        const data = savingsPlanSchema.parse(req.body);
        const userId = req.user.id;
        const savingsPlan = {
          id: `sav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          planId: data.planId,
          amount: data.amount,
          frequency: data.frequency,
          duration: data.duration,
          autoDeposit: data.autoDeposit,
          nextDeposit: new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString(),
          // Tomorrow
          startDate: (/* @__PURE__ */ new Date()).toISOString(),
          endDate: new Date(Date.now() + data.duration * 30 * 24 * 60 * 60 * 1e3).toISOString(),
          totalSaved: 0,
          interestEarned: 0,
          status: "active",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        res.json(savingsPlan);
      } catch (error) {
        console.error("Create savings plan error:", error);
        res.status(500).json({ message: "Failed to create savings plan" });
      }
    });
    router15.get("/my-plans", requireAuth, async (req, res) => {
      try {
        const userId = req.user.id;
        const mockSavings = [
          {
            id: "sav_1",
            planId: "smart-saver",
            planName: "Smart Saver",
            amount: 150,
            frequency: "monthly",
            nextDeposit: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString(),
            startDate: "2024-01-01T00:00:00.000Z",
            endDate: "2025-01-01T00:00:00.000Z",
            totalSaved: 1650,
            interestEarned: 45.2,
            status: "active",
            autoDeposit: true
          },
          {
            id: "sav_2",
            planId: "emergency-fund",
            planName: "Emergency Fund Builder",
            amount: 75,
            frequency: "weekly",
            nextDeposit: new Date(Date.now() + 2 * 24 * 60 * 60 * 1e3).toISOString(),
            startDate: "2024-02-15T00:00:00.000Z",
            endDate: "2025-02-15T00:00:00.000Z",
            totalSaved: 3525,
            interestEarned: 89.75,
            status: "active",
            autoDeposit: true
          }
        ];
        res.json(mockSavings);
      } catch (error) {
        console.error("Get user savings plans error:", error);
        res.status(500).json({ message: "Failed to fetch user savings plans" });
      }
    });
    router15.post("/:planId/pause", requireAuth, async (req, res) => {
      try {
        const { planId } = req.params;
        const userId = req.user.id;
        res.json({ message: "Savings plan paused successfully" });
      } catch (error) {
        console.error("Pause savings plan error:", error);
        res.status(500).json({ message: "Failed to pause savings plan" });
      }
    });
    router15.post("/:planId/resume", requireAuth, async (req, res) => {
      try {
        const { planId } = req.params;
        const userId = req.user.id;
        res.json({ message: "Savings plan resumed successfully" });
      } catch (error) {
        console.error("Resume savings plan error:", error);
        res.status(500).json({ message: "Failed to resume savings plan" });
      }
    });
    savings_plans_routes_default = router15;
  }
});

// server/deposit-service.ts
import { eq as eq2, desc as desc2 } from "drizzle-orm";
import multer2 from "multer";
import path2 from "path";
var storage2, uploadProof, DepositService, depositService;
var init_deposit_service = __esm({
  "server/deposit-service.ts"() {
    "use strict";
    init_db();
    init_schema();
    storage2 = multer2.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./uploads/proofs");
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `proof-${uniqueSuffix}${path2.extname(file.originalname)}`);
      }
    });
    uploadProof = multer2({
      storage: storage2,
      limits: {
        fileSize: 5 * 1024 * 1024
        // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Only JPEG and PNG images are allowed"));
        }
      }
    });
    DepositService = class {
      async createDeposit(depositData) {
        try {
          console.log("Creating deposit:", depositData);
          const [newDeposit] = await db.insert(deposits).values({
            userId: depositData.userId,
            amount: depositData.amount.toString(),
            currency: depositData.currency,
            assetType: depositData.assetType,
            paymentMethod: depositData.paymentMethod,
            proofImageUrl: depositData.proofImageUrl,
            status: "pending"
          }).returning();
          console.log("Deposit created:", newDeposit);
          return newDeposit;
        } catch (error) {
          console.error("Error creating deposit:", error);
          throw new Error("Failed to create deposit request");
        }
      }
      async getUserDeposits(userId) {
        try {
          return await db.select().from(deposits).where(eq2(deposits.userId, userId)).orderBy(desc2(deposits.createdAt));
        } catch (error) {
          console.error("Error fetching user deposits:", error);
          throw new Error("Failed to fetch deposits");
        }
      }
      async getPendingDeposits() {
        try {
          return await db.select({
            id: deposits.id,
            userId: deposits.userId,
            amount: deposits.amount,
            currency: deposits.currency,
            assetType: deposits.assetType,
            paymentMethod: deposits.paymentMethod,
            proofImageUrl: deposits.proofImageUrl,
            status: deposits.status,
            createdAt: deposits.createdAt,
            username: users.username,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName
          }).from(deposits).leftJoin(users, eq2(deposits.userId, users.id)).where(eq2(deposits.status, "pending")).orderBy(desc2(deposits.createdAt));
        } catch (error) {
          console.error("Error fetching pending deposits:", error);
          throw new Error("Failed to fetch pending deposits");
        }
      }
      async approveDeposit(approval) {
        try {
          console.log("Processing deposit approval:", approval);
          const [deposit] = await db.select().from(deposits).where(eq2(deposits.id, approval.depositId));
          if (!deposit) {
            throw new Error("Deposit not found");
          }
          if (deposit.status !== "pending") {
            throw new Error("Deposit is not in pending status");
          }
          const [updatedDeposit] = await db.update(deposits).set({
            status: approval.approved ? "approved" : "rejected",
            approvedById: approval.adminId,
            approvedAt: /* @__PURE__ */ new Date(),
            adminNotes: approval.adminNotes,
            rejectionReason: approval.rejectionReason
          }).where(eq2(deposits.id, approval.depositId)).returning();
          if (approval.approved) {
            await this.addFundsToPortfolio(deposit.userId, parseFloat(deposit.amount));
          }
          console.log("Deposit updated:", updatedDeposit);
          return updatedDeposit;
        } catch (error) {
          console.error("Error approving deposit:", error);
          throw error;
        }
      }
      async addFundsToPortfolio(userId, amount) {
        try {
          const [portfolio] = await db.select().from(portfolios).where(eq2(portfolios.userId, userId));
          if (!portfolio) {
            await db.insert(portfolios).values({
              userId,
              totalValue: amount.toString(),
              availableCash: amount.toString()
            });
          } else {
            const newAvailableCash = parseFloat(portfolio.availableCash) + amount;
            const newTotalValue = parseFloat(portfolio.totalValue) + amount;
            await db.update(portfolios).set({
              availableCash: newAvailableCash.toString(),
              totalValue: newTotalValue.toString(),
              updatedAt: /* @__PURE__ */ new Date()
            }).where(eq2(portfolios.id, portfolio.id));
          }
          console.log(`Added $${amount} to user ${userId} portfolio`);
        } catch (error) {
          console.error("Error adding funds to portfolio:", error);
          throw new Error("Failed to add funds to portfolio");
        }
      }
      async getDepositById(id) {
        try {
          const [deposit] = await db.select({
            id: deposits.id,
            userId: deposits.userId,
            amount: deposits.amount,
            currency: deposits.currency,
            assetType: deposits.assetType,
            paymentMethod: deposits.paymentMethod,
            proofImageUrl: deposits.proofImageUrl,
            status: deposits.status,
            rejectionReason: deposits.rejectionReason,
            adminNotes: deposits.adminNotes,
            approvedAt: deposits.approvedAt,
            createdAt: deposits.createdAt,
            username: users.username,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            approvedByUser: users.username
            // This will be the admin who approved
          }).from(deposits).leftJoin(users, eq2(deposits.userId, users.id)).where(eq2(deposits.id, id));
          return deposit;
        } catch (error) {
          console.error("Error fetching deposit by ID:", error);
          throw new Error("Failed to fetch deposit");
        }
      }
      async getAllDeposits(limit = 50, offset = 0) {
        try {
          return await db.select({
            id: deposits.id,
            userId: deposits.userId,
            amount: deposits.amount,
            currency: deposits.currency,
            assetType: deposits.assetType,
            paymentMethod: deposits.paymentMethod,
            status: deposits.status,
            createdAt: deposits.createdAt,
            approvedAt: deposits.approvedAt,
            username: users.username,
            email: users.email
          }).from(deposits).leftJoin(users, eq2(deposits.userId, users.id)).orderBy(desc2(deposits.createdAt)).limit(limit).offset(offset);
        } catch (error) {
          console.error("Error fetching all deposits:", error);
          throw new Error("Failed to fetch deposits");
        }
      }
      async getDepositStats() {
        try {
          const allDeposits = await db.select().from(deposits);
          const totalDeposits = allDeposits.length;
          const pendingDeposits = allDeposits.filter((d) => d.status === "pending").length;
          const approvedDeposits = allDeposits.filter((d) => d.status === "approved").length;
          const rejectedDeposits = allDeposits.filter((d) => d.status === "rejected").length;
          const totalAmount = allDeposits.filter((d) => d.status === "approved").reduce((sum2, d) => sum2 + parseFloat(d.amount), 0);
          return {
            totalDeposits,
            pendingDeposits,
            approvedDeposits,
            rejectedDeposits,
            totalAmount
          };
        } catch (error) {
          console.error("Error fetching deposit stats:", error);
          throw new Error("Failed to fetch deposit statistics");
        }
      }
    };
    depositService = new DepositService();
  }
});

// server/proof-upload-routes.ts
var proof_upload_routes_exports = {};
__export(proof_upload_routes_exports, {
  registerProofUploadRoutes: () => registerProofUploadRoutes
});
import path3 from "path";
import fs2 from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
function registerProofUploadRoutes(app2) {
  console.log("\u{1F4CE} Registering proof upload routes");
  app2.use("/uploads/proofs", (req, res, next) => {
    const filePath = path3.join(__dirname, "..", "uploads", "proofs", req.path);
    if (!fs2.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }
    res.sendFile(filePath);
  });
  const uploadsDir2 = path3.join(__dirname, "..", "uploads", "proofs");
  if (!fs2.existsSync(uploadsDir2)) {
    fs2.mkdirSync(uploadsDir2, { recursive: true });
    console.log("\u{1F4C1} Created uploads directory:", uploadsDir2);
  }
  app2.post("/api/deposits/upload-proof", requireAuth, uploadProof.single("proof"), async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const proofImageUrl = `/uploads/proofs/${req.file.filename}`;
      res.json({
        success: true,
        proofImageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error("Error uploading proof:", error);
      res.status(500).json({ error: "Failed to upload proof of payment" });
    }
  });
  app2.post("/api/deposits/create", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const { amount, currency, assetType, paymentMethod, proofImageUrl } = req.body;
      if (!amount || !currency || !assetType || !paymentMethod) {
        return res.status(400).json({
          error: "Missing required fields: amount, currency, assetType, paymentMethod"
        });
      }
      const depositRequest = {
        userId,
        amount: parseFloat(amount),
        currency,
        assetType,
        paymentMethod,
        proofImageUrl
      };
      const deposit = await depositService.createDeposit(depositRequest);
      res.json({
        success: true,
        deposit
      });
    } catch (error) {
      console.error("Error creating deposit:", error);
      res.status(500).json({ error: "Failed to create deposit request" });
    }
  });
  app2.get("/api/deposits/my-deposits", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const deposits2 = await depositService.getUserDeposits(userId);
      res.json(deposits2);
    } catch (error) {
      console.error("Error fetching user deposits:", error);
      res.status(500).json({ error: "Failed to fetch deposits" });
    }
  });
  app2.get("/api/admin/deposits/pending", requireAuth, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      const deposits2 = await depositService.getPendingDeposits();
      res.json(deposits2);
    } catch (error) {
      console.error("Error fetching pending deposits:", error);
      res.status(500).json({ error: "Failed to fetch pending deposits" });
    }
  });
  app2.post("/api/admin/deposits/:id/review", requireAuth, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      const { id } = req.params;
      const { approved, adminNotes, rejectionReason } = req.body;
      if (typeof approved !== "boolean") {
        return res.status(400).json({ error: "Approved field must be true or false" });
      }
      const approval = {
        depositId: id,
        adminId: user.id,
        approved,
        adminNotes,
        rejectionReason: approved ? void 0 : rejectionReason
      };
      const updatedDeposit = await depositService.approveDeposit(approval);
      res.json({
        success: true,
        deposit: updatedDeposit
      });
    } catch (error) {
      console.error("Error reviewing deposit:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to review deposit"
      });
    }
  });
  app2.get("/api/admin/deposits", requireAuth, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      const deposits2 = await depositService.getAllDeposits(limit, offset);
      res.json(deposits2);
    } catch (error) {
      console.error("Error fetching all deposits:", error);
      res.status(500).json({ error: "Failed to fetch deposits" });
    }
  });
  app2.get("/api/admin/deposits/stats", requireAuth, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      const stats = await depositService.getDepositStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching deposit stats:", error);
      res.status(500).json({ error: "Failed to fetch deposit statistics" });
    }
  });
  app2.get("/api/admin/deposits/:id", requireAuth, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      const { id } = req.params;
      const deposit = await depositService.getDepositById(id);
      if (!deposit) {
        return res.status(404).json({ error: "Deposit not found" });
      }
      res.json(deposit);
    } catch (error) {
      console.error("Error fetching deposit:", error);
      res.status(500).json({ error: "Failed to fetch deposit" });
    }
  });
  console.log("\u2705 Proof upload routes registered successfully");
}
var __filename, __dirname;
var init_proof_upload_routes = __esm({
  "server/proof-upload-routes.ts"() {
    "use strict";
    init_deposit_service();
    init_simple_auth();
    __filename = fileURLToPath(import.meta.url);
    __dirname = dirname(__filename);
  }
});

// server/api-docs-routes.ts
var api_docs_routes_exports = {};
__export(api_docs_routes_exports, {
  default: () => api_docs_routes_default
});
import { Router as Router16 } from "express";
var router16, api_docs_routes_default;
var init_api_docs_routes = __esm({
  "server/api-docs-routes.ts"() {
    "use strict";
    router16 = Router16();
    router16.get("/detailed", (req, res) => {
      const detailedDocs = {
        version: "1.0.0",
        baseUrl: process.env.API_BASE_URL || "http://localhost:5000",
        authentication: {
          type: "Session-based",
          description: "Most endpoints require authentication via session cookies",
          adminEndpoints: "Require admin role in addition to authentication"
        },
        endpoints: [
          {
            path: "/api/user/auth/login",
            method: "POST",
            description: "User login",
            authentication: false,
            body: {
              emailOrUsername: "string (required)",
              password: "string (required)"
            },
            response: {
              user: "User object",
              portfolio: "Portfolio object"
            }
          },
          {
            path: "/api/crypto/price/:symbol",
            method: "GET",
            description: "Get real-time cryptocurrency price",
            authentication: false,
            parameters: {
              symbol: "Crypto symbol (e.g., BTC, ETH)"
            },
            response: {
              symbol: "string",
              price: "number",
              change_24h: "number",
              volume_24h: "number"
            }
          },
          {
            path: "/api/portfolio",
            method: "GET",
            description: "Get user portfolio with holdings",
            authentication: true,
            response: {
              portfolio: "Portfolio object",
              holdings: "Array of holdings",
              analytics: "Portfolio analytics"
            }
          },
          {
            path: "/ws",
            method: "WebSocket",
            description: "Real-time price updates via WebSocket",
            authentication: false,
            message: {
              type: "subscribe",
              symbols: ["bitcoin", "ethereum"]
            },
            responseMessage: {
              type: "price_update",
              symbol: "string",
              price: "number",
              timestamp: "number"
            }
          }
        ]
      };
      res.json(detailedDocs);
    });
    router16.get("/endpoints", (req, res) => {
      const endpoints = [
        // Authentication
        { method: "POST", path: "/api/user/auth/login", description: "User login" },
        { method: "POST", path: "/api/user/auth/register", description: "User registration" },
        { method: "POST", path: "/api/user/auth/logout", description: "User logout" },
        { method: "GET", path: "/api/user/auth/user", description: "Get current user" },
        { method: "POST", path: "/api/admin/auth/login", description: "Admin login" },
        { method: "POST", path: "/api/admin/auth/logout", description: "Admin logout" },
        { method: "GET", path: "/api/admin/auth/user", description: "Get current admin" },
        // Crypto
        { method: "GET", path: "/api/crypto/top/:limit?", description: "Get top cryptocurrencies" },
        { method: "GET", path: "/api/crypto/price/:symbol", description: "Get single crypto price" },
        { method: "POST", path: "/api/crypto/prices", description: "Get multiple crypto prices" },
        { method: "GET", path: "/api/crypto/details/:coinId", description: "Get crypto details" },
        { method: "GET", path: "/api/crypto/market-data", description: "Get market overview" },
        { method: "GET", path: "/api/crypto/search", description: "Search cryptocurrencies" },
        { method: "GET", path: "/api/crypto/history/:coinId", description: "Get price history" },
        { method: "GET", path: "/api/crypto/trending", description: "Get trending cryptos" },
        // Metals
        { method: "GET", path: "/api/metals/price/:symbol", description: "Get metal price" },
        { method: "POST", path: "/api/metals/prices", description: "Get multiple metal prices" },
        { method: "GET", path: "/api/metals/top/:limit?", description: "Get top metals" },
        { method: "GET", path: "/api/metals/market-data", description: "Get metals market data" },
        { method: "GET", path: "/api/metals/history/:symbol", description: "Get metal price history" },
        { method: "GET", path: "/api/metals/health", description: "Metals API health check" },
        // Trading
        { method: "POST", path: "/api/trade", description: "Execute trade" },
        { method: "GET", path: "/api/trading/orders", description: "Get user orders" },
        { method: "POST", path: "/api/trading/buy", description: "Buy asset" },
        { method: "POST", path: "/api/trading/sell", description: "Sell asset" },
        // Portfolio
        { method: "GET", path: "/api/portfolio", description: "Get portfolio" },
        { method: "GET", path: "/api/portfolio/holdings", description: "Get holdings" },
        { method: "GET", path: "/api/portfolio/transactions", description: "Get transactions" },
        { method: "GET", path: "/api/portfolio/analytics", description: "Get portfolio analytics" },
        { method: "GET", path: "/api/portfolio/performance", description: "Get performance metrics" },
        // Alerts
        { method: "GET", path: "/api/alerts", description: "Get user alerts" },
        { method: "POST", path: "/api/alerts", description: "Create alert" },
        { method: "PUT", path: "/api/alerts/:alertId", description: "Update alert" },
        { method: "DELETE", path: "/api/alerts/:alertId", description: "Delete alert" },
        { method: "GET", path: "/api/alerts/notifications", description: "Get notifications" },
        // Deposits
        { method: "GET", path: "/api/deposits", description: "Get deposits" },
        { method: "POST", path: "/api/deposits", description: "Create deposit" },
        { method: "POST", path: "/api/deposits/:depositId/proof", description: "Upload proof" },
        // Withdrawals
        { method: "GET", path: "/api/withdrawals", description: "Get withdrawals" },
        { method: "POST", path: "/api/withdrawals/request", description: "Request withdrawal" },
        { method: "POST", path: "/api/withdrawals/confirm", description: "Confirm withdrawal" },
        { method: "GET", path: "/api/withdrawals/limits", description: "Get withdrawal limits" },
        // News
        { method: "GET", path: "/api/news", description: "Get news articles" },
        { method: "GET", path: "/api/news/:id", description: "Get news by ID" },
        { method: "GET", path: "/api/news/search", description: "Search news" },
        { method: "GET", path: "/api/news/categories", description: "Get news categories" },
        // User Settings & Profile
        { method: "GET", path: "/api/user/settings", description: "Get user settings" },
        { method: "PATCH", path: "/api/auth/profile", description: "Update user profile" },
        { method: "POST", path: "/api/auth/change-password", description: "Change password" },
        // File Upload
        { method: "POST", path: "/api/upload", description: "Generic file upload" },
        { method: "POST", path: "/api/deposits/upload-proof", description: "Upload deposit proof" },
        // Admin
        { method: "GET", path: "/api/admin/users", description: "Get all users (admin)" },
        { method: "POST", path: "/api/admin/simulate-balance", description: "Simulate balance (admin)" },
        { method: "GET", path: "/api/admin/adjustments/:userId?", description: "Get balance adjustments (admin)" },
        { method: "GET", path: "/api/admin/logs", description: "Get admin action logs (admin)" },
        { method: "POST", path: "/api/admin/news", description: "Create news article (admin)" },
        { method: "DELETE", path: "/api/admin/news/:id", description: "Delete news article (admin)" },
        { method: "GET", path: "/api/admin/deposits", description: "Get all deposits (admin)" },
        { method: "POST", path: "/api/admin/deposits/:id/approve", description: "Approve deposit (admin)" },
        { method: "POST", path: "/api/admin/deposits/:id/reject", description: "Reject deposit (admin)" },
        { method: "GET", path: "/api/admin/deposits/stats", description: "Get deposit statistics (admin)" },
        { method: "GET", path: "/api/admin/deposits/pending", description: "Get pending deposits (admin)" },
        { method: "POST", path: "/api/admin/deposits/:id/review", description: "Review deposit (admin)" },
        // KYC
        { method: "GET", path: "/api/kyc/status", description: "Get KYC status" },
        { method: "POST", path: "/api/kyc/submit", description: "Submit KYC" },
        { method: "PATCH", path: "/api/kyc/update", description: "Update KYC information" },
        { method: "GET", path: "/api/kyc/admin/verifications", description: "Get all KYC verifications (admin)" },
        { method: "GET", path: "/api/kyc/admin/verifications/:id", description: "Get KYC verification details (admin)" },
        { method: "POST", path: "/api/kyc/admin/verifications/:id/review", description: "Review KYC verification (admin)" },
        { method: "POST", path: "/api/kyc/admin/verifications/bulk-review", description: "Bulk review KYC verifications (admin)" },
        { method: "GET", path: "/api/kyc/admin/statistics", description: "Get KYC statistics (admin)" },
        // Support
        { method: "GET", path: "/api/support/chat/messages", description: "Get chat messages" },
        { method: "POST", path: "/api/support/chat/send", description: "Send chat message" },
        // Market Research
        { method: "GET", path: "/api/research/reports", description: "Get research reports" },
        { method: "GET", path: "/api/research/reports/:id", description: "Get report by ID" },
        // Investment Plans
        { method: "GET", path: "/api/investment-plans", description: "Get investment plans" },
        { method: "POST", path: "/api/investment-plans/subscribe", description: "Subscribe to plan" },
        // Savings Plans
        { method: "GET", path: "/api/savings-plans", description: "Get savings plans" },
        { method: "POST", path: "/api/savings-plans/create", description: "Create savings plan" },
        // Staking
        { method: "GET", path: "/api/staking/pools", description: "Get staking pools" },
        { method: "POST", path: "/api/staking/stake", description: "Stake tokens" },
        // Lending
        { method: "GET", path: "/api/lending/offers", description: "Get lending offers" },
        { method: "POST", path: "/api/lending/lend", description: "Lend assets" },
        // WebSocket & Real-time
        { method: "WS", path: "/ws", description: "WebSocket connection for real-time prices" },
        { method: "WS", path: "/ws/chat", description: "WebSocket connection for live support chat" },
        // Health & Status
        { method: "GET", path: "/health", description: "Server health check" }
      ];
      res.json({
        success: true,
        count: endpoints.length,
        endpoints
      });
    });
    api_docs_routes_default = router16;
  }
});

// server/admin-routes.ts
var admin_routes_exports = {};
__export(admin_routes_exports, {
  default: () => admin_routes_default
});
import { Router as Router17 } from "express";
import { z as z10 } from "zod";
var router17, requireAdmin2, adjustBalanceSchema, admin_routes_default;
var init_admin_routes = __esm({
  "server/admin-routes.ts"() {
    "use strict";
    init_simple_auth();
    init_storage();
    router17 = Router17();
    requireAdmin2 = async (req, res, next) => {
      try {
        const user = await storage.getUser(req.user.id);
        if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }
        next();
      } catch (error) {
        console.error("Admin check error:", error);
        res.status(500).json({ message: "Authorization failed" });
      }
    };
    router17.get("/users", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || "";
        const users2 = await storage.getAllUsers();
        let filteredUsers = users2;
        if (search) {
          filteredUsers = users2.filter(
            (u) => u.firstName?.toLowerCase().includes(search.toLowerCase()) || u.lastName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()) || u.username?.toLowerCase().includes(search.toLowerCase())
          );
        }
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        const usersWithPortfolios = await Promise.all(
          paginatedUsers.map(async (user) => {
            const portfolio = await storage.getPortfolio(user.id);
            const transactions2 = await storage.getUserTransactions(user.id, 5);
            const deposits2 = await storage.getUserDeposits(user.id, 5);
            return {
              ...user,
              portfolio,
              recentTransactions: transactions2,
              recentDeposits: deposits2,
              totalTransactions: await storage.getUserTransactionCount(user.id)
            };
          })
        );
        res.json({
          users: usersWithPortfolios,
          pagination: {
            page,
            limit,
            total: filteredUsers.length,
            pages: Math.ceil(filteredUsers.length / limit)
          }
        });
      } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ message: "Failed to fetch users" });
      }
    });
    router17.post("/users/:userId/suspend", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const { userId } = req.params;
        const { reason } = req.body;
        await storage.updateUser(userId, { isActive: false });
        await storage.logAdminAction({
          adminId: req.user.id,
          action: "suspend_user",
          targetUserId: userId,
          details: { reason },
          timestamp: /* @__PURE__ */ new Date()
        });
        res.json({ message: "User suspended successfully" });
      } catch (error) {
        console.error("Suspend user error:", error);
        res.status(500).json({ message: "Failed to suspend user" });
      }
    });
    router17.post("/users/:userId/reactivate", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const { userId } = req.params;
        await storage.updateUser(userId, { isActive: true });
        await storage.logAdminAction({
          adminId: req.user.id,
          action: "reactivate_user",
          targetUserId: userId,
          timestamp: /* @__PURE__ */ new Date()
        });
        res.json({ message: "User reactivated successfully" });
      } catch (error) {
        console.error("Reactivate user error:", error);
        res.status(500).json({ message: "Failed to reactivate user" });
      }
    });
    router17.delete("/users/:userId", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const { userId } = req.params;
        await storage.deleteUser(userId);
        await storage.logAdminAction({
          adminId: req.user.id,
          action: "delete_user",
          targetUserId: userId,
          timestamp: /* @__PURE__ */ new Date()
        });
        res.json({ message: "User deleted successfully" });
      } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: "Failed to delete user" });
      }
    });
    adjustBalanceSchema = z10.object({
      targetUserId: z10.string(),
      adjustmentType: z10.enum(["add", "remove", "set"]),
      amount: z10.string(),
      currency: z10.string(),
      reason: z10.string().optional()
    });
    router17.post("/balance-adjustment", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const data = adjustBalanceSchema.parse(req.body);
        const adjustment = await storage.createBalanceAdjustment({
          adminId: req.user.id,
          ...data
        });
        let portfolio = await storage.getPortfolio(data.targetUserId);
        if (!portfolio) {
          portfolio = await storage.createPortfolio({
            userId: data.targetUserId,
            totalValue: "0",
            availableCash: "0"
          });
        }
        let newTotalValue;
        let newAvailableCash;
        const currentTotalValue = parseFloat(portfolio.totalValue);
        const currentAvailableCash = parseFloat(portfolio.availableCash);
        const adjustmentAmount = parseFloat(data.amount);
        switch (data.adjustmentType) {
          case "add":
            newTotalValue = currentTotalValue + adjustmentAmount;
            newAvailableCash = data.currency === "USD" ? currentAvailableCash + adjustmentAmount : currentAvailableCash;
            break;
          case "remove":
            newTotalValue = Math.max(0, currentTotalValue - adjustmentAmount);
            newAvailableCash = data.currency === "USD" ? Math.max(0, currentAvailableCash - adjustmentAmount) : currentAvailableCash;
            break;
          case "set":
            newTotalValue = adjustmentAmount;
            newAvailableCash = data.currency === "USD" ? adjustmentAmount : currentAvailableCash;
            break;
          default:
            throw new Error("Invalid adjustment type");
        }
        await storage.updatePortfolio(portfolio.id, {
          totalValue: newTotalValue.toString(),
          availableCash: newAvailableCash.toString()
        });
        res.json(adjustment);
      } catch (error) {
        console.error("Balance adjustment error:", error);
        res.status(500).json({ message: "Failed to adjust balance" });
      }
    });
    router17.get("/balance-adjustments", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const userId = req.query.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const adjustments = await storage.getBalanceAdjustments(userId, page, limit);
        res.json(adjustments);
      } catch (error) {
        console.error("Get adjustments error:", error);
        res.status(500).json({ message: "Failed to fetch adjustments" });
      }
    });
    router17.get("/transactions", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const userId = req.query.userId;
        const type = req.query.type;
        const transactions2 = await storage.getAllTransactions({ page, limit, userId, type });
        res.json(transactions2);
      } catch (error) {
        console.error("Get transactions error:", error);
        res.status(500).json({ message: "Failed to fetch transactions" });
      }
    });
    router17.post("/transactions/:transactionId/reverse", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const { transactionId } = req.params;
        const { reason } = req.body;
        const reversedTransaction = await storage.reverseTransaction(transactionId, req.user.id, reason);
        res.json(reversedTransaction);
      } catch (error) {
        console.error("Reverse transaction error:", error);
        res.status(500).json({ message: "Failed to reverse transaction" });
      }
    });
    router17.get("/analytics/overview", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const users2 = await storage.getAllUsers();
        const transactions2 = await storage.getAllTransactions({ page: 1, limit: 1e4 });
        const deposits2 = await storage.getAllDeposits();
        const adjustments = await storage.getBalanceAdjustments();
        const portfolios2 = await Promise.all(users2.map((u) => storage.getPortfolio(u.id)));
        const validPortfolios = portfolios2.filter((p) => p !== null);
        const totalPlatformValue = validPortfolios.reduce((sum2, p) => sum2 + parseFloat(p?.totalValue || "0"), 0);
        const totalVolume = transactions2.transactions.reduce((sum2, tx) => sum2 + parseFloat(tx.total || "0"), 0);
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        const adjustmentsToday = adjustments.filter((adj) => {
          const adjDate = new Date(adj.createdAt);
          adjDate.setHours(0, 0, 0, 0);
          return adjDate.getTime() === today.getTime();
        });
        const overview = {
          totalUsers: users2.length,
          activeUsers: users2.filter((u) => u.isActive).length,
          totalTransactions: transactions2.total,
          totalVolume,
          totalDeposits: deposits2.length,
          activePortfolios: validPortfolios.length,
          totalPlatformValue: totalPlatformValue.toFixed(2),
          adjustmentsToday: adjustmentsToday.length,
          totalAdjustments: adjustments.length
        };
        res.json(overview);
      } catch (error) {
        console.error("Analytics overview error:", error);
        res.status(500).json({ message: "Failed to fetch analytics" });
      }
    });
    router17.get("/system-health", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();
        const health = {
          server: {
            uptime: `${Math.floor(uptime / 86400)}d ${Math.floor(uptime % 86400 / 3600)}h ${Math.floor(uptime % 3600 / 60)}m`,
            status: "healthy",
            responseTime: Math.floor(Math.random() * 100) + 150,
            load: (memoryUsage.heapUsed / memoryUsage.heapTotal).toFixed(2)
          },
          database: {
            status: "connected",
            connectionCount: 12,
            queryTime: Math.floor(Math.random() * 20) + 10,
            storageUsed: 2.4,
            storageTotal: 10
          },
          websocket: {
            status: "connected",
            activeConnections: 47,
            messagesSent: 1247,
            messagesReceived: 1156
          },
          api: {
            totalRequests: 15420,
            successRate: 99.2,
            errorRate: 0.8,
            avgResponseTime: 180
          },
          resources: {
            cpuUsage: Math.floor(Math.random() * 50) + 20,
            memoryUsage: Math.floor(memoryUsage.heapUsed / memoryUsage.heapTotal * 100),
            diskUsage: 24
          }
        };
        res.json(health);
      } catch (error) {
        console.error("System health error:", error);
        res.status(500).json({ message: "Failed to fetch system health" });
      }
    });
    router17.get("/user-sessions", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const timeframe = req.query.timeframe || "24h";
        const users2 = await storage.getAllUsers();
        const sessions2 = users2.filter((u) => u.lastLogin).map((user) => ({
          id: `session-${user.id}`,
          userId: user.id,
          username: user.username,
          email: user.email,
          loginTime: user.lastLogin,
          lastActivity: user.lastLogin,
          isActive: user.isActive
        }));
        res.json({ sessions: sessions2 });
      } catch (error) {
        console.error("User sessions error:", error);
        res.status(500).json({ message: "Failed to fetch user sessions" });
      }
    });
    router17.get("/user-activities", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const timeframe = req.query.timeframe || "24h";
        const type = req.query.type || "all";
        const transactions2 = await storage.getAllTransactions({ page: 1, limit: 50 });
        const activities = transactions2.transactions.map((tx) => ({
          id: `activity-${tx.id}`,
          userId: tx.userId,
          username: tx.username || "Unknown",
          action: tx.type === "buy" ? "Trade Executed (Buy)" : tx.type === "sell" ? "Trade Executed (Sell)" : tx.type,
          details: `${tx.type} ${tx.amount} ${tx.symbol} at ${tx.price}`,
          timestamp: tx.createdAt,
          riskScore: 0
        }));
        res.json({ activities });
      } catch (error) {
        console.error("User activities error:", error);
        res.status(500).json({ message: "Failed to fetch user activities" });
      }
    });
    router17.get("/risk/alerts", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const severity = req.query.severity;
        const status = req.query.status;
        const transactions2 = await storage.getAllTransactions({ page: 1, limit: 100 });
        const alerts = transactions2.transactions.filter((tx) => parseFloat(tx.total) > 1e4 || tx.status === "failed").slice(0, 15).map((tx) => ({
          id: `alert-${tx.id}`,
          userId: tx.userId,
          username: tx.username || "Unknown",
          email: tx.email || "Unknown",
          riskType: parseFloat(tx.total) > 1e4 ? "high_volume" : "failed_transaction",
          severity: parseFloat(tx.total) > 5e4 ? "critical" : parseFloat(tx.total) > 2e4 ? "high" : "medium",
          description: `${tx.type} transaction for ${tx.symbol}`,
          amount: tx.total,
          currency: "USD",
          timestamp: tx.createdAt,
          status: "active",
          riskScore: Math.min(100, Math.floor(parseFloat(tx.total) / 1e3))
        }));
        res.json({ alerts });
      } catch (error) {
        console.error("Risk alerts error:", error);
        res.status(500).json({ message: "Failed to fetch risk alerts" });
      }
    });
    router17.get("/risk/rules", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const rules = [
          {
            id: "rule-1",
            name: "High Volume Trading Alert",
            description: "Alert on trades exceeding $10,000",
            riskType: "high_volume",
            threshold: 1e4,
            timeframe: "24h",
            action: "alert",
            isActive: true,
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          },
          {
            id: "rule-2",
            name: "Rapid Transaction Pattern",
            description: "Alert on more than 10 transactions in 1 hour",
            riskType: "suspicious_pattern",
            threshold: 10,
            timeframe: "1h",
            action: "review",
            isActive: true,
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          }
        ];
        res.json({ rules });
      } catch (error) {
        console.error("Risk rules error:", error);
        res.status(500).json({ message: "Failed to fetch risk rules" });
      }
    });
    router17.get("/risk/statistics", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const stats = {
          totalAlerts: 124,
          activeAlerts: 18,
          criticalAlerts: 3,
          resolvedToday: 12,
          avgResolutionTime: "2.5h",
          falsePositiveRate: 15
        };
        res.json(stats);
      } catch (error) {
        console.error("Risk statistics error:", error);
        res.status(500).json({ message: "Failed to fetch risk statistics" });
      }
    });
    router17.get("/compliance/reports", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const reports = [
          {
            id: "report-1",
            type: "aml",
            title: "Monthly AML Report",
            description: "Anti-Money Laundering compliance report",
            status: "pending_review",
            priority: "high",
            dueDate: new Date(Date.now() + 7 * 864e5).toISOString(),
            createdBy: "Admin",
            completionPercentage: 75,
            lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
            requirements: ["Transaction monitoring", "Customer screening"],
            documents: ["aml-report.pdf"]
          }
        ];
        res.json({ reports });
      } catch (error) {
        console.error("Compliance reports error:", error);
        res.status(500).json({ message: "Failed to fetch compliance reports" });
      }
    });
    router17.get("/compliance/metrics", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const metrics = [
          {
            id: "metric-1",
            category: "AML",
            metric: "Transaction Monitoring Coverage",
            value: 98,
            target: 100,
            status: "compliant",
            lastChecked: (/* @__PURE__ */ new Date()).toISOString(),
            description: "Percentage of transactions monitored"
          }
        ];
        res.json({ metrics });
      } catch (error) {
        console.error("Compliance metrics error:", error);
        res.status(500).json({ message: "Failed to fetch compliance metrics" });
      }
    });
    router17.get("/compliance/regulatory-updates", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const updates = [
          {
            id: "update-1",
            title: "New KYC Requirements",
            summary: "Enhanced identity verification procedures",
            effectiveDate: new Date(Date.now() + 30 * 864e5).toISOString(),
            jurisdiction: "EU",
            impact: "high",
            status: "active",
            actionRequired: true
          }
        ];
        res.json({ updates });
      } catch (error) {
        console.error("Regulatory updates error:", error);
        res.status(500).json({ message: "Failed to fetch regulatory updates" });
      }
    });
    router17.get("/compliance/statistics", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const stats = {
          totalReports: 45,
          pendingReports: 8,
          overdueReports: 2,
          complianceScore: 94,
          lastAuditDate: new Date(Date.now() - 30 * 864e5).toISOString(),
          nextAuditDate: new Date(Date.now() + 60 * 864e5).toISOString()
        };
        res.json(stats);
      } catch (error) {
        console.error("Compliance statistics error:", error);
        res.status(500).json({ message: "Failed to fetch compliance statistics" });
      }
    });
    router17.get("/server/metrics", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();
        const metrics = {
          server: {
            uptime: uptime.toString(),
            status: "healthy",
            responseTime: Math.floor(Math.random() * 100) + 150,
            load: parseFloat((memoryUsage.heapUsed / memoryUsage.heapTotal).toFixed(2)),
            processes: 8,
            connections: 47
          },
          database: {
            status: "connected",
            connectionCount: 12,
            queryTime: Math.floor(Math.random() * 20) + 10,
            storageUsed: 24e8,
            storageTotal: 1e10,
            transactionsPerSecond: Math.floor(Math.random() * 50) + 20
          },
          api: {
            totalRequests: 15420,
            successRate: 99.2,
            errorRate: 0.8,
            avgResponseTime: 180,
            rateLimit: 1e3,
            rateLimitUsed: 234
          },
          resources: {
            cpuUsage: Math.floor(Math.random() * 50) + 20,
            memoryUsage: Math.floor(memoryUsage.heapUsed / memoryUsage.heapTotal * 100),
            diskUsage: 24,
            networkIn: Math.floor(Math.random() * 1e6),
            networkOut: Math.floor(Math.random() * 2e6)
          },
          security: {
            activeThreats: 0,
            blockedIPs: 5,
            failedLogins: 3,
            sslStatus: "valid",
            sslExpiry: new Date(Date.now() + 90 * 864e5).toISOString()
          },
          performance: {
            requestsPerMinute: Math.floor(Math.random() * 100) + 50,
            errorCount: 2,
            slowQueries: 1,
            cacheHitRate: 95
          }
        };
        res.json(metrics);
      } catch (error) {
        console.error("Server metrics error:", error);
        res.status(500).json({ message: "Failed to fetch server metrics" });
      }
    });
    router17.get("/server/services", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const services = [
          {
            name: "API Server",
            status: "running",
            uptime: "2d 14h 32m",
            version: "1.0.0",
            lastChecked: (/* @__PURE__ */ new Date()).toISOString(),
            dependencies: ["Database", "Redis"]
          },
          {
            name: "WebSocket Server",
            status: "running",
            uptime: "2d 14h 30m",
            version: "1.0.0",
            lastChecked: (/* @__PURE__ */ new Date()).toISOString(),
            dependencies: ["API Server"]
          },
          {
            name: "Price Monitor",
            status: "running",
            uptime: "2d 14h 28m",
            version: "1.0.0",
            lastChecked: (/* @__PURE__ */ new Date()).toISOString(),
            dependencies: ["CoinGecko API"]
          }
        ];
        res.json({ services });
      } catch (error) {
        console.error("Server services error:", error);
        res.status(500).json({ message: "Failed to fetch server services" });
      }
    });
    router17.post("/maintenance", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const { enabled, message } = req.body;
        res.json({ success: true, maintenanceMode: enabled });
      } catch (error) {
        console.error("Maintenance mode error:", error);
        res.status(500).json({ message: "Failed to update maintenance mode" });
      }
    });
    router17.post("/broadcast", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const { message, type } = req.body;
        res.json({ success: true, message: "Message broadcasted" });
      } catch (error) {
        console.error("Broadcast error:", error);
        res.status(500).json({ message: "Failed to broadcast message" });
      }
    });
    router17.post("/clear-cache", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const { type } = req.body;
        res.json({ success: true, cacheType: type });
      } catch (error) {
        console.error("Clear cache error:", error);
        res.status(500).json({ message: "Failed to clear cache" });
      }
    });
    router17.post("/force-logout", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const { userId, all } = req.body;
        res.json({ success: true });
      } catch (error) {
        console.error("Force logout error:", error);
        res.status(500).json({ message: "Failed to force logout" });
      }
    });
    router17.get("/analytics/revenue", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const period = req.query.period || "7d";
        const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
        const transactions2 = await storage.getAllTransactions({ page: 1, limit: 1e4 });
        const totalVolume = transactions2.transactions.reduce((sum2, tx) => sum2 + parseFloat(tx.total || "0"), 0);
        const tradingFees = totalVolume * 1e-3;
        const depositFees = totalVolume * 5e-4;
        const withdrawalFees = totalVolume * 25e-4;
        const revenueData = {
          totalRevenue: tradingFees + depositFees + withdrawalFees,
          previousPeriodRevenue: (tradingFees + depositFees + withdrawalFees) * 0.85,
          growthRate: 15.2,
          breakdown: {
            tradingFees,
            depositFees,
            withdrawalFees
          },
          dailyRevenue: Array.from({ length: days }, (_, i) => ({
            date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
            revenue: (tradingFees + depositFees + withdrawalFees) / days * (0.8 + Math.random() * 0.4)
          }))
        };
        res.json(revenueData);
      } catch (error) {
        console.error("Revenue analytics error:", error);
        res.status(500).json({ message: "Failed to fetch revenue analytics" });
      }
    });
    router17.get("/analytics/users", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const period = req.query.period || "30d";
        const users2 = await storage.getAllUsers();
        const now = /* @__PURE__ */ new Date();
        const periodStart = /* @__PURE__ */ new Date();
        switch (period) {
          case "7d":
            periodStart.setDate(now.getDate() - 7);
            break;
          case "30d":
            periodStart.setDate(now.getDate() - 30);
            break;
          case "90d":
            periodStart.setDate(now.getDate() - 90);
            break;
          default:
            periodStart.setDate(now.getDate() - 30);
        }
        const newUsers = users2.filter((u) => new Date(u.createdAt) > periodStart);
        const activeUsers = users2.filter((u) => u.isActive);
        const userAnalytics = {
          totalUsers: users2.length,
          newUsers: newUsers.length,
          activeUsers: activeUsers.length,
          growthRate: users2.length > 0 ? newUsers.length / users2.length * 100 : 0,
          usersByRole: {
            admin: users2.filter((u) => u.role === "admin").length,
            user: users2.filter((u) => u.role === "user").length
          },
          registrationTrend: Array.from({ length: 7 }, (_, i) => {
            const date = /* @__PURE__ */ new Date();
            date.setDate(date.getDate() - (6 - i));
            const dayUsers = users2.filter((u) => {
              const userDate = new Date(u.createdAt);
              return userDate.toDateString() === date.toDateString();
            });
            return {
              date: date.toISOString().split("T")[0],
              count: dayUsers.length
            };
          })
        };
        res.json(userAnalytics);
      } catch (error) {
        console.error("User analytics error:", error);
        res.status(500).json({ message: "Failed to fetch user analytics" });
      }
    });
    router17.get("/analytics/trading", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const tradingAnalytics = {
          totalTrades: 1247,
          totalVolume: 215000075e-2,
          avgTradeSize: 1725.5,
          topTradingPairs: [
            { symbol: "BTC/USD", volume: 85e4, trades: 425 },
            { symbol: "ETH/USD", volume: 62e4, trades: 312 },
            { symbol: "ADA/USD", volume: 38e4, trades: 280 },
            { symbol: "SOL/USD", volume: 3e5, trades: 230 }
          ],
          tradesByType: {
            buy: 623,
            sell: 624
          },
          hourlyVolume: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            volume: Math.random() * 1e5 + 5e4
          }))
        };
        res.json(tradingAnalytics);
      } catch (error) {
        console.error("Trading analytics error:", error);
        res.status(500).json({ message: "Failed to fetch trading analytics" });
      }
    });
    router17.get("/analytics/platform", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const platformMetrics = {
          systemHealth: {
            uptime: "99.8%",
            responseTime: "245ms",
            errorRate: "0.12%",
            activeConnections: 1247
          },
          databasePerformance: {
            queryTime: "12ms",
            connectionPool: "85%",
            indexEfficiency: "94%"
          },
          apiUsage: {
            totalRequests: 125047,
            successRate: "99.88%",
            rateLimitHits: 12,
            topEndpoints: [
              { endpoint: "/api/crypto/market-data", requests: 45e3 },
              { endpoint: "/api/user/auth/user", requests: 25e3 },
              { endpoint: "/api/portfolio", requests: 18e3 }
            ]
          }
        };
        res.json(platformMetrics);
      } catch (error) {
        console.error("Platform analytics error:", error);
        res.status(500).json({ message: "Failed to fetch platform analytics" });
      }
    });
    router17.get("/security/sessions", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const sessions2 = await storage.getActiveSessions();
        res.json(sessions2);
      } catch (error) {
        console.error("Get sessions error:", error);
        res.status(500).json({ message: "Failed to fetch sessions" });
      }
    });
    router17.post("/security/force-logout/:userId", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const { userId } = req.params;
        await storage.invalidateUserSessions(userId);
        await storage.logAdminAction({
          adminId: req.user.id,
          action: "force_logout",
          targetUserId: userId,
          timestamp: /* @__PURE__ */ new Date()
        });
        res.json({ message: "User sessions terminated" });
      } catch (error) {
        console.error("Force logout error:", error);
        res.status(500).json({ message: "Failed to terminate sessions" });
      }
    });
    router17.get("/system/config", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const config2 = await storage.getSystemConfig();
        res.json(config2);
      } catch (error) {
        console.error("Get system config error:", error);
        res.status(500).json({ message: "Failed to fetch system config" });
      }
    });
    router17.put("/system/config", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const config2 = await storage.updateSystemConfig(req.body);
        await storage.logAdminAction({
          adminId: req.user.id,
          action: "update_system_config",
          details: req.body,
          timestamp: /* @__PURE__ */ new Date()
        });
        res.json(config2);
      } catch (error) {
        console.error("Update system config error:", error);
        res.status(500).json({ message: "Failed to update system config" });
      }
    });
    router17.get("/system-health", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const health = {
          server: {
            uptime: process.uptime(),
            status: "healthy",
            responseTime: Math.floor(Math.random() * 300) + 100,
            load: Math.random() * 1
          },
          database: {
            status: "connected",
            connectionCount: Math.floor(Math.random() * 20) + 5,
            queryTime: Math.floor(Math.random() * 50) + 10,
            storageUsed: 2.4,
            storageTotal: 10
          },
          websocket: {
            status: "connected",
            activeConnections: Math.floor(Math.random() * 100) + 20,
            messagesSent: Math.floor(Math.random() * 1e4) + 1e3,
            messagesReceived: Math.floor(Math.random() * 1e4) + 1e3
          },
          api: {
            totalRequests: Math.floor(Math.random() * 5e4) + 1e4,
            successRate: 99.2 + Math.random() * 0.8,
            errorRate: Math.random() * 1,
            avgResponseTime: Math.floor(Math.random() * 200) + 100
          },
          resources: {
            cpuUsage: Math.floor(Math.random() * 80) + 10,
            memoryUsage: Math.floor(Math.random() * 90) + 10,
            diskUsage: Math.floor(Math.random() * 60) + 10
          }
        };
        res.json(health);
      } catch (error) {
        console.error("System health error:", error);
        res.status(500).json({ message: "Failed to fetch system health" });
      }
    });
    router17.get("/user-sessions", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const timeframe = req.query.timeframe || "24h";
        const sessions2 = Array.from({ length: Math.floor(Math.random() * 50) + 10 }, (_, i) => ({
          id: `session_${i}`,
          userId: `user_${i}`,
          username: `user${i}`,
          email: `user${i}@example.com`,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: "Mozilla/5.0...",
          deviceType: ["desktop", "mobile", "tablet"][Math.floor(Math.random() * 3)],
          browser: ["Chrome", "Firefox", "Safari"][Math.floor(Math.random() * 3)],
          os: ["Windows", "macOS", "Linux", "iOS", "Android"][Math.floor(Math.random() * 5)],
          location: {
            country: ["US", "UK", "DE", "FR", "CA"][Math.floor(Math.random() * 5)],
            city: ["New York", "London", "Berlin", "Paris", "Toronto"][Math.floor(Math.random() * 5)],
            region: "Region"
          },
          loginTime: new Date(Date.now() - Math.random() * 864e5).toISOString(),
          lastActivity: new Date(Date.now() - Math.random() * 36e5).toISOString(),
          isActive: Math.random() > 0.3,
          duration: Math.floor(Math.random() * 480) + 15,
          pagesVisited: Math.floor(Math.random() * 20) + 1
        }));
        res.json({ sessions: sessions2 });
      } catch (error) {
        console.error("User sessions error:", error);
        res.status(500).json({ message: "Failed to fetch user sessions" });
      }
    });
    router17.get("/user-activities", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const timeframe = req.query.timeframe || "24h";
        const type = req.query.type || "all";
        const activities = Array.from({ length: Math.floor(Math.random() * 100) + 20 }, (_, i) => ({
          id: `activity_${i}`,
          userId: `user_${i}`,
          username: `user${i}`,
          action: ["login", "logout", "trade_executed", "deposit_made", "withdrawal_requested", "password_changed"][Math.floor(Math.random() * 6)],
          details: "Action details here",
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          timestamp: new Date(Date.now() - Math.random() * 864e5).toISOString(),
          riskScore: Math.floor(Math.random() * 100)
        }));
        const filteredActivities = type === "all" ? activities : activities.filter((a) => a.action.includes(type));
        res.json({ activities: filteredActivities });
      } catch (error) {
        console.error("User activities error:", error);
        res.status(500).json({ message: "Failed to fetch user activities" });
      }
    });
    router17.post("/maintenance", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const { enabled, message } = req.body;
        await storage.updateSystemConfig({
          maintenanceMode: enabled,
          maintenanceMessage: message
        });
        await storage.logAdminAction({
          adminId: req.user.id,
          action: "maintenance_mode_toggle",
          details: { enabled, message },
          timestamp: /* @__PURE__ */ new Date()
        });
        res.json({ message: "Maintenance mode updated successfully" });
      } catch (error) {
        console.error("Maintenance mode error:", error);
        res.status(500).json({ message: "Failed to update maintenance mode" });
      }
    });
    router17.post("/broadcast", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const { message, type } = req.body;
        console.log(`Broadcasting ${type} message: ${message}`);
        await storage.logAdminAction({
          adminId: req.user.id,
          action: "broadcast_message",
          details: { message, type },
          timestamp: /* @__PURE__ */ new Date()
        });
        res.json({ message: "Message broadcasted successfully" });
      } catch (error) {
        console.error("Broadcast error:", error);
        res.status(500).json({ message: "Failed to broadcast message" });
      }
    });
    router17.post("/clear-cache", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const { type } = req.body;
        console.log(`Clearing cache: ${type}`);
        await storage.logAdminAction({
          adminId: req.user.id,
          action: "clear_cache",
          details: { type },
          timestamp: /* @__PURE__ */ new Date()
        });
        res.json({ message: "Cache cleared successfully" });
      } catch (error) {
        console.error("Clear cache error:", error);
        res.status(500).json({ message: "Failed to clear cache" });
      }
    });
    router17.post("/force-logout", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const { userId, all } = req.body;
        if (all) {
          await storage.invalidateAllSessions();
        } else if (userId) {
          await storage.invalidateUserSessions(userId);
        }
        await storage.logAdminAction({
          adminId: req.user.id,
          action: "force_logout",
          details: { userId, all },
          timestamp: /* @__PURE__ */ new Date()
        });
        res.json({ message: "Users logged out successfully" });
      } catch (error) {
        console.error("Force logout error:", error);
        res.status(500).json({ message: "Failed to force logout" });
      }
    });
    router17.get("/transactions/stats", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const range = req.query.range || "7d";
        const transactions2 = await storage.getAllTransactions({ page: 1, limit: 1e4 });
        const now = /* @__PURE__ */ new Date();
        const rangeStart = /* @__PURE__ */ new Date();
        switch (range) {
          case "1d":
            rangeStart.setDate(now.getDate() - 1);
            break;
          case "7d":
            rangeStart.setDate(now.getDate() - 7);
            break;
          case "30d":
            rangeStart.setDate(now.getDate() - 30);
            break;
          case "90d":
            rangeStart.setDate(now.getDate() - 90);
            break;
        }
        const filteredTransactions = transactions2.transactions.filter(
          (tx) => new Date(tx.createdAt) >= rangeStart
        );
        const totalVolume = filteredTransactions.reduce((sum2, tx) => sum2 + parseFloat(tx.total || "0"), 0);
        const pendingTransactions = filteredTransactions.filter((tx) => tx.status === "pending").length;
        const failedTransactions = filteredTransactions.filter((tx) => tx.status === "failed").length;
        const suspiciousTransactions = filteredTransactions.filter(
          (tx) => parseFloat(tx.total || "0") > 1e4 || tx.createdAt > new Date(Date.now() - 6e4).toISOString()
        ).length;
        const pairVolumes = /* @__PURE__ */ new Map();
        filteredTransactions.forEach((tx) => {
          if (tx.symbol) {
            const existing = pairVolumes.get(tx.symbol) || { volume: 0, count: 0 };
            pairVolumes.set(tx.symbol, {
              volume: existing.volume + parseFloat(tx.total || "0"),
              count: existing.count + 1
            });
          }
        });
        const topTradingPairs = Array.from(pairVolumes.entries()).map(([symbol, data]) => ({ symbol, ...data })).sort((a, b) => b.volume - a.volume).slice(0, 10);
        const stats = {
          totalVolume,
          totalTransactions: filteredTransactions.length,
          pendingTransactions,
          failedTransactions,
          suspiciousTransactions,
          dailyVolume: totalVolume / (range === "1d" ? 1 : parseInt(range)),
          topTradingPairs
        };
        res.json(stats);
      } catch (error) {
        console.error("Get transaction stats error:", error);
        res.status(500).json({ message: "Failed to fetch transaction statistics" });
      }
    });
    router17.post("/transactions/:transactionId/flag", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const { transactionId } = req.params;
        const { flagged, notes } = req.body;
        await storage.updateTransaction(transactionId, {
          flagged,
          notes: notes || `Transaction ${flagged ? "flagged" : "unflagged"} by admin`,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        await storage.logAdminAction({
          adminId: req.user.id,
          action: "flag_transaction",
          targetId: transactionId,
          details: { flagged, notes },
          timestamp: /* @__PURE__ */ new Date()
        });
        res.json({ message: "Transaction flag status updated" });
      } catch (error) {
        console.error("Flag transaction error:", error);
        res.status(500).json({ message: "Failed to flag transaction" });
      }
    });
    router17.post("/transactions/:transactionId/suspend", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const { transactionId } = req.params;
        const { reason } = req.body;
        await storage.updateTransaction(transactionId, {
          status: "suspended",
          notes: reason,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        await storage.logAdminAction({
          adminId: req.user.id,
          action: "suspend_transaction",
          targetId: transactionId,
          details: { reason },
          timestamp: /* @__PURE__ */ new Date()
        });
        res.json({ message: "Transaction suspended successfully" });
      } catch (error) {
        console.error("Suspend transaction error:", error);
        res.status(500).json({ message: "Failed to suspend transaction" });
      }
    });
    router17.get("/audit-logs", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const action = req.query.action;
        const logs = await storage.getAuditLogs({ page, limit, action });
        res.json(logs);
      } catch (error) {
        console.error("Get audit logs error:", error);
        res.status(500).json({ message: "Failed to fetch audit logs" });
      }
    });
    router17.get("/transactions/stats", requireAuth, requireAdmin2, async (req, res) => {
      try {
        const range = req.query.range || "7d";
        const transactions2 = await storage.getAllTransactions({ page: 1, limit: 1e4 });
        const totalVolume = transactions2.transactions.reduce((sum2, tx) => sum2 + parseFloat(tx.total || "0"), 0);
        const pendingTransactions = transactions2.transactions.filter((tx) => tx.status === "pending").length;
        const failedTransactions = transactions2.transactions.filter((tx) => tx.status === "failed").length;
        const suspiciousTransactions = transactions2.transactions.filter((tx) => parseFloat(tx.total || "0") > 1e4).length;
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        const dailyVolume = transactions2.transactions.filter((tx) => {
          const txDate = new Date(tx.createdAt);
          txDate.setHours(0, 0, 0, 0);
          return txDate.getTime() === today.getTime();
        }).reduce((sum2, tx) => sum2 + parseFloat(tx.total || "0"), 0);
        const stats = {
          totalVolume,
          totalTransactions: transactions2.total,
          pendingTransactions,
          failedTransactions,
          suspiciousTransactions,
          dailyVolume,
          topTradingPairs: [
            { symbol: "BTC", volume: totalVolume * 0.4, count: Math.floor(transactions2.total * 0.3) },
            { symbol: "ETH", volume: totalVolume * 0.3, count: Math.floor(transactions2.total * 0.25) },
            { symbol: "USDT", volume: totalVolume * 0.2, count: Math.floor(transactions2.total * 0.25) }
          ]
        };
        res.json(stats);
      } catch (error) {
        console.error("Transaction stats error:", error);
        res.status(500).json({ message: "Failed to fetch transaction statistics" });
      }
    });
    admin_routes_default = router17;
  }
});

// server/admin-auth-routes.ts
var admin_auth_routes_exports = {};
__export(admin_auth_routes_exports, {
  default: () => admin_auth_routes_default
});
import { Router as Router18 } from "express";
import { z as z11 } from "zod";
var router18, adminLoginSchema, admin_auth_routes_default;
var init_admin_auth_routes = __esm({
  "server/admin-auth-routes.ts"() {
    "use strict";
    init_storage();
    init_simple_auth();
    router18 = Router18();
    adminLoginSchema = z11.object({
      emailOrUsername: z11.string().min(1, "Email or username is required"),
      password: z11.string().min(1, "Password is required")
    });
    router18.post("/auth/login", async (req, res) => {
      try {
        const { emailOrUsername, password } = adminLoginSchema.parse(req.body);
        const user = await storage.getUserByEmailOrUsername(emailOrUsername);
        if (!user) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        if (user.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }
        const isValidPassword = await storage.verifyPassword(user.id, password);
        if (!isValidPassword) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        if (!user.isActive) {
          return res.status(403).json({ message: "Account is disabled" });
        }
        req.session.userId = user.id;
        req.session.userRole = user.role;
        res.json({
          admin: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }
        });
      } catch (error) {
        console.error("Admin login error:", error);
        if (error instanceof z11.ZodError) {
          return res.status(400).json({ message: error.errors[0].message });
        }
        res.status(500).json({ message: "Login failed" });
      }
    });
    router18.get("/auth/user", requireAuth, async (req, res) => {
      try {
        const user = await storage.getUser(req.user.id);
        if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }
        res.json({
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        });
      } catch (error) {
        console.error("Get admin user error:", error);
        res.status(500).json({ message: "Failed to get user" });
      }
    });
    router18.post("/auth/logout", requireAuth, async (req, res) => {
      try {
        req.session.destroy((err) => {
          if (err) {
            console.error("Session destroy error:", err);
            return res.status(500).json({ message: "Logout failed" });
          }
          res.clearCookie("connect.sid");
          res.json({ message: "Logged out successfully" });
        });
      } catch (error) {
        console.error("Admin logout error:", error);
        res.status(500).json({ message: "Logout failed" });
      }
    });
    admin_auth_routes_default = router18;
  }
});

// server/chat-routes.ts
var chat_routes_exports = {};
__export(chat_routes_exports, {
  default: () => chat_routes_default
});
import { Router as Router19 } from "express";
import { z as z12 } from "zod";
var router19, startChatSchema, sendMessageSchema, endChatSchema, chat_routes_default;
var init_chat_routes = __esm({
  "server/chat-routes.ts"() {
    "use strict";
    init_simple_auth();
    init_storage();
    router19 = Router19();
    startChatSchema = z12.object({
      subject: z12.string().min(1).max(200)
    });
    sendMessageSchema = z12.object({
      sessionId: z12.string(),
      message: z12.string().min(1).max(1e3),
      messageType: z12.enum(["text", "file", "image"]).default("text"),
      attachmentUrl: z12.string().optional(),
      attachmentName: z12.string().optional(),
      attachmentSize: z12.number().optional()
    });
    endChatSchema = z12.object({
      sessionId: z12.string()
    });
    router19.get("/active", requireAuth, async (req, res) => {
      try {
        const userId = req.user.id;
        const session2 = await storage.getActiveChatSession(userId);
        if (!session2) {
          return res.status(404).json({ message: "No active chat session" });
        }
        res.json(session2);
      } catch (error) {
        console.error("Error fetching active chat session:", error);
        res.status(500).json({ message: "Failed to fetch chat session" });
      }
    });
    router19.post("/start", requireAuth, async (req, res) => {
      try {
        const userId = req.user.id;
        const { subject } = startChatSchema.parse(req.body);
        const existingSession = await storage.getActiveChatSession(userId);
        if (existingSession) {
          return res.status(400).json({
            message: "You already have an active chat session",
            session: existingSession
          });
        }
        const session2 = await storage.createChatSession({
          userId,
          subject,
          status: "waiting"
        });
        await storage.notifyAdminsNewChatSession(session2);
        res.json(session2);
      } catch (error) {
        console.error("Error starting chat session:", error);
        if (error instanceof z12.ZodError) {
          return res.status(400).json({ message: "Invalid input data", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to start chat session" });
      }
    });
    router19.get("/messages/:sessionId", requireAuth, async (req, res) => {
      try {
        const userId = req.user.id;
        const { sessionId } = req.params;
        const session2 = await storage.getChatSession(sessionId);
        if (!session2 || session2.userId !== userId && req.user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }
        const messages = await storage.getChatMessages(sessionId);
        res.json(messages);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
        res.status(500).json({ message: "Failed to fetch messages" });
      }
    });
    router19.post("/message", requireAuth, async (req, res) => {
      try {
        const userId = req.user.id;
        const user = req.user;
        const messageData = sendMessageSchema.parse(req.body);
        const session2 = await storage.getChatSession(messageData.sessionId);
        if (!session2 || session2.userId !== userId && user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }
        const message = await storage.createChatMessage({
          sessionId: messageData.sessionId,
          senderId: userId,
          senderName: `${user.firstName} ${user.lastName}`,
          senderRole: user.role,
          message: messageData.message,
          messageType: messageData.messageType,
          attachmentUrl: messageData.attachmentUrl,
          attachmentName: messageData.attachmentName,
          attachmentSize: messageData.attachmentSize
        });
        if (session2.status === "waiting" && user.role === "admin") {
          await storage.updateChatSessionStatus(messageData.sessionId, "active", userId);
        }
        res.json(message);
      } catch (error) {
        console.error("Error sending message:", error);
        if (error instanceof z12.ZodError) {
          return res.status(400).json({ message: "Invalid input data", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to send message" });
      }
    });
    router19.post("/end", requireAuth, async (req, res) => {
      try {
        const userId = req.user.id;
        const user = req.user;
        const { sessionId } = endChatSchema.parse(req.body);
        const session2 = await storage.getChatSession(sessionId);
        if (!session2 || session2.userId !== userId && user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }
        await storage.endChatSession(sessionId);
        res.json({ message: "Chat session ended" });
      } catch (error) {
        console.error("Error ending chat session:", error);
        if (error instanceof z12.ZodError) {
          return res.status(400).json({ message: "Invalid input data", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to end chat session" });
      }
    });
    router19.post("/rate", requireAuth, async (req, res) => {
      try {
        const userId = req.user.id;
        const { sessionId, rating, feedback } = req.body;
        const session2 = await storage.getChatSession(sessionId);
        if (!session2 || session2.userId !== userId) {
          return res.status(403).json({ message: "Access denied" });
        }
        if (session2.status !== "ended") {
          return res.status(400).json({ message: "Can only rate ended sessions" });
        }
        await storage.rateChatSession(sessionId, rating, feedback);
        res.json({ message: "Rating submitted successfully" });
      } catch (error) {
        console.error("Error rating chat session:", error);
        res.status(500).json({ message: "Failed to submit rating" });
      }
    });
    router19.get("/admin/sessions", requireAuth, async (req, res) => {
      try {
        const user = req.user;
        if (user.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }
        const { status, page = 1, limit = 20 } = req.query;
        const sessions2 = await storage.getChatSessions({
          status,
          page: Number(page),
          limit: Number(limit)
        });
        res.json(sessions2);
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
        res.status(500).json({ message: "Failed to fetch chat sessions" });
      }
    });
    router19.post("/admin/assign", requireAuth, async (req, res) => {
      try {
        const user = req.user;
        if (user.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }
        const { sessionId } = req.body;
        await storage.assignChatSession(sessionId, user.id, `${user.firstName} ${user.lastName}`);
        res.json({ message: "Session assigned successfully" });
      } catch (error) {
        console.error("Error assigning chat session:", error);
        res.status(500).json({ message: "Failed to assign session" });
      }
    });
    chat_routes_default = router19;
  }
});

// server/kyc-routes.ts
var kyc_routes_exports = {};
__export(kyc_routes_exports, {
  default: () => kyc_routes_default
});
import { Router as Router20 } from "express";
import { z as z13 } from "zod";
var router20, requireAdmin3, kycSubmissionSchema, reviewSchema, kyc_routes_default;
var init_kyc_routes = __esm({
  "server/kyc-routes.ts"() {
    "use strict";
    init_simple_auth();
    init_storage();
    router20 = Router20();
    requireAdmin3 = async (req, res, next) => {
      try {
        const user = await storage.getUser(req.user.id);
        if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }
        next();
      } catch (error) {
        console.error("Admin check error:", error);
        res.status(500).json({ message: "Authorization failed" });
      }
    };
    kycSubmissionSchema = z13.object({
      firstName: z13.string().min(1),
      lastName: z13.string().min(1),
      dateOfBirth: z13.string(),
      nationality: z13.string().min(1),
      address: z13.string().min(1),
      city: z13.string().min(1),
      postalCode: z13.string().min(1),
      country: z13.string().min(1),
      phoneNumber: z13.string().min(1),
      documentType: z13.enum(["passport", "driver_license", "national_id"]),
      documentNumber: z13.string().min(1),
      documentFrontImageUrl: z13.string().optional(),
      documentBackImageUrl: z13.string().optional(),
      selfieImageUrl: z13.string().optional()
    });
    router20.post("/submit", requireAuth, async (req, res) => {
      try {
        const userId = req.user.id;
        const data = kycSubmissionSchema.parse(req.body);
        const existingKyc = await storage.getKycVerification(userId);
        if (existingKyc && existingKyc.status !== "rejected") {
          return res.status(400).json({
            message: "KYC verification already submitted or approved"
          });
        }
        const kycData = {
          userId,
          ...data,
          dateOfBirth: new Date(data.dateOfBirth),
          status: "pending",
          documentFrontImageUrl: data.documentFrontImageUrl || "placeholder-front.jpg",
          selfieImageUrl: data.selfieImageUrl || "placeholder-selfie.jpg"
        };
        let kyc;
        if (existingKyc) {
          kyc = await storage.updateKycVerification(existingKyc.id, kycData);
        } else {
          kyc = await storage.createKycVerification(kycData);
        }
        res.json({ message: "KYC submitted successfully", kyc });
      } catch (error) {
        console.error("KYC submission error:", error);
        res.status(500).json({ message: "Failed to submit KYC verification" });
      }
    });
    router20.get("/status", requireAuth, async (req, res) => {
      try {
        const userId = req.user.id;
        const kyc = await storage.getKycVerification(userId);
        if (!kyc) {
          return res.status(404).json({ message: "No KYC verification found" });
        }
        res.json(kyc);
      } catch (error) {
        console.error("Get KYC status error:", error);
        res.status(500).json({ message: "Failed to fetch KYC status" });
      }
    });
    router20.patch("/update", requireAuth, async (req, res) => {
      try {
        const userId = req.user.id;
        const data = kycSubmissionSchema.partial().parse(req.body);
        const existingKyc = await storage.getKycVerification(userId);
        if (!existingKyc) {
          return res.status(404).json({ message: "No KYC verification found" });
        }
        if (existingKyc.status === "approved") {
          return res.status(400).json({ message: "Cannot update approved KYC" });
        }
        const updateData = {
          ...data,
          ...data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) },
          status: "pending"
        };
        const updatedKyc = await storage.updateKycVerification(existingKyc.id, updateData);
        res.json(updatedKyc);
      } catch (error) {
        console.error("Update KYC error:", error);
        res.status(500).json({ message: "Failed to update KYC verification" });
      }
    });
    router20.get("/admin/verifications", requireAuth, requireAdmin3, async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status;
        const search = req.query.search;
        const verifications = await storage.getAllKycVerifications({
          page,
          limit,
          status,
          search
        });
        res.json(verifications);
      } catch (error) {
        console.error("Get KYC verifications error:", error);
        res.status(500).json({ message: "Failed to fetch KYC verifications" });
      }
    });
    router20.get("/admin/verifications/:id", requireAuth, requireAdmin3, async (req, res) => {
      try {
        const { id } = req.params;
        const verification = await storage.getKycVerificationById(id);
        if (!verification) {
          return res.status(404).json({ message: "KYC verification not found" });
        }
        const user = await storage.getUser(verification.userId);
        res.json({ ...verification, user });
      } catch (error) {
        console.error("Get KYC verification error:", error);
        res.status(500).json({ message: "Failed to fetch KYC verification" });
      }
    });
    reviewSchema = z13.object({
      status: z13.enum(["approved", "rejected"]),
      rejectionReason: z13.string().optional(),
      notes: z13.string().optional()
    });
    router20.post("/admin/verifications/:id/review", requireAuth, requireAdmin3, async (req, res) => {
      try {
        const { id } = req.params;
        const { status, rejectionReason, notes } = reviewSchema.parse(req.body);
        const adminId = req.user.id;
        const verification = await storage.getKycVerificationById(id);
        if (!verification) {
          return res.status(404).json({ message: "KYC verification not found" });
        }
        if (verification.status === "approved") {
          return res.status(400).json({ message: "KYC already approved" });
        }
        const updateData = {
          status,
          reviewedBy: adminId,
          reviewedAt: /* @__PURE__ */ new Date(),
          rejectionReason: status === "rejected" ? rejectionReason : null,
          notes
        };
        const updatedVerification = await storage.updateKycVerification(id, updateData);
        await storage.logAdminAction({
          adminId,
          action: `kyc_${status}`,
          targetUserId: verification.userId,
          details: { kycId: id, rejectionReason, notes },
          timestamp: /* @__PURE__ */ new Date()
        });
        res.json(updatedVerification);
      } catch (error) {
        console.error("Review KYC error:", error);
        res.status(500).json({ message: "Failed to review KYC verification" });
      }
    });
    router20.post("/admin/verifications/bulk-review", requireAuth, requireAdmin3, async (req, res) => {
      try {
        const { ids, status, rejectionReason, notes } = req.body;
        const adminId = req.user.id;
        if (!Array.isArray(ids) || ids.length === 0) {
          return res.status(400).json({ message: "Invalid verification IDs" });
        }
        const results = [];
        for (const id of ids) {
          try {
            const updateData = {
              status,
              reviewedBy: adminId,
              reviewedAt: /* @__PURE__ */ new Date(),
              rejectionReason: status === "rejected" ? rejectionReason : null,
              notes
            };
            const updatedVerification = await storage.updateKycVerification(id, updateData);
            results.push({ id, success: true, verification: updatedVerification });
            await storage.logAdminAction({
              adminId,
              action: `kyc_bulk_${status}`,
              details: { kycId: id, rejectionReason, notes },
              timestamp: /* @__PURE__ */ new Date()
            });
          } catch (error) {
            results.push({ id, success: false, error: error.message });
          }
        }
        res.json({ results });
      } catch (error) {
        console.error("Bulk review KYC error:", error);
        res.status(500).json({ message: "Failed to bulk review KYC verifications" });
      }
    });
    router20.get("/admin/statistics", requireAuth, requireAdmin3, async (req, res) => {
      try {
        const stats = await storage.getKycStatistics();
        res.json(stats);
      } catch (error) {
        console.error("Get KYC statistics error:", error);
        res.status(500).json({ message: "Failed to fetch KYC statistics" });
      }
    });
    kyc_routes_default = router20;
  }
});

// server/upload-routes.ts
var upload_routes_exports = {};
__export(upload_routes_exports, {
  default: () => upload_routes_default
});
import { Router as Router21 } from "express";
import multer3 from "multer";
import path4 from "path";
import fs3 from "fs";
var router21, uploadsDir, storage3, fileFilter, upload2, upload_routes_default;
var init_upload_routes = __esm({
  "server/upload-routes.ts"() {
    "use strict";
    init_simple_auth();
    router21 = Router21();
    uploadsDir = path4.join(process.cwd(), "uploads");
    if (!fs3.existsSync(uploadsDir)) {
      fs3.mkdirSync(uploadsDir, { recursive: true });
    }
    storage3 = multer3.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path4.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
      }
    });
    fileFilter = (req, file, cb) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only images, PDFs, and documents are allowed."));
      }
    };
    upload2 = multer3({
      storage: storage3,
      limits: {
        fileSize: 10 * 1024 * 1024
        // 10MB limit
      },
      fileFilter
    });
    router21.post("/", requireAuth, upload2.single("file"), async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
        const { type } = req.body;
        const userId = req.user.id;
        const fileUrl = `/uploads/${req.file.filename}`;
        console.log(`File uploaded by user ${userId}:`, {
          originalName: req.file.originalname,
          filename: req.file.filename,
          size: req.file.size,
          type
        });
        res.json({
          url: fileUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          type: req.file.mimetype
        });
      } catch (error) {
        console.error("File upload error:", error);
        res.status(500).json({ message: "File upload failed" });
      }
    });
    router21.get("/:filename", (req, res) => {
      try {
        const { filename } = req.params;
        const filePath = path4.join(uploadsDir, filename);
        if (!fs3.existsSync(filePath)) {
          return res.status(404).json({ message: "File not found" });
        }
        const resolvedPath = path4.resolve(filePath);
        const uploadsPath = path4.resolve(uploadsDir);
        if (!resolvedPath.startsWith(uploadsPath)) {
          return res.status(403).json({ message: "Access denied" });
        }
        res.sendFile(resolvedPath);
      } catch (error) {
        console.error("File serve error:", error);
        res.status(500).json({ message: "Failed to serve file" });
      }
    });
    router21.delete("/:filename", requireAuth, async (req, res) => {
      try {
        const user = req.user;
        if (user.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }
        const { filename } = req.params;
        const filePath = path4.join(uploadsDir, filename);
        if (fs3.existsSync(filePath)) {
          fs3.unlinkSync(filePath);
          res.json({ message: "File deleted successfully" });
        } else {
          res.status(404).json({ message: "File not found" });
        }
      } catch (error) {
        console.error("File delete error:", error);
        res.status(500).json({ message: "Failed to delete file" });
      }
    });
    upload_routes_default = router21;
  }
});

// server/websocket-server.ts
var websocket_server_exports = {};
__export(websocket_server_exports, {
  setupWebSocketServer: () => setupWebSocketServer,
  webSocketManager: () => webSocketManager
});
import { WebSocketServer, WebSocket } from "ws";
function setupWebSocketServer(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws/prices",
    perMessageDeflate: false,
    clientTracking: true
  });
  const clients = /* @__PURE__ */ new Set();
  wss.on("connection", (ws, req) => {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log(`\u2705 WebSocket client connected from ${clientIp}`);
    ws.isAlive = true;
    clients.add(ws);
    ws.send(JSON.stringify({
      type: "connected",
      message: "WebSocket connection established",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }));
    ws.on("pong", () => {
      ws.isAlive = true;
    });
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("\u{1F4E8} Received message:", data);
        if (data.type === "subscribe") {
          ws.send(JSON.stringify({
            type: "subscribed",
            symbols: data.symbols || []
          }));
        }
      } catch (error) {
        console.error("\u274C Error parsing message:", error);
      }
    });
    ws.on("close", (code, reason) => {
      console.log(`\u274C WebSocket client disconnected: ${code} - ${reason}`);
      clients.delete(ws);
    });
    ws.on("error", (error) => {
      console.error("\u274C WebSocket error:", error);
      clients.delete(ws);
    });
  });
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        console.log("\u{1F50C} Terminating inactive WebSocket connection");
        clients.delete(ws);
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 3e4);
  const priceUpdateInterval = setInterval(() => {
    if (clients.size === 0) return;
    const mockPrices = {
      type: "price_update",
      data: [
        { symbol: "BTC", price: (Math.random() * 1e3 + 67e3).toFixed(2), change24h: (Math.random() * 10 - 5).toFixed(2) },
        { symbol: "ETH", price: (Math.random() * 100 + 3400).toFixed(2), change24h: (Math.random() * 10 - 5).toFixed(2) },
        { symbol: "SOL", price: (Math.random() * 50 + 150).toFixed(2), change24h: (Math.random() * 10 - 5).toFixed(2) }
      ],
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    const message = JSON.stringify(mockPrices);
    clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }, 5e3);
  wss.on("close", () => {
    clearInterval(heartbeatInterval);
    clearInterval(priceUpdateInterval);
  });
  console.log("\u{1F680} WebSocket server initialized on /ws/prices");
  console.log("\u{1F4E1} Broadcasting price updates every 5 seconds");
  return wss;
}
var WebSocketManager, webSocketManager;
var init_websocket_server = __esm({
  "server/websocket-server.ts"() {
    "use strict";
    WebSocketManager = class {
      wss = null;
      clients = /* @__PURE__ */ new Map();
      isInitialized = false;
      connectionsByIp = /* @__PURE__ */ new Map();
      // Rate limiting per IP - increased for real-time price updates
      connectionLimits = /* @__PURE__ */ new Map();
      MAX_CONNECTIONS_PER_IP = 50;
      // Increased limit to handle reconnections
      initialize(httpServer) {
        if (this.isInitialized) {
          console.log("\u26A0\uFE0F WebSocket manager already initialized");
          return;
        }
        this.wss = new WebSocketServer({
          noServer: true,
          path: "/ws"
        });
        httpServer.on("upgrade", (request, socket, head) => {
          const pathname = new URL(request.url || "", `http://${request.headers.host}`).pathname;
          if (pathname === "/ws") {
            const clientIp = request.headers["x-forwarded-for"]?.split(",")[0] || request.socket.remoteAddress || "unknown";
            const currentConnections = this.connectionsByIp.get(clientIp) || 0;
            if (currentConnections >= this.MAX_CONNECTIONS_PER_IP) {
              console.log(`\u274C Connection limit reached for IP: ${clientIp}`);
              socket.write("HTTP/1.1 429 Too Many Requests\r\n\r\n");
              socket.destroy();
              return;
            }
            console.log("\u{1F50C} WebSocket upgrade request for:", pathname);
            this.wss.handleUpgrade(request, socket, head, (ws) => {
              this.wss.emit("connection", ws, request);
            });
          } else {
            socket.destroy();
          }
        });
        this.wss.on("connection", (ws, request) => {
          const clientIp = request.headers["x-forwarded-for"]?.split(",")[0] || request.socket.remoteAddress || "unknown";
          const currentCount = (this.connectionsByIp.get(clientIp) || 0) + 1;
          this.connectionsByIp.set(clientIp, currentCount);
          const clientId = Date.now().toString() + Math.random().toString(36);
          console.log(`\u2705 WebSocket connected - IP: ${clientIp}, Count: ${currentCount}/${this.MAX_CONNECTIONS_PER_IP}`);
          ws.send(JSON.stringify({
            type: "connection",
            message: "Connected to live price feed",
            timestamp: Date.now(),
            clientId
          }));
          ws.on("message", async (data) => {
            try {
              const message = JSON.parse(data.toString());
              if (message.type === "subscribe") {
                await this.handleSubscribe(clientId, ws, message.symbols);
              }
              if (message.type === "unsubscribe") {
                this.handleUnsubscribe(clientId);
              }
            } catch (error) {
              console.error("Error parsing WebSocket message:", error);
            }
          });
          ws.on("close", () => {
            console.log(`Client disconnected from WebSocket (IP: ${clientIp})`);
            this.handleUnsubscribe(clientId);
            const count2 = this.connectionsByIp.get(clientIp) || 0;
            if (count2 <= 1) {
              this.connectionsByIp.delete(clientIp);
              console.log(`\u2713 All connections closed for IP: ${clientIp}`);
            } else {
              this.connectionsByIp.set(clientIp, count2 - 1);
              console.log(`\u2713 Connection closed for IP: ${clientIp} (${count2 - 1} remaining)`);
            }
          });
          ws.on("error", (error) => {
            console.error(`WebSocket error for IP ${clientIp}:`, error);
            this.handleUnsubscribe(clientId);
            const count2 = this.connectionsByIp.get(clientIp) || 0;
            if (count2 <= 1) {
              this.connectionsByIp.delete(clientIp);
              console.log(`\u2713 Cleaned up connections on error for IP: ${clientIp}`);
            } else {
              this.connectionsByIp.set(clientIp, count2 - 1);
              console.log(`\u2713 Error cleanup for IP: ${clientIp} (${count2 - 1} remaining)`);
            }
            if (ws.readyState === ws.OPEN || ws.readyState === ws.CONNECTING) {
              ws.close();
            }
          });
        });
        setInterval(() => {
          const staleIps = [];
          this.connectionsByIp.forEach((count2, ip) => {
            if (count2 <= 0) {
              staleIps.push(ip);
            }
          });
          staleIps.forEach((ip) => this.connectionsByIp.delete(ip));
          if (staleIps.length > 0) {
            console.log(`\u{1F9F9} Cleaned up ${staleIps.length} stale IP connection tracking entries`);
          }
        }, 5 * 60 * 1e3);
        this.isInitialized = true;
        console.log("\u2705 WebSocket manager initialized successfully");
      }
      async handleSubscribe(clientId, ws, symbols) {
        console.log("Client subscribed to:", symbols);
        this.handleUnsubscribe(clientId);
        await this.sendPriceUpdates(ws, symbols);
        const interval = setInterval(async () => {
          if (ws.readyState === WebSocket.OPEN) {
            await this.sendPriceUpdates(ws, symbols);
          } else {
            clearInterval(interval);
            this.clients.delete(clientId);
          }
        }, 3e4);
        this.clients.set(clientId, { ws, symbols, interval });
      }
      handleUnsubscribe(clientId) {
        const client = this.clients.get(clientId);
        if (client?.interval) {
          clearInterval(client.interval);
        }
        this.clients.delete(clientId);
      }
      async sendPriceUpdates(ws, symbols) {
        try {
          const { cryptoService: cryptoService2 } = await Promise.resolve().then(() => (init_crypto_service(), crypto_service_exports));
          for (const symbol of symbols) {
            try {
              const symbolKey = symbol.replace("bitcoin", "BTC").replace("ethereum", "ETH").toUpperCase();
              const priceData = await cryptoService2.getPrice(symbolKey);
              if (priceData && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: "price_update",
                  symbol,
                  price: priceData.price,
                  change_24h: priceData.change_24h,
                  volume_24h: priceData.volume_24h,
                  market_cap: priceData.market_cap,
                  timestamp: Date.now()
                }));
              }
            } catch (error) {
              console.error(`Error fetching price for ${symbol}:`, error);
            }
          }
        } catch (error) {
          console.error("Error sending price updates:", error);
        }
      }
      shutdown() {
        console.log("\u{1F50C} Shutting down WebSocket manager...");
        this.clients.forEach((client) => {
          if (client.interval) {
            clearInterval(client.interval);
          }
          if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.close();
          }
        });
        this.clients.clear();
        this.connectionsByIp.clear();
        if (this.wss) {
          this.wss.close();
        }
        this.isInitialized = false;
        console.log("\u2705 WebSocket manager shutdown complete");
      }
    };
    webSocketManager = new WebSocketManager();
  }
});

// server/index.ts
import "dotenv/config";
import express2 from "express";
import cookieParser from "cookie-parser";
import csrf from "tiny-csrf";

// server/routes.ts
import { createServer } from "http";

// server/session.ts
import session from "express-session";
import connectPg from "connect-pg-simple";
function createSessionMiddleware() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET || "dev-secret-key-change-in-production",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      // Set to false for development
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1e3,
      // 24 hours
      sameSite: "lax"
      // Important for cross-origin requests
    },
    name: "sessionId"
    // Custom session name
  });
}

// server/routes.ts
init_storage();
init_simple_auth();
init_schema();

// server/deposit-routes.ts
init_simple_auth();
init_storage();
init_schema();
import { Router } from "express";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
var router = Router();
router.get("/proof/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const deposit = await storage.getDepositById(id);
    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }
    if (deposit.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    if (!deposit.proofImageUrl) {
      return res.status(404).json({ message: "No proof file found" });
    }
    const fileName = deposit.proofImageUrl.replace("/uploads/proofs/", "");
    const filePath = path.join(process.cwd(), "uploads/proofs", fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Proof file not found on disk" });
    }
    res.setHeader("Content-Type", "image/jpeg");
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.error("Serve proof file error:", error);
    res.status(500).json({ message: "Failed to serve proof file" });
  }
});
var multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/proofs/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `proof-${uniqueSuffix}${fileExtension}`);
  }
});
var upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    // 10MB limit
    files: 5
    // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images (JPEG, PNG, GIF) and PDF files are allowed"));
    }
  }
});
var createDepositSchema = z.object({
  amount: z.string().transform((val) => parseFloat(val)),
  currency: z.string(),
  symbol: z.string(),
  // Crypto symbol (BTC, ETH, etc.)
  paymentMethod: z.enum(["binance", "bybit", "crypto_com", "bank_transfer", "other"])
});
var approveDepositSchema = z.object({
  approved: z.boolean(),
  adminNotes: z.string().optional(),
  rejectionReason: z.string().optional()
});
var balanceAdjustmentSchema = z.object({
  userId: z.string(),
  adjustmentType: z.enum(["add", "remove", "set"]),
  amount: z.string().transform((val) => parseFloat(val)),
  currency: z.string().default("USD"),
  reason: z.string()
});
router.get("/wallet-addresses", requireAuth, async (req, res) => {
  try {
    let addresses = await storage.getSharedWalletAddresses();
    if (addresses.length === 0) {
      const defaultAddresses = [
        { symbol: "BTC", name: "Bitcoin", address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", network: "mainnet" },
        { symbol: "ETH", name: "Ethereum", address: "0x742F96e08A82d6D91F1aE37df26B12C75a1cF86e", network: "mainnet" },
        { symbol: "USDT", name: "Tether", address: "0x742F96e08A82d6D91F1aE37df26B12C75a1cF86e", network: "ethereum" },
        { symbol: "BNB", name: "Binance Coin", address: "bnb1jw7qkv5r8x3v4x8wqnrzr2t8s5k6g3h7d2f1a0", network: "bsc" },
        { symbol: "ADA", name: "Cardano", address: "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a6gtajun6cjskw3", network: "cardano" },
        { symbol: "SOL", name: "Solana", address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM", network: "solana" },
        { symbol: "XRP", name: "Ripple", address: "rDNvpSjsGdPaAHWMKhv8iPtF3mBYYR2PpK", network: "xrpl" },
        { symbol: "DOT", name: "Polkadot", address: "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5", network: "polkadot" },
        { symbol: "MATIC", name: "Polygon", address: "0x742F96e08A82d6D91F1aE37df26B12C75a1cF86e", network: "polygon" },
        { symbol: "LINK", name: "Chainlink", address: "0x742F96e08A82d6D91F1aE37df26B12C75a1cF86e", network: "ethereum" }
      ];
      for (const addr of defaultAddresses) {
        await storage.createOrUpdateSharedWalletAddress(addr);
      }
      addresses = await storage.getSharedWalletAddresses();
    }
    res.json(addresses);
  } catch (error) {
    console.error("Get wallet addresses error:", error);
    res.status(500).json({ message: "Failed to fetch wallet addresses" });
  }
});
router.post("/", requireAuth, upload.array("proof_files", 5), async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_method, amount, currency, notes } = req.body;
    if (!payment_method || !amount || !currency) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const proofUploads = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        proofUploads.push({
          fileName: file.originalname,
          filePath: `/uploads/proofs/${file.filename}`,
          fileSize: file.size,
          mimeType: file.mimetype
        });
      }
    }
    const deposit = await storage.createDeposit({
      userId,
      amount: parseFloat(amount).toString(),
      currency,
      assetType: "crypto",
      paymentMethod: payment_method,
      status: "pending",
      proofImageUrl: proofUploads.length > 0 ? proofUploads[0].filePath : null,
      adminNotes: notes || null
    });
    for (const proof of proofUploads) {
      console.log(`Uploaded proof: ${proof.fileName} (${proof.fileSize} bytes)`);
    }
    res.json({
      success: true,
      deposit: {
        ...deposit,
        proof_uploads: proofUploads
      },
      message: "Deposit request submitted successfully. Please wait for admin approval."
    });
  } catch (error) {
    console.error("Create deposit error:", error);
    res.status(500).json({ message: "Failed to create deposit request" });
  }
});
router.post("/:id/proof", requireAuth, upload.single("proof"), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const deposit = await storage.getDepositById(id);
    if (!deposit || deposit.userId !== userId) {
      return res.status(404).json({ message: "Deposit not found" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Proof of payment image is required" });
    }
    const updatedDeposit = await storage.updateDeposit(id, {
      proofImageUrl: req.file.filename,
      status: "pending"
      // Ready for admin review
    });
    res.json(updatedDeposit);
  } catch (error) {
    console.error("Upload proof error:", error);
    res.status(500).json({ message: "Failed to upload proof of payment" });
  }
});
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const deposits2 = await storage.getUserDeposits(userId);
    res.json(deposits2);
  } catch (error) {
    console.error("Get deposits error:", error);
    res.status(500).json({ message: "Failed to fetch deposits" });
  }
});
router.get("/admin/all", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const deposits2 = await storage.getAllDeposits();
    res.json(deposits2);
  } catch (error) {
    console.error("Get all deposits error:", error);
    res.status(500).json({ message: "Failed to fetch deposits" });
  }
});
router.post("/:id/approve", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const { id } = req.params;
    const { adminNotes } = req.body;
    const deposit = await storage.getDepositById(id);
    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }
    if (deposit.status !== "pending") {
      return res.status(400).json({ message: "Deposit has already been processed" });
    }
    const updatedDeposit = await storage.updateDeposit(id, {
      status: "approved",
      adminNotes: adminNotes || null,
      approvedById: req.user.id,
      approvedAt: /* @__PURE__ */ new Date()
    });
    const depositAmount = parseFloat(deposit.amount);
    await storage.createBalanceAdjustment({
      adminId: req.user.id,
      targetUserId: deposit.userId,
      adjustmentType: "add",
      amount: depositAmount.toString(),
      currency: deposit.currency,
      reason: `Approved deposit #${deposit.id}`
    });
    let portfolio = await storage.getPortfolio(deposit.userId);
    if (!portfolio) {
      portfolio = await storage.createPortfolio({
        userId: deposit.userId,
        totalValue: depositAmount.toString(),
        availableCash: depositAmount.toString()
      });
    } else {
      const newAvailableCash = parseFloat(portfolio.availableCash) + depositAmount;
      const newTotalValue = parseFloat(portfolio.totalValue) + depositAmount;
      await storage.updatePortfolio(portfolio.id, {
        availableCash: newAvailableCash.toString(),
        totalValue: newTotalValue.toString()
      });
    }
    console.log(`\u2705 Deposit ${id} approved and $${depositAmount} added to user ${deposit.userId} balance`);
    res.json({
      success: true,
      deposit: updatedDeposit,
      message: `Deposit approved and $${deposit.amount} added to user balance`
    });
  } catch (error) {
    console.error("Approve deposit error:", error);
    res.status(500).json({ message: "Failed to approve deposit" });
  }
});
router.post("/:id/reject", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const { id } = req.params;
    const { rejectionReason, adminNotes } = req.body;
    const deposit = await storage.getDepositById(id);
    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }
    if (deposit.status !== "pending") {
      return res.status(400).json({ message: "Deposit has already been processed" });
    }
    const updatedDeposit = await storage.updateDeposit(id, {
      status: "rejected",
      rejectionReason: rejectionReason || "No reason provided",
      adminNotes: adminNotes || null,
      approvedById: req.user.id,
      approvedAt: /* @__PURE__ */ new Date()
    });
    res.json({
      success: true,
      deposit: updatedDeposit,
      message: "Deposit rejected"
    });
  } catch (error) {
    console.error("Reject deposit error:", error);
    res.status(500).json({ message: "Failed to reject deposit" });
  }
});
router.post("/admin/adjust-balance", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const adjustmentData = balanceAdjustmentSchema.parse(req.body);
    const adjustment = await storage.createBalanceAdjustment({
      adminId: req.user.id,
      targetUserId: adjustmentData.userId,
      adjustmentType: adjustmentData.adjustmentType,
      amount: adjustmentData.amount.toString(),
      currency: adjustmentData.currency,
      reason: adjustmentData.reason
    });
    const portfolio = await storage.getPortfolio(adjustmentData.userId);
    if (portfolio) {
      let newBalance;
      const currentBalance = parseFloat(portfolio.availableCash);
      switch (adjustmentData.adjustmentType) {
        case "add":
          newBalance = currentBalance + adjustmentData.amount;
          break;
        case "remove":
          newBalance = currentBalance - adjustmentData.amount;
          break;
        case "set":
          newBalance = adjustmentData.amount;
          break;
        default:
          throw new Error("Invalid adjustment type");
      }
      await storage.updatePortfolio(portfolio.id, {
        availableCash: newBalance.toString(),
        totalValue: newBalance.toString()
      });
    }
    res.json({
      adjustment,
      message: `Balance ${adjustmentData.adjustmentType === "add" ? "increased" : adjustmentData.adjustmentType === "remove" ? "decreased" : "set"} successfully`
    });
  } catch (error) {
    console.error("Balance adjustment error:", error);
    res.status(500).json({ message: "Failed to adjust balance" });
  }
});
router.get("/admin/balance-adjustments", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const adjustments = await storage.getBalanceAdjustments();
    res.json(adjustments);
  } catch (error) {
    console.error("Get balance adjustments error:", error);
    res.status(500).json({ message: "Failed to fetch balance adjustments" });
  }
});
router.post("/admin/wallet-addresses", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const walletData = insertSharedWalletAddressSchema.parse(req.body);
    const address = await storage.createOrUpdateSharedWalletAddress(walletData);
    res.json(address);
  } catch (error) {
    console.error("Create wallet address error:", error);
    res.status(500).json({ message: "Failed to create wallet address" });
  }
});
router.post("/admin/manipulate-balance", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const adjustmentData = balanceAdjustmentSchema.parse(req.body);
    const adjustment = await storage.createBalanceAdjustment({
      adminId: req.user.id,
      targetUserId: adjustmentData.userId,
      adjustmentType: adjustmentData.adjustmentType,
      amount: adjustmentData.amount.toString(),
      currency: adjustmentData.currency,
      reason: adjustmentData.reason || "Admin balance manipulation"
    });
    let portfolio = await storage.getPortfolio(adjustmentData.userId);
    if (!portfolio) {
      portfolio = await storage.createPortfolio({
        userId: adjustmentData.userId,
        totalValue: adjustmentData.adjustmentType === "set" ? adjustmentData.amount.toString() : "0",
        availableCash: adjustmentData.adjustmentType === "set" ? adjustmentData.amount.toString() : "0"
      });
    } else {
      let newBalance;
      const currentBalance = parseFloat(portfolio.availableCash);
      switch (adjustmentData.adjustmentType) {
        case "add":
          newBalance = currentBalance + parseFloat(adjustmentData.amount);
          break;
        case "remove":
          newBalance = Math.max(0, currentBalance - parseFloat(adjustmentData.amount));
          break;
        case "set":
          newBalance = parseFloat(adjustmentData.amount);
          break;
        default:
          throw new Error("Invalid adjustment type");
      }
      await storage.updatePortfolio(portfolio.id, {
        availableCash: newBalance.toString(),
        totalValue: newBalance.toString()
      });
    }
    res.json({
      success: true,
      adjustment,
      message: `Balance ${adjustmentData.adjustmentType}ed successfully`
    });
  } catch (error) {
    console.error("Balance manipulation error:", error);
    res.status(500).json({ message: "Failed to manipulate balance" });
  }
});
router.get("/admin/user-balance/:userId", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const { userId } = req.params;
    const portfolio = await storage.getPortfolio(userId);
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      balance: portfolio ? {
        availableCash: parseFloat(portfolio.availableCash),
        totalValue: parseFloat(portfolio.totalValue)
      } : {
        availableCash: 0,
        totalValue: 0
      }
    });
  } catch (error) {
    console.error("Get user balance error:", error);
    res.status(500).json({ message: "Failed to fetch user balance" });
  }
});
var deposit_routes_default = router;

// server/withdrawal-routes.ts
init_simple_auth();
init_storage();
import { Router as Router2 } from "express";
import { z as z2 } from "zod";
import crypto2 from "crypto";
var router2 = Router2();
var createWithdrawalSchema = z2.object({
  amount: z2.string().min(1),
  currency: z2.string().default("USD"),
  withdrawalMethod: z2.enum(["bank_transfer", "crypto_wallet", "paypal", "mobile_money", "other"]),
  destinationAddress: z2.string().min(1),
  destinationDetails: z2.record(z2.any()).optional(),
  notes: z2.string().optional()
});
var confirmWithdrawalSchema = z2.object({
  token: z2.string().min(1)
});
var adminActionSchema = z2.object({
  adminNotes: z2.string().optional(),
  rejectionReason: z2.string().optional()
});
router2.get("/", requireAuth, async (req, res) => {
  try {
    const withdrawals2 = await storage.getUserWithdrawals(req.user.id);
    res.json(withdrawals2);
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    res.status(500).json({ message: "Failed to fetch withdrawals" });
  }
});
router2.get("/all", requireAuth, requireAdmin, async (req, res) => {
  try {
    const withdrawals2 = await storage.getAllWithdrawals();
    res.json(withdrawals2);
  } catch (error) {
    console.error("Error fetching all withdrawals:", error);
    res.status(500).json({ message: "Failed to fetch withdrawals" });
  }
});
router2.get("/limits", requireAuth, async (req, res) => {
  try {
    const limits = await storage.getWithdrawalLimits(req.user.id);
    res.json(limits);
  } catch (error) {
    console.error("Error fetching withdrawal limits:", error);
    res.status(500).json({ message: "Failed to fetch withdrawal limits" });
  }
});
router2.post("/calculate-fees", requireAuth, async (req, res) => {
  try {
    const { amount, method } = req.body;
    const fees = await storage.calculateWithdrawalFees(parseFloat(amount), method);
    res.json({
      fees: fees.toString(),
      netAmount: (parseFloat(amount) - fees).toString()
    });
  } catch (error) {
    console.error("Error calculating fees:", error);
    res.status(500).json({ message: "Failed to calculate fees" });
  }
});
router2.post("/request", requireAuth, async (req, res) => {
  try {
    const validatedData = createWithdrawalSchema.parse(req.body);
    const amount = parseFloat(validatedData.amount);
    if (amount < 10) {
      return res.status(400).json({ message: "Minimum withdrawal amount is $10" });
    }
    const portfolio = await storage.getPortfolio(req.user.id);
    if (!portfolio || parseFloat(portfolio.availableCash) < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    const limits = await storage.getWithdrawalLimits(req.user.id);
    const dailyRemaining = parseFloat(limits.dailyLimit) - parseFloat(limits.dailyUsed);
    const monthlyRemaining = parseFloat(limits.monthlyLimit) - parseFloat(limits.monthlyUsed);
    if (amount > dailyRemaining) {
      return res.status(400).json({
        message: `Daily withdrawal limit exceeded. Remaining: $${dailyRemaining.toFixed(2)}`
      });
    }
    if (amount > monthlyRemaining) {
      return res.status(400).json({
        message: `Monthly withdrawal limit exceeded. Remaining: $${monthlyRemaining.toFixed(2)}`
      });
    }
    const fees = await storage.calculateWithdrawalFees(amount, validatedData.withdrawalMethod);
    const netAmount = amount - fees;
    if (netAmount <= 0) {
      return res.status(400).json({ message: "Net amount after fees must be greater than zero" });
    }
    const confirmationToken = crypto2.randomBytes(32).toString("hex");
    const confirmationExpiresAt = new Date(Date.now() + 30 * 60 * 1e3);
    const withdrawal = await storage.createWithdrawal({
      userId: req.user.id,
      amount: amount.toString(),
      currency: validatedData.currency,
      withdrawalMethod: validatedData.withdrawalMethod,
      destinationAddress: validatedData.destinationAddress,
      destinationDetails: validatedData.destinationDetails,
      fees: fees.toString(),
      netAmount: netAmount.toString(),
      confirmationToken,
      confirmationExpiresAt: confirmationExpiresAt.toISOString(),
      status: "pending_confirmation",
      notes: validatedData.notes
    });
    await storage.updatePortfolioBalance(req.user.id, -amount);
    console.log(`Withdrawal confirmation token for user ${req.user.id}: ${confirmationToken}`);
    res.json({
      message: "Withdrawal request created. Please check your email to confirm within 30 minutes.",
      withdrawalId: withdrawal.id,
      requiresConfirmation: true,
      fees: fees.toString(),
      netAmount: netAmount.toString(),
      expiresAt: confirmationExpiresAt.toISOString()
    });
  } catch (error) {
    console.error("Error creating withdrawal:", error);
    if (error instanceof z2.ZodError) {
      return res.status(400).json({ message: "Invalid request data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create withdrawal request" });
  }
});
router2.post("/confirm", requireAuth, async (req, res) => {
  try {
    const { token } = confirmWithdrawalSchema.parse(req.body);
    const withdrawal = await storage.confirmWithdrawal(req.user.id, token);
    if (!withdrawal) {
      return res.status(400).json({ message: "Invalid or expired confirmation token" });
    }
    await storage.updateWithdrawalStatus(withdrawal.id, "under_review", "Confirmed by user, awaiting admin review");
    res.json({
      message: "Withdrawal confirmed successfully. Your request is now under review by our team.",
      withdrawal: {
        ...withdrawal,
        status: "under_review"
      }
    });
  } catch (error) {
    console.error("Error confirming withdrawal:", error);
    res.status(500).json({ message: "Failed to confirm withdrawal" });
  }
});
router2.post("/:id/approve", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = adminActionSchema.parse(req.body);
    const withdrawal = await storage.updateWithdrawalStatus(
      id,
      "approved",
      adminNotes || "Withdrawal approved by admin"
    );
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }
    await storage.updateWithdrawalStatus(id, "processing", "Processing withdrawal to destination");
    console.log(`Admin ${req.user.id} approved withdrawal ${id}`);
    res.json({
      message: "Withdrawal approved and processing initiated",
      withdrawal: {
        ...withdrawal,
        status: "processing"
      }
    });
  } catch (error) {
    console.error("Error approving withdrawal:", error);
    res.status(500).json({ message: "Failed to approve withdrawal" });
  }
});
router2.post("/:id/reject", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes, rejectionReason } = adminActionSchema.parse(req.body);
    const withdrawal = await storage.getWithdrawalById(id);
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }
    const userPortfolio = await storage.getPortfolio(req.user.id);
    if (userPortfolio) {
      const newBalance = parseFloat(userPortfolio.availableCash) + parseFloat(withdrawal.amount);
      await storage.updatePortfolio(userPortfolio.id, { availableCash: newBalance.toString() });
    }
    const updatedWithdrawal = await storage.updateWithdrawalStatus(
      id,
      "rejected",
      adminNotes || rejectionReason || "Withdrawal rejected by admin"
    );
    console.log(`Admin ${req.user.id} rejected withdrawal ${id}: ${rejectionReason}`);
    res.json({
      message: "Withdrawal rejected and funds returned to user account",
      withdrawal: updatedWithdrawal,
      refundedAmount: withdrawal.amount
    });
  } catch (error) {
    console.error("Error rejecting withdrawal:", error);
    res.status(500).json({ message: "Failed to reject withdrawal" });
  }
});
router2.post("/:id/complete", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = adminActionSchema.parse(req.body);
    const withdrawal = await storage.updateWithdrawalStatus(
      id,
      "completed",
      adminNotes || "Withdrawal successfully completed"
    );
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }
    console.log(`Admin ${req.user.id} completed withdrawal ${id}`);
    res.json({
      message: "Withdrawal marked as completed",
      withdrawal
    });
  } catch (error) {
    console.error("Error completing withdrawal:", error);
    res.status(500).json({ message: "Failed to complete withdrawal" });
  }
});
router2.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawal = await storage.getWithdrawalById(id);
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }
    if (withdrawal.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (!["pending", "pending_confirmation"].includes(withdrawal.status)) {
      return res.status(400).json({ message: "Cannot cancel withdrawal in current status" });
    }
    const userPortfolio = await storage.getPortfolio(req.user.id);
    if (userPortfolio) {
      const newBalance = parseFloat(userPortfolio.availableCash) + parseFloat(withdrawal.amount);
      await storage.updatePortfolio(userPortfolio.id, { availableCash: newBalance.toString() });
    }
    await storage.updateWithdrawalStatus(id, "cancelled", "Cancelled by user");
    res.json({
      message: "Withdrawal cancelled successfully and funds returned to your account",
      refundedAmount: withdrawal.amount
    });
  } catch (error) {
    console.error("Error cancelling withdrawal:", error);
    res.status(500).json({ message: "Failed to cancel withdrawal" });
  }
});
router2.get("/stats", requireAuth, requireAdmin, async (req, res) => {
  try {
    const stats = await storage.getWithdrawalStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching withdrawal stats:", error);
    res.status(500).json({ message: "Failed to fetch withdrawal statistics" });
  }
});
router2.post("/limits/:userId", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { dailyLimit, monthlyLimit } = req.body;
    const limits = await storage.setWithdrawalLimits(userId, {
      dailyLimit: parseFloat(dailyLimit),
      monthlyLimit: parseFloat(monthlyLimit)
    });
    res.json({
      message: "Withdrawal limits updated successfully",
      limits
    });
  } catch (error) {
    console.error("Error updating withdrawal limits:", error);
    res.status(500).json({ message: "Failed to update withdrawal limits" });
  }
});
var withdrawal_routes_default = router2;

// server/trading-routes.ts
init_simple_auth();
init_storage();
init_crypto_service();
import { Router as Router3 } from "express";
import { z as z3 } from "zod";
var router3 = Router3();
var executeTradeSchema = z3.object({
  symbol: z3.string().min(1).max(10),
  type: z3.enum(["buy", "sell"]),
  orderType: z3.enum(["market", "limit", "stop_loss", "take_profit"]),
  amount: z3.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, { message: "Amount must be a positive number" }),
  price: z3.string().optional().refine((val) => {
    if (!val) return true;
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, { message: "Price must be a positive number" }),
  stopLoss: z3.string().optional(),
  takeProfit: z3.string().optional(),
  slippage: z3.string().optional()
});
var TRADING_CONFIG = {
  MIN_ORDER_AMOUNT: 1,
  MAX_ORDER_AMOUNT: 1e6,
  TRADING_FEE_RATE: 1e-3,
  // 0.1%
  MAKER_FEE_RATE: 8e-4,
  // 0.08% for limit orders
  TAKER_FEE_RATE: 1e-3,
  // 0.1% for market orders
  SLIPPAGE_TOLERANCE: 5e-3,
  MAX_SLIPPAGE: 0.05,
  PRICE_PRECISION: 8,
  AMOUNT_PRECISION: 8
};
var TradingEngine = class {
  orderBooks = /* @__PURE__ */ new Map();
  pendingOrders = /* @__PURE__ */ new Map();
  async getOrderBook(symbol) {
    const cached = this.orderBooks.get(symbol);
    if (cached && Date.now() - cached.lastUpdate.getTime() < 3e4) {
      return cached;
    }
    const price = await cryptoService.getPrice(symbol);
    if (!price) {
      throw new Error(`Unable to get price for ${symbol}`);
    }
    const currentPrice = price.price;
    const orderBook = {
      bids: [],
      asks: [],
      spread: 0,
      lastUpdate: /* @__PURE__ */ new Date()
    };
    for (let i = 0; i < 10; i++) {
      const priceLevel = currentPrice * (1 - (i + 1) * 1e-3);
      const amount = Math.random() * 5 + 0.1;
      orderBook.bids.push({
        price: priceLevel,
        amount,
        total: priceLevel * amount,
        timestamp: /* @__PURE__ */ new Date()
      });
    }
    for (let i = 0; i < 10; i++) {
      const priceLevel = currentPrice * (1 + (i + 1) * 1e-3);
      const amount = Math.random() * 5 + 0.1;
      orderBook.asks.push({
        price: priceLevel,
        amount,
        total: priceLevel * amount,
        timestamp: /* @__PURE__ */ new Date()
      });
    }
    orderBook.spread = orderBook.asks[0].price - orderBook.bids[0].price;
    this.orderBooks.set(symbol, orderBook);
    return orderBook;
  }
  calculateSlippage(symbol, amount, side) {
    const baseSlippage = 1e-3;
    const impactFactor = Math.min(amount / 100, 0.02);
    return baseSlippage + impactFactor;
  }
  async executeMarketOrder(symbol, amount, side) {
    const orderBook = await this.getOrderBook(symbol);
    const slippage = this.calculateSlippage(symbol, amount, side);
    let executionPrice;
    if (side === "buy") {
      executionPrice = orderBook.asks[0].price * (1 + slippage);
    } else {
      executionPrice = orderBook.bids[0].price * (1 - slippage);
    }
    return {
      executionPrice,
      slippage,
      executedAmount: amount
    };
  }
  async executeLimitOrder(symbol, amount, price, side) {
    const orderBook = await this.getOrderBook(symbol);
    if (side === "buy" && price >= orderBook.asks[0].price) {
      return {
        status: "filled",
        executedAmount: amount,
        executionPrice: orderBook.asks[0].price
      };
    } else if (side === "sell" && price <= orderBook.bids[0].price) {
      return {
        status: "filled",
        executedAmount: amount,
        executionPrice: orderBook.bids[0].price
      };
    }
    return {
      status: "pending",
      executedAmount: 0,
      executionPrice: price
    };
  }
};
var tradingEngine = new TradingEngine();
function calculateTradingFee(amount, feeRate) {
  return amount * feeRate;
}
function validateOrderAmount(amount) {
  if (amount < TRADING_CONFIG.MIN_ORDER_AMOUNT) {
    return { valid: false, message: `Minimum order amount is $${TRADING_CONFIG.MIN_ORDER_AMOUNT}` };
  }
  if (amount > TRADING_CONFIG.MAX_ORDER_AMOUNT) {
    return { valid: false, message: `Maximum order amount is $${TRADING_CONFIG.MAX_ORDER_AMOUNT.toLocaleString()}` };
  }
  return { valid: true };
}
function validateStopLoss(currentPrice, stopLoss, orderType, side) {
  if (side === "buy" && stopLoss >= currentPrice) {
    return { valid: false, message: "Stop loss must be below current price for buy orders" };
  }
  if (side === "sell" && stopLoss <= currentPrice) {
    return { valid: false, message: "Stop loss must be above current price for sell orders" };
  }
  return { valid: true };
}
router3.post("/execute", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    const tradeData = executeTradeSchema.parse(req.body);
    const amount = parseFloat(tradeData.amount);
    const requestedPrice = tradeData.price ? parseFloat(tradeData.price) : null;
    const amountValidation = validateOrderAmount(amount);
    if (!amountValidation.valid) {
      return res.status(400).json({ message: amountValidation.message });
    }
    const marketPrice = await cryptoService.getPrice(tradeData.symbol);
    if (!marketPrice) {
      return res.status(400).json({ message: "Unable to get current market price" });
    }
    let executionResult;
    let feeRate = TRADING_CONFIG.TRADING_FEE_RATE;
    if (tradeData.orderType === "market") {
      feeRate = TRADING_CONFIG.TAKER_FEE_RATE;
      executionResult = await tradingEngine.executeMarketOrder(
        tradeData.symbol,
        amount,
        tradeData.type
      );
    } else if (tradeData.orderType === "limit" && requestedPrice) {
      feeRate = TRADING_CONFIG.MAKER_FEE_RATE;
      executionResult = await tradingEngine.executeLimitOrder(
        tradeData.symbol,
        amount,
        requestedPrice,
        tradeData.type
      );
    } else {
      return res.status(400).json({ message: "Invalid order type or missing price" });
    }
    const executionPrice = executionResult.executionPrice;
    const executedAmount = executionResult.executedAmount || amount;
    const grossTotal = executedAmount * executionPrice;
    const tradingFee = calculateTradingFee(grossTotal, feeRate);
    const netTotal = tradeData.type === "buy" ? grossTotal + tradingFee : grossTotal - tradingFee;
    if (tradeData.stopLoss) {
      const stopLossValidation = validateStopLoss(
        marketPrice.price,
        parseFloat(tradeData.stopLoss),
        tradeData.orderType,
        tradeData.type
      );
      if (!stopLossValidation.valid) {
        return res.status(400).json({ message: stopLossValidation.message });
      }
    }
    if (tradeData.type === "buy") {
      const availableCash = parseFloat(portfolio.availableCash);
      if (netTotal > availableCash) {
        return res.status(400).json({
          message: `Insufficient funds. Required: $${netTotal.toFixed(2)}, Available: $${availableCash.toFixed(2)}`
        });
      }
    } else {
      const holding = await storage.getHolding(portfolio.id, tradeData.symbol);
      if (!holding) {
        return res.status(400).json({ message: "No holdings found for this asset" });
      }
      const currentAmount = parseFloat(holding.amount);
      if (executedAmount > currentAmount) {
        return res.status(400).json({
          message: `Insufficient holdings. Required: ${executedAmount}, Available: ${currentAmount}`
        });
      }
    }
    const transactionData = {
      userId,
      symbol: tradeData.symbol,
      type: tradeData.type,
      amount: executedAmount.toString(),
      price: executionPrice.toString(),
      total: netTotal.toString(),
      fee: tradingFee.toString(),
      orderType: tradeData.orderType,
      status: executionResult.status === "pending" ? "pending" : "completed",
      stopLoss: tradeData.stopLoss || null,
      takeProfit: tradeData.takeProfit || null,
      slippage: executionResult.slippage?.toString() || "0"
    };
    const transaction = await storage.createTransaction(transactionData);
    if (transactionData.status === "completed") {
      if (tradeData.type === "buy") {
        const existing = await storage.getHolding(portfolio.id, tradeData.symbol);
        if (existing) {
          const newAmount = parseFloat(existing.amount) + executedAmount;
          const newAverage = (parseFloat(existing.averagePurchasePrice) * parseFloat(existing.amount) + executionPrice * executedAmount) / newAmount;
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            symbol: tradeData.symbol,
            name: marketPrice.name,
            amount: newAmount.toString(),
            averagePurchasePrice: newAverage.toString(),
            currentPrice: executionPrice.toString()
          });
        } else {
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            symbol: tradeData.symbol,
            name: marketPrice.name,
            amount: executedAmount.toString(),
            averagePurchasePrice: executionPrice.toString(),
            currentPrice: executionPrice.toString()
          });
        }
        const newCash = parseFloat(portfolio.availableCash) - netTotal;
        await storage.updatePortfolio(portfolio.id, {
          availableCash: newCash.toString()
        });
      } else {
        const holding = await storage.getHolding(portfolio.id, tradeData.symbol);
        const newAmount = parseFloat(holding.amount) - executedAmount;
        if (newAmount <= 1e-8) {
          await storage.deleteHolding(portfolio.id, tradeData.symbol);
        } else {
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            symbol: tradeData.symbol,
            name: holding.name,
            amount: newAmount.toString(),
            averagePurchasePrice: holding.averagePurchasePrice,
            currentPrice: executionPrice.toString()
          });
        }
        const newCash = parseFloat(portfolio.availableCash) + netTotal;
        await storage.updatePortfolio(portfolio.id, {
          availableCash: newCash.toString()
        });
      }
    }
    res.json({
      ...transaction,
      executionPrice: executionPrice.toFixed(TRADING_CONFIG.PRICE_PRECISION),
      tradingFee: tradingFee.toFixed(8),
      netTotal: netTotal.toFixed(2),
      slippageApplied: executionResult.slippage?.toFixed(6) || "0",
      executedAmount: executedAmount.toFixed(TRADING_CONFIG.AMOUNT_PRECISION),
      orderStatus: executionResult.status || "completed"
    });
  } catch (error) {
    console.error("Execute trade error:", error);
    if (error instanceof z3.ZodError) {
      return res.status(400).json({
        message: "Invalid trade data",
        errors: error.errors.map((e) => e.message)
      });
    }
    res.status(500).json({ message: "Failed to execute trade" });
  }
});
router3.get("/orderbook/:symbol", requireAuth, async (req, res) => {
  try {
    const { symbol } = req.params;
    const orderBook = await tradingEngine.getOrderBook(symbol.toUpperCase());
    res.json({
      symbol: symbol.toUpperCase(),
      bids: orderBook.bids.slice(0, 10).map((bid) => [
        bid.price.toFixed(TRADING_CONFIG.PRICE_PRECISION),
        bid.amount.toFixed(TRADING_CONFIG.AMOUNT_PRECISION)
      ]),
      asks: orderBook.asks.slice(0, 10).map((ask) => [
        ask.price.toFixed(TRADING_CONFIG.PRICE_PRECISION),
        ask.amount.toFixed(TRADING_CONFIG.AMOUNT_PRECISION)
      ]),
      spread: orderBook.spread.toFixed(TRADING_CONFIG.PRICE_PRECISION),
      lastUpdate: orderBook.lastUpdate
    });
  } catch (error) {
    console.error("Get order book error:", error);
    res.status(500).json({ message: "Failed to fetch order book" });
  }
});
router3.get("/history", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    const symbol = req.query.symbol;
    const type = req.query.type;
    const status = req.query.status;
    const transactions2 = await storage.getUserTransactions(userId, limit);
    let filteredTransactions = transactions2;
    if (symbol) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.symbol.toUpperCase() === symbol.toUpperCase()
      );
    }
    if (type) {
      filteredTransactions = filteredTransactions.filter((t) => t.type === type);
    }
    if (status) {
      filteredTransactions = filteredTransactions.filter((t) => t.status === status);
    }
    res.json(filteredTransactions);
  } catch (error) {
    console.error("Get trading history error:", error);
    res.status(500).json({ message: "Failed to fetch trading history" });
  }
});
router3.get("/stats", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions2 = await storage.getUserTransactions(userId, 1e3);
    const stats = {
      totalTrades: transactions2.length,
      totalVolume: transactions2.reduce((sum2, t) => sum2 + parseFloat(t.total), 0),
      totalFees: transactions2.reduce((sum2, t) => sum2 + parseFloat(t.fee || "0"), 0),
      successRate: transactions2.filter((t) => t.status === "completed").length / transactions2.length * 100,
      averageTradeSize: transactions2.length > 0 ? transactions2.reduce((sum2, t) => sum2 + parseFloat(t.total), 0) / transactions2.length : 0,
      favoriteAssets: transactions2.reduce((acc, t) => {
        acc[t.symbol] = (acc[t.symbol] || 0) + 1;
        return acc;
      }, {})
    };
    res.json(stats);
  } catch (error) {
    console.error("Get trading stats error:", error);
    res.status(500).json({ message: "Failed to fetch trading statistics" });
  }
});
router3.post("/calculate-fees", requireAuth, (req, res) => {
  try {
    const { amount, price, type, orderType } = req.body;
    const grossTotal = parseFloat(amount) * parseFloat(price);
    let feeRate = TRADING_CONFIG.TRADING_FEE_RATE;
    if (orderType === "market") {
      feeRate = TRADING_CONFIG.TAKER_FEE_RATE;
    } else if (orderType === "limit") {
      feeRate = TRADING_CONFIG.MAKER_FEE_RATE;
    }
    const tradingFee = calculateTradingFee(grossTotal, feeRate);
    const netTotal = type === "buy" ? grossTotal + tradingFee : grossTotal - tradingFee;
    res.json({
      grossTotal: grossTotal.toFixed(2),
      tradingFee: tradingFee.toFixed(8),
      netTotal: netTotal.toFixed(2),
      feeRate,
      feeType: orderType === "market" ? "taker" : "maker"
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid calculation parameters" });
  }
});
router3.get("/config", (req, res) => {
  res.json({
    ...TRADING_CONFIG,
    supportedOrderTypes: ["market", "limit", "stop_loss", "take_profit"],
    supportedAssets: Object.keys(tradingEngine)
  });
});
var trading_routes_default = router3;

// server/portfolio-routes.ts
init_storage();
init_simple_auth();
import { Router as Router4 } from "express";
var router4 = Router4();
router4.get("/portfolio", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    const userHoldings = await storage.getHoldings(portfolio.id);
    if (userHoldings.length === 0) {
      return res.json({
        totalValue: 0,
        totalInvested: 0,
        totalProfitLoss: 0,
        totalProfitLossPercent: 0,
        holdings: []
      });
    }
    const symbolToIdMap = {
      "BTC": "bitcoin",
      "ETH": "ethereum",
      "ADA": "cardano",
      "SOL": "solana",
      "DOT": "polkadot",
      "MATIC": "polygon",
      "LINK": "chainlink",
      "LTC": "litecoin"
    };
    const cryptoIds = userHoldings.map((h) => symbolToIdMap[h.symbol] || h.symbol.toLowerCase()).join(",");
    let prices = {};
    try {
      const priceResponse = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true`
      );
      if (priceResponse.ok) {
        prices = await priceResponse.json();
      }
    } catch (error) {
      console.log("Failed to fetch real-time prices, using fallback data");
    }
    const portfolioItems = userHoldings.map((holding) => {
      const cryptoId = symbolToIdMap[holding.symbol] || holding.symbol.toLowerCase();
      const priceData = prices[cryptoId] || {};
      const currentPrice = priceData.usd || parseFloat(holding.currentPrice) || 0;
      const change24h = priceData.usd_24h_change || 0;
      const amount = parseFloat(holding.amount);
      const avgPrice = parseFloat(holding.averagePurchasePrice);
      const currentValue = amount * currentPrice;
      const investedAmount = amount * avgPrice;
      const profitLoss = currentValue - investedAmount;
      const profitLossPercent = investedAmount > 0 ? profitLoss / investedAmount * 100 : 0;
      return {
        id: holding.id,
        symbol: holding.symbol,
        name: holding.name,
        quantity: amount,
        averagePrice: avgPrice,
        currentPrice,
        currentValue,
        profitLoss,
        profitLossPercent,
        change24h,
        investedAmount
      };
    });
    const totalValue = portfolioItems.reduce((sum2, item) => sum2 + item.currentValue, 0);
    const totalInvested = portfolioItems.reduce((sum2, item) => sum2 + item.investedAmount, 0);
    const totalProfitLoss = totalValue - totalInvested;
    const totalProfitLossPercent = totalInvested > 0 ? totalProfitLoss / totalInvested * 100 : 0;
    await storage.updatePortfolio(portfolio.id, {
      totalValue: totalValue.toString(),
      availableCash: parseFloat(portfolio.availableCash).toString()
    });
    res.json({
      totalValue,
      totalInvested,
      totalProfitLoss,
      totalProfitLossPercent,
      holdings: portfolioItems
    });
  } catch (error) {
    console.error("Portfolio fetch error:", error);
    res.status(500).json({ message: "Failed to fetch portfolio" });
  }
});
router4.post("/portfolio/add", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { symbol, quantity, price, name } = req.body;
    if (!userId || !symbol || !quantity || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    const existingHolding = await storage.getHolding(portfolio.id, symbol.toUpperCase());
    if (existingHolding) {
      const currentAmount = parseFloat(existingHolding.amount);
      const currentAvg = parseFloat(existingHolding.averagePurchasePrice);
      const newAmount = currentAmount + quantity;
      const newAveragePrice = (currentAmount * currentAvg + quantity * price) / newAmount;
      await storage.upsertHolding({
        portfolioId: portfolio.id,
        symbol: symbol.toUpperCase(),
        name: name || symbol.toUpperCase(),
        amount: newAmount.toString(),
        averagePurchasePrice: newAveragePrice.toString(),
        currentPrice: price.toString()
      });
    } else {
      await storage.upsertHolding({
        portfolioId: portfolio.id,
        symbol: symbol.toUpperCase(),
        name: name || symbol.toUpperCase(),
        amount: quantity.toString(),
        averagePurchasePrice: price.toString(),
        currentPrice: price.toString()
      });
    }
    res.json({ message: "Holding added successfully" });
  } catch (error) {
    console.error("Add holding error:", error);
    res.status(500).json({ message: "Failed to add holding" });
  }
});
router4.delete("/portfolio/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const holdingId = req.params.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    await storage.deleteHolding(holdingId);
    res.json({ message: "Holding removed successfully" });
  } catch (error) {
    console.error("Remove holding error:", error);
    res.status(500).json({ message: "Failed to remove holding" });
  }
});
router4.get("/portfolio/history", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const transactions2 = await storage.getUserTransactions(userId, 100);
    const historyData = [];
    let currentValue = 0;
    for (let i = 29; i >= 0; i--) {
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() - i);
      currentValue = 1e4 + Math.random() * 5e3 + i * 100;
      historyData.push({
        date: date.toISOString().split("T")[0],
        value: currentValue,
        change: i > 0 ? currentValue - (1e4 + (i - 1) * 100) : 0
      });
    }
    res.json(historyData);
  } catch (error) {
    console.error("Portfolio history error:", error);
    res.status(500).json({ message: "Failed to fetch portfolio history" });
  }
});

// server/portfolio-analytics-routes.ts
init_storage();
import { Router as Router5 } from "express";
var router5 = Router5();
router5.get("/analytics", async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const timeframe = req.query.timeframe || "7d";
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.json({
        totalValue: 0,
        totalCost: 0,
        totalPnL: 0,
        totalPnLPercentage: 0,
        dayPnL: 0,
        dayPnLPercentage: 0,
        holdings: [],
        performance: [],
        allocation: []
      });
    }
    const userTransactions = await storage.getUserTransactions(userId, 100);
    const existingHoldings = await storage.getHoldings(portfolio.id);
    const holdingsMap = /* @__PURE__ */ new Map();
    for (const holding of existingHoldings) {
      holdingsMap.set(holding.symbol, {
        symbol: holding.symbol,
        name: holding.name,
        totalAmount: parseFloat(holding.amount),
        totalCost: parseFloat(holding.amount) * parseFloat(holding.averagePurchasePrice),
        averagePurchasePrice: parseFloat(holding.averagePurchasePrice),
        currentPrice: parseFloat(holding.currentPrice),
        transactions: []
      });
    }
    for (const tx of userTransactions) {
      const existing = holdingsMap.get(tx.symbol);
      if (existing) {
        existing.transactions.push(tx);
      }
    }
    const holdings2 = Array.from(holdingsMap.values()).map((h) => ({
      ...h,
      currentValue: h.totalAmount * h.currentPrice,
      pnl: h.totalAmount * h.currentPrice - h.totalCost,
      pnlPercentage: h.totalCost > 0 ? (h.totalAmount * h.currentPrice - h.totalCost) / h.totalCost * 100 : 0
    }));
    const totalValue = holdings2.reduce((sum2, h) => sum2 + h.currentValue, 0);
    const totalCost = holdings2.reduce((sum2, h) => sum2 + h.totalCost, 0);
    const totalPnL = totalValue - totalCost;
    const totalPnLPercentage = totalCost > 0 ? totalPnL / totalCost * 100 : 0;
    res.json({
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercentage,
      dayPnL: 0,
      // Would need historical data
      dayPnLPercentage: 0,
      holdings: holdings2,
      performance: [],
      allocation: holdings2.map((h) => ({
        symbol: h.symbol,
        name: h.name,
        percentage: totalValue > 0 ? h.currentValue / totalValue * 100 : 0
      }))
    });
  } catch (error) {
    console.error("Portfolio analytics error:", error);
    res.status(500).json({ error: "Failed to fetch portfolio analytics" });
  }
});
var portfolio_analytics_routes_default = router5;

// server/alert-routes.ts
init_simple_auth();
init_storage();
import { Router as Router6 } from "express";
import { z as z4 } from "zod";
var router6 = Router6();
var createAlertSchema = z4.object({
  symbol: z4.string().min(1),
  type: z4.enum(["price_above", "price_below", "percent_change"]),
  targetPrice: z4.string().optional(),
  percentChange: z4.string().optional(),
  message: z4.string().optional()
});
router6.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const alerts = await storage.getUserAlerts(userId);
    res.json(alerts);
  } catch (error) {
    console.error("Get alerts error:", error);
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
});
router6.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const data = createAlertSchema.parse(req.body);
    const alert = await storage.createAlert({
      userId,
      symbol: data.symbol,
      type: data.type,
      targetPrice: data.targetPrice || null,
      percentChange: data.percentChange || null,
      message: data.message || `Price alert for ${data.symbol}`,
      isActive: true,
      isTriggered: false
    });
    res.json(alert);
  } catch (error) {
    console.error("Create alert error:", error);
    res.status(500).json({ message: "Failed to create alert" });
  }
});
router6.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const data = req.body;
    const alert = await storage.getAlertById(id);
    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: "Alert not found" });
    }
    const updated = await storage.updateAlert(id, data);
    res.json(updated);
  } catch (error) {
    console.error("Update alert error:", error);
    res.status(500).json({ message: "Failed to update alert" });
  }
});
router6.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const alert = await storage.getAlertById(id);
    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: "Alert not found" });
    }
    await storage.deleteAlert(id);
    res.json({ message: "Alert deleted successfully" });
  } catch (error) {
    console.error("Delete alert error:", error);
    res.status(500).json({ message: "Failed to delete alert" });
  }
});
router6.patch("/:id/toggle", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const alert = await storage.getAlertById(id);
    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: "Alert not found" });
    }
    const updated = await storage.updateAlert(id, { isActive: !alert.isActive });
    res.json(updated);
  } catch (error) {
    console.error("Toggle alert error:", error);
    res.status(500).json({ message: "Failed to toggle alert" });
  }
});
var alert_routes_default = router6;

// server/crypto-routes.ts
init_crypto_service();
import { Router as Router7 } from "express";
var router7 = Router7();
router7.get("/top/:limit?", async (req, res) => {
  try {
    const limit = parseInt(req.params.limit || "50");
    const data = await cryptoService.getMarketData(void 0, limit);
    res.json(data);
  } catch (error) {
    console.error("Error fetching top cryptos:", error);
    res.status(500).json({ message: "Failed to fetch top cryptocurrencies" });
  }
});
router7.get("/price/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const price = await cryptoService.getPrice(symbol);
    if (!price) {
      return res.status(404).json({ message: "Cryptocurrency not found" });
    }
    res.json(price);
  } catch (error) {
    console.error(`Error fetching price for ${req.params.symbol}:`, error);
    res.status(500).json({ message: "Failed to fetch cryptocurrency price" });
  }
});
router7.post("/prices", async (req, res) => {
  try {
    const { symbols } = req.body;
    if (!Array.isArray(symbols)) {
      return res.status(400).json({ message: "Symbols must be an array" });
    }
    const prices = await cryptoService.getPrices(symbols);
    const pricesMap = {};
    prices.forEach((price) => {
      if (price) {
        pricesMap[price.symbol.toLowerCase()] = {
          usd: price.price,
          usd_24h_change: price.change_24h,
          usd_24h_vol: price.volume_24h,
          usd_market_cap: price.market_cap,
          usd_24h_high: price.price * 1.05,
          usd_24h_low: price.price * 0.95
        };
      }
    });
    res.json(pricesMap);
  } catch (error) {
    console.error("Error fetching multiple prices:", error);
    res.status(500).json({ message: "Failed to fetch cryptocurrency prices" });
  }
});
router7.get("/details/:coinId", async (req, res) => {
  try {
    const { coinId } = req.params;
    const price = await cryptoService.getPrice(coinId);
    if (!price) {
      return res.status(404).json({ message: "Cryptocurrency not found" });
    }
    const details = {
      id: coinId.toLowerCase(),
      symbol: price.symbol,
      name: price.name,
      market_data: {
        current_price: { usd: price.price },
        price_change_percentage_24h: price.change_24h,
        market_cap: { usd: price.market_cap },
        total_volume: { usd: price.volume_24h }
      },
      description: {
        en: `${price.name} is a cryptocurrency with symbol ${price.symbol}.`
      },
      links: {
        homepage: ["#"],
        blockchain_site: ["#"]
      }
    };
    res.json(details);
  } catch (error) {
    console.error(`Error fetching details for ${req.params.coinId}:`, error);
    res.status(500).json({ message: "Failed to fetch cryptocurrency details" });
  }
});
router7.get("/market-data", async (req, res) => {
  try {
    const topCryptos = await cryptoService.getMarketData(void 0, 100);
    const totalMarketCap = topCryptos.reduce((sum2, crypto4) => sum2 + (crypto4.market_cap || 0), 0);
    const totalVolume = topCryptos.reduce((sum2, crypto4) => sum2 + (crypto4.total_volume || 0), 0);
    const marketData = {
      total_market_cap: { usd: totalMarketCap },
      total_volume: { usd: totalVolume },
      market_cap_percentage: {
        btc: topCryptos.find((c) => c.symbol === "btc")?.market_cap / totalMarketCap * 100 || 0,
        eth: topCryptos.find((c) => c.symbol === "eth")?.market_cap / totalMarketCap * 100 || 0
      },
      market_cap_change_percentage_24h_usd: 2.34
      // Mock value
    };
    res.json(marketData);
  } catch (error) {
    console.error("Error fetching market data:", error);
    res.status(500).json({ message: "Failed to fetch market data" });
  }
});
router7.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Query parameter is required" });
    }
    const allCryptos = await cryptoService.getMarketData(void 0, 100);
    const searchResults = allCryptos.filter(
      (crypto4) => crypto4.name.toLowerCase().includes(query.toLowerCase()) || crypto4.symbol.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 20).map((crypto4) => ({
      id: crypto4.id || crypto4.symbol.toLowerCase(),
      name: crypto4.name,
      symbol: crypto4.symbol,
      market_cap_rank: crypto4.market_cap_rank,
      thumb: crypto4.image || `https://assets.coingecko.com/coins/images/1/thumb/${crypto4.symbol.toLowerCase()}.png`
    }));
    res.json(searchResults);
  } catch (error) {
    console.error("Error searching cryptocurrencies:", error);
    res.status(500).json({ message: "Failed to search cryptocurrencies" });
  }
});
router7.get("/history/:coinId", async (req, res) => {
  try {
    const { coinId } = req.params;
    const { period = "24h" } = req.query;
    const history = await cryptoService.getPriceHistory(coinId, period);
    res.json(history);
  } catch (error) {
    console.error(`Error fetching price history for ${req.params.coinId}:`, error);
    res.status(500).json({ message: "Failed to fetch price history" });
  }
});
router7.get("/trending", async (req, res) => {
  try {
    const trending = await cryptoService.getTrendingCryptos();
    res.json(trending);
  } catch (error) {
    console.error("Error fetching trending cryptocurrencies:", error);
    res.status(500).json({ message: "Failed to fetch trending cryptocurrencies" });
  }
});
var crypto_routes_default = router7;

// server/metals-routes.ts
init_metals_service();
import { Router as Router8 } from "express";
var router8 = Router8();
router8.get("/price/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const price = await metalsService.getPrice(symbol);
    if (!price) {
      return res.status(404).json({
        message: `Price data not found for ${symbol}`
      });
    }
    res.json(price);
  } catch (error) {
    console.error("Error fetching metal price:", error);
    res.status(500).json({
      message: "Failed to fetch metal price"
    });
  }
});
router8.post("/prices", async (req, res) => {
  try {
    const { symbols } = req.body;
    if (!Array.isArray(symbols)) {
      return res.status(400).json({
        message: "Symbols must be an array"
      });
    }
    const prices = await metalsService.getPrices(symbols);
    res.json(prices);
  } catch (error) {
    console.error("Error fetching metal prices:", error);
    res.status(500).json({
      message: "Failed to fetch metal prices"
    });
  }
});
router8.get("/top/:limit?", async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    if (limit > 50) {
      return res.status(400).json({
        message: "Limit cannot exceed 50"
      });
    }
    const topMetals = await metalsService.getTopMetals(limit);
    res.json(topMetals);
  } catch (error) {
    console.error("Error fetching top metals:", error);
    res.status(500).json({
      message: "Failed to fetch top metals"
    });
  }
});
router8.get("/market-data", async (req, res) => {
  try {
    const marketData = await metalsService.getMarketData();
    res.json(marketData);
  } catch (error) {
    console.error("Error fetching metals market data:", error);
    res.status(500).json({
      message: "Failed to fetch market data"
    });
  }
});
router8.get("/history/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = "24h" } = req.query;
    const validPeriods = ["24h", "7d", "30d", "1y"];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({
        message: "Invalid period. Use: 24h, 7d, 30d, 1y"
      });
    }
    const history = await metalsService.getPriceHistory(symbol, period);
    res.json(history);
  } catch (error) {
    console.error("Error fetching price history:", error);
    res.status(500).json({
      message: "Failed to fetch price history"
    });
  }
});
router8.get("/cache-stats", async (req, res) => {
  try {
    res.json({
      cacheSize: metalsService.getCacheSize(),
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Error fetching cache stats:", error);
    res.status(500).json({
      message: "Failed to fetch cache statistics"
    });
  }
});
router8.delete("/cache", async (req, res) => {
  try {
    metalsService.clearCache();
    res.json({
      message: "Cache cleared successfully",
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Error clearing cache:", error);
    res.status(500).json({
      message: "Failed to clear cache"
    });
  }
});
router8.get("/health", async (req, res) => {
  try {
    const testPrice = await metalsService.getPrice("XAU");
    res.json({
      status: "healthy",
      timestamp: Date.now(),
      service: "metals-api",
      test_data: testPrice ? "available" : "fallback"
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({
      status: "unhealthy",
      timestamp: Date.now(),
      service: "metals-api",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
var metals_routes_default = router8;

// server/news-routes.ts
init_storage();
import { Router as Router9 } from "express";
var router9 = Router9();
var fallbackNews = [
  {
    id: "1",
    title: "Bitcoin Reaches New Monthly High Amid Institutional Interest",
    description: "Bitcoin price surges as major institutions continue to show increased interest in cryptocurrency investments.",
    summary: "Bitcoin price surges as major institutions continue to show increased interest in cryptocurrency investments.",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400",
    urlToImage: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1e3).toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1e3).toISOString(),
    source: { id: "crypto-news", name: "Crypto News" },
    category: "bitcoin",
    sentiment: "positive",
    coins: ["bitcoin"]
  },
  {
    id: "2",
    title: "Ethereum 2.0 Staking Rewards Show Strong Performance",
    description: "Ethereum staking continues to show robust returns as the network processes record transaction volumes.",
    summary: "Ethereum staking continues to show robust returns as the network processes record transaction volumes.",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
    urlToImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1e3).toISOString(),
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1e3).toISOString(),
    source: { id: "eth-daily", name: "ETH Daily" },
    category: "ethereum",
    sentiment: "positive",
    coins: ["ethereum"]
  },
  {
    id: "3",
    title: "DeFi Protocols See Record Trading Volume",
    description: "Decentralized finance protocols are experiencing unprecedented trading activity as institutional adoption grows.",
    summary: "Decentralized finance protocols are experiencing unprecedented trading activity.",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1e3).toISOString(),
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1e3).toISOString(),
    source: { id: "defi-pulse", name: "DeFi Pulse" },
    category: "defi",
    sentiment: "positive",
    coins: ["ethereum", "chainlink", "polygon"]
  },
  {
    id: "4",
    title: "Regulatory Clarity Emerges for Cryptocurrency Sector",
    description: "New regulatory frameworks provide clearer guidelines for cryptocurrency operations and compliance.",
    summary: "New regulatory frameworks provide clearer guidelines for cryptocurrency operations.",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400",
    urlToImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1e3).toISOString(),
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1e3).toISOString(),
    source: { id: "crypto-regulation", name: "Crypto Regulation News" },
    category: "regulation",
    sentiment: "positive",
    coins: ["bitcoin", "ethereum"]
  },
  {
    id: "5",
    title: "Altcoins Show Strong Market Performance",
    description: "Alternative cryptocurrencies are demonstrating significant price momentum and trading volume increases.",
    summary: "Alternative cryptocurrencies are demonstrating significant price momentum.",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400",
    urlToImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400",
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1e3).toISOString(),
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1e3).toISOString(),
    source: { id: "altcoin-buzz", name: "Altcoin Buzz" },
    category: "altcoins",
    sentiment: "positive",
    coins: ["solana", "cardano", "polygon"]
  }
];
router9.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    try {
      const dbNews = await storage.getNewsArticles(limit);
      if (dbNews && dbNews.length > 0) {
        let filteredNews = dbNews;
        if (category && category !== "all") {
          filteredNews = dbNews.filter(
            (article) => article.category === category || article.coins && article.coins.includes(category)
          );
        }
        return res.json(filteredNews.slice(0, limit));
      }
    } catch (dbError) {
      console.warn("Database news fetch failed, using fallback:", dbError);
    }
    let articles = [...fallbackNews];
    if (category && category !== "all") {
      articles = articles.filter(
        (article) => article.category === category || article.coins && article.coins.includes(category)
      );
    }
    articles = articles.map((article) => ({
      ...article,
      publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1e3).toISOString(),
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1e3).toISOString()
    }));
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    res.json(articles.slice(0, limit));
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Failed to fetch news articles" });
  }
});
router9.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const allNews = await storage.getNewsArticles(100);
      const article2 = allNews.find((a) => a.id === id);
      if (article2) {
        return res.json(article2);
      }
    } catch (dbError) {
      console.warn("Database news fetch failed:", dbError);
    }
    const article = fallbackNews.find((a) => a.id === id);
    if (article) {
      return res.json(article);
    }
    res.status(404).json({ message: "News article not found" });
  } catch (error) {
    console.error("Error fetching news article:", error);
    res.status(500).json({ message: "Failed to fetch news article" });
  }
});
router9.get("/search", async (req, res) => {
  try {
    const query = req.query.query;
    const limit = parseInt(req.query.limit) || 10;
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }
    try {
      const allNews = await storage.getNewsArticles(100);
      const searchResults2 = allNews.filter(
        (article) => article.title.toLowerCase().includes(query.toLowerCase()) || article.description.toLowerCase().includes(query.toLowerCase())
      );
      if (searchResults2.length > 0) {
        return res.json({
          articles: searchResults2.slice(0, limit),
          totalResults: searchResults2.length,
          status: "ok"
        });
      }
    } catch (dbError) {
      console.warn("Database news search failed:", dbError);
    }
    const searchResults = fallbackNews.filter(
      (article) => article.title.toLowerCase().includes(query.toLowerCase()) || article.description.toLowerCase().includes(query.toLowerCase())
    );
    res.json({
      articles: searchResults.slice(0, limit),
      totalResults: searchResults.length,
      status: "ok"
    });
  } catch (error) {
    console.error("Error searching news:", error);
    res.status(500).json({
      articles: [],
      totalResults: 0,
      status: "error"
    });
  }
});
router9.get("/categories", (req, res) => {
  try {
    const categories = [
      "all",
      "bitcoin",
      "ethereum",
      "defi",
      "nft",
      "regulation",
      "altcoins",
      "blockchain",
      "market-analysis"
    ];
    res.json(categories);
  } catch (error) {
    console.error("Error fetching news categories:", error);
    res.status(500).json({ message: "Failed to fetch news categories" });
  }
});
router9.post("/admin/create", async (req, res) => {
  try {
    const { title, description, url, imageUrl, category, coins } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
    const newsArticle = await storage.createNewsArticle({
      title,
      description,
      summary: description.substring(0, 150),
      url: url || "#",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400",
      category: category || "general",
      coins: coins || [],
      sentiment: "neutral",
      source: { id: "admin", name: "Admin" }
    });
    res.json(newsArticle);
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({ message: "Failed to create news article" });
  }
});
router9.put("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, url, imageUrl, category, coins } = req.body;
    const updatedArticle = await storage.updateNewsArticle(id, {
      title,
      description,
      summary: description?.substring(0, 150),
      url,
      imageUrl,
      category,
      coins
    });
    if (!updatedArticle) {
      return res.status(404).json({ message: "News article not found" });
    }
    res.json(updatedArticle);
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ message: "Failed to update news article" });
  }
});
router9.delete("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteNewsArticle(id);
    res.json({ message: "News article deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ message: "Failed to delete news article" });
  }
});
router9.get("/analytics", async (req, res) => {
  try {
    const analytics = await storage.getNewsAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});
var news_routes_default = router9;

// server/routes.ts
import { z as z14 } from "zod";
var checkDbAvailable = () => {
  try {
    return storage.isDbConnected();
  } catch (error) {
    console.error("Database connection check failed:", error);
    return false;
  }
};
var registerSchema = z14.object({
  username: z14.string().min(3).max(30),
  email: z14.string().email(),
  password: z14.string().min(6),
  firstName: z14.string().min(1),
  lastName: z14.string().min(1)
});
var loginSchema = z14.object({
  emailOrUsername: z14.string().min(1),
  password: z14.string().min(1)
});
async function registerRoutes(app2) {
  app2.use(createSessionMiddleware());
  app2.use(loadUser);
  app2.get("/health", (req, res) => {
    res.json({
      status: "OK",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      database: checkDbAvailable() ? "connected" : "disconnected"
    });
  });
  const checkDbConnection = (req, res, next) => {
    if (!checkDbAvailable()) {
      return res.status(503).json({
        message: "Database not available. Please check DATABASE_URL configuration."
      });
    }
    next();
  };
  app2.use("/api/portfolio", router4);
  app2.use("/api/portfolio/analytics", portfolio_analytics_routes_default);
  app2.use("/api/trading", trading_routes_default);
  app2.use("/api/crypto", crypto_routes_default);
  app2.use("/api/metals", metals_routes_default);
  const metalsTrading = (await Promise.resolve().then(() => (init_metals_trading_routes(), metals_trading_routes_exports))).default;
  app2.use("/api/metals-trading", metalsTrading);
  app2.use("/api/news", news_routes_default);
  const marketResearchRoutes = (await Promise.resolve().then(() => (init_market_research_routes(), market_research_routes_exports))).default;
  app2.use("/api/research", marketResearchRoutes);
  const stakingRoutes = (await Promise.resolve().then(() => (init_staking_routes(), staking_routes_exports))).default;
  app2.use("/api/staking", stakingRoutes);
  const lendingRoutes = (await Promise.resolve().then(() => (init_lending_routes(), lending_routes_exports))).default;
  app2.use("/api/lending", lendingRoutes);
  const investmentPlansRoutes = (await Promise.resolve().then(() => (init_investment_plans_routes(), investment_plans_routes_exports))).default;
  app2.use("/api/investment-plans", investmentPlansRoutes);
  const savingsPlansRoutes = (await Promise.resolve().then(() => (init_savings_plans_routes(), savings_plans_routes_exports))).default;
  app2.use("/api/savings-plans", savingsPlansRoutes);
  const { registerProofUploadRoutes: registerProofUploadRoutes2 } = await Promise.resolve().then(() => (init_proof_upload_routes(), proof_upload_routes_exports));
  registerProofUploadRoutes2(app2);
  const apiDocsRoutes = (await Promise.resolve().then(() => (init_api_docs_routes(), api_docs_routes_exports))).default;
  app2.use("/api/docs", apiDocsRoutes);
  app2.post("/api/admin/auth/login", checkDbConnection, async (req, res) => {
    try {
      const { emailOrUsername, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmailOrUsername(emailOrUsername, emailOrUsername);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }
      if (!user.isActive) {
        return res.status(401).json({ message: "Admin account is disabled" });
      }
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      req.session.userId = user.id;
      req.session.userRole = "admin";
      let portfolio = await storage.getPortfolio(user.id);
      if (!portfolio) {
        portfolio = await storage.createPortfolio({
          userId: user.id,
          totalValue: "100000.00",
          availableCash: "100000.00"
        });
      }
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        portfolio
      });
    } catch (error) {
      console.error("Admin login error:", error);
      if (error instanceof z14.ZodError) {
        return res.status(400).json({ message: "Invalid input data" });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/user/auth/login", checkDbConnection, async (req, res) => {
    try {
      const { emailOrUsername, password } = req.body;
      console.log("Login attempt:", { emailOrUsername, password: password ? "***" : "missing" });
      if (!emailOrUsername || !password) {
        console.log("Missing credentials");
        return res.status(400).json({ message: "Missing credentials" });
      }
      let user = await storage.getUserByEmail(emailOrUsername);
      if (!user) {
        user = await storage.getUserByUsername(emailOrUsername);
      }
      console.log("User found:", user ? { id: user.id, email: user.email, username: user.username } : "none");
      if (!user) {
        console.log("User not found");
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isValid = await verifyPassword(password, user.password);
      console.log("Password valid:", isValid);
      if (!isValid) {
        console.log("Invalid password");
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (!user.isActive) {
        console.log("Account disabled");
        return res.status(401).json({ message: "Account is disabled" });
      }
      if (user.role === "admin") {
        return res.status(403).json({ message: "Please use admin login" });
      }
      req.session.userId = user.id;
      req.session.userRole = "user";
      console.log("Session created for user:", user.id);
      let portfolio = await storage.getPortfolio(user.id);
      if (!portfolio) {
        portfolio = await storage.createPortfolio({
          userId: user.id,
          totalValue: "0.00",
          availableCash: "0.00"
        });
      }
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        portfolio
      });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z14.ZodError) {
        return res.status(400).json({ message: "Invalid input data" });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/admin/auth/logout", (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Admin logout failed" });
      }
      res.json({ message: "Admin logged out successfully" });
    });
  });
  app2.post("/api/user/auth/logout", (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "User logout failed" });
      }
      res.json({ message: "User logged out successfully" });
    });
  });
  app2.get("/api/admin/auth/user", requireAuth, requireAdmin, async (req, res) => {
    try {
      const user = req.user;
      const fullUser = await storage.getUser(user.id);
      if (!fullUser) {
        return res.status(404).json({ message: "Admin user not found" });
      }
      let portfolio = await storage.getPortfolio(user.id);
      if (!portfolio) {
        portfolio = await storage.createPortfolio({
          userId: user.id,
          totalValue: "100000.00",
          availableCash: "100000.00"
        });
      }
      const { password, ...safeUserData } = fullUser;
      res.json({
        ...safeUserData,
        portfolio,
        lastLogin: (/* @__PURE__ */ new Date()).toISOString(),
        isAuthenticated: true
      });
    } catch (error) {
      console.error("Admin user fetch error:", error);
      res.status(500).json({ message: "Failed to fetch admin user" });
    }
  });
  app2.get("/api/user/auth/user", requireAuth, async (req, res) => {
    try {
      const user = req.user;
      if (user.role === "admin") {
        return res.status(403).json({ message: "Use admin endpoints for admin users" });
      }
      const fullUser = await storage.getUser(user.id);
      if (!fullUser) {
        return res.status(404).json({ message: "User not found" });
      }
      let portfolio = await storage.getPortfolio(user.id);
      if (!portfolio) {
        portfolio = await storage.createPortfolio({
          userId: user.id,
          totalValue: "15000.00",
          availableCash: "5000.00"
        });
      }
      const { password, ...safeUserData } = fullUser;
      res.json({
        ...safeUserData,
        portfolio,
        lastLogin: (/* @__PURE__ */ new Date()).toISOString(),
        isAuthenticated: true
      });
    } catch (error) {
      console.error("User fetch error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/user/auth/register", checkDbConnection, async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      const existingUser = await storage.getUserByEmailOrUsername(userData.email, userData.username);
      if (existingUser) {
        return res.status(400).json({
          message: existingUser.email === userData.email ? "Email already registered" : "Username already taken"
        });
      }
      const hashedPassword = await hashPassword(userData.password);
      const user = await storage.createUser({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: "user",
        isActive: true
      });
      const portfolio = await storage.createPortfolio({
        userId: user.id,
        totalValue: "15000.00",
        availableCash: "5000.00"
      });
      req.session.userId = user.id;
      req.session.userRole = "user";
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        portfolio
      });
    } catch (error) {
      console.error("User registration error:", error);
      if (error instanceof z14.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "User registration failed" });
    }
  });
  app2.get("/api/user/settings", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...safeUserData } = user;
      res.json(safeUserData);
    } catch (error) {
      console.error("Error fetching user settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });
  app2.patch("/api/auth/profile", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { username, email, firstName, lastName, profileImageUrl } = req.body;
      if (email) {
        const currentUser = await storage.getUser(userId);
        if (currentUser?.email !== email) {
          const existingUser = await storage.getUserByEmail(email);
          if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
          }
        }
      }
      const updates = {};
      if (username) updates.username = username;
      if (email) updates.email = email;
      if (firstName) updates.firstName = firstName;
      if (lastName) updates.lastName = lastName;
      if (profileImageUrl) updates.profileImageUrl = profileImageUrl;
      await storage.updateUser(userId, updates);
      const updatedUser = await storage.getUser(userId);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  app2.post("/api/auth/change-password", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword, confirmPassword } = req.body;
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New passwords do not match" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      const user = await storage.getUser(userId);
      if (!user || !user.password) {
        return res.status(404).json({ message: "User not found" });
      }
      const isValidPassword = await verifyPassword(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      const hashedNewPassword = await hashPassword(newPassword);
      await storage.updateUser(userId, { password: hashedNewPassword });
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  app2.post("/api/trade", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const portfolio = await storage.getPortfolio(userId);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      const { type, symbol, amount, price, total, name } = req.body;
      const tradeData = {
        userId: req.user.id,
        type,
        symbol,
        amount,
        price,
        total,
        status: "completed",
        name: name || symbol
        // Add name to trade data
      };
      const transaction = await storage.createTransaction(tradeData);
      if (tradeData.type === "buy") {
        const existing = await storage.getHolding(portfolio.id, tradeData.symbol);
        if (existing) {
          const newAmount = parseFloat(existing.amount) + parseFloat(tradeData.amount);
          const newAverage = (parseFloat(existing.amount) * parseFloat(existing.averagePurchasePrice) + parseFloat(tradeData.amount) * parseFloat(tradeData.price)) / newAmount;
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            symbol: tradeData.symbol,
            name: req.body.name || tradeData.symbol,
            amount: newAmount.toString(),
            averagePurchasePrice: newAverage.toString(),
            currentPrice: tradeData.price
          });
        } else {
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            symbol: tradeData.symbol,
            name: req.body.name || tradeData.symbol,
            amount: tradeData.amount,
            averagePurchasePrice: tradeData.price,
            currentPrice: tradeData.price
          });
        }
        const newCash = parseFloat(portfolio.availableCash) - parseFloat(tradeData.total);
        await storage.updatePortfolio(portfolio.id, { availableCash: newCash.toString() });
      }
      res.json(transaction);
    } catch (error) {
      console.error("Error executing trade:", error);
      res.status(500).json({ message: "Failed to execute trade" });
    }
  });
  app2.get("/api/news", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const articles = await storage.getNewsArticles(limit);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });
  app2.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const users2 = await storage.getAllUsers();
      const usersWithPortfolios = await Promise.all(
        users2.map(async (u) => {
          const portfolio = await storage.getPortfolio(u.id);
          return { ...u, portfolio };
        })
      );
      res.json(usersWithPortfolios);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.post("/api/admin/simulate-balance", requireAdmin, async (req, res) => {
    try {
      const adminUser = await storage.getUser(req.user.id);
      if (!adminUser || adminUser.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { targetUserId, adjustmentType, amount, currency, reason } = req.body;
      const adjustment = await storage.createBalanceAdjustment({
        adminId: adminUser.id,
        targetUserId,
        adjustmentType,
        amount,
        currency,
        reason
      });
      const portfolio = await storage.getPortfolio(targetUserId);
      if (portfolio) {
        let newValue;
        const currentValue = parseFloat(portfolio.totalValue);
        const adjustmentAmount = parseFloat(amount);
        switch (adjustmentType) {
          case "add":
            newValue = currentValue + adjustmentAmount;
            break;
          case "remove":
            newValue = Math.max(0, currentValue - adjustmentAmount);
            break;
          case "set":
            newValue = adjustmentAmount;
            break;
          default:
            return res.status(400).json({ message: "Invalid adjustment type" });
        }
        await storage.updatePortfolio(portfolio.id, {
          totalValue: newValue.toString(),
          availableCash: currency === "USD" ? newValue.toString() : portfolio.availableCash
        });
      }
      res.json(adjustment);
    } catch (error) {
      console.error("Error simulating balance:", error);
      res.status(500).json({ message: "Failed to simulate balance" });
    }
  });
  app2.get("/api/admin/adjustments/:userId?", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const adjustments = await storage.getBalanceAdjustments(req.params.userId);
      res.json(adjustments);
    } catch (error) {
      console.error("Error fetching adjustments:", error);
      res.status(500).json({ message: "Failed to fetch adjustments" });
    }
  });
  app2.post("/api/admin/news", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const articleData = insertNewsArticleSchema.parse(req.body);
      const article = await storage.createNewsArticle(articleData);
      res.json(article);
    } catch (error) {
      console.error("Error creating news article:", error);
      res.status(500).json({ message: "Failed to create news article" });
    }
  });
  app2.delete("/api/admin/news/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      await storage.deleteNewsArticle(req.params.id);
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error("Error deleting news article:", error);
      res.status(500).json({ message: "Failed to delete news article" });
    }
  });
  app2.use("/api/deposits", deposit_routes_default);
  app2.use("/api/withdrawals", withdrawal_routes_default);
  const adminRoutes = (await Promise.resolve().then(() => (init_admin_routes(), admin_routes_exports))).default;
  app2.use("/api/admin", adminRoutes);
  const adminAuthRoutes = (await Promise.resolve().then(() => (init_admin_auth_routes(), admin_auth_routes_exports))).default;
  app2.use("/admin", adminAuthRoutes);
  app2.use("/api/alerts", alert_routes_default);
  const chatRoutes = (await Promise.resolve().then(() => (init_chat_routes(), chat_routes_exports))).default;
  app2.use("/api/support/chat", chatRoutes);
  const kycRoutes = (await Promise.resolve().then(() => (init_kyc_routes(), kyc_routes_exports))).default;
  app2.use("/api/kyc", kycRoutes);
  const uploadRoutes = (await Promise.resolve().then(() => (init_upload_routes(), upload_routes_exports))).default;
  app2.use("/api/upload", uploadRoutes);
  const httpServer = createServer(app2);
  const { webSocketManager: webSocketManager2 } = await Promise.resolve().then(() => (init_websocket_server(), websocket_server_exports));
  webSocketManager2.initialize(httpServer);
  process.on("SIGTERM", () => {
    webSocketManager2.shutdown();
  });
  process.on("SIGINT", () => {
    webSocketManager2.shutdown();
  });
  return httpServer;
}

// server/price-monitor.ts
init_storage();
var PriceMonitorService = class {
  monitoringInterval = null;
  CHECK_INTERVAL = 3e4;
  // 30 seconds
  lastPrices = /* @__PURE__ */ new Map();
  // WebSocket related properties
  ws = null;
  reconnectInterval = null;
  prices = /* @__PURE__ */ new Map();
  isConnected = false;
  connectionAttempts = 0;
  maxConnectionAttempts = 3;
  async start() {
    console.log("\u{1F514} Starting price monitor service...");
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    await this.checkPriceAlerts();
    this.monitoringInterval = setInterval(async () => {
      await this.checkPriceAlerts();
    }, this.CHECK_INTERVAL);
    this.startConnectionWithDelay();
  }
  stop() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log("\u{1F514} Price monitor service stopped");
    }
    this.stopWebSocket();
  }
  stopWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
      console.log("WebSocket connection closed.");
    }
  }
  startConnectionWithDelay() {
    setTimeout(async () => {
      await this.connect();
    }, 5e3);
  }
  async connect() {
    console.log("\u{1F4CA} Running price monitor in HTTP-only mode (WebSocket disabled)");
    this.isConnected = true;
    this.connectionAttempts = 0;
  }
  reconnect() {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
    }
    this.reconnectInterval = setInterval(async () => {
      await this.connect();
    }, 5e3);
  }
  async checkPriceAlerts() {
    try {
      let alerts;
      try {
        alerts = await storage.getActivePriceAlerts();
      } catch (error) {
        console.error("Error getting active price alerts:", error);
        return;
      }
      if (!alerts || alerts.length === 0) {
        return;
      }
      const symbols = [...new Set(alerts.map((alert) => this.getCoinGeckoId(alert.symbol)))];
      const prices = await this.fetchCurrentPrices(symbols);
      if (!prices) {
        console.error("Failed to fetch prices for alert checking");
        return;
      }
      for (const alert of alerts) {
        try {
          const coinGeckoId = this.getCoinGeckoId(alert.symbol);
          const currentPrice = prices[coinGeckoId]?.usd;
          if (currentPrice && this.shouldTriggerAlert(alert, currentPrice)) {
            await this.triggerAlert(alert, currentPrice);
          }
        } catch (alertError) {
          console.error(`Error processing alert ${alert.id}:`, alertError);
        }
      }
      console.log(`\u2705 Checked ${alerts.length} price alerts`);
    } catch (error) {
      console.error("Error in checkPriceAlerts:", error);
    }
  }
  async fetchCurrentPrices(symbols) {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join(",")}&vs_currencies=usd&include_24h_change=true`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching prices:", error);
      return null;
    }
  }
  getCoinGeckoId(symbol) {
    const symbolMap = {
      "BTC": "bitcoin",
      "ETH": "ethereum",
      "BNB": "binancecoin",
      "ADA": "cardano",
      "SOL": "solana",
      "XRP": "ripple",
      "DOT": "polkadot",
      "DOGE": "dogecoin",
      "AVAX": "avalanche-2",
      "MATIC": "matic-network",
      "LTC": "litecoin",
      "UNI": "uniswap",
      "LINK": "chainlink",
      "ATOM": "cosmos",
      "XLM": "stellar",
      "VET": "vechain",
      "ICP": "internet-computer",
      "FIL": "filecoin",
      "TRX": "tron",
      "ETC": "ethereum-classic"
    };
    return symbolMap[symbol.toUpperCase()] || symbol.toLowerCase();
  }
  shouldTriggerAlert(alert, currentPrice) {
    const targetPrice = parseFloat(alert.targetPrice);
    const lastPrice = this.lastPrices.get(alert.symbol);
    if (lastPrice === void 0) {
      this.lastPrices.set(alert.symbol, currentPrice);
      if (alert.condition === "above") {
        return currentPrice > targetPrice;
      } else {
        return currentPrice < targetPrice;
      }
    }
    this.lastPrices.set(alert.symbol, currentPrice);
    if (alert.condition === "above") {
      return lastPrice <= targetPrice && currentPrice > targetPrice;
    } else {
      return lastPrice >= targetPrice && currentPrice < targetPrice;
    }
  }
  async triggerAlert(alert, currentPrice) {
    try {
      console.log(`\u{1F6A8} Alert triggered for ${alert.symbol}: ${currentPrice} ${alert.condition} ${alert.targetPrice}`);
      await storage.createNotification({
        userId: alert.userId,
        type: "price_alert",
        title: `Price Alert: ${alert.name}`,
        message: `${alert.symbol} is now ${alert.condition} $${alert.targetPrice}. Current price: $${currentPrice.toFixed(6)}`,
        data: {
          alertId: alert.id,
          symbol: alert.symbol,
          currentPrice,
          targetPrice: parseFloat(alert.targetPrice),
          condition: alert.condition
        }
      });
      await storage.updatePriceAlert(alert.id, { isActive: false });
      console.log(`\u2705 Alert notification created for user ${alert.userId}`);
    } catch (error) {
      console.error("Error triggering alert:", error);
    }
  }
};
var priceMonitor = new PriceMonitorService();

// server/vite.ts
import express from "express";
import fs4 from "fs";
import path6 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path5 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path5.resolve(import.meta.dirname, "client", "src"),
      "@shared": path5.resolve(import.meta.dirname, "shared"),
      "@assets": path5.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path5.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path5.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid as nanoid3 } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: {
      server,
      host: "0.0.0.0",
      port: 5173,
      clientPort: process.env.NODE_ENV === "development" ? 5173 : 443
    },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path6.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs4.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid3()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path6.resolve(import.meta.dirname, "public");
  if (!fs4.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path6.resolve(distPath, "index.html"));
  });
}

// server/seedData.ts
init_storage();
init_simple_auth();
async function seedDatabase() {
  try {
    console.log("\u{1F331} Starting database seeding...");
    const existingAdmin = await storage.getUserByEmail("admin@bitpanda.com");
    if (existingAdmin) {
      console.log("\u2705 Admin user already exists, skipping seed");
      return;
    }
    const adminPassword = await hashPassword("admin123");
    const adminUser = await storage.createUser({
      username: "admin",
      email: "admin@bitpanda.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      isActive: true
    });
    await storage.createPortfolio({
      userId: adminUser.id,
      totalValue: "100000.00",
      availableCash: "100000.00"
    });
    const demoPassword = await hashPassword("demo123");
    const demoUser = await storage.createUser({
      username: "demo",
      email: "demo@example.com",
      password: demoPassword,
      firstName: "Demo",
      lastName: "User",
      role: "user",
      isActive: true
    });
    const demoPortfolio = await storage.createPortfolio({
      userId: demoUser.id,
      totalValue: "15000.00",
      availableCash: "5000.00"
    });
    const sampleHoldings = [
      { symbol: "BTC", name: "Bitcoin", amount: "0.5", price: "45000" },
      { symbol: "ETH", name: "Ethereum", amount: "5", price: "2500" },
      { symbol: "ADA", name: "Cardano", amount: "1000", price: "0.5" }
    ];
    for (const holding of sampleHoldings) {
      await storage.upsertHolding({
        portfolioId: demoPortfolio.id,
        assetType: "crypto",
        symbol: holding.symbol,
        name: holding.name,
        amount: holding.amount,
        averagePurchasePrice: holding.price,
        currentPrice: holding.price
      });
      await storage.createTransaction({
        userId: demoUser.id,
        type: "buy",
        assetType: "crypto",
        symbol: holding.symbol,
        amount: holding.amount,
        price: holding.price,
        total: (parseFloat(holding.amount) * parseFloat(holding.price)).toString(),
        status: "completed"
      });
    }
    const newsArticles2 = [
      {
        title: "Bitcoin Reaches New All-Time High",
        content: "Bitcoin has surged to unprecedented levels as institutional adoption continues...",
        excerpt: "BTC breaks resistance levels with strong market momentum",
        source: "Crypto News",
        publishedAt: /* @__PURE__ */ new Date()
      },
      {
        title: "Ethereum 2.0 Staking Rewards Increase",
        content: "The latest Ethereum upgrade has improved staking rewards for validators...",
        excerpt: "ETH staking becomes more attractive for long-term holders",
        source: "DeFi Weekly",
        publishedAt: /* @__PURE__ */ new Date()
      }
    ];
    for (const article of newsArticles2) {
      await storage.createNewsArticle(article);
    }
    console.log("\u{1F3E6} Setting up shared wallet addresses...");
    try {
      const existingAddresses = await storage.getSharedWalletAddresses();
      if (existingAddresses.length === 0) {
        const walletAddresses = [
          { symbol: "BTC", name: "Bitcoin", address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", network: "mainnet" },
          { symbol: "ETH", name: "Ethereum", address: "0x742F96e08A82d6D91F1aE37df26B12C75a1cF86e", network: "mainnet" },
          { symbol: "USDT", name: "Tether", address: "0x742F96e08A82d6D91F1aE37df26B12C75a1cF86e", network: "ethereum" },
          { symbol: "BNB", name: "Binance Coin", address: "bnb1jw7qkv5r8x3v4x8wqnrzr2t8s5k6g3h7d2f1a0", network: "bsc" },
          { symbol: "ADA", name: "Cardano", address: "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a6gtajun6cjskw3", network: "cardano" },
          { symbol: "SOL", name: "Solana", address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM", network: "solana" },
          { symbol: "XRP", name: "Ripple", address: "rDNvpSjsGdPaAHWMKhv8iPtF3mBYYR2PpK", network: "xrpl" },
          { symbol: "DOT", name: "Polkadot", address: "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5", network: "polkadot" },
          { symbol: "MATIC", name: "Polygon", address: "0x742F96e08A82d6D91F1aE37df26B12C75a1cF86e", network: "polygon" },
          { symbol: "LINK", name: "Chainlink", address: "0x742F96e08A82d6D91F1aE37df26B12C75a1cF86e", network: "ethereum" }
        ];
        for (const address of walletAddresses) {
          await storage.createOrUpdateSharedWalletAddress(address);
        }
        console.log(`\u2705 Created ${walletAddresses.length} shared wallet addresses`);
      } else {
        console.log(`\u2705 Found ${existingAddresses.length} existing wallet addresses`);
      }
    } catch (error) {
      console.log("\u26A0\uFE0F  Wallet addresses seeding skipped (method not available yet)");
    }
    console.log("\u2705 Database seeding completed successfully");
    console.log("\u{1F4CA} Created accounts:");
    console.log("   Admin: admin@bitpanda.com / admin123");
    console.log("   Demo:  demo@example.com / demo123");
  } catch (error) {
    console.error("\u274C Database seeding failed:", error);
    throw error;
  }
}
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}

// server/index.ts
init_websocket_server();

// server/chat-websocket.ts
init_storage();
import { WebSocketServer as WebSocketServer2, WebSocket as WebSocket2 } from "ws";
var ChatWebSocketManager = class {
  wss = null;
  clients = /* @__PURE__ */ new Map();
  sessionClients = /* @__PURE__ */ new Map();
  // sessionId -> set of clientIds
  initialize(server) {
    if (this.wss) {
      this.wss.close();
    }
    this.wss = new WebSocketServer2({
      noServer: true
    });
    const originalUpgrade = server.emit;
    server.on("upgrade", (request, socket, head) => {
      try {
        const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
        if (pathname === "/ws/chat") {
          this.wss.handleUpgrade(request, socket, head, (ws) => {
            this.wss.emit("connection", ws, request);
          });
        }
      } catch (error) {
        console.error("Chat WebSocket upgrade error:", error);
        socket.destroy();
      }
    });
    this.wss.on("connection", (ws, request) => {
      const clientId = this.generateClientId();
      console.log(`\u{1F4AC} Chat WebSocket client connected: ${clientId}`);
      ws.on("message", async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(clientId, ws, message);
        } catch (error) {
          console.error("\u{1F4AC} Chat WebSocket message error:", error);
          this.sendToClient(ws, {
            type: "error",
            message: "Invalid message format"
          });
        }
      });
      ws.on("close", () => {
        console.log(`\u{1F4AC} Chat WebSocket client disconnected: ${clientId}`);
        this.removeClient(clientId);
      });
      ws.on("error", (error) => {
        console.error(`\u{1F4AC} Chat WebSocket error for client ${clientId}:`, error);
        this.removeClient(clientId);
      });
      this.sendToClient(ws, {
        type: "connection",
        message: "Connected to chat server",
        clientId
      });
    });
    console.log("\u{1F4AC} Chat WebSocket server initialized on /ws/chat");
  }
  async handleMessage(clientId, ws, message) {
    try {
      switch (message.type) {
        case "authenticate":
          await this.handleAuthentication(clientId, ws, message);
          break;
        case "join_session":
          await this.handleJoinSession(clientId, message);
          break;
        case "send_message":
          await this.handleSendMessage(clientId, message);
          break;
        case "typing":
          await this.handleTyping(clientId, message);
          break;
        case "leave_session":
          this.handleLeaveSession(clientId);
          break;
        default:
          this.sendToClient(ws, {
            type: "error",
            message: "Unknown message type"
          });
      }
    } catch (error) {
      console.error("Error handling chat message:", error);
      this.sendToClient(ws, {
        type: "error",
        message: "Failed to process message"
      });
    }
  }
  async handleAuthentication(clientId, ws, message) {
    const { userId, role } = message;
    this.clients.set(clientId, {
      ws,
      userId,
      role: role || "user",
      lastActivity: /* @__PURE__ */ new Date()
    });
    this.sendToClient(ws, {
      type: "authenticated",
      message: "Authentication successful"
    });
  }
  async handleJoinSession(clientId, message) {
    const { sessionId, userId } = message;
    const client = this.clients.get(clientId);
    if (!client) {
      return;
    }
    const session2 = await storage.getChatSession(sessionId);
    if (!session2 || session2.userId !== userId && client.role !== "admin") {
      this.sendToClient(client.ws, {
        type: "error",
        message: "Access denied to this session"
      });
      return;
    }
    client.sessionId = sessionId;
    this.clients.set(clientId, client);
    if (!this.sessionClients.has(sessionId)) {
      this.sessionClients.set(sessionId, /* @__PURE__ */ new Set());
    }
    this.sessionClients.get(sessionId).add(clientId);
    this.broadcastToSession(sessionId, {
      type: "user_joined",
      userId: client.userId,
      role: client.role
    }, clientId);
    this.sendToClient(client.ws, {
      type: "session_joined",
      sessionId,
      message: "Successfully joined session"
    });
  }
  async handleSendMessage(clientId, message) {
    const { sessionId, message: messageText, attachmentUrl, messageType } = message;
    const client = this.clients.get(clientId);
    if (!client || client.sessionId !== sessionId) {
      return;
    }
    this.broadcastToSession(sessionId, {
      type: "new_message",
      sessionId,
      senderId: client.userId,
      message: messageText,
      attachmentUrl,
      messageType: messageType || "text",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async handleTyping(clientId, message) {
    const { sessionId, isTyping } = message;
    const client = this.clients.get(clientId);
    if (!client || client.sessionId !== sessionId) {
      return;
    }
    this.broadcastToSession(sessionId, {
      type: "user_typing",
      userId: client.userId,
      isTyping
    }, clientId);
  }
  handleLeaveSession(clientId) {
    const client = this.clients.get(clientId);
    if (!client || !client.sessionId) {
      return;
    }
    const sessionId = client.sessionId;
    const sessionClients = this.sessionClients.get(sessionId);
    if (sessionClients) {
      sessionClients.delete(clientId);
      if (sessionClients.size === 0) {
        this.sessionClients.delete(sessionId);
      }
    }
    this.broadcastToSession(sessionId, {
      type: "user_left",
      userId: client.userId
    }, clientId);
    client.sessionId = void 0;
    this.clients.set(clientId, client);
  }
  removeClient(clientId) {
    const client = this.clients.get(clientId);
    if (client && client.sessionId) {
      this.handleLeaveSession(clientId);
    }
    this.clients.delete(clientId);
  }
  broadcastToSession(sessionId, message, excludeClientId) {
    const sessionClients = this.sessionClients.get(sessionId);
    if (!sessionClients) {
      return;
    }
    sessionClients.forEach((clientId) => {
      if (clientId === excludeClientId) {
        return;
      }
      const client = this.clients.get(clientId);
      if (client && client.ws.readyState === WebSocket2.OPEN) {
        this.sendToClient(client.ws, message);
      }
    });
  }
  sendToClient(ws, message) {
    if (ws.readyState === WebSocket2.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
  generateClientId() {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  // Public methods for external use
  notifySessionStatusChange(sessionId, status, agentName) {
    this.broadcastToSession(sessionId, {
      type: "session_status_changed",
      sessionId,
      status,
      agentName
    });
  }
  notifyNewMessage(sessionId, messageData) {
    this.broadcastToSession(sessionId, {
      type: "new_message",
      sessionId,
      ...messageData
    });
  }
  getActiveSessionsCount() {
    return this.sessionClients.size;
  }
  getConnectedClientsCount() {
    return this.clients.size;
  }
  shutdown() {
    this.clients.clear();
    this.sessionClients.clear();
    if (this.wss) {
      this.wss.close();
    }
  }
};
var chatWebSocketManager = new ChatWebSocketManager();

// server/watchlist-routes.ts
init_simple_auth();
init_storage();
import { Router as Router22 } from "express";
import { z as z15 } from "zod";
var router22 = Router22();
var addToWatchlistSchema = z15.object({
  symbol: z15.string().min(1),
  name: z15.string().min(1),
  notes: z15.string().optional()
});
router22.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const watchlist = await storage.getUserWatchlist(userId);
    res.json(watchlist);
  } catch (error) {
    console.error("Get watchlist error:", error);
    res.status(500).json({ message: "Failed to fetch watchlist" });
  }
});
router22.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const data = addToWatchlistSchema.parse(req.body);
    const item = await storage.addToWatchlist({
      userId,
      symbol: data.symbol,
      name: data.name,
      notes: data.notes || null
    });
    res.json(item);
  } catch (error) {
    console.error("Add to watchlist error:", error);
    res.status(500).json({ message: "Failed to add to watchlist" });
  }
});
router22.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { notes } = req.body;
    const item = await storage.getWatchlistItem(id);
    if (!item || item.userId !== userId) {
      return res.status(404).json({ message: "Watchlist item not found" });
    }
    const updated = await storage.updateWatchlistItem(id, { notes });
    res.json(updated);
  } catch (error) {
    console.error("Update watchlist error:", error);
    res.status(500).json({ message: "Failed to update watchlist item" });
  }
});
router22.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const item = await storage.getWatchlistItem(id);
    if (!item || item.userId !== userId) {
      return res.status(404).json({ message: "Watchlist item not found" });
    }
    await storage.removeFromWatchlist(id);
    res.json({ message: "Removed from watchlist successfully" });
  } catch (error) {
    console.error("Remove from watchlist error:", error);
    res.status(500).json({ message: "Failed to remove from watchlist" });
  }
});
var watchlist_routes_default = router22;

// server/api-keys-routes.ts
init_simple_auth();
init_storage();
import { Router as Router23 } from "express";
import { z as z16 } from "zod";
import crypto3 from "crypto";
var router23 = Router23();
var createApiKeySchema = z16.object({
  name: z16.string().min(1),
  permissions: z16.array(z16.string()).optional(),
  expiresAt: z16.string().optional()
});
function generateApiKey() {
  return "bp_" + crypto3.randomBytes(32).toString("hex");
}
router23.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const apiKeys = await storage.getUserApiKeys(userId);
    res.json(apiKeys);
  } catch (error) {
    console.error("Get API keys error:", error);
    res.status(500).json({ message: "Failed to fetch API keys" });
  }
});
router23.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const data = createApiKeySchema.parse(req.body);
    const apiKey = generateApiKey();
    const key = await storage.createApiKey({
      userId,
      name: data.name,
      key: apiKey,
      permissions: data.permissions || ["read"],
      isActive: true,
      expiresAt: data.expiresAt || null
    });
    res.json(key);
  } catch (error) {
    console.error("Create API key error:", error);
    res.status(500).json({ message: "Failed to create API key" });
  }
});
router23.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, permissions } = req.body;
    const apiKey = await storage.getApiKeyById(id);
    if (!apiKey || apiKey.userId !== userId) {
      return res.status(404).json({ message: "API key not found" });
    }
    const updated = await storage.updateApiKey(id, { name, permissions });
    res.json(updated);
  } catch (error) {
    console.error("Update API key error:", error);
    res.status(500).json({ message: "Failed to update API key" });
  }
});
router23.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const apiKey = await storage.getApiKeyById(id);
    if (!apiKey || apiKey.userId !== userId) {
      return res.status(404).json({ message: "API key not found" });
    }
    await storage.revokeApiKey(id);
    res.json({ message: "API key revoked successfully" });
  } catch (error) {
    console.error("Revoke API key error:", error);
    res.status(500).json({ message: "Failed to revoke API key" });
  }
});
router23.patch("/:id/toggle", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const apiKey = await storage.getApiKeyById(id);
    if (!apiKey || apiKey.userId !== userId) {
      return res.status(404).json({ message: "API key not found" });
    }
    const updated = await storage.updateApiKey(id, { isActive: !apiKey.isActive });
    res.json(updated);
  } catch (error) {
    console.error("Toggle API key error:", error);
    res.status(500).json({ message: "Failed to toggle API key" });
  }
});
var api_keys_routes_default = router23;

// server/index.ts
import path7 from "path";
import fs5 from "fs";
import { fileURLToPath as fileURLToPath2 } from "url";
var app = express2();
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://0.0.0.0:5000",
    "https://*.replit.app",
    "https://*.replit.dev",
    ...process.env.REPLIT_DOMAINS?.split(",") || []
  ].flat();
  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.some(
    (allowed) => allowed === origin || allowed.includes("*") && origin?.endsWith(allowed.replace("*", ""))
  );
  if (isAllowed || !origin) {
    res.header("Access-Control-Allow-Origin", origin || "*");
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(express2.json({ limit: "10mb" }));
app.use(express2.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET || "some-super-secret-and-long-string"));
var csrfProtection = csrf({
  secret: process.env.CSRF_SECRET || "some-super-secret-and-long-string-that-is-at-least-32-characters-long",
  cookieName: "_csrf",
  headerName: "X-CSRF-Token",
  cookieOptions: {
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  }
});
app.use(csrfProtection);
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken });
});
app.use((req, res, next) => {
  console.log(`${(/* @__PURE__ */ new Date()).toISOString()} - ${req.method} ${req.path}`);
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  const path8 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path8.startsWith("/api")) {
      let logLine = `${req.method} ${path8} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      if (err.code === "EBADCSRFTOKEN") {
        res.status(403).json({ message: "Invalid CSRF token" });
      } else {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
        console.error(`Error occurred: ${err.stack || err}`);
      }
    });
    try {
      await seedDatabase();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn("\u26A0\uFE0F  Database seeding failed (this is normal if already seeded):", errorMessage);
    }
    const uploadsDir2 = path7.join(process.cwd(), "uploads", "proofs");
    if (!fs5.existsSync(uploadsDir2)) {
      fs5.mkdirSync(uploadsDir2, { recursive: true });
      console.log("\u{1F4C1} Created uploads directory structure");
    }
    const __filename2 = fileURLToPath2(import.meta.url);
    const __dirname2 = path7.dirname(__filename2);
    app.use("/uploads", (req, res, next) => {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ error: "Authentication required" });
      }
      next();
    }, express2.static(path7.join(__dirname2, "../uploads")));
    app.use("/api/withdrawals", withdrawal_routes_default);
    app.use("/api/watchlist", watchlist_routes_default);
    app.use("/api/api-keys", api_keys_routes_default);
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    app.use(express2.static(path7.join(__dirname2, "../client/dist")));
    app.get("/admin*", (req, res) => {
      const adminHtmlPath = path7.join(__dirname2, "../client/dist/admin.html");
      if (fs5.existsSync(adminHtmlPath)) {
        res.sendFile(adminHtmlPath);
      } else {
        res.sendFile(path7.join(__dirname2, "../client/admin.html"));
      }
    });
    app.get("*", (req, res) => {
      res.sendFile(path7.join(__dirname2, "../client/dist/index.html"));
    });
    const port = parseInt(process.env.PORT || "5000");
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`\u274C Port ${port} is already in use. Trying to kill existing processes...`);
        process.exit(1);
      } else {
        console.error("\u274C Server error:", err);
        process.exit(1);
      }
    });
    server.listen(port, "0.0.0.0", () => {
      console.log(`
\u{1F680} Server running on http://0.0.0.0:${port}
\u{1F4CA} Portfolio Analytics: /api/portfolio/analytics
\u{1F514} Price Alerts: /api/alerts
\u{1F4B0} Trading: /api/trading
\u{1F465} Admin: /api/admin
\u{1F48E} Crypto Data: /api/crypto
\u{1F48D} Precious Metals: /api/metals
\u{1F4F0} News: /api/news
\u{1F50D} Market Research: /api/research
\u{1F4B8} Withdrawals: /api/withdrawals
\u{1F4E1} WebSocket: ws://0.0.0.0:${port}/ws
`);
    });
    webSocketManager.initialize(server);
    chatWebSocketManager.initialize(server);
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      webSocketManager.shutdown();
      chatWebSocketManager.shutdown();
      server.close(() => {
        console.log("Process terminated");
      });
    });
    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down gracefully");
      webSocketManager.shutdown();
      chatWebSocketManager.shutdown();
      server.close(() => {
        console.log("Process terminated");
      });
    });
    priceMonitor.start();
  } catch (error) {
    console.error("\u274C Failed to start server:", error);
    process.exit(1);
  }
})();
