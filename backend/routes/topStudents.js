const express = require('express');
const { getDatabase } = require('../database');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Get all top students (public)
router.get('/', (req, res) => {
  const db = getDatabase();
  db.query(
    'SELECT * FROM top_students ORDER BY year DESC, position ASC',
    (err, results) => {
      if (err) {
        logger.error('Database error', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json(results);
    }
  );
});

// Get top students for a specific year (public)
router.get('/year/:year', (req, res) => {
  const year = parseInt(req.params.year);
  
  // Validate year parameter
  if (isNaN(year) || year < 1900 || year > 2100) {
    return res.status(400).json({ error: 'Invalid year. Year must be between 1900 and 2100' });
  }
  
  const db = getDatabase();
  db.query(
    'SELECT * FROM top_students WHERE year = ? ORDER BY position ASC',
    [year],
    (err, results) => {
      if (err) {
        logger.error('Database error', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json(results);
    }
  );
});

// Add new student (protected)
router.post('/', authenticateToken, (req, res) => {
  const { name, year, position } = req.body;

  // Validate required fields
  if (!name || !year || !position) {
    return res.status(400).json({ error: 'Name, year, and position are required' });
  }

  // Input validation and sanitization
  if (typeof name !== 'string' || name.trim().length === 0 || name.length > 200) {
    return res.status(400).json({ error: 'Name must be a non-empty string (max 200 characters)' });
  }
  if (typeof year !== 'number' || isNaN(year) || year < 1900 || year > 2100) {
    return res.status(400).json({ error: 'Year must be a valid number between 1900 and 2100' });
  }
  if (typeof position !== 'number' || isNaN(position) || position < 1 || position > 10) {
    return res.status(400).json({ error: 'Position must be between 1 and 10' });
  }

  const db = getDatabase();

  // Check if position is already taken for this year
  db.query(
    'SELECT * FROM top_students WHERE year = ? AND position = ?',
    [year, position],
    (err, results) => {
      if (err) {
        logger.error('Database error', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const existing = results[0];
      if (existing) {
        return res.status(400).json({ error: 'Position already taken for this year' });
      }

      // Insert new student (sanitize name)
      db.query(
        'INSERT INTO top_students (name, year, position) VALUES (?, ?, ?)',
        [name.trim(), parseInt(year), parseInt(position)],
        (err, result) => {
          if (err) {
            logger.error('Database error', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          res.status(201).json({
            id: result.insertId,
            name,
            year,
            position,
            message: 'Student added successfully'
          });
        }
      );
    }
  );
});

// Update student (protected)
router.put('/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid student ID' });
  }

  const { name, year, position } = req.body;

  // Validate required fields
  if (!name || !year || !position) {
    return res.status(400).json({ error: 'Name, year, and position are required' });
  }

  // Input validation and sanitization
  if (typeof name !== 'string' || name.trim().length === 0 || name.length > 200) {
    return res.status(400).json({ error: 'Name must be a non-empty string (max 200 characters)' });
  }
  if (typeof year !== 'number' || isNaN(year) || year < 1900 || year > 2100) {
    return res.status(400).json({ error: 'Year must be a valid number between 1900 and 2100' });
  }
  if (typeof position !== 'number' || isNaN(position) || position < 1 || position > 10) {
    return res.status(400).json({ error: 'Position must be between 1 and 10' });
  }

  const db = getDatabase();

  // Check if position is already taken by another student for this year
  db.query(
    'SELECT * FROM top_students WHERE year = ? AND position = ? AND id != ?',
    [year, position, id],
    (err, results) => {
      if (err) {
        logger.error('Database error', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const existing = results[0];
      if (existing) {
        return res.status(400).json({ error: 'Position already taken for this year' });
      }

      // Update student (sanitize inputs)
      db.query(
        'UPDATE top_students SET name = ?, year = ?, position = ? WHERE id = ?',
        [name.trim(), parseInt(year), parseInt(position), id],
        (err, result) => {
          if (err) {
            logger.error('Database error', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
          }

          res.json({ message: 'Student updated successfully' });
        }
      );
    }
  );
});

// Delete student (protected)
router.delete('/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid student ID' });
  }
  const db = getDatabase();

  db.query('DELETE FROM top_students WHERE id = ?', [id], (err, result) => {
    if (err) {
      logger.error('Database error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  });
});

module.exports = router;

