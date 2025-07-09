// Currency conversion rates
export const USD_TO_NPR_RATE = 133;

// Currency formatting helper
export const formatNPR = (priceInUSD: number): string => {
  return `Rs. ${(priceInUSD * USD_TO_NPR_RATE).toFixed(0)}`;
};