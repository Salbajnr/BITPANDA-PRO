import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres:8Characterslong?@$@db.qqjvozsmlumssmmknjwf.supabase.co:5432/postgres",
  },
  verbose: true,
  strict: true,
});
