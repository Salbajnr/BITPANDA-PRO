import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTransactionSchema, insertBalanceAdjustmentSchema, insertNewsArticleSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Create portfolio if it doesn't exist
      let portfolio = await storage.getPortfolio(userId);
      if (!portfolio) {
        portfolio = await storage.createPortfolio({
          userId,
          totalValue: '10000.00', // Default starting balance
          availableCash: '10000.00',
        });
      }
      
      res.json({ ...user, portfolio });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Portfolio routes
  app.get('/api/portfolio', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app.post('/api/trade', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const portfolio = await storage.getPortfolio(userId);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }

      const tradeData = insertTransactionSchema.parse(req.body);
      tradeData.portfolioId = portfolio.id;
      
      // For simulation, we'll just create the transaction without real validation
      const transaction = await storage.createTransaction(tradeData);
      
      // Update holdings
      if (tradeData.type === 'buy') {
        const existing = await storage.getHolding(portfolio.id, tradeData.symbol);
        if (existing) {
          // Update existing holding
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
          // Create new holding
          await storage.upsertHolding({
            portfolioId: portfolio.id,
            symbol: tradeData.symbol,
            name: req.body.name || tradeData.symbol,
            amount: tradeData.amount,
            averagePurchasePrice: tradeData.price,
            currentPrice: tradeData.price,
          });
        }
        
        // Update available cash
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
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
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

  app.post('/api/admin/simulate-balance', isAuthenticated, async (req: any, res) => {
    try {
      const adminUser = await storage.getUser(req.user.claims.sub);
      if (!adminUser || adminUser.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { targetUserId, adjustmentType, amount, currency, reason } = req.body;
      
      // Create balance adjustment record
      const adjustment = await storage.createBalanceAdjustment({
        adminId: adminUser.id,
        targetUserId,
        adjustmentType,
        amount,
        currency,
        reason,
      });

      // Apply the adjustment to user's portfolio
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

  app.get('/api/admin/adjustments/:userId?', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
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

  app.post('/api/admin/news', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
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

  app.delete('/api/admin/news/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
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

  const httpServer = createServer(app);
  return httpServer;
}
