
import { Router } from 'express';
import { storage } from './storage';
import config from './config';

const router = Router();

// Fallback news data
const fallbackNews = [
  {
    id: '1',
    title: 'Bitcoin Reaches New Monthly High Amid Institutional Interest',
    description: 'Bitcoin price surges as major institutions continue to show increased interest in cryptocurrency investments.',
    summary: 'Bitcoin price surges as major institutions continue to show increased interest in cryptocurrency investments.',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400',
    urlToImage: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: { id: 'crypto-news', name: 'Crypto News' },
    category: 'bitcoin',
    sentiment: 'positive',
    coins: ['bitcoin']
  },
  {
    id: '2',
    title: 'Ethereum 2.0 Staking Rewards Show Strong Performance',
    description: 'Ethereum staking continues to show robust returns as the network processes record transaction volumes.',
    summary: 'Ethereum staking continues to show robust returns as the network processes record transaction volumes.',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
    urlToImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    source: { id: 'eth-daily', name: 'ETH Daily' },
    category: 'ethereum',
    sentiment: 'positive',
    coins: ['ethereum']
  },
  {
    id: '3',
    title: 'DeFi Protocols See Record Trading Volume',
    description: 'Decentralized finance protocols are experiencing unprecedented trading activity as institutional adoption grows.',
    summary: 'Decentralized finance protocols are experiencing unprecedented trading activity.',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
    urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    source: { id: 'defi-pulse', name: 'DeFi Pulse' },
    category: 'defi',
    sentiment: 'positive',
    coins: ['ethereum', 'chainlink', 'polygon']
  },
  {
    id: '4',
    title: 'Regulatory Clarity Emerges for Cryptocurrency Sector',
    description: 'New regulatory frameworks provide clearer guidelines for cryptocurrency operations and compliance.',
    summary: 'New regulatory frameworks provide clearer guidelines for cryptocurrency operations.',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400',
    urlToImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    source: { id: 'crypto-regulation', name: 'Crypto Regulation News' },
    category: 'regulation',
    sentiment: 'positive',
    coins: ['bitcoin', 'ethereum']
  },
  {
    id: '5',
    title: 'Altcoins Show Strong Market Performance',
    description: 'Alternative cryptocurrencies are demonstrating significant price momentum and trading volume increases.',
    summary: 'Alternative cryptocurrencies are demonstrating significant price momentum.',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
    urlToImage: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    source: { id: 'altcoin-buzz', name: 'Altcoin Buzz' },
    category: 'altcoins',
    sentiment: 'positive',
    coins: ['solana', 'cardano', 'polygon']
  }
];

// Get news articles
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;

    // Try to get news from database first
    try {
      const dbNews = await storage.getNewsArticles(limit);
      if (dbNews && dbNews.length > 0) {
        let filteredNews = dbNews;
        
        if (category && category !== 'all') {
          filteredNews = dbNews.filter(article => 
            article.category === category || 
            (article.coins && article.coins.includes(category))
          );
        }
        
        return res.json(filteredNews.slice(0, limit));
      }
    } catch (dbError) {
      console.warn('Database news fetch failed, using fallback:', dbError);
    }

    // Use fallback news data
    let articles = [...fallbackNews];
    
    if (category && category !== 'all') {
      articles = articles.filter(article => 
        article.category === category || 
        (article.coins && article.coins.includes(category))
      );
    }

    // Add some randomization to simulate fresh content
    articles = articles.map(article => ({
      ...article,
      publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    }));

    // Sort by published date (newest first)
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    res.json(articles.slice(0, limit));
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Failed to fetch news articles' });
  }
});

// Get single news article
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Try database first
    try {
      const allNews = await storage.getNewsArticles(100);
      const article = allNews.find(a => a.id === id);
      if (article) {
        return res.json(article);
      }
    } catch (dbError) {
      console.warn('Database news fetch failed:', dbError);
    }

    // Fallback to mock data
    const article = fallbackNews.find(a => a.id === id);
    if (article) {
      return res.json(article);
    }

    res.status(404).json({ message: 'News article not found' });
  } catch (error) {
    console.error('Error fetching news article:', error);
    res.status(500).json({ message: 'Failed to fetch news article' });
  }
});

// Search news articles
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query as string;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    // Try database first
    try {
      const allNews = await storage.getNewsArticles(100);
      const searchResults = allNews.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase())
      );

      if (searchResults.length > 0) {
        return res.json({
          articles: searchResults.slice(0, limit),
          totalResults: searchResults.length,
          status: 'ok'
        });
      }
    } catch (dbError) {
      console.warn('Database news search failed:', dbError);
    }

    // Fallback search
    const searchResults = fallbackNews.filter(article =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      articles: searchResults.slice(0, limit),
      totalResults: searchResults.length,
      status: 'ok'
    });
  } catch (error) {
    console.error('Error searching news:', error);
    res.status(500).json({ 
      articles: [], 
      totalResults: 0, 
      status: 'error' 
    });
  }
});

// Get news categories
router.get('/categories', (req, res) => {
  try {
    const categories = [
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
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching news categories:', error);
    res.status(500).json({ message: 'Failed to fetch news categories' });
  }
});

export default router;
