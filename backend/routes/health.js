const express = require('express');
const { checkApiHealth } = require('../services/apiClients');
const { getCacheStats } = require('../services/cacheService');
const { logger } = require('../utils/logger');

const router = express.Router();

// GET /api/health - Basic health check
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

// GET /api/health/detailed - Detailed health check
router.get('/detailed', async (req, res) => {
  try {
    const [apiHealth, cacheStats] = await Promise.all([
      checkApiHealth(),
      getCacheStats()
    ]);

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '1.0.0',
      services: {
        api_clients: apiHealth,
        cache: cacheStats
      },
      environment: {
        node_version: process.version,
        platform: process.platform,
        env: process.env.NODE_ENV || 'development'
      }
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;