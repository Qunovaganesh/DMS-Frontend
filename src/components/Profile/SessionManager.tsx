import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Tablet, MapPin, Clock, Shield, LogOut, AlertTriangle } from 'lucide-react';
import { authApi, SessionInfo } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Swal from 'sweetalert2';

const SessionManager: React.FC = () => {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { logoutAll } = useAuth();
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const sessionsData = await authApi.getActiveSessions();
      setSessions(sessionsData);
      setError('');
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setError('Failed to load active sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string, isCurrent: boolean) => {
    if (isCurrent) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Revoke Current Session',
        text: 'You cannot revoke your current session. Use logout instead.',
        confirmButtonColor: colors.primary,
      });
      return;
    }

    const result = await Swal.fire({
      icon: 'question',
      title: 'Revoke Session?',
      text: 'This will immediately log out this device. This action cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Yes, revoke it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: colors.primary,
    });

    if (result.isConfirmed) {
      try {
        await authApi.revokeSession(sessionId);
        await loadSessions(); // Refresh the list
        
        Swal.fire({
          icon: 'success',
          title: 'Session Revoked',
          text: 'The session has been successfully revoked.',
          confirmButtonColor: colors.primary,
        });
      } catch (err) {
        console.error('Failed to revoke session:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to Revoke Session',
          text: 'There was an error revoking the session. Please try again.',
          confirmButtonColor: colors.primary,
        });
      }
    }
  };

  const handleLogoutAll = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Logout All Devices?',
      text: 'This will log you out from all devices including this one. You will need to login again.',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout everywhere',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: colors.primary,
    });

    if (result.isConfirmed) {
      try {
        await logoutAll();
        
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been logged out from all devices.',
          confirmButtonColor: colors.primary,
        });
      } catch (err) {
        console.error('Failed to logout all:', err);
        Swal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: 'There was an error logging out from all devices.',
          confirmButtonColor: colors.primary,
        });
      }
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const getLocationDisplay = (ipAddress: string) => {
    // In a real app, you might want to resolve IP to location
    // For now, just show the IP or a generic location
    return ipAddress || 'Unknown location';
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-32 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-8 h-8 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 bg-gradient-to-r ${colors.gradient} rounded-lg`}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Sessions
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your active login sessions across devices
            </p>
          </div>
        </div>
        
        {sessions.length > 1 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogoutAll}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout All</span>
          </motion.button>
        )}
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`border rounded-lg p-4 transition-all ${
              session.is_current
                ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  session.is_current
                    ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}>
                  {getDeviceIcon(session.device_info?.device)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {session.device_info?.browser || 'Unknown Browser'} on{' '}
                      {session.device_info?.os || 'Unknown OS'}
                    </h4>
                    {session.is_current && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{getLocationDisplay(session.ip_address)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Last active {formatDate(session.last_used_at)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    Session started: {new Date(session.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              {!session.is_current && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRevokeSession(session.id, session.is_current)}
                  className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Revoke</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No active sessions found</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Security Tips
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Review your active sessions regularly</li>
              <li>• Revoke sessions from devices you no longer use</li>
              <li>• Use "Remember me" only on trusted devices</li>
              <li>• Log out from all devices if your account is compromised</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SessionManager;
