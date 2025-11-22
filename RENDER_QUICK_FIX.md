# Render Quick Fix Guide

Fast solutions for common Render deployment issues.

---

## 🚨 Build Failing? Try These First

### 1. Check Build Command

**In Render Dashboard → Settings:**
```bash
Build Command: npm run install:all && npm run build
Start Command: npm start
```

### 2. Check Environment Variables

**Required (must be set):**
```
DATABASE_URL
COOKIE_SECRET
SESSION_SECRET  
SESSION_SECRET_REFRESH
JWT_SECRET
NODE_ENV=production
PORT=10000
CLIENT_URL=https://your-app.onrender.com
```

### 3. Check Node Version

**Add `.node-version` file in root:**
```
20.11.0
```

### 4. Common Error Messages

#### "Cannot find module 'tsx'"
**Fix:** Already in package.json. Clear build cache:
- Render Dashboard → Settings → "Clear build cache & deploy"

#### "Cannot find module 'firebase-admin'"
**Fix:** Already in package.json. If still failing:
```bash
npm install firebase-admin --save
git add package.json package-lock.json
git commit -m "Ensure firebase-admin in dependencies"
git push
```

#### "npm ERR! code ENOENT"
**Fix:** Wrong build command. Use:
```bash
npm run install:all && npm run build
```

#### "Client build failed"
**Fix:** Check client dependencies:
```bash
cd client
npm install
npm run build
```
If works locally, clear Render build cache.

#### "Database connection failed"
**Fix:** 
1. Get Internal Database URL from Render PostgreSQL
2. Set as `DATABASE_URL` environment variable
3. Format: `postgresql://user:password@host:port/database`

#### "Port 5000 already in use"
**Fix:** Render uses PORT=10000. Ensure:
```javascript
const PORT = process.env.PORT || 5000;
```

#### "Build exceeded time limit"
**Fix:** 
- Upgrade to paid plan, OR
- Optimize build (remove unnecessary dependencies)

---

## 🔧 Quick Fixes

### Fix 1: Clear Build Cache
1. Render Dashboard → Your Service
2. Settings → "Clear build cache & deploy"

### Fix 2: Check Logs
1. Render Dashboard → Your Service
2. Logs tab → Look for red error messages
3. Copy exact error and search in RENDER_DEPLOYMENT.md

### Fix 3: Verify Package.json
```json
{
  "scripts": {
    "build": "npm run build:client",
    "start": "cross-env NODE_ENV=production node --max-old-space-size=4096 --import tsx server/index.ts"
  },
  "dependencies": {
    "tsx": "^4.20.6",
    "firebase-admin": "^12.0.0",
    "cross-env": "^7.0.3"
  }
}
```

### Fix 4: Test Locally
```bash
# Install all dependencies
npm run install:all

# Build client
npm run build

# Start server
npm start

# Should work on http://localhost:5000
```

### Fix 5: Check Database
```bash
# In Render Shell
echo $DATABASE_URL

# Should output: postgresql://...
# If empty, DATABASE_URL not set
```

---

## 📋 Deployment Checklist

Before deploying, verify:

- [ ] All code committed and pushed to GitHub
- [ ] `render.yaml` exists in root
- [ ] `.node-version` file exists (20.11.0)
- [ ] PostgreSQL database created on Render
- [ ] DATABASE_URL copied from Render PostgreSQL
- [ ] All secrets generated (use crypto.randomBytes)
- [ ] Build command: `npm run install:all && npm run build`
- [ ] Start command: `npm start`
- [ ] Environment variables set in Render
- [ ] Build logs checked for errors

---

## 🎯 Most Common Issues

### Issue #1: Missing Environment Variables
**Symptom:** App crashes immediately after deploy  
**Fix:** Set all required environment variables

### Issue #2: Wrong Build Command
**Symptom:** Build fails with "command not found"  
**Fix:** Use exact command: `npm run install:all && npm run build`

### Issue #3: Database Not Connected
**Symptom:** "Database connection failed" in logs  
**Fix:** Set DATABASE_URL from Render PostgreSQL (Internal URL)

### Issue #4: Module Not Found
**Symptom:** "Cannot find module 'xxx'"  
**Fix:** Clear build cache and redeploy

### Issue #5: Port Issues
**Symptom:** "Port already in use" or "EADDRINUSE"  
**Fix:** Ensure code uses `process.env.PORT`

---

## 🆘 Still Failing?

### Step 1: Get Full Error
1. Render Dashboard → Logs
2. Copy the FULL error message (not just last line)
3. Look for the actual error (usually in red)

### Step 2: Search Documentation
- Check RENDER_DEPLOYMENT.md for detailed fixes
- Search for your exact error message

### Step 3: Test Locally
```bash
# Set environment variables
export DATABASE_URL="postgresql://..."
export NODE_ENV="production"
export PORT="5000"

# Run build
npm run install:all && npm run build

# Start server
npm start

# If works locally but not on Render, it's a Render config issue
```

### Step 4: Common Solutions
1. Clear build cache
2. Verify all environment variables
3. Check Node version (.node-version file)
4. Ensure all dependencies in package.json
5. Check build command is correct

---

## 📞 Get Help

**Render Community:** https://community.render.com/  
**Render Docs:** https://render.com/docs  
**Render Status:** https://status.render.com/

**Include in your question:**
- Full error message from logs
- Build command used
- Environment variables (hide secrets)
- Node version
- What you've already tried

---

## ✅ Success Indicators

**Build logs should show:**
```
==> Installing dependencies...
added 1234 packages

==> Building client...
vite v5.x.x building for production...
✓ built in 30s

==> Build successful!

==> Starting server...
🚀 Backend API Server running on 0.0.0.0:10000
✅ Database connection pool initialized
✅ WebSocket servers initialized
```

**Your app should:**
- Load at https://your-app.onrender.com
- Show login/register page
- Connect to database
- Load crypto prices
- Not show any console errors

---

**Quick Reference:** Keep this file open while deploying!
