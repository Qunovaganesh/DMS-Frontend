import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Progress, Statistic, Row, Col } from 'antd';
import { 
  Factory, 
  Truck, 
  Mail, 
  TrendingUp, 
  Users, 
  DollarSign,
  Send,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardStats, Manufacturer, Distributor, MailData } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalManufacturers: 0,
    totalDistributors: 0,
    activeMails: 0,
    remainingMails: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });

  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [recentMails, setRecentMails] = useState<MailData[]>([]);

  useEffect(() => {
    // Mock data - In real app, fetch from CRM API
    const mockStats: DashboardStats = {
      totalManufacturers: 156,
      totalDistributors: 89,
      activeMails: 1240,
      remainingMails: 2760,
      totalRevenue: 2540000,
      monthlyGrowth: 12.5
    };

    const mockManufacturers: Manufacturer[] = [
      {
        id: '1',
        name: 'TechCorp Industries',
        email: 'contact@techcorp.com',
        phone: '+1-555-0123',
        company: 'TechCorp Industries',
        address: 'New York, NY',
        productsCount: 45,
        totalOrders: 234,
        revenue: 450000,
        status: 'active',
        joinedDate: '2024-01-15',
        lastActivity: '2024-12-20'
      },
      {
        id: '2',
        name: 'Global Manufacturing',
        email: 'info@globalmfg.com',
        phone: '+1-555-0124',
        company: 'Global Manufacturing Ltd',
        address: 'Los Angeles, CA',
        productsCount: 67,
        totalOrders: 189,
        revenue: 380000,
        status: 'active',
        joinedDate: '2024-02-20',
        lastActivity: '2024-12-19'
      },
      {
        id: '3',
        name: 'Innovation Works',
        email: 'hello@innovworks.com',
        phone: '+1-555-0125',
        company: 'Innovation Works Inc',
        address: 'Chicago, IL',
        productsCount: 32,
        totalOrders: 156,
        revenue: 290000,
        status: 'pending',
        joinedDate: '2024-03-10',
        lastActivity: '2024-12-18'
      }
    ];

    const mockDistributors: Distributor[] = [
      {
        id: '1',
        name: 'Global Distribution',
        email: 'sales@globaldist.com',
        phone: '+1-555-0200',
        company: 'Global Distribution Network',
        territory: 'North America',
        manufacturersCount: 25,
        totalSales: 1200000,
        commission: 8.5,
        status: 'active',
        joinedDate: '2024-01-10',
        lastActivity: '2024-12-20'
      },
      {
        id: '2',
        name: 'Regional Partners',
        email: 'contact@regpartners.com',
        phone: '+1-555-0201',
        company: 'Regional Partners LLC',
        territory: 'Europe',
        manufacturersCount: 18,
        totalSales: 890000,
        commission: 7.2,
        status: 'active',
        joinedDate: '2024-02-05',
        lastActivity: '2024-12-19'
      }
    ];

    const mockMails: MailData[] = [
      {
        id: '1',
        recipient: 'contact@techcorp.com',
        subject: 'Monthly Performance Report',
        content: 'Your monthly performance summary is ready...',
        status: 'sent',
        sentAt: '2024-12-20T10:30:00Z',
        type: 'notification'
      },
      {
        id: '2',
        recipient: 'sales@globaldist.com',
        subject: 'New Product Launch Announcement',
        content: 'Exciting news about our latest product line...',
        status: 'sent',
        sentAt: '2024-12-20T09:15:00Z',
        type: 'promotional'
      },
      {
        id: '3',
        recipient: 'info@globalmfg.com',
        subject: 'Order Confirmation Required',
        content: 'Please confirm your recent order...',
        status: 'pending',
        sentAt: '2024-12-20T08:45:00Z',
        type: 'reminder'
      }
    ];

    setStats(mockStats);
    setManufacturers(mockManufacturers);
    setDistributors(mockDistributors);
    setRecentMails(mockMails);
  }, []);

  const statCards = [
    {
      title: 'Total Manufacturers',
      value: stats.totalManufacturers,
      icon: Factory,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Total Distributors',
      value: stats.totalDistributors,
      icon: Truck,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: 'Mails Sent',
      value: stats.activeMails,
      icon: Send,
      color: 'from-purple-500 to-purple-600',
      change: '+24%'
    },
    {
      title: 'Remaining Mails',
      value: stats.remainingMails,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      change: '-5%'
    }
  ];

  const manufacturerColumns = [
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (text: string, record: Manufacturer) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Factory className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{text}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Products',
      dataIndex: 'productsCount',
      key: 'productsCount',
      align: 'center' as const,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const distributorColumns = [
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (text: string, record: Distributor) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{text}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{record.territory}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Manufacturers',
      dataIndex: 'manufacturersCount',
      key: 'manufacturersCount',
      align: 'center' as const,
    },
    {
      title: 'Total Sales',
      dataIndex: 'totalSales',
      key: 'totalSales',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your distribution network.</p>
      </motion.div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]}>
        {statCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value.toLocaleString()}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        {/* Manufacturers Table */}
        <Col xs={24} xl={12}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card 
              title={
                <div className="flex items-center space-x-2">
                  <Factory className="w-5 h-5 text-blue-500" />
                  <span>Recent Manufacturers</span>
                </div>
              }
              className="shadow-lg border-0"
            >
              <Table
                columns={manufacturerColumns}
                dataSource={manufacturers}
                pagination={false}
                size="small"
                rowKey="id"
                className="custom-table"
              />
            </Card>
          </motion.div>
        </Col>

        {/* Distributors Table */}
        <Col xs={24} xl={12}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card 
              title={
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-green-500" />
                  <span>Recent Distributors</span>
                </div>
              }
              className="shadow-lg border-0"
            >
              <Table
                columns={distributorColumns}
                dataSource={distributors}
                pagination={false}
                size="small"
                rowKey="id"
                className="custom-table"
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Mail Center Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card 
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-purple-500" />
                <span>Mail Center Activity</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Usage: </span>
                  <span className="font-medium">{((stats.activeMails / (stats.activeMails + stats.remainingMails)) * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  percent={(stats.activeMails / (stats.activeMails + stats.remainingMails)) * 100} 
                  showInfo={false}
                  strokeColor="#8b5cf6"
                  className="w-24"
                />
              </div>
            </div>
          }
          className="shadow-lg border-0"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Statistic
                title="Mails Sent Today"
                value={stats.activeMails}
                prefix={<Send className="w-4 h-4" />}
                valueStyle={{ color: '#8b5cf6' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title="Remaining Quota"
                value={stats.remainingMails}
                prefix={<Clock className="w-4 h-4" />}
                valueStyle={{ color: '#f59e0b' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title="Success Rate"
                value={96.8}
                suffix="%"
                precision={1}
                valueStyle={{ color: '#10b981' }}
              />
            </Col>
          </Row>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Mail Activity</h3>
            <div className="space-y-3">
              {recentMails.map((mail, index) => (
                <motion.div
                  key={mail.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      mail.status === 'sent' ? 'bg-green-500' : 
                      mail.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{mail.subject}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{mail.recipient}</p>
                    </div>
                  </div>
                  <Tag color={
                    mail.type === 'promotional' ? 'blue' :
                    mail.type === 'notification' ? 'green' : 'orange'
                  }>
                    {mail.type}
                  </Tag>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;