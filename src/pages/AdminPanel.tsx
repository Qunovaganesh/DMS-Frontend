import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Select, Tag, Space, Tooltip, Input, DatePicker, Row, Col, Statistic, Modal } from 'antd';
import { 
  RefreshCw, 
  Mail, 
  Key, 
  CheckCircle, 
  XCircle, 
  Clock,
  Send,
  Factory,
  Truck,
  Search,
  Filter,
  Eye,
  Phone,
  MapPin,
  Building,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface EntitySyncData {
  id: string;
  companyName: string;
  syncedOn: string;
  username: string;
  password: string;
  emailSentStatus: 'sent' | 'pending' | 'failed';
  entityType: 'manufacturer' | 'distributor';
  categories: string[];
  source: 'CRM' | 'Tally Utility';
  isBizzPlus: boolean;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  district: string;
  gst: string;
}

const AdminPanel: React.FC = () => {
  const [entityFilter, setEntityFilter] = useState<'all' | 'manufacturer' | 'distributor'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'CRM' | 'Tally Utility'>('all');
  const [emailStatusFilter, setEmailStatusFilter] = useState<'all' | 'sent' | 'pending' | 'failed'>('all');
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [entities, setEntities] = useState<EntitySyncData[]>([]);
  const [filteredData, setFilteredData] = useState<EntitySyncData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - In real app, fetch from CRM API
    const mockData: EntitySyncData[] = [
      {
        id: '1',
        companyName: 'TechCorp Industries',
        syncedOn: '2024-12-20T10:30:00Z',
        username: 'mfr001',
        password: 'TechCorp@2024',
        emailSentStatus: 'sent',
        entityType: 'manufacturer',
        categories: ['Electronics', 'Software', 'Hardware'],
        source: 'CRM',
        isBizzPlus: true,
        contactPerson: 'John Smith',
        phone: '+1-555-0123',
        email: 'john@techcorp.com',
        city: 'New York',
        state: 'NY',
        district: 'Manhattan',
        gst: 'GST123456789'
      },
      {
        id: '2',
        companyName: 'Global Manufacturing Ltd',
        syncedOn: '2024-12-19T15:45:00Z',
        username: 'mfr002',
        password: 'GlobalMfg@2024',
        emailSentStatus: 'sent',
        entityType: 'manufacturer',
        categories: ['Automotive', 'Industrial'],
        source: 'Tally Utility',
        isBizzPlus: false,
        contactPerson: 'Emily Johnson',
        phone: '+1-555-0124',
        email: 'emily@globalmfg.com',
        city: 'Los Angeles',
        state: 'CA',
        district: 'Downtown',
        gst: 'GST987654321'
      },
      {
        id: '3',
        companyName: 'Innovation Works Inc',
        syncedOn: '2024-12-18T09:20:00Z',
        username: 'mfr003',
        password: 'Innovation@2024',
        emailSentStatus: 'pending',
        entityType: 'manufacturer',
        categories: ['Technology', 'Innovation', 'R&D'],
        source: 'CRM',
        isBizzPlus: true,
        contactPerson: 'Michael Chen',
        phone: '+1-555-0125',
        email: 'michael@innovworks.com',
        city: 'Chicago',
        state: 'IL',
        district: 'Loop',
        gst: 'GST456789123'
      },
      {
        id: '4',
        companyName: 'Global Distribution Network',
        syncedOn: '2024-12-20T14:15:00Z',
        username: 'dist001',
        password: 'GlobalDist@2024',
        emailSentStatus: 'sent',
        entityType: 'distributor',
        categories: ['Logistics', 'Supply Chain'],
        source: 'CRM',
        isBizzPlus: true,
        contactPerson: 'Mike Chen',
        phone: '+1-555-0200',
        email: 'mike@globaldist.com',
        city: 'Seattle',
        state: 'WA',
        district: 'Downtown',
        gst: 'GST789123456'
      },
      {
        id: '5',
        companyName: 'Regional Partners LLC',
        syncedOn: '2024-12-19T11:30:00Z',
        username: 'dist002',
        password: 'RegPartners@2024',
        emailSentStatus: 'failed',
        entityType: 'distributor',
        categories: ['Regional Distribution'],
        source: 'Tally Utility',
        isBizzPlus: false,
        contactPerson: 'Anna Rodriguez',
        phone: '+1-555-0201',
        email: 'anna@regpartners.com',
        city: 'Miami',
        state: 'FL',
        district: 'Brickell',
        gst: 'GST321654987'
      },
      {
        id: '6',
        companyName: 'Asia Pacific Distributors',
        syncedOn: '2024-12-20T08:45:00Z',
        username: 'dist003',
        password: 'AsiaPac@2024',
        emailSentStatus: 'sent',
        entityType: 'distributor',
        categories: ['International', 'Asia Pacific'],
        source: 'CRM',
        isBizzPlus: true,
        contactPerson: 'James Wilson',
        phone: '+1-555-0202',
        email: 'james@asiapac.com',
        city: 'San Francisco',
        state: 'CA',
        district: 'SOMA',
        gst: 'GST654987321'
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
        item.email.toLowerCase().includes(searchText.toLowerCase()) ||
        item.categories.some(cat => cat.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    if (entityFilter !== 'all') {
      filtered = filtered.filter(item => item.entityType === entityFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(item => item.source === sourceFilter);
    }

    if (emailStatusFilter !== 'all') {
      filtered = filtered.filter(item => item.emailSentStatus === emailStatusFilter);
    }

    if (dateRange) {
      filtered = filtered.filter(item => {
        const syncDate = dayjs(item.syncedOn);
        return syncDate.isAfter(dateRange[0]) && syncDate.isBefore(dateRange[1].add(1, 'day'));
      });
    }

    setFilteredData(filtered);
  }, [searchText, entityFilter, sourceFilter, emailStatusFilter, dateRange, entities]);

  const handleViewDetails = (entity: EntitySyncData) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors',
        popup: 'bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-0',
        title: 'text-gray-900 dark:text-white font-bold',
        htmlContainer: 'text-gray-700 dark:text-gray-300'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: `${entity.companyName} Details`,
      html: `
        <div class="space-y-6 text-left">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
              <h4 class="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
                Contact Information
              </h4>
              <p><strong>Contact Person:</strong> ${entity.contactPerson}</p>
              <p><strong>Phone:</strong> ${entity.phone}</p>
              <p><strong>Email:</strong> ${entity.email}</p>
            </div>
            
            <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
              <h4 class="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
                Location Details
              </h4>
              <p><strong>City:</strong> ${entity.city}</p>
              <p><strong>State:</strong> ${entity.state}</p>
              <p><strong>District:</strong> ${entity.district}</p>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl">
            <h4 class="font-semibold text-purple-800 dark:text-purple-300 mb-2 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
              </svg>
              Business Information
            </h4>
            <p><strong>GST Number:</strong> ${entity.gst}</p>
            <p><strong>Categories:</strong> ${entity.categories.join(', ')}</p>
            <p><strong>Source:</strong> ${entity.source}</p>
            <p><strong>Type:</strong> ${entity.isBizzPlus ? 'Bizz+' : 'Non Bizz+'}</p>
          </div>
          
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-600/20 p-4 rounded-xl">
            <h4 class="font-semibold text-gray-800 dark:text-gray-300 mb-2 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Sync Status
            </h4>
            <p><strong>Synced On:</strong> ${new Date(entity.syncedOn).toLocaleString()}</p>
            <p><strong>Email Status:</strong> <span class="px-2 py-1 rounded text-xs font-medium ${
              entity.emailSentStatus === 'sent' ? 'bg-green-100 text-green-800' :
              entity.emailSentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }">${entity.emailSentStatus.toUpperCase()}</span></p>
          </div>
        </div>
      `,
      width: '600px',
      confirmButtonText: 'Close',
      showCancelButton: false
    });
  };

  const handleRegeneratePassword = (entity: EntitySyncData) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg mr-2 transition-colors',
        cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors',
        popup: 'bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-0',
        title: 'text-gray-900 dark:text-white font-bold',
        htmlContainer: 'text-gray-700 dark:text-gray-300'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Regenerate Password?',
      text: `This will generate a new password for ${entity.companyName}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, regenerate!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const newPassword = `${entity.companyName.replace(/\s+/g, '')}@${new Date().getFullYear()}${Math.floor(Math.random() * 100)}`;
        
        setEntities(prev => prev.map(e => 
          e.id === entity.id 
            ? { ...e, password: newPassword, syncedOn: new Date().toISOString() }
            : e
        ));

        swalWithBootstrapButtons.fire({
          icon: 'success',
          title: 'Password Regenerated!',
          html: `
            <div class="text-left bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
              <p><strong>Company:</strong> ${entity.companyName}</p>
              <p><strong>New Password:</strong> <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">${newPassword}</code></p>
              <p class="text-sm text-gray-500 mt-2">Make sure to send the new credentials to the entity.</p>
            </div>
          `,
          confirmButtonText: 'Got it!'
        });
      }
    });
  };

  const handleSendEmail = (entity: EntitySyncData) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg mr-2 transition-colors',
        cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors',
        popup: 'bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-0',
        title: 'text-gray-900 dark:text-white font-bold',
        htmlContainer: 'text-gray-700 dark:text-gray-300'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Send Credentials Email',
      html: `
        <div class="text-left space-y-4">
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-600/20 p-4 rounded-xl">
            <p><strong>To:</strong> ${entity.companyName}</p>
            <p><strong>Contact:</strong> ${entity.contactPerson} (${entity.email})</p>
            <p><strong>Username:</strong> <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">${entity.username}</code></p>
            <p><strong>Password:</strong> <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">${entity.password}</code></p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Custom Message (Optional)</label>
            <textarea 
              id="emailContent" 
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
              rows="4" 
              placeholder="Add any additional message..."
            ></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Send Email',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const content = (document.getElementById('emailContent') as HTMLTextAreaElement)?.value;
        return content;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setEntities(prev => prev.map(e => 
          e.id === entity.id 
            ? { ...e, emailSentStatus: 'sent' as const }
            : e
        ));

        swalWithBootstrapButtons.fire({
          icon: 'success',
          title: 'Email Sent!',
          text: `Credentials sent to ${entity.companyName}`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text: string, record: EntitySyncData) => (
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
              <Tag size="small" color={record.isBizzPlus ? 'blue' : 'default'}>
                {record.isBizzPlus ? 'Bizz+' : 'Non Bizz+'}
              </Tag>
              <Tag size="small" color={record.source === 'CRM' ? 'green' : 'orange'}>
                {record.source}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories: string[]) => (
        <div className="space-y-1">
          {categories.slice(0, 2).map((category, index) => (
            <Tag key={index} color="purple" size="small">
              {category}
            </Tag>
          ))}
          {categories.length > 2 && (
            <Tag color="default" size="small">
              +{categories.length - 2} more
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Synced On DateTime',
      dataIndex: 'syncedOn',
      key: 'syncedOn',
      sorter: (a: EntitySyncData, b: EntitySyncData) => 
        new Date(a.syncedOn).getTime() - new Date(b.syncedOn).getTime(),
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
      title: 'Credentials (Us, Pw)',
      key: 'credentials',
      render: (record: EntitySyncData) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Us:</span>
            <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
              {record.username}
            </code>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Pw:</span>
            <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
              {record.password}
            </code>
          </div>
        </div>
      ),
    },
    {
      title: 'Email Sent Status',
      dataIndex: 'emailSentStatus',
      key: 'emailSentStatus',
      render: (status: string) => {
        const config = {
          sent: { color: 'green', icon: CheckCircle, text: 'SENT' },
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
    {
      title: 'Regenerate Pw',
      key: 'regeneratePassword',
      align: 'center' as const,
      render: (record: EntitySyncData) => (
        <Tooltip title="Regenerate Password">
          <Button
            type="text"
            icon={<Key className="w-4 h-4" />}
            onClick={() => handleRegeneratePassword(record)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          />
        </Tooltip>
      ),
    },
    {
      title: 'Shoot Email',
      key: 'sendEmail',
      align: 'center' as const,
      render: (record: EntitySyncData) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<Eye className="w-4 h-4" />}
              onClick={() => handleViewDetails(record)}
              className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            />
          </Tooltip>
          <Tooltip title="Send Credentials Email">
            <Button
              type="text"
              icon={<Send className="w-4 h-4" />}
              onClick={() => handleSendEmail(record)}
              className="text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/20"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const entityCounts = {
    manufacturers: {
      total: entities.filter(e => e.entityType === 'manufacturer').length,
      bizzPlus: entities.filter(e => e.entityType === 'manufacturer' && e.isBizzPlus).length,
      nonBizzPlus: entities.filter(e => e.entityType === 'manufacturer' && !e.isBizzPlus).length
    },
    distributors: {
      total: entities.filter(e => e.entityType === 'distributor').length,
      bizzPlus: entities.filter(e => e.entityType === 'distributor' && e.isBizzPlus).length,
      nonBizzPlus: entities.filter(e => e.entityType === 'distributor' && !e.isBizzPlus).length
    }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage entity synchronization and credentials distribution.</p>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                    <Factory className="w-5 h-5 mr-2" />
                    Manufacturers
                  </h3>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic
                        title="Total"
                        value={entityCounts.manufacturers.total}
                        valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Bizz+"
                        value={entityCounts.manufacturers.bizzPlus}
                        valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Non Bizz+"
                        value={entityCounts.manufacturers.nonBizzPlus}
                        valueStyle={{ color: '#faad14', fontSize: '20px' }}
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Distributors
                  </h3>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic
                        title="Total"
                        value={entityCounts.distributors.total}
                        valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Bizz+"
                        value={entityCounts.distributors.bizzPlus}
                        valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Non Bizz+"
                        value={entityCounts.distributors.nonBizzPlus}
                        valueStyle={{ color: '#faad14', fontSize: '20px' }}
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Entities Sync Status Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card 
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 text-blue-500" />
                <span>Entities Sync Status</span>
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
                <Button
                  icon={<RefreshCw className="w-4 h-4" />}
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => setLoading(false), 1000);
                  }}
                >
                  Refresh
                </Button>
              </div>
            </div>
          }
          className="shadow-lg border-0"
        >
          {/* Filters */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
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
              <Col xs={24} sm={12} md={6}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Source</label>
                  <Select
                    value={sourceFilter}
                    onChange={setSourceFilter}
                    className="w-full"
                  >
                    <Option value="all">All Sources</Option>
                    <Option value="CRM">CRM</Option>
                    <Option value="Tally Utility">Tally Utility</Option>
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Status</label>
                  <Select
                    value={emailStatusFilter}
                    onChange={setEmailStatusFilter}
                    className="w-full"
                  >
                    <Option value="all">All Status</Option>
                    <Option value="sent">Sent</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="failed">Failed</Option>
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
                  <RangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    className="w-full"
                    format="YYYY-MM-DD"
                  />
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
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} entities`,
            }}
            className="custom-table"
            scroll={{ x: 1000 }}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminPanel;