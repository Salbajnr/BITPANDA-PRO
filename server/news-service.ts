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

interface FetchStatus {
  success: boolean;
  source: 'bitpanda-blog' | 'fallback';
  lastFetch: string;
  articlesCount: number;
  error?: string;
}

class NewsService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 300000; // 5 minutes
  private fetchStatus: FetchStatus = {
    success: false,
    source: 'fallback',
    lastFetch: new Date().toISOString(),
    articlesCount: 0
  };

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
        this.fetchStatus = {
          success: false,
          source: 'fallback',
          lastFetch: new Date().toISOString(),
          articlesCount: 0,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
        throw new Error(`Failed to fetch Bitpanda blog: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const articles: NewsArticle[] = [];
      const seenUrls = new Set<string>();

      // Parse articles from the blog page - look for article links with proper structure
      $('a').each((index, element) => {
        const $link = $(element);
        const href = $link.attr('href');
        
        // Only process blog post URLs (with specific slug pattern)
        // Blog articles have URLs like /en/article-title-with-multiple-words
        // Count hyphens to identify real articles (should have at least 3 hyphens in the slug)
        const hyphenCount = (href || '').split('-').length - 1;
        
        // Skip navigation, tags, and other non-article links
        if (!href || 
            href === '/en' || 
            href === '/' ||
            href.startsWith('/en/tag/') ||
            href.includes('/prices/') ||
            href.includes('/tell-a-friend') ||
            href.includes('/affiliate') ||
            href.includes('www.bitpanda.com') ||
            href.includes('bitpanda.com/en/prices') ||
            !href.includes('/en/') ||
            href.split('/').length < 3 ||
            hyphenCount < 3 || // Real articles have multi-word slugs with multiple hyphens
            seenUrls.has(href)) {
          return;
        }

        // Get the link text content
        const fullText = $link.text().trim();
        
        // Check if this link contains article markers (read time)
        const hasReadTime = /\d+\s*min\s*read/.test(fullText);
        
        // If no read time and the text is very short, it's likely a navigation link
        if (!hasReadTime && fullText.length < 20) {
          return;
        }

        // Extract image
        const $img = $link.find('img');
        const imageUrl = $img.attr('src') || 'https://cdn.bitpanda.com/media/dev/artboard-1.png';
        
        // Extract title from the text
        // Remove read time and "Read more" text
        let title = fullText
          .replace(/•?\s*\d+\s*min\s*read/gi, '')
          .replace(/Read more/gi, '')
          .trim();
        
        // Extract first substantial line as title
        const lines = title.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        title = lines[0] || '';
        
        // Description is remaining lines
        const description = lines.slice(1).join(' ').trim() || title;

        // Only add if we have a valid title and URL
        if (title && title.length > 10 && href) {
          const fullUrl = href.startsWith('http') ? href : `https://blog.bitpanda.com${href}`;
          const articleId = href.split('/').pop() || `article-${index}`;
          
          // Skip if already seen
          if (seenUrls.has(fullUrl)) {
            return;
          }
          seenUrls.add(fullUrl);
          
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
          if (combined.match(/surge|gain|rise|growth|bullish|high|win|success|secures|appointed|partnership|approval/i)) {
            sentiment = 'positive';
          } else if (combined.match(/fall|decline|loss|bearish|risk|volatility|crash|correction/i)) {
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
            title: title.length > 200 ? title.substring(0, 200) + '...' : title,
            description: description.length > 300 ? description.substring(0, 300) + '...' : description || title,
            summary: description.length > 150 ? description.substring(0, 150) + '...' : description || title,
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

      // Filter by category if specified
      let filteredArticles = articles;
      if (category && category !== 'all') {
        filteredArticles = articles.filter(article =>
          article.category === category ||
          article.coins.includes(category.toLowerCase())
        );
      }

      const result = filteredArticles.slice(0, limit);
      
      // If we didn't get enough articles, use fallback
      if (result.length === 0) {
        console.log('⚠️ No articles parsed from Bitpanda blog, using fallback');
        this.fetchStatus = {
          success: false,
          source: 'fallback',
          lastFetch: new Date().toISOString(),
          articlesCount: 0,
          error: 'No articles parsed from HTML'
        };
        return this.getFallbackNews(limit);
      }
      
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      // Update fetch status on success
      this.fetchStatus = {
        success: true,
        source: 'bitpanda-blog',
        lastFetch: new Date().toISOString(),
        articlesCount: result.length
      };
      
      console.log(`✅ Fetched ${result.length} articles from Bitpanda blog`);
      return result;
    } catch (error) {
      console.error('❌ Error fetching news from Bitpanda blog:', error);
      this.fetchStatus = {
        success: false,
        source: 'fallback',
        lastFetch: new Date().toISOString(),
        articlesCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
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

  getStatus(): FetchStatus {
    return { ...this.fetchStatus };
  }
}

export const newsService = new NewsService();
export type { NewsArticle, FetchStatus };
