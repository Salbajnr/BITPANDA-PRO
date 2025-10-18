
// Environment variable validation for the client
export const env = {
  // API Configuration
  VITE_API_KEY: import.meta.env.VITE_API_KEY,
  VITE_API_URL: import.meta.env.VITE_API_URL || '',
  
  // Feature Flags
  VITE_ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  VITE_ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  
  // External Services
  VITE_CRYPTO_API_KEY: import.meta.env.VITE_CRYPTO_API_KEY,
  VITE_NEWS_API_KEY: import.meta.env.VITE_NEWS_API_KEY,
} as const;

// Validation function
export function validateRequiredEnvVars() {
  const required: string[] = [];
  const missing = required.filter(key => !env[key as keyof typeof env]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }
}

// Call validation on import
validateRequiredEnvVars();
