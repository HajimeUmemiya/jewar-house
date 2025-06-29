const { logger } = require('../utils/logger');
const { calculatePurities } = require('../utils/rateCalculations');

// Updated fallback rates (in INR per 10g) - Current realistic market rates as of 2025
const FALLBACK_RATES = {
  gold: {
    '24KT': 99150,  // Current market rate ~₹99,150 per 10g
    '22KT': 90891,  // 22/24 * 99150
    '20KT': 83592,  // 20/24 * 99150
    '18KT': 75563,  // 18/24 * 99150
    '14KT': 57834   // 14/24 * 99150
  },
  silver: {
    '24KT': 1065,   // Current market rate ~₹1,065 per 10g
    '22KT': 1007,   // 22/24 * 1065
    '18KT': 829,    // 18/24 * 1065
    '14KT': 651,    // 14/24 * 1065
    '9KT': 429      // 9/24 * 1065
  },
  timestamp: new Date().toISOString(),
  source: 'fallback'
};

/**
 * Simulate realistic market fluctuations
 */
function simulateMarketRates() {
  logger.info('Simulating realistic market rates');
  
  // Small random fluctuations (±0.3% for more realistic movement)
  const goldFluctuation = (Math.random() - 0.5) * 0.006; // ±0.3%
  const silverFluctuation = (Math.random() - 0.5) * 0.008; // ±0.4% (silver more volatile)
  
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