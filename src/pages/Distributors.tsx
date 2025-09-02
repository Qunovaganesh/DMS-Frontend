import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Input, Select, Space, Avatar, Tooltip } from 'antd';
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin,
  DollarSign,
  Factory,
  Eye,
  Edit,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Distributor } from '../types';
import Swal from 'sweetalert2';

const { Search: AntSearch } = Input;
const { Option } = Select;

const Distributors: React.FC = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [filteredData, setFilteredData] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Mock data - In real app, fetch from CRM API
    const mockData: Distributor[] = [
      {
        id: '1',
        name: 'Mike Chen',
        email: 'mike@globaldist.com',
        phone: '+1-555-0200',
        company: 'Global Distribution Network',
        territory: 'North America',
        manufacturersCount: 25,
        totalSales: 1200000,
        commission: 8.5,
        status: 'active',
        joinedDate: '2024-01-10',
        lastActivity: '2024-12-20T14:30:00Z'
      },
      {
        id: '2',
        name: 'Anna Rodriguez',
        email: 'anna@regpartners.com',
        phone: '+1-555-0201',
        company: 'Regional Partners LLC',
        territory: 'Europe',
        manufacturersCount: 18,
        totalSales: 890000,
        commission: 7.2,
        status: 'active',
        joinedDate: '2024-02-05',
        lastActivity: '2024-12-19T16:45:00Z'
      },
      {
        id: '3',
        name: 'James Wilson',
        email: 'james@asiapac.com',
        phone: '+1-555-0202',
        company: 'Asia Pacific Distributors',
        territory: 'Asia Pacific',
        manufacturersCount: 32,
        totalSales: 1450000,
        commission: 9.1,
        status: 'active',
        joinedDate: '2024-01-20',
        lastActivity: '2024-12-20T11:20:00Z'
      },
      {
        id: '4',
        name: 'Sophie Martin',
        email: 'sophie@southamdist.com',
        phone: '+1-555-0203',
        company: 'South America Distribution',
        territory: 'South America',
        manufacturersCount: 12,
        totalSales: 340000,
        commission: 6.8,
        status: 'pending',
        joinedDate: '2024-03-15',
        lastActivity: '2024-12-18T13:10:00Z'
      },
      {
        id: '5',
        name: 'Ahmed Hassan',
        email: 'ahmed@africadist.com',
        phone: '+1-555-0204',
        company: 'Africa Distribution Hub',
        territory: 'Africa & Middle East',
        manufacturersCount: 8,
        totalSales: 180000,
        commission: 5.5,
        status: 'inactive',
        joinedDate: '2024-04-01',
        lastActivity: '2024-12-10T08:30:00Z'
      }
    ];

    setTimeout(() => {
      setDistributors(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = distributors;

    if (searchText) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.company.toLowerCase().includes(searchText.toLowerCase()) ||
        item.territory.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [searchText, statusFilter, distributors]);

  const handleSendMail = (distributor: Distributor) => {
    Swal.fire({
      title: 'Send Mail to Distributor',
      html: `
        <div class="text-left">
          <p><strong>To:</strong> ${distributor.name} (${distributor.email})</p>
          <p><strong>Territory:</strong> ${distributor.territory}</p>
          <select id="mailTemplate" class="w-full mt-3 p-2 border rounded">
            <option value="">Select Template</option>
            <option value="performance">Performance Update</option>
            <option value="territory">Territory Expansion</option>
            <option value="commission">Commission Report</option>
            <option value="custom">Custom Message</option>
          </select>
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
          text: `Message sent to ${distributor.name}`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const handleDelete = (distributor: Distributor) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `This will permanently remove ${distributor.name} from the system.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setDistributors(prev => prev.filter(d => d.id !== distributor.id));
        Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'Distributor has been removed from the system.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const columns = [
    {
      title: 'Distributor',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Distributor) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size={40} 
            style={{ backgroundColor: '#10b981' }}
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
      title: 'Territory & Contact',
      key: 'territory',
      render: (record: Distributor) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <MapPin className="w-3 h-3 mr-2 text-gray-400" />
            {record.territory}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Phone className="w-3 h-3 mr-2 text-gray-400" />
            {record.phone}
          </div>
        </div>
      ),
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (record: Distributor) => (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <Factory className="w-3 h-3 mr-1 text-blue-500" />
              Partners:
            </span>
            <span className="font-medium">{record.manufacturersCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <DollarSign className="w-3 h-3 mr-1 text-green-500" />
              Sales:
            </span>
            <span className="font-medium">${record.totalSales.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 text-purple-500" />
              Commission:
            </span>
            <span className="font-medium">{record.commission}%</span>
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
      render: (record: Distributor) => (
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
          <Tooltip title="Remove">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Distributors</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your distribution network and track performance across territories.</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            type="primary" 
            size="large"
            icon={<Plus className="w-4 h-4" />}
            className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 shadow-lg"
          >
            Add Distributor
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
                placeholder="Search distributors..."
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
              <span>Total: {filteredData.length} distributors</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Distributors Table */}
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
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} distributors`,
            }}
            className="custom-table"
            scroll={{ x: 800 }}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default Distributors;