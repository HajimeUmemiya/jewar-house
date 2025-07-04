const axios = require('axios');
const { logger } = require('../utils/logger');

// Configure axios defaults
const axiosConfig = {
  timeout: 15000, // 15 seconds timeout
  headers: {
    'User-Agent': 'JewarHouse-API/1.0',
    'Accept': 'application/json'
  }
};

/**
 * Fetch rates from Metals API
 * Returns: { gold: number, silver: number, timestamp: string, source: string }
 */
async function fetchFromMetalsAPI() {
  const apiKey = process.env.METALS_API_KEY;
  const baseUrl = process.env.METALS_API_URL || 'https://api.metals.live/v1/spot';
  
  if (!apiKey) {
    throw new Error('Metals API key not configured');
  }

  if (process.env.ENABLE_METALS_API === 'false') {
    throw new Error('Metals API disabled in configuration');
  }

  try {
    logger.debug('Fetching from Metals API...');
    
    // Metals API typically provides spot prices for XAU (gold) and XAG (silver)
    const response = await axios.get(`${baseUrl}/gold,silver`, {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'Authorization': `Bearer ${apiKey}`
      },
      params: {
        currency: 'USD',
        unit: 'oz' // Troy ounce
      }
    });

    const data = response.data;
    logger.debug('Metals API response:', data);
    
    // Handle different possible response formats
    let gold, silver;
    
    if (data.gold && data.silver) {
      gold = data.gold;
      silver = data.silver;
    } else if (data.XAU && data.XAG) {
      gold = data.XAU;
      silver = data.XAG;
    } else if (data.rates) {
      gold = data.rates.XAU || data.rates.gold;
      silver = data.rates.XAG || data.rates.silver;
    } else {
      throw new Error('Unexpected response format from Metals API');
    }

    if (!gold || !silver) {
      throw new Error('Missing gold or silver data in Metals API response');
    }

    const result = {
      gold: parseFloat(gold),
      silver: parseFloat(silver),
      timestamp: new Date().toISOString(),
      source: 'metals_api'
    };

    logger.info(`Metals API success - Gold: $${result.gold}/oz, Silver: $${result.silver}/oz`);
    return result;
    
  } catch (error) {
    if (error.response) {
      logger.error('Metals API HTTP error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
      throw new Error(`Metals API HTTP ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      logger.error('Metals API network error:', error.message);
      throw new Error('Metals API network error: Unable to reach server');
    } else {
      logger.error('Metals API error:', error.message);
      throw error;
    }
  }
}

/**
 * Fetch rates from Gold API
 * Returns: { gold: number, silver: number, timestamp: string, source: string }
 */
async function fetchFromGoldAPI() {
  const apiKey = process.env.GOLD_API_KEY;
  const baseUrl = process.env.GOLD_API_URL || 'https://www.goldapi.io/api';
  
  if (!apiKey) {
    throw new Error('Gold API key not configured');
  }

  if (process.env.ENABLE_GOLD_API === 'false') {
    throw new Error('Gold API disabled in configuration');
  }

  try {
    logger.debug('Fetching from Gold API...');
    
    // Gold API requires separate calls for gold and silver
    const [goldResponse, silverResponse] = await Promise.all([
      axios.get(`${baseUrl}/XAU/USD`, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'x-access-token': apiKey
        }
      }),
      axios.get(`${baseUrl}/XAG/USD`, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'x-access-token': apiKey
        }
      })
    ]);

    const goldData = goldResponse.data;
    const silverData = silverResponse.data;
    
    logger.debug('Gold API responses:', { gold: goldData, silver: silverData });

    // Validate response structure
    if (!goldData.price || !silverData.price) {
      throw new Error('Missing price data in Gold API response');
    }

    const result = {
      gold: parseFloat(goldData.price),
      silver: parseFloat(silverData.price),
      timestamp: new Date().toISOString(),
      source: 'gold_api'
    };

    logger.info(`Gold API success - Gold: $${result.gold}/oz, Silver: $${result.silver}/oz`);
    return result;
    
  } catch (error) {
    if (error.response) {
      logger.error('Gold API HTTP error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
      throw new Error(`Gold API HTTP ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      logger.error('Gold API network error:', error.message);
      throw new Error('Gold API network error: Unable to reach server');
    } else {
      logger.error('Gold API error:', error.message);
      throw error;
    }
  }
}

/**
 * Fetch USD to INR exchange rate from Fixer API or free alternatives
 * Returns: { rates: { INR: number }, timestamp: string, source: string }
 */
async function fetchFromFixerAPI() {
  const apiKey = process.env.FIXER_API_KEY;
  const baseUrl = process.env.FIXER_API_URL || 'https://api.fixer.io/v1';
  
  // Try Fixer API first if configured
  if (apiKey && process.env.ENABLE_FIXER_API !== 'false') {
    try {
      logger.debug('Fetching from Fixer API...');
      const response = await axios.get(`${baseUrl}/latest`, {
        ...axiosConfig,
        params: {
          access_key: apiKey,
          base: 'USD',
          symbols: 'INR'
        }
      });

      const data = response.data;
      logger.debug('Fixer API response:', data);
      
      if (!data.success || !data.rates || !data.rates.INR) {
        throw new Error('Invalid response format from Fixer API');
      }

      logger.info(`Fixer API success - USD to INR: ${data.rates.INR}`);
      return {
        rates: data.rates,
        timestamp: new Date().toISOString(),
        source: 'fixer_api'
      };
      
    } catch (error) {
      logger.warn('Fixer API failed, trying free alternatives:', error.message);
    }
  }

  // Try free exchange rate APIs as fallback
  const freeApis = [
    {
      name: 'ExchangeRate-API',
      url: 'https://api.exchangerate-api.com/v4/latest/USD',
      source: 'exchangerate_api_free'
    },
    {
      name: 'CurrencyAPI',
      url: 'https://api.currencyapi.com/v3/latest?apikey=free&base_currency=USD&currencies=INR',
      source: 'currency_api_free'
    }
  ];

  for (const api of freeApis) {
    try {
      logger.debug(`Trying ${api.name}...`);
      const response = await axios.get(api.url, axiosConfig);
      const data = response.data;
      
      let inrRate;
      if (data.rates && data.rates.INR) {
        inrRate = data.rates.INR;
      } else if (data.data && data.data.INR && data.data.INR.value) {
        inrRate = data.data.INR.value;
      } else {
        throw new Error(`Unexpected response format from ${api.name}`);
      }

      logger.info(`${api.name} success - USD to INR: ${inrRate}`);
      return {
        rates: { INR: inrRate },
        timestamp: new Date().toISOString(),
        source: api.source
      };
      
    } catch (error) {
      logger.warn(`${api.name} failed:`, error.message);
      continue;
    }
  }

  // All APIs failed
  throw new Error('All exchange rate APIs failed');
}

/**
 * Check health of all configured APIs
 */
async function checkApiHealth() {
  const results = {};
  
  // Check Metals API
  if (process.env.METALS_API_KEY && process.env.ENABLE_METALS_API !== 'false') {
    try {
      await fetchFromMetalsAPI();
      results.metals_api = { status: 'healthy', message: 'API responding correctly' };
    } catch (error) {
      results.metals_api = { status: 'unhealthy', message: error.message };
    }
  } else {
    results.metals_api = { status: 'not_configured', message: 'API key not provided or disabled' };
  }

  // Check Gold API
  if (process.env.GOLD_API_KEY && process.env.ENABLE_GOLD_API !== 'false') {
    try {
      await fetchFromGoldAPI();
      results.gold_api = { status: 'healthy', message: 'API responding correctly' };
    } catch (error) {
      results.gold_api = { status: 'unhealthy', message: error.message };
    }
  } else {
    results.gold_api = { status: 'not_configured', message: 'API key not provided or disabled' };
  }

  // Check Exchange Rate APIs
  try {
    await fetchFromFixerAPI();
    results.exchange_rate_api = { status: 'healthy', message: 'Exchange rate API responding correctly' };
  } catch (error) {
    results.exchange_rate_api = { status: 'unhealthy', message: error.message };
  }

  return results;
}

module.exports = {
  fetchFromMetalsAPI,
  fetchFromGoldAPI,
  fetchFromFixerAPI,
  checkApiHealth
};