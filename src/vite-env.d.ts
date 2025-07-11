/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_DEV_MODE: string;
  readonly VITE_ENABLE_CONSOLE_LOGS: string;
  readonly VITE_API_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_ESEWA_MERCHANT_ID: string;
  readonly VITE_ESEWA_SUCCESS_URL: string;
  readonly VITE_ESEWA_FAILURE_URL: string;
  readonly VITE_FONEPAY_MERCHANT_CODE: string;
  readonly VITE_FONEPAY_USERNAME: string;
  readonly VITE_FONEPAY_PASSWORD: string;
  readonly VITE_FONEPAY_SECRET_KEY: string;
  readonly VITE_FONEPAY_BASE_URL: string;
  readonly VITE_CITIZEN_BANK_MERCHANT_ID: string;
  readonly VITE_CITIZEN_BANK_SECRET_KEY: string;
  readonly VITE_CITIZEN_BANK_BASE_URL: string;
  readonly VITE_WHATSAPP_API_URL: string;
  readonly VITE_WHATSAPP_API_TOKEN: string;
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
