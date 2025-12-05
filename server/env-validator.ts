import crypto from 'crypto';

export function validateEnvironment() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Auto-generate COOKIE_SECRET if missing
  if (!process.env.COOKIE_SECRET) {
    const generatedSecret = crypto.randomBytes(32).toString('hex');
    process.env.COOKIE_SECRET = generatedSecret;
    if (isProduction) {
      console.warn('⚠️  COOKIE_SECRET not set, auto-generated one. Set it in Render dashboard for persistence.');
    } else {
      console.log('🔧 Development mode: Generated temporary COOKIE_SECRET');
    }
  }

  // Auto-generate other secrets if missing
  if (!process.env.SESSION_SECRET) {
    process.env.SESSION_SECRET = crypto.randomBytes(32).toString('hex');
    console.warn('⚠️  SESSION_SECRET auto-generated');
  }
  
  if (!process.env.SESSION_SECRET_REFRESH) {
    process.env.SESSION_SECRET_REFRESH = crypto.randomBytes(32).toString('hex');
    console.warn('⚠️  SESSION_SECRET_REFRESH auto-generated');
  }
  
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
    console.warn('⚠️  JWT_SECRET auto-generated');
  }

  // Check optional variables
  const optional = ['DATABASE_URL', 'COINGECKO_API_KEY', 'NEWS_API_KEY', 'METALS_API_KEY'];
  const optionalMissing = optional.filter(key => !process.env[key]);

  if (optionalMissing.length > 0) {
    console.log('💡 Optional environment variables not set:', optionalMissing);
    console.log('🔧 Some features may be limited without these variables');
  }

  console.log('✅ Environment validation completed');
  return true;
}