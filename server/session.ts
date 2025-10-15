import session from 'express-session';
import connectPg from 'connect-pg-simple';

export function createSessionMiddleware() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);

  // Use DATABASE_URL or construct from individual PostgreSQL environment variables
  let databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl && process.env.PGHOST) {
    const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env;
    const encodedPassword = encodeURIComponent(PGPASSWORD || '');
    databaseUrl = `postgresql://${PGUSER}:${encodedPassword}@${PGHOST}:${PGPORT}/${PGDATABASE}`;
  }

  const sessionStore = new pgStore({
    conString: databaseUrl,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  return session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to false for development
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax', // Important for cross-origin requests
    },
    name: 'sessionId', // Custom session name
  });
}