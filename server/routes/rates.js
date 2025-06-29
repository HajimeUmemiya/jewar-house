const express = require('express');
const { getCurrentRates, refreshRates } = require('../services/rateService');
const { logger } = require('../utils/logger');

const router = express.Router();

// GET /api/rates - Get current rates
router.get('/', async (req, res) => {
  try {
    logger.info('Fetching current rates');
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

module.exports = router;