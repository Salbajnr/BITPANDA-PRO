
import { Router } from 'express';
import { requireAuth } from './simple-auth';
import { storage } from './storage';
import crypto from 'crypto';
import { z } from 'zod';

const router = Router();

const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  permissions: z.array(z.string()).min(1)
});

// Generate API key
router.post('/keys', requireAuth, async (req, res) => {
  try {
    const { name, permissions } = createApiKeySchema.parse(req.body);
    const userId = req.user!.id;

    // Generate secure API key
    const apiKey = 'bp_' + crypto.randomBytes(32).toString('hex');
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

    const newKey = await storage.createApiKey({
      userId,
      name,
      keyHash,
      permissions,
      isActive: true,
      rateLimit: 1000, // requests per hour
      createdAt: new Date(),
      lastUsed: null
    });

    res.json({
      id: newKey.id,
      name: newKey.name,
      key: apiKey, // Only return once
      permissions: newKey.permissions,
      rateLimit: newKey.rateLimit,
      createdAt: newKey.createdAt,
      isActive: newKey.isActive
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    res.status(500).json({ message: 'Failed to create API key' });
  }
});

// Get user's API keys
router.get('/keys', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const apiKeys = await storage.getUserApiKeys(userId);
    
    // Don't return the actual keys, only metadata
    const safeKeys = apiKeys.map(key => ({
      id: key.id,
      name: key.name,
      permissions: key.permissions,
      isActive: key.isActive,
      rateLimit: key.rateLimit,
      lastUsed: key.lastUsed,
      createdAt: key.createdAt
    }));

    res.json(safeKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ message: 'Failed to fetch API keys' });
  }
});

// Delete API key
router.delete('/keys/:keyId', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const keyId = req.params.keyId;

    await storage.deleteApiKey(keyId, userId);
    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ message: 'Failed to delete API key' });
  }
});

// Get API usage statistics
router.get('/usage', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const usage = await storage.getApiUsage(userId);
    res.json(usage);
  } catch (error) {
    console.error('Error fetching API usage:', error);
    res.status(500).json({ message: 'Failed to fetch API usage' });
  }
});

export default router;
