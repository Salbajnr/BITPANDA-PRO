CREATE TYPE "public"."asset_type" AS ENUM('crypto', 'metal');--> statement-breakpoint
CREATE TYPE "public"."deposit_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."kyc_status" AS ENUM('pending', 'under_review', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('binance', 'bybit', 'crypto_com', 'bank_transfer', 'other');--> statement-breakpoint
CREATE TYPE "public"."ticket_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('open', 'in_progress', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('buy', 'sell', 'deposit', 'withdrawal');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."withdrawal_method" AS ENUM('bank_transfer', 'crypto_wallet', 'paypal', 'other');--> statement-breakpoint
CREATE TYPE "public"."withdrawal_status" AS ENUM('pending', 'under_review', 'approved', 'rejected', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "admin_action_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"admin_id" text NOT NULL,
	"action" text NOT NULL,
	"target_id" text,
	"target_user_id" text,
	"details" text,
	"ip_address" text,
	"user_agent" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "advanced_orders" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"symbol" text NOT NULL,
	"order_type" text NOT NULL,
	"side" text NOT NULL,
	"amount" text NOT NULL,
	"trigger_price" text,
	"limit_price" text,
	"trailing_percent" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"filled_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"key_hash" text NOT NULL,
	"permissions" json NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"rate_limit" integer DEFAULT 1000 NOT NULL,
	"last_used" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_key_hash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"admin_id" text NOT NULL,
	"action" text NOT NULL,
	"target_id" text,
	"target_user_id" text,
	"details" text,
	"ip_address" text,
	"user_agent" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "balance_adjustments" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" text NOT NULL,
	"target_user_id" text NOT NULL,
	"adjustment_type" text NOT NULL,
	"amount" numeric(20, 8) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deposits" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"amount" numeric(20, 8) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"asset_type" "asset_type" DEFAULT 'crypto' NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"status" "deposit_status" DEFAULT 'pending' NOT NULL,
	"rejection_reason" text,
	"proof_image_url" text,
	"admin_notes" text,
	"approved_by_id" text,
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "holdings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" varchar NOT NULL,
	"asset_type" "asset_type" NOT NULL,
	"symbol" varchar(10) NOT NULL,
	"name" varchar(100) NOT NULL,
	"amount" numeric(20, 8) NOT NULL,
	"average_purchase_price" numeric(20, 8) NOT NULL,
	"current_price" numeric(20, 8) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "investment_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"plan_name" text NOT NULL,
	"amount" text NOT NULL,
	"current_value" text NOT NULL,
	"expected_return" text,
	"actual_return" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kyc_verifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"date_of_birth" timestamp NOT NULL,
	"nationality" varchar NOT NULL,
	"address" text NOT NULL,
	"city" varchar NOT NULL,
	"postal_code" varchar NOT NULL,
	"country" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"document_type" varchar NOT NULL,
	"document_number" varchar NOT NULL,
	"document_front_image_url" varchar NOT NULL,
	"document_back_image_url" varchar,
	"selfie_image_url" varchar NOT NULL,
	"status" "kyc_status" DEFAULT 'pending' NOT NULL,
	"reviewed_by" varchar,
	"reviewed_at" timestamp,
	"rejection_reason" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "kyc_verifications_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "lending_positions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"asset_symbol" text NOT NULL,
	"amount" text NOT NULL,
	"apy" text NOT NULL,
	"type" text NOT NULL,
	"total_earned" text DEFAULT '0',
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "live_chat_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar NOT NULL,
	"sender_id" varchar NOT NULL,
	"message" text NOT NULL,
	"message_type" varchar DEFAULT 'text' NOT NULL,
	"attachment_url" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "live_chat_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"agent_id" varchar,
	"agent_name" varchar,
	"status" varchar DEFAULT 'waiting' NOT NULL,
	"subject" varchar,
	"started_at" timestamp DEFAULT now(),
	"ended_at" timestamp,
	"rating" integer,
	"feedback" text
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"asset_symbol" text NOT NULL,
	"amount" text NOT NULL,
	"collateral_symbol" text NOT NULL,
	"collateral_amount" text NOT NULL,
	"interest_rate" text NOT NULL,
	"loan_term" text NOT NULL,
	"total_interest" text DEFAULT '0',
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"repayment_date" timestamp,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "metals_pricing" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol" text NOT NULL,
	"name" text NOT NULL,
	"price_per_ounce" numeric(20, 8) NOT NULL,
	"change_percent_24h" numeric(10, 4),
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news_articles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"content" text,
	"excerpt" text,
	"image_url" varchar,
	"source" varchar(100) NOT NULL,
	"source_url" varchar,
	"published_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "otp_tokens" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"token" varchar(6) NOT NULL,
	"type" varchar(20) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"attempts" numeric(2, 0) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"token" varchar NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "platform_settings" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"updated_by_id" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "platform_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"total_value" numeric(20, 8) DEFAULT '0.00' NOT NULL,
	"available_cash" numeric(20, 8) DEFAULT '0.00' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_alerts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"symbol" text NOT NULL,
	"target_price" text NOT NULL,
	"alert_type" text DEFAULT 'above' NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_triggered" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" varchar(20) NOT NULL,
	"price" numeric(20, 8) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "savings_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"plan_name" text NOT NULL,
	"amount" text NOT NULL,
	"frequency" text NOT NULL,
	"total_saved" text DEFAULT '0' NOT NULL,
	"interest_earned" text DEFAULT '0' NOT NULL,
	"next_deposit" timestamp,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"auto_deposit" boolean DEFAULT false,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shared_wallet_addresses" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol" text NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"network" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shared_wallet_addresses_symbol_unique" UNIQUE("symbol")
);
--> statement-breakpoint
CREATE TABLE "staking_positions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"asset_symbol" text NOT NULL,
	"amount" text NOT NULL,
	"apy" text NOT NULL,
	"staking_term" text NOT NULL,
	"auto_reinvest" boolean DEFAULT false,
	"total_rewards" text DEFAULT '0',
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "support_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" varchar NOT NULL,
	"sender_id" varchar NOT NULL,
	"message" text NOT NULL,
	"is_internal" boolean DEFAULT false NOT NULL,
	"attachment_urls" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"category" varchar NOT NULL,
	"priority" "ticket_priority" DEFAULT 'medium' NOT NULL,
	"status" "ticket_status" DEFAULT 'open' NOT NULL,
	"assigned_to" varchar,
	"attachment_urls" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" "transaction_type" NOT NULL,
	"asset_type" "asset_type" NOT NULL,
	"symbol" text NOT NULL,
	"amount" numeric(20, 8) NOT NULL,
	"price" numeric(20, 8) NOT NULL,
	"total" numeric(20, 8) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"fees" numeric(20, 8) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"email_notifications" boolean DEFAULT true NOT NULL,
	"trading_alerts" boolean DEFAULT true NOT NULL,
	"price_alerts" boolean DEFAULT false NOT NULL,
	"news_updates" boolean DEFAULT true NOT NULL,
	"marketing_emails" boolean DEFAULT false NOT NULL,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"session_timeout" numeric(3, 0) DEFAULT '24' NOT NULL,
	"login_notifications" boolean DEFAULT true NOT NULL,
	"theme" varchar DEFAULT 'light' NOT NULL,
	"language" varchar DEFAULT 'en' NOT NULL,
	"timezone" varchar DEFAULT 'UTC' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"preferred_currency" text DEFAULT 'USD' NOT NULL,
	"email_notifications" boolean DEFAULT true NOT NULL,
	"price_alerts" boolean DEFAULT true NOT NULL,
	"dark_mode" boolean DEFAULT false NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"first_name" varchar DEFAULT '' NOT NULL,
	"last_name" varchar DEFAULT '' NOT NULL,
	"profile_image_url" varchar,
	"supabase_uid" varchar,
	"display_name" varchar,
	"photo_url" varchar,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"wallet_balance" numeric(20, 8) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_supabase_uid_unique" UNIQUE("supabase_uid")
);
--> statement-breakpoint
CREATE TABLE "watchlist" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"symbols" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "withdrawal_limits" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"daily_limit" numeric(20, 8) DEFAULT '10000' NOT NULL,
	"monthly_limit" numeric(20, 8) DEFAULT '50000' NOT NULL,
	"daily_used" numeric(20, 8) DEFAULT '0' NOT NULL,
	"monthly_used" numeric(20, 8) DEFAULT '0' NOT NULL,
	"last_reset_date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "withdrawal_limits_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "withdrawals" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"amount" numeric(20, 8) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"withdrawal_method" "withdrawal_method" NOT NULL,
	"destination_address" text,
	"destination_details" jsonb,
	"status" "withdrawal_status" DEFAULT 'pending' NOT NULL,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp,
	"completed_at" timestamp,
	"rejection_reason" text,
	"admin_notes" text,
	"transaction_hash" text,
	"fees" numeric(20, 8) DEFAULT '0' NOT NULL,
	"net_amount" numeric(20, 8) NOT NULL,
	"reviewed_by_id" text,
	"reviewed_at" timestamp,
	"confirmation_token" text,
	"confirmation_expires_at" timestamp,
	"is_confirmed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_action_logs" ADD CONSTRAINT "admin_action_logs_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_action_logs" ADD CONSTRAINT "admin_action_logs_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "advanced_orders" ADD CONSTRAINT "advanced_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balance_adjustments" ADD CONSTRAINT "balance_adjustments_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balance_adjustments" ADD CONSTRAINT "balance_adjustments_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_plans" ADD CONSTRAINT "investment_plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kyc_verifications" ADD CONSTRAINT "kyc_verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kyc_verifications" ADD CONSTRAINT "kyc_verifications_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lending_positions" ADD CONSTRAINT "lending_positions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_chat_messages" ADD CONSTRAINT "live_chat_messages_session_id_live_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."live_chat_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_chat_messages" ADD CONSTRAINT "live_chat_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_chat_sessions" ADD CONSTRAINT "live_chat_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_chat_sessions" ADD CONSTRAINT "live_chat_sessions_agent_id_users_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_settings" ADD CONSTRAINT "platform_settings_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_plans" ADD CONSTRAINT "savings_plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staking_positions" ADD CONSTRAINT "staking_positions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_ticket_id_support_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawal_limits" ADD CONSTRAINT "withdrawal_limits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "price_history_symbol_idx" ON "price_history" USING btree ("symbol");--> statement-breakpoint
CREATE INDEX "price_history_timestamp_idx" ON "price_history" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");