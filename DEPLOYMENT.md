
# Deployment Guide

This application is configured for deployment on Replit's platform with Autoscale Deployments.

## Prerequisites

1. **Database**: Ensure you have a PostgreSQL database URL set in Replit Secrets
2. **Environment Variables**: Configure all necessary secrets in the Replit Secrets tool

## Required Environment Variables

Set these in Replit Secrets (🔒 icon in the left sidebar):

```env
# Required
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=production
COOKIE_SECRET=your-super-secret-cookie-key-min-32-chars-long

# Optional (for full functionality)
COINGECKO_API_KEY=your_coingecko_api_key
NEWS_API_KEY=your_news_api_key
METALS_API_KEY=your_metals_api_key
```

## Deployment Steps

### 1. Configure Secrets

1. Open the Replit Secrets tool (🔒 icon)
2. Add your `DATABASE_URL` from your PostgreSQL provider
3. Add `NODE_ENV=production`
4. Add a strong `COOKIE_SECRET` (minimum 32 characters)
5. Optionally add API keys for enhanced features

### 2. Deploy Using Replit Deployments

1. Click the **Deploy** button in the Replit workspace
2. Choose **Autoscale Deployment** (recommended for this app)
3. Configure deployment settings:
   - **Build Command**: Already set to `npm run build`
   - **Run Command**: Already set to `npm run start`
   - **Port**: 5000 (automatically configured)
4. Click **Deploy**

### 3. Monitor Your Deployment

After deployment:
- Your app will be available at `https://<your-app-name>.replit.app`
- Monitor logs in the Deployments panel
- Check the health endpoint: `https://<your-app-name>.replit.app/health`

## Architecture

### Production Mode
- **Single Server**: Express serves both API and static frontend
- **Port 5000**: All traffic routed through one port
- **Static Files**: Built frontend served from `/dist/public`
- **API Routes**: All `/api/*` endpoints handled by backend
- **SPA Routing**: All other routes serve `index.html` for client-side routing

### Development Mode
- **Backend**: Port 3001 (Express API)
- **Frontend**: Port 5000 (Vite dev server with HMR)
- **Proxy**: Vite proxies API requests to backend

## Database Setup

Your app uses Render PostgreSQL. The schema is automatically applied on startup.

To manually push schema changes:
```bash
cd server && npm run db:push
```

## Troubleshooting

### Build Failures
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors
- Verify TypeScript compilation succeeds

### Runtime Errors
- Check Deployment logs in Replit
- Verify all Secrets are configured
- Test database connection

### Performance Issues
- Monitor using Admin Server Monitoring panel
- Check database query performance
- Review Autoscale metrics in Replit

## Custom Domain (Optional)

To use a custom domain:
1. Go to your Deployment settings
2. Click "Add Custom Domain"
3. Follow DNS configuration instructions

## Support

For deployment issues:
- Check Replit Documentation: https://docs.replit.com
- Review deployment logs
- Test locally first with `npm run build && npm run start`
