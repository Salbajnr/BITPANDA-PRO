
# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
Configure these in Replit Secrets before deploying:

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV=production`
- `COOKIE_SECRET` - Strong secret (min 32 characters)
- `PORT=5000` - Application port (auto-configured)

**Optional:**
- `COINGECKO_API_KEY` - For live crypto price data
- `NEWS_API_KEY` - For news aggregation
- `METALS_API_KEY` - For precious metals pricing

### 2. Build Process

The production build process:
1. **Client Build**: Compiles React app to static files → `dist/public`
2. **Server Build**: Transpiles TypeScript backend code
3. **Combined**: Server serves both API and static frontend on port 5000

### 3. Deploy on Replit

1. Click the **Deploy** button in Replit
2. Select **Autoscale Deployment** (recommended)
3. Configuration is already set:
   - Build: `npm run build`
   - Run: `npm run start`
   - Port: 5000
4. Click **Deploy**

### 4. Post-Deployment Verification

Check these endpoints:
- `https://your-app.replit.app/health` - Server health
- `https://your-app.replit.app/` - Frontend app
- `https://your-app.replit.app/api/crypto/market-data` - API endpoint

## Production Architecture

**Single Server Mode (Port 5000):**
- Express serves API routes (`/api/*`)
- Express serves static React build (`/dist/public`)
- WebSocket services for real-time features
- All traffic unified on one port

## Database Migration

Before first deployment:
```bash
npm run db:push
```

## Monitoring

- Check deployment logs in Replit Deployments panel
- Monitor WebSocket connections via Admin panel
- Review server metrics at `/api/comprehensive-analytics`

## Troubleshooting

**Build fails:**
- Verify all dependencies are installed
- Check TypeScript compilation errors
- Ensure `dist/public` directory is created

**Runtime errors:**
- Verify all Secrets are configured
- Check database connection
- Review deployment logs

**Performance issues:**
- Monitor via Admin Server Monitoring
- Check database query performance
- Review Autoscale metrics

## Scaling

Autoscale automatically:
- Scales down to 0 when idle (saves costs)
- Scales up to handle traffic (max instances configurable)
- Maintains one "warm" instance for quick response

## Security

- HTTPS enforced automatically by Replit
- CORS configured for allowed origins
- CSRF protection enabled
- Session secrets from environment variables
- Database credentials secured in Secrets
