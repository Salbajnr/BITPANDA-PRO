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

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Invalid email format' };
      }

      // Validate password strength
      if (password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters long' };
      }

      console.log(`🔄 Attempting to sign up user: ${email}`);

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName || '',
            last_name: lastName || '',
            username: username || email.split('@')[0],
            full_name: `${firstName || ''} ${lastName || ''}`.trim(),
          },
          emailRedirectTo: `${process.env.REPL_SLUG 
            ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER || 'unknown'}.repl.co`
            : process.env.BASE_URL || 'http://localhost:5000'}/auth/verify-email`,
        },
      });

      if (authError) {
        console.error(`❌ Supabase signup error for ${email}:`, authError);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        console.error(`❌ No user data returned for ${email}`);
        return { success: false, error: 'Failed to create user' };
      }

      console.log(`✅ Supabase user created: ${authData.user.id}`);

      // Sync user to our database
      await this.syncSupabaseUserToDatabase(authData.user, { firstName, lastName, username });

      const message = authData.user.email_confirmed_at 
        ? 'Account created successfully' 
        : 'Please check your email to verify your account';

      return {
        success: true,
        user: authData.user,
        session: authData.session,
        message,
      };
    } catch (error: any) {
      console.error('❌ Sign up error:', error);
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
      // Use BASE_URL from environment (set in Render) or fallback to localhost for development
      const baseUrl = process.env.BASE_URL || process.env.CLIENT_URL || 'http://localhost:5000';
      
      const redirectUrl = `${baseUrl}/auth/callback`;

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
      const baseUrl = process.env.REPL_SLUG 
        ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER || 'unknown'}.repl.co`
        : process.env.BASE_URL || 'http://localhost:5000';

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/auth/reset-password`,
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
      const { id, email, phone, user_metadata, email_confirmed_at, phone_confirmed_at } = supabaseUser;

      if (!id) {
        console.error('Cannot sync user: missing user ID');
        return;
      }

      // Check if user already exists in our database by Supabase ID first
      const users = await storage.getAllUsers();
      let existingUser = users.find(u => u.id === id);
      
      // Fallback to email/phone lookup
      if (!existingUser && email) {
        existingUser = await storage.getUserByEmail(email);
      }
      
      if (!existingUser && phone) {
        existingUser = users.find(u => u.phone === phone);
      }

      const userData = {
        email: email || '',
        phone: phone || '',
        firstName: additionalData?.firstName || user_metadata?.first_name || user_metadata?.firstName || '',
        lastName: additionalData?.lastName || user_metadata?.last_name || user_metadata?.lastName || '',
        username: additionalData?.username || user_metadata?.username || user_metadata?.preferred_username || email?.split('@')[0] || phone?.replace(/\D/g, '') || `user_${id.slice(-8)}`,
        displayName: user_metadata?.full_name || user_metadata?.name || `${user_metadata?.first_name || ''} ${user_metadata?.last_name || ''}`.trim() || '',
        photoURL: user_metadata?.avatar_url || user_metadata?.picture || user_metadata?.photo || '',
        provider: user_metadata?.provider || (phone ? 'phone' : 'email'),
        role: 'user' as const,
        isActive: true,
        walletBalance: '0',
        password: '', // Supabase manages passwords
        emailVerified: !!email_confirmed_at,
        phoneVerified: !!phone_confirmed_at,
      };

      if (existingUser) {
        // Update existing user, preserving existing verification status if already verified
        await storage.updateUser(existingUser.id, {
          ...userData,
          emailVerified: !!email_confirmed_at || existingUser.emailVerified,
          phoneVerified: !!phone_confirmed_at || existingUser.phoneVerified,
          // Preserve existing balance and other user data
          walletBalance: existingUser.walletBalance || '0',
        });
        console.log(`✅ Updated existing user: ${existingUser.id}`);
      } else {
        // Create new user with Supabase UUID
        const newUser = await storage.createUser({
          ...userData,
          id: id, // Use Supabase UUID
        } as any);
        console.log(`✅ Created new user: ${id}`);
      }
    } catch (error: any) {
      console.error('❌ Error syncing Supabase user to database:', {
        userId: supabaseUser.id,
        email: supabaseUser.email,
        error: error.message,
        stack: error.stack
      });
      // Don't throw error - auth should still work even if sync fails
    }
  }
}

// Export singleton instance
export const supabaseAuthService = new SupabaseAuthService();
