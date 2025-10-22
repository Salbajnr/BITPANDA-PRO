import * as cheerio from 'cheerio';

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
      console.log('📰 Fetching news from Bitpanda blog...');
      
      // Fetch the Bitpanda blog news page
      const response = await fetch('https://blog.bitpanda.com/en/tag/news');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Bitpanda blog: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const articles: NewsArticle[] = [];

      // Parse articles from the blog page
      $('a').each((index, element) => {
        const $link = $(element);
        const href = $link.attr('href');
        
        // Only process links that are blog post URLs
        if (!href || !href.includes('/en/') || href === '/en' || href.includes('/tag/')) {
          return;
        }

        // Extract article information
        const $img = $link.find('img');
        const imageUrl = $img.attr('src') || 'https://cdn.bitpanda.com/media/dev/artboard-1.png';
        
        // Get the text content
        const fullText = $link.text().trim();
        
        // Extract read time
        const readTimeMatch = fullText.match(/(\d+)\s*min\s*read/);
        
        // Extract title (bold text after read time)
        const titleMatch = fullText.match(/\*\*(.+?)\*\*/);
        let title = titleMatch ? titleMatch[1] : '';
        
        // If no title found in markdown format, try to extract from text
        if (!title) {
          const lines = fullText.split('\n').filter(line => line.trim());
          // Skip the read time line and get the next substantial line
          for (const line of lines) {
            if (!line.includes('min read') && line.length > 10) {
              title = line.trim();
              break;
            }
          }
        }

        // Extract description (text after title)
        let description = fullText
          .replace(/\d+\s*min\s*read/, '')
          .replace(/\*\*.+?\*\*/, '')
          .replace(/Read more/i, '')
          .trim();
        
        // Clean up description
        description = description.split('\n').filter(line => line.trim()).join(' ').trim();
        if (description.length > 300) {
          description = description.substring(0, 300) + '...';
        }

        // Only add if we have a valid title and URL
        if (title && href && title.length > 5) {
          const fullUrl = href.startsWith('http') ? href : `https://blog.bitpanda.com${href}`;
          const articleId = href.split('/').pop() || `article-${index}`;
          
          // Determine category based on title content
          let articleCategory = 'news';
          let sentiment = 'neutral';
          let coins: string[] = [];
          
          const lowerTitle = title.toLowerCase();
          const lowerDesc = description.toLowerCase();
          const combined = lowerTitle + ' ' + lowerDesc;
          
          // Categorize based on content
          if (combined.includes('bitcoin') || combined.includes('btc')) {
            coins.push('bitcoin', 'btc');
          }
          if (combined.includes('ethereum') || combined.includes('eth')) {
            coins.push('ethereum', 'eth');
          }
          if (combined.includes('xrp') || combined.includes('ripple')) {
            coins.push('xrp', 'ripple');
          }
          
          // Sentiment analysis
          if (combined.match(/surge|gain|rise|growth|bullish|high|win|success|secures|appointed|partnership/i)) {
            sentiment = 'positive';
          } else if (combined.match(/fall|decline|loss|bearish|risk|volatility|crash/i)) {
            sentiment = 'negative';
          }
          
          // Additional categories
          if (combined.includes('weekly wrap')) {
            articleCategory = 'weekly';
          } else if (combined.includes('partnership') || combined.includes('ambassador')) {
            articleCategory = 'partnerships';
          } else if (combined.includes('ceo') || combined.includes('cto') || combined.includes('coo')) {
            articleCategory = 'team';
          } else if (combined.includes('web3') || combined.includes('defi')) {
            articleCategory = 'technology';
          }

          const article: NewsArticle = {
            id: articleId,
            title: title,
            description: description || title,
            summary: description.length > 150 ? description.substring(0, 150) + '...' : description,
            url: fullUrl,
            imageUrl: imageUrl,
            urlToImage: imageUrl,
            publishedAt: new Date(Date.now() - index * 3600000).toISOString(), // Estimate based on order
            createdAt: new Date(Date.now() - index * 3600000).toISOString(),
            source: { id: 'bitpanda-blog', name: 'Bitpanda Blog' },
            category: articleCategory,
            sentiment: sentiment,
            coins: coins
          };

          articles.push(article);
        }
      });

      // Remove duplicates based on URL
      const uniqueArticles = Array.from(
        new Map(articles.map(article => [article.url, article])).values()
      );

      // Filter by category if specified
      let filteredArticles = uniqueArticles;
      if (category && category !== 'all') {
        filteredArticles = uniqueArticles.filter(article =>
          article.category === category ||
          article.coins.includes(category.toLowerCase())
        );
      }

      const result = filteredArticles.slice(0, limit);
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      console.log(`✅ Fetched ${result.length} articles from Bitpanda blog`);
      return result;
    } catch (error) {
      console.error('❌ Error fetching news from Bitpanda blog:', error);
      return this.getFallbackNews(limit);
    }
  }

  private getFallbackNews(limit: number): NewsArticle[] {
    console.log('⚠️ Using fallback news data');
    
    const fallback: NewsArticle[] = [
      {
        id: 'fallback-1',
        title: 'Bitpanda: European Leader in Crypto and Digital Assets',
        description: 'Bitpanda continues to expand its offerings across Europe, providing secure and regulated access to cryptocurrency, stocks, and precious metals trading.',
        summary: 'Bitpanda expands European crypto trading services.',
        url: 'https://blog.bitpanda.com/en',
        imageUrl: 'https://cdn.bitpanda.com/media/dev/artboard-1.png',
        urlToImage: 'https://cdn.bitpanda.com/media/dev/artboard-1.png',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        source: { id: 'bitpanda', name: 'Bitpanda' },
        category: 'general',
        sentiment: 'neutral',
        coins: ['bitcoin', 'ethereum']
      },
      {
        id: 'fallback-2',
        title: 'Crypto Market Update: Trading Activity Continues',
        description: 'Digital asset markets show ongoing trading activity with Bitcoin and Ethereum leading the way in market capitalization.',
        summary: 'Markets remain active with ongoing trading.',
        url: 'https://www.bitpanda.com/en',
        imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400',
        urlToImage: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        source: { id: 'market', name: 'Market Update' },
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
