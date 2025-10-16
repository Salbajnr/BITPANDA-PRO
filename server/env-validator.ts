
export function validateEnvironment() {
  const recommendedVars = [
    'DATABASE_URL',
  ];

  const optionalVars = [
    'COINGECKO_API_KEY',
    'NEWS_API_KEY', 
    'METALS_API_KEY',
    'COOKIE_SECRET'
  ];

  const missing = recommendedVars.filter(key => !process.env[key]);
  const optional = optionalVars.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn('⚠️ Missing recommended environment variables:', missing);
    console.log('🎭 Running in demo mode - add these to Replit Secrets for full functionality');
  }

  if (optional.length > 0) {
    console.log('💡 Optional environment variables not set:', optional);
    console.log('🔧 Add these in Replit Secrets to enable additional features');
  }

  console.log('✅ Environment validation completed');
  return true;
}
