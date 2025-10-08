import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

async function fetchUser() {
  try {
    const response = await api.get("/user/auth/user");
    return response.data;
  } catch (error) {
    // If user is not authenticated, check for admin
    try {
      const adminResponse = await api.get("/admin/auth/user");
      return adminResponse.data;
    } catch (adminError) {
      // Neither user nor admin is authenticated
      return null;
    }
  }
}

export function useAuth() {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["authenticated-user"],
    queryFn: fetchUser,
    retry: false, // Don't retry on failure, as it means the user is not logged in
  });

  return {
    user,
    isLoading,
    isError,
    isAuthenticated: !!user && !isError,
  };
}
