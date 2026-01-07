const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const logger = require('./utils/logger');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'school.db');

// Initialize database and create tables
function initDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        logger.error('Error opening database', err);
        reject(err);
        return;
      }
      logger.info('Connected to SQLite database', { path: DB_PATH });
    });

    // Initialize school info if empty
    function initializeSchoolInfo() {
      db.get('SELECT COUNT(*) as count FROM school_info', (err, row) => {
        if (err) {
          logger.error('Error checking school info', err);
          reject(err);
          return;
        }

        if (row.count === 0) {
          db.run(
            `INSERT INTO school_info (school_name, mission, about, contact_email, contact_phone, contact_address, stats_students, stats_pass_rate, stats_awards, stats_subjects, vision, values_text, hero_title, hero_tagline, hero_button1_text, hero_button2_text, footer_tagline, logo_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              'Emfundweni High School',
              'To provide quality education and develop well-rounded individuals who are prepared for success in higher education and life.',
              'Emfundweni High School is a leading educational institution committed to academic excellence and character development. We provide a nurturing environment where students can achieve their full potential.',
              'info@emfundeni.edu.za',
              '+27 11 123 4567',
              '123 Education Street, Johannesburg, South Africa',
              '850+',
              '98.5%',
              '25+',
              '15+',
              'To be a leading institution of academic excellence that produces well-rounded, responsible citizens who are equipped with the knowledge, skills, and values to succeed in an ever-changing world and contribute positively to society.',
              'We pursue excellence, uphold integrity, embrace innovation, celebrate inclusivity, take responsibility, and build strong partnerships with families and the community.',
              'Welcome to Emfundweni',
              'Excellence in Education • Nurturing Future Leaders • Building Tomorrow\'s Success',
              'Learn More About Us',
              'Get In Touch',
              'Excellence in Education',
              '/logo.png'
            ],
            (err) => {
              if (err) {
                logger.error('Error initializing school info', err);
                reject(err);
                return;
              }
              logger.info('School info initialized with default values');
              resolve(db);
            }
          );
        } else {
          // Migrate existing data - add new columns if they don't exist
          db.run(`ALTER TABLE school_info ADD COLUMN school_name TEXT DEFAULT 'Emfundweni High School'`, () => {});
          db.run(`ALTER TABLE school_info ADD COLUMN stats_students TEXT DEFAULT '850+'`, () => {});
          db.run(`ALTER TABLE school_info ADD COLUMN stats_pass_rate TEXT DEFAULT '98.5%'`, () => {});
          db.run(`ALTER TABLE school_info ADD COLUMN stats_awards TEXT DEFAULT '25+'`, () => {});
          db.run(`ALTER TABLE school_info ADD COLUMN stats_subjects TEXT DEFAULT '15+'`, () => {});
          db.run(`ALTER TABLE school_info ADD COLUMN vision TEXT DEFAULT ''`, () => {});
          db.run(`ALTER TABLE school_info ADD COLUMN values_text TEXT DEFAULT ''`, () => {});
          db.run(`ALTER TABLE school_info ADD COLUMN hero_title TEXT DEFAULT 'Welcome to Emfundweni'`, () => {});
          db.run(`ALTER TABLE school_info ADD COLUMN hero_tagline TEXT DEFAULT 'Excellence in Education • Nurturing Future Leaders • Building Tomorrow''s Success'`, () => {});
          db.run(`ALTER TABLE school_info ADD COLUMN hero_button1_text TEXT DEFAULT 'Learn More About Us'`, () => {});
          db.run(`ALTER TABLE school_info ADD COLUMN hero_button2_text TEXT DEFAULT 'Get In Touch'`, () => {});
          db.run(`ALTER TABLE school_info ADD COLUMN footer_tagline TEXT DEFAULT 'Excellence in Education'`, () => {});
          db.run(`ALTER TABLE school_info ADD COLUMN logo_url TEXT DEFAULT '/logo.png'`, () => {});
          
          // Update existing row with default values if new fields are empty
          db.run(
            `UPDATE school_info 
             SET school_name = COALESCE(school_name, 'Emfundweni High School'),
                 stats_students = COALESCE(stats_students, '850+'),
                 stats_pass_rate = COALESCE(stats_pass_rate, '98.5%'),
                 stats_awards = COALESCE(stats_awards, '25+'),
                 stats_subjects = COALESCE(stats_subjects, '15+'),
                 vision = COALESCE(vision, 'To be a leading institution of academic excellence that produces well-rounded, responsible citizens who are equipped with the knowledge, skills, and values to succeed in an ever-changing world and contribute positively to society.'),
                 values_text = COALESCE(values_text, 'We pursue excellence, uphold integrity, embrace innovation, celebrate inclusivity, take responsibility, and build strong partnerships with families and the community.'),
                 hero_title = COALESCE(hero_title, 'Welcome to Emfundweni'),
                 hero_tagline = COALESCE(hero_tagline, 'Excellence in Education • Nurturing Future Leaders • Building Tomorrow''s Success'),
                 hero_button1_text = COALESCE(hero_button1_text, 'Learn More About Us'),
                 hero_button2_text = COALESCE(hero_button2_text, 'Get In Touch'),
                 footer_tagline = COALESCE(footer_tagline, 'Excellence in Education'),
                 logo_url = COALESCE(logo_url, '/logo.png')
             WHERE id = 1`,
            (err) => {
              if (err && !err.message.includes('duplicate column')) {
                logger.error('Error migrating school info', err);
              }
              resolve(db);
            }
          );
        }
      });
    }

    // Create tables
    db.serialize(() => {
      // School info table
      db.run(`CREATE TABLE IF NOT EXISTS school_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        school_name TEXT DEFAULT 'Emfundweni High School',
        mission TEXT DEFAULT '',
        about TEXT DEFAULT '',
        contact_email TEXT DEFAULT '',
        contact_phone TEXT DEFAULT '',
        contact_address TEXT DEFAULT '',
        stats_students TEXT DEFAULT '850+',
        stats_pass_rate TEXT DEFAULT '98.5%',
        stats_awards TEXT DEFAULT '25+',
        stats_subjects TEXT DEFAULT '15+',
        vision TEXT DEFAULT '',
        values_text TEXT DEFAULT '',
        hero_title TEXT DEFAULT 'Welcome to Emfundweni',
        hero_tagline TEXT DEFAULT 'Excellence in Education • Nurturing Future Leaders • Building Tomorrow''s Success',
        hero_button1_text TEXT DEFAULT 'Learn More About Us',
        hero_button2_text TEXT DEFAULT 'Get In Touch',
        footer_tagline TEXT DEFAULT 'Excellence in Education',
        logo_url TEXT DEFAULT '/logo.png'
      )`, (err) => {
        if (err) {
          logger.error('Error creating school_info table', err);
          reject(err);
          return;
        }
      });

      // Top students table
      db.run(`CREATE TABLE IF NOT EXISTS top_students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        year INTEGER NOT NULL,
        position INTEGER NOT NULL CHECK(position >= 1 AND position <= 10),
        UNIQUE(year, position)
      )`, (err) => {
        if (err) {
          logger.error('Error creating top_students table', err);
          reject(err);
          return;
        }
      });

      // Admin users table
      db.run(`CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      )`, async (err) => {
        if (err) {
          logger.error('Error creating admin_users table', err);
          reject(err);
          return;
        }

        // Create default admin user if none exists
        db.get('SELECT COUNT(*) as count FROM admin_users', async (err, row) => {
          if (err) {
            logger.error('Error checking admin users', err);
            reject(err);
            return;
          }

          if (row.count === 0) {
            const defaultPassword = 'admin123';
            const passwordHash = await bcrypt.hash(defaultPassword, 10);
            db.run(
              'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
              ['admin', passwordHash],
              (err) => {
                if (err) {
                  logger.error('Error creating default admin', err);
                  reject(err);
                  return;
                }
                logger.warn('Default admin user created', {
                  username: 'admin',
                  message: 'Please change the password immediately!'
                });
                initializeSchoolInfo();
              }
            );
          } else {
            initializeSchoolInfo();
          }
        });
      });
    });
  });
}

// Get database instance
function getDatabase() {
  return new sqlite3.Database(DB_PATH);
}

module.exports = { initDatabase, getDatabase };
