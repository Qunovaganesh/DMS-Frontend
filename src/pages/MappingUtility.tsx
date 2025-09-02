import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Input, Select, Space, Switch, Row, Col, Modal, Tooltip, Divider } from 'antd';
import { 
  Map, 
  Search, 
  Filter, 
  Package,
  Factory,
  Truck,
  Plus,
  Link,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  ArrowRight,
  Users,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const { Search: AntSearch } = Input;
const { Option } = Select;

interface UnmatchedItem {
  id: string;
  itemName: string;
  itemCode: string;
  category: string;
  detectedOn: string;
  manufacturer: string;
  manufacturerId: string;
  status: 'new' | 'duplicate' | 'mapped';
  originalItemId?: string;
  originalItemName?: string;
}

interface UnmatchedDistributor {
  id: string;
  distributorName: string;
  companyName: string;
  gst: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  district: string;
  detectedOn: string;
  status: 'new' | 'duplicate' | 'mapped';
  originalDistributorId?: string;
  originalDistributorName?: string;
}

interface ManufacturerDistributorMapping {
  id: string;
  manufacturerId: string;
  manufacturerName: string;
  distributorId: string;
  distributorName: string;
  territory: string;
  mappedOn: string;
  status: 'active' | 'inactive';
}

const MappingUtility: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'items' | 'distributors'>('items');
  const [unmatchedItems, setUnmatchedItems] = useState<UnmatchedItem[]>([]);
  const [unmatchedDistributors, setUnmatchedDistributors] = useState<UnmatchedDistributor[]>([]);
  const [manufacturerMappings, setManufacturerMappings] = useState<ManufacturerDistributorMapping[]>([]);
  const [filteredItems, setFilteredItems] = useState<UnmatchedItem[]>([]);
  const [filteredDistributors, setFilteredDistributors] = useState<UnmatchedDistributor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [itemSearchText, setItemSearchText] = useState('');
  const [itemStatusFilter, setItemStatusFilter] = useState<string>('all');
  const [itemCategoryFilter, setItemCategoryFilter] = useState<string>('all');
  
  const [distributorSearchText, setDistributorSearchText] = useState('');
  const [distributorStatusFilter, setDistributorStatusFilter] = useState<string>('all');
  const [gstDuplicateFilter, setGstDuplicateFilter] = useState<boolean>(false);

  useEffect(() => {
    // Mock data for unmatched items
    const mockItems: UnmatchedItem[] = [
      {
        id: '1',
        itemName: 'Wireless Bluetooth Headphones',
        itemCode: 'WBH-001',
        category: 'Electronics',
        detectedOn: '2024-12-20T10:30:00Z',
        manufacturer: 'TechCorp Industries',
        manufacturerId: 'mfr001',
        status: 'new'
      },
      {
        id: '2',
        itemName: 'Smart Phone Case',
        itemCode: 'SPC-002',
        category: 'Accessories',
        detectedOn: '2024-12-19T15:45:00Z',
        manufacturer: 'Global Manufacturing Ltd',
        manufacturerId: 'mfr002',
        status: 'duplicate',
        originalItemId: 'item-123',
        originalItemName: 'Smartphone Protective Case'
      },
      {
        id: '3',
        itemName: 'Industrial Motor 5HP',
        itemCode: 'IM-5HP-003',
        category: 'Industrial Equipment',
        detectedOn: '2024-12-18T09:20:00Z',
        manufacturer: 'Innovation Works Inc',
        manufacturerId: 'mfr003',
        status: 'new'
      },
      {
        id: '4',
        itemName: 'LED Light Bulb 12W',
        itemCode: 'LED-12W-004',
        category: 'Lighting',
        detectedOn: '2024-12-17T14:10:00Z',
        manufacturer: 'TechCorp Industries',
        manufacturerId: 'mfr001',
        status: 'mapped'
      }
    ];

    // Mock data for unmatched distributors
    const mockDistributors: UnmatchedDistributor[] = [
      {
        id: '1',
        distributorName: 'Metro Distribution Hub',
        companyName: 'Metro Distribution Hub Pvt Ltd',
        gst: 'GST123456789',
        contactPerson: 'Robert Johnson',
        phone: '+1-555-0300',
        email: 'robert@metrodist.com',
        city: 'New York',
        state: 'NY',
        district: 'Manhattan',
        detectedOn: '2024-12-20T11:15:00Z',
        status: 'new'
      },
      {
        id: '2',
        distributorName: 'Global Dist Network',
        companyName: 'Global Distribution Network LLC',
        gst: 'GST789123456',
        contactPerson: 'Mike Chen',
        phone: '+1-555-0200',
        email: 'mike@globaldist.com',
        city: 'Seattle',
        state: 'WA',
        district: 'Downtown',
        detectedOn: '2024-12-19T16:30:00Z',
        status: 'duplicate',
        originalDistributorId: 'dist001',
        originalDistributorName: 'Global Distribution Network'
      },
      {
        id: '3',
        distributorName: 'East Coast Partners',
        companyName: 'East Coast Distribution Partners',
        gst: 'GST456789123',
        contactPerson: 'Lisa Wang',
        phone: '+1-555-0301',
        email: 'lisa@eastcoast.com',
        city: 'Boston',
        state: 'MA',
        district: 'Downtown',
        detectedOn: '2024-12-18T13:45:00Z',
        status: 'new'
      }
    ];

    // Mock manufacturer-distributor mappings
    const mockMappings: ManufacturerDistributorMapping[] = [
      {
        id: '1',
        manufacturerId: 'mfr001',
        manufacturerName: 'TechCorp Industries',
        distributorId: 'dist001',
        distributorName: 'Global Distribution Network',
        territory: 'North America',
        mappedOn: '2024-12-15T10:00:00Z',
        status: 'active'
      },
      {
        id: '2',
        manufacturerId: 'mfr002',
        manufacturerName: 'Global Manufacturing Ltd',
        distributorId: 'dist002',
        distributorName: 'Regional Partners LLC',
        territory: 'Europe',
        mappedOn: '2024-12-10T14:30:00Z',
        status: 'active'
      }
    ];

    setTimeout(() => {
      setUnmatchedItems(mockItems);
      setUnmatchedDistributors(mockDistributors);
      setManufacturerMappings(mockMappings);
      setFilteredItems(mockItems);
      setFilteredDistributors(mockDistributors);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter items
  useEffect(() => {
    let filtered = unmatchedItems;

    if (itemSearchText) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(itemSearchText.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(itemSearchText.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(itemSearchText.toLowerCase())
      );
    }

    if (itemStatusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === itemStatusFilter);
    }

    if (itemCategoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === itemCategoryFilter);
    }

    setFilteredItems(filtered);
  }, [itemSearchText, itemStatusFilter, itemCategoryFilter, unmatchedItems]);

  // Filter distributors
  useEffect(() => {
    let filtered = unmatchedDistributors;

    if (distributorSearchText) {
      filtered = filtered.filter(dist =>
        dist.distributorName.toLowerCase().includes(distributorSearchText.toLowerCase()) ||
        dist.companyName.toLowerCase().includes(distributorSearchText.toLowerCase()) ||
        dist.contactPerson.toLowerCase().includes(distributorSearchText.toLowerCase()) ||
        dist.gst.toLowerCase().includes(distributorSearchText.toLowerCase())
      );
    }

    if (distributorStatusFilter !== 'all') {
      filtered = filtered.filter(dist => dist.status === distributorStatusFilter);
    }

    if (gstDuplicateFilter) {
      filtered = filtered.filter(dist => dist.status === 'duplicate');
    }

    setFilteredDistributors(filtered);
  }, [distributorSearchText, distributorStatusFilter, gstDuplicateFilter, unmatchedDistributors]);

  const handleMarkItemAs = (item: UnmatchedItem, status: 'new' | 'duplicate') => {
    if (status === 'duplicate') {
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
        title: 'Mark as Duplicate',
        html: `
          <div class="text-left space-y-4">
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl">
              <p><strong>Item:</strong> ${item.itemName}</p>
              <p><strong>Code:</strong> ${item.itemCode}</p>
              <p><strong>Manufacturer:</strong> ${item.manufacturer}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Original Item</label>
              <select id="originalItem" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select original item...</option>
                <option value="item-123">Smartphone Protective Case (SPC-001)</option>
                <option value="item-124">Wireless Audio Device (WAD-001)</option>
                <option value="item-125">Motor Equipment 5HP (ME-5HP-001)</option>
              </select>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Mark as Duplicate',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          const originalItem = (document.getElementById('originalItem') as HTMLSelectElement)?.value;
          if (!originalItem) {
            Swal.showValidationMessage('Please select the original item');
          }
          return originalItem;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          setUnmatchedItems(prev => prev.map(i => 
            i.id === item.id 
              ? { ...i, status: 'duplicate', originalItemId: result.value, originalItemName: 'Selected Original Item' }
              : i
          ));
          
          swalWithBootstrapButtons.fire({
            icon: 'success',
            title: 'Item Marked as Duplicate!',
            text: `${item.itemName} has been marked as duplicate.`,
            timer: 2000,
            showConfirmButton: false
          });
        }
      });
    } else {
      setUnmatchedItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, status: 'new' } : i
      ));
      
      Swal.fire({
        icon: 'success',
        title: 'Item Marked as New!',
        text: `${item.itemName} has been marked as a new item.`,
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-0',
          title: 'text-gray-900 dark:text-white font-bold',
          htmlContainer: 'text-gray-700 dark:text-gray-300'
        }
      });
    }
  };

  const handleMarkDistributorAs = (distributor: UnmatchedDistributor, status: 'new' | 'duplicate') => {
    if (status === 'duplicate') {
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
        title: 'Mark as Duplicate Distributor',
        html: `
          <div class="text-left space-y-4">
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl">
              <p><strong>Distributor:</strong> ${distributor.distributorName}</p>
              <p><strong>GST:</strong> ${distributor.gst}</p>
              <p><strong>Contact:</strong> ${distributor.contactPerson}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Original Distributor</label>
              <select id="originalDistributor" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select original distributor...</option>
                <option value="dist001">Global Distribution Network (GST789123456)</option>
                <option value="dist002">Regional Partners LLC (GST456789123)</option>
                <option value="dist003">Asia Pacific Distributors (GST654987321)</option>
              </select>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Mark as Duplicate',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          const originalDistributor = (document.getElementById('originalDistributor') as HTMLSelectElement)?.value;
          if (!originalDistributor) {
            Swal.showValidationMessage('Please select the original distributor');
          }
          return originalDistributor;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          setUnmatchedDistributors(prev => prev.map(d => 
            d.id === distributor.id 
              ? { ...d, status: 'duplicate', originalDistributorId: result.value, originalDistributorName: 'Selected Original Distributor' }
              : d
          ));
          
          swalWithBootstrapButtons.fire({
            icon: 'success',
            title: 'Distributor Marked as Duplicate!',
            text: `${distributor.distributorName} has been marked as duplicate.`,
            timer: 2000,
            showConfirmButton: false
          });
        }
      });
    } else {
      setUnmatchedDistributors(prev => prev.map(d => 
        d.id === distributor.id ? { ...d, status: 'new' } : d
      ));
      
      Swal.fire({
        icon: 'success',
        title: 'Distributor Marked as New!',
        text: `${distributor.distributorName} has been marked as a new distributor.`,
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-0',
          title: 'text-gray-900 dark:text-white font-bold',
          htmlContainer: 'text-gray-700 dark:text-gray-300'
        }
      });
    }
  };

  const handleCreateMapping = () => {
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
      title: 'Create Manufacturer-Distributor Mapping',
      html: `
        <div class="text-left space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Manufacturer</label>
            <select id="manufacturer" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Select manufacturer...</option>
              <option value="mfr001">TechCorp Industries</option>
              <option value="mfr002">Global Manufacturing Ltd</option>
              <option value="mfr003">Innovation Works Inc</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Distributor</label>
            <select id="distributor" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Select distributor...</option>
              <option value="dist001">Global Distribution Network</option>
              <option value="dist002">Regional Partners LLC</option>
              <option value="dist003">Asia Pacific Distributors</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GST No</label>
            <input id="territory" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Enter GST No..." />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Create Mapping',
      cancelButtonText: 'Cancel',
      width: '500px',
      preConfirm: () => {
        const manufacturer = (document.getElementById('manufacturer') as HTMLSelectElement)?.value;
        const distributor = (document.getElementById('distributor') as HTMLSelectElement)?.value;
        const territory = (document.getElementById('territory') as HTMLInputElement)?.value;
        
        if (!manufacturer || !distributor || !territory) {
          Swal.showValidationMessage('Please fill in all fields');
        }
        return { manufacturer, distributor, territory };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newMapping: ManufacturerDistributorMapping = {
          id: Date.now().toString(),
          manufacturerId: result.value.manufacturer,
          manufacturerName: 'Selected Manufacturer',
          distributorId: result.value.distributor,
          distributorName: 'Selected Distributor',
          territory: result.value.territory,
          mappedOn: new Date().toISOString(),
          status: 'active'
        };
        
        setManufacturerMappings(prev => [...prev, newMapping]);
        
        swalWithBootstrapButtons.fire({
          icon: 'success',
          title: 'Mapping Created!',
          text: 'Manufacturer-Distributor mapping has been created successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const itemColumns = [
    {
      title: 'Item Details',
      key: 'itemDetails',
      render: (record: UnmatchedItem) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{record.itemName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Code: {record.itemCode}</p>
            <Tag size="small" color="blue">{record.category}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      render: (text: string) => (
        <div className="flex items-center space-x-2">
          <Factory className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Detected On',
      dataIndex: 'detectedOn',
      key: 'detectedOn',
      sorter: (a: UnmatchedItem, b: UnmatchedItem) => 
        new Date(a.detectedOn).getTime() - new Date(b.detectedOn).getTime(),
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: UnmatchedItem) => (
        <div>
          <Tag color={
            status === 'new' ? 'green' :
            status === 'duplicate' ? 'orange' : 'blue'
          }>
            {status.toUpperCase()}
          </Tag>
          {status === 'duplicate' && record.originalItemName && (
            <p className="text-xs text-gray-500 mt-1">
              Original: {record.originalItemName}
            </p>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: UnmatchedItem) => (
        <Space>
          <Tooltip title="Mark as New">
            <Button 
              type="text" 
              size="small" 
              icon={<CheckCircle className="w-4 h-4" />}
              onClick={() => handleMarkItemAs(record, 'new')}
              className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
            />
          </Tooltip>
          <Tooltip title="Mark as Duplicate">
            <Button 
              type="text" 
              size="small" 
              icon={<AlertTriangle className="w-4 h-4" />}
              onClick={() => handleMarkItemAs(record, 'duplicate')}
              className="text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const distributorColumns = [
    {
      title: 'Distributor Details',
      key: 'distributorDetails',
      render: (record: UnmatchedDistributor) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{record.distributorName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{record.companyName}</p>
            <p className="text-xs text-gray-400">GST: {record.gst}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact Information',
      key: 'contact',
      render: (record: UnmatchedDistributor) => (
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{record.contactPerson}</p>
          <p className="text-xs text-gray-500">{record.phone}</p>
          <p className="text-xs text-gray-500">{record.email}</p>
        </div>
      ),
    },
    {
      title: 'Location',
      key: 'location',
      render: (record: UnmatchedDistributor) => (
        <div className="text-sm">
          <p className="text-gray-900 dark:text-white">{record.city}, {record.state}</p>
          <p className="text-gray-500 dark:text-gray-400">{record.district}</p>
        </div>
      ),
    },
    {
      title: 'Detected On',
      dataIndex: 'detectedOn',
      key: 'detectedOn',
      sorter: (a: UnmatchedDistributor, b: UnmatchedDistributor) => 
        new Date(a.detectedOn).getTime() - new Date(b.detectedOn).getTime(),
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: UnmatchedDistributor) => (
        <div>
          <Tag color={
            status === 'new' ? 'green' :
            status === 'duplicate' ? 'orange' : 'blue'
          }>
            {status.toUpperCase()}
          </Tag>
          {status === 'duplicate' && record.originalDistributorName && (
            <p className="text-xs text-gray-500 mt-1">
              Original: {record.originalDistributorName}
            </p>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: UnmatchedDistributor) => (
        <Space>
          <Tooltip title="Mark as New">
            <Button 
              type="text" 
              size="small" 
              icon={<CheckCircle className="w-4 h-4" />}
              onClick={() => handleMarkDistributorAs(record, 'new')}
              className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
            />
          </Tooltip>
          <Tooltip title="Mark as Duplicate">
            <Button 
              type="text" 
              size="small" 
              icon={<AlertTriangle className="w-4 h-4" />}
              onClick={() => handleMarkDistributorAs(record, 'duplicate')}
              className="text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const mappingColumns = [
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturerName',
      key: 'manufacturerName',
      render: (text: string) => (
        <div className="flex items-center space-x-2">
          <Factory className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Distributor',
      dataIndex: 'distributorName',
      key: 'distributorName',
      render: (text: string) => (
        <div className="flex items-center space-x-2">
          <Truck className="w-4 h-4 text-green-500" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Territory',
      dataIndex: 'territory',
      key: 'territory',
    },
    {
      title: 'Mapped On',
      dataIndex: 'mappedOn',
      key: 'mappedOn',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const itemStats = {
    total: unmatchedItems.length,
    new: unmatchedItems.filter(i => i.status === 'new').length,
    duplicate: unmatchedItems.filter(i => i.status === 'duplicate').length,
    mapped: unmatchedItems.filter(i => i.status === 'mapped').length
  };

  const distributorStats = {
    total: unmatchedDistributors.length,
    new: unmatchedDistributors.filter(d => d.status === 'new').length,
    duplicate: unmatchedDistributors.filter(d => d.status === 'duplicate').length,
    mapped: unmatchedDistributors.filter(d => d.status === 'mapped').length
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mapping Utility</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage item mappings and manufacturer-distributor relationships.</p>
        </div>
      </motion.div>

      {/* Toggle Switch */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="shadow-lg border-0">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-4">
              <span className={`font-medium ${activeTab === 'items' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
                Item Mappings
              </span>
              <Switch
                checked={activeTab === 'distributors'}
                onChange={(checked) => setActiveTab(checked ? 'distributors' : 'items')}
                size="large"
              />
              <span className={`font-medium ${activeTab === 'distributors' ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                Manufacturer-Distributor Mappings
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Item Mappings */}
      {activeTab === 'items' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-6"
        >
          {/* Item Statistics */}
          <Row gutter={[24, 24]}>
            <Col xs={12} sm={6}>
              <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <div className="text-2xl font-bold text-purple-600">{itemStats.total}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Items</div>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <div className="text-2xl font-bold text-green-600">{itemStats.new}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">New Items</div>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <div className="text-2xl font-bold text-orange-600">{itemStats.duplicate}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Duplicates</div>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <div className="text-2xl font-bold text-blue-600">{itemStats.mapped}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mapped</div>
              </Card>
            </Col>
          </Row>

          {/* Unmatched Items Table */}
          <Card 
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-purple-500" />
                  <span>Unmatched Items</span>
                </div>
                <div className="flex items-center space-x-4">
                  <AntSearch
                    placeholder="Search items..."
                    value={itemSearchText}
                    onChange={(e) => setItemSearchText(e.target.value)}
                    className="w-64"
                    allowClear
                  />
                  <Select
                    value={itemStatusFilter}
                    onChange={setItemStatusFilter}
                    className="w-32"
                    placeholder="Status"
                  >
                    <Option value="all">All Status</Option>
                    <Option value="new">New</Option>
                    <Option value="duplicate">Duplicate</Option>
                    <Option value="mapped">Mapped</Option>
                  </Select>
                  <Select
                    value={itemCategoryFilter}
                    onChange={setItemCategoryFilter}
                    className="w-40"
                    placeholder="Category"
                  >
                    <Option value="all">All Categories</Option>
                    <Option value="Electronics">Electronics</Option>
                    <Option value="Accessories">Accessories</Option>
                    <Option value="Industrial Equipment">Industrial Equipment</Option>
                    <Option value="Lighting">Lighting</Option>
                  </Select>
                </div>
              </div>
            }
            className="shadow-lg border-0"
          >
            <Table
              columns={itemColumns}
              dataSource={filteredItems}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              className="custom-table"
            />
          </Card>
        </motion.div>
      )}

      {/* Distributor Mappings */}
      {activeTab === 'distributors' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-6"
        >
          {/* Distributor Statistics */}
          <Row gutter={[24, 24]}>
            <Col xs={12} sm={6}>
              <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <div className="text-2xl font-bold text-green-600">{distributorStats.total}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Distributors</div>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <div className="text-2xl font-bold text-blue-600">{distributorStats.new}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">New Distributors</div>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <div className="text-2xl font-bold text-orange-600">{distributorStats.duplicate}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">GST Duplicates</div>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <div className="text-2xl font-bold text-purple-600">{manufacturerMappings.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Mappings</div>
              </Card>
            </Col>
          </Row>

          {/* Unmatched Distributors Table */}
          <Card 
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-green-500" />
                  <span>Unmatched Distributors</span>
                </div>
                <div className="flex items-center space-x-4">
                  <AntSearch
                    placeholder="Search distributors..."
                    value={distributorSearchText}
                    onChange={(e) => setDistributorSearchText(e.target.value)}
                    className="w-64"
                    allowClear
                  />
                  <Select
                    value={distributorStatusFilter}
                    onChange={setDistributorStatusFilter}
                    className="w-32"
                    placeholder="Status"
                  >
                    <Option value="all">All Status</Option>
                    <Option value="new">New</Option>
                    <Option value="duplicate">Duplicate</Option>
                    <Option value="mapped">Mapped</Option>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">GST Duplicates Only:</span>
                    <Switch
                      checked={gstDuplicateFilter}
                      onChange={setGstDuplicateFilter}
                      size="small"
                    />
                  </div>
                </div>
              </div>
            }
            className="shadow-lg border-0"
          >
            <Table
              columns={distributorColumns}
              dataSource={filteredDistributors}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} distributors`,
              }}
              className="custom-table"
            />
          </Card>

          {/* Manufacturer-Distributor Mappings */}
          <Card 
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Link className="w-5 h-5 text-blue-500" />
                  <span>Manufacturer-Distributor Mappings</span>
                </div>
                <Button 
                  type="primary"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={handleCreateMapping}
                  className="bg-gradient-to-r from-blue-500 to-green-600 border-0"
                >
                  Create Mapping
                </Button>
              </div>
            }
            className="shadow-lg border-0"
          >
            <Table
              columns={mappingColumns}
              dataSource={manufacturerMappings}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} mappings`,
              }}
              className="custom-table"
            />
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default MappingUtility;