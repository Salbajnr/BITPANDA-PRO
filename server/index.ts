import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // ✅ Avoid IPv6 issues on Render

import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";
import { priceMonitor } from "./price-monitor";
import { portfolioRoutes } from "./portfolio-routes";
import { webSocketManager } from "./websocket-server";
import { chatWebSocketManager } from "./chat-websocket";
import { adminWebSocketManager } from "./admin-websocket";
import { realTimePriceService } from "./real-time-price-service";
import { portfolioRealtimeService } from "./portfolio-realtime-service";
import { liveAnalyticsService } from "./live-analytics-service";
import { validateEnvironment } from "./env-validator";
import { pool } from "./db";
import { healthRouter } from "./health";

// ESM __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === ROUTES ===
import cryptoRoutes from "./crypto-routes";
import tradingRoutes from "./trading-routes";
import adminRoutes from "./admin-routes";
import adminAuthRoutes from "./admin-auth-routes";
import authRoutes from "./auth-routes";
import userRoutes from "./user-routes";
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
import sseRoutes from "./sse-routes";
import publicApiRoutes from "./public-api-routes";
import apiDocsRoutes from "./api-docs-routes";
import analyticsRoutes from "./analytics-routes";
import comprehensiveAnalyticsRoutes from "./comprehensive-analytics-routes";
import apiManagementRoutes from "./api-management-routes";
import metalsTradingRoutes from "./metals-trading-routes";
import comprehensiveCrudRoutes from "./comprehensive-crud-routes";
import uploadRoutes from "./upload-routes";
import { registerProofUploadRoutes } from "./proof-upload-routes";

const app = express();

// === ENVIRONMENT VALIDATION ===
validateEnvironment();

// === BASIC CONFIG ===
app.set("trust proxy", 1);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET || "super-secret-fallback"));

// Health check endpoint
app.use(healthRouter);

// === CORS Configuration ===
app.use((req, res, next) => {
  const allowedOrigins = [
    // Development
    "http://localhost:5173", // Vite dev server
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    
    // Production
    "https://bitpanda-pro.onrender.com",
    "https://bitpanda-pro-frontnd.onrender.com",
    
    // Wildcard domains for subdomains
    "https://*.onrender.com",
    
    // Environment variables
    ...(process.env.CLIENT_URL?.split(',') || []),
    ...(process.env.ALLOWED_ORIGINS?.split(',') || [])
  ].filter(Boolean); // Remove any empty strings

  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.some(allowedOrigin => {
    // Exact match
    if (allowedOrigin === origin) return true;
    
    // Wildcard subdomain match
    if (allowedOrigin.startsWith('*.')) {
      const domain = allowedOrigin.substring(2); // Remove '*.'
      return origin?.endsWith(domain);
    }
    
    return false;
  });
  
  // Set CORS headers
  if (isAllowed && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  // Continue to the next middleware
  next();
});

// === HEALTH CHECK ===
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// === LOGGING ===
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`);
  });
  next();
});

// API-only mode - No static file serving
console.log('🚀 Running in API-only mode');
console.log('ℹ️ Client is being served separately');

// Remove any existing static file serving middleware
app.get('*', (req, res, next) => {
  if (!req.path.startsWith('/api/')) {
    return res.status(404).json({
      status: 'error',
      message: 'Not Found',
      details: 'This is an API-only server. Please use the client application to access this resource.'
    });
  }
  next();
});

// === ROUTES ===
registerRoutes(app);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/crypto", cryptoRoutes);
app.use("/api/trading", tradingRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/api-keys", apiKeysRoutes);
app.use("/api/metals", metalsRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/investment-plans", investmentPlansRoutes);
app.use("/api/savings-plans", savingsPlansRoutes);
app.use("/api/staking", stakingRoutes);
app.use("/api/lending", lendingRoutes);
app.use("/api/market-research", marketResearchRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/api-management", apiManagementRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/comprehensive-analytics", comprehensiveAnalyticsRoutes);
app.use("/api/public", publicApiRoutes);
app.use("/api/docs", apiDocsRoutes);
app.use("/api/metals-trading", metalsTradingRoutes);
app.use("/api/crud", comprehensiveCrudRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/sse", sseRoutes);
registerProofUploadRoutes(app);
app.use("/api/support/chat", chatRoutes);

// === 404 HANDLER FOR API ===
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Catch-all handler: send back React app for any non-API routes
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }

  // In development, let Vite handle it
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  // In production, serve the React app
  const prodIndex = path.resolve(__dirname, '..', 'dist', 'public', 'index.html');
  if (fs.existsSync(prodIndex)) {
    return res.sendFile(prodIndex);
  }

  // Fallback to previous path for older setups
  const legacyIndex = path.resolve(__dirname, '..', 'client', 'dist', 'index.html');
  if (fs.existsSync(legacyIndex)) {
    return res.sendFile(legacyIndex);
  }

  res.status(404).send('Client build not found. Make sure the client is built to ../dist/public');
});

// === SERVER START ===
// In production, serve on PORT (defaults to 5000). In dev, use BACKEND_PORT (3001)
const PORT = process.env.NODE_ENV === "production"
  ? Number(process.env.PORT) || 5000
  : Number(process.env.BACKEND_PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

(async () => {
  try {
    const httpServer = app.listen(PORT, HOST, () => {
      console.log(`🚀 Backend API Server running on ${HOST}:${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      if (pool) {
        console.log("✅ Database connection pool initialized");
      } else {
        console.log("⚠️ Running in demo mode (no database)");
      }
    });

    // === INIT WEBSOCKETS ===
    webSocketManager.init(httpServer);
    chatWebSocketManager.init(httpServer);
    adminWebSocketManager.init(httpServer);

    // === START REAL-TIME SERVICES ===
    realTimePriceService.start();
    portfolioRealtimeService.start();
    liveAnalyticsService.start();
    priceMonitor.start();

    console.log("✅ All real-time services initialized");
  } catch (err) {
    console.error("❌ Server initialization failed:", err);
  }
})();

// === GRACEFUL SHUTDOWN ===
process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received — shutting down...");

  webSocketManager.shutdown();
  chatWebSocketManager.shutdown();
  adminWebSocketManager.shutdown();
  realTimePriceService.stop();
  portfolioRealtimeService.stop();
  liveAnalyticsService.stop();
  priceMonitor.stop();

  if (pool) {
    await pool.end();
    console.log("✅ Database pool closed.");
  }

  console.log("👋 Server gracefully shut down.");
  process.exit(0);
});