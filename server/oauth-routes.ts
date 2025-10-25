import { Router } from 'express';
import passport from './passport-config';

const router = Router();

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth?error=google_auth_failed' }),
  (req: any, res: any) => {
    // Set session
    req.session.userId = req.user.id;
    req.session.userRole = req.user.role;
    res.redirect('/dashboard');
  }
);

// Facebook OAuth Routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth?error=facebook_auth_failed' }),
  (req: any, res: any) => {
    // Set session
    req.session.userId = req.user.id;
    req.session.userRole = req.user.role;
    res.redirect('/dashboard');
  }
);

// Apple OAuth Routes
router.get('/apple', passport.authenticate('apple'));

router.post(
  '/apple/callback',
  passport.authenticate('apple', { failureRedirect: '/auth?error=apple_auth_failed' }),
  (req: any, res: any) => {
    // Set session
    req.session.userId = req.user.id;
    req.session.userRole = req.user.role;
    res.redirect('/dashboard');
  }
);

export default router;
