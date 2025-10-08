import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

async function fetchUser(): Promise<User | null> {
  try {
    const response = await api.get("/user/auth/user");
    return response.data as User;
  } catch (error) {
    try {
      const adminResponse = await api.get("/admin/auth/user");
      return adminResponse.data as User;
    } catch (adminError) {
      return null;
    }
  }
}

export function useAuth() {
  const { data: user, isLoading, isError } = useQuery<User | null>({
    queryKey: ["authenticated-user"],
    queryFn: fetchUser,
    retry: false,
  });

  return {
    user,
    isLoading,
    isError,
    isAuthenticated: !!user && !isError,
  };
}
