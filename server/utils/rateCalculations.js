/**
 * Calculate different purity rates from base 24KT rate
 */
function calculatePurities(base24kt, metalType = 'gold') {
  const purities = {
    gold: {
      '24KT': base24kt,
      '22KT': Math.round(base24kt * (22/24)),
      '20KT': Math.round(base24kt * (20/24)),
      '18KT': Math.round(base24kt * (18/24)),
      '14KT': Math.round(base24kt * (14/24))
    },
    silver: {
      '24KT': base24kt,
      '22KT': Math.round(base24kt * (22/24)),
      '18KT': Math.round(base24kt * (18/24)),
      '14KT': Math.round(base24kt * (14/24)),
      '9KT': Math.round(base24kt * (9/24))
    }
  };
  
  return purities[metalType] || purities.gold;
}

/**
 * Validate rate data structure with more lenient checks
 */
function validateRates(rates) {
  if (!rates || typeof rates !== 'object') {
    return false;
  }
  
  // Check for required fields
  if (!rates.gold || !rates.silver) {
    return false;
  }
  
  // Check if rates are reasonable numbers
  const goldRate = parseFloat(rates.gold);
  const silverRate = parseFloat(rates.silver);
  
  if (isNaN(goldRate) || isNaN(silverRate)) {
    return false;
  }
  
  // More lenient sanity checks
  if (goldRate <= 0 || silverRate <= 0) {
    return false;
  }
  
  // Sanity check: gold should be more expensive than silver (but allow some flexibility)
  if (goldRate <= silverRate * 0.8) {
    return false;
  }
  
  // More reasonable ranges (USD per troy ounce) - updated for 2024/2025
  if (goldRate < 800 || goldRate > 8000) {
    return false;
  }
  
  if (silverRate < 5 || silverRate > 200) {
    return false;
  }
  
  return true;
}

/**
 * Calculate percentage change between two rates
 */
function calculatePercentageChange(oldRate, newRate) {
  if (!oldRate || !newRate || oldRate === 0) {
    return 0;
  }
  
  return ((newRate - oldRate) / oldRate) * 100;
}

/**
 * Format rate for display
 */
function formatRate(rate, currency = 'INR') {
  if (!rate || isNaN(rate)) {
    return 'N/A';
  }
  
  const formatted = Math.round(rate).toLocaleString('en-IN');
  
  switch (currency) {
    case 'INR':
      return `₹${formatted}`;
    case 'USD':
      return `$${formatted}`;
    default:
      return formatted;
  }
}

/**
 * Convert troy ounce to grams
 */
function troyOunceToGrams(troyOunces) {
  return troyOunces * 31.1035;
}

/**
 * Convert grams to troy ounce
 */
function gramsToTroyOunce(grams) {
  return grams / 31.1035;
}

/**
 * Validate exchange rate
 */
function validateExchangeRate(rate) {
  const exchangeRate = parseFloat(rate);
  
  if (isNaN(exchangeRate) || exchangeRate <= 0) {
    return false;
  }
  
  // USD to INR should be between 70-100 (reasonable range)
  if (exchangeRate < 70 || exchangeRate > 100) {
    return false;
  }
  
  return true;
}

module.exports = {
  calculatePurities,
  validateRates,
  calculatePercentageChange,
  formatRate,
  troyOunceToGrams,
  gramsToTroyOunce,
  validateExchangeRate
};