# Firebase Authentication Setup Guide

Complete guide to setting up Firebase Authentication with Google, Facebook, and Apple OAuth, plus email verification and password reset.

---

## 🎯 Overview

This application supports Firebase Authentication with:
- ✅ Google OAuth
- ✅ Facebook OAuth  
- ✅ Apple OAuth
- ✅ Email/Password with verification
- ✅ Password reset with OTP
- ✅ Email verification with OTP

---

## 🚀 Quick Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `bitpanda-pro` (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable the following providers:
   - ✅ Email/Password
   - ✅ Google
   - ✅ Facebook
   - ✅ Apple

### Step 3: Get Firebase Credentials

#### Option A: Service Account File (Recommended)

1. Go to **Project Settings** → **Service accounts**
2. Click "Generate new private key"
3. Save the JSON file securely
4. Set environment variable:
   ```bash
   FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccountKey.json
   ```

#### Option B: Individual Credentials

1. Go to **Project Settings** → **Service accounts**
2. Copy the following values:
   - Project ID
   - Client Email
   - Private Key

3. Set environment variables:
   ```bash
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
   ```

---

## 🔐 OAuth Provider Setup

### Google OAuth

#### 1. Firebase Console Setup
1. In Firebase Console → **Authentication** → **Sign-in method**
2. Click on **Google**
3. Enable the provider
4. Note the **Web SDK configuration**

#### 2. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** → **Credentials**
4. Click "Create Credentials" → "OAuth client ID"
5. Application type: **Web application**
6. Name: `Bitpanda Pro Web Client`
7. Authorized JavaScript origins:
   ```
   http://localhost:5173
   https://yourdomain.com
   ```
8. Authorized redirect URIs:
   ```
   http://localhost:5173/__/auth/handler
   https://yourdomain.com/__/auth/handler
   ```
9. Copy **Client ID** and **Client Secret**

#### 3. Environment Variables
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

### Facebook OAuth

#### 1. Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Select "Consumer" as app type
4. App name: `Bitpanda Pro`
5. Contact email: your email
6. Click "Create App"

#### 2. Configure Facebook Login
1. In app dashboard, click "Add Product"
2. Find "Facebook Login" and click "Set Up"
3. Select "Web" platform
4. Site URL: `https://yourdomain.com`
5. Go to **Facebook Login** → **Settings**
6. Valid OAuth Redirect URIs:
   ```
   http://localhost:5173/__/auth/handler
   https://yourdomain.com/__/auth/handler
   ```
7. Save changes

#### 3. Get App Credentials
1. Go to **Settings** → **Basic**
2. Copy **App ID** and **App Secret**

#### 4. Firebase Console Setup
1. In Firebase Console → **Authentication** → **Sign-in method**
2. Click on **Facebook**
3. Enable the provider
4. Enter **App ID** and **App Secret**
5. Copy the **OAuth redirect URI**
6. Add this URI to Facebook app settings

#### 5. Environment Variables
```bash
FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-app-secret
```

---

### Apple OAuth

#### 1. Apple Developer Account Setup
1. Go to [Apple Developer](https://developer.apple.com/)
2. Sign in with Apple ID
3. Go to **Certificates, Identifiers & Profiles**

#### 2. Create App ID
1. Click **Identifiers** → **+** button
2. Select "App IDs" → Continue
3. Select "App" → Continue
4. Description: `Bitpanda Pro`
5. Bundle ID: `com.bitpandapro.web` (or your choice)
6. Enable "Sign in with Apple"
7. Click "Continue" → "Register"

#### 3. Create Service ID
1. Click **Identifiers** → **+** button
2. Select "Services IDs" → Continue
3. Description: `Bitpanda Pro Web`
4. Identifier: `com.bitpandapro.web.service`
5. Enable "Sign in with Apple"
6. Click "Configure"
7. Primary App ID: Select the App ID created above
8. Domains and Subdomains:
   ```
   yourdomain.com
   ```
9. Return URLs:
   ```
   https://yourdomain.com/__/auth/handler
   ```
10. Click "Save" → "Continue" → "Register"

#### 4. Create Private Key
1. Click **Keys** → **+** button
2. Key Name: `Bitpanda Pro Sign in with Apple Key`
3. Enable "Sign in with Apple"
4. Click "Configure"
5. Select the Primary App ID
6. Click "Save" → "Continue" → "Register"
7. **Download the .p8 file** (you can only download once!)
8. Note the **Key ID**

#### 5. Firebase Console Setup
1. In Firebase Console → **Authentication** → **Sign-in method**
2. Click on **Apple**
3. Enable the provider
4. Enter:
   - **Service ID**: `com.bitpandapro.web.service`
   - **Team ID**: Found in Apple Developer account
   - **Key ID**: From step 4
   - **Private Key**: Contents of .p8 file
5. Copy the **OAuth redirect URI**
6. Add this URI to Apple Service ID settings

#### 6. Environment Variables
```bash
APPLE_CLIENT_ID=com.bitpandapro.web.service
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
APPLE_PRIVATE_KEY_PATH=/path/to/AuthKey_XXXXX.p8
```

---

## 📧 Email Service Setup (Optional but Recommended)

For sending verification emails and password reset links, configure an email service:

### Option 1: SendGrid (Recommended)

```bash
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Bitpanda Pro
```

### Option 2: Firebase Email Templates

Firebase can send emails automatically. Configure in Firebase Console:
1. Go to **Authentication** → **Templates**
2. Customize email templates for:
   - Email verification
   - Password reset
   - Email address change

---

## 🔧 Complete Environment Variables

Create a `.env` file in the root directory:

```bash
# ===================================
# Firebase Configuration
# ===================================

# Option A: Service Account File (Recommended)
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccountKey.json

# Option B: Individual Credentials
# FIREBASE_PROJECT_ID=your-project-id
# FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"

# ===================================
# OAuth Providers
# ===================================

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Apple OAuth
APPLE_CLIENT_ID=com.bitpandapro.web.service
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY_PATH=/path/to/AuthKey_XXXXX.p8

# ===================================
# Email Service (Optional)
# ===================================
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Bitpanda Pro

# ===================================
# Application URLs
# ===================================
CLIENT_URL=http://localhost:5173  # Development
# CLIENT_URL=https://yourdomain.com  # Production
```

---

## 🎨 Client-Side Integration

### Install Firebase SDK

```bash
cd client
npm install firebase
```

### Initialize Firebase (Client)

Create `client/src/lib/firebase.ts`:

```typescript
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

### Client Environment Variables

Create `client/.env`:

```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Get these values from Firebase Console → **Project Settings** → **General** → **Your apps** → **Web app**

---

## 📱 API Endpoints

### Firebase Auth Endpoints

```
POST   /api/firebase-auth/signup                 - Sign up with email/password
POST   /api/firebase-auth/signin/google          - Sign in with Google
POST   /api/firebase-auth/signin/facebook        - Sign in with Facebook
POST   /api/firebase-auth/signin/apple           - Sign in with Apple
POST   /api/firebase-auth/email/send-verification - Send email verification
POST   /api/firebase-auth/email/verify           - Verify email
POST   /api/firebase-auth/password/reset-request - Request password reset
POST   /api/firebase-auth/password/reset         - Reset password
POST   /api/firebase-auth/link-provider          - Link OAuth provider
POST   /api/firebase-auth/unlink-provider        - Unlink OAuth provider
GET    /api/firebase-auth/status                 - Check Firebase status
```

### OTP Endpoints

```
POST   /api/otp/send                - Send OTP to email
POST   /api/otp/verify              - Verify OTP code
POST   /api/otp/resend              - Resend OTP
POST   /api/otp/reset-password      - Reset password with OTP
GET    /api/otp/status/:email       - Check OTP status
GET    /api/otp/stats               - Get OTP statistics (admin)
```

---

## 🧪 Testing

### Test Firebase Configuration

```bash
curl http://localhost:3000/api/firebase-auth/status
```

Expected response:
```json
{
  "configured": true,
  "message": "Firebase authentication is configured and ready"
}
```

### Test Google OAuth (Client-Side)

```typescript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();
  
  // Send to backend
  const response = await fetch('/api/firebase-auth/signin/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  
  const data = await response.json();
  console.log('Signed in:', data);
};
```

### Test OTP Flow

```bash
# Send OTP
curl -X POST http://localhost:3000/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","type":"email_verification"}'

# Verify OTP
curl -X POST http://localhost:3000/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","code":"123456","type":"email_verification"}'
```

---

## 🔒 Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Enable Firebase Security Rules** for database access
4. **Implement rate limiting** on auth endpoints (already done)
5. **Use HTTPS** in production
6. **Validate tokens** on every request
7. **Implement CSRF protection** (already done)
8. **Set secure cookie flags** in production

---

## 🐛 Troubleshooting

### Firebase Not Configured

**Error:** `Firebase authentication is not configured`

**Solution:** Set `FIREBASE_SERVICE_ACCOUNT_PATH` or individual credentials

### Google OAuth Redirect URI Mismatch

**Error:** `redirect_uri_mismatch`

**Solution:** Add your redirect URI to Google Cloud Console → Credentials → OAuth 2.0 Client IDs

### Facebook OAuth Error

**Error:** `Can't Load URL: The domain of this URL isn't included in the app's domains`

**Solution:** Add your domain to Facebook App Settings → Basic → App Domains

### Apple OAuth Error

**Error:** `invalid_client`

**Solution:** Verify Service ID, Team ID, Key ID, and private key are correct

### OTP Not Received

**Issue:** OTP code not sent to email

**Solution:** 
- In development, OTP is logged to console
- In production, configure SendGrid or Firebase email templates
- Check spam folder

---

## 📚 Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Docs](https://developers.facebook.com/docs/facebook-login)
- [Sign in with Apple](https://developer.apple.com/sign-in-with-apple/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Authentication methods enabled in Firebase Console
- [ ] Service account key downloaded or credentials copied
- [ ] Environment variables set
- [ ] Google OAuth configured (if using)
- [ ] Facebook OAuth configured (if using)
- [ ] Apple OAuth configured (if using)
- [ ] Client-side Firebase initialized
- [ ] Test authentication flow
- [ ] Email service configured (optional)
- [ ] OTP system tested
- [ ] Password reset tested

---

**Last Updated:** 2024-11-21  
**Version:** 1.0.0
