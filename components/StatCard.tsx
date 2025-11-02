import React from 'react';

interface StatCardProps {
  title: string;
  currentHours: number;
  goalHours: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, currentHours, goalHours }) => {
  const percentage = goalHours > 0 ? Math.min((currentHours / goalHours) * 100, 100) : 0;
  const displayHours = (hours: number) => parseFloat(hours.toFixed(1));

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center transition-transform duration-200 hover:scale-105">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          <circle
            className="text-mint-400"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <span className="font-semibold text-white text-lg">{displayHours(currentHours)}</span>
           <span className="text-xs text-gray-400">hrs</span>
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-300 mt-2">{title}</h3>
      <p className="text-xs text-gray-500">{Math.round(percentage)}% of goal</p>
    </div>
  );
};

export default StatCard;