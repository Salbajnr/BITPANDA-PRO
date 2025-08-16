
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
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
