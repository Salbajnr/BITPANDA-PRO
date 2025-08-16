
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server/index';
import { testDb, testUtils } from './setup';

describe('API Endpoints Tests', () => {
  let testUser: any;
  let userSession: any;

  beforeEach(async () => {
    const users = await testDb.setup();
    testUser = users.testUser;
    userSession = await testUtils.createAuthSession(testUser.id);
  });

  describe('Portfolio API', () => {
    it('should get user portfolio', async () => {
      const response = await request(app)
        .get('/api/portfolio')
        .set('Authorization', `Bearer ${userSession.sessionId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('portfolio');
    });

    it('should get portfolio analytics', async () => {
      const response = await request(app)
        .get('/api/portfolio/analytics')
        .set('Authorization', `Bearer ${userSession.sessionId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalValue');
      expect(response.body).toHaveProperty('totalGainLoss');
    });
  });

  describe('Trading API', () => {
    it('should create a buy order', async () => {
      const response = await request(app)
        .post('/api/trading/buy')
        .set('Authorization', `Bearer ${userSession.sessionId}`)
        .send({
          symbol: 'BTC',
          amount: '0.1',
          price: '45000'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should create a sell order', async () => {
      const response = await request(app)
        .post('/api/trading/sell')
        .set('Authorization', `Bearer ${userSession.sessionId}`)
        .send({
          symbol: 'BTC',
          amount: '0.05',
          price: '45000'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });

  describe('Price Alerts API', () => {
    it('should create a price alert', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${userSession.sessionId}`)
        .send({
          symbol: 'ETH',
          targetPrice: '2600',
          condition: 'above'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('alert');
    });

    it('should get user alerts', async () => {
      const response = await request(app)
        .get('/api/alerts')
        .set('Authorization', `Bearer ${userSession.sessionId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Market Data API', () => {
    it('should get market data', async () => {
      const response = await request(app)
        .get('/api/market/data');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get specific coin data', async () => {
      const response = await request(app)
        .get('/api/market/coin/BTC');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('symbol', 'BTC');
    });
  });
});
