import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  login: (userId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data with Indian FMCG context
const mockUsers: User[] = [
  {
    id: '1',
    userId: 'mfr001',
    email: 'rajesh@hindustanindustries.com',
    role: 'manufacturer',
    name: 'Rajesh Kumar',
    company: 'Hindustan FMCG Industries',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    isActive: true,
    createdAt: '2024-01-15',
    lastLogin: '2024-12-20'
  },
  {
    id: '2',
    userId: 'admin001',
    email: 'admin@bizzplus.in',
    role: 'admin',
    name: 'Priya Sharma',
    company: 'Bizz+ Technologies',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    isActive: true,
    createdAt: '2024-01-01',
    lastLogin: '2024-12-20'
  },
  {
    id: '3',
    userId: 'dist001',
    email: 'amit@bharatdistribution.com',
    role: 'distributor',
    name: 'Amit Patel',
    company: 'Bharat Distribution Network',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    isActive: true,
    createdAt: '2024-02-01',
    lastLogin: '2024-12-19'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('bizz_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (userId: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication
    const user = mockUsers.find(u => u.userId === userId);
    
    if (user && password === 'password123') {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      localStorage.setItem('bizz_user', JSON.stringify(updatedUser));
      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false
      });
      return true;
    }
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return false;
  };

  const logout = () => {
    localStorage.removeItem('bizz_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
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