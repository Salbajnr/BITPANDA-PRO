import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { firebaseAuthService } from './firebase-auth-service';
import { isFirebaseConfigured } from './firebase-config';
import { requireAuth } from './simple-auth';

const router = Router();

// Middleware to check if Firebase is configured
const requireFirebase = (req: Request, res: Response, next: Function) => {
  if (!isFirebaseConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'Firebase authentication is not configured. Please set up Firebase credentials.',
    });
  }
  next();
};

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().optional(),
});

const firebaseTokenSchema = z.object({
  idToken: z.string().min(1, 'Firebase ID token is required'),
});

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  resetToken: z.string().optional(),
});

const linkProviderSchema = z.object({
  provider: z.enum(['google', 'facebook', 'apple']),
  providerId: z.string().min(1, 'Provider ID is required'),
});

/**
 * @route   POST /api/firebase-auth/signup
 * @desc    Sign up with email and password
 * @access  Public
 */
router.post('/signup', requireFirebase, async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, username } = signUpSchema.parse(req.body);

    const result = await firebaseAuthService.signUpWithEmail(
      email,
      password,
      firstName,
      lastName,
      username
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Set session
    req.session.userId = result.user.id;
    (req.session as any).userRole = result.user.role;

    res.status(201).json(result);
  } catch (error: any) {
    console.error('Sign up error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to sign up',
    });
  }
});

/**
 * @route   POST /api/firebase-auth/signin/google
 * @desc    Sign in with Google (Firebase)
 * @access  Public
 */
router.post('/signin/google', requireFirebase, async (req: Request, res: Response) => {
  try {
    const { idToken } = firebaseTokenSchema.parse(req.body);

    const result = await firebaseAuthService.signInWithGoogle(idToken);

    if (!result.success) {
      return res.status(401).json(result);
    }

    // Set session
    req.session.userId = result.user.id;
    (req.session as any).userRole = result.user.role;

    res.json(result);
  } catch (error: any) {
    console.error('Google sign in error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to sign in with Google',
    });
  }
});

/**
 * @route   POST /api/firebase-auth/signin/facebook
 * @desc    Sign in with Facebook (Firebase)
 * @access  Public
 */
router.post('/signin/facebook', requireFirebase, async (req: Request, res: Response) => {
  try {
    const { idToken } = firebaseTokenSchema.parse(req.body);

    const result = await firebaseAuthService.signInWithFacebook(idToken);

    if (!result.success) {
      return res.status(401).json(result);
    }

    // Set session
    req.session.userId = result.user.id;
    (req.session as any).userRole = result.user.role;

    res.json(result);
  } catch (error: any) {
    console.error('Facebook sign in error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to sign in with Facebook',
    });
  }
});

/**
 * @route   POST /api/firebase-auth/signin/apple
 * @desc    Sign in with Apple (Firebase)
 * @access  Public
 */
router.post('/signin/apple', requireFirebase, async (req: Request, res: Response) => {
  try {
    const { idToken } = firebaseTokenSchema.parse(req.body);

    const result = await firebaseAuthService.signInWithApple(idToken);

    if (!result.success) {
      return res.status(401).json(result);
    }

    // Set session
    req.session.userId = result.user.id;
    (req.session as any).userRole = result.user.role;

    res.json(result);
  } catch (error: any) {
    console.error('Apple sign in error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to sign in with Apple',
    });
  }
});

/**
 * @route   POST /api/firebase-auth/email/send-verification
 * @desc    Send email verification
 * @access  Public
 */
router.post('/email/send-verification', requireFirebase, async (req: Request, res: Response) => {
  try {
    const { email } = emailSchema.parse(req.body);

    const result = await firebaseAuthService.sendEmailVerification(email);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    console.error('Send verification error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send verification email',
    });
  }
});

/**
 * @route   POST /api/firebase-auth/email/verify
 * @desc    Verify email
 * @access  Public
 */
router.post('/email/verify', requireFirebase, async (req: Request, res: Response) => {
  try {
    const { email } = emailSchema.parse(req.body);

    const result = await firebaseAuthService.verifyEmail(email);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    console.error('Email verification error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify email',
    });
  }
});

/**
 * @route   POST /api/firebase-auth/password/reset-request
 * @desc    Request password reset
 * @access  Public
 */
router.post('/password/reset-request', requireFirebase, async (req: Request, res: Response) => {
  try {
    const { email } = emailSchema.parse(req.body);

    const result = await firebaseAuthService.sendPasswordResetEmail(email);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    console.error('Password reset request error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send password reset email',
    });
  }
});

/**
 * @route   POST /api/firebase-auth/password/reset
 * @desc    Reset password
 * @access  Public
 */
router.post('/password/reset', requireFirebase, async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = resetPasswordSchema.parse(req.body);

    const result = await firebaseAuthService.resetPassword(email, newPassword);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    console.error('Password reset error:', error);
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
 * @route   POST /api/firebase-auth/link-provider
 * @desc    Link OAuth provider to existing account
 * @access  Private
 */
router.post('/link-provider', requireAuth, requireFirebase, async (req: Request, res: Response) => {
  try {
    const { provider, providerId } = linkProviderSchema.parse(req.body);
    const userId = req.user!.id;

    const result = await firebaseAuthService.linkOAuthProvider(userId, provider, providerId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    console.error('Link provider error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to link provider',
    });
  }
});

/**
 * @route   POST /api/firebase-auth/unlink-provider
 * @desc    Unlink OAuth provider from account
 * @access  Private
 */
router.post('/unlink-provider', requireAuth, requireFirebase, async (req: Request, res: Response) => {
  try {
    const { provider } = z.object({
      provider: z.enum(['google', 'facebook', 'apple']),
    }).parse(req.body);
    const userId = req.user!.id;

    const result = await firebaseAuthService.unlinkOAuthProvider(userId, provider);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    console.error('Unlink provider error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to unlink provider',
    });
  }
});

/**
 * @route   GET /api/firebase-auth/status
 * @desc    Check Firebase configuration status
 * @access  Public
 */
router.get('/status', (req: Request, res: Response) => {
  res.json({
    configured: isFirebaseConfigured(),
    message: isFirebaseConfigured()
      ? 'Firebase authentication is configured and ready'
      : 'Firebase authentication is not configured. Set up Firebase credentials to enable OAuth and email verification.',
  });
});

export default router;
