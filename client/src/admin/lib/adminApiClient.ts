
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function adminApiRequest(
  method: string,
  endpoint: string,
  data?: any
): Promise<any> {
  const url = `/api/admin${endpoint}`;
  
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 401 || response.status === 403) {
      // Redirect to login on auth failure
      window.location.href = '/admin/login';
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      throw error;
    }
    throw new Error('Network error or server unavailable');
  }
}
