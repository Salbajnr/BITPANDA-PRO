
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
  try {
    // Extract password and encode it properly
    const urlPattern = /^postgresql:\/\/([^:]+):([^@]+)@(.+)$/;
    const match = databaseUrl.match(urlPattern);
    
    if (match) {
      const [, username, password, rest] = match;
      
      // Check if password contains special characters that need encoding
      const specialChars = ['?', '@', '$', '#', '&', '%', '/', ':', '='];
      const hasSpecialChars = specialChars.some(char => password.includes(char));
      
      if (hasSpecialChars) {
        // Always encode the password to ensure proper URL format
        const encodedPassword = encodeURIComponent(password);
        databaseUrl = `postgresql://${username}:${encodedPassword}@${rest}`;
        console.log('🔧 Encoded special characters in password');
      }
    }
  } catch (err) {
    console.error('❌ Error processing database URL:', err);
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
