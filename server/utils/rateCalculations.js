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

module.exports = {
  calculatePurities
};