
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';

const router = Router();

// Get user profile
router.get('/profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await storage.getUser(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't send password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update user profile
const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  profileImageUrl: z.string().optional(),
});

router.patch('/profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = updateProfileSchema.parse(req.body);

    const updatedUser = await storage.updateUser(userId, data);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Update profile error:', error);
    const { formatErrorForResponse } = await import('./lib/errorUtils');
    const formatted = formatErrorForResponse(error);
    if (Array.isArray(formatted)) {
      return res.status(400).json({ message: 'Invalid data', errors: formatted });
    }
    res.status(500).json({ message: 'Failed to update profile', error: formatted });
  }
});

// Change password
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

router.post('/change-password', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = changePasswordSchema.parse(req.body);

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const bcrypt = await import('bcrypt');
    const isValid = await bcrypt.compare(data.currentPassword, user.password);

    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await storage.updateUser(userId, { password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    const { formatErrorForResponse } = await import('./lib/errorUtils');
    const formatted = formatErrorForResponse(error);
    if (Array.isArray(formatted)) {
      return res.status(400).json({ message: 'Invalid data', errors: formatted });
    }
    res.status(500).json({ message: 'Failed to change password', error: formatted });
  }
});

// Get user settings
router.get('/settings', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    let settings = await storage.getUserSettings(userId);
    
    // Create default settings if none exist
    if (!settings) {
      settings = await storage.createUserSettings({
        userId,
        preferredCurrency: 'USD',
        emailNotifications: true,
        priceAlerts: true,
        darkMode: false,
        language: 'en'
      });
    }
    
    res.json({
      userId: settings.userId,
      theme: settings.darkMode ? 'dark' : 'light',
      language: settings.language,
      currency: settings.preferredCurrency,
      notifications: {
        email: settings.emailNotifications,
        push: true,
        priceAlerts: settings.priceAlerts,
        newsUpdates: false,
      },
      twoFactorEnabled: false,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// Update user settings
router.patch('/settings', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { theme, language, currency, notifications } = req.body;
    
    const updateData: any = {};
    if (theme) updateData.darkMode = theme === 'dark';
    if (language) updateData.language = language;
    if (currency) updateData.preferredCurrency = currency;
    if (notifications) {
      if (notifications.email !== undefined) updateData.emailNotifications = notifications.email;
      if (notifications.priceAlerts !== undefined) updateData.priceAlerts = notifications.priceAlerts;
    }
    
    const settings = await storage.updateUserSettings(userId, updateData);
    
    res.json({
      userId: settings.userId,
      theme: settings.darkMode ? 'dark' : 'light',
      language: settings.language,
      currency: settings.preferredCurrency,
      notifications: {
        email: settings.emailNotifications,
        push: true,
        priceAlerts: settings.priceAlerts,
        newsUpdates: false,
      },
      twoFactorEnabled: false,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

// Get user notifications
router.get('/notifications', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const notifications = await storage.getUserNotifications(userId);
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.patch('/notifications/:id/read', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await storage.markNotificationAsRead(id);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification error:', error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
});

// Get single user by ID (admin or self)
router.get('/:userId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requesterId = req.user!.id;

    // Check if user is requesting their own data or is admin
    const requester = await storage.getUser(requesterId);
    if (userId !== requesterId && requester?.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// Delete user account
router.delete('/account', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete account' });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const bcrypt = await import('bcrypt');
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Delete user and all related data
    await storage.deleteUser(userId);

    // Destroy session
    req.session?.destroy(() => { });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Failed to delete account' });
  }
});

export default router;
