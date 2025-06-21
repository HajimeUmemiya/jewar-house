const express = require('express');
const { getRates, getHistoricalRates, refreshRates } = require('../services/rateService');
const { validateApiKey } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// GET /api/rates - Get current rates
router.get('/', async (req, res) => {
  try {
    const rates = await getRates();
    
    res.json({
      success: true,
      data: rates,
      timestamp: new Date().toISOString(),
      source: 'live_api',
      cache_info: {
        cached: rates._cached || false,
        cache_age: rates._cacheAge || 0
      }
    });
  } catch (error) {
    logger.error('Error fetching rates:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rates',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

// POST /api/rates/refresh - Force refresh rates (protected endpoint)
router.post('/refresh', validateApiKey, async (req, res) => {
  try {
    logger.info('Manual rate refresh requested');
    const rates = await refreshRates();
    
    res.json({
      success: true,
      message: 'Rates refreshed successfully',
      data: rates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error refreshing rates:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to refresh rates',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/rates/historical - Get historical rates (future feature)
router.get('/historical', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const historicalRates = await getHistoricalRates(parseInt(days));
    
    res.json({
      success: true,
      data: historicalRates,
      period: `${days} days`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching historical rates:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch historical rates',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/rates/config - Get API configuration (protected)
router.get('/config', validateApiKey, (req, res) => {
  res.json({
    success: true,
    config: {
      update_interval: process.env.UPDATE_INTERVAL || 30000,
      cache_ttl: process.env.CACHE_TTL || 300,
      apis_configured: {
        metals_api: !!process.env.METALS_API_KEY,
        gold_api: !!process.env.GOLD_API_KEY,
        fixer_api: !!process.env.FIXER_API_KEY
      },
      redis_enabled: process.env.USE_REDIS === 'true'
    }
  });
});

module.exports = router;