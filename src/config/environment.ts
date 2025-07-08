export const environment = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Payment Gateway Configuration
  payment: {
    // Demo mode for development - enables mock payment flows
    demoMode: import.meta.env.DEV,
    
    // eSewa Configuration
    esewa: {
      merchantId: import.meta.env.VITE_ESEWA_MERCHANT_ID || 'demo_merchant',
      successUrl: import.meta.env.VITE_ESEWA_SUCCESS_URL || '/payment-success',
      failureUrl: import.meta.env.VITE_ESEWA_FAILURE_URL || '/payment-failure',
      productServiceCharge: 0,
      productDeliveryCharge: 0,
      taxAmount: 0,
    },
    
    // FonePay Configuration
    fonepay: {
      merchantCode: import.meta.env.VITE_FONEPAY_MERCHANT_CODE || 'demo_merchant',
      username: import.meta.env.VITE_FONEPAY_USERNAME || 'demo_user',
      password: import.meta.env.VITE_FONEPAY_PASSWORD || 'demo_pass',
      secretKey: import.meta.env.VITE_FONEPAY_SECRET_KEY || 'demo_secret',
      baseUrl: import.meta.env.VITE_FONEPAY_BASE_URL || 'https://dev-api.fonepay.com',
    },
    
    // Citizen Bank Configuration
    citizenBank: {
      merchantId: import.meta.env.VITE_CITIZEN_BANK_MERCHANT_ID || 'demo_merchant',
      secretKey: import.meta.env.VITE_CITIZEN_BANK_SECRET_KEY || 'demo_secret',
      baseUrl: import.meta.env.VITE_CITIZEN_BANK_BASE_URL || 'https://api.citizenbank.com',
    },
    
    // Session timeout (in minutes)
    sessionTimeout: 5,
    
    // Polling interval for payment status (in milliseconds)
    statusPollingInterval: 3000,
  },
  
  // WhatsApp Integration
  whatsapp: {
    enabled: !import.meta.env.DEV,
    apiUrl: import.meta.env.VITE_WHATSAPP_API_URL || '',
    authToken: import.meta.env.VITE_WHATSAPP_AUTH_TOKEN || '',
  },
  
  // Store Configuration
  store: {
    name: 'MERO GAMALA',
    phone: '+977-9841234567',
    email: 'info@merogamala.com',
    address: 'Kathmandu, Nepal',
  }
};

// Helper functions
export const isPaymentDemoMode = (): boolean => {
  return environment.payment.demoMode;
};

export const getPaymentConfig = (gateway: 'esewa' | 'fonepay' | 'citizenBank') => {
  return environment.payment[gateway];
};

export const shouldSendWhatsApp = (): boolean => {
  return environment.whatsapp.enabled && !!environment.whatsapp.apiUrl;
};