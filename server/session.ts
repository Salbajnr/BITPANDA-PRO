import session from 'express-session';
import connectPg from 'connect-pg-simple';

export function createSessionMiddleware() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);

  // Use Replit PostgreSQL if DATABASE_URL points to unavailable Supabase
  let databaseUrl = process.env.DATABASE_URL;
  if ((!databaseUrl || databaseUrl.includes('render.com')) && process.env.PGHOST) {
    const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env;
    databaseUrl = `postgresql://dbphpapi_user:PwAbkFvraRC2fut81jGZjtHNOgs2lzi0@dpg-d3aj6n24d50c73dbk27g-a.oregon-postgres.render.com/dbphpapi?ssl=true`;
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