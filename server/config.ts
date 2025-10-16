
export const config = {
  // CoinGecko API - free tier has rate limits
  coinGeckoApiKey: process.env.COINGECKO_API_KEY || '',
  
  // NewsAPI key for real news data
  newsApiKey: process.env.NEWS_API_KEY || '',
  
  // Metals API key
  metalsApiKey: process.env.METALS_API_KEY || '',
  
  // Database
  databaseUrl: process.env.DATABASE_URL,
  
  // Server settings
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'production ',
  
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
