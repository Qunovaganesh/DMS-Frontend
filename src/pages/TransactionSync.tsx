import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Tag, Input, Row, Col, DatePicker, Statistic } from 'antd';
import { 
  Activity, 
  Search, 
  Filter, 
  Factory,
  Truck,
  DollarSign,
  IndianRupee,
  CreditCard,
  Receipt,

  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;


interface TransactionSyncData {
  id: string;
  companyName: string;
  entityType: 'manufacturer' | 'distributor';
  isBizzPlus: boolean;
  syncType: 'Sales' | 'Purchase' | 'Payments' | 'Receipts';
  syncDateTime: string;
  transactionCount: number;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  contactPerson: string;
  phone: string;
  email: string;
  categories: string[];
}

const TransactionSync: React.FC = () => {
  const [entities, setEntities] = useState<TransactionSyncData[]>([]);
  const [filteredData, setFilteredData] = useState<TransactionSyncData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [entityFilter, setEntityFilter] = useState<'all' | 'manufacturer' | 'distributor'>('all');
  const [syncTypeFilter, setSyncTypeFilter] = useState<'all' | 'Sales' | 'Purchase' | 'Payments' | 'Receipts'>('all');
  const [bizzPlusFilter, setBizzPlusFilter] = useState<'all' | 'bizz+' | 'non-bizz+'>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  useEffect(() => {
    // Mock data
    const mockData: TransactionSyncData[] = [
      {
        id: '1',
        companyName: 'TechCorp Industries',
        entityType: 'manufacturer',
        isBizzPlus: true,
        syncType: 'Sales',
        syncDateTime: '2024-12-20T10:30:00Z',
        transactionCount: 45,
        amount: 125000,
        status: 'completed',
        contactPerson: 'John Smith',
        phone: '+1-555-0123',
        email: 'john@techcorp.com',
        categories: ['Food & Beverages', 'Staples & Essential Groceries']
      },
      {
        id: '2',
        companyName: 'Global Manufacturing Ltd',
        entityType: 'manufacturer',
        isBizzPlus: false,
        syncType: 'Purchase',
        syncDateTime: '2024-12-19T15:45:00Z',
        transactionCount: 32,
        amount: 89000,
        status: 'completed',
        contactPerson: 'Emily Johnson',
        phone: '+1-555-0124',
        email: 'emily@globalmfg.com',
        categories: ['Home Care', 'Personal Care']
      },
      {
        id: '3',
        companyName: 'Global Distribution Network',
        entityType: 'distributor',
        isBizzPlus: true,
        syncType: 'Payments',
        syncDateTime: '2024-12-20T14:15:00Z',
        transactionCount: 28,
        amount: 67000,
        status: 'pending',
        contactPerson: 'Mike Chen',
        phone: '+1-555-0200',
        email: 'mike@globaldist.com',
        categories: ['Food & Beverages', 'Confectionaries']
      },
      {
        id: '4',
        companyName: 'Regional Partners LLC',
        entityType: 'distributor',
        isBizzPlus: false,
        syncType: 'Receipts',
        syncDateTime: '2024-12-19T11:30:00Z',
        transactionCount: 19,
        amount: 34000,
        status: 'failed',
        contactPerson: 'Anna Rodriguez',
        phone: '+1-555-0201',
        email: 'anna@regpartners.com',
        categories: ['Baby Care', 'Pet Care']
      },
      {
        id: '5',
        companyName: 'Innovation Works Inc',
        entityType: 'manufacturer',
        isBizzPlus: true,
        syncType: 'Sales',
        syncDateTime: '2024-12-18T09:20:00Z',
        transactionCount: 56,
        amount: 156000,
        status: 'completed',
        contactPerson: 'Michael Chen',
        phone: '+1-555-0125',
        email: 'michael@innovworks.com',
        categories: ['Beauty & Cosmetics', 'Health & Wellness']
      }
    ];

    setTimeout(() => {
      setEntities(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = entities;

    if (searchText) {
      filtered = filtered.filter(item =>
        item.companyName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.contactPerson.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (entityFilter !== 'all') {
      filtered = filtered.filter(item => item.entityType === entityFilter);
    }

    if (syncTypeFilter !== 'all') {
      filtered = filtered.filter(item => item.syncType === syncTypeFilter);
    }

    if (bizzPlusFilter !== 'all') {
      const isBizzPlus = bizzPlusFilter === 'bizz+';
      filtered = filtered.filter(item => item.isBizzPlus === isBizzPlus);
    }

    if (dateRange) {
      filtered = filtered.filter(item => {
        const syncDate = dayjs(item.syncDateTime);
        return syncDate.isAfter(dateRange[0]) && syncDate.isBefore(dateRange[1].add(1, 'day'));
      });
    }

    setFilteredData(filtered);
  }, [searchText, entityFilter, syncTypeFilter, bizzPlusFilter, dateRange, entities]);

  const getSyncTypeIcon = (type: string) => {
    switch (type) {
      case 'Sales': return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'Purchase': return <ArrowDownLeft className="w-4 h-4 text-blue-500" />;
      case 'Payments': return <CreditCard className="w-4 h-4 text-purple-500" />;
      case 'Receipts': return <Receipt className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text: string, record: TransactionSyncData) => (
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            record.entityType === 'manufacturer' 
              ? 'bg-blue-100 dark:bg-blue-900' 
              : 'bg-green-100 dark:bg-green-900'
          }`}>
            {record.entityType === 'manufacturer' ? (
              <Factory className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{text}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Tag color={record.isBizzPlus ? 'blue' : 'default'}>
                {record.isBizzPlus ? 'Bizz+' : 'Non Bizz+'}
              </Tag>
              <span className="text-xs text-gray-500 capitalize">{record.entityType}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Sync Type',
      dataIndex: 'syncType',
      key: 'syncType',
      render: (type: string) => (
        <div className="flex items-center space-x-2">
          {getSyncTypeIcon(type)}
          <span className="font-medium">{type}</span>
          {/* <div className="text-xs text-gray-500">
            {record.transactionCount} txns
          </div> */}
        </div>
      ),
    },
    {
      title: 'Synced On DateTime',
      dataIndex: 'syncDateTime',
      key: 'syncDateTime',
      sorter: (a: TransactionSyncData, b: TransactionSyncData) => 
        new Date(a.syncDateTime).getTime() - new Date(b.syncDateTime).getTime(),
      render: (date: string) => (
        <div className="text-sm">
          <p className="text-gray-900 dark:text-white font-medium">
            {new Date(date).toLocaleDateString()}
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            {new Date(date).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <div className="flex items-center space-x-1">
          <IndianRupee className="w-4 h-4 text-green-500" />
          <span className="font-medium">{amount.toLocaleString()}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = {
          completed: { color: 'green', icon: CheckCircle, text: 'COMPLETED' },
          pending: { color: 'orange', icon: Clock, text: 'PENDING' },
          failed: { color: 'red', icon: XCircle, text: 'FAILED' }
        };
        const { color, icon: Icon, text } = config[status as keyof typeof config];
        
        return (
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4" style={{ color: `var(--ant-color-${color})` }} />
            <Tag color={color}>{text}</Tag>
          </div>
        );
      },
    },
  ];

  const stats = {
    totalTransactions: filteredData.reduce((sum, item) => sum + item.transactionCount, 0),
    totalAmount: filteredData.reduce((sum, item) => sum + item.amount, 0),
    bizzPlusCount: filteredData.filter(item => item.isBizzPlus).length,
    nonBizzPlusCount: filteredData.filter(item => !item.isBizzPlus).length
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Transaction Sync Status</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor transaction synchronization across all entities.</p>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <Statistic
                title="Total Transactions"
                value={stats.totalTransactions}
                prefix={<Activity className="w-4 h-4 text-blue-500" />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <Statistic
                title="Total Amount"
                value={stats.totalAmount}
                prefix={<IndianRupee className="w-4 h-4 text-green-500" />}
                valueStyle={{ color: '#52c41a' }}
                formatter={(value) => `${Number(value).toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <Statistic
                title="Bizz+ Entities"
                value={stats.bizzPlusCount}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <Statistic
                title="Non Bizz+ Entities"
                value={stats.nonBizzPlusCount}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Transaction Sync Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card 
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <span>Transaction Sync Status</span>
              </div>
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Search entities..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<Search className="w-4 h-4 text-gray-400" />}
                  className="w-64"
                  allowClear
                />
              </div>
            </div>
          }
          className="shadow-lg border-0"
        >
          {/* Filters */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={4}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Entity Type</label>
                  <Select
                    value={entityFilter}
                    onChange={setEntityFilter}
                    className="w-full"
                    suffixIcon={<Filter className="w-4 h-4" />}
                  >
                    <Option value="all">All Entities</Option>
                    <Option value="manufacturer">Manufacturers</Option>
                    <Option value="distributor">Distributors</Option>
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sync Type</label>
                  <Select
                    value={syncTypeFilter}
                    onChange={setSyncTypeFilter}
                    className="w-full"
                  >
                    <Option value="all">All Types</Option>
                    <Option value="Sales">Sales</Option>
                    <Option value="Purchase">Purchase</Option>
                    <Option value="Payments">Payments</Option>
                    <Option value="Receipts">Receipts</Option>
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bizz+ Filter</label>
                  <Select
                    value={bizzPlusFilter}
                    onChange={setBizzPlusFilter}
                    className="w-full"
                  >
                    <Option value="all">All</Option>
                    <Option value="bizz+">Bizz+ Only</Option>
                    <Option value="non-bizz+">Non Bizz+ Only</Option>
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
                  <RangePicker
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
                    className="w-full"
                    format="YYYY-MM-DD"
                  />
                </div>
              </Col>
              <Col xs={24} md={4}>
                <div className="flex items-end h-full">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Showing:</span> {filteredData.length} records
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} transactions`,
            }}
            className="custom-table"
            scroll={{ x: 1000 }}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default TransactionSync;