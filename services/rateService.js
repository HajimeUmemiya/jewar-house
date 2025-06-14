import { format } from 'date-fns';

// WebSocket connection for real-time updates
let ws = null;
let subscribers = new Set();

// Initial rates
let currentRates = {
  lastUpdated: new Date(),
  gold: {
    '24KT': 92838,
    '22KT': 85155,
    '20KT': 77830,
    '18KT': 70375,
    '14KT': 53800,
  },
  silver: {
    '24KT': 954,
    '22KT': 905,
    '18KT': 746,
    '14KT': 586,
    '9KT': 388,
  },
};

// Function to connect to WebSocket
const connectWebSocket = () => {
  // For demo purposes, we'll simulate WebSocket with setInterval
  // In production, replace this with actual WebSocket connection
  if (!ws) {
    const simulateWebSocket = () => {
      const fluctuation = () => (Math.random() > 0.5 ? 1 : -1) * Math.random() * 0.005;
      
      currentRates = {
        lastUpdated: new Date(),
        gold: {
          '24KT': Math.round(currentRates.gold['24KT'] * (1 + fluctuation())),
          '22KT': Math.round(currentRates.gold['22KT'] * (1 + fluctuation())),
          '20KT': Math.round(currentRates.gold['20KT'] * (1 + fluctuation())),
          '18KT': Math.round(currentRates.gold['18KT'] * (1 + fluctuation())),
          '14KT': Math.round(currentRates.gold['14KT'] * (1 + fluctuation())),
        },
        silver: {
          '24KT': Math.round(currentRates.silver['24KT'] * (1 + fluctuation())),
          '22KT': Math.round(currentRates.silver['22KT'] * (1 + fluctuation())),
          '18KT': Math.round(currentRates.silver['18KT'] * (1 + fluctuation())),
          '14KT': Math.round(currentRates.silver['14KT'] * (1 + fluctuation())),
          '9KT': Math.round(currentRates.silver['9KT'] * (1 + fluctuation())),
        },
      };

      // Notify all subscribers
      subscribers.forEach(callback => callback(currentRates));
    };

    // Update rates every 2 seconds
    ws = setInterval(simulateWebSocket, 2000);
  }
};

// Function to disconnect WebSocket
const disconnectWebSocket = () => {
  if (ws) {
    clearInterval(ws);
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
  return currentRates;
};

// Format dates consistently throughout the app
export const formatDate = (date) => {
  return format(date, 'dd/MM/yyyy, HH:mm:ss a');
};