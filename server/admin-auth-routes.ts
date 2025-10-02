
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { storage } from './storage';
import { requireAuth } from './simple-auth';

const router = Router();

const adminLoginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

// Admin login
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password } = adminLoginSchema.parse(req.body);
    
    const user = await storage.getUserByEmailOrUsername(emailOrUsername);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const isValidPassword = await storage.verifyPassword(user.id, password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is disabled" });
    }

    // Set session
    (req.session as any).userId = user.id;
    (req.session as any).userRole = user.role;

    res.json({
      admin: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get current admin user
router.get('/auth/user', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await storage.getUser(req.user!.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } catch (error) {
    console.error('Get admin user error:', error);
    res.status(500).json({ message: 'Failed to get user' });
  }
});

// Admin logout
router.post('/auth/logout', requireAuth, async (req: Request, res: Response) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});

export default router;
