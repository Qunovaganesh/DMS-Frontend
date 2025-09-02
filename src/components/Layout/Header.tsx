import React, { useState } from 'react';
import { Bell, Search, Sun, Moon, User, Palette } from 'lucide-react';
import { useTheme, ColorTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const { isDark, toggleTheme, colorTheme, setColorTheme, getThemeColors } = useTheme();
  const { user } = useAuth();
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const colors = getThemeColors();

  const themeOptions: { name: string; value: ColorTheme; color: string }[] = [
    { name: 'Ocean Blue', value: 'blue', color: '#1890ff' },
    { name: 'Forest Green', value: 'green', color: '#52c41a' },
    { name: 'Royal Purple', value: 'purple', color: '#722ed1' },
    { name: 'Sunset Orange', value: 'orange', color: '#fa8c16' },
    { name: 'Cherry Red', value: 'red', color: '#f5222d' },
    { name: 'Teal Mint', value: 'teal', color: '#13c2c2' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Bizz+ Logo */}
        <div className="flex items-center space-x-4">
          <img 
            src="/src/assets/bizz+Logo_Final.png" 
            alt="Bizz+" 
            className="h-8 w-auto hidden sm:block"
          />
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">FMCG Distribution Hub</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Bizz+</p>
          </div>
        </div>

        {/* Search - Hidden on mobile */}
        <div className="flex-1 max-w-md mx-4 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products, distributors..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all text-sm"
              style={{ focusRingColor: colors.primary }}
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Theme Color Selector */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            <AnimatePresence>
              {showThemeSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-12 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50 min-w-[200px]"
                >
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Choose Theme</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setColorTheme(option.value);
                          setShowThemeSelector(false);
                        }}
                        className={`flex items-center space-x-2 p-2 rounded-lg transition-all text-left ${
                          colorTheme === option.value
                            ? 'bg-gray-100 dark:bg-gray-700 ring-2'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        style={{ 
                          ringColor: colorTheme === option.value ? option.color : 'transparent' 
                        }}
                      >
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: option.color }}
                        />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {option.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </motion.button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                alt={user?.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="mt-4 lg:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products, distributors..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all text-sm"
            style={{ focusRingColor: colors.primary }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;