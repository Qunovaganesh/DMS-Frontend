import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Table, Tag, Progress, InputNumber } from 'antd';
import { 
  DollarSign,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  Target,
  BarChart3,
  Activity,
  MapPin,
  Calendar,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye,
  Download,
  Receipt
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
  const [selectedManufacturer, setSelectedManufacturer] = useState('All Manufacturers');
  const [selectedDistributor, setSelectedDistributor] = useState('All Distributors');
  const [topN, setTopN] = useState(5);
  const [bottomN, setBottomN] = useState(5);

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
  const trendData = Array.from({ length: 30 }, (_, i) => ({
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
    const totalShare = data.reduce((sum, item) => sum + item.share, 0);
    const avgChange = data.reduce((sum, item) => sum + item.change, 0) / data.length;

    const columns = [
      {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank',
        width: 60,
        render: (rank: number) => (
          <div className="flex items-center justify-center">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
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
        title: 'Change % / Share %',
        dataIndex: 'change',
        key: 'change',
        width: 140,
        render: (change: number, record: any) => (
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              {change >= 0 ? (
                <ArrowUp className="w-3 h-3 text-green-500" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-500" />
              )}
              <Tag color={change >= 0 ? 'green' : 'red'} size="small">
                {change >= 0 ? '+' : ''}{change}%
              </Tag>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Share: {record.share}%
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
        change: avgChange,
        share: totalShare,
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
          rowClassName={(record) => record.isTotal ? 'bg-gray-50 dark:bg-gray-800 font-bold' : ''}
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
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="shadow-lg border-0 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  className="w-full sm:w-auto"
                  placeholder={['Start Date', 'End Date']}
                />
              </div>
              
              <Select
                value={selectedManufacturer}
                onChange={setSelectedManufacturer}
                className="w-full sm:w-48"
                placeholder="Select Manufacturer"
              >
                {manufacturersList.map(mfr => (
                  <Option key={mfr} value={mfr}>{mfr}</Option>
                ))}
              </Select>
              
              <Select
                value={selectedDistributor}
                onChange={setSelectedDistributor}
                className="w-full sm:w-48"
                placeholder="Select Distributor"
              >
                {distributorsList.map(dist => (
                  <Option key={dist} value={dist}>{dist}</Option>
                ))}
              </Select>
              
              <Select
                value={state}
                onChange={setState}
                className="w-full sm:w-32"
                placeholder="State"
              >
                <Option value="All States">All States</Option>
                <Option value="Maharashtra">Maharashtra</Option>
                <Option value="Delhi">Delhi</Option>
                <Option value="Karnataka">Karnataka</Option>
                <Option value="Tamil Nadu">Tamil Nadu</Option>
              </Select>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Top N:</span>
                <InputNumber
                  min={1}
                  max={20}
                  value={topN}
                  onChange={(value) => setTopN(value || 5)}
                  className="w-16"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Bottom N:</span>
                <InputNumber
                  min={1}
                  max={20}
                  value={bottomN}
                  onChange={(value) => setBottomN(value || 5)}
                  className="w-16"
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Role-specific Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {/* Row 1: Receivables and Payables */}
        <Row gutter={[24, 24]} className="mb-6">
          <Col xs={24} lg={12}>
            <KpiCard
              title="Receivables"
              value={financialData.receivables.value}
              change={financialData.receivables.change}
              icon={<ArrowUp className="w-6 h-6 text-white" />}
              color="from-blue-500 to-blue-600"
              prefix="₹"
            />
          </Col>
          <Col xs={24} lg={12}>
            <KpiCard
              title="Payables"
              value={financialData.payables.value}
              change={financialData.payables.change}
              icon={<ArrowDown className="w-6 h-6 text-white" />}
              color="from-red-500 to-red-600"
              prefix="₹"
            />
          </Col>
        </Row>

        {/* Row 2: Primary Market Metrics with Sparklines */}
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

        {/* Row 3: Secondary Market Metrics with Sparklines */}
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
      </motion.div>

      {/* Network Section - Available for all roles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
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
      </motion.div>

      {/* SKU Breakdown - Available for all roles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <EnhancedDataTable
          title="SKU Performance Breakdown"
          data={allSkuData}
          topN={topN}
          bottomN={bottomN}
          showTopBottom={true}
        />
      </motion.div>
    </div>
  );
};

export default Dashboard;