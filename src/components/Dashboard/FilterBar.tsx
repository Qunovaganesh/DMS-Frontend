import React from 'react';
import { Card, Select, DatePicker, Button, Switch } from 'antd';
import { Filter, Calendar, MapPin } from 'lucide-react';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface FilterBarProps {
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  onDateRangeChange: (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => void;
  city: string;
  onCityChange: (city: string) => void;
  district: string;
  onDistrictChange: (district: string) => void;
  state: string;
  onStateChange: (state: string) => void;
  entityType: 'manufacturers' | 'distributors';
  onEntityTypeChange: (type: 'manufacturers' | 'distributors') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  dateRange,
  onDateRangeChange,
  city,
  onCityChange,
  district,
  onDistrictChange,
  state,
  onStateChange,
  entityType,
  onEntityTypeChange,
}) => {
  const cities = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'];
  const districts = ['All Districts', 'Mumbai City', 'New Delhi', 'Bangalore Urban', 'Chennai', 'Kolkata'];
  const states = ['All States', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana'];

  return (
    <Card className="shadow-lg border-0 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">Filters:</span>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <RangePicker
              value={dateRange}
              onChange={onDateRangeChange}
              className="w-full sm:w-auto"
              placeholder={['Start Date', 'End Date']}
            />
          </div>
          
          <Select
            value={state}
            onChange={onStateChange}
            className="w-full sm:w-32"
            placeholder="State"
          >
            {states.map(s => (
              <Option key={s} value={s}>{s}</Option>
            ))}
          </Select>
          
          <Select
            value={district}
            onChange={onDistrictChange}
            className="w-full sm:w-32"
            placeholder="District"
          >
            {districts.map(d => (
              <Option key={d} value={d}>{d}</Option>
            ))}
          </Select>
          
          <Select
            value={city}
            onChange={onCityChange}
            className="w-full sm:w-32"
            placeholder="City"
          >
            {cities.map(c => (
              <Option key={c} value={c}>{c}</Option>
            ))}
          </Select>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`text-sm font-medium ${entityType === 'manufacturers' ? 'text-blue-600' : 'text-gray-500'}`}>
            Manufacturers
          </span>
          <Switch
            checked={entityType === 'distributors'}
            onChange={(checked) => onEntityTypeChange(checked ? 'distributors' : 'manufacturers')}
          />
          <span className={`text-sm font-medium ${entityType === 'distributors' ? 'text-green-600' : 'text-gray-500'}`}>
            Distributors
          </span>
        </div>
      </div>
    </Card>
  );
};

export default FilterBar;