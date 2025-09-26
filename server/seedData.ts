import { storage } from './storage';
import { hashPassword } from './simple-auth';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if admin user already exists
    const existingAdmin = await storage.getUserByEmail('admin@bitpanda.com');
    if (existingAdmin) {
      console.log('✅ Admin user already exists, skipping seed');
      return;
    }

    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const adminUser = await storage.createUser({
      username: 'admin',
      email: 'admin@bitpanda.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
    });

    // Create admin portfolio
    await storage.createPortfolio({
      userId: adminUser.id,
      totalValue: '100000.00',
      availableCash: '100000.00',
    });

    // Create demo user
    const demoPassword = await hashPassword('demo123');
    const demoUser = await storage.createUser({
      username: 'demo',
      email: 'demo@example.com',
      password: demoPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: 'user',
      isActive: true,
    });

    // Create demo portfolio with sample data
    const demoPortfolio = await storage.createPortfolio({
      userId: demoUser.id,
      totalValue: '15000.00',
      availableCash: '5000.00',
    });

    // Add sample holdings to demo portfolio
    const sampleHoldings = [
      { symbol: 'BTC', name: 'Bitcoin', amount: '0.5', price: '45000' },
      { symbol: 'ETH', name: 'Ethereum', amount: '5', price: '2500' },
      { symbol: 'ADA', name: 'Cardano', amount: '1000', price: '0.5' },
    ];

    for (const holding of sampleHoldings) {
      await storage.upsertHolding({
        portfolioId: demoPortfolio.id,
        assetType: 'crypto',
        symbol: holding.symbol,
        name: holding.name,
        amount: holding.amount,
        averagePurchasePrice: holding.price,
        currentPrice: holding.price,
      });

      // Create sample transaction
      await storage.createTransaction({
        userId: demoUser.id,
        type: 'buy',
        assetType: 'crypto',
        symbol: holding.symbol,
        amount: holding.amount,
        price: holding.price,
        total: (parseFloat(holding.amount) * parseFloat(holding.price)).toString(),
        status: 'completed',
      });
    }

    // Add sample news articles
    const newsArticles = [
      {
        title: 'Bitcoin Reaches New All-Time High',
        content: 'Bitcoin has surged to unprecedented levels as institutional adoption continues...',
        excerpt: 'BTC breaks resistance levels with strong market momentum',
        source: 'Crypto News',
        publishedAt: new Date(),
      },
      {
        title: 'Ethereum 2.0 Staking Rewards Increase',
        content: 'The latest Ethereum upgrade has improved staking rewards for validators...',
        excerpt: 'ETH staking becomes more attractive for long-term holders',
        source: 'DeFi Weekly',
        publishedAt: new Date(),
      }
    ];

    for (const article of newsArticles) {
      await storage.createNewsArticle(article);
    }

    // Create shared wallet addresses for deposits if they don't exist
    console.log('🏦 Setting up shared wallet addresses...');

    try {
      const existingAddresses = await storage.getSharedWalletAddresses();
      if (existingAddresses.length === 0) {
        const walletAddresses = [
          { symbol: 'BTC', name: 'Bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', network: 'mainnet' },
          { symbol: 'ETH', name: 'Ethereum', address: '0x742F96e08A82d6D91F1aE37df26B12C75a1cF86e', network: 'mainnet' },
          { symbol: 'USDT', name: 'Tether', address: '0x742F96e08A82d6D91F1aE37df26B12C75a1cF86e', network: 'ethereum' },
          { symbol: 'BNB', name: 'Binance Coin', address: 'bnb1jw7qkv5r8x3v4x8wqnrzr2t8s5k6g3h7d2f1a0', network: 'bsc' },
          { symbol: 'ADA', name: 'Cardano', address: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a6gtajun6cjskw3', network: 'cardano' },
          { symbol: 'SOL', name: 'Solana', address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', network: 'solana' },
          { symbol: 'XRP', name: 'Ripple', address: 'rDNvpSjsGdPaAHWMKhv8iPtF3mBYYR2PpK', network: 'xrpl' },
          { symbol: 'DOT', name: 'Polkadot', address: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5', network: 'polkadot' },
          { symbol: 'MATIC', name: 'Polygon', address: '0x742F96e08A82d6D91F1aE37df26B12C75a1cF86e', network: 'polygon' },
          { symbol: 'LINK', name: 'Chainlink', address: '0x742F96e08A82d6D91F1aE37df26B12C75a1cF86e', network: 'ethereum' }
        ];

        for (const address of walletAddresses) {
          await storage.createOrUpdateSharedWalletAddress(address);
        }

        console.log(`✅ Created ${walletAddresses.length} shared wallet addresses`);
      } else {
        console.log(`✅ Found ${existingAddresses.length} existing wallet addresses`);
      }
    } catch (error) {
      console.log('⚠️  Wallet addresses seeding skipped (method not available yet)');
    }


    console.log('✅ Database seeding completed successfully');
    console.log('📊 Created accounts:');
    console.log('   Admin: admin@bitpanda.com / admin123');
    console.log('   Demo:  demo@example.com / demo123');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}