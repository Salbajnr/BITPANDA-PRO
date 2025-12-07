import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from 'ws';
import { createSessionMiddleware } from "./session";
import { storage } from "./storage";
import { hashPassword, verifyPassword, loadUser, requireAuth, requireAdmin } from "./simple-auth";
import { insertTransactionSchema, insertBalanceAdjustmentSchema, insertNewsArticleSchema, priceAlerts, notifications } from "@shared/schema";
import authRoutes from './auth-routes';
import depositRoutes from './deposit-routes';
import withdrawalRoutes from './withdrawal-routes';
import tradingRoutes from './trading-routes';
import adminRoutes from './admin-routes';
import { portfolioRoutes } from './portfolio-routes';
import portfolioAnalyticsRoutes from './portfolio-analytics-routes';
import alertRoutes from './alert-routes';
import cryptoRoutes from './crypto-routes';
import metalsRoutes from './metals-routes';
import newsRoutes from './news-routes';
import oauthRoutes from './oauth-routes';
import passport from './passport-config';
import { z } from "zod";
import { Router } from "express";
import bcrypt from 'bcrypt';

// Import new routes
// Removed non-existent todo-routes import
import socialRoutes from "./social-routes";
import notificationRoutes from "./notification-routes";

// Import rate limiting and audit services
import { rateLimits } from './rate-limiting-service';
import { auditService } from './audit-service';


// Database connection check
const checkDbAvailable = () => {
  try {
    return storage.isDbConnected();
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
};

const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const loginSchema = z.object({
  emailOrUsername: z.string().min(1),
  password: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(createSessionMiddleware());

  // Initialize passport for OAuth
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(loadUser);

  // Add audit logging middleware (before routes)
  app.use(auditService.createAuditMiddleware());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: checkDbAvailable() ? 'connected' : 'disconnected'
    });
  });

  // Database check middleware
  const checkDbConnection = (req: Request, res: Response, next: NextFunction) => {
    if (!checkDbAvailable()) {
      return res.status(503).json({
        message: "Database not available. Please check DATABASE_URL configuration."
      });
    }
    next();
  };



  // Portfolio routes (enhanced with real-time pricing)
  app.use('/api/portfolio', portfolioRoutes);
  app.use('/api/portfolio/analytics', portfolioAnalyticsRoutes);

  // Trading routes
  app.use('/api/trading', tradingRoutes);

  // Crypto routes
  app.use('/api/crypto', cryptoRoutes);

  // Metals routes
  app.use('/api/metals', metalsRoutes);

  // OAuth routes
  app.use('/api/auth', oauthRoutes);

  // Metals trading routes
  const metalsTrading = (await import('./metals-trading-routes')).default;
  app.use('/api/metals-trading', metalsTrading);

  // News routes (including admin endpoints)
  app.use('/api/news', newsRoutes);

  // Market research routes
  const marketResearchRoutes = (await import('./market-research-routes')).default;
  app.use('/api/research', marketResearchRoutes);

  // Staking routes
  const stakingRoutes = (await import('./staking-routes')).default;
  app.use('/api/staking', stakingRoutes);

  // Lending routes
  const lendingRoutes = (await import('./lending-routes')).default;
  app.use('/api/lending', lendingRoutes);

  // Investment Plans routes
  const investmentPlansRoutes = (await import('./investment-plans-routes')).default;
  app.use('/api/investment-plans', investmentPlansRoutes);

  // Savings Plans routes
  const savingsPlansRoutes = (await import('./savings-plans-routes')).default;
  app.use('/api/savings-plans', savingsPlansRoutes);

  // Proof upload routes (for deposit/withdrawal proof uploads)
  const { registerProofUploadRoutes } = await import('./proof-upload-routes');
  registerProofUploadRoutes(app);

  // API documentation routes
  const apiDocsRoutes = (await import('./api-docs-routes')).default;
  app.use('/api/docs', apiDocsRoutes);

  // API management routes
  const apiManagementRoutes = (await import('./api-management-routes')).default;
  app.use('/api/user/api', apiManagementRoutes);

  // Public API routes (with API key authentication)
  const publicApiRoutes = (await import('./public-api-routes')).default;
  app.use('/api/public', publicApiRoutes);

  // Comprehensive analytics routes
  const comprehensiveAnalyticsRoutes = (await import('./comprehensive-analytics-routes')).default;
  app.use('/api/analytics/comprehensive', comprehensiveAnalyticsRoutes);

  // Comprehensive CRUD routes
  const comprehensiveCrudRoutes = (await import('./comprehensive-crud-routes')).default;
  app.use('/api/crud', comprehensiveCrudRoutes);

  // General login endpoint - auto-detects user type
  app.post('/api/auth/login', rateLimits.auth, checkDbConnection, async (req: Request, res: Response) => {
    try {
      const { emailOrUsername, password } = req.body;

      if (!emailOrUsername || !password) {
        return res.status(400).json({ message: "Missing credentials" });
      }

      // Get user by email or username
      let user = await storage.getUserByEmail(emailOrUsername);
      if (!user) {
        user = await storage.getUserByUsername(emailOrUsername);
      }

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Account is disabled" });
      }

      // Set session
      (req.session as any).userId = user.id;
      (req.session as any).userRole = user.role;

      // Log successful login
      await auditService.logSecurityEvent({
        type: 'login_success',
        userId: user.id,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        details: { loginMethod: 'password', userRole: user.role },
        severity: 'low'
      });

      // Get portfolio
      let portfolio = await storage.getPortfolio(user.id);
      if (!portfolio) {
        const defaultCash = user.role === 'admin' ? '100000.00' : '15000.00';
        portfolio = await storage.createPortfolio({
          userId: user.id,
          totalValue: defaultCash,
          availableCash: defaultCash,
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
      const { formatErrorForResponse } = await import('./lib/errorUtils');
      const formatted = formatErrorForResponse(error);
      if (Array.isArray(formatted)) {
        return res.status(400).json({ message: "Invalid input data", errors: formatted });
      }
      res.status(500).json({ message: "Login failed", error: formatted });
    }
  });

  // General register endpoint
  app.post('/api/auth/register', checkDbConnection, async (req: Request, res: Response) => {
    try {
      const userData = registerSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmailOrUsername(userData.email, userData.username);
      if (existingUser) {
        return res.status(400).json({
          message: existingUser.email === userData.email ? 'Email already registered' : 'Username already taken'
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Create user
      const user = await storage.createUser({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'user',
        isActive: true,
      });

      // Create portfolio
      const portfolio = await storage.createPortfolio({
        userId: user.id,
        totalValue: '15000.00',
        availableCash: '5000.00',
      });

      // Set session
      (req.session as any).userId = user.id;
      (req.session as any).userRole = 'user';

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
      console.error("Registration error:", error);
      const { formatErrorForResponse } = await import('./lib/errorUtils');
      const formatted = formatErrorForResponse(error);
      if (Array.isArray(formatted)) {
        return res.status(400).json({ message: "Invalid input data", errors: formatted });
      }
      res.status(500).json({ message: "Registration failed", error: formatted });
    }
  });

  // ADMIN AUTHROUTES - Separate endpoints for admin users
  app.post('/api/admin/auth/login', checkDbConnection, async (req: Request, res: Response) => {
    try {
      const { emailOrUsername, password } = loginSchema.parse(req.body);

      // Find user by email or username
      const user = await storage.getUserByEmailOrUsername(emailOrUsername);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }

      // Verify password
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Admin account is disabled" });
      }

      // Check if user is admin
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Set session
      (req.session as any).userId = user.id;
      (req.session as any).userRole = 'admin';

      // Get portfolio
      let portfolio = await storage.getPortfolio(user.id);
      if (!portfolio) {
        portfolio = await storage.createPortfolio({
          userId: user.id,
          totalValue: '100000.00',
          availableCash: '100000.00',
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
      const { formatErrorForResponse } = await import('./lib/errorUtils');
      const formatted = formatErrorForResponse(error);
      if (Array.isArray(formatted)) {
        return res.status(400).json({ message: "Invalid input data", errors: formatted });
      }
      res.status(500).json({ message: "Login failed", error: formatted });
    }
  });

  // REGULAR USER AUTHROUTES - Separate endpoints for regular users
  app.post('/api/user/auth/login', checkDbConnection, async (req: Request, res: Response) => {
    try {
      const { emailOrUsername, password } = req.body;

      console.log('Login attempt:', { emailOrUsername, password: password ? '***' : 'missing' });

      if (!emailOrUsername || !password) {
        console.log('Missing credentials');
        return res.status(400).json({ message: "Missing credentials" });
      }

      // Get user by email or username
      let user = await storage.getUserByEmail(emailOrUsername);
      if (!user) {
        user = await storage.getUserByUsername(emailOrUsername);
      }

      console.log('User found:', user ? { id: user.id, email: user.email, username: user.username } : 'none');

      if (!user) {
        console.log('User not found');
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValid = await verifyPassword(password, user.password);
      console.log('Password valid:', isValid);

      if (!isValid) {
        console.log('Invalid password');
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isActive) {
        console.log('Account disabled');
        return res.status(401).json({ message: "Account is disabled" });
      }

      // Ensure user is not admin (admins should use admin login)
      if (user.role === 'admin') {
        return res.status(403).json({ message: "Please use admin login" });
      }

      // Set session
      (req.session as any).userId = user.id;
      (req.session as any).userRole = 'user';
      console.log('Session created for user:', user.id);

      // Get portfolio
      let portfolio = await storage.getPortfolio(user.id);
      if (!portfolio) {
        portfolio = await storage.createPortfolio({
          userId: user.id,
          totalValue: '0.00',
          availableCash: '0.00',
        });
      }

      // Return success immediately, don't wait for external services
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
      const { formatErrorForResponse } = await import('./lib/errorUtils');
      const formatted = formatErrorForResponse(error);
      if (Array.isArray(formatted)) {
        return res.status(400).json({ message: "Invalid input data", errors: formatted });
      }
      res.status(500).json({ message: "Login failed", error: formatted });
    }
  });

  // General logout endpoint (works for all users)
  app.post('/api/auth/logout', (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Separate logout endpoints
  app.post('/api/admin/auth/logout', (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Admin logout failed" });
      }
      res.json({ message: "Admin logged out successfully" });
    });
  });

  app.post('/api/user/auth/logout', (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "User logout failed" });
      }
      res.json({ message: "User logged out successfully" });
    });
  });

  // General session endpoint (works for both user types)
  app.get('/api/auth/session', async (req, res) => {
    try {
      const sessionData = req.session as any;

      // If no session, return not authenticated
      if (!sessionData?.userId) {
        return res.json({
          isAuthenticated: false,
          user: null
        });
      }

      const user = await storage.getUser(sessionData.userId);

      if (!user || !user.isActive) {
        // Clear invalid session
        req.session?.destroy((err) => {
          if (err) console.error('Error destroying session:', err);
        });
        return res.json({
          isAuthenticated: false,
          user: null
        });
      }

      let portfolio = await storage.getPortfolio(user.id);
      if (!portfolio) {
        const defaultCash = user.role === 'admin' ? '100000.00' : '15000.00';
        portfolio = await storage.createPortfolio({
          userId: user.id,
          totalValue: defaultCash,
          availableCash: defaultCash,
        });
      }

      // Remove sensitive data from response
      const { password, ...safeUserData } = user;

      res.json({
        isAuthenticated: true,
        user: {
          ...safeUserData,
          portfolio,
          lastLogin: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Session fetch error:", error);
      res.json({
        isAuthenticated: false,
        user: null
      });
    }
  });

  // Separate authentication status endpoints
  app.get('/api/admin/auth/user', requireAuth, requireAdmin, async (req, res) => {
    try {
      const user = req.user!;
      const fullUser = await storage.getUser(user.id);
      if (!fullUser) {
        return res.status(404).json({ message: "Admin user not found" });
      }

      let portfolio = await storage.getPortfolio(user.id);
      if (!portfolio) {
        portfolio = await storage.createPortfolio({
          userId: user.id,
          totalValue: '100000.00',
          availableCash: '100000.00',
        });
      }

      // Remove sensitive data from response
      const { password, ...safeUserData } = fullUser;

      res.json({
        ...safeUserData,
        portfolio,
        lastLogin: new Date().toISOString(),
        isAuthenticated: true
      });
    } catch (error) {
      console.error("Admin user fetch error:", error);
      res.status(500).json({ message: "Failed to fetch admin user" });
    }
  });

  app.get('/api/user/auth/user', requireAuth, async (req, res) => {
    try {
      const user = req.user!;

      // Ensure user is not admin
      if (user.role === 'admin') {
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
          totalValue: '15000.00',
          availableCash: '5000.00',
        });
      }

      // Remove sensitive data from response
      const { password, ...safeUserData } = fullUser;

      res.json({
        ...safeUserData,
        portfolio,
        lastLogin: new Date().toISOString(),
        isAuthenticated: true
      });
    } catch (error) {
      console.error("User fetch error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User registration endpoint
  app.post('/api/user/auth/register', checkDbConnection, async (req: Request, res: Response) => {
    try {
      const userData = registerSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmailOrUsername(userData.email, userData.username);
      if (existingUser) {
        return res.status(400).json({
          message: existingUser.email === userData.email ? 'Email already registered' : 'Username already taken'
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Create user
      const user = await storage.createUser({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'user',
        isActive: true,
      });

      // Create portfolio
      const portfolio = await storage.createPortfolio({
        userId: user.id,
        totalValue: '15000.00',
        availableCash: '5000.00',
      });

      // Set session
      (req.session as any).userId = user.id;
      (req.session as any).userRole = 'user';

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
      const { formatErrorForResponse } = await import('./lib/errorUtils');
      const formatted = formatErrorForResponse(error);
      if (Array.isArray(formatted)) {
        return res.status(400).json({ message: "Invalid input data", errors: formatted });
      }
      res.status(500).json({ message: "User registration failed", error: formatted });
    }
  });

  // Get User Settings
  app.get('/api/user/settings', requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
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

  // User Profile Management
  app.patch('/api/auth/profile', requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { username, email, firstName, lastName, profileImageUrl } = req.body;

      // Validate email uniqueness if being changed
      if (email) {
        const currentUser = await storage.getUser(userId);
        if (currentUser?.email !== email) {
          const existingUser = await storage.getUserByEmail(email);
          if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
          }
        }
      }

      const updates: any = {};
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

  // Change Password
  app.post('/api/auth/change-password', requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New passwords do not match" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      // Verify current password
      const user = await storage.getUser(userId);
      if (!user || !user.password) {
        return res.status(404).json({ message: "User not found" });
      }

      const isValidPassword = await verifyPassword(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash new password and update
      const hashedNewPassword = await hashPassword(newPassword);
      await storage.updateUser(userId, { password: hashedNewPassword });

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });


  // Trading routes
  app.post('/api/trade', requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const portfolio = await storage.getPortfolio(userId);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }

      const { type, symbol, amount, price, total, name } = req.body;
      const tradeData = {
        userId: req.user!.id,
        type,
        symbol,
        assetType: 'crypto',
        amount,
        price,
        total,
        status: 'completed',
        name: name || symbol, // Add name to trade data
      };

      const transaction = await storage.createTransaction(tradeData);

      if (tradeData.type === 'buy') {
        const existing = await storage.getHolding(portfolio.id, tradeData.symbol);
        if (existing) {
          const newAmount = parseFloat(existing.amount) + parseFloat(tradeData.amount);
          const newAverage = (parseFloat(existing.amount) * parseFloat(existing.averagePurchasePrice) +
            parseFloat(tradeData.amount) * parseFloat(tradeData.price)) / newAmount;

          await storage.upsertHolding({
            portfolioId: portfolio.id,
            symbol: tradeData.symbol,
            name: req.body.name || tradeData.symbol,
            assetType: 'crypto',
            amount: newAmount.toString(),
            averagePurchasePrice: newAverage.toString(),
            currentPrice: tradeData.price,
          });
        } else {
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            symbol: tradeData.symbol,
            name: req.body.name || tradeData.symbol,
            assetType: 'crypto',
            amount: tradeData.amount,
            averagePurchasePrice: tradeData.price,
            currentPrice: tradeData.price,
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

  // News routes
  app.get('/api/news', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const articles = await storage.getNewsArticles(limit);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // Admin routes
  app.get('/api/admin/users', requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      const usersWithPortfolios = await Promise.all(
        users.map(async (u) => {
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

  // Admin simulate balance endpoint
  app.post('/api/admin/simulate-balance', requireAuth, async (req: Request, res: Response) => {
    try {
      const adminUser = await storage.getUser(req.user!.id);
      if (!adminUser || adminUser.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { targetUserId, adjustmentType, amount, currency, reason } = req.body;

      if (!targetUserId || !adjustmentType || !amount || !currency) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const adjustmentAmount = parseFloat(amount);
      if (isNaN(adjustmentAmount) || adjustmentAmount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Verify target user exists
      const targetUser = await storage.getUser(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ message: "Target user not found" });
      }

      // Get or create portfolio
      let portfolio = await storage.getPortfolio(targetUserId);
      if (!portfolio) {
        portfolio = await storage.createPortfolio({
          userId: targetUserId,
          totalValue: '0',
          availableCash: '0'
        });
      }

      let newTotalValue: number;
      let newAvailableCash: number;
      const currentTotalValue = parseFloat(portfolio.totalValue);
      const currentAvailableCash = parseFloat(portfolio.availableCash);

      switch (adjustmentType) {
        case 'add':
          newTotalValue = currentTotalValue + adjustmentAmount;
          newAvailableCash = currentAvailableCash + adjustmentAmount;
          break;
        case 'remove':
          newTotalValue = Math.max(0, currentTotalValue - adjustmentAmount);
          newAvailableCash = Math.max(0, currentAvailableCash - adjustmentAmount);
          break;
        case 'set':
          newTotalValue = adjustmentAmount;
          newAvailableCash = adjustmentAmount;
          break;
        default:
          return res.status(400).json({ message: 'Invalid adjustment type' });
      }

      // Update portfolio
      await storage.updatePortfolio(portfolio.id, {
        totalValue: newTotalValue.toString(),
        availableCash: newAvailableCash.toString()
      });

      // Create adjustment record
      const adjustment = await storage.createBalanceAdjustment({
        adminId: adminUser.id,
        targetUserId,
        adjustmentType,
        amount,
        currency,
        reason: reason || `Admin ${adjustmentType} balance adjustment`,
      });

      // Log admin action
      await storage.logAdminAction({
        adminId: adminUser.id,
        action: 'balance_simulation',
        targetUserId,
        details: JSON.stringify({ adjustmentType, amount, currency, reason }),
        timestamp: new Date()
      });

      console.log(`✅ Admin ${adminUser.username || adminUser.id} ${adjustmentType}ed ${currency} ${amount} for user ${targetUser.username}`);

      res.json({
        success: true,
        adjustment,
        newBalance: newAvailableCash.toString(),
        newTotalValue: newTotalValue.toString(),
        message: `Balance ${adjustmentType === 'add' ? 'increased' : adjustmentType === 'remove' ? 'decreased' : 'set'} successfully`,
      });
    } catch (error) {
      console.error("Error simulating balance:", error);
      res.status(500).json({ message: "Failed to simulate balance" });
    }
  });

  app.get('/api/admin/adjustments/:userId', requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const adjustments = await storage.getBalanceAdjustments(req.params.userId);
      res.json(adjustments);
    } catch (error) {
      console.error("Error fetching adjustments:", error);
      res.status(500).json({ message: "Failed to fetch adjustments" });
    }
  });

  app.get('/api/admin/adjustments', requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const adjustments = await storage.getBalanceAdjustments(undefined);
      res.json(adjustments);
    } catch (error) {
      console.error("Error fetching adjustments:", error);
      res.status(500).json({ message: "Failed to fetch adjustments" });
    }
  });

  app.post('/api/admin/news', requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user || user.role !== 'admin') {
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

  app.delete('/api/admin/news/:id', requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.deleteNewsArticle(req.params.id);
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error("Error deleting news article:", error);
      res.status(500).json({ message: "Failed to delete news article" });
    }
  });

  // Deposit routes
  app.use('/api/deposits', depositRoutes);

  // Withdrawal routes
  app.use('/api/withdrawals', withdrawalRoutes);

  // Admin routes
  const adminRoutes = (await import('./admin-routes')).default;
  app.use('/api/admin', adminRoutes);

  // Admin auth routes (accessible at /admin/auth/*)
  const adminAuthRoutes = (await import('./admin-auth-routes')).default;
  app.use('/admin', adminAuthRoutes);

  // Alert routes
  app.use('/api/alerts', alertRoutes);

  // User routes
  const userRoutes = (await import('./user-routes')).default;
  app.use('/api/user', userRoutes);

  // Watchlist routes
  const watchlistRoutes = (await import('./watchlist-routes')).default;
  app.use('/api/watchlist', watchlistRoutes);

  // Chat routes
  const chatRoutes = (await import('./chat-routes')).default;
  app.use('/api/support/chat', chatRoutes);

  // KYC routes
  const kycRoutes = (await import('./kyc-routes')).default;
  app.use('/api/kyc', kycRoutes);

  // Upload routes
  const uploadRoutes = (await import('./upload-routes')).default;
  app.use('/api/upload', uploadRoutes);

  // Generic file upload endpoint
  app.post('/api/upload/generic', requireAuth, async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      res.json({
        success: true,
        message: 'File uploaded successfully',
        files: Object.keys(req.files)
      });
    } catch (error) {
      console.error('Generic upload error:', error);
      res.status(500).json({ message: 'File upload failed' });
    }
  });

  // Health check with detailed status
  app.get('/api/health/detailed', (req, res) => {
    const healthStatus = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: checkDbAvailable() ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    };

    const status = healthStatus.database === 'connected' ? 200 : 503;
    res.status(status).json(healthStatus);
  });

  // API status endpoint
  app.get('/api/status', (req, res) => {
    res.json({
      api: 'BITPANDA PRO',
      version: '1.0.0',
      status: 'operational',
      endpoints_count: 150,
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  });

  // Note: Individual route modules are mounted above, this section is for reference only
  // All routes are already properly mounted in their respective sections

  // Register new routes for TODOs, Social, and Notifications
  // Todo routes removed - not implemented
  app.use('/api/social', socialRoutes);
  app.use('/api/notifications', notificationRoutes);

  const httpServer = createServer(app);

  // Initialize WebSocket manager
  const { webSocketManager } = await import('./websocket-server');
  webSocketManager.initialize(httpServer);

  // Cleanup on shutdown
  process.on('SIGTERM', () => {
    webSocketManager.shutdown();
  });

  process.on('SIGINT', () => {
    webSocketManager.shutdown();
  });

  // Old WebSocket code removed - now handled by webSocketManager
  /*
  // Store client subscriptions and intervals
  const clientSubscriptions = new Map();

  // Handle WebSocket connections for real-time price updates
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    const clientId = Date.now().toString();

    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to live price feed',
      timestamp: Date.now(),
      clientId
    }));

    // Function to fetch real crypto prices from CoinGecko
    const fetchRealPrices = async (symbols: string[]) => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join(',')}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch prices');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching real prices:', error);
        return null;
      }
    };

    // Handle client messages
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'subscribe') {
          // Client wants to subscribe to price updates for specific symbols
          console.log('Client subscribed to:', message.symbols);

          // Clear existing subscription if any
          if (clientSubscriptions.has(clientId)) {
            clearInterval(clientSubscriptions.get(clientId).interval);
          }

          // Send initial real-time prices
          const realPrices = await fetchRealPrices(message.symbols);
          if (realPrices && ws.readyState === ws.OPEN) {
            for (const symbol of message.symbols) {
              const priceData = realPrices[symbol];
              if (priceData) {
                ws.send(JSON.stringify({
                  type: 'price_update',
                  symbol: symbol,
                  price: priceData.usd,
                  change_24h: priceData.usd_24h_change || 0,
                  volume_24h: priceData.usd_24h_vol || 0,
                  market_cap: priceData.usd_market_cap || 0,
                  timestamp: Date.now()
                }));
              }
            }
          }

          // Start sending periodic price updates (every 30 seconds for free API tier)
          const interval = setInterval(async () => {
            if (ws.readyState === ws.OPEN) {
              try {
                const realPrices = await fetchRealPrices(message.symbols);

                if (realPrices) {
                  // Send real prices from API
                  for (const symbol of message.symbols) {
                    const priceData = realPrices[symbol];
                    if (priceData) {
                      ws.send(JSON.stringify({
                        type: 'price_update',
                        symbol: symbol,
                        price: priceData.usd,
                        change_24h: priceData.usd_24h_change || 0,
                        volume_24h: priceData.usd_24h_vol || 0,
                        market_cap: priceData.usd_market_cap || 0,
                        timestamp: Date.now()
                      }));
                    }
                  }
                } else {
                  // Use our crypto service as fallback
                  const { cryptoService } = await import('./crypto-service');
                  for (const symbol of message.symbols) {
                    try {
                      const symbolKey = symbol.replace('bitcoin', 'BTC').replace('ethereum', 'ETH').toUpperCase();
                      const priceData = await cryptoService.getPrice(symbolKey);

                      if (priceData) {
                        ws.send(JSON.stringify({
                          type: 'price_update',
                          symbol: symbol,
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
                }
              } catch (error) {
                console.error('Error sending price update:', error);
                clearInterval(interval);
                clientSubscriptions.delete(clientId);
              }
            } else {
              clearInterval(interval);
              clientSubscriptions.delete(clientId);
            }
          }, 30000); // 30 seconds for free API calls

          // Store subscription
          clientSubscriptions.set(clientId, { interval, symbols: message.symbols });
        }

        if (message.type === 'unsubscribe') {
          // Client wants to unsubscribe from price updates
          if (clientSubscriptions.has(clientId)) {
            clearInterval(clientSubscriptions.get(clientId).interval);
            clientSubscriptions.delete(clientId);
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    // Handle client disconnect
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      if (clientSubscriptions.has(clientId)) {
        clearInterval(clientSubscriptions.get(clientId).interval);
        clientSubscriptions.delete(clientId);
      }
    });

    // Handle WebSocket errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      if (clientSubscriptions.has(clientId)) {
        clearInterval(clientSubscriptions.get(clientId).interval);
        clientSubscriptions.delete(clientId);
      }
    });
  });

  */

  return httpServer;
}