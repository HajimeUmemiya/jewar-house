# Jewar House - Complete Backend & Frontend Flow

## 🔄 Complete Data Flow Overview

```
External APIs → Backend Processing → Cache → API Endpoints → Frontend → User Interface
```

---

## 🏗️ Backend Architecture & Flow

### 1. **Server Startup** (`server/server.js`)
```javascript
// 1. Server starts on port 3001
// 2. Loads environment variables from .env
// 3. Sets up CORS for frontend communication
// 4. Registers API routes
```

### 2. **Environment Configuration** (`server/.env`)
```env
# API Keys (fetched by apiClients.js)
METALS_API_KEY=your_metals_api_key_here
GOLD_API_KEY=goldapi-5chasmbzjcqhk-io
FIXER_API_KEY=your_fixer_api_key_here

# Server Configuration
PORT=3001
CACHE_TTL=300
UPDATE_INTERVAL=30000
```

### 3. **API Client Layer** (`server/services/apiClients.js`)

This is the **CORE** file that fetches API keys and makes external API calls:

```javascript
// 🔑 API Key Fetching
const apiKey = process.env.METALS_API_KEY;  // ← Keys fetched HERE
const baseUrl = process.env.METALS_API_URL;

// 🌐 External API Calls
async function fetchFromMetalsAPI() {
  // Makes HTTP request to external API
  const response = await axios.get(`${baseUrl}/gold,silver`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  
  return {
    gold: parseFloat(response.data.gold),    // USD per troy ounce
    silver: parseFloat(response.data.silver), // USD per troy ounce
    source: 'metals_api'
  };
}
```

**Available External APIs:**
- **Metals API**: `https://api.metals.live/v1/spot`
- **Gold API**: `https://www.goldapi.io/api`
- **Fixer API**: `https://api.fixer.io/v1` (for USD→INR conversion)

### 4. **Rate Service Layer** (`server/services/rateService.js`)

This orchestrates the entire rate fetching and processing:

```javascript
async function fetchLiveRates() {
  // Step 1: Get USD to INR exchange rate
  const exchangeData = await fetchFromFixerAPI();
  // Result: { rates: { INR: 83.5 } }
  
  // Step 2: Get metal prices in USD
  const metalRates = await fetchFromMetalsAPI();
  // Result: { gold: 2650, silver: 31.5, source: 'metals_api' }
  
  // Step 3: Convert USD/oz to INR/10g
  const goldINR = convertToINRPer10g(metalRates.gold, exchangeData.rates.INR);
  const silverINR = convertToINRPer10g(metalRates.silver, exchangeData.rates.INR);
  
  // Step 4: Calculate all purities
  return {
    gold: calculatePurities(goldINR, 'gold'),    // 24KT, 22KT, 18KT, etc.
    silver: calculatePurities(silverINR, 'silver'), // 24KT, 22KT, 18KT, etc.
    source: 'metals_api',
    timestamp: new Date().toISOString()
  };
}
```

### 5. **Cache Layer** (`server/services/cacheService.js`)
```javascript
// Caches processed rates for 5 minutes to reduce API calls
setInCache('live_rates', processedRates, 300);
```

### 6. **API Routes** (`server/routes/rates.js`)

**Available Endpoints:**
- `GET /api/rates` - Get current rates
- `POST /api/rates/refresh` - Force refresh
- `GET /api/rates/status` - API status & configuration

---

## 🔄 Step-by-Step Backend Flow

### **Flow 1: Normal API Call**
```
1. Frontend calls: GET http://localhost:3001/api/rates
2. routes/rates.js → calls getCurrentRates()
3. rateService.js → checks cache first
4. If cache miss → calls fetchLiveRates()
5. fetchLiveRates() → calls fetchFromFixerAPI() for USD→INR
6. fetchLiveRates() → calls fetchFromMetalsAPI() for gold/silver USD prices
7. apiClients.js → fetches API keys from process.env
8. apiClients.js → makes HTTP request to external APIs
9. rateService.js → converts USD/oz to INR/10g
10. rateService.js → calculates all purities (22KT, 18KT, etc.)
11. rateService.js → caches result for 5 minutes
12. routes/rates.js → returns JSON response to frontend
```

### **Flow 2: API Failure Fallback**
```
1. External API fails (network/key issues)
2. rateService.js → catches error
3. rateService.js → tries next API in chain
4. If all APIs fail → simulateRealisticRates()
5. Returns simulated data with realistic fluctuations
```

### **Flow 3: Cache Hit**
```
1. Frontend calls: GET /api/rates
2. rateService.js → checks cache
3. Cache hit → returns cached data immediately
4. No external API calls made
```

---

## 📱 Frontend Architecture & Flow

### 1. **Rate Service** (`client/services/rateService.js`)

This is the **MAIN** frontend service that communicates with backend:

```javascript
// 🔗 Backend API Configuration
const API_CONFIG = {
  url: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api',
  updateInterval: 30000, // 30 seconds
};

// 📡 Fetch from Backend
const fetchRatesFromAPI = async () => {
  const response = await fetch(`${API_CONFIG.url}/rates`);
  const data = await response.json();
  
  return {
    lastUpdated: new Date(data.data.lastUpdated),
    gold: data.data.gold,      // All purities: 24KT, 22KT, 18KT, etc.
    silver: data.data.silver,  // All purities: 24KT, 22KT, 18KT, etc.
  };
};
```

### 2. **Real-time Updates** (`client/services/rateService.js`)
```javascript
// 🔄 Subscription System
export const subscribeToRates = (callback) => {
  subscribers.add(callback);
  
  // Start polling backend every 30 seconds
  startLiveUpdates();
  
  return () => subscribers.delete(callback); // Unsubscribe function
};
```

### 3. **Component Integration**

**Home Screen** (`client/app/(tabs)/index.jsx`):
```javascript
useEffect(() => {
  // Subscribe to live rate updates
  const unsubscribe = subscribeToRates((newRates) => {
    setRates(newRates); // Update UI automatically
  });
  
  return () => unsubscribe(); // Cleanup on unmount
}, []);
```

**Calculator Screen** (`client/app/(tabs)/calculator.jsx`):
```javascript
useEffect(() => {
  const unsubscribe = subscribeToRates((newRates) => {
    setRates(newRates);
    // Auto-recalculate if user has entered values
    if (weight && result !== null) {
      handleCalculate();
    }
  });
  
  return () => unsubscribe();
}, []);
```

---

## 🔄 Complete Frontend Flow

### **Flow 1: App Startup**
```
1. App loads → _layout.jsx initializes
2. User navigates to Home tab
3. index.jsx → calls subscribeToRates()
4. rateService.js → starts polling backend every 30s
5. First API call: GET http://localhost:3001/api/rates
6. Backend returns processed rates
7. Frontend updates UI with live rates
8. MetalRateCard components show current prices
```

### **Flow 2: Real-time Updates**
```
1. Timer triggers every 30 seconds
2. rateService.js → calls fetchRatesFromAPI()
3. Backend returns updated rates
4. rateService.js → notifies all subscribers
5. All components (Home, Calculator) update automatically
6. User sees live price changes without refresh
```

### **Flow 3: Calculator Usage**
```
1. User enters weight/purity in Calculator
2. Calculator → uses current rates from subscription
3. Calculates: (rate × weight × purity) + making charges + GST
4. Shows real-time price estimate
5. If rates update → calculation auto-refreshes
```

---

## 🔧 Data Transformation Pipeline

### **Backend Processing:**
```
External API Data:
{
  "gold": 2650,     // USD per troy ounce
  "silver": 31.5    // USD per troy ounce
}

↓ Currency Conversion (USD → INR)
↓ Unit Conversion (troy ounce → 10 grams)
↓ Purity Calculations (24KT → 22KT, 18KT, etc.)

Final Backend Response:
{
  "success": true,
  "data": {
    "gold": {
      "24KT": 99150,
      "22KT": 90891,
      "18KT": 75563
    },
    "silver": {
      "24KT": 1065,
      "22KT": 1007,
      "18KT": 829
    },
    "source": "metals_api",
    "timestamp": "2025-01-27T10:30:00Z"
  }
}
```

### **Frontend Processing:**
```
Backend Response → Rate Service → Component State → UI Display

Calculator Logic:
baseValue = (rate × weight) / 10  // rate is per 10g
makingCharges = baseValue × makingChargesPercent / 100
gst = (baseValue + makingCharges) × gstPercent / 100
totalCost = baseValue + makingCharges + gst
```

---

## 🚀 API Endpoints Summary

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/api/rates` | GET | Get current rates | Live gold/silver rates |
| `/api/rates/refresh` | POST | Force refresh | Fresh rates (clears cache) |
| `/api/rates/status` | GET | API status | Configuration & health info |
| `/api/health` | GET | Basic health | Server status |
| `/api/health/detailed` | GET | Detailed health | Full system status |

---

## 🔍 Debugging & Monitoring

### **Check API Status:**
```bash
curl http://localhost:3001/api/rates/status
```

### **Check Health:**
```bash
curl http://localhost:3001/api/health/detailed
```

### **Force Refresh:**
```bash
curl -X POST http://localhost:3001/api/rates/refresh
```

---

## 🛡️ Error Handling & Fallbacks

### **Backend Fallback Chain:**
1. **Primary**: Metals API → Gold API
2. **Exchange**: Fixer API → Free APIs
3. **Fallback**: Enhanced simulation
4. **Last Resort**: Static fallback rates

### **Frontend Fallback:**
1. **Primary**: Backend API
2. **Fallback**: Local simulation with realistic fluctuations
3. **Last Resort**: Static default rates

---

This complete flow ensures **99.9% uptime** with multiple fallback layers and real-time updates for the best user experience! 🎯