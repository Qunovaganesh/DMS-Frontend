import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Input, Select, Space, Avatar, Tooltip } from 'antd';
import { 
  Factory, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin,
  DollarSign,
  Package,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Manufacturer } from '../types';
import Swal from 'sweetalert2';

const { Search: AntSearch } = Input;
const { Option } = Select;

const Manufacturers: React.FC = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [filteredData, setFilteredData] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Mock data - In real app, fetch from CRM API
    const mockData: Manufacturer[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@techcorp.com',
        phone: '+1-555-0123',
        company: 'TechCorp Industries',
        address: '123 Business Ave, New York, NY 10001',
        productsCount: 45,
        totalOrders: 234,
        revenue: 450000,
        status: 'active',
        joinedDate: '2024-01-15',
        lastActivity: '2024-12-20T10:30:00Z'
      },
      {
        id: '2',
        name: 'Emily Johnson',
        email: 'emily@globalmfg.com',
        phone: '+1-555-0124',
        company: 'Global Manufacturing Ltd',
        address: '456 Industrial Blvd, Los Angeles, CA 90210',
        productsCount: 67,
        totalOrders: 189,
        revenue: 380000,
        status: 'active',
        joinedDate: '2024-02-20',
        lastActivity: '2024-12-19T15:45:00Z'
      },
      {
        id: '3',
        name: 'Michael Chen',
        email: 'michael@innovworks.com',
        phone: '+1-555-0125',
        company: 'Innovation Works Inc',
        address: '789 Tech Park Dr, Chicago, IL 60601',
        productsCount: 32,
        totalOrders: 156,
        revenue: 290000,
        status: 'pending',
        joinedDate: '2024-03-10',
        lastActivity: '2024-12-18T09:20:00Z'
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah@qualitymfg.com',
        phone: '+1-555-0126',
        company: 'Quality Manufacturing',
        address: '321 Production St, Houston, TX 77001',
        productsCount: 28,
        totalOrders: 98,
        revenue: 180000,
        status: 'inactive',
        joinedDate: '2024-04-05',
        lastActivity: '2024-12-15T14:10:00Z'
      },
      {
        id: '5',
        name: 'David Brown',
        email: 'david@precisemfg.com',
        phone: '+1-555-0127',
        company: 'Precise Manufacturing',
        address: '654 Factory Rd, Detroit, MI 48201',
        productsCount: 53,
        totalOrders: 267,
        revenue: 520000,
        status: 'active',
        joinedDate: '2024-01-08',
        lastActivity: '2024-12-20T11:15:00Z'
      }
    ];

    setTimeout(() => {
      setManufacturers(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = manufacturers;

    if (searchText) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.company.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [searchText, statusFilter, manufacturers]);

  const handleSendMail = (manufacturer: Manufacturer) => {
    Swal.fire({
      title: 'Send Mail',
      html: `
        <div class="text-left">
          <p><strong>To:</strong> ${manufacturer.name} (${manufacturer.email})</p>
          <textarea 
            id="mailContent" 
            class="w-full mt-3 p-3 border rounded-lg" 
            rows="4" 
            placeholder="Enter your message..."
          ></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Send Mail',
      confirmButtonColor: '#1890ff',
      preConfirm: () => {
        const content = (document.getElementById('mailContent') as HTMLTextAreaElement)?.value;
        if (!content) {
          Swal.showValidationMessage('Please enter a message');
        }
        return content;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Mail Sent!',
          text: `Message sent to ${manufacturer.name}`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const handleDelete = (manufacturer: Manufacturer) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `This will permanently delete ${manufacturer.name} from the system.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setManufacturers(prev => prev.filter(m => m.id !== manufacturer.id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Manufacturer has been deleted.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const columns = [
    {
      title: 'Manufacturer',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Manufacturer) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size={40} 
            style={{ backgroundColor: '#1890ff' }}
            className="flex-shrink-0"
          >
            {text.charAt(0)}
          </Avatar>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{text}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{record.company}</p>
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
      title: 'Contact',
      dataIndex: 'phone',
      key: 'contact',
      render: (phone: string, record: Manufacturer) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Phone className="w-3 h-3 mr-2 text-gray-400" />
            {phone}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-3 h-3 mr-2 text-gray-400" />
            {record.address.split(',')[1]?.trim() || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (record: Manufacturer) => (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <Package className="w-3 h-3 mr-1 text-blue-500" />
              Products:
            </span>
            <span className="font-medium">{record.productsCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <DollarSign className="w-3 h-3 mr-1 text-green-500" />
              Revenue:
            </span>
            <span className="font-medium">${record.revenue.toLocaleString()}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'active' ? 'green' : 
          status === 'pending' ? 'orange' : 'red'
        }>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Manufacturer) => (
        <Space>
          <Tooltip title="View Details">
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
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<Edit className="w-4 h-4" />} />
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Manufacturers</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your manufacturing partners and their performance.</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            type="primary" 
            size="large"
            icon={<Plus className="w-4 h-4" />}
            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg"
          >
            Add Manufacturer
          </Button>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="shadow-lg border-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <AntSearch
                placeholder="Search manufacturers..."
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
                <Option value="active">Active</Option>
                <Option value="pending">Pending</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Total: {filteredData.length} manufacturers</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Manufacturers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
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
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} manufacturers`,
            }}
            className="custom-table"
            scroll={{ x: 800 }}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default Manufacturers;