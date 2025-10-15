import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import dns from "dns";

// Only load .env if DATABASE_URL is not already set (prefer environment variables)
if (!process.env.DATABASE_URL) {
  dotenv.config();
}

// ✅ Force Node to prefer IPv4 for Render DBs
dns.setDefaultResultOrder("ipv4first");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("❌ DATABASE_URL is not set in .env file");
}

function getConnectionUrl(url: string): string {
  const needsSSL =
    url.includes("render.com") ||
    url.includes("neon.tech") ||
    url.includes("supabase.co") ||
    url.includes("dpg-");

  const separator = url.includes("?") ? "&" : "?";
  return needsSSL ? `${url}${separator}sslmode=no-verify` : url;
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./shared/schema.ts", // Path to your schema
  out: "./drizzle",             // Where to store migrations
  dbCredentials: {
    url: getConnectionUrl(databaseUrl),
  },
  verbose: true,
  strict: true,
});