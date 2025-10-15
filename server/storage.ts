import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // ✅ Avoid IPv6 ENETUNREACH on Render

import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../shared/schema"; // adjust path if needed

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("❌ DATABASE_URL is not set in environment variables.");
}

// ✅ Append sslmode for hosted DBs
const connectionString = databaseUrl.includes("sslmode=")
  ? databaseUrl
  : `${databaseUrl}?sslmode=no-verify`;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Render uses managed SSL certs
  },
});

// ✅ Initialize Drizzle ORM
export const db = drizzle(pool, { schema });

// ✅ Optional singleton class for structured usage
class DatabaseStorage {
  public db = db;
  public schema = schema;
}

export const storage = new DatabaseStorage();