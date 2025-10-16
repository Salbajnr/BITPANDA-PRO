
# Render Deployment Guide - Separate Static & Server

This guide explains how to deploy BitpandaPro with the client as a static site and the server as a separate web service on Render.

## Architecture Overview

- **Static Site**: Hosts the React frontend (client)
- **Web Service**: Hosts the Node.js/Express API (server)
- **Database**: Render PostgreSQL

## Prerequisites

1. Render account (free tier works)
2. GitHub repository connected to Render
3. PostgreSQL database created on Render

---

## Part 1: Deploy the Server (API)

### Step 1: Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Settings:**
- **Name**: `bitpandapro-server` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (uses project root)
- **Build Command**: `npm ci && npm run build:server`
- **Start Command**: `npm start`
- **Plan**: Free (or upgrade as needed)

### Step 2: Configure Environment Variables

Add these environment variables in the Render dashboard:

**Required:**
```
NODE_VERSION=20.19.3
NODE_ENV=production
DATABASE_URL=<your-render-postgresql-url>
COOKIE_SECRET=<generate-random-string-min-32-chars>
```

**Optional (for full functionality):**
```
COINGECKO_API_KEY=<your-api-key>
NEWS_API_KEY=<your-api-key>
METALS_API_KEY=<your-api-key>
PGCONNECT_TIMEOUT=60
PGCOMMAND_TIMEOUT=60
```

**Generate COOKIE_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Deploy

1. Click **"Create Web Service"**
2. Wait for the build to complete
3. Note your API URL (e.g., `https://bitpandapro-server.onrender.com`)

---

## Part 2: Deploy the Static Site (Client)

### Step 1: Create Static Site

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect the same GitHub repository
3. Configure the site:

**Settings:**
- **Name**: `bitpandapro-client` (or your preferred name)
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Build Command**: `npm ci && npm run build:client`
- **Publish Directory**: `dist/public`
- **Pull Request Previews**: Enabled (optional)

### Step 2: Configure Environment Variables

Add these in the static site environment variables:

```
VITE_API_URL=<your-server-url-from-part-1>
```

Example:
```
VITE_API_URL=https://bitpandapro-server.onrender.com
```

### Step 3: Deploy

1. Click **"Create Static Site"**
2. Wait for the build to complete
3. Your site will be live at `https://bitpandapro-client.onrender.com`

---

## Part 3: Configure CORS

Update your server to allow requests from your static site:

In your `server/index.ts` or CORS configuration, add:

```typescript
const allowedOrigins = [
  'https://bitpandapro-client.onrender.com',
  // Add custom domain if you have one
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

## Part 4: Database Setup

### Option A: Use Render PostgreSQL

1. Create PostgreSQL database in Render
2. Copy the **External Database URL**
3. Add it to your server's `DATABASE_URL` environment variable

### Option B: Use External PostgreSQL

Use any PostgreSQL provider and add the connection string to `DATABASE_URL`.

### Run Migrations

After deployment, run migrations:

```bash
# Using Render Shell (in server service)
npm run db:push
```

---

## Part 5: Custom Domains (Optional)

### For Static Site:
1. Go to your static site settings
2. Click **"Custom Domain"**
3. Add your domain (e.g., `app.yourdomain.com`)
4. Follow DNS configuration instructions

### For Server:
1. Go to your web service settings
2. Click **"Custom Domain"**
3. Add your API domain (e.g., `api.yourdomain.com`)
4. Update `VITE_API_URL` in static site to use new domain

---

## Deployment Checklist

**Server Deployment:**
- [ ] Web service created
- [ ] Environment variables configured
- [ ] Database connected
- [ ] Build successful
- [ ] API accessible at URL

**Static Site Deployment:**
- [ ] Static site created
- [ ] `VITE_API_URL` points to server
- [ ] Build successful
- [ ] Site accessible at URL

**Post-Deployment:**
- [ ] CORS configured correctly
- [ ] Database migrations run
- [ ] Test authentication flow
- [ ] Test API endpoints
- [ ] Check browser console for errors

---

## Troubleshooting

### Build Fails

**Server:**
- Check Node version is 20.x
- Verify all dependencies are in `package.json`
- Check build logs for TypeScript errors

**Static Site:**
- Ensure Vite can access all source files
- Check for missing dependencies
- Verify `VITE_API_URL` is set

### CORS Errors

- Verify `VITE_API_URL` matches server URL exactly (no trailing slash)
- Check server CORS configuration includes static site origin
- Ensure `credentials: true` is set in both CORS and fetch requests

### Database Connection Issues

- Verify `DATABASE_URL` is correctly formatted
- Check database is running and accessible
- Increase timeout values if needed

### Authentication Issues

- Ensure `COOKIE_SECRET` is set and consistent
- Check cookies are allowed in browser
- Verify session storage is configured

---

## Monitoring & Logs

### View Logs:
1. Go to your service in Render Dashboard
2. Click **"Logs"** tab
3. Filter by timestamp or search for errors

### Set Up Alerts:
1. Go to service settings
2. Click **"Notifications"**
3. Add email or Slack alerts for failures

---

## Cost Optimization

**Free Tier Limits:**
- Static Sites: Unlimited (100GB bandwidth/month)
- Web Services: Spin down after 15 min inactivity
- Database: 90 days retention, then deleted

**Tips:**
- Use static site for all frontend assets
- Keep server lightweight (API only)
- Implement caching to reduce database queries
- Consider paid plan for always-on server

---

## Updates & Redeployment

### Auto-Deploy on Git Push:
Both services auto-deploy when you push to your connected branch.

### Manual Deploy:
1. Go to service in Render Dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Rollback:
1. Go to **"Events"** tab
2. Find previous successful deployment
3. Click **"Rollback"**

---

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com/
- Project Issues: Open issue in GitHub repository
