import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

let firebaseApp: App | null = null;
let firebaseAuth: Auth | null = null;

/**
 * Initialize Firebase Admin SDK
 * Supports both service account JSON and individual credentials
 */
export function initializeFirebase(): { app: App | null; auth: Auth | null } {
  // Check if already initialized
  if (firebaseApp && firebaseAuth) {
    return { app: firebaseApp, auth: firebaseAuth };
  }

  // Check if Firebase is configured
  const hasServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const hasCredentials = 
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY;

  if (!hasServiceAccount && !hasCredentials) {
    console.log('⚠️  Firebase not configured - OAuth and email verification features disabled');
    console.log('   To enable: Set FIREBASE_SERVICE_ACCOUNT_PATH or individual credentials');
    return { app: null, auth: null };
  }

  try {
    // Prevent multiple initializations
    if (getApps().length > 0) {
      firebaseApp = getApps()[0];
      firebaseAuth = getAuth(firebaseApp);
      console.log('✅ Firebase already initialized');
      return { app: firebaseApp, auth: firebaseAuth };
    }

    // Initialize with service account file
    if (hasServiceAccount) {
      firebaseApp = initializeApp({
        credential: cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH!),
      });
      console.log('✅ Firebase initialized with service account file');
    }
    // Initialize with individual credentials
    else if (hasCredentials) {
      // Parse private key (handle escaped newlines)
      const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n');

      firebaseApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: privateKey,
        }),
      });
      console.log('✅ Firebase initialized with environment credentials');
    }

    firebaseAuth = getAuth(firebaseApp!);
    return { app: firebaseApp, auth: firebaseAuth };
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error);
    return { app: null, auth: null };
  }
}

/**
 * Get Firebase Auth instance
 */
export function getFirebaseAuth(): Auth | null {
  if (!firebaseAuth) {
    const { auth } = initializeFirebase();
    return auth;
  }
  return firebaseAuth;
}

/**
 * Check if Firebase is configured
 */
export function isFirebaseConfigured(): boolean {
  return firebaseAuth !== null || (
    !!(process.env.FIREBASE_SERVICE_ACCOUNT_PATH) ||
    !!(process.env.FIREBASE_PROJECT_ID && 
       process.env.FIREBASE_CLIENT_EMAIL && 
       process.env.FIREBASE_PRIVATE_KEY)
  );
}

/**
 * Verify Firebase ID token
 */
export async function verifyFirebaseToken(idToken: string) {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase not configured');
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    throw new Error('Invalid Firebase token');
  }
}

/**
 * Create custom Firebase token
 */
export async function createCustomToken(uid: string, claims?: object) {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase not configured');
  }

  try {
    const customToken = await auth.createCustomToken(uid, claims);
    return customToken;
  } catch (error) {
    console.error('Failed to create custom token:', error);
    throw new Error('Failed to create custom token');
  }
}

/**
 * Get Firebase user by email
 */
export async function getFirebaseUserByEmail(email: string) {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase not configured');
  }

  try {
    const user = await auth.getUserByEmail(email);
    return user;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return null;
    }
    throw error;
  }
}

/**
 * Create Firebase user
 */
export async function createFirebaseUser(email: string, password?: string, displayName?: string) {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase not configured');
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
      emailVerified: false,
    });
    return userRecord;
  } catch (error) {
    console.error('Failed to create Firebase user:', error);
    throw error;
  }
}

/**
 * Update Firebase user
 */
export async function updateFirebaseUser(uid: string, updates: {
  email?: string;
  emailVerified?: boolean;
  displayName?: string;
  photoURL?: string;
  password?: string;
}) {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase not configured');
  }

  try {
    const userRecord = await auth.updateUser(uid, updates);
    return userRecord;
  } catch (error) {
    console.error('Failed to update Firebase user:', error);
    throw error;
  }
}

/**
 * Delete Firebase user
 */
export async function deleteFirebaseUser(uid: string) {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase not configured');
  }

  try {
    await auth.deleteUser(uid);
  } catch (error) {
    console.error('Failed to delete Firebase user:', error);
    throw error;
  }
}

/**
 * Generate email verification link
 */
export async function generateEmailVerificationLink(email: string) {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase not configured');
  }

  try {
    const actionCodeSettings = {
      url: process.env.CLIENT_URL || 'http://localhost:5173',
      handleCodeInApp: true,
    };

    const link = await auth.generateEmailVerificationLink(email, actionCodeSettings);
    return link;
  } catch (error) {
    console.error('Failed to generate email verification link:', error);
    throw error;
  }
}

/**
 * Generate password reset link
 */
export async function generatePasswordResetLink(email: string) {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase not configured');
  }

  try {
    const actionCodeSettings = {
      url: process.env.CLIENT_URL || 'http://localhost:5173',
      handleCodeInApp: false,
    };

    const link = await auth.generatePasswordResetLink(email, actionCodeSettings);
    return link;
  } catch (error) {
    console.error('Failed to generate password reset link:', error);
    throw error;
  }
}

// Initialize Firebase on module load
initializeFirebase();

export default {
  initializeFirebase,
  getFirebaseAuth,
  isFirebaseConfigured,
  verifyFirebaseToken,
  createCustomToken,
  getFirebaseUserByEmail,
  createFirebaseUser,
  updateFirebaseUser,
  deleteFirebaseUser,
  generateEmailVerificationLink,
  generatePasswordResetLink,
};
