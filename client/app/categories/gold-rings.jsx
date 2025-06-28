import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, MapPin, MessageCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking } from 'react-native';

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

const getResponsivePadding = () => getResponsiveSize(12, 14, 16, 20);
const getResponsiveFontSize = (baseSize) => getResponsiveSize(baseSize - 2, baseSize - 1, baseSize, baseSize + 2);

// Sample products data for gold rings
const products = [
  {
    id: 1,
    name: 'Engagement Diamond Ring',
    price: '₹5,95,000',
    weight: '6g',
    purity: '18KT + VVS1',
    image: 'https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg',
    description: 'Classic engagement ring featuring a brilliant VVS1 diamond in platinum setting.',
  },
  {
    id: 2,
    name: 'Gold Eternity Band',
    price: '₹3,75,000',
    weight: '10g',
    purity: '18KT',
    image: 'https://images.pexels.com/photos/10894828/pexels-photo-10894828.jpeg',
    description: 'Full eternity band featuring perfectly matched diamonds in seamless setting.',
  },
  {
    id: 3,
    name: 'Traditional Gold Ring',
    price: '₹1,25,000',
    weight: '8g',
    purity: '22KT',
    image: 'https://images.pexels.com/photos/989967/pexels-photo-989967.jpeg',
    description: 'Traditional 22KT gold ring with intricate patterns and antique finish.',
  },
  {
    id: 4,
    name: 'Designer Gold Ring',
    price: '₹2,85,000',
    weight: '12g',
    purity: '18KT',
    image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
    description: 'Contemporary designer ring with modern patterns and premium 18KT gold.',
  },
];

export default function GoldRingsScreen() {
  const insets = useSafeAreaInsets();
  const { title } = useLocalSearchParams();

  const handleStoreLocation = async () => {
    const url = 'https://maps.app.goo.gl/LDYyCGQ3cAxQZheM7?g_st=aw';
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  const handleWhatsApp = async () => {
    const phoneNumber = '1234567890';
    const url = `https://wa.me/${phoneNumber}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  const renderProduct = (product) => (
    <View key={product.id} style={styles.productCard}>
      <LinearGradient
        colors={['#FFFFFF', '#FAFAFA']}
        style={styles.productGradient}
      >
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.productDetails}>
            <Text style={styles.productPrice}>{product.price}</Text>
            <Text style={styles.productSpecs}>
              {product.weight} • {product.purity}
            </Text>
          </View>
          <Text style={styles.productDescription} numberOfLines={2}>
            {product.description}
          </Text>
          
          <View style={styles.productActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleStoreLocation}
            >
              <LinearGradient
                colors={['#1A237E', '#283593']}
                style={styles.actionGradient}
              >
                <MapPin size={getResponsiveSize(14, 15, 16)} color="#FFFFFF" />
                <Text style={styles.actionText}>Visit Store</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleWhatsApp}
            >
              <LinearGradient
                colors={['#25D366', '#128C7E']}
                style={styles.actionGradient}
              >
                <MessageCircle size={getResponsiveSize(14, 15, 16)} color="#FFFFFF" />
                <Text style={styles.actionText}>Chat</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#1A237E', '#283593', '#3949AB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={getResponsiveSize(20, 22, 24)} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <View style={styles.headerAccent} />
            <Text style={styles.headerTitle}>{title || 'GOLD RINGS'}</Text>
            <View style={styles.headerAccent} />
          </View>
        </LinearGradient>
      </View>

      {/* Products List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.productsContainer}>
          {products.map(product => renderProduct(product))}
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
  header: {
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getResponsiveSize(16, 18, 20),
    paddingHorizontal: getResponsiveSize(16, 18, 20),
    gap: getResponsiveSize(12, 14, 16),
  },
  backButton: {
    padding: getResponsiveSize(6, 7, 8),
    borderRadius: getResponsiveSize(20, 22, 24),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    fontSize: getResponsiveFontSize(18),
    color: '#FFFFFF',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    padding: getResponsivePadding(),
    paddingBottom: getResponsiveSize(20, 25, 30),
  },
  productsContainer: {
    gap: getResponsiveSize(12, 14, 16),
  },
  productCard: {
    borderRadius: getResponsiveSize(12, 14, 16),
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 0.5,
    borderColor: '#E8EAF6',
    backgroundColor: '#FFFFFF',
  },
  productGradient: {
    padding: getResponsiveSize(16, 18, 20),
  },
  productImage: {
    width: '100%',
    height: getResponsiveSize(180, 200, 220),
    borderRadius: getResponsiveSize(8, 10, 12),
    marginBottom: getResponsiveSize(12, 14, 16),
  },
  productInfo: {
    gap: getResponsiveSize(8, 9, 10),
  },
  productName: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(18),
    color: '#1A237E',
    letterSpacing: 0.5,
    lineHeight: getResponsiveFontSize(22),
  },
  productDetails: {
    gap: 4,
  },
  productPrice: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getResponsiveFontSize(16),
    color: '#D4AF37',
  },
  productSpecs: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
  },
  productDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    lineHeight: getResponsiveFontSize(20),
  },
  productActions: {
    flexDirection: 'row',
    gap: getResponsiveSize(8, 10, 12),
    marginTop: getResponsiveSize(4, 5, 6),
  },
  actionButton: {
    flex: 1,
    borderRadius: getResponsiveSize(18, 20, 22),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsiveSize(8, 9, 10),
    paddingHorizontal: getResponsiveSize(12, 14, 16),
    gap: getResponsiveSize(4, 5, 6),
  },
  actionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: getResponsiveFontSize(12),
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});