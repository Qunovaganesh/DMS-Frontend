import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Factory, 
  Truck, 
  Mail, 
  Users, 
  Shield,
  Database,
  Activity,
  Map,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { getThemeColors } = useTheme();
  const { t } = useLanguage();
  const colors = getThemeColors();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard'), roles: ['manufacturer', 'distributor', 'admin'] },
    // { path: '/manufacturers', icon: Factory, label: t('nav.manufacturers'), roles: ['admin', 'distributor'] },
    // { path: '/distributors', icon: Truck, label: t('nav.distributors'), roles: ['admin', 'manufacturer'] },
    // { path: '/users', icon: Users, label: t('nav.userManagement'), roles: ['admin'] },
    { path: '/mail', icon: Mail, label: t('nav.mailCenter'), roles: ['admin'] },
    { path: '/admin', icon: Shield, label: t('nav.adminPanel'), roles: ['admin'] },
    { path: '/crm-sync', icon: Database, label: t('nav.crmSync'), roles: ['admin'] },
    { path: '/transaction-sync', icon: Activity, label: t('nav.transactionSync'), roles: ['admin'] },
    { path: '/mapping', icon: Map, label: t('nav.mappingUtility'), roles: ['admin'] },
    { path: '/settings', icon: Settings, label: t('nav.settings'), roles: ['manufacturer', 'distributor', 'admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <motion.div 
      initial={{ x: -250 }}
      animate={{ x: 0, width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col shadow-lg"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3"
              >
                <img 
                  src="/src/assets/bizz+Logo_Final.png" 
                  alt="Bizz+" 
                  className="h-8 w-auto"
                />
                <div>
                  <span className="text-lg font-bold text-gray-800 dark:text-white">FMCG Hub</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Distribution Management</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? `text-white border-r-2`
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isActive ? colors.primary : 'transparent',
                    borderRightColor: isActive ? colors.accent : 'transparent'
                  }}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''} group-hover:scale-110 transition-transform`} />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium text-sm"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!isCollapsed && user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          </motion.div>
        )}
        
        <button
          onClick={logout}
          className={`flex items-center space-x-3 p-3 w-full rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-medium text-sm"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;