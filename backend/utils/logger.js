// Production-ready logger
const isProduction = process.env.NODE_ENV === 'production';

const logger = {
  info: (message, ...args) => {
    if (!isProduction) {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  
  error: (message, error) => {
    const timestamp = new Date().toISOString();
    if (isProduction) {
      // In production, log errors in a structured format
      console.error(JSON.stringify({
        level: 'error',
        timestamp,
        message,
        error: error?.message || error,
        stack: error?.stack
      }));
    } else {
      console.error(`[ERROR] ${timestamp} - ${message}`, error);
    }
  },
  
  warn: (message, ...args) => {
    const timestamp = new Date().toISOString();
    if (isProduction) {
      console.warn(JSON.stringify({
        level: 'warn',
        timestamp,
        message,
        ...args
      }));
    } else {
      console.warn(`[WARN] ${timestamp} - ${message}`, ...args);
    }
  },
  
  debug: (message, ...args) => {
    if (!isProduction) {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  }
};

module.exports = logger;

