import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("⚠️  DATABASE_URL is not set. Please create a PostgreSQL database in Replit.");
  console.error("📋 Instructions: See SETUP_DATABASE.md for step-by-step setup guide.");
  console.error("🔧 The app will continue but database operations will fail until DATABASE_URL is set.");
  // Don't exit in development, let the app start so user can set up database
}

export const pool = process.env.DATABASE_URL 
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

export const db = pool ? drizzle({ client: pool, schema }) : null;
