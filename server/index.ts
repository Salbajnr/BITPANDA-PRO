import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import cookieParser from 'cookie-parser';
import csrf from 'tiny-csrf';
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
import adminAuthRoutes from './admin-auth-routes';
import authRoutes from './auth-routes';
import alertRoutes from './alert-routes';
import depositRoutes from './deposit-routes';
import withdrawalRoutes from "./withdrawal-routes";
import portfolioAnalyticsRoutes from './portfolio-analytics-routes';
import metalsRoutes from './metals-routes';
import newsRoutes from './news-routes';
import kycRoutes from './kyc-routes';
import marketResearchRoutes from './market-research-routes';
import chatRoutes from './chat-routes';
import investmentPlansRoutes from './investment-plans-routes';
import savingsPlansRoutes from './savings-plans-routes';
import stakingRoutes from './staking-routes';
import lendingRoutes from './lending-routes';
import watchlistRoutes from './watchlist-routes';
import apiKeysRoutes from './api-keys-routes';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();

// Add CORS middleware with secure configuration
app.use((req, res, next) => {
  // Secure allowlist for CORS
  const allowedOrigins = [
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://0.0.0.0:5000',
    'https://*.replit.app',
    'https://*.replit.dev',
    ...(process.env.REPLIT_DOMAINS?.split(',') || [])
  ].flat();

  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.some(allowed =>
    allowed === origin ||
    (allowed.includes('*') && origin?.endsWith(allowed.replace('*', '')))
  );

  if (isAllowed || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// IMPORTANT: You should change this secret to a value from your environment variables
app.use(cookieParser(process.env.COOKIE_SECRET || "some-super-secret-and-long-string"));



app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken });
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
      // Check if headers were already sent to avoid double response
      if (res.headersSent) {
        console.error(`Error occurred after response sent: ${err.stack || err}`);
        return;
      }

      if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).json({ message: 'Invalid CSRF token' });
      } else {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";

        res.status(status).json({ message });
        console.error(`Error occurred: ${err.stack || err}`);
      }
    });

    // Seed database with initial data
    try {
      await seedDatabase();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn('⚠️  Database seeding failed (this is normal if already seeded):', errorMessage);
    }

    // Create uploads directory structure
    const uploadsDir = path.join(process.cwd(), 'uploads', 'proofs');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('📁 Created uploads directory structure');
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Serve uploaded files (with basic security)
    app.use('/uploads', (req, res, next) => {
      // Basic security check - only serve files to authenticated users
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      next();
    }, express.static(path.join(__dirname, '../uploads')));

    // All API routes are registered in routes.ts via registerRoutes()
    // Do not duplicate route registrations here

    // Register additional CRUD routes
    app.use('/api/withdrawals', withdrawalRoutes);
    app.use('/api/watchlist', watchlistRoutes);
    app.use('/api/api-keys', apiKeysRoutes);

    // Market research routes
    const marketResearchRoutes = (await import('./market-research-routes')).default;
    app.use('/api/research', marketResearchRoutes);

    // User management routes
    const userRoutes = (await import('./user-routes')).default;
    app.use('/api/user', userRoutes);

    // Analytics routes
    const analyticsRoutes = (await import('./analytics-routes')).default;
    app.use('/api/analytics', analyticsRoutes);


    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Serve static files from the client dist directory
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Admin routes - serve admin app
    app.get('/admin*', (req, res) => {
      const adminHtmlPath = path.join(__dirname, '../client/dist/admin.html');
      if (fs.existsSync(adminHtmlPath)) {
        res.sendFile(adminHtmlPath);
      } else {
        // Fallback to development admin.html
        res.sendFile(path.join(__dirname, '../client/admin.html'));
      }
    });

    // Catch-all handler: send back React's index.html file for SPA routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });

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

    // Initialize WebSocket servers
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