import React from 'react';

const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7 7 7" />
  </svg>
);

const ArrowDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7-7-7" />
  </svg>
);

const DashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
);

interface PerformanceIndicatorProps {
  title: string;
  current: number;
  previous: number;
}

const PerformanceIndicator: React.FC<PerformanceIndicatorProps> = ({ title, current, previous }) => {
  let percentageChange = 0;
  if (previous > 0) {
    percentageChange = ((current - previous) / previous) * 100;
  } else if (current > 0) {
    percentageChange = 100; // From 0 to something is effectively a 100% gain for this purpose
  }
  
  const isPositive = percentageChange > 0.1;
  const isNegative = percentageChange < -0.1;
  
  let colorClass = 'text-gray-400';
  let Icon = DashIcon;

  if (isPositive) {
    colorClass = 'text-green-400';
    Icon = ArrowUpIcon;
  } else if (isNegative) {
    colorClass = 'text-red-400';
    Icon = ArrowDownIcon;
  }
  
  const displayPercentage = Math.abs(percentageChange).toFixed(0);

  return (
    <div className="flex items-center justify-between bg-gray-900/50 rounded-md px-3 py-1.5 text-sm">
        <span className="text-gray-300 font-medium">{title}</span>
        <div className={`flex items-center gap-1 font-semibold ${colorClass}`}>
            <Icon />
            <span>{displayPercentage}%</span>
        </div>
    </div>
  );
};

export default PerformanceIndicator;
