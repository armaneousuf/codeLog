import React, { useMemo } from 'react';
import { LogEntry } from '../types';

interface MovingAverageChartProps {
  logs: LogEntry[];
}

const MovingAverageChart: React.FC<MovingAverageChartProps> = ({ logs }) => {
  const chartData = useMemo(() => {
    if (logs.length === 0) return { avg7: [], avg30: [] };

    const logsByDate = new Map<string, number>();
    logs.forEach(log => {
      logsByDate.set(log.date, (logsByDate.get(log.date) || 0) + log.hours);
    });

    const sortedDates = Array.from(logsByDate.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const firstLogDate = new Date(sortedDates[0] + 'T00:00:00');
    const lastLogDate = new Date(sortedDates[sortedDates.length - 1] + 'T00:00:00');
    
    const movingAverages7 = [];
    const movingAverages30 = [];

    // Check if the span of days is enough to calculate the averages
    const daySpan = (lastLogDate.getTime() - firstLogDate.getTime()) / (1000 * 3600 * 24);
    const canCalc7 = daySpan >= 6;
    const canCalc30 = daySpan >= 29;

    let currentDate = new Date(firstLogDate);
    
    while (currentDate <= lastLogDate) {
        // 7-day average
        if (canCalc7) {
            let sum7 = 0;
            for (let i = 0; i < 7; i++) {
                const day = new Date(currentDate);
                day.setDate(day.getDate() - i);
                const dateString = day.toISOString().split('T')[0];
                sum7 += logsByDate.get(dateString) || 0;
            }
            movingAverages7.push({
                date: currentDate.toISOString().split('T')[0],
                avg: sum7 / 7,
            });
        }

        // 30-day average
        if (canCalc30) {
             let sum30 = 0;
             for (let i = 0; i < 30; i++) {
                 const day = new Date(currentDate);
                 day.setDate(day.getDate() - i);
                 const dateString = day.toISOString().split('T')[0];
                 sum30 += logsByDate.get(dateString) || 0;
             }
             movingAverages30.push({
                date: currentDate.toISOString().split('T')[0],
                avg: sum30 / 30,
            });
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return { 
        avg7: movingAverages7.slice(-30), // Get last 30 points
        avg30: movingAverages30.slice(-30) 
    };
  }, [logs]);


  const { avg7, avg30 } = chartData;

  const show7Day = avg7.length > 0;
  const show30Day = avg30.length > 0;

  if (!show7Day && !show30Day) {
    return (
        <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Productivity Trends</h2>
            <p className="text-sm text-gray-300 mb-6 -mt-3">7 & 30-Day Moving Averages</p>
            <p className="text-gray-400 text-sm">Log data across a 7 day period to see your short-term trend. 30 days needed for the long-term trend.</p>
        </div>
    );
  }

  const combinedData = [...avg7.map(d => d.avg), ...avg30.map(d => d.avg)];
  const maxAvg = Math.max(...combinedData, 1);
  
  const generatePoints = (data: {date: string, avg: number}[]) => {
      if (data.length <= 1) return '';
      return data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (d.avg / maxAvg) * 90; // 90 to leave some top padding
        return `${x},${y}`;
      }).join(' ');
  }
  
  const points7 = generatePoints(avg7);
  const points30 = generatePoints(avg30);
  
  const allDates = [...new Set([...avg7.map(d=>d.date), ...avg30.map(d=>d.date)])].sort();

  const lastDate = allDates.length > 0 ? new Date(allDates[allDates.length-1] + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '';
  const firstDate = allDates.length > 0 ? new Date(allDates[0] + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '';

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Productivity Trends</h2>
          <p className="text-sm text-gray-300 -mt-1">7 & 30-Day Moving Averages</p>
        </div>
        <div className="flex flex-col items-end text-xs space-y-1">
          {show7Day && (
            <div className="flex items-center gap-2">
              <span className="text-gray-300">7-Day Avg</span>
              <div className="w-4 h-1 bg-violet-400 rounded-full"></div>
            </div>
          )}
          {show30Day && (
            <div className="flex items-center gap-2">
              <span className="text-gray-300">30-Day Avg</span>
              <div className="w-4 h-1 bg-gray-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
       <div className="h-48 relative mt-4">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {show30Day && <polyline
                fill="none"
                stroke="#6b7280"
                strokeWidth="1.5"
                points={points30}
            />}
            {show7Day && <polyline
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2"
                points={points7}
            />}
        </svg>
        <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-xs text-gray-400 px-1">
            <span>{firstDate}</span>
            <span>{lastDate}</span>
        </div>
       </div>
    </div>
  );
};

export default MovingAverageChart;