import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use Replit's built-in PostgreSQL database
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("⚠️  No database URL found. Please set DATABASE_URL.");
  console.error("🔧 The app will continue but database operations will fail until a database URL is set.");
}

console.log("🔌 Attempting to connect to database...");
console.log(databaseUrl ? '📍 Using database: Replit PostgreSQL' : '❌ DATABASE_URL not configured');

export const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false
      }
    })
  : null;

let client: postgres.Sql;
let db: ReturnType<typeof drizzle>;

try {
  client = postgres(process.env.DATABASE_URL!, {
    ssl: { rejectUnauthorized: false },
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  db = drizzle(client, { schema });

  console.log('✅ Database connection established');
} catch (error) {
  console.error('❌ Database connection failed:', error);
  throw error;
}

export { db, client };

// Test the connection
if (pool) {
  pool.connect()
    .then(client => {
      console.log("✅ Database connected successfully");
      client.release();
    })
    .catch(err => {
      console.error("❌ Database connection failed:", err.message);
      console.error("🔧 Please check your DATABASE_URL and network connection");
    });
} else {
  console.warn("⚠️ Running without database connection - some features will be limited");
}