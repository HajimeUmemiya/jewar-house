import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Calculator as CalcIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import Header from '../../components/Header';
import { subscribeToRates } from '@/services/rateService';

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

export default function CalculatorScreen() {
  const insets = useSafeAreaInsets();
  const [metalType, setMetalType] = useState('gold');
  const [weight, setWeight] = useState('');
  const [purity, setPurity] = useState('24');
  const [makingCharges, setMakingCharges] = useState('3.5');
  const [gst, setGst] = useState('3');
  const [result, setResult] = useState(null);
  const [rates, setRates] = useState({
    gold: {
      '24': 92838,
      '22': 85155,
      '20': 77830,
      '18': 70375,
      '14': 53800,
    },
    silver: {
      '24': 954,
      '22': 905,
      '18': 746,
      '14': 586,
      '9': 388,
    },
  });

  // Subscribe to live rates
  useEffect(() => {
    const unsubscribe = subscribeToRates((newRates) => {
      setRates({
        gold: {
          '24': newRates.gold['24KT'],
          '22': newRates.gold['22KT'],
          '20': newRates.gold['20KT'],
          '18': newRates.gold['18KT'],
          '14': newRates.gold['14KT'],
        },
        silver: {
          '24': newRates.silver['24KT'],
          '22': newRates.silver['22KT'],
          '18': newRates.silver['18KT'],
          '14': newRates.silver['14KT'],
          '9': newRates.silver['9KT'],
        },
      });
    });

    return () => unsubscribe();
  }, []);

  // Auto-recalculate when inputs change
  useEffect(() => {
    if (weight && parseFloat(weight) > 0 && result !== null) {
      handleCalculate();
    }
  }, [weight, purity, makingCharges, gst, metalType, rates]);

  // Reset purity when metal type changes
  useEffect(() => {
    const availablePurities = Object.keys(rates[metalType]);
    if (!availablePurities.includes(purity)) {
      setPurity(availablePurities[0] || '24');
    }
    // Clear result when switching metal types
    setResult(null);
  }, [metalType]);

  const handleCalculate = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const weightValue = parseFloat(weight);
    const makingChargesValue = parseFloat(makingCharges) || 0;
    const gstValue = parseFloat(gst) || 0;
    
    if (isNaN(weightValue) || weightValue <= 0) {
      setResult(null);
      return;
    }
    
    const currentRates = rates[metalType];
    const baseRate = currentRates[purity];
    
    if (!baseRate) {
      setResult(null);
      return;
    }
    
    // Calculate base value (rate is per 10g, so divide by 10 to get per gram)
    const baseValue = (baseRate * weightValue) / 10;
    
    // Calculate making charges
    const makingValue = (baseValue * makingChargesValue) / 100;
    
    // Total before GST
    const totalBeforeGST = baseValue + makingValue;
    
    // Calculate GST
    const gstAmount = (totalBeforeGST * gstValue) / 100;
    
    // Total cost
    const totalCost = totalBeforeGST + gstAmount;
    
    setResult(Math.round(totalCost));
  };

  const handleMetalTypeChange = (type) => {
    setMetalType(type);
    // Reset to first available purity for the selected metal
    const availablePurities = Object.keys(rates[type]);
    setPurity(availablePurities[0] || '24');
  };

  const handlePurityChange = (newPurity) => {
    setPurity(newPurity);
  };

  const getAvailablePurities = () => {
    return Object.keys(rates[metalType]);
  };

  const getCurrentRate = () => {
    return rates[metalType][purity] || 0;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <LinearGradient
            colors={['#1A237E', '#283593', '#3949AB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardHeader}
          >
            <CalcIcon size={getResponsiveSize(20, 22, 24)} color="#D4AF37" />
            <Text style={styles.cardTitle} numberOfLines={isSmallDevice ? 2 : 1}>
              {isSmallDevice ? 'Jewellery Cost Calculator' : 'Jewellery Cost Calculator'}
            </Text>
          </LinearGradient>
          
          <View style={styles.cardContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Metal Type</Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    metalType === 'gold' && styles.toggleButtonActive,
                  ]}
                  onPress={() => handleMetalTypeChange('gold')}
                >
                  <LinearGradient
                    colors={metalType === 'gold' ? ['#D4AF37', '#B8860B'] : ['#F8F9FA', '#FFFFFF']}
                    style={styles.toggleGradient}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        metalType === 'gold' && styles.toggleTextActive,
                      ]}
                    >
                      Gold
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    metalType === 'silver' && styles.toggleButtonActive,
                  ]}
                  onPress={() => handleMetalTypeChange('silver')}
                >
                  <LinearGradient
                    colors={metalType === 'silver' ? ['#f9f6ef', '#e8e3d3'] : ['#F8F9FA', '#FFFFFF']}
                    style={styles.toggleGradient}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        metalType === 'silver' && styles.toggleTextActiveSilver,
                      ]}
                    >
                      Silver
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Weight (grams)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  placeholder="Enter weight in grams"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Purity (KT)</Text>
              <View style={styles.purityContainer}>
                {getAvailablePurities().map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.purityButton,
                      purity === key && styles.purityButtonActive,
                    ]}
                    onPress={() => handlePurityChange(key)}
                  >
                    <LinearGradient
                      colors={purity === key 
                        ? (metalType === 'gold' ? ['#D4AF37', '#B8860B'] : ['#f9f6ef', '#e8e3d3'])
                        : ['#FFFFFF', '#F8F9FA']
                      }
                      style={styles.purityGradient}
                    >
                      <Text
                        style={[
                          styles.purityText,
                          purity === key && (metalType === 'gold' ? styles.purityTextActive : styles.purityTextActiveSilver),
                        ]}
                      >
                        {key}KT
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Making Charges (%)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={makingCharges}
                  onChangeText={setMakingCharges}
                  keyboardType="numeric"
                  placeholder="Enter making charges percentage"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>GST (%)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={gst}
                  onChangeText={setGst}
                  keyboardType="numeric"
                  placeholder="Enter GST percentage"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={handleCalculate}
            >
              <LinearGradient
                colors={['#1A237E', '#283593']}
                style={styles.calculateGradient}
              >
                <Text style={styles.calculateButtonText}>Calculate</Text>
                <ArrowRight size={getResponsiveSize(16, 17, 18)} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
            
            {result !== null && (
              <View style={styles.resultContainer}>
                <LinearGradient
                  colors={['#FFF8E1', '#FFFBF0']}
                  style={styles.resultGradient}
                >
                  <Text style={styles.resultLabel}>Estimated Price:</Text>
                  <Text style={styles.resultValue} numberOfLines={1} adjustsFontSizeToFit>
                    ₹{result.toLocaleString()}
                  </Text>
                  <Text style={styles.liveUpdateText}>
                    Price updates automatically with live rates
                  </Text>
                </LinearGradient>
              </View>
            )}

            <View style={styles.currentRateInfo}>
              <LinearGradient
                colors={['#F8F9FA', '#FFFFFF']}
                style={styles.rateInfoGradient}
              >
                <Text style={styles.currentRateLabel}>
                  Current {metalType === 'gold' ? 'Gold' : 'Silver'} Rate ({purity}KT):
                </Text>
                <Text style={styles.currentRateValue} numberOfLines={1} adjustsFontSizeToFit>
                  ₹{getCurrentRate().toLocaleString()} per 10g
                </Text>
              </LinearGradient>
            </View>
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
    padding: getResponsivePadding(),
  },
  card: {
    backgroundColor: 'white',
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getResponsiveSize(16, 18, 20),
    gap: getResponsiveSize(8, 10, 12),
  },
  cardTitle: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(20),
    color: 'white',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    flex: 1,
  },
  cardContent: {
    padding: getResponsiveSize(16, 18, 20),
    backgroundColor: '#FAFAFA',
  },
  formGroup: {
    marginBottom: getResponsiveSize(16, 18, 20),
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    marginBottom: getResponsiveSize(6, 7, 8),
    letterSpacing: 0.5,
  },
  inputContainer: {
    borderRadius: getResponsiveSize(8, 10, 12),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8EAF6',
    borderRadius: getResponsiveSize(8, 10, 12),
    paddingHorizontal: getResponsiveSize(12, 14, 16),
    paddingVertical: getResponsiveSize(10, 11, 12),
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(16),
    color: '#1A237E',
    backgroundColor: '#FFFFFF',
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: getResponsiveSize(8, 10, 12),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toggleButton: {
    flex: 1,
  },
  toggleGradient: {
    paddingVertical: getResponsiveSize(10, 11, 12),
    alignItems: 'center',
  },
  toggleButtonActive: {},
  toggleText: {
    fontFamily: 'Poppins-Regular',
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  toggleTextActive: {
    color: 'white',
  },
  toggleTextActiveSilver: {
    color: '#8B7355',
  },
  purityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getResponsiveSize(6, 7, 8),
  },
  purityButton: {
    borderRadius: getResponsiveSize(6, 7, 8),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: getResponsiveSize(50, 55, 60),
  },
  purityGradient: {
    paddingVertical: getResponsiveSize(8, 9, 10),
    paddingHorizontal: getResponsiveSize(12, 14, 16),
    borderWidth: 1,
    borderColor: '#E8EAF6',
    alignItems: 'center',
  },
  purityButtonActive: {},
  purityText: {
    fontFamily: 'Poppins-Regular',
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  purityTextActive: {
    color: 'white',
  },
  purityTextActiveSilver: {
    color: '#8B7355',
  },
  calculateButton: {
    borderRadius: getResponsiveSize(8, 10, 12),
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: getResponsiveSize(6, 7, 8),
  },
  calculateGradient: {
    paddingVertical: getResponsiveSize(12, 14, 16),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: getResponsiveSize(6, 7, 8),
  },
  calculateButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: getResponsiveFontSize(16),
    color: 'white',
    letterSpacing: 0.5,
  },
  resultContainer: {
    marginTop: getResponsiveSize(20, 22, 24),
    borderRadius: getResponsiveSize(8, 10, 12),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  resultGradient: {
    padding: getResponsiveSize(16, 18, 20),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  resultLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    marginBottom: getResponsiveSize(6, 7, 8),
    letterSpacing: 0.5,
  },
  resultValue: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(32),
    color: '#1A237E',
    marginBottom: getResponsiveSize(6, 7, 8),
  },
  liveUpdateText: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(12),
    color: '#059669',
    textAlign: 'center',
  },
  currentRateInfo: {
    marginTop: getResponsiveSize(16, 18, 20),
    borderRadius: getResponsiveSize(8, 10, 12),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rateInfoGradient: {
    padding: getResponsiveSize(12, 14, 16),
    borderWidth: 1,
    borderColor: '#E8EAF6',
  },
  currentRateLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  currentRateValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: getResponsiveFontSize(14),
    color: '#1A237E',
  },
});