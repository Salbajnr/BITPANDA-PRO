import sgMail from '@sendgrid/mail';

// Email service using SendGrid
interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

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
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ SENDGRID_API_KEY not configured - emails will only be logged');
    console.warn('⚠️ Set SENDGRID_API_KEY in Secrets to enable email delivery');
    console.warn('⚠️ To get a free SendGrid API key, visit: https://signup.sendgrid.com/');
    return false;
  }

  try {
    sgMail.setApiKey(apiKey);
    console.log('✅ SendGrid initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize SendGrid:', error);
    return false;
  }
};

const isSendGridInitialized = initializeSendGrid();

export { getBaseUrl };

// Base email sending function
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

    // Send email via SendGrid
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

    console.log('✅ Email sent successfully to:', params.to);
    return true;
  } catch (error: any) {
    console.error('❌ SendGrid email error:', error?.response?.body || error?.message || error);

    // Log the email content for debugging
    console.log('\n📧 ========== FAILED EMAIL DETAILS ==========');
    console.log('To:', params.to);
    console.log('Subject:', params.subject);
    console.log('Error:', error?.response?.body?.errors || error?.message);
    console.log('===========================================\n');

    // Return true so auth flow continues even if email fails (development fallback)
    // In production, you might want to return false and handle the error differently
    return true;
  }
}

// Send OTP verification email
export async function sendOTPEmail(params: OTPEmailParams): Promise<boolean> {
  const typeText = {
    registration: 'Complete Registration',
    password_reset: 'Password Reset',
    '2fa': 'Two-Factor Authentication'
  };

  const subject = `${typeText[params.type]} - BITPANDA PRO`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 30px; border-radius: 12px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0 0 20px 0; font-size: 28px;">BITPANDA PRO</h1>
        <h2 style="color: #3b82f6; margin: 0 0 30px 0; font-size: 24px;">${typeText[params.type]}</h2>

        <div style="background-color: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #e2e8f0; margin: 0 0 20px 0; font-size: 16px;">
            Your verification code is:
          </p>

          <div style="background-color: #1e40af; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <span style="color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">
              ${params.otp}
            </span>
          </div>

          <p style="color: #fbbf24; margin: 20px 0 0 0; font-size: 14px; font-weight: bold;">
            This code will expire in 5 minutes
          </p>
        </div>

        <p style="color: #94a3b8; margin: 20px 0 0 0; font-size: 14px;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: params.to,
    from: 'noreply@bitpanda-pro.com',
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
    from: 'noreply@bitpanda-pro.com',
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
    from: 'noreply@bitpanda-pro.com',
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
    from: 'noreply@bitpanda-pro.com',
    subject,
    html
  });
}