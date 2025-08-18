import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    queryFn: () => apiRequest("/api/auth/me"),
    retry: (failureCount, error) => {
      // Don't retry on 401 Unauthorized
      if (error.message === 'Unauthorized') return false;
      return failureCount < 1; // Only retry once
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: false, // Disable automatic refetching
    refetchOnWindowFocus: false, // Disable refetch on window focus
    refetchOnReconnect: false, // Disable refetch on reconnect
  });

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}