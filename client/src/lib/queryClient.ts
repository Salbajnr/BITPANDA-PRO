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

export async function apiRequest<T = any>(
  method: string,
  url: string,
  data?: any
): Promise<T> {
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.text();
      let errorMessage;
      try {
        const parsed = JSON.parse(errorData);
        errorMessage = parsed.message || parsed.error || "Request failed";
      } catch {
        errorMessage = errorData || "Request failed";
      }
      throw new Error(errorMessage);
    }

    const responseData = await response.text();
    
    // Handle empty responses
    if (!responseData || responseData.trim() === '') {
      return null as T;
    }
    
    try {
      return JSON.parse(responseData) as T;
    } catch {
      return responseData as T;
    }
  } catch (error) {
    // Handle network errors or other fetch failures
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network connection failed. Please check your internet connection.');
    }
    throw error;
  }
}

// Export as default for backwards compatibility
export default queryClient;