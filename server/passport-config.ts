import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import AppleStrategy from 'passport-apple';
import { storage } from './storage';
import { nanoid } from 'nanoid';

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email provided by Google'));
          }

          // Check if user exists by Google ID
          let user = await storage.getUserByGoogleId(profile.id);

          if (!user) {
            // Check if user exists by email
            user = await storage.getUserByEmail(email);

            if (user) {
              // Link Google account to existing user
              user = await storage.updateUser(user.id, { googleId: profile.id, provider: 'google' });
            } else {
              // Create new user
              const username = email.split('@')[0] + '_' + nanoid(6);
              user = await storage.createUser({
                username,
                email,
                password: null,
                firstName: profile.name?.givenName || '',
                lastName: profile.name?.familyName || '',
                displayName: profile.displayName,
                photoURL: profile.photos?.[0]?.value,
                googleId: profile.id,
                provider: 'google',
                role: 'user',
                isActive: true,
                walletBalance: '0',
              });
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

// Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/api/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'email', 'name'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email provided by Facebook'));
          }

          // Check if user exists by Facebook ID
          let user = await storage.getUserByFacebookId(profile.id);

          if (!user) {
            // Check if user exists by email
            user = await storage.getUserByEmail(email);

            if (user) {
              // Link Facebook account to existing user
              user = await storage.updateUser(user.id, { facebookId: profile.id, provider: 'facebook' });
            } else {
              // Create new user
              const username = email.split('@')[0] + '_' + nanoid(6);
              user = await storage.createUser({
                username,
                email,
                password: null,
                firstName: profile.name?.givenName || '',
                lastName: profile.name?.familyName || '',
                displayName: profile.displayName,
                photoURL: profile.photos?.[0]?.value,
                facebookId: profile.id,
                provider: 'facebook',
                role: 'user',
                isActive: true,
                walletBalance: '0',
              });
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

// Apple OAuth Strategy
if (
  process.env.APPLE_CLIENT_ID &&
  process.env.APPLE_TEAM_ID &&
  process.env.APPLE_KEY_ID &&
  process.env.APPLE_PRIVATE_KEY_PATH
) {
  passport.use(
    new AppleStrategy(
      {
        clientID: process.env.APPLE_CLIENT_ID,
        teamID: process.env.APPLE_TEAM_ID,
        keyID: process.env.APPLE_KEY_ID,
        privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
        callbackURL: process.env.APPLE_CALLBACK_URL || '/api/auth/apple/callback',
        scope: ['name', 'email'],
      },
      async (accessToken, refreshToken, idToken, profile, done) => {
        try {
          const email = profile.email;
          if (!email) {
            return done(new Error('No email provided by Apple'));
          }

          // Check if user exists by Apple ID
          let user = await storage.getUserByAppleId(profile.sub);

          if (!user) {
            // Check if user exists by email
            user = await storage.getUserByEmail(email);

            if (user) {
              // Link Apple account to existing user
              user = await storage.updateUser(user.id, { appleId: profile.sub, provider: 'apple' });
            } else {
              // Create new user
              const username = email.split('@')[0] + '_' + nanoid(6);
              user = await storage.createUser({
                username,
                email,
                password: null,
                firstName: profile.name?.firstName || '',
                lastName: profile.name?.lastName || '',
                displayName: `${profile.name?.firstName || ''} ${profile.name?.lastName || ''}`.trim(),
                photoURL: null,
                appleId: profile.sub,
                provider: 'apple',
                role: 'user',
                isActive: true,
                walletBalance: '0',
              });
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
