import React, { useMemo } from 'react';
import { LogEntry } from '../types';

interface ProductivityChartProps {
  logs: LogEntry[];
}

const ProductivityChart: React.FC<ProductivityChartProps> = ({ logs }) => {
  const productivityData = useMemo(() => {
    const hoursByDay = Array(7).fill(0); // 0: Sunday, 1: Monday, ..., 6: Saturday
    logs.forEach(log => {
      const dayIndex = new Date(log.date + 'T00:00:00').getDay();
      hoursByDay[dayIndex] += log.hours;
    });
    return hoursByDay;
  }, [logs]);

  const maxHours = Math.max(...productivityData, 1);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (logs.length === 0) {
     return (
        <div className="bg-gray-950/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:border-white/20">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Productivity Breakdown</h2>
            <p className="text-sm text-gray-400 mb-6 -mt-3">Total Hours per Day of Week</p>
            <p className="text-gray-400 text-sm">No data for this period. Log some hours to see your productivity breakdown.</p>
        </div>
     )
  }

  return (
    <div className="bg-gray-950/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:border-white/20">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Productivity Breakdown</h2>
       <p className="text-sm text-gray-400 mb-6 -mt-3">Total Hours per Day of Week</p>
      <div className="space-y-3">
        {daysOfWeek.map((day, index) => {
          const hours = productivityData[index];
          const percentage = maxHours > 0 ? (hours / maxHours) * 100 : 0;
          return (
            <div key={day} className="flex items-center gap-4 text-sm">
              <span className="w-8 text-gray-400 font-medium">{day}</span>
              <div className="flex-1 bg-gray-700/50 rounded-full h-4">
                <div
                  className="bg-mint-500 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage > 0 ? Math.max(percentage, 3) : 0}%` }} // min width for visibility
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