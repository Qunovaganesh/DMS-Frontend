import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.manufacturers': 'Manufacturers',
    'nav.distributors': 'Distributors',
    'nav.mailCenter': 'Mail Center',
    'nav.userManagement': 'User Management',
    'nav.adminPanel': 'Admin Panel',
    'nav.crmSync': 'CRM Sync',
    'nav.transactionSync': 'Transaction Sync',
    'nav.mappingUtility': 'Mapping Utility',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',

    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.manufacturerTitle': 'Your Manufacturing Empire is Thriving. Here\'s Your Command Center.',
    'dashboard.distributorTitle': 'Your Network is Growing. Monitor Your Territory Performance.',
    'dashboard.adminTitle': 'Complete Control Over Your Distribution Ecosystem. Monitor Everything.',
    'dashboard.totalRevenue': 'Total Revenue',
    'dashboard.growthRate': 'Growth Rate',
    'dashboard.totalUsers': 'Total Users',
    'dashboard.systemHealth': 'System Health',
    'dashboard.totalSales': 'Total Sales',

    // Admin Dashboard
    'admin.systemCommand': 'System Command Center',
    'admin.subtitle': 'Complete Control Over Your Distribution Ecosystem. Monitor Everything.',
    'admin.networkOverview': 'Network Overview',
    'admin.businessMetrics': 'Business Metrics',
    'admin.operationalHealth': 'Operational Health',
    'admin.revenueAnalytics': 'Revenue Analytics',
    'admin.userActivity': 'User Activity',
    'admin.systemAlerts': 'System Alerts',
    'admin.dataInsights': 'Data Insights',
    'admin.performanceKpis': 'Performance KPIs',
    'admin.networkGrowth': 'Network Growth',
    'admin.revenueGrowth': 'Revenue Growth',
    'admin.userEngagement': 'User Engagement',
    'admin.systemEfficiency': 'System Efficiency',
    'admin.marketPenetration': 'Market Penetration',
    'admin.customerSatisfaction': 'Customer Satisfaction',
    'admin.operationalCosts': 'Operational Costs',
    'admin.profitMargins': 'Profit Margins',
    'admin.inventoryHealth': 'Inventory Health',
    'admin.supplyChainEfficiency': 'Supply Chain Efficiency',
    'admin.digitalAdoption': 'Digital Adoption',
    'admin.complianceScore': 'Compliance Score',

    // Metrics
    'metrics.orderValue': 'Order Value',
    'metrics.orderCount': 'Order Count',
    'metrics.avgOrderValue': 'Avg Order Value',
    'metrics.uniqueOutlets': 'Unique Outlets',
    'metrics.uniqueDistributors': 'Unique Distributors',
    'metrics.newOutlets': 'New Outlets',
    'metrics.newDistributors': 'New Distributors',
    'metrics.receivables': 'Receivables',
    'metrics.payables': 'Payables',
    'metrics.inventoryTurnover': 'Inventory Turnover',
    'metrics.fulfillmentRate': 'Fulfillment Rate',
    'metrics.totalManufacturers': 'Total Manufacturers',
    'metrics.totalDistributors': 'Total Distributors',
    'metrics.activeMails': 'Active Mails',
    'metrics.systemUptime': 'System Uptime',

    // Products
    'products.topSelling': 'Top Selling Products',
    'products.recentOrders': 'Recent Orders',
    'products.viewAll': 'View All',
    'products.export': 'Export',
    'products.units': 'units',

    // Regions
    'regions.northIndia': 'North India',
    'regions.westIndia': 'West India',
    'regions.southIndia': 'South India',
    'regions.eastIndia': 'East India',
    'regions.salesBreakdown': 'Regional Sales Breakdown',

    // Performance
    'performance.analysis': 'Performance Analysis',
    'performance.salesTrend': 'Sales Trend',
    'performance.orderVelocity': 'Order Velocity',
    'performance.qualityScore': 'Quality Score',
    'performance.marketReach': 'Market Reach',
    'performance.thisMonth': 'This Month',
    'performance.processingSpeed': 'Processing Speed',
    'performance.customerRating': 'Customer Rating',
    'performance.coverage': 'Coverage',
    'performance.fast': 'Fast',
    'performance.excellent': 'Excellent',
    'performance.national': 'National',

    // Security
    'security.overview': 'Security Overview',
    'security.activeSessions': 'Active Sessions',
    'security.currentlyLoggedIn': 'Currently logged in users',
    'security.failedLogins': 'Failed Login Attempts',
    'security.last24Hours': 'Last 24 hours',
    'security.dataBackup': 'Data Backup Status',
    'security.lastBackup': 'Last backup',
    'security.hoursAgo': 'hours ago',

    // System
    'system.performance': 'System Performance',
    'system.apiResponseTime': 'API Response Time',
    'system.average': 'Average',
    'system.databasePerformance': 'Database Performance',
    'system.querySpeed': 'Query Speed',

    // Login
    'login.title': 'FMCG Distribution Hub',
    'login.subtitle': 'India\'s Largest FMCG Distribution Platform',
    'login.poweredBy': 'Powered by Bizz+',
    'login.demoCredentials': 'Demo Credentials:',
    'login.manufacturer': 'Manufacturer',
    'login.admin': 'Admin',
    'login.distributor': 'Distributor',
    'login.userId': 'User ID',
    'login.password': 'Password',
    'login.enterUserId': 'Enter your User ID',
    'login.enterPassword': 'Enter your password',
    'login.signIn': 'Sign In',
    'login.signingIn': 'Signing in...',
    'login.copyright': '© 2025 Bizz+ FMCG Distribution Hub. All rights reserved.',

    // Common
    'common.refresh': 'Refresh',
    'common.export': 'Export',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.total': 'Total',
    'common.today': 'Today',
    'common.thisWeek': 'This Week',
    'common.thisMonth': 'This Month',
    'common.thisQuarter': 'This Quarter',
    'common.thisYear': 'This Year',
    'common.allRegions': 'All Regions',
    'common.delivered': 'Delivered',
    'common.shipped': 'Shipped',
    'common.processing': 'Processing',
    'common.pending': 'Pending',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.manufacturers': 'निर्माता',
    'nav.distributors': 'वितरक',
    'nav.mailCenter': 'मेल सेंटर',
    'nav.userManagement': 'उपयोगकर्ता प्रबंधन',
    'nav.adminPanel': 'एडमिन पैनल',
    'nav.crmSync': 'CRM सिंक',
    'nav.transactionSync': 'लेनदेन सिंक',
    'nav.mappingUtility': 'मैपिंग उपयोगिता',
    'nav.settings': 'सेटिंग्स',
    'nav.logout': 'लॉगआउट',

    // Dashboard
    'dashboard.welcome': 'नमस्ते',
    'dashboard.manufacturerTitle': 'आपका निर्माण साम्राज्य फल-फूल रहा है। यहाँ है आपका कमांड सेंटर।',
    'dashboard.distributorTitle': 'आपका नेटवर्क बढ़ रहा है। अपने क्षेत्र के प्रदर्शन की निगरानी करें।',
    'dashboard.adminTitle': 'आपके वितरण इकोसिस्टम पर पूर्ण नियंत्रण। सब कुछ मॉनिटर करें।',
    'dashboard.totalRevenue': 'कुल राजस्व',
    'dashboard.growthRate': 'वृद्धि दर',
    'dashboard.totalUsers': 'कुल उपयोगकर्ता',
    'dashboard.systemHealth': 'सिस्टम स्वास्थ्य',
    'dashboard.totalSales': 'कुल बिक्री',

    // Metrics
    'metrics.orderValue': 'ऑर्डर वैल्यू',
    'metrics.orderCount': 'ऑर्डर संख्या',
    'metrics.avgOrderValue': 'औसत ऑर्डर वैल्यू',
    'metrics.uniqueOutlets': 'यूनीक आउटलेट्स',
    'metrics.uniqueDistributors': 'यूनीक डिस्ट्रिब्यूटर्स',
    'metrics.newOutlets': 'नए आउटलेट्स',
    'metrics.newDistributors': 'नए डिस्ट्रिब्यूटर्स',
    'metrics.receivables': 'प्राप्य राशि',
    'metrics.payables': 'देय राशि',
    'metrics.inventoryTurnover': 'इन्वेंटरी टर्नओवर',
    'metrics.fulfillmentRate': 'पूर्ति दर',
    'metrics.totalManufacturers': 'कुल निर्माता',
    'metrics.totalDistributors': 'कुल वितरक',
    'metrics.activeMails': 'सक्रिय मेल्स',
    'metrics.systemUptime': 'सिस्टम अपटाइम',

    // Products
    'products.topSelling': 'टॉप सेलिंग प्रोडक्ट्स',
    'products.recentOrders': 'हाल के ऑर्डर्स',
    'products.viewAll': 'सभी देखें',
    'products.export': 'एक्सपोर्ट',
    'products.units': 'यूनिट्स',

    // Regions
    'regions.northIndia': 'उत्तर भारत',
    'regions.westIndia': 'पश्चिम भारत',
    'regions.southIndia': 'दक्षिण भारत',
    'regions.eastIndia': 'पूर्व भारत',
    'regions.salesBreakdown': 'क्षेत्रीय बिक्री विवरण',

    // Performance
    'performance.analysis': 'प्रदर्शन विश्लेषण',
    'performance.salesTrend': 'बिक्री ट्रेंड',
    'performance.orderVelocity': 'ऑर्डर वेलोसिटी',
    'performance.qualityScore': 'गुणवत्ता स्कोर',
    'performance.marketReach': 'बाज़ार पहुंच',
    'performance.thisMonth': 'इस महीने',
    'performance.processingSpeed': 'प्रोसेसिंग स्पीड',
    'performance.customerRating': 'ग्राहक रेटिंग',
    'performance.coverage': 'कवरेज',
    'performance.fast': 'तेज़',
    'performance.excellent': 'उत्कृष्ट',
    'performance.national': 'राष्ट्रीय',

    // Security
    'security.overview': 'सुरक्षा अवलोकन',
    'security.activeSessions': 'सक्रिय सत्र',
    'security.currentlyLoggedIn': 'वर्तमान में लॉग इन उपयोगकर्ता',
    'security.failedLogins': 'असफल लॉगिन प्रयास',
    'security.last24Hours': 'पिछले 24 घंटे',
    'security.dataBackup': 'डेटा बैकअप स्थिति',
    'security.lastBackup': 'अंतिम बैकअप',
    'security.hoursAgo': 'घंटे पहले',

    // System
    'system.performance': 'सिस्टम प्रदर्शन',
    'system.apiResponseTime': 'API रिस्पांस टाइम',
    'system.average': 'औसत',
    'system.databasePerformance': 'डेटाबेस प्रदर्शन',
    'system.querySpeed': 'क्वेरी स्पीड',

    // Login
    'login.title': 'FMCG वितरण हब',
    'login.subtitle': 'भारत का सबसे बड़ा FMCG वितरण प्लेटफॉर्म',
    'login.poweredBy': 'Bizz+ द्वारा संचालित',
    'login.demoCredentials': 'डेमो क्रेडेंशियल्स:',
    'login.manufacturer': 'निर्माता',
    'login.admin': 'एडमिन',
    'login.distributor': 'वितरक',
    'login.userId': 'यूजर आईडी',
    'login.password': 'पासवर्ड',
    'login.enterUserId': 'अपनी User ID दर्ज करें',
    'login.enterPassword': 'अपना पासवर्ड दर्ज करें',
    'login.signIn': 'साइन इन करें',
    'login.signingIn': 'साइन इन हो रहे हैं...',
    'login.copyright': '© 2025 Bizz+ FMCG वितरण हब। सभी अधिकार सुरक्षित।',

    // Common
    'common.refresh': 'रिफ्रेश',
    'common.export': 'एक्सपोर्ट',
    'common.search': 'खोजें',
    'common.filter': 'फिल्टर',
    'common.total': 'कुल',
    'common.today': 'आज',
    'common.thisWeek': 'इस सप्ताह',
    'common.thisMonth': 'इस महीने',
    'common.thisQuarter': 'इस तिमाही',
    'common.thisYear': 'इस वर्ष',
    'common.allRegions': 'सभी क्षेत्र',
    'common.delivered': 'डिलीवर्ड',
    'common.shipped': 'शिप्ड',
    'common.processing': 'प्रोसेसिंग',
    'common.pending': 'पेंडिंग',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('bizz_language') as Language;
    // Default to English if no saved language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguage(savedLanguage);
    } else {
      setLanguage('en'); // Default to English
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('bizz_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};