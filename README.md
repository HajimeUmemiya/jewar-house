# Jewar House - Gold & Silver Jewellery App

A comprehensive React Native Expo application for displaying live gold and silver rates, jewellery cost calculation, and product catalog management. Built with Expo SDK 52.0.30 and Expo Router 4.0.17.

## Table of Contents

- [Project Overview](#project-overview)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Navigation Architecture](#navigation-architecture)
- [Key Components & Screens](#key-components--screens)
- [Services & Data Management](#services--data-management)
- [Styling & Responsive Design](#styling--responsive-design)
- [Platform Compatibility](#platform-compatibility)
- [Font Management](#font-management)
- [Installation & Setup](#installation--setup)
- [Dependencies](#dependencies)

## Project Overview

Jewar House is a production-ready jewellery application that provides:

- **Live Metal Rates**: Real-time gold and silver price updates with WebSocket simulation
- **Cost Calculator**: Interactive jewellery price calculator with live rate integration
- **Product Catalog**: Organized categories for gold, silver, and diamond jewellery
- **Merchant Information**: Contact details, services, and store information
- **Responsive Design**: Optimized for all screen sizes from mobile to tablet

## Environment Setup

### Environment Variables

This project uses Expo's environment variable system for secure configuration management.

#### Required Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
# API Configuration
EXPO_PUBLIC_API_URL=https://api.goldrates.com
EXPO_PUBLIC_API_KEY=your_api_key_here

# Rate Service Configuration
EXPO_PUBLIC_RATE_UPDATE_INTERVAL=2000
EXPO_PUBLIC_ENABLE_LIVE_RATES=true

# Default Rates (fallback values)
EXPO_PUBLIC_DEFAULT_GOLD_22KT=85155
EXPO_PUBLIC_DEFAULT_GOLD_18KT=70375
EXPO_PUBLIC_DEFAULT_SILVER_BASE=954
EXPO_PUBLIC_DEFAULT_DIAMOND_18KT=70375
EXPO_PUBLIC_DEFAULT_DIAMOND_14KT=53800
```

#### Environment Files

- `.env` - Development environment (not committed to git)
- `.env.production` - Production environment (not committed to git)
- `.env.example` - Template file (committed to git)

#### Security Notes

- **NEVER** commit `.env` files containing real API keys to version control
- Use different API keys for development and production
- The `.gitignore` file is configured to exclude environment files
- All sensitive configuration is handled through environment variables

#### API Key Configuration

1. **Development**: Use a development/testing API key in `.env`
2. **Production**: Set production API key in your deployment environment
3. **Fallback**: App works with default rates if no API key is provided

### TypeScript Environment Types

Environment variables are typed in `types/env.d.ts` for better development experience:

```typescript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
      EXPO_PUBLIC_API_KEY: string;
      // ... other environment variables
    }
  }
}
```

## Project Structure

```
jewar-house/
├── app/                          # All routes (expo-router)
│   ├── _layout.jsx              # Root layout with font loading
│   ├── (tabs)/                  # Tab-based navigation
│   │   ├── _layout.jsx         # Tab bar configuration
│   │   ├── index.jsx           # Home screen (rates & categories)
│   │   ├── calculator.jsx      # Cost calculator
│   │   └── merchant-info.jsx   # Merchant details
│   ├── categories/             # Product category screens
│   │   ├── _layout.jsx        # Categories stack layout
│   │   ├── gold-jewellery.jsx # Gold products
│   │   ├── gold-chains.jsx    # Gold chains
│   │   ├── gold-bangles.jsx   # Gold bangles
│   │   ├── gold-rings.jsx     # Gold rings
│   │   ├── silver-jewellery.jsx # Silver products
│   │   ├── silver-bangles.jsx # Silver bangles
│   │   ├── diamond-jewellery.jsx # Diamond products
│   │   ├── diamond-rings.jsx  # Diamond rings
│   │   └── new-arrival.jsx    # New arrivals
│   └── +not-found.jsx         # 404 page
├── components/                  # Reusable components
│   ├── Header.jsx              # App header with title & actions
│   ├── MetalRateCard.jsx       # Individual rate display cards
│   ├── CategorySection.jsx     # Product categories manager
│   └── JewelleryCarousel.jsx   # Featured collections carousel
├── hooks/                      # Custom hooks
│   └── useFrameworkReady.js    # Framework initialization (CRITICAL)
├── services/                   # Data services
│   └── rateService.js          # Real-time rate management with API integration
├── types/                      # TypeScript definitions
│   └── env.d.ts               # Environment variable types
├── assets/                     # Static assets
│   └── images/                 # App icons and images
├── .env.example               # Environment variables template
├── .env                       # Development environment (not in git)
├── .env.production           # Production environment (not in git)
└── .gitignore                # Git ignore rules (includes .env files)
```

## Navigation Architecture

### Primary Navigation: Tab-Based

The app uses a three-tab structure as the main navigation:

1. **Home Tab** (`index.jsx`): Live rates and product categories
2. **Calculator Tab** (`calculator.jsx`): Jewellery cost calculator
3. **Merchant Info Tab** (`merchant-info.jsx`): Store and contact information

### Secondary Navigation: Stack-Based

Product categories use stack navigation within the app:
- Categories are accessed via the `CategorySection` component
- Each category has its own dedicated screen in `/app/categories/`
- Navigation uses `expo-router` with programmatic routing

## Key Components & Screens

### Root Layout (`app/_layout.jsx`)

**Purpose**: Application initialization and font management

**Key Features**:
- **Font Loading**: Manages Inter, Poppins, and Crimson Pro fonts using `@expo-google-fonts`
- **Splash Screen**: Controls splash screen visibility during font loading
- **Framework Ready**: Uses `useFrameworkReady` hook (CRITICAL - never remove)
- **Safe Area**: Provides safe area context for all screens

**Font Loading Process**:
```javascript
const [fontsLoaded, fontError] = useFonts({
  'Inter-Regular': Inter_400Regular,
  'Inter-Medium': Inter_500Medium,
  'Inter-SemiBold': Inter_600SemiBold,
  'Inter-Bold': Inter_700Bold,
  'Poppins-Regular': Poppins_400Regular,
  'Poppins-Medium': Poppins_500Medium,
  'Poppins-SemiBold': Poppins_600SemiBold,
  'Poppins-Bold': Poppins_700Bold,
  'CrimsonPro-Regular': CrimsonPro_400Regular,
  'CrimsonPro-SemiBold': CrimsonPro_600SemiBold,
  'CrimsonPro-Bold': CrimsonPro_700Bold,
});
```

### Tab Layout (`app/(tabs)/_layout.jsx`)

**Purpose**: Configures the bottom tab navigation

**Key Features**:
- **Responsive Design**: Dynamic sizing based on screen dimensions
- **Custom Styling**: Gradient backgrounds and custom tab bar styling
- **Icon Integration**: Uses Lucide React Native icons
- **Platform Adaptation**: Different heights and padding for iOS/Android

**Responsive Calculations**:
```javascript
const isSmallDevice = screenWidth < 350;
const isMediumDevice = screenWidth >= 350 && screenWidth < 400;
const isLargeDevice = screenWidth >= 400;

const getTabBarHeight = () => {
  if (isSmallDevice) return 75;
  if (isMediumDevice) return 80;
  return 85;
};
```

### Home Screen (`app/(tabs)/index.jsx`)

**Purpose**: Main dashboard displaying live rates and product categories

**Key Features**:
- **Live Rate Display**: Real-time gold and silver prices
- **Rate Subscription**: Subscribes to live updates via `rateService`
- **Pull-to-Refresh**: Manual rate refresh functionality
- **Category Integration**: Embeds `CategorySection` component
- **Responsive Layout**: Adapts to different screen sizes

**Rate Management**:
```javascript
useEffect(() => {
  loadRates();
  
  const unsubscribe = subscribeToRates((newRates) => {
    setRates(newRates);
  });

  return () => unsubscribe();
}, []);
```

**Data Structure**:
```javascript
const rates = {
  lastUpdated: new Date(),
  gold: {
    '22': 85155,
    '18': 70375,
  },
  silver: {
    base: 954,
  },
  diamond: {
    '18': 70375,
    '14': 53800,
  },
};
```

### Calculator Screen (`app/(tabs)/calculator.jsx`)

**Purpose**: Interactive jewellery cost calculator with live rate integration

**Key Features**:
- **Metal Type Toggle**: Switch between gold, silver, and diamond
- **Purity Selection**: Dynamic purity options based on metal type (removed for silver)
- **Diamond Calculations**: Special calculation logic for diamond jewellery
- **Live Rate Integration**: Automatically updates calculations with current rates
- **Input Validation**: Handles weight, making charges, and GST inputs
- **Real-time Calculation**: Updates results as inputs change

**Updated Metal Types**:
- **Gold**: 22KT and 18KT only (24KT removed)
- **Silver**: No purity selection (simplified calculation)
- **Diamond**: 18KT and 14KT with additional diamond-specific fields

**Diamond Calculation Features**:
- **Diamond Weight**: With dropdown price selection
- **Solitaire Weight**: With dropdown price selection  
- **Color Stone Weight**: Fixed rate calculation
- **Special Formula**: Uses 22KT gold rate for making charges

**Calculation Logic**:
```javascript
// Diamond calculation
const baseValue = (baseRate * weightValue) / 10;
const makingValue = (makingChargesValue / 100) * gold22Rate;
const diamondValue = diamondWeightValue * diamondWeightPrice;
const solitaireValue = solitaireWeightValue * solitaireWeightPrice;
const colorStoneValue = colorStoneWeightValue * 700;
const totalBeforeGST = baseValue + makingValue + diamondValue + solitaireValue + colorStoneValue;
const gstAmount = (totalBeforeGST * gstValue) / 100;
const totalCost = totalBeforeGST + gstAmount;
```

**Auto-Recalculation**:
```javascript
useEffect(() => {
  if (weight && parseFloat(weight) > 0 && result !== null) {
    handleCalculate();
  }
}, [weight, purity, makingCharges, gst, metalType, rates, diamondWeight, diamondWeightPrice, solitaireWeight, solitaireWeightPrice, colorStoneWeight]);
```

### Merchant Info Screen (`app/(tabs)/merchant-info.jsx`)

**Purpose**: Displays store information, contact details, and services

**Key Features**:
- **Store Information**: Address, hours, establishment details
- **Contact Actions**: Phone, email, and WhatsApp integration
- **Services List**: Available services and certifications
- **External Links**: Deep links to maps, phone, and messaging apps

**Contact Integration**:
```javascript
const handleCall = async () => {
  const phoneNumber = 'tel:+911234567890';
  const canOpen = await Linking.canOpenURL(phoneNumber);
  if (canOpen) {
    await Linking.openURL(phoneNumber);
  }
};
```

### Header Component (`components/Header.jsx`)

**Purpose**: Reusable header component used across all screens

**Key Features**:
- **Brand Display**: Shows "Jewar House" title with decorative accents
- **Action Buttons**: Search and call functionality
- **Responsive Design**: Adapts title and button sizes to screen size
- **Gradient Styling**: Subtle gradient background
- **Haptic Feedback**: Platform-specific haptic feedback on interactions

**Responsive Title**:
```javascript
<Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
  {isSmallDevice ? 'Jewar House' : 'Jewar House'}
</Text>
```

### MetalRateCard Component (`components/MetalRateCard.jsx`)

**Purpose**: Displays individual metal rates with animations and styling

**Key Features**:
- **Loading Animation**: Pulsing effect during rate updates
- **Update Animation**: Color flash when rates change
- **Platform Compatibility**: Web-safe animations with fallbacks
- **Responsive Design**: Adapts to different screen sizes
- **Type Differentiation**: Different styling for gold vs silver vs diamond

**Animation Logic**:
```javascript
useEffect(() => {
  if (isLoading) {
    // Pulsing animation for loading state
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();
  } else {
    // Flash animation for rate updates
    Animated.sequence([
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(colorAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }
}, [isLoading, rate]);
```

### CategorySection Component (`components/CategorySection.jsx`)

**Purpose**: Manages and displays jewellery product categories with toggle functionality

**Key Features**:
- **Toggle System**: Switch between Gold, Silver, and Diamond categories
- **Dynamic Categories**: Each toggle shows different product categories
- **Product Modal**: Detailed product view with specifications
- **Navigation Integration**: Routes to individual category screens
- **Responsive Layout**: Adapts to different screen sizes

**Data Structure**:
```javascript
const jewelleryData = {
  gold: {
    title: 'GOLD JEWELLERY',
    color: '#D4AF37',
    products: [
      {
        id: 1,
        name: 'Classic Gold Ring',
        category: 'Rings',
        price: '₹45,000',
        weight: '8g',
        purity: '22KT',
        image: 'https://images.pexels.com/photos/...',
        description: 'Product description...',
      },
      // ... more products
    ],
  },
  silver: { /* Similar structure */ },
  diamond: { /* Similar structure */ },
};
```

**Toggle Functionality**:
```javascript
const [activeToggle, setActiveToggle] = useState('gold');

const renderToggleButton = (type, data) => (
  <TouchableOpacity
    style={[
      styles.toggleButton,
      activeToggle === type && styles.toggleButtonActive
    ]}
    onPress={() => setActiveToggle(type)}
  >
    <LinearGradient
      colors={activeToggle === type 
        ? ['#1A237E', '#283593'] 
        : ['#FFFFFF', '#F8F9FA']
      }
    >
      <Text>{data.title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);
```

**Navigation Handling**:
```javascript
const handleCategoryPress = (category) => {
  router.push({
    pathname: category.route,
    params: { categoryId: category.id, title: category.title }
  });
};
```

**Component Sections**:
1. **Toggle Section**: Three buttons for Gold, Silver, Diamond
2. **Active Categories**: Shows categories based on selected toggle
3. **Product Modal**: Detailed product information overlay

### JewelleryCarousel Component (`components/JewelleryCarousel.jsx`)

**Purpose**: Displays featured collections in an interactive carousel

**Key Features**:
- **Auto-scroll**: Automatic slide progression every 4 seconds
- **Manual Navigation**: Previous/next buttons for manual control
- **Smooth Animations**: Fade and scale transitions between slides
- **Responsive Design**: Adapts card size and spacing to screen dimensions
- **Premium Styling**: Gradient overlays and badge system

### Category Screens (`app/categories/*.jsx`)

**Purpose**: Individual product listing screens for each category

**Key Features**:
- **Product Display**: Grid/list of products with images and details
- **Action Buttons**: "Visit Store" and "Chat" functionality
- **Back Navigation**: Return to previous screen
- **Responsive Layout**: Adapts to different screen sizes
- **External Integration**: Links to maps and WhatsApp

**Common Structure**:
```javascript
const products = [
  {
    id: 1,
    name: 'Product Name',
    price: '₹1,25,000',
    weight: '25g',
    purity: '22KT',
    image: 'https://images.pexels.com/photos/...',
    description: 'Product description...',
  },
  // ... more products
];
```

## Services & Data Management

### Rate Service (`services/rateService.js`)

**Purpose**: Manages real-time metal rate updates with secure API integration

**Key Features**:
- **Environment-based Configuration**: All sensitive data in environment variables
- **Secure API Integration**: Bearer token authentication
- **WebSocket Support**: Real-time updates when available
- **Fallback System**: Graceful degradation to simulation mode
- **Error Handling**: Robust error handling with fallback rates

**Environment Configuration**:
```javascript
const API_CONFIG = {
  url: process.env.EXPO_PUBLIC_API_URL || 'https://api.goldrates.com',
  key: process.env.EXPO_PUBLIC_API_KEY || '',
  updateInterval: parseInt(process.env.EXPO_PUBLIC_RATE_UPDATE_INTERVAL || '2000'),
  enableLiveRates: process.env.EXPO_PUBLIC_ENABLE_LIVE_RATES === 'true',
};
```

**Secure API Call**:
```javascript
const fetchRatesFromAPI = async () => {
  try {
    if (!API_CONFIG.key) {
      console.warn('API key not configured, using default rates');
      return currentRates;
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
    return transformApiResponse(data);
  } catch (error) {
    console.error('Failed to fetch rates from API:', error);
    return fallbackRates;
  }
};
```

**Subscription System**:
```javascript
let subscribers = new Set();

export const subscribeToRates = (callback) => {
  subscribers.add(callback);
  connectWebSocket();
  
  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0) {
      disconnectWebSocket();
    }
  };
};
```

**Rate Update Logic**:
```javascript
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

// Notify all subscribers
subscribers.forEach(callback => callback(currentRates));
```

## Styling & Responsive Design

### Responsive System

The app uses a comprehensive responsive design system:

**Breakpoints**:
```javascript
const isSmallDevice = screenWidth < 350;
const isMediumDevice = screenWidth >= 350 && screenWidth < 400;
const isLargeDevice = screenWidth >= 400;
const isTablet = screenWidth >= 768;
```

**Dynamic Sizing Functions**:
```javascript
const getResponsiveSize = (small, medium, large, tablet = large) => {
  if (isTablet) return tablet;
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const getResponsivePadding = () => getResponsiveSize(12, 14, 16, 20);
const getResponsiveFontSize = (baseSize) => getResponsiveSize(baseSize - 2, baseSize - 1, baseSize, baseSize + 2);
```

### Design System

**Color Palette**:
- Primary: `#1A237E` (Deep Blue)
- Secondary: `#D4AF37` (Gold)
- Silver: `#8B7355` (Bronze)
- Diamond: `#E8E3D3` (Light Beige)
- Background: `#FAFAFA` (Light Gray)
- Text: `#6B7280` (Medium Gray)

**Typography**:
- **Crimson Pro**: Headings and titles (serif)
- **Poppins**: UI elements and labels (sans-serif)
- **Inter**: Body text and data (sans-serif)

**Gradients**:
- Primary: `['#1A237E', '#283593', '#3949AB']`
- Gold: `['#D4AF37', '#B8860B']`
- Silver: `['#f9f6ef', '#e8e3d3']`
- Diamond: `['#E8E3D3', '#D4D0C4']`

### StyleSheet Pattern

All components use `StyleSheet.create` for styling:

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(22),
    color: '#1A237E',
    letterSpacing: 1,
  },
  // ... more styles
});
```

## Platform Compatibility

### Web-First Approach

The app is designed with web as the primary platform:

**Platform-Specific Code**:
```javascript
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const triggerFeedback = () => {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
  // Web fallback: visual feedback or no action
};
```

**Animation Compatibility**:
```javascript
const animatedStyle = Platform.select({
  web: {
    opacity: isLoading ? 1 : undefined,
    backgroundColor,
  },
  default: {
    opacity: isLoading ? pulseAnim : 1,
    backgroundColor,
  },
});
```

### Critical Framework Hook

**NEVER REMOVE**: The `useFrameworkReady` hook in `app/_layout.jsx` is essential:

```javascript
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady(); // CRITICAL - Required for framework initialization
  
  // ... rest of component
}
```

## Font Management

### Font Loading System

Uses `@expo-google-fonts` for consistent font loading:

**Installation**:
```bash
npm install @expo-google-fonts/inter @expo-google-fonts/poppins @expo-google-fonts/crimson-pro
```

**Loading Pattern**:
```javascript
import { useFonts, Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';

const [fontsLoaded, fontError] = useFonts({
  'Inter-Regular': Inter_400Regular,
  'Inter-Medium': Inter_500Medium,
  // ... more fonts
});
```

**Usage in Styles**:
```javascript
const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter-Regular', // Use mapped name
    fontSize: 16,
  },
});
```

## Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd jewar-house
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual API keys and configuration
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Platform-specific commands**:
   ```bash
   npm run web     # Web development
   npm run android # Android development
   npm run ios     # iOS development
   ```

### Environment Configuration

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your configuration**:
   - Add your API key for live rate updates
   - Configure API endpoints
   - Set update intervals and default rates

3. **For production deployment**:
   - Set environment variables in your deployment platform
   - Use production API keys and endpoints
   - Never commit real API keys to version control

### Build Commands

```bash
npm run build:web     # Web production build
npm run build:android # Android build (requires EAS)
npm run build:ios     # iOS build (requires EAS)
```

## Dependencies

### Core Dependencies

- **expo**: ~53.0.0 - Expo SDK
- **expo-router**: ^4.0.17 - File-based routing
- **react**: 18.3.1 - React library
- **react-native**: 0.76.3 - React Native framework

### UI & Styling

- **expo-linear-gradient**: ^14.1.4 - Gradient backgrounds
- **lucide-react-native**: ^0.359.0 - Icon library
- **react-native-safe-area-context**: 4.12.0 - Safe area handling

### Fonts

- **@expo-google-fonts/inter**: ^0.2.3 - Inter font family
- **@expo-google-fonts/poppins**: ^0.2.3 - Poppins font family
- **@expo-google-fonts/crimson-pro**: ^0.2.3 - Crimson Pro font family

### Platform Features

- **expo-haptics**: ~13.0.0 - Haptic feedback (mobile only)
- **expo-linking**: ~7.0.0 - Deep linking and external URLs
- **date-fns**: ^3.3.1 - Date formatting utilities

### Development

- **babel-plugin-module-resolver**: ^5.0.0 - Path aliasing (@/ imports)
- **typescript**: ^5.1.3 - TypeScript support

**IMPORTANT**: All dependencies must be maintained. Do not remove any existing dependencies as they may be required for proper functionality.

## Security Best Practices

### Environment Variables

- **Never commit** `.env` files with real API keys
- Use different API keys for development and production
- Set production environment variables in your deployment platform
- The app gracefully handles missing API keys with fallback functionality

### API Security

- All API calls use Bearer token authentication
- API keys are stored in environment variables only
- No sensitive data is hardcoded in the application
- Error handling prevents API key exposure in logs

### Git Security

- `.gitignore` is configured to exclude all environment files
- Only `.env.example` (template) is committed to version control
- Sensitive configuration is handled through environment variables

## Contributing

When adding new features:

1. Follow the established file structure
2. Use the responsive design system
3. Implement platform-specific code where needed
4. Maintain the existing styling patterns
5. Test on multiple screen sizes
6. Ensure web compatibility
7. Use environment variables for any configuration
8. Never commit sensitive data like API keys

## License

This project is proprietary software for Jewar House.