import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create clients
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

// Log configuration status
if (isSupabaseConfigured()) {
  console.log('✅ Supabase client initialized');
  console.log('📍 Supabase URL:', supabaseUrl);
} else {
  console.warn('⚠️  Supabase not configured - will use direct PostgreSQL connection');
  console.warn('📋 Missing environment variables:');
  if (!supabaseUrl) console.warn('   - SUPABASE_URL');
  if (!supabaseAnonKey) console.warn('   - SUPABASE_ANON_KEY');
}
