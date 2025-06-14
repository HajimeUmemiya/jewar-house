# Jewar House - Gold & Silver Jewellery App

A comprehensive React Native Expo application for displaying live gold and silver rates, jewellery cost calculation, and product catalog management. Built with Expo SDK 52.0.30 and Expo Router 4.0.17.

## Table of Contents

- [Project Overview](#project-overview)
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
│   └── CategorySection.jsx     # Product categories manager
├── hooks/                      # Custom hooks
│   └── useFrameworkReady.js    # Framework initialization (CRITICAL)
├── services/                   # Data services
│   └── rateService.js          # Real-time rate management
└── assets/                     # Static assets
    └── images/                 # App icons and images
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
```

### Calculator Screen (`app/(tabs)/calculator.jsx`)

**Purpose**: Interactive jewellery cost calculator with live rate integration

**Key Features**:
- **Metal Type Toggle**: Switch between gold and silver
- **Purity Selection**: Dynamic purity options based on metal type
- **Live Rate Integration**: Automatically updates calculations with current rates
- **Input Validation**: Handles weight, making charges, and GST inputs
- **Real-time Calculation**: Updates results as inputs change

**Calculation Logic**:
```javascript
const baseValue = (baseRate * weightValue) / 10; // Rate is per 10g
const makingValue = (baseValue * makingChargesValue) / 100;
const totalBeforeGST = baseValue + makingValue;
const gstAmount = (totalBeforeGST * gstValue) / 100;
const totalCost = totalBeforeGST + gstAmount;
```

**Auto-Recalculation**:
```javascript
useEffect(() => {
  if (weight && parseFloat(weight) > 0 && result !== null) {
    handleCalculate();
  }
}, [weight, purity, makingCharges, gst, metalType, rates]);
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
- **Type Differentiation**: Different styling for gold vs silver

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
- **New Arrivals**: Special section always visible regardless of toggle
- **Navigation Integration**: Routes to individual category screens
- **Responsive Layout**: Adapts to different screen sizes

**Data Structure**:
```javascript
const jewelleryData = {
  gold: {
    title: 'GOLD JEWELLERY',
    color: '#D4AF37',
    categories: [
      {
        id: 'gold-jewellery',
        title: 'GOLD JEWELLERY',
        route: '/categories/gold-jewellery',
        subcategories: [
          {
            id: 'necklace-sets',
            name: 'NECKLACE SETS',
            image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
          },
          // ... more subcategories
        ],
      },
      // ... more categories
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
3. **New Arrival Section**: Always visible, independent of toggle

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

**Purpose**: Manages real-time metal rate updates and subscriptions

**Key Features**:
- **WebSocket Simulation**: Simulates real-time rate updates
- **Subscription Management**: Handles multiple subscribers
- **Rate Fluctuation**: Realistic price movement simulation
- **Connection Management**: Automatic connect/disconnect based on subscribers

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
    '24KT': Math.round(currentRates.gold['24KT'] * (1 + fluctuation())),
    // ... other purities
  },
  // ... silver rates
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

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Platform-specific commands**:
   ```bash
   npm run web     # Web development
   npm run android # Android development
   npm run ios     # iOS development
   ```

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

## Contributing

When adding new features:

1. Follow the established file structure
2. Use the responsive design system
3. Implement platform-specific code where needed
4. Maintain the existing styling patterns
5. Test on multiple screen sizes
6. Ensure web compatibility

## License

This project is proprietary software for Jewar House.