
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import crypto from 'crypto';

interface ApiRequest extends Request {
  apiKey?: {
    id: string;
    userId: string;
    permissions: string[];
    rateLimit: number;
  };
}

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const authenticateApiKey = async (req: ApiRequest, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      return res.status(401).json({ 
        error: 'API key required',
        message: 'Please provide an API key in the X-API-Key header'
      });
    }

    if (!apiKey.startsWith('bp_')) {
      return res.status(401).json({ 
        error: 'Invalid API key format',
        message: 'API key must start with bp_'
      });
    }

    // Hash the provided key to compare with stored hash
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    
    const keyData = await storage.getApiKeyByHash(keyHash);
    
    if (!keyData || !keyData.isActive) {
      return res.status(401).json({ 
        error: 'Invalid or inactive API key',
        message: 'Please check your API key and try again'
      });
    }

    // Update last used timestamp
    await storage.updateApiKeyLastUsed(keyData.id);

    req.apiKey = {
      id: keyData.id,
      userId: keyData.userId,
      permissions: keyData.permissions,
      rateLimit: keyData.rateLimit
    };

    next();
  } catch (error) {
    console.error('API key authentication error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      message: 'Internal server error'
    });
  }
};

export const checkApiRateLimit = (req: ApiRequest, res: Response, next: NextFunction) => {
  if (!req.apiKey) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const keyId = req.apiKey.id;
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const limit = req.apiKey.rateLimit;

  const current = rateLimitStore.get(keyId);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(keyId, { count: 1, resetTime: now + windowMs });
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', limit - 1);
    res.setHeader('X-RateLimit-Reset', new Date(now + windowMs).toISOString());
    return next();
  }

  if (current.count >= limit) {
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', 0);
    res.setHeader('X-RateLimit-Reset', new Date(current.resetTime).toISOString());
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: `Too many requests. Limit: ${limit} per hour`,
      resetTime: new Date(current.resetTime).toISOString()
    });
  }

  current.count++;
  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', limit - current.count);
  res.setHeader('X-RateLimit-Reset', new Date(current.resetTime).toISOString());
  
  next();
};

export const requireApiPermission = (permission: string) => {
  return (req: ApiRequest, res: Response, next: NextFunction) => {
    if (!req.apiKey) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!req.apiKey.permissions.includes(permission) && !req.apiKey.permissions.includes('admin')) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `This endpoint requires the '${permission}' permission`,
        required: permission,
        granted: req.apiKey.permissions
      });
    }

    next();
  };
};
