import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Table, Tag, Progress } from 'antd';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  ShoppingCart,
  Target,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  Calendar,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import KpiCard from '../components/Dashboard/KpiCard';
import TrendChart from '../components/Dashboard/TrendChart';
import DataTable from '../components/Dashboard/DataTable';
import FilterBar from '../components/Dashboard/FilterBar';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();

  // Filter states
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [city, setCity] = useState('All Cities');
  const [district, setDistrict] = useState('All Districts');
  const [state, setState] = useState('All States');
  const [entityType, setEntityType] = useState<'manufacturers' | 'distributors'>('manufacturers');

  // Mock data for financial metrics
  const financialData = {
    receivables: { value: 3400000, change: 14.1 },
    payables: { value: 1800000, change: -9.1 },
    inventoryTurnover: { value: 8.5, change: 9.0 },
    fulfillmentRate: { value: 96.8, change: 2.8 }
  };

  // Mock data for sales and orders
  const primaryMarkets = {
    sales: { value: 25400000, change: 12.4 },
    orderCount: { value: 1245, change: 7.7 },
    avgOrderValue: { value: 20400, change: 4.3 },
    uniqueOutlets: { value: 456, change: 2.8 }
  };

  const secondaryMarkets = {
    sales: { value: 18200000, change: 8.9 },
    orderCount: { value: 892, change: 5.2 },
    avgOrderValue: { value: 20400, change: 3.7 },
    uniqueOutlets: { value: 324, change: 1.9 }
  };

  // Mock trend data for charts
  const trendData = Array.from({ length: 30 }, (_, i) => ({
    value: Math.floor(Math.random() * 100) + 50
  }));

  // Mock data for network tables
  const manufacturersData = [
    { rank: 1, name: 'Hindustan Unilever Ltd', sales: 4500000, change: 15.2, share: 28.5, category: 'FMCG', brand: 'HUL' },
    { rank: 2, name: 'ITC Limited', sales: 3200000, change: 8.7, share: 20.3, category: 'FMCG', brand: 'ITC' },
    { rank: 3, name: 'Nestle India', sales: 2800000, change: 12.1, share: 17.8, category: 'Food', brand: 'Nestle' },
    { rank: 4, name: 'Britannia Industries', sales: 2100000, change: 6.4, share: 13.3, category: 'Food', brand: 'Britannia' },
    { rank: 5, name: 'Dabur India Ltd', sales: 1800000, change: 9.8, share: 11.4, category: 'Personal Care', brand: 'Dabur' }
  ];

  const distributorsData = [
    { rank: 1, name: 'Mumbai Retail Stores', sales: 2400000, change: 18.5, share: 22.1, category: 'Retail', brand: 'MRS' },
    { rank: 2, name: 'Delhi Supply Chain', sales: 2100000, change: 14.2, share: 19.3, category: 'Distribution', brand: 'DSC' },
    { rank: 3, name: 'Bangalore Distribution', sales: 1900000, change: 11.7, share: 17.5, category: 'Distribution', brand: 'BD' },
    { rank: 4, name: 'Kolkata Partners', sales: 1600000, change: 8.9, share: 14.7, category: 'Retail', brand: 'KP' },
    { rank: 5, name: 'Chennai Networks', sales: 1400000, change: 7.3, share: 12.9, category: 'Distribution', brand: 'CN' }
  ];

  const outletsData = [
    { rank: 1, name: 'North India Region', sales: 3200000, change: 16.8, share: 31.2, category: 'Regional', brand: 'NIR' },
    { rank: 2, name: 'West India Region', sales: 2800000, change: 13.4, share: 27.3, category: 'Regional', brand: 'WIR' },
    { rank: 3, name: 'South India Region', sales: 2400000, change: 10.9, share: 23.4, category: 'Regional', brand: 'SIR' },
    { rank: 4, name: 'East India Region', sales: 1800000, change: 8.2, share: 17.6, category: 'Regional', brand: 'EIR' },
    { rank: 5, name: 'Central India Region', sales: 1200000, change: 5.7, share: 11.7, category: 'Regional', brand: 'CIR' }
  ];

  const skuData = [
    { rank: 1, name: 'Surf Excel Detergent Powder 1kg', sales: 450000, change: 15.2, share: 8.9, category: 'Home Care', brand: 'Surf Excel', sku: 'DET-001' },
    { rank: 2, name: 'Head & Shoulders Shampoo 400ml', sales: 320000, change: 8.7, share: 6.3, category: 'Personal Care', brand: 'H&S', sku: 'SHP-002' },
    { rank: 3, name: 'Taj Mahal Tea Bags 100pcs', sales: 280000, change: 12.1, share: 5.5, category: 'Beverages', brand: 'Taj Mahal', sku: 'TEA-003' },
    { rank: 4, name: 'Fortune Sunflower Oil 1L', sales: 210000, change: 6.4, share: 4.1, category: 'Cooking Oil', brand: 'Fortune', sku: 'OIL-004' },
    { rank: 5, name: 'Parle-G Biscuit 200g', sales: 180000, change: 9.8, share: 3.6, category: 'Snacks', brand: 'Parle', sku: 'BIS-005' }
  ];

  const renderRoleSpecificContent = () => {
    if (user?.role === 'admin') {
      return (
        <>
          {/* Admin gets full access to all sections */}
          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Total Revenue"
                value={financialData.receivables.value + financialData.payables.value}
                change={financialData.receivables.change}
                icon={<DollarSign className="w-6 h-6 text-white" />}
                color="from-blue-500 to-blue-600"
                prefix="₹"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Total Users"
                value={1245}
                change={7.7}
                icon={<Users className="w-6 h-6 text-white" />}
                color="from-green-500 to-green-600"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="System Health"
                value={financialData.fulfillmentRate.value}
                change={financialData.fulfillmentRate.change}
                icon={<Activity className="w-6 h-6 text-white" />}
                color="from-purple-500 to-purple-600"
                suffix="%"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Growth Rate"
                value={12.4}
                change={2.1}
                icon={<TrendingUp className="w-6 h-6 text-white" />}
                color="from-orange-500 to-orange-600"
                suffix="%"
              />
            </Col>
          </Row>

          {/* Network Overview for Admin */}
          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24} lg={8}>
              <DataTable
                title="Top Manufacturers"
                data={manufacturersData}
                showTopBottom={true}
                maxRows={5}
              />
            </Col>
            <Col xs={24} lg={8}>
              <DataTable
                title="Top Distributors"
                data={distributorsData}
                showTopBottom={true}
                maxRows={5}
              />
            </Col>
            <Col xs={24} lg={8}>
              <DataTable
                title="Regional Outlets"
                data={outletsData}
                showTopBottom={true}
                maxRows={5}
              />
            </Col>
          </Row>
        </>
      );
    }

    if (user?.role === 'manufacturer') {
      return (
        <>
          {/* Manufacturer Dashboard */}
          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Order Value"
                value={primaryMarkets.sales.value}
                change={primaryMarkets.sales.change}
                icon={<DollarSign className="w-6 h-6 text-white" />}
                color="from-blue-500 to-blue-600"
                prefix="₹"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Order Count"
                value={primaryMarkets.orderCount.value}
                change={primaryMarkets.orderCount.change}
                icon={<ShoppingCart className="w-6 h-6 text-white" />}
                color="from-green-500 to-green-600"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Avg Order Value"
                value={primaryMarkets.avgOrderValue.value}
                change={primaryMarkets.avgOrderValue.change}
                icon={<Target className="w-6 h-6 text-white" />}
                color="from-purple-500 to-purple-600"
                prefix="₹"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Unique Outlets"
                value={primaryMarkets.uniqueOutlets.value}
                change={primaryMarkets.uniqueOutlets.change}
                icon={<Package className="w-6 h-6 text-white" />}
                color="from-orange-500 to-orange-600"
              />
            </Col>
          </Row>

          {/* Financials Section for Manufacturer */}
          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Receivables"
                value={financialData.receivables.value}
                change={financialData.receivables.change}
                icon={<ArrowUp className="w-6 h-6 text-white" />}
                color="from-blue-500 to-indigo-600"
                prefix="₹"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Inventory Turnover"
                value={financialData.inventoryTurnover.value}
                change={financialData.inventoryTurnover.change}
                icon={<Activity className="w-6 h-6 text-white" />}
                color="from-teal-500 to-cyan-600"
                suffix="x"
              />
            </Col>
          </Row>

          {/* Show only Distributors and Outlets for Manufacturer */}
          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24} lg={12}>
              <DataTable
                title="Top Distributors"
                data={distributorsData}
                showTopBottom={true}
                maxRows={5}
              />
            </Col>
            <Col xs={24} lg={12}>
              <DataTable
                title="Regional Outlets"
                data={outletsData}
                showTopBottom={true}
                maxRows={5}
              />
            </Col>
          </Row>
        </>
      );
    }

    if (user?.role === 'distributor') {
      return (
        <>
          {/* Distributor Dashboard */}
          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Total Sales"
                value={secondaryMarkets.sales.value}
                change={secondaryMarkets.sales.change}
                icon={<DollarSign className="w-6 h-6 text-white" />}
                color="from-green-500 to-emerald-600"
                prefix="₹"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Order Count"
                value={secondaryMarkets.orderCount.value}
                change={secondaryMarkets.orderCount.change}
                icon={<ShoppingCart className="w-6 h-6 text-white" />}
                color="from-blue-500 to-blue-600"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Avg Order Value"
                value={secondaryMarkets.avgOrderValue.value}
                change={secondaryMarkets.avgOrderValue.change}
                icon={<Target className="w-6 h-6 text-white" />}
                color="from-purple-500 to-purple-600"
                prefix="₹"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Unique Outlets"
                value={secondaryMarkets.uniqueOutlets.value}
                change={secondaryMarkets.uniqueOutlets.change}
                icon={<Package className="w-6 h-6 text-white" />}
                color="from-orange-500 to-orange-600"
              />
            </Col>
          </Row>

          {/* Financials Section for Distributor */}
          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Receivables"
                value={financialData.receivables.value}
                change={financialData.receivables.change}
                icon={<ArrowUp className="w-6 h-6 text-white" />}
                color="from-blue-500 to-indigo-600"
                prefix="₹"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Payables"
                value={financialData.payables.value}
                change={financialData.payables.change}
                icon={<ArrowDown className="w-6 h-6 text-white" />}
                color="from-red-500 to-pink-600"
                prefix="₹"
              />
            </Col>
          </Row>

          {/* Show only Outlets for Distributor */}
          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24}>
              <DataTable
                title="Regional Outlets Performance"
                data={outletsData}
                showTopBottom={true}
                maxRows={5}
              />
            </Col>
          </Row>
        </>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('dashboard.welcome')}, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {user?.role === 'manufacturer' && t('dashboard.manufacturerTitle')}
          {user?.role === 'distributor' && t('dashboard.distributorTitle')}
          {user?.role === 'admin' && t('dashboard.adminTitle')}
        </p>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <FilterBar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          city={city}
          onCityChange={setCity}
          district={district}
          onDistrictChange={setDistrict}
          state={state}
          onStateChange={setState}
          entityType={entityType}
          onEntityTypeChange={setEntityType}
        />
      </motion.div>

      {/* Role-specific Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {renderRoleSpecificContent()}
      </motion.div>

      {/* SKU Breakdown - Available for all roles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <DataTable
          title="SKU Performance Breakdown"
          data={skuData}
          showTopBottom={true}
          maxRows={5}
        />
      </motion.div>
    </div>
  );
};

export default Dashboard;