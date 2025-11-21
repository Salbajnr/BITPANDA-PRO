import {
  getFirebaseAuth,
  isFirebaseConfigured,
  verifyFirebaseToken,
  createFirebaseUser,
  updateFirebaseUser,
  getFirebaseUserByEmail,
  generateEmailVerificationLink,
  generatePasswordResetLink,
} from './firebase-config';
import { storage } from './storage';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';

interface FirebaseAuthResult {
  success: boolean;
  user?: any;
  token?: string;
  message?: string;
  error?: string;
}

class FirebaseAuthService {
  /**
   * Sign up with email and password using Firebase
   */
  async signUpWithEmail(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    username?: string
  ): Promise<FirebaseAuthResult> {
    if (!isFirebaseConfigured()) {
      return {
        success: false,
        error: 'Firebase authentication is not configured',
      };
    }

    try {
      // Check if user already exists in our database
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists',
        };
      }

      // Create Firebase user
      const displayName = `${firstName} ${lastName}`.trim();
      const firebaseUser = await createFirebaseUser(email, password, displayName);

      // Generate username if not provided
      const finalUsername = username || email.split('@')[0] + '_' + nanoid(6);

      // Hash password for our database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      const user = await storage.createUser({
        username: finalUsername,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        displayName,
        photoURL: null,
        firebaseUid: firebaseUser.uid,
        provider: 'firebase',
        role: 'user',
        isActive: true,
        emailVerified: false,
        walletBalance: '0',
      });

      // Generate email verification link
      const verificationLink = await generateEmailVerificationLink(email);

      return {
        success: true,
        user,
        message: 'User created successfully. Please verify your email.',
      };
    } catch (error: any) {
      console.error('Firebase sign up error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create user',
      };
    }
  }

  /**
   * Sign in with Firebase ID token
   */
  async signInWithFirebaseToken(idToken: string): Promise<FirebaseAuthResult> {
    if (!isFirebaseConfigured()) {
      return {
        success: false,
        error: 'Firebase authentication is not configured',
      };
    }

    try {
      // Verify Firebase token
      const decodedToken = await verifyFirebaseToken(idToken);

      // Get or create user in our database
      let user = await storage.getUserByEmail(decodedToken.email!);

      if (!user) {
        // Create new user from Firebase data
        const username = decodedToken.email!.split('@')[0] + '_' + nanoid(6);
        user = await storage.createUser({
          username,
          email: decodedToken.email!,
          password: null,
          firstName: decodedToken.name?.split(' ')[0] || '',
          lastName: decodedToken.name?.split(' ').slice(1).join(' ') || '',
          displayName: decodedToken.name || decodedToken.email!,
          photoURL: decodedToken.picture || null,
          firebaseUid: decodedToken.uid,
          provider: 'firebase',
          role: 'user',
          isActive: true,
          emailVerified: decodedToken.email_verified || false,
          walletBalance: '0',
        });
      } else {
        // Update Firebase UID if not set
        if (!user.firebaseUid) {
          user = await storage.updateUser(user.id, {
            firebaseUid: decodedToken.uid,
            emailVerified: decodedToken.email_verified || false,
          });
        }
      }

      return {
        success: true,
        user,
        token: idToken,
      };
    } catch (error: any) {
      console.error('Firebase token sign in error:', error);
      return {
        success: false,
        error: error.message || 'Invalid Firebase token',
      };
    }
  }

  /**
   * Sign in with Google (Firebase)
   */
  async signInWithGoogle(idToken: string): Promise<FirebaseAuthResult> {
    return this.signInWithFirebaseToken(idToken);
  }

  /**
   * Sign in with Facebook (Firebase)
   */
  async signInWithFacebook(idToken: string): Promise<FirebaseAuthResult> {
    return this.signInWithFirebaseToken(idToken);
  }

  /**
   * Sign in with Apple (Firebase)
   */
  async signInWithApple(idToken: string): Promise<FirebaseAuthResult> {
    return this.signInWithFirebaseToken(idToken);
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(email: string): Promise<FirebaseAuthResult> {
    if (!isFirebaseConfigured()) {
      return {
        success: false,
        error: 'Firebase authentication is not configured',
      };
    }

    try {
      const verificationLink = await generateEmailVerificationLink(email);

      // TODO: Send email with verification link using email service
      // For now, return the link
      console.log('Email verification link:', verificationLink);

      return {
        success: true,
        message: 'Verification email sent successfully',
      };
    } catch (error: any) {
      console.error('Send email verification error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send verification email',
      };
    }
  }

  /**
   * Verify email with Firebase
   */
  async verifyEmail(email: string): Promise<FirebaseAuthResult> {
    if (!isFirebaseConfigured()) {
      return {
        success: false,
        error: 'Firebase authentication is not configured',
      };
    }

    try {
      // Get Firebase user
      const firebaseUser = await getFirebaseUserByEmail(email);
      if (!firebaseUser) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      // Update Firebase user
      await updateFirebaseUser(firebaseUser.uid, {
        emailVerified: true,
      });

      // Update our database
      const user = await storage.getUserByEmail(email);
      if (user) {
        await storage.updateUser(user.id, {
          emailVerified: true,
        });
      }

      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error: any) {
      console.error('Email verification error:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify email',
      };
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<FirebaseAuthResult> {
    if (!isFirebaseConfigured()) {
      return {
        success: false,
        error: 'Firebase authentication is not configured',
      };
    }

    try {
      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not
        return {
          success: true,
          message: 'If an account exists with this email, a password reset link has been sent',
        };
      }

      // Generate password reset link
      const resetLink = await generatePasswordResetLink(email);

      // TODO: Send email with reset link using email service
      // For now, log the link
      console.log('Password reset link:', resetLink);

      return {
        success: true,
        message: 'Password reset email sent successfully',
      };
    } catch (error: any) {
      console.error('Send password reset error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send password reset email',
      };
    }
  }

  /**
   * Reset password with new password
   */
  async resetPassword(
    email: string,
    newPassword: string
  ): Promise<FirebaseAuthResult> {
    if (!isFirebaseConfigured()) {
      return {
        success: false,
        error: 'Firebase authentication is not configured',
      };
    }

    try {
      // Get user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      // Update Firebase password
      if (user.firebaseUid) {
        await updateFirebaseUser(user.firebaseUid, {
          password: newPassword,
        });
      }

      // Update our database password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(user.id, {
        password: hashedPassword,
      });

      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.message || 'Failed to reset password',
      };
    }
  }

  /**
   * Link OAuth provider to existing account
   */
  async linkOAuthProvider(
    userId: string,
    provider: 'google' | 'facebook' | 'apple',
    providerId: string
  ): Promise<FirebaseAuthResult> {
    try {
      const updates: any = {};
      
      switch (provider) {
        case 'google':
          updates.googleId = providerId;
          break;
        case 'facebook':
          updates.facebookId = providerId;
          break;
        case 'apple':
          updates.appleId = providerId;
          break;
      }

      const user = await storage.updateUser(userId, updates);

      return {
        success: true,
        user,
        message: `${provider} account linked successfully`,
      };
    } catch (error: any) {
      console.error('Link OAuth provider error:', error);
      return {
        success: false,
        error: error.message || 'Failed to link OAuth provider',
      };
    }
  }

  /**
   * Unlink OAuth provider from account
   */
  async unlinkOAuthProvider(
    userId: string,
    provider: 'google' | 'facebook' | 'apple'
  ): Promise<FirebaseAuthResult> {
    try {
      const updates: any = {};
      
      switch (provider) {
        case 'google':
          updates.googleId = null;
          break;
        case 'facebook':
          updates.facebookId = null;
          break;
        case 'apple':
          updates.appleId = null;
          break;
      }

      const user = await storage.updateUser(userId, updates);

      return {
        success: true,
        user,
        message: `${provider} account unlinked successfully`,
      };
    } catch (error: any) {
      console.error('Unlink OAuth provider error:', error);
      return {
        success: false,
        error: error.message || 'Failed to unlink OAuth provider',
      };
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;
