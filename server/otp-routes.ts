import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { otpService } from './otp-service';
import { storage } from './storage';
import bcrypt from 'bcrypt';

const router = Router();

// Validation schemas
const sendOTPSchema = z.object({
  email: z.string().email('Invalid email address'),
  type: z.enum(['email_verification', 'password_reset', '2fa']).default('email_verification'),
});

const verifyOTPSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'OTP must be 6 digits'),
  type: z.enum(['email_verification', 'password_reset', '2fa']).default('email_verification'),
});

const resetPasswordWithOTPSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * @route   POST /api/otp/send
 * @desc    Send OTP to email
 * @access  Public
 */
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { email, type } = sendOTPSchema.parse(req.body);

    // Check if user exists (for password reset)
    if (type === 'password_reset') {
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists
        return res.json({
          success: true,
          message: 'If an account exists with this email, an OTP has been sent.',
        });
      }
    }

    // Generate OTP
    const { code, expiresIn } = await otpService.generateOTP(email, type);

    // TODO: Send OTP via email service
    // For now, we'll log it (in production, this should send an email)
    console.log(`📧 OTP for ${email}: ${code}`);

    // In development, return the code (remove in production)
    const response: any = {
      success: true,
      message: 'OTP sent successfully',
      expiresIn,
    };

    if (process.env.NODE_ENV === 'development') {
      response.code = code; // Only in development
      response.devNote = 'OTP code included for development only';
    }

    res.json(response);
  } catch (error: any) {
    console.error('Send OTP error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send OTP',
    });
  }
});

/**
 * @route   POST /api/otp/verify
 * @desc    Verify OTP code
 * @access  Public
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { email, code, type } = verifyOTPSchema.parse(req.body);

    // Verify OTP
    const result = await otpService.verifyOTP(email, code, type);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    // If email verification, update user
    if (type === 'email_verification') {
      const user = await storage.getUserByEmail(email);
      if (user) {
        await storage.updateUser(user.id, {
          isActive: true,
        });
      }
    }

    res.json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify OTP',
    });
  }
});

/**
 * @route   POST /api/otp/resend
 * @desc    Resend OTP
 * @access  Public
 */
router.post('/resend', async (req: Request, res: Response) => {
  try {
    const { email, type } = sendOTPSchema.parse(req.body);

    // Check rate limiting (prevent spam)
    if (otpService.hasValidOTP(email, type)) {
      const remainingTime = otpService.getRemainingTime(email, type);
      if (remainingTime > 540) { // More than 9 minutes remaining (allow resend in last minute)
        return res.status(429).json({
          success: false,
          error: `Please wait ${Math.ceil(remainingTime / 60)} minutes before requesting a new OTP`,
        });
      }
    }

    // Resend OTP
    const { code, expiresIn } = await otpService.resendOTP(email, type);

    // TODO: Send OTP via email service
    console.log(`📧 Resent OTP for ${email}: ${code}`);

    // In development, return the code
    const response: any = {
      success: true,
      message: 'OTP resent successfully',
      expiresIn,
    };

    if (process.env.NODE_ENV === 'development') {
      response.code = code;
      response.devNote = 'OTP code included for development only';
    }

    res.json(response);
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to resend OTP',
    });
  }
});

/**
 * @route   POST /api/otp/reset-password
 * @desc    Reset password with OTP
 * @access  Public
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = resetPasswordWithOTPSchema.parse(req.body);

    // Verify OTP
    const result = await otpService.verifyOTP(email, code, 'password_reset');

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    // Get user
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await storage.updateUser(user.id, {
      password: hashedPassword,
    });

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error: any) {
    console.error('Reset password with OTP error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to reset password',
    });
  }
});

/**
 * @route   GET /api/otp/status/:email
 * @desc    Check OTP status
 * @access  Public
 */
router.get('/status/:email', async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const type = (req.query.type as any) || 'email_verification';

    const hasValidOTP = otpService.hasValidOTP(email, type);
    const remainingTime = otpService.getRemainingTime(email, type);

    res.json({
      hasValidOTP,
      remainingTime,
      canResend: remainingTime < 60, // Can resend in last minute
    });
  } catch (error: any) {
    console.error('OTP status error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get OTP status',
    });
  }
});

/**
 * @route   GET /api/otp/stats
 * @desc    Get OTP statistics (admin only)
 * @access  Private/Admin
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // TODO: Add admin authentication check
    const stats = otpService.getStats();
    res.json(stats);
  } catch (error: any) {
    console.error('OTP stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get OTP stats',
    });
  }
});

export default router;
