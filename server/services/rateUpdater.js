const { fetchLiveRates } = require('./rateService');
const { logger } = require('../utils/logger');

let updateInterval = null;
let isUpdating = false;

/**
 * Start the automatic rate updater
 */
function startRateUpdater() {
  const intervalMs = parseInt(process.env.UPDATE_INTERVAL) || 30000; // 30 seconds default
  
  if (updateInterval) {
    logger.warn('Rate updater already running');
    return;
  }

  logger.info(`Starting rate updater with ${intervalMs}ms interval`);
  
  // Initial update
  updateRates();
  
  // Set up recurring updates
  updateInterval = setInterval(updateRates, intervalMs);
  
  logger.info('Rate updater started successfully');
}

/**
 * Stop the automatic rate updater
 */
function stopRateUpdater() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
    logger.info('Rate updater stopped');
  }
}

/**
 * Update rates (called by interval)
 */
async function updateRates() {
  if (isUpdating) {
    logger.debug('Rate update already in progress, skipping');
    return;
  }

  isUpdating = true;
  
  try {
    logger.debug('Updating rates...');
    const startTime = Date.now();
    
    await fetchLiveRates();
    
    const duration = Date.now() - startTime;
    logger.debug(`Rate update completed in ${duration}ms`);
  } catch (error) {
    logger.error('Rate update failed:', error.message);
  } finally {
    isUpdating = false;
  }
}

/**
 * Get updater status
 */
function getUpdaterStatus() {
  return {
    running: !!updateInterval,
    updating: isUpdating,
    interval: parseInt(process.env.UPDATE_INTERVAL) || 30000,
    next_update: updateInterval ? new Date(Date.now() + (parseInt(process.env.UPDATE_INTERVAL) || 30000)).toISOString() : null
  };
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('Stopping rate updater due to SIGTERM');
  stopRateUpdater();
});

process.on('SIGINT', () => {
  logger.info('Stopping rate updater due to SIGINT');
  stopRateUpdater();
});

module.exports = {
  startRateUpdater,
  stopRateUpdater,
  updateRates,
  getUpdaterStatus
};