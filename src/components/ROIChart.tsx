
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ROIChartProps {
  data: {
    cloudSavings: number;
    productivityGain: number;
    performanceGain: number;
    availabilityGain: number;
  };
}

const COLORS = ['#00d4ff', '#4CAF50', '#FF9800', '#9C27B0'];

export const ROIChart = ({ data }: ROIChartProps) => {
  const chartData = [
    { name: 'Cloud Savings', value: data.cloudSavings, color: COLORS[0] },
    { name: 'Productivity', value: data.productivityGain, color: COLORS[1] },
    { name: 'Performance', value: data.performanceGain, color: COLORS[2] },
    { name: 'Availability', value: data.availabilityGain, color: COLORS[3] },
  ];

  const formatCurrency = (value: number) => `$${(value / 1_000_000).toFixed(2)}M`;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 p-3 rounded-lg border border-slate-700 backdrop-blur-sm">
          <p className="text-slate-200 font-medium">{payload[0].name}</p>
          <p className="text-blue-400 font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
