
# Email Service Setup Guide

## Overview
This application uses SendGrid for sending transactional emails including:
- OTP verification codes
- Password reset emails
- Transaction notifications (deposits, withdrawals, trades)
- Welcome emails

## Setup Instructions

### 1. Get a Free SendGrid API Key

1. Visit [SendGrid Signup](https://signup.sendgrid.com/)
2. Create a free account (100 emails/day free tier)
3. Verify your email address
4. Go to Settings → API Keys
5. Click "Create API Key"
6. Give it a name (e.g., "BitPanda Pro")
7. Select "Full Access" or "Restricted Access" with Mail Send permissions
8. Copy the API key (you'll only see it once!)

### 2. Configure Replit Secrets

1. In your Replit project, click the **Secrets** tool (🔒) in the sidebar
2. Add a new secret:
   - **Key**: `SENDGRID_API_KEY`
   - **Value**: Paste your SendGrid API key
3. Click "Add Secret"

### 3. Verify Domain (Optional but Recommended)

For production use, verify your sending domain:

1. In SendGrid, go to Settings → Sender Authentication
2. Click "Verify a Single Sender" or "Authenticate Your Domain"
3. Follow the verification steps
4. Update the `from` email in `server/email-service.ts` to match your verified domain

### 4. Test Email Functionality

The application will work in development mode without SendGrid configured (emails are logged to console), but to test real email delivery:

1. Add your SendGrid API key to Secrets
2. Restart the server
3. Try registering a new account
4. Check your email for the OTP verification code

## Email Templates Available

### 1. OTP Verification Email
```typescript
sendOTPEmail({
  to: 'user@example.com',
  otp: '123456',
  type: 'registration' // or 'password_reset' or '2fa'
});
```

### 2. Transaction Notification Email
```typescript
sendTransactionEmail({
  to: 'user@example.com',
  transactionType: 'deposit', // or 'withdrawal' or 'trade'
  amount: '1000.00',
  currency: 'USD',
  status: 'Completed',
  transactionId: 'TXN123456'
});
```

### 3. Welcome Email
```typescript
sendWelcomeEmail({
  to: 'user@example.com',
  username: 'John Doe'
});
```

### 4. Password Reset Success Email
```typescript
sendPasswordResetSuccessEmail('user@example.com');
```

## Features

✅ **Development Mode**: Works without API key (logs to console)
✅ **Production Ready**: Full SendGrid integration
✅ **Beautiful Templates**: Professional HTML email templates
✅ **Error Handling**: Graceful fallbacks if email delivery fails
✅ **Transaction Notifications**: Automatic emails for deposits/withdrawals
✅ **Security Alerts**: OTP codes with expiration warnings

## Troubleshooting

### Emails Not Sending

1. **Check API Key**: Verify it's correctly set in Secrets
2. **Check Console**: Look for SendGrid error messages in server logs
3. **Verify Sender**: Ensure sender email is verified in SendGrid
4. **Check Spam**: Emails might be in spam folder
5. **Rate Limits**: Free tier has 100 emails/day limit

### Common Errors

- `Unauthorized`: API key is invalid or expired
- `Forbidden`: Sender email not verified
- `Rate Limit`: Exceeded daily email quota

## Email Flow Diagram

```
Registration Flow:
User Signs Up → OTP Email Sent → User Verifies → Welcome Email Sent

Password Reset Flow:
User Requests Reset → OTP Email Sent → User Resets Password → Success Email Sent

Transaction Flow:
Admin Approves Deposit → Transaction Email Sent to User
Admin Processes Withdrawal → Transaction Email Sent to User
```

## Best Practices

1. **Verify Domain**: Use a verified domain for better deliverability
2. **Monitor Usage**: Check SendGrid dashboard for delivery stats
3. **Handle Failures**: Application continues even if email fails
4. **Test Thoroughly**: Test with real email addresses before production
5. **Respect Privacy**: Never log sensitive information in email errors

## Cost Information

- **Free Tier**: 100 emails/day (sufficient for testing)
- **Essentials**: $19.95/month for 50,000 emails
- **Pro**: Custom pricing for higher volumes

## Support

- SendGrid Docs: https://docs.sendgrid.com/
- SendGrid Support: https://support.sendgrid.com/
- Application Help: Contact your development team
