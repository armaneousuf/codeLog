import React, { useMemo } from 'react';
import { LogEntry } from '../types';

interface MovingAverageChartProps {
  logs: LogEntry[];
}

const MovingAverageChart: React.FC<MovingAverageChartProps> = ({ logs }) => {
  const chartData = useMemo(() => {
    if (logs.length < 7) return [];

    const logsByDate = new Map<string, number>();
    logs.forEach(log => {
      logsByDate.set(log.date, (logsByDate.get(log.date) || 0) + log.hours);
    });

    const sortedDates = Array.from(logsByDate.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const startDate = new Date(sortedDates[0] + 'T00:00:00');
    const endDate = new Date(sortedDates[sortedDates.length - 1] + 'T00:00:00');
    
    const movingAverages = [];
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + 6); // Start from the 7th day of logging

    while (currentDate <= endDate) {
        let sum = 0;
        for (let i = 0; i < 7; i++) {
            const day = new Date(currentDate);
            day.setDate(day.getDate() - i);
            const dateString = day.toISOString().split('T')[0];
            sum += logsByDate.get(dateString) || 0;
        }
        movingAverages.push({
            date: currentDate.toISOString().split('T')[0],
            avg: sum / 7,
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return movingAverages.slice(-30); // Show last 30 data points
  }, [logs]);

  if (chartData.length === 0) {
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transition-colors hover:border-gray-600">
            <h2 className="text-xl font-semibold text-white mb-4">7-Day Moving Average</h2>
             <p className="text-sm text-gray-300 mb-6 -mt-3">Daily Hours</p>
            <p className="text-gray-400 text-sm">Log at least 7 days of data to see your moving average trend.</p>
        </div>
    );
  }

  const maxAvg = Math.max(...chartData.map(d => d.avg), 1);
  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length > 1 ? chartData.length - 1 : 1)) * 100;
    const y = 100 - (d.avg / maxAvg) * 90; // 90 to leave some top padding
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transition-colors hover:border-gray-600">
      <h2 className="text-xl font-semibold text-white mb-4">7-Day Moving Average</h2>
       <p className="text-sm text-gray-300 mb-6 -mt-3">Daily Hours</p>
       <div className="h-48 relative">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
                fill="none"
                stroke="#fafafa"
                strokeWidth="2"
                points={points}
            />
            <defs>
                <linearGradient id="movingAvgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#fafafa', stopOpacity: 0.2}} />
                    <stop offset="100%" style={{stopColor: '#fafafa', stopOpacity: 0}} />
                </linearGradient>
            </defs>
            <polygon fill="url(#movingAvgGradient)" points={`0,100 ${points} 100,100`} />
        </svg>
        <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-xs text-gray-400 px-1">
            <span>{new Date(chartData[0].date + 'T00:00:00').toLocaleDateString('en-GB')}</span>
            <span>{new Date(chartData[chartData.length-1].date + 'T00:00:00').toLocaleDateString('en-GB')}</span>
        </div>
       </div>
    </div>
  );
};

export default MovingAverageChart;