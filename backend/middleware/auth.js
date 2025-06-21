const { logger } = require('../utils/logger');

/**
 * Validate API key for protected endpoints
 */
function validateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  const expectedKey = process.env.API_SECRET_KEY;
  
  if (!expectedKey) {
    logger.warn('API_SECRET_KEY not configured, skipping authentication');
    return next();
  }
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required',
      message: 'Please provide an API key in the x-api-key header or api_key query parameter'
    });
  }
  
  if (apiKey !== expectedKey) {
    logger.warn(`Invalid API key attempt from ${req.ip}`);
    return res.status(403).json({
      success: false,
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }
  
  logger.debug('API key validated successfully');
  next();
}

/**
 * Optional API key validation (allows access without key but logs it)
 */
function optionalApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  const expectedKey = process.env.API_SECRET_KEY;
  
  if (expectedKey && apiKey === expectedKey) {
    req.authenticated = true;
    logger.debug('Authenticated request');
  } else {
    req.authenticated = false;
    logger.debug('Unauthenticated request');
  }
  
  next();
}

module.exports = {
  validateApiKey,
  optionalApiKey
};