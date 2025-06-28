import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, Image } from 'react-native';
import { Phone, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

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

const getResponsivePadding = () => getResponsiveSize(12, 14, 16, 20);
const getResponsiveFontSize = (baseSize) => getResponsiveSize(baseSize - 2, baseSize - 1, baseSize, baseSize + 2);

export default function Header() {
  const handleCall = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // Handle call action
  };

  const handleSearch = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Handle search action
  };

  return (
    <LinearGradient
      colors={['#1A237E', '#283593']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerGradient}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#D4AF37', '#B8860B']}
              style={styles.logoBackground}
            >
              <Text style={styles.logoText}>JH</Text>
            </LinearGradient>
          </View>
          <View style={styles.titleTextContainer}>
            <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
              Jewar House
            </Text>
            <Text style={styles.subtitle}>Premium Jewellery Collection</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSearch}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.buttonGradient}
            >
              <Search size={getResponsiveSize(18, 19, 20)} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <LinearGradient
              colors={['#D4AF37', '#B8860B']}
              style={styles.buttonGradient}
            >
              <Phone size={getResponsiveSize(18, 19, 20)} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingBottom: getResponsiveSize(6, 7, 8),
    elevation: 8,
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: getResponsiveSize(16, 18, 20),
    paddingHorizontal: getResponsivePadding(),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: getResponsiveSize(8, 10, 12),
  },
  logoContainer: {
    marginRight: getResponsiveSize(12, 14, 16),
  },
  logoBackground: {
    width: getResponsiveSize(48, 52, 56),
    height: getResponsiveSize(48, 52, 56),
    borderRadius: getResponsiveSize(24, 26, 28),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontFamily: 'CrimsonPro-Bold',
    fontSize: getResponsiveFontSize(20),
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(24),
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(12),
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveSize(8, 10, 12),
  },
  actionButton: {
    borderRadius: getResponsiveSize(18, 20, 22),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonGradient: {
    width: getResponsiveSize(36, 40, 44),
    height: getResponsiveSize(36, 40, 44),
    borderRadius: getResponsiveSize(18, 20, 22),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});