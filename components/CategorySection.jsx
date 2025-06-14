import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

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

// Jewellery data organized by type
const jewelleryData = {
  gold: {
    title: 'GOLD JEWELLERY',
    color: '#D4AF37',
    categories: [
      {
        id: 'gold-jewellery',
        title: 'GOLD JEWELLERY',
        route: '/categories/gold-jewellery',
        subcategories: [
          {
            id: 'necklace-sets',
            name: 'NECKLACE SETS',
            image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
          },
          {
            id: 'long-sets',
            name: 'LONG SETS',
            image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
          },
        ],
      },
      {
        id: 'gold-chains',
        title: 'GOLD CHAINS',
        route: '/categories/gold-chains',
        subcategories: [
          {
            id: 'handmade-chains',
            name: 'HANDMADE CHAINS',
            image: 'https://images.pexels.com/photos/989967/pexels-photo-989967.jpeg',
          },
          {
            id: 'super-deluxe-chains',
            name: 'SUPER DELUXE CHAINS',
            image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
          },
        ],
      },
      {
        id: 'gold-bangles',
        title: 'GOLD BANGLES AND BRACELETS',
        route: '/categories/gold-bangles',
        subcategories: [
          {
            id: 'bangles-sets',
            name: 'BANGLES SETS',
            image: 'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg',
          },
        ],
      },
      {
        id: 'gold-rings',
        title: 'GOLD RINGS',
        route: '/categories/gold-rings',
        subcategories: [
          {
            id: 'rings',
            name: 'RINGS',
            image: 'https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg',
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
        id: 'silver-jewellery',
        title: 'SILVER JEWELLERY',
        route: '/categories/silver-jewellery',
        subcategories: [
          {
            id: 'silver-necklaces',
            name: 'SILVER NECKLACES',
            image: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg',
          },
          {
            id: 'silver-earrings',
            name: 'SILVER EARRINGS',
            image: 'https://images.pexels.com/photos/10894828/pexels-photo-10894828.jpeg',
          },
        ],
      },
      {
        id: 'silver-bangles',
        title: 'SILVER BANGLES',
        route: '/categories/silver-bangles',
        subcategories: [
          {
            id: 'silver-kada',
            name: 'SILVER KADA',
            image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
          },
          {
            id: 'silver-bracelets',
            name: 'SILVER BRACELETS',
            image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
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
        id: 'diamond-jewellery',
        title: 'DIAMOND JEWELLERY',
        route: '/categories/diamond-jewellery',
        subcategories: [
          {
            id: 'diamond-necklaces',
            name: 'DIAMOND NECKLACES',
            image: 'https://images.pexels.com/photos/989967/pexels-photo-989967.jpeg',
          },
          {
            id: 'diamond-earrings',
            name: 'DIAMOND EARRINGS',
            image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
          },
        ],
      },
      {
        id: 'diamond-rings',
        title: 'DIAMOND RINGS',
        route: '/categories/diamond-rings',
        subcategories: [
          {
            id: 'engagement-rings',
            name: 'ENGAGEMENT RINGS',
            image: 'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg',
          },
          {
            id: 'wedding-bands',
            name: 'WEDDING BANDS',
            image: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg',
          },
        ],
      },
    ],
  },
};

// New Arrival category (separate from toggle system)
const newArrivalCategory = {
  id: 'new-arrival',
  title: 'NEW ARRIVAL',
  route: '/categories/new-arrival',
  subcategories: [
    {
      id: 'nawabi',
      name: 'NAWABI',
      image: 'https://images.pexels.com/photos/10894828/pexels-photo-10894828.jpeg',
      designNo: 'NC1',
      grossWt: '25',
    },
    {
      id: 'long-set',
      name: 'LONG SET',
      image: 'https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg',
      designNo: 'LS-4',
      grossWt: '150',
    },
  ],
};

export default function CategorySection() {
  const [activeToggle, setActiveToggle] = useState('gold');

  const handleCategoryPress = (category) => {
    router.push({
      pathname: category.route,
      params: { categoryId: category.id, title: category.title }
    });
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

  const renderCategorySection = (category, index) => (
    <View key={category.id} style={[
      styles.categoryContainer,
      index > 0 && styles.categoryContainerWithMargin
    ]}>
      <View style={styles.categoryHeader}>
        <LinearGradient
          colors={['#1A237E', '#283593']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.categoryHeaderGradient}
        >
          <View style={styles.categoryHeaderContent}>
            <View style={styles.categoryTitleContainer}>
              <View style={styles.categoryAccent} />
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <View style={styles.categoryAccent} />
            </View>
            <View style={styles.navigationArrows}>
              <TouchableOpacity style={styles.arrowButton}>
                <ChevronLeft size={getResponsiveSize(18, 20, 22)} color="#D4AF37" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.arrowButton}>
                <ChevronRight size={getResponsiveSize(18, 20, 22)} color="#D4AF37" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.subcategoriesContainer}>
        {category.subcategories.map((subcategory, subIndex) => (
          <TouchableOpacity
            key={subcategory.id}
            style={[
              styles.subcategoryCard,
              subIndex === category.subcategories.length - 1 && styles.lastSubcategoryCard
            ]}
            onPress={() => handleCategoryPress(category)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFFFFF', '#FAFAFA']}
              style={styles.subcategoryGradient}
            >
              <Image source={{ uri: subcategory.image }} style={styles.subcategoryImage} />
              <View style={styles.subcategoryInfo}>
                <Text style={styles.subcategoryName}>{subcategory.name}</Text>
                {subcategory.designNo && (
                  <Text style={styles.designInfo}>Design No: {subcategory.designNo}</Text>
                )}
                {subcategory.grossWt && (
                  <Text style={styles.designInfo}>Gross Wt: {subcategory.grossWt}</Text>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderNewArrivalSection = () => (
    <View style={[styles.categoryContainer, styles.categoryContainerWithMargin]}>
      <View style={styles.categoryHeader}>
        <LinearGradient
          colors={['#1A237E', '#283593']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.categoryHeaderGradient}
        >
          <View style={styles.categoryHeaderContent}>
            <View style={styles.categoryTitleContainer}>
              <View style={styles.categoryAccent} />
              <Text style={styles.categoryTitle}>{newArrivalCategory.title}</Text>
              <View style={styles.categoryAccent} />
            </View>
            <View style={styles.navigationArrows}>
              <TouchableOpacity style={styles.arrowButton}>
                <ChevronLeft size={getResponsiveSize(18, 20, 22)} color="#D4AF37" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.arrowButton}>
                <ChevronRight size={getResponsiveSize(18, 20, 22)} color="#D4AF37" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.subcategoriesContainer}>
        {newArrivalCategory.subcategories.map((subcategory, subIndex) => (
          <TouchableOpacity
            key={subcategory.id}
            style={[
              styles.subcategoryCard,
              subIndex === newArrivalCategory.subcategories.length - 1 && styles.lastSubcategoryCard
            ]}
            onPress={() => handleCategoryPress(newArrivalCategory)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFFFFF', '#FAFAFA']}
              style={styles.subcategoryGradient}
            >
              <Image source={{ uri: subcategory.image }} style={styles.subcategoryImage} />
              <View style={styles.subcategoryInfo}>
                <Text style={styles.subcategoryName}>{subcategory.name}</Text>
                {subcategory.designNo && (
                  <Text style={styles.designInfo}>Design No: {subcategory.designNo}</Text>
                )}
                {subcategory.grossWt && (
                  <Text style={styles.designInfo}>Gross Wt: {subcategory.grossWt}</Text>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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

      {/* Active Categories */}
      <View style={styles.categoriesSection}>
        {jewelleryData[activeToggle].categories.map((category, index) => 
          renderCategorySection(category, index)
        )}
      </View>

      {/* New Arrival Section (Always Visible) */}
      {renderNewArrivalSection()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10, // Added 10px bottom margin
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
  categoryContainer: {
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
  categoryContainerWithMargin: {
    marginTop: getResponsiveSize(24, 28, 32),
  },
  categoryHeader: {
    overflow: 'hidden',
  },
  categoryHeaderGradient: {
    paddingVertical: getResponsiveSize(12, 14, 16),
    paddingHorizontal: getResponsiveSize(16, 18, 20),
  },
  categoryHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveSize(8, 10, 12),
    flex: 1,
  },
  categoryAccent: {
    width: getResponsiveSize(20, 24, 28),
    height: 2,
    backgroundColor: '#D4AF37',
    borderRadius: 1,
  },
  categoryTitle: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(16),
    color: '#FFFFFF',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    flex: 1,
  },
  navigationArrows: {
    flexDirection: 'row',
    gap: getResponsiveSize(4, 5, 6),
  },
  arrowButton: {
    padding: getResponsiveSize(4, 5, 6),
    borderRadius: getResponsiveSize(12, 14, 16),
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  subcategoriesContainer: {
    padding: getResponsiveSize(12, 14, 16),
    backgroundColor: '#FAFAFA',
    gap: getResponsiveSize(8, 10, 12),
  },
  subcategoryCard: {
    borderRadius: getResponsiveSize(10, 12, 14),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 0.5,
    borderColor: '#E8EAF6',
    backgroundColor: '#FFFFFF',
  },
  lastSubcategoryCard: {
    marginBottom: 0,
  },
  subcategoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getResponsiveSize(12, 14, 16),
    minHeight: getResponsiveSize(100, 110, 120),
  },
  subcategoryImage: {
    width: getResponsiveSize(70, 80, 90),
    height: getResponsiveSize(70, 80, 90),
    borderRadius: getResponsiveSize(8, 10, 12),
    marginRight: getResponsiveSize(12, 14, 16),
  },
  subcategoryInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  subcategoryName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getResponsiveFontSize(16),
    color: '#1A237E',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  designInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
    marginBottom: 2,
  },
});