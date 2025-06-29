const { logger } = require('../utils/logger');
const { calculatePurities } = require('../utils/rateCalculations');

// Fallback rates (in INR per 10g) - realistic current market rates
const FALLBACK_RATES = {
  gold: {
    '24KT': 75500,
    '22KT': 69208,
    '20KT': 62917,
    '18KT': 56625,
    '14KT': 43792
  },
  silver: {
    '24KT': 954,
    '22KT': 875,
    '18KT': 716,
    '14KT': 557,
    '9KT': 358
  },
  timestamp: new Date().toISOString(),
  source: 'fallback'
};

/**
 * Simulate realistic market fluctuations
 */
function simulateMarketRates() {
  logger.info('Simulating realistic market rates');
  
  // Small random fluctuations (±0.5%)
  const goldFluctuation = (Math.random() - 0.5) * 0.01; // ±0.5%
  const silverFluctuation = (Math.random() - 0.5) * 0.01; // ±0.5%
  
  const baseGold = FALLBACK_RATES.gold['24KT'];
  const baseSilver = FALLBACK_RATES.silver['24KT'];
  
  const newGold24kt = Math.round(baseGold * (1 + goldFluctuation));
  const newSilver24kt = Math.round(baseSilver * (1 + silverFluctuation));
  
  return {
    lastUpdated: new Date().toISOString(),
    gold: calculatePurities(newGold24kt, 'gold'),
    silver: calculatePurities(newSilver24kt, 'silver'),
    source: 'simulation',
    timestamp: new Date().toISOString()
  };
}

/**
 * Get current rates
 */
async function getCurrentRates() {
  try {
    // For now, return simulated rates
    // In production, this would fetch from external APIs
    const rates = simulateMarketRates();
    
    logger.info(`Generated rates - Gold 24KT: ₹${rates.gold['24KT']}, Silver 24KT: ₹${rates.silver['24KT']}`);
    
    return rates;
  } catch (error) {
    logger.error('Error getting current rates:', error);
    
    // Return fallback rates
    return {
      lastUpdated: new Date().toISOString(),
      ...FALLBACK_RATES
    };
  }
}

/**
 * Force refresh rates
 */
async function refreshRates() {
  logger.info('Force refreshing rates');
  return await getCurrentRates();
}

module.exports = {
  getCurrentRates,
  refreshRates
};