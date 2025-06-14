import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowDownUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { format } from 'date-fns';

// Components
import MetalRateCard from '@/components/MetalRateCard';
import Header from '@/components/Header';
import CategorySection from '@/components/CategorySection';

// Services
import { fetchRates, subscribeToRates } from '@/services/rateService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive breakpoints
const isSmallDevice = screenWidth < 350;
const isMediumDevice = screenWidth >= 350 && screenWidth < 400;
const isLargeDevice = screenWidth >= 400;
const isTablet = screenWidth >= 768;

// Dynamic sizing functions
const getResponsiveSize = (small, medium, large, tablet = large) => {
  if (isTablet) return tablet;
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const getResponsivePadding = () => getResponsiveSize(12, 14, 16, 20);
const getResponsiveMargin = () => getResponsiveSize(12, 16, 20, 24);
const getResponsiveFontSize = (baseSize) => getResponsiveSize(baseSize - 2, baseSize - 1, baseSize, baseSize + 2);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [rates, setRates] = useState({
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
  });
  const refreshingAnim = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

  const loadRates = async () => {
    setIsLoading(true);
    try {
      const data = await fetchRates();
      setRates(data);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToRates((newRates) => {
      setRates(newRates);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Animate the refreshing indicator
    Animated.sequence([
      Animated.timing(refreshingAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(refreshingAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    await loadRates();
    setRefreshing(false);
  };

  const spin = refreshingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#D4AF37"
            colors={['#D4AF37']}
          />
        }
      >
        <View style={styles.headerSection}>
          <LinearGradient
            colors={['#1A237E', '#283593', '#3949AB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.ornamentTop} />
            <Text style={styles.mainHeading}>
              {isSmallDevice ? 'LIVE GOLD & SILVER RATES' : 'LIVE HALLMARK GOLD AND SILVER RATES'}
            </Text>
            <View style={styles.lastUpdatedContainer}>
              <Text style={styles.lastUpdatedText}>
                Last Update: {format(rates.lastUpdated, isSmallDevice ? 'dd/MM/yy, HH:mm' : 'dd/MM/yyyy, HH:mm:ss a')}
              </Text>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <ArrowDownUp size={getResponsiveSize(14, 15, 16)} color="#D4AF37" />
              </Animated.View>
            </View>
            <View style={styles.ornamentBottom} />
          </LinearGradient>
        </View>

        <View style={styles.ratesContainer}>
          <View style={styles.discountedRatesSection}>
            <LinearGradient
              colors={['#1A237E', '#283593', '#3949AB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.discountHeader}
            >
              <View style={styles.headerOrnament} />
              <Text style={styles.discountTitle}>
                {isSmallDevice ? 'SHOWROOM RATES' : 'DISCOUNTED SHOWROOM RATES'}
              </Text>
              <View style={styles.headerOrnament} />
            </LinearGradient>

            <View style={styles.discountRates}>
              <View style={styles.discountColumn}>
                <MetalRateCard
                  type="gold"
                  purity="24KT"
                  rate={rates.gold['24KT']}
                  isLoading={isLoading}
                  showLabel={true}
                />
                <MetalRateCard
                  type="gold"
                  purity="22KT"
                  rate={rates.gold['22KT']}
                  isLoading={isLoading}
                  showLabel={true}
                />
                <MetalRateCard
                  type="gold"
                  purity="20KT"
                  rate={rates.gold['20KT']}
                  isLoading={isLoading}
                  showLabel={true}
                />
                <MetalRateCard
                  type="gold"
                  purity="18KT"
                  rate={rates.gold['18KT']}
                  isLoading={isLoading}
                  showLabel={true}
                />
                <MetalRateCard
                  type="gold"
                  purity="14KT"
                  rate={rates.gold['14KT']}
                  isLoading={isLoading}
                  showLabel={true}
                />
              </View>
              <View style={styles.discountColumn}>
                <MetalRateCard
                  type="silver"
                  purity="24KT"
                  rate={rates.silver['24KT']}
                  isLoading={isLoading}
                  showLabel={true}
                />
                <MetalRateCard
                  type="silver"
                  purity="22KT"
                  rate={rates.silver['22KT']}
                  isLoading={isLoading}
                  showLabel={true}
                />
                <MetalRateCard
                  type="silver"
                  purity="18KT"
                  rate={rates.silver['18KT']}
                  isLoading={isLoading}
                  showLabel={true}
                />
                <MetalRateCard
                  type="silver"
                  purity="14KT"
                  rate={rates.silver['14KT']}
                  isLoading={isLoading}
                  showLabel={true}
                />
                <MetalRateCard
                  type="silver"
                  purity="9KT"
                  rate={rates.silver['9KT']}
                  isLoading={isLoading}
                  showLabel={true}
                />
              </View>
            </View>
          </View>

          {/* Product Categories Section */}
          <View style={styles.productsSection}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.titleAccent} />
              <Text style={styles.sectionTitle}>OUR JEWELLERY COLLECTION</Text>
              <View style={styles.titleAccent} />
            </View>
            
            <CategorySection />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingBottom: getResponsiveSize(20, 25, 30),
  },
  headerSection: {
    marginHorizontal: getResponsivePadding(),
    marginTop: getResponsivePadding(),
    borderRadius: getResponsiveSize(12, 14, 16),
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerGradient: {
    paddingVertical: getResponsiveSize(18, 20, 24),
    paddingHorizontal: getResponsiveSize(16, 18, 20),
    alignItems: 'center',
    position: 'relative',
  },
  ornamentTop: {
    position: 'absolute',
    top: getResponsiveSize(6, 7, 8),
    left: '50%',
    marginLeft: getResponsiveSize(-15, -18, -20),
    width: getResponsiveSize(30, 36, 40),
    height: getResponsiveSize(2, 2.5, 3),
    backgroundColor: '#D4AF37',
    borderRadius: 2,
  },
  ornamentBottom: {
    position: 'absolute',
    bottom: getResponsiveSize(6, 7, 8),
    left: '50%',
    marginLeft: getResponsiveSize(-15, -18, -20),
    width: getResponsiveSize(30, 36, 40),
    height: getResponsiveSize(2, 2.5, 3),
    backgroundColor: '#D4AF37',
    borderRadius: 2,
  },
  mainHeading: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(22),
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: getResponsiveFontSize(28),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: getResponsiveSize(8, 10, 12),
  },
  lastUpdatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: getResponsiveSize(8, 10, 12),
    justifyContent: 'center',
    gap: getResponsiveSize(6, 7, 8),
    flexWrap: 'wrap',
  },
  lastUpdatedText: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(14),
    color: '#E8EAF6',
    textAlign: 'center',
  },
  ratesContainer: {
    paddingHorizontal: getResponsivePadding(),
    marginTop: getResponsiveMargin(),
    gap: getResponsiveSize(20, 24, 28),
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveSize(8, 10, 12),
  },
  titleAccent: {
    width: getResponsiveSize(18, 20, 24),
    height: 2,
    backgroundColor: '#6B7280',
    borderRadius: 1,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: getResponsiveFontSize(16),
    color: '#6B7280',
    letterSpacing: 0.8,
  },
  discountedRatesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveSize(12, 14, 16),
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E8EAF6',
  },
  discountHeader: {
    paddingVertical: getResponsiveSize(12, 14, 16),
    alignItems: 'center',
    position: 'relative',
  },
  headerOrnament: {
    position: 'absolute',
    top: getResponsiveSize(4, 5, 6),
    width: getResponsiveSize(45, 52, 60),
    height: 2,
    backgroundColor: '#D4AF37',
    borderRadius: 1,
  },
  discountTitle: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(18),
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
    paddingHorizontal: getResponsiveSize(8, 10, 12),
  },
  discountRates: {
    flexDirection: isTablet ? 'row' : 'row',
    padding: getResponsiveSize(12, 14, 16),
    backgroundColor: '#FAFAFA',
    gap: getResponsiveSize(8, 10, 12),
  },
  discountColumn: {
    flex: 1,
    gap: getResponsiveSize(6, 7, 8),
  },
  // Products Section Styles
  productsSection: {
    marginTop: getResponsiveMargin(),
    flex: 1,
  },
});