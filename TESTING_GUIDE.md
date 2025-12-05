# Local Testing Guide

## ✅ Port Configuration Fixed

### Changes Made:
1. **Vite Dev Server**: Changed from port 5000 → **5173** (standard Vite port)
2. **Express Server**: Uses port **3000** (as configured)
3. **Killed processes** that were blocking ports 3000 and 5000

## 🚀 Starting the Application

### Development Mode (Recommended for Testing):
```bash
npm run dev
```

This will start:
- **Server**: `http://localhost:3000` (Express API)
- **Client**: `http://localhost:5173` (Vite dev server)

### How It Works:
1. Open browser to `http://localhost:5173`
2. Client makes API calls like `fetch('/api/crypto/top')`
3. Vite proxy automatically forwards `/api/*` to `http://localhost:3000`
4. Server responds with CORS headers allowing `localhost:5173`

## 📝 Expected Behavior

### Without DATABASE_URL (Demo Mode):
- ✅ Server starts successfully
- ✅ Runs in "demo (mock DB) mode"
- ✅ Most features work with in-memory data
- ⚠️ Some database-dependent features may show errors (expected)
- ⚠️ Data won't persist between restarts

### With DATABASE_URL:
- ✅ Full database functionality
- ✅ Data persists
- ✅ All features enabled

## 🧪 Testing API Endpoints

### Health Check:
```bash
# Server health
curl http://localhost:3000/health

# API status
curl http://localhost:3000/api/status
```

### Test from Browser Console:
```javascript
// Test API call
fetch('/api/crypto/top/10')
  .then(r => r.json())
  .then(console.log)
```

## 🔧 Troubleshooting

### Port Already in Use:
If you see port conflicts:
```powershell
# Find processes using ports
netstat -ano | findstr ":3000 :5173"

# Kill specific process (replace PID)
taskkill /F /PID <process_id>
```

### Database Errors (Expected in Demo Mode):
- Errors like "Cannot read properties of null" are normal without DATABASE_URL
- The app runs in demo mode with mock data
- Set DATABASE_URL in `.env` file for full functionality

## 📋 Next Steps

1. **Start the app**: `npm run dev`
2. **Open browser**: `http://localhost:5173`
3. **Test features**: Try logging in, viewing markets, etc.
4. **Check console**: Look for any errors in browser console
5. **Check server logs**: Monitor terminal for API requests

## 🎯 What to Test

- [ ] Client UI loads at `http://localhost:5173`
- [ ] API calls work (check Network tab in DevTools)
- [ ] Login/Registration (creates session)
- [ ] Crypto market data loads
- [ ] Portfolio features
- [ ] Trading interface
- [ ] Admin dashboard (if admin user exists)

