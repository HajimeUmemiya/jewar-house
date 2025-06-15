import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Calculator as CalcIcon, ChevronDown } from 'lucide-react-native';
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

// Dropdown options
const diamondWeightOptions = [
  { label: '₹35,000', value: 35000 },
  { label: '₹45,000', value: 45000 },
  { label: '₹55,000', value: 55000 },
];

const solitaireWeightOptions = [
  { label: '₹80,000', value: 80000 },
  { label: '₹1.25 L', value: 125000 },
  { label: '₹1.0 L', value: 100000 },
  { label: '₹1.5 L', value: 150000 },
  { label: '₹2.0 L', value: 200000 },
];

export default function CalculatorScreen() {
  const insets = useSafeAreaInsets();
  const [metalType, setMetalType] = useState('gold');
  const [weight, setWeight] = useState('');
  const [purity, setPurity] = useState('22');
  const [makingCharges, setMakingCharges] = useState('3.5');
  const [gst, setGst] = useState('3');
  const [result, setResult] = useState(null);
  
  // Diamond specific states
  const [diamondWeight, setDiamondWeight] = useState('');
  const [diamondWeightPrice, setDiamondWeightPrice] = useState(35000);
  const [solitaireWeight, setSolitaireWeight] = useState('');
  const [solitaireWeightPrice, setSolitaireWeightPrice] = useState(80000);
  const [colorStoneWeight, setColorStoneWeight] = useState('');
  
  // Dropdown states - using modal approach
  const [showDiamondDropdown, setShowDiamondDropdown] = useState(false);
  const [showSolitaireDropdown, setShowSolitaireDropdown] = useState(false);
  
  const [rates, setRates] = useState({
    gold: {
      '22': 85155,
      '18': 70375,
    },
    silver: {
      // No purity for silver - just base rate
      base: 954,
    },
    diamond: {
      '18': 70375,
      '14': 53800,
    },
  });

  // Subscribe to live rates
  useEffect(() => {
    const unsubscribe = subscribeToRates((newRates) => {
      setRates({
        gold: {
          '22': newRates.gold['22KT'],
          '18': newRates.gold['18KT'],
        },
        silver: {
          base: newRates.silver['24KT'], // Use 24KT rate as base for silver
        },
        diamond: {
          '18': newRates.gold['18KT'],
          '14': newRates.gold['14KT'],
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
  }, [weight, purity, makingCharges, gst, metalType, rates, diamondWeight, diamondWeightPrice, solitaireWeight, solitaireWeightPrice, colorStoneWeight]);

  // Reset purity when metal type changes
  useEffect(() => {
    if (metalType === 'gold') {
      setPurity('22');
    } else if (metalType === 'silver') {
      setPurity(''); // No purity for silver
    } else if (metalType === 'diamond') {
      setPurity('18');
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
    
    let totalCost = 0;
    
    if (metalType === 'diamond') {
      // Diamond calculation logic
      const diamondWeightValue = parseFloat(diamondWeight) || 0;
      const solitaireWeightValue = parseFloat(solitaireWeight) || 0;
      const colorStoneWeightValue = parseFloat(colorStoneWeight) || 0;
      
      // Base gold calculation
      const currentRates = rates[metalType];
      const baseRate = currentRates[purity];
      const baseValue = (baseRate * weightValue) / 10;
      
      // Making charges based on gold 22KT price (since we removed 24KT)
      const gold22Rate = rates.gold['22'];
      const makingValue = (makingChargesValue / 100) * gold22Rate;
      
      // Diamond weight calculation
      const diamondValue = diamondWeightValue * diamondWeightPrice;
      
      // Solitaire weight calculation
      const solitaireValue = solitaireWeightValue * solitaireWeightPrice;
      
      // Color stone calculation
      const colorStoneValue = colorStoneWeightValue * 700;
      
      // Total before GST
      const totalBeforeGST = baseValue + makingValue + diamondValue + solitaireValue + colorStoneValue;
      
      // Calculate GST
      const gstAmount = (totalBeforeGST * gstValue) / 100;
      
      // Total cost
      totalCost = totalBeforeGST + gstAmount;
    } else if (metalType === 'silver') {
      // Silver calculation - no purity, just base rate
      const baseRate = rates.silver.base;
      
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
      totalCost = totalBeforeGST + gstAmount;
    } else {
      // Gold calculation
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
      totalCost = totalBeforeGST + gstAmount;
    }
    
    setResult(Math.round(totalCost));
  };

  const handleMetalTypeChange = (type) => {
    setMetalType(type);
    // Reset purity based on metal type
    if (type === 'gold') {
      setPurity('22');
    } else if (type === 'silver') {
      setPurity(''); // No purity for silver
    } else if (type === 'diamond') {
      setPurity('18');
    }
  };

  const handlePurityChange = (newPurity) => {
    setPurity(newPurity);
  };

  const getAvailablePurities = () => {
    if (metalType === 'silver') {
      return []; // No purity options for silver
    }
    return Object.keys(rates[metalType]);
  };

  const getCurrentRate = () => {
    if (metalType === 'silver') {
      return rates.silver.base || 0;
    }
    return rates[metalType][purity] || 0;
  };

  // Modal-based dropdown component
  const renderModalDropdown = (options, selectedValue, onSelect, isVisible, setVisible, title) => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setVisible(false)}
    >
      <Pressable 
        style={styles.modalOverlay} 
        onPress={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#FAFAFA']}
            style={styles.modalGradient}
          >
            <Text style={styles.modalTitle}>{title}</Text>
            <View style={styles.modalOptionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalOption,
                    selectedValue === option.value && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    onSelect(option.value);
                    setVisible(false);
                  }}
                >
                  <LinearGradient
                    colors={selectedValue === option.value 
                      ? ['#E8E3D3', '#D4D0C4'] 
                      : ['#FFFFFF', '#FAFAFA']
                    }
                    style={styles.modalOptionGradient}
                  >
                    <Text style={[
                      styles.modalOptionText,
                      selectedValue === option.value && styles.modalOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>
      </Pressable>
    </Modal>
  );

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
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    metalType === 'diamond' && styles.toggleButtonActive,
                  ]}
                  onPress={() => handleMetalTypeChange('diamond')}
                >
                  <LinearGradient
                    colors={metalType === 'diamond' ? ['#E8E3D3', '#D4D0C4'] : ['#F8F9FA', '#FFFFFF']}
                    style={styles.toggleGradient}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        metalType === 'diamond' && styles.toggleTextActiveDiamond,
                      ]}
                    >
                      Diamond
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
            
            {/* Only show purity for gold and diamond, not for silver */}
            {metalType !== 'silver' && (
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
                          ? (metalType === 'gold' ? ['#D4AF37', '#B8860B'] : 
                             ['#E8E3D3', '#D4D0C4'])
                          : ['#FFFFFF', '#F8F9FA']
                        }
                        style={styles.purityGradient}
                      >
                        <Text
                          style={[
                            styles.purityText,
                            purity === key && (metalType === 'gold' ? styles.purityTextActive : 
                                             styles.purityTextActiveDiamond),
                          ]}
                        >
                          {key}KT
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Diamond specific fields */}
            {metalType === 'diamond' && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Diamond Wt. (grams)</Text>
                  <View style={styles.inputWithDropdownContainer}>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputWithDropdown}
                        value={diamondWeight}
                        onChangeText={setDiamondWeight}
                        keyboardType="numeric"
                        placeholder="Enter diamond weight"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.dropdownButton}
                      onPress={() => setShowDiamondDropdown(true)}
                    >
                      <Text style={styles.dropdownButtonText}>
                        {diamondWeightOptions.find(opt => opt.value === diamondWeightPrice)?.label || 'Select'}
                      </Text>
                      <ChevronDown size={getResponsiveSize(16, 17, 18)} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Solitaire Wt. (grams)</Text>
                  <View style={styles.inputWithDropdownContainer}>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputWithDropdown}
                        value={solitaireWeight}
                        onChangeText={setSolitaireWeight}
                        keyboardType="numeric"
                        placeholder="Enter solitaire weight"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.dropdownButton}
                      onPress={() => setShowSolitaireDropdown(true)}
                    >
                      <Text style={styles.dropdownButtonText}>
                        {solitaireWeightOptions.find(opt => opt.value === solitaireWeightPrice)?.label || 'Select'}
                      </Text>
                      <ChevronDown size={getResponsiveSize(16, 17, 18)} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Color Stone Wt. (grams)</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={colorStoneWeight}
                      onChangeText={setColorStoneWeight}
                      keyboardType="numeric"
                      placeholder="Enter color stone weight"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </>
            )}
            
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
                  <Text style={styles.resultLabel}>
                    {metalType === 'diamond' ? 'Estimated Price (Inclusive GST):' : 'Estimated Price:'}
                  </Text>
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
                  Current {metalType === 'gold' ? 'Gold' : metalType === 'silver' ? 'Silver' : 'Diamond'} Rate{metalType !== 'silver' ? ` (${purity}KT)` : ''}:
                </Text>
                <Text style={styles.currentRateValue} numberOfLines={1} adjustsFontSizeToFit>
                  ₹{getCurrentRate().toLocaleString()} per 10g
                </Text>
              </LinearGradient>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal Dropdowns */}
      {renderModalDropdown(
        diamondWeightOptions,
        diamondWeightPrice,
        setDiamondWeightPrice,
        showDiamondDropdown,
        setShowDiamondDropdown,
        'Select Diamond Weight Price'
      )}

      {renderModalDropdown(
        solitaireWeightOptions,
        solitaireWeightPrice,
        setSolitaireWeightPrice,
        showSolitaireDropdown,
        setShowSolitaireDropdown,
        'Select Solitaire Weight Price'
      )}
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
    flex: 1,
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
  inputWithDropdownContainer: {
    flexDirection: 'row',
    gap: getResponsiveSize(8, 10, 12),
    alignItems: 'flex-start',
  },
  inputWithDropdown: {
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
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E8EAF6',
    borderRadius: getResponsiveSize(8, 10, 12),
    paddingHorizontal: getResponsiveSize(12, 14, 16),
    paddingVertical: getResponsiveSize(10, 11, 12),
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: getResponsiveSize(100, 110, 120),
  },
  dropdownButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: getResponsiveFontSize(14),
    color: '#1A237E',
    marginRight: getResponsiveSize(4, 5, 6),
  },
  // Modal Dropdown Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxWidth: 300,
    borderRadius: getResponsiveSize(12, 14, 16),
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalGradient: {
    padding: getResponsiveSize(20, 22, 24),
  },
  modalTitle: {
    fontFamily: 'CrimsonPro-SemiBold',
    fontSize: getResponsiveFontSize(18),
    color: '#1A237E',
    textAlign: 'center',
    marginBottom: getResponsiveSize(16, 18, 20),
    letterSpacing: 0.5,
  },
  modalOptionsContainer: {
    gap: getResponsiveSize(8, 10, 12),
  },
  modalOption: {
    borderRadius: getResponsiveSize(8, 10, 12),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modalOptionSelected: {
    elevation: 4,
    shadowOpacity: 0.2,
  },
  modalOptionGradient: {
    paddingVertical: getResponsiveSize(12, 14, 16),
    paddingHorizontal: getResponsiveSize(16, 18, 20),
    borderWidth: 1,
    borderColor: '#E8EAF6',
  },
  modalOptionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: getResponsiveFontSize(16),
    color: '#6B7280',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  modalOptionTextSelected: {
    color: '#8B7355',
    fontFamily: 'Poppins-SemiBold',
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
  toggleTextActiveSilver: {
    color: '#8B7355',
  },
  toggleTextActiveDiamond: {
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
  purityTextActiveDiamond: {
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
    textAlign: 'center',
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