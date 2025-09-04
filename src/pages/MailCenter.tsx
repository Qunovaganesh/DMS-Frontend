import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Input, Select, Space, Progress, Statistic, Row, Col, Tabs } from 'antd';
import { 
  Mail, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MailData } from '../types';
import Swal from 'sweetalert2';
import { Tooltip } from 'antd';

const { Search: AntSearch } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const MailCenter: React.FC = () => {
  const [mails, setMails] = useState<MailData[]>([]);
  const [filteredData, setFilteredData] = useState<MailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const [mailStats, setMailStats] = useState({
    totalSent: 1240,
    pending: 35,
    failed: 8,
    remaining: 2760,
    successRate: 96.8,
    dailyLimit: 4000
  });

  useEffect(() => {
    // Mock data - In real app, fetch from CRM API
    const mockData: MailData[] = [
      {
        id: '1',
        recipient: 'john@techcorp.com',
        subject: 'Monthly Performance Report - December 2024',
        content: 'Dear John, Your monthly performance summary is ready for review...',
        status: 'sent',
        sentAt: '2024-12-20T10:30:00Z',
        type: 'notification'
      },
      {
        id: '2',
        recipient: 'mike@globaldist.com',
        subject: 'New Product Launch Announcement',
        content: 'Exciting news! We are launching our latest product line...',
        status: 'sent',
        sentAt: '2024-12-20T09:15:00Z',
        type: 'promotional'
      },
      {
        id: '3',
        recipient: 'emily@globalmfg.com',
        subject: 'Order Confirmation Required - Order #12345',
        content: 'Please confirm your recent order to proceed with shipment...',
        status: 'pending',
        sentAt: '2024-12-20T08:45:00Z',
        type: 'reminder'
      },
      {
        id: '4',
        recipient: 'anna@regpartners.com',
        subject: 'Territory Performance Analysis',
        content: 'Your regional performance analysis for Q4 2024...',
        status: 'sent',
        sentAt: '2024-12-19T16:20:00Z',
        type: 'notification'
      },
      {
        id: '5',
        recipient: 'contact@failedmail.com',
        subject: 'System Update Notification',
        content: 'Important system updates will be implemented...',
        status: 'failed',
        sentAt: '2024-12-19T14:10:00Z',
        type: 'notification'
      }
    ];

    setTimeout(() => {
      setMails(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = mails;

    if (searchText) {
      filtered = filtered.filter(item =>
        item.recipient.toLowerCase().includes(searchText.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    setFilteredData(filtered);
  }, [searchText, statusFilter, typeFilter, mails]);

  const handleComposeMail = () => {
    Swal.fire({
      title: 'Compose New Mail',
      html: `
        <div class="text-left space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Recipients</label>
            <select id="recipients" class="w-full p-2 border rounded" multiple>
              <option value="all_manufacturers">All Manufacturers</option>
              <option value="all_distributors">All Distributors</option>
              <option value="active_only">Active Users Only</option>
              <option value="custom">Custom Selection</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Subject</label>
            <input id="mailSubject" class="w-full p-2 border rounded" placeholder="Enter subject..." />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Message</label>
            <textarea 
              id="mailContent" 
              class="w-full p-3 border rounded-lg" 
              rows="6" 
              placeholder="Enter your message..."
            ></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Send Mail',
      confirmButtonColor: '#8b5cf6',
      width: '600px',
      preConfirm: () => {
        const subject = (document.getElementById('mailSubject') as HTMLInputElement)?.value;
        const content = (document.getElementById('mailContent') as HTMLTextAreaElement)?.value;
        if (!subject || !content) {
          Swal.showValidationMessage('Please fill in all fields');
        }
        return { subject, content };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Mail Sent Successfully!',
          text: 'Your message has been sent to the selected recipients.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const handleDelete = (mail: MailData) => {
    Swal.fire({
      title: 'Delete Mail?',
      text: `This will permanently delete the mail: "${mail.subject}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setMails(prev => prev.filter(m => m.id !== mail.id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Mail has been deleted.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const columns = [
    {
      title: 'Recipient',
      dataIndex: 'recipient',
      key: 'recipient',
      render: (email: string) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{email}</span>
        </div>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text: string) => (
        <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">{text}</p>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={
          type === 'promotional' ? 'blue' :
          type === 'notification' ? 'green' : 'orange'
        }>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = {
          sent: { color: 'green', icon: CheckCircle },
          pending: { color: 'orange', icon: Clock },
          failed: { color: 'red', icon: XCircle }
        };
        const { color, icon: Icon } = config[status as keyof typeof config];
        
        return (
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4" style={{ color: `var(--ant-color-${color})` }} />
            <Tag color={color}>{status.toUpperCase()}</Tag>
          </div>
        );
      },
    },
    {
      title: 'Sent At',
      dataIndex: 'sentAt',
      key: 'sentAt',
      render: (date: string) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(date).toLocaleDateString()}
          <br />
          {new Date(date).toLocaleTimeString()}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: MailData) => (
        <Space>
          <Tooltip title="View Content">
            <Button 
              type="text" 
              size="small" 
              icon={<Eye className="w-4 h-4" />}
              onClick={() => {
                Swal.fire({
                  title: record.subject,
                  html: `
                    <div class="text-left">
                      <p><strong>To:</strong> ${record.recipient}</p>
                      <p><strong>Type:</strong> ${record.type}</p>
                      <p><strong>Status:</strong> ${record.status}</p>
                      <hr class="my-3" />
                      <p>${record.content}</p>
                    </div>
                  `,
                  confirmButtonColor: '#1890ff'
                });
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              type="text" 
              size="small" 
              danger 
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const usagePercentage = (mailStats.totalSent / mailStats.dailyLimit) * 100;

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mail Center</h1>
          <p className="text-gray-600 dark:text-gray-400">Send communications and track mail delivery across your network.</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            type="primary" 
            size="large"
            icon={<Plus className="w-4 h-4" />}
            className="bg-gradient-to-r from-purple-500 to-pink-600 border-0 shadow-lg"
            onClick={handleComposeMail}
          >
            Compose Mail
          </Button>
        </motion.div>
      </motion.div>

      {/* Mail Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="shadow-lg border-0">
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Mails Sent Today"
                value={mailStats.totalSent}
                prefix={<Send className="w-4 h-4 text-purple-500" />}
                valueStyle={{ color: '#8b5cf6' }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Pending"
                value={mailStats.pending}
                prefix={<Clock className="w-4 h-4 text-orange-500" />}
                valueStyle={{ color: '#f59e0b' }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Failed"
                value={mailStats.failed}
                prefix={<XCircle className="w-4 h-4 text-red-500" />}
                valueStyle={{ color: '#ef4444' }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Success Rate"
                value={mailStats.successRate}
                suffix="%"
                precision={1}
                prefix={<CheckCircle className="w-4 h-4 text-green-500" />}
                valueStyle={{ color: '#10b981' }}
              />
            </Col>
          </Row>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Mail Quota</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {mailStats.totalSent} / {mailStats.dailyLimit} used
              </span>
            </div>
            <Progress 
              percent={usagePercentage} 
              strokeColor={{
                '0%': '#8b5cf6',
                '100%': '#ec4899',
              }}
              trailColor="rgba(0,0,0,0.06)"
              className="mb-2"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mailStats.remaining} mails remaining today
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Mail Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="shadow-lg border-0">
          <Tabs defaultActiveKey="all" className="custom-tabs">
            <TabPane tab="All Mails" key="all">
              {/* Filters */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <AntSearch
                      placeholder="Search mails..."
                      allowClear
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="w-full sm:w-64"
                      prefix={<Search className="w-4 h-4 text-gray-400" />}
                    />
                    <Select
                      value={statusFilter}
                      onChange={setStatusFilter}
                      className="w-full sm:w-32"
                      suffixIcon={<Filter className="w-4 h-4" />}
                    >
                      <Option value="all">All Status</Option>
                      <Option value="sent">Sent</Option>
                      <Option value="pending">Pending</Option>
                      <Option value="failed">Failed</Option>
                    </Select>
                    <Select
                      value={typeFilter}
                      onChange={setTypeFilter}
                      className="w-full sm:w-40"
                    >
                      <Option value="all">All Types</Option>
                      <Option value="promotional">Promotional</Option>
                      <Option value="notification">Notification</Option>
                      <Option value="reminder">Reminder</Option>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Total: {filteredData.length} mails</span>
                  </div>
                </div>
              </div>

              {/* Mails Table */}
              <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} mails`,
                }}
                className="custom-table"
                scroll={{ x: 800 }}
              />
            </TabPane>

            <TabPane tab="Analytics" key="analytics">
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card title="Mail Performance" className="h-full">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium">Successful Deliveries</span>
                        </div>
                        <span className="text-xl font-bold text-green-600">{mailStats.totalSent - mailStats.failed}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-orange-500" />
                          <span className="font-medium">Pending Delivery</span>
                        </div>
                        <span className="text-xl font-bold text-orange-600">{mailStats.pending}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <XCircle className="w-5 h-5 text-red-500" />
                          <span className="font-medium">Failed Deliveries</span>
                        </div>
                        <span className="text-xl font-bold text-red-600">{mailStats.failed}</span>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Usage Overview" className="h-full">
                    <div className="text-center">
                      <div className="mb-4">
                        <Progress
                          type="circle"
                          percent={usagePercentage}
                          strokeColor={{
                            '0%': '#8b5cf6',
                            '100%': '#ec4899',
                          }}
                          size={120}
                        />
                      </div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {mailStats.totalSent} / {mailStats.dailyLimit}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Daily quota used</p>
                    </div>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
};

export default MailCenter;