# BitpandaPro - Cryptocurrency Trading Platform

## Overview
A full-stack cryptocurrency trading platform built with React, Node.js, and PostgreSQL. Features real-time price updates, portfolio management, trading capabilities, multi-language support, and an admin dashboard.

**Current State**: Successfully configured and running in Replit environment with database connection.

## Recent Changes (October 22, 2025)
- Initial Replit setup completed
- Configured frontend (Vite) to run on port 5000 with 0.0.0.0 host
- Configured backend (Express) to run on port 3000 (localhost)
- Added proxy configuration in Vite to route API calls to backend
- Updated storage.ts to support optional DATABASE_URL for demo mode
- Created server/.env with development configuration
- Configured deployment for production (autoscale)
- Database connected via Replit's PostgreSQL integration

## Project Architecture

### Tech Stack
**Frontend:**
- React 19 with TypeScript
- Vite (dev server and build tool)
- Tailwind CSS + Radix UI
- React Query for data fetching
- Wouter for routing
- Recharts for data visualization

**Backend:**
- Node.js with Express
- TypeScript
- PostgreSQL with Drizzle ORM
- WebSocket for real-time updates
- JWT authentication
- Multer for file uploads

**External APIs:**
- CoinGecko - Cryptocurrency price data
- NewsAPI - News aggregation
- Metals API - Precious metals pricing

### Directory Structure
```
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── contexts/    # React contexts
│   │   ├── lib/         # Utility functions
│   │   └── translations/# i18n language files
│   └── vite.config.js   # Vite configuration
├── server/              # Node.js backend
│   ├── *-routes.ts      # API route handlers
│   ├── *-service.ts     # Business logic services
│   ├── db.ts            # Database connection
│   ├── storage.ts       # Database storage layer
│   ├── index.ts         # Server entry point
│   └── drizzle/         # Database migrations
├── shared/              # Shared code
│   └── schema.ts        # Database schema (Drizzle)
└── package.json         # Workspace configuration
```

## Configuration

### Port Configuration
- **Frontend**: Port 5000 (0.0.0.0) - User-facing web interface
- **Backend**: Port 3000 (localhost) - Internal API server
- **Proxy**: Vite proxies /api and /ws requests to backend

### Environment Variables
Located in `server/.env`:
- `NODE_ENV`: development/production
- `PORT`: 5000 (production server port)
- `BACKEND_PORT`: 3000 (development backend port)
- `DATABASE_URL`: PostgreSQL connection string (set via Replit Secrets)
- `COOKIE_SECRET`: Session cookie secret
- `COINGECKO_API_KEY`: Optional - for full crypto data
- `NEWS_API_KEY`: Optional - for news features
- `METALS_API_KEY`: Optional - for precious metals trading

### Workflows
**Server**: Runs `npm run dev` which starts both:
1. Backend server on localhost:3000 (via concurrently)
2. Frontend Vite dev server on 0.0.0.0:5000

### Deployment
**Target**: Autoscale (stateless web application)
**Build**: `npm run build` - Builds both client and server
**Run**: `npm run start` - Starts production server on port 5000

In production, the backend serves the built frontend files from the dist directory.

## Features

### User Features
- Real-time cryptocurrency prices for 100+ coins
- Advanced trading interface with buy/sell orders
- Portfolio management and performance tracking
- Multi-language support (EN, DE, ES, FR, ZH)
- KYC verification system
- Investment and savings plans
- Price alerts and notifications
- News integration
- Responsive design (desktop, tablet, mobile)

### Admin Features
- User management dashboard
- Transaction monitoring
- System analytics and health monitoring
- Content management (news articles)
- Customer support chat system
- Audit logs and compliance tools

## Development

### Running Locally
The workflow automatically starts both frontend and backend servers. Access the application at the Webview URL.

### Database
The application uses Replit's built-in PostgreSQL database. To push schema changes:
```bash
npm run db:push
```

To force push (with data loss warning):
```bash
npm run db:push --force
```

### Scripts
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio for database management

## User Preferences
- Default to using Replit's built-in database rather than external services
- Keep the application running in demo mode when API keys are not provided
- Maintain clean, organized code structure with TypeScript
- Use existing libraries and patterns consistently

## Notes
- The application can run in "demo mode" without API keys for CoinGecko, NewsAPI, or Metals API
- Real-time features use WebSocket for live price updates
- Database connection is optional - app runs with limited features in demo mode
- Frontend uses proxy configuration to avoid CORS issues in development
