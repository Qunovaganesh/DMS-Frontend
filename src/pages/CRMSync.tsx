import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Statistic, Row, Col, Timeline, Tag } from 'antd';
import { 
  RefreshCw, 
  Database, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Factory,
  Truck,
  Zap,
  Activity,
  TrendingUp
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
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">CRM Sync Center</h1>
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
            </motion.div>

            {!syncStatus.isRunning && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Last sync: {new Date(syncStatus.lastSyncTime).toLocaleString()}
              </p>
            )}
          </div>
        </Card>
      </motion.div>

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
    </div>
  );
};

export default CRMSync;