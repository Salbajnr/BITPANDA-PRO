
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create a mock client if no Supabase credentials are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
        signIn: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
      }
    } as any
