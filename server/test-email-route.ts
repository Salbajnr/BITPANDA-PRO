
import { Router } from 'express';
import { sendOTPEmail } from './email-service';

const router = Router();

// Test email endpoint
router.post('/api/test-email', async (req, res) => {
  try {
    const email = 'Isaiahsalba2020@gmail.com';
    
    console.log(`📧 Testing email integration by sending to: ${email}`);

    // Send a test OTP email
    const emailSent = await sendOTPEmail({
      to: email,
      otp: '123456',
      type: 'registration'
    });

    if (emailSent) {
      console.log('✅ Test email sent successfully!');
      return res.json({ 
        success: true, 
        message: `Test email sent successfully to ${email}! Check your inbox.`,
        emailSent: true
      });
    } else {
      console.log('⚠️ Email sending completed but may have failed');
      return res.json({ 
        success: true, 
        message: 'Email process completed. Check server console for details.',
        emailSent: false
      });
    }
  } catch (error: any) {
    console.error('❌ Test email error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send test email',
      details: error.toString()
    });
  }
});

export default router;
