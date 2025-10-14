import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';

const router = Router();

const createAlertSchema = z.object({
  symbol: z.string().min(1),
  type: z.enum(['price_above', 'price_below', 'percent_change']),
  targetPrice: z.string().optional(),
  percentChange: z.string().optional(),
  message: z.string().optional(),
});

// Get user's alerts
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const alerts = await storage.getUserAlerts(userId);
    res.json(alerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
});

// Create new alert
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = createAlertSchema.parse(req.body);

    const alert = await storage.createAlert({
      userId,
      symbol: data.symbol,
      type: data.type,
      targetPrice: data.targetPrice || null,
      percentChange: data.percentChange || null,
      message: data.message || `Price alert for ${data.symbol}`,
      isActive: true,
      isTriggered: false,
    });

    res.json(alert);
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ message: 'Failed to create alert' });
  }
});

// Update alert
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const data = req.body;

    const alert = await storage.getAlertById(id);
    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    const updated = await storage.updateAlert(id, data);
    res.json(updated);
  } catch (error) {
    console.error('Update alert error:', error);
    res.status(500).json({ message: 'Failed to update alert' });
  }
});

// Delete alert
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const alert = await storage.getAlertById(id);
    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    await storage.deleteAlert(id);
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ message: 'Failed to delete alert' });
  }
});

// Toggle alert active status
router.patch('/:id/toggle', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const alert = await storage.getAlertById(id);
    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    const updated = await storage.updateAlert(id, { isActive: !alert.isActive });
    res.json(updated);
  } catch (error) {
    console.error('Toggle alert error:', error);
    res.status(500).json({ message: 'Failed to toggle alert' });
  }
});

// Update price alert
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { targetPrice, condition, isActive } = req.body;

    const alert = await storage.getPriceAlert(id);
    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    const updateData: any = {};
    if (targetPrice) updateData.targetPrice = targetPrice.toString();
    if (condition) updateData.condition = condition;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await storage.updatePriceAlert(id, updateData);
    res.json(updated);
  } catch (error) {
    console.error('Update alert error:', error);
    res.status(500).json({ message: 'Failed to update alert' });
  }
});

// Get single alert by ID
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const alert = await storage.getAlertById(id);
    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(alert);
  } catch (error) {
    console.error('Get alert error:', error);
    res.status(500).json({ message: 'Failed to fetch alert' });
  }
});

// Delete price alert
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const alert = await storage.getPriceAlert(id);
    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    await storage.deletePriceAlert(id);
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ message: 'Failed to delete alert' });
  }
});

// Batch delete alerts
router.post('/batch-delete', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Invalid alert IDs' });
    }

    const results = [];
    for (const id of ids) {
      try {
        const alert = await storage.getAlertById(id);
        if (alert && alert.userId === userId) {
          await storage.deleteAlert(id);
          results.push({ id, success: true });
        } else {
          results.push({ id, success: false, error: 'Not found or unauthorized' });
        }
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }

    res.json({ results });
  } catch (error) {
    console.error('Batch delete alerts error:', error);
    res.status(500).json({ message: 'Failed to batch delete alerts' });
  }
});

// Batch toggle alerts
router.post('/batch-toggle', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { ids, isActive } = req.body;

    if (!Array.isArray(ids) || ids.length === 0 || typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const results = [];
    for (const id of ids) {
      try {
        const alert = await storage.getAlertById(id);
        if (alert && alert.userId === userId) {
          await storage.updateAlert(id, { isActive });
          results.push({ id, success: true });
        } else {
          results.push({ id, success: false, error: 'Not found or unauthorized' });
        }
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }

    res.json({ results });
  } catch (error) {
    console.error('Batch toggle alerts error:', error);
    res.status(500).json({ message: 'Failed to batch toggle alerts' });
  }
});

export default router;