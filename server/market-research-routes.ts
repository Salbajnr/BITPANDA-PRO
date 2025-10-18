
import { Router } from 'express';
import { storage } from './storage';

const router = Router();

// Market research reports data
const marketReports = [
  {
    id: '1',
    title: 'Q4 2024 Cryptocurrency Market Outlook',
    description: 'Comprehensive analysis of market trends, institutional adoption, and regulatory developments',
    author: 'Dr. Sarah Chen',
    authorBio: 'Former Goldman Sachs strategist with 15+ years in financial markets',
    publishedAt: new Date().toISOString(),
    category: 'Market Analysis',
    premium: true,
    downloadUrl: '/api/research/download/1',
    readTime: 15,
    rating: 4.8,
    views: 2341,
    tags: ['Bitcoin', 'Ethereum', 'Institutional', 'Regulation'],
    summary: 'The cryptocurrency market is positioned for significant growth in Q4 2024, driven by institutional adoption and clearer regulatory frameworks.',
    content: `
      # Q4 2024 Cryptocurrency Market Outlook

      ## Executive Summary
      The cryptocurrency market enters Q4 2024 with unprecedented institutional backing and regulatory clarity. Our analysis indicates a strong bullish trajectory for major cryptocurrencies, supported by fundamental improvements in adoption and infrastructure.

      ## Key Market Drivers
      
      ### Institutional Adoption
      - Major pension funds allocating 2-5% to crypto
      - Corporate treasuries increasing Bitcoin holdings
      - Traditional banks launching crypto custody services

      ### Regulatory Environment
      - Clear frameworks emerging in major jurisdictions
      - ETF approvals creating easier access
      - Stablecoin regulations providing certainty

      ### Technical Infrastructure
      - Layer 2 solutions improving scalability
      - Cross-chain bridges enhancing interoperability
      - DeFi protocols maturing with better security

      ## Market Predictions

      ### Bitcoin (BTC)
      - Target: $85,000 - $100,000 by year-end
      - Key resistance: $75,000
      - Support levels: $58,000, $52,000

      ### Ethereum (ETH)
      - Target: $4,500 - $5,200 by year-end
      - Shanghai upgrade effects still materializing
      - Strong DeFi ecosystem growth

      ### Altcoin Outlook
      - Layer 1 protocols showing strength
      - AI and RWA tokens gaining traction
      - Meme coins remaining volatile

      ## Risk Factors
      - Macroeconomic headwinds
      - Regulatory surprises
      - Technical vulnerabilities
      - Market manipulation concerns

      ## Investment Recommendations
      
      ### Conservative Portfolio (60% allocation)
      - 40% Bitcoin
      - 35% Ethereum
      - 25% Diversified altcoins

      ### Aggressive Portfolio (20% allocation)
      - 30% Bitcoin
      - 25% Ethereum
      - 45% High-growth altcoins

      ### Risk Management
      - Dollar-cost averaging for entries
      - Stop-losses at key support levels
      - Portfolio rebalancing quarterly
      - Position sizing based on conviction

      ## Conclusion
      Q4 2024 presents a unique opportunity for cryptocurrency investors. The combination of institutional adoption, regulatory clarity, and technical improvements creates a favorable environment for sustained growth.
    `,
    keyFindings: [
      'Institutional adoption increased by 300% in 2024',
      'Bitcoin correlation with traditional assets decreased to 0.2',
      'DeFi TVL expected to reach $500B by year-end',
      'Regulatory clarity improving in major markets',
      'Layer 2 adoption growing 400% year-over-year'
    ],
    recommendations: [
      'Increase allocation to blue-chip cryptocurrencies',
      'Monitor regulatory developments closely',
      'Consider DeFi exposure through established protocols',
      'Implement systematic rebalancing strategy',
      'Maintain 10-20% cash for opportunities'
    ],
    methodology: 'Technical analysis, on-chain metrics, institutional flow analysis, regulatory assessment',
    riskRating: 'Medium-High',
    timeHorizon: '3-6 months'
  },
  {
    id: '2',
    title: 'DeFi Protocol Analysis: Yield Opportunities & Risk Assessment',
    description: 'In-depth research on current DeFi yield farming opportunities and comprehensive risk analysis',
    author: 'Michael Rodriguez',
    authorBio: 'DeFi researcher and former Ethereum Foundation contributor',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'DeFi Research',
    premium: false,
    downloadUrl: '/api/research/download/2',
    readTime: 12,
    rating: 4.6,
    views: 1829,
    tags: ['DeFi', 'Yield Farming', 'Risk Management', 'Smart Contracts'],
    summary: 'Current DeFi protocols offer attractive yields, but careful risk assessment is crucial for sustainable returns.',
    content: `
      # DeFi Protocol Analysis: Yield Opportunities & Risk Assessment

      ## Overview
      The DeFi landscape has matured significantly, offering various yield opportunities across lending, liquidity provision, and staking. This report analyzes the current state of DeFi yields and associated risks.

      ## Top Yield Opportunities

      ### Lending Protocols
      1. **Aave**: 3-8% APY on stablecoins
      2. **Compound**: 2-6% APY with COMP rewards
      3. **Euler**: Higher risk, 4-12% APY

      ### DEX Liquidity Provision
      1. **Uniswap V3**: 5-25% APY (concentrated liquidity)
      2. **Curve**: 4-15% APY (stable pairs)
      3. **Balancer**: 6-20% APY (weighted pools)

      ### Liquid Staking
      1. **Lido**: 4-5% APY (stETH)
      2. **Rocket Pool**: 4-5% APY (rETH)
      3. **Frax**: 5-6% APY (sfrxETH)

      ## Risk Analysis Framework

      ### Smart Contract Risk
      - Code audit quality and recency
      - Bug bounty programs
      - Historical security incidents
      - TVL and maturity metrics

      ### Liquidity Risk
      - Pool depth and trading volume
      - Impermanent loss calculations
      - Exit liquidity scenarios
      - Slippage analysis

      ### Regulatory Risk
      - Compliance status
      - Geographic restrictions
      - Token classification issues
      - Potential regulatory changes

      ## Protocol Deep Dives

      ### Uniswap V3 Analysis
      **Pros:**
      - Concentrated liquidity increases capital efficiency
      - Strong brand and adoption
      - Decentralized governance
      - Multiple fee tiers

      **Cons:**
      - Impermanent loss risk
      - Active management required
      - Gas costs for rebalancing
      - Complex position management

      **Risk Rating:** Medium
      **Recommended Allocation:** 5-15% of DeFi portfolio

      ### Aave Analysis
      **Pros:**
      - Battle-tested protocol
      - Strong safety module
      - Multiple asset support
      - Flash loan capabilities

      **Cons:**
      - Variable rate volatility
      - Liquidation risks
      - Governance token exposure
      - Centralization concerns

      **Risk Rating:** Low-Medium
      **Recommended Allocation:** 20-40% of DeFi portfolio

      ## Yield Optimization Strategies

      ### Conservative Strategy (60% allocation)
      - 40% Stablecoin lending (Aave/Compound)
      - 30% Liquid staking (Lido/Rocket Pool)
      - 30% Low-risk LP positions (Curve stable pairs)

      ### Balanced Strategy (30% allocation)
      - 25% Stablecoin lending
      - 25% Liquid staking
      - 25% Medium-risk LP positions
      - 25% Yield farming with rewards

      ### Aggressive Strategy (10% allocation)
      - 20% Concentrated liquidity (Uniswap V3)
      - 30% High-yield farming
      - 25% New protocol exposure
      - 25% Leveraged positions

      ## Risk Management Best Practices

      ### Diversification
      - Spread across multiple protocols
      - Mix of yield strategies
      - Different asset categories
      - Geographic protocol diversity

      ### Monitoring
      - Daily TVL checks
      - Yield rate tracking
      - Risk parameter changes
      - Protocol upgrade announcements

      ### Position Sizing
      - Never exceed 20% in single protocol
      - Limit new protocol exposure to 5%
      - Maintain emergency fund
      - Regular rebalancing schedule

      ## Conclusion
      DeFi yields remain attractive despite market volatility. Success requires disciplined risk management, continuous monitoring, and adaptive strategies. Focus on proven protocols while maintaining exposure to innovation.
    `,
    keyFindings: [
      'Average DeFi yields range from 3-15% APY across categories',
      'Smart contract risks remain primary concern for investors',
      'Liquidity provision shows most consistent risk-adjusted returns',
      'Protocol maturity strongly correlates with risk reduction',
      'Regulatory clarity needed for institutional adoption'
    ],
    recommendations: [
      'Diversify across multiple established protocols',
      'Monitor TVL changes and audit status regularly',
      'Start with conservative strategies before increasing risk',
      'Maintain 20-30% of portfolio in stablecoins',
      'Use position sizing to manage protocol concentration'
    ],
    methodology: 'Protocol analysis, yield tracking, risk modeling, historical performance review',
    riskRating: 'Medium',
    timeHorizon: '1-3 months'
  }
];

// Analyst insights data
const analystInsights = [
  {
    id: '1',
    analyst: {
      name: 'Elena Vasquez',
      title: 'Chief Crypto Strategist',
      firm: 'BlockCapital Research',
      rating: 4.9,
      bio: 'Former JPMorgan derivatives trader, 12+ years in crypto markets',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=100',
      achievements: ['Top 1% crypto analysts 2023', '95% accuracy rate', 'Featured in WSJ, Bloomberg'],
      totalInsights: 156,
      followers: 12400
    },
    title: 'Bitcoin Breaking Key Resistance at $68,000 - Next Target $78,000',
    content: `Technical analysis reveals Bitcoin is forming a classic bullish pennant pattern with strong volume confirmation above $68,000. 

Key technical indicators:
• RSI showing healthy momentum without overbought conditions
• Volume profile supporting the breakout
• 50-day MA providing strong support at $64,500
• Options flow indicating bullish sentiment

The break above $68,000 removes a significant resistance level that has been tested multiple times. Next major resistance sits at $75,000-$78,000 range, which coincides with the 1.618 Fibonacci extension from the previous cycle low.

Risk management: Stop-loss below $64,000 for swing trades. Position sizing should account for potential 15-20% drawdowns even in bullish scenarios.`,
    sentiment: 'bullish',
    confidence: 85,
    priceTarget: 78000,
    stopLoss: 64000,
    timeHorizon: '2-3 months',
    publishedAt: new Date().toISOString(),
    likes: 234,
    comments: 67,
    shares: 45,
    assets: ['Bitcoin'],
    tags: ['Technical Analysis', 'Breakout', 'Resistance', 'Volume'],
    chartUrl: '/api/charts/btc-analysis-1',
    updateCount: 3,
    accuracy: 89
  },
  {
    id: '2',
    analyst: {
      name: 'James Patterson',
      title: 'Senior Market Analyst',
      firm: 'CryptoFund Analytics',
      rating: 4.7,
      bio: 'Former BlackRock portfolio manager, institutional crypto specialist',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      achievements: ['Institutional Analyst of the Year 2023', 'CFA Charterholder'],
      totalInsights: 203,
      followers: 8900
    },
    title: 'Ethereum 2.0 Staking Yields Creating Institutional FOMO',
    content: `Ethereum's post-merge staking environment is attracting significant institutional attention as yields stabilize around 4-5% with potential for 6%+ during high network activity periods.

Key institutional drivers:
• Predictable yield generation comparable to traditional fixed income
• Lower correlation to equity markets than expected
• ESG compliance through proof-of-stake mechanism
• Regulatory clarity improving in major jurisdictions

Recent developments suggest major pension funds are completing their due diligence process for ETH allocation. The upcoming Dencun upgrade should further reduce L2 costs, driving more activity and higher staking rewards.

Institution positioning indicates accumulation phase, with custody solutions reporting 300% increase in ETH deposits over past quarter.`,
    sentiment: 'bullish',
    confidence: 78,
    priceTarget: 4200,
    timeHorizon: '4-6 months',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    likes: 189,
    comments: 42,
    shares: 31,
    assets: ['Ethereum'],
    tags: ['Staking', 'Institutional', 'Yield', 'ETH2.0'],
    chartUrl: '/api/charts/eth-analysis-1',
    updateCount: 1,
    accuracy: 87
  }
];

// Live commentary data
let liveCommentary = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    title: 'Bitcoin Volume Surge: 24h Volume Up 45%',
    content: 'Unusual trading volume detected across major exchanges. Institutional-sized orders contributing to increased activity. Watch for potential breakout above $68,500.',
    author: 'Market Monitor Bot',
    authorType: 'automated',
    priority: 'high',
    assets: ['Bitcoin'],
    impact: 'positive',
    sourceData: {
      volume24h: 28500000000,
      volumeChange: 45.2,
      largeOrders: 156,
      exchangesAffected: ['Coinbase', 'Binance', 'Kraken']
    }
  }
];

// Podcast data
const podcasts = [
  {
    id: '1',
    title: 'Crypto Market Weekly: ETF Approvals and Market Impact',
    description: 'Deep dive into recent ETF approvals and their long-term impact on cryptocurrency adoption and institutional investment flows',
    host: 'Alex Thompson',
    hostBio: 'Former CNBC anchor, crypto journalist since 2017',
    duration: 2340, // seconds
    publishedAt: new Date().toISOString(),
    audioUrl: '/api/podcasts/audio/1',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300',
    category: 'Market Analysis',
    episode: 156,
    season: 3,
    guests: [
      {
        name: 'Dr. Sarah Chen',
        title: 'Market Analyst',
        bio: 'Former Goldman Sachs strategist'
      },
      {
        name: 'Michael Rodriguez',
        title: 'DeFi Researcher',
        bio: 'Ethereum Foundation contributor'
      }
    ],
    transcript: 'Full transcript available after authentication...',
    keyTopics: ['ETF Approvals', 'Institutional Adoption', 'Market Trends', 'Regulation'],
    chapters: [
      { title: 'ETF Market Overview', timestamp: 0 },
      { title: 'Institutional Impact Analysis', timestamp: 420 },
      { title: 'Future Outlook', timestamp: 1200 },
      { title: 'Q&A Session', timestamp: 1800 }
    ],
    downloads: 4521,
    rating: 4.7,
    reviews: 89
  }
];

// Get market research reports
router.get('/reports', async (req, res) => {
  try {
    const { category, premium, author, limit = 10, offset = 0 } = req.query;

    let filteredReports = [...marketReports];

    if (category && category !== 'all') {
      filteredReports = filteredReports.filter(report =>
        report.category.toLowerCase() === category.toString().toLowerCase()
      );
    }

    if (premium !== undefined) {
      filteredReports = filteredReports.filter(report =>
        report.premium === (premium === 'true')
      );
    }

    if (author) {
      filteredReports = filteredReports.filter(report =>
        report.author.toLowerCase().includes(author.toString().toLowerCase())
      );
    }

    const startIndex = parseInt(offset.toString());
    const endIndex = startIndex + parseInt(limit.toString());
    const paginatedReports = filteredReports.slice(startIndex, endIndex);

    res.json({
      reports: paginatedReports,
      total: filteredReports.length,
      hasMore: endIndex < filteredReports.length
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Failed to fetch research reports' });
  }
});

// Get single research report
router.get('/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const report = marketReports.find(r => r.id === id);

    if (!report) {
      return res.status(404).json({ message: 'Research report not found' });
    }

    // Increment view count (in production, store in database)
    report.views += 1;

    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Failed to fetch research report' });
  }
});

// Get analyst insights
router.get('/insights', async (req, res) => {
  try {
    const { analyst, sentiment, asset, limit = 10, offset = 0 } = req.query;

    let filteredInsights = [...analystInsights];

    if (analyst) {
      filteredInsights = filteredInsights.filter(insight =>
        insight.analyst.name.toLowerCase().includes(analyst.toString().toLowerCase())
      );
    }

    if (sentiment && sentiment !== 'all') {
      filteredInsights = filteredInsights.filter(insight =>
        insight.sentiment === sentiment
      );
    }

    if (asset) {
      filteredInsights = filteredInsights.filter(insight =>
        insight.assets.some(a => a.toLowerCase().includes(asset.toString().toLowerCase()))
      );
    }

    const startIndex = parseInt(offset.toString());
    const endIndex = startIndex + parseInt(limit.toString());
    const paginatedInsights = filteredInsights.slice(startIndex, endIndex);

    res.json({
      insights: paginatedInsights,
      total: filteredInsights.length,
      hasMore: endIndex < filteredInsights.length
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ message: 'Failed to fetch analyst insights' });
  }
});

// Get live commentary
router.get('/commentary', async (req, res) => {
  try {
    const { priority, asset, limit = 20 } = req.query;

    let filteredCommentary = [...liveCommentary];

    if (priority && priority !== 'all') {
      filteredCommentary = filteredCommentary.filter(comment =>
        comment.priority === priority
      );
    }

    if (asset) {
      filteredCommentary = filteredCommentary.filter(comment =>
        comment.assets.some(a => a.toLowerCase().includes(asset.toString().toLowerCase()))
      );
    }

    // Sort by timestamp (newest first)
    filteredCommentary.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const limitedCommentary = filteredCommentary.slice(0, parseInt(limit.toString()));

    res.json({
      commentary: limitedCommentary,
      total: filteredCommentary.length
    });
  } catch (error) {
    console.error('Error fetching commentary:', error);
    res.status(500).json({ message: 'Failed to fetch live commentary' });
  }
});

// Add new live commentary (for real-time updates)
router.post('/commentary', async (req, res) => {
  try {
    const { title, content, author, priority, assets, impact } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newCommentary = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      title,
      content,
      author,
      authorType: 'manual',
      priority: priority || 'medium',
      assets: assets || [],
      impact: impact || 'neutral'
      ,
      sourceData: {
        volume24h: 0,
        volumeChange: 0,
        largeOrders: 0,
        exchangesAffected: []
      }
    };

    liveCommentary.unshift(newCommentary);

    // Keep only last 100 commentary items
    if (liveCommentary.length > 100) {
      liveCommentary = liveCommentary.slice(0, 100);
    }

    res.status(201).json(newCommentary);
  } catch (error) {
    console.error('Error adding commentary:', error);
    res.status(500).json({ message: 'Failed to add live commentary' });
  }
});

// Get podcasts
router.get('/podcasts', async (req, res) => {
  try {
    const { category, host, limit = 10, offset = 0 } = req.query;

    let filteredPodcasts = [...podcasts];

    if (category && category !== 'all') {
      filteredPodcasts = filteredPodcasts.filter(podcast =>
        podcast.category.toLowerCase() === category.toString().toLowerCase()
      );
    }

    if (host) {
      filteredPodcasts = filteredPodcasts.filter(podcast =>
        podcast.host.toLowerCase().includes(host.toString().toLowerCase())
      );
    }

    const startIndex = parseInt(offset.toString());
    const endIndex = startIndex + parseInt(limit.toString());
    const paginatedPodcasts = filteredPodcasts.slice(startIndex, endIndex);

    res.json({
      podcasts: paginatedPodcasts,
      total: filteredPodcasts.length,
      hasMore: endIndex < filteredPodcasts.length
    });
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    res.status(500).json({ message: 'Failed to fetch podcasts' });
  }
});

// Get single podcast
router.get('/podcasts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const podcast = podcasts.find(p => p.id === id);

    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    res.json(podcast);
  } catch (error) {
    console.error('Error fetching podcast:', error);
    res.status(500).json({ message: 'Failed to fetch podcast' });
  }
});

// Search across all content types
router.get('/search', async (req, res) => {
  try {
    const { query, type = 'all', limit = 20 } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchTerm = query.toString().toLowerCase();
    const results: any = {
      reports: [],
      insights: [],
      podcasts: [],
      commentary: []
    };

    if (type === 'all' || type === 'reports') {
      results.reports = marketReports.filter(report =>
        report.title.toLowerCase().includes(searchTerm) ||
        report.description.toLowerCase().includes(searchTerm) ||
        report.author.toLowerCase().includes(searchTerm) ||
        report.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (type === 'all' || type === 'insights') {
      results.insights = analystInsights.filter(insight =>
        insight.title.toLowerCase().includes(searchTerm) ||
        insight.content.toLowerCase().includes(searchTerm) ||
        insight.analyst.name.toLowerCase().includes(searchTerm) ||
        insight.assets.some(asset => asset.toLowerCase().includes(searchTerm))
      );
    }

    if (type === 'all' || type === 'podcasts') {
      results.podcasts = podcasts.filter(podcast =>
        podcast.title.toLowerCase().includes(searchTerm) ||
        podcast.description.toLowerCase().includes(searchTerm) ||
        podcast.host.toLowerCase().includes(searchTerm) ||
        podcast.keyTopics.some(topic => topic.toLowerCase().includes(searchTerm))
      );
    }

    if (type === 'all' || type === 'commentary') {
      results.commentary = liveCommentary.filter(comment =>
        comment.title.toLowerCase().includes(searchTerm) ||
        comment.content.toLowerCase().includes(searchTerm) ||
        comment.assets.some(asset => asset.toLowerCase().includes(searchTerm))
      );
    }

    res.json(results);
  } catch (error) {
    console.error('Error searching content:', error);
    res.status(500).json({ message: 'Failed to search content' });
  }
});

// Get market research analytics
router.get('/analytics', async (req, res) => {
  try {
    const analytics = {
      totalReports: marketReports.length,
      premiumReports: marketReports.filter(r => r.premium).length,
      totalInsights: analystInsights.length,
      totalPodcasts: podcasts.length,
      totalCommentary: liveCommentary.length,
      topCategories: [
        { name: 'Market Analysis', count: 1 },
        { name: 'DeFi Research', count: 1 },
        { name: 'Technical Analysis', count: 2 }
      ],
      topAnalysts: analystInsights.map(i => ({
        name: i.analyst.name,
        firm: i.analyst.firm,
        rating: i.analyst.rating,
        insights: 1
      })),
      recentActivity: {
        reports: marketReports.length,
        insights: analystInsights.length,
        podcasts: podcasts.length,
        commentary: liveCommentary.filter(c =>
          new Date(c.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
        ).length
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

export default router;
