import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.RENDER_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("RENDER_DATABASE_URL or DATABASE_URL must be set");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  },
});
