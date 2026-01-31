const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const logger = require('./utils/logger');

let pool = null;

// Create MySQL connection pool
function createPool() {
  // Support both DATABASE_URL (Railway format) and individual env vars
  if (process.env.DATABASE_URL) {
    // Parse Railway's MySQL URL: mysql://user:pass@host:port/database
    pool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  } else {
    // Use individual environment variables as fallback
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'emfudweni_school',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  }

  // Test connection
  pool.getConnection((err, connection) => {
    if (err) {
      logger.error('MySQL connection error', err);
      throw err;
    }
    logger.info('MySQL connection pool created successfully');
    connection.release();
  });

  return pool;
}

// Create tables with MySQL syntax
function createTables(pool) {
  return new Promise((resolve, reject) => {
    // School info table
    const schoolInfoTable = `
      CREATE TABLE IF NOT EXISTS school_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        school_name VARCHAR(255) DEFAULT 'Emfundweni High School',
        mission TEXT,
        about TEXT,
        contact_email VARCHAR(255) DEFAULT '',
        contact_phone VARCHAR(50) DEFAULT '',
        contact_address TEXT,
        stats_students VARCHAR(50) DEFAULT '850+',
        stats_pass_rate VARCHAR(50) DEFAULT '98.5%',
        stats_awards VARCHAR(50) DEFAULT '25+',
        stats_subjects VARCHAR(50) DEFAULT '15+',
        vision TEXT,
        values_text TEXT,
        hero_title VARCHAR(255) DEFAULT 'Welcome to Emfundweni',
        hero_tagline TEXT,
        hero_button1_text VARCHAR(100) DEFAULT 'Learn More About Us',
        hero_button2_text VARCHAR(100) DEFAULT 'Get In Touch',
        footer_tagline VARCHAR(255) DEFAULT 'Excellence in Education',
        logo_url VARCHAR(255) DEFAULT '/logo.png'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    // Top students table
    const topStudentsTable = `
      CREATE TABLE IF NOT EXISTS top_students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        year INT NOT NULL,
        position INT NOT NULL,
        UNIQUE KEY unique_year_position (year, position),
        CHECK (position >= 1 AND position <= 10)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    // Admin users table
    const adminUsersTable = `
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    // Execute table creation in sequence
    pool.query(schoolInfoTable, (err) => {
      if (err) {
        logger.error('Error creating school_info table', err);
        return reject(err);
      }

      pool.query(topStudentsTable, (err) => {
        if (err) {
          logger.error('Error creating top_students table', err);
          return reject(err);
        }

        pool.query(adminUsersTable, (err) => {
          if (err) {
            logger.error('Error creating admin_users table', err);
            return reject(err);
          }

          logger.info('All tables created successfully');
          resolve();
        });
      });
    });
  });
}

// Initialize default data
async function initializeDefaultData(pool) {
  return new Promise((resolve, reject) => {
    // Check if admin user exists
    pool.query('SELECT COUNT(*) as count FROM admin_users', async (err, results) => {
      if (err) {
        logger.error('Error checking admin users', err);
        return reject(err);
      }

      const adminCount = results[0].count;

      if (adminCount === 0) {
        // Create default admin user
        const defaultPassword = 'emfu23579&';
        const passwordHash = await bcrypt.hash(defaultPassword, 10);

        pool.query(
          'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
          ['admin', passwordHash],
          (err) => {
            if (err) {
              logger.error('Error creating default admin', err);
              return reject(err);
            }
            logger.warn('Default admin user created', {
              username: 'admin',
              message: 'Please change the password immediately!'
            });
          }
        );
      }

      // Check if school info exists
      pool.query('SELECT COUNT(*) as count FROM school_info', (err, results) => {
        if (err) {
          logger.error('Error checking school info', err);
          return reject(err);
        }

        const schoolInfoCount = results[0].count;

        if (schoolInfoCount === 0) {
          // Insert default school info
          pool.query(
            `INSERT INTO school_info (
              school_name, mission, about, contact_email, contact_phone, contact_address,
              stats_students, stats_pass_rate, stats_awards, stats_subjects,
              vision, values_text, hero_title, hero_tagline,
              hero_button1_text, hero_button2_text, footer_tagline, logo_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                return reject(err);
              }
              logger.info('School info initialized with default values');
              resolve();
            }
          );
        } else {
          resolve();
        }
      });
    });
  });
}

// Initialize database and create tables
async function initDatabase() {
  try {
    // Create connection pool
    pool = createPool();

    // Create tables
    await createTables(pool);

    // Initialize default data
    await initializeDefaultData(pool);

    logger.info('Database initialization complete');
    return pool;
  } catch (error) {
    logger.error('Database initialization failed', error);
    throw error;
  }
}

// Get database pool
function getDatabase() {
  if (!pool) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return pool;
}

// Graceful shutdown
function closeDatabase() {
  if (pool) {
    pool.end((err) => {
      if (err) {
        logger.error('Error closing database pool', err);
      } else {
        logger.info('Database pool closed');
      }
    });
  }
}

module.exports = { initDatabase, getDatabase, closeDatabase };
