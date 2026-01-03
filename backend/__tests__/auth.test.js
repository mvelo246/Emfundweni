const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');
const { initDatabase } = require('../database');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Authentication Tests', () => {
  beforeAll(async () => {
    await initDatabase();
  });

  afterAll((done) => {
    // Don't close shared database connection
    done();
  });

  describe('POST /api/auth/login', () => {
    test('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBeTruthy();
    });

    test('should reject login with incorrect username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'wronguser',
          password: 'admin123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('should reject login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('should reject login with missing username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'admin123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should reject login with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/verify', () => {
    let validToken;

    beforeAll(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });
      validToken = loginResponse.body.token;
    });

    test('should verify valid token', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid', true);
    });

    test('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', 'Bearer invalidtoken123');

      // JWT verification can return 401 or 403
      expect([401, 403]).toContain(response.status);
    });

    test('should reject request without token', async () => {
      const response = await request(app)
        .post('/api/auth/verify');

      expect(response.status).toBe(401);
    });
  });
});

