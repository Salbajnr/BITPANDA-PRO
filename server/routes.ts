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
import { z } from "zod";
import { Router } from "express";
import bcrypt from 'bcrypt';


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
  app.use(loadUser);

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
  app.use('/api/portfolio', portfolioAnalyticsRoutes);

  // Trading routes
  app.use('/api/trading', tradingRoutes);

  // Crypto routes
  app.use('/api/crypto', cryptoRoutes);

  // Metals routes
  app.use('/api/metals', metalsRoutes);

  // Metals trading routes
  const metalsTrading = (await import('./metals-trading-routes')).default;
  app.use('/api/metals-trading', metalsTrading);

  // News routes
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

  // ADMIN AUTHROUTES - Separate endpoints for admin users
  app.post('/api/admin/auth/login', checkDbConnection, async (req: Request, res: Response) => {
    try {
      const { emailOrUsername, password } = loginSchema.parse(req.body);

      // Find user by email or username
      const user = await storage.getUserByEmailOrUsername(emailOrUsername, emailOrUsername);
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
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data" });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  // REGULAR USER AUTH ROUTES - Separate endpoints for regular users
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
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data" });
      }
      res.status(500).json({ message: "Login failed" });
    }
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
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "User registration failed" });
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
            amount: newAmount.toString(),
            averagePurchasePrice: newAverage.toString(),
            currentPrice: tradeData.price,
          });
        } else {
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            symbol: tradeData.symbol,
            name: req.body.name || tradeData.symbol,
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

  app.post('/api/admin/simulate-balance', requireAdmin, async (req, res) => {
    try {
      const adminUser = await storage.getUser(req.user!.id);
      if (!adminUser || adminUser.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { targetUserId, adjustmentType, amount, currency, reason } = req.body;

      const adjustment = await storage.createBalanceAdjustment({
        adminId: adminUser.id,
        targetUserId,
        adjustmentType,
        amount,
        currency,
        reason,
      });

      const portfolio = await storage.getPortfolio(targetUserId);
      if (portfolio) {
        let newValue: number;
        const currentValue = parseFloat(portfolio.totalValue);
        const adjustmentAmount = parseFloat(amount);

        switch (adjustmentType) {
          case 'add':
            newValue = currentValue + adjustmentAmount;
            break;
          case 'remove':
            newValue = Math.max(0, currentValue - adjustmentAmount);
            break;
          case 'set':
            newValue = adjustmentAmount;
            break;
          default:
            return res.status(400).json({ message: "Invalid adjustment type" });
        }

        await storage.updatePortfolio(portfolio.id, {
          totalValue: newValue.toString(),
          availableCash: currency === 'USD' ? newValue.toString() : portfolio.availableCash
        });
      }

      res.json(adjustment);
    } catch (error) {
      console.error("Error simulating balance:", error);
      res.status(500).json({ message: "Failed to simulate balance" });
    }
  });

  app.get('/api/admin/adjustments/:userId?', requireAdmin, async (req, res) => {
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

  // Admin routes
  const adminRoutes = (await import('./admin-routes')).default;
  app.use('/api/admin', adminRoutes);

  // Alert routes
  app.use('/api/alerts', alertRoutes);

  // Chat routes
  const chatRoutes = (await import('./chat-routes')).default;
  app.use('/api/support/chat', chatRoutes);

  // KYC routes
  const kycRoutes = (await import('./kyc-routes')).default;
  app.use('/api/kyc', kycRoutes);

  // Upload routes
  const uploadRoutes = (await import('./upload-routes')).default;
  app.use('/api/upload', uploadRoutes);

  // Mount all route modules
  app.use('/api/auth', authRoutes);
  app.use('/api/user/auth', authRoutes);
  app.use('/api/admin/auth', authRoutes);
  app.use('/api/crypto', cryptoRoutes);
  app.use('/api/trading', tradingRoutes);
  app.use('/api/trade', tradingRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/alerts', alertRoutes);
  app.use('/api/deposits', depositRoutes);
  app.use('/api/withdrawals', withdrawalRoutes);
  app.use('/api/portfolio', portfolioRoutes);
  app.use('/api/portfolio', portfolioAnalyticsRoutes);
  app.use('/api/metals', metalsRoutes);
  app.use('/api/news', newsRoutes);

  const httpServer = createServer(app);

  // Add WebSocket server for real-time updates
  const wss = new WebSocketServer({ 
    noServer: true 
  });

  // Handle upgrade requests
  httpServer.on('upgrade', (request, socket, head) => {
    const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
    
    if (pathname === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

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

  // Cleanup function for graceful shutdown
  const cleanup = () => {
    clientSubscriptions.forEach((subscription) => {
      clearInterval(subscription.interval);
    });
    clientSubscriptions.clear();
    wss.close();
  };

  // Handle server shutdown
  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);

  return httpServer;
}