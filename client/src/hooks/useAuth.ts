import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  // Try to authenticate as admin first, then as user
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      // Try admin authentication first
      try {
        const adminUser = await apiRequest("GET", "/api/admin/auth/user");
        return adminUser;
      } catch (adminError) {
        // If admin auth fails, try user authentication
        try {
          const userData = await apiRequest("GET", "/api/user/auth/user");
          return userData;
        } catch (userError) {
          // Both failed, user is not authenticated
          return null;
        }
      }
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}