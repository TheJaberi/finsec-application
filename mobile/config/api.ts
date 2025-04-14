// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://super-duper-bassoon-7vwwx996v494cp76r-5000.app.github.dev',
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    VERIFY_MFA: '/api/auth/verify-mfa',
    GENERATE_MFA: '/api/auth/generate-mfa-secret',
    CARDS: '/api/cards/',
    TRANSACTIONS: '/api/transactions/',
    BILLS: '/api/bills',
    PAY_BILL: '/api/bills/pay',
    ANALYTICS: '/api/analytics/spending',
    PROFILE: '/api/users/profile',
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
};