import React, { useMemo, useState } from 'react';
import { LogEntry } from '../types';

interface MovingAverageChartProps {
  logs: LogEntry[];
}

const MovingAverageChart: React.FC<MovingAverageChartProps> = ({ logs }) => {
  const [hoveredData, setHoveredData] = useState<{ date: Date; avg7: number; avg30: number; x: number } | null>(null);

  const chartData = useMemo(() => {
    if (logs.length < 2) return null;

    const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const logMap = new Map(sortedLogs.map(log => [log.date, log.hours]));

    const firstDate = new Date(sortedLogs[0].date + 'T00:00:00');
    const lastDate = new Date();
    lastDate.setHours(0,0,0,0);

    const dataPoints: { date: Date; avg7: number; avg30: number }[] = [];
    let currentDate = new Date(firstDate);

    let sum7 = 0;
    let sum30 = 0;
    const history7: number[] = [];
    const history30: number[] = [];

    while (currentDate <= lastDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      const hours = logMap.get(dateString) || 0;
      
      history7.push(hours);
      sum7 += hours;
      if (history7.length > 7) {
        sum7 -= history7.shift()!;
      }
      
      history30.push(hours);
      sum30 += hours;
      if (history30.length > 30) {
        sum30 -= history30.shift()!;
      }

      dataPoints.push({
        date: new Date(currentDate),
        avg7: sum7 / Math.min(history7.length, 7),
        avg30: sum30 / Math.min(history30.length, 30),
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dataPoints;
  }, [logs]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6 h-full flex flex-col justify-center items-center min-h-[400px]">
        <h2 className="text-xl font-semibold text-white mb-2">Productivity Trends</h2>
        <p className="text-sm text-gray-400 text-center">Log more data to see your 7-day and 30-day moving averages.</p>
      </div>
    );
  }

  const width = 500;
  const height = 320;
  const margin = { top: 20, right: 20, bottom: 30, left: 30 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const maxAvg = Math.max(...chartData.map(d => d.avg7), ...chartData.map(d => d.avg30));
  const yMax = Math.ceil(maxAvg * 1.1) || 1; // Add 10% padding, ensure not 0

  const xScale = (date: Date) => {
    const timeRange = chartData[chartData.length - 1].date.getTime() - chartData[0].date.getTime();
    if (timeRange === 0) return 0;
    return ((date.getTime() - chartData[0].date.getTime()) / timeRange) * innerWidth;
  };

  const yScale = (value: number) => innerHeight - (value / yMax) * innerHeight;

  const linePath = (data: typeof chartData, key: 'avg7' | 'avg30') => 
    data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.date)} ${yScale(d[key])}`).join(' ');
  
  const path7 = linePath(chartData, 'avg7');
  const path30 = linePath(chartData, 'avg30');

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = event.currentTarget.getBoundingClientRect();
    const svgX = event.clientX - svgRect.left - margin.left;
    const dateRange = chartData[chartData.length - 1].date.getTime() - chartData[0].date.getTime();
    if(dateRange === 0) return;
    const hoverDateTimestamp = (svgX / innerWidth) * dateRange + chartData[0].date.getTime();
    
    const closestPoint = chartData.reduce((prev, curr) => 
      Math.abs(curr.date.getTime() - hoverDateTimestamp) < Math.abs(prev.date.getTime() - hoverDateTimestamp) ? curr : prev
    );
    
    setHoveredData({ ...closestPoint, x: xScale(closestPoint.date) });
  };
  
  const yAxisLabels = Array.from({ length: 5 }, (_, i) => yMax - (i * yMax / 4));

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-white mb-1">Productivity Trends</h2>
      <p className="text-sm text-gray-300 -mt-1 mb-4">7-day & 30-day moving average.</p>
      
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} onMouseMove={handleMouseMove} onMouseLeave={() => setHoveredData(null)} className="w-full h-auto">
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Y-axis grid lines and labels */}
            {yAxisLabels.map((val, i) => (
              <g key={i}>
                <line x1={0} x2={innerWidth} y1={yScale(val)} y2={yScale(val)} stroke="#374151" strokeWidth="0.5" strokeDasharray="2,3" />
                <text x={-8} y={yScale(val)} dy="0.32em" textAnchor="end" fill="#9ca3af" fontSize="10">{val.toFixed(1)}</text>
              </g>
            ))}

            <path d={path30} fill="none" stroke="#fbbf24" strokeWidth="2" strokeOpacity="0.6" />
            <path d={path7} fill="none" stroke="#a78bfa" strokeWidth="2" />
            
            {hoveredData && (
              <>
                <line x1={hoveredData.x} x2={hoveredData.x} y1={0} y2={innerHeight} stroke="#4b5563" strokeWidth="1" />
                <circle cx={hoveredData.x} cy={yScale(hoveredData.avg30)} r="4" fill="#fbbf24" stroke="#030712" strokeWidth="2" />
                <circle cx={hoveredData.x} cy={yScale(hoveredData.avg7)} r="4" fill="#a78bfa" stroke="#030712" strokeWidth="2" />
              </>
            )}
          </g>
        </svg>

        {hoveredData && (
          <div 
            className="absolute bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg p-2 text-xs pointer-events-none transition-opacity duration-200 shadow-2xl z-10"
            style={{
              left: hoveredData.x + margin.left,
              top: margin.top,
              transform: `translateX(${hoveredData.x > innerWidth / 2 ? '-110%' : '10%'})`,
            }}
          >
            <p className="text-gray-200 font-semibold mb-2">{hoveredData.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm flex-shrink-0 bg-violet-400"/>
              <span className="text-gray-300">7-day avg: <span className="font-mono text-white">{hoveredData.avg7.toFixed(1)} hrs</span></span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 rounded-sm flex-shrink-0 bg-amber-400"/>
              <span className="text-gray-300">30-day avg: <span className="font-mono text-white">{hoveredData.avg30.toFixed(1)} hrs</span></span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end items-center mt-4 space-x-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-violet-400" />
          <span>7-day average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-amber-400" />
          <span>30-day average</span>
        </div>
      </div>
    </div>
  );
};

export default MovingAverageChart;
