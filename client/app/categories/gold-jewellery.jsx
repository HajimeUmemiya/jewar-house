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

// Sample products data
const products = [
  {
    id: 1,
    name: 'Royal Antique Gold Necklace Set',
    price: '₹2,45,000',
    weight: '45g',
    purity: '22KT',
    image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
    description: 'Exquisite antique-style gold necklace set crafted with intricate traditional motifs and premium 22KT gold.',
  },
  {
    id: 2,
    name: 'Pearl Studded Gold Choker Set',
    price: '₹1,85,000',
    weight: '35g',
    purity: '22KT',
    image: 'https://images.pexels.com/photos/989967/pexels-photo-989967.jpeg',
    description: 'Elegant gold choker set featuring natural pearls set in pure 22KT gold with delicate craftsmanship.',
  },
  {
    id: 3,
    name: 'Emerald Fusion Gold Necklace',
    price: '₹3,45,000',
    weight: '55g',
    purity: '18KT',
    image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
    description: 'Stunning emerald and diamond necklace with intricate 18KT gold work and modern design.',
  },
  {
    id: 4,
    name: 'Traditional Kundan Gold Set',
    price: '₹2,75,000',
    weight: '48g',
    purity: '22KT',
    image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
    description: 'Heritage kundan necklace set with matching earrings, featuring precious stones and meenakari work.',
  },
  {
    id: 5,
    name: 'Diamond Gold Bridal Set',
    price: '₹4,25,000',
    weight: '65g',
    purity: '18KT',
    image: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg',
    description: 'Luxurious bridal set featuring diamonds and intricate gold work perfect for special occasions.',
  },
  {
    id: 6,
    name: 'Temple Gold Necklace Set',
    price: '₹3,15,000',
    weight: '52g',
    purity: '22KT',
    image: 'https://images.pexels.com/photos/10894828/pexels-photo-10894828.jpeg',
    description: 'Traditional temple jewelry set with deity motifs and antique finish in pure 22KT gold.',
  },
];

export default function GoldJewelleryScreen() {
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
            <Text style={styles.headerTitle}>{title || 'GOLD JEWELLERY'}</Text>
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