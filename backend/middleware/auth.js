const jwt = require('jsonwebtoken');

let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('ERROR: JWT_SECRET environment variable is not set!');
    console.error('Please set JWT_SECRET in your .env file for production.');
    process.exit(1);
  } else {
    console.warn('WARNING: JWT_SECRET not set, using fallback (DEVELOPMENT ONLY)');
    JWT_SECRET = 'your-secret-key-change-in-production-DEVELOPMENT-ONLY';
  }
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken, JWT_SECRET };

