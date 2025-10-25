# BitpandaPro - Replit Setup

## Project Overview
A full-stack cryptocurrency trading platform with React frontend and Express backend.

## Recent Changes (Oct 25, 2025)
- Installed all project dependencies
- Updated Vite config to allow all hosts for Replit proxy compatibility
- Fixed special character encoding in database connection URLs

## Important Database Configuration

### Current Issue
The DATABASE_URL is using a direct Supabase connection (`db.qqjvozsmlumssmmknjwf.supabase.co`) which only supports IPv6. This causes DNS resolution failures on many platforms including Replit, Render, and Vercel.

### Solution for Multi-Environment Support
To make this work on **both Replit and external environments** (Render, Vercel, etc.), you need to update your DATABASE_URL to use Supabase's **pooler connection string**:

**Current (doesn't work):**
```
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

**Correct (works everywhere):**
```
postgresql://postgres.PROJECT_REF:password@aws-0-REGION.pooler.supabase.com:6543/postgres
```

**Where to find it:**
1. Go to your Supabase Dashboard
2. Click **"Connect"** button
3. Select **"Transaction"** mode (port 6543)
4. Copy the connection string
5. Update your Replit Secrets or environment variables

**Why this matters:**
- Direct connections only support IPv6
- Pooler connections support both IPv4 and IPv6
- Works on all deployment platforms (Replit, Render, Vercel, Railway, etc.)

### Alternative: Use Replit Database
For development in Replit only, you can use Replit's built-in PostgreSQL database. However, for production deployments on external platforms, you'll still need a cloud database like Supabase or Neon.

## Project Architecture

### Frontend (Port 5000)
- React 19 with TypeScript
- Vite dev server with HMR
- Tailwind CSS + Radix UI components
- Proxies API requests to backend on port 3000

### Backend (Port 3000)
- Express.js with TypeScript
- WebSocket support for real-time updates
- Drizzle ORM for database
- REST API endpoints

### Database Schema
- Located in `shared/schema.ts`
- Uses Drizzle ORM migrations
- Supports demo mode (no database required)

## Workflow Configuration
- **Frontend workflow**: Runs on port 5000 with `npm run dev:client`
- Backend starts automatically via frontend proxy

## User Preferences
- Keep existing project structure and conventions
- Use npm workspaces for monorepo setup
- TypeScript for all code
