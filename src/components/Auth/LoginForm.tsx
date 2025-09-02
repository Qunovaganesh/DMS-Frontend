import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Factory, Lock, User, Eye, EyeOff, Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const LoginForm: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const { login, isLoading } = useAuth();
  const { getThemeColors } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const colors = getThemeColors();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Information Missing',
        text: 'Please enter both User ID and Password',
        confirmButtonColor: colors.primary,
        customClass: {
          popup: 'bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-0',
          title: 'text-gray-900 dark:text-white font-bold',
          htmlContainer: 'text-gray-700 dark:text-gray-300'
        }
      });
      return;
    }

    const success = await login(userId, password);
    
    if (!success) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid credentials. Please check your User ID and Password.',
        confirmButtonColor: colors.primary,
        customClass: {
          popup: 'bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-0',
          title: 'text-gray-900 dark:text-white font-bold',
          htmlContainer: 'text-gray-700 dark:text-gray-300'
        }
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'Login successful. Redirecting to dashboard...',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-0',
          title: 'text-gray-900 dark:text-white font-bold',
          htmlContainer: 'text-gray-700 dark:text-gray-300'
        }
      });
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${colors.light} dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4`}>
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          {/* Language Toggle */}
          <div className="absolute top-4 right-4">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
              >
                <Languages className="w-5 h-5" />
              </motion.button>

              {showLanguageSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-12 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3 z-50 min-w-[140px]"
                >
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setShowLanguageSelector(false);
                      }}
                      className={`flex items-center space-x-3 p-2 rounded-lg transition-all text-left w-full ${
                        language === 'en'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="text-lg">🇺🇸</span>
                      <span className="text-sm font-medium">English</span>
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('hi');
                        setShowLanguageSelector(false);
                      }}
                      className={`flex items-center space-x-3 p-2 rounded-lg transition-all text-left w-full ${
                        language === 'hi'
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="text-lg">🇮🇳</span>
                      <span className="text-sm font-medium">हिंदी</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="inline-flex flex-col items-center justify-center mb-4"
          >
            <img 
              src="/src/assets/bizz+Logo_Final.png" 
              alt="Bizz+" 
              className="h-16 w-auto mb-4"
            />
            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-2xl shadow-lg`}>
              <Factory className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">FMCG Distribution Hub</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('login.subtitle')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{t('login.poweredBy')}</p>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Demo Credentials */}
            <div className={`bg-gradient-to-r ${colors.light} dark:${colors.dark} border border-opacity-20 rounded-lg p-4 mb-6`} style={{ borderColor: colors.primary }}>
              <h3 className="text-sm font-semibold mb-2" style={{ color: colors.primary }}>{t('login.demoCredentials')}</h3>
              <div className="text-xs space-y-1" style={{ color: colors.accent }}>
                <p><strong>{t('login.manufacturer')}:</strong> mfr001 / password123</p>
                <p><strong>{t('login.admin')}:</strong> admin001 / password123</p>
                <p><strong>{t('login.distributor')}:</strong> dist001 / password123</p>
              </div>
            </div>

            {/* User ID Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('login.userId')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all"
                  style={{ focusRingColor: colors.primary }}
                  placeholder={t('login.enterUserId')}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('login.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all"
                  style={{ focusRingColor: colors.primary }}
                  placeholder={t('login.enterPassword')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r ${colors.gradient} text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg`}
              style={{ focusRingColor: colors.primary }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('login.signingIn')}</span>
                </div>
              ) : (
                t('login.signIn')
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('login.copyright')}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginForm;