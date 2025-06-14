import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, X, MapPin, MessageCircle, Package } from 'lucide-react-native';
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

// Updated jewellery data with new categories and products
const jewelleryData = {
  gold: {
    title: 'GOLD JEWELLERY',
    color: '#D4AF37',
    categories: [
      {
        id: 'rings',
        name: 'Rings',
        icon: '💍',
        productCount: 8,
        products: [
          {
            id: 1,
            name: 'Classic Gold Ring',
            price: '₹45,000',
            weight: '8g',
            purity: '22KT',
            image: 'https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg',
            description: 'Elegant classic gold ring with traditional design and superior craftsmanship.',
          },
          {
            id: 2,
            name: 'Designer Gold Ring',
            price: '₹65,000',
            weight: '12g',
            purity: '18KT',
            image: 'https://images.pexels.com/photos/10894828/pexels-photo-10894828.jpeg',
            description: 'Contemporary designer ring with intricate patterns and modern appeal.',
          },
        ],
      },
      {
        id: 'tops',
        name: 'Tops',
        icon: '👂',
        productCount: 12,
        products: [
          {
            id: 3,
            name: 'Gold Stud Tops',
            price: '₹25,000',
            weight: '6g',
            purity: '22KT',
            image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
            description: 'Beautiful gold stud earrings perfect for daily wear.',
          },
          {
            id: 4,
            name: 'Chandelier Tops',
            price: '₹85,000',
            weight: '18g',
            purity: '22KT',
            image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
            description: 'Stunning chandelier earrings with intricate gold work.',
          },
        ],
      },
      {
        id: 'bangles',
        name: 'Bangles',
        icon: '⚪',
        productCount: 15,
        products: [
          {
            id: 5,
            name: 'Traditional Gold Bangles',
            price: '₹1,25,000',
            weight: '45g',
            purity: '22KT',
            image: 'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg',
            description: 'Set of traditional gold bangles with antique finish.',
          },
          {
            id: 6,
            name: 'Designer Gold Bracelet',
            price: '₹75,000',
            weight: '25g',
            purity: '18KT',
            image: 'https://images.pexels.com/photos/989967/pexels-photo-989967.jpeg',
            description: 'Modern designer bracelet with contemporary patterns.',
          },
        ],
      },
      {
        id: 'necklaces',
        name: 'Necklaces',
        icon: '📿',
        productCount: 20,
        products: [
          {
            id: 7,
            name: 'Gold Chain Necklace',
            price: '₹1,85,000',
            weight: '35g',
            purity: '22KT',
            image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
            description: 'Elegant gold chain necklace with premium quality.',
          },
          {
            id: 8,
            name: 'Antique Necklace Set',
            price: '₹2,45,000',
            weight: '55g',
            purity: '22KT',
            image: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg',
            description: 'Traditional antique necklace set with matching earrings.',
          },
        ],
      },
      {
        id: 'miscellaneous',
        name: 'Miscellaneous',
        icon: '✨',
        productCount: 10,
        products: [
          {
            id: 9,
            name: 'Gold Pendant',
            price: '₹35,000',
            weight: '8g',
            purity: '18KT',
            image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
            description: 'Beautiful gold pendant with modern design.',
          },
          {
            id: 10,
            name: 'Gold Anklet',
            price: '₹55,000',
            weight: '15g',
            purity: '22KT',
            image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
            description: 'Traditional gold anklet with delicate patterns.',
          },
        ],
      },
    ],
  },
  diamond: {
    title: 'DIAMOND JEWELLERY',
    color: '#E8E3D3',
    categories: [
      {
        id: 'rings',
        name: 'Rings',
        icon: '💎',
        productCount: 6,
        products: [
          {
            id: 11,
            name: 'Diamond Engagement Ring',
            price: '₹3,25,000',
            weight: '6g',
            purity: '18KT + VVS1',
            image: 'https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg',
            description: 'Stunning engagement ring with VVS1 diamond.',
          },
          {
            id: 12,
            name: 'Diamond Eternity Band',
            price: '₹2,85,000',
            weight: '8g',
            purity: '18KT + VS2',
            image: 'https://images.pexels.com/photos/10894828/pexels-photo-10894828.jpeg',
            description: 'Beautiful eternity band with perfectly matched diamonds.',
          },
        ],
      },
      {
        id: 'earrings',
        name: 'Earrings',
        icon: '💫',
        productCount: 8,
        products: [
          {
            id: 13,
            name: 'Diamond Stud Earrings',
            price: '₹1,85,000',
            weight: '4g',
            purity: '18KT + VVS2',
            image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
            description: 'Classic diamond stud earrings with brilliant cut diamonds.',
          },
          {
            id: 14,
            name: 'Diamond Drop Earrings',
            price: '₹4,25,000',
            weight: '12g',
            purity: '18KT + VS1',
            image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
            description: 'Elegant drop earrings with cascading diamonds.',
          },
        ],
      },
      {
        id: 'bracelet',
        name: 'Bracelet',
        icon: '🔗',
        productCount: 4,
        products: [
          {
            id: 15,
            name: 'Diamond Tennis Bracelet',
            price: '₹6,85,000',
            weight: '18g',
            purity: '18KT + VS2',
            image: 'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg',
            description: 'Luxurious tennis bracelet with perfectly matched diamonds.',
          },
        ],
      },
      {
        id: 'bangles',
        name: 'Bangles',
        icon: '⭕',
        productCount: 5,
        products: [
          {
            id: 16,
            name: 'Diamond Gold Bangles',
            price: '₹8,95,000',
            weight: '35g',
            purity: '18KT + VVS1',
            image: 'https://images.pexels.com/photos/989967/pexels-photo-989967.jpeg',
            description: 'Exquisite diamond bangles with premium gold setting.',
          },
        ],
      },
      {
        id: 'necklace-set',
        name: 'Necklace Set',
        icon: '👑',
        productCount: 7,
        products: [
          {
            id: 17,
            name: 'Diamond Necklace Set',
            price: '₹12,50,000',
            weight: '45g',
            purity: '18KT + VVS2',
            image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
            description: 'Complete diamond necklace set with matching earrings.',
          },
        ],
      },
    ],
  },
  silver: {
    title: 'SILVER JEWELLERY',
    color: '#8B7355',
    categories: [
      {
        id: 'bichua',
        name: 'Bichua',
        icon: '🦶',
        productCount: 6,
        products: [
          {
            id: 18,
            name: 'Traditional Silver Bichua',
            price: '₹3,500',
            weight: '12g',
            purity: '92.5%',
            image: 'https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg',
            description: 'Traditional silver toe rings with intricate patterns.',
          },
          {
            id: 19,
            name: 'Designer Silver Bichua',
            price: '₹4,200',
            weight: '15g',
            purity: '92.5%',
            image: 'https://images.pexels.com/photos/10894828/pexels-photo-10894828.jpeg',
            description: 'Modern designer toe rings with contemporary appeal.',
          },
        ],
      },
      {
        id: 'paajeb',
        name: 'Paajeb',
        icon: '🦵',
        productCount: 8,
        products: [
          {
            id: 20,
            name: 'Silver Anklet Chain',
            price: '₹6,500',
            weight: '25g',
            purity: '92.5%',
            image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
            description: 'Beautiful silver anklet with traditional bells.',
          },
          {
            id: 21,
            name: 'Heavy Silver Paajeb',
            price: '₹12,000',
            weight: '45g',
            purity: '92.5%',
            image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
            description: 'Heavy traditional silver anklet with intricate work.',
          },
        ],
      },
      {
        id: 'god-idols',
        name: 'God Idols',
        icon: '🕉️',
        productCount: 12,
        products: [
          {
            id: 22,
            name: 'Silver Ganesha Idol',
            price: '₹8,500',
            weight: '35g',
            purity: '92.5%',
            image: 'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg',
            description: 'Beautiful silver Ganesha idol for worship and decoration.',
          },
          {
            id: 23,
            name: 'Silver Lakshmi Idol',
            price: '₹15,000',
            weight: '65g',
            purity: '92.5%',
            image: 'https://images.pexels.com/photos/989967/pexels-photo-989967.jpeg',
            description: 'Elegant silver Lakshmi idol with detailed craftsmanship.',
          },
        ],
      },
      {
        id: 'bartan',
        name: 'Bartan',
        icon: '🍽️',
        productCount: 10,
        products: [
          {
            id: 24,
            name: 'Silver Plate Set',
            price: '₹25,000',
            weight: '150g',
            purity: '92.5%',
            image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
            description: 'Premium silver plate set for special occasions.',
          },
          {
            id: 25,
            name: 'Silver Glass Set',
            price: '₹18,000',
            weight: '120g',
            purity: '92.5%',
            image: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg',
            description: 'Elegant silver glass set with traditional design.',
          },
        ],
      },
    ],
  },
};

export default function CategorySection() {
  const [activeToggle, setActiveToggle] = useState('gold');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
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

  const openCategoryModal = (category) => {
    setSelectedCategory(category);
    setCategoryModalVisible(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalVisible(false);
    setSelectedCategory(null);
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setProductModalVisible(true);
    setCategoryModalVisible(false);
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

  const renderCategoryCard = (category) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryCard}
      onPress={() => openCategoryModal(category)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#FFFFFF', '#FAFAFA']}
        style={styles.categoryGradient}
      >
        <View style={styles.categoryIconContainer}>
          <LinearGradient
            colors={['#1A237E', '#283593']}
            style={styles.categoryIconBackground}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryCount}>
            {category.productCount} Products
          </Text>
        </View>
        
        <View style={styles.categoryArrow}>
          <ChevronRight size={getResponsiveSize(20, 22, 24)} color="#6B7280" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCategoryModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={categoryModalVisible}
      onRequestClose={closeCategoryModal}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={closeCategoryModal} />
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#FAFAFA']}
            style={styles.modalGradient}
          >
            {selectedCategory && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalCategoryIcon}>{selectedCategory.icon}</Text>
                    <Text style={styles.modalTitle}>{selectedCategory.name}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeCategoryModal}
                  >
                    <X size={getResponsiveSize(20, 22, 24)} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                  <View style={styles.productsGrid}>
                    {selectedCategory.products.map((product) => (
                      <TouchableOpacity
                        key={product.id}
                        style={styles.productCard}
                        onPress={() => openProductModal(product)}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#FFFFFF', '#FAFAFA']}
                          style={styles.productGradient}
                        >
                          <Image source={{ uri: product.image }} style={styles.productImage} />
                          <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={1}>
                              {product.name}
                            </Text>
                            <Text style={styles.productPrice}>{product.price}</Text>
                            <View style={styles.productMeta}>
                              <Text style={styles.productWeight}>{product.weight}</Text>
                              <Text style={styles.productPurity}>{product.purity}</Text>
                            </View>
                          </View>
                          <ChevronRight size={getResponsiveSize(16, 18, 20)} color="#6B7280" />
                        </LinearGradient>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </>
            )}
          </LinearGradient>
        </View>
      </View>
    </Modal>
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
                  <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                  
                  <View style={styles.modalProductInfo}>
                    <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                    <Text style={styles.modalProductPrice}>{selectedProduct.price}</Text>
                    
                    <View style={styles.modalProductSpecs}>
                      <View style={styles.specRow}>
                        <Text style={styles.specLabel}>Weight:</Text>
                        <Text style={styles.specValue}>{selectedProduct.weight}</Text>
                      </View>
                      <View style={styles.specRow}>
                        <Text style={styles.specLabel}>Purity:</Text>
                        <Text style={styles.specValue}>{selectedProduct.purity}</Text>
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

      {/* Categories Grid */}
      <View style={styles.categoriesSection}>
        <View style={styles.categoriesGrid}>
          {jewelleryData[activeToggle].categories.map((category) => 
            renderCategoryCard(category)
          )}
        </View>
      </View>

      {/* Category Modal */}
      {renderCategoryModal()}

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
    marginBottom: getResponsiveSize(20, 24, 28),
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
  categoriesSection: {
    flex: 1,
  },
  categoriesGrid: {
    gap: getResponsiveSize(12, 14, 16),
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveSize(12, 14, 16),
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E8EAF6',
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getResponsiveSize(16, 18, 20),
    gap: getResponsiveSize(16, 18, 20),
  },
  categoryIconContainer: {
    borderRadius: getResponsiveSize(25, 28, 32),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  categoryIconBackground: {
    width: getResponsiveSize(50, 56, 64),
    height: getResponsiveSize(50, 56, 64),
    borderRadius: getResponsiveSize(25, 28, 32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: getResponsiveSize(24, 28, 32),
  },
  categoryInfo: {
    flex: 1,
    gap: getResponsiveSize(4, 5, 6),
  },
  categoryName: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(18),
    color: '#1A237E',
    letterSpacing: 0.5,
  },
  categoryCount: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
  },
  categoryArrow: {
    padding: getResponsiveSize(4, 5, 6),
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
    maxHeight: '85%',
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
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveSize(12, 14, 16),
  },
  modalCategoryIcon: {
    fontSize: getResponsiveSize(24, 26, 28),
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
    paddingHorizontal: getResponsiveSize(20, 22, 24),
  },
  productsGrid: {
    paddingVertical: getResponsiveSize(16, 18, 20),
    gap: getResponsiveSize(12, 14, 16),
  },
  productCard: {
    borderRadius: getResponsiveSize(12, 14, 16),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 0.5,
    borderColor: '#E8EAF6',
  },
  productGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getResponsiveSize(12, 14, 16),
    gap: getResponsiveSize(12, 14, 16),
  },
  productImage: {
    width: getResponsiveSize(70, 80, 90),
    height: getResponsiveSize(70, 80, 90),
    borderRadius: getResponsiveSize(8, 10, 12),
  },
  productInfo: {
    flex: 1,
    gap: getResponsiveSize(4, 5, 6),
  },
  productName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getResponsiveFontSize(16),
    color: '#1A237E',
    letterSpacing: 0.3,
  },
  productPrice: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getResponsiveFontSize(16),
    color: '#D4AF37',
  },
  productMeta: {
    flexDirection: 'row',
    gap: getResponsiveSize(8, 10, 12),
  },
  productWeight: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
  },
  productPurity: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
  },
  modalImage: {
    width: '100%',
    height: getResponsiveSize(200, 220, 240),
    borderRadius: getResponsiveSize(12, 14, 16),
    marginVertical: getResponsiveSize(16, 18, 20),
  },
  modalProductInfo: {
    gap: getResponsiveSize(12, 14, 16),
    paddingBottom: getResponsiveSize(20, 22, 24),
  },
  modalProductName: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(24),
    color: '#1A237E',
    letterSpacing: 0.5,
  },
  modalProductPrice: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getResponsiveFontSize(20),
    color: '#D4AF37',
  },
  modalProductSpecs: {
    backgroundColor: 'rgba(232, 234, 246, 0.3)',
    borderRadius: getResponsiveSize(8, 10, 12),
    padding: getResponsiveSize(12, 14, 16),
    gap: getResponsiveSize(8, 9, 10),
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