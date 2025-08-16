import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from 'ws';
import { createSessionMiddleware } from "./session";
import { storage } from "./storage";
import { hashPassword, verifyPassword, loadUser, requireAuth, requireAdmin } from "./simple-auth";
import { insertTransactionSchema, insertBalanceAdjustmentSchema, insertNewsArticleSchema } from "@shared/schema";
import authRoutes from './auth-routes';
import depositRoutes from './deposit-routes';
import tradingRoutes from './trading-routes';
import adminRoutes from './admin-routes';
import { z } from "zod";
import { Router } from "express";

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
  // Session middleware
  app.use(createSessionMiddleware());

  // Load user middleware
  app.use(loadUser);

  // Authentication routes
  app.use('/api/auth', authRoutes);
  
  // Trading routes
  app.use('/api/trading', tradingRoutes);

  // Auth routes
  // Admin auth routes
  app.post('/api/auth-admin/login', async (req, res) => {
    try {
      const { emailOrUsername, password } = loginSchema.parse(req.body);

      // Find user by email or username
      const user = await storage.getUserByEmailOrUsername(emailOrUsername, emailOrUsername);
      if (!user || !user.password) {
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

      // Check if user is admin
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Set session
      (req.session as any).userId = user.id;

      // Get portfolio
      let portfolio = await storage.getPortfolio(user.id);
      if (!portfolio) {
        portfolio = await storage.createPortfolio({
          userId: user.id,
          totalValue: '0.00',
          availableCash: '0.00',
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

  app.post('/api/auth/register', async (req, res) => {
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
        totalValue: '0.00',
        availableCash: '0.00',
      });

      // Set session
      (req.session as any).userId = user.id;

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
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { emailOrUsername, password } = loginSchema.parse(req.body);

      // Find user by email or username
      const user = await storage.getUserByEmailOrUsername(emailOrUsername, emailOrUsername);
      if (!user || !user.password) {
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

      // Get portfolio
      let portfolio = await storage.getPortfolio(user.id);
      if (!portfolio) {
        portfolio = await storage.createPortfolio({
          userId: user.id,
          totalValue: '0.00',
          availableCash: '0.00',
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
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data" });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get('/api/auth/user', requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      const fullUser = await storage.getUser(user.id);
      if (!fullUser) {
        return res.status(404).json({ message: "User not found" });
      }

      let portfolio = await storage.getPortfolio(user.id);
      if (!portfolio) {
        portfolio = await storage.createPortfolio({
          userId: user.id,
          totalValue: '0.00',
          availableCash: '0.00',
        });
      }

      res.json({ ...fullUser, portfolio });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Portfolio routes
  app.get('/api/portfolio', requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const portfolio = await storage.getPortfolio(userId);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }

      const holdings = await storage.getHoldings(portfolio.id);
      const transactions = await storage.getTransactions(portfolio.id, 10);

      res.json({ portfolio, holdings, transactions });
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
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

      const { type, symbol, amount, price, total } = req.body;
      const tradeData = {
        userId: req.user!.id,
        type,
        symbol,
        amount,
        price,
        total,
        status: 'completed'
      };

      const transaction = await storage.createTransaction(tradeData);

      if (tradeData.type === 'buy') {
        const existing = await storage.getHolding(portfolio.id, tradeData.symbol);
        if (existing) {
          const newAmount = parseFloat(existing.amount) + parseFloat(tradeData.amount);
          const newAverage = (parseFloat(existing.averagePurchasePrice) * parseFloat(existing.amount) + 
                            parseFloat(tradeData.price) * parseFloat(tradeData.amount)) / newAmount;

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
  app.use('/api/admin', adminRoutes);

  const httpServer = createServer(app);

  // Add WebSocket server for real-time updates
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws' 
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
                  timestamp: Date.now()
                }));
              }
            }
          }
          
          // Start sending periodic price updates (every 10 seconds for real API)
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
                        timestamp: Date.now()
                      }));
                    }
                  }
                } else {
                  // Fallback to simulated data if API fails
                  for (const symbol of message.symbols) {
                    const basePrice = symbol === 'bitcoin' ? 45000 : 
                                    symbol === 'ethereum' ? 2500 : 
                                    Math.random() * 1000 + 100;
                    
                    const priceUpdate = {
                      type: 'price_update',
                      symbol: symbol,
                      price: basePrice * (0.98 + Math.random() * 0.04),
                      change_24h: (Math.random() - 0.5) * 10,
                      volume_24h: Math.random() * 1000000000,
                      timestamp: Date.now()
                    };
                    
                    ws.send(JSON.stringify(priceUpdate));
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
          }, 10000); // 10 seconds for real API calls

          // Store subscription
          clientSubscriptions.set(clientId, { interval, symbols: message.symbols });
        }
        
        if (message.type === 'unsubscribe') {
          if (clientSubscriptions.has(clientId)) {
            clearInterval(clientSubscriptions.get(clientId).interval);
            clientSubscriptions.delete(clientId);
            console.log('Client unsubscribed:', clientId);
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    // Clean up on disconnect
    ws.on('close', () => {
      if (clientSubscriptions.has(clientId)) {
        clearInterval(clientSubscriptions.get(clientId).interval);
        clientSubscriptions.delete(clientId);
      }
      console.log('Client disconnected from WebSocket:', clientId);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      if (clientSubscriptions.has(clientId)) {
        clearInterval(clientSubscriptions.get(clientId).interval);
        clientSubscriptions.delete(clientId);
      }
    });
  });

  return httpServer;
}