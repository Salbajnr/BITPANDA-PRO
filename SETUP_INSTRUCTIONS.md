
# Authentication System Setup Guide

## Overview
The authentication system is now fully configured with:
- Email/Password registration with OTP verification
- Password reset with email tokens
- Two-factor authentication (2FA)
- Session management with secure cookies

## Required Configuration

### 1. Set Up SendGrid for Email Delivery

**Important:** Without SendGrid, OTPs will only appear in server logs.

1. Create a free SendGrid account at https://sendgrid.com
2. Verify your sender email address
3. Generate an API key at https://app.sendgrid.com/settings/api_keys
4. Add to Replit Secrets:
   ```
   SENDGRID_API_KEY=SG.your-api-key-here
   ```

### 2. Configure Base URL

Add to Replit Secrets:
```
BASE_URL=https://bitpandapro.onrender.com
CLIENT_URL=https://bitpandapro.onrender.com
```

### 3. Database Configuration

Ensure your database is connected:
```
DATABASE_URL=postgresql://your-database-connection-string
```

### 4. Session Security

Generate secure random strings and add to Secrets:
```
COOKIE_SECRET=your-secure-random-string-32-chars-minimum
SESSION_SECRET=your-secure-random-string-32-chars-minimum
```

## How Authentication Works

### Registration Flow
1. User enters email and password on `/auth`
2. System generates 6-digit OTP code
3. OTP sent via email (or logged if SendGrid not configured)
4. User enters OTP on `/verify-otp/registration/:email`
5. Upon verification, account is created and user is logged in

### Password Reset Flow
1. User requests reset on `/forgot-password`
2. System generates secure reset token
3. Reset link sent via email
4. User clicks link to `/reset-password/:token`
5. User enters new password
6. Password updated, user can log in

### Login Flow
1. User enters credentials on `/auth`
2. If 2FA enabled, OTP sent to email
3. User verifies OTP (if required)
4. Session created, user redirected to dashboard

## Development vs Production

### Development (without SendGrid)
- OTP codes logged to console
- Look for messages like:
  ```
  📧 ========== OTP VERIFICATION CODE ==========
  Email: user@example.com
  Type: registration
  Code: 123456
  Expires: 5 minutes
  ============================================
  ```

### Production (with SendGrid)
- OTP codes sent via email
- Professional email templates
- Secure delivery
- Still logged to console for debugging

## Testing the System

### Test Registration
1. Go to `/auth`
2. Click "Sign Up"
3. Enter email and password
4. Check server logs or email for OTP
5. Enter OTP on verification page
6. Should redirect to dashboard

### Test Password Reset
1. Go to `/forgot-password`
2. Enter email address
3. Check server logs or email for reset link
4. Click link or copy token
5. Enter new password
6. Should redirect to login

### Test Login
1. Go to `/auth`
2. Enter credentials
3. If 2FA enabled, check for OTP
4. Should redirect to dashboard

## Troubleshooting

### OTPs not appearing
- Check if SENDGRID_API_KEY is set
- Check server logs for OTP codes
- Verify email address is correct

### Reset links not working
- Check BASE_URL is set correctly
- Verify token hasn't expired (1 hour limit)
- Check database connection

### Session issues
- Verify COOKIE_SECRET is set
- Check browser accepts cookies
- Ensure database session storage works

## Security Notes

- All passwords are bcrypt hashed
- OTPs expire after 5 minutes
- Reset tokens expire after 1 hour
- Sessions are stored in database
- HTTPS required in production
- CORS properly configured
