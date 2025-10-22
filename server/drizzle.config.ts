
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export default defineConfig({
  schema: "../shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL + (process.env.DATABASE_URL.includes('?') ? '&' : '?') + 'sslmode=require',
  },
  // Only manage the 'public' schema
  schemaFilter: ["public"],
  // Exclude system tables/views
  tablesFilter: ["!pg_*", "!sql_*", "!cron.*", "!graphql_*"],
  // Don't try to drop system views
  verbose: true,
  strict: false // Set to false to be more permissive with schema changes
});
