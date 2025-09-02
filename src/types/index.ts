export interface User {
  id: string;
  userId: string;
  email: string;
  role: 'manufacturer' | 'distributor' | 'admin';
  name: string;
  company?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Manufacturer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  productsCount: number;
  totalOrders: number;
  revenue: number;
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
  lastActivity: string;
}

export interface Distributor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  territory: string;
  manufacturersCount: number;
  totalSales: number;
  commission: number;
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
  lastActivity: string;
}

export interface MailData {
  id: string;
  recipient: string;
  subject: string;
  content: string;
  status: 'sent' | 'pending' | 'failed';
  sentAt: string;
  type: 'promotional' | 'notification' | 'reminder';
}

export interface DashboardStats {
  totalManufacturers: number;
  totalDistributors: number;
  activeMails: number;
  remainingMails: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}