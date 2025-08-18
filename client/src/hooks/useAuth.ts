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
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          return null;
        }

        if (!response.ok) {
          console.warn(`Auth check failed: ${response.status}`);
          return null;
        }

        return response.json();
      } catch (error) {
        console.error('Auth check error:', error);
        return null;
      }
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchInterval: false, // Disable automatic refetching
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    error,
    refetch,
  };
}