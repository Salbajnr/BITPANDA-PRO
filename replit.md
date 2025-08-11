# Overview

This is a cryptocurrency simulation platform called "Eco Trading Pro" designed to provide a realistic trading experience for users while maintaining complete admin control over simulated balances. The platform features two distinct user roles: Admin and Normal User, with separate authentication flows and role-based access controls. The system is built to look and behave like a live crypto trading platform while being completely simulated, ensuring users cannot distinguish between real and simulated environments.

# User Preferences

Preferred communication style: Simple, everyday language.

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