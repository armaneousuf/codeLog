
import React from 'react';
import { TECHNOLOGY_COLORS } from '../lib/techColors';
import { formatDuration } from '../lib/utils';

interface StatCardProps {
  title: string;
  currentHours: number;
  goalHours: number;
  colorTag?: string;
}

const FALLBACK_COLORS = [
  '#f97316', '#ec4899', '#8b5cf6', '#ef4444', '#f59e0b', 
  '#22c55e', '#06b6d4', '#6366f1', '#f43f5e', '#eab308'
];

const getTagColor = (tag: string): string => {
    if (TECHNOLOGY_COLORS[tag]) {
        return TECHNOLOGY_COLORS[tag];
    }
    // Simple hash for consistent fallback color
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        const char = tag.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    const index = Math.abs(hash % FALLBACK_COLORS.length);
    return FALLBACK_COLORS[index];
};


const StatCard: React.FC<StatCardProps> = ({ title, currentHours, goalHours, colorTag }) => {
  const percentage = goalHours > 0 ? Math.min((currentHours / goalHours) * 100, 100) : 0;
  
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const progressColor = colorTag ? getTagColor(colorTag) : '#a78bfa'; // default is violet-400

  return (
    <div className="flex flex-col items-center transition-transform duration-200 hover:scale-105">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-800"
            strokeWidth="9"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          <circle
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke={progressColor}
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            style={{ transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.5s ease-out' }}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <span className="font-semibold text-white text-lg">{formatDuration(currentHours)}</span>
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-300 mt-3">{title}</h3>
      <p className="text-xs text-gray-500">{Math.round(percentage)}% of goal</p>
    </div>
  );
};

export default StatCard;
