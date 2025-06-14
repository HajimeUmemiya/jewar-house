import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

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

const getResponsiveFontSize = (baseSize) => getResponsiveSize(baseSize - 2, baseSize - 1, baseSize, baseSize + 2);

export default function MetalRateCard({
  type,
  purity,
  rate,
  isLoading = false,
  showLabel = false,
  onPress,
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      // Create a pulsing animation
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
      // Stop the animation
      pulseAnim.setValue(1);
      
      // Flash the price to indicate update
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

    return () => {
      // Clean up animations
      pulseAnim.stopAnimation();
      colorAnim.stopAnimation();
    };
  }, [isLoading, rate]);

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      'transparent',
      type === 'gold' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(249, 246, 239, 0.3)',
    ],
  });

  const formattedRate = rate.toLocaleString('en-IN');

  // Platform-specific style to handle web compatibility
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

  const CardContent = () => (
    <LinearGradient
      colors={['#FFFFFF', '#FAFAFA']}
      style={styles.cardGradient}
    >
      <View style={styles.rateInfoContainer}>
        {showLabel && (
          <Text style={[styles.label, type === 'gold' ? styles.goldLabel : styles.silverLabel]}>
            {type.toUpperCase()} {purity}
          </Text>
        )}

        <View style={styles.rateContainer}>
          <LinearGradient
            colors={type === 'gold' ? ['#D4AF37', '#B8860B'] : ['#f9f6ef', '#e8e3d3']}
            style={styles.purityCircle}
          >
            <Text style={[
              styles.purityText,
              type === 'silver' && styles.silverPurityText
            ]}>
              {purity.replace('KT', '')}
            </Text>
          </LinearGradient>

          <View style={styles.priceContainer}>
            <Text style={styles.ratePrefix}>₹</Text>
            <Text style={styles.rateValue} numberOfLines={1} adjustsFontSizeToFit>
              {formattedRate}
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  // If onPress is provided, wrap in TouchableOpacity, otherwise just use Animated.View
  return onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <CardContent />
      </Animated.View>
    </TouchableOpacity>
  ) : (
    <Animated.View style={[styles.card, animatedStyle]}>
      <CardContent />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: getResponsiveSize(8, 10, 12),
    marginBottom: getResponsiveSize(6, 7, 8),
    elevation: 3,
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(232, 234, 246, 0.5)',
  },
  cardGradient: {
    borderRadius: getResponsiveSize(8, 10, 12),
    padding: getResponsiveSize(8, 10, 12),
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: getResponsiveFontSize(14),
    marginBottom: getResponsiveSize(6, 7, 8),
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  goldLabel: {
    color: '#B8860B',
  },
  silverLabel: {
    color: '#8B7355',
  },
  rateInfoContainer: {
    flexDirection: 'column',
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  purityCircle: {
    width: getResponsiveSize(32, 38, 44),
    height: getResponsiveSize(32, 38, 44),
    borderRadius: getResponsiveSize(16, 19, 22),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getResponsiveSize(8, 10, 12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  purityText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: getResponsiveFontSize(14),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  silverPurityText: {
    color: '#8B7355',
    textShadowColor: 'rgba(139, 115, 85, 0.3)',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  ratePrefix: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    marginTop: 2,
  },
  rateValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: getResponsiveFontSize(18),
    color: '#1A237E',
    flex: 1,
  },
});