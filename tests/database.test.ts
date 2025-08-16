
import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../server/storage';
import { testDb } from './setup';

describe('Database Operations Tests', () => {
  let testUser: any;

  beforeEach(async () => {
    const users = await testDb.setup();
    testUser = users.testUser;
  });

  describe('User Operations', () => {
    it('should create a user', async () => {
      const user = await storage.createUser({
        username: 'dbtest',
        email: 'dbtest@example.com',
        password: 'hashedpass',
        role: 'user'
      });

      expect(user).toHaveProperty('id');
      expect(user.email).toBe('dbtest@example.com');
    });

    it('should find user by email', async () => {
      const user = await storage.findUserByEmail('test@example.com');
      
      expect(user).toBeTruthy();
      expect(user?.email).toBe('test@example.com');
    });
  });

  describe('Portfolio Operations', () => {
    it('should create a portfolio', async () => {
      const portfolio = await storage.createPortfolio({
        userId: testUser.id,
        name: 'Test Portfolio',
        description: 'Test portfolio description'
      });

      expect(portfolio).toHaveProperty('id');
      expect(portfolio.name).toBe('Test Portfolio');
    });

    it('should get user portfolio', async () => {
      const portfolio = await storage.getUserPortfolio(testUser.id);
      
      expect(portfolio).toBeTruthy();
      expect(portfolio?.userId).toBe(testUser.id);
    });
  });

  describe('Transaction Operations', () => {
    it('should create a transaction', async () => {
      const transaction = await storage.createTransaction({
        userId: testUser.id,
        type: 'buy',
        symbol: 'BTC',
        amount: '0.1',
        price: '45000',
        total: '4500',
        status: 'completed'
      });

      expect(transaction).toHaveProperty('id');
      expect(transaction.type).toBe('buy');
      expect(transaction.symbol).toBe('BTC');
    });

    it('should get user transactions', async () => {
      const transactions = await storage.getUserTransactions(testUser.id);
      
      expect(Array.isArray(transactions)).toBe(true);
    });
  });

  describe('Holdings Operations', () => {
    it('should upsert a holding', async () => {
      const portfolio = await storage.createPortfolio({
        userId: testUser.id,
        name: 'Holdings Test',
        description: 'Test'
      });

      const holding = await storage.upsertHolding({
        portfolioId: portfolio.id,
        symbol: 'ETH',
        name: 'Ethereum',
        amount: '5',
        averagePurchasePrice: '2500',
        currentPrice: '2600'
      });

      expect(holding).toHaveProperty('symbol', 'ETH');
      expect(holding.amount).toBe('5');
    });
  });
});
