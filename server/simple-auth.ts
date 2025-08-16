import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { storage } from './storage';

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        role: string;
      };
    }
  }
}

// Session data extension
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  // Set req.user for compatibility
  req.user = { id: userId };
  next();
};

export const requireAdmin = async (req: any, res: any, next: any) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await storage.getUser(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Authorization failed' });
  }
};

export const loadUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session?.userId;
  if (userId) {
    try {
      const user = await storage.getUser(userId);
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      console.error("Error loading user:", error);
      // Clear invalid session
      req.session?.destroy(() => {});
    }
  }
  next();
};