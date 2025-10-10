import { useFirebaseAuth } from "./useFirebaseAuth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const { user: firebaseUser, loading: firebaseLoading } = useFirebaseAuth();
  
  // Sync Firebase user with backend
  const { data: backendUser, isLoading: backendLoading, error } = useQuery({
    queryKey: ["auth-user", firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser) return null;
      
      // Try to get or create user in backend
      try {
        const userData = await apiRequest("POST", "/api/user/auth/firebase-sync", {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
        return userData;
      } catch (error) {
        console.error("Failed to sync user with backend:", error);
        return null;
      }
    },
    enabled: !!firebaseUser,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const isLoading = firebaseLoading || (!!firebaseUser && backendLoading);

  return {
    user: backendUser || null,
    firebaseUser,
    isLoading,
    isAuthenticated: !!firebaseUser && !!backendUser,
    error: error || null,
  };
}