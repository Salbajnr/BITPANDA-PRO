
export function validateEnvironment() {
  const requiredVars = [
    'DATABASE_URL',
  ];

  const optionalVars = [
    'COINGECKO_API_KEY',
    'NEWS_API_KEY', 
    'METALS_API_KEY',
    'COOKIE_SECRET'
  ];

  const missing = requiredVars.filter(key => !process.env[key]);
  const optional = optionalVars.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    console.error('🔧 Please set these in Replit Secrets');
    return false;
  }

  if (optional.length > 0) {
    console.warn('⚠️ Missing optional environment variables:', optional);
    console.warn('🔧 Some features may have limited functionality');
  }

  console.log('✅ Environment variables validated');
  return true;
}
