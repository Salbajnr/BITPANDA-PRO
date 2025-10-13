
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
  isVerified: boolean;
  supabaseUid?: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      try {
        // Get Supabase session
        const { data: { session } } = await supabase.auth.getSession();

        // If we have a Supabase session, sync user first
        if (session?.user) {
          try {
            await apiRequest("POST", "/api/auth/supabase-sync", {
              supabaseUid: session.user.id,
              email: session.user.email,
              displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            });
          } catch (syncError) {
            console.error("Supabase sync error:", syncError);
          }
        }

        const data = await apiRequest("GET", "/api/user/auth/me");
        return data.user || null;
      } catch (err: any) {
        if (err.status === 401) {
          return null;
        }
        throw err;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}
