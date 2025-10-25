import { Router } from 'express';
import { storage } from './storage';
import config from './config';
import { requireAdmin } from './simple-auth';
import { newsService } from './news-service';

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

        if (filteredNews.length > 0) {
          return res.json(filteredNews.slice(0, limit));
        }
      }
    } catch (dbError) {
      console.warn('Database news fetch failed, fetching live news:', dbError);
    }

    // Fetch real news from live APIs
    const articles = await newsService.getNews(limit, category);
    res.json(articles);
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

// Admin: Create news article
router.post('/admin/create', requireAdmin, async (req, res) => {
  try {
    const { title, description, url, imageUrl, category, coins } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const newsArticle = await storage.createNewsArticle({
      title,
      description,
      summary: description.substring(0, 150),
      url: url || '#',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400',
      category: category || 'general',
      coins: coins || [],
      sentiment: 'neutral',
      source: { id: 'admin', name: 'Admin' }
    });

    res.json(newsArticle);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ message: 'Failed to create news article' });
  }
});

// Admin: Update news article
router.put('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, url, imageUrl, category, coins } = req.body;

    const article = await storage.getNewsArticleById(id);
    if (!article) {
      return res.status(404).json({ message: 'News article not found' });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (url) updateData.url = url;
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (category) updateData.category = category;
    if (coins) updateData.coins = coins;

    const updated = await storage.updateNewsArticle(id, updateData);
    res.json(updated);
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ message: 'Failed to update news article' });
  }
});

// Admin: Get single news article
router.get('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const article = await storage.getNewsArticleById(id);

    if (!article) {
      return res.status(404).json({ message: 'News article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Get news article error:', error);
    res.status(500).json({ message: 'Failed to fetch news article' });
  }
});

// Admin: Update news article
router.put('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, url, imageUrl, category, coins } = req.body;

    const updatedArticle = await storage.updateNewsArticle(id, {
      title,
      description,
      summary: description?.substring(0, 150),
      url,
      imageUrl,
      category,
      coins
    });

    if (!updatedArticle) {
      return res.status(404).json({ message: 'News article not found' });
    }

    res.json(updatedArticle);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ message: 'Failed to update news article' });
  }
});

// Admin: Delete news article
router.delete('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteNewsArticle(id);
    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Failed to delete news article' });
  }
});

// Admin: Get analytics
router.get('/admin/analytics', requireAdmin, async (req, res) => {
  try {
    const analytics = await storage.getNewsAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

export default router;