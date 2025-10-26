import { supabase, supabaseAdmin, isSupabaseConfigured } from './supabase';
import { storage } from './storage';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface AuthResponse {
  success: boolean;
  user?: any;
  session?: any;
  error?: string;
  message?: string;
}

export interface SignUpData {
  email?: string;
  password?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface SignInData {
  email?: string;
  password?: string;
  phone?: string;
  otp?: string;
}

export class SupabaseAuthService {
  /**
   * Sign up with email and password
   */
  async signUpWithEmail(data: SignUpData): Promise<AuthResponse> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { email, password, firstName, lastName, username } = data;

      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            username: username || email.split('@')[0],
          },
          emailRedirectTo: `${process.env.BASE_URL || ''}/auth/verify-email`,
        },
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create user' };
      }

      // Sync user to our database
      await this.syncSupabaseUserToDatabase(authData.user, { firstName, lastName, username });

      return {
        success: true,
        user: authData.user,
        session: authData.session,
        message: 'Please check your email to verify your account',
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message || 'Sign up failed' };
    }
  }

  /**
   * Sign up with phone and OTP
   */
  async signUpWithPhone(phone: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms',
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: 'OTP sent to your phone',
      };
    } catch (error: any) {
      console.error('Phone signup error:', error);
      return { success: false, error: error.message || 'Phone signup failed' };
    }
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Sign in failed' };
      }

      // Sync user to database
      await this.syncSupabaseUserToDatabase(data.user);

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message || 'Sign in failed' };
    }
  }

  /**
   * Sign in with phone and OTP
   */
  async signInWithPhone(phone: string, otp?: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      if (otp) {
        // Verify OTP
        const { data, error } = await supabase.auth.verifyOtp({
          phone,
          token: otp,
          type: 'sms',
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (!data.user) {
          return { success: false, error: 'Verification failed' };
        }

        // Sync user to database
        await this.syncSupabaseUserToDatabase(data.user);

        return {
          success: true,
          user: data.user,
          session: data.session,
        };
      } else {
        // Send OTP
        const { data, error } = await supabase.auth.signInWithOtp({
          phone,
          options: {
            channel: 'sms',
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return {
          success: true,
          message: 'OTP sent to your phone',
        };
      }
    } catch (error: any) {
      console.error('Phone sign in error:', error);
      return { success: false, error: error.message || 'Phone sign in failed' };
    }
  }

  /**
   * Sign in with OAuth provider (Google, Facebook, Apple, etc.)
   */
  async signInWithOAuth(provider: 'google' | 'facebook' | 'apple' | 'github' | 'twitter'): Promise<AuthResponse> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const redirectUrl = `${process.env.BASE_URL || ''}/auth/callback`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          scopes: provider === 'google' ? 'email profile' : undefined,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: 'Redirecting to OAuth provider...',
        session: data,
      };
    } catch (error: any) {
      console.error('OAuth sign in error:', error);
      return { success: false, error: error.message || 'OAuth sign in failed' };
    }
  }

  /**
   * Send password reset email
   */
  async resetPasswordRequest(email: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.BASE_URL || ''}/auth/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: 'Password reset email sent. Please check your inbox.',
      };
    } catch (error: any) {
      console.error('Password reset request error:', error);
      return { success: false, error: error.message || 'Password reset request failed' };
    }
  }

  /**
   * Update password (after reset or for logged-in users)
   */
  async updatePassword(newPassword: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        user: data.user,
        message: 'Password updated successfully',
      };
    } catch (error: any) {
      console.error('Password update error:', error);
      return { success: false, error: error.message || 'Password update failed' };
    }
  }

  /**
   * Send email verification
   */
  async sendVerificationEmail(email: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: 'Verification email sent',
      };
    } catch (error: any) {
      console.error('Send verification error:', error);
      return { success: false, error: error.message || 'Failed to send verification email' };
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string, type: 'signup' | 'email_change' = 'signup'): Promise<AuthResponse> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Verification failed' };
      }

      // Sync user to database
      await this.syncSupabaseUserToDatabase(data.user);

      return {
        success: true,
        user: data.user,
        session: data.session,
        message: 'Email verified successfully',
      };
    } catch (error: any) {
      console.error('Email verification error:', error);
      return { success: false, error: error.message || 'Email verification failed' };
    }
  }

  /**
   * Send OTP to phone
   */
  async sendPhoneOTP(phone: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms',
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: 'OTP sent to your phone',
      };
    } catch (error: any) {
      console.error('Send phone OTP error:', error);
      return { success: false, error: error.message || 'Failed to send OTP' };
    }
  }

  /**
   * Verify phone OTP
   */
  async verifyPhoneOTP(phone: string, otp: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'OTP verification failed' };
      }

      // Sync user to database
      await this.syncSupabaseUserToDatabase(data.user);

      return {
        success: true,
        user: data.user,
        session: data.session,
        message: 'Phone verified successfully',
      };
    } catch (error: any) {
      console.error('Phone OTP verification error:', error);
      return { success: false, error: error.message || 'OTP verification failed' };
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<AuthResponse> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: 'Signed out successfully',
      };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message || 'Sign out failed' };
    }
  }

  /**
   * Get current session
   */
  async getSession(): Promise<AuthResponse> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        session: data.session,
        user: data.session?.user,
      };
    } catch (error: any) {
      console.error('Get session error:', error);
      return { success: false, error: error.message || 'Failed to get session' };
    }
  }

  /**
   * Refresh session
   */
  async refreshSession(): Promise<AuthResponse> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        session: data.session,
        user: data.session?.user,
      };
    } catch (error: any) {
      console.error('Refresh session error:', error);
      return { success: false, error: error.message || 'Failed to refresh session' };
    }
  }

  /**
   * Sync Supabase user to our PostgreSQL database
   */
  private async syncSupabaseUserToDatabase(supabaseUser: SupabaseUser, additionalData?: Partial<SignUpData>): Promise<void> {
    try {
      const { id, email, phone, user_metadata } = supabaseUser;

      // Check if user already exists in our database
      let existingUser = await storage.getUserByEmail(email || '');
      
      if (!existingUser && phone) {
        // Try to find by phone if email not found
        const users = await storage.getAllUsers();
        existingUser = users.find(u => u.phone === phone);
      }

      const userData = {
        email: email || '',
        phone: phone || '',
        firstName: additionalData?.firstName || user_metadata?.first_name || '',
        lastName: additionalData?.lastName || user_metadata?.last_name || '',
        username: additionalData?.username || user_metadata?.username || email?.split('@')[0] || phone || '',
        displayName: user_metadata?.full_name || `${user_metadata?.first_name || ''} ${user_metadata?.last_name || ''}`.trim(),
        photoURL: user_metadata?.avatar_url || user_metadata?.picture || '',
        provider: user_metadata?.provider || 'email',
        role: 'user' as const,
        isActive: true,
        walletBalance: '0',
        password: '', // Supabase manages passwords
        emailVerified: !!supabaseUser.email_confirmed_at,
        phoneVerified: !!supabaseUser.phone_confirmed_at,
      };

      if (existingUser) {
        // Update existing user
        await storage.updateUser(existingUser.id, {
          ...userData,
          emailVerified: !!supabaseUser.email_confirmed_at || existingUser.emailVerified,
          phoneVerified: !!supabaseUser.phone_confirmed_at || existingUser.phoneVerified,
        });
      } else {
        // Create new user
        await storage.createUser({
          ...userData,
          id: id, // Use Supabase user ID
        } as any);
      }
    } catch (error) {
      console.error('Error syncing Supabase user to database:', error);
      // Don't throw error - auth should still work even if sync fails
    }
  }
}

// Export singleton instance
export const supabaseAuthService = new SupabaseAuthService();
