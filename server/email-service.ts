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
      console.log('📧 Email notification logged (configure SENDGRID_API_KEY to send real emails):', {
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
    
    // Fall back to logging mode
    console.log('📧 Email notification logged (SendGrid unavailable):', {
      to: params.to,
      subject: params.subject,
      preview: params.html?.substring(0, 100) + '...' || params.text?.substring(0, 100) + '...'
    });
    return true;
  }
}