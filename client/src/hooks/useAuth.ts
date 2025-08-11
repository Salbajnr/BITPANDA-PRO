
import { useQuery } from "@tanstack/react-query";

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  portfolio?: {
    id: string;
    totalValue: string;
    availableCash: string;
    userId: string;
  };
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return { user: user || null, isLoading, error };
}
