
import { Router } from 'express';
import { supabase } from './supabase';

const router = Router();

/**
 * @route   GET /auth/callback
 * @desc    Handle OAuth callback from Supabase
 * @access  Public
 */
router.get('/callback', async (req, res) => {
  try {
    const { code, error: oauthError } = req.query;

    if (oauthError) {
      console.error('OAuth error:', oauthError);
      return res.redirect('/auth?error=oauth_failed');
    }

    if (!code) {
      console.error('No authorization code provided');
      return res.redirect('/auth?error=oauth_failed');
    }

    if (!supabase) {
      console.error('Supabase not configured');
      return res.redirect('/auth?error=oauth_failed');
    }

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code as string);

    if (error) {
      console.error('Error exchanging code for session:', error);
      return res.redirect('/auth?error=oauth_failed');
    }

    if (data.user && data.session) {
      // Store session in Express session
      (req.session as any).userId = data.user.id;
      (req.session as any).userRole = 'user';
      (req.session as any).supabaseAccessToken = data.session.access_token;
      (req.session as any).supabaseRefreshToken = data.session.refresh_token;

      console.log(`✅ OAuth login successful for user: ${data.user.email}`);
      
      // Redirect to dashboard
      return res.redirect('/dashboard');
    }

    res.redirect('/auth?error=oauth_failed');
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    res.redirect('/auth?error=oauth_failed');
  }
});

export default router;
