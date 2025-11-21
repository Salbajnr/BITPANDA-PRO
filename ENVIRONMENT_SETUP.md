# Environment Variables Setup Guide

This document outlines all required and optional environment variables for the BITPANDA-PRO application.

## ✅ Status: Real-Time API Integration Complete

All mock data has been removed and the application now uses real API integrations with proper fallback mechanisms.

---

## 🔴 REQUIRED Environment Variables

### Database Configuration

```bash
# PostgreSQL Database URL
# Format: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://user:password@localhost:5432/bitpanda_pro

# Example for Supabase:
# DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Example for Render:
# DATABASE_URL=postgresql://user:password@dpg-xxxxx.oregon-postgres.render.com/dbname
```

### Security

```bash
# Cookie Secret (minimum 32 characters)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
COOKIE_SECRET=your-super-secret-cookie-key-min-32-chars-long

# Session Secrets (minimum 32 characters each)
SESSION_SECRET=your-session-secret-min-32-chars-long
SESSION_SECRET_REFRESH=your-refresh-secret-min-32-chars-long

# JWT Secret (minimum 32 characters)
JWT_SECRET=your-jwt-secret-min-32-chars-long
```

### Server Configuration

```bash
# Environment mode
NODE_ENV=development  # or 'production'

# Server port
PORT=5000  # Production port
BACKEND_PORT=3000  # Development backend port

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173  # Development
# CLIENT_URL=https://your-production-domain.com  # Production
```

---

## 🟡 OPTIONAL Environment Variables (Enhanced Functionality)

### Supabase Integration (Authentication & Database)

```bash
# Supabase Configuration
# Get from: https://app.supabase.com → Project Settings → API
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

**Features enabled:**
- OAuth authentication (Google, Facebook, Apple)
- Enhanced user management
- Real-time database subscriptions
- Row-level security

### CoinGecko API (Cryptocurrency Data)

```bash
# CoinGecko API Key
# Get from: https://www.coingecko.com/en/api/pricing
COINGECKO_API_KEY=your-coingecko-api-key
```

**Features enabled:**
- Real-time cryptocurrency prices
- Historical price data
- Market cap and volume data
- 24h price changes
- Trending cryptocurrencies

**Without API key:**
- Limited to free tier (50 calls/minute)
- May experience rate limiting
- Fallback to cached data when rate limited

### News API (Cryptocurrency News)

```bash
# NewsAPI Key
# Get from: https://newsapi.org/register
NEWS_API_KEY=your-news-api-key
```

**Features enabled:**
- Real-time cryptocurrency news
- News search functionality
- Category filtering
- Sentiment analysis

**Without API key:**
- Falls back to CryptoPanic API (free, public)
- Falls back to CoinTelegraph RSS feed
- Limited news sources

### Metals API (Precious Metals Trading)

```bash
# Metals API Key
# Get from: https://metals-api.com/
METALS_API_KEY=your-metals-api-key
```

**Features enabled:**
- Real-time gold, silver, platinum, palladium prices
- Historical metals price data
- Metals trading functionality

**Without API key:**
- Metals trading features disabled
- No precious metals price data

### Email Service (SendGrid)

```bash
# SendGrid API Key
# Get from: https://app.sendgrid.com/settings/api_keys
SENDGRID_API_KEY=your-sendgrid-api-key

# Email configuration
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Bitpanda Pro
```

**Features enabled:**
- Email verification
- Password reset emails
- Transaction notifications
- Withdrawal confirmations
- Deposit notifications

**Without API key:**
- Email features disabled
- Console logging of email content (development)

### OAuth Providers

#### Google OAuth

```bash
# Google OAuth Configuration
# Get from: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

#### Facebook OAuth

```bash
# Facebook OAuth Configuration
# Get from: https://developers.facebook.com/
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback
```

#### Apple OAuth

```bash
# Apple OAuth Configuration
# Get from: https://developer.apple.com/
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY_PATH=/path/to/apple-private-key.p8
APPLE_CALLBACK_URL=http://localhost:5000/api/auth/apple/callback
```

---

## 🔧 Database Connection Settings

```bash
# PostgreSQL Connection Timeouts
PGCONNECT_TIMEOUT=60  # Connection timeout in seconds
PGCOMMAND_TIMEOUT=60  # Command timeout in seconds
```

---

## 📋 Complete .env Template

Create a `.env` file in the root directory with the following:

```bash
# ===================================
# REQUIRED - Database
# ===================================
DATABASE_URL=postgresql://user:password@localhost:5432/bitpanda_pro

# ===================================
# REQUIRED - Security
# ===================================
COOKIE_SECRET=generate-a-random-32-char-string-here
SESSION_SECRET=generate-a-random-32-char-string-here
SESSION_SECRET_REFRESH=generate-a-random-32-char-string-here
JWT_SECRET=generate-a-random-32-char-string-here

# ===================================
# REQUIRED - Server
# ===================================
NODE_ENV=development
PORT=5000
BACKEND_PORT=3000
CLIENT_URL=http://localhost:5173

# ===================================
# OPTIONAL - Supabase
# ===================================
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# ===================================
# OPTIONAL - API Keys
# ===================================
COINGECKO_API_KEY=
NEWS_API_KEY=
METALS_API_KEY=
SENDGRID_API_KEY=

# ===================================
# OPTIONAL - Email
# ===================================
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Bitpanda Pro

# ===================================
# OPTIONAL - OAuth
# ===================================
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

APPLE_CLIENT_ID=
APPLE_TEAM_ID=
APPLE_KEY_ID=
APPLE_PRIVATE_KEY_PATH=
APPLE_CALLBACK_URL=http://localhost:5000/api/auth/apple/callback

# ===================================
# OPTIONAL - Database Settings
# ===================================
PGCONNECT_TIMEOUT=60
PGCOMMAND_TIMEOUT=60
```

---

## 🚀 Quick Start

### Minimum Setup (Development)

1. **Generate secrets:**
```bash
node -e "console.log('COOKIE_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('SESSION_SECRET_REFRESH=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

2. **Set up database:**
   - Install PostgreSQL locally, OR
   - Use Supabase (free tier), OR
   - Use Render PostgreSQL (free tier)

3. **Create .env file:**
```bash
cp env.example .env
# Edit .env with your values
```

4. **Run database migrations:**
```bash
npm run db:push
```

5. **Start the application:**
```bash
npm run dev
```

### Production Setup

1. Set all REQUIRED environment variables
2. Set optional API keys for full functionality
3. Use production database URL
4. Set `NODE_ENV=production`
5. Configure proper CORS origins in `CLIENT_URL`

---

## 🔍 Feature Matrix

| Feature | Required Env Vars | Optional Env Vars | Works Without Optional? |
|---------|------------------|-------------------|------------------------|
| User Authentication | DATABASE_URL, Secrets | SUPABASE_* | ✅ Yes (basic auth) |
| Crypto Prices | DATABASE_URL | COINGECKO_API_KEY | ✅ Yes (rate limited) |
| News Feed | DATABASE_URL | NEWS_API_KEY | ✅ Yes (fallback sources) |
| Trading | DATABASE_URL, Secrets | COINGECKO_API_KEY | ✅ Yes (limited) |
| Portfolio | DATABASE_URL, Secrets | COINGECKO_API_KEY | ✅ Yes |
| Deposits/Withdrawals | DATABASE_URL, Secrets | SENDGRID_API_KEY | ⚠️ Partial (no emails) |
| Metals Trading | DATABASE_URL, Secrets | METALS_API_KEY | ❌ No |
| OAuth Login | DATABASE_URL, Secrets | GOOGLE_*, FACEBOOK_*, APPLE_* | ⚠️ Partial (email/password only) |
| Email Notifications | DATABASE_URL, Secrets | SENDGRID_API_KEY | ❌ No |
| Real-time Prices | DATABASE_URL | COINGECKO_API_KEY | ✅ Yes (WebSocket + fallback) |

---

## 🛠️ Troubleshooting

### Database Connection Issues

```bash
# Test database connection
psql $DATABASE_URL

# Check if database exists
npm run db:studio
```

### API Rate Limiting

- **CoinGecko**: Free tier = 50 calls/minute
  - Solution: Get API key for higher limits
  - Fallback: App uses caching (30s) to reduce calls

- **NewsAPI**: Free tier = 100 requests/day
  - Solution: Get paid plan or use fallback sources
  - Fallback: CryptoPanic API (free) or RSS feeds

### WebSocket Connection Issues

- Ensure PORT is not blocked by firewall
- Check if WebSocket upgrade is allowed by reverse proxy
- Verify CORS settings include WebSocket origin

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [CoinGecko API Docs](https://www.coingecko.com/en/api/documentation)
- [NewsAPI Documentation](https://newsapi.org/docs)
- [SendGrid API Docs](https://docs.sendgrid.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## ✅ Verification Checklist

- [ ] Database connection successful
- [ ] All required secrets generated (32+ characters)
- [ ] Server starts without errors
- [ ] Can create user account
- [ ] Can login successfully
- [ ] Crypto prices loading (check browser console)
- [ ] WebSocket connection established (check Network tab)
- [ ] News feed loading
- [ ] Portfolio displays correctly
- [ ] Trading functionality works

---

**Last Updated:** 2024
**Version:** 1.0.0
