import crypto from 'crypto';

export function validateEnvironment() {
  const isProduction = process.env.NODE_ENV === 'production';
  const required = ['COOKIE_SECRET'];
  const optional = ['DATABASE_URL', 'COINGECKO_API_KEY', 'NEWS_API_KEY', 'METALS_API_KEY'];

  const missing = required.filter(key => !process.env[key]);
  const optionalMissing = optional.filter(key => !process.env[key]);

  if (missing.includes('COOKIE_SECRET')) {
    if (isProduction) {
      console.error('❌ Missing required environment variables:', missing);
      console.error('❌ Application cannot start without these variables.');
      console.log('🔧 Add them to your environment variables (Render dashboard) to continue');
      process.exit(1);
    } else {
      const devSecret = crypto.randomBytes(32).toString('hex');
      process.env.COOKIE_SECRET = devSecret;
      console.log('🔧 Development mode: Generated temporary COOKIE_SECRET');
      console.log('💡 For production, add COOKIE_SECRET to your environment variables');
    }
  }

  if (optionalMissing.length > 0) {
    console.log('💡 Optional environment variables not set:', optionalMissing);
    console.log('🔧 Add these to your environment variables to enable additional features');
  }

  console.log('✅ Environment validation completed');
  return true;
}