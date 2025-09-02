import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Select, Tag, Space, Tooltip } from 'antd';
import { 
  RefreshCw, 
  Mail, 
  Key, 
  CheckCircle, 
  XCircle, 
  Clock,
  Send,
  Factory,
  Truck
} from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const { Option } = Select;

interface EntitySyncData {
  id: string;
  companyName: string;
  syncedOn: string;
  username: string;
  password: string;
  emailSentStatus: 'sent' | 'pending' | 'failed';
  entityType: 'manufacturer' | 'distributor';
}

const AdminPanel: React.FC = () => {
  const [entityFilter, setEntityFilter] = useState<'all' | 'manufacturer' | 'distributor'>('all');
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
        entityType: 'manufacturer'
      },
      {
        id: '2',
        companyName: 'Global Manufacturing Ltd',
        syncedOn: '2024-12-19T15:45:00Z',
        username: 'mfr002',
        password: 'GlobalMfg@2024',
        emailSentStatus: 'sent',
        entityType: 'manufacturer'
      },
      {
        id: '3',
        companyName: 'Innovation Works Inc',
        syncedOn: '2024-12-18T09:20:00Z',
        username: 'mfr003',
        password: 'Innovation@2024',
        emailSentStatus: 'pending',
        entityType: 'manufacturer'
      },
      {
        id: '4',
        companyName: 'Global Distribution Network',
        syncedOn: '2024-12-20T14:15:00Z',
        username: 'dist001',
        password: 'GlobalDist@2024',
        emailSentStatus: 'sent',
        entityType: 'distributor'
      },
      {
        id: '5',
        companyName: 'Regional Partners LLC',
        syncedOn: '2024-12-19T11:30:00Z',
        username: 'dist002',
        password: 'RegPartners@2024',
        emailSentStatus: 'failed',
        entityType: 'distributor'
      },
      {
        id: '6',
        companyName: 'Asia Pacific Distributors',
        syncedOn: '2024-12-20T08:45:00Z',
        username: 'dist003',
        password: 'AsiaPac@2024',
        emailSentStatus: 'sent',
        entityType: 'distributor'
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

    if (entityFilter !== 'all') {
      filtered = filtered.filter(item => item.entityType === entityFilter);
    }

    setFilteredData(filtered);
  }, [entityFilter, entities]);

  const handleRegeneratePassword = (entity: EntitySyncData) => {
    Swal.fire({
      title: 'Regenerate Password?',
      text: `This will generate a new password for ${entity.companyName}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1890ff',
      confirmButtonText: 'Yes, regenerate!'
    }).then((result) => {
      if (result.isConfirmed) {
        const newPassword = `${entity.companyName.replace(/\s+/g, '')}@${new Date().getFullYear()}${Math.floor(Math.random() * 100)}`;
        
        setEntities(prev => prev.map(e => 
          e.id === entity.id 
            ? { ...e, password: newPassword, syncedOn: new Date().toISOString() }
            : e
        ));

        Swal.fire({
          icon: 'success',
          title: 'Password Regenerated!',
          html: `
            <div class="text-left">
              <p><strong>Company:</strong> ${entity.companyName}</p>
              <p><strong>New Password:</strong> <code>${newPassword}</code></p>
              <p class="text-sm text-gray-500 mt-2">Make sure to send the new credentials to the entity.</p>
            </div>
          `,
          confirmButtonColor: '#1890ff'
        });
      }
    });
  };

  const handleSendEmail = (entity: EntitySyncData) => {
    Swal.fire({
      title: 'Send Credentials Email',
      html: `
        <div class="text-left">
          <p><strong>To:</strong> ${entity.companyName}</p>
          <p><strong>Username:</strong> ${entity.username}</p>
          <p><strong>Password:</strong> ${entity.password}</p>
          <hr class="my-3" />
          <textarea 
            id="emailContent" 
            class="w-full p-3 border rounded-lg" 
            rows="4" 
            placeholder="Add custom message (optional)..."
          ></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Send Email',
      confirmButtonColor: '#10b981',
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

        Swal.fire({
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
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{record.entityType}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Synced On DateTime',
      dataIndex: 'syncedOn',
      key: 'syncedOn',
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
            <span className="text-xs text-gray-500">Username:</span>
            <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
              {record.username}
            </code>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Password:</span>
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
        <Tooltip title="Send Credentials Email">
          <Button
            type="text"
            icon={<Send className="w-4 h-4" />}
            onClick={() => handleSendEmail(record)}
            className="text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/20"
          />
        </Tooltip>
      ),
    },
  ];

  const entityCounts = {
    total: filteredData.length,
    manufacturers: entities.filter(e => e.entityType === 'manufacturer').length,
    distributors: entities.filter(e => e.entityType === 'distributor').length
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

      {/* Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="shadow-lg border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Entity Type
                </label>
                <Select
                  value={entityFilter}
                  onChange={setEntityFilter}
                  className="w-48"
                  size="large"
                >
                  <Option value="all">All Entities</Option>
                  <Option value="manufacturer">
                    <div className="flex items-center space-x-2">
                      <Factory className="w-4 h-4" />
                      <span>Manufacturers</span>
                    </div>
                  </Option>
                  <Option value="distributor">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4" />
                      <span>Distributors</span>
                    </div>
                  </Option>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Showing:</span> {filteredData.length} entities
                {entityFilter !== 'all' && (
                  <span className="ml-2">
                    ({entityFilter === 'manufacturer' ? entityCounts.manufacturers : entityCounts.distributors} total {entityFilter}s)
                  </span>
                )}
              </div>
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
        </Card>
      </motion.div>

      {/* Entities Sync Status Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card 
          title={
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-blue-500" />
              <span>Entities Sync Status</span>
            </div>
          }
          className="shadow-lg border-0"
        >
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
            scroll={{ x: 800 }}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminPanel;