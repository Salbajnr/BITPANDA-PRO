
import { storage } from './storage';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: any) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  firstRequest: number;
}

// In-memory store with persistence to database
class RateLimitStore {
  private cache = new Map<string, RateLimitEntry>();
  private readonly CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Periodic cleanup of expired entries
    setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL);
  }

  async get(key: string): Promise<RateLimitEntry | null> {
    // Check cache first
    const cached = this.cache.get(key);
    if (cached && cached.resetTime > Date.now()) {
      return cached;
    }

    // Fallback to database for persistence
    try {
      const dbEntry = await storage.getRateLimitEntry(key);
      if (dbEntry && dbEntry.resetTime > Date.now()) {
        this.cache.set(key, dbEntry);
        return dbEntry;
      }
    } catch (error) {
      console.warn('Rate limit DB fallback failed:', error);
    }

    return null;
  }

  async set(key: string, entry: RateLimitEntry): Promise<void> {
    this.cache.set(key, entry);
    
    // Persist to database asynchronously
    try {
      await storage.setRateLimitEntry(key, entry);
    } catch (error) {
      console.warn('Rate limit DB persistence failed:', error);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.resetTime <= now) {
        this.cache.delete(key);
      }
    }
  }
}

const rateLimitStore = new RateLimitStore();

export const createRateLimit = (config: RateLimitConfig) => {
  const {
    windowMs,
    maxRequests,
    keyGenerator = (req: any) => {
      const ip = req.ip || req.connection?.remoteAddress || 'unknown';
      const userId = req.user?.id || 'anonymous';
      return `${ip}:${userId}`;
    },
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = config;

  return async (req: any, res: any, next: any) => {
    try {
      const key = keyGenerator(req);
      const now = Date.now();
      
      let entry = await rateLimitStore.get(key);
      
      if (!entry || entry.resetTime <= now) {
        entry = {
          count: 1,
          resetTime: now + windowMs,
          firstRequest: now
        };
      } else {
        entry.count++;
      }

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count));
      res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
      res.setHeader('X-RateLimit-Window', windowMs);

      if (entry.count > maxRequests) {
        // Log rate limit violation
        await storage.logSecurityEvent({
          type: 'rate_limit_exceeded',
          userId: req.user?.id,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          endpoint: req.path,
          details: {
            count: entry.count,
            limit: maxRequests,
            windowMs
          }
        });

        return res.status(429).json({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${Math.ceil((entry.resetTime - now) / 1000)} seconds.`,
          retryAfter: Math.ceil((entry.resetTime - now) / 1000)
        });
      }

      await rateLimitStore.set(key, entry);

      // Handle response tracking for conditional rate limiting
      if (skipSuccessfulRequests || skipFailedRequests) {
        const originalSend = res.send;
        res.send = function(body: any) {
          const statusCode = res.statusCode;
          const shouldSkip = 
            (skipSuccessfulRequests && statusCode >= 200 && statusCode < 300) ||
            (skipFailedRequests && statusCode >= 400);

          if (shouldSkip) {
            // Decrement counter for skipped requests
            entry!.count = Math.max(0, entry!.count - 1);
            rateLimitStore.set(key, entry!);
          }

          return originalSend.call(this, body);
        };
      }

      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      next(); // Continue on rate limit errors
    }
  };
};

// Preset configurations
export const rateLimits = {
  strict: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  }),
  
  api: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 1000
  }),
  
  auth: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    keyGenerator: (req) => req.ip || 'unknown'
  }),
  
  trading: createRateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    skipFailedRequests: true
  }),
  
  upload: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20
  })
};
