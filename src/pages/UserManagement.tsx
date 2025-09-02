import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Input, Select, Space, Avatar, Tooltip, Switch, Row, Col, Statistic } from 'antd';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Lock,
  Unlock
} from 'lucide-react';
import { Factory, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from '../types';
import Swal from 'sweetalert2';

const { Search: AntSearch } = Input;
const { Option } = Select;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Mock data - In real app, fetch from CRM API
    const mockData: User[] = [
      {
        id: '1',
        userId: 'mfr001',
        email: 'john@techcorp.com',
        role: 'manufacturer',
        name: 'John Smith',
        company: 'TechCorp Industries',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
        isActive: true,
        createdAt: '2024-01-15',
        lastLogin: '2024-12-20T10:30:00Z'
      },
      {
        id: '2',
        userId: 'admin001',
        email: 'admin@dms.com',
        role: 'admin',
        name: 'Sarah Johnson',
        company: 'DMS Corp',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
        isActive: true,
        createdAt: '2024-01-01',
        lastLogin: '2024-12-20T09:15:00Z'
      },
      {
        id: '3',
        userId: 'dist001',
        email: 'mike@globaldist.com',
        role: 'distributor',
        name: 'Mike Chen',
        company: 'Global Distribution',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
        isActive: true,
        createdAt: '2024-02-01',
        lastLogin: '2024-12-19T15:45:00Z'
      },
      {
        id: '4',
        userId: 'mfr002',
        email: 'emily@globalmfg.com',
        role: 'manufacturer',
        name: 'Emily Johnson',
        company: 'Global Manufacturing Ltd',
        avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
        isActive: false,
        createdAt: '2024-02-20',
        lastLogin: '2024-12-15T11:20:00Z'
      },
      {
        id: '5',
        userId: 'dist002',
        email: 'anna@regpartners.com',
        role: 'distributor',
        name: 'Anna Rodriguez',
        company: 'Regional Partners LLC',
        avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
        isActive: true,
        createdAt: '2024-02-05',
        lastLogin: '2024-12-19T13:30:00Z'
      }
    ];

    setTimeout(() => {
      setUsers(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchText) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase()) ||
        item.userId.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.company && item.company.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(item => item.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(item => item.isActive === isActive);
    }

    setFilteredData(filtered);
  }, [searchText, roleFilter, statusFilter, users]);

  const handleToggleStatus = (user: User) => {
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

    const action = user.isActive ? 'deactivate' : 'activate';
    swalWithBootstrapButtons.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User?`,
      text: `This will ${action} ${user.name}'s account.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}!`,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, isActive: !u.isActive } : u
        ));
        swalWithBootstrapButtons.fire({
          icon: 'success',
          title: `User ${action}d!`,
          text: `${user.name} has been ${action}d.`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const handleSendMail = (user: User) => {
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
      title: 'Send Mail to User',
      html: `
        <div class="text-left space-y-4 p-2">
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-600/20 p-4 rounded-xl">
            <p><strong>To:</strong> ${user.name} (${user.email})</p>
            <p><strong>Role:</strong> <span class="capitalize">${user.role}</span></p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Template</label>
            <select id="mailTemplate" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">Select Template</option>
            <option value="welcome">Welcome Message</option>
            <option value="security">Security Update</option>
            <option value="account">Account Information</option>
            <option value="custom">Custom Message</option>
          </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
            <textarea 
            id="mailContent" 
            class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
            rows="4" 
            placeholder="Enter your message..."
          ></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Send Mail',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const content = (document.getElementById('mailContent') as HTMLTextAreaElement)?.value;
        if (!content) {
          Swal.showValidationMessage('Please enter a message');
        }
        return content;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          icon: 'success',
          title: 'Mail Sent!',
          text: `Message sent to ${user.name}`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const handleDelete = (user: User) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg mr-2 transition-colors',
        cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors',
        popup: 'bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-0',
        title: 'text-gray-900 dark:text-white font-bold',
        htmlContainer: 'text-gray-700 dark:text-gray-300'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Delete User?',
      text: `This will permanently delete ${user.name} from the system. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(prev => prev.filter(u => u.id !== user.id));
        swalWithBootstrapButtons.fire({
          icon: 'success',
          title: 'User Deleted!',
          text: 'User has been permanently deleted.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const handleAddUser = () => {
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
      title: 'Add New User',
      html: `
        <div class="text-left space-y-4 p-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">User ID</label>
            <input id="newUserId" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Enter user ID..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input id="newUserName" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Enter full name..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input id="newUserEmail" type="email" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Enter email..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
            <select id="newUserRole" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Select role...</option>
              <option value="manufacturer">Manufacturer</option>
              <option value="distributor">Distributor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
            <input id="newUserCompany" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Enter company name..." />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Create User',
      cancelButtonText: 'Cancel',
      width: '500px',
      preConfirm: () => {
        const userId = (document.getElementById('newUserId') as HTMLInputElement)?.value;
        const name = (document.getElementById('newUserName') as HTMLInputElement)?.value;
        const email = (document.getElementById('newUserEmail') as HTMLInputElement)?.value;
        const role = (document.getElementById('newUserRole') as HTMLSelectElement)?.value;
        const company = (document.getElementById('newUserCompany') as HTMLInputElement)?.value;
        
        if (!userId || !name || !email || !role) {
          Swal.showValidationMessage('Please fill in all required fields');
        }
        return { userId, name, email, role, company };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newUser: User = {
          id: Date.now().toString(),
          userId: result.value.userId,
          email: result.value.email,
          role: result.value.role as 'manufacturer' | 'distributor' | 'admin',
          name: result.value.name,
          company: result.value.company,
          isActive: true,
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: undefined
        };
        
        setUsers(prev => [...prev, newUser]);
        swalWithBootstrapButtons.fire({
          icon: 'success',
          title: 'User Created!',
          text: `${newUser.name} has been added to the system.`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: User) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size={40} 
            src={record.avatar}
            style={{ backgroundColor: record.role === 'admin' ? '#ef4444' : record.role === 'manufacturer' ? '#1890ff' : '#10b981' }}
            className="flex-shrink-0"
          >
            {!record.avatar && text.charAt(0)}
          </Avatar>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{text}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{record.company || 'No company'}</p>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-xs text-gray-400 flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                {record.email}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      render: (text: string) => (
        <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
          {text}
        </code>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const config = {
          admin: { color: 'red', icon: Shield },
          manufacturer: { color: 'blue', icon: Factory },
          distributor: { color: 'green', icon: Truck }
        };
        const { color, icon: Icon } = config[role as keyof typeof config] || { color: 'default', icon: Users };
        
        return (
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4" style={{ color: `var(--ant-color-${color})` }} />
            <Tag color={color}>{role.toUpperCase()}</Tag>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: User) => (
        <div className="flex items-center space-x-2">
          <Switch
            checked={isActive}
            onChange={() => handleToggleStatus(record)}
            size="small"
          />
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date: string | undefined) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {date ? (
            <>
              {new Date(date).toLocaleDateString()}
              <br />
              {new Date(date).toLocaleTimeString()}
            </>
          ) : (
            <span className="text-gray-400">Never</span>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: User) => (
        <Space>
          <Tooltip title="View Profile">
            <Button type="text" size="small" icon={<Eye className="w-4 h-4" />} />
          </Tooltip>
          <Tooltip title="Send Mail">
            <Button 
              type="text" 
              size="small" 
              icon={<Mail className="w-4 h-4" />}
              onClick={() => handleSendMail(record)}
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button type="text" size="small" icon={<Edit className="w-4 h-4" />} />
          </Tooltip>
          <Tooltip title={record.isActive ? "Lock Account" : "Unlock Account"}>
            <Button 
              type="text" 
              size="small" 
              icon={record.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              onClick={() => handleToggleStatus(record)}
            />
          </Tooltip>
          <Tooltip title="Delete User">
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

  const roleStats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length,
    manufacturers: users.filter(u => u.role === 'manufacturer').length,
    distributors: users.filter(u => u.role === 'distributor').length
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage system users, roles, and access permissions.</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            type="primary" 
            size="large"
            icon={<UserPlus className="w-4 h-4" />}
            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg"
            onClick={handleAddUser}
          >
            Add User
          </Button>
        </motion.div>
      </motion.div>

      {/* User Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-lg border-0">
              <Statistic
                title="Total Users"
                value={roleStats.total}
                prefix={<Users className="w-4 h-4 text-blue-500" />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-lg border-0">
              <Statistic
                title="Active Users"
                value={roleStats.active}
                prefix={<Shield className="w-4 h-4 text-green-500" />}
                valueStyle={{ color: '#10b981' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-lg border-0">
              <Statistic
                title="Manufacturers"
                value={roleStats.manufacturers}
                prefix={<Factory className="w-4 h-4 text-blue-500" />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-lg border-0">
              <Statistic
                title="Distributors"
                value={roleStats.distributors}
                prefix={<Truck className="w-4 h-4 text-green-500" />}
                valueStyle={{ color: '#10b981' }}
              />
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="shadow-lg border-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <AntSearch
                placeholder="Search users..."
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full sm:w-64"
                prefix={<Search className="w-4 h-4 text-gray-400" />}
              />
              <Select
                value={roleFilter}
                onChange={setRoleFilter}
                className="w-full sm:w-40"
                suffixIcon={<Filter className="w-4 h-4" />}
              >
                <Option value="all">All Roles</Option>
                <Option value="admin">Admin</Option>
                <Option value="manufacturer">Manufacturer</Option>
                <Option value="distributor">Distributor</Option>
              </Select>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full sm:w-32"
              >
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Total: {filteredData.length} users</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card className="shadow-lg border-0">
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
            }}
            className="custom-table"
            scroll={{ x: 900 }}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default UserManagement;