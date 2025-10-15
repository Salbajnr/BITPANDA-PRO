import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Prioritize DATABASE_URL from secrets/env over Replit PostgreSQL credentials
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.PGHOST && process.env.PGPORT && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE) {
  const encodedPassword = encodeURIComponent(process.env.PGPASSWORD);
  databaseUrl = `postgresql://${process.env.PGUSER}:${encodedPassword}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
  console.log('🔧 Using Replit PostgreSQL database');
} else if (databaseUrl) {
  console.log('🔧 Using external DATABASE_URL');
}

if (!databaseUrl) {
  console.error("⚠️  No database URL found. Please set DATABASE_URL in Secrets.");
  console.error("🔧 The app will continue but database operations will fail until a database URL is set.");
} else {
  console.log("🔌 Attempting to connect to database...");
  const dbType = databaseUrl.includes('dpg-d3aj6n24d50c73dbk27g-a') ? 'Render PostgreSQL' :
                 databaseUrl.includes('dbphpapi') ? 'Render PostgreSQL' :
                 databaseUrl.includes('helium') ? 'Replit PostgreSQL' : 'PostgreSQL';
  console.log(`📍 Using database: ${dbType}`);

  try {
    // Extract and encode password if needed
    const urlPattern = /^postgresql:\/\/([^:]+):([^@]+)@(.+)$/;
    const match = databaseUrl.match(urlPattern);

    if (match) {
      const [, username, password, rest] = match;

      // Check if password needs encoding (contains special characters and is not already encoded)
      const needsEncoding = /[?@$#&%/:=]/.test(password) && !/%.{2}/.test(password);

      if (needsEncoding) {
        const encodedPassword = encodeURIComponent(password);
        databaseUrl = `postgresql://${username}:${encodedPassword}@${rest}`;
        console.log('🔧 Encoded special characters in password');
      }
    }
  } catch (err) {
    console.error('❌ Error processing database URL:', err);
  }
}

export const pool = databaseUrl
  ? postgres(databaseUrl, {
      max: 20,
      idle_timeout: 30,
      connect_timeout: 60,
      // Add retry logic for connection failures
      connection: {
        application_name: 'bitpanda-app',
      },
      onnotice: () => {}, // Suppress notices
      onclose: () => {
        if (process.env.NODE_ENV !== 'test') {
          console.log('⚠️ Database connection closed, attempting reconnect...');
        }
      },
      onparameter: (key, value) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`🔧 Database parameter: ${key}=${value}`);
        }
      },
      ssl: (databaseUrl.includes('render.com') || databaseUrl.includes('neon.tech') || databaseUrl.includes('dbphpapi'))
        ? 'require'
        : false,
      fetch_types: false,
      prepare: false,
      // Force IPv4 to avoid IPv6 connectivity issues on some platforms
      host_type: 'tcp',
      socket: undefined
    })
  : null;

export const db = pool ? drizzle(pool, { schema }) : drizzle({} as any, { schema });

// Test connection
if (pool) {
  const testConnection = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        await db.execute(sql`SELECT 1`);
        console.log("✅ Database connected successfully");
        return;
      } catch (err: any) {
        console.error(`❌ Database connection attempt ${i + 1} failed:`, err.message);
        if (i === retries - 1) {
          console.error("🔧 Please check your DATABASE_URL in Secrets");
          console.error("⚠️  Database operations will be limited until connection is restored");
        } else {
          console.log(`🔄 Retrying in 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
  };

  testConnection();
} else {
  console.warn("⚠️ Running without database - some features will be limited");
}