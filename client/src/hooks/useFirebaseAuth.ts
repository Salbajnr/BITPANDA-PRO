
import { useState, useEffect } from 'react';

export function useSupabaseAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // No longer using Supabase authentication
    setLoading(false);
  }, []);

  return { user: null, loading };
}
