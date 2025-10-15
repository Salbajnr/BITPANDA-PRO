
// Supabase has been removed from this project
// This file is kept for compatibility but exports empty functions
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signIn: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
} as any;

export const onAuthStateChange = (callback: (user: any) => void) => {
  // No-op function since Supabase is removed
  return { data: { subscription: { unsubscribe: () => {} } } };
};
