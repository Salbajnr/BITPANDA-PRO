import { defineConfig } from "drizzle-kit";

let databaseUrl = process.env.DATABASE_URL;

// Fallback to Replit PostgreSQL if DATABASE_URL is not set or points to unavailable Supabase
if ((!databaseUrl || databaseUrl.includes('supabase.co')) && process.env.PGHOST) {
  const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env;
  databaseUrl = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`;
  console.log("Using Replit PostgreSQL database for migrations");
}

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set. Please configure DATABASE_URL in Secrets or ensure Replit PostgreSQL is available.");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
});
