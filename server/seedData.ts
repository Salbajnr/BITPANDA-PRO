
import { db } from "./db";
import { cryptoAssets, users, portfolios } from "../shared/schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");
    
    // Seed initial crypto assets
    const assets = [
      { symbol: "BTC", name: "Bitcoin", currentPrice: "43250.00", marketCap: "847500000000.00", volume24h: "24000000000.00", priceChange24h: "2.45" },
      { symbol: "ETH", name: "Ethereum", currentPrice: "2680.50", marketCap: "322000000000.00", volume24h: "12000000000.00", priceChange24h: "-1.23" },
      { symbol: "SOL", name: "Solana", currentPrice: "98.75", marketCap: "43000000000.00", volume24h: "580000000.00", priceChange24h: "5.67" },
      { symbol: "ADA", name: "Cardano", currentPrice: "0.485", marketCap: "17000000000.00", volume24h: "340000000.00", priceChange24h: "3.21" },
      { symbol: "BNB", name: "BNB", currentPrice: "312.80", marketCap: "46000000000.00", volume24h: "1200000000.00", priceChange24h: "1.89" },
      { symbol: "MATIC", name: "Polygon", currentPrice: "0.89", marketCap: "8200000000.00", volume24h: "245000000.00", priceChange24h: "-0.75" },
      { symbol: "DOT", name: "Polkadot", currentPrice: "7.25", marketCap: "9100000000.00", volume24h: "180000000.00", priceChange24h: "4.12" },
      { symbol: "AVAX", name: "Avalanche", currentPrice: "36.50", marketCap: "13500000000.00", volume24h: "425000000.00", priceChange24h: "-2.18" },
    ];

    for (const asset of assets) {
      await db.insert(cryptoAssets).values(asset).onConflictDoNothing();
    }

    console.log("✅ Crypto assets seeded successfully");
    
    // Create portfolios for existing users who don't have one
    const existingUsers = await db.select().from(users);
    
    for (const user of existingUsers) {
      const existingPortfolio = await db.select().from(portfolios).where(eq(portfolios.userId, user.id));
      
      if (existingPortfolio.length === 0) {
        await db.insert(portfolios).values({
          userId: user.id,
          totalValue: "10000.00", // Give users $10,000 starting balance
          availableBalance: "10000.00",
          lockedBalance: "0.00"
        });
        console.log(`✅ Created portfolio for user ${user.email}`);
      }
    }

    console.log("🎉 Database seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Helper function to run seeding manually
if (require.main === module) {
  seedDatabase().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
