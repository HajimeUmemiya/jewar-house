const express = require('express');
const { logger } = require('../utils/logger');

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

module.exports = router;