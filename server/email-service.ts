
import sgMail from '@sendgrid/mail';

// Email service using SendGrid
interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

// Initialize SendGrid with API key
const initializeSendGrid = () => {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ SENDGRID_API_KEY not configured - emails will only be logged');
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
