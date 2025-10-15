import { Router } from 'express';
import { requireAuth } from './simple-auth';
import { storage } from './storage';
import crypto from 'crypto';
import { z } from 'zod';
import bcrypt from 'bcrypt'; // Import bcrypt for hashing

const router = Router();

const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  permissions: z.array(z.string()).min(1)
});

// Helper function to generate a secure API key
function generateApiKey() {
  return 'bp_' + crypto.randomBytes(32).toString('hex');
}

// Generate API key
router.post('/keys', requireAuth, async (req, res) => {
  try {
    const { name, permissions } = createApiKeySchema.parse(req.body);
    const userId = req.user!.id;

    // Generate secure API key
    const apiKey = generateApiKey();
    const keyHash = await bcrypt.hash(apiKey, 10); // Use bcrypt for hashing

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

// Get API usage statistics for all keys
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

// Update API key (e.g., change name or permissions)
router.patch('/keys/:keyId', requireAuth, async (req, res) => {
  try {
    const { keyId } = req.params;
    const { name, permissions } = req.body;

    // Verify the key belongs to the user
    const existingKey = await storage.getApiKeyById(keyId);
    if (!existingKey || existingKey.userId !== req.user!.id) {
      return res.status(404).json({
        success: false,
        message: 'API key not found'
      });
    }

    const updates: any = {};
    if (name) updates.name = name;
    if (permissions) updates.permissions = permissions;

    await storage.updateApiKey(keyId, updates);

    const updatedKey = await storage.getApiKeyById(keyId);

    res.json({
      success: true,
      data: {
        ...updatedKey,
        keyHash: undefined // Don't expose the hash
      }
    });
  } catch (error) {
    console.error('Update API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update API key'
    });
  }
});

// Regenerate API key
router.post('/keys/:keyId/regenerate', requireAuth, async (req, res) => {
  try {
    const { keyId } = req.params;

    // Verify the key belongs to the user
    const existingKey = await storage.getApiKeyById(keyId);
    if (!existingKey || existingKey.userId !== req.user!.id) {
      return res.status(404).json({
        success: false,
        message: 'API key not found'
      });
    }

    // Generate new key
    const newApiKey = generateApiKey();
    const keyHash = await bcrypt.hash(newApiKey, 10);

    await storage.updateApiKey(keyId, {
      keyHash,
      lastUsed: null,
      updatedAt: new Date()
    });

    const updatedKey = await storage.getApiKeyById(keyId);

    res.json({
      success: true,
      data: {
        ...updatedKey,
        keyHash: undefined, // Don't expose the hash
        apiKey: newApiKey // Return the new key (only time it's shown)
      },
      warning: 'Store this API key securely. It will not be shown again.'
    });
  } catch (error) {
    console.error('Regenerate API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate API key'
    });
  }
});

// Get API key usage statistics
router.get('/keys/:keyId/usage', requireAuth, async (req, res) => {
  try {
    const { keyId } = req.params;

    // Verify the key belongs to the user
    const existingKey = await storage.getApiKeyById(keyId);
    if (!existingKey || existingKey.userId !== req.user!.id) {
      return res.status(404).json({
        success: false,
        message: 'API key not found'
      });
    }

    const usage = await storage.getApiKeyUsageStats(keyId);

    res.json({
      success: true,
      data: usage
    });
  } catch (error) {
    console.error('Get API key usage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get API key usage'
    });
  }
});

export default router;