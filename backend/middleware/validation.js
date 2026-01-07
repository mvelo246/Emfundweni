const { body, param, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Validation rules for school info update
const validateSchoolInfo = [
  body('school_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('School name must be between 1 and 200 characters')
    .escape(),
  body('mission')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Mission must be between 10 and 2000 characters')
    .escape(),
  body('about')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('About must be between 10 and 5000 characters')
    .escape(),
  body('contact_email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('contact_phone')
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Valid phone number is required')
    .isLength({ min: 5, max: 20 })
    .withMessage('Phone number must be between 5 and 20 characters'),
  body('contact_address')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Contact address must be between 5 and 500 characters')
    .escape(),
  body('stats_students')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Stats students must be less than 50 characters')
    .escape(),
  body('stats_pass_rate')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Stats pass rate must be less than 50 characters')
    .escape(),
  body('stats_awards')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Stats awards must be less than 50 characters')
    .escape(),
  body('stats_subjects')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Stats subjects must be less than 50 characters')
    .escape(),
  body('vision')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Vision must be less than 2000 characters')
    .escape(),
  body('values_text')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Values text must be less than 2000 characters')
    .escape(),
  body('hero_title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Hero title must be less than 200 characters')
    .escape(),
  body('hero_tagline')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Hero tagline must be less than 500 characters')
    .escape(),
  body('footer_tagline')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Footer tagline must be less than 200 characters')
    .escape(),
  handleValidationErrors
];

// Validation rules for student operations
const validateStudent = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Name must be between 1 and 200 characters')
    .matches(/^[a-zA-Z\s\-'\.]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, apostrophes, and periods')
    .escape(),
  body('year')
    .isInt({ min: 1900, max: 2100 })
    .withMessage('Year must be between 1900 and 2100'),
  body('position')
    .isInt({ min: 1, max: 10 })
    .withMessage('Position must be between 1 and 10'),
  handleValidationErrors
];

// Validation rules for student ID parameter
const validateStudentId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Student ID must be a positive integer'),
  handleValidationErrors
];

// Validation rules for login
const validateLogin = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .escape(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  handleValidationErrors
];

// Password strength validation
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateSchoolInfo,
  validateStudent,
  validateStudentId,
  validateLogin,
  validatePasswordStrength,
  handleValidationErrors,
};


