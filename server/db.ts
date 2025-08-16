import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use only the Render database URL
const databaseUrl = process.env.RENDER_DATABASE_URL;

if (!databaseUrl) {
  console.error("⚠️  RENDER_DATABASE_URL is not set. Please provide your Render PostgreSQL connection string.");
  console.error("🔧 The app will continue but database operations will fail until RENDER_DATABASE_URL is set.");
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
