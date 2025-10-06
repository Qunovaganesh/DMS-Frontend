// Simplified API service without complex session management
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
  customer: {
    id: number;
    user_id: string;
    email: string;
    role: string;
    name: string;
    company_name?: string;
    avatar_url?: string;
    is_bizz_plus: boolean;
    status: string;
    is_active: boolean;
    last_login?: string;
    created_at: string;
  };
}

// Simple Token Management
class SimpleTokenManager {
  private accessToken: string | null = null;

  constructor() {
    this.loadToken();
  }

  private loadToken() {
    try {
      this.accessToken = localStorage.getItem('access_token');
    } catch (error) {
      console.error('Error loading token from localStorage:', error);
      this.accessToken = null;
    }
  }

  setToken(accessToken: string) {
    this.accessToken = accessToken;
    try {
      localStorage.setItem('access_token', accessToken);
    } catch (error) {
      console.error('Error saving token to localStorage:', error);
    }
  }

  getToken(): string | null {
    return this.accessToken;
  }

  clearToken() {
    this.accessToken = null;
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
    } catch (error) {
      console.error('Error clearing tokens from localStorage:', error);
    }
  }
}

// Create token manager instance
const tokenManager = new SimpleTokenManager();

// Simple HTTP Client
class SimpleApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const accessToken = tokenManager.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Handle different HTTP status codes
        if (response.status === 401) {
          throw new Error('401: Unauthorized - Token expired or invalid');
        } else if (response.status === 403) {
          throw new Error('403: Forbidden - Access denied');
        } else if (response.status >= 500) {
          throw new Error(`Server error: HTTP ${response.status}`);
        }
        
        try {
          const data: ApiResponse<T> = await response.json();
          throw new Error(data.message || `HTTP ${response.status}`);
        } catch {
          throw new Error(`HTTP ${response.status}`);
        }
      }

      const data: ApiResponse<T> = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Make sure the backend is running on port 3000.');
      }
      throw error;
    }
  }

  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Create API client instance
const apiClient = new SimpleApiClient();

// Authentication API
export const authApi = {
  // DUMMY LOGIN - Comment out real API call
  // async login(email: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> {
  //   const response = await apiClient.post<LoginResponse>('/auth/login', {
  //     email,
  //     password,
  //     remember_me: rememberMe,
  //   });

  //   if (response.success && response.data) {
  //     const { access_token } = response.data;
  //     tokenManager.setToken(access_token);
      
  //     // Store user data
  //     localStorage.setItem('user_data', JSON.stringify(response.data.customer));
      
  //     return response.data;
  //   }

  //   throw new Error(response.message || 'Login failed');
  // },

  async logout(): Promise<void> {
    // DUMMY LOGOUT - Comment out real API call
    // tokenManager.clearToken();
    console.log('🔐 Using dummy logout - clearing local data only');
    tokenManager.clearToken();
  },

  // DUMMY PROFILE - Comment out real API call
  // async getProfile(): Promise<any> {
  //   const response = await apiClient.get('/profile');
  //   return response.data?.customer;
  // },
};

// Export token manager for direct access if needed
export { tokenManager };

export default apiClient;
