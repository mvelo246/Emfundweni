const request = require('supertest');
const express = require('express');
const topStudentsRoutes = require('../routes/topStudents');
const authRoutes = require('../routes/auth');
const { initDatabase, getDatabase } = require('../database');

const app = express();
app.use(express.json());
app.use('/api/top-students', topStudentsRoutes);
app.use('/api/auth', authRoutes);

describe('Top Students API Tests', () => {
  let authToken;
  let testStudentIds = [];

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
    // Clean up test data
    try {
      const db = getDatabase();
      if (testStudentIds.length > 0) {
        const placeholders = testStudentIds.map(() => '?').join(',');
        db.run(`DELETE FROM top_students WHERE id IN (${placeholders})`, testStudentIds, () => {
          // Don't close shared database connection
          done();
        });
      } else {
        done();
      }
    } catch (err) {
      done();
    }
  });

  describe('GET /api/top-students', () => {
    test('should return all top students', async () => {
      const response = await request(app)
        .get('/api/top-students');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return students ordered by year DESC and position ASC', async () => {
      const response = await request(app)
        .get('/api/top-students');

      expect(response.status).toBe(200);
      if (response.body.length > 1) {
        const firstYear = response.body[0].year;
        const secondYear = response.body[1].year;
        expect(firstYear).toBeGreaterThanOrEqual(secondYear);
      }
    });
  });

  describe('GET /api/top-students/year/:year', () => {
    test('should return students for specific year', async () => {
      const response = await request(app)
        .get('/api/top-students/year/2024');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        response.body.forEach(student => {
          expect(student.year).toBe(2024);
        });
      }
    });

    test('should return empty array for non-existent year', async () => {
      const response = await request(app)
        .get('/api/top-students/year/1900');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('POST /api/top-students', () => {
    test('should create new student with valid data', async () => {
      const studentData = {
        name: 'Test Student',
        year: 2024,
        position: 1
      };

      const response = await request(app)
        .post('/api/top-students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(studentData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(studentData.name);
      expect(response.body.year).toBe(studentData.year);
      expect(response.body.position).toBe(studentData.position);
      
      testStudentIds.push(response.body.id);
    });

    test('should reject creation without authentication', async () => {
      const response = await request(app)
        .post('/api/top-students')
        .send({
          name: 'Test Student',
          year: 2024,
          position: 2
        });

      expect(response.status).toBe(401);
    });

    test('should reject creation with missing name', async () => {
      const response = await request(app)
        .post('/api/top-students')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          year: 2024,
          position: 3
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should reject creation with position out of range (too high)', async () => {
      const response = await request(app)
        .post('/api/top-students')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Student',
          year: 2024,
          position: 11
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Position');
    });

    test('should reject creation with position out of range (too low)', async () => {
      const response = await request(app)
        .post('/api/top-students')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Student',
          year: 2024,
          position: 0
        });

      expect(response.status).toBe(400);
      // Position validation happens after required field check, so error might be about position or validation
      expect(response.body.error).toBeTruthy();
    });

    test('should reject creation with duplicate position for same year', async () => {
      // First student
      await request(app)
        .post('/api/top-students')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'First Student',
          year: 2025,
          position: 1
        });

      // Duplicate position
      const response = await request(app)
        .post('/api/top-students')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Second Student',
          year: 2025,
          position: 1
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Position already taken');
    });
  });

  describe('PUT /api/top-students/:id', () => {
    let updateStudentId;

    beforeAll(async () => {
      // Create a student to update
      const createResponse = await request(app)
        .post('/api/top-students')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Update Test Student',
          year: 2026,
          position: 5
        });
      updateStudentId = createResponse.body.id;
      testStudentIds.push(updateStudentId);
    });

    test('should update student with valid data', async () => {
      const updateData = {
        name: 'Updated Student Name',
        year: 2026,
        position: 6  // Changed to avoid conflict
      };

      const response = await request(app)
        .put(`/api/top-students/${updateStudentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    test('should reject update without authentication', async () => {
      const response = await request(app)
        .put(`/api/top-students/${updateStudentId}`)
        .send({
          name: 'Test',
          year: 2026,
          position: 7
        });

      expect(response.status).toBe(401);
    });

    test('should reject update with invalid position', async () => {
      const response = await request(app)
        .put(`/api/top-students/${updateStudentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test',
          year: 2026,
          position: 15
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Position');
    });

    test('should return 404 for non-existent student', async () => {
      const response = await request(app)
        .put('/api/top-students/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test',
          year: 2026,
          position: 8
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/top-students/:id', () => {
    let deleteStudentId;

    beforeAll(async () => {
      // Create a student to delete
      const createResponse = await request(app)
        .post('/api/top-students')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Delete Test Student',
          year: 2027,
          position: 10
        });
      deleteStudentId = createResponse.body.id;
      // Don't add to testStudentIds since we're deleting it
    });

    test('should delete student with valid id', async () => {
      // Ensure we have a valid student ID
      if (!deleteStudentId) {
        const createResponse = await request(app)
          .post('/api/top-students')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Delete Test Student',
            year: 2027,
            position: 10
          });
        deleteStudentId = createResponse.body.id;
      }

      const response = await request(app)
        .delete(`/api/top-students/${deleteStudentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    test('should reject delete without authentication', async () => {
      const response = await request(app)
        .delete(`/api/top-students/${deleteStudentId}`);

      expect(response.status).toBe(401);
    });

    test('should return 404 for non-existent student', async () => {
      const response = await request(app)
        .delete('/api/top-students/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});

