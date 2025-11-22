import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // ✅ Avoid IPv6 issues on Render

// Load environment variables from .env file first
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ESM __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import express from "express";
import cookieParser from "cookie-parser";
import fs from "fs";
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
import { createSessionMiddleware } from "./session";
import { supabaseAuthService } from './supabase-auth-service';
import { isSupabaseConfigured } from './supabase';
import { supabaseHealthMonitor } from './supabase-health-check';

// === ROUTES ===
import cryptoRoutes from "./crypto-routes";
import tradingRoutes from "./trading-routes";
import adminRoutes from "./admin-routes";
import adminAuthRoutes from "./admin-auth-routes";
import adminPlansRoutes from "./admin-plans-routes";
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
import oauthRoutes from "./oauth-routes";
import oauthCallbackRoutes from "./oauth-callback-routes";
import csrfRoutes from "./csrf-routes";
import comprehensiveApiRoutes from "./comprehensive-api-routes";
import supabaseAuthRoutes from "./supabase-auth-routes";
import supabaseHealthRoutes from './supabase-health-routes';
import testEmailRoute from './test-email-route';
import firebaseAuthRoutes from './firebase-auth-routes';
import otpRoutes from './otp-routes';
import { initializeFirebase, isFirebaseConfigured } from './firebase-config';

const app = express();

// === ENVIRONMENT VALIDATION ===
validateEnvironment();

// === BASIC CONFIG ===
app.set("trust proxy", 1);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET || "super-secret-fallback"));

// Session middleware
app.use(createSessionMiddleware());

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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Look for client build in both possible locations
  let clientBuildPath = path.join(process.cwd(), 'client/dist');
  if (!fs.existsSync(clientBuildPath)) {
    clientBuildPath = path.join(process.cwd(), '../client/dist');
  }

  // Check if client build exists
  if (fs.existsSync(clientBuildPath)) {
    console.log('🚀 Serving static files from:', clientBuildPath);

    // Serve static files
    app.use(express.static(clientBuildPath));

    // Handle admin routes - serve admin.html for /admin and /admin/* routes
    app.use('/admin', (req, res) => {
      const adminHtmlPath = path.join(clientBuildPath, 'admin.html');
      if (fs.existsSync(adminHtmlPath)) {
        return res.sendFile(adminHtmlPath);
      }
      // Fallback to main index.html if admin.html doesn't exist
      return res.sendFile(path.join(clientBuildPath, 'index.html'));
    });

    // Handle client-side routing - return index.html for non-API routes
    app.use((req, res, next) => {
      if (!req.path.startsWith('/api/')) {
        return res.sendFile(path.join(clientBuildPath, 'index.html'));
      }
      // Continue to next handler for API routes
      next();
    });
  } else {
    console.warn('⚠️  Client build not found. Running in API-only mode.');

    // In production but no client build found, handle non-API routes with 404
    app.use((req, res, next) => {
      if (!req.path.startsWith('/api/')) {
        return res.status(404).json({
          status: 'error',
          message: 'Client not found',
          details: 'The client application is not available. Please check the deployment.'
        });
      }
      next(); // Continue to API routes
    });
  }
} else {
  // In development, run in API-only mode, serve non-API routes with 404
  console.log('🚀 Running in development mode - API-only');

  // Admin routes should be handled by the client dev server
  app.use('/admin', (req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Admin Panel - Development Mode',
      details: 'Admin panel should be accessed through the client development server on port 5000'
    });
  });

  app.use((req, res, next) => {
    if (!req.path.startsWith('/api/')) {
      return res.status(404).json({
        status: 'error',
        message: 'Development API Server',
        details: 'This is an API-only development server. The client should be running separately.'
      });
    }
    next(); // Continue to API routes
  });
}

// === ROUTES ===
registerRoutes(app);

app.use("/api", csrfRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); // User routes including /api/user/auth/login
app.use("/auth", oauthCallbackRoutes);

// Register Firebase auth routes
if (isFirebaseConfigured()) {
  app.use('/api/firebase-auth', firebaseAuthRoutes);
  console.log('✅ Firebase Auth routes registered');
  initializeFirebase();
} else {
  app.use('/api/firebase-auth', firebaseAuthRoutes);
  console.log('⚠️  Firebase Auth routes registered (not configured - waiting for credentials)');
}

// Register OTP routes (always available)
app.use('/api/otp', otpRoutes);
console.log('✅ OTP routes registered');

// Register Supabase auth routes and health monitoring if configured
if (isSupabaseConfigured()) {
  app.use('/api/supabase-auth', supabaseAuthRoutes);
  app.use('/api/supabase-health', supabaseHealthRoutes);
  console.log('✅ Supabase Auth routes registered');
  console.log('✅ Supabase Health routes registered');

  // Start health monitoring
  supabaseHealthMonitor.startMonitoring(30000); // Check every 30 seconds

  // Initial health check
  supabaseHealthMonitor.performHealthCheck().then(status => {
    if (status.issues.length > 0) {
      console.warn('⚠️ Supabase startup health issues:', status.issues);
    } else {
      console.log('✅ Supabase health check passed');
    }
  });
} else {
  // Still register health routes even if not configured for diagnostic purposes
  app.use('/api/supabase-health', supabaseHealthRoutes);
  console.log('✅ Supabase Health routes registered (diagnostic mode)');
}

app.use("/api/crypto", cryptoRoutes);
app.use("/api/trading", tradingRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/portfolio", portfolioAnalyticsRoutes);
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
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/admin/plans', adminPlansRoutes);
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
app.use("/api/v1", comprehensiveApiRoutes);
app.use(testEmailRoute); // Test email route must come before 404 handler

// === 404 HANDLER FOR API ===
// This should come after all other API routes
app.use("/api", (req, res, next) => {
  // If we get here, the API route wasn't found
  res.status(404).json({ message: "API endpoint not found" });
});

// === CATCH-ALL FOR NON-API ROUTES ===
// This should be the very last route handler
// It's intended for serving the client-side application in production
// and for development scenarios where the client is handled separately.
app.use((req, res, next) => {
  // If the request path starts with '/api/', it should have been handled by API routes or the /api 404 handler
  if (req.path.startsWith('/api/')) {
    return next(); // Let the API route handlers or the API 404 handler manage this
  }

  // In development, we assume the client is served by a separate dev server (e.g., Vite)
  // So, we pass control to the next middleware, which might be a 404 handler or nothing.
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  // In production, if we reach here for a non-API route, serve the client's index.html
  // Try common build output locations
  const possibleIndexPaths = [
    path.resolve(__dirname, '..', 'dist', 'public', 'index.html'), // Standard build output
    path.resolve(__dirname, '..', 'client', 'dist', 'index.html')   // Alternative build output
  ];

  for (const index of possibleIndexPaths) {
    if (fs.existsSync(index)) {
      return res.sendFile(index);
    }
  }

  // If no index.html is found in expected locations
  res.status(404).send('Client build not found. Make sure the client is built to one of the expected output directories.');
});

// Server configuration
const PORT = process.env.NODE_ENV === "production"
  ? Number(process.env.PORT) || 5000
  : Number(process.env.BACKEND_PORT) || 3000;
const HOST = "0.0.0.0"; // Always use 0.0.0.0 for Replit compatibility

// === SERVER START ===
// In production, serve on PORT (defaults to 5000). In dev, use BACKEND_PORT (3000)
async function startServer() {
  try {
    // Create HTTP server
    const httpServer = app.listen(PORT, HOST, () => {
      console.log(`🚀 Backend API Server running on ${HOST}:${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log("✅ Database connection pool initialized");
    });

    // Configure server timeouts
    httpServer.keepAliveTimeout = 60000; // 60 seconds
    httpServer.headersTimeout = 65000; // 65 seconds

    // Initialize WebSockets with error handling
    try {
      webSocketManager.init(httpServer);
      chatWebSocketManager.init(httpServer);
      adminWebSocketManager.init(httpServer);
      console.log("✅ WebSocket servers initialized");
    } catch (error) {
      console.error("❌ WebSocket initialization failed:", error);
      // Don't crash the server if WebSockets fail
    }

    // Start real-time services with error handling
    const startService = async (service: any, name: string) => {
      try {
        if (service && typeof service.start === 'function') {
          await service.start();
          console.log(`✅ ${name} started`);
        }
      } catch (error) {
        console.error(`❌ Failed to start ${name}:`, error);
      }
    };

    await Promise.all([
      startService(realTimePriceService, 'Real-time Price Service'),
      startService(portfolioRealtimeService, 'Portfolio Realtime Service'),
      startService(liveAnalyticsService, 'Live Analytics Service'),
      startService(priceMonitor, 'Price Monitor')
    ]);

    console.log("✅ All services initialized");

    // Handle server errors
    httpServer.on('error', (error: NodeJS.ErrnoException) => {
      console.error('🚨 Server error:', error);
      // Attempt graceful shutdown on critical errors
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error("❌ Server initialization failed:", error);
    process.exit(1);
  }
}

// === GRACEFUL SHUTDOWN ===
const shutdown = async (signal: string) => {
  console.log(`🛑 ${signal} received — shutting down...`);

  // Track if we're already shutting down to prevent multiple simultaneous shutdowns
  if (global.isShuttingDown) {
    console.log('⚠️  Shutdown already in progress...');
    return;
  }
  global.isShuttingDown = true;

  const shutdownPromises = [];
  
  try {
    // Shutdown WebSocket connections
    if (webSocketManager) {
      shutdownPromises.push(Promise.resolve(webSocketManager.shutdown()));
      console.log('🔌 WebSocket connections closing...');
    }
    
    if (chatWebSocketManager) {
      shutdownPromises.push(Promise.resolve(chatWebSocketManager.shutdown()));
      console.log('💬 Chat WebSocket connections closing...');
    }
    
    if (adminWebSocketManager) {
      shutdownPromises.push(Promise.resolve(adminWebSocketManager.shutdown()));
      console.log('👨‍💼 Admin WebSocket connections closing...');
    }

    // Stop real-time services
    if (realTimePriceService && typeof realTimePriceService.stop === 'function') {
      shutdownPromises.push(Promise.resolve(realTimePriceService.stop()));
      console.log('📉 Real-time price service stopping...');
    }
    
    if (portfolioRealtimeService && typeof portfolioRealtimeService.stop === 'function') {
      shutdownPromises.push(Promise.resolve(portfolioRealtimeService.stop()));
      console.log('📊 Portfolio realtime service stopping...');
    }
    
    if (liveAnalyticsService && typeof liveAnalyticsService.stop === 'function') {
      shutdownPromises.push(Promise.resolve(liveAnalyticsService.stop()));
      console.log('📈 Live analytics service stopping...');
    }
    
    if (priceMonitor && typeof priceMonitor.stop === 'function') {
      shutdownPromises.push(Promise.resolve(priceMonitor.stop()));
      console.log('🔍 Price monitor stopping...');
    }

    // Close database connections
    if (pool) {
      shutdownPromises.push(
        pool.end()
          .then(() => console.log('✅ Database pool closed'))
          .catch(err => console.error('❌ Error closing database pool:', err))
      );
    }

    // Wait for all shutdown operations to complete
    await Promise.allSettled(shutdownPromises);
    
    console.log("👋 Server gracefully shut down.");
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle different shutdown signals
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  console.error('⚠️  Uncaught Exception:', error);
  // Don't exit immediately, allow the process to continue running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️  Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});