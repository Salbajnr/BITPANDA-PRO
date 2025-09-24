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
        isActive: boolean;
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
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  if (!user.isActive) {
    return res.status(401).json({ message: "Account is disabled" });
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

export const loadUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionData = req.session as any;
    
    if (sessionData?.userId) {
      const user = await storage.getUser(sessionData.userId);
      
      if (user && user.isActive) {
        (req as any).user = {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
          firstName: user.firstName,
          lastName: user.lastName
        };
      } else if (user && !user.isActive) {
        // Clear session if user is inactive
        req.session?.destroy((err) => {
          if (err) {
            console.error('Error destroying session:', err);
          }
        });
      }
    }
  } catch (error) {
    console.error("Error loading user:", error);
    // Don't fail the request, just continue without user
  }
  next();
};