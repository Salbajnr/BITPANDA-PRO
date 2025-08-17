
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';

const router = Router();

const createAlertSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  targetPrice: z.number().min(0),
  condition: z.enum(['above', 'below']),
  message: z.string().optional(),
});

const updateAlertSchema = z.object({
  targetPrice: z.number().min(0).optional(),
  condition: z.enum(['above', 'below']).optional(),
  message: z.string().optional(),
  isActive: z.boolean().optional(),
});

// Get all alerts for user
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const alerts = await storage.getPriceAlerts(userId);
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
});

// Create new alert
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const alertData = createAlertSchema.parse(req.body);
    
    const alert = await storage.createPriceAlert({
      userId,
      symbol: alertData.symbol,
      name: alertData.name,
      targetPrice: alertData.targetPrice.toString(),
      condition: alertData.condition,
      message: alertData.message || `${alertData.symbol} price alert`,
      isActive: true,
    });

    res.json(alert);
  } catch (error) {
    console.error('Error creating alert:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create alert' });
  }
});

// Update alert
router.put('/:alertId', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const alertId = req.params.alertId;
    const updates = updateAlertSchema.parse(req.body);
    
    // Verify alert belongs to user
    const alert = await storage.getPriceAlert(alertId);
    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    const updateData: any = {};
    if (updates.targetPrice !== undefined) updateData.targetPrice = updates.targetPrice.toString();
    if (updates.condition !== undefined) updateData.condition = updates.condition;
    if (updates.message !== undefined) updateData.message = updates.message;
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive;

    await storage.updatePriceAlert(alertId, updateData);
    const updatedAlert = await storage.getPriceAlert(alertId);
    
    res.json(updatedAlert);
  } catch (error) {
    console.error('Error updating alert:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to update alert' });
  }
});

// Delete alert
router.delete('/:alertId', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const alertId = req.params.alertId;
    
    // Verify alert belongs to user
    const alert = await storage.getPriceAlert(alertId);
    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    await storage.deletePriceAlert(alertId);
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ message: 'Failed to delete alert' });
  }
});

// Toggle alert active status
router.patch('/:alertId/toggle', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const alertId = req.params.alertId;
    
    // Verify alert belongs to user
    const alert = await storage.getPriceAlert(alertId);
    if (!alert || alert.userId !== userId) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    await storage.updatePriceAlert(alertId, { isActive: !alert.isActive });
    const updatedAlert = await storage.getPriceAlert(alertId);
    
    res.json(updatedAlert);
  } catch (error) {
    console.error('Error toggling alert:', error);
    res.status(500).json({ message: 'Failed to toggle alert' });
  }
});

// Get alert notifications for user
router.get('/notifications', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 20;
    const notifications = await storage.getNotifications(userId, limit);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.patch('/notifications/:notificationId/read', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const notificationId = req.params.notificationId;
    
    // Verify notification belongs to user
    const notification = await storage.getNotification(notificationId);
    if (!notification || notification.userId !== userId) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await storage.markNotificationAsRead(notificationId);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
});

export default router;
