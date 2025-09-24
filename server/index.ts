import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { priceMonitor } from "./price-monitor";
import { setupVite, serveStatic, log } from "./vite";
import { portfolioRoutes } from './portfolio-routes';
import { seedDatabase } from "./seedData";
import { webSocketManager } from "./websocket-server";
import { chatWebSocketManager } from './chat-websocket';
import { realTimePriceService } from './real-time-price-service';
import cryptoRoutes from './crypto-routes';
import tradingRoutes from './trading-routes';
import adminRoutes from './admin-routes';
import authRoutes from './auth-routes';
import alertRoutes from './alert-routes';
import depositRoutes from './deposit-routes';
import withdrawalRoutes from "./withdrawal-routes";
import portfolioAnalyticsRoutes from './portfolio-analytics-routes';
import metalsRoutes from './metals-routes';
import newsRoutes from './news-routes';
import kycRoutes from './kyc-routes';
import marketResearchRoutes from './market-research-routes';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add CORS middleware with secure configuration
app.use((req, res, next) => {
  // Secure allowlist for CORS
  const allowedOrigins = [
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://0.0.0.0:5000',
    'https://*.replit.app',
    'https://*.replit.dev',
    process.env.REPLIT_DOMAINS?.split(',') || []
  ].flat();

  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.some(allowed =>
    allowed === origin ||
    (allowed.includes('*') && origin?.endsWith(allowed.replace('*.', '.')))
  );

  if (isAllowed || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

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

(async () => {
  try {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      // Rethrow the error to ensure it's logged by the next error handler if any, or terminates the process if unhandled.
      // However, since we are already sending a response, we might not want to terminate the process here.
      // For now, we'll just log it and send the response.
      console.error(`Error occurred: ${err.stack || err}`);
    });

    // Seed database with initial data
    try {
      await seedDatabase();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn('⚠️  Database seeding failed (this is normal if already seeded):', errorMessage);
    }

    // ALL routes
    app.use('/api/crypto', cryptoRoutes);
    app.use('/api/trading', tradingRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/alerts', alertRoutes);
    app.use("/api/deposits", depositRoutes);
    app.use("/api/withdrawals", withdrawalRoutes);
    app.use("/api/metals", metalsRoutes);
    app.use('/api/portfolio', portfolioRoutes);
    app.use('/api/portfolio/analytics', portfolioAnalyticsRoutes);
    app.use('/api/news', newsRoutes);
    app.use('/api/research', marketResearchRoutes);
    app.use('/api/kyc', kycRoutes);

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // IMPORTANTLY: This catch-all route should be the last route registered.
    // It ensures that any requests that do not match the defined API routes
    // are handled by the Vite development server (or static file serving in production).
    // This allows the frontend routing to work seamlessly.

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || "5000");

    // Handle server startup errors
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${port} is already in use. Trying to kill existing processes...`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });

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

    // Initialize WebSocket servers for real-time updates (after server is listening)
    webSocketManager.initialize(server);
    chatWebSocketManager.initialize(server);

    // Gracefully handle existing server shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      webSocketManager.shutdown();
      chatWebSocketManager.shutdown();
      server.close(() => {
        console.log('Process terminated');
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      webSocketManager.shutdown();
      chatWebSocketManager.shutdown();
      server.close(() => {
        console.log('Process terminated');
      });
    });

    // Start price monitoring service
    priceMonitor.start();
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();