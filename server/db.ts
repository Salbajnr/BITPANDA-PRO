import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "@shared/schema";

let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("⚠️  No database URL found. Please set DATABASE_URL in Secrets.");
  console.error("🔧 The app will continue but database operations will fail until a database URL is set.");
}

console.log("🔌 Attempting to connect to database...");
console.log(databaseUrl ? '📍 Using database: Supabase PostgreSQL' : '❌ DATABASE_URL not configured');

if (databaseUrl) {
  const passwordRegex = /postgresql:\/\/([^:]+):([^@]+)@(.+)/;
  const match = databaseUrl.match(passwordRegex);
  
  if (match) {
    const [, username, password, rest] = match;
    // Only encode if password contains unencoded special characters
    // Check if password is already URL-encoded by looking for % followed by hex digits
    const isAlreadyEncoded = /%[0-9A-Fa-f]{2}/.test(password);
    
    if (!isAlreadyEncoded && (password.includes('?') || password.includes('@') || password.includes('$') || password.includes('#') || password.includes('&'))) {
      const encodedPassword = encodeURIComponent(password);
      databaseUrl = `postgresql://${username}:${encodedPassword}@${rest}`;
      console.log('🔧 URL-encoded special characters in password');
    } else if (isAlreadyEncoded) {
      console.log('✅ Password already URL-encoded, using as-is');
    }
  }
}

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