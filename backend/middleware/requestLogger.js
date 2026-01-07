const logger = require('../utils/logger');

// Request logging middleware
function requestLogger(req, res, next) {
  const start = Date.now();
  
  // Log request
  logger.debug(`${req.method} ${req.path}`, {
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent')
  });
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress
    };
    
    if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.debug('HTTP Request', logData);
    }
  });
  
  next();
}

module.exports = requestLogger;

