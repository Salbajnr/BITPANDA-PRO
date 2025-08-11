# Overview

This is a cryptocurrency simulation platform called "Eco Trading Pro" designed to provide a realistic trading experience for users while maintaining complete admin control over simulated balances. The platform features two distinct user roles: Admin and Normal User, with separate authentication flows and role-based access controls. The system is built to look and behave like a live crypto trading platform while being completely simulated, ensuring users cannot distinguish between real and simulated environments.

# User Preferences

Preferred communication style: Simple, everyday language.

# Current Status & TODO List

## Critical Issues (Must Fix First)
1. **TypeScript Type Errors** - Fix user type definitions causing 20 LSP errors
   - User object types not properly defined in frontend components
   - Missing role, firstName, lastName, profileImageUrl properties
   - Holdings and portfolio data types need proper typing

2. **Database Schema Migration** - Push database changes to production
   - Run schema migration to create all tables
   - Test database connectivity and operations
   - Verify user portfolios are created automatically

3. **Authentication Flow** - Complete user authentication setup
   - Fix 401 Unauthorized errors on login
   - Ensure proper session management
   - Test role-based access for admin vs user routes

## Core Functionality (High Priority)
4. **Real-Time Crypto Data Integration**
   - Replace mock data with live CoinGecko API calls
   - Implement proper error handling for API failures
   - Add fallback data when APIs are unavailable

5. **Admin Balance Simulation**
   - Test admin balance adjustment functionality
   - Verify adjustments appear seamlessly to users
   - Ensure audit trail for all balance changes

6. **Trading Simulation Engine**
   - Complete buy/sell order processing
   - Update portfolio holdings correctly
   - Calculate fees and transaction costs
   - Handle insufficient balance scenarios

## UI/UX Improvements (Medium Priority)
7. **Responsive Design**
   - Optimize mobile layout for trading interface
   - Improve sidebar navigation on smaller screens
   - Test all components across device sizes

8. **Real-Time Price Updates**
   - Implement WebSocket connections for live prices
   - Update portfolio values in real-time
   - Add price alerts and notifications

9. **Advanced Trading Features**
   - Add limit orders and stop-loss functionality
   - Implement futures trading simulation
   - Create advanced charting tools

## API Integration (Medium Priority)
10. **News API Integration**
    - Set up NewsAPI.org or alternative news service
    - Filter crypto-specific news content
    - Implement news article management for admins

11. **Market Data Enhancement**
    - Add more cryptocurrency pairs
    - Implement historical price charts
    - Add market cap and volume data

## Security & Production (Low Priority)
12. **Environment Configuration**
    - Set up production environment variables
    - Configure secure session management
    - Implement rate limiting for API calls

13. **Error Handling & Logging**
    - Add comprehensive error logging
    - Implement user-friendly error messages
    - Create admin monitoring dashboard

14. **Performance Optimization**
    - Implement data caching strategies
    - Optimize database queries
    - Add loading states for better UX

## Nice-to-Have Features
15. **Social Trading Features**
    - User portfolios comparison
    - Leaderboards and rankings
    - Social sharing capabilities

16. **Educational Content**
    - Trading tutorials and guides
    - Market analysis articles
    - Investment learning resources

# System Architecture

## Frontend Architecture
The frontend is built using React.js with TypeScript in a modern single-page application (SPA) architecture:
- **Framework**: React 18 with Vite as the build tool for fast development and optimized production builds
- **UI Library**: Radix UI components with shadcn/ui design system providing accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming, supporting dark/light mode toggle
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Session-based authentication integrated with Replit's OpenID Connect

## Backend Architecture
The backend follows a REST API architecture with Express.js:
- **Framework**: Node.js with Express.js for HTTP server and API routes
- **Authentication**: Passport.js with OpenID Connect strategy for Replit authentication
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **Role-Based Access**: Middleware-based authorization with separate routes for admin and user operations
- **Development Integration**: Vite middleware integration for seamless full-stack development experience

## Data Storage Solutions
The application uses PostgreSQL with Drizzle ORM for type-safe database operations:
- **Database**: PostgreSQL hosted on Neon with connection pooling
- **ORM**: Drizzle ORM with TypeScript schema definitions providing compile-time type safety
- **Schema Structure**: Organized tables for users, portfolios, holdings, transactions, balance adjustments, and news articles
- **Migrations**: Drizzle Kit for schema migrations and database management
- **Session Storage**: Dedicated sessions table for authentication state persistence

## Authentication and Authorization
The system implements a dual-authentication approach with strict role separation:
- **Primary Authentication**: Replit OpenID Connect integration with automatic user provisioning
- **Role Management**: Database-stored user roles (admin/user) with middleware enforcement
- **Session Security**: HTTP-only cookies with secure flags and configurable TTL
- **Route Protection**: Separate authentication flows ensuring admin and user routes are completely isolated
- **Authorization Middleware**: Request-level role validation preventing unauthorized access

## External Dependencies

### Third-Party Services
- **Replit Authentication**: OpenID Connect integration for user authentication and session management
- **Neon Database**: PostgreSQL hosting service with serverless capabilities and automatic scaling
- **CoinGecko API**: Real-time cryptocurrency market data and pricing information
- **News APIs**: External news feeds for cryptocurrency and financial news content

### Development and Build Tools
- **Vite**: Frontend build tool with hot module replacement and optimized production builds
- **TypeScript**: Type safety across the entire application stack
- **ESBuild**: Fast JavaScript bundling for server-side code compilation
- **Drizzle Kit**: Database schema management and migration tooling

### UI and Styling Libraries
- **Radix UI**: Headless component library providing accessible primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind CSS

### Functionality Libraries
- **TanStack React Query**: Server state management with caching, synchronization, and error handling
- **React Hook Form**: Form state management with validation
- **Date-fns**: Date manipulation and formatting utilities
- **Wouter**: Lightweight routing library for React applications