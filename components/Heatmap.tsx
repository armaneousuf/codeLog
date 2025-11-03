import React from 'react';
import { LogEntry } from '../types';

interface HeatmapProps {
  logs: LogEntry[];
  onDateSelect: (date: string) => void;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB');
};

const Heatmap: React.FC<HeatmapProps> = ({ logs, onDateSelect }) => {
  const logsMap = new Map<string, LogEntry>(logs.map(log => [log.date, log]));

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);
  startDate.setDate(startDate.getDate() + 1);

  const days = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const firstDayOfWeek = startDate.getDay();
  const paddingDays = Array(firstDayOfWeek === 0 ? 6 : firstDayOfWeek -1).fill(null); // Adjust for Monday start

  const getColor = (hours: number | undefined) => {
    if (hours === undefined || hours <= 0) return 'bg-gray-800/50';
    if (hours <= 1.5) return 'bg-mint-900';
    if (hours <= 3) return 'bg-mint-800';
    if (hours <= 4.5) return 'bg-mint-700';
    if (hours <= 6) return 'bg-mint-600';
    if (hours <= 7.5) return 'bg-mint-500';
    return 'bg-mint-400';
  };
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthLabels = [];
  let lastMonth = -1;
  days.forEach((day, index) => {
    const month = day.getMonth();
    const weekIndex = Math.floor((index + paddingDays.length) / 7);
    if (month !== lastMonth) {
        if (monthLabels.length === 0 || weekIndex > monthLabels[monthLabels.length - 1].index + 3) {
            monthLabels.push({ label: monthNames[month], index: weekIndex });
        }
        lastMonth = month;
    }
  });

  return (
    <div className="bg-gray-900/60 backdrop-blur-lg border border-white/5 rounded-xl shadow-2xl p-6 transition-all duration-300 hover:border-white/10 hover:shadow-mint-500/10">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Last Year's Activity</h2>
      <div className="flex">
        <div className="flex flex-col text-xs text-gray-500 pr-2 space-y-2 justify-around pt-8">
            <span>Mon</span>
            <span className="h-full"></span>
            <span>Wed</span>
            <span className="h-full"></span>
            <span>Fri</span>
            <span className="h-full"></span>
        </div>
        <div className="flex-1 overflow-x-auto pb-2">
            <div className="relative" style={{ minWidth: '850px' }}>
                <div className="flex text-xs text-gray-500 mb-2 h-4">
                    {monthLabels.map((month, i) => (
                        <div key={i} className="absolute" style={{left: `calc(${(month.index / 53) * 100}%)`}}>
                            {month.label}
                        </div>
                    ))}
                </div>
                <div className="grid grid-flow-col grid-rows-7 gap-1" style={{ gridTemplateColumns: 'repeat(53, minmax(0, 1fr))' }}>
                {paddingDays.map((_, index) => (
                    <div key={`pad-${index}`} className="aspect-square rounded-sm" />
                ))}
                {days.map((day) => {
                    const dateString = day.toISOString().split('T')[0];
                    const formattedDate = formatDate(day);
                    const logEntry = logsMap.get(dateString);
                    const hours = logEntry?.hours;
                    return (
                    <div 
                      key={dateString}
                      className="group relative cursor-pointer"
                      onClick={() => onDateSelect(dateString)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Log for ${formattedDate}: ${hours ? `${hours.toFixed(1)} hours` : 'No activity'}`}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onDateSelect(dateString); }}
                    >
                        <div
                          className={`aspect-square rounded-sm ${getColor(hours)} transition-all duration-150 group-hover:ring-2 group-hover:ring-mint-300 ring-offset-2 ring-offset-gray-950`}
                        />
                        <div className="heatmap-tooltip absolute bottom-full mb-2 w-max px-3 py-2 bg-gray-800/70 backdrop-blur-md text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 -translate-x-1/2 left-1/2 shadow-lg border border-white/5">
                          <p className="font-bold">{hours ? `${hours.toFixed(1)} hours` : 'No activity'}</p>
                          <p className="text-gray-400">{formattedDate}</p>
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>
        </div>
      </div>
      <div className="flex justify-end items-center mt-4 space-x-2 text-xs text-gray-500">
        <span>Less</span>
        <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
        <div className="w-3 h-3 bg-mint-900 rounded-sm"></div>
        <div className="w-3 h-3 bg-mint-800 rounded-sm"></div>
        <div className="w-3 h-3 bg-mint-700 rounded-sm"></div>
        <div className="w-3 h-3 bg-mint-600 rounded-sm"></div>
        <div className="w-3 h-3 bg-mint-500 rounded-sm"></div>
        <div className="w-3 h-3 bg-mint-400 rounded-sm"></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default Heatmap;