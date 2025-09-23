import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from "drizzle-orm/neon-serverless";
import { sql } from "drizzle-orm";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use Replit's built-in PostgreSQL database
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("⚠️  No database URL found. Please set DATABASE_URL.");
  console.error("🔧 The app will continue but database operations will fail until a database URL is set.");
}

console.log("🔌 Attempting to connect to database...");
console.log(databaseUrl ? '📍 Using database: Replit PostgreSQL' : '❌ DATABASE_URL not configured');

export const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
      connectionTimeoutMillis: 2000, // Connection timeout
    })
  : null;

export const db = drizzle({ client: pool!, schema });

// Enhanced connection testing with retry logic
if (pool) {
  const testConnection = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const client = await pool.connect();
        console.log("✅ Database connected successfully");
        client.release();

        // Test a simple query
        await db.execute(sql`SELECT 1`);
        console.log("✅ Database query test successful");
        return;
      } catch (err: any) {
        console.error(`❌ Database connection attempt ${i + 1} failed:`, err.message);
        if (i === retries - 1) {
          console.error("🔧 Please check your DATABASE_URL and network connection");
          console.error("⚠️  Database operations will be limited until connection is restored");
        } else {
          console.log(`🔄 Retrying connection in 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
  };

  testConnection();
} else {
  console.warn("⚠️ Running without database connection - some features will be limited");
}