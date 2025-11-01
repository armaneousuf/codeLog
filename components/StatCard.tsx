
import React from 'react';

interface StatCardProps {
  title: string;
  currentHours: number;
  goalHours: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, currentHours, goalHours }) => {
  const percentage = goalHours > 0 ? Math.min((currentHours / goalHours) * 100, 100) : 0;
  const displayHours = (hours: number) => parseFloat(hours.toFixed(1));

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <h3 className="text-md font-medium text-gray-300">{title}</h3>
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-white">{displayHours(currentHours)}</span> / {displayHours(goalHours)} hrs
        </p>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatCard;
