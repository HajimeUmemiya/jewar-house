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
 * Validate rate data structure
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
  
  // Sanity check: gold should be more expensive than silver
  if (goldRate <= silverRate) {
    return false;
  }
  
  // Check reasonable ranges (USD per troy ounce)
  if (goldRate < 1000 || goldRate > 5000) {
    return false;
  }
  
  if (silverRate < 10 || silverRate > 100) {
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

module.exports = {
  calculatePurities,
  validateRates,
  calculatePercentageChange,
  formatRate,
  troyOunceToGrams,
  gramsToTroyOunce
};