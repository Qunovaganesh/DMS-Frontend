import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Input, Select, Space, Switch, Row, Col, Tooltip } from 'antd';
import { 
  Package,
  Factory,
  Truck,
  Plus,
  Link,
  AlertTriangle,
  CheckCircle,
  Trash2
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
  pin: string;
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
  manufacturerGst: string;
  manufacturerPin: string;
  distributorId: string;
  distributorName: string;
  distributorGst: string;
  distributorPin: string;
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
        pin: '10001',
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
        pin: '98101',
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
        pin: '02101',
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
        manufacturerGst: 'GST111111111',
        manufacturerPin: '110001',
        distributorId: 'dist001',
        distributorName: 'Global Distribution Network',
        distributorGst: 'GST789123456',
        distributorPin: '98101',
        territory: 'North America',
        mappedOn: '2024-12-15T10:00:00Z',
        status: 'active'
      },
      {
        id: '2',
        manufacturerId: 'mfr002',
        manufacturerName: 'Global Manufacturing Ltd',
        manufacturerGst: 'GST222222222',
        manufacturerPin: '400001',
        distributorId: 'dist002',
        distributorName: 'Regional Partners LLC',
        distributorGst: 'GST456789123',
        distributorPin: '02101',
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

      // Mock data for existing distributors with GST and PIN
      const existingDistributors = [
        { id: 'dist001', name: 'Global Distribution Network', gst: 'GST789123456', pin: '98101' },
        { id: 'dist002', name: 'Regional Partners LLC', gst: 'GST456789123', pin: '02101' },
        { id: 'dist003', name: 'Asia Pacific Distributors', gst: 'GST654987321', pin: '560001' }
      ];

      swalWithBootstrapButtons.fire({
        title: 'Mark as Duplicate Distributor',
        html: `
          <div class="text-left space-y-4">
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl">
              <p><strong>Distributor:</strong> ${distributor.distributorName}</p>
              <p><strong>GST:</strong> ${distributor.gst}</p>
              <p><strong>PIN:</strong> ${distributor.pin}</p>
              <p><strong>Contact:</strong> ${distributor.contactPerson}</p>
            </div>
            <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p class="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> To merge distributors with different names, both GSTN and PIN must match exactly.
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Original Distributor</label>
              <select id="originalDistributor" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select original distributor...</option>
                ${existingDistributors.map(dist => 
                  `<option value="${dist.id}" data-gst="${dist.gst}" data-pin="${dist.pin}">
                    ${dist.name} (GST: ${dist.gst}, PIN: ${dist.pin})
                  </option>`
                ).join('')}
              </select>
            </div>
            <div id="validationMessage" class="hidden text-red-600 dark:text-red-400 text-sm"></div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Mark as Duplicate',
        cancelButtonText: 'Cancel',
        width: '600px',
        preConfirm: () => {
          const originalDistributorSelect = document.getElementById('originalDistributor') as HTMLSelectElement;
          const selectedOption = originalDistributorSelect?.selectedOptions[0];
          const validationMessage = document.getElementById('validationMessage');
          
          if (!originalDistributorSelect?.value) {
            Swal.showValidationMessage('Please select the original distributor');
            return false;
          }

          if (selectedOption) {
            const originalGst = selectedOption.getAttribute('data-gst');
            const originalPin = selectedOption.getAttribute('data-pin');
            
            // Check if GST and PIN match
            if (distributor.gst !== originalGst || distributor.pin !== originalPin) {
              if (validationMessage) {
                validationMessage.textContent = `Cannot merge: GST (${distributor.gst} vs ${originalGst}) or PIN (${distributor.pin} vs ${originalPin}) do not match.`;
                validationMessage.classList.remove('hidden');
              }
              Swal.showValidationMessage('GSTN and PIN must match exactly to merge distributors with different names');
              return false;
            } else {
              if (validationMessage) {
                validationMessage.classList.add('hidden');
              }
            }
          }
          
          return originalDistributorSelect.value;
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

    // Mock data for manufacturers and distributors with GST and PIN
    const manufacturers = [
      { id: 'mfr001', name: 'TechCorp Industries', gst: 'GST111111111', pin: '110001' },
      { id: 'mfr002', name: 'Global Manufacturing Ltd', gst: 'GST222222222', pin: '400001' },
      { id: 'mfr003', name: 'Innovation Works Inc', gst: 'GST333333333', pin: '560001' }
    ];

    const distributors = [
      { id: 'dist001', name: 'Global Distribution Network', gst: 'GST789123456', pin: '98101' },
      { id: 'dist002', name: 'Regional Partners LLC', gst: 'GST456789123', pin: '02101' },
      { id: 'dist003', name: 'Asia Pacific Distributors', gst: 'GST654987321', pin: '560001' }
    ];

    swalWithBootstrapButtons.fire({
      title: 'Create Manufacturer-Distributor Mapping',
      html: `
        <div class="text-left space-y-4">
          <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <p class="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> For mapping manufacturers and distributors with different names, GSTN and PIN must match exactly.
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Manufacturer</label>
            <select id="manufacturer" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Select manufacturer...</option>
              ${manufacturers.map(mfr => 
                `<option value="${mfr.id}" data-gst="${mfr.gst}" data-pin="${mfr.pin}">
                  ${mfr.name} (GST: ${mfr.gst}, PIN: ${mfr.pin})
                </option>`
              ).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Distributor</label>
            <select id="distributor" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Select distributor...</option>
              ${distributors.map(dist => 
                `<option value="${dist.id}" data-gst="${dist.gst}" data-pin="${dist.pin}">
                  ${dist.name} (GST: ${dist.gst}, PIN: ${dist.pin})
                </option>`
              ).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Territory</label>
            <input id="territory" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Enter territory..." />
          </div>
          <div id="mappingValidationMessage" class="hidden text-red-600 dark:text-red-400 text-sm"></div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Create Mapping',
      cancelButtonText: 'Cancel',
      width: '600px',
      preConfirm: () => {
        const manufacturerSelect = document.getElementById('manufacturer') as HTMLSelectElement;
        const distributorSelect = document.getElementById('distributor') as HTMLSelectElement;
        const territory = (document.getElementById('territory') as HTMLInputElement)?.value;
        const validationMessage = document.getElementById('mappingValidationMessage');
        
        if (!manufacturerSelect?.value || !distributorSelect?.value || !territory) {
          Swal.showValidationMessage('Please fill in all fields');
          return false;
        }

        const manufacturerOption = manufacturerSelect.selectedOptions[0];
        const distributorOption = distributorSelect.selectedOptions[0];
        
        if (manufacturerOption && distributorOption) {
          const manufacturerGst = manufacturerOption.getAttribute('data-gst');
          const manufacturerPin = manufacturerOption.getAttribute('data-pin');
          const distributorGst = distributorOption.getAttribute('data-gst');
          const distributorPin = distributorOption.getAttribute('data-pin');
          
          // Check if GST and PIN match for manufacturer and distributor
          if (manufacturerGst !== distributorGst || manufacturerPin !== distributorPin) {
            if (validationMessage) {
              validationMessage.textContent = `Cannot create mapping: Manufacturer GST/PIN (${manufacturerGst}/${manufacturerPin}) does not match Distributor GST/PIN (${distributorGst}/${distributorPin}).`;
              validationMessage.classList.remove('hidden');
            }
            Swal.showValidationMessage('Manufacturer and Distributor GSTN and PIN must match exactly to create mapping');
            return false;
          } else {
            if (validationMessage) {
              validationMessage.classList.add('hidden');
            }
          }
        }
        
        return { 
          manufacturer: manufacturerSelect.value, 
          distributor: distributorSelect.value, 
          territory,
          manufacturerGst: manufacturerOption?.getAttribute('data-gst'),
          manufacturerPin: manufacturerOption?.getAttribute('data-pin'),
          distributorGst: distributorOption?.getAttribute('data-gst'),
          distributorPin: distributorOption?.getAttribute('data-pin')
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newMapping: ManufacturerDistributorMapping = {
          id: Date.now().toString(),
          manufacturerId: result.value.manufacturer,
          manufacturerName: manufacturers.find(m => m.id === result.value.manufacturer)?.name || 'Selected Manufacturer',
          manufacturerGst: result.value.manufacturerGst,
          manufacturerPin: result.value.manufacturerPin,
          distributorId: result.value.distributor,
          distributorName: distributors.find(d => d.id === result.value.distributor)?.name || 'Selected Distributor',
          distributorGst: result.value.distributorGst,
          distributorPin: result.value.distributorPin,
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

  const handleRemoveMapping = (mapping: ManufacturerDistributorMapping) => {
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
      title: 'Remove Mapping',
      html: `
        <div class="text-left space-y-4">
          <div class="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-xl">
            <p class="font-medium text-gray-900 dark:text-white">Are you sure you want to remove this mapping?</p>
            <div class="mt-3 space-y-2">
              <div class="flex items-center space-x-2">
                <Factory className="w-4 h-4 text-blue-500" />
                <span class="text-sm"><strong>Manufacturer:</strong> ${mapping.manufacturerName}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-green-500" />
                <span class="text-sm"><strong>Distributor:</strong> ${mapping.distributorName}</span>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <strong>Territory:</strong> ${mapping.territory}
              </div>
            </div>
          </div>
          <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p class="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Warning:</strong> This action cannot be undone. The mapping will be permanently removed.
            </p>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Remove Mapping',
      cancelButtonText: 'Cancel',
      width: '500px',
      icon: 'warning'
    }).then((result) => {
      if (result.isConfirmed) {
        setManufacturerMappings(prev => prev.filter(m => m.id !== mapping.id));
        
        swalWithBootstrapButtons.fire({
          icon: 'success',
          title: 'Mapping Removed!',
          text: 'The manufacturer-distributor mapping has been successfully removed.',
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
            <Tag color="blue">{record.category}</Tag>
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
      title: 'Synced Distributor',
      key: 'distributorDetails',
      render: (record: UnmatchedDistributor) => (
        <div className="flex items-center space-x-3">
          {/* <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div> */}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{record.distributorName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{record.companyName}</p>
            <p className="text-xs text-gray-400">GST: {record.gst}</p>
            <p className="text-xs text-gray-400">PIN: {record.pin}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: UnmatchedDistributor) => (
        <div>
          {status === 'duplicate' && record.originalDistributorName && (
            <p className="font-medium text-gray-900 dark:text-white mb-5">
              Original: {record.originalDistributorName}
            </p>
          )}
          <Tag color={
            status === 'new' ? 'green' :
            status === 'duplicate' ? 'orange' : 'blue'
          }>
            {status.toUpperCase()}
          </Tag>
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
      render: (text: string, record: ManufacturerDistributorMapping) => (
        <div className="flex items-center space-x-2">
          <Factory className="w-4 h-4 text-blue-500" />
          <div>
            <span className="font-medium">{text}</span>
            <div className="text-xs text-gray-500">
              GST: {record.manufacturerGst} | PIN: {record.manufacturerPin}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Distributor',
      dataIndex: 'distributorName',
      key: 'distributorName',
      render: (text: string, record: ManufacturerDistributorMapping) => (
        <div className="flex items-center space-x-2">
          <Truck className="w-4 h-4 text-green-500" />
          <div>
            <span className="font-medium">{text}</span>
            <div className="text-xs text-gray-500">
              GST: {record.distributorGst} | PIN: {record.distributorPin}
            </div>
          </div>
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
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ManufacturerDistributorMapping) => (
        <Space>
          <Tooltip title="Remove Mapping">
            <Button 
              type="text" 
              size="small" 
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => handleRemoveMapping(record)}
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            />
          </Tooltip>
        </Space>
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