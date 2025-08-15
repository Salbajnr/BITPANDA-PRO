
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

// Extend session data to include userId
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function isAuthenticated(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
}

export async function loadUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
