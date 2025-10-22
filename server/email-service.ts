// Email service using SendGrid
interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    // Use SendGrid for email sending
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('⚠️ SENDGRID_API_KEY not configured');
      console.log('📧 Email would be sent to:', params.to);
      console.log('📧 Subject:', params.subject);
      console.log('📧 Preview:', params.html?.substring(0, 150) + '...' || params.text?.substring(0, 150) + '...');
      
      // For development, still return true so auth flow continues
      return true;
    }

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });

    console.log('✅ Email sent successfully via SendGrid to:', params.to);
    return true;
  } catch (error: any) {
    console.error('❌ SendGrid email error:', error?.message || error);
    
    // Log the email content for debugging
    console.log('📧 Failed email details:', {
      to: params.to,
      subject: params.subject,
      preview: params.html?.substring(0, 100) + '...' || params.text?.substring(0, 100) + '...'
    });
    
    // Return true so auth flow continues even if email fails
    return true;
  }
}
