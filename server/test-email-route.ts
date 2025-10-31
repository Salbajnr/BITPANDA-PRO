
import { Router } from 'express';
import { sendOTPEmail, sendEmail } from './email-service';
import sgMail from '@sendgrid/mail';

const router = Router();

// Test email endpoint with direct SendGrid implementation
router.post('/api/test-email', async (req, res) => {
  try {
    const email = 'Isaiahsalba2020@gmail.com';
    
    console.log('='.repeat(60));
    console.log(`📧 SENDGRID EMAIL TEST`);
    console.log(`📧 Target: ${email}`);
    console.log('='.repeat(60));

    // Initialize SendGrid with the API key
    const apiKey = process.env.SENDGRID_API_KEY || process.env.SENDGRID_SMTP_KEY;
    if (!apiKey) {
      console.error('❌ No API key found in environment');
      return res.status(500).json({
        success: false,
        error: 'SendGrid API key not configured',
        message: 'Please add SENDGRID_API_KEY to Secrets'
      });
    }

    console.log(`🔑 API Key detected: ${apiKey.substring(0, 15)}...`);
    sgMail.setApiKey(apiKey);

    // Send a simple test email using SendGrid directly
    const msg = {
      to: email,
      from: {
        email: 'bitpandapro@outlook.com',
        name: 'BITPANDA PRO'
      },
      subject: 'Test Email from BITPANDA PRO',
      text: 'This is a test email. If you received this, SendGrid integration is working!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3b82f6;">Test Email from BITPANDA PRO</h2>
          <p>This is a test email sent at ${new Date().toLocaleString()}</p>
          <p><strong>If you received this, the SendGrid integration is working correctly!</strong></p>
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            Check your spam folder if this email didn't arrive in your inbox.
          </p>
        </div>
      `,
    };

    console.log('📤 Sending email via SendGrid...');
    console.log('📧 From:', msg.from.email);
    console.log('📧 To:', msg.to);
    console.log('📧 Subject:', msg.subject);

    const result = await sgMail.send(msg);

    console.log('✅ SendGrid API Response:', result[0].statusCode);
    console.log('✅ Email sent successfully!');
    console.log('='.repeat(60));
    
    return res.json({ 
      success: true, 
      message: `Test email sent to ${email}! Check inbox and spam folder.`,
      emailSent: true,
      statusCode: result[0].statusCode,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('='.repeat(60));
    console.error('❌ SENDGRID ERROR');
    console.error('='.repeat(60));
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    
    if (error.response?.body) {
      console.error('Response Body:', JSON.stringify(error.response.body, null, 2));
      
      // Check for specific errors
      const errors = error.response.body.errors;
      if (errors && errors.length > 0) {
        console.error('Specific Errors:');
        errors.forEach((err: any, i: number) => {
          console.error(`  ${i + 1}. ${err.message} (${err.field || 'general'})`);
        });
      }
    }
    
    console.error('='.repeat(60));
    
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send test email',
      details: error.response?.body || error.toString(),
      troubleshooting: [
        'Check if sender email (bitpandapro@outlook.com) is verified in SendGrid',
        'Verify API key has "Mail Send" permissions',
        'Check SendGrid dashboard for delivery status',
        'Email might be in spam folder'
      ]
    });
  }
});

export default router;
