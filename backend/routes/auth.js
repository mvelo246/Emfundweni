const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../database');
const { JWT_SECRET } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const db = getDatabase();
  db.get(
    'SELECT * FROM admin_users WHERE username = ?',
    [username],
    async (err, user) => {
      if (err) {
        logger.error('Database error during login', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      try {
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { id: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({ token, username: user.username });
      } catch (error) {
        logger.error('Error during authentication', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  );
});

// Verify token endpoint
router.post('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    res.json({ valid: true, user: decoded });
  });
});

module.exports = router;

