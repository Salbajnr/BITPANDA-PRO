import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("❌ DATABASE_URL is not set.");
}

function getConnectionUrl(url: string): string {
  const needsSSL =
    url.includes("render.com") ||
    url.includes("neon.tech") ||
    url.includes("supabase.co") ||
    url.includes("dpg-");

  if (needsSSL) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}sslmode=no-verify`;
  }
  return url;
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: getConnectionUrl(databaseUrl),
  },
  verbose: true,
  strict: true,
});