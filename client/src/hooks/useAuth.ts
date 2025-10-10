import { useFirebaseAuth } from "./useFirebaseAuth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      try {
        const res = await apiRequest<{ user: User }>("GET", "/api/user/auth/me");
        return res.user;
      } catch (error: any) {
        if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
          return null;
        }
        throw error;
      }
    },
    retry: 1,
    retryDelay: 500,
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