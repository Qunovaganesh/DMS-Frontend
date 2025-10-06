import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types';
import { authApi, tokenManager } from '../services/api-simple';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Transform backend user data to frontend User type
const transformBackendUser = (backendUser: any): User => {
  return {
    id: backendUser.id?.toString() || '',
    userId: backendUser.user_id || '',
    email: backendUser.email || '',
    role: backendUser.role || 'distributor',
    name: backendUser.name || '',
    company: backendUser.company_name || '',
    avatar: backendUser.avatar_url || '',
    isActive: backendUser.is_active ?? true,
    createdAt: backendUser.created_at || '',
    lastLogin: backendUser.last_login || '',
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Check for existing session on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Add session activity tracking
  useEffect(() => {
    if (authState.isAuthenticated) {
      // Update last activity timestamp
      const updateActivity = () => {
        localStorage.setItem('last_activity', Date.now().toString());
      };

      // Track user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.addEventListener(event, updateActivity, true);
      });

      // Initial activity update
      updateActivity();

      // Cleanup event listeners
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, updateActivity, true);
        });
      };
    }
  }, [authState.isAuthenticated]);

  const checkAuthStatus = async () => {
    console.log('🔍 Checking authentication status...');
    
    try {
      // Check for stored authentication data
      const storedUser = localStorage.getItem('user_data');
      const accessToken = localStorage.getItem('access_token'); // Direct check
      
      console.log('📦 Stored user data exists:', !!storedUser);
      console.log('🔑 Access token exists:', !!accessToken);

      if (storedUser && accessToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const user = transformBackendUser(parsedUser);
          console.log('👤 User data parsed successfully:', user.email);
          
          // Set user as authenticated based on stored data only
          // No API calls that could fail and cause logout
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false
          });
          
          console.log('✅ User authenticated from stored data');
          
        } catch (parseError) {
          console.error('❌ Error parsing stored user data:', parseError);
          // Clear corrupted data and set as not authenticated
          localStorage.removeItem('user_data');
          localStorage.removeItem('access_token');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } else {
        console.log('❌ No stored user data or token found');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const loginResponse = await authApi.login(email, password, rememberMe);
      const user = transformBackendUser(loginResponse.customer);
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = async () => {
    console.log('🚪 Logout initiated');
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Only call logout API if we have a valid token
      const token = tokenManager.getToken();
      if (token) {
        await authApi.logout();
        console.log('✅ Logout API call successful');
      }
    } catch (error) {
      console.error('❌ Logout API error (non-critical):', error);
      // Don't fail logout if API call fails
    } finally {
      // Always clear local state regardless of API call result
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      console.log('✅ Local auth state cleared');
    }
  };

  const logoutAll = async () => {
    // For simple version, same as regular logout
    await logout();
  };

  const refreshUserData = async () => {
    try {
      const customer = await authApi.getProfile();
      if (customer) {
        const user = transformBackendUser(customer);
        localStorage.setItem('user_data', JSON.stringify(customer));
        setAuthState(prev => ({
          ...prev,
          user
        }));
      }
    } catch (error) {
      console.error('Refresh user data error:', error);
    }
  };

  const validateToken = async (): Promise<boolean> => {
    try {
      await authApi.getProfile();
      console.log('✅ Manual token validation successful');
      return true;
    } catch (error: any) {
      console.error('❌ Manual token validation failed:', error);
      
      if (error.message?.includes('401') || 
          error.message?.includes('403') || 
          error.message?.includes('Unauthorized') ||
          error.message?.includes('Forbidden')) {
        console.log('🚪 Token expired, logging out');
        await logout();
        return false;
      }
      
      // Network error, token might still be valid
      return true;
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, logoutAll, refreshUserData, validateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};