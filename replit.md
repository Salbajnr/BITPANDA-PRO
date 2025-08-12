# Overview

This is a cryptocurrency simulation platform called "BITPANDA PRO" designed to provide a realistic trading experience for users while maintaining complete admin control over simulated balances. The platform features two distinct user roles: Admin and Normal User, with separate authentication flows and role-based access controls. The system is built to look and behave like a live crypto trading platform while being completely simulated, ensuring users cannot distinguish between real and simulated environments.

# User Preferences

Preferred communication style: Simple, everyday language.

# Current Status & TODO List

## 🚨 Critical Issues (Must Fix First)

### 1. Fix Import/Syntax Errors
- **Status**: CRITICAL - App currently broken
- **Issue**: AdminDashboard.tsx has import error for 'Exchange' component
- **Action**: Remove or fix the Exchange import that's causing syntax errors
- **Priority**: IMMEDIATE

### 2. Database Schema Migration
- **Status**: CRITICAL
- **Actions**:
  - Run `npx drizzle-kit push` to create all database tables
  - Verify all tables are created correctly
  - Test user registration creates portfolios automatically
  - Ensure proper foreign key relationships
- **Priority**: IMMEDIATE

### 3. Authentication Flow Issues  
- **Status**: CRITICAL
- **Actions**:
  - Fix 401 Unauthorized errors on login attempts
  - Debug session management and cookie settings
  - Test admin vs user role access properly
  - Verify JWT/session tokens are working
- **Priority**: IMMEDIATE

### 4. Port Conflict Resolution
- **Status**: BLOCKING DEVELOPMENT
- **Issue**: Port 5000 already in use error
- **Actions**:
  - Kill existing processes using port 5000
  - Update workflow to properly kill processes before restart
  - Ensure clean server shutdown/restart
- **Priority**: IMMEDIATE

## 🔧 Core Functionality (High Priority)

### 5. Complete Trading System
- **Status**: IN PROGRESS
- **Actions**:
  - Implement buy/sell order execution logic
  - Add portfolio balance updates after trades
  - Calculate and apply trading fees
  - Handle insufficient balance scenarios
  - Add trade confirmation dialogs
  - Test complete trading flow end-to-end
- **Priority**: HIGH

### 6. Admin Balance Management
- **Status**: PARTIALLY IMPLEMENTED
- **Actions**:
  - Test balance adjustment functionality thoroughly
  - Add user-friendly admin interface for balance changes
  - Implement bulk balance operations
  - Add balance history tracking for users
  - Verify seamless user experience (no indication of simulation)
- **Priority**: HIGH

### 7. Real-Time Crypto Data Integration
- **Status**: MOCK DATA ONLY
- **Actions**:
  - Integrate CoinGecko API for live crypto prices
  - Replace all mock data with real market data
  - Add error handling for API failures
  - Implement fallback/cached data system
  - Add rate limiting to prevent API quota issues
- **Priority**: HIGH

### 8. Portfolio Management System
- **Status**: BASIC IMPLEMENTATION
- **Actions**:
  - Complete portfolio value calculations
  - Add real-time portfolio updates
  - Implement profit/loss tracking
  - Add portfolio performance charts
  - Create detailed holdings view
- **Priority**: HIGH

## 📱 User Experience (Medium Priority)

### 9. Complete Missing Pages
- **Status**: PLACEHOLDER SECTIONS
- **Actions**:
  - Implement Transaction History page with filtering
  - Create User Settings/Profile management page
  - Build Portfolio Analytics page with charts
  - Add Watchlist functionality
  - Create Help/Documentation section
- **Priority**: MEDIUM

### 10. Responsive Design Improvements
- **Status**: PARTIALLY RESPONSIVE
- **Actions**:
  - Optimize mobile layout for trading interface
  - Fix sidebar navigation on small screens
  - Test all components across device breakpoints
  - Improve touch interactions for mobile trading
- **Priority**: MEDIUM

### 11. News Integration
- **Status**: FALLBACK DATA ONLY
- **Actions**:
  - Set up NewsAPI.org or CryptoNews API
  - Implement admin news management system
  - Add news filtering and categorization
  - Create news article detail views
- **Priority**: MEDIUM

## ⚡ Performance & Features (Lower Priority)

### 12. Real-Time Updates
- **Actions**:
  - Implement WebSocket connections for live prices
  - Add real-time portfolio value updates
  - Create price alert system
  - Add market status indicators
- **Priority**: LOW

### 13. Advanced Trading Features
- **Actions**:
  - Add limit/stop-loss order types
  - Implement order book simulation
  - Create advanced charting tools
  - Add technical indicators
- **Priority**: LOW

### 14. Security & Compliance
- **Actions**:
  - Implement rate limiting
  - Add input validation and sanitization
  - Create audit logging system
  - Add password strength requirements
  - Implement session timeout
- **Priority**: LOW

### 15. Analytics & Reporting
- **Actions**:
  - Build admin analytics dashboard
  - Add user behavior tracking
  - Create trading reports and exports
  - Implement performance benchmarking
- **Priority**: LOW

## 🎯 Launch Readiness Checklist

### Pre-Launch Requirements:
- [ ] Fix all critical syntax/import errors
- [ ] Database migrations completed and tested
- [ ] Authentication working for both user types
- [ ] Basic trading functionality operational
- [ ] Admin balance simulation fully tested
- [ ] Live crypto data integration working
- [ ] Mobile responsiveness acceptable
- [ ] Error handling implemented
- [ ] Basic security measures in place

### Production Deployment:
- [ ] Environment variables configured
- [ ] Database backups set up
- [ ] Performance monitoring enabled
- [ ] SSL certificates configured
- [ ] Domain configured properly

## 📈 Success Metrics
- Users can register, login, and trade seamlessly
- Admins can manage user balances without detection
- Real-time crypto prices display correctly
- Platform feels like a legitimate crypto exchange
- Mobile experience is fully functional
- No critical bugs or errors in production

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