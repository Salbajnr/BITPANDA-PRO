# BitpandaPro - Cryptocurrency Trading Platform

## Overview
A full-stack cryptocurrency trading platform built with React, Node.js, Express, and PostgreSQL. This platform features real-time price updates, portfolio management, trading capabilities, an admin dashboard, and multi-language support.

**Current Status**: Successfully configured and running in Replit environment
**Last Updated**: November 26, 2025

## Project Architecture

### Tech Stack
**Frontend:**
- React 18/19 with TypeScript
- Vite 7.2.4 (dev server and build tool)
- Tailwind CSS for styling
- Radix UI for accessible components
- Wouter for routing
- React Query for data fetching
- Recharts for data visualization

**Backend:**
- Node.js with Express.js
- TypeScript
- PostgreSQL (via Drizzle ORM)
- WebSocket for real-time features
- Passport.js for authentication (OAuth support for Google, Facebook, Apple)
- Multer for file uploads

**External APIs:**
- CoinGecko (cryptocurrency prices)
- NewsAPI (news aggregation)
- Metals API (precious metals pricing)

### Directory Structure
```
bitpandapro/
├── client/              # React frontend application
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   └── vite.config.js  # Vite configuration
├── server/             # Node.js backend
│   ├── routes/         # API route handlers
│   ├── services/       # Business logic services
│   ├── drizzle/        # Database migrations
│   └── index.ts        # Server entry point
├── shared/             # Shared code (schema definitions)
└── docs/               # Complete documentation
```

## Replit Configuration

### Port Configuration
- **Frontend**: Port 5000 (0.0.0.0) - Configured for Replit webview
- **Backend**: Port 3000 (localhost) - Internal API server
- Vite proxy configured to route `/api` requests to backend

### Environment Variables
The application loads environment variables from the root `.env` file (managed via Replit Secrets). The app is configured to run in demo mode without a database. To enable full functionality:

**Required for Development:**
- `BACKEND_PORT=3000` - Backend server port
- `COOKIE_SECRET` - Session cookie secret (auto-generated in dev mode if not set)

**Required for Production:**
- `DATABASE_URL` - PostgreSQL connection string (use Replit Database tool)
- `COOKIE_SECRET` - Session cookie secret (add via Replit Secrets)
- `NODE_ENV=production` - Set environment to production

**Optional (Enhanced Features):**
- `COINGECKO_API_KEY` - Cryptocurrency price data
- `NEWS_API_KEY` - News aggregation
- `METALS_API_KEY` - Precious metals pricing
- OAuth credentials for Google, Facebook, Apple login

**Important Security Notes:**
- Never commit secrets to the repository
- Use Replit Secrets to manage all sensitive environment variables
- The root `.env` file should be managed through Replit's Secrets interface
- A previous `server/.env` file has been removed for security reasons

### Database Setup
The app can run in two modes:
1. **Demo Mode** (Current): No database required, uses mock data
2. **Full Mode**: Requires PostgreSQL database

To add a database:
1. Use the Replit Database tool to create a PostgreSQL database
2. Connection credentials are automatically added as environment variables
3. Run migrations: `npm run db:push`

### Workflow Configuration
**Development Server** workflow runs both frontend and backend:
- Command: `npm run dev`
- Starts both Vite (port 5000) and Express (port 3000) using concurrently
- Hot reload enabled for both frontend and backend

## Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend servers
- `npm run build` - Build TypeScript for server
- `npm run build:client` - Build production frontend
- `npm run build:server` - Build production backend
- `npm run start` - Start production server
- `npm run install:all` - Install all dependencies

### Database Management
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio for database management

## Features

### User Features
- Real-time cryptocurrency prices for 100+ coins
- Buy/sell trading interface
- Portfolio management and tracking
- Multi-language support (EN, DE, ES, FR, ZH)
- Responsive design (desktop, tablet, mobile)
- User authentication and KYC verification
- Investment plans and savings strategies
- Price alerts and notifications
- News integration

### Admin Features
- User management dashboard
- Transaction monitoring
- System analytics
- Content management
- Support chat system
- Audit logs

## Development Notes

### Recent Changes (Replit Setup)
- Updated Vite config to use port 5000 for Replit compatibility
- Configured proper host settings (0.0.0.0 for frontend, localhost for backend)
- Set up development workflow with automatic restarts
- Generated secure cookie secret for sessions
- Configured deployment settings for Replit deployments

### Known Issues
- Application runs in demo mode without database (expected behavior)
- Some real-time features require database connection
- OAuth features require credential configuration

## Deployment
The deployment is configured for Replit's autoscale deployment:
- Build command: `npm run build:client` - Builds the React frontend
- Run command: `npm run start` - Starts the production server
- Automatically scales based on traffic

**Production Server Configuration:**
The production server (`npm run start`) runs on port 5000 (set via `PORT` environment variable) and:
- Serves the built client files from `client/dist`
- Provides the backend API on the same port
- Uses a single unified server (no separate frontend server needed)

**For production deployment, ensure:**
1. Database is properly configured (use Replit Database tool)
2. All required environment variables are set via Replit Secrets:
   - `DATABASE_URL` - PostgreSQL connection string
   - `COOKIE_SECRET` - Secure random string (32+ characters)
   - `NODE_ENV=production`
3. OAuth credentials are added (if using social login)
4. API keys are configured for external services
5. Never use `npm run dev` in production (it runs two separate servers)

## Support & Documentation
- **Quick Start**: See `docs/QUICK_START.md`
- **Deployment**: See `docs/DEPLOYMENT_STATUS.md`
- **Authentication**: See `docs/COMPLETE_AUTH_GUIDE.md`
- **Environment Setup**: See `docs/ENVIRONMENT_SETUP.md`
- **API Documentation**: See `docs/API_INTEGRATION_STATUS.md`

## License
MIT License - See LICENSE file for details
