const express = require('express');
const cors = require('cors');
const { logger } = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:3000', 'http://localhost:19006'],
  credentials: true
}));
app.use(express.json());

// Routes
const healthRoutes = require('./routes/health');
const ratesRoutes = require('./routes/rates');

app.use('/api/health', healthRoutes);
app.use('/api/rates', ratesRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Jewar House API Server is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      rates: '/api/rates'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

app.listen(PORT, () => {
  logger.info(`🚀 Jewar House API Server running on port ${PORT}`);
  logger.info(`📍 Health check: http://localhost:${PORT}/api/health`);
  logger.info(`📊 Rates API: http://localhost:${PORT}/api/rates`);
});

module.exports = app;