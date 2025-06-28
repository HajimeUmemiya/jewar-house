# Jewar House - Frontend (Client)

A React Native Expo application for displaying live gold and silver rates, jewellery cost calculation, and product catalog management.

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Configuration

Create a `.env` file in the client directory:

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

## Available Scripts

- `npm run dev` - Start development server
- `npm run android` - Start Android development
- `npm run ios` - Start iOS development
- `npm run web` - Start web development
- `npm run build:web` - Build for web production
- `npm run build:android` - Build Android app (requires EAS)
- `npm run build:ios` - Build iOS app (requires EAS)

## Project Structure

```
client/
├── app/                    # Expo Router pages
│   ├── _layout.jsx        # Root layout
│   ├── (tabs)/           # Tab navigation
│   └── categories/       # Product categories
├── components/           # Reusable components
├── hooks/               # Custom hooks
├── services/           # API services
├── types/             # TypeScript definitions
└── assets/           # Static assets
```

## Key Features

- **Live Rates**: Real-time gold and silver price updates
- **Calculator**: Interactive jewellery cost calculator
- **Categories**: Organized product catalog
- **Responsive**: Works on mobile, tablet, and web
- **Offline**: Graceful fallback when APIs are unavailable

## Backend Integration

The frontend connects to the backend API for live rate updates. Ensure the backend server is running on `http://localhost:3001` for development.

## Deployment

### Web Deployment
```bash
npm run build:web
```

### Mobile App Deployment
Use EAS Build for creating production mobile apps:
```bash
npm run build:android
npm run build:ios
```

## Environment Variables

All environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the client code.

## License

This project is proprietary software for Jewar House.