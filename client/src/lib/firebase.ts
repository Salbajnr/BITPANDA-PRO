// Firebase authentication setup - using firebase_barebones_javascript integration
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignout,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
  UserCredential
} from "firebase/auth";

// Validate required environment variables
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check for missing variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => `VITE_FIREBASE_${key.toUpperCase()}`);

if (missingVars.length > 0) {
  console.error('Missing Firebase environment variables:', missingVars);
  console.error('Please add these to your Replit Secrets with the VITE_ prefix');
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log('Firebase config loaded:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasProjectId: !!firebaseConfig.projectId,
  hasAppId: !!firebaseConfig.appId,
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Sign in with Google (popup)
export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw new Error(error.message || 'Failed to sign in with Google');
  }
}

// Sign in with Google (redirect - better for mobile)
export async function signInWithGoogleRedirect(): Promise<void> {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error: any) {
    console.error('Google Redirect Sign-In Error:', error);
    throw new Error(error.message || 'Failed to initiate Google sign in');
  }
}

// Handle redirect result
export async function handleRedirectResult(): Promise<UserCredential | null> {
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error: any) {
    console.error('Redirect Result Error:', error);
    throw new Error(error.message || 'Failed to process Google sign in');
  }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string): Promise<UserCredential> {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error('Email Sign-In Error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
}

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string): Promise<UserCredential> {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error('Email Sign-Up Error:', error);
    throw new Error(error.message || 'Failed to create account');
  }
}

// Send password reset email
export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password Reset Error:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }
}

// Update user profile
export async function updateUserProfile(user: User, displayName?: string, photoURL?: string): Promise<void> {
  try {
    await updateProfile(user, { displayName, photoURL });
  } catch (error: any) {
    console.error('Profile Update Error:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
}

// Update user email
export async function updateUserEmail(user: User, newEmail: string): Promise<void> {
  try {
    await updateEmail(user, newEmail);
  } catch (error: any) {
    console.error('Email Update Error:', error);
    throw new Error(error.message || 'Failed to update email');
  }
}

// Update user password
export async function updateUserPassword(user: User, newPassword: string): Promise<void> {
  try {
    await updatePassword(user, newPassword);
  } catch (error: any) {
    console.error('Password Update Error:', error);
    throw new Error(error.message || 'Failed to update password');
  }
}

// Re-authenticate user
export async function reauthenticateUser(user: User, password: string): Promise<UserCredential> {
  try {
    if (!user.email) throw new Error('User email not found');
    const credential = EmailAuthProvider.credential(user.email, password);
    return await reauthenticateWithCredential(user, credential);
  } catch (error: any) {
    console.error('Re-authentication Error:', error);
    throw new Error(error.message || 'Failed to re-authenticate');
  }
}

// Sign out
export async function signOut(): Promise<void> {
  try {
    await firebaseSignout(auth);
  } catch (error: any) {
    console.error('Sign Out Error:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
}

// Listen to auth state changes
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// Get ID token
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken(forceRefresh);
  } catch (error: any) {
    console.error('Get ID Token Error:', error);
    return null;
  }
}
