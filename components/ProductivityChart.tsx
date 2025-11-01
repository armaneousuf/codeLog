import React, { useMemo } from 'react';
import { LogEntry } from '../types';

interface ProductivityChartProps {
  logs: LogEntry[];
}

const ProductivityChart: React.FC<ProductivityChartProps> = ({ logs }) => {
  const productivityData = useMemo(() => {
    const hoursByDay = Array(7).fill(0); // 0: Sunday, 1: Monday, ..., 6: Saturday
    logs.forEach(log => {
      // The 'T00:00:00' is crucial to avoid timezone issues where the date might shift
      const dayIndex = new Date(log.date + 'T00:00:00').getDay();
      hoursByDay[dayIndex] += log.hours;
    });
    return hoursByDay;
  }, [logs]);

  const maxHours = Math.max(...productivityData);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (maxHours === 0) {
    return null; // Don't render the chart if there's no data
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Productivity Breakdown</h2>
       <p className="text-sm text-gray-400 mb-6 -mt-3">Total Hours per Day of Week</p>
      <div className="space-y-3">
        {daysOfWeek.map((day, index) => {
          const hours = productivityData[index];
          const percentage = maxHours > 0 ? (hours / maxHours) * 100 : 0;
          return (
            <div key={day} className="flex items-center gap-4 text-sm">
              <span className="w-8 text-gray-400 font-medium">{day}</span>
              <div className="flex-1 bg-gray-700 rounded-full h-4">
                <div
                  className="bg-sky-500 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-16 text-right font-mono text-white">{hours.toFixed(1)} hrs</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductivityChart;
