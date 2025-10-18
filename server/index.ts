import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // ✅ Prevent IPv6 networking issues on Render

import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { priceMonitor } from "./price-monitor";
import { setupVite, serveStatic, log } from "./vite-setup";
import { portfolioRoutes } from "./portfolio-routes";
import { webSocketManager } from "./websocket-server";
import { chatWebSocketManager } from "./chat-websocket";
import { adminWebSocketManager } from "./admin-websocket";
import { realTimePriceService } from "./real-time-price-service";
import { portfolioRealtimeService } from "./portfolio-realtime-service";
import { pushNotificationService } from "./push-notification-service";
import { liveAnalyticsService } from "./live-analytics-service";
import { pool } from "./db";
import { validateEnvironment } from "./env-validator";
import cryptoRoutes from "./crypto-routes";
import tradingRoutes from "./trading-routes";
import adminRoutes from "./admin-routes";
import adminAuthRoutes from "./admin-auth-routes";
import authRoutes from "./auth-routes";
import userRoutes from './user-routes';
import alertRoutes from "./alert-routes";
import depositRoutes from "./deposit-routes";
import withdrawalRoutes from "./withdrawal-routes";
import portfolioAnalyticsRoutes from "./portfolio-analytics-routes";
import metalsRoutes from "./metals-routes";
import newsRoutes from "./news-routes";
import kycRoutes from "./kyc-routes";
import marketResearchRoutes from "./market-research-routes";
import chatRoutes from "./chat-routes";
import investmentPlansRoutes from "./investment-plans-routes";
import savingsPlansRoutes from "./savings-plans-routes";
import stakingRoutes from "./staking-routes";
import lendingRoutes from "./lending-routes";
import watchlistRoutes from "./watchlist-routes";
import apiKeysRoutes from "./api-keys-routes";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import sseRoutes from "./sse-routes";
import publicApiRoutes from "./public-api-routes";
import apiDocsRoutes from "./api-docs-routes";
import analyticsRoutes from "./analytics-routes";
import comprehensiveAnalyticsRoutes from "./comprehensive-analytics-routes";
import apiManagementRoutes from "./api-management-routes";
import metalsTrading from "./metals-trading-routes";
import comprehensiveCrudRoutes from "./comprehensive-crud-routes";
import uploadRoutes from "./upload-routes";
import { registerProofUploadRoutes } from "./proof-upload-routes";

const app = express();

// Validate environment variables
if (!validateEnvironment()) {
  console.log('⚠️ Server starting with incomplete configuration...');
}

// Trust proxy for production deployments
app.set('trust proxy', 1);

/* ==============================
   CORS Middleware
============================== */
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://0.0.0.0:5000",
    "https://*.onrender.com",
    "https://*.replit.app",
    "https://*.replit.dev",
    ...(process.env.REPLIT_DOMAINS?.split(",") || []),
  ].flat();

  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.some(
    (allowed) =>
      allowed === origin ||
      (allowed.includes("*") && origin?.endsWith(allowed.replace("*", "")))
  );

  if (isAllowed || !origin) {
    res.header("Access-Control-Allow-Origin", origin || "*");
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET || "super-secret-fallback"));

/* ==============================
   Vite Setup (Development) or Static Files (Production)
============================== */
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: (req as any).csrfToken?.() || null });
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

/* ==============================
   Logging & Monitoring
============================== */
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`);
  });
  next();
});

/* ==============================
   Route Registration
============================== */
registerRoutes(app);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/trading', tradingRoutes);
// Admin routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/portfolio-analytics', portfolioAnalyticsRoutes);
app.use('/api/metals', metalsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/market-research', marketResearchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/investment-plans', investmentPlansRoutes);
app.use('/api/savings-plans', savingsPlansRoutes);
app.use('/api/staking', stakingRoutes);
app.use('/api/lending', lendingRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/api-keys', apiKeysRoutes);

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/keys', apiKeysRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/metals', metalsRoutes);
app.use('/api/public', publicApiRoutes);
app.use('/api/docs', apiDocsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/comprehensive-analytics', comprehensiveAnalyticsRoutes);
app.use('/api/portfolio-analytics', portfolioAnalyticsRoutes);
app.use('/api/support/chat', chatRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/api-management', apiManagementRoutes);
app.use('/api/market-research', marketResearchRoutes);
app.use('/api/savings-plans', savingsPlansRoutes);
app.use('/api/investment-plans', investmentPlansRoutes);
app.use('/api/staking', stakingRoutes);
app.use('/api/lending', lendingRoutes);
app.use('/api/metals-trading', metalsTrading);
app.use('/api/crud', comprehensiveCrudRoutes);
app.use('/api/upload', uploadRoutes);
registerProofUploadRoutes(app);
app.use('/api/sse', sseRoutes);



// Initialize database
async function initializeDatabase() {
  try {
    // Test database connection
    if (!pool) {
      console.log("🎭 Running in demo mode - database features disabled");
      return true;
    }

    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();

    console.log("✅ Database connection verified");
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.warn("⚠️ Database connection failed, switching to demo mode:", error.message);
    } else {
      console.warn("⚠️ Database connection failed, switching to demo mode:", error);
    }
    return false;
  }
}

(async () => {
  try {
    // Start HTTP server
    const httpServer = app.listen(PORT, HOST, async () => {
      console.log(`🚀 Server running on ${HOST}:${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Setup Vite or static files
    if (process.env.NODE_ENV === 'production') {
      serveStatic(app);
    } else {
      await setupVite(app, httpServer);
    }

    // Initialize WebSocket servers
    webSocketManager.init(httpServer);
    chatWebSocketManager.init(httpServer);
    adminWebSocketManager.init(httpServer);

    // Start real-time services
    realTimePriceService.start();
    portfolioRealtimeService.start();
    liveAnalyticsService.start();
    priceMonitor.start();

    console.log('🚀 All real-time services initialized');
    console.log('📡 WebSocket endpoints:');
    console.log('  - /ws (price updates)');
    console.log('  - /ws/chat (chat system)');
    console.log('  - /ws/admin (admin dashboard)');
    console.log('📡 SSE endpoints:');
    console.log('  - /api/sse/notifications/stream (user notifications)');
    console.log('  - /api/sse/admin/stream (admin updates)');

    // Initialize database
    const dbConnected = await initializeDatabase();
    if (dbConnected && pool) {
      console.log("✅ Database initialization completed");
    } else {
      console.log("🎭 Application ready in demo mode");
    }
  } catch (error) {
    console.warn("⚠️ Database initialization failed, running in demo mode");
    console.log("🎭 Application ready with limited functionality");
  }
})();

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server and real-time services.');

  // Shutdown all real-time services
  webSocketManager.shutdown();
  chatWebSocketManager.shutdown();
  adminWebSocketManager.shutdown();
  realTimePriceService.stop();
  portfolioRealtimeService.stop();
  liveAnalyticsService.stop();
  priceMonitor.stop();

  // Close the database pool
  if (pool) {
    await pool.end();
    console.log('✅ Database pool closed.');
  }

  console.log('👋 Server gracefully shut down.');
  process.exit(0);
});