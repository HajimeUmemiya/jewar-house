const express = require('express');
const { logger } = require('../utils/logger');
const { checkApiHealth } = require('../services/apiClients');
const { getCacheStats } = require('../services/cacheService');
const { getRateSourceInfo } = require('../services/rateService');

const router = express.Router();

// GET /api/health - Basic health check
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0',
    service: 'Jewar House API'
  });
});

// GET /api/health/detailed - Detailed health check including APIs
router.get('/detailed', async (req, res) => {
  try {
    logger.info('Performing detailed health check...');
    
    const [apiHealth, cacheStats, rateSourceInfo] = await Promise.all([
      checkApiHealth(),
      Promise.resolve(getCacheStats()),
      Promise.resolve(getRateSourceInfo())
    ]);

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '1.0.0',
      service: 'Jewar House API',
      components: {
        apis: apiHealth,
        cache: cacheStats,
        rate_sources: rateSourceInfo
      },
      environment: {
        node_env: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3001,
        cache_ttl: process.env.CACHE_TTL || 300,
        update_interval: process.env.UPDATE_INTERVAL || 30000
      }
    };

    // Determine overall health status
    const apiStatuses = Object.values(apiHealth);
    const hasHealthyApi = apiStatuses.some(api => api.status === 'healthy');
    const hasUnhealthyApi = apiStatuses.some(api => api.status === 'unhealthy');

    if (!hasHealthyApi && hasUnhealthyApi) {
      healthStatus.status = 'degraded';
      healthStatus.message = 'All external APIs are unhealthy, using fallback rates';
    } else if (hasUnhealthyApi) {
      healthStatus.status = 'partial';
      healthStatus.message = 'Some external APIs are unhealthy, but service is operational';
    }

    const statusCode = healthStatus.status === 'healthy' ? 200 : 
                      healthStatus.status === 'partial' ? 200 : 503;

    res.status(statusCode).json(healthStatus);
    
  } catch (error) {
    logger.error('Health check failed:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error.message,
      service: 'Jewar House API'
    });
  }
});

module.exports = router;