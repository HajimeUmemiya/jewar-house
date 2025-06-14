import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

// Responsive breakpoints
const isSmallDevice = screenWidth < 350;
const isMediumDevice = screenWidth >= 350 && screenWidth < 400;
const isTablet = screenWidth >= 768;

// Dynamic sizing functions
const getResponsiveSize = (small, medium, large, tablet = large) => {
  if (isTablet) return tablet;
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const getResponsiveFontSize = (baseSize) => getResponsiveSize(baseSize - 2, baseSize - 1, baseSize, baseSize + 2);

// Carousel data with premium jewellery images
const carouselData = [
  {
    id: 1,
    title: 'ROYAL COLLECTION',
    subtitle: 'Exquisite Heritage Designs',
    image: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg',
    description: 'Discover our premium collection of traditional and contemporary jewellery pieces.',
    badge: 'PREMIUM',
  },
  {
    id: 2,
    title: 'DIAMOND ELEGANCE',
    subtitle: 'Brilliant Cut Perfection',
    image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
    description: 'Stunning diamond jewellery crafted with precision and artistry.',
    badge: 'EXCLUSIVE',
  },
  {
    id: 3,
    title: 'GOLD MASTERY',
    subtitle: 'Timeless Craftsmanship',
    image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
    description: 'Pure gold jewellery showcasing traditional Indian artistry.',
    badge: 'HANDCRAFTED',
  },
  {
    id: 4,
    title: 'BRIDAL SPLENDOR',
    subtitle: 'Wedding Collection',
    image: 'https://images.pexels.com/photos/10894828/pexels-photo-10894828.jpeg',
    description: 'Complete bridal sets for your most special moments.',
    badge: 'BRIDAL',
  },
];

export default function JewelleryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const cardWidth = getResponsiveSize(280, 320, 360, 400);
  const cardSpacing = getResponsiveSize(16, 18, 20, 24);

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % carouselData.length;
      scrollToIndex(nextIndex);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const scrollToIndex = (index) => {
    if (scrollViewRef.current) {
      const xOffset = index * (cardWidth + cardSpacing);
      scrollViewRef.current.scrollTo({ x: xOffset, animated: true });
      setCurrentIndex(index);
      
      // Animate card transition
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0.7,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? carouselData.length - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % carouselData.length;
    scrollToIndex(nextIndex);
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (cardWidth + cardSpacing));
    if (index !== currentIndex && index >= 0 && index < carouselData.length) {
      setCurrentIndex(index);
    }
  };

  const renderCarouselItem = (item, index) => (
    <Animated.View
      key={item.id}
      style={[
        styles.carouselCard,
        {
          width: cardWidth,
          marginRight: index === carouselData.length - 1 ? 0 : cardSpacing,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={['#FFFFFF', '#FAFAFA']}
        style={styles.cardGradient}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.carouselImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
            style={styles.imageOverlay}
          />
          
          {/* Badge */}
          <View style={styles.badgeContainer}>
            <LinearGradient
              colors={['#D4AF37', '#B8860B']}
              style={styles.badge}
            >
              <Star size={getResponsiveSize(12, 13, 14)} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.badgeText}>{item.badge}</Text>
            </LinearGradient>
          </View>

          {/* Content Overlay */}
          <View style={styles.contentOverlay}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.cardFooter}>
            <View style={styles.decorativeLine} />
            <Text style={styles.exploreText}>Explore Collection</Text>
            <View style={styles.decorativeLine} />
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {carouselData.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dot,
            index === currentIndex && styles.activeDot,
          ]}
          onPress={() => scrollToIndex(index)}
        >
          <LinearGradient
            colors={index === currentIndex 
              ? ['#D4AF37', '#B8860B'] 
              : ['rgba(107, 114, 128, 0.3)', 'rgba(107, 114, 128, 0.5)']
            }
            style={styles.dotGradient}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#1A237E', '#283593', '#3949AB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTitleContainer}>
              <View style={styles.headerAccent} />
              <Text style={styles.headerTitle}>FEATURED COLLECTIONS</Text>
              <View style={styles.headerAccent} />
            </View>
            
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={handlePrevious}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(212, 175, 55, 0.2)', 'rgba(212, 175, 55, 0.1)']}
                  style={styles.navButtonGradient}
                >
                  <ChevronLeft size={getResponsiveSize(18, 20, 22)} color="#D4AF37" />
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.navButton}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(212, 175, 55, 0.2)', 'rgba(212, 175, 55, 0.1)']}
                  style={styles.navButtonGradient}
                >
                  <ChevronRight size={getResponsiveSize(18, 20, 22)} color="#D4AF37" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Carousel */}
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled={false}
          decelerationRate="fast"
          snapToInterval={cardWidth + cardSpacing}
          snapToAlignment="start"
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {carouselData.map((item, index) => renderCarouselItem(item, index))}
        </ScrollView>
      </View>

      {/* Dots Indicator */}
      {renderDots()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: getResponsiveSize(24, 28, 32),
  },
  header: {
    marginHorizontal: getResponsiveSize(12, 14, 16),
    borderRadius: getResponsiveSize(12, 14, 16),
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: getResponsiveSize(16, 18, 20),
  },
  headerGradient: {
    paddingVertical: getResponsiveSize(12, 14, 16),
    paddingHorizontal: getResponsiveSize(16, 18, 20),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveSize(8, 10, 12),
    flex: 1,
  },
  headerAccent: {
    width: getResponsiveSize(20, 24, 28),
    height: 2,
    backgroundColor: '#D4AF37',
    borderRadius: 1,
  },
  headerTitle: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(16),
    color: '#FFFFFF',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    flex: 1,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: getResponsiveSize(6, 7, 8),
  },
  navButton: {
    borderRadius: getResponsiveSize(16, 18, 20),
    overflow: 'hidden',
  },
  navButtonGradient: {
    width: getResponsiveSize(32, 36, 40),
    height: getResponsiveSize(32, 36, 40),
    borderRadius: getResponsiveSize(16, 18, 20),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  carouselContainer: {
    height: getResponsiveSize(280, 320, 360),
  },
  scrollContent: {
    paddingHorizontal: getResponsiveSize(12, 14, 16),
  },
  carouselCard: {
    height: getResponsiveSize(260, 300, 340),
    borderRadius: getResponsiveSize(16, 18, 20),
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(232, 234, 246, 0.5)',
  },
  cardGradient: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  badgeContainer: {
    position: 'absolute',
    top: getResponsiveSize(12, 14, 16),
    right: getResponsiveSize(12, 14, 16),
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getResponsiveSize(8, 10, 12),
    paddingVertical: getResponsiveSize(4, 5, 6),
    borderRadius: getResponsiveSize(12, 14, 16),
    gap: getResponsiveSize(4, 5, 6),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  badgeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getResponsiveFontSize(10),
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  contentOverlay: {
    position: 'absolute',
    bottom: getResponsiveSize(12, 14, 16),
    left: getResponsiveSize(12, 14, 16),
    right: getResponsiveSize(12, 14, 16),
  },
  itemTitle: {
    fontFamily: 'CrimsonPro-Bold',
    fontSize: getResponsiveFontSize(20),
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 4,
  },
  itemSubtitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: getResponsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardContent: {
    padding: getResponsiveSize(12, 14, 16),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  itemDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(13),
    color: '#6B7280',
    lineHeight: getResponsiveFontSize(18),
    marginBottom: getResponsiveSize(8, 10, 12),
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveSize(8, 10, 12),
  },
  decorativeLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D4AF37',
    opacity: 0.5,
  },
  exploreText: {
    fontFamily: 'Poppins-Medium',
    fontSize: getResponsiveFontSize(11),
    color: '#1A237E',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getResponsiveSize(16, 18, 20),
    gap: getResponsiveSize(8, 10, 12),
  },
  dot: {
    borderRadius: getResponsiveSize(6, 7, 8),
    overflow: 'hidden',
  },
  dotGradient: {
    width: getResponsiveSize(12, 14, 16),
    height: getResponsiveSize(12, 14, 16),
    borderRadius: getResponsiveSize(6, 7, 8),
  },
  activeDot: {
    elevation: 2,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});