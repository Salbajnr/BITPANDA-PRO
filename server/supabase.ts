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

// Log configuration status and test connection
if (isSupabaseConfigured()) {
  console.log('✅ Supabase client initialized');
  console.log('📍 Supabase URL:', supabaseUrl);
  
  // Test connection on startup
  if (supabase) {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('❌ Supabase connection test failed:', error.message);
      } else {
        console.log('🔗 Supabase connection test successful');
      }
    }).catch(err => {
      console.error('❌ Supabase connection test error:', err.message);
    });
  }
} else {
  console.warn('⚠️  Supabase not configured - will use direct PostgreSQL connection');
  console.warn('📋 Missing environment variables:');
  if (!supabaseUrl) console.warn('   - SUPABASE_URL');
  if (!supabaseAnonKey) console.warn('   - SUPABASE_ANON_KEY');
  if (!supabaseServiceRoleKey) console.warn('   - SUPABASE_SERVICE_ROLE_KEY (optional, for admin operations)');
}

// Helper function to check Supabase health
export async function checkSupabaseHealth(): Promise<{ healthy: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { healthy: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      return { healthy: false, error: error.message };
    }
    return { healthy: true };
  } catch (error: any) {
    return { healthy: false, error: error.message };
  }
}
