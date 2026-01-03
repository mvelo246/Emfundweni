const express = require('express');
const { getDatabase } = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get school information (public)
router.get('/', (req, res) => {
  const db = getDatabase();
  db.get('SELECT * FROM school_info WHERE id = 1', (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!row) {
      return res.status(404).json({ error: 'School information not found' });
    }

    res.json(row);
  });
});

// Update school information (protected)
router.put('/', authenticateToken, (req, res) => {
  const { 
    school_name,
    mission, 
    about, 
    contact_email, 
    contact_phone, 
    contact_address,
    stats_students,
    stats_pass_rate,
    stats_awards,
    stats_subjects,
    vision,
    values_text,
    hero_title,
    hero_tagline,
    footer_tagline
  } = req.body;

  // Debug logging for troubleshooting
  if (process.env.NODE_ENV !== 'production') {
    console.log('Received update request:', {
      has_mission: !!mission,
      has_about: !!about,
      has_email: !!contact_email,
      has_phone: !!contact_phone,
      has_address: !!contact_address,
      mission_length: mission?.length,
      about_length: about?.length,
      body_keys: Object.keys(req.body)
    });
  }

  // Validate required fields - ensure they are provided and not empty
  // Allow empty strings for optional fields but require non-empty for required fields
  if (!mission || typeof mission !== 'string' || mission.trim().length === 0) {
    return res.status(400).json({ error: 'Mission is required and cannot be empty' });
  }
  if (!about || typeof about !== 'string' || about.trim().length === 0) {
    return res.status(400).json({ error: 'About is required and cannot be empty' });
  }
  if (!contact_email || typeof contact_email !== 'string' || contact_email.trim().length === 0) {
    return res.status(400).json({ error: 'Contact email is required and cannot be empty' });
  }
  if (!contact_phone || typeof contact_phone !== 'string' || contact_phone.trim().length === 0) {
    return res.status(400).json({ error: 'Contact phone is required and cannot be empty' });
  }
  if (!contact_address || typeof contact_address !== 'string' || contact_address.trim().length === 0) {
    return res.status(400).json({ error: 'Contact address is required and cannot be empty' });
  }

  // Validate email format if provided
  if (contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email.trim())) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const db = getDatabase();
  db.run(
    `UPDATE school_info 
     SET school_name = ?, mission = ?, about = ?, contact_email = ?, contact_phone = ?, contact_address = ?,
         stats_students = ?, stats_pass_rate = ?, stats_awards = ?, stats_subjects = ?,
         vision = ?, values_text = ?,
         hero_title = ?, hero_tagline = ?,
         footer_tagline = ?
     WHERE id = 1`,
    [
      school_name !== undefined && school_name !== null ? school_name : 'Emfundweni High School',
      mission.trim(), 
      about.trim(), 
      contact_email.trim(), 
      contact_phone.trim(), 
      contact_address.trim(),
      stats_students !== undefined && stats_students !== null ? stats_students : '850+',
      stats_pass_rate !== undefined && stats_pass_rate !== null ? stats_pass_rate : '98.5%',
      stats_awards !== undefined && stats_awards !== null ? stats_awards : '25+',
      stats_subjects !== undefined && stats_subjects !== null ? stats_subjects : '15+',
      vision !== undefined && vision !== null ? vision : '',
      values_text !== undefined && values_text !== null ? values_text : '',
      hero_title !== undefined && hero_title !== null ? hero_title : 'Welcome to Emfundweni',
      hero_tagline !== undefined && hero_tagline !== null ? hero_tagline : 'Excellence in Education • Nurturing Future Leaders • Building Tomorrow\'s Success',
      footer_tagline !== undefined && footer_tagline !== null ? footer_tagline : 'Excellence in Education'
    ],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (this.changes === 0) {
        // If no row was updated, insert a new one
        db.run(
          `INSERT INTO school_info (school_name, mission, about, contact_email, contact_phone, contact_address, stats_students, stats_pass_rate, stats_awards, stats_subjects, vision, values_text, hero_title, hero_tagline, footer_tagline)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            school_name !== undefined && school_name !== null ? school_name : 'Emfundweni High School',
            mission.trim(), 
            about.trim(), 
            contact_email.trim(), 
            contact_phone.trim(), 
            contact_address.trim(),
            stats_students !== undefined && stats_students !== null ? stats_students : '850+',
            stats_pass_rate !== undefined && stats_pass_rate !== null ? stats_pass_rate : '98.5%',
            stats_awards !== undefined && stats_awards !== null ? stats_awards : '25+',
            stats_subjects !== undefined && stats_subjects !== null ? stats_subjects : '15+',
            vision !== undefined && vision !== null ? vision : '',
            values_text !== undefined && values_text !== null ? values_text : '',
            hero_title !== undefined && hero_title !== null ? hero_title : 'Welcome to Emfundweni',
            hero_tagline !== undefined && hero_tagline !== null ? hero_tagline : 'Excellence in Education • Nurturing Future Leaders • Building Tomorrow\'s Success',
            footer_tagline !== undefined && footer_tagline !== null ? footer_tagline : 'Excellence in Education'
          ],
          (err) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Internal server error' });
            }
            res.json({ message: 'School information updated successfully' });
          }
        );
      } else {
        res.json({ message: 'School information updated successfully' });
      }
    }
  );
});

module.exports = router;
