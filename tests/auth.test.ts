
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server/index';
import { testDb, testUtils } from './setup';

describe('Authentication Tests', () => {
  let testUser: any;
  let testAdmin: any;

  beforeEach(async () => {
    const users = await testDb.setup();
    testUser = users.testUser;
    testAdmin = users.testAdmin;
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'newuser@test.com',
          password: 'password123',
          role: 'user'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should reject duplicate email registration', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'duplicate',
          email: 'test@example.com', // Already exists
          password: 'password123',
          role: 'user'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('User Login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'hashedpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('Role-based Access', () => {
    it('should allow admin access to admin routes', async () => {
      const session = await testUtils.createAuthSession(testAdmin.id);
      
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${session.sessionId}`);

      expect(response.status).toBe(200);
    });

    it('should deny user access to admin routes', async () => {
      const session = await testUtils.createAuthSession(testUser.id);
      
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${session.sessionId}`);

      expect(response.status).toBe(403);
    });
  });
});
