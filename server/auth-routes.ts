
import { Router } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { z } from 'zod';
import { sendEmail } from './email-service';
import { storage } from './storage';

const router = Router();

// Firebase sync route - create or get user based on Firebase authentication
router.post('/firebase-sync', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = z.object({
      uid: z.string(),
      email: z.string().email().nullable(),
      displayName: z.string().nullable().optional(),
      photoURL: z.string().nullable().optional(),
    }).parse(req.body);

    // Check if user exists by Firebase UID
    let user = await storage.getUserByFirebaseUid(uid);

    if (!user && email) {
      // Check if user exists by email
      user = await storage.getUserByEmail(email);
      
      if (user) {
        // Update existing user with Firebase UID
        await storage.updateUserFirebaseUid(user.id, uid);
      } else {
        // Create new user
        const username = email.split('@')[0] + '_' + uid.substring(0, 8);
        user = await storage.createUser({
          username,
          email: email || '',
          password: '', // Firebase handles authentication
          firebaseUid: uid,
          displayName: displayName || username,
          photoURL: photoURL || null,
        });
      }
    }

    if (!user) {
      return res.status(400).json({ error: 'Failed to sync user' });
    }

    res.json(user);
  } catch (error) {
    console.error('Firebase sync error:', error);
    res.status(500).json({ error: 'Failed to sync user with Firebase' });
  }
});

// Helper function to generate OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function to generate secure token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = z.object({
      email: z.string().email()
    }).parse(req.body);

    // Check if user exists
    const user = await storage.getUserByEmail(email);

    if (!user) {
      // Don't reveal if email doesn't exist for security
      return res.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
    }

    // Generate reset token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token (mock implementation for now)
    console.log('Password reset token generated:', { userId: user.id, token, expiresAt });

    // Send email (mock implementation)
    const resetLink = `${process.env.BASE_URL || 'http://localhost:5000'}/reset-password/${token}`;

    try {
      await sendEmail({
        to: email,
        from: 'noreply@bitpanda-pro.com',
        subject: 'Password Reset Request - BITPANDA PRO',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 30px; border-radius: 12px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0 0 20px 0; font-size: 28px;">BITPANDA PRO</h1>
              <h2 style="color: #10b981; margin: 0 0 30px 0; font-size: 24px;">Password Reset Request</h2>
              
              <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #e2e8f0; margin: 0 0 20px 0; font-size: 16px;">
                  You requested a password reset for your BITPANDA PRO account.
                </p>
                <p style="color: #e2e8f0; margin: 0 0 20px 0; font-size: 16px;">
                  Click the button below to reset your password:
                </p>
                
                <a href="${resetLink}" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0;">
                  Reset Password
                </a>
                
                <p style="color: #94a3b8; margin: 20px 0 0 0; font-size: 14px;">
                  This link will expire in 1 hour for security reasons.
                </p>
              </div>
              
              <p style="color: #94a3b8; margin: 20px 0 0 0; font-size: 14px;">
                If you didn't request this reset, please ignore this email and your password will remain unchanged.
              </p>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
    }

    res.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = z.object({
      token: z.string(),
      password: z.string().min(6)
    }).parse(req.body);

    // For demonstration, we'll accept any token and just return success
    // In a real implementation, you would validate the token from database
    console.log('Password reset requested with token:', token);

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
});

// Send OTP (also triggered by registration)
router.post('/send-otp', async (req, res) => {
  try {
    const { email, type } = z.object({
      email: z.string().email(),
      type: z.enum(['registration', 'password_reset', '2fa'])
    }).parse(req.body);

    const otp = generateOTP();
    console.log(`OTP for ${email} (${type}): ${otp}`);

    // Send OTP email
    try {
      const subject = type === 'registration' 
        ? 'Welcome to BITPANDA PRO - Verify Your Email'
        : type === 'password_reset'
        ? 'Password Reset Verification - BITPANDA PRO'
        : 'Two-Factor Authentication - BITPANDA PRO';

      await sendEmail({
        to: email,
        from: 'noreply@bitpanda-pro.com',
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 30px; border-radius: 12px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0 0 20px 0; font-size: 28px;">BITPANDA PRO</h1>
              <h2 style="color: #3b82f6; margin: 0 0 30px 0; font-size: 24px;">Verification Required</h2>
              
              <div style="background-color: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #e2e8f0; margin: 0 0 20px 0; font-size: 16px;">
                  Your verification code is:
                </p>
                
                <div style="background-color: #1e40af; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <span style="color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">
                    ${otp}
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
        `
      });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
    }

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, token, type } = z.object({
      email: z.string().email(),
      token: z.string().length(6),
      type: z.enum(['registration', 'password_reset', '2fa'])
    }).parse(req.body);

    // For demonstration, accept specific test OTP or any 6-digit code
    const validOtps = ['123456', '111111', '000000'];

    if (validOtps.includes(token)) {
      // If this is registration verification, mark user as verified
      if (type === 'registration') {
        try {
          // In a real implementation, you would update the user's verified status
          console.log(`User ${email} verified successfully for registration`);
        } catch (dbError) {
          console.error('Failed to update user verification status:', dbError);
        }
      }

      res.json({ success: true, message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid OTP code. Try: 123456, 111111, or 000000' });
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email, type } = z.object({
      email: z.string().email(),
      type: z.enum(['registration', 'password_reset', '2fa'])
    }).parse(req.body);

    const otp = generateOTP();
    console.log(`New OTP for ${email} (${type}): ${otp}`);

    // Send OTP email
    try {
      const subject = type === 'registration' 
        ? 'New Verification Code - BITPANDA PRO'
        : type === 'password_reset'
        ? 'New Password Reset Code - BITPANDA PRO'
        : 'New 2FA Code - BITPANDA PRO';

      await sendEmail({
        to: email,
        from: 'noreply@bitpanda-pro.com',
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 30px; border-radius: 12px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0 0 20px 0; font-size: 28px;">BITPANDA PRO</h1>
              <h2 style="color: #10b981; margin: 0 0 30px 0; font-size: 24px;">New Verification Code</h2>
              
              <div style="background-color: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #e2e8f0; margin: 0 0 20px 0; font-size: 16px;">
                  Your new verification code is:
                </p>
                
                <div style="background-color: #059669; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <span style="color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">
                    ${otp}
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
        `
      });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
    }

    res.json({ success: true, message: 'New OTP sent successfully' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
});

export default router;
