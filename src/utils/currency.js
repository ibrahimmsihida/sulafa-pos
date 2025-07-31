// Currency utility for SULAFA POS System
export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  SAR: { symbol: 'ر.س', name: 'Saudi Riyal', code: 'SAR' },
  AED: { symbol: 'د.إ', name: 'UAE Dirham', code: 'AED' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'JPY' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', code: 'AUD' }
};

// Get currency based on user's location or preference
export const getCurrencyByRegion = (region = 'US') => {
  const regionCurrencyMap = {
    'US': 'USD',
    'EU': 'EUR', 
    'SA': 'SAR',
    'AE': 'AED',
    'GB': 'GBP',
    'JP': 'JPY',
    'CA': 'CAD',
    'AU': 'AUD'
  };
  
  return regionCurrencyMap[region] || 'USD';
};

// Format price with currency
export const formatPrice = (amount, currencyCode = 'USD') => {
  const currency = CURRENCIES[currencyCode];
  if (!currency) return `${amount}`;
  
  // Use English number formatting
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
  
  return `${currency.symbol}${formattedAmount}`;
};

// Convert Arabic numerals to English numerals
export const convertToEnglishNumbers = (str) => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  let result = str;
  arabicNumbers.forEach((arabic, index) => {
    result = result.replace(new RegExp(arabic, 'g'), englishNumbers[index]);
  });
  
  return result;
};

// Format date with English numbers
export const formatDateEnglish = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US');
};