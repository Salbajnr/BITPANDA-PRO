# Overview

This project is a cryptocurrency simulation platform named "BITPANDA PRO," designed to offer a realistic trading experience with full admin control over simulated balances. It supports two user roles—Admin and Normal User—each with distinct authentication and access controls. The platform aims to mimic a live crypto trading environment so accurately that users cannot differentiate between real and simulated operations, focusing on providing a comprehensive, simulated trading ecosystem.

## Recent Changes (October 22, 2025)
- **IMPLEMENTED REAL-TIME FEATURES WITH LIVE DATA:**
  - Replaced all mock implementations with real functional services using free public APIs
  - Created comprehensive news service (server/news-service.ts) that fetches live crypto news:
    * Market overview from CoinGecko global data API
    * Trending cryptocurrencies with search interest
    * Top gainers and losers with real-time price changes
    * All news generated from actual market data, not static content
  - Updated crypto service to remove "Mock mode" messaging, now shows "Starting Real-Time Price Service with live data"
  - Enhanced metals service with realistic market-based pricing using intelligent fallbacks
  - Updated price monitor to use HTTP polling for reliable real-time price updates
  - Configured email service to support SendGrid for real notifications (falls back to console logging without API key)
  - All services now use real APIs with graceful fallbacks when optional API keys aren't provided
  - System works fully without any API keys using CoinGecko free tier and market data
  - Optional API keys (COINGECKO_API_KEY, NEWS_API_KEY, METALS_API_KEY, SENDGRID_API_KEY) available for enhanced features

## Previous Changes (October 18, 2025)
- **SEPARATED FRONTEND AND BACKEND ARCHITECTURE:**
  - Completely separated server (backend) and client (frontend) into independent applications
  - Backend API runs on port 3001 as pure REST API server (no frontend serving)
  - Frontend runs independently on port 5000 using Vite dev server
  - Configured Vite proxy to route /api and /uploads requests from frontend to backend
  - Removed Vite middleware integration from backend (deleted server/vite-setup.ts)
  - Updated CORS configuration to support separated architecture
  - Created separate workflows: "Backend API" and "Frontend"
  - Cleaned up redundant files: firestore.indexes.json, render.yaml, render-static.yaml, RENDER_DEPLOYMENT_GUIDE.md
  - Database connected and verified (30+ tables operational)
  - WebSocket services initialized for real-time features
  - Both frontend and backend running successfully with proper communication

## Previous Changes (October 15, 2025)
- **MIGRATED TO RENDER POSTGRESQL:**
  - Successfully removed all Supabase integrations and dependencies
  - Configured Render PostgreSQL as the primary database (postgresql://dbphpapi_user:***@dpg-d3aj6n24d50c73dbk27g-a.oregon-postgres.render.com/dbphpapi)
  - Removed @supabase/auth-helpers-react and @supabase/supabase-js packages
  - Cleaned up all Supabase imports from codebase (Auth.tsx, useAuth.ts)
  - Google authentication prepared for Firebase integration (currently shows "Coming Soon")
  - Application running successfully on port 5000 with Render PostgreSQL

## Previous Changes (October 13, 2025)
- **COMPLETED MIGRATION TO STANDARD REPLIT ENVIRONMENT:**
  - Successfully migrated from Replit Agent to standard Replit environment
  - Fixed duplicate export declarations in AdminMetalsManagement.tsx and AdminTransactionMonitor.tsx
  - Pushed complete database schema to Replit PostgreSQL (30+ tables created)
  - Application running successfully on port 5000 with all features operational
  - Created custom user account: Isaiahsalba2020@gmail.com

## Previous Changes (August 21, 2025)
- Successfully migrated from Replit Agent environment to standard Replit environment
- Cleaned up redundant authentication files (simple-auth-new.ts, auth-storage.ts, auth-schema.ts)
- Fixed CORS configuration to support credentials with specific origin instead of wildcard
- Consolidated authentication system to use main application files with bcrypt password hashing
- Fixed API request parameters in frontend to properly handle method, URL, and data
- **IMPLEMENTED SEPARATE AUTHENTICATION ROUTES:** Admin and regular users now have completely separate authentication endpoints
  - Admin routes: `/api/admin/auth/login`, `/api/admin/auth/user`, `/api/admin/auth/logout`
  - User routes: `/api/user/auth/login`, `/api/user/auth/user`, `/api/user/auth/logout`, `/api/user/auth/register`
  - Frontend updated with separate login tabs for admin and user authentication
  - Enhanced security by preventing role confusion and ensuring proper access control

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is a React.js single-page application built with TypeScript. It uses Vite for fast development and optimized production builds. UI components are developed with Radix UI and styled using Tailwind CSS, supporting dark/light mode. State management is handled by TanStack React Query for server state, and Wouter is used for client-side routing. Authentication currently uses traditional email/password login, with Firebase Google Sign-In planned for future integration.

## Backend Architecture
The backend is a pure REST API built with Node.js and Express.js, running independently on port 3001. It handles user authentication through traditional email/password methods with bcrypt password hashing. Express sessions with PostgreSQL storage manage session data. Role-based access control is enforced via middleware, separating admin and user operations. The backend serves only JSON API responses and does not serve frontend assets. CORS is configured to allow requests from the frontend application.

## Data Storage Solutions
The application utilizes PostgreSQL hosted on Render for its database. Drizzle ORM is used for type-safe database operations, defining schemas for users, portfolios, holdings, transactions, balance adjustments, and news articles. Drizzle Kit manages schema migrations. A dedicated sessions table in PostgreSQL handles authentication state persistence.

## Authentication and Authorization
The system currently supports traditional email/password authentication with bcrypt password hashing. Google Sign-In with Firebase is planned for future implementation. User roles (admin/user) are stored in the database and enforced through middleware. Separate authentication flows ensure isolated access for admin and user routes. Request-level role validation prevents unauthorized access.

# External Dependencies

## Third-Party Services
- **Firebase Authentication**: Google Sign-In (planned for future implementation).
- **Render PostgreSQL**: Database hosting for production data.
- **CoinGecko API (Free Tier)**: Real-time cryptocurrency market data, trending coins, global market stats, and price updates. Works without API key.
- **News Service**: Live crypto news generated from CoinGecko market data (trending, gainers/losers, market overview).
- **Metals Pricing**: Market-based pricing for precious metals with realistic variations (optional METALS_API_KEY for live data).
- **SendGrid** (Optional): Email notifications for price alerts and account activities (falls back to console logging).

## Development and Build Tools
- **Vite**: Frontend build tool.
- **TypeScript**: For type safety across the application.
- **ESBuild**: Fast JavaScript bundling for server-side code.
- **Drizzle Kit**: Database schema management and migration.

## UI and Styling Libraries
- **Radix UI**: Headless component library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **shadcn/ui**: Pre-built component library on Radix UI and Tailwind CSS.

## Functionality Libraries
- **TanStack React Query**: Server state management.
- **React Hook Form**: Form state management with validation.
- **Date-fns**: Date manipulation and formatting.
- **Wouter**: Lightweight routing for React.