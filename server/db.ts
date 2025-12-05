// server/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";
import { formatDatabaseUrl, isDatabaseUrlValid } from "./database-utils";

let databaseUrl = process.env.DATABASE_URL || "";

if (!databaseUrl) {
  console.warn("⚠️ No DATABASE_URL found. Running in demo (mock DB) mode.");
} else if (!isDatabaseUrlValid(databaseUrl)) {
  console.warn("⚠️ Invalid DATABASE_URL format. Running in demo mode.");
  console.log("🔧 Expected format: postgresql://user:password@host:port/database");
  databaseUrl = "";
} else {
  try {
    databaseUrl = formatDatabaseUrl(databaseUrl);
    console.log("🔌 Database URL formatted successfully.");
  } catch (err) {
    console.error("❌ Error formatting DATABASE_URL:", err);
    databaseUrl = "";
  }
}

export const pool: Pool | null = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      application_name: "bitpanda-app",
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
      ssl:
        process.env.NODE_ENV === "production" ||
        databaseUrl.includes("render.com") ||
        databaseUrl.includes("supabase.co")
          ? { rejectUnauthorized: false }
          : false,
    })
  : null;

// Safe Drizzle instance (null if no pool)
export const db = pool ? drizzle(pool, { schema }) : null;

// ✅ Test connection automatically (non-blocking)
if (pool) {
  (async function testConnection(retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const client = await pool.connect();
        await client.query("SELECT NOW()");
        client.release();
        console.log("✅ Database connected successfully");
        return;
      } catch (err: any) {
        console.error(`❌ Database connection attempt ${i + 1} failed: ${err.message}`);
        if (i < retries - 1) {
          console.log("🔄 Retrying in 2 seconds...");
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    }
    console.error("🔧 Check your DATABASE_URL environment variable and try again.");
  })();
} else {
  console.error("❌ No database connection established. Please set your DATABASE_URL.");
}