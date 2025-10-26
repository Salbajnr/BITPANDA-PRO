import { Router } from 'express';
import { z } from 'zod';
import { supabaseAuthService } from './supabase-auth-service';
import { isSupabaseConfigured } from './supabase';

const router = Router();

// Validation schemas
const signUpEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
});

const signUpPhoneSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format (E.164 required)'),
});

const signInEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signInPhoneSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format (E.164 required)'),
  otp: z.string().optional(),
});

const resetPasswordRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const updatePasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  type: z.enum(['signup', 'email_change']).optional(),
});

const verifyOTPSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format (E.164 required)'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

const sendOTPSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format (E.164 required)'),
});

// Middleware to check if Supabase is configured
const requireSupabase = (req: any, res: any, next: any) => {
  if (!isSupabaseConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'Supabase authentication is not configured',
    });
  }
  next();
};

/**
 * @route   POST /api/supabase-auth/signup/email
 * @desc    Sign up with email and password
 * @access  Public
 */
router.post('/signup/email', requireSupabase, async (req, res) => {
  try {
    const validatedData = signUpEmailSchema.parse(req.body);
    const result = await supabaseAuthService.signUpWithEmail(validatedData);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Sign up failed',
    });
  }
});

/**
 * @route   POST /api/supabase-auth/signup/phone
 * @desc    Sign up with phone (sends OTP)
 * @access  Public
 */
router.post('/signup/phone', requireSupabase, async (req, res) => {
  try {
    const { phone } = signUpPhoneSchema.parse(req.body);
    const result = await supabaseAuthService.signUpWithPhone(phone);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Phone signup failed',
    });
  }
});

/**
 * @route   POST /api/supabase-auth/signin/email
 * @desc    Sign in with email and password
 * @access  Public
 */
router.post('/signin/email', requireSupabase, async (req, res) => {
  try {
    const { email, password } = signInEmailSchema.parse(req.body);
    const result = await supabaseAuthService.signInWithEmail(email, password);

    if (!result.success) {
      return res.status(401).json(result);
    }

    // Store session in Express session as well for compatibility
    if (result.user) {
      (req.session as any).userId = result.user.id;
      (req.session as any).userRole = result.user.role || 'user';
    }

    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Sign in failed',
    });
  }
});

/**
 * @route   POST /api/supabase-auth/signin/phone
 * @desc    Sign in with phone (send OTP or verify OTP)
 * @access  Public
 */
router.post('/signin/phone', requireSupabase, async (req, res) => {
  try {
    const { phone, otp } = signInPhoneSchema.parse(req.body);
    const result = await supabaseAuthService.signInWithPhone(phone, otp);

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Store session in Express session if OTP verified
    if (result.user) {
      (req.session as any).userId = result.user.id;
      (req.session as any).userRole = result.user.role || 'user';
    }

    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Phone signin failed',
    });
  }
});

/**
 * @route   GET /api/supabase-auth/oauth/:provider
 * @desc    Initiate OAuth sign in (Google, Facebook, Apple, etc.)
 * @access  Public
 */
router.get('/oauth/:provider', requireSupabase, async (req, res) => {
  try {
    const { provider } = req.params;

    if (!['google', 'facebook', 'apple', 'github', 'twitter'].includes(provider)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid OAuth provider',
      });
    }

    const result = await supabaseAuthService.signInWithOAuth(provider as any);

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Return OAuth URL for client-side redirect
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'OAuth signin failed',
    });
  }
});

/**
 * @route   POST /api/supabase-auth/password/reset-request
 * @desc    Request password reset (sends email)
 * @access  Public
 */
router.post('/password/reset-request', requireSupabase, async (req, res) => {
  try {
    const { email } = resetPasswordRequestSchema.parse(req.body);
    const result = await supabaseAuthService.resetPasswordRequest(email);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Password reset request failed',
    });
  }
});

/**
 * @route   POST /api/supabase-auth/password/update
 * @desc    Update password (for logged-in users or after reset)
 * @access  Public (with valid session/token)
 */
router.post('/password/update', requireSupabase, async (req, res) => {
  try {
    const { password } = updatePasswordSchema.parse(req.body);
    const result = await supabaseAuthService.updatePassword(password);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Password update failed',
    });
  }
});

/**
 * @route   POST /api/supabase-auth/email/send-verification
 * @desc    Send email verification
 * @access  Public
 */
router.post('/email/send-verification', requireSupabase, async (req, res) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const result = await supabaseAuthService.sendVerificationEmail(email);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send verification email',
    });
  }
});

/**
 * @route   POST /api/supabase-auth/email/verify
 * @desc    Verify email with token
 * @access  Public
 */
router.post('/email/verify', requireSupabase, async (req, res) => {
  try {
    const { token, type } = verifyEmailSchema.parse(req.body);
    const result = await supabaseAuthService.verifyEmail(token, type);

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Store session in Express session
    if (result.user) {
      (req.session as any).userId = result.user.id;
      (req.session as any).userRole = result.user.role || 'user';
    }

    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Email verification failed',
    });
  }
});

/**
 * @route   POST /api/supabase-auth/phone/send-otp
 * @desc    Send OTP to phone
 * @access  Public
 */
router.post('/phone/send-otp', requireSupabase, async (req, res) => {
  try {
    const { phone } = sendOTPSchema.parse(req.body);
    const result = await supabaseAuthService.sendPhoneOTP(phone);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send OTP',
    });
  }
});

/**
 * @route   POST /api/supabase-auth/phone/verify-otp
 * @desc    Verify phone OTP
 * @access  Public
 */
router.post('/phone/verify-otp', requireSupabase, async (req, res) => {
  try {
    const { phone, otp } = verifyOTPSchema.parse(req.body);
    const result = await supabaseAuthService.verifyPhoneOTP(phone, otp);

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Store session in Express session
    if (result.user) {
      (req.session as any).userId = result.user.id;
      (req.session as any).userRole = result.user.role || 'user';
    }

    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'OTP verification failed',
    });
  }
});

/**
 * @route   POST /api/supabase-auth/signout
 * @desc    Sign out
 * @access  Public
 */
router.post('/signout', requireSupabase, async (req, res) => {
  try {
    const result = await supabaseAuthService.signOut();

    // Clear Express session as well
    req.session?.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Sign out failed',
    });
  }
});

/**
 * @route   GET /api/supabase-auth/session
 * @desc    Get current session
 * @access  Public
 */
router.get('/session', requireSupabase, async (req, res) => {
  try {
    const result = await supabaseAuthService.getSession();

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get session',
    });
  }
});

/**
 * @route   POST /api/supabase-auth/session/refresh
 * @desc    Refresh session
 * @access  Public
 */
router.post('/session/refresh', requireSupabase, async (req, res) => {
  try {
    const result = await supabaseAuthService.refreshSession();

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to refresh session',
    });
  }
});

export default router;
