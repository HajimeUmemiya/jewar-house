const axios = require('axios');
const { logger } = require('../utils/logger');

// Configure axios defaults
const axiosConfig = {
  timeout: 10000, // 10 seconds
  headers: {
    'User-Agent': 'JewarHouse-API/1.0',
    'Accept': 'application/json'
  }
};

/**
 * Fetch rates from Metals API
 */
async function fetchFromMetalsAPI() {
  const apiKey = process.env.METALS_API_KEY;
  const baseUrl = process.env.METALS_API_URL || 'https://api.metals.live/v1/spot';
  
  if (!apiKey) {
    throw new Error('Metals API key not configured');
  }

  try {
    logger.debug('Fetching from Metals API...');
    const response = await axios.get(`${baseUrl}/gold,silver`, {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const data = response.data;
    logger.debug('Metals API response:', data);
    
    // Handle different response formats
    const gold = data.gold || data.XAU || data.GOLD;
    const silver = data.silver || data.XAG || data.SILVER;

    if (!gold || !silver) {
      throw new Error('Invalid response format from Metals API');
    }

    const result = {
      gold: parseFloat(gold),
      silver: parseFloat(silver),
      timestamp: new Date().toISOString(),
      source: 'metals_api'
    };

    logger.debug('Parsed Metals API data:', result);
    return result;
  } catch (error) {
    if (error.response) {
      logger.error('Metals API HTTP error:', {
        status: error.response.status,
        data: error.response.data
      });
    } else {
      logger.error('Metals API error:', error.message);
    }
    throw error;
  }
}

/**
 * Fetch rates from Gold API
 */
async function fetchFromGoldAPI() {
  const apiKey = process.env.GOLD_API_KEY;
  const baseUrl = process.env.GOLD_API_URL || 'https://www.goldapi.io/api';
  
  if (!apiKey) {
    throw new Error('Gold API key not configured');
  }

  try {
    logger.debug('Fetching from Gold API...');
    
    // Fetch gold data
    const goldResponse = await axios.get(`${baseUrl}/XAU/USD`, {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'x-access-token': apiKey
      }
    });

    const goldData = goldResponse.data;
    logger.debug('Gold API gold response:', goldData);
    
    // Fetch silver data
    const silverResponse = await axios.get(`${baseUrl}/XAG/USD`, {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'x-access-token': apiKey
      }
    });

    const silverData = silverResponse.data;
    logger.debug('Gold API silver response:', silverData);

    if (!goldData.price || !silverData.price) {
      throw new Error('Invalid response format from Gold API');
    }

    const result = {
      gold: parseFloat(goldData.price),
      silver: parseFloat(silverData.price),
      timestamp: new Date().toISOString(),
      source: 'gold_api'
    };

    logger.debug('Parsed Gold API data:', result);
    return result;
  } catch (error) {
    if (error.response) {
      logger.error('Gold API HTTP error:', {
        status: error.response.status,
        data: error.response.data
      });
    } else {
      logger.error('Gold API error:', error.message);
    }
    throw error;
  }
}

/**
 * Fetch USD to INR exchange rate from Fixer API
 */
async function fetchFromFixerAPI() {
  const apiKey = process.env.FIXER_API_KEY;
  const baseUrl = process.env.FIXER_API_URL || 'https://api.fixer.io/v1';
  
  if (!apiKey) {
    // Try free exchange rate API as fallback
    try {
      logger.debug('Trying free exchange rate API...');
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', axiosConfig);
      logger.debug('Free exchange API response:', response.data);
      
      return {
        rates: response.data.rates,
        timestamp: new Date().toISOString(),
        source: 'exchangerate_api_free'
      };
    } catch (error) {
      logger.error('Free exchange rate API failed:', error.message);
      throw new Error('No exchange rate API configured and free API failed');
    }
  }

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

    return {
      rates: data.rates,
      timestamp: new Date().toISOString(),
      source: 'fixer_api'
    };
  } catch (error) {
    if (error.response) {
      logger.error('Fixer API HTTP error:', {
        status: error.response.status,
        data: error.response.data
      });
    } else {
      logger.error('Fixer API error:', error.message);
    }
    throw error;
  }
}

/**
 * Check health of all configured APIs
 */
async function checkApiHealth() {
  const results = {};
  
  // Check Metals API
  if (process.env.METALS_API_KEY) {
    try {
      await fetchFromMetalsAPI();
      results.metals_api = { status: 'healthy', message: 'API responding correctly' };
    } catch (error) {
      results.metals_api = { status: 'unhealthy', message: error.message };
    }
  } else {
    results.metals_api = { status: 'not_configured', message: 'API key not provided' };
  }

  // Check Gold API
  if (process.env.GOLD_API_KEY) {
    try {
      await fetchFromGoldAPI();
      results.gold_api = { status: 'healthy', message: 'API responding correctly' };
    } catch (error) {
      results.gold_api = { status: 'unhealthy', message: error.message };
    }
  } else {
    results.gold_api = { status: 'not_configured', message: 'API key not provided' };
  }

  // Check Fixer API
  try {
    await fetchFromFixerAPI();
    results.fixer_api = { status: 'healthy', message: 'API responding correctly' };
  } catch (error) {
    results.fixer_api = { status: 'unhealthy', message: error.message };
  }

  return results;
}

module.exports = {
  fetchFromMetalsAPI,
  fetchFromGoldAPI,
  fetchFromFixerAPI,
  checkApiHealth
};