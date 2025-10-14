
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set. Please add your PostgreSQL connection string to Secrets.");
}

// Add SSL parameter to connection string if it's a Render database
const connectionString = databaseUrl.includes('render.com') 
  ? `${databaseUrl}${databaseUrl.includes('?') ? '&' : '?'}sslmode=require`
  : databaseUrl;

export default defineConfig({
  out: "./drizzle",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
  verbose: true,
  strict: false,
});
