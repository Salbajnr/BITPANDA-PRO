import { QueryClient } from "@tanstack/react-query";

const defaultQueryFn = async ({ queryKey }: { queryKey: readonly unknown[] }) => {
  const url = queryKey[0];

  // Ensure URL is a string and not an object
  if (!url || typeof url !== 'string') {
    console.error('Invalid URL in query key:', queryKey, 'Type:', typeof url);
    // Don't make request if URL is invalid
    throw new Error('Invalid query key - must be a string URL');
  }

  const response = await fetch(url, {
    credentials: 'include', // Important for session cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Don't redirect automatically, let the component handle it
      throw new Error('Unauthorized');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error.message === 'Unauthorized') return false;
        return failureCount < 3;
      },
    },
  },
});

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Don't redirect automatically for API requests
      throw new Error('Unauthorized');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Export as default for backwards compatibility
export default queryClient;