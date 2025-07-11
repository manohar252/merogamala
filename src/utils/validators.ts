// Input sanitization helper
export const sanitizeInput = (input: string, maxLength?: number): string => {
  if (typeof input !== 'string') return '';
  
  let sanitized = input
    .trim()
    .replace(/[<>"'&]/g, '') // Remove XSS characters
    .replace(/\s+/g, ' '); // Normalize whitespace
  
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

// Price validation helper
export const validatePrice = (price: number | string): { isValid: boolean; value: number; message?: string } => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return { isValid: false, value: 0, message: 'Price must be a valid number' };
  }
  
  if (numPrice < 0) {
    return { isValid: false, value: 0, message: 'Price cannot be negative' };
  }
  
  if (numPrice > 1000000) {
    return { isValid: false, value: 0, message: 'Price cannot exceed Rs. 10,00,000' };
  }
  
  return { isValid: true, value: numPrice };
};

// Enhanced phone number validation for Nepal
export const PHONE_NUMBER_REGEX = /^(\+977|977)?[9][6-9][0-9]{8}$/;

// Additional validation patterns
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone number formatting helper
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // If starts with +977, keep as is
  if (cleaned.startsWith('+977')) {
    return cleaned;
  }
  
  // If starts with 977, add +
  if (cleaned.startsWith('977')) {
    return '+' + cleaned;
  }
  
  // If starts with 0, replace with +977
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return '+977' + cleaned.substring(1);
  }
  
  // If starts with 9 and is 10 digits, add +977
  if (cleaned.startsWith('9') && cleaned.length === 10) {
    return '+977' + cleaned;
  }
  
  return cleaned;
};

// Phone number validation helper
export const validatePhoneNumber = (phone: string): { isValid: boolean; message?: string } => {
  const formatted = formatPhoneNumber(phone);
  
  if (!formatted) {
    return { isValid: false, message: 'Phone number is required' };
  }
  
  if (!PHONE_NUMBER_REGEX.test(formatted.replace('+', ''))) {
    return { 
      isValid: false, 
      message: 'Please enter a valid Nepali mobile number (e.g., +977-9841234567)' 
    };
  }
  
  return { isValid: true };
};