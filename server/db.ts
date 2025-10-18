import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";
import { formatDatabaseUrl, isDatabaseUrlValid } from "./database-utils";

// ------------------
// Safe initialization
// ------------------
const rawUrl = process.env.DATABASE_URL;
let databaseUrl: string | undefined = rawUrl;

if (!databaseUrl) {
  console.warn("⚠️ No DATABASE_URL found. Running in demo mode.");
} else if (!isDatabaseUrlValid(databaseUrl)) {
  console.warn("⚠️ Invalid DATABASE_URL format. Running in demo mode.");
  databaseUrl = undefined;
} else {
  try {
    databaseUrl = formatDatabaseUrl(databaseUrl);
    console.log("🔧 Database URL validated");
  } catch (err) {
    console.error("❌ Error formatting database URL:", err);
    databaseUrl = undefined;
  }
}

// ------------------
// Initialize pool
// ------------------
export const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("render.com") || databaseUrl.includes("neon.tech")
        ? { rejectUnauthorized: false }
        : false,
      max: 10,
      idleTimeoutMillis: 30000,
    })
  : null;

// ------------------
// Safe mock fallback
// ------------------
const mockDb = {
  select: () => ({ from: () => ({ execute: async () => [] }) }),
  insert: () => ({ values: () => ({ execute: async () => [] }) }),
  update: () => ({ set: () => ({ where: () => ({ execute: async () => [] }) }) }),
  delete: () => ({ where: () => ({ execute: async () => [] }) }),
};

// ------------------
// Exported db instance
// ------------------
export const db = pool ? drizzle(pool, { schema }) : (mockDb as any);

// ------------------
// Connect *only at runtime*
// ------------------
export async function testConnection() {
  if (!pool) {
    console.warn("⚠️ Running without database - limited functionality.");
    return;
  }

  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    console.log("✅ Database connected successfully");
  } catch (err: any) {
    console.error("❌ Database connection failed:", err.message);
    console.log("🔧 Check your DATABASE_URL in Render environment variables");
  }
}}
