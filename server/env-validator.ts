export function validateEnvironment() {
  const isProduction = process.env.NODE_ENV === 'production';
  const required = ['DATABASE_URL', 'COOKIE_SECRET'];
  const optional = ['COINGECKO_API_KEY', 'NEWS_API_KEY', 'METALS_API_KEY'];

  const missing = required.filter(key => !process.env[key]);
  const optionalMissing = optional.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    console.error('❌ Application cannot start without these variables.');
    console.log('🔧 Add them to Replit Secrets to continue');
    process.exit(1);
  }

  if (optionalMissing.length > 0) {
    console.log('💡 Optional environment variables not set:', optionalMissing);
    console.log('🔧 Add these in Replit Secrets to enable additional features');
  }

  console.log('✅ Environment validation completed');
  return true;
}