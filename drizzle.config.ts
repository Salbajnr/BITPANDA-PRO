
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set. Please add your PostgreSQL connection string to Secrets.");
}

// Parse the URL and add SSL parameters if it's a Render/Neon database
function getConnectionUrl(url: string): string {
  if (url.includes('render.com') || url.includes('neon.tech') || url.includes('dbphpapi') || url.includes('dpg-')) {
    // Check if URL already has query parameters
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}sslmode=no-verify`;
  }
  return url;
}

export default defineConfig({
  out: "./drizzle",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: getConnectionUrl(databaseUrl),
  },
  verbose: true,
  strict: false,
});
