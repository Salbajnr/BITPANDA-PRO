import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getIdToken } from "@/lib/firebase";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
  isVerified: boolean;
  firebaseUid?: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      try {
        // Try to get Firebase ID token
        const idToken = await getIdToken();

        // If we have a Firebase token, sync user first
        if (idToken) {
          try {
            await apiRequest("POST", "/api/auth/firebase-sync", { idToken });
          } catch (syncError) {
            console.error("Firebase sync error:", syncError);
          }
        }

        const data = await apiRequest("GET", "/api/user/auth/me");
        return data.user || null;
      } catch (err: any) {
        if (err.status === 401) {
          return null;
        }
        throw err;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}