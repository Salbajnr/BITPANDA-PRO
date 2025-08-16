
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../server/index';
import { storage } from '../server/storage';

describe('Integration Tests - E2E User Flows', () => {
  let server: any;
  let testUser: any;
  let authCookie: string;

  beforeAll(async () => {
    // Start server for integration tests
    server = app.listen(0); // Use random available port
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  describe('Complete User Registration and Trading Flow', () => {
    it('should complete full user journey', async () => {
      // 1. Register a new user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'integrationtest',
          email: 'integration@test.com',
          password: 'password123',
          role: 'user'
        });

      expect(registerResponse.status).toBe(201);

      // 2. Login with the new user
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'integration@test.com',
          password: 'password123'
        });

      expect(loginResponse.status).toBe(200);
      testUser = loginResponse.body.user;
      authCookie = loginResponse.headers['set-cookie'];

      // 3. Get initial portfolio (should be empty)
      const portfolioResponse = await request(app)
        .get('/api/portfolio')
        .set('Cookie', authCookie);

      expect(portfolioResponse.status).toBe(200);

      // 4. Make a buy trade
      const buyResponse = await request(app)
        .post('/api/trading/buy')
        .set('Cookie', authCookie)
        .send({
          symbol: 'BTC',
          amount: '0.1',
          price: '45000'
        });

      expect(buyResponse.status).toBe(200);
      expect(buyResponse.body.success).toBe(true);

      // 5. Check portfolio analytics after trade
      const analyticsResponse = await request(app)
        .get('/api/portfolio/analytics')
        .set('Cookie', authCookie);

      expect(analyticsResponse.status).toBe(200);
      expect(parseFloat(analyticsResponse.body.totalValue)).toBeGreaterThan(0);

      // 6. Create a price alert
      const alertResponse = await request(app)
        .post('/api/alerts')
        .set('Cookie', authCookie)
        .send({
          symbol: 'BTC',
          targetPrice: '50000',
          condition: 'above'
        });

      expect(alertResponse.status).toBe(201);

      // 7. Get transaction history
      const transactionsResponse = await request(app)
        .get('/api/transactions')
        .set('Cookie', authCookie);

      expect(transactionsResponse.status).toBe(200);
      expect(Array.isArray(transactionsResponse.body)).toBe(true);
      expect(transactionsResponse.body.length).toBeGreaterThan(0);

      // 8. Make a sell trade
      const sellResponse = await request(app)
        .post('/api/trading/sell')
        .set('Cookie', authCookie)
        .send({
          symbol: 'BTC',
          amount: '0.05',
          price: '46000'
        });

      expect(sellResponse.status).toBe(200);
      expect(sellResponse.body.success).toBe(true);
    });
  });

  describe('Admin Balance Management Flow', () => {
    it('should allow admin to manage user balances', async () => {
      // 1. Create admin user
      const adminUser = await storage.createUser({
        username: 'testadmin',
        email: 'testadmin@test.com',
        password: 'adminpass123',
        role: 'admin'
      });

      // 2. Login as admin
      const adminLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testadmin@test.com',
          password: 'adminpass123'
        });

      expect(adminLoginResponse.status).toBe(200);
      const adminCookie = adminLoginResponse.headers['set-cookie'];

      // 3. Get all users as admin
      const usersResponse = await request(app)
        .get('/api/admin/users')
        .set('Cookie', adminCookie);

      expect(usersResponse.status).toBe(200);
      expect(Array.isArray(usersResponse.body)).toBe(true);

      // 4. Adjust user balance
      const balanceResponse = await request(app)
        .post('/api/admin/adjust-balance')
        .set('Cookie', adminCookie)
        .send({
          userId: testUser.id,
          amount: '10000',
          reason: 'Test bonus'
        });

      expect(balanceResponse.status).toBe(200);
      expect(balanceResponse.body.success).toBe(true);
    });
  });
});
