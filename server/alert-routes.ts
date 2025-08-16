
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';

const router = Router();

const createAlertSchema = z.object({
  symbol: z.string(),
  targetPrice: z.string(),
  alertType: z.enum(['above', 'below']),
  isActive: z.boolean().default(true),
});

const updateAlertSchema = z.object({
  targetPrice: z.string().optional(),
  alertType: z.enum(['above', 'below']).optional(),
  isActive: z.boolean().optional(),
});

// Create price alert
router.post('/create', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const alertData = createAlertSchema.parse(req.body);
    
    // Check if alert already exists for this user and symbol
    const existingAlert = await storage.getPriceAlert(userId, alertData.symbol);
    
    if (existingAlert) {
      return res.status(400).json({ message: "Alert already exists for this symbol" });
    }

    const alert = await storage.createPriceAlert({
      userId,
      symbol: alertData.symbol,
      targetPrice: alertData.targetPrice,
      alertType: alertData.alertType,
      isActive: alertData.isActive,
    });

    res.json(alert);
  } catch (error) {
    console.error("Create alert error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create alert" });
  }
});

// Get user's price alerts
router.get('/list', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const alerts = await storage.getUserPriceAlerts(userId);
    res.json(alerts);
  } catch (error) {
    console.error("Get alerts error:", error);
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
});

// Update price alert
router.patch('/:alertId', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const alertId = req.params.alertId;
    const updates = updateAlertSchema.parse(req.body);

    // Verify alert belongs to user
    const alert = await storage.getPriceAlertById(alertId);
    
    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: "Alert not found" });
    }

    const updatedAlert = await storage.updatePriceAlert(alertId, updates);
    res.json(updatedAlert);
  } catch (error) {
    console.error("Update alert error:", error);
    res.status(500).json({ message: "Failed to update alert" });
  }
});

// Delete price alert
router.delete('/:alertId', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const alertId = req.params.alertId;

    // Verify alert belongs to user
    const alert = await storage.getPriceAlertById(alertId);
    
    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: "Alert not found" });
    }

    await storage.deletePriceAlert(alertId);
    res.json({ message: "Alert deleted successfully" });
  } catch (error) {
    console.error("Delete alert error:", error);
    res.status(500).json({ message: "Failed to delete alert" });
  }
});

// Trigger alert (for testing purposes)
router.post('/:alertId/trigger', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const alertId = req.params.alertId;

    const alert = await storage.getPriceAlertById(alertId);
    
    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: "Alert not found" });
    }

    await storage.createNotification({
      userId,
      type: 'price_alert',
      title: 'Price Alert Triggered',
      message: `${alert.symbol} has ${alert.alertType === 'above' ? 'exceeded' : 'fallen below'} your target price of $${alert.targetPrice}`,
      data: JSON.stringify({ alertId, symbol: alert.symbol, targetPrice: alert.targetPrice }),
      isRead: false,
    });

    // Optionally disable the alert after triggering
    await storage.updatePriceAlert(alertId, { isActive: false });

    res.json({ message: "Alert triggered successfully" });
  } catch (error) {
    console.error("Trigger alert error:", error);
    res.status(500).json({ message: "Failed to trigger alert" });
  }
});

export default router;
