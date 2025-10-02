
import { useQuery } from "@tanstack/react-query";
import { adminApiRequest } from "@/admin/lib/adminApiClient";

export function useAdminAuth() {
  const { data: admin, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-auth"],
    queryFn: async () => {
      try {
        const adminData = await adminApiRequest("GET", "/auth/user");
        if (!adminData || adminData.role !== 'admin') {
          return null;
        }
        return adminData;
      } catch (error) {
        console.error('Admin auth error:', error);
        return null;
      }
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    error,
    refetch,
  };
}
