# Database Setup Guide

## Current Status
The app is running in **demo mode** without a database. This is normal and expected if you don't have `DATABASE_URL` set.

## Database Errors (Expected in Demo Mode)
The errors you see like:
- "Cannot read properties of null (reading 'query')"
- "Database operation failed"

These are **normal** when running without a database. The app uses mock/in-memory data.

## Setting Up Database (Optional)

### Option 1: Use Free Cloud Database (Recommended)

1. **Create a free PostgreSQL database:**
   - [Neon](https://neon.tech) - Free tier available
   - [Supabase](https://supabase.com) - Free tier available
   - [Render](https://render.com) - Free PostgreSQL available

2. **Get connection string:**
   - Format: `postgresql://user:password@host:port/database`
   - Copy the connection string from your database provider

3. **Create `.env` file in project root:**
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   COOKIE_SECRET=your-32-character-secret-here
   ```

4. **Create database tables:**
   ```bash
   npm run db:push
   ```

### Option 2: Continue in Demo Mode
- ✅ App works without database
- ✅ Most features functional
- ⚠️ Data doesn't persist between restarts
- ⚠️ Some features show errors (expected)

## Commands

```bash
# Create/push database schema
npm run db:push

# Generate new migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## For Testing Without Database
The app is designed to work in demo mode. You can test:
- ✅ UI and navigation
- ✅ API endpoints (with mock data)
- ✅ Authentication flow (in-memory)
- ✅ Most features

Database is only needed for:
- Data persistence
- Production deployment
- Full feature set

