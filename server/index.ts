import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // ✅ Prevent IPv6 networking issues on Render

import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { priceMonitor } from "./price-monitor";
import { setupVite, serveStatic, log } from "./vite";
import { portfolioRoutes } from "./portfolio-routes";
import { webSocketManager } from "./websocket-server";
import { chatWebSocketManager } from "./chat-websocket";
import { realTimePriceService } from "./real-time-price-service";
import cryptoRoutes from "./crypto-routes";
import tradingRoutes from "./trading-routes";
import adminRoutes from "./admin-routes";
import adminAuthRoutes from "./admin-auth-routes";
import authRoutes from "./auth-routes";
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

const app = express();

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
app.use('/api/admin', adminRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
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

/* ==============================
   Start Server
============================== */
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const httpServer = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

/* ==============================
   Vite Setup (Development) or Static Files (Production)
============================== */
(async () => {
  if (process.env.NODE_ENV === 'production') {
    serveStatic(app);
  } else {
    await setupVite(app, httpServer);
  }

  // Initialize WebSockets
  webSocketManager.init(httpServer);
  chatWebSocketManager.init(httpServer);

  // Start price monitoring
  priceMonitor.start();
  realTimePriceService.startPriceUpdates();
})();

// Initialize database
(async () => {
  try {
    await initializeDatabase();
    console.log("✅ Database initialization completed");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    console.log("🔄 Server will continue with limited functionality...");
  }
})();