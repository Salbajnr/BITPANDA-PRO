import { useFirebaseAuth } from "./useFirebaseAuth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      try {
        const res = await apiRequest<{ user: User }>("GET", "/api/user/auth/me");
        return res?.user || null;
      } catch (error: any) {
        // Return null for auth errors instead of throwing
        console.log('Auth check error:', error.message);
        return null;
      }
    },
    retry: false, // Don't retry auth checks
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return { 
    user: user ?? null, 
    isLoading, 
    error,
    refetch
  };
}