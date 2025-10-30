
import { Router } from 'express';
import { sendOTPEmail, sendEmail } from './email-service';
import sgMail from '@sendgrid/mail';

const router = Router();

// Test email endpoint with direct SendGrid implementation
router.post('/api/test-email', async (req, res) => {
  try {
    const email = 'Isaiahsalba2020@gmail.com';
    
    console.log(`📧 Testing SendGrid email integration by sending to: ${email}`);
    console.log('📧 Using SendGrid Node.js library');

    // Initialize SendGrid with the API key
    const apiKey = process.env.SENDGRID_API_KEY || process.env.SENDGRID_SMTP_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'SendGrid API key not configured',
        message: 'Please add SENDGRID_API_KEY to your environment variables'
      });
    }

    sgMail.setApiKey(apiKey);

    // Send a simple test email using SendGrid directly
    const msg = {
      to: email,
      from: 'bitpandapro@outlook.com', // Use verified sender
      subject: 'SendGrid Test Email - BITPANDA PRO',
      text: 'This is a test email from BITPANDA PRO using SendGrid Node.js library.',
      html: '<strong>This is a test email from BITPANDA PRO</strong><p>If you received this, the integration is working!</p>',
    };

    await sgMail.send(msg);

    console.log('✅ SendGrid email sent successfully!');
    return res.json({ 
      success: true, 
      message: `Test email sent successfully to ${email} via SendGrid! Check your inbox.`,
      emailSent: true
    });

  } catch (error: any) {
    console.error('❌ SendGrid test email error:', error);
    console.error('Error details:', error.response?.body || error.message);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send test email',
      details: error.response?.body || error.toString()
    });
  }
});

export default router;
