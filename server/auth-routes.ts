import { Router } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { z } from 'zod';
import { sendEmail } from './email-service';
import { storage } from './storage';

const router = Router();

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
        subject: 'Password Reset Request',
        html: `
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your BITPANDA PRO account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
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

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email, type } = z.object({
      email: z.string().email(),
      type: z.enum(['registration', 'password_reset', '2fa'])
    }).parse(req.body);

    const otp = generateOTP();
    console.log(`OTP for ${email} (${type}): ${otp}`);

    // Send OTP email (mock implementation)
    try {
      await sendEmail({
        to: email,
        from: 'noreply@bitpanda-pro.com',
        subject: 'Your Verification Code',
        html: `
          <h2>Your Verification Code</h2>
          <p>Your verification code is: <strong style="font-size: 24px; letter-spacing: 2px;">${otp}</strong></p>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
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

    // Send OTP email (mock implementation)
    try {
      await sendEmail({
        to: email,
        from: 'noreply@bitpanda-pro.com',
        subject: 'Your New Verification Code',
        html: `
          <h2>Your New Verification Code</h2>
          <p>Your verification code is: <strong style="font-size: 24px; letter-spacing: 2px;">${otp}</strong></p>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
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