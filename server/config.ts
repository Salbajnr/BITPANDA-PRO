
export const config = {
  // CoinGecko API - free tier has rate limits
  coinGeckoApiKey: process.env.COINGECKO_API_KEY || '',
  
  // NewsAPI key for real news data
  newsApiKey: process.env.NEWS_API_KEY || '',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  
  // Server settings
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Rate limiting
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // requests per window
  
  // WebSocket settings
  wsHeartbeatInterval: 30000, // 30 seconds
  priceUpdateInterval: 30000, // 30 seconds for free tier APIs
  
  // Cache settings
  cacheTimeout: 30000, // 30 seconds
  newsApiCacheTimeout: 300000, // 5 minutes
  
  // API URLs
  coinGeckoBaseUrl: 'https://api.coingecko.com/api/v3',
  newsApiBaseUrl: 'https://newsapi.org/v2',
  cryptoPanicBaseUrl: 'https://cryptopanic.com/api/v1',
};

export default config;
// Environment configuration and validation
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  console.log('Please set DATABASE_URL in your environment or .env file');
}

export const config = {
  databaseUrl: process.env.DATABASE_URL || '',
  port: parseInt(process.env.PORT || '5000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5000', 'http://127.0.0.1:5000'],
};

export default config;
