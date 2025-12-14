# Gmail SMTP Setup for OTP Email Delivery

This guide explains how to configure Gmail SMTP for sending OTP (One-Time Password) emails in the BITPANDA PRO application.

## Prerequisites

1. A Gmail account
2. 2-Factor Authentication enabled on your Google account
3. An App Password generated for this application

## Step-by-Step Setup

### 1. Enable 2-Factor Authentication

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google," click on "2-Step Verification"
4. Follow the prompts to set up 2FA (you'll need your phone number)

### 2. Generate an App Password

1. Stay in the "Security" section of your Google Account
2. Scroll down to "2-Step Verification" and make sure it's ON
3. Scroll down further to "App passwords"
4. If prompted, enter your Google password
5. Under "Select app," choose "Other (Custom name)"
6. Enter "BITPANDA PRO" as the custom name
7. Click "Generate"
8. Copy the 16-character password that appears (this is your App Password)

### 3. Configure Environment Variables

Add the following to your `.env` file in the server directory:

```bash
# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `your-16-character-app-password` with the App Password you generated (without spaces)

### 4. Restart the Application

After updating your environment variables, restart your server for the changes to take effect:

```bash
npm run dev
```

## Testing the Setup

To verify that Gmail SMTP is working correctly:

1. Try registering a new user account
2. Check that you receive an OTP email in your inbox
3. Verify that the email comes from your Gmail address

## Troubleshooting

### Common Issues

1. **Emails not being sent:**
   - Verify that GMAIL_USER and GMAIL_APP_PASSWORD are correctly set in your .env file
   - Make sure there are no extra spaces in the App Password
   - Check that 2FA is enabled on your Google account

2. **Authentication errors:**
   - Ensure you're using an App Password, not your regular Gmail password
   - Confirm that the App Password was generated while 2FA was enabled

3. **Emails going to spam:**
   - Add your Gmail address to contacts in the recipient's email client
   - Check Gmail's spam folder for any delivery issues

### Checking Logs

If emails aren't being sent, check the server logs for error messages:
- Look for "Gmail SMTP failed" messages
- Check for authentication errors
- Verify the Gmail SMTP transporter is being created successfully

## Gmail SMTP Limitations

Be aware of Gmail's sending limits:
- 500 emails per day for free Gmail accounts
- 2,000 emails per day for Google Workspace accounts

For production applications with high email volumes, consider using enterprise email services like SendGrid, Mailgun, or Amazon SES.

## Security Best Practices

1. Never commit your App Password to version control
2. Use environment variables to store sensitive credentials
3. Regularly rotate your App Passwords
4. Monitor your Gmail account for suspicious activity
5. Use a dedicated Gmail account for application emails if possible

## Reverting to Development Mode

If you need to disable Gmail SMTP and return to development mode (where emails are only logged to the console):

1. Comment out or remove the GMAIL_USER and GMAIL_APP_PASSWORD variables from your .env file
2. Restart the server
3. The application will fall back to logging emails to the console