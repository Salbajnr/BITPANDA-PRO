import { Router } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { sendEmail } from './email-service';
import { storage } from './storage';
import { db } from './db';
import { otpTokens, passwordResetTokens, users } from '@shared/schema';
import { eq, and, gt } from 'drizzle-orm';

const router = Router();

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

    // Send email
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

      console.log(`OTP generated and stored for ${email} (${type}): ${otp}`);
    } else {
      console.log(`OTP for ${email} (${type}): ${otp} (DB not available)`);
    }

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

      console.log(`New OTP generated and stored for ${email} (${type}): ${otp}`);
    } else {
      console.log(`New OTP for ${email} (${type}): ${otp} (DB not available)`);
    }

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
