import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Use Supabase PostgreSQL database
// Password special characters must be URL-encoded: ? = %3F, @ = %40, $ = %24
const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:8Characterslong%3F%40%24@db.qqjvozsmlumssmmknjwf.supabase.co:5432/postgres';

if (!databaseUrl) {
  console.error("⚠️  No database URL found. Please set DATABASE_URL.");
  console.error("🔧 The app will continue but database operations will fail until a database URL is set.");
}

console.log("🔌 Attempting to connect to database...");
console.log(databaseUrl ? '📍 Using database: Supabase PostgreSQL' : '❌ DATABASE_URL not configured');

export const pool = databaseUrl
  ? postgres(databaseUrl, {
      max: 20,
      idle_timeout: 30,
      connect_timeout: 2,
    })
  : null;

export const db = drizzle(pool!, { schema });

// Enhanced connection testing with retry logic
if (pool) {
  const testConnection = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        // Test a simple query
        await db.execute(sql`SELECT 1`);
        console.log("✅ Database connected successfully");
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