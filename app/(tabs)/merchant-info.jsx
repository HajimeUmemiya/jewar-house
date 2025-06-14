import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Phone, Clock, Mail, MessageCircle, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '@/components/Header';

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
const getResponsiveMargin = () => getResponsiveSize(12, 16, 20, 24);
const getResponsiveFontSize = (baseSize) => getResponsiveSize(baseSize - 2, baseSize - 1, baseSize, baseSize + 2);

export default function MerchantInfoScreen() {
  const insets = useSafeAreaInsets();

  const handleCall = async () => {
    const phoneNumber = 'tel:+911234567890';
    const canOpen = await Linking.canOpenURL(phoneNumber);
    
    if (canOpen) {
      await Linking.openURL(phoneNumber);
    }
  };

  const handleEmail = async () => {
    const email = 'mailto:info@jewarhouse.com';
    const canOpen = await Linking.canOpenURL(email);
    
    if (canOpen) {
      await Linking.openURL(email);
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

  const handleLocation = async () => {
    const url = 'https://maps.app.goo.gl/LDYyCGQ3cAxQZheM7?g_st=aw';
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <LinearGradient
            colors={['#1A237E', '#283593', '#3949AB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.ornamentTop} />
            <Text style={styles.mainHeading}>
              {isSmallDevice ? 'MERCHANT INFO' : 'MERCHANT INFORMATION'}
            </Text>
            <Text style={styles.subHeading}>Your Trusted Jewellery Partner</Text>
            <View style={styles.ornamentBottom} />
          </LinearGradient>
        </View>

        <View style={styles.contentContainer}>
          {/* Store Information */}
          <View style={styles.infoCard}>
            <LinearGradient
              colors={['#FFFFFF', '#FAFAFA']}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={styles.headerAccent} />
                <Text style={styles.cardTitle}>Store Information</Text>
                <View style={styles.headerAccent} />
              </View>
              
              <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={['#D4AF37', '#B8860B']}
                    style={styles.iconGradient}
                  >
                    <MapPin size={getResponsiveSize(16, 18, 20)} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoText}>
                    123 Gold Street, Jewellery Market{'\n'}
                    Mumbai, Maharashtra 400001{'\n'}
                    India
                  </Text>
                  <TouchableOpacity style={styles.actionLink} onPress={handleLocation}>
                    <Text style={styles.actionText}>View on Map</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={['#D4AF37', '#B8860B']}
                    style={styles.iconGradient}
                  >
                    <Clock size={getResponsiveSize(16, 18, 20)} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Business Hours</Text>
                  <Text style={styles.infoText}>
                    Monday - Saturday: 10:00 AM - 8:00 PM{'\n'}
                    Sunday: 11:00 AM - 6:00 PM{'\n'}
                    Closed on Public Holidays
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={['#D4AF37', '#B8860B']}
                    style={styles.iconGradient}
                  >
                    <Star size={getResponsiveSize(16, 18, 20)} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Established</Text>
                  <Text style={styles.infoText}>
                    Since 1985 - Over 35 years of excellence{'\n'}
                    Certified Hallmark Gold & Silver Dealer{'\n'}
                    BIS Certified | Government Approved
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Contact Information */}
          <View style={styles.infoCard}>
            <LinearGradient
              colors={['#FFFFFF', '#FAFAFA']}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={styles.headerAccent} />
                <Text style={styles.cardTitle}>Contact Us</Text>
                <View style={styles.headerAccent} />
              </View>

              <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
                <LinearGradient
                  colors={['#1A237E', '#283593']}
                  style={styles.contactGradient}
                >
                  <Phone size={getResponsiveSize(16, 18, 20)} color="#FFFFFF" />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Phone</Text>
                    <Text style={styles.contactText}>+91 12345 67890</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
                <LinearGradient
                  colors={['#6B7280', '#4B5563']}
                  style={styles.contactGradient}
                >
                  <Mail size={getResponsiveSize(16, 18, 20)} color="#FFFFFF" />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactText} numberOfLines={1} adjustsFontSizeToFit>
                      info@jewarhouse.com
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactButton} onPress={handleWhatsApp}>
                <LinearGradient
                  colors={['#25D366', '#128C7E']}
                  style={styles.contactGradient}
                >
                  <MessageCircle size={getResponsiveSize(16, 18, 20)} color="#FFFFFF" />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>WhatsApp</Text>
                    <Text style={styles.contactText}>Chat with us instantly</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Services */}
          <View style={styles.infoCard}>
            <LinearGradient
              colors={['#FFFFFF', '#FAFAFA']}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={styles.headerAccent} />
                <Text style={styles.cardTitle}>Our Services</Text>
                <View style={styles.headerAccent} />
              </View>

              <View style={styles.servicesList}>
                <Text style={styles.serviceItem}>• Custom Jewellery Design</Text>
                <Text style={styles.serviceItem}>• Gold & Silver Exchange</Text>
                <Text style={styles.serviceItem}>• Jewellery Repair & Maintenance</Text>
                <Text style={styles.serviceItem}>• Certificate of Authenticity</Text>
                <Text style={styles.serviceItem}>• Free Cleaning & Polishing</Text>
                <Text style={styles.serviceItem}>• Home Delivery Available</Text>
                <Text style={styles.serviceItem}>• Buyback Guarantee</Text>
                <Text style={styles.serviceItem}>• Insurance Assistance</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Certifications */}
          <View style={styles.infoCard}>
            <LinearGradient
              colors={['#FFF8E1', '#FFFBF0']}
              style={styles.cardGradient}
            >
              <View style={styles.certificationBorder}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerAccent} />
                  <Text style={styles.cardTitle}>Certifications & Awards</Text>
                  <View style={styles.headerAccent} />
                </View>

                <View style={styles.certificationsList}>
                  <Text style={styles.certificationItem}>🏆 BIS Hallmark Certified Dealer</Text>
                  <Text style={styles.certificationItem}>🏆 Government Approved Gold Dealer</Text>
                  <Text style={styles.certificationItem}>🏆 ISO 9001:2015 Certified</Text>
                  <Text style={styles.certificationItem}>🏆 Best Jeweller Award 2023</Text>
                  <Text style={styles.certificationItem}>🏆 Customer Choice Award</Text>
                </View>
              </View>
            </LinearGradient>
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
  },
  subHeading: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(14),
    color: '#E8EAF6',
    textAlign: 'center',
    marginTop: getResponsiveSize(6, 7, 8),
  },
  contentContainer: {
    paddingHorizontal: getResponsivePadding(),
    marginTop: getResponsiveMargin(),
    gap: getResponsiveSize(16, 18, 20),
  },
  infoCard: {
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
  cardGradient: {
    padding: getResponsiveSize(16, 18, 20),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getResponsiveSize(16, 18, 20),
    gap: getResponsiveSize(8, 10, 12),
  },
  headerAccent: {
    width: getResponsiveSize(18, 20, 24),
    height: 2,
    backgroundColor: '#6B7280',
    borderRadius: 1,
  },
  cardTitle: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(18),
    color: '#1A237E',
    letterSpacing: 0.8,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: getResponsiveSize(16, 18, 20),
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: getResponsiveSize(12, 14, 16),
    marginTop: 2,
  },
  iconGradient: {
    width: getResponsiveSize(32, 36, 40),
    height: getResponsiveSize(32, 36, 40),
    borderRadius: getResponsiveSize(16, 18, 20),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: getResponsiveFontSize(16),
    color: '#1A237E',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    lineHeight: getResponsiveFontSize(20),
  },
  actionLink: {
    marginTop: getResponsiveSize(6, 7, 8),
  },
  actionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: getResponsiveFontSize(14),
    color: '#D4AF37',
    textDecorationLine: 'underline',
  },
  contactButton: {
    borderRadius: getResponsiveSize(8, 10, 12),
    overflow: 'hidden',
    marginBottom: getResponsiveSize(10, 11, 12),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  contactGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getResponsiveSize(12, 14, 16),
    gap: getResponsiveSize(12, 14, 16),
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: getResponsiveFontSize(14),
    color: '#FFFFFF',
    marginBottom: 2,
  },
  contactText: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(14),
    color: '#E8EAF6',
  },
  servicesList: {
    gap: getResponsiveSize(10, 11, 12),
  },
  serviceItem: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    lineHeight: getResponsiveFontSize(20),
  },
  certificationBorder: {
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: getResponsiveSize(10, 12, 14),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: getResponsiveSize(16, 18, 20),
    margin: getResponsiveSize(-16, -18, -20),
  },
  certificationsList: {
    gap: getResponsiveSize(10, 11, 12),
  },
  certificationItem: {
    fontFamily: 'Poppins-Regular',
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    lineHeight: getResponsiveFontSize(20),
  },
});