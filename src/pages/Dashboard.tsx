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
import { DashboardStats, Manufacturer, Distributor, MailData } from '../types';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
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
    orderValue: { current: 2540000, previous: 2260000, growth: 12.4 },
    orderCount: { current: 1245, previous: 1156, growth: 7.7 },
    avgOrderValue: { current: 2040, previous: 1955, growth: 4.3 },
    uniqueOutlets: { current: 456, previous: 423, growth: 7.8 },
    uniqueDistributors: { current: 89, previous: 82, growth: 8.5 },
    newOutlets: { current: 34, previous: 28, growth: 21.4 },
    newDistributors: { current: 7, previous: 5, growth: 40.0 },
    receivables: { current: 340000, previous: 298000, growth: 14.1 },
    payables: { current: 180000, previous: 165000, growth: 9.1 },
    inventoryTurnover: { current: 8.5, previous: 7.8, growth: 9.0 },
    fulfillmentRate: { current: 96.8, previous: 94.2, growth: 2.8 }
  });

  const [distributorData, setDistributorData] = useState({
    orderValue: { current: 1890000, previous: 1720000, growth: 9.9 },
    orderCount: { current: 892, previous: 834, growth: 7.0 },
    avgOrderValue: { current: 2120, previous: 2063, growth: 2.8 },
    uniqueOutlets: { current: 234, previous: 218, growth: 7.3 },
    receivables: { current: 145000, previous: 132000, growth: 9.8 },
    payables: { current: 89000, previous: 78000, growth: 14.1 },
    inventoryTurnover: { current: 6.2, previous: 5.8, growth: 6.9 },
    totalSales: { current: 3450000, previous: 3120000, growth: 10.6 },
    regionBreakdown: [
      { region: 'North America', sales: 1200000, percentage: 34.8 },
      { region: 'Europe', sales: 890000, percentage: 25.8 },
      { region: 'Asia Pacific', sales: 780000, percentage: 22.6 },
      { region: 'Others', sales: 580000, percentage: 16.8 }
    ]
  });

  const [topProducts, setTopProducts] = useState([
    { sku: 'WBH-001', name: 'Wireless Bluetooth Headphones', sales: 45000, units: 234, growth: 15.2 },
    { sku: 'SPC-002', name: 'Smart Phone Case', sales: 32000, units: 456, growth: 8.7 },
    { sku: 'LED-003', name: 'LED Light Bulb 12W', sales: 28000, units: 789, growth: 12.3 },
    { sku: 'IM-004', name: 'Industrial Motor 5HP', sales: 67000, units: 23, growth: 22.1 },
    { sku: 'CAB-005', name: 'Network Cable Cat6', sales: 18000, units: 567, growth: 5.4 }
  ]);

  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-001', customer: 'TechMart Electronics', amount: 45000, status: 'delivered', date: '2024-12-20' },
    { id: 'ORD-002', customer: 'Global Supplies Co', amount: 32000, status: 'shipped', date: '2024-12-19' },
    { id: 'ORD-003', customer: 'Metro Distribution', amount: 28000, status: 'processing', date: '2024-12-18' },
    { id: 'ORD-004', customer: 'Regional Partners', amount: 67000, status: 'pending', date: '2024-12-17' }
  ]);

  useEffect(() => {
    // Mock data initialization
    const mockStats: DashboardStats = {
      totalManufacturers: 156,
      totalDistributors: 89,
      activeMails: 1240,
      remainingMails: 2760,
      totalRevenue: 2540000,
      monthlyGrowth: 12.5
    };

    setStats(mockStats);
  }, []);

  const renderStatCard = (title: string, current: number, previous: number, growth: number, icon: React.ElementType, color: string, prefix?: string, suffix?: string) => (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {prefix}{typeof current === 'number' ? current.toLocaleString() : current}{suffix}
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
          {React.createElement(icon, { className: "w-8 h-8 text-white" })}
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
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 🚀</h1>
          <p className="text-xl opacity-90 mb-6">Your manufacturing empire is thriving. Here's your command center.</p>
          <div className="flex items-center space-x-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-80">Total Revenue</p>
              <p className="text-2xl font-bold">${manufacturerData.orderValue.current.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-80">Growth Rate</p>
              <p className="text-2xl font-bold">+{manufacturerData.orderValue.growth}%</p>
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
          <Col xs={24} sm={12} lg={6}>
            {renderStatCard('Order Value', manufacturerData.orderValue.current, manufacturerData.orderValue.previous, manufacturerData.orderValue.growth, DollarSign, 'from-emerald-500 to-teal-600', '$')}
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {renderStatCard('Order Count', manufacturerData.orderCount.current, manufacturerData.orderCount.previous, manufacturerData.orderCount.growth, ShoppingCart, 'from-blue-500 to-indigo-600')}
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {renderStatCard('Avg Order Value', manufacturerData.avgOrderValue.current, manufacturerData.avgOrderValue.previous, manufacturerData.avgOrderValue.growth, Target, 'from-purple-500 to-pink-600', '$')}
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {renderStatCard('Unique Outlets', manufacturerData.uniqueOutlets.current, manufacturerData.uniqueOutlets.previous, manufacturerData.uniqueOutlets.growth, Globe, 'from-orange-500 to-red-600')}
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
          <Col xs={24} sm={12} lg={6}>
            {renderStatCard('Unique Distributors', manufacturerData.uniqueDistributors.current, manufacturerData.uniqueDistributors.previous, manufacturerData.uniqueDistributors.growth, Truck, 'from-cyan-500 to-blue-600')}
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {renderStatCard('New Outlets', manufacturerData.newOutlets.current, manufacturerData.newOutlets.previous, manufacturerData.newOutlets.growth, MapPin, 'from-green-500 to-emerald-600')}
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {renderStatCard('New Distributors', manufacturerData.newDistributors.current, manufacturerData.newDistributors.previous, manufacturerData.newDistributors.growth, Users, 'from-violet-500 to-purple-600')}
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {renderStatCard('Fulfillment Rate', manufacturerData.fulfillmentRate.current, manufacturerData.fulfillmentRate.previous, manufacturerData.fulfillmentRate.growth, Award, 'from-yellow-500 to-orange-600', '', '%')}
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
          <Col xs={24} sm={12} lg={8}>
            {renderStatCard('Receivables', manufacturerData.receivables.current, manufacturerData.receivables.previous, manufacturerData.receivables.growth, CreditCard, 'from-indigo-500 to-blue-600', '$')}
          </Col>
          <Col xs={24} sm={12} lg={8}>
            {renderStatCard('Payables', manufacturerData.payables.current, manufacturerData.payables.previous, manufacturerData.payables.growth, Receipt, 'from-red-500 to-pink-600', '$')}
          </Col>
          <Col xs={24} sm={12} lg={8}>
            {renderStatCard('Inventory Turnover', manufacturerData.inventoryTurnover.current, manufacturerData.inventoryTurnover.previous, manufacturerData.inventoryTurnover.growth, Activity, 'from-teal-500 to-cyan-600', '', 'x')}
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
                    <span className="text-lg font-bold">Top Selling SKUs</span>
                  </div>
                  <Button type="text" icon={<Eye className="w-4 h-4" />} size="small">View All</Button>
                </div>
              }
              className="shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10"
            >
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <motion.div
                    key={product.sku}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{product.sku} • {product.units} units</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900 dark:text-white">${product.sales.toLocaleString()}</p>
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
                    <span className="text-lg font-bold">Recent Orders</span>
                  </div>
                  <Button type="text" icon={<Download className="w-4 h-4" />} size="small">Export</Button>
                </div>
              }
              className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10"
            >
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{order.customer}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{order.id} • {order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900 dark:text-white">${order.amount.toLocaleString()}</p>
                      <Tag color={
                        order.status === 'delivered' ? 'green' :
                        order.status === 'shipped' ? 'blue' :
                        order.status === 'processing' ? 'orange' : 'red'
                      } className="text-xs">
                        {order.status.toUpperCase()}
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
                <span className="text-xl font-bold">Performance Analytics</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Sales Trend</h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">This Month</span>
                  <span className="font-semibold text-green-600">+12.4%</span>
                </div>
                <Progress percent={85} strokeColor="#10b981" trailColor="#f3f4f6" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Order Velocity</h3>
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Processing Speed</span>
                  <span className="font-semibold text-blue-600">Fast</span>
                </div>
                <Progress percent={92} strokeColor="#3b82f6" trailColor="#f3f4f6" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Quality Score</h3>
                <Award className="w-5 h-5 text-purple-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Customer Rating</span>
                  <span className="font-semibold text-purple-600">Excellent</span>
                </div>
                <Progress percent={96} strokeColor="#8b5cf6" trailColor="#f3f4f6" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Market Reach</h3>
                <Globe className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Coverage</span>
                  <span className="font-semibold text-cyan-600">Global</span>
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
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 text-white"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Distribution Command Center 🌍</h1>
          <p className="text-xl opacity-90 mb-6">Your network is expanding. Monitor your territory performance.</p>
          <div className="flex items-center space-x-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-80">Total Sales</p>
              <p className="text-2xl font-bold">${distributorData.totalSales.current.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-80">Growth Rate</p>
              <p className="text-2xl font-bold">+{distributorData.totalSales.growth}%</p>
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
          <Col xs={24} sm={12} lg={6}>
            {renderStatCard('Order Value', distributorData.orderValue.current, distributorData.orderValue.previous, distributorData.orderValue.growth, DollarSign, 'from-emerald-500 to-green-600', '$')}
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {renderStatCard('Order Count', distributorData.orderCount.current, distributorData.orderCount.previous, distributorData.orderCount.growth, ShoppingCart, 'from-blue-500 to-cyan-600')}
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {renderStatCard('Avg Order Value', distributorData.avgOrderValue.current, distributorData.avgOrderValue.previous, distributorData.avgOrderValue.growth, Target, 'from-purple-500 to-indigo-600', '$')}
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {renderStatCard('Unique Outlets', distributorData.uniqueOutlets.current, distributorData.uniqueOutlets.previous, distributorData.uniqueOutlets.growth, Globe, 'from-orange-500 to-yellow-600')}
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
              <span className="text-xl font-bold">Regional Sales Breakdown</span>
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
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{region.region}</h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      ${region.sales.toLocaleString()}
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
          <Col xs={24} sm={12} lg={8}>
            {renderStatCard('Receivables', distributorData.receivables.current, distributorData.receivables.previous, distributorData.receivables.growth, CreditCard, 'from-indigo-500 to-purple-600', '$')}
          </Col>
          <Col xs={24} sm={12} lg={8}>
            {renderStatCard('Payables', distributorData.payables.current, distributorData.payables.previous, distributorData.payables.growth, Receipt, 'from-red-500 to-pink-600', '$')}
          </Col>
          <Col xs={24} sm={12} lg={8}>
            {renderStatCard('Inventory Turnover', distributorData.inventoryTurnover.current, distributorData.inventoryTurnover.previous, distributorData.inventoryTurnover.growth, Activity, 'from-teal-500 to-cyan-600', '', 'x')}
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
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 p-8 text-white"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">System Command Center 🎯</h1>
          <p className="text-xl opacity-90 mb-6">Total control over your distribution ecosystem. Monitor everything.</p>
          <div className="flex items-center space-x-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-80">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalManufacturers + stats.totalDistributors}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-80">System Health</p>
              <p className="text-2xl font-bold">98.5%</p>
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
          <Col xs={24} sm={12} lg={6}>
            {renderStatCard('Total Manufacturers', stats.totalManufacturers, 140, 11.4, Factory, 'from-blue-500 to-indigo-600')}
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {renderStatCard('Total Distributors', stats.totalDistributors, 82, 8.5, Truck, 'from-green-500 to-emerald-600')}
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {renderStatCard('Active Mails', stats.activeMails, 1156, 7.3, Send, 'from-purple-500 to-pink-600')}
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {renderStatCard('System Uptime', 99.8, 99.2, 0.6, Activity, 'from-cyan-500 to-blue-600', '', '%')}
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
                  <span className="text-xl font-bold">Security Overview</span>
                </div>
              }
              className="shadow-xl border-0 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Active Sessions</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Currently logged in users</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">24</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Failed Login Attempts</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last 24 hours</p>
                  </div>
                  <div className="text-2xl font-bold text-red-600">3</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Data Backup Status</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last backup</p>
                  </div>
                  <div className="text-sm font-bold text-green-600">2 hours ago</div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-6 h-6 text-purple-500" />
                  <span className="text-xl font-bold">System Performance</span>
                </div>
              }
              className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10"
            >
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">API Response Time</h3>
                    <Zap className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Average: 120ms</span>
                      <span className="font-semibold text-green-600">Excellent</span>
                    </div>
                    <Progress percent={95} strokeColor="#10b981" trailColor="#f3f4f6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Database Performance</h3>
                    <Database className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Query Speed</span>
                      <span className="font-semibold text-blue-600">Fast</span>
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-4">
          <Select value={timeFilter} onChange={setTimeFilter} className="w-40">
            <Option value="today">Today</Option>
            <Option value="thisWeek">This Week</Option>
            <Option value="thisMonth">This Month</Option>
            <Option value="thisQuarter">This Quarter</Option>
            <Option value="thisYear">This Year</Option>
          </Select>
          {(user?.role === 'admin' || user?.role === 'distributor') && (
            <Select value={regionFilter} onChange={setRegionFilter} className="w-40">
              <Option value="all">All Regions</Option>
              <Option value="north">North America</Option>
              <Option value="europe">Europe</Option>
              <Option value="asia">Asia Pacific</Option>
              <Option value="others">Others</Option>
            </Select>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button icon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
          <Button type="primary" icon={<Download className="w-4 h-4" />}>Export</Button>
        </div>
      </motion.div>

      {/* Role-based Dashboard Content */}
      {user?.role === 'manufacturer' && renderManufacturerDashboard()}
      {user?.role === 'distributor' && renderDistributorDashboard()}
      {user?.role === 'admin' && renderAdminDashboard()}
    </div>
  );
};

export default Dashboard;