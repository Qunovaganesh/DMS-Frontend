import React, { useState } from 'react';
import { Card, Switch, Button, Input, Select, Divider, Row, Col, InputNumber } from 'antd';
import { 
  Settings as SettingsIcon, 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Palette, 
  Globe,
  Save,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

const { TextArea } = Input;
const { Option } = Select;

const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  
  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || '',
      email: user?.email || '',
      company: user?.company || '',
      phone: '+1-555-0123',
      timezone: 'America/New_York'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      securityAlerts: true
    },
    mail: {
      dailyLimit: 4000,
      autoReply: false,
      signature: 'Best regards,\nDMS Pro Team',
      retryFailedMails: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginNotifications: true
    },
    system: {
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      autoBackup: true
    }
  });

  const handleSave = () => {
    Swal.fire({
      icon: 'success',
      title: 'Settings Saved!',
      text: 'Your settings have been updated successfully.',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleReset = () => {
    Swal.fire({
      title: 'Reset Settings?',
      text: 'This will restore all settings to their default values.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, reset!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Reset logic would go here
        Swal.fire({
          icon: 'success',
          title: 'Settings Reset!',
          text: 'All settings have been restored to defaults.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Customize your DMS experience and manage system preferences.</p>
        </div>
        <div className="flex space-x-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={handleReset}
            >
              Reset
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              type="primary"
              icon={<Save className="w-4 h-4" />}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
              onClick={handleSave}
            >
              Save Settings
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <Row gutter={[24, 24]}>
        {/* Profile Settings */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card 
              title={
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-500" />
                  <span>Profile Settings</span>
                </div>
              }
              className="shadow-lg border-0 h-full"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <Input
                    value={settings.profile.name}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, name: e.target.value }
                    }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <Input
                    value={settings.profile.email}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, email: e.target.value }
                    }))}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
                  <Input
                    value={settings.profile.company}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, company: e.target.value }
                    }))}
                    placeholder="Enter your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                  <Input
                    value={settings.profile.phone}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, phone: e.target.value }
                    }))}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                  <Select 
                    value={settings.profile.timezone}
                    onChange={(value) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, timezone: value }
                    }))}
                    className="w-full"
                  >
                    <Option value="America/New_York">Eastern Time (ET)</Option>
                    <Option value="America/Chicago">Central Time (CT)</Option>
                    <Option value="America/Denver">Mountain Time (MT)</Option>
                    <Option value="America/Los_Angeles">Pacific Time (PT)</Option>
                    <Option value="Europe/London">Greenwich Mean Time (GMT)</Option>
                  </Select>
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>

        {/* Appearance & Notifications */}
        <Col xs={24} lg={12}>
          <div className="space-y-6">
            {/* Appearance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card 
                title={
                  <div className="flex items-center space-x-2">
                    <Palette className="w-5 h-5 text-purple-500" />
                    <span>Appearance</span>
                  </div>
                }
                className="shadow-lg border-0"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
                    </div>
                    <Switch checked={isDark} onChange={toggleTheme} />
                  </div>
                  <Divider />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                    <Select 
                      value={settings.system.language}
                      onChange={(value) => setSettings(prev => ({
                        ...prev,
                        system: { ...prev.system, language: value }
                      }))}
                      className="w-full"
                    >
                      <Option value="en">English</Option>
                      <Option value="es">Spanish</Option>
                      <Option value="fr">French</Option>
                      <Option value="de">German</Option>
                    </Select>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Card 
                title={
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-orange-500" />
                    <span>Notifications</span>
                  </div>
                }
                className="shadow-lg border-0"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.emailNotifications}
                      onChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, emailNotifications: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Weekly Reports</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get weekly performance summaries</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.weeklyReports}
                      onChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, weeklyReports: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Security Alerts</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Important security notifications</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.securityAlerts}
                      onChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, securityAlerts: checked }
                      }))}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </Col>
      </Row>

      {/* Mail & Security Settings */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card 
              title={
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-green-500" />
                  <span>Mail Settings</span>
                </div>
              }
              className="shadow-lg border-0 h-full"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Daily Mail Limit</label>
                  <InputNumber
                    value={settings.mail.dailyLimit}
                    onChange={(value) => setSettings(prev => ({
                      ...prev,
                      mail: { ...prev.mail, dailyLimit: value || 4000 }
                    }))}
                    min={100}
                    max={10000}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Auto Reply</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Automatically reply to incoming mails</p>
                  </div>
                  <Switch 
                    checked={settings.mail.autoReply}
                    onChange={(checked) => setSettings(prev => ({
                      ...prev,
                      mail: { ...prev.mail, autoReply: checked }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Signature</label>
                  <TextArea
                    value={settings.mail.signature}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      mail: { ...prev.mail, signature: e.target.value }
                    }))}
                    rows={3}
                    placeholder="Enter your email signature"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card 
              title={
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  <span>Security Settings</span>
                </div>
              }
              className="shadow-lg border-0 h-full"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                  </div>
                  <Switch 
                    checked={settings.security.twoFactorAuth}
                    onChange={(checked) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, twoFactorAuth: checked }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Session Timeout (minutes)</label>
                  <InputNumber
                    value={settings.security.sessionTimeout}
                    onChange={(value) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, sessionTimeout: value || 30 }
                    }))}
                    min={5}
                    max={120}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Login Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified of new logins</p>
                  </div>
                  <Switch 
                    checked={settings.security.loginNotifications}
                    onChange={(checked) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, loginNotifications: checked }
                    }))}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* System Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Card 
          title={
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-indigo-500" />
              <span>System Preferences</span>
            </div>
          }
          className="shadow-lg border-0"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Format</label>
                <Select 
                  value={settings.system.dateFormat}
                  onChange={(value) => setSettings(prev => ({
                    ...prev,
                    system: { ...prev.system, dateFormat: value }
                  }))}
                  className="w-full"
                >
                  <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                  <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                  <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
                <Select 
                  value={settings.system.currency}
                  onChange={(value) => setSettings(prev => ({
                    ...prev,
                    system: { ...prev.system, currency: value }
                  }))}
                  className="w-full"
                >
                  <Option value="USD">USD ($)</Option>
                  <Option value="EUR">EUR (€)</Option>
                  <Option value="GBP">GBP (£)</Option>
                  <Option value="JPY">JPY (¥)</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Auto Backup</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Automatic data backup</p>
                </div>
                <Switch 
                  checked={settings.system.autoBackup}
                  onChange={(checked) => setSettings(prev => ({
                    ...prev,
                    system: { ...prev.system, autoBackup: checked }
                  }))}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Dark Theme</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current theme mode</p>
                </div>
                <Switch checked={isDark} onChange={toggleTheme} />
              </div>
            </Col>
          </Row>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;