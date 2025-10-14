
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set. Please add your PostgreSQL connection string to Secrets.");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: false,
  // Add driver options for SSL
  ...(databaseUrl.includes('render.com') && {
    driver: 'pg',
    dbCredentials: {
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false
      }
    }
  })
});
