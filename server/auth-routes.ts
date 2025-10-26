import { Router } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { sendEmail, sendOTPEmail, sendTransactionEmail, sendWelcomeEmail, sendPasswordResetSuccessEmail, getBaseUrl } from './email-service';
import { storage } from './storage';
import { db } from './db';
import { otpTokens, passwordResetTokens, users } from '@shared/schema';
import { eq, and, gt } from 'drizzle-orm';

const router = Router();

// Get current session
router.get('/session', async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Return user data without password
    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error('Session fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
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

// Forgot Password - Store reset token in database
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

    // Store reset token in database
    if (db) {
      await db.insert(passwordResetTokens).values({
        userId: user.id,
        token: token,
        expiresAt: expiresAt,
        used: false
      });
    }

    console.log(`Password reset token generated for user ${user.id}`);

    // Send password reset OTP email
    const emailSent = await sendOTPEmail({
      to: email,
      otp: token.substring(0, 6), // Use first 6 chars of token as OTP display
      type: 'password_reset',
    });

    if (emailSent) {
      console.log(`📧 Password reset email sent to ${email}`);
    }

    res.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
});

// Reset Password - Validate token and update password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = z.object({
      token: z.string(),
      password: z.string().min(6)
    }).parse(req.body);

    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    // Find and validate token
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, token),
          eq(passwordResetTokens.used, false),
          gt(passwordResetTokens.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await db
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, resetToken.userId));

    // Mark token as used
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, resetToken.id));

    console.log(`Password reset successful for user ${resetToken.userId}`);

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
});

// Send OTP - Store in database with 5-minute expiration
router.post('/send-otp', async (req, res) => {
  try {
    const { email, type } = z.object({
      email: z.string().email(),
      type: z.enum(['registration', 'password_reset', '2fa'])
    }).parse(req.body);

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 300000); // 5 minutes from now

    // Store OTP in database
    if (db) {
      // Delete any existing unused OTPs for this email and type
      await db
        .delete(otpTokens)
        .where(
          and(
            eq(otpTokens.email, email),
            eq(otpTokens.type, type),
            eq(otpTokens.used, false)
          )
        );

      // Insert new OTP
      await db.insert(otpTokens).values({
        email: email,
        token: otp,
        type: type,
        expiresAt: expiresAt,
        used: false,
        attempts: '0'
      });

      console.log(`✅ OTP generated and stored for ${email} (${type})`);
      console.log(`🔐 OTP CODE: ${otp} - Valid for 5 minutes`);
    } else {
      console.log(`⚠️ OTP for ${email} (${type}): ${otp} (DB not available)`);
    }

    // Use the new sendOTPEmail function
    const subject = type === 'registration' 
      ? 'Welcome to BITPANDA PRO - Verify Your Email'
      : type === 'password_reset'
      ? 'Password Reset Verification - BITPANDA PRO'
      : 'Two-Factor Authentication - BITPANDA PRO';

    const emailSent = await sendOTPEmail({
      to: email,
      otp: otp,
      type: type,
    });

    // In development mode, include OTP in response if email failed
    const isDevelopment = process.env.NODE_ENV === 'development';
    const response: any = { 
      success: true, 
      message: emailSent 
        ? 'OTP sent successfully to your email' 
        : 'OTP generated. Check server console for code.' 
    };

    // Only include OTP in response during development and if email failed
    if (isDevelopment && !emailSent) {
      response.otp = otp;
      response.warning = 'Email delivery failed. OTP shown for development only.';
    }

    res.json(response);
  } catch (error) {
    console.error('❌ Send OTP error:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
});

// Verify OTP - Validate against database
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, token, type } = z.object({
      email: z.string().email(),
      token: z.string().length(6),
      type: z.enum(['registration', 'password_reset', '2fa'])
    }).parse(req.body);

    if (!db) {
      // Fallback to test codes if DB not available
      const validOtps = ['123456', '111111', '000000'];
      if (validOtps.includes(token)) {
        return res.json({ success: true, message: 'OTP verified successfully (demo mode)' });
      }
      return res.status(400).json({ error: 'Invalid OTP code' });
    }

    // Find valid OTP
    const [otpRecord] = await db
      .select()
      .from(otpTokens)
      .where(
        and(
          eq(otpTokens.email, email),
          eq(otpTokens.token, token),
          eq(otpTokens.type, type),
          eq(otpTokens.used, false),
          gt(otpTokens.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!otpRecord) {
      // Increment attempts for failed verification
      await db
        .update(otpTokens)
        .set({ attempts: (parseInt(otpRecord?.attempts?.toString() || '0') + 1).toString() })
        .where(
          and(
            eq(otpTokens.email, email),
            eq(otpTokens.type, type),
            eq(otpTokens.used, false)
          )
        );

      return res.status(400).json({ error: 'Invalid or expired OTP code' });
    }

    // Mark OTP as used
    await db
      .update(otpTokens)
      .set({ used: true })
      .where(eq(otpTokens.id, otpRecord.id));

    console.log(`OTP verified successfully for ${email} (${type})`);

    // If this is registration verification, we could mark user as verified here
    // But the registration flow will handle that separately

    res.json({ success: true, message: 'OTP verified successfully' });
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
    const expiresAt = new Date(Date.now() + 300000); // 5 minutes from now

    // Store new OTP in database
    if (db) {
      // Delete any existing unused OTPs for this email and type
      await db
        .delete(otpTokens)
        .where(
          and(
            eq(otpTokens.email, email),
            eq(otpTokens.type, type),
            eq(otpTokens.used, false)
          )
        );

      // Insert new OTP
      await db.insert(otpTokens).values({
        email: email,
        token: otp,
        type: type,
        expiresAt: expiresAt,
        used: false,
        attempts: '0'
      });

      console.log(`New OTP generated and stored for ${email} (${type})`);
      console.log(`🔐 NEW OTP CODE: ${otp} - Valid for 5 minutes`);
    } else {
      console.log(`New OTP for ${email} (${type}): ${otp} (DB not available)`);
    }

    // Use the new sendOTPEmail function
    const emailSent = await sendOTPEmail({
      to: email,
      otp: otp,
      type: type,
    });

    // In development mode, include OTP in response if email failed
    const isDevelopment = process.env.NODE_ENV === 'development';
    const response: any = { 
      success: true, 
      message: emailSent 
        ? 'New OTP sent successfully to your email' 
        : 'New OTP generated. Check server console for code.' 
    };

    // Only include OTP in response during development and if email failed
    if (isDevelopment && !emailSent) {
      response.otp = otp;
      response.warning = 'Email delivery failed. OTP shown for development only.';
    }

    res.json(response);
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
});

export default router;