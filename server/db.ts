import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { Pool } from 'pg';
import * as schema from "@shared/schema";
import { formatDatabaseUrl, isDatabaseUrlValid } from "./database-utils";

let databaseUrl: string | undefined = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("⚠️  No DATABASE_URL found. Running in demo mode.");
  console.log("🔧 To enable full functionality, add DATABASE_URL in Replit Secrets");
} else if (!isDatabaseUrlValid(databaseUrl)) {
  console.warn("⚠️  Invalid database URL format. Running in demo mode.");
  console.log("🔧 Expected format: postgresql://user:password@host:port/database");
  databaseUrl = undefined;
} else {
  console.log("🔌 Attempting to connect to database...");
  const dbType = databaseUrl.includes('render.com') ? 'Render PostgreSQL' :
                 databaseUrl.includes('neon.tech') ? 'Neon PostgreSQL' :
                 'PostgreSQL';
  console.log(`📍 Using database: ${dbType}`);

  try {
    databaseUrl = formatDatabaseUrl(databaseUrl);
    console.log('🔧 Database URL formatted and validated');
  } catch (err) {
    console.error('❌ Error processing database URL:', err);
    databaseUrl = undefined;
  }
}

export const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 60000,
      application_name: 'bitpanda-app',
      ssl: databaseUrl.includes('render.com') || databaseUrl.includes('neon.tech')
        ? { rejectUnauthorized: false }
        : false,
    })
  : null;

const mockDb = {
  select: () => ({ from: () => ({ execute: async () => [] }) }),
  insert: () => ({ values: () => ({ execute: async () => [] }) }),
  update: () => ({ set: () => ({ where: () => ({ execute: async () => [] }) }) }),
  delete: () => ({ where: () => ({ execute: async () => [] }) }),
};

export const db = pool ? drizzle(pool, { schema }) : mockDb as any;

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
