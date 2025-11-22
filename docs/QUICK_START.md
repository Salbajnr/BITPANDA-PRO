# Quick Start Guide

Get BITPANDA-PRO running in 5 minutes!

---

## 🚀 Minimum Setup (Development)

### 1. Generate Secrets (30 seconds)

Run these commands to generate required secrets:

```bash
node -e "console.log('COOKIE_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('SESSION_SECRET_REFRESH=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output - you'll need it in step 3.

### 2. Set Up Database (2 minutes)

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (if not installed)
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Create database
createdb bitpanda_pro

# Your DATABASE_URL:
# postgresql://localhost:5432/bitpanda_pro
```

**Option B: Supabase (Free, Recommended)**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy the connection string from Settings → Database
4. Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

**Option C: Render (Free)**
1. Go to [render.com](https://render.com)
2. Create PostgreSQL database
3. Copy the External Database URL

### 3. Create .env File (1 minute)

Create `.env` in the root directory:

```bash
# Required - Database
DATABASE_URL=postgresql://localhost:5432/bitpanda_pro

# Required - Security (paste your generated secrets)
COOKIE_SECRET=your-generated-cookie-secret-here
SESSION_SECRET=your-generated-session-secret-here
SESSION_SECRET_REFRESH=your-generated-refresh-secret-here
JWT_SECRET=your-generated-jwt-secret-here

# Required - Server
NODE_ENV=development
PORT=5000
BACKEND_PORT=3000
CLIENT_URL=http://localhost:5173
```

### 4. Install & Run (1 minute)

```bash
# Install dependencies
npm run install:all

# Run database migrations
npm run db:push

# Start development servers
npm run dev
```

**That's it!** 🎉

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## 🎯 What Works Without API Keys

✅ **Fully Functional:**
- User registration & login
- Cryptocurrency prices (rate limited)
- Real-time price updates via WebSocket
- Trading (buy/sell)
- Portfolio management
- Deposits & withdrawals
- Watchlist
- Price alerts
- Admin panel
- News feed (fallback sources)

⚠️ **Limited:**
- Crypto prices: 50 calls/minute (CoinGecko free tier)
- News: Limited sources without NewsAPI key
- No email notifications without SendGrid

❌ **Disabled:**
- Metals trading (requires METALS_API_KEY)
- OAuth login (requires provider keys)

---

## 🔑 Optional API Keys (Enhanced Features)

### CoinGecko (Higher Rate Limits)
```bash
# Get from: https://www.coingecko.com/en/api/pricing
COINGECKO_API_KEY=your-key-here
```
**Benefit:** Unlimited API calls, faster updates

### NewsAPI (More News Sources)
```bash
# Get from: https://newsapi.org/register
NEWS_API_KEY=your-key-here
```
**Benefit:** More news sources, better coverage

### SendGrid (Email Notifications)
```bash
# Get from: https://app.sendgrid.com/settings/api_keys
SENDGRID_API_KEY=your-key-here
EMAIL_FROM=noreply@yourdomain.com
```
**Benefit:** Email notifications for deposits, withdrawals, alerts

---

## 🧪 Test the Setup

### 1. Check Server
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 2. Check Database
```bash
npm run db:studio
# Opens Drizzle Studio to view database
```

### 3. Check WebSocket
Open browser console on http://localhost:5173 and look for:
```
🔌 Connecting to WebSocket: ws://localhost:5173/ws
WebSocket connected for price updates
```

### 4. Create Test Account
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Create account
4. Login
5. Check if crypto prices are loading

---

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check if PostgreSQL is running
pg_isready

# Test connection
psql $DATABASE_URL

# If using Supabase, check:
# - Password is correct
# - Project is not paused
# - Connection string format is correct
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### WebSocket Not Connecting
- Check if backend is running on port 3000
- Check browser console for errors
- Verify CORS settings in server/index.ts

### Crypto Prices Not Loading
- Check browser console for API errors
- Verify internet connection
- Check if CoinGecko is accessible
- May be rate limited (wait 1 minute)

---

## 📚 Next Steps

1. **Read Full Documentation:**
   - [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) - Complete env vars guide
   - [API_INTEGRATION_STATUS.md](./API_INTEGRATION_STATUS.md) - API details
   - [AUDIT_SUMMARY.md](./AUDIT_SUMMARY.md) - System overview

2. **Get API Keys:**
   - CoinGecko for better rate limits
   - NewsAPI for more news sources
   - SendGrid for email notifications

3. **Deploy to Production:**
   - Set up production database
   - Configure environment variables
   - Set NODE_ENV=production
   - Deploy to Render/Vercel/Railway

---

## 🎓 Common Commands

```bash
# Development
npm run dev              # Start dev servers
npm run dev:server       # Backend only
npm run dev:client       # Frontend only

# Database
npm run db:push          # Push schema changes
npm run db:generate      # Generate migrations
npm run db:studio        # Open database GUI

# Build
npm run build            # Build for production
npm start                # Start production server

# Maintenance
npm run clean            # Clean build files
npm run install:all      # Reinstall all dependencies
```

---

## 💡 Tips

1. **Use Supabase for easy setup** - Free tier includes database + auth
2. **Get CoinGecko API key** - Free tier is fine, just register
3. **Check browser console** - Most issues show up there
4. **Use Drizzle Studio** - Great for viewing/editing database
5. **Enable browser notifications** - For price alerts

---

## 🆘 Need Help?

1. Check the error message in browser console
2. Check server logs in terminal
3. Review documentation files
4. Check if all required env vars are set
5. Verify database connection

---

**Ready to go!** 🚀

Your app should now be running with real-time cryptocurrency data, trading, portfolio management, and more!
