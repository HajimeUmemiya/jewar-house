import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
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
      colors={['#FAFAFA', '#F5F5F5']}
      style={styles.headerGradient}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.titleAccent} />
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
            {isSmallDevice ? 'Jewar House' : 'Jewar House'}
          </Text>
          <View style={styles.titleAccent} />
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSearch}>
            <LinearGradient
              colors={['#FFFFFF', '#F8F9FA']}
              style={styles.buttonGradient}
            >
              <Search size={getResponsiveSize(18, 19, 20)} color="#6B7280" />
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: getResponsiveSize(12, 14, 16),
    paddingHorizontal: getResponsivePadding(),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveSize(8, 10, 12),
    flex: 1,
    marginRight: getResponsiveSize(8, 10, 12),
  },
  titleAccent: {
    width: getResponsiveSize(15, 17, 20),
    height: 2,
    backgroundColor: '#D4AF37',
    borderRadius: 1,
  },
  title: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(26),
    color: '#1A237E',
    letterSpacing: 1,
    textShadowColor: 'rgba(26, 35, 126, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    flex: 1,
    textAlign: 'center',
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
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonGradient: {
    width: getResponsiveSize(36, 40, 44),
    height: getResponsiveSize(36, 40, 44),
    borderRadius: getResponsiveSize(18, 20, 22),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.1)',
  },
});