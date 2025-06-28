# Jewar House - Full Stack Application

A comprehensive full-stack application for displaying live gold and silver rates, jewellery cost calculation, and product catalog management.

## Project Structure

```
jewar-house/
├── client/          # Frontend (React Native Expo)
│   ├── app/         # Expo Router pages
│   ├── components/  # Reusable components
│   ├── hooks/       # Custom hooks
│   ├── services/    # Frontend services
│   ├── types/       # TypeScript definitions
│   └── assets/      # Static assets
└── server/          # Backend (Node.js Express)
    ├── routes/      # API routes
    ├── services/    # Backend services
    ├── middleware/  # Express middleware
    └── utils/       # Utility functions
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI

### Frontend Setup (Client)

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup (Server)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Running Both Services

For development, you'll need to run both the client and server:

1. **Terminal 1** - Start the backend:
   ```bash
   cd server
   npm run dev
   ```

2. **Terminal 2** - Start the frontend:
   ```bash
   cd client
   npm run dev
   ```

### Environment Configuration

#### Client Environment Variables

The client uses Expo's environment variable system. Create `client/.env`:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3001/api
EXPO_PUBLIC_API_KEY=your_api_key_here

# Rate Service Configuration
EXPO_PUBLIC_RATE_UPDATE_INTERVAL=30000
EXPO_PUBLIC_ENABLE_LIVE_RATES=true

# Default Rates (fallback values)
EXPO_PUBLIC_DEFAULT_GOLD_22KT=90891
EXPO_PUBLIC_DEFAULT_GOLD_18KT=75563
EXPO_PUBLIC_DEFAULT_SILVER_24KT=1065
```

#### Server Environment Variables

The server uses Node.js environment variables. Create `server/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# API Keys for live rates
METALS_API_KEY=your_metals_api_key
GOLD_API_KEY=your_gold_api_key
FIXER_API_KEY=your_fixer_api_key

# Cache and Rate Limiting
CACHE_TTL=300
UPDATE_INTERVAL=30000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:8081,http://localhost:3000
```

## Deployment

### Frontend Deployment

The frontend can be deployed to various platforms:

- **Web**: `npm run build:web` in the client directory
- **Mobile**: Use EAS Build for iOS/Android apps

### Backend Deployment

The backend can be deployed to:

- **Heroku**: Use the provided `server/package.json`
- **Railway**: Direct deployment from the server directory
- **DigitalOcean**: Using Docker or direct deployment
- **AWS/GCP**: Using their respective services

## API Integration

The frontend communicates with the backend through REST APIs:

- **Live Rates**: `GET /api/rates`
- **Health Check**: `GET /api/health`
- **Rate Refresh**: `POST /api/rates/refresh` (protected)

## Features

### Frontend (Client)
- Live metal rates display
- Interactive cost calculator
- Product catalog with categories
- Merchant information
- Responsive design for all devices

### Backend (Server)
- Multiple API source integration
- Intelligent caching system
- Rate limiting and security
- Health monitoring
- Comprehensive error handling

## Contributing

1. Make changes in the appropriate directory (`client/` or `server/`)
2. Test both frontend and backend functionality
3. Ensure environment variables are properly configured
4. Follow the existing code structure and patterns

## License

This project is proprietary software for Jewar House.