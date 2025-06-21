# Jewar House Rates API

A robust Node.js Express backend API for fetching live gold and silver rates from multiple third-party APIs with caching, fallback mechanisms, and comprehensive error handling.

## Features

- **Multiple API Sources**: Supports MetalsAPI, GoldAPI, and Fixer.io for redundancy
- **Intelligent Caching**: In-memory caching with optional Redis support
- **Automatic Updates**: Configurable interval-based rate updates
- **Fallback System**: Graceful degradation to cached or default rates
- **Rate Limiting**: Built-in protection against abuse
- **Security**: API key authentication for protected endpoints
- **Health Monitoring**: Comprehensive health checks and monitoring
- **Logging**: Structured logging with file output in production

## Quick Start

### 1. Installation

```bash
cd backend
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your API keys and configuration:

```env
# Required
PORT=3001
NODE_ENV=development

# API Keys (at least one required)
METALS_API_KEY=your_metals_api_key
GOLD_API_KEY=your_gold_api_key
FIXER_API_KEY=your_fixer_api_key

# Optional Configuration
CACHE_TTL=300
UPDATE_INTERVAL=30000
API_SECRET_KEY=your_secret_key
```

### 3. Start the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Public Endpoints

#### GET /api/rates
Get current gold and silver rates for all purities.

**Response:**
```json
{
  "success": true,
  "data": {
    "lastUpdated": "2024-01-15T10:30:00.000Z",
    "gold": {
      "24KT": 99150,
      "22KT": 90891,
      "20KT": 83592,
      "18KT": 75563,
      "14KT": 57834
    },
    "silver": {
      "24KT": 1065,
      "22KT": 1007,
      "18KT": 829,
      "14KT": 651,
      "9KT": 429
    },
    "source": "metals_api",
    "exchangeRate": 83.50
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "cache_info": {
    "cached": false,
    "cache_age": 0
  }
}
```

#### GET /api/health
Basic health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "memory": {...},
  "version": "1.0.0"
}
```

### Protected Endpoints

These endpoints require an API key in the `x-api-key` header.

#### POST /api/rates/refresh
Force refresh rates, bypassing cache.

#### GET /api/rates/config
Get API configuration and status.

#### GET /api/health/detailed
Detailed health check including API status.

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3001 | No |
| `NODE_ENV` | Environment | development | No |
| `METALS_API_KEY` | Metals API key | - | No* |
| `GOLD_API_KEY` | Gold API key | - | No* |
| `FIXER_API_KEY` | Fixer API key | - | No |
| `CACHE_TTL` | Cache TTL in seconds | 300 | No |
| `UPDATE_INTERVAL` | Update interval in ms | 30000 | No |
| `API_SECRET_KEY` | Secret for protected endpoints | - | No |
| `USE_REDIS` | Enable Redis caching | false | No |
| `REDIS_URL` | Redis connection URL | - | No |

*At least one API key is required for live data

### API Sources

#### 1. Metals API (Recommended)
- **URL**: https://api.metals.live/
- **Features**: Real-time precious metals data
- **Rate Limits**: Varies by plan
- **Setup**: Get API key from metals.live

#### 2. Gold API
- **URL**: https://www.goldapi.io/
- **Features**: Gold and silver spot prices
- **Rate Limits**: 100 requests/month (free)
- **Setup**: Register at goldapi.io

#### 3. Fixer.io (Currency Exchange)
- **URL**: https://fixer.io/
- **Features**: USD to INR exchange rates
- **Rate Limits**: 100 requests/month (free)
- **Setup**: Register at fixer.io

## Rate Calculation

The API converts USD per troy ounce to INR per 10 grams:

1. **Fetch USD rates** from precious metals APIs
2. **Get USD/INR exchange rate** from currency API
3. **Convert units**: Troy ounce (31.1035g) to 10g
4. **Calculate purities** based on karat ratios
5. **Cache results** for configured TTL

### Purity Calculations

- **24KT**: Base rate (100% pure)
- **22KT**: Base × (22/24) = 91.67%
- **20KT**: Base × (20/24) = 83.33%
- **18KT**: Base × (18/24) = 75%
- **14KT**: Base × (14/24) = 58.33%
- **9KT**: Base × (9/24) = 37.5% (silver only)

## Caching Strategy

### In-Memory Cache (Default)
- Uses `node-cache` for fast access
- Configurable TTL (default: 5 minutes)
- Automatic cleanup of expired entries

### Redis Cache (Production)
- Set `USE_REDIS=true` and `REDIS_URL`
- Persistent caching across restarts
- Better for multi-instance deployments

### Cache Behavior
- **Cache Hit**: Return cached data immediately
- **Cache Miss**: Fetch from APIs, cache result
- **API Failure**: Return cached data if available
- **No Cache**: Return fallback rates

## Error Handling

### API Failures
1. **Primary API fails**: Try secondary APIs
2. **All APIs fail**: Return cached rates
3. **No cache**: Return fallback rates
4. **Log all failures**: For monitoring

### Rate Validation
- Sanity checks on fetched rates
- Gold must be more expensive than silver
- Rates must be within reasonable ranges
- Invalid data triggers fallback

## Monitoring

### Health Checks
- **Basic**: `/api/health` - Server status
- **Detailed**: `/api/health/detailed` - Full system status

### Logging
- **Console**: All environments
- **Files**: Production only (`logs/` directory)
- **Levels**: ERROR, WARN, INFO, DEBUG

### Metrics
- Cache hit/miss rates
- API response times
- Error frequencies
- Memory usage

## Security

### Rate Limiting
- 100 requests per 15 minutes per IP
- Configurable via environment variables
- Returns 429 status when exceeded

### API Key Protection
- Protected endpoints require `x-api-key` header
- Keys stored in environment variables
- Failed attempts are logged

### CORS
- Configurable allowed origins
- Credentials support for authenticated requests
- Preflight request handling

## Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Setup
1. Set all required environment variables
2. Configure API keys for at least one source
3. Set up Redis if using distributed caching
4. Configure CORS for your frontend domain

## Integration with Frontend

Update your Expo app's rate service to use the backend:

```javascript
// services/rateService.js
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

export const fetchRates = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/rates`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || 'Failed to fetch rates');
    }
  } catch (error) {
    console.error('Rate fetch error:', error);
    throw error;
  }
};
```

## Troubleshooting

### Common Issues

1. **No API keys configured**
   - Solution: Add at least one API key to `.env`
   - Fallback: App will use default rates

2. **API rate limits exceeded**
   - Solution: Increase cache TTL or get higher tier API plan
   - Monitor: Check logs for API errors

3. **Cache not working**
   - Check: `CACHE_TTL` environment variable
   - Redis: Verify `REDIS_URL` and connection

4. **CORS errors**
   - Solution: Add frontend domain to `ALLOWED_ORIGINS`
   - Development: Use `http://localhost:8081`

### Debug Mode
Set `LOG_LEVEL=DEBUG` for verbose logging:

```bash
LOG_LEVEL=DEBUG npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

This project is proprietary software for Jewar House.