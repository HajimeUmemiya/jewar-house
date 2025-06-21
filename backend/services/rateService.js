const { fetchFromMetalsAPI, fetchFromGoldAPI, fetchFromFixerAPI } = require('./apiClients');
const { getFromCache, setInCache, getCacheStats } = require('./cacheService');
const { calculatePurities, validateRates } = require('../utils/rateCalculations');
const { logger } = require('../utils/logger');

// Fallback rates (updated with current market values)
const FALLBACK_RATES = {
  gold: {
    '24KT': 99150,
    '22KT': 90891,
    '20KT': 83592,
    '18KT': 75563,
    '14KT': 57834
  },
  silver: {
    '24KT': 1065,
    '22KT': 1007,
    '18KT': 829,
    '14KT': 651,
    '9KT': 429
  }
};

// USD to INR exchange rate cache
let usdToInrRate = 83.50;
let lastCurrencyUpdate = 0;
const CURRENCY_UPDATE_INTERVAL = 300000; // 5 minutes

/**
 * Get USD to INR exchange rate with caching
 */
async function getUsdToInrRate() {
  const now = Date.now();
  
  if (now - lastCurrencyUpdate < CURRENCY_UPDATE_INTERVAL) {
    return usdToInrRate;
  }

  try {
    const response = await fetchFromFixerAPI();
    if (response && response.rates && response.rates.INR) {
      usdToInrRate = response.rates.INR;
      lastCurrencyUpdate = now;
      logger.info(`Updated USD to INR rate: ${usdToInrRate}`);
    }
  } catch (error) {
    logger.warn('Failed to update USD to INR rate:', error.message);
  }

  return usdToInrRate;
}

/**
 * Convert USD per troy ounce to INR per 10 grams
 */
function convertToIndianRates(usdPerOunce, exchangeRate) {
  const gramsPerTroyOunce = 31.1035;
  const usdPer10Grams = (usdPerOunce * 10) / gramsPerTroyOunce;
  const inrPer10Grams = usdPer10Grams * exchangeRate;
  return Math.round(inrPer10Grams);
}

/**
 * Fetch rates from multiple APIs with fallback
 */
async function fetchLiveRates() {
  const cacheKey = 'live_rates';
  
  // Try to get from cache first
  const cachedRates = getFromCache(cacheKey);
  if (cachedRates) {
    logger.info('Returning cached rates');
    return { ...cachedRates, _cached: true, _cacheAge: Date.now() - cachedRates._timestamp };
  }

  logger.info('Fetching fresh rates from APIs...');

  try {
    // Get current exchange rate
    const exchangeRate = await getUsdToInrRate();
    
    // Try multiple APIs in order of preference
    const apiClients = [
      { name: 'MetalsAPI', client: fetchFromMetalsAPI },
      { name: 'GoldAPI', client: fetchFromGoldAPI }
    ];

    let rawRates = null;
    let usedApi = null;

    for (const api of apiClients) {
      try {
        logger.info(`Trying ${api.name}...`);
        rawRates = await api.client();
        
        if (rawRates && validateRates(rawRates)) {
          usedApi = api.name;
          logger.info(`Successfully fetched from ${api.name}`);
          break;
        }
      } catch (error) {
        logger.warn(`${api.name} failed:`, error.message);
      }
    }

    if (!rawRates || !validateRates(rawRates)) {
      throw new Error('All APIs failed or returned invalid data');
    }

    // Convert to Indian rates
    const goldInr = convertToIndianRates(rawRates.gold, exchangeRate);
    const silverInr = convertToIndianRates(rawRates.silver, exchangeRate);

    // Calculate different purities
    const processedRates = {
      lastUpdated: new Date().toISOString(),
      gold: calculatePurities(goldInr, 'gold'),
      silver: calculatePurities(silverInr, 'silver'),
      source: usedApi,
      exchangeRate: exchangeRate,
      _timestamp: Date.now()
    };

    // Cache the results
    setInCache(cacheKey, processedRates);
    
    logger.info(`Rates updated successfully from ${usedApi}`);
    logger.info(`Gold 24KT: ₹${processedRates.gold['24KT']}/10g, Silver 24KT: ₹${processedRates.silver['24KT']}/10g`);
    
    return processedRates;

  } catch (error) {
    logger.error('Failed to fetch live rates:', error.message);
    
    // Return fallback rates with warning
    const fallbackRates = {
      lastUpdated: new Date().toISOString(),
      gold: FALLBACK_RATES.gold,
      silver: FALLBACK_RATES.silver,
      source: 'fallback',
      warning: 'Using fallback rates due to API failure',
      _timestamp: Date.now()
    };

    // Cache fallback rates for a shorter period
    setInCache(cacheKey, fallbackRates, 60); // 1 minute cache for fallback
    
    return fallbackRates;
  }
}

/**
 * Get current rates (main export function)
 */
async function getRates() {
  return await fetchLiveRates();
}

/**
 * Force refresh rates (bypass cache)
 */
async function refreshRates() {
  const cacheKey = 'live_rates';
  
  // Clear cache
  const cache = require('./cacheService').cache;
  cache.del(cacheKey);
  
  // Fetch fresh rates
  return await fetchLiveRates();
}

/**
 * Get historical rates (placeholder for future implementation)
 */
async function getHistoricalRates(days = 7) {
  // This would typically fetch from a database or external API
  // For now, return mock data
  const mockData = [];
  const currentRates = await getRates();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simulate historical fluctuations
    const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% variation
    
    mockData.push({
      date: date.toISOString().split('T')[0],
      gold: {
        '24KT': Math.round(currentRates.gold['24KT'] * (1 + fluctuation)),
        '22KT': Math.round(currentRates.gold['22KT'] * (1 + fluctuation))
      },
      silver: {
        '24KT': Math.round(currentRates.silver['24KT'] * (1 + fluctuation))
      }
    });
  }
  
  return mockData;
}

module.exports = {
  getRates,
  refreshRates,
  getHistoricalRates,
  fetchLiveRates
};