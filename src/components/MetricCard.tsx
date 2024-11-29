import React from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  type: 'percentage' | 'tier' | 'number';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, type }) => {
  const formatValue = (val: number | string, type: string) => {
    switch (type) {
      case 'percentage':
        return `${typeof val === 'number' ? val.toFixed(1) : val}%`;
      case 'tier':
        return `Tier ${val}`;
      default:
        return val;
    }
  };

  const getColorClass = (val: number | string, type: string) => {
    if (type === 'percentage') {
      const numVal = typeof val === 'number' ? val : parseFloat(val);
      if (numVal >= 90) return 'bg-green-100 text-green-800';
      if (numVal >= 70) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
    }
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="rounded-lg p-4 shadow-sm border">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <div className={`text-2xl font-bold ${getColorClass(value, type)} inline-block px-2 py-1 rounded`}>
        {formatValue(value, type)}
      </div>
    </div>
  );
};

export default MetricCard;
