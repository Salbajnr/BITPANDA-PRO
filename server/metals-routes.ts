import type { Express } from "express";
import { metalsService } from "./metals-service";
import { db } from "./db";
import { metalsPricing } from "@shared/schema";
import { isAuthenticated } from "./simple-auth";

export function registerMetalsRoutes(app: Express) {
  console.log("🥇 Registering metals trading routes");

  // Get all metals prices
  app.get("/api/metals/prices", async (req, res) => {
    try {
      const prices = await metalsService.getMetalPrices();
      res.json(prices);
    } catch (error) {
      console.error("Error fetching metals prices:", error);
      res.status(500).json({ error: "Failed to fetch metals prices" });
    }
  });

  // Get specific metal price
  app.get("/api/metals/price/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const price = await metalsService.getMetalPrice(symbol.toUpperCase());
      
      if (!price) {
        return res.status(404).json({ error: "Metal not found" });
      }
      
      res.json(price);
    } catch (error) {
      console.error(`Error fetching ${req.params.symbol} price:`, error);
      res.status(500).json({ error: "Failed to fetch metal price" });
    }
  });

  // Get metal information
  app.get("/api/metals/info/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const info = await metalsService.getMetalInfo(symbol.toUpperCase());
      res.json(info);
    } catch (error) {
      console.error(`Error fetching ${req.params.symbol} info:`, error);
      res.status(500).json({ error: "Failed to fetch metal information" });
    }
  });

  // Get metals market summary
  app.get("/api/metals/market-summary", async (req, res) => {
    try {
      const summary = await metalsService.getMarketSummary();
      res.json(summary);
    } catch (error) {
      console.error("Error fetching metals market summary:", error);
      res.status(500).json({ error: "Failed to fetch market summary" });
    }
  });

  // Buy metals (authenticated)
  app.post("/api/metals/buy", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const { symbol, amount, price } = req.body;

      if (!symbol || !amount || !price) {
        return res.status(400).json({ error: "Missing required fields: symbol, amount, price" });
      }

      // This would integrate with your existing trading logic
      // For now, return success
      res.json({
        success: true,
        transaction: {
          id: `txn_${Date.now()}`,
          userId,
          type: "buy",
          assetType: "metal",
          symbol,
          amount,
          price,
          total: amount * price,
          status: "completed",
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error("Error buying metals:", error);
      res.status(500).json({ error: "Failed to execute buy order" });
    }
  });

  // Sell metals (authenticated)
  app.post("/api/metals/sell", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const { symbol, amount, price } = req.body;

      if (!symbol || !amount || !price) {
        return res.status(400).json({ error: "Missing required fields: symbol, amount, price" });
      }

      res.json({
        success: true,
        transaction: {
          id: `txn_${Date.now()}`,
          userId,
          type: "sell", 
          assetType: "metal",
          symbol,
          amount,
          price,
          total: amount * price,
          status: "completed",
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error("Error selling metals:", error);
      res.status(500).json({ error: "Failed to execute sell order" });
    }
  });

  // Update metals prices in database (admin only)
  app.post("/api/metals/update-prices", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
      }

      const prices = await metalsService.getMetalPrices();
      
      // Update database with latest prices
      for (const price of prices) {
        await db
          .insert(metalsPricing)
          .values({
            symbol: price.symbol,
            name: price.name,
            pricePerOunce: price.price.toString(),
            changePercent24h: price.changePercent24h?.toString(),
            lastUpdated: new Date()
          })
          .onConflictDoUpdate({
            target: metalsPricing.symbol,
            set: {
              pricePerOunce: price.price.toString(),
              changePercent24h: price.changePercent24h?.toString(),
              lastUpdated: new Date()
            }
          });
      }

      res.json({ success: true, updatedPrices: prices.length });
    } catch (error) {
      console.error("Error updating metals prices:", error);
      res.status(500).json({ error: "Failed to update prices" });
    }
  });

  // Get real-time price updates (WebSocket endpoint)
  app.get("/api/metals/live-prices", async (req, res) => {
    try {
      const prices = await metalsService.getMetalPrices();
      
      // Add some real-time simulation
      const liveData = prices.map(price => ({
        ...price,
        ...metalsService.simulatePriceUpdate(price.symbol)
      }));

      res.json(liveData);
    } catch (error) {
      console.error("Error fetching live metals prices:", error);
      res.status(500).json({ error: "Failed to fetch live prices" });
    }
  });

  console.log("✅ Metals routes registered successfully");
}