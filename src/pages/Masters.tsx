import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Input, Select, Space, Avatar, Tooltip, Switch, Row, Col, Modal, Form, InputNumber, Tabs } from 'antd';
import { 
  Database, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin,
  Factory,
  Truck,
  Package,
  Eye,
  Edit,
  Trash2,
  Save,
  X,
  Building,
  User,
  Globe,
  Calendar,
  DollarSign,
  BarChart3,
  Layers,
  Box,
  ShoppingCart,
  Tag as TagIcon,
  Hash,
  FileText,
  Image,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const { Search: AntSearch } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

// FMCG Categories
const FMCG_CATEGORIES = [
  "Beauty & Personal Care",
  "Home Care & Cleaning",
  "Food & Beverages", 
  "Health & Wellness",
  "Baby Care",
  "Pet Care",
  "Oral Care",
  "Hair Care",
  "Skin Care",
  "Household Items"
];

// Indian States
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
];

interface Manufacturer {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gst: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  categories: string[];
  establishedYear: number;
  annualTurnover: number;
  employeeCount: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastUpdated: string;
}

interface Distributor {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gst: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  territory: string[];
  categories: string[];
  warehouseCapacity: number;
  vehicleCount: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastUpdated: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  manufacturerId: string;
  manufacturerName: string;
  mrp: number;
  weight: string;
  dimensions: string;
  description: string;
  hsnCode: string;
  gstRate: number;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
  lastUpdated: string;
}

const Masters: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'entities' | 'items'>('entities');
  const [entityType, setEntityType] = useState<'manufacturers' | 'distributors'>('manufacturers');
  
  // Data states
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Mock data initialization
    const mockManufacturers: Manufacturer[] = [
      {
        id: '1',
        companyName: 'Hindustan FMCG Industries Pvt Ltd',
        contactPerson: 'Rajesh Kumar Sharma',
        email: 'rajesh@hindustanindustries.com',
        phone: '+91-98765-43210',
        gst: '27AABCH1234C1Z5',
        address: 'Plot No. 45, Industrial Area Phase-II',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        categories: ['Beauty & Personal Care', 'Home Care & Cleaning'],
        establishedYear: 1995,
        annualTurnover: 250000000,
        employeeCount: 1200,
        status: 'active',
        createdAt: '2024-01-15',
        lastUpdated: '2024-12-20'
      },
      {
        id: '2',
        companyName: 'Patanjali Ayurved Limited',
        contactPerson: 'Acharya Balkrishna',
        email: 'info@patanjali.co.in',
        phone: '+91-98765-43211',
        gst: '05AABCP1234D1Z6',
        address: 'Patanjali Food & Herbal Park, Haridwar',
        city: 'Haridwar',
        state: 'Uttarakhand',
        pincode: '249401',
        categories: ['Health & Wellness', 'Food & Beverages', 'Beauty & Personal Care'],
        establishedYear: 2006,
        annualTurnover: 500000000,
        employeeCount: 2500,
        status: 'active',
        createdAt: '2024-02-01',
        lastUpdated: '2024-12-19'
      },
      {
        id: '3',
        companyName: 'Dabur India Limited',
        contactPerson: 'Mohit Malhotra',
        email: 'contact@dabur.com',
        phone: '+91-98765-43212',
        gst: '07AABCD1234E1Z7',
        address: '8/3, Asaf Ali Road, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110002',
        categories: ['Health & Wellness', 'Hair Care', 'Oral Care'],
        establishedYear: 1884,
        annualTurnover: 1000000000,
        employeeCount: 3500,
        status: 'active',
        createdAt: '2024-01-20',
        lastUpdated: '2024-12-18'
      }
    ];

    const mockDistributors: Distributor[] = [
      {
        id: '1',
        companyName: 'Mumbai Distribution Hub Pvt Ltd',
        contactPerson: 'Amit Patel',
        email: 'amit@mumbaidist.com',
        phone: '+91-98765-54321',
        gst: '27AABCM1234F1Z8',
        address: 'Warehouse Complex, Andheri East',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400069',
        territory: ['Maharashtra', 'Goa'],
        categories: ['Beauty & Personal Care', 'Home Care & Cleaning', 'Food & Beverages'],
        warehouseCapacity: 50000,
        vehicleCount: 25,
        status: 'active',
        createdAt: '2024-02-10',
        lastUpdated: '2024-12-20'
      },
      {
        id: '2',
        companyName: 'Delhi Supply Chain Solutions',
        contactPerson: 'Priya Singh',
        email: 'priya@delhisupply.com',
        phone: '+91-98765-54322',
        gst: '07AABCD1234G1Z9',
        address: 'Sector 18, Gurgaon',
        city: 'Gurgaon',
        state: 'Haryana',
        pincode: '122001',
        territory: ['Delhi', 'Haryana', 'Punjab', 'Uttar Pradesh'],
        categories: ['Health & Wellness', 'Food & Beverages', 'Baby Care'],
        warehouseCapacity: 75000,
        vehicleCount: 40,
        status: 'active',
        createdAt: '2024-02-15',
        lastUpdated: '2024-12-19'
      },
      {
        id: '3',
        companyName: 'Bangalore Distribution Networks',
        contactPerson: 'Suresh Reddy',
        email: 'suresh@bangaloredist.com',
        phone: '+91-98765-54323',
        gst: '29AABCB1234H1Z0',
        address: 'Electronic City Phase 1',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560100',
        territory: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh'],
        categories: ['Beauty & Personal Care', 'Health & Wellness', 'Pet Care'],
        warehouseCapacity: 60000,
        vehicleCount: 30,
        status: 'active',
        createdAt: '2024-03-01',
        lastUpdated: '2024-12-18'
      }
    ];

    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Surf Excel Matic Top Load Detergent Powder',
        sku: 'SE-TL-1KG-001',
        category: 'Home Care & Cleaning',
        brand: 'Surf Excel',
        manufacturerId: '1',
        manufacturerName: 'Hindustan FMCG Industries Pvt Ltd',
        mrp: 285,
        weight: '1 kg',
        dimensions: '15cm x 10cm x 25cm',
        description: 'Advanced detergent powder for top load washing machines',
        hsnCode: '34022000',
        gstRate: 18,
        status: 'active',
        createdAt: '2024-01-20',
        lastUpdated: '2024-12-15'
      },
      {
        id: '2',
        name: 'Head & Shoulders Anti-Dandruff Shampoo',
        sku: 'HS-AD-400ML-002',
        category: 'Hair Care',
        brand: 'Head & Shoulders',
        manufacturerId: '1',
        manufacturerName: 'Hindustan FMCG Industries Pvt Ltd',
        mrp: 320,
        weight: '400 ml',
        dimensions: '6cm x 6cm x 20cm',
        description: 'Clinically proven anti-dandruff shampoo',
        hsnCode: '33051000',
        gstRate: 18,
        status: 'active',
        createdAt: '2024-01-25',
        lastUpdated: '2024-12-10'
      },
      {
        id: '3',
        name: 'Patanjali Kesh Kanti Natural Hair Cleanser',
        sku: 'PK-NH-200ML-003',
        category: 'Hair Care',
        brand: 'Patanjali',
        manufacturerId: '2',
        manufacturerName: 'Patanjali Ayurved Limited',
        mrp: 85,
        weight: '200 ml',
        dimensions: '5cm x 5cm x 15cm',
        description: 'Natural herbal hair cleanser with ayurvedic ingredients',
        hsnCode: '33051000',
        gstRate: 18,
        status: 'active',
        createdAt: '2024-02-05',
        lastUpdated: '2024-12-12'
      },
      {
        id: '4',
        name: 'Dabur Chyawanprash Awaleha',
        sku: 'DC-CH-1KG-004',
        category: 'Health & Wellness',
        brand: 'Dabur',
        manufacturerId: '3',
        manufacturerName: 'Dabur India Limited',
        mrp: 425,
        weight: '1 kg',
        dimensions: '12cm x 12cm x 15cm',
        description: 'Traditional ayurvedic immunity booster',
        hsnCode: '21069099',
        gstRate: 12,
        status: 'active',
        createdAt: '2024-02-10',
        lastUpdated: '2024-12-08'
      }
    ];

    setTimeout(() => {
      setManufacturers(mockManufacturers);
      setDistributors(mockDistributors);
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle CRUD operations
  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setIsModalVisible(true);
  };

  const handleDelete = (item: any) => {
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

    const itemName = item.companyName || item.name;
    swalWithBootstrapButtons.fire({
      title: 'Delete Confirmation',
      text: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (activeSection === 'entities') {
          if (entityType === 'manufacturers') {
            setManufacturers(prev => prev.filter(m => m.id !== item.id));
          } else {
            setDistributors(prev => prev.filter(d => d.id !== item.id));
          }
        } else {
          setProducts(prev => prev.filter(p => p.id !== item.id));
        }
        
        swalWithBootstrapButtons.fire({
          icon: 'success',
          title: 'Deleted Successfully!',
          text: `${itemName} has been removed from the system.`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const timestamp = new Date().toISOString().split('T')[0];
      
      if (editingItem) {
        // Update existing item
        const updatedItem = { ...editingItem, ...values, lastUpdated: timestamp };
        
        if (activeSection === 'entities') {
          if (entityType === 'manufacturers') {
            setManufacturers(prev => prev.map(m => m.id === editingItem.id ? updatedItem : m));
          } else {
            setDistributors(prev => prev.map(d => d.id === editingItem.id ? updatedItem : d));
          }
        } else {
          setProducts(prev => prev.map(p => p.id === editingItem.id ? updatedItem : p));
        }
      } else {
        // Create new item
        const newItem = {
          ...values,
          id: Date.now().toString(),
          createdAt: timestamp,
          lastUpdated: timestamp,
          status: 'active'
        };
        
        if (activeSection === 'entities') {
          if (entityType === 'manufacturers') {
            setManufacturers(prev => [...prev, newItem]);
          } else {
            setDistributors(prev => [...prev, newItem]);
          }
        } else {
          setProducts(prev => [...prev, newItem]);
        }
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingItem(null);
      
      Swal.fire({
        icon: 'success',
        title: editingItem ? 'Updated Successfully!' : 'Created Successfully!',
        text: `${editingItem ? 'Item has been updated' : 'New item has been added'} to the system.`,
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-0',
          title: 'text-gray-900 dark:text-white font-bold'
        }
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Filter data based on current selection
  const getFilteredData = () => {
    let data: any[] = [];
    
    if (activeSection === 'entities') {
      data = entityType === 'manufacturers' ? manufacturers : distributors;
    } else {
      data = products;
    }

    // Apply filters
    if (searchText) {
      data = data.filter(item => {
        const searchFields = activeSection === 'entities' 
          ? [item.companyName, item.contactPerson, item.email, item.city, item.state]
          : [item.name, item.sku, item.brand, item.manufacturerName];
        
        return searchFields.some(field => 
          field?.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    }

    if (statusFilter !== 'all') {
      data = data.filter(item => item.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      data = data.filter(item => {
        if (activeSection === 'entities') {
          return item.categories?.includes(categoryFilter);
        } else {
          return item.category === categoryFilter;
        }
      });
    }

    if (stateFilter !== 'all' && activeSection === 'entities') {
      data = data.filter(item => item.state === stateFilter);
    }

    return data;
  };

  // Column definitions for manufacturers
  const manufacturerColumns = [
    {
      title: 'Company Details',
      key: 'company',
      render: (record: Manufacturer) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Factory className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{record.companyName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{record.contactPerson}</p>
            <p className="text-xs text-gray-400">GST: {record.gst}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact & Location',
      key: 'contact',
      render: (record: Manufacturer) => (
        <div className="space-y-1">
          <div className="flex items-center text-xs">
            <Mail className="w-3 h-3 mr-1 text-blue-500" />
            <span className="truncate">{record.email}</span>
          </div>
          <div className="flex items-center text-xs">
            <Phone className="w-3 h-3 mr-1 text-green-500" />
            <span>{record.phone}</span>
          </div>
          <div className="flex items-center text-xs">
            <MapPin className="w-3 h-3 mr-1 text-red-500" />
            <span>{record.city}, {record.state}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Business Info',
      key: 'business',
      render: (record: Manufacturer) => (
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Turnover:</span>
            <span className="font-medium">₹{(record.annualTurnover / 10000000).toFixed(1)}Cr</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Employees:</span>
            <span className="font-medium">{record.employeeCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Since:</span>
            <span className="font-medium">{record.establishedYear}</span>
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
            <Tag key={index} color="blue" size="small" className="text-xs">
              {category}
            </Tag>
          ))}
          {categories.length > 2 && (
            <Tag color="default" size="small" className="text-xs">
              +{categories.length - 2} more
            </Tag>
          )}
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
        } className="text-xs">
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Manufacturer) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button type="text" size="small" icon={<Eye className="w-3 h-3" />} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              size="small" 
              icon={<Edit className="w-3 h-3" />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              type="text" 
              size="small" 
              danger 
              icon={<Trash2 className="w-3 h-3" />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Column definitions for distributors
  const distributorColumns = [
    {
      title: 'Company Details',
      key: 'company',
      render: (record: Distributor) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{record.companyName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{record.contactPerson}</p>
            <p className="text-xs text-gray-400">GST: {record.gst}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact & Location',
      key: 'contact',
      render: (record: Distributor) => (
        <div className="space-y-1">
          <div className="flex items-center text-xs">
            <Mail className="w-3 h-3 mr-1 text-blue-500" />
            <span className="truncate">{record.email}</span>
          </div>
          <div className="flex items-center text-xs">
            <Phone className="w-3 h-3 mr-1 text-green-500" />
            <span>{record.phone}</span>
          </div>
          <div className="flex items-center text-xs">
            <MapPin className="w-3 h-3 mr-1 text-red-500" />
            <span>{record.city}, {record.state}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Capacity & Fleet',
      key: 'capacity',
      render: (record: Distributor) => (
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Warehouse:</span>
            <span className="font-medium">{(record.warehouseCapacity / 1000).toFixed(0)}K sq.ft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Vehicles:</span>
            <span className="font-medium">{record.vehicleCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Territory:</span>
            <span className="font-medium">{record.territory.length} states</span>
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
            <Tag key={index} color="green" size="small" className="text-xs">
              {category}
            </Tag>
          ))}
          {categories.length > 2 && (
            <Tag color="default" size="small" className="text-xs">
              +{categories.length - 2} more
            </Tag>
          )}
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
        } className="text-xs">
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Distributor) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button type="text" size="small" icon={<Eye className="w-3 h-3" />} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              size="small" 
              icon={<Edit className="w-3 h-3" />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              type="text" 
              size="small" 
              danger 
              icon={<Trash2 className="w-3 h-3" />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Column definitions for products
  const productColumns = [
    {
      title: 'Product Details',
      key: 'product',
      render: (record: Product) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{record.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SKU: {record.sku}</p>
            <p className="text-xs text-gray-400">Brand: {record.brand}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturerName',
      key: 'manufacturer',
      render: (text: string) => (
        <div className="flex items-center space-x-2">
          <Factory className="w-3 h-3 text-blue-500" />
          <span className="text-sm font-medium truncate">{text}</span>
        </div>
      ),
    },
    {
      title: 'Pricing & Tax',
      key: 'pricing',
      render: (record: Product) => (
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">MRP:</span>
            <span className="font-medium">₹{record.mrp}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">GST:</span>
            <span className="font-medium">{record.gstRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">HSN:</span>
            <span className="font-medium">{record.hsnCode}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Specifications',
      key: 'specs',
      render: (record: Product) => (
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Weight:</span>
            <span className="font-medium">{record.weight}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Category:</span>
            <span className="font-medium">{record.category}</span>
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
          status === 'discontinued' ? 'red' : 'orange'
        } className="text-xs">
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Product) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button type="text" size="small" icon={<Eye className="w-3 h-3" />} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              size="small" 
              icon={<Edit className="w-3 h-3" />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              type="text" 
              size="small" 
              danger 
              icon={<Trash2 className="w-3 h-3" />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const renderEntityForm = () => {
    const isManufacturer = entityType === 'manufacturers';
    
    return (
      <Form form={form} layout="vertical" className="space-y-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="companyName"
              label="Company Name"
              rules={[{ required: true, message: 'Please enter company name' }]}
            >
              <Input placeholder="Enter company name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="contactPerson"
              label="Contact Person"
              rules={[{ required: true, message: 'Please enter contact person' }]}
            >
              <Input placeholder="Enter contact person name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter valid email' }
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input placeholder="+91-XXXXX-XXXXX" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="gst"
              label="GST Number"
              rules={[{ required: true, message: 'Please enter GST number' }]}
            >
              <Input placeholder="Enter GST number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="pincode"
              label="Pincode"
              rules={[{ required: true, message: 'Please enter pincode' }]}
            >
              <Input placeholder="Enter pincode" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please enter address' }]}
        >
          <TextArea rows={2} placeholder="Enter complete address" />
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: 'Please enter city' }]}
            >
              <Input placeholder="Enter city" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: 'Please select state' }]}
            >
              <Select placeholder="Select state" showSearch>
                {INDIAN_STATES.map(state => (
                  <Option key={state} value={state}>{state}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="categories"
          label="Categories"
          rules={[{ required: true, message: 'Please select categories' }]}
        >
          <Select mode="multiple" placeholder="Select categories" showSearch>
            {FMCG_CATEGORIES.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </Form.Item>

        {isManufacturer ? (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="establishedYear"
                label="Established Year"
                rules={[{ required: true, message: 'Please enter year' }]}
              >
                <InputNumber 
                  min={1800} 
                  max={new Date().getFullYear()} 
                  placeholder="YYYY"
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="annualTurnover"
                label="Annual Turnover (₹)"
                rules={[{ required: true, message: 'Please enter turnover' }]}
              >
                <InputNumber 
                  min={0} 
                  placeholder="Enter amount"
                  className="w-full"
                  formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="employeeCount"
                label="Employee Count"
                rules={[{ required: true, message: 'Please enter employee count' }]}
              >
                <InputNumber 
                  min={1} 
                  placeholder="Number of employees"
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>
        ) : (
          <>
            <Form.Item
              name="territory"
              label="Territory (States)"
              rules={[{ required: true, message: 'Please select territory states' }]}
            >
              <Select mode="multiple" placeholder="Select states in territory" showSearch>
                {INDIAN_STATES.map(state => (
                  <Option key={state} value={state}>{state}</Option>
                ))}
              </Select>
            </Form.Item>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="warehouseCapacity"
                  label="Warehouse Capacity (sq.ft)"
                  rules={[{ required: true, message: 'Please enter warehouse capacity' }]}
                >
                  <InputNumber 
                    min={0} 
                    placeholder="Enter capacity"
                    className="w-full"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="vehicleCount"
                  label="Vehicle Count"
                  rules={[{ required: true, message: 'Please enter vehicle count' }]}
                >
                  <InputNumber 
                    min={0} 
                    placeholder="Number of vehicles"
                    className="w-full"
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>
    );
  };

  const renderProductForm = () => (
    <Form form={form} layout="vertical" className="space-y-4">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={16}>
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: 'Please enter SKU' }]}
          >
            <Input placeholder="Enter SKU" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="brand"
            label="Brand"
            rules={[{ required: true, message: 'Please enter brand' }]}
          >
            <Input placeholder="Enter brand name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select placeholder="Select category" showSearch>
              {FMCG_CATEGORIES.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="manufacturerId"
            label="Manufacturer"
            rules={[{ required: true, message: 'Please select manufacturer' }]}
          >
            <Select placeholder="Select manufacturer" showSearch>
              {manufacturers.map(mfr => (
                <Option key={mfr.id} value={mfr.id}>{mfr.companyName}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="mrp"
            label="MRP (₹)"
            rules={[{ required: true, message: 'Please enter MRP' }]}
          >
            <InputNumber 
              min={0} 
              placeholder="Enter MRP"
              className="w-full"
              formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Form.Item
            name="weight"
            label="Weight/Volume"
            rules={[{ required: true, message: 'Please enter weight' }]}
          >
            <Input placeholder="e.g., 1 kg, 500 ml" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            name="hsnCode"
            label="HSN Code"
            rules={[{ required: true, message: 'Please enter HSN code' }]}
          >
            <Input placeholder="Enter HSN code" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            name="gstRate"
            label="GST Rate (%)"
            rules={[{ required: true, message: 'Please enter GST rate' }]}
          >
            <InputNumber 
              min={0} 
              max={28} 
              placeholder="GST %"
              className="w-full"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="dimensions"
        label="Dimensions"
      >
        <Input placeholder="e.g., 15cm x 10cm x 25cm" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
      >
        <TextArea rows={3} placeholder="Enter product description" />
      </Form.Item>
    </Form>
  );

  const filteredData = getFilteredData();

  const getStats = () => {
    if (activeSection === 'entities') {
      const data = entityType === 'manufacturers' ? manufacturers : distributors;
      return {
        total: data.length,
        active: data.filter(item => item.status === 'active').length,
        pending: data.filter(item => item.status === 'pending').length,
        inactive: data.filter(item => item.status === 'inactive').length
      };
    } else {
      return {
        total: products.length,
        active: products.filter(item => item.status === 'active').length,
        discontinued: products.filter(item => item.status === 'discontinued').length,
        inactive: products.filter(item => item.status === 'inactive').length
      };
    }
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
          <Database className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Masters Management</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Manage entities and product catalog for your FMCG distribution network</p>
      </motion.div>

      {/* Section Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="shadow-xl border-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-8 bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg">
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all cursor-pointer ${
                    activeSection === 'entities' 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveSection('entities')}
                >
                  <Building className="w-5 h-5" />
                  <span className="font-semibold">Entities</span>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all cursor-pointer ${
                    activeSection === 'items' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveSection('items')}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-semibold">Items</span>
                </motion.div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Entity Type Toggle (only for entities) */}
      <AnimatePresence mode="wait">
        {activeSection === 'entities' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg border-0">
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEntityType('manufacturers')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      entityType === 'manufacturers'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Factory className="w-4 h-4" />
                    <span className="font-medium">Manufacturers</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEntityType('distributors')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      entityType === 'distributors'
                        ? 'bg-green-500 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span className="font-medium">Distributors</span>
                  </motion.button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:shadow-xl transition-all">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total {activeSection === 'entities' ? (entityType === 'manufacturers' ? 'Manufacturers' : 'Distributors') : 'Products'}</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:shadow-xl transition-all">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 hover:shadow-xl transition-all">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {activeSection === 'items' ? stats.discontinued : stats.pending}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {activeSection === 'items' ? 'Discontinued' : 'Pending'}
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 hover:shadow-xl transition-all">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.inactive}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Inactive</div>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Filters and Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card className="shadow-lg border-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <AntSearch
                placeholder={`Search ${activeSection === 'entities' ? entityType : 'products'}...`}
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
                {activeSection === 'items' && <Option value="discontinued">Discontinued</Option>}
              </Select>
              <Select
                value={categoryFilter}
                onChange={setCategoryFilter}
                className="w-full sm:w-48"
                placeholder="Category"
              >
                <Option value="all">All Categories</Option>
                {FMCG_CATEGORIES.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
              {activeSection === 'entities' && (
                <Select
                  value={stateFilter}
                  onChange={setStateFilter}
                  className="w-full sm:w-40"
                  placeholder="State"
                >
                  <Option value="all">All States</Option>
                  {INDIAN_STATES.map(state => (
                    <Option key={state} value={state}>{state}</Option>
                  ))}
                </Select>
              )}
            </div>
            
            <div className="flex items-center justify-between lg:justify-end space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total: {filteredData.length} {activeSection === 'entities' ? entityType : 'products'}
              </span>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  type="primary" 
                  size="large"
                  icon={<Plus className="w-4 h-4" />}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0 shadow-lg"
                  onClick={handleAdd}
                >
                  Add {activeSection === 'entities' ? (entityType === 'manufacturers' ? 'Manufacturer' : 'Distributor') : 'Product'}
                </Button>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <Table
            columns={
              activeSection === 'entities' 
                ? (entityType === 'manufacturers' ? manufacturerColumns : distributorColumns)
                : productColumns
            }
            dataSource={filteredData}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              className: 'custom-pagination'
            }}
            className="custom-table"
            scroll={{ x: 1000 }}
            rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
          />
        </Card>
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            {activeSection === 'entities' ? (
              entityType === 'manufacturers' ? (
                <Factory className="w-5 h-5 text-blue-500" />
              ) : (
                <Truck className="w-5 h-5 text-green-500" />
              )
            ) : (
              <Package className="w-5 h-5 text-purple-500" />
            )}
            <span>
              {editingItem ? 'Edit' : 'Add'} {
                activeSection === 'entities' 
                  ? (entityType === 'manufacturers' ? 'Manufacturer' : 'Distributor')
                  : 'Product'
              }
            </span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingItem(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)} icon={<X className="w-4 h-4" />}>
            Cancel
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            onClick={handleSave}
            icon={<Save className="w-4 h-4" />}
            className="bg-gradient-to-r from-green-500 to-emerald-600 border-0"
          >
            {editingItem ? 'Update' : 'Create'}
          </Button>,
        ]}
        width={800}
        className="custom-modal"
      >
        {activeSection === 'entities' ? renderEntityForm() : renderProductForm()}
      </Modal>
    </div>
  );
};

export default Masters;