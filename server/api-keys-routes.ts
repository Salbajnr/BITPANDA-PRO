
import { Router, Request, Response } from 'express';
import { requireAuth } from './simple-auth';
import { storage } from './storage';
import { z } from 'zod';
import crypto from 'crypto';

const router = Router();

const createApiKeySchema = z.object({
  name: z.string().min(1),
  permissions: z.array(z.string()).optional(),
  expiresAt: z.string().optional(),
});

// Generate API key
function generateApiKey(): string {
  return 'bp_' + crypto.randomBytes(32).toString('hex');
}

// Get user's API keys
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const apiKeys = await storage.getUserApiKeys(userId);
    res.json(apiKeys);
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({ message: 'Failed to fetch API keys' });
  }
});

// Get single API key
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const apiKey = await storage.getApiKeyById(id);
    if (!apiKey || apiKey.userId !== userId) {
      return res.status(404).json({ message: 'API key not found' });
    }

    res.json(apiKey);
  } catch (error) {
    console.error('Get API key error:', error);
    res.status(500).json({ message: 'Failed to fetch API key' });
  }
});

// Create new API key
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = createApiKeySchema.parse(req.body);

    const apiKey = generateApiKey();
    const key = await storage.createApiKey({
      userId,
      name: data.name,
      key: apiKey,
      permissions: data.permissions || ['read'],
      isActive: true,
      expiresAt: data.expiresAt || null,
    });

    res.json(key);
  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({ message: 'Failed to create API key' });
  }
});

// Update API key
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { name, permissions } = req.body;

    const apiKey = await storage.getApiKeyById(id);
    if (!apiKey || apiKey.userId !== userId) {
      return res.status(404).json({ message: 'API key not found' });
    }

    const updated = await storage.updateApiKey(id, { name, permissions });
    res.json(updated);
  } catch (error) {
    console.error('Update API key error:', error);
    res.status(500).json({ message: 'Failed to update API key' });
  }
});

// Revoke API key
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const apiKey = await storage.getApiKeyById(id);
    if (!apiKey || apiKey.userId !== userId) {
      return res.status(404).json({ message: 'API key not found' });
    }

    await storage.revokeApiKey(id);
    res.json({ message: 'API key revoked successfully' });
  } catch (error) {
    console.error('Revoke API key error:', error);
    res.status(500).json({ message: 'Failed to revoke API key' });
  }
});

// Toggle API key status
router.patch('/:id/toggle', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const apiKey = await storage.getApiKeyById(id);
    if (!apiKey || apiKey.userId !== userId) {
      return res.status(404).json({ message: 'API key not found' });
    }

    const updated = await storage.updateApiKey(id, { isActive: !apiKey.isActive });
    res.json(updated);
  } catch (error) {
    console.error('Toggle API key error:', error);
    res.status(500).json({ message: 'Failed to toggle API key' });
  }
});

export default router;
