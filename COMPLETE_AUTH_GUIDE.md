# Complete Authentication Guide

Your one-stop guide for all authentication features in BITPANDA-PRO.

---

## 🎉 What's Available

### ✅ Fully Implemented & Ready

1. **Email/Password Authentication** - Traditional login system
2. **Google OAuth** - Sign in with Google (via Firebase)
3. **Facebook OAuth** - Sign in with Facebook (via Firebase)
4. **Apple OAuth** - Sign in with Apple ID (via Firebase)
5. **Email Verification** - OTP-based verification (works without Firebase)
6. **Password Reset** - OTP-based reset (works without Firebase)
7. **Session Management** - Secure session handling
8. **CSRF Protection** - Built-in security
9. **Rate Limiting** - Prevent abuse

---

## 🚀 Quick Start (3 Options)

### Option 1: Minimum Setup (No Firebase)

**What Works:**
- ✅ Email/Password registration and login
- ✅ Email verification via OTP (code in console)
- ✅ Password reset via OTP (code in console)
- ❌ No OAuth (Google, Facebook, Apple)

**Setup:**
```bash
# Just set required env vars
DATABASE_URL=postgresql://...
COOKIE_SECRET=<generate>
SESSION_SECRET=<generate>
SESSION_SECRET_REFRESH=<generate>
JWT_SECRET=<generate>

# Start server
npm run dev
```

**Test:**
```bash
# Send OTP
curl -X POST http://localhost:3000/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","type":"email_verification"}'

# Check console for OTP code
# Verify OTP
curl -X POST http://localhost:3000/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456","type":"email_verification"}'
```

---

### Option 2: With Firebase (Full OAuth)

**What Works:**
- ✅ Everything from Option 1
- ✅ Google OAuth
- ✅ Facebook OAuth
- ✅ Apple OAuth
- ✅ Firebase email verification links
- ✅ Firebase password reset links

**Setup:**
1. Create Firebase project: [console.firebase.google.com](https://console.firebase.google.com/)
2. Download service account key
3. Set environment variable:
   ```bash
   FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccountKey.json
   ```
4. Enable auth providers in Firebase Console
5. Configure OAuth apps (see [FIREBASE_AUTH_SETUP.md](./FIREBASE_AUTH_SETUP.md))

**Test:**
```bash
# Check Firebase status
curl http://localhost:3000/api/firebase-auth/status

# Should return:
# {"configured":true,"message":"Firebase authentication is configured and ready"}
```

---

### Option 3: Production Ready (With Email Service)

**What Works:**
- ✅ Everything from Option 2
- ✅ OTP codes sent via email
- ✅ Professional email templates
- ✅ Email notifications

**Setup:**
1. Complete Option 2 setup
2. Get SendGrid API key: [sendgrid.com](https://sendgrid.com/)
3. Set environment variables:
   ```bash
   SENDGRID_API_KEY=your-api-key
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_FROM_NAME=Bitpanda Pro
   ```

---

## 📱 API Endpoints Reference

### Firebase Auth Endpoints

```bash
# Sign Up
POST /api/firebase-auth/signup
Body: {
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

# Google OAuth
POST /api/firebase-auth/signin/google
Body: { "idToken": "firebase-id-token" }

# Facebook OAuth
POST /api/firebase-auth/signin/facebook
Body: { "idToken": "firebase-id-token" }

# Apple OAuth
POST /api/firebase-auth/signin/apple
Body: { "idToken": "firebase-id-token" }

# Send Email Verification
POST /api/firebase-auth/email/send-verification
Body: { "email": "user@example.com" }

# Verify Email
POST /api/firebase-auth/email/verify
Body: { "email": "user@example.com" }

# Request Password Reset
POST /api/firebase-auth/password/reset-request
Body: { "email": "user@example.com" }

# Reset Password
POST /api/firebase-auth/password/reset
Body: {
  "email": "user@example.com",
  "newPassword": "newpassword123"
}

# Link OAuth Provider
POST /api/firebase-auth/link-provider
Body: {
  "provider": "google",
  "providerId": "google-user-id"
}

# Unlink OAuth Provider
POST /api/firebase-auth/unlink-provider
Body: { "provider": "google" }

# Check Firebase Status
GET /api/firebase-auth/status
```

### OTP Endpoints

```bash
# Send OTP
POST /api/otp/send
Body: {
  "email": "user@example.com",
  "type": "email_verification"  # or "password_reset" or "2fa"
}

# Verify OTP
POST /api/otp/verify
Body: {
  "email": "user@example.com",
  "code": "123456",
  "type": "email_verification"
}

# Resend OTP
POST /api/otp/resend
Body: {
  "email": "user@example.com",
  "type": "email_verification"
}

# Reset Password with OTP
POST /api/otp/reset-password
Body: {
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "newpassword123"
}

# Check OTP Status
GET /api/otp/status/:email?type=email_verification

# Get OTP Statistics (Admin)
GET /api/otp/stats
```

---

## 💻 Client-Side Integration

### Install Firebase SDK

```bash
cd client
npm install firebase
```

### Initialize Firebase

```typescript
// client/src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Google OAuth Component

```typescript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useState } from 'react';

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Sign in with Google popup
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Get Firebase ID token
      const idToken = await result.user.getIdToken();
      
      // Send to backend
      const response = await fetch('/api/firebase-auth/signin/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Sign in failed');
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="btn-google"
      >
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### OTP Verification Component

```typescript
import { useState } from 'react';

export function OTPVerification({ email }: { email: string }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const sendOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          type: 'email_verification'
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('OTP sent! Check your email (or console in development)');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: otp,
          type: 'email_verification'
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        alert('Email verified successfully!');
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-verification">
      <h3>Verify Your Email</h3>
      <p>Email: {email}</p>
      
      <button onClick={sendOTP} disabled={loading}>
        {loading ? 'Sending...' : 'Send OTP'}
      </button>
      
      <div className="otp-input">
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit OTP"
          disabled={loading || success}
        />
        <button onClick={verifyOTP} disabled={loading || success || otp.length !== 6}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </div>
      
      {error && <p className="error">{error}</p>}
      {success && <p className="success">✅ Email verified!</p>}
    </div>
  );
}
```

---

## 🔐 Environment Variables

### Required (All Setups)

```bash
DATABASE_URL=postgresql://user:password@host:port/database
COOKIE_SECRET=<32+ characters>
SESSION_SECRET=<32+ characters>
SESSION_SECRET_REFRESH=<32+ characters>
JWT_SECRET=<32+ characters>
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Optional: Firebase (For OAuth)

```bash
# Option A: Service Account File (Recommended)
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccountKey.json

# Option B: Individual Credentials
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Optional: Email Service (For Production)

```bash
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Bitpanda Pro
```

---

## 📚 Documentation Files

1. **[FIREBASE_AUTH_SETUP.md](./FIREBASE_AUTH_SETUP.md)**
   - Complete Firebase setup guide
   - OAuth provider configuration (Google, Facebook, Apple)
   - Step-by-step instructions with screenshots

2. **[AUTH_IMPLEMENTATION_SUMMARY.md](./AUTH_IMPLEMENTATION_SUMMARY.md)**
   - Technical implementation details
   - API endpoints reference
   - Security features
   - Testing procedures

3. **[ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)**
   - All environment variables
   - Configuration options
   - Feature availability matrix

4. **[QUICK_START.md](./QUICK_START.md)**
   - 5-minute setup guide
   - Common commands
   - Troubleshooting

---

## 🧪 Testing Checklist

### Without Firebase

- [ ] Server starts without errors
- [ ] OTP can be sent (check console for code)
- [ ] OTP can be verified
- [ ] Password reset with OTP works
- [ ] Email/password registration works
- [ ] Email/password login works

### With Firebase

- [ ] Firebase status endpoint returns configured
- [ ] Google OAuth popup works
- [ ] Google OAuth creates/links user
- [ ] Facebook OAuth popup works
- [ ] Facebook OAuth creates/links user
- [ ] Apple OAuth works
- [ ] Provider linking works
- [ ] Provider unlinking works

### With Email Service

- [ ] OTP sent via email
- [ ] Email verification link sent
- [ ] Password reset link sent
- [ ] Email templates look professional

---

## 🎯 Common Use Cases

### Use Case 1: User Registration with Email Verification

```typescript
// 1. Register user
const register = await fetch('/api/user/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe'
  }),
});

// 2. Send OTP for verification
await fetch('/api/otp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    type: 'email_verification'
  }),
});

// 3. User enters OTP from email/console
// 4. Verify OTP
await fetch('/api/otp/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    code: '123456',
    type: 'email_verification'
  }),
});

// 5. User is now verified and can access full features
```

### Use Case 2: Social Login (Google)

```typescript
// 1. User clicks "Sign in with Google"
// 2. Firebase popup opens
const result = await signInWithPopup(auth, new GoogleAuthProvider());

// 3. Get ID token
const idToken = await result.user.getIdToken();

// 4. Send to backend
const response = await fetch('/api/firebase-auth/signin/google', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ idToken }),
});

// 5. User is logged in, redirect to dashboard
if (response.ok) {
  window.location.href = '/dashboard';
}
```

### Use Case 3: Password Reset

```typescript
// 1. User requests password reset
await fetch('/api/otp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    type: 'password_reset'
  }),
});

// 2. User receives OTP via email/console
// 3. User enters OTP and new password
await fetch('/api/otp/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    code: '123456',
    newPassword: 'newpassword123'
  }),
});

// 4. Password is reset, user can login with new password
```

---

## 🔒 Security Features

- ✅ **Rate Limiting** - Prevent brute force attacks
- ✅ **OTP Expiration** - 10-minute validity
- ✅ **Attempt Limiting** - Maximum 5 verification attempts
- ✅ **Token Validation** - Firebase ID tokens verified
- ✅ **CSRF Protection** - Built-in CSRF tokens
- ✅ **Password Hashing** - Bcrypt with salt
- ✅ **Session Security** - Secure cookie configuration
- ✅ **Input Validation** - Zod schema validation
- ✅ **SQL Injection Prevention** - Parameterized queries

---

## 🚨 Troubleshooting

### "Firebase not configured" error

**Solution:** Set `FIREBASE_SERVICE_ACCOUNT_PATH` or individual Firebase credentials

### OTP not received

**Solution:** 
- In development: Check server console for OTP code
- In production: Configure SendGrid API key

### OAuth redirect URI mismatch

**Solution:** Add your redirect URI to OAuth provider settings (Google Cloud Console, Facebook App, Apple Developer)

### "Invalid Firebase token" error

**Solution:** Ensure Firebase project ID matches between client and server

---

## ✅ Summary

You now have a complete, production-ready authentication system with:

- ✅ Multiple authentication methods
- ✅ Email verification
- ✅ Password reset
- ✅ OAuth integration (Google, Facebook, Apple)
- ✅ Secure session management
- ✅ Rate limiting and security features
- ✅ Comprehensive documentation
- ✅ Ready for production deployment

**Next Steps:**
1. Choose your setup option (1, 2, or 3)
2. Set environment variables
3. Test authentication flows
4. Deploy to production

---

**Last Updated:** 2024-11-21  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
