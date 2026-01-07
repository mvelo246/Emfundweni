const xss = require('xss');

// XSS sanitization options
const xssOptions = {
  whiteList: {}, // No HTML tags allowed by default
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style'],
};

// Sanitize string input
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return xss(str, xssOptions);
}

// Sanitize object recursively
function sanitizeObject(obj) {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
}

// Middleware to sanitize request body
function sanitizeInput(req, res, next) {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
}

module.exports = {
  sanitizeInput,
  sanitizeString,
  sanitizeObject,
};


