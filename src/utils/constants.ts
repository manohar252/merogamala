// Currency conversion
export const USD_TO_NPR_RATE = 132.50;

// Admin authentication constants
export const SESSION_DURATION = 1 * 60 * 60 * 1000; // 1 hour
export const SESSION_STORAGE_KEY = 'mero-gamala-admin-session';
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Error boundary constants
export const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try refreshing the page.';
export const CRITICAL_ERROR_MESSAGE = 'A critical error occurred. Please contact support if this persists.';

// Search constants
export const MIN_SEARCH_LENGTH = 2;
export const SEARCH_DEBOUNCE_MS = 300;

// Language constants
export const SUPPORTED_LANGUAGES = ['en', 'ne'] as const;
export const DEFAULT_LANGUAGE = 'en';

// Cart constants
export const MAX_CART_ITEMS = 50;
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;