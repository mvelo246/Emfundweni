const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Use a test database path
const mockTestDbPath = path.join(__dirname, 'test_school.db');

// Mock the database module to use test DB
jest.mock('../database', () => {
  const path = require('path');
  const originalModule = jest.requireActual('../database');
  const mockTestDbPath = path.join(__dirname, 'test_school.db');
  return {
    ...originalModule,
    DB_PATH: mockTestDbPath
  };
});

const { initDatabase, getDatabase } = require('../database');

describe('Database Tests', () => {
  let db;

  beforeAll(async () => {
    // Remove test database if it exists
    const testDbPath = path.join(__dirname, 'test_school.db');
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    
    // Initialize test database
    db = await initDatabase();
  });

  afterAll((done) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        }
        // Clean up test database
        setTimeout(() => {
          const testDbPath = path.join(__dirname, 'test_school.db');
          if (fs.existsSync(testDbPath)) {
            try {
              fs.unlinkSync(testDbPath);
            } catch (unlinkErr) {
              // Ignore cleanup errors
            }
          }
          done();
        }, 100);
      });
    } else {
      done();
    }
  });

  describe('Table Creation', () => {
    test('should create school_info table', (done) => {
      db.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='school_info'",
        (err, row) => {
          expect(err).toBeNull();
          expect(row).toBeTruthy();
          expect(row.name).toBe('school_info');
          done();
        }
      );
    });

    test('should create top_students table', (done) => {
      db.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='top_students'",
        (err, row) => {
          expect(err).toBeNull();
          expect(row).toBeTruthy();
          expect(row.name).toBe('top_students');
          done();
        }
      );
    });

    test('should create admin_users table', (done) => {
      db.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='admin_users'",
        (err, row) => {
          expect(err).toBeNull();
          expect(row).toBeTruthy();
          expect(row.name).toBe('admin_users');
          done();
        }
      );
    });
  });

  describe('School Info Table Schema', () => {
    test('should have all required columns in school_info', (done) => {
      db.all("PRAGMA table_info(school_info)", (err, columns) => {
        expect(err).toBeNull();
        const columnNames = columns.map(col => col.name);
        
        expect(columnNames).toContain('id');
        expect(columnNames).toContain('school_name');
        expect(columnNames).toContain('mission');
        expect(columnNames).toContain('about');
        expect(columnNames).toContain('contact_email');
        expect(columnNames).toContain('contact_phone');
        expect(columnNames).toContain('contact_address');
        expect(columnNames).toContain('stats_students');
        expect(columnNames).toContain('stats_pass_rate');
        expect(columnNames).toContain('stats_awards');
        expect(columnNames).toContain('stats_subjects');
        expect(columnNames).toContain('vision');
        expect(columnNames).toContain('values_text');
        expect(columnNames).toContain('hero_title');
        expect(columnNames).toContain('hero_tagline');
        expect(columnNames).toContain('footer_tagline');
        
        done();
      });
    });
  });

  describe('Top Students Table Schema', () => {
    test('should have correct columns in top_students', (done) => {
      db.all("PRAGMA table_info(top_students)", (err, columns) => {
        expect(err).toBeNull();
        const columnNames = columns.map(col => col.name);
        
        expect(columnNames).toContain('id');
        expect(columnNames).toContain('name');
        expect(columnNames).toContain('year');
        expect(columnNames).toContain('position');
        
        done();
      });
    });

    test('should enforce position constraint (1-10)', (done) => {
      db.run(
        'INSERT INTO top_students (name, year, position) VALUES (?, ?, ?)',
        ['Test Student', 2024, 11],
        function(err) {
          expect(err).toBeTruthy();
          expect(err.message).toContain('CHECK');
          done();
        }
      );
    });
  });

  describe('Default Data Initialization', () => {
    test('should initialize default school info', (done) => {
      db.get('SELECT * FROM school_info WHERE id = 1', (err, row) => {
        expect(err).toBeNull();
        expect(row).toBeTruthy();
        expect(row.school_name).toBe('Emfundweni High School');
        expect(row.mission).toBeTruthy();
        expect(row.about).toBeTruthy();
        done();
      });
    });

    test('should create default admin user', (done) => {
      db.get('SELECT * FROM admin_users WHERE username = ?', ['admin'], (err, row) => {
        expect(err).toBeNull();
        expect(row).toBeTruthy();
        expect(row.username).toBe('admin');
        expect(row.password_hash).toBeTruthy();
        done();
      });
    });
  });
});

