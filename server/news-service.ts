interface NewsArticle {
  id: string;
  title: string;
  description: string;
  summary: string;
  url: string;
  imageUrl: string;
  urlToImage: string;
  publishedAt: string;
  createdAt: string;
  source: { id: string; name: string };
  category: string;
  sentiment: string;
  coins: string[];
}

class NewsService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 300000; // 5 minutes

  async getNews(limit: number = 10, category?: string): Promise<NewsArticle[]> {
    const cacheKey = `news_${category || 'all'}_${limit}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      // Use CoinGecko's global data endpoint for market insights
      const globalResponse = await fetch('https://api.coingecko.com/api/v3/global');
      const trendingResponse = await fetch('https://api.coingecko.com/api/v3/search/trending');
      
      const [globalData, trendingData] = await Promise.all([
        globalResponse.ok ? globalResponse.json() : null,
        trendingResponse.ok ? trendingResponse.json() : null
      ]);

      const articles: NewsArticle[] = [];

      // Create news from trending cryptocurrencies
      if (trendingData && (trendingData as any).coins) {
        const trendingArticles = (trendingData as any).coins.slice(0, Math.ceil(limit / 2)).map((coin: any, index: number) => ({
          id: `trending-${coin.item.id}-${Date.now()}`,
          title: `${coin.item.name} (${coin.item.symbol.toUpperCase()}) Trending in Top ${index + 1}`,
          description: `${coin.item.name} is currently one of the most searched cryptocurrencies. Market Cap Rank: #${coin.item.market_cap_rank || 'Unranked'}. The token has seen increased interest from traders and investors.`,
          summary: `${coin.item.name} is trending in the crypto markets with significant trading activity.`,
          url: `https://www.coingecko.com/en/coins/${coin.item.id}`,
          imageUrl: coin.item.large || coin.item.thumb || 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
          urlToImage: coin.item.large || coin.item.thumb || 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
          publishedAt: new Date(Date.now() - index * 1000).toISOString(),
          createdAt: new Date(Date.now() - index * 1000).toISOString(),
          source: { id: 'coingecko-trending', name: 'CoinGecko Market Data' },
          category: 'trending',
          sentiment: 'neutral',
          coins: [coin.item.id, coin.item.symbol.toLowerCase()]
        }));
        
        articles.push(...trendingArticles);
      }

      // Create market overview article from global data
      if (globalData && (globalData as any).data) {
        const marketData = (globalData as any).data;
        const btcDominance = marketData.market_cap_percentage?.btc?.toFixed(2) || 'N/A';
        const ethDominance = marketData.market_cap_percentage?.eth?.toFixed(2) || 'N/A';
        const totalMarketCap = marketData.total_market_cap?.usd;
        const marketCapChange = marketData.market_cap_change_percentage_24h_usd;
        
        const marketCapFormatted = totalMarketCap 
          ? `$${(totalMarketCap / 1e12).toFixed(2)}T` 
          : 'N/A';
        
        const changeDirection = marketCapChange > 0 ? 'rises' : 'falls';
        const sentiment = marketCapChange > 0 ? 'positive' : marketCapChange < 0 ? 'negative' : 'neutral';
        
        articles.unshift({
          id: `market-overview-${Date.now()}`,
          title: `Crypto Market Overview: Total Market Cap ${changeDirection} to ${marketCapFormatted}`,
          description: `The total cryptocurrency market capitalization stands at ${marketCapFormatted}, ${marketCapChange > 0 ? 'up' : 'down'} ${Math.abs(marketCapChange).toFixed(2)}% in the last 24 hours. Bitcoin dominance: ${btcDominance}%, Ethereum dominance: ${ethDominance}%. Active cryptocurrencies: ${marketData.active_cryptocurrencies || 'N/A'}.`,
          summary: `Daily market overview showing ${marketCapChange > 0 ? 'positive' : 'negative'} momentum across cryptocurrency markets.`,
          url: 'https://www.coingecko.com/en/global-charts',
          imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
          urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          source: { id: 'coingecko-global', name: 'CoinGecko Market Analysis' },
          category: 'market',
          sentiment,
          coins: ['bitcoin', 'ethereum']
        });
      }

      // Add top gainers/losers as news
      const marketsResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false&price_change_percentage=24h');
      
      if (marketsResponse.ok) {
        const marketsData = await marketsResponse.json() as any[];
        
        // Top gainer
        const topGainer = marketsData
          .filter(c => c.price_change_percentage_24h > 0)
          .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)[0];
        
        if (topGainer) {
          articles.push({
            id: `gainer-${topGainer.id}-${Date.now()}`,
            title: `${topGainer.name} Surges ${topGainer.price_change_percentage_24h.toFixed(2)}% in 24 Hours`,
            description: `${topGainer.name} (${topGainer.symbol.toUpperCase()}) leads the market with a ${topGainer.price_change_percentage_24h.toFixed(2)}% price increase in the last 24 hours. Current price: $${topGainer.current_price.toLocaleString()}. Trading volume: $${(topGainer.total_volume / 1e6).toFixed(2)}M.`,
            summary: `${topGainer.name} shows strong bullish momentum with significant gains.`,
            url: `https://www.coingecko.com/en/coins/${topGainer.id}`,
            imageUrl: topGainer.image || 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
            urlToImage: topGainer.image || 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
            publishedAt: new Date(Date.now() - 30000).toISOString(),
            createdAt: new Date(Date.now() - 30000).toISOString(),
            source: { id: 'market-movers', name: 'Market Movers' },
            category: 'gainers',
            sentiment: 'positive',
            coins: [topGainer.id, topGainer.symbol.toLowerCase()]
          });
        }

        // Top loser
        const topLoser = marketsData
          .filter(c => c.price_change_percentage_24h < 0)
          .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)[0];
        
        if (topLoser) {
          articles.push({
            id: `loser-${topLoser.id}-${Date.now()}`,
            title: `${topLoser.name} Declines ${Math.abs(topLoser.price_change_percentage_24h).toFixed(2)}% Amid Market Correction`,
            description: `${topLoser.name} (${topLoser.symbol.toUpperCase()}) experiences a ${Math.abs(topLoser.price_change_percentage_24h).toFixed(2)}% price decrease in the last 24 hours. Current price: $${topLoser.current_price.toLocaleString()}. Traders monitor support levels.`,
            summary: `${topLoser.name} faces downward pressure in current trading session.`,
            url: `https://www.coingecko.com/en/coins/${topLoser.id}`,
            imageUrl: topLoser.image || 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
            urlToImage: topLoser.image || 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
            publishedAt: new Date(Date.now() - 60000).toISOString(),
            createdAt: new Date(Date.now() - 60000).toISOString(),
            source: { id: 'market-movers', name: 'Market Movers' },
            category: 'losers',
            sentiment: 'negative',
            coins: [topLoser.id, topLoser.symbol.toLowerCase()]
          });
        }
      }

      // Filter by category if specified
      let filteredArticles = articles;
      if (category && category !== 'all') {
        filteredArticles = articles.filter(article =>
          article.category === category ||
          article.coins.includes(category.toLowerCase())
        );
      }

      const result = filteredArticles.slice(0, limit);
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      console.log(`✅ Fetched ${result.length} real news articles from live market data`);
      return result;
    } catch (error) {
      console.error('Error fetching news:', error);
      return this.getFallbackNews(limit);
    }
  }

  private getFallbackNews(limit: number): NewsArticle[] {
    const fallback: NewsArticle[] = [
      {
        id: 'fallback-1',
        title: 'Cryptocurrency Markets Show Activity',
        description: 'Digital asset markets continue to see trading activity across major cryptocurrencies.',
        summary: 'Markets remain active with ongoing trading.',
        url: 'https://www.coingecko.com',
        imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400',
        urlToImage: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        source: { id: 'system', name: 'Market Update' },
        category: 'general',
        sentiment: 'neutral',
        coins: ['bitcoin', 'ethereum']
      }
    ];
    
    return fallback.slice(0, limit);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const newsService = new NewsService();
export type { NewsArticle };
