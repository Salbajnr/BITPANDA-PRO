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

export const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 60000,
      application_name: "bitpanda-app",
      ssl:
        process.env.NODE_ENV === "production" ||
        databaseUrl.includes("render.com") ||
        databaseUrl.includes("neon.tech")
          ? { rejectUnauthorized: false }
          : false,
    })
  : null;

// ✅ Create mock database fallback when no real DB is available
const mockDb = {
  select: () => ({ from: () => ({ execute: async () => [] }) }),
  insert: () => ({ values: () => ({ execute: async () => [] }) }),
  update: () => ({ set: () => ({ where: () => ({ execute: async () => [] }) }) }),
  delete: () => ({ where: () => ({ execute: async () => [] }) }),
};

// ✅ Use Drizzle ORM when pool is active
export const db = pool ? drizzle(pool, { schema }) : (mockDb as any);

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
  console.warn("⚠️ Running without database – only limited features are available.");
}