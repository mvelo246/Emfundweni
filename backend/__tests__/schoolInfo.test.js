const request = require('supertest');
const express = require('express');
const schoolInfoRoutes = require('../routes/schoolInfo');
const authRoutes = require('../routes/auth');
const { initDatabase } = require('../database');

const app = express();
app.use(express.json());
app.use('/api/school-info', schoolInfoRoutes);
app.use('/api/auth', authRoutes);

describe('School Info API Tests', () => {
  let authToken;

  beforeAll(async () => {
    await initDatabase();
    
    // Get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });
    authToken = loginResponse.body.token;
  });

  afterAll((done) => {
    // Don't close shared database connection
    done();
  });

  describe('GET /api/school-info', () => {
    test('should return school information', async () => {
      const response = await request(app)
        .get('/api/school-info');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('school_name');
      expect(response.body).toHaveProperty('mission');
      expect(response.body).toHaveProperty('about');
      expect(response.body).toHaveProperty('contact_email');
      expect(response.body).toHaveProperty('contact_phone');
      expect(response.body).toHaveProperty('contact_address');
      expect(response.body).toHaveProperty('stats_students');
      expect(response.body).toHaveProperty('stats_pass_rate');
      expect(response.body).toHaveProperty('stats_awards');
      expect(response.body).toHaveProperty('stats_subjects');
      expect(response.body).toHaveProperty('vision');
      expect(response.body).toHaveProperty('values_text');
      expect(response.body).toHaveProperty('hero_title');
      expect(response.body).toHaveProperty('hero_tagline');
      expect(response.body).toHaveProperty('footer_tagline');
    });
  });

  describe('PUT /api/school-info', () => {
    test('should update school information with valid token', async () => {
      const updateData = {
        school_name: 'Test School',
        mission: 'Test Mission',
        about: 'Test About',
        contact_email: 'test@test.com',
        contact_phone: '+27 11 999 9999',
        contact_address: 'Test Address',
        stats_students: '1000+',
        stats_pass_rate: '99%',
        stats_awards: '30+',
        stats_subjects: '20+',
        vision: 'Test Vision',
        values_text: 'Test Values',
        hero_title: 'Test Hero Title',
        hero_tagline: 'Test Hero Tagline',
        footer_tagline: 'Test Footer Tagline'
      };

      const response = await request(app)
        .put('/api/school-info')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    test('should reject update without authentication', async () => {
      const response = await request(app)
        .put('/api/school-info')
        .send({
          school_name: 'Test',
          mission: 'Test',
          about: 'Test',
          contact_email: 'test@test.com',
          contact_phone: '+27 11 999 9999',
          contact_address: 'Test'
        });

      expect(response.status).toBe(401);
    });

    test('should reject update with missing required fields', async () => {
      const response = await request(app)
        .put('/api/school-info')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          school_name: 'Test School'
          // Missing required fields
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should update and retrieve updated information', async () => {
      const updateData = {
        school_name: 'Updated School Name',
        mission: 'Updated Mission',
        about: 'Updated About',
        contact_email: 'updated@test.com',
        contact_phone: '+27 11 888 8888',
        contact_address: 'Updated Address',
        stats_students: '1200+',
        stats_pass_rate: '100%',
        stats_awards: '50+',
        stats_subjects: '25+',
        vision: 'Updated Vision',
        values_text: 'Updated Values',
        hero_title: 'Updated Hero Title',
        hero_tagline: 'Updated Hero Tagline',
        footer_tagline: 'Updated Footer Tagline'
      };

      // Update
      await request(app)
        .put('/api/school-info')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      // Retrieve
      const getResponse = await request(app)
        .get('/api/school-info');

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.school_name).toBe(updateData.school_name);
      expect(getResponse.body.mission).toBe(updateData.mission);
      expect(getResponse.body.about).toBe(updateData.about);
      expect(getResponse.body.contact_email).toBe(updateData.contact_email);
      expect(getResponse.body.stats_students).toBe(updateData.stats_students);
      expect(getResponse.body.vision).toBe(updateData.vision);
      expect(getResponse.body.values_text).toBe(updateData.values_text);
      expect(getResponse.body.hero_title).toBe(updateData.hero_title);
      expect(getResponse.body.hero_tagline).toBe(updateData.hero_tagline);
      expect(getResponse.body.footer_tagline).toBe(updateData.footer_tagline);
    });

    test('should allow empty strings for optional fields', async () => {
      const updateData = {
        school_name: 'Test School',
        mission: 'Test Mission',
        about: 'Test About',
        contact_email: 'test@test.com',
        contact_phone: '+27 11 999 9999',
        contact_address: 'Test Address',
        vision: '', // Empty string
        values_text: '', // Empty string
        hero_title: 'Test Title',
        hero_tagline: 'Test Tagline',
        footer_tagline: 'Test Footer'
      };

      const response = await request(app)
        .put('/api/school-info')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
    });
  });
});

