
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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

// Authentication helper functions
export async function login(emailOrUsername: string, password: string) {
  const response = await apiRequest('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ emailOrUsername, password }),
  });
  return response;
}

export async function adminLogin(emailOrUsername: string, password: string) {
  const response = await apiRequest('/api/auth-admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ emailOrUsername, password }),
  });
  return response;
}

export async function register(userData: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const response = await apiRequest('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response;
}

export async function logout() {
  const response = await apiRequest('/api/auth/logout', {
    method: 'POST',
  });
  return response;
}
