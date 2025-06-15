import { format } from 'date-fns';

// Environment configuration
const API_CONFIG = {
  url: process.env.EXPO_PUBLIC_API_URL || 'https://api.goldrates.com',
  key: process.env.EXPO_PUBLIC_API_KEY || '',
  updateInterval: parseInt(process.env.EXPO_PUBLIC_RATE_UPDATE_INTERVAL || '2000'),
  enableLiveRates: process.env.EXPO_PUBLIC_ENABLE_LIVE_RATES === 'true',
};

// Default rates from environment variables
const DEFAULT_RATES = {
  gold: {
    '22': parseInt(process.env.EXPO_PUBLIC_DEFAULT_GOLD_22KT || '85155'),
    '18': parseInt(process.env.EXPO_PUBLIC_DEFAULT_GOLD_18KT || '70375'),
  },
  silver: {
    base: parseInt(process.env.EXPO_PUBLIC_DEFAULT_SILVER_BASE || '954'),
  },
  diamond: {
    '18': parseInt(process.env.EXPO_PUBLIC_DEFAULT_DIAMOND_18KT || '70375'),
    '14': parseInt(process.env.EXPO_PUBLIC_DEFAULT_DIAMOND_14KT || '53800'),
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

// Secure API call function
const fetchRatesFromAPI = async () => {
  try {
    // Check if API URL is still the placeholder or if API key is missing
    if (!API_CONFIG.key || API_CONFIG.url === 'https://api.goldrates.com') {
      console.warn('API key not configured or using placeholder URL, using default rates');
      return {
        ...currentRates,
        lastUpdated: new Date(),
      };
    }

    const response = await fetch(`${API_CONFIG.url}/rates`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.key}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform API response to our format
    return {
      lastUpdated: new Date(),
      gold: {
        '22': data.gold?.['22KT'] || DEFAULT_RATES.gold['22'],
        '18': data.gold?.['18KT'] || DEFAULT_RATES.gold['18'],
      },
      silver: {
        base: data.silver?.['24KT'] || DEFAULT_RATES.silver.base,
      },
      diamond: {
        '18': data.gold?.['18KT'] || DEFAULT_RATES.diamond['18'],
        '14': data.gold?.['14KT'] || DEFAULT_RATES.diamond['14'],
      },
    };
  } catch (error) {
    console.error('Failed to fetch rates from API:', error);
    // Return current rates with updated timestamp on error
    return {
      ...currentRates,
      lastUpdated: new Date(),
    };
  }
};

// Function to connect to WebSocket or simulate updates
const connectWebSocket = () => {
  if (!ws && API_CONFIG.enableLiveRates) {
    if (API_CONFIG.key && API_CONFIG.url.includes('wss://')) {
      // Real WebSocket connection for production
      try {
        ws = new WebSocket(`${API_CONFIG.url.replace('https://', 'wss://')}/live?token=${API_CONFIG.key}`);
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            currentRates = {
              lastUpdated: new Date(),
              gold: {
                '22': data.gold?.['22KT'] || currentRates.gold['22'],
                '18': data.gold?.['18KT'] || currentRates.gold['18'],
              },
              silver: {
                base: data.silver?.['24KT'] || currentRates.silver.base,
              },
              diamond: {
                '18': data.gold?.['18KT'] || currentRates.diamond['18'],
                '14': data.gold?.['14KT'] || currentRates.diamond['14'],
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
          // Fallback to simulation
          startSimulation();
        };

        ws.onclose = () => {
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
        startSimulation();
      }
    } else {
      // Simulation for development or when WebSocket is not available
      startSimulation();
    }
  }
};

// Simulation function for development
const startSimulation = () => {
  const simulateWebSocket = async () => {
    // Fetch real rates periodically if API is configured and not using placeholder URL
    if (API_CONFIG.key && API_CONFIG.url !== 'https://api.goldrates.com' && Math.random() > 0.7) {
      const newRates = await fetchRatesFromAPI();
      currentRates = newRates;
    } else {
      // Simulate small fluctuations
      const fluctuation = () => (Math.random() > 0.5 ? 1 : -1) * Math.random() * 0.005;
      
      currentRates = {
        lastUpdated: new Date(),
        gold: {
          '22': Math.round(currentRates.gold['22'] * (1 + fluctuation())),
          '18': Math.round(currentRates.gold['18'] * (1 + fluctuation())),
        },
        silver: {
          base: Math.round(currentRates.silver.base * (1 + fluctuation())),
        },
        diamond: {
          '18': Math.round(currentRates.diamond['18'] * (1 + fluctuation())),
          '14': Math.round(currentRates.diamond['14'] * (1 + fluctuation())),
        },
      };
    }

    // Notify all subscribers
    subscribers.forEach(callback => callback(currentRates));
  };

  // Update rates at configured interval
  ws = setInterval(simulateWebSocket, API_CONFIG.updateInterval);
};

// Function to disconnect WebSocket
const disconnectWebSocket = () => {
  if (ws) {
    if (typeof ws.close === 'function') {
      // Real WebSocket
      ws.close();
    } else {
      // Simulation interval
      clearInterval(ws);
    }
    ws = null;
  }
};

// Subscribe to rate updates
export const subscribeToRates = (callback) => {
  subscribers.add(callback);
  
  // Connect WebSocket if not already connected
  connectWebSocket();
  
  // Return unsubscribe function
  return () => {
    subscribers.delete(callback);
    
    // If no more subscribers, disconnect WebSocket
    if (subscribers.size === 0) {
      disconnectWebSocket();
    }
  };
};

// Fetch current rates
export const fetchRates = async () => {
  // Try to fetch fresh rates from API if configured and not using placeholder URL
  if (API_CONFIG.key && API_CONFIG.url !== 'https://api.goldrates.com') {
    const freshRates = await fetchRatesFromAPI();
    currentRates = freshRates;
    return freshRates;
  }
  
  return currentRates;
};

// Format dates consistently throughout the app
export const formatDate = (date) => {
  return format(date, 'dd/MM/yyyy, HH:mm:ss a');
};

// Export configuration for debugging (without sensitive data)
export const getConfig = () => ({
  hasApiKey: !!API_CONFIG.key,
  apiUrl: API_CONFIG.url,
  updateInterval: API_CONFIG.updateInterval,
  enableLiveRates: API_CONFIG.enableLiveRates,
});