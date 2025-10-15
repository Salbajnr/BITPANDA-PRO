import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { isUnauthorizedError } from '../lib/authUtils';


export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
  isVerified: boolean;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      try {
        // Use only backend authentication
        const response = await apiRequest("GET", "/api/auth/session");
        return response || null;
      } catch (error: any) {
        if (error.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}