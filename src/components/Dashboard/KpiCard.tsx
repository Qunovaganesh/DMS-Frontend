import React from 'react';
import { Card } from 'antd';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface KpiCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  prefix?: string;
  suffix?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  prefix = '', 
  suffix = '' 
}) => {
  const isPositive = change >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {prefix}{typeof value === 'number' ? value.toLocaleString('hi-IN') : value}{suffix}
            </p>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                isPositive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                <span>{Math.abs(change)}%</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">vs last period</span>
            </div>
          </div>
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default KpiCard;