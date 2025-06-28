const { logger } = require('../utils/logger');
const { fetchFromMetalsAPI, fetchFromGoldAPI, fetchFromFixerAPI } = require('./apiClients');
const { calculatePurities, validateRates } = require('../utils/rateCalculations');
const cacheService = require('./cacheService');

// Fallback rates (in USD per troy ounce) - updated periodically
const FALLBACK_RATES = {
  gold: 2050, // Approximate current gold price
  silver: 24,  // Approximate current silver price
  exchangeRate: 83.5, // USD to INR
  timestamp: new Date().toISOString(),
  source: 'fallback'
};

/**
 * Fetch exchange rate with fallback options
 */
async function fetchExchangeRate() {
  try {
    // Try Fixer API first
    const exchangeData = await fetchFromFixerAPI();
    return {
      rate: exchangeData.rates.INR || FALLBACK_RATES.exchangeRate,
      source: exchangeData.source
    };
  } catch (error) {
    logger.warn('Exchange rate API failed, using fallback rate:', error.message);
    return {
      rate: FALLBACK_RATES.exchangeRate,
      source: 'fallback'
    };
  }
}

/**
 * Fetch precious metal rates with multiple fallback options
 */
async function fetchMetalRates() {
  const apis = [
    { name: 'metals_api', fetch: fetchFromMetalsAPI },
    { name: 'gold_api', fetch: fetchFromGoldAPI }
  ];

  for (const api of apis) {
    try {
      logger.info(`Attempting to fetch rates from ${api.name}`);
      const data = await api.fetch();
      
      if (validateRates(data)) {
        logger.info(`Successfully fetched rates from ${api.name}`);
        return data;
      } else {
        logger.warn(`Invalid data received from ${api.name}`);
      }
    } catch (error) {
      logger.warn(`${api.name} failed:`, error.message);
    }
  }

  // If all APIs fail, return fallback rates
  logger.warn('All metal rate APIs failed, using fallback rates');
  return {
    gold: FALLBACK_RATES.gold,
    silver: FALLBACK_RATES.silver,
    timestamp: new Date().toISOString(),
    source: 'fallback'
  };
}

/**
 * Convert USD per troy ounce to INR per 10 grams
 */
function convertToINRPer10g(usdPerTroyOunce, exchangeRate) {
  // 1 troy ounce = 31.1035 grams
  // Convert to per gram, then to per 10 grams, then to INR
  const usdPer10g = (usdPerTroyOunce / 31.1035) * 10;
  return Math.round(usdPer10g * exchangeRate);
}

/**
 * Get current rates with comprehensive fallback system
 */
async function getCurrentRates() {
  try {
    // Check cache first
    const cachedRates = cacheService.get('current_rates');
    if (cachedRates) {
      logger.info('Returning cached rates');
      return {
        ...cachedRates,
        cache_info: {
          cached: true,
          cache_age: Math.floor((Date.now() - new Date(cachedRates.timestamp).getTime()) / 1000)
        }
      };
    }

    logger.info('Fetching fresh rates from APIs');

    // Fetch metal rates and exchange rate in parallel
    const [metalRates, exchangeData] = await Promise.all([
      fetchMetalRates(),
      fetchExchangeRate()
    ]);

    // Convert USD rates to INR per 10g
    const goldINR = convertToINRPer10g(metalRates.gold, exchangeData.rate);
    const silverINR = convertToINRPer10g(metalRates.silver, exchangeData.rate);

    // Calculate different purities
    const goldPurities = calculatePurities(goldINR, 'gold');
    const silverPurities = calculatePurities(silverINR, 'silver');

    const result = {
      lastUpdated: new Date().toISOString(),
      gold: goldPurities,
      silver: silverPurities,
      source: metalRates.source,
      exchangeRate: exchangeData.rate,
      exchangeSource: exchangeData.source,
      timestamp: new Date().toISOString(),
      cache_info: {
        cached: false,
        cache_age: 0
      }
    };

    // Cache the result
    cacheService.set('current_rates', result);
    
    logger.info(`Successfully calculated rates - Gold 24KT: ₹${goldINR}, Silver 24KT: ₹${silverINR}`);
    return result;

  } catch (error) {
    logger.error('Error in getCurrentRates:', error);
    
    // Try to return cached data as last resort
    const cachedRates = cacheService.get('current_rates');
    if (cachedRates) {
      logger.warn('Returning stale cached rates due to error');
      return {
        ...cachedRates,
        cache_info: {
          cached: true,
          cache_age: Math.floor((Date.now() - new Date(cachedRates.timestamp).getTime()) / 1000),
          stale: true
        }
      };
    }

    // If no cache available, return fallback rates
    logger.warn('No cached data available, returning fallback rates');
    const goldINR = convertToINRPer10g(FALLBACK_RATES.gold, FALLBACK_RATES.exchangeRate);
    const silverINR = convertToINRPer10g(FALLBACK_RATES.silver, FALLBACK_RATES.exchangeRate);

    return {
      lastUpdated: new Date().toISOString(),
      gold: calculatePurities(goldINR, 'gold'),
      silver: calculatePurities(silverINR, 'silver'),
      source: 'fallback',
      exchangeRate: FALLBACK_RATES.exchangeRate,
      exchangeSource: 'fallback',
      timestamp: new Date().toISOString(),
      cache_info: {
        cached: false,
        cache_age: 0,
        fallback: true
      }
    };
  }
}

/**
 * Force refresh rates (bypass cache)
 */
async function refreshRates() {
  logger.info('Force refreshing rates');
  cacheService.delete('current_rates');
  return await getCurrentRates();
}

/**
 * Get rate history (placeholder for future implementation)
 */
async function getRateHistory(days = 7) {
  // This would typically fetch from a database
  // For now, return empty array
  return [];
}

module.exports = {
  getCurrentRates,
  refreshRates,
  getRateHistory
};