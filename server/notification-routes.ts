
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';
import { sendSSEToUser } from './sse-routes';

const router = Router();

const notificationSchema = z.object({
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  type: z.enum(['info', 'success', 'warning', 'error', 'trade', 'deposit', 'withdrawal', 'alert']),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  actionUrl: z.string().optional(),
  actionLabel: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

// Get user notifications
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { read, type, priority, limit = 50, offset = 0 } = req.query;

    const notifications = await storage.getUserNotifications(userId);
    let filteredNotifications = notifications;

    if (read !== undefined) {
      filteredNotifications = filteredNotifications.filter(n => n.read === (read === 'true'));
    }

    if (type) {
      filteredNotifications = filteredNotifications.filter(n => n.type === type);
    }

    if (priority) {
      filteredNotifications = filteredNotifications.filter(n => n.priority === priority);
    }

    const startIndex = parseInt(offset.toString());
    const endIndex = startIndex + parseInt(limit.toString());
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

    const unreadCount = notifications.filter(n => !n.read).length;

    res.json({
      notifications: paginatedNotifications,
      total: filteredNotifications.length,
      unreadCount,
      hasMore: endIndex < filteredNotifications.length
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Create notification (admin or system)
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const data = notificationSchema.parse(req.body);
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID required' });
    }

    const notification = await storage.createNotification({
      userId: targetUserId,
      title: data.title,
      message: data.message,
      type: data.type,
      priority: data.priority,
      actionUrl: data.actionUrl,
      actionLabel: data.actionLabel,
      metadata: data.metadata,
      read: false,
      createdAt: new Date()
    });

    // Send real-time notification via SSE
    sendSSEToUser(targetUserId, {
      type: 'notification',
      data: notification,
      timestamp: Date.now()
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Failed to create notification' });
  }
});

// Mark notification as read
router.patch('/:id/read', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const notification = await storage.getNotificationById(id);
    if (!notification || notification.userId !== userId) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const updated = await storage.updateNotification(id, { 
      read: true,
      readAt: new Date()
    });

    res.json(updated);
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    await storage.markAllNotificationsRead(userId);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ message: 'Failed to mark all notifications as read' });
  }
});

// Delete notification
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const notification = await storage.getNotificationById(id);
    if (!notification || notification.userId !== userId) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await storage.deleteNotification(id);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
});

// Get notification preferences
router.get('/preferences', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const preferences = await storage.getNotificationPreferences(userId);
    res.json(preferences);
  } catch (error) {
    console.error('Get notification preferences error:', error);
    res.status(500).json({ message: 'Failed to fetch notification preferences' });
  }
});

// Update notification preferences
router.put('/preferences', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const preferences = req.body;

    const updated = await storage.updateNotificationPreferences(userId, preferences);
    res.json(updated);
  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({ message: 'Failed to update notification preferences' });
  }
});

export default router;
