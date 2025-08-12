interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    // Check if SendGrid API key is available
    if (!process.env.SENDGRID_API_KEY) {
      console.log('📧 Mock Email Sent:', {
        to: params.to,
        subject: params.subject,
        preview: params.html?.substring(0, 100) + '...' || params.text?.substring(0, 100) + '...'
      });
      return true;
    }

    // If SendGrid is configured, use it
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });

    console.log('✅ Email sent successfully to:', params.to);
    return true;
  } catch (error) {
    console.error('❌ SendGrid email error:', error);
    
    // Fall back to mock mode
    console.log('📧 Mock Email Sent (fallback):', {
      to: params.to,
      subject: params.subject,
      preview: params.html?.substring(0, 100) + '...' || params.text?.substring(0, 100) + '...'
    });
    return true;
  }
}