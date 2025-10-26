# BitpandaPro - Cryptocurrency Trading Platform

## Overview
A full-stack cryptocurrency trading platform with real-time price updates, portfolio management, and comprehensive admin dashboard. Fully configured for Replit development and production deployment.

## Recent Changes
- **2025-10-26**: Project optimized for Replit deployment
  - ✅ Installed all dependencies (root, client, server)
  - ✅ Configured unified build process for combined deployment
  - ✅ Removed unnecessary deployment files (Docker, nginx, render.yaml)
  - ✅ Fixed dependency conflicts (drizzle-orm, drizzle-zod, nanoid hoisted to root)
  - ✅ Configured development workflow (frontend port 5000, backend port 3000)
  - ✅ Set up deployment configuration (VM with build step)
  - ✅ Updated build scripts for production-ready deployment

## Project Architecture

### Technology Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Radix UI, Wouter
- **Backend**: Node.js, Express, TypeScript, Drizzle ORM, PostgreSQL
- **Real-time**: WebSockets, Server-Sent Events (SSE)
- **External APIs**: CoinGecko (crypto prices), NewsAPI, Metals API

### Directory Structure
```
project/
├── client/                     # Vite frontend (React)
│   ├── src/                   # React components and pages
│   ├── public/                # Static assets
│   ├── dist/                  # Build output (after npm run build)
│   ├── vite.config.js         # Vite configuration
│   └── package.json           # Client dependencies
│
├── server/                     # Express backend (TypeScript)
│   ├── *.ts                   # Server routes and services
│   ├── drizzle/               # Database migrations
│   └── package.json           # Server dependencies
│
├── shared/                     # Shared code
│   └── schema.ts              # Database schema (Drizzle)
│
├── package.json                # Root package with build scripts
└── README.md                   # Documentation
```

## Development

### Required Environment Variables
- `COOKIE_SECRET` - **REQUIRED** - Session signing key (min 32 chars)

### Optional Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (runs in demo mode without it)
- `COINGECKO_API_KEY` - For cryptocurrency price data
- `NEWS_API_KEY` - For news aggregation
- `METALS_API_KEY` - For precious metals pricing
- `SENDGRID_API_KEY` - For email notifications

### Running Development Server
The app uses a unified workflow that runs both frontend and backend:
```bash
npm run dev
```

This concurrently runs:
- **Frontend** (Vite dev server): `http://localhost:5000`
- **Backend** (Express API): `http://localhost:3000`

The frontend proxies `/api/*` requests to the backend automatically.

### Building for Production
```bash
npm run build
```

This builds the frontend (Vite) to `client/dist/`. The backend runs with TypeScript using `tsx` (no compilation needed).

### Starting Production Server
```bash
npm start
```

This runs the server in production mode:
- Serves the built frontend from `client/dist/`
- Runs the backend API on port 5000
- Handles client-side routing

## Database

### Schema
Database schema is defined in `shared/schema.ts` using Drizzle ORM.

### Commands
```bash
npm run db:push      # Sync schema to database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
```

### Demo Mode vs Database Mode
- **Without DATABASE_URL**: The app runs in demo mode. Some features will log errors (price alerts, portfolio persistence) but the core UI and real-time price tracking work.
- **With DATABASE_URL**: Set `DATABASE_URL` in Secrets, then run `npm run db:push` to create all required tables for full functionality.

## Deployment (Replit)

### Deployment Configuration
- **Type**: VM (always-running server with WebSocket support)
- **Build**: `npm run build` (builds client static files)
- **Run**: `npm start` (serves combined app on port 5000)

### Before Deploying
1. **Required**: Set `COOKIE_SECRET` in Replit Secrets (32+ character random string)
2. **Optional**: Add `DATABASE_URL` for full database features
   - After adding DATABASE_URL, run `npm run db:push` to create tables
   - Without it, the app runs in demo mode (some features log errors)
3. **Optional**: Add API keys for external services (COINGECKO_API_KEY, NEWS_API_KEY, METALS_API_KEY)

### Publishing
Click the "Publish" button in Replit to deploy to production.

## Key Features
- Real-time cryptocurrency price tracking (100+ coins)
- Trading interface with buy/sell capabilities
- Portfolio management and analytics
- KYC verification system
- Deposit/withdrawal management
- Admin dashboard with comprehensive controls
- Multi-language support (EN, DE, ES, FR, ZH)
- WebSocket real-time updates
- News integration and price alerts

## Technical Notes

### Dependency Management
- **Shared dependencies** (drizzle-orm, drizzle-zod, nanoid) installed at root level
- Client and server have their own package.json for specific dependencies
- No duplicate installations to avoid TypeScript type conflicts

### Port Configuration
- **Development**: Frontend (5000), Backend (3000)
- **Production**: Single server on port 5000 serving both frontend and API

### Caching
The server disables browser caching in development. For production, consider adding cache headers for static assets.
