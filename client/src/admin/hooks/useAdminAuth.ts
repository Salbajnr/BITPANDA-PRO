
import { useQuery } from "@tanstack/react-query";
import { adminApiRequest } from "@/admin/lib/adminApiClient";

export function useAdminAuth() {
  const { data: admin, isLoading, error } = useQuery({
    queryKey: ["admin-auth"],
    queryFn: async () => {
      try {
        const adminData = await adminApiRequest("GET", "/auth/user");
        return adminData;
      } catch (error) {
        return null;
      }
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    error,
  };
}
