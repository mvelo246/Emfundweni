// Validate required environment variables for production
const logger = require('./logger');

function validateEnv() {
  const required = [];
  const warnings = [];
  const isProduction = process.env.NODE_ENV === 'production';

  // Required in production
  if (isProduction) {
    if (!process.env.JWT_SECRET) {
      required.push('JWT_SECRET');
    }
    if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
      required.push('DATABASE_URL or DB_HOST (for MySQL connection)');
    }
    if (!process.env.FRONTEND_URL) {
      warnings.push('FRONTEND_URL (recommended for CORS)');
    }
  }

  // Check JWT_SECRET strength in production
  if (isProduction && process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      warnings.push('JWT_SECRET should be at least 32 characters long for production');
    }
  }

  if (required.length > 0) {
    logger.error('Missing required environment variables:', required);
    console.error('ERROR: Missing required environment variables:');
    required.forEach(v => console.error(`  - ${v}`));
    console.error('Please set these variables in your .env file.');
    process.exit(1);
  }

  if (warnings.length > 0) {
    logger.warn('Recommended environment variables not set:', warnings);
    if (!isProduction) {
      warnings.forEach(v => console.warn(`  - ${v}`));
    }
  }

  return true;
}

module.exports = { validateEnv };
