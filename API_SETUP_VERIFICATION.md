# API Setup Verification

## ✅ Server API Configuration

### Route Registration
- **Location**: `server/index.ts` (line 238)
- **Method**: `registerRoutes(app)` function sets up all routes
- **Base Path**: All API routes are mounted under `/api/*`

### Key Middleware Stack (in order):
1. **CORS Middleware** (lines 98-147)
   - Allows: `localhost:5173`, `localhost:3000`, Render domains
   - Supports wildcard: `*.onrender.com`
   - Allows credentials for cookie-based auth
   - Handles OPTIONS preflight requests

2. **Session Middleware** (in `registerRoutes`)
   - Cookie-based sessions for authentication
   - Session stored in database

3. **Passport Middleware** (OAuth support)
   - Google, Facebook, Apple OAuth

4. **Audit Logging** (security tracking)

5. **Route Handlers** (all mounted under `/api/*`)

### API Endpoints Structure:
```
/api/auth/*          - Authentication (login, register, logout)
/api/user/*          - User management
/api/admin/*          - Admin operations
/api/crypto/*         - Cryptocurrency data
/api/trading/*        - Trading operations
/api/portfolio/*      - Portfolio management
/api/deposits/*       - Deposit operations
/api/withdrawals/*    - Withdrawal operations
/api/news/*           - News articles
/api/metals/*         - Precious metals
/api/alerts/*         - Price alerts
/api/watchlist/*      - Watchlist management
/api/upload/*         - File uploads
/api/support/chat/*   - Live chat
... and many more
```

### Static File Serving (Production):
- **Location**: `server/index.ts` (lines 164-211)
- **Path**: Serves from `client/dist` directory
- **Routing**: 
  - `/admin` → serves `admin.html`
  - All other non-API routes → serves `index.html` (for React Router)
  - API routes (`/api/*`) → handled by Express routes

---

## ✅ Client API Configuration

### Primary API Client
- **File**: `client/src/lib/api.ts`
- **Type**: TypeScript class-based client
- **Features**:
  - Automatic CSRF token fetching
  - Relative URL support (works for same-origin)
  - Credentials included for cookie auth
  - Type-safe responses

### API Client Configuration:
```typescript
// Development: Uses relative URLs (empty baseURL)
// - Leverages Vite proxy: /api → http://localhost:3000/api
// Production: Uses relative URLs (empty baseURL)
// - Same-origin requests (client and server on same domain)
```

### Vite Proxy Configuration:
- **File**: `client/vite.config.js` (lines 50-58)
- **Proxy**: `/api` → `http://localhost:3000`
- **Purpose**: In development, proxies API calls from Vite dev server (port 5173) to Express server (port 3000)

### API Request Flow:

#### Development Mode:
1. Client runs on: `http://localhost:5173` (Vite)
2. Server runs on: `http://localhost:3000` (Express)
3. Client makes request: `fetch('/api/crypto/top')`
4. Vite proxy intercepts `/api/*` and forwards to `http://localhost:3000/api/crypto/top`
5. Server responds with CORS headers allowing `localhost:5173`

#### Production Mode:
1. Client and server on same domain (e.g., `https://bitpanda-pro.onrender.com`)
2. Client makes request: `fetch('/api/crypto/top')`
3. Browser sends same-origin request (no CORS needed)
4. Server serves static files OR handles API routes
5. Express routes handle `/api/*` requests

---

## ✅ Verification Checklist

### Server Setup:
- [x] All routes registered under `/api/*`
- [x] CORS configured for development and production
- [x] Session middleware enabled
- [x] Static file serving configured for production
- [x] Client-side routing handled (returns index.html for non-API routes)

### Client Setup:
- [x] API client uses relative URLs
- [x] Vite proxy configured for development
- [x] Credentials included in requests
- [x] CSRF token support

### Production Deployment (Render):
- [x] Server serves both API and client from same origin
- [x] No CORS needed (same-origin requests)
- [x] Static files served from `client/dist`
- [x] API routes properly mounted

---

## 🔧 Testing Instructions

### Local Development:
1. Start server: `npm run dev:server` (runs on port 3000)
2. Start client: `npm run dev:client` (runs on port 5173)
3. Open browser: `http://localhost:5173`
4. API calls will be proxied through Vite to Express server

### Production Build Test:
1. Build: `npm run build`
2. Start: `npm start` (runs on port 5000 or PORT env var)
3. Open browser: `http://localhost:5000`
4. API calls use same-origin (no proxy needed)

### Test API Endpoints:
- Health: `GET /health` or `GET /api/health/detailed`
- Status: `GET /api/status`
- Crypto: `GET /api/crypto/top/10`
- Portfolio: `GET /api/portfolio` (requires auth)

---

## 📝 Notes

- The app uses **cookie-based authentication** with sessions
- CSRF protection is implemented via tokens
- All API responses include proper CORS headers when needed
- In production, same-origin requests don't require CORS
- The server automatically serves the client UI for non-API routes

