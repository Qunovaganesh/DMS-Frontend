import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Progress, Statistic, Row, Col, Tabs, Select, DatePicker, Button } from 'antd';
import { 
  Factory, 
  Truck, 
  Mail, 
  TrendingUp, 
  Users, 
  DollarSign,
  Send,
  Clock,
  Package,
  ShoppingCart,
  CreditCard,
  Receipt,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Zap,
  Globe,
  MapPin,
  Calendar,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye,
  Download,
  Shield,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { DashboardStats, Manufacturer, Distributor, MailData } from '../types';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [stats, setStats] = useState<DashboardStats>({
    totalManufacturers: 0,
    totalDistributors: 0,
    activeMails: 0,
    remainingMails: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });

  const [timeFilter, setTimeFilter] = useState('thisMonth');
  const [regionFilter, setRegionFilter] = useState('all');

  // Role-specific data
  const [manufacturerData, setManufacturerData] = useState({
    orderValue: { current: 25400000, previous: 22600000, growth: 12.4 },
    orderCount: { current: 1245, previous: 1156, growth: 7.7 },
    avgOrderValue: { current: 20400, previous: 19550, growth: 4.3 },
    uniqueOutlets: { current: 456, previous: 423, growth: 7.8 },
    uniqueDistributors: { current: 89, previous: 82, growth: 8.5 },
    newOutlets: { current: 34, previous: 28, growth: 21.4 },
    newDistributors: { current: 7, previous: 5, growth: 40.0 },
    receivables: { current: 3400000, previous: 2980000, growth: 14.1 },
    payables: { current: 1800000, previous: 1650000, growth: 9.1 },
    inventoryTurnover: { current: 8.5, previous: 7.8, growth: 9.0 },
    fulfillmentRate: { current: 96.8, previous: 94.2, growth: 2.8 }
  });

  const [distributorData, setDistributorData] = useState({
    orderValue: { current: 18900000, previous: 17200000, growth: 9.9 },
    orderCount: { current: 892, previous: 834, growth: 7.0 },
    avgOrderValue: { current: 21200, previous: 20630, growth: 2.8 },
    uniqueOutlets: { current: 234, previous: 218, growth: 7.3 },
    receivables: { current: 1450000, previous: 1320000, growth: 9.8 },
    payables: { current: 890000, previous: 780000, growth: 14.1 },
    inventoryTurnover: { current: 6.2, previous: 5.8, growth: 6.9 },
    totalSales: { current: 34500000, previous: 31200000, growth: 10.6 },
    regionBreakdown: [
      { region: 'उत्तर भारत', sales: 12000000, percentage: 34.8 },
      { region: 'पश्चिम भारत', sales: 8900000, percentage: 25.8 },
      { region: 'दक्षिण भारत', sales: 7800000, percentage: 22.6 },
      { region: 'पूर्व भारत', sales: 5800000, percentage: 16.8 }
    ]
  });

  const [topProducts, setTopProducts] = useState([
    { sku: 'DET-001', name: 'सर्फ एक्सेल डिटर्जेंट पाउडर 1kg', sales: 450000, units: 2340, growth: 15.2 },
    { sku: 'SHP-002', name: 'हेड एंड शोल्डर्स शैम्पू 400ml', sales: 320000, units: 1456, growth: 8.7 },
    { sku: 'TEA-003', name: 'ताज महल टी बैग्स 100pcs', sales: 280000, units: 1789, growth: 12.3 },
    { sku: 'OIL-004', name: 'फॉर्च्यून सनफ्लावर ऑयल 1L', sales: 670000, units: 1123, growth: 22.1 },
    { sku: 'BIS-005', name: 'पार्ले-जी बिस्कुट 200g', sales: 180000, units: 2567, growth: 5.4 }
  ]);

  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-001', customer: 'मुंबई रिटेल स्टोर्स', amount: 450000, status: 'delivered', date: '2024-12-20' },
    { id: 'ORD-002', customer: 'दिल्ली सप्लाई चेन', amount: 320000, status: 'shipped', date: '2024-12-19' },
    { id: 'ORD-003', customer: 'बेंगलुरु डिस्ट्रिब्यूशन', amount: 280000, status: 'processing', date: '2024-12-18' },
    { id: 'ORD-004', customer: 'कोलकाता पार्टनर्स', amount: 670000, status: 'pending', date: '2024-12-17' }
  ]);

  useEffect(() => {
    // Mock data initialization
    const mockStats: DashboardStats = {
      totalManufacturers: 156,
      totalDistributors: 89,
      activeMails: 1240,
      remainingMails: 2760,
      totalRevenue: 25400000,
      monthlyGrowth: 12.5
    };

    setStats(mockStats);
  }, []);

  const renderStatCard = (title: string, current: number, previous: number, growth: number, icon: React.ElementType, color: string, prefix?: string, suffix?: string) => (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {prefix}{typeof current === 'number' ? current.toLocaleString('hi-IN') : current}{suffix}
          </p>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
              growth >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {growth >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              <span>{Math.abs(growth)}%</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">vs last period</span>
          </div>
        </div>
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          {React.createElement(icon, { className: "w-6 h-6 sm:w-8 sm:h-8 text-white" })}
        </div>
      </div>
    </Card>
  );

  const renderManufacturerDashboard = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${colors.gradient} p-6 sm:p-8 text-white`}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <img 
              src="/src/assets/bizz+Logo_Final.png" 
              alt="Bizz+" 
              className="h-8 w-auto mr-4 opacity-90"
            />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">नमस्ते, {user?.name}! 🚀</h1>
          <p className="text-lg sm:text-xl opacity-90 mb-6">आपका निर्माण साम्राज्य फल-फूल रहा है। यहाँ है आपका कमांड सेंटर।</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 w-full sm:w-auto">
              <p className="text-sm opacity-80">कुल राजस्व</p>
              <p className="text-xl sm:text-2xl font-bold">₹{manufacturerData.orderValue.current.toLocaleString('hi-IN')}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 w-full sm:w-auto">
              <p className="text-sm opacity-80">वृद्धि दर</p>
              <p className="text-xl sm:text-2xl font-bold">+{manufacturerData.orderValue.growth}%</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </motion.div>

      {/* Key Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={12} sm={12} lg={6}>
            {renderStatCard('ऑर्डर वैल्यू', manufacturerData.orderValue.current, manufacturerData.orderValue.previous, manufacturerData.orderValue.growth, DollarSign, colors.gradient, '₹')}
          </Col>
          <Col xs={12} sm={12} lg={6}>
            {renderStatCard('ऑर्डर संख्या', manufacturerData.orderCount.current, manufacturerData.orderCount.previous, manufacturerData.orderCount.growth, ShoppingCart, 'from-blue-500 to-indigo-600')}
          </Col>
          <Col xs={12} sm={12} lg={6}>
            {renderStatCard('औसत ऑर्डर वैल्यू', manufacturerData.avgOrderValue.current, manufacturerData.avgOrderValue.previous, manufacturerData.avgOrderValue.growth, Target, 'from-purple-500 to-pink-600', '₹')}
          </Col>
          <Col xs={12} sm={12} lg={6}>
            {renderStatCard('यूनीक आउटलेट्स', manufacturerData.uniqueOutlets.current, manufacturerData.uniqueOutlets.previous, manufacturerData.uniqueOutlets.growth, Globe, 'from-orange-500 to-red-600')}
          </Col>
        </Row>
      </motion.div>

      {/* Secondary Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={12} sm={12} lg={6}>
            {renderStatCard('यूनीक डिस्ट्रिब्यूटर्स', manufacturerData.uniqueDistributors.current, manufacturerData.uniqueDistributors.previous, manufacturerData.uniqueDistributors.growth, Truck, 'from-cyan-500 to-blue-600')}
          </Col>
          <Col xs={12} sm={12} lg={6}>
            {renderStatCard('नए आउटलेट्स', manufacturerData.newOutlets.current, manufacturerData.newOutlets.previous, manufacturerData.newOutlets.growth, MapPin, 'from-green-500 to-emerald-600')}
          </Col>
          <Col xs={12} sm={12} lg={6}>
            {renderStatCard('नए डिस्ट्रिब्यूटर्स', manufacturerData.newDistributors.current, manufacturerData.newDistributors.previous, manufacturerData.newDistributors.growth, Users, 'from-violet-500 to-purple-600')}
          </Col>
          <Col xs={12} sm={12} lg={6}>
            {renderStatCard('पूर्ति दर', manufacturerData.fulfillmentRate.current, manufacturerData.fulfillmentRate.previous, manufacturerData.fulfillmentRate.growth, Award, 'from-yellow-500 to-orange-600', '', '%')}
          </Col>
        </Row>
      </motion.div>

      {/* Financial Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={12} sm={12} lg={8}>
            {renderStatCard('प्राप्य राशि', manufacturerData.receivables.current, manufacturerData.receivables.previous, manufacturerData.receivables.growth, CreditCard, 'from-indigo-500 to-blue-600', '₹')}
          </Col>
          <Col xs={12} sm={12} lg={8}>
            {renderStatCard('देय राशि', manufacturerData.payables.current, manufacturerData.payables.previous, manufacturerData.payables.growth, Receipt, 'from-red-500 to-pink-600', '₹')}
          </Col>
          <Col xs={12} sm={12} lg={8}>
            {renderStatCard('इन्वेंटरी टर्नओवर', manufacturerData.inventoryTurnover.current, manufacturerData.inventoryTurnover.previous, manufacturerData.inventoryTurnover.growth, Activity, 'from-teal-500 to-cyan-600', '', 'x')}
          </Col>
        </Row>
      </motion.div>

      {/* Advanced Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Row gutter={[24, 24]}>
          {/* Top Selling Products */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="text-lg font-bold">टॉप सेलिंग प्रोडक्ट्स</span>
                  </div>
                  <Button type="text" icon={<Eye className="w-4 h-4" />} size="small">View All</Button>
                </div>
              }
              className="shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10"
            >
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <motion.div
                    key={product.sku}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{product.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{product.sku} • {product.units} यूनिट्स</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm sm:text-lg text-gray-900 dark:text-white">₹{product.sales.toLocaleString('hi-IN')}</p>
                      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <ArrowUp className="w-3 h-3" />
                        <span className="text-xs font-semibold">+{product.growth}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </Col>

          {/* Recent Orders */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-blue-500" />
                    <span className="text-lg font-bold">हाल के ऑर्डर्स</span>
                  </div>
                  <Button type="text" icon={<Download className="w-4 h-4" />} size="small">Export</Button>
                </div>
              }
              className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10"
            >
              <div className="space-y-3">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{order.customer}</p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{order.id} • {order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm sm:text-lg text-gray-900 dark:text-white">₹{order.amount.toLocaleString('hi-IN')}</p>
                      <Tag color={
                        order.status === 'delivered' ? 'green' :
                        order.status === 'shipped' ? 'blue' :
                        order.status === 'processing' ? 'orange' : 'red'
                      } className="text-xs">
                        {order.status === 'delivered' ? 'डिलीवर्ड' :
                         order.status === 'shipped' ? 'शिप्ड' :
                         order.status === 'processing' ? 'प्रोसेसिंग' : 'पेंडिंग'}
                      </Tag>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Performance Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <Card 
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-purple-500" />
                <span className="text-xl font-bold">प्रदर्शन विश्लेषण</span>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={timeFilter} onChange={setTimeFilter} className="w-32">
                  <Option value="thisWeek">This Week</Option>
                  <Option value="thisMonth">This Month</Option>
                  <Option value="thisQuarter">This Quarter</Option>
                  <Option value="thisYear">This Year</Option>
                </Select>
                <Button icon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
              </div>
            </div>
          }
          className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">बिक्री ट्रेंड</h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">इस महीने</span>
                  <span className="font-semibold text-green-600">+12.4%</span>
                </div>
                <Progress percent={85} strokeColor="#10b981" trailColor="#f3f4f6" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">ऑर्डर वेलोसिटी</h3>
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">प्रोसेसिंग स्पीड</span>
                  <span className="font-semibold text-blue-600">तेज़</span>
                </div>
                <Progress percent={92} strokeColor="#3b82f6" trailColor="#f3f4f6" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">गुणवत्ता स्कोर</h3>
                <Award className="w-5 h-5 text-purple-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">ग्राहक रेटिंग</span>
                  <span className="font-semibold text-purple-600">उत्कृष्ट</span>
                </div>
                <Progress percent={96} strokeColor="#8b5cf6" trailColor="#f3f4f6" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">बाज़ार पहुंच</h3>
                <Globe className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">कवरेज</span>
                  <span className="font-semibold text-cyan-600">राष्ट्रीय</span>
                </div>
                <Progress percent={78} strokeColor="#06b6d4" trailColor="#f3f4f6" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );

  const renderDistributorDashboard = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${colors.gradient} p-6 sm:p-8 text-white`}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <img 
              src="/src/assets/bizz+Logo_Final.png" 
              alt="Bizz+" 
              className="h-8 w-auto mr-4 opacity-90"
            />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">वितरण कमांड सेंटर 🌍</h1>
          <p className="text-lg sm:text-xl opacity-90 mb-6">आपका नेटवर्क बढ़ रहा है। अपने क्षेत्र के प्रदर्शन की निगरानी करें।</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 w-full sm:w-auto">
              <p className="text-sm opacity-80">कुल बिक्री</p>
              <p className="text-xl sm:text-2xl font-bold">₹{distributorData.totalSales.current.toLocaleString('hi-IN')}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 w-full sm:w-auto">
              <p className="text-sm opacity-80">वृद्धि दर</p>
              <p className="text-xl sm:text-2xl font-bold">+{distributorData.totalSales.growth}%</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </motion.div>

      {/* Distribution Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={12} sm={12} lg={6}>
            {renderStatCard('ऑर्डर वैल्यू', distributorData.orderValue.current, distributorData.orderValue.previous, distributorData.orderValue.growth, DollarSign, colors.gradient, '₹')}
          </Col>
          <Col xs={12} sm={12} lg={6}>
            {renderStatCard('ऑर्डर संख्या', distributorData.orderCount.current, distributorData.orderCount.previous, distributorData.orderCount.growth, ShoppingCart, 'from-blue-500 to-cyan-600')}
          </Col>
          <Col xs={12} sm={12} lg={6}>
            {renderStatCard('औसत ऑर्डर वैल्यू', distributorData.avgOrderValue.current, distributorData.avgOrderValue.previous, distributorData.avgOrderValue.growth, Target, 'from-purple-500 to-indigo-600', '₹')}
          </Col>
          <Col xs={12} sm={12} lg={6}>
            {renderStatCard('यूनीक आउटलेट्स', distributorData.uniqueOutlets.current, distributorData.uniqueOutlets.previous, distributorData.uniqueOutlets.growth, Globe, 'from-orange-500 to-yellow-600')}
          </Col>
        </Row>
      </motion.div>

      {/* Regional Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card 
          title={
            <div className="flex items-center space-x-2">
              <Globe className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold">क्षेत्रीय बिक्री विवरण</span>
            </div>
          }
          className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10"
        >
          <Row gutter={[24, 24]}>
            {distributorData.regionBreakdown.map((region, index) => (
              <Col xs={24} sm={12} lg={6} key={region.region}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{region.region}</h3>
                    <p className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ₹{region.sales.toLocaleString('hi-IN')}
                    </p>
                    <div className="mb-3">
                      <Progress 
                        percent={region.percentage} 
                        strokeColor={{
                          '0%': '#3b82f6',
                          '100%': '#06b6d4',
                        }}
                        trailColor="#f3f4f6"
                        strokeWidth={8}
                      />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{region.percentage}% of total</p>
                    <p className="text-xs text-gray-400">कुल का {region.percentage}%</p>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Card>
      </motion.div>

      {/* Financial Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={12} sm={12} lg={8}>
            {renderStatCard('प्राप्य राशि', distributorData.receivables.current, distributorData.receivables.previous, distributorData.receivables.growth, CreditCard, 'from-indigo-500 to-purple-600', '₹')}
          </Col>
          <Col xs={12} sm={12} lg={8}>
            {renderStatCard('देय राशि', distributorData.payables.current, distributorData.payables.previous, distributorData.payables.growth, Receipt, 'from-red-500 to-pink-600', '₹')}
          </Col>
          <Col xs={12} sm={12} lg={8}>
            {renderStatCard('इन्वेंटरी टर्नओवर', distributorData.inventoryTurnover.current, distributorData.inventoryTurnover.previous, distributorData.inventoryTurnover.growth, Activity, 'from-teal-500 to-cyan-600', '', 'x')}
          </Col>
        </Row>
      </motion.div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${colors.gradient} p-6 sm:p-8 text-white`}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <img 
              src="/src/assets/bizz+Logo_Final.png" 
              alt="Bizz+" 
              className="h-8 w-auto mr-4 opacity-90"
            />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">सिस्टम कमांड सेंटर 🎯</h1>
          <p className="text-lg sm:text-xl opacity-90 mb-6">आपके वितरण इकोसिस्टम पर पूर्ण नियंत्रण। सब कुछ मॉनिटर करें।</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 w-full sm:w-auto">
              <p className="text-sm opacity-80">कुल उपयोगकर्ता</p>
              <p className="text-xl sm:text-2xl font-bold">{stats.totalManufacturers + stats.totalDistributors}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 w-full sm:w-auto">
              <p className="text-sm opacity-80">सिस्टम स्वास्थ्य</p>
              <p className="text-xl sm:text-2xl font-bold">98.5%</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </motion.div>

      {/* System Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={12} sm={12} lg={6}>
            {renderStatCard('कुल निर्माता', stats.totalManufacturers, 140, 11.4, Factory, 'from-blue-500 to-indigo-600')}
          </Col>
          <Col xs={12} sm={12} lg={6}>
            {renderStatCard('कुल वितरक', stats.totalDistributors, 82, 8.5, Truck, 'from-green-500 to-emerald-600')}
          </Col>
          <Col xs={12} sm={12} lg={6}>
            {renderStatCard('सक्रिय मेल्स', stats.activeMails, 1156, 7.3, Send, 'from-purple-500 to-pink-600')}
          </Col>
          <Col xs={12} sm={12} lg={6}>
            {renderStatCard('सिस्टम अपटाइम', 99.8, 99.2, 0.6, Activity, 'from-cyan-500 to-blue-600', '', '%')}
          </Col>
        </Row>
      </motion.div>

      {/* Advanced Admin Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-red-500" />
                  <span className="text-xl font-bold">सुरक्षा अवलोकन</span>
                </div>
              }
              className="shadow-xl border-0 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">सक्रिय सत्र</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">वर्तमान में लॉग इन उपयोगकर्ता</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">24</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">असफल लॉगिन प्रयास</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">पिछले 24 घंटे</p>
                  </div>
                  <div className="text-2xl font-bold text-red-600">3</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">डेटा बैकअप स्थिति</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">अंतिम बैकअप</p>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-green-600">2 घंटे पहले</div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-6 h-6 text-purple-500" />
                  <span className="text-xl font-bold">सिस्टम प्रदर्शन</span>
                </div>
              }
              className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10"
            >
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">API रिस्पांस टाइम</h3>
                    <Zap className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">औसत: 120ms</span>
                      <span className="font-semibold text-green-600">उत्कृष्ट</span>
                    </div>
                    <Progress percent={95} strokeColor="#10b981" trailColor="#f3f4f6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">डेटाबेस प्रदर्शन</h3>
                    <Database className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">क्वेरी स्पीड</span>
                      <span className="font-semibold text-blue-600">तेज़</span>
                    </div>
                    <Progress percent={88} strokeColor="#3b82f6" trailColor="#f3f4f6" />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="shadow-lg border-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Select value={timeFilter} onChange={setTimeFilter} className="w-full sm:w-40">
              <Option value="today">आज</Option>
              <Option value="thisWeek">इस सप्ताह</Option>
              <Option value="thisMonth">इस महीने</Option>
              <Option value="thisQuarter">इस तिमाही</Option>
              <Option value="thisYear">इस वर्ष</Option>
            </Select>
            {(user?.role === 'admin' || user?.role === 'distributor') && (
              <Select value={regionFilter} onChange={setRegionFilter} className="w-full sm:w-40">
                <Option value="all">सभी क्षेत्र</Option>
                <Option value="north">उत्तर भारत</Option>
                <Option value="west">पश्चिम भारत</Option>
                <Option value="south">दक्षिण भारत</Option>
                <Option value="east">पूर्व भारत</Option>
              </Select>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button icon={<RefreshCw className="w-4 h-4" />} size="small" className="text-xs sm:text-sm">रिफ्रेश</Button>
            <Button type="primary" icon={<Download className="w-4 h-4" />} size="small" className="text-xs sm:text-sm">एक्सपोर्ट</Button>
          </div>
        </div>
      </Card>

      {/* Role-based Dashboard Content */}
      {user?.role === 'manufacturer' && renderManufacturerDashboard()}
      {user?.role === 'distributor' && renderDistributorDashboard()}
      {user?.role === 'admin' && renderAdminDashboard()}
    </div>
  );
};

export default Dashboard;