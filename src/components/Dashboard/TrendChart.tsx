import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
  data: Array<{ value: number }>;
  color: string;
  height?: number;
}

const TrendChart: React.FC<TrendChartProps> = ({ data, color, height = 40 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;