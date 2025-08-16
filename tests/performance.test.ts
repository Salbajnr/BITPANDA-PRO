
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server/index';

describe('Performance Tests', () => {
  describe('API Response Times', () => {
    it('should respond to market data within 200ms', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/api/market/data');
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.status).toBe(200);
      expect(responseTime).toBeLessThan(200);
    });

    it('should handle concurrent requests efficiently', async () => {
      const promises = Array(10).fill(null).map(() => 
        request(app).get('/api/market/data')
      );

      const startTime = Date.now();
      const responses = await Promise.all(promises);
      const endTime = Date.now();

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      expect(endTime - startTime).toBeLessThan(1000); // All 10 requests in under 1 second
    });
  });

  describe('Database Performance', () => {
    it('should handle multiple portfolio queries efficiently', async () => {
      const startTime = Date.now();
      
      const promises = Array(5).fill(null).map(() => 
        request(app).get('/api/portfolio/analytics')
      );

      await Promise.all(promises);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(500);
    });
  });
});
