import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Fix DATABASE_URL encoding for special characters in password
function encodeDbUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    if (urlObj.password && !/^[a-zA-Z0-9_\-]*$/.test(urlObj.password)) {
      urlObj.password = encodeURIComponent(decodeURIComponent(urlObj.password));
    }
    return urlObj.toString();
  } catch (e) {
    // If URL parsing fails, try manual encoding of the password
    const match = url.match(/^(postgresql:\/\/[^:]+):([^@]+)@(.+)$/);
    if (match) {
      const [, prefix, password, suffix] = match;
      return `${prefix}:${encodeURIComponent(password)}@${suffix}`;
    }
    return url;
  }
}

const formattedUrl = encodeDbUrl(process.env.DATABASE_URL);

export default {
  schema: "../shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: formattedUrl,
  },
  // Only manage the 'public' schema
  schemaFilter: ["public"],
  // Exclude system tables/views
  tablesFilter: ["!pg_*", "!sql_*", "!cron.*", "!graphql_*"],
  // Don't try to drop system views
  verbose: true,
  strict: false // Set to false to be more permissive with schema changes
} satisfies Config;
