// Base URL from environment variables with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bitpanda-pro.onrender.com';

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 10000;

// Helper function to create a timeout promise
const timeout = (ms) => new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Request timeout')), ms)
);

export const api = {
  /**
   * Send a GET request to the API
   * @param {string} endpoint - The API endpoint to call
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} The JSON response
   */
  get: async (endpoint, options = {}) => {
    try {
      const response = await Promise.race([
        fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        }),
        timeout(REQUEST_TIMEOUT)
      ]);
      return await handleResponse(response);
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  /**
   * Send a POST request to the API
   * @param {string} endpoint - The API endpoint to call
   * @param {Object} data - The data to send in the request body
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} The JSON response
   */
  post: async (endpoint, data = {}, options = {}) => {
    try {
      const response = await Promise.race([
        fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          body: JSON.stringify(data),
          ...options,
        }),
        timeout(REQUEST_TIMEOUT)
      ]);
      return await handleResponse(response);
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  /**
   * Send a PUT request to the API
   * @param {string} endpoint - The API endpoint to call
   * @param {Object} data - The data to send in the request body
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} The JSON response
   */
  put: async (endpoint, data = {}, options = {}) => {
    try {
      const response = await Promise.race([
        fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          body: JSON.stringify(data),
          ...options,
        }),
        timeout(REQUEST_TIMEOUT)
      ]);
      return await handleResponse(response);
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  /**
   * Send a DELETE request to the API
   * @param {string} endpoint - The API endpoint to call
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} The JSON response
   */
  delete: async (endpoint, options = {}) => {
    try {
      const response = await Promise.race([
        fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        }),
        timeout(REQUEST_TIMEOUT)
      ]);
      return await handleResponse(response);
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }
};

/**
 * Handle API response
 * @private
 * @param {Response} response - The fetch Response object
 * @returns {Promise<any>} The parsed JSON response
 * @throws {Error} If the response is not ok
 */
async function handleResponse(response) {
  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({
    message: 'Invalid JSON response from server',
  }));

  if (!response.ok) {
    const error = new Error(data.message || 'An error occurred');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
