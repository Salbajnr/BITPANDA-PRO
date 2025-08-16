import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use RENDER_DATABASE_URL if available, otherwise fall back to DATABASE_URL
const databaseUrl = process.env.RENDER_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("⚠️  DATABASE_URL is not set. Please create a PostgreSQL database in Replit.");
  console.error("📋 Instructions: See SETUP_DATABASE.md for step-by-step setup guide.");
  console.error("🔧 The app will continue but database operations will fail until DATABASE_URL is set.");
  // Don't exit in development, let the app start so user can set up database
}

console.log("🔌 Attempting to connect to database...");

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
