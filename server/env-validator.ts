export function validateEnvironment() {
  const isProduction = process.env.NODE_ENV === 'production';
  const required = isProduction 
    ? ['DATABASE_URL', 'COOKIE_SECRET'] 
    : ['DATABASE_URL'];
  const optional = ['COINGECKO_API_KEY', 'NEWS_API_KEY', 'METALS_API_KEY'];

  const missing = required.filter(key => !process.env[key]);
  const optionalMissing = optional.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn('⚠️ Missing required environment variables:', missing);
    if (isProduction) {
      console.error('❌ Application cannot start in production without these variables.');
      process.exit(1); 
    } else {
      console.log('🎭 Running in demo mode - add these to Replit Secrets for full functionality');
    }
  }

  if (optionalMissing.length > 0) {
    console.log('💡 Optional environment variables not set:', optionalMissing);
    console.log('🔧 Add these in Replit Secrets to enable additional features');
  }

  console.log('✅ Environment validation completed');
  return true;
}