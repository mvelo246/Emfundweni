const request = require('supertest');
const express = require('express');
const schoolInfoRoutes = require('../routes/schoolInfo');
const topStudentsRoutes = require('../routes/topStudents');
const authRoutes = require('../routes/auth');
const { initDatabase } = require('../database');

const app = express();
app.use(express.json());
app.use('/api/school-info', schoolInfoRoutes);
app.use('/api/top-students', topStudentsRoutes);
app.use('/api/auth', authRoutes);

describe('Integration Tests - Full User Flows', () => {
  let authToken;

  beforeAll(async () => {
    await initDatabase();
    
    // Login to get token
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

  describe('Complete School Info Update Flow', () => {
    test('should complete full update cycle: fetch -> update -> verify', async () => {
      // 1. Fetch current info
      const getResponse = await request(app)
        .get('/api/school-info');

      expect(getResponse.status).toBe(200);
      const originalData = getResponse.body;

      // 2. Update info
      const updateData = {
        school_name: 'Integration Test School',
        mission: 'Integration Test Mission',
        about: 'Integration Test About',
        contact_email: 'integration@test.com',
        contact_phone: '+27 11 777 7777',
        contact_address: 'Integration Test Address',
        stats_students: '1500+',
        stats_pass_rate: '100%',
        stats_awards: '100+',
        stats_subjects: '30+',
        vision: 'Integration Test Vision',
        values_text: 'Integration Test Values',
        hero_title: 'Integration Test Hero',
        hero_tagline: 'Integration Test Tagline',
        footer_tagline: 'Integration Test Footer'
      };

      const updateResponse = await request(app)
        .put('/api/school-info')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(updateResponse.status).toBe(200);

      // 3. Verify update
      const verifyResponse = await request(app)
        .get('/api/school-info');

      expect(verifyResponse.status).toBe(200);
      expect(verifyResponse.body.school_name).toBe(updateData.school_name);
      expect(verifyResponse.body.mission).toBe(updateData.mission);
      expect(verifyResponse.body.about).toBe(updateData.about);
      expect(verifyResponse.body.vision).toBe(updateData.vision);
      expect(verifyResponse.body.values_text).toBe(updateData.values_text);
    });
  });

  describe('Complete Top Students CRUD Flow', () => {
    let createdStudentId;

    test('should create, read, update, and delete a student', async () => {
      // 1. Create student
      const createData = {
        name: 'Integration Test Student',
        year: 2028,
        position: 1
      };

      const createResponse = await request(app)
        .post('/api/top-students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createData);

      expect(createResponse.status).toBe(201);
      createdStudentId = createResponse.body.id;
      expect(createResponse.body.name).toBe(createData.name);

      // 2. Read all students
      const getAllResponse = await request(app)
        .get('/api/top-students');

      expect(getAllResponse.status).toBe(200);
      expect(Array.isArray(getAllResponse.body)).toBe(true);
      const createdStudent = getAllResponse.body.find(s => s.id === createdStudentId);
      expect(createdStudent).toBeTruthy();
      expect(createdStudent.name).toBe(createData.name);

      // 3. Read by year
      const getByYearResponse = await request(app)
        .get(`/api/top-students/year/${createData.year}`);

      expect(getByYearResponse.status).toBe(200);
      expect(getByYearResponse.body.some(s => s.id === createdStudentId)).toBe(true);

      // 4. Update student
      const updateData = {
        name: 'Updated Integration Student',
        year: 2030,
        position: 2
      };

      const updateResponse = await request(app)
        .put(`/api/top-students/${createdStudentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(updateResponse.status).toBe(200);

      // 5. Verify update
      const verifyResponse = await request(app)
        .get('/api/top-students');

      const updatedStudent = verifyResponse.body.find(s => s.id === createdStudentId);
      expect(updatedStudent.name).toBe(updateData.name);
      expect(updatedStudent.position).toBe(updateData.position);

      // 6. Delete student
      const deleteResponse = await request(app)
        .delete(`/api/top-students/${createdStudentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(deleteResponse.status).toBe(200);

      // 7. Verify deletion
      const finalResponse = await request(app)
        .get('/api/top-students');

      const deletedStudent = finalResponse.body.find(s => s.id === createdStudentId);
      expect(deletedStudent).toBeUndefined();
    });
  });

  describe('Authentication Flow', () => {
    test('should complete full auth flow: login -> verify -> access protected route', async () => {
      // 1. Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      expect(loginResponse.status).toBe(200);
      const token = loginResponse.body.token;
      expect(token).toBeTruthy();

      // 2. Verify token
      const verifyResponse = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`);

      expect(verifyResponse.status).toBe(200);
      expect(verifyResponse.body.valid).toBe(true);

      // 3. Access protected route
      const protectedResponse = await request(app)
        .put('/api/school-info')
        .set('Authorization', `Bearer ${token}`)
        .send({
          school_name: 'Test',
          mission: 'Test',
          about: 'Test',
          contact_email: 'test@test.com',
          contact_phone: '+27 11 999 9999',
          contact_address: 'Test'
        });

      expect(protectedResponse.status).toBe(200);
    });

    test('should reject access to protected route without token', async () => {
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
  });
});

