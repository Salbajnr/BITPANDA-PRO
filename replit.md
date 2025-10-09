# Overview

This project is a cryptocurrency simulation platform named "BITPANDA PRO," designed to offer a realistic trading experience with full admin control over simulated balances. It supports two user roles—Admin and Normal User—each with distinct authentication and access controls. The platform aims to mimic a live crypto trading environment so accurately that users cannot differentiate between real and simulated operations, focusing on providing a comprehensive, simulated trading ecosystem.

## Recent Changes (October 9, 2025)
- **MIGRATED TO FIREBASE AND SUPABASE:**
  - Replaced Neon PostgreSQL with Supabase for database hosting
  - Integrated Firebase Authentication with Google Sign-In support
  - Added Firebase UID field to users table for seamless auth sync
  - Created automatic user provisioning system that syncs Firebase users with Supabase database
  - Updated frontend Auth page with Google Sign-In buttons for both login and registration
  - Backend now supports both traditional email/password and Firebase Google authentication

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
The frontend is a React.js single-page application built with TypeScript. It uses Vite for fast development and optimized production builds. UI components are developed with Radix UI and styled using Tailwind CSS, supporting dark/light mode. State management is handled by TanStack React Query for server state, and Wouter is used for client-side routing. Authentication integrates with Firebase Authentication for Google Sign-In and traditional email/password login.

## Backend Architecture
The backend is a REST API built with Node.js and Express.js. It handles user authentication through a Firebase sync endpoint that automatically provisions users in the Supabase database. Express sessions with PostgreSQL storage manage session data. Role-based access control is enforced via middleware, separating admin and user operations. Vite middleware is integrated for seamless full-stack development.

## Data Storage Solutions
The application utilizes PostgreSQL hosted on Supabase for its database. Drizzle ORM is used for type-safe database operations, defining schemas for users (with Firebase UID support), portfolios, holdings, transactions, balance adjustments, and news articles. Drizzle Kit manages schema migrations. A dedicated sessions table in PostgreSQL handles authentication state persistence.

## Authentication and Authorization
The system supports multiple authentication methods: Firebase Google Sign-In and traditional email/password authentication. Firebase users are automatically synced with the Supabase database through a custom backend endpoint. User roles (admin/user) are stored in the database and enforced through middleware. Separate authentication flows ensure isolated access for admin and user routes. Request-level role validation prevents unauthorized access.

# External Dependencies

## Third-Party Services
- **Firebase Authentication**: Google Sign-In and email/password authentication.
- **Supabase**: PostgreSQL database hosting with real-time capabilities.
- **CoinGecko API**: Real-time cryptocurrency market data.
- **News APIs**: External news feeds for crypto and financial news.

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