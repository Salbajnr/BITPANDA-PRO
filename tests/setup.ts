
import { beforeAll, afterAll, beforeEach } from 'vitest';
import { app } from '../server/index';
import { storage } from '../server/storage';

// Test database setup
export const testDb = {
  async setup() {
    // Create test users
    const testUser = await storage.createUser({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword123',
      role: 'user'
    });

    const testAdmin = await storage.createUser({
      username: 'testadmin',
      email: 'admin@example.com', 
      password: 'hashedadminpass123',
      role: 'admin'
    });

    return { testUser, testAdmin };
  },

  async cleanup() {
    // Clean up test data
    await storage.db.delete(storage.users).where(storage.users.email.like('%@example.com'));
  }
};

// Test utilities
export const testUtils = {
  async createAuthSession(userId: string) {
    // Mock session creation for tests
    return {
      userId,
      sessionId: 'test-session-' + Math.random().toString(36).substring(7)
    };
  },

  generateMockCryptoData() {
    return {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: '45000',
      change24h: '2.5%',
      volume: '1000000'
    };
  }
};

beforeAll(async () => {
  await testDb.setup();
});

afterAll(async () => {
  await testDb.cleanup();
});
