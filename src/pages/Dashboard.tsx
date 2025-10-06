import React, { useState } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Table, Tag, InputNumber, Tabs } from 'antd';
import {
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  Target,
  BarChart3,
  Calendar,
  Filter,
  ArrowUp,
  ArrowDown,
  Network,
  Activity,
  TrendingUp,
  Receipt,
  Factory,
  Truck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import KpiCard from '../components/Dashboard/KpiCard';
import TrendChart from '../components/Dashboard/TrendChart';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Filter states
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [state, setState] = useState('All States');
  const [city, setCity] = useState('All Cities');
  const [district, setDistrict] = useState('All Districts');
  const [selectedManufacturer, setSelectedManufacturer] = useState(
    user?.role === 'manufacturer' ? user?.companyName || 'My Company' : 'All Manufacturers'
  );
  const [selectedDistributor, setSelectedDistributor] = useState('All Distributors');
  const [topN, setTopN] = useState(5);
  const [bottomN, setBottomN] = useState(5);

  // Role-based filtering logic
  const isManufacturerView = user?.role === 'manufacturer';
  const isAdminView = user?.role === 'admin';

  // Lists for filters
  const statesList = [
    'All States', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu',
    'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh'
  ];

  const citiesList = [
    'All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur'
  ];

  const districtsList = [
    'All Districts', 'Mumbai City', 'New Delhi', 'Bangalore Urban', 'Chennai',
    'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  // Date range presets
  const getDatePreset = (preset: string): [dayjs.Dayjs, dayjs.Dayjs] => {
    const today = dayjs();
    const startOfWeek = today.startOf('week');
    const startOfMonth = today.startOf('month');
    const startOfQuarter = today.startOf('month').month(Math.floor(today.month() / 3) * 3);
    const startOfYear = today.startOf('year');

    switch (preset) {
      case 'today':
        return [today, today];
      case 'yesterday':
        return [today.subtract(1, 'day'), today.subtract(1, 'day')];
      case 'thisWeek':
        return [startOfWeek, today];
      case 'lastWeek':
        return [startOfWeek.subtract(1, 'week'), startOfWeek.subtract(1, 'day')];
      case 'thisMonth':
        return [startOfMonth, today];
      case 'lastMonth':
        return [startOfMonth.subtract(1, 'month'), startOfMonth.subtract(1, 'day')];
      case 'thisQuarter':
        return [startOfQuarter, today];
      case 'lastQuarter':
        return [startOfQuarter.subtract(3, 'month'), startOfQuarter.subtract(1, 'day')];
      case 'thisYear':
        return [startOfYear, today];
      case 'lastYear':
        return [startOfYear.subtract(1, 'year'), startOfYear.subtract(1, 'day')];
      default:
        return [today.subtract(30, 'day'), today];
    }
  };

  // Helper function to format numbers with K/M
  const formatNumber = (num: number): string => {
    if (num >= 10000000) { // 10M+
      return `₹${(num / 10000000).toFixed(1)}Cr`;
    } else if (num >= 1000000) { // 1M+
      return `₹${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 100000) { // 100K+
      return `₹${(num / 100000).toFixed(1)}L`;
    } else if (num >= 1000) { // 1K+
      return `₹${(num / 1000).toFixed(0)}K`;
    } else {
      return `₹${num.toLocaleString('hi-IN')}`;
    }
  };

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
  const trendData = Array.from({ length: 30 }, () => ({
    value: Math.floor(Math.random() * 100) + 50
  }));

  // Mock manufacturer and distributor lists
  const manufacturersList = [
    'All Manufacturers',
    'Hindustan Unilever Ltd',
    'ITC Limited',
    'Nestle India',
    'Britannia Industries',
    'Dabur India Ltd',
    'Colgate-Palmolive',
    'Marico Limited'
  ];

  const distributorsList = [
    'All Distributors',
    'Mumbai Retail Stores',
    'Delhi Supply Chain',
    'Bangalore Distribution',
    'Kolkata Partners',
    'Chennai Networks',
    'Hyderabad Hub',
    'Pune Partners'
  ];

  // Mock data for network tables
  const allManufacturersData = [
    { rank: 1, name: 'Hindustan Unilever Ltd', sales: 4500000, change: 15.2, share: 22.5 },
    { rank: 2, name: 'ITC Limited', sales: 3200000, change: 8.7, share: 16.0 },
    { rank: 3, name: 'Nestle India', sales: 2800000, change: 12.1, share: 14.0 },
    { rank: 4, name: 'Britannia Industries', sales: 2100000, change: 6.4, share: 10.5 },
    { rank: 5, name: 'Dabur India Ltd', sales: 1800000, change: 9.8, share: 9.0 },
    { rank: 6, name: 'Colgate-Palmolive', sales: 1600000, change: 7.2, share: 8.0 },
    { rank: 7, name: 'Marico Limited', sales: 1400000, change: 5.8, share: 7.0 },
    { rank: 8, name: 'Godrej Consumer', sales: 1200000, change: 4.3, share: 6.0 },
    { rank: 9, name: 'Emami Limited', sales: 1000000, change: 3.1, share: 5.0 },
    { rank: 10, name: 'Wipro Consumer', sales: 800000, change: 2.5, share: 4.0 }
  ];

  const allDistributorsData = [
    { rank: 1, name: 'Mumbai Retail Stores', sales: 2400000, change: 18.5, share: 18.0 },
    { rank: 2, name: 'Delhi Supply Chain', sales: 2100000, change: 14.2, share: 16.0 },
    { rank: 3, name: 'Bangalore Distribution', sales: 1900000, change: 11.7, share: 14.5 },
    { rank: 4, name: 'Kolkata Partners', sales: 1600000, change: 8.9, share: 12.0 },
    { rank: 5, name: 'Chennai Networks', sales: 1400000, change: 7.3, share: 10.5 },
    { rank: 6, name: 'Hyderabad Hub', sales: 1200000, change: 6.1, share: 9.0 },
    { rank: 7, name: 'Pune Partners', sales: 1000000, change: 4.8, share: 7.5 },
    { rank: 8, name: 'Ahmedabad Associates', sales: 800000, change: 3.5, share: 6.0 },
    { rank: 9, name: 'Jaipur Junction', sales: 600000, change: 2.2, share: 4.5 },
    { rank: 10, name: 'Lucknow Links', sales: 400000, change: 1.8, share: 3.0 }
  ];

  const allOutletsData = [
    { rank: 1, name: 'North India Region', sales: 3200000, change: 16.8, share: 25.0 },
    { rank: 2, name: 'West India Region', sales: 2800000, change: 13.4, share: 22.0 },
    { rank: 3, name: 'South India Region', sales: 2400000, change: 10.9, share: 19.0 },
    { rank: 4, name: 'East India Region', sales: 1800000, change: 8.2, share: 14.0 },
    { rank: 5, name: 'Central India Region', sales: 1200000, change: 5.7, share: 9.5 },
    { rank: 6, name: 'Northeast Region', sales: 800000, change: 4.2, share: 6.0 },
    { rank: 7, name: 'Coastal Region', sales: 600000, change: 3.1, share: 4.5 },
    { rank: 8, name: 'Hill Stations', sales: 400000, change: 2.3, share: 0.0 }
  ];

  const allSkuData = [
    { rank: 1, name: 'Surf Excel Detergent Powder 1kg', sales: 450000, change: 15.2, share: 15.0 },
    { rank: 2, name: 'Head & Shoulders Shampoo 400ml', sales: 320000, change: 8.7, share: 12.0 },
    { rank: 3, name: 'Taj Mahal Tea Bags 100pcs', sales: 280000, change: 12.1, share: 10.5 },
    { rank: 4, name: 'Fortune Sunflower Oil 1L', sales: 210000, change: 6.4, share: 8.5 },
    { rank: 5, name: 'Parle-G Biscuit 200g', sales: 180000, change: 9.8, share: 7.0 },
    { rank: 6, name: 'Maggi Noodles 70g', sales: 160000, change: 7.1, share: 6.5 },
    { rank: 7, name: 'Clinic Plus Shampoo 175ml', sales: 140000, change: 5.4, share: 5.5 },
    { rank: 8, name: 'Biscuit Marie Gold 120g', sales: 120000, change: 4.2, share: 4.5 },
    { rank: 9, name: 'Tata Tea Premium 500g', sales: 100000, change: 3.8, share: 3.5 },
    { rank: 10, name: 'Lux Soap 100g', sales: 80000, change: 2.9, share: 2.0 }
  ];

  // Enhanced DataTable component with total row and configurable rows
  const EnhancedDataTable: React.FC<{
    title: string;
    data: Array<{ rank: number; name: string; sales: number; change: number; share: number }>;
    topN: number;
    bottomN: number;
    showTopBottom?: boolean;
  }> = ({ title, data, topN, bottomN, showTopBottom = true }) => {
    const [showAll, setShowAll] = useState(false);
    const [showTop, setShowTop] = useState(true);

    const getDisplayData = () => {
      if (showAll) return data;
      if (!showTopBottom) return data.slice(0, topN);
      return showTop ? data.slice(0, topN) : data.slice(-bottomN);
    };

    const displayData = getDisplayData();
    const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
    const avgChange = data.reduce((sum, item) => sum + item.change, 0) / data.length;

    const columns = [
      {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank',
        width: 60,
        render: (rank: number) => (
          <div className="flex items-center justify-center">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
              }`}>
              {rank}
            </span>
          </div>
        ),
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (name: string) => (
          <span className="font-medium text-gray-900 dark:text-white">{name}</span>
        ),
      },
      {
        title: 'Sales (₹)',
        dataIndex: 'sales',
        key: 'sales',
        render: (sales: number) => (
          <span className="font-semibold">{formatNumber(sales)}</span>
        ),
      },
      {
        title: 'Change% / Share%',
        dataIndex: 'change',
        key: 'change',
        width: 140,
        render: (change: number, record: { rank: number; name: string; sales: number; change: number; share: number }) => (
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              {change >= 0 ? (
                <ArrowUp className="w-3 h-3 text-green-500" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-500" />
              )}
              <Tag color={change >= 0 ? 'green' : 'red'}>
                {change >= 0 ? '+' : ''}{change.toFixed(1)}%
              </Tag>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Share: {record.share.toFixed(1)}%
            </div>
          </div>
        ),
      },
    ];

    // Add total row to data
    const dataWithTotal = [
      ...displayData,
      {
        rank: 'Total',
        name: 'Total',
        sales: totalSales,
        change: parseFloat(avgChange.toFixed(1)),
        share: 100.0,
        isTotal: true
      }
    ];

    return (
      <Card
        title={
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">{title}</span>
            <div className="flex items-center space-x-2">
              {showTopBottom && !showAll && (
                <div className="flex items-center space-x-1">
                  <Button
                    size="small"
                    type={showTop ? 'primary' : 'default'}
                    onClick={() => setShowTop(true)}
                  >
                    Top {topN}
                  </Button>
                  <Button
                    size="small"
                    type={!showTop ? 'primary' : 'default'}
                    onClick={() => setShowTop(false)}
                  >
                    Bottom {bottomN}
                  </Button>
                </div>
              )}
              <Button
                type="text"
                size="small"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Less' : `+${data.length - (showAll ? 0 : (showTopBottom ? (showTop ? topN : bottomN) : topN))}`}
              </Button>
            </div>
          </div>
        }
        className="shadow-lg border-0"
      >
        <Table
          columns={columns}
          dataSource={dataWithTotal}
          pagination={false}
          size="small"
          rowKey={(record) => record.rank}
          className="custom-table"
          rowClassName={(record) => (record as { isTotal?: boolean }).isTotal ? 'bg-gray-50 dark:bg-gray-800 font-bold' : ''}
          scroll={{ x: 400 }}
        />
      </Card>
    );
  };
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
              <EnhancedDataTable
                title="Top Manufacturers"
                data={allManufacturersData}
                topN={topN}
                bottomN={bottomN}
                showTopBottom={true}
              />
            </Col>
            <Col xs={24} lg={8}>
              <EnhancedDataTable
                title="Top Distributors"
                data={allDistributorsData}
                topN={topN}
                bottomN={bottomN}
                showTopBottom={true}
              />
            </Col>
            <Col xs={24} lg={8}>
              <EnhancedDataTable
                title="Regional Outlets"
                data={allOutletsData}
                topN={topN}
                bottomN={bottomN}
                showTopBottom={true}
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
              <EnhancedDataTable
                title="Top Distributors"
                data={allDistributorsData}
                topN={topN}
                bottomN={bottomN}
                showTopBottom={true}
              />
            </Col>
            <Col xs={24} lg={12}>
              <EnhancedDataTable
                title="Regional Outlets"
                data={allOutletsData}
                topN={topN}
                bottomN={bottomN}
                showTopBottom={true}
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
              <EnhancedDataTable
                title="Regional Outlets Performance"
                data={allOutletsData}
                topN={topN}
                bottomN={bottomN}
                showTopBottom={true}
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

        {/* Role-based Context Indicator */}
        {isManufacturerView && (
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Factory className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Viewing data for: <strong>{selectedManufacturer}</strong>
            </span>
          </div>
        )}

        {isAdminView && (
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-sm text-green-700 dark:text-green-300 font-medium">
              Admin view: All entities and data
            </span>
          </div>
        )}
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="shadow-lg border-0 mb-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>

            {/* Filters in 2 Rows */}
            <div className="space-y-3">
              {/* First Row - Date and Entity Filters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
                <div className="col-span-1">
                  <Select
                    placeholder="Select date range"
                    onChange={(value) => setDateRange(getDatePreset(value))}
                    className="w-full"
                    allowClear
                    size="small"
                  >
                    <Option value="today">Today</Option>
                    <Option value="yesterday">Yesterday</Option>
                    <Option value="thisWeek">This Week</Option>
                    <Option value="lastWeek">Last Week</Option>
                    <Option value="thisMonth">This Month</Option>
                    <Option value="lastMonth">Last Month</Option>
                    <Option value="thisQuarter">This Quarter</Option>
                    <Option value="lastQuarter">Last Quarter</Option>
                    <Option value="thisYear">This Year</Option>
                    <Option value="lastYear">Last Year</Option>
                  </Select>
                </div>

                <div className="col-span-1">
                  <RangePicker
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
                    className="w-full"
                    placeholder={['Start Date', 'End Date']}
                    size="small"
                  />
                </div>

                {/* Manufacturer Filter - Only show for Admin, hide for Manufacturer */}
                {isAdminView && (
                  <div className="col-span-1">
                    <Select
                      value={selectedManufacturer}
                      onChange={setSelectedManufacturer}
                      className="w-full"
                      placeholder="Select Manufacturer"
                      size="small"
                    >
                      {manufacturersList.map(mfr => (
                        <Option key={mfr} value={mfr}>{mfr}</Option>
                      ))}
                    </Select>
                  </div>
                )}

                {/* Manufacturer Info Display - Show for Manufacturer */}
                {isManufacturerView && (
                  <div className="col-span-1">
                    <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm text-blue-700 dark:text-blue-300 font-medium">
                      {selectedManufacturer}
                    </div>
                  </div>
                )}

                <div className="col-span-1">
                  <Select
                    value={selectedDistributor}
                    onChange={setSelectedDistributor}
                    className="w-full"
                    placeholder="Select Distributor"
                    size="small"
                  >
                    {distributorsList.map(dist => (
                      <Option key={dist} value={dist}>{dist}</Option>
                    ))}
                  </Select>
                </div>

                <div className="col-span-1 flex items-center space-x-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Top:</span>
                  <InputNumber
                    min={1}
                    max={20}
                    value={topN}
                    onChange={(value) => setTopN(value || 5)}
                    className="w-16"
                    size="small"
                  />
                </div>
              </div>

              {/* Second Row - Location Filters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 items-end">
                <div className="col-span-1">
                  <Select
                    value={state}
                    onChange={setState}
                    className="w-full"
                    placeholder="State"
                    size="small"
                  >
                    {statesList.map(s => (
                      <Option key={s} value={s}>{s}</Option>
                    ))}
                  </Select>
                </div>

                <div className="col-span-1">
                  <Select
                    value={district}
                    onChange={setDistrict}
                    className="w-full"
                    placeholder="District"
                    size="small"
                  >
                    {districtsList.map(d => (
                      <Option key={d} value={d}>{d}</Option>
                    ))}
                  </Select>
                </div>

                <div className="col-span-1">
                  <Select
                    value={city}
                    onChange={setCity}
                    className="w-full"
                    placeholder="City"
                    size="small"
                  >
                    {citiesList.map(c => (
                      <Option key={c} value={c}>{c}</Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Bottom Row - Table Controls and Date Display */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Bottom:</span>
                  <InputNumber
                    min={1}
                    max={20}
                    value={bottomN}
                    onChange={(value) => setBottomN(value || 5)}
                    className="w-16"
                    size="small"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3 h-3 inline mr-1" />
                {dateRange ? `${dateRange[0].format('MMM DD')} - ${dateRange[1].format('MMM DD, YYYY')}` : 'All Time'}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabbed Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Tabs
          defaultActiveKey="all"
          size="large"
          className="dashboard-tabs"
          items={[
            {
              key: 'all',
              label: (
                <span className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>All</span>
                </span>
              ),
              children: (
                <div className="space-y-6">
                  {/* All Content - Financial + Market + Network + SKU */}
                  {/* Financial Metrics */}
                  <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24} lg={user?.role === 'manufacturer' ? 24 : 12}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Receivables</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                              <ArrowUp className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{financialData.receivables.value}L</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">{financialData.receivables.change}% ↑</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData} color="#3b82f6" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                    {(user?.role === 'distributor' || isAdminView) && (
                      <Col xs={24} lg={12}>
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Payables</h3>
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                <ArrowDown className="w-6 h-6 text-white" />
                              </div>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{financialData.payables.value}L</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <ArrowDown className="w-3 h-3 text-red-500" />
                                <span className="text-sm text-red-600 font-medium">{financialData.payables.change}% ↓</span>
                              </div>
                            </div>
                            <div className="h-12">
                              <TrendChart data={trendData.map(d => ({ value: d.value - 15 }))} color="#ef4444" height={48} />
                            </div>
                          </div>
                        </Card>
                      </Col>
                    )}
                  </Row>

                  {/* Market Performance */}
                  <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24} lg={6}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Primary Sales</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                              <DollarSign className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹32.6L</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">32.1% ↑</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData} color="#3b82f6" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} lg={6}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Primary Order Count</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                              <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">589</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">8.1% ↑</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData} color="#10b981" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} lg={6}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">UDB (Unique Distributor Billed)</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">795</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">9.1% ↑</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData} color="#8b5cf6" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} lg={6}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Avg Order Value</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                              <Target className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹58.3L</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowDown className="w-3 h-3 text-red-500" />
                              <span className="text-sm text-red-600 font-medium">1% ↓</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData.map(d => ({ value: d.value - 10 }))} color="#f97316" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* Secondary Market Metrics */}
                  <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24} lg={6}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Secondary Sales</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                              <DollarSign className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹23.5L</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">18.1% ↑</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData.map(d => ({ value: d.value - 20 }))} color="#14b8a6" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} lg={6}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Secondary Order Count</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                              <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">876</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">2.4% ↑</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData.map(d => ({ value: d.value + 15 }))} color="#6366f1" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} lg={6}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">UOB (Unique Outlet Billed)</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                              <Package className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">593</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">15.1% ↑</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData.map(d => ({ value: d.value + 5 }))} color="#ec4899" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} lg={6}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Avg Order Value</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                              <Target className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹69.1L</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">2.8% ↑</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData.map(d => ({ value: d.value - 5 }))} color="#f59e0b" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* Network Section */}
                  <Row gutter={[24, 24]} className="mb-6">
                    {/* Top Manufacturers - Show for Admin and Distributor */}
                    {(isAdminView || user?.role === 'distributor') && (
                      <Col xs={24} lg={user?.role === 'distributor' ? 12 : 8}>
                        <EnhancedDataTable
                          title="Top Manufacturers"
                          data={allManufacturersData}
                          topN={topN}
                          bottomN={bottomN}
                          showTopBottom={true}
                        />
                      </Col>
                    )}
                    {/* Top Distributors - Show for Admin and Manufacturer */}
                    {(isAdminView || isManufacturerView) && (
                      <Col xs={24} lg={isManufacturerView ? 12 : 8}>
                        <EnhancedDataTable
                          title="Top Distributors"
                          data={allDistributorsData}
                          topN={topN}
                          bottomN={bottomN}
                          showTopBottom={true}
                        />
                      </Col>
                    )}
                    {/* Regional Outlets - Show for all roles */}
                    <Col xs={24} lg={user?.role === 'distributor' ? 12 : (isManufacturerView ? 12 : 8)}>
                      <EnhancedDataTable
                        title="Regional Outlets"
                        data={allOutletsData}
                        topN={topN}
                        bottomN={bottomN}
                        showTopBottom={true}
                      />
                    </Col>
                  </Row>

                  {/* SKU Breakdown */}
                  <EnhancedDataTable
                    title="SKU Performance Breakdown"
                    data={allSkuData}
                    topN={topN}
                    bottomN={bottomN}
                    showTopBottom={true}
                  />
                </div>
              )
            },
            {
              key: 'financials',
              label: (
                <span className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Financials</span>
                </span>
              ),
              children: (
                <div className="space-y-6">
                  {/* Financial Metrics */}
                  <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24} lg={user?.role === 'manufacturer' ? 24 : 12}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Receivables</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                              <ArrowUp className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{financialData.receivables.value}L</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">{financialData.receivables.change}% ↑</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData} color="#3b82f6" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                    {(user?.role === 'distributor' || isAdminView) && (
                      <Col xs={24} lg={12}>
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Payables</h3>
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                <ArrowDown className="w-6 h-6 text-white" />
                              </div>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{financialData.payables.value}L</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <ArrowDown className="w-3 h-3 text-red-500" />
                                <span className="text-sm text-red-600 font-medium">{financialData.payables.change}% ↓</span>
                              </div>
                            </div>
                            <div className="h-12">
                              <TrendChart data={trendData.map(d => ({ value: d.value - 15 }))} color="#ef4444" height={48} />
                            </div>
                          </div>
                        </Card>
                      </Col>
                    )}
                  </Row>
                  {/* Market Performance */}
                  <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24} lg={6}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Primary Sales</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                              <DollarSign className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹32.6L</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">32.1% ↑</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData} color="#3b82f6" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} lg={6}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Primary Order Count</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                              <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">589</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">8.1% ↑</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData} color="#10b981" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} lg={6}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">UDB (Unique Distributor Billed)</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">795</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">9.1% ↑</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData} color="#8b5cf6" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} lg={6}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Avg Order Value</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                              <Target className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹58.3L</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowDown className="w-3 h-3 text-red-500" />
                              <span className="text-sm text-red-600 font-medium">1% ↓</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData.map(d => ({ value: d.value - 10 }))} color="#f97316" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* Secondary Market Metrics */}
                  <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24} lg={6}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Secondary Sales</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                              <DollarSign className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹23.5L</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">18.1% ↑</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData.map(d => ({ value: d.value - 20 }))} color="#14b8a6" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} lg={6}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Secondary Order Count</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                              <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">876</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">2.4% ↑</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData.map(d => ({ value: d.value + 15 }))} color="#6366f1" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} lg={6}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">UOB (Unique Outlet Billed)</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                              <Package className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">593</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">15.1% ↑</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData.map(d => ({ value: d.value + 5 }))} color="#ec4899" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} lg={6}>
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Avg Order Value</h3>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                              <Target className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹69.1L</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">2.8% ↑</span>
                            </div>
                          </div>
                          <div className="h-12">
                            <TrendChart data={trendData.map(d => ({ value: d.value - 5 }))} color="#f59e0b" height={48} />
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )
            },
            {
              key: 'network',
              label: (
                <span className="flex items-center space-x-2">
                  <Network className="w-4 h-4" />
                  <span>Network</span>
                </span>
              ),
              children: (
                <div className="space-y-6">
                  {/* Network Metrics Overview */}
                  <Row gutter={[24, 24]} className="mb-6">
                    {/* Manufacturer Metrics - Show for Admin and Distributor */}
                    {(isAdminView || user?.role === 'distributor') && (
                      <>
                        <Col xs={24} sm={12} lg={user?.role === 'distributor' ? (dateRange ? 6 : 12) : (dateRange ? 6 : 8)}>
                          <KpiCard
                            title="Total Manufacturers"
                            value={156}
                            change={12.5}
                            icon={<Factory className="w-6 h-6 text-white" />}
                            color="from-blue-500 to-blue-600"
                          />
                        </Col>
                        {(dateRange || isAdminView) && (
                          <Col xs={24} sm={12} lg={user?.role === 'distributor' ? 6 : 6}>
                            <KpiCard
                              title="New Manufacturers"
                              value={8}
                              change={25.0}
                              icon={<Factory className="w-6 h-6 text-white" />}
                              color="from-green-500 to-green-600"
                            />
                          </Col>
                        )}
                      </>
                    )}
                    {/* Distributor Metrics - Show for Admin and Manufacturer */}
                    {(isAdminView || isManufacturerView) && (
                      <>
                        <Col xs={24} sm={12} lg={isManufacturerView ? (dateRange ? 8 : 12) : (dateRange ? 6 : 8)}>
                          <KpiCard
                            title="Total Distributors"
                            value={1247}
                            change={8.3}
                            icon={<Truck className="w-6 h-6 text-white" />}
                            color="from-purple-500 to-purple-600"
                          />
                        </Col>
                        {(dateRange || isAdminView) && (
                          <Col xs={24} sm={12} lg={isManufacturerView ? 8 : 6}>
                            <KpiCard
                              title="New Distributors"
                              value={45}
                              change={15.2}
                              icon={<Truck className="w-6 h-6 text-white" />}
                              color="from-orange-500 to-orange-600"
                            />
                          </Col>
                        )}
                      </>
                    )}
                    {/* Outlet Metrics - Show for all roles */}
                    <Col xs={24} sm={12} lg={user?.role === 'distributor' ? (dateRange ? 6 : 12) : (isManufacturerView ? (dateRange ? 8 : 12) : (dateRange ? 6 : 8))}>
                      <KpiCard
                        title="Total Outlets"
                        value={8945}
                        change={6.7}
                        icon={<Package className="w-6 h-6 text-white" />}
                        color="from-teal-500 to-teal-600"
                      />
                    </Col>
                    {(dateRange || isAdminView) && (
                      <Col xs={24} sm={12} lg={user?.role === 'distributor' ? 6 : (isManufacturerView ? 8 : 6)}>
                        <KpiCard
                          title="New Outlets"
                          value={234}
                          change={18.9}
                          icon={<Package className="w-6 h-6 text-white" />}
                          color="from-pink-500 to-pink-600"
                        />
                      </Col>
                    )}
                  </Row>

                  {/* Network Data Tables */}
                  <Row gutter={[24, 24]} className="mb-6">
                    {/* Top Manufacturers - Show for Admin and Distributor */}
                    {(isAdminView || user?.role === 'distributor') && (
                      <Col xs={24} lg={user?.role === 'distributor' ? 12 : 8}>
                        <EnhancedDataTable
                          title="Top Manufacturers"
                          data={allManufacturersData}
                          topN={topN}
                          bottomN={bottomN}
                          showTopBottom={true}
                        />
                      </Col>
                    )}
                    {/* Top Distributors - Show for Admin and Manufacturer */}
                    {(isAdminView || isManufacturerView) && (
                      <Col xs={24} lg={isManufacturerView ? 12 : 8}>
                        <EnhancedDataTable
                          title="Top Distributors"
                          data={allDistributorsData}
                          topN={topN}
                          bottomN={bottomN}
                          showTopBottom={true}
                        />
                      </Col>
                    )}
                    {/* Regional Outlets - Show for all roles */}
                    <Col xs={24} lg={user?.role === 'distributor' ? 12 : (isManufacturerView ? 12 : 8)}>
                      <EnhancedDataTable
                        title="Regional Outlets"
                        data={allOutletsData}
                        topN={topN}
                        bottomN={bottomN}
                        showTopBottom={true}
                      />
                    </Col>
                  </Row>
                </div>
              )
            },
            {
              key: 'skus',
              label: (
                <span className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>SKUs</span>
                </span>
              ),
              children: (
                <div className="space-y-6">
                  {/* SKU Breakdown */}
                  <EnhancedDataTable
                    title="SKU Performance Breakdown"
                    data={allSkuData}
                    topN={topN}
                    bottomN={bottomN}
                    showTopBottom={true}
                  />
                </div>
              )
            },
            {
              key: 'transactions',
              label: (
                <span className="flex items-center space-x-2">
                  <Receipt className="w-4 h-4" />
                  <span>Transactions</span>
                </span>
              ),
              children: (
                <div className="space-y-6">
                  <Card className="shadow-lg border-0">
                    <div className="text-center py-12">
                      <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        Transactions
                      </h3>
                      <p className="text-gray-500 dark:text-gray-500">
                        Transaction data will be displayed here
                      </p>
                    </div>
                  </Card>
                </div>
              )
            }
          ]}
        />
      </motion.div>
    </div>
  );
}

export default Dashboard;