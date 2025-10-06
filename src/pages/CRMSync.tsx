import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Statistic, Row, Col, Timeline, Tag, Table, Tabs, Modal, Tooltip } from 'antd';
import {
  RefreshCw,
  Database,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Activity,
  Users,
  Building2,
  Copy,
  Download,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

interface SyncStatus {
  isRunning: boolean;
  progress: number;
  totalEntities: number;
  syncedEntities: number;
  lastSyncTime: string;
  status: 'idle' | 'syncing' | 'completed' | 'error';
}

interface SyncActivity {
  id: string;
  timestamp: string;
  action: string;
  entityCount: number;
  status: 'success' | 'warning' | 'error';
}

interface Manufacturer {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  syncedAt: string;
}

interface Distributor {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  territory: string;
  status: 'active' | 'inactive';
  syncedAt: string;
}

interface Duplicate {
  id: string;
  type: 'manufacturer' | 'distributor';
  name: string;
  code: string;
  existingRecord: Manufacturer | Distributor;
  newRecord: Manufacturer | Distributor;
  conflictFields: string[];
  action: 'merge' | 'skip' | 'replace';
}

interface SyncResults {
  manufacturers: Manufacturer[];
  distributors: Distributor[];
  duplicates: Duplicate[];
  summary: {
    totalProcessed: number;
    successful: number;
    duplicatesFound: number;
    errors: number;
  };
}

const CRMSync: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isRunning: false,
    progress: 0,
    totalEntities: 245,
    syncedEntities: 245,
    lastSyncTime: '2024-12-20T14:30:00Z',
    status: 'completed'
  });

  const [syncActivities, setSyncActivities] = useState<SyncActivity[]>([]);
  const [syncResults, setSyncResults] = useState<SyncResults | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedDuplicate, setSelectedDuplicate] = useState<Duplicate | null>(null);
  const [duplicateModalVisible, setDuplicateModalVisible] = useState(false);

  useEffect(() => {
    const mockActivities: SyncActivity[] = [
      {
        id: '1',
        timestamp: '2024-12-20T14:30:00Z',
        action: 'Full CRM Sync Completed',
        entityCount: 245,
        status: 'success'
      },
      {
        id: '2',
        timestamp: '2024-12-20T10:15:00Z',
        action: 'Incremental Sync - New Entities',
        entityCount: 12,
        status: 'success'
      },
      {
        id: '3',
        timestamp: '2024-12-19T16:45:00Z',
        action: 'Sync Retry - Failed Entities',
        entityCount: 3,
        status: 'warning'
      },
      {
        id: '4',
        timestamp: '2024-12-19T09:00:00Z',
        action: 'Scheduled Daily Sync',
        entityCount: 238,
        status: 'success'
      }
    ];

    setSyncActivities(mockActivities);
  }, []);

  const handleSync = () => {
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
      title: 'Start CRM Sync?',
      text: 'This will synchronize all Bizz+ entities from the CRM system.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Start Sync',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setSyncStatus(prev => ({ ...prev, isRunning: true, status: 'syncing', progress: 0 }));

        // Simulate sync progress
        const interval = setInterval(() => {
          setSyncStatus(prev => {
            const newProgress = prev.progress + 10;
            if (newProgress >= 100) {
              clearInterval(interval);
              
              // Generate mock sync results
              const mockResults: SyncResults = {
                manufacturers: [
                  {
                    id: 'MFG001',
                    name: 'ABC Manufacturing Ltd',
                    code: 'ABC001',
                    email: 'contact@abcmfg.com',
                    phone: '+91-9876543210',
                    address: 'Mumbai, Maharashtra',
                    status: 'active',
                    syncedAt: new Date().toISOString()
                  },
                  {
                    id: 'MFG002',
                    name: 'XYZ Industries',
                    code: 'XYZ001',
                    email: 'info@xyzind.com',
                    phone: '+91-8765432109',
                    address: 'Delhi, India',
                    status: 'active',
                    syncedAt: new Date().toISOString()
                  },
                  {
                    id: 'MFG003',
                    name: 'Tech Solutions Pvt Ltd',
                    code: 'TECH001',
                    email: 'support@techsol.com',
                    phone: '+91-7654321098',
                    address: 'Bangalore, Karnataka',
                    status: 'active',
                    syncedAt: new Date().toISOString()
                  }
                ],
                distributors: [
                  {
                    id: 'DIST001',
                    name: 'Regional Distributors Inc',
                    code: 'RDI001',
                    email: 'sales@regionaldist.com',
                    phone: '+91-9876543211',
                    address: 'Chennai, Tamil Nadu',
                    territory: 'South India',
                    status: 'active',
                    syncedAt: new Date().toISOString()
                  },
                  {
                    id: 'DIST002',
                    name: 'North Zone Distributors',
                    code: 'NZD001',
                    email: 'contact@northzone.com',
                    phone: '+91-8765432110',
                    address: 'Gurgaon, Haryana',
                    territory: 'North India',
                    status: 'active',
                    syncedAt: new Date().toISOString()
                  }
                ],
                duplicates: [
                  {
                    id: 'DUP001',
                    type: 'manufacturer',
                    name: 'ABC Manufacturing Ltd',
                    code: 'ABC001',
                    existingRecord: {
                      id: 'MFG001',
                      name: 'ABC Manufacturing Ltd',
                      code: 'ABC001',
                      email: 'old@abcmfg.com',
                      phone: '+91-9876543210',
                      address: 'Old Address, Mumbai',
                      status: 'active',
                      syncedAt: '2024-01-01T00:00:00Z'
                    },
                    newRecord: {
                      id: 'MFG001',
                      name: 'ABC Manufacturing Ltd',
                      code: 'ABC001',
                      email: 'contact@abcmfg.com',
                      phone: '+91-9876543210',
                      address: 'Mumbai, Maharashtra',
                      status: 'active',
                      syncedAt: new Date().toISOString()
                    },
                    conflictFields: ['email', 'address'],
                    action: 'merge'
                  }
                ],
                summary: {
                  totalProcessed: 6,
                  successful: 5,
                  duplicatesFound: 1,
                  errors: 0
                }
              };
              
              setSyncResults(mockResults);
              setShowResults(true);
              
              return {
                ...prev,
                isRunning: false,
                progress: 100,
                status: 'completed',
                syncedEntities: prev.totalEntities,
                lastSyncTime: new Date().toISOString()
              };
            }
            return { ...prev, progress: newProgress };
          });
        }, 500);

        swalWithBootstrapButtons.fire({
          icon: 'success',
          title: 'Sync Started!',
          text: 'CRM synchronization has been initiated.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'syncing': return 'text-blue-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'syncing': return RefreshCw;
      case 'error': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
          <Database className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Sync Center</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Synchronize Bizz+ entities from your CRM system</p>
      </motion.div>

      {/* Sync Status Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <Statistic
                title="Total Entities"
                value={syncStatus.totalEntities}
                prefix={<Database className="w-5 h-5 text-blue-500" />}
                valueStyle={{ color: '#1890ff', fontSize: '28px' }}
              />
              <Tag color="blue" className="mt-2">Bizz+ Only</Tag>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <Statistic
                title="Synced Entities"
                value={syncStatus.syncedEntities}
                prefix={<CheckCircle className="w-5 h-5 text-green-500" />}
                valueStyle={{ color: '#52c41a', fontSize: '28px' }}
              />
              <Tag color="green" className="mt-2">Up to Date</Tag>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <div className="flex items-center justify-center mb-2">
                {React.createElement(getStatusIcon(syncStatus.status), {
                  className: `w-5 h-5 ${getStatusColor(syncStatus.status)} ${syncStatus.status === 'syncing' ? 'animate-spin' : ''}`
                })}
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{syncStatus.status}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Status</p>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Sync Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Synchronization Control</h2>

            {syncStatus.isRunning && (
              <div className="mb-6">
                <Progress
                  percent={syncStatus.progress}
                  strokeColor={{
                    '0%': '#1890ff',
                    '100%': '#52c41a',
                  }}
                  trailColor="rgba(0,0,0,0.06)"
                  strokeWidth={8}
                  className="mb-4"
                />
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Syncing... {syncStatus.progress}% Complete
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Please wait while we sync your CRM data
                </p>
              </div>
            )}

              <div className='flex items-center justify-center'>
                
              
            <motion.div
              whileHover={{ scale: syncStatus.isRunning ? 1 : 1.05 }}
              whileTap={{ scale: syncStatus.isRunning ? 1 : 0.95 }}
          
            >
              <Button
                type="primary"
                size="large"
                icon={syncStatus.isRunning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                onClick={handleSync}
                disabled={syncStatus.isRunning}
                className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg h-14 px-8 text-lg font-semibold"
              >
                {syncStatus.isRunning ? 'Syncing...' : 'Start CRM Sync'}
              </Button>

              {!syncStatus.isRunning && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Last sync: {new Date(syncStatus.lastSyncTime).toLocaleString()}
              </p>
            )}
            </motion.div>
            &nbsp;
            &nbsp;
            <motion.div
              whileHover={{ scale: syncStatus.isRunning ? 1 : 1.05 }}
              whileTap={{ scale: syncStatus.isRunning ? 1 : 0.95 }}
            >
              <Button
                type="primary"
                size="large"
                icon={syncStatus.isRunning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                onClick={handleSync}
                disabled={syncStatus.isRunning}
                className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg h-14 px-8 text-lg font-semibold"
              >
                {syncStatus.isRunning ? 'Syncing...' : 'Start Tally Sync'}
              </Button>

              {!syncStatus.isRunning && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Last sync: {new Date(syncStatus.lastSyncTime).toLocaleString()}
              </p>
            )}
            </motion.div>
            </div>
           
          </div>
        </Card>
      </motion.div>

      {/* File Upload Section */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
              <UploadIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Upload CRM Data</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload CSV or Excel files to import CRM entities into the system
            </p>

            <div className="max-w-2xl mx-auto">
              <Upload.Dragger
                name="file"
                multiple={false}
                fileList={fileList}
                customRequest={handleFileUpload}
                onChange={handleFileChange}
                onRemove={handleFileRemove}
                accept=".csv,.xlsx,.xls"
                disabled={uploading}
                className="bg-white dark:bg-gray-800 border-2 border-dashed border-emerald-300 dark:border-emerald-600 hover:border-emerald-400 dark:hover:border-emerald-500 rounded-xl"
              >
                <div className="py-8">
                  <div className="flex justify-center mb-4">
                    {uploading ? (
                      <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin" />
                    ) : (
                      <div className="flex space-x-2">
                        <FileText className="w-8 h-8 text-emerald-500" />
                        <FileSpreadsheet className="w-8 h-8 text-emerald-500" />
                      </div>
                    )}
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {uploading ? 'Processing file...' : 'Click or drag file to this area to upload'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Support for CSV, XLS, and XLSX files. Maximum file size: 10MB
                  </p>
                </div>
              </Upload.Dragger>

              {fileList.length > 0 && (
                <div className="mt-4 text-left">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Uploaded Files:</h4>
                  <div className="space-y-2">
                    {fileList.map((file) => (
                      <div key={file.uid} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          {file.name?.endsWith('.csv') ? (
                            <FileText className="w-5 h-5 text-blue-500" />
                          ) : (
                            <FileSpreadsheet className="w-5 h-5 text-green-500" />
                          )}
                          <span className="text-gray-900 dark:text-white">{file.name}</span>
                          {file.status === 'done' && (
                            <Tag color="green">Uploaded</Tag>
                          )}
                          {file.status === 'uploading' && (
                            <Tag color="blue">Uploading...</Tag>
                          )}
                          {file.status === 'error' && (
                            <Tag color="red">Error</Tag>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div> */}

      {/* Sync Results Section */}
      {showResults && syncResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sync Completed Successfully!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {syncResults.summary.successful} entities synced • {syncResults.summary.duplicatesFound} duplicates found
              </p>
            </div>

            {/* Summary Stats */}
            <Row gutter={[16, 16]} className="mb-6">
              <Col xs={12} sm={6}>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="text-2xl font-bold text-blue-600">{syncResults.summary.totalProcessed}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Processed</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="text-2xl font-bold text-green-600">{syncResults.summary.successful}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="text-2xl font-bold text-orange-600">{syncResults.summary.duplicatesFound}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Duplicates</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="text-2xl font-bold text-red-600">{syncResults.summary.errors}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Errors</div>
                </div>
              </Col>
            </Row>

            {/* Sync Results Tabs */}
            <Tabs
              defaultActiveKey="manufacturers"
              items={[
                {
                  key: 'manufacturers',
                  label: (
                    <span className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4" />
                      <span>Manufacturers ({syncResults.manufacturers.length})</span>
                    </span>
                  ),
                  children: (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Synced Manufacturers</h3>
                      
                      </div>
                      <Table
                        dataSource={syncResults.manufacturers}
                        rowKey="id"
                        scroll={{ x: 800 }}
                        pagination={{ pageSize: 5, showSizeChanger: true, showQuickJumper: true }}
                        columns={[
                          {
                            title: 'Code',
                            dataIndex: 'code',
                            key: 'code',
                            width: 100,
                            render: (code) => <Tag color="blue">{code}</Tag>
                          },
                          {
                            title: 'Name',
                            dataIndex: 'name',
                            key: 'name',
                            ellipsis: true
                          },
                          {
                            title: 'Email',
                            dataIndex: 'email',
                            key: 'email',
                            ellipsis: true
                          },
                          {
                            title: 'Phone',
                            dataIndex: 'phone',
                            key: 'phone',
                            width: 130
                          },
                          {
                            title: 'Address',
                            dataIndex: 'address',
                            key: 'address',
                            ellipsis: true
                          },
                          {
                            title: 'Status',
                            dataIndex: 'status',
                            key: 'status',
                            width: 80,
                            render: (status) => (
                              <Tag color={status === 'active' ? 'green' : 'red'}>
                                {status.toUpperCase()}
                              </Tag>
                            )
                          },
                          {
                            title: 'Synced At',
                            dataIndex: 'syncedAt',
                            key: 'syncedAt',
                            width: 150,
                            render: (date) => new Date(date).toLocaleString()
                          }
                        ]}
                      />
                    </div>
                  )
                },
                {
                  key: 'distributors',
                  label: (
                    <span className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Distributors ({syncResults.distributors.length})</span>
                    </span>
                  ),
                  children: (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Synced Distributors</h3>
                        <Button 
                          type="primary" 
                          icon={<Download className="w-4 h-4" />}
                          size="small"
                          onClick={() => {
                            const dataStr = JSON.stringify(syncResults.distributors, null, 2);
                            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                            const exportFileDefaultName = 'distributors.json';
                            const linkElement = document.createElement('a');
                            linkElement.setAttribute('href', dataUri);
                            linkElement.setAttribute('download', exportFileDefaultName);
                            linkElement.click();
                          }}
                        >
                          Export
                        </Button>
                      </div>
                      <Table
                        dataSource={syncResults.distributors}
                        rowKey="id"
                        scroll={{ x: 900 }}
                        pagination={{ pageSize: 5, showSizeChanger: true, showQuickJumper: true }}
                        columns={[
                          {
                            title: 'Code',
                            dataIndex: 'code',
                            key: 'code',
                            width: 100,
                            render: (code) => <Tag color="purple">{code}</Tag>
                          },
                          {
                            title: 'Name',
                            dataIndex: 'name',
                            key: 'name',
                            ellipsis: true
                          },
                          {
                            title: 'Email',
                            dataIndex: 'email',
                            key: 'email',
                            ellipsis: true
                          },
                          {
                            title: 'Phone',
                            dataIndex: 'phone',
                            key: 'phone',
                            width: 130
                          },
                          {
                            title: 'Territory',
                            dataIndex: 'territory',
                            key: 'territory',
                            width: 120,
                            render: (territory) => <Tag color="cyan">{territory}</Tag>
                          },
                          {
                            title: 'Address',
                            dataIndex: 'address',
                            key: 'address',
                            ellipsis: true
                          },
                          {
                            title: 'Status',
                            dataIndex: 'status',
                            key: 'status',
                            width: 80,
                            render: (status) => (
                              <Tag color={status === 'active' ? 'green' : 'red'}>
                                {status.toUpperCase()}
                              </Tag>
                            )
                          },
                          {
                            title: 'Synced At',
                            dataIndex: 'syncedAt',
                            key: 'syncedAt',
                            width: 150,
                            render: (date) => new Date(date).toLocaleString()
                          }
                        ]}
                      />
                    </div>
                  )
                },
                {
                  key: 'duplicates',
                  label: (
                    <span className="flex items-center space-x-2">
                      <Copy className="w-4 h-4" />
                      <span>Duplicates ({syncResults.duplicates.length})</span>
                    </span>
                  ),
                  children: (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Duplicate Records Found</h3>
                        <Button 
                          type="primary" 
                          icon={<Download className="w-4 h-4" />}
                          size="small"
                          onClick={() => {
                            const dataStr = JSON.stringify(syncResults.duplicates, null, 2);
                            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                            const exportFileDefaultName = 'duplicates.json';
                            const linkElement = document.createElement('a');
                            linkElement.setAttribute('href', dataUri);
                            linkElement.setAttribute('download', exportFileDefaultName);
                            linkElement.click();
                          }}
                        >
                          Export
                        </Button>
                      </div>
                      <Table
                        dataSource={syncResults.duplicates}
                        rowKey="id"
                        scroll={{ x: 1000 }}
                        pagination={{ pageSize: 5, showSizeChanger: true, showQuickJumper: true }}
                        columns={[
                          {
                            title: 'Type',
                            dataIndex: 'type',
                            key: 'type',
                            width: 120,
                            render: (type) => (
                              <Tag color={type === 'manufacturer' ? 'blue' : 'purple'}>
                                {type.toUpperCase()}
                              </Tag>
                            )
                          },
                          {
                            title: 'Name',
                            dataIndex: 'name',
                            key: 'name',
                            ellipsis: true
                          },
                          {
                            title: 'Code',
                            dataIndex: 'code',
                            key: 'code',
                            width: 100,
                            render: (code) => <Tag color="orange">{code}</Tag>
                          },
                          {
                            title: 'Conflict Fields',
                            dataIndex: 'conflictFields',
                            key: 'conflictFields',
                            width: 150,
                            render: (fields) => (
                              <div className="flex flex-wrap gap-1">
                                {fields.map((field: string) => (
                                  <Tag key={field} color="red">{field}</Tag>
                                ))}\n                              </div>
                            )
                          },
                          {
                            title: 'Action',
                            dataIndex: 'action',
                            key: 'action',
                            width: 100,
                            render: (action) => (
                              <Tag color={action === 'merge' ? 'green' : action === 'skip' ? 'orange' : 'red'}>
                                {action.toUpperCase()}
                              </Tag>
                            )
                          },
                          {
                            title: 'Actions',
                            key: 'actions',
                            width: 100,
                            render: (_, record) => (
                              <Tooltip title="View Details">
                                <Button
                                  type="text"
                                  icon={<Eye className="w-4 h-4" />}
                                  onClick={() => {
                                    setSelectedDuplicate(record);
                                    setDuplicateModalVisible(true);
                                  }}
                                />
                              </Tooltip>
                            )
                          }
                        ]}
                      />
                    </div>
                  )
                }
              ]}
            />
          </Card>
        </motion.div>
      )}

      {/* Sync Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card
          title={
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-purple-500" />
              <span>Recent Sync Activity</span>
            </div>
          }
          className="shadow-lg border-0"
        >
          <Timeline>
            {syncActivities.map((activity) => (
              <Timeline.Item
                key={activity.id}
                dot={
                  activity.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : activity.status === 'warning' ? (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()} • {activity.entityCount} entities
                    </p>
                  </div>
                  <Tag color={
                    activity.status === 'success' ? 'green' :
                      activity.status === 'warning' ? 'orange' : 'red'
                  }>
                    {activity.status.toUpperCase()}
                  </Tag>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      </motion.div>

      {/* Duplicate Detail Modal */}
      <Modal
        title="Duplicate Record Details"
        open={duplicateModalVisible}
        onCancel={() => setDuplicateModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedDuplicate && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Existing Record" size="small" className="border-orange-200">
                <div className="space-y-2">
                  <div><strong>Name:</strong> {selectedDuplicate.existingRecord.name}</div>
                  <div><strong>Code:</strong> {selectedDuplicate.existingRecord.code}</div>
                  <div><strong>Email:</strong> {selectedDuplicate.existingRecord.email}</div>
                  <div><strong>Phone:</strong> {selectedDuplicate.existingRecord.phone}</div>
                  <div><strong>Address:</strong> {selectedDuplicate.existingRecord.address}</div>
                  <div><strong>Status:</strong> 
                    <Tag color={selectedDuplicate.existingRecord.status === 'active' ? 'green' : 'red'} className="ml-2">
                      {selectedDuplicate.existingRecord.status.toUpperCase()}
                    </Tag>
                  </div>
                </div>
              </Card>
              
              <Card title="New Record" size="small" className="border-green-200">
                <div className="space-y-2">
                  <div><strong>Name:</strong> {selectedDuplicate.newRecord.name}</div>
                  <div><strong>Code:</strong> {selectedDuplicate.newRecord.code}</div>
                  <div><strong>Email:</strong> {selectedDuplicate.newRecord.email}</div>
                  <div><strong>Phone:</strong> {selectedDuplicate.newRecord.phone}</div>
                  <div><strong>Address:</strong> {selectedDuplicate.newRecord.address}</div>
                  <div><strong>Status:</strong> 
                    <Tag color={selectedDuplicate.newRecord.status === 'active' ? 'green' : 'red'} className="ml-2">
                      {selectedDuplicate.newRecord.status.toUpperCase()}
                    </Tag>
                  </div>
                </div>
              </Card>
            </div>
            
            <Card title="Conflict Analysis" size="small" className="border-red-200">
              <div className="space-y-3">
                <div><strong>Conflicting Fields:</strong></div>
                <div className="flex flex-wrap gap-2">
                  {selectedDuplicate.conflictFields.map((field) => (
                    <Tag key={field} color="red">{field}</Tag>
                  ))}
                </div>
                <div><strong>Recommended Action:</strong> 
                  <Tag color={selectedDuplicate.action === 'merge' ? 'green' : selectedDuplicate.action === 'skip' ? 'orange' : 'red'} className="ml-2">
                    {selectedDuplicate.action.toUpperCase()}
                  </Tag>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CRMSync;