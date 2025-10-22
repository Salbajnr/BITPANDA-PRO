import { Router } from 'express';
import { db } from './db';
import { sql } from 'drizzle-orm';

export const healthRouter = Router();

healthRouter.get('/health', async (req, res) => {
  try {
    // Check database connection
    await db.execute(sql`SELECT 1`);
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Service Unavailable',
      details: error.message
    });
  }
});
