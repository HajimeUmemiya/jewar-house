const express = require('express');
const { getCurrentRates, refreshRates, getRateSourceInfo } = require('../services/rateService');
const { getCacheStats } = require('../services/cacheService');
const { logger } = require('../utils/logger');

const router = express.Router();

// GET /api/rates - Get current rates
router.get('/', async (req, res) => {
  try {
    logger.info('API request for current rates');
    const rates = await getCurrentRates();
    
    res.json({
      success: true,
      data: rates,
      timestamp: new Date().toISOString()
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

// POST /api/rates/refresh - Force refresh rates
router.post('/refresh', async (req, res) => {
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

// GET /api/rates/status - Get API status and configuration info
router.get('/status', async (req, res) => {
  try {
    const sourceInfo = getRateSourceInfo();
    const cacheStats = getCacheStats();
    
    res.json({
      success: true,
      data: {
        ...sourceInfo,
        cache_stats: cacheStats,
        server_time: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      }
    });
  } catch (error) {
    logger.error('Error getting rate status:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to get status',
      message: error.message
    });
  }
});

module.exports = router;