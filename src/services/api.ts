// API Configuration and Service Layer
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Debug logging for development
const isDevelopment = import.meta.env.DEV;
const debugLog = (message: string, data?: any) => {
  if (isDevelopment) {
    console.log(`[API] ${message}`, data || '');
  }
};

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
  refresh_required?: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: string;
  refresh_expires_in: string;
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
  session: {
    id: string;
    expires_at: string;
    device_info: any;
    remember_me: boolean;
  };
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: string;
  refresh_expires_in: string;
  session: {
    id: string;
    expires_at: string;
    last_used: string;
  };
}

export interface SessionInfo {
  id: string;
  device_info: any;
  ip_address: string;
  created_at: string;
  last_used_at: string;
  expires_at: string;
  is_current: boolean;
}

// Token Management
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private failedQueue: Array<{ resolve: Function; reject: Function }> = [];

  constructor() {
    this.loadTokens();
  }

  private loadTokens() {
    this.accessToken = sessionStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    sessionStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  }

  async refreshAccessToken(): Promise<string> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    this.isRefreshing = true;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      const data: ApiResponse<RefreshResponse> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Token refresh failed');
      }

      const { access_token, refresh_token } = data.data!;
      this.setTokens(access_token, refresh_token);

      // Process queued requests
      this.failedQueue.forEach(({ resolve }) => resolve(access_token));
      this.failedQueue = [];

      return access_token;
    } catch (error) {
      // Clear tokens and reject queued requests
      this.clearTokens();
      this.failedQueue.forEach(({ reject }) => reject(error));
      this.failedQueue = [];
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }
}

// Create token manager instance
const tokenManager = new TokenManager();

// HTTP Client with automatic token refresh
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const accessToken = tokenManager.getAccessToken();

    debugLog(`Making request to: ${url}`, { method: options.method || 'GET' });

    const config: RequestInit = {
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      debugLog(`Request config:`, config);
      
      let response = await fetch(url, config);
      debugLog(`Response status: ${response.status}`, { 
        ok: response.ok, 
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      let data: ApiResponse<T> = await response.json();

      // Handle token expiration
      if (response.status === 401 && data.code === 'TOKEN_EXPIRED' && data.refresh_required) {
        try {
          const newAccessToken = await tokenManager.refreshAccessToken();
          
          // Retry original request with new token
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };
          
          response = await fetch(url, config);
          data = await response.json();
        } catch (refreshError) {
          // Refresh failed, redirect to login
          tokenManager.clearTokens();
          window.location.href = '/login';
          throw refreshError;
        }
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      debugLog(`Request failed:`, error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Check if the backend is running.');
      }
      
      if (error instanceof Error && error.message.includes('CORS')) {
        throw new Error('CORS error: Backend not configured to accept requests from this origin.');
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

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient();

// Authentication API
export const authApi = {
  async login(email: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
      remember_me: rememberMe,
    });

    if (response.success && response.data) {
      const { access_token, refresh_token } = response.data;
      tokenManager.setTokens(access_token, refresh_token);
      
      // Store user data
      localStorage.setItem('user_data', JSON.stringify(response.data.customer));
      
      return response.data;
    }

    throw new Error(response.message || 'Login failed');
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      tokenManager.clearTokens();
    }
  },

  async logoutAll(): Promise<void> {
    try {
      await apiClient.post('/auth/logout-all');
    } catch (error) {
      console.error('Logout all API error:', error);
    } finally {
      tokenManager.clearTokens();
    }
  },

  async verifyToken(): Promise<any> {
    const response = await apiClient.get('/auth/verify');
    return response.data;
  },

  async getActiveSessions(): Promise<SessionInfo[]> {
    const response = await apiClient.get<{ sessions: SessionInfo[] }>('/auth/sessions');
    return response.data?.sessions || [];
  },

  async revokeSession(sessionId: string): Promise<void> {
    await apiClient.delete(`/auth/sessions/${sessionId}`);
  },
};

// Profile API
export const profileApi = {
  async getProfile(): Promise<any> {
    const response = await apiClient.get('/profile');
    return response.data?.customer;
  },

  async updateProfile(data: any): Promise<any> {
    const response = await apiClient.put('/profile', data);
    return response.data?.customer;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/profile/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },
};

// Export token manager for direct access if needed
export { tokenManager };

export default apiClient;
