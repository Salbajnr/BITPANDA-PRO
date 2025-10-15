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
   Optional CSRF (currently off)
============================== */
// app.use(csrfProtection);

/* Safe CSRF token endpoint */
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: (req as any).csrfToken?.() || null });
});

/* ==============================
   Request Logging
============================== */
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/* ==============================
   API Performance Logging
============================== */
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

/* ==============================
   Start Server Async Block
============================== */
(async () => {
  try {
    const server = await registerRoutes(app);

    /* Global Error Handler */
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      if (res.headersSent) return;
      if (err.code === "EBADCSRFTOKEN") {
        res.status(403).json({ message: "Invalid CSRF token" });
      } else {
        res.status(err.status || 500).json({ message: err.message });
        console.error("❌ Error:", err.stack || err);
      }
    });

    /* Ensure uploads directory exists */
    const uploadsDir = path.join(process.cwd(), "uploads", "proofs");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log("📁 Created uploads directory structure");
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    /* Serve uploaded files */
    app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

    /* Register API routes */
    app.use("/api/withdrawals", withdrawalRoutes);
    app.use("/api/watchlist", watchlistRoutes);
    app.use("/api/api-keys", apiKeysRoutes);
    app.use("/api/research", marketResearchRoutes);
    app.use("/api/user", (await import("./user-routes")).default);
    app.use("/api/analytics", (await import("./analytics-routes")).default);

    /* Serve frontend */
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    /* Serve static React build */
    const distPath = path.join(__dirname, "../dist/public");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }

    /* Admin panel route */
    app.get("/admin*", (req, res) => {
      const adminHtmlPath = path.join(distPath, "admin.html");
      if (fs.existsSync(adminHtmlPath)) {
        res.sendFile(adminHtmlPath);
      } else {
        res.status(404).send("Admin panel not found");
      }
    });

    /* Catch-all route for React SPA */
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Application not found");
      }
    });

    /* Port & Server Startup */
    const port = parseInt(process.env.PORT || "5000", 10);

    server.listen(port, "0.0.0.0", () => {
      console.log(`
🚀 Server running on http://0.0.0.0:${port}
📊 Portfolio Analytics: /api/portfolio/analytics
🔔 Price Alerts: /api/alerts
💰 Trading: /api/trading
👥 Admin: /api/admin
💎 Crypto Data: /api/crypto
💍 Precious Metals: /api/metals
📰 News: /api/news
🔍 Market Research: /api/research
💸 Withdrawals: /api/withdrawals
📡 WebSocket: ws://0.0.0.0:${port}/ws
`);
    });

    /* WebSocket initialization */
    webSocketManager.initialize(server);
    chatWebSocketManager.initialize(server);

    /* Graceful shutdown */
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      webSocketManager.shutdown();
      chatWebSocketManager.shutdown();
      server.close(() => console.log("Process terminated"));
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down gracefully");
      webSocketManager.shutdown();
      chatWebSocketManager.shutdown();
      server.close(() => console.log("Process terminated"));
    });

    /* Start background services */
    priceMonitor.start();
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();