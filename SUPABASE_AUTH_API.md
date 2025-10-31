# Supabase Authentication API Documentation

Complete API documentation for the BitpandaPro Supabase Auth integration.

## Table of Contents
- [Setup](#setup)
- [Email/Password Authentication](#emailpassword-authentication)
- [Phone Authentication](#phone-authentication)
- [Social Authentication (OAuth)](#social-authentication-oauth)
- [Password Management](#password-management)
- [Email Verification](#email-verification)
- [Session Management](#session-management)
- [Error Handling](#error-handling)

## Setup

### Required Environment Variables

Add these to your Replit Secrets or `.env` file:

```env
# Supabase Configuration (Required for auth)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OAuth Providers (Optional - configure in Supabase Dashboard)
# Enable these in: Supabase Dashboard > Authentication > Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
```

### Supabase Dashboard Setup

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Providers**
3. Enable the providers you want:
   - Email
   - Phone (requires Twilio integration)
   - Google OAuth
   - Facebook OAuth
   - Apple OAuth
4. Configure each provider with the credentials above

---

## Email/Password Authentication

### Sign Up with Email

**Endpoint:** `POST /api/supabase-auth/signup/email`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",          // Optional
  "lastName": "Doe",             // Optional
  "username": "johndoe"          // Optional
}
```

**Success Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "email_confirmed_at": null
  },
  "session": null,  // null until email is verified
  "message": "Please check your email to verify your account"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "User already registered"
}
```

**Notes:**
- Password must be at least 8 characters
- Sends verification email automatically
- User cannot sign in until email is verified

---

### Sign In with Email

**Endpoint:** `POST /api/supabase-auth/signin/email`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "email_confirmed_at": "2025-10-26T10:00:00Z",
    "user_metadata": {
      "first_name": "John",
      "last_name": "Doe"
    }
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token",
    "expires_in": 3600
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid login credentials"
}
```

---

## Phone Authentication

### Sign Up / Sign In with Phone (Send OTP)

**Endpoint:** `POST /api/supabase-auth/signup/phone`  
**Or:** `POST /api/supabase-auth/signin/phone`

**Request Body:**
```json
{
  "phone": "+1234567890"  // Must be E.164 format
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to your phone"
}
```

**Notes:**
- Phone number must be in E.164 format (e.g., +1234567890)
- OTP is valid for 60 seconds by default
- Same endpoint works for both signup and signin

---

### Verify Phone OTP

**Endpoint:** `POST /api/supabase-auth/signin/phone`  
**Or:** `POST /api/supabase-auth/phone/verify-otp`

**Request Body:**
```json
{
  "phone": "+1234567890",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "phone": "+1234567890",
    "phone_confirmed_at": "2025-10-26T10:00:00Z"
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token",
    "expires_in": 3600
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid OTP"
}
```

---

### Resend Phone OTP

**Endpoint:** `POST /api/supabase-auth/phone/send-otp`

**Request Body:**
```json
{
  "phone": "+1234567890"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to your phone"
}
```

---

## Social Authentication (OAuth)

### Initiate OAuth Sign In

**Endpoint:** `GET /api/supabase-auth/oauth/:provider`

**Supported Providers:**
- `google`
- `facebook`
- `apple`
- `github`
- `twitter`

**Example:** `GET /api/supabase-auth/oauth/google`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Redirecting to OAuth provider...",
  "session": {
    "url": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

**Frontend Example:**
```javascript
// Redirect user to OAuth provider
async function signInWithGoogle() {
  const response = await fetch('/api/supabase-auth/oauth/google');
  const data = await response.json();
  
  if (data.success && data.session?.url) {
    window.location.href = data.session.url;
  }
}
```

**Callback Handling:**
After OAuth, user is redirected to: `/auth/callback` with tokens in URL hash.

---

## Password Management

### Request Password Reset

**Endpoint:** `POST /api/supabase-auth/password/reset-request`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent. Please check your inbox."
}
```

**Notes:**
- Always returns success (even if email doesn't exist) for security
- Reset link is valid for 1 hour
- User is redirected to `/auth/reset-password` with token

---

### Update Password

**Endpoint:** `POST /api/supabase-auth/password/update`

**Request Body:**
```json
{
  "password": "newSecurePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "message": "Password updated successfully"
}
```

**Notes:**
- Must be called with valid session OR password reset token
- Password must be at least 8 characters
- Invalidates all existing sessions

---

## Email Verification

### Send Verification Email

**Endpoint:** `POST /api/supabase-auth/email/send-verification`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

---

### Verify Email

**Endpoint:** `POST /api/supabase-auth/email/verify`

**Request Body:**
```json
{
  "token": "verification-token-from-email",
  "type": "signup"  // or "email_change"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "email_confirmed_at": "2025-10-26T10:00:00Z"
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token"
  },
  "message": "Email verified successfully"
}
```

---

## Session Management

### Get Current Session

**Endpoint:** `GET /api/supabase-auth/session`

**Success Response (200):**
```json
{
  "success": true,
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token",
    "expires_in": 3600,
    "expires_at": 1730123456,
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    }
  },
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Not authenticated"
}
```

---

### Refresh Session

**Endpoint:** `POST /api/supabase-auth/session/refresh`

**Success Response (200):**
```json
{
  "success": true,
  "session": {
    "access_token": "new-jwt-token",
    "refresh_token": "new-refresh-token",
    "expires_in": 3600
  },
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

**Notes:**
- Call this before access token expires
- Returns new access and refresh tokens
- Old tokens are invalidated

---

### Sign Out

**Endpoint:** `POST /api/supabase-auth/signout`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

**Notes:**
- Invalidates current session
- Clears Express session cookies
- User must sign in again to access protected routes

---

## Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Access denied
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Supabase not configured

### Validation Errors

When validation fails, response includes details:

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "path": ["email"],
      "message": "Invalid email address"
    },
    {
      "path": ["password"],
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

---

## Frontend Integration Examples

### React Hook Example

```typescript
import { useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const signUp = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/supabase-auth/signup/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (data.success) {
        alert('Please check your email to verify your account');
        return true;
      } else {
        alert(data.error);
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/supabase-auth/signin/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (data.success) {
        setUser(data.user);
        return true;
      } else {
        alert(data.error);
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await fetch('/api/supabase-auth/signout', { method: 'POST' });
    setUser(null);
  };

  return { user, loading, signUp, signIn, signOut };
}
```

### Social Login Button

```jsx
function GoogleSignInButton() {
  const handleGoogleSignIn = async () => {
    const res = await fetch('/api/supabase-auth/oauth/google');
    const data = await res.json();
    
    if (data.success && data.session?.url) {
      window.location.href = data.session.url;
    }
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  );
}
```

---

## Testing with cURL

### Sign Up
```bash
curl -X POST http://localhost:3000/api/supabase-auth/signup/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:3000/api/supabase-auth/signin/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Session
```bash
curl http://localhost:3000/api/supabase-auth/session
```

---

## Security Best Practices

1. **HTTPS Only in Production** - Never send auth credentials over HTTP
2. **Store Tokens Securely** - Use httpOnly cookies or secure storage
3. **Validate on Server** - Never trust client-side validation alone
4. **Rate Limiting** - Implement rate limiting for auth endpoints
5. **Monitor Failed Attempts** - Track and alert on suspicious activity
6. **Short Token Expiry** - Use short-lived access tokens (1 hour)
7. **Refresh Tokens** - Implement refresh token rotation
8. **Email Verification** - Require email verification before full access

---

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs/guides/auth
2. Review this API documentation
3. Check server logs for detailed error messages
