declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // API Configuration
      EXPO_PUBLIC_API_URL: string;
      EXPO_PUBLIC_API_KEY: string;
      
      // Rate Service Configuration
      EXPO_PUBLIC_RATE_UPDATE_INTERVAL: string;
      EXPO_PUBLIC_ENABLE_LIVE_RATES: string;
      
      // Default Rates (fallback values)
      EXPO_PUBLIC_DEFAULT_GOLD_22KT: string;
      EXPO_PUBLIC_DEFAULT_GOLD_18KT: string;
      EXPO_PUBLIC_DEFAULT_SILVER_BASE: string;
      EXPO_PUBLIC_DEFAULT_DIAMOND_18KT: string;
      EXPO_PUBLIC_DEFAULT_DIAMOND_14KT: string;
    }
  }
}

// Ensure this file is treated as a module
export {};