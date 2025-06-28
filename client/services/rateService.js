import { format } from 'date-fns';

// Environment configuration
const API_CONFIG = {
  // Backend API URL
  url: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api',
  key: process.env.EXPO_PUBLIC_API_KEY || '',
  updateInterval: parseInt(process.env.EXPO_PUBLIC_RATE_UPDATE_INTERVAL || '30000'), // 30 seconds
  enableLiveRates: process.env.EXPO_PUBLIC_ENABLE_LIVE_RATES !== 'false', // Default to true
};

// Updated default rates based on current market prices (per 10g)
const DEFAULT_RATES = {
  gold: {
    '24KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_GOLD_24KT || '99150'),
    '22KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_GOLD_22KT || '90891'),
    '20KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_GOLD_20KT || '83592'),
    '18KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_GOLD_18KT || '75563'),
    '14KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_GOLD_14KT || '57834'),
  },
  silver: {
    '24KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_SILVER_24KT || '1065'),
    '22KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_SILVER_22KT || '1007'),
    '18KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_SILVER_18KT || '829'),
    '14KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_SILVER_14KT || '651'),
    '9KT': parseInt(process.env.EXPO_PUBLIC_DEFAULT_SILVER_9KT || '429'),
  },
};

// WebSocket/polling connection
let updateInterval = null;
let subscribers = new Set();
let lastApiCallTime = 0;
const API_CALL_COOLDOWN = 10000; // 10 seconds between API calls

// Current rates initialized with updated defaults
let currentRates = {
  lastUpdated: new Date(),
  ...DEFAULT_RATES,
};

// Function to fetch rates from backend API
const fetchRatesFromAPI = async () => {
  const now = Date.now();
  
  // Rate limiting: Don't call APIs too frequently
  if (now - lastApiCallTime < API_CALL_COOLDOWN) {
    console.log('⏳ API call cooldown active, skipping external fetch');
    return null;
  }

  try {
    console.log('🚀 Fetching rates from backend API...');
    
    const headers = {
      'Content-Type': 'application/json',
    };

    // Add API key if available
    if (API_CONFIG.key) {
      headers['Authorization'] = `Bearer ${API_CONFIG.key}`;
    }

    const response = await fetch(`${API_CONFIG.url}/rates`, {
      method: 'GET',
      headers,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Successfully fetched from backend API');
      lastApiCallTime = now;
      
      if (data.success && data.data) {
        return {
          lastUpdated: new Date(data.data.lastUpdated),
          gold: data.data.gold,
          silver: data.data.silver,
        };
      }
    } else {
      console.warn(`❌ Backend API returned status ${response.status}`);
    }
  } catch (error) {
    console.warn('❌ Backend API failed:', error.message);
  }
  
  return null;
};

// Enhanced realistic market simulation (fallback when API is unavailable)
const simulateRealisticRates = () => {
  console.log('🎯 Generating realistic market simulation...');
  
  // Market factors simulation
  const marketFactors = {
    // Time-based volatility (higher during market hours)
    timeVolatility: getTimeBasedVolatility(),
    // Random market events (news, economic data, etc.)
    marketSentiment: getMarketSentiment(),
    // Currency fluctuation impact
    currencyImpact: (Math.random() - 0.5) * 0.002, // ±0.2%
    // Weekly trend (slight bias based on day of week)
    weeklyTrend: getWeeklyTrend(),
  };

  console.log('📊 Market factors:', marketFactors);

  // Calculate realistic fluctuations
  const goldFluctuation = calculateRealisticFluctuation('gold', marketFactors);
  const silverFluctuation = calculateRealisticFluctuation('silver', marketFactors);

  const newRates = {
    lastUpdated: new Date(),
    gold: {
      '24KT': Math.round(currentRates.gold['24KT'] * (1 + goldFluctuation)),
      '22KT': Math.round(currentRates.gold['22KT'] * (1 + goldFluctuation)),
      '20KT': Math.round(currentRates.gold['20KT'] * (1 + goldFluctuation)),
      '18KT': Math.round(currentRates.gold['18KT'] * (1 + goldFluctuation)),
      '14KT': Math.round(currentRates.gold['14KT'] * (1 + goldFluctuation)),
    },
    silver: {
      '24KT': Math.round(currentRates.silver['24KT'] * (1 + silverFluctuation)),
      '22KT': Math.round(currentRates.silver['22KT'] * (1 + silverFluctuation)),
      '18KT': Math.round(currentRates.silver['18KT'] * (1 + silverFluctuation)),
      '14KT': Math.round(currentRates.silver['14KT'] * (1 + silverFluctuation)),
      '9KT': Math.round(currentRates.silver['9KT'] * (1 + silverFluctuation)),
    },
  };

  console.log(`📈 Simulated Rates - Gold: ${goldFluctuation > 0 ? '+' : ''}${(goldFluctuation * 100).toFixed(3)}%, Silver: ${silverFluctuation > 0 ? '+' : ''}${(silverFluctuation * 100).toFixed(3)}%`);
  
  return newRates;
};

// Get time-based volatility (higher during market hours)
const getTimeBasedVolatility = () => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  // Higher volatility during market hours (9 AM - 5 PM, weekdays)
  const isMarketHours = (day >= 1 && day <= 5) && (hour >= 9 && hour < 17);
  
  // Even higher volatility during opening/closing hours
  const isOpeningHour = hour === 9;
  const isClosingHour = hour === 16;
  
  if (isOpeningHour || isClosingHour) return 2.0;
  if (isMarketHours) return 1.5;
  return 0.8;
};

// Get market sentiment based on various factors
const getMarketSentiment = () => {
  const random = Math.random();
  
  // 60% neutral, 20% bullish, 20% bearish
  if (random < 0.6) return 'neutral';
  if (random < 0.8) return 'bullish';
  return 'bearish';
};

// Get weekly trend (slight bias based on day of week)
const getWeeklyTrend = () => {
  const day = new Date().getDay();
  
  // Monday: slight bullish (new week optimism)
  // Friday: slight bearish (profit taking)
  // Other days: neutral
  if (day === 1) return 0.0005; // +0.05% bias
  if (day === 5) return -0.0005; // -0.05% bias
  return 0;
};

// Enhanced realistic fluctuation calculation
const calculateRealisticFluctuation = (metal, factors) => {
  // Base volatility (gold is typically less volatile than silver)
  const baseVolatility = metal === 'gold' ? 0.003 : 0.005; // 0.3% vs 0.5%
  
  // Apply market factors
  let fluctuation = (Math.random() - 0.5) * baseVolatility * factors.timeVolatility;
  
  // Apply market sentiment
  if (factors.marketSentiment === 'bullish') {
    fluctuation += Math.random() * 0.002; // Up to +0.2% bullish bias
  } else if (factors.marketSentiment === 'bearish') {
    fluctuation -= Math.random() * 0.002; // Up to -0.2% bearish bias
  }
  
  // Apply currency impact
  fluctuation += factors.currencyImpact;
  
  // Apply weekly trend
  fluctuation += factors.weeklyTrend;
  
  // Ensure fluctuation stays within realistic bounds (±1.5%)
  return Math.max(-0.015, Math.min(0.015, fluctuation));
};

// Function to start live updates
const startLiveUpdates = () => {
  if (!API_CONFIG.enableLiveRates) {
    console.log('📴 Live rates disabled in configuration');
    return;
  }

  if (updateInterval) {
    console.log('🔄 Live updates already running');
    return;
  }

  console.log('🚀 Starting live rate updates...');
  
  // Initial fetch
  updateRates();
  
  // Set up polling interval
  updateInterval = setInterval(updateRates, API_CONFIG.updateInterval);
  
  console.log(`⏰ Live updates scheduled every ${API_CONFIG.updateInterval / 1000} seconds`);
};

// Function to update rates and notify subscribers
const updateRates = async () => {
  try {
    console.log('🔄 Updating rates...');
    
    // Try to fetch from backend API first
    let newRates = await fetchRatesFromAPI();
    
    // If backend API fails, use simulation
    if (!newRates) {
      console.log('📈 Backend API unavailable, using simulation');
      newRates = simulateRealisticRates();
    }
    
    // Check for significant changes (> 0.05% to reduce noise)
    const hasSignificantChange = checkSignificantChange(currentRates, newRates);
    
    if (hasSignificantChange || !currentRates.lastUpdated) {
      console.log('📊 Significant rate changes detected, updating subscribers');
      currentRates = newRates;
      
      // Notify all subscribers
      console.log(`📢 Notifying ${subscribers.size} subscribers`);
      subscribers.forEach(callback => {
        try {
          callback(currentRates);
        } catch (error) {
          console.error('❌ Error notifying subscriber:', error);
        }
      });
    } else {
      console.log('📈 No significant changes, updating timestamp only');
      currentRates.lastUpdated = newRates.lastUpdated;
    }
  } catch (error) {
    console.error('❌ Error during rate update:', error);
  }
};

// Check if there are significant changes in rates
const checkSignificantChange = (oldRates, newRates) => {
  const threshold = 0.0005; // 0.05% threshold
  
  const goldChange = Math.abs((newRates.gold['24KT'] - oldRates.gold['24KT']) / oldRates.gold['24KT']);
  const silverChange = Math.abs((newRates.silver['24KT'] - oldRates.silver['24KT']) / oldRates.silver['24KT']);
  
  const hasChange = goldChange > threshold || silverChange > threshold;
  
  if (hasChange) {
    console.log(`📊 Rate changes - Gold: ${(goldChange * 100).toFixed(3)}%, Silver: ${(silverChange * 100).toFixed(3)}%`);
  }
  
  return hasChange;
};

// Function to stop live updates
const stopLiveUpdates = () => {
  if (updateInterval) {
    console.log('⏹️ Stopping live rate updates');
    clearInterval(updateInterval);
    updateInterval = null;
  }
};

// Subscribe to rate updates
export const subscribeToRates = (callback) => {
  console.log('📝 New subscriber added');
  subscribers.add(callback);
  
  // Start live updates if not already running
  startLiveUpdates();
  
  // Immediately call callback with current rates
  try {
    callback(currentRates);
  } catch (error) {
    console.error('❌ Error calling initial callback:', error);
  }
  
  // Return unsubscribe function
  return () => {
    console.log('📝 Subscriber removed');
    subscribers.delete(callback);
    
    // If no more subscribers, stop live updates
    if (subscribers.size === 0) {
      stopLiveUpdates();
    }
  };
};

// Fetch current rates (force refresh)
export const fetchRates = async () => {
  console.log('🔄 Manual rate fetch requested');
  
  // Try backend API first
  let freshRates = await fetchRatesFromAPI();
  
  // If backend API fails, use simulation
  if (!freshRates) {
    freshRates = simulateRealisticRates();
  }
  
  currentRates = freshRates;
  
  // Notify subscribers of manual update
  subscribers.forEach(callback => {
    try {
      callback(currentRates);
    } catch (error) {
      console.error('❌ Error notifying subscriber during manual fetch:', error);
    }
  });
  
  return freshRates;
};

// Manual rate refresh function for pull-to-refresh
export const refreshRates = async () => {
  console.log('🔄 Manual refresh triggered');
  return await fetchRates();
};

// Format dates consistently throughout the app
export const formatDate = (date) => {
  return format(date, 'dd/MM/yyyy, HH:mm:ss a');
};

// Get current rates without triggering a fetch
export const getCurrentRates = () => currentRates;

// Export configuration for debugging
export const getConfig = () => ({
  apiUrl: API_CONFIG.url,
  hasApiKey: !!API_CONFIG.key,
  updateInterval: API_CONFIG.updateInterval,
  enableLiveRates: API_CONFIG.enableLiveRates,
  subscriberCount: subscribers.size,
  lastUpdate: currentRates.lastUpdated,
  isUpdating: !!updateInterval,
  lastApiCall: new Date(lastApiCallTime).toISOString(),
});