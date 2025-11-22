# Render Deployment Guide

Complete guide to deploying BITPANDA-PRO on Render.

---

## 🚀 Quick Deploy

### Option 1: Using render.yaml (Recommended)

1. **Push to GitHub** (already done)
   ```bash
   git push origin master
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository: `Salbajnr/BITPANDA-PRO`
   - Render will automatically detect `render.yaml`
   - Click "Apply"

3. **Set Environment Variables**
   - Render will prompt for required variables
   - See "Environment Variables" section below

### Option 2: Manual Setup

1. **Create PostgreSQL Database**
   - Go to Render Dashboard
   - Click "New" → "PostgreSQL"
   - Name: `bitpanda-pro-db`
   - Plan: Free
   - Click "Create Database"
   - Copy the "Internal Database URL"

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect GitHub repository: `Salbajnr/BITPANDA-PRO`
   - Configure:
     - **Name:** `bitpanda-pro`
     - **Region:** Oregon (US West)
     - **Branch:** `master`
     - **Root Directory:** (leave empty)
     - **Environment:** `Node`
     - **Build Command:** `npm run install:all && npm run build`
     - **Start Command:** `npm start`
     - **Plan:** Free

3. **Set Environment Variables** (see below)

---

## 🔧 Build Configuration

### Build Command
```bash
npm run install:all && npm run build
```

**What it does:**
1. Installs root dependencies
2. Installs client dependencies
3. Installs server dependencies
4. Builds client (Vite)

### Start Command
```bash
npm start
```

**What it does:**
- Runs: `NODE_ENV=production node --import tsx server/index.ts`
- Serves both API and static client files

---

## 🔑 Environment Variables

### Required Variables

```bash
# Database (from Render PostgreSQL)
DATABASE_URL=<Internal Database URL from Render>

# Security (Generate these)
COOKIE_SECRET=<32+ character random string>
SESSION_SECRET=<32+ character random string>
SESSION_SECRET_REFRESH=<32+ character random string>
JWT_SECRET=<32+ character random string>

# Server Configuration
NODE_ENV=production
PORT=10000
CLIENT_URL=https://your-app-name.onrender.com
```

### Generate Secrets

Run these commands locally and copy the output:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Optional Variables (Enhanced Features)

```bash
# CoinGecko API (for crypto prices)
COINGECKO_API_KEY=your-api-key

# News API (for news feed)
NEWS_API_KEY=your-api-key

# SendGrid (for emails)
SENDGRID_API_KEY=your-api-key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Bitpanda Pro

# Firebase (for OAuth)
FIREBASE_SERVICE_ACCOUNT_PATH=/etc/secrets/firebase-service-account.json
# OR
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Metals API (for metals trading)
METALS_API_KEY=your-api-key
```

---

## 🐛 Common Build Errors & Fixes

### Error 1: "npm ERR! code ENOENT"

**Cause:** Missing dependencies or incorrect build command

**Fix:**
```bash
# Build Command should be:
npm run install:all && npm run build
```

### Error 2: "Module not found: firebase-admin"

**Cause:** firebase-admin not installed

**Fix:** Already added to package.json. If still failing:
```bash
# In Render Shell or locally:
npm install firebase-admin --save
git add package.json package-lock.json
git commit -m "Add firebase-admin dependency"
git push origin master
```

### Error 3: "Cannot find module 'tsx'"

**Cause:** tsx not installed

**Fix:** Already in dependencies. Ensure build command installs all deps:
```bash
npm run install:all && npm run build
```

### Error 4: "Client build failed"

**Cause:** Client dependencies not installed or Vite build error

**Fix:**
1. Check if `client/package.json` exists
2. Ensure build command includes `npm run install:all`
3. Check Render build logs for specific Vite errors

### Error 5: "Database connection failed"

**Cause:** DATABASE_URL not set or incorrect

**Fix:**
1. Go to Render Dashboard → PostgreSQL database
2. Copy "Internal Database URL"
3. Set as `DATABASE_URL` environment variable
4. Format: `postgresql://user:password@host:port/database`

### Error 6: "Port already in use"

**Cause:** PORT environment variable not set

**Fix:**
- Render automatically sets PORT to 10000
- Ensure your code uses `process.env.PORT`
- Already configured in `server/index.ts`

### Error 7: "Build exceeded memory limit"

**Cause:** Not enough memory during build

**Fix:**
1. Upgrade to paid plan (more memory)
2. OR optimize build:
   ```bash
   # Reduce memory usage
   NODE_OPTIONS=--max-old-space-size=2048 npm run build
   ```

### Error 8: "CORS errors in production"

**Cause:** CLIENT_URL not set correctly

**Fix:**
```bash
# Set CLIENT_URL to your Render app URL
CLIENT_URL=https://your-app-name.onrender.com
```

---

## 📝 Step-by-Step Deployment

### Step 1: Prepare Repository

```bash
# Ensure all changes are committed
git status
git add -A
git commit -m "Prepare for Render deployment"
git push origin master
```

### Step 2: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "PostgreSQL"
3. Configure:
   - **Name:** `bitpanda-pro-db`
   - **Database:** `bitpanda_pro`
   - **User:** `bitpanda_user`
   - **Region:** Oregon (US West)
   - **Plan:** Free
4. Click "Create Database"
5. Wait for database to be created
6. Copy "Internal Database URL"

### Step 3: Create Web Service

1. Click "New" → "Web Service"
2. Connect GitHub repository
3. Select `Salbajnr/BITPANDA-PRO`
4. Configure:
   - **Name:** `bitpanda-pro`
   - **Region:** Oregon (same as database)
   - **Branch:** `master`
   - **Root Directory:** (leave empty)
   - **Environment:** `Node`
   - **Build Command:** `npm run install:all && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Step 4: Set Environment Variables

Click "Advanced" → "Add Environment Variable"

**Required:**
```
DATABASE_URL = <paste Internal Database URL>
COOKIE_SECRET = <generate with command above>
SESSION_SECRET = <generate with command above>
SESSION_SECRET_REFRESH = <generate with command above>
JWT_SECRET = <generate with command above>
NODE_ENV = production
PORT = 10000
CLIENT_URL = https://bitpanda-pro.onrender.com
```

**Optional (add as needed):**
```
COINGECKO_API_KEY = your-key
NEWS_API_KEY = your-key
SENDGRID_API_KEY = your-key
EMAIL_FROM = noreply@yourdomain.com
```

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will start building
3. Monitor build logs
4. Wait for "Live" status (5-10 minutes)

### Step 6: Run Database Migrations

1. Go to your web service
2. Click "Shell" tab
3. Run:
   ```bash
   npm run db:push
   ```

### Step 7: Test Deployment

1. Visit your app URL: `https://your-app-name.onrender.com`
2. Test registration
3. Test login
4. Check if crypto prices load
5. Test trading functionality

---

## 🔍 Debugging Build Failures

### View Build Logs

1. Go to Render Dashboard
2. Click on your web service
3. Click "Logs" tab
4. Look for error messages

### Common Log Patterns

**Success:**
```
==> Building...
==> Installing dependencies...
==> Building client...
==> Build successful!
==> Starting server...
🚀 Backend API Server running on 0.0.0.0:10000
```

**Failure:**
```
==> Building...
npm ERR! code ENOENT
npm ERR! syscall open
```

### Enable Debug Logging

Add to environment variables:
```bash
DEBUG=*
LOG_LEVEL=debug
```

---

## 🚨 Troubleshooting Checklist

- [ ] Repository pushed to GitHub
- [ ] `render.yaml` exists in root
- [ ] PostgreSQL database created
- [ ] DATABASE_URL set correctly
- [ ] All required secrets generated and set
- [ ] Build command is correct
- [ ] Start command is correct
- [ ] PORT is set to 10000
- [ ] CLIENT_URL matches your Render URL
- [ ] Node version compatible (18+)
- [ ] All dependencies in package.json
- [ ] firebase-admin in dependencies
- [ ] Build logs checked for errors

---

## 📊 Render Free Tier Limits

- **Web Service:** 750 hours/month (sleeps after 15 min inactivity)
- **PostgreSQL:** 1GB storage, 97 connection limit
- **Build Time:** 15 minutes max
- **Memory:** 512MB RAM
- **Bandwidth:** 100GB/month

**Note:** Free tier services sleep after 15 minutes of inactivity. First request after sleep takes 30-60 seconds.

---

## 🔄 Updating Deployment

### Push Updates

```bash
git add -A
git commit -m "Update feature"
git push origin master
```

Render will automatically rebuild and redeploy.

### Manual Redeploy

1. Go to Render Dashboard
2. Click on your web service
3. Click "Manual Deploy" → "Deploy latest commit"

### Rollback

1. Go to Render Dashboard
2. Click on your web service
3. Click "Events" tab
4. Find previous successful deploy
5. Click "Rollback"

---

## 🎯 Production Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables set
- [ ] HTTPS enabled (automatic on Render)
- [ ] Custom domain configured (optional)
- [ ] Health check endpoint working (`/health`)
- [ ] Error monitoring set up
- [ ] Backup strategy in place
- [ ] API keys secured
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Logs monitored

---

## 🔗 Useful Links

- [Render Dashboard](https://dashboard.render.com/)
- [Render Docs](https://render.com/docs)
- [Render Status](https://status.render.com/)
- [Render Community](https://community.render.com/)

---

## 💡 Tips

1. **Use Internal Database URL** - Faster and free bandwidth
2. **Monitor Logs** - Check regularly for errors
3. **Set up Alerts** - Get notified of deployment failures
4. **Use Environment Groups** - Share variables across services
5. **Enable Auto-Deploy** - Automatic deploys on git push
6. **Test Locally First** - Use `npm run build && npm start`
7. **Keep Secrets Secure** - Never commit to git
8. **Use Render Shell** - For debugging and running commands

---

## 🆘 Still Having Issues?

### Check These Files

1. **package.json** - Ensure all dependencies listed
2. **server/index.ts** - Check PORT configuration
3. **client/vite.config.js** - Check build configuration
4. **render.yaml** - Verify configuration

### Get Help

1. **Render Logs** - Most errors shown here
2. **Render Community** - Ask questions
3. **GitHub Issues** - Check for known issues
4. **Documentation** - Review all setup guides

### Contact Support

If build still fails after trying all fixes:
1. Copy full build log
2. Note exact error message
3. List environment variables (hide secrets)
4. Contact Render support with details

---

**Last Updated:** 2024-11-21  
**Version:** 1.0.0  
**Status:** ✅ Ready for Deployment
