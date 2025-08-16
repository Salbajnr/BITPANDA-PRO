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

export async function loadUser(req: Request, res: Response, next: NextFunction) {
  if (req.session?.userId) {
    try {
      const user = await storage.getUser(req.session.userId);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email!,
          username: user.username!,
          role: user.role,
        };
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }
  next();
}

export const requireAuth = (req: any, res: any, next: any) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Authentication required" });
  }
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