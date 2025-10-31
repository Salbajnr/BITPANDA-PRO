/**
 * Safely formats and validates a Postgres connection URL
 * for environments like Render, Replit, or local dev.
 */

export function formatDatabaseUrl(url: string): string {
  if (!url) {
    throw new Error("❌ DATABASE_URL is required but missing.");
  }

  try {
    // Some environments use DATABASE_URL with query params like ?sslmode=require
    const urlObj = new URL(url);

    // ✅ Encode password safely if it contains special characters
    if (urlObj.password && decodeURIComponent(urlObj.password) !== urlObj.password) {
      // Already encoded
    } else if (/[!@#$%^&*()+=\[\]{}|\\:";'<>?,/]/.test(urlObj.password)) {
      urlObj.password = encodeURIComponent(urlObj.password);
    }

    // ✅ Ensure SSL is required in production (Render/Postgres Cloud)
    if (process.env.NODE_ENV === "production") {
      const params = urlObj.searchParams;
      if (!params.has("sslmode")) {
        params.set("sslmode", "require");
      }
      if (!params.has("ssl")) {
        params.set("ssl", "true");
      }
      urlObj.search = params.toString();
    }

    return urlObj.toString();
  } catch (error) {
    console.warn("⚠️ Could not parse database URL — using as-is");
    return url.trim();
  }
}

/**
 * Checks if the DATABASE_URL is syntactically valid and points to Postgres.
 */
export function isDatabaseUrlValid(url: string): boolean {
  // Basic PostgreSQL URL validation - supports various formats including Supabase pooler
  const pattern = /^postgres(ql)?:\/\/[^:]+:[^@]+@[^:]+:\d+(\/[^?]*)(\?.*)?$/;
  return pattern.test(url);
}