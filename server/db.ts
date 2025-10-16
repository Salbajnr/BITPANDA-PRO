import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { Pool } from 'pg';
import * as schema from "@shared/schema";
import { formatDatabaseUrl, isDatabaseUrlValid } from "./database-utils";

// Prioritize DATABASE_URL from secrets/env over Replit PostgreSQL credentials
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.PGHOST && process.env.PGPORT && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE) {
  const encodedPassword = encodeURIComponent(process.env.PGPASSWORD);
  databaseUrl = `postgresql://${process.env.PGUSER}:${encodedPassword}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
  console.log('🔧 Using Replit PostgreSQL database');
} else if (databaseUrl) {
  console.log('🔧 Using external DATABASE_URL');
}

if (!databaseUrl) {
  console.error("⚠️  No database URL found. Please set DATABASE_URL in Secrets.");
  console.error("🔧 The app will continue but database operations will fail until a database URL is set.");
} else if (!isDatabaseUrlValid(databaseUrl)) {
  console.error("⚠️  Invalid database URL format. Please check your DATABASE_URL in Secrets.");
  console.error("🔧 Expected format: postgresql://user:password@host:port/database");
} else {
  console.log("🔌 Attempting to connect to database...");
  const dbType = databaseUrl.includes('dpg-d3aj6n24d50c73dbk27g-a') ? 'Render PostgreSQL' :
                 databaseUrl.includes('dbphpapi') ? 'Render PostgreSQL' :
                 databaseUrl.includes('helium') ? 'Replit PostgreSQL' : 'PostgreSQL';
  console.log(`📍 Using database: ${dbType}`);

  try {
    // Extract and encode password if needed
    const urlPattern = /^postgresql:\/\/([^:]+):([^@]+)@(.+)$/;
    const match = databaseUrl.match(urlPattern);

    databaseUrl = formatDatabaseUrl(databaseUrl);
    console.log('🔧 Database URL formatted and validated');
  } catch (err) {
    console.error('❌ Error processing database URL:', err);
  }
}


export const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 60000,
      application_name: 'bitpanda-app',
      ssl: (databaseUrl.includes('render.com') || databaseUrl.includes('neon.tech') || databaseUrl.includes('dbphpapi'))
        ? { rejectUnauthorized: false }
        : false,
    })
  : null;

export const db = pool ? drizzle(pool, { schema }) : drizzle({} as any, { schema });

// Test connection
if (pool) {
  const testConnection = async (retries = 2) => {
    for (let i = 0; i < retries; i++) {
      try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        console.log("✅ Database connected successfully");
        return;
      } catch (err: any) {
        console.error(`❌ Database connection attempt ${i + 1} failed: ${err.message}`);
        if (i < retries - 1) {
          console.log("🔄 Retrying in 1 second...");
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    console.error("🔧 Please check your DATABASE_URL environment variable");
    console.log("⚠️  Database operations will be limited until connection is restored");
  };

  testConnection();
} else {
  console.warn("⚠️ Running without database - some features will be limited");
}