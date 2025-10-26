# BitpandaPro - Cryptocurrency Trading Platform

## Overview
A full-stack cryptocurrency trading platform with real-time price updates, portfolio management, and comprehensive admin dashboard. Successfully imported from GitHub and configured for the Replit environment.

## Recent Changes
- **2025-10-26**: Project imported and configured for Replit
  - Installed all dependencies via Replit packager (vite, react, radix-ui, etc.)
  - Configured Vite with @ path aliases and allowed hosts for proxy support
  - Frontend running on port 5000 via workflow
  - Backend configured with PostgreSQL database connection
  - Fixed workspace dependency conflicts

## Project Architecture

### Technology Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Radix UI, Wouter
- **Backend**: Node.js, Express, TypeScript, PostgreSQL (Supabase), Drizzle ORM
- **Real-time**: WebSockets, Server-Sent Events (SSE)
- **APIs**: CoinGecko (crypto prices), NewsAPI, Metals API

### Directory Structure
```
├── client/          # React frontend (port 5000)
├── server/          # Express backend API
├── shared/          # Shared schemas and types
└── node_modules/    # Root-level dependencies
```

## Development

### Environment Variables
The app uses these key environment variables:
- `DATABASE_URL` - PostgreSQL connection string (Supabase)
- `PORT` - Backend port (10000 in production, 3000 in dev)
- `NODE_ENV` - Environment mode (production/development)
- `METALS_API_KEY` - For precious metals pricing
- `NEWS_API_KEY` - For news integration (optional)
- `COINGECKO_API_KEY` - For crypto data (optional)

### Running Locally
Frontend (configured as workflow):
```bash
cd client && npx vite
```

Backend:
```bash
cd server && npx tsx watch index.ts
```

### Database
- **Schema**: Defined in `shared/schema.ts`
- **Sync Schema**: `npm run db:push --force`
- **Studio**: `npm run db:studio`

The app can run in demo mode without a database connection.

## Key Features
- Real-time cryptocurrency price tracking (100+ coins)
- Trading interface with buy/sell capabilities
- Portfolio management and analytics
- KYC verification system
- Deposit/withdrawal management
- Admin dashboard with comprehensive controls
- Multi-language support (EN, DE, ES, FR, ZH)
- News integration and price alerts

## User Preferences
- Vite configured with `allowedHosts: true` for Replit proxy
- Path alias `@/` points to `client/src/`
- Radix UI for accessible component primitives
- Tailwind CSS with PostCSS for styling

## Known Issues
1. **LiveTicker.tsx**: Has duplicate code causing transform errors - needs cleanup
2. **Database Connection**: Shows warnings when CONNECTION terminated (connection pooling issue)
3. **Missing Dependencies**: Some optional features need API keys to work fully

## Next Steps
1. Fix LiveTicker.tsx syntax errors (lines 1-40 have duplicates)
2. Test backend API endpoints with database
3. Configure deployment for production
4. Add missing API keys for full functionality
