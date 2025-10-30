import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

// Email service using SendGrid API and SMTP fallback
interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

// Create SMTP transporter for fallback
const createSMTPTransporter = () => {
  try {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_SMTP_KEY || process.env.SENDGRID_API_KEY || ''
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  } catch (error) {
    console.error('Failed to create SMTP transporter:', error);
    return null;
  }
};

const smtpTransporter = createSMTPTransporter();

// Email template types
export interface OTPEmailParams {
  to: string;
  otp: string;
  type: 'registration' | 'password_reset' | '2fa';
}

export interface TransactionEmailParams {
  to: string;
  transactionType: 'deposit' | 'withdrawal' | 'trade';
  amount: string;
  currency: string;
  status: string;
  transactionId: string;
}

export interface WelcomeEmailParams {
  to: string;
  username: string;
}

// Get base URL for email links
const getBaseUrl = () => {
  return process.env.BASE_URL || process.env.CLIENT_URL || 'https://bitpandapro.onrender.com';
};

// Initialize SendGrid with API key
const initializeSendGrid = () => {
  // Force development mode - bypass SendGrid due to credit limits
  console.warn('⚠️ Running in EMAIL DEVELOPMENT MODE - emails will only be logged to console');
  console.warn('💡 This bypasses SendGrid to avoid credit limit issues');
  return false;

  /* Uncomment this when you have SendGrid credits available:
  const apiKey = process.env.SENDGRID_API_KEY || process.env.SENDGRID_SMTP_KEY;

  if (!apiKey) {
    console.warn('⚠️ SENDGRID_API_KEY not configured - emails will only be logged');
    console.warn('⚠️ Set SENDGRID_API_KEY in Secrets to enable email delivery');
    console.warn('⚠️ To get a free SendGrid API key, visit: https://signup.sendgrid.com/');
    return false;
  }

  try {
    sgMail.setApiKey(apiKey);
    console.log('✅ SendGrid initialized successfully');
    console.log('✅ Using API key:', apiKey.substring(0, 10) + '...');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize SendGrid:', error);
    return false;
  }
  */
};

const isSendGridInitialized = initializeSendGrid();

export { getBaseUrl };

// Base email sending function with SMTP fallback
export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    // If SendGrid is not configured, log the email and return success for development
    if (!isSendGridInitialized) {
      console.log('\n📧 ========== EMAIL (Development Mode) ==========');
      console.log('To:', params.to);
      console.log('From:', params.from);
      console.log('Subject:', params.subject);
      console.log('Preview:', params.html?.substring(0, 200) + '...' || params.text?.substring(0, 200) + '...');
      console.log('================================================\n');

      // For development, still return true so auth flow continues
      return true;
    }

    // Try SendGrid API first
    try {
      const msg = {
        to: params.to,
        from: {
          email: params.from,
          name: 'BITPANDA PRO'
        },
        subject: params.subject,
        text: params.text || '',
        html: params.html || params.text || '',
      };

      await sgMail.send(msg);
      console.log('✅ Email sent successfully via SendGrid API to:', params.to);
      return true;
    } catch (apiError: any) {
      console.warn('⚠️ SendGrid API failed, trying SMTP fallback...');
      console.warn('API Error:', apiError?.response?.body?.errors || apiError?.message);

      // Try SMTP fallback
      if (smtpTransporter) {
        try {
          const mailOptions = {
            from: `BITPANDA PRO <${params.from}>`,
            to: params.to,
            subject: params.subject,
            text: params.text || '',
            html: params.html || params.text || ''
          };

          const info = await smtpTransporter.sendMail(mailOptions);
          console.log('✅ Email sent successfully via SMTP to:', params.to);
          console.log('Message ID:', info.messageId);
          return true;
        } catch (smtpError: any) {
          console.error('❌ SMTP fallback also failed:', smtpError.message);
          throw smtpError;
        }
      } else {
        throw apiError;
      }
    }
  } catch (error: any) {
    console.error('❌ All email delivery methods failed:', error?.message || error);

    // Log the email content for debugging
    console.log('\n📧 ========== FAILED EMAIL DETAILS ==========');
    console.log('To:', params.to);
    console.log('Subject:', params.subject);
    console.log('Error:', error?.response?.body?.errors || error?.message);
    console.log('===========================================\n');

    // Return true so auth flow continues even if email fails (development fallback)
    return true;
  }
}

// Enhanced email templates with better styling and functionality
const getEmailTemplate = (content: string, title: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 30px 20px;">
                            <img src="${getBaseUrl()}/assets/logo.jpeg" alt="BITPANDA PRO" style="width: 60px; height: 60px; border-radius: 12px; margin-bottom: 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 1px;">BITPANDA PRO</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 0 30px 40px;">
                            ${content}
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: rgba(0,0,0,0.3); padding: 30px; text-align: center;">
                            <p style="color: #94a3b8; margin: 0 0 15px 0; font-size: 14px;">
                                BITPANDA PRO - Your Trusted Trading Platform
                            </p>
                            <div style="margin: 20px 0;">
                                <a href="${getBaseUrl()}/help-center" style="color: #3b82f6; text-decoration: none; margin: 0 15px; font-size: 14px;">Help Center</a>
                                <a href="${getBaseUrl()}/contact" style="color: #3b82f6; text-decoration: none; margin: 0 15px; font-size: 14px;">Contact Us</a>
                                <a href="${getBaseUrl()}/privacy" style="color: #3b82f6; text-decoration: none; margin: 0 15px; font-size: 14px;">Privacy Policy</a>
                            </div>
                            <p style="color: #64748b; margin: 15px 0 0 0; font-size: 12px;">
                                © ${new Date().getFullYear()} BITPANDA PRO. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

// Send OTP verification email with enhanced template
export async function sendOTPEmail(params: OTPEmailParams): Promise<boolean> {
  const typeText = {
    registration: 'Complete Registration',
    password_reset: 'Password Reset',
    '2fa': 'Two-Factor Authentication'
  };

  const typeDescriptions = {
    registration: 'Welcome! Please verify your email to complete registration.',
    password_reset: 'Use this code to reset your password securely.',
    '2fa': 'Your two-factor authentication code for secure login.'
  };

  const subject = `${typeText[params.type]} - BITPANDA PRO`;

  const content = `
    <div style="text-align: center;">
        <h2 style="color: #3b82f6; margin: 0 0 20px 0; font-size: 24px;">${typeText[params.type]}</h2>
        
        <div style="background-color: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 12px; margin: 20px 0;">
            <p style="color: #e2e8f0; margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">
                ${typeDescriptions[params.type]}
            </p>
            
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 25px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
                <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;">Your verification code:</p>
                <div style="color: #ffffff; font-size: 36px; font-weight: bold; letter-spacing: 6px; font-family: 'Courier New', monospace; margin: 10px 0;">
                    ${params.otp}
                </div>
            </div>
            
            <div style="background-color: rgba(251, 191, 36, 0.2); border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="color: #fbbf24; margin: 0; font-size: 14px; font-weight: 600;">
                    ⏰ This code expires in 5 minutes
                </p>
            </div>
            
            <div style="margin: 30px 0;">
                <a href="${getBaseUrl()}/auth/verify" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Verify Now
                </a>
            </div>
        </div>
        
        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 30px;">
            <p style="color: #94a3b8; margin: 0; font-size: 14px; line-height: 1.5;">
                If you didn't request this code, please ignore this email and consider changing your password.
                <br>
                Need help? Contact our <a href="${getBaseUrl()}/support" style="color: #3b82f6;">support team</a>.
            </p>
        </div>
    </div>
  `;

  const html = getEmailTemplate(content, subject);

  return sendEmail({
    to: params.to,
    from: 'bitpandapro@outlook.com',
    subject,
    html
  });
}

// Send transaction notification email
export async function sendTransactionEmail(params: TransactionEmailParams): Promise<boolean> {
  const typeText = {
    deposit: 'Deposit Confirmation',
    withdrawal: 'Withdrawal Confirmation',
    trade: 'Trade Executed'
  };

  const subject = `${typeText[params.transactionType]} - ${params.amount} ${params.currency}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 30px; border-radius: 12px;">
        <h1 style="color: #ffffff; margin: 0 0 20px 0; font-size: 28px; text-align: center;">BITPANDA PRO</h1>
        <h2 style="color: #10b981; margin: 0 0 30px 0; font-size: 24px; text-align: center;">${typeText[params.transactionType]}</h2>

        <div style="background-color: rgba(255, 255, 255, 0.1); padding: 25px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; color: #e2e8f0; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <strong>Transaction Type:</strong>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right;">
                ${params.transactionType.charAt(0).toUpperCase() + params.transactionType.slice(1)}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <strong>Amount:</strong>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right;">
                ${params.amount} ${params.currency}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <strong>Status:</strong>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right;">
                <span style="color: #10b981; font-weight: bold;">${params.status}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0;">
                <strong>Transaction ID:</strong>
              </td>
              <td style="padding: 10px 0; text-align: right; font-family: monospace; font-size: 12px;">
                ${params.transactionId}
              </td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${getBaseUrl()}/transaction-history" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            View Transaction History
          </a>
        </div>

        <p style="color: #94a3b8; margin: 30px 0 0 0; font-size: 12px; text-align: center;">
          If you didn't initiate this transaction, please contact support immediately.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: params.to,
    from: 'bitpandapro@outlook.com',
    subject,
    html
  });
}

// Send welcome email
export async function sendWelcomeEmail(params: WelcomeEmailParams): Promise<boolean> {
  const subject = 'Welcome to BITPANDA PRO - Get Started';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 30px; border-radius: 12px;">
        <h1 style="color: #ffffff; margin: 0 0 20px 0; font-size: 28px; text-align: center;">Welcome to BITPANDA PRO</h1>

        <div style="background-color: rgba(255, 255, 255, 0.1); padding: 25px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #e2e8f0; margin: 0 0 15px 0; font-size: 16px;">
            Hi ${params.username},
          </p>
          <p style="color: #e2e8f0; margin: 0 0 15px 0; font-size: 16px;">
            Thank you for joining BITPANDA PRO! Your account has been successfully created.
          </p>
          <p style="color: #e2e8f0; margin: 0; font-size: 16px;">
            Start trading cryptocurrencies, precious metals, and more with our advanced platform.
          </p>
        </div>

        <div style="margin: 30px 0;">
          <h3 style="color: #3b82f6; margin: 0 0 15px 0; font-size: 18px;">Quick Start Guide:</h3>
          <ul style="color: #e2e8f0; line-height: 1.8; padding-left: 20px;">
            <li>Complete KYC verification for full access</li>
            <li>Make your first deposit</li>
            <li>Explore our markets and trading tools</li>
            <li>Set up price alerts and notifications</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${getBaseUrl()}/dashboard" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 10px 10px 0;">
            Go to Dashboard
          </a>
          <a href="${getBaseUrl()}/kyc-verification" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 0 10px 0;">
            Complete KYC
          </a>
        </div>

        <p style="color: #94a3b8; margin: 30px 0 0 0; font-size: 12px; text-align: center;">
          Need help? Visit our <a href="${getBaseUrl()}/help-center" style="color: #3b82f6;">Help Center</a> or contact support.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: params.to,
    from: 'bitpandapro@outlook.com',
    subject,
    html
  });
}

// Send password reset success email
export async function sendPasswordResetSuccessEmail(email: string): Promise<boolean> {
  const subject = 'Password Reset Successful - BITPANDA PRO';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 30px; border-radius: 12px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0 0 20px 0; font-size: 28px;">BITPANDA PRO</h1>
        <h2 style="color: #10b981; margin: 0 0 30px 0; font-size: 24px;">Password Reset Successful</h2>

        <div style="background-color: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #e2e8f0; margin: 0 0 20px 0; font-size: 16px;">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <p style="color: #fbbf24; margin: 0; font-size: 14px;">
            If you didn't make this change, please contact support immediately.
          </p>
        </div>

        <div style="margin-top: 30px;">
          <a href="${getBaseUrl()}/auth" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Sign In Now
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    from: 'bitpandapro@outlook.com',
    subject,
    html
  });
}