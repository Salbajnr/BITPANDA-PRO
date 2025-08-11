const NEWS_API_BASE = 'https://newsapi.org/v2';
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || '';

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
}

export class NewsApiService {
  static async getCryptoNews(limit = 10): Promise<NewsArticle[]> {
    try {
      if (!NEWS_API_KEY || NEWS_API_KEY === 'demo') {
        return this.getFallbackNews();
      }

      const response = await fetch(
        `${NEWS_API_BASE}/everything?q=cryptocurrency OR bitcoin OR ethereum&sortBy=publishedAt&pageSize=${limit}&apiKey=${NEWS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.articles || [];
    } catch (error) {
      console.error('Failed to fetch crypto news:', error);
      return this.getFallbackNews();
    }
  }

  private static getFallbackNews(): NewsArticle[] {
    return [
      {
        id: '1',
        title: 'Bitcoin Reaches New All-Time High as Institutional Adoption Grows',
        description: 'Major financial institutions continue to add Bitcoin to their balance sheets, driving unprecedented demand for the leading cryptocurrency.',
        url: '#',
        urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        source: {
          id: 'crypto-news',
          name: 'CryptoNews'
        }
      },
      {
        id: '2',
        title: 'Ethereum 2.0 Staking Rewards Reach Historic Levels',
        description: 'The Ethereum network upgrade has led to increased staking participation and higher rewards for validators across the ecosystem.',
        url: '#',
        urlToImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        source: {
          id: 'blockchain-daily',
          name: 'BlockchainDaily'
        }
      },
      {
        id: '3',
        title: 'DeFi Total Value Locked Surpasses $200 Billion',
        description: 'Decentralized finance protocols continue to grow as users seek higher yields and financial autonomy in the digital economy.',
        url: '#',
        urlToImage: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        source: {
          id: 'defi-pulse',
          name: 'DeFiPulse'
        }
      },
    ];
  }
}
