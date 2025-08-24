
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  category: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  coins?: string[];
}

export interface NewsResponse {
  articles: NewsArticle[];
  totalResults: number;
  status: string;
}

class NewsApiService {
  private readonly BACKEND_URL = '/api/news';
  private readonly NEWS_API_BASE = 'https://newsapi.org/v2';
  private readonly CRYPTOPANIC_BASE = 'https://cryptopanic.com/api/v1';
  private readonly NEWS_API_KEY = process.env.NEWS_API_KEY || 'demo';
  
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 300000; // 5 minutes

  private getCachedData(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getCryptoNews(category?: string, limit: number = 20): Promise<NewsResponse> {
    const cacheKey = `news-${category || 'all'}-${limit}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Try backend API first
      const backendResponse = await fetch(`${this.BACKEND_URL}?limit=${limit}${category ? `&category=${category}` : ''}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (backendResponse.ok) {
        const backendData = await backendResponse.json();
        
        // Transform backend data to match our interface
        const articles = Array.isArray(backendData) ? backendData : backendData.articles || [];
        const transformedArticles = articles.map((article: any) => ({
          id: article.id || article.url || Math.random().toString(),
          title: article.title,
          description: article.description || article.summary,
          url: article.url,
          urlToImage: article.urlToImage || article.imageUrl,
          publishedAt: article.publishedAt || article.createdAt,
          source: article.source || { id: 'backend', name: 'Crypto News' },
          category: article.category || 'cryptocurrency',
          sentiment: article.sentiment,
          coins: article.coins
        }));

        const response = {
          articles: transformedArticles,
          totalResults: transformedArticles.length,
          status: 'ok'
        };
        
        this.setCachedData(cacheKey, response);
        return response;
      }

      // Try real NewsAPI if we have a valid key
      if (this.NEWS_API_KEY && this.NEWS_API_KEY !== 'demo') {
        const newsApiResponse = await this.fetchFromNewsAPI(category, limit);
        if (newsApiResponse) {
          this.setCachedData(cacheKey, newsApiResponse);
          return newsApiResponse;
        }
      }

      // Try CryptoPanic API as alternative
      const cryptoPanicResponse = await this.fetchFromCryptoPanic(limit);
      if (cryptoPanicResponse) {
        this.setCachedData(cacheKey, cryptoPanicResponse);
        return cryptoPanicResponse;
      }

      // Fallback to mock data
      return this.getFallbackNewsResponse(category, limit);

    } catch (error) {
      console.error('Error fetching crypto news:', error);
      return this.getFallbackNewsResponse(category, limit);
    }
  }

  private async fetchFromNewsAPI(category?: string, limit: number = 20): Promise<NewsResponse | null> {
    try {
      const query = category && category !== 'all' ? category : 'cryptocurrency';
      const url = `${this.NEWS_API_BASE}/everything?q=${query}&sortBy=publishedAt&pageSize=${limit}&apiKey=${this.NEWS_API_KEY}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.warn(`NewsAPI error: ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      
      const articles = data.articles.map((article: any) => ({
        id: article.url,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source,
        category: this.categorizeArticle(article.title, article.description),
        sentiment: this.analyzeSentiment(article.title, article.description),
        coins: this.extractCoins(article.title, article.description)
      }));

      return {
        articles,
        totalResults: data.totalResults,
        status: 'ok'
      };
    } catch (error) {
      console.error('NewsAPI fetch failed:', error);
      return null;
    }
  }

  private async fetchFromCryptoPanic(limit: number = 20): Promise<NewsResponse | null> {
    try {
      const response = await fetch(`${this.CRYPTOPANIC_BASE}/posts/?auth_token=free&kind=news&page=1`);
      
      if (!response.ok) {
        console.warn(`CryptoPanic error: ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      
      const articles = data.results.slice(0, limit).map((post: any) => ({
        id: post.id.toString(),
        title: post.title,
        description: post.title,
        url: post.url,
        urlToImage: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400',
        publishedAt: post.published_at,
        source: { id: 'cryptopanic', name: 'CryptoPanic' },
        category: 'cryptocurrency',
        sentiment: post.votes?.positive > post.votes?.negative ? 'positive' : 'negative',
        coins: post.currencies?.map((c: any) => c.code.toLowerCase()) || []
      }));

      return {
        articles,
        totalResults: data.count,
        status: 'ok'
      };
    } catch (error) {
      console.error('CryptoPanic fetch failed:', error);
      return null;
    }
  }

  private getFallbackNewsResponse(category?: string, limit: number = 20): NewsResponse {
    const fallbackNews: NewsArticle[] = [
      {
        id: '1',
        title: 'Bitcoin Reaches New Monthly High Amid Institutional Interest',
        description: 'Bitcoin price surges as major institutions continue to show increased interest in cryptocurrency investments, with several ETF approvals pending.',
        url: '#',
        urlToImage: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        source: { id: 'crypto-news', name: 'Crypto News' },
        category: 'bitcoin',
        sentiment: 'positive',
        coins: ['bitcoin']
      },
      {
        id: '2',
        title: 'Ethereum 2.0 Staking Rewards Show Strong Performance',
        description: 'Ethereum staking continues to show robust returns as the network processes record transaction volumes.',
        url: '#',
        urlToImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        source: { id: 'eth-daily', name: 'ETH Daily' },
        category: 'ethereum',
        sentiment: 'positive',
        coins: ['ethereum']
      },
      {
        id: '3',
        title: 'Regulatory Clarity Brings New Opportunities for DeFi',
        description: 'Recent regulatory developments provide clearer guidelines for decentralized finance protocols and their operations.',
        url: '#',
        urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        source: { id: 'defi-pulse', name: 'DeFi Pulse' },
        category: 'defi',
        sentiment: 'positive',
        coins: ['ethereum', 'chainlink', 'polygon']
      },
      {
        id: '4',
        title: 'Altcoin Season Shows Signs of Momentum Building',
        description: 'Alternative cryptocurrencies are showing increased trading volume and price momentum as market sentiment improves.',
        url: '#',
        urlToImage: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        source: { id: 'altcoin-buzz', name: 'Altcoin Buzz' },
        category: 'altcoins',
        sentiment: 'positive',
        coins: ['solana', 'cardano', 'polygon']
      },
      {
        id: '5',
        title: 'Blockchain Technology Adoption Accelerates in Enterprise',
        description: 'Major corporations are increasingly adopting blockchain solutions for supply chain management and digital identity verification.',
        url: '#',
        urlToImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400',
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        source: { id: 'blockchain-news', name: 'Blockchain News' },
        category: 'blockchain',
        sentiment: 'positive',
        coins: ['ethereum', 'chainlink']
      },
      {
        id: '6',
        title: 'Market Analysis: Crypto Markets Show Resilience',
        description: 'Technical analysis indicates strong support levels across major cryptocurrencies despite recent market volatility.',
        url: '#',
        urlToImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400',
        publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
        source: { id: 'crypto-analysis', name: 'Crypto Analysis' },
        category: 'market-analysis',
        sentiment: 'neutral',
        coins: ['bitcoin', 'ethereum']
      }
    ];

    let articles = [...fallbackNews];
    
    if (category && category !== 'all') {
      articles = articles.filter(article => 
        article.category === category || 
        (article.coins && article.coins.includes(category))
      );
    }

    articles = articles.map(article => ({
      ...article,
      publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    }));

    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return {
      articles: articles.slice(0, limit),
      totalResults: articles.length,
      status: 'ok'
    };
  }

  private categorizeArticle(title: string, description: string): string {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('bitcoin') || text.includes('btc')) return 'bitcoin';
    if (text.includes('ethereum') || text.includes('eth')) return 'ethereum';
    if (text.includes('defi') || text.includes('decentralized')) return 'defi';
    if (text.includes('nft') || text.includes('non-fungible')) return 'nft';
    if (text.includes('regulation') || text.includes('sec')) return 'regulation';
    if (text.includes('blockchain')) return 'blockchain';
    
    return 'cryptocurrency';
  }

  private analyzeSentiment(title: string, description: string): 'positive' | 'negative' | 'neutral' {
    const text = `${title} ${description}`.toLowerCase();
    
    const positiveWords = ['rise', 'surge', 'bull', 'gain', 'profit', 'success', 'breakthrough', 'rally', 'boom'];
    const negativeWords = ['fall', 'crash', 'bear', 'loss', 'decline', 'risk', 'hack', 'drop', 'plunge'];
    
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private extractCoins(title: string, description: string): string[] {
    const text = `${title} ${description}`.toLowerCase();
    const coins = [];
    
    if (text.includes('bitcoin') || text.includes('btc')) coins.push('bitcoin');
    if (text.includes('ethereum') || text.includes('eth')) coins.push('ethereum');
    if (text.includes('cardano') || text.includes('ada')) coins.push('cardano');
    if (text.includes('solana') || text.includes('sol')) coins.push('solana');
    if (text.includes('chainlink') || text.includes('link')) coins.push('chainlink');
    if (text.includes('polygon') || text.includes('matic')) coins.push('polygon');
    
    return coins;
  }

  async getNewsById(id: string): Promise<NewsArticle | null> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/${id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error fetching news article:', error);
      return null;
    }
  }

  async searchNews(query: string, limit: number = 10): Promise<NewsResponse> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/search?query=${encodeURIComponent(query)}&limit=${limit}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          articles: data.articles || data,
          totalResults: data.totalResults || data.length,
          status: 'ok'
        };
      }

      const fallbackArticles = this.getFallbackNewsResponse('all', 20).articles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase())
      );

      return {
        articles: fallbackArticles.slice(0, limit),
        totalResults: fallbackArticles.length,
        status: 'ok'
      };
    } catch (error) {
      console.error('Error searching news:', error);
      return {
        articles: [],
        totalResults: 0,
        status: 'error'
      };
    }
  }

  getNewsCategories(): string[] {
    return [
      'all',
      'bitcoin',
      'ethereum',
      'defi',
      'nft',
      'regulation',
      'altcoins',
      'blockchain',
      'market-analysis'
    ];
  }
}

export const newsApi = new NewsApiService();
export default newsApi;
