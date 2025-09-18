
// API utility functions for making HTTP requests

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status?: number;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const defaultOptions: RequestInit = {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.message || errorMessage;
        } catch {
          errorMessage = errorData || errorMessage;
        }

        return {
          error: errorMessage,
          status: response.status,
        };
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 500,
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }
}

// Export a default instance
export const api = new ApiClient();

// Specific API functions
export const authApi = {
  login: (credentials: { emailOrUsername: string; password: string }) =>
    api.post('/api/user/auth/login', credentials),
  
  adminLogin: (credentials: { emailOrUsername: string; password: string }) =>
    api.post('/api/admin/auth/login', credentials),
  
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => api.post('/api/user/auth/register', userData),
  
  logout: () => api.post('/api/user/auth/logout'),
  adminLogout: () => api.post('/api/admin/auth/logout'),
  
  getCurrentUser: () => api.get('/api/user/auth/user'),
  getCurrentAdmin: () => api.get('/api/admin/auth/user'),
  
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => api.post('/api/auth/change-password', data),
  
  updateProfile: (data: {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  }) => api.patch('/api/auth/profile', data),
};

export const cryptoApi = {
  getTopCryptos: (limit: number = 50) => api.get(`/api/crypto/top/${limit}`),
  getPrice: (symbol: string) => api.get(`/api/crypto/price/${symbol}`),
  getPrices: (symbols: string[]) => api.post('/api/crypto/prices', { symbols }),
  getDetails: (coinId: string) => api.get(`/api/crypto/details/${coinId}`),
  getMarketData: () => api.get('/api/crypto/market-data'),
  search: (query: string) => api.get(`/api/crypto/search?query=${encodeURIComponent(query)}`),
  getHistory: (coinId: string, period: string = '24h') => 
    api.get(`/api/crypto/history/${coinId}?period=${period}`),
  getTrending: () => api.get('/api/crypto/trending'),
};

export const newsApi = {
  getNews: (limit: number = 10, category?: string) => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (category && category !== 'all') {
      params.append('category', category);
    }
    return api.get(`/api/news?${params.toString()}`);
  },
  getNewsById: (id: string) => api.get(`/api/news/${id}`),
  searchNews: (query: string, limit: number = 10) => 
    api.get(`/api/news/search?query=${encodeURIComponent(query)}&limit=${limit}`),
  getCategories: () => api.get('/api/news/categories'),
};

export const portfolioApi = {
  getPortfolio: () => api.get('/api/portfolio'),
  getHoldings: () => api.get('/api/portfolio/holdings'),
  getTransactions: () => api.get('/api/portfolio/transactions'),
  getAnalytics: () => api.get('/api/portfolio/analytics'),
  getPerformance: (period: string = '24h') => 
    api.get(`/api/portfolio/performance?period=${period}`),
};

export const tradingApi = {
  createOrder: (orderData: {
    type: 'buy' | 'sell';
    symbol: string;
    amount: string;
    price: string;
    total: string;
    name?: string;
  }) => api.post('/api/trade', orderData),
  
  getOrders: () => api.get('/api/orders'),
  cancelOrder: (orderId: string) => api.delete(`/api/orders/${orderId}`),
};

export const alertsApi = {
  getAlerts: () => api.get('/api/alerts'),
  createAlert: (alertData: {
    symbol: string;
    type: 'price_above' | 'price_below' | 'percent_change';
    value: number;
    message?: string;
  }) => api.post('/api/alerts', alertData),
  
  updateAlert: (id: string, data: any) => api.patch(`/api/alerts/${id}`, data),
  deleteAlert: (id: string) => api.delete(`/api/alerts/${id}`),
};

export const adminApi = {
  getUsers: () => api.get('/api/admin/users'),
  
  simulateBalance: (data: {
    targetUserId: string;
    adjustmentType: 'add' | 'remove' | 'set';
    amount: string;
    currency: string;
    reason: string;
  }) => api.post('/api/admin/simulate-balance', data),
  
  getAdjustments: (userId?: string) => 
    api.get(`/api/admin/adjustments${userId ? `/${userId}` : ''}`),
  
  createNews: (newsData: {
    title: string;
    description: string;
    url: string;
    imageUrl?: string;
    category: string;
  }) => api.post('/api/admin/news', newsData),
  
  deleteNews: (id: string) => api.delete(`/api/admin/news/${id}`),
  
  getDeposits: () => api.get('/api/admin/deposits'),
  
  approveDeposit: (id: string, data: { amount: string; notes?: string }) =>
    api.post(`/api/admin/deposits/${id}/approve`, data),
  
  rejectDeposit: (id: string, data: { reason: string }) =>
    api.post(`/api/admin/deposits/${id}/reject`, data),
};

export const depositApi = {
  getDeposits: () => api.get('/api/deposits'),
  
  createDeposit: (depositData: {
    amount: string;
    currency: string;
    method: string;
    fromAddress?: string;
    toAddress?: string;
    transactionHash?: string;
    notes?: string;
  }) => api.post('/api/deposits', depositData),
  
  uploadProof: (depositId: string, formData: FormData) => {
    return fetch(`/api/deposits/${depositId}/proof`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
  },
};

export const withdrawalApi = {
  getWithdrawals: () => api.get('/api/withdrawals'),
  
  getLimits: () => api.get('/api/withdrawals/limits'),
  
  calculateFees: (data: { amount: string; method: string }) =>
    api.post('/api/withdrawals/calculate-fees', data),
  
  requestWithdrawal: (withdrawalData: {
    amount: string;
    withdrawalMethod: string;
    destinationAddress: string;
    destinationDetails?: any;
  }) => api.post('/api/withdrawals/request', withdrawalData),
  
  confirmWithdrawal: (token: string) =>
    api.post('/api/withdrawals/confirm', { token }),
  
  cancelWithdrawal: (id: string) =>
    api.delete(`/api/withdrawals/${id}`),
};

export default api;
