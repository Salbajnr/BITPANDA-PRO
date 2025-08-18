
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
  private readonly NEWS_API_KEY = 'demo'; // In production, use environment variable
  private readonly BASE_URL = 'https://newsapi.org/v2';
  private readonly CRYPTO_NEWS_SOURCES = [
    'crypto-coins-news',
    'the-verge',
    'techcrunch',
    'ars-technica',
    'wired'
  ];

  // Fallback news data for when API is unavailable
  private fallbackNews: NewsArticle[] = [
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

  async getCryptoNews(category?: string, limit: number = 20): Promise<NewsResponse> {
    try {
      // In a real implementation, you would use actual API calls
      // For demo purposes, we'll use fallback data with some randomization
      
      let articles = [...this.fallbackNews];
      
      // Filter by category if specified
      if (category && category !== 'all') {
        articles = articles.filter(article => 
          article.category === category || 
          (article.coins && article.coins.includes(category))
        );
      }

      // Add some randomization to simulate fresh content
      articles = articles.map(article => ({
        ...article,
        publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
      }));

      // Sort by published date (newest first)
      articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      return {
        articles: articles.slice(0, limit),
        totalResults: articles.length,
        status: 'ok'
      };

    } catch (error) {
      console.error('Error fetching crypto news:', error);
      return {
        articles: this.fallbackNews.slice(0, limit),
        totalResults: this.fallbackNews.length,
        status: 'error'
      };
    }
  }

  async getNewsById(id: string): Promise<NewsArticle | null> {
    try {
      const article = this.fallbackNews.find(article => article.id === id);
      return article || null;
    } catch (error) {
      console.error('Error fetching news article:', error);
      return null;
    }
  }

  async searchNews(query: string, limit: number = 10): Promise<NewsResponse> {
    try {
      const articles = this.fallbackNews.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase())
      );

      return {
        articles: articles.slice(0, limit),
        totalResults: articles.length,
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
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  publishedAt: string;
  source: string;
  category: 'crypto' | 'market' | 'analysis' | 'technology';
  isPinned: boolean;
}

export class NewsApiService {
  private static readonly BASE_URL = '/api/news';

  static async getNews(limit: number = 10): Promise<NewsArticle[]> {
    try {
      const response = await fetch(`${this.BASE_URL}?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const news = await response.json();
      return news;
    } catch (error) {
      console.error('Error fetching news:', error);
      return this.getFallbackNews();
    }
  }

  static async createNews(article: Omit<NewsArticle, 'id' | 'publishedAt'>): Promise<NewsArticle> {
    const response = await fetch(`${this.BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) {
      throw new Error('Failed to create news article');
    }

    return response.json();
  }

  static async deleteNews(id: string): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete news article');
    }
  }

  private static getFallbackNews(): NewsArticle[] {
    return [
      {
        id: '1',
        title: 'Bitcoin Reaches New All-Time High',
        description: 'Bitcoin surpasses previous records as institutional adoption continues to grow.',
        content: 'Bitcoin has reached a new all-time high today, driven by increased institutional adoption and growing mainstream acceptance.',
        imageUrl: '',
        publishedAt: new Date().toISOString(),
        source: 'BitPanda News',
        category: 'crypto',
        isPinned: false
      },
      {
        id: '2',
        title: 'Ethereum 2.0 Staking Rewards Update',
        description: 'Latest updates on Ethereum staking rewards and network improvements.',
        content: 'Ethereum 2.0 continues to show strong performance with improved staking rewards and network efficiency.',
        imageUrl: '',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: 'BitPanda Research',
        category: 'crypto',
        isPinned: false
      },
      {
        id: '3',
        title: 'Market Analysis: Crypto Trends for 2024',
        description: 'Comprehensive analysis of cryptocurrency market trends and predictions.',
        content: 'Our research team provides insights into the expected cryptocurrency market trends for the remainder of 2024.',
        imageUrl: '',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: 'BitPanda Analytics',
        category: 'analysis',
        isPinned: true
      }
    ];
  }
}
