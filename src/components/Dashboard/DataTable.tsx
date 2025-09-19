import React, { useState } from 'react';
import { Card, Table, Button, Tag } from 'antd';
import { Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataTableProps {
  title: string;
  data: Array<{
    rank: number;
    name: string;
    sales: number;
    change: number;
    share: number;
    category?: string;
    brand?: string;
    sku?: string;
  }>;
  showTopBottom?: boolean;
  maxRows?: number;
}

const DataTable: React.FC<DataTableProps> = ({ 
  title, 
  data, 
  showTopBottom = false, 
  maxRows = 5 
}) => {
  const [showAll, setShowAll] = useState(false);
  const [showTop, setShowTop] = useState(true);

  const displayData = showAll ? data : data.slice(0, maxRows);
  const filteredData = showTopBottom && !showAll 
    ? (showTop ? data.slice(0, maxRows) : data.slice(-maxRows))
    : displayData;

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (rank: number) => (
        <div className="flex items-center justify-center">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {rank}
          </span>
        </div>
      ),
    },
    {
      title: title.includes('SKU') ? 'SKU' : 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{name}</p>
          {record.brand && (
            <p className="text-xs text-gray-500">{record.brand}</p>
          )}
          {record.category && (
            <Tag size="small" color="blue">{record.category}</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Sales (₹)',
      dataIndex: 'sales',
      key: 'sales',
      render: (sales: number) => (
        <span className="font-semibold">₹{sales.toLocaleString('hi-IN')}</span>
      ),
    },
    {
      title: 'Change %',
      dataIndex: 'change',
      key: 'change',
      render: (change: number) => (
        <Tag color={change >= 0 ? 'green' : 'red'}>
          {change >= 0 ? '+' : ''}{change}%
        </Tag>
      ),
    },
    {
      title: 'Share %',
      dataIndex: 'share',
      key: 'share',
      render: (share: number) => (
        <span className="text-sm font-medium">{share}%</span>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        title={
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">{title}</span>
            <div className="flex items-center space-x-2">
              {showTopBottom && !showAll && (
                <div className="flex items-center space-x-1">
                  <Button
                    size="small"
                    type={showTop ? 'primary' : 'default'}
                    onClick={() => setShowTop(true)}
                  >
                    Top {maxRows}
                  </Button>
                  <Button
                    size="small"
                    type={!showTop ? 'primary' : 'default'}
                    onClick={() => setShowTop(false)}
                  >
                    Bottom {maxRows}
                  </Button>
                </div>
              )}
              <Button
                type="text"
                size="small"
                icon={showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Less' : 'View More'}
              </Button>
            </div>
          </div>
        }
        className="shadow-lg border-0"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={showAll ? 'all' : 'limited'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={false}
              size="small"
              rowKey="rank"
              className="custom-table"
            />
          </motion.div>
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default DataTable;