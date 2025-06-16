import { format } from 'date-fns';

// Environment configuration
const API_CONFIG = {
  url: process.env.EXPO_PUBLIC_API_URL || 'https://api.goldrates.com',
  key: process.env.EXPO_PUBLIC_API_KEY || '',
  updateInterval: parseInt(process.env.EXPO_PUBLIC_RATE_UPDATE_INTERVAL || '30000'), // Increased to 30 seconds for real API calls
  enableLiveRates: process.env.EXPO_PUBLIC_ENABLE_LIVE_RATES === 'true',
};

// Default rates from environment variables (only used as absolute fallback)
const DEFAULT_RATES = {
  gold: {
    '24KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_GOLD_24KT || '92838'),
    '22KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_GOLD_22KT || '85155'),
    '20KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_GOLD_20KT || '77830'),
    '18KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_GOLD_18KT || '70375'),
    '14KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_GOLD_14KT || '53800'),
  },
  silver: {
    '24KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_SILVER_24KT || '954'),
    '22KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_SILVER_22KT || '905'),
    '18KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_SILVER_18KT || '746'),
    '14KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_SILVER_14KT || '586'),
    '9KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_SILVER_9KT || '388'),
  },
};

// WebSocket connection for real-time updates
let ws = null;
let subscribers = new Set();

// Current rates initialized with environment defaults
let currentRates = {
  lastUpdated: new Date(),
  ...DEFAULT_RATES,
};

// Last successful API fetch time to prevent excessive calls
let lastApiFetch = 0;
const MIN_API_INTERVAL = 10000; // Minimum 10 seconds between API calls

// Secure API call function with enhanced error handling
const fetchRatesFromAPI = async () => {
  try {
    // Rate limiting: prevent excessive API calls
    const now = Date.now();
    if (now - lastApiFetch < MIN_API_INTERVAL) {
      console.log('API call rate limited, using cached rates');
      return {
        ...currentRates,
        lastUpdated: new Date(),
      };
    }

    // Check if API is properly configured
    if (!API_CONFIG.key || API_CONFIG.url === 'https://api.goldrates.com') {
      console.warn('API not properly configured. Please set EXPO_PUBLIC_API_URL and EXPO_PUBLIC_API_KEY in your environment variables.');
      return {
        ...currentRates,
        lastUpdated: new Date(),
      };
    }

    console.log('Fetching live rates from API...');
    lastApiFetch = now;

    const response = await fetch(`${API_CONFIG.url}/rates`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.key}`,
        'Content-Type': 'application/json',
        'User-Agent': 'JewarHouse/1.0',
      },
      timeout: 10000, // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully fetched live rates from API');
    
    // Transform API response to our format
    // Note: Adjust these mappings based on your actual API response structure
    const transformedRates = {
      lastUpdated: new Date(),
      gold: {
        '24KT': data.gold?.['24KT'] || data.gold?.karat24 || data.rates?.gold?.['24K'] || currentRates.gold['24KT'],
        '22KT': data.gold?.['22KT'] || data.gold?.karat22 || data.rates?.gold?.['22K'] || currentRates.gold['22KT'],
        '20KT': data.gold?.['20KT'] || data.gold?.karat20 || data.rates?.gold?.['20K'] || currentRates.gold['20KT'],
        '18KT': data.gold?.['18KT'] || data.gold?.karat18 || data.rates?.gold?.['18K'] || currentRates.gold['18KT'],
        '14KT': data.gold?.['14KT'] || data.gold?.karat14 || data.rates?.gold?.['14K'] || currentRates.gold['14KT'],
      },
      silver: {
        '24KT': data.silver?.['24KT'] || data.silver?.pure || data.rates?.silver?.['24K'] || currentRates.silver['24KT'],
        '22KT': data.silver?.['22KT'] || data.silver?.karat22 || data.rates?.silver?.['22K'] || currentRates.silver['22KT'],
        '18KT': data.silver?.['18KT'] || data.silver?.karat18 || data.rates?.silver?.['18K'] || currentRates.silver['18KT'],
        '14KT': data.silver?.['14KT'] || data.silver?.karat14 || data.rates?.silver?.['14K'] || currentRates.silver['14KT'],
        '9KT': data.silver?.['9KT'] || data.silver?.karat9 || data.rates?.silver?.['9K'] || currentRates.silver['9KT'],
      },
    };

    // Validate that we got meaningful data (rates should be positive numbers)
    const isValidRate = (rate) => typeof rate === 'number' && rate > 0;
    
    if (!isValidRate(transformedRates.gold['22KT']) || !isValidRate(transformedRates.silver['24KT'])) {
      console.warn('API returned invalid rate data, using cached rates');
      return {
        ...currentRates,
        lastUpdated: new Date(),
      };
    }

    return transformedRates;
  } catch (error) {
    console.error('Failed to fetch rates from API:', error.message);
    // Return current rates with updated timestamp on error
    return {
      ...currentRates,
      lastUpdated: new Date(),
    };
  }
};

// Function to connect to WebSocket or start API polling
const connectWebSocket = () => {
  if (!API_CONFIG.enableLiveRates) {
    console.log('Live rates disabled in configuration');
    return;
  }

  if (!ws) {
    // Check if we have WebSocket URL (wss://) and API key
    if (API_CONFIG.key && API_CONFIG.url.includes('wss://')) {
      console.log('Attempting WebSocket connection...');
      // Real WebSocket connection for production
      try {
        ws = new WebSocket(`${API_CONFIG.url.replace('https://', 'wss://')}/live?token=${API_CONFIG.key}`);
        
        ws.onopen = () => {
          console.log('WebSocket connected successfully');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Received WebSocket update');
            
            currentRates = {
              lastUpdated: new Date(),
              gold: {
                '24KT': data.gold?.['24KT'] || currentRates.gold['24KT'],
                '22KT': data.gold?.['22KT'] || currentRates.gold['22KT'],
                '20KT': data.gold?.['20KT'] || currentRates.gold['20KT'],
                '18KT': data.gold?.['18KT'] || currentRates.gold['18KT'],
                '14KT': data.gold?.['14KT'] || currentRates.gold['14KT'],
              },
              silver: {
                '24KT': data.silver?.['24KT'] || currentRates.silver['24KT'],
                '22KT': data.silver?.['22KT'] || currentRates.silver['22KT'],
                '18KT': data.silver?.['18KT'] || currentRates.silver['18KT'],
                '14KT': data.silver?.['14KT'] || currentRates.silver['14KT'],
                '9KT': data.silver?.['9KT'] || currentRates.silver['9KT'],
              },
            };
            
            // Notify all subscribers
            subscribers.forEach(callback => callback(currentRates));
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          // Fallback to API polling
          startApiPolling();
        };

        ws.onclose = () => {
          console.log('WebSocket connection closed');
          ws = null;
          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            if (subscribers.size > 0) {
              connectWebSocket();
            }
          }, 5000);
        };
      } catch (error) {
        console.error('Failed to establish WebSocket connection:', error);
        startApiPolling();
      }
    } else {
      // No WebSocket available, use API polling
      console.log('WebSocket not available, starting API polling...');
      startApiPolling();
    }
  }
};

// API polling function (replaces the old simulation)
const startApiPolling = () => {
  const pollApi = async () => {
    try {
      console.log('Polling API for rate updates...');
      const newRates = await fetchRatesFromAPI();
      
      // Only update if we got different rates
      const ratesChanged = JSON.stringify(currentRates.gold) !== JSON.stringify(newRates.gold) ||
                          JSON.stringify(currentRates.silver) !== JSON.stringify(newRates.silver);
      
      if (ratesChanged) {
        console.log('Rates updated from API');
        currentRates = newRates;
        
        // Notify all subscribers
        subscribers.forEach(callback => callback(currentRates));
      }
    } catch (error) {
      console.error('Error during API polling:', error);
    }
  };

  // Initial fetch
  pollApi();
  
  // Set up polling interval
  ws = setInterval(pollApi, API_CONFIG.updateInterval);
};

// Function to disconnect WebSocket or stop polling
const disconnectWebSocket = () => {
  if (ws) {
    if (typeof ws.close === 'function') {
      // Real WebSocket
      console.log('Closing WebSocket connection');
      ws.close();
    } else {
      // Polling interval
      console.log('Stopping API polling');
      clearInterval(ws);
    }
    ws = null;
  }
};

// Subscribe to rate updates
export const subscribeToRates = (callback) => {
  subscribers.add(callback);
  
  // Connect WebSocket or start polling if not already connected
  connectWebSocket();
  
  // Return unsubscribe function
  return () => {
    subscribers.delete(callback);
    
    // If no more subscribers, disconnect WebSocket/stop polling
    if (subscribers.size === 0) {
      disconnectWebSocket();
    }
  };
};

// Fetch current rates (force refresh)
export const fetchRates = async () => {
  console.log('Manual rate fetch requested');
  
  // Try to fetch fresh rates from API if configured properly
  if (API_CONFIG.key && API_CONFIG.url !== 'https://api.goldrates.com') {
    const freshRates = await fetchRatesFromAPI();
    currentRates = freshRates;
    return freshRates;
  }
  
  console.log('API not configured, returning cached rates');
  return currentRates;
};

// Format dates consistently throughout the app
export const formatDate = (date) => {
  return format(date, 'dd/MM/yyyy, HH:mm:ss a');
};

// Export configuration for debugging (without sensitive data)
export const getConfig = () => ({
  hasApiKey: !!API_CONFIG.key,
  apiUrl: API_CONFIG.url.replace(API_CONFIG.key, '[REDACTED]'), // Hide API key in logs
  updateInterval: API_CONFIG.updateInterval,
  enableLiveRates: API_CONFIG.enableLiveRates,
  subscriberCount: subscribers.size,
  lastUpdate: currentRates.lastUpdated,
});

// Get current rates without triggering a fetch
export const getCurrentRates = () => currentRates;

// Health check function to verify API connectivity
export const checkApiHealth = async () => {
  try {
    if (!API_CONFIG.key || API_CONFIG.url === 'https://api.goldrates.com') {
      return {
        status: 'not_configured',
        message: 'API credentials not configured',
      };
    }

    const response = await fetch(`${API_CONFIG.url}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.key}`,
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });

    if (response.ok) {
      return {
        status: 'healthy',
        message: 'API is responding correctly',
      };
    } else {
      return {
        status: 'error',
        message: `API returned ${response.status}`,
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
    };
  }
};