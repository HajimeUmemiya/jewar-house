import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, MapPin, MessageCircle, Star } from 'lucide-react-native';
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

// Updated jewellery data with direct products
const jewelleryData = {
  gold: {
    title: 'GOLD JEWELLERY',
    color: '#D4AF37',
    products: [
      // Rings
      {
        id: 1,
        name: 'Classic Gold Ring',
        category: 'Rings',
        price: '₹45,000',
        weight: '8g',
        purity: '22KT',
        image: 'https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg',
        description: 'Elegant classic gold ring with traditional design and superior craftsmanship.',
      },
      {
        id: 2,
        name: 'Designer Gold Ring',
        category: 'Rings',
        price: '₹65,000',
        weight: '12g',
        purity: '18KT',
        image: 'https://images.pexels.com/photos/10894828/pexels-photo-10894828.jpeg',
        description: 'Contemporary designer ring with intricate patterns and modern appeal.',
      },
      // Tops/Earrings
      {
        id: 3,
        name: 'Gold Stud Tops',
        category: 'Tops',
        price: '₹25,000',
        weight: '6g',
        purity: '22KT',
        image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
        description: 'Beautiful gold stud earrings perfect for daily wear.',
      },
      {
        id: 4,
        name: 'Chandelier Tops',
        category: 'Tops',
        price: '₹85,000',
        weight: '18g',
        purity: '22KT',
        image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
        description: 'Stunning chandelier earrings with intricate gold work.',
      },
      // Bangles
      {
        id: 5,
        name: 'Traditional Gold Bangles',
        category: 'Bangles',
        price: '₹1,25,000',
        weight: '45g',
        purity: '22KT',
        image: 'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg',
        description: 'Set of traditional gold bangles with antique finish.',
      },
      {
        id: 6,
        name: 'Designer Gold Bracelet',
        category: 'Bangles',
        price: '₹75,000',
        weight: '25g',
        purity: '18KT',
        image: 'https://images.pexels.com/photos/989967/pexels-photo-989967.jpeg',
        description: 'Modern designer bracelet with contemporary patterns.',
      },
      // Necklaces
      {
        id: 7,
        name: 'Gold Chain Necklace',
        category: 'Necklaces',
        price: '₹1,85,000',
        weight: '35g',
        purity: '22KT',
        image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
        description: 'Elegant gold chain necklace with premium quality.',
      },
      {
        id: 8,
        name: 'Antique Necklace Set',
        category: 'Necklaces',
        price: '₹2,45,000',
        weight: '55g',
        purity: '22KT',
        image: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg',
        description: 'Traditional antique necklace set with matching earrings.',
      },
      // Miscellaneous
      {
        id: 9,
        name: 'Gold Pendant',
        category: 'Miscellaneous',
        price: '₹35,000',
        weight: '8g',
        purity: '18KT',
        image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
        description: 'Beautiful gold pendant with modern design.',
      },
      {
        id: 10,
        name: 'Gold Anklet',
        category: 'Miscellaneous',
        price: '₹55,000',
        weight: '15g',
        purity: '22KT',
        image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
        description: 'Traditional gold anklet with delicate patterns.',
      },
    ],
  },
  diamond: {
    title: 'DIAMOND JEWELLERY',
    color: '#E8E3D3',
    products: [
      // Rings
      {
        id: 11,
        name: 'Diamond Engagement Ring',
        category: 'Rings',
        price: '₹3,25,000',
        weight: '6g',
        purity: '18KT + VVS1',
        image: 'https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg',
        description: 'Stunning engagement ring with VVS1 diamond.',
      },
      {
        id: 12,
        name: 'Diamond Eternity Band',
        category: 'Rings',
        price: '₹2,85,000',
        weight: '8g',
        purity: '18KT + VS2',
        image: 'https://images.pexels.com/photos/10894828/pexels-photo-10894828.jpeg',
        description: 'Beautiful eternity band with perfectly matched diamonds.',
      },
      // Earrings
      {
        id: 13,
        name: 'Diamond Stud Earrings',
        category: 'Earrings',
        price: '₹1,85,000',
        weight: '4g',
        purity: '18KT + VVS2',
        image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
        description: 'Classic diamond stud earrings with brilliant cut diamonds.',
      },
      {
        id: 14,
        name: 'Diamond Drop Earrings',
        category: 'Earrings',
        price: '₹4,25,000',
        weight: '12g',
        purity: '18KT + VS1',
        image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
        description: 'Elegant drop earrings with cascading diamonds.',
      },
      // Bracelet
      {
        id: 15,
        name: 'Diamond Tennis Bracelet',
        category: 'Bracelet',
        price: '₹6,85,000',
        weight: '18g',
        purity: '18KT + VS2',
        image: 'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg',
        description: 'Luxurious tennis bracelet with perfectly matched diamonds.',
      },
      // Bangles
      {
        id: 16,
        name: 'Diamond Gold Bangles',
        category: 'Bangles',
        price: '₹8,95,000',
        weight: '35g',
        purity: '18KT + VVS1',
        image: 'https://images.pexels.com/photos/989967/pexels-photo-989967.jpeg',
        description: 'Exquisite diamond bangles with premium gold setting.',
      },
      // Necklace Set
      {
        id: 17,
        name: 'Diamond Necklace Set',
        category: 'Necklace Set',
        price: '₹12,50,000',
        weight: '45g',
        purity: '18KT + VVS2',
        image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
        description: 'Complete diamond necklace set with matching earrings.',
      },
      {
        id: 18,
        name: 'Vintage Diamond Set',
        category: 'Necklace Set',
        price: '₹15,75,000',
        weight: '52g',
        purity: '18KT + VVS1',
        image: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg',
        description: 'Vintage-inspired diamond necklace set with intricate details.',
      },
    ],
  },
  silver: {
    title: 'SILVER JEWELLERY',
    color: '#8B7355',
    products: [
      // Bichua
      {
        id: 19,
        name: 'Traditional Silver Bichua',
        category: 'Bichua',
        price: '₹3,500',
        weight: '12g',
        purity: '92.5%',
        image: 'https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg',
        description: 'Traditional silver toe rings with intricate patterns.',
      },
      {
        id: 20,
        name: 'Designer Silver Bichua',
        category: 'Bichua',
        price: '₹4,200',
        weight: '15g',
        purity: '92.5%',
        image: 'https://images.pexels.com/photos/10894828/pexels-photo-10894828.jpeg',
        description: 'Modern designer toe rings with contemporary appeal.',
      },
      // Paajeb
      {
        id: 21,
        name: 'Silver Anklet Chain',
        category: 'Paajeb',
        price: '₹6,500',
        weight: '25g',
        purity: '92.5%',
        image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
        description: 'Beautiful silver anklet with traditional bells.',
      },
      {
        id: 22,
        name: 'Heavy Silver Paajeb',
        category: 'Paajeb',
        price: '₹12,000',
        weight: '45g',
        purity: '92.5%',
        image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
        description: 'Heavy traditional silver anklet with intricate work.',
      },
      // God Idols
      {
        id: 23,
        name: 'Silver Ganesha Idol',
        category: 'God Idols',
        price: '₹8,500',
        weight: '35g',
        purity: '92.5%',
        image: 'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg',
        description: 'Beautiful silver Ganesha idol for worship and decoration.',
      },
      {
        id: 24,
        name: 'Silver Lakshmi Idol',
        category: 'God Idols',
        price: '₹15,000',
        weight: '65g',
        purity: '92.5%',
        image: 'https://images.pexels.com/photos/989967/pexels-photo-989967.jpeg',
        description: 'Elegant silver Lakshmi idol with detailed craftsmanship.',
      },
      // Bartan
      {
        id: 25,
        name: 'Silver Plate Set',
        category: 'Bartan',
        price: '₹25,000',
        weight: '150g',
        purity: '92.5%',
        image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
        description: 'Premium silver plate set for special occasions.',
      },
      {
        id: 26,
        name: 'Silver Glass Set',
        category: 'Bartan',
        price: '₹18,000',
        weight: '120g',
        purity: '92.5%',
        image: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg',
        description: 'Elegant silver glass set with traditional design.',
      },
    ],
  },
};

export default function CategorySection() {
  const [activeToggle, setActiveToggle] = useState('gold');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productModalVisible, setProductModalVisible] = useState(false);

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

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setProductModalVisible(true);
  };

  const closeProductModal = () => {
    setProductModalVisible(false);
    setSelectedProduct(null);
  };

  const renderToggleButton = (type, data) => (
    <TouchableOpacity
      key={type}
      style={[
        styles.toggleButton,
        activeToggle === type && styles.toggleButtonActive
      ]}
      onPress={() => setActiveToggle(type)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={activeToggle === type 
          ? ['#1A237E', '#283593'] 
          : ['#FFFFFF', '#F8F9FA']
        }
        style={styles.toggleGradient}
      >
        <Text style={[
          styles.toggleText,
          activeToggle === type && styles.toggleTextActive
        ]}>
          {data.title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderProductCard = (product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() => openProductModal(product)}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['#FFFFFF', '#FAFAFA']}
        style={styles.productGradient}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.4)']}
            style={styles.imageOverlay}
          />
          
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <LinearGradient
              colors={activeToggle === 'gold' 
                ? ['#D4AF37', '#B8860B'] 
                : activeToggle === 'diamond'
                ? ['#E8E3D3', '#D4D0C4']
                : ['#8B7355', '#6B5B47']
              }
              style={styles.badgeGradient}
            >
              <Text style={[
                styles.badgeText,
                activeToggle === 'diamond' && styles.diamondBadgeText
              ]}>
                {product.category}
              </Text>
            </LinearGradient>
          </View>

          {/* Premium Badge */}
          <View style={styles.premiumBadge}>
            <Star size={getResponsiveSize(8, 9, 10)} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          
          <Text style={[
            styles.productPrice,
            activeToggle === 'gold' && styles.goldPrice,
            activeToggle === 'diamond' && styles.diamondPrice,
            activeToggle === 'silver' && styles.silverPrice,
          ]}>
            {product.price}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderProductModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={productModalVisible}
      onRequestClose={closeProductModal}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={closeProductModal} />
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#FAFAFA']}
            style={styles.modalGradient}
          >
            {selectedProduct && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Product Details</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeProductModal}
                  >
                    <X size={getResponsiveSize(20, 22, 24)} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                  <View style={styles.modalImageContainer}>
                    <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0, 0, 0, 0.4)']}
                      style={styles.modalImageOverlay}
                    />
                    
                    <View style={styles.modalCategoryBadge}>
                      <LinearGradient
                        colors={activeToggle === 'gold' 
                          ? ['#D4AF37', '#B8860B'] 
                          : activeToggle === 'diamond'
                          ? ['#E8E3D3', '#D4D0C4']
                          : ['#8B7355', '#6B5B47']
                        }
                        style={styles.modalBadgeGradient}
                      >
                        <Text style={[
                          styles.modalBadgeText,
                          activeToggle === 'diamond' && styles.diamondBadgeText
                        ]}>
                          {selectedProduct.category}
                        </Text>
                      </LinearGradient>
                    </View>
                  </View>
                  
                  <View style={styles.modalProductInfo}>
                    <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                    <Text style={[
                      styles.modalProductPrice,
                      activeToggle === 'gold' && styles.goldPrice,
                      activeToggle === 'diamond' && styles.diamondPrice,
                      activeToggle === 'silver' && styles.silverPrice,
                    ]}>
                      {selectedProduct.price}
                    </Text>
                    
                    <View style={styles.modalProductSpecs}>
                      <View style={styles.specRow}>
                        <Text style={styles.specLabel}>Weight:</Text>
                        <Text style={styles.specValue}>{selectedProduct.weight}</Text>
                      </View>
                      <View style={styles.specRow}>
                        <Text style={styles.specLabel}>Purity:</Text>
                        <Text style={styles.specValue}>{selectedProduct.purity}</Text>
                      </View>
                      <View style={styles.specRow}>
                        <Text style={styles.specLabel}>Category:</Text>
                        <Text style={styles.specValue}>{selectedProduct.category}</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.modalProductDescription}>
                      {selectedProduct.description}
                    </Text>
                  </View>
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalActionButton}
                    onPress={handleStoreLocation}
                  >
                    <LinearGradient
                      colors={['#1A237E', '#283593']}
                      style={styles.modalActionGradient}
                    >
                      <MapPin size={getResponsiveSize(16, 18, 20)} color="#FFFFFF" />
                      <Text style={styles.modalActionText}>Visit Store</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalActionButton}
                    onPress={handleWhatsApp}
                  >
                    <LinearGradient
                      colors={['#25D366', '#128C7E']}
                      style={styles.modalActionGradient}
                    >
                      <MessageCircle size={getResponsiveSize(16, 18, 20)} color="#FFFFFF" />
                      <Text style={styles.modalActionText}>Chat</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );

  const currentProducts = jewelleryData[activeToggle].products;

  return (
    <View style={styles.container}>
      {/* Toggle Section */}
      <View style={styles.toggleSection}>
        <View style={styles.toggleContainer}>
          {Object.entries(jewelleryData).map(([type, data]) => 
            renderToggleButton(type, data)
          )}
        </View>
      </View>

      {/* Products Grid */}
      <View style={styles.productsSection}>
        <View style={styles.productsGrid}>
          {currentProducts.map((product) => renderProductCard(product))}
        </View>
      </View>

      {/* Product Modal */}
      {renderProductModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
  },
  toggleSection: {
    marginBottom: getResponsiveSize(24, 28, 32),
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveSize(25, 28, 32),
    padding: getResponsiveSize(4, 5, 6),
    elevation: 6,
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E8EAF6',
  },
  toggleButton: {
    flex: 1,
    borderRadius: getResponsiveSize(20, 23, 26),
    overflow: 'hidden',
    marginHorizontal: getResponsiveSize(2, 2.5, 3),
  },
  toggleButtonActive: {
    elevation: 4,
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  toggleGradient: {
    paddingVertical: getResponsiveSize(12, 14, 16),
    paddingHorizontal: getResponsiveSize(8, 10, 12),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: getResponsiveSize(44, 48, 52),
  },
  toggleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: getResponsiveFontSize(16),
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  productsSection: {
    flex: 1,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: getResponsiveSize(10, 12, 14),
  },
  productCard: {
    width: isTablet ? '31%' : '48%',
    borderRadius: getResponsiveSize(12, 14, 16),
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(232, 234, 246, 0.3)',
    marginBottom: getResponsiveSize(12, 14, 16),
  },
  productGradient: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: getResponsiveSize(140, 160, 180),
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  categoryBadge: {
    position: 'absolute',
    top: getResponsiveSize(8, 10, 12),
    left: getResponsiveSize(8, 10, 12),
    borderRadius: getResponsiveSize(10, 12, 14),
    overflow: 'hidden',
  },
  badgeGradient: {
    paddingHorizontal: getResponsiveSize(6, 8, 10),
    paddingVertical: getResponsiveSize(3, 4, 5),
  },
  badgeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getResponsiveFontSize(9),
    color: '#FFFFFF',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  diamondBadgeText: {
    color: '#8B7355',
    textShadowColor: 'rgba(139, 115, 85, 0.3)',
  },
  premiumBadge: {
    position: 'absolute',
    top: getResponsiveSize(8, 10, 12),
    right: getResponsiveSize(8, 10, 12),
    backgroundColor: 'rgba(212, 175, 55, 0.9)',
    borderRadius: getResponsiveSize(10, 12, 14),
    padding: getResponsiveSize(4, 5, 6),
  },
  productInfo: {
    padding: getResponsiveSize(10, 12, 14),
    gap: getResponsiveSize(6, 7, 8),
  },
  productName: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(14),
    color: '#1A237E',
    letterSpacing: 0.3,
    lineHeight: getResponsiveFontSize(18),
  },
  productPrice: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getResponsiveFontSize(15),
  },
  goldPrice: {
    color: '#D4AF37',
  },
  diamondPrice: {
    color: '#E8E3D3',
  },
  silverPrice: {
    color: '#8B7355',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    maxHeight: '90%',
    borderTopLeftRadius: getResponsiveSize(20, 22, 24),
    borderTopRightRadius: getResponsiveSize(20, 22, 24),
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalGradient: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: getResponsiveSize(16, 18, 20),
    paddingHorizontal: getResponsiveSize(20, 22, 24),
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAF6',
  },
  modalTitle: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(20),
    color: '#1A237E',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: getResponsiveSize(4, 5, 6),
    borderRadius: getResponsiveSize(12, 14, 16),
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
  },
  modalContent: {
    flex: 1,
  },
  modalImageContainer: {
    position: 'relative',
    height: getResponsiveSize(250, 280, 320),
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  modalCategoryBadge: {
    position: 'absolute',
    top: getResponsiveSize(16, 18, 20),
    left: getResponsiveSize(16, 18, 20),
    borderRadius: getResponsiveSize(16, 18, 20),
    overflow: 'hidden',
  },
  modalBadgeGradient: {
    paddingHorizontal: getResponsiveSize(12, 14, 16),
    paddingVertical: getResponsiveSize(6, 7, 8),
  },
  modalBadgeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getResponsiveFontSize(12),
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  modalProductInfo: {
    padding: getResponsiveSize(20, 22, 24),
    gap: getResponsiveSize(16, 18, 20),
  },
  modalProductName: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(24),
    color: '#1A237E',
    letterSpacing: 0.5,
    lineHeight: getResponsiveFontSize(30),
  },
  modalProductPrice: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getResponsiveFontSize(20),
  },
  modalProductSpecs: {
    backgroundColor: 'rgba(232, 234, 246, 0.3)',
    borderRadius: getResponsiveSize(12, 14, 16),
    padding: getResponsiveSize(16, 18, 20),
    gap: getResponsiveSize(12, 14, 16),
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
  },
  specValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getResponsiveFontSize(14),
    color: '#1A237E',
  },
  modalProductDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(16),
    color: '#6B7280',
    lineHeight: getResponsiveFontSize(24),
  },
  modalActions: {
    flexDirection: 'row',
    gap: getResponsiveSize(12, 14, 16),
    padding: getResponsiveSize(20, 22, 24),
    borderTopWidth: 1,
    borderTopColor: '#E8EAF6',
  },
  modalActionButton: {
    flex: 1,
    borderRadius: getResponsiveSize(12, 14, 16),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  modalActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsiveSize(14, 16, 18),
    paddingHorizontal: getResponsiveSize(16, 18, 20),
    gap: getResponsiveSize(8, 10, 12),
  },
  modalActionText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getResponsiveFontSize(16),
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});