// Custom error class for application errors
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
function errorHandler(err, req, res, next) {
  // Log error details (sanitized for production)
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  if (isDevelopment) {
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
    });
  } else {
    // In production, log minimal information
    console.error('Error:', {
      message: err.message,
      statusCode: err.statusCode || 500,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Don't leak error details in production
  const message = isDevelopment 
    ? err.message 
    : statusCode === 500 
      ? 'Internal server error' 
      : err.message;

  // Send error response
  res.status(statusCode).json({
    error: message,
    ...(isDevelopment && { stack: err.stack }),
  });
}

// 404 handler
function notFoundHandler(req, res, next) {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path 
  });
}

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
};


