import React, { useMemo, useState, useRef, useCallback } from 'react';
import { LogEntry } from '../types';

interface MovingAverageChartProps {
  logs: LogEntry[];
}

const MovingAverageChart: React.FC<MovingAverageChartProps> = ({ logs }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(() => {
    const logsByDate = new Map<string, number>();
    logs.forEach(log => {
      logsByDate.set(log.date, (logsByDate.get(log.date) || 0) + log.hours);
    });

    const dataPoints = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const hours = logsByDate.get(dateString) || 0;

      let sum7 = 0;
      for (let j = 0; j < 7; j++) {
        const avgDate = new Date(date);
        avgDate.setDate(date.getDate() - j);
        const avgDateString = avgDate.toISOString().split('T')[0];
        sum7 += logsByDate.get(avgDateString) || 0;
      }
      const avg7 = sum7 / 7;

      dataPoints.push({
        date,
        dateString,
        hours,
        avg7,
      });
    }

    const maxHours = Math.max(...dataPoints.map(d => d.hours), 1);
    const maxAvg = Math.max(...dataPoints.map(d => d.avg7), 1);
    
    return { dataPoints, maxHours, maxAvg };
  }, [logs]);

  const { dataPoints, maxHours, maxAvg } = chartData;
  const overallMax = Math.max(maxHours, maxAvg);

  const getPathData = useCallback(() => {
    if (dataPoints.length === 0) return "";
    
    const points = dataPoints.map((d, i) => {
        const x = (i / (dataPoints.length - 1)) * 100;
        const y = 100 - (d.avg7 / overallMax) * 90 - 5; // 90% height, 5% top padding
        return `${x},${y}`;
    }).join(' L ');

    const firstPoint = `0,${100 - (dataPoints[0].avg7 / overallMax) * 90 - 5}`;
    const lastPoint = `100,${100 - (dataPoints[dataPoints.length-1].avg7 / overallMax) * 90 - 5}`;

    return `M ${firstPoint} L ${points} L ${lastPoint} L 100,100 L 0,100 Z`;
  }, [dataPoints, overallMax]);

  const getLineData = useCallback(() => {
    if (dataPoints.length < 2) return "";
    return dataPoints.map((d, i) => {
        const x = (i / (dataPoints.length - 1)) * 100;
        const y = 100 - (d.avg7 / overallMax) * 90 - 5;
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');
  }, [dataPoints, overallMax]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;
    const relativeX = (x / containerRect.width);
    const index = Math.min(Math.max(Math.round(relativeX * (dataPoints.length - 1)), 0), dataPoints.length - 1);
    
    setHoveredIndex(index);
    setTooltipPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  
  const hoveredData = hoveredIndex !== null ? dataPoints[hoveredIndex] : null;

  if (logs.length < 7) {
     return (
        <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6 h-full flex flex-col justify-center items-center min-h-[292px]">
            <h2 className="text-xl font-semibold text-white mb-2">Coding Rhythm</h2>
            <p className="text-sm text-gray-400 text-center">Log at least 7 days of activity to see your momentum.</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-white mb-1">Coding Rhythm</h2>
      <p className="text-sm text-gray-300 -mt-1">Last 90 Days Momentum</p>
      
      <div 
        ref={containerRef}
        className="relative h-52 mt-4 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="rhythmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
            </linearGradient>
          </defs>

          {/* Daily Bars */}
          {dataPoints.map((d, i) => {
            const barHeight = Math.max((d.hours / overallMax) * 90, 0);
            const x = (i / dataPoints.length) * 100;
            const barWidth = 100 / dataPoints.length * 0.8;
            return (
              <rect
                key={d.dateString}
                x={x}
                y={100 - barHeight}
                width={barWidth}
                height={barHeight}
                className="fill-gray-700/50"
              />
            );
          })}
          
          {/* 7-day Average Area */}
          <path d={getPathData()} fill="url(#rhythmGradient)" />
          <path d={getLineData()} fill="none" stroke="#a78bfa" strokeWidth="0.5" />

          {/* Hover effects */}
          {hoveredData && hoveredIndex !== null && (
            <>
              <line
                x1={(hoveredIndex / (dataPoints.length - 1)) * 100}
                y1="0"
                x2={(hoveredIndex / (dataPoints.length - 1)) * 100}
                y2="100"
                stroke="#fafafa"
                strokeWidth="0.2"
                strokeDasharray="1 1"
              />
              <circle
                cx={(hoveredIndex / (dataPoints.length - 1)) * 100}
                cy={100 - (hoveredData.avg7 / overallMax) * 90 - 5}
                r="1"
                fill="#fafafa"
                stroke="#8b5cf6"
                strokeWidth="0.5"
              />
               <rect
                x={(hoveredIndex / dataPoints.length) * 100}
                y={100 - (hoveredData.hours / overallMax) * 90}
                width={100 / dataPoints.length * 0.8}
                height={(hoveredData.hours / overallMax) * 90}
                className="fill-violet-500/50"
              />
            </>
          )}
        </svg>

        {hoveredData && (
          <div 
            className="absolute bg-black/70 backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl px-3 py-2 text-xs pointer-events-none z-10"
            style={{ 
              top: `${tooltipPosition.y}px`, 
              left: `${tooltipPosition.x}px`,
              transform: 'translate(15px, -100%)' // Position tooltip to the side and above cursor
            }}
          >
            <p className="font-bold text-white mb-1 whitespace-nowrap">{hoveredData.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            <div className="space-y-0.5">
                <p className="text-gray-300">Logged: <span className="font-semibold text-white">{hoveredData.hours.toFixed(1)} hrs</span></p>
                <p className="text-violet-300">7-Day Avg: <span className="font-semibold text-violet-200">{hoveredData.avg7.toFixed(1)} hrs</span></p>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>90 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
};

export default MovingAverageChart;
