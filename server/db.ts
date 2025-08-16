import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
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
      ssl: {
        rejectUnauthorized: false
      }
    })
  : null;

export const db = pool ? drizzle({ client: pool, schema }) : null;

// Test the connection
if (pool) {
  pool.connect()
    .then(client => {
      console.log("✅ Database connected successfully");
      client.release();
    })
    .catch(err => {
      console.error("❌ Database connection failed:", err.message);
    });
}
