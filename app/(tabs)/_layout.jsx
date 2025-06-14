import { Tabs } from 'expo-router';
import { Calculator, Home, Info } from 'lucide-react-native';
import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive calculations
const isSmallDevice = screenWidth < 350;
const isMediumDevice = screenWidth >= 350 && screenWidth < 400;
const isLargeDevice = screenWidth >= 400;

// Dynamic sizing based on screen size
const getTabBarHeight = () => {
  if (isSmallDevice) return 75;
  if (isMediumDevice) return 80;
  return 85;
};

const getIconSize = () => {
  if (isSmallDevice) return 24;
  if (isMediumDevice) return 26;
  return 28;
};

const getFontSize = () => {
  if (isSmallDevice) return 11;
  if (isMediumDevice) return 12;
  return 13;
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarStyle: {
          backgroundColor: '#1A237E',
          borderTopColor: '#283593',
          borderTopWidth: 1,
          paddingTop: isSmallDevice ? 10 : 12,
          paddingBottom: Platform.OS === 'ios' ? (isSmallDevice ? 25 : 30) : (isSmallDevice ? 10 : 12),
          paddingHorizontal: isSmallDevice ? 12 : 16,
          height: getTabBarHeight(),
          elevation: 8,
          shadowColor: '#1A237E',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: getFontSize(),
          marginTop: 2,
          marginBottom: 0,
          letterSpacing: 0.3,
          lineHeight: getFontSize() + 4,
          textAlign: 'center',
          includeFontPadding: false,
          textAlignVertical: 'center',
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 2,
        },
        tabBarItemStyle: {
          paddingVertical: isSmallDevice ? 6 : 8,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          minHeight: getTabBarHeight() - (Platform.OS === 'ios' ? 25 : 10),
        },
        tabBarLabelPosition: 'below-icon',
        tabBarAllowFontScaling: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home 
              size={getIconSize()} 
              color={focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'} 
              strokeWidth={focused ? 3 : 2.5}
              fill={focused ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Calculator',
          tabBarIcon: ({ color, focused }) => (
            <Calculator 
              size={getIconSize()} 
              color={focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'} 
              strokeWidth={focused ? 3 : 2.5}
              fill={focused ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="merchant-info"
        options={{
          title: isSmallDevice ? 'Info' : 'Merchant Info',
          tabBarIcon: ({ color, focused }) => (
            <Info 
              size={getIconSize()} 
              color={focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'} 
              strokeWidth={focused ? 3 : 2.5}
              fill={focused ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
            />
          ),
        }}
      />
    </Tabs>
  );
}