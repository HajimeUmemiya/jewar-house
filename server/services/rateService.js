const { logger } = require('../utils/logger');
const { calculatePurities } = require('../utils/rateCalculations');
const { fetchFromMetalsAPI, fetchFromGoldAPI, fetchFromFixerAPI } = require('./apiClients');
const { getFromCache, setInCache } = require('./cacheService');

// Updated fallback rates (in INR per 10g) - Only used when ALL APIs fail
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

// Constants for unit conversions
const TROY_OUNCE_TO_GRAMS = 31.1035;
const GRAMS_PER_10G = 10;

/**
 * Convert USD per troy ounce to INR per 10g
 */
function convertToINRPer10g(usdPerOunce, usdToInrRate) {
  // Convert troy ounce to grams, then to 10g, then USD to INR
  const inrPerGram = (usdPerOunce / TROY_OUNCE_TO_GRAMS) * usdToInrRate;
  return Math.round(inrPerGram * GRAMS_PER_10G);
}

/**
 * Fetch live rates from external APIs with fallback chain
 */
async function fetchLiveRates() {
  logger.info('Attempting to fetch live rates from external APIs');
  
  // Check cache first
  const cachedRates = getFromCache('live_rates');
  if (cachedRates) {
    logger.info('Returning cached live rates');
    return cachedRates;
  }

  let metalRates = null;
  let exchangeRates = null;
  let rateSource = 'unknown';

  // Step 1: Get USD to INR exchange rate
  try {
    logger.info('Fetching USD to INR exchange rate...');
    const exchangeData = await fetchFromFixerAPI();
    exchangeRates = exchangeData.rates;
    logger.info(`Exchange rate fetched: 1 USD = ${exchangeRates.INR} INR`);
  } catch (error) {
    logger.error('Failed to fetch exchange rates:', error.message);
    // Use fallback exchange rate (approximate current rate)
    exchangeRates = { INR: 83.5 };
    logger.warn('Using fallback exchange rate: 1 USD = 83.5 INR');
  }

  // Step 2: Try to get metal rates from APIs (in order of preference)
  const apiAttempts = [
    { name: 'Metals API', fetch: fetchFromMetalsAPI },
    { name: 'Gold API', fetch: fetchFromGoldAPI }
  ];

  for (const api of apiAttempts) {
    try {
      logger.info(`Attempting to fetch from ${api.name}...`);
      metalRates = await api.fetch();
      rateSource = metalRates.source;
      logger.info(`Successfully fetched rates from ${api.name}`);
      break;
    } catch (error) {
      logger.warn(`${api.name} failed:`, error.message);
      continue;
    }
  }

  // Step 3: Process the fetched data or use fallback
  if (metalRates && exchangeRates) {
    try {
      // Convert USD per troy ounce to INR per 10g
      const goldINR = convertToINRPer10g(metalRates.gold, exchangeRates.INR);
      const silverINR = convertToINRPer10g(metalRates.silver, exchangeRates.INR);

      logger.info(`Converted rates - Gold: $${metalRates.gold}/oz → ₹${goldINR}/10g, Silver: $${metalRates.silver}/oz → ₹${silverINR}/10g`);

      const processedRates = {
        lastUpdated: new Date().toISOString(),
        gold: calculatePurities(goldINR, 'gold'),
        silver: calculatePurities(silverINR, 'silver'),
        source: rateSource,
        timestamp: new Date().toISOString(),
        exchangeRate: exchangeRates.INR,
        rawData: {
          goldUSD: metalRates.gold,
          silverUSD: metalRates.silver,
          usdToInr: exchangeRates.INR
        }
      };

      // Cache the processed rates
      setInCache('live_rates', processedRates, 300); // Cache for 5 minutes
      
      logger.info(`Live rates processed successfully from ${rateSource}`);
      return processedRates;

    } catch (error) {
      logger.error('Error processing live rates:', error.message);
    }
  }

  // Step 4: All APIs failed, use enhanced simulation with realistic fluctuations
  logger.warn('All external APIs failed, using enhanced simulation');
  return simulateRealisticRates();
}

/**
 * Enhanced realistic market simulation (only used when APIs fail)
 */
function simulateRealisticRates() {
  logger.info('Generating realistic simulated rates based on market patterns');
  
  // Get time-based factors for more realistic simulation
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  // Market volatility factors
  const isMarketHours = (day >= 1 && day <= 5) && (hour >= 9 && hour < 17);
  const volatilityMultiplier = isMarketHours ? 1.5 : 0.8;
  
  // Small random fluctuations with time-based volatility
  const goldFluctuation = (Math.random() - 0.5) * 0.004 * volatilityMultiplier; // ±0.2-0.3%
  const silverFluctuation = (Math.random() - 0.5) * 0.006 * volatilityMultiplier; // ±0.3-0.45%
  
  const baseGold = FALLBACK_RATES.gold['24KT'];
  const baseSilver = FALLBACK_RATES.silver['24KT'];
  
  const newGold24kt = Math.round(baseGold * (1 + goldFluctuation));
  const newSilver24kt = Math.round(baseSilver * (1 + silverFluctuation));
  
  const simulatedRates = {
    lastUpdated: new Date().toISOString(),
    gold: calculatePurities(newGold24kt, 'gold'),
    silver: calculatePurities(newSilver24kt, 'silver'),
    source: 'simulation_enhanced',
    timestamp: new Date().toISOString(),
    marketHours: isMarketHours,
    volatilityFactor: volatilityMultiplier
  };

  // Cache simulated rates for shorter duration
  setInCache('live_rates', simulatedRates, 60); // Cache for 1 minute
  
  logger.info(`Simulated rates - Gold 24KT: ₹${newGold24kt}, Silver 24KT: ₹${newSilver24kt} (volatility: ${volatilityMultiplier}x)`);
  
  return simulatedRates;
}

/**
 * Get current rates (main function called by API endpoints)
 */
async function getCurrentRates() {
  try {
    logger.info('Getting current rates...');
    
    // Always try to fetch live rates first
    const rates = await fetchLiveRates();
    
    logger.info(`Returning rates from source: ${rates.source}`);
    return rates;
    
  } catch (error) {
    logger.error('Critical error in getCurrentRates:', error);
    
    // Last resort: return static fallback rates
    logger.warn('Using static fallback rates due to critical error');
    return {
      lastUpdated: new Date().toISOString(),
      ...FALLBACK_RATES,
      source: 'fallback_critical_error',
      error: error.message
    };
  }
}

/**
 * Force refresh rates (clears cache and fetches fresh data)
 */
async function refreshRates() {
  logger.info('Force refreshing rates (clearing cache)');
  
  // Clear cached rates to force fresh fetch
  const { deleteFromCache } = require('./cacheService');
  deleteFromCache('live_rates');
  
  return await getCurrentRates();
}

/**
 * Get rate source information for debugging
 */
function getRateSourceInfo() {
  const hasMetalsAPI = !!process.env.METALS_API_KEY;
  const hasGoldAPI = !!process.env.GOLD_API_KEY;
  const hasFixerAPI = !!process.env.FIXER_API_KEY;
  
  return {
    configured_apis: {
      metals_api: hasMetalsAPI,
      gold_api: hasGoldAPI,
      fixer_api: hasFixerAPI
    },
    fallback_available: true,
    cache_enabled: true,
    last_update: new Date().toISOString()
  };
}

module.exports = {
  getCurrentRates,
  refreshRates,
  fetchLiveRates,
  getRateSourceInfo
};