import React, { useMemo, useState } from 'react';
import { LogEntry } from '../types';

interface ChartPoint {
  date: string;
  hours: number;
  movingAverage: number;
}

interface TooltipData {
  x: number;
  y: number;
  date: string;
  hours: number;
  movingAverage: number;
}

const MovingAverageChart: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const chartData = useMemo(() => {
    const data: ChartPoint[] = [];
    const logsByDate = new Map<string, number>();
    logs.forEach(log => {
      logsByDate.set(log.date, (logsByDate.get(log.date) || 0) + log.hours);
    });

    const endDate = new Date();
    // Generate data for the last 90 days
    for (let i = 89; i >= 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateString = date.toISOString().split('T')[0];
      
      const hours = logsByDate.get(dateString) || 0;
      
      // Calculate 7-day moving average
      let sum7 = 0;
      for (let j = 0; j < 7; j++) {
        const avgDate = new Date(date);
        avgDate.setDate(avgDate.getDate() - j);
        const avgDateString = avgDate.toISOString().split('T')[0];
        sum7 += logsByDate.get(avgDateString) || 0;
      }
      const movingAverage = sum7 / 7;

      data.push({ date: dateString, hours, movingAverage });
    }
    return data;
  }, [logs]);

  const maxHours = useMemo(() => Math.max(...chartData.map(d => d.hours), ...chartData.map(d => d.movingAverage), 1), [chartData]);

  const SVG_WIDTH = 500;
  const SVG_HEIGHT = 150;
  const PADDING = { top: 10, right: 10, bottom: 20, left: 10 };

  const chartWidth = SVG_WIDTH - PADDING.left - PADDING.right;
  const chartHeight = SVG_HEIGHT - PADDING.top - PADDING.bottom;
  
  const xScale = (index: number) => PADDING.left + (index / (chartData.length - 1)) * chartWidth;
  const yScale = (value: number) => PADDING.top + chartHeight - (value / maxHours) * chartHeight;

  // Generate path for moving average area chart
  const areaPath = useMemo(() => {
    if (chartData.length < 2) return '';
    const points = chartData.map((d, i) => `${xScale(i)},${yScale(d.movingAverage)}`).join(' L');
    const startPoint = `M${xScale(0)},${yScale(chartData[0].movingAverage)}`;
    const lineToEnd = `L${xScale(chartData.length - 1)},${yScale(0) + chartHeight}`;
    const lineToStart = `L${xScale(0)},${yScale(0) + chartHeight} Z`;
    return `${startPoint} L${points} ${lineToEnd} ${lineToStart}`;
  }, [chartData, maxHours]);

  const linePath = useMemo(() => {
    if (chartData.length < 2) return '';
    const points = chartData.map((d, i) => `${xScale(i)},${yScale(d.movingAverage)}`).join(' L');
    return `M${xScale(0)},${yScale(chartData[0].movingAverage)} L${points}`;
  }, [chartData, maxHours]);


  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    const index = Math.round(((svgP.x - PADDING.left) / chartWidth) * (chartData.length - 1));
    if (index >= 0 && index < chartData.length) {
      const dataPoint = chartData[index];
      setTooltip({
        x: xScale(index),
        y: yScale(dataPoint.movingAverage),
        ...dataPoint
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };
  
  const formatDateForTooltip = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };


  if (logs.length < 7) {
    return (
        <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-1">Coding Rhythm</h2>
            <p className="text-sm text-gray-300 -mt-1">Daily Hours & 7-Day Momentum</p>
            <div className="flex items-center justify-center h-40">
                <p className="text-gray-400 text-sm text-center">Log at least 7 days of data to see your coding rhythm and trends.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Coding Rhythm</h2>
          <p className="text-sm text-gray-300 -mt-1">Daily Hours & 7-Day Momentum</p>
        </div>
        <div className="flex flex-col items-end text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-gray-300">Daily Hours</span>
            <div className="w-3 h-3 bg-white/10 rounded-sm"></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-300">7-Day Avg</span>
            <div className="w-3 h-3 bg-violet-500/50 rounded-sm"></div>
          </div>
        </div>
      </div>
       <div className="h-48 relative mt-4 -mx-2">
        <svg 
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} 
            className="w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Bars for daily hours */}
          {chartData.map((d, i) => (
            <rect
              key={d.date}
              x={xScale(i) - ((chartWidth / chartData.length) / 2) * 0.4}
              y={yScale(d.hours)}
              width={(chartWidth / chartData.length) * 0.8}
              height={yScale(0) - yScale(d.hours)}
              fill="rgba(255, 255, 255, 0.1)"
              rx="1"
            />
          ))}

          {/* Area for moving average */}
          <path d={areaPath} fill="url(#areaGradient)" />
          
          {/* Line for moving average */}
           <path 
            d={linePath}
            stroke="#c4b5fd"
            strokeWidth="2"
            fill="none"
          />

          {/* Tooltip elements */}
          {tooltip && (
            <g className="pointer-events-none">
              <line 
                x1={tooltip.x} y1={PADDING.top} 
                x2={tooltip.x} y2={chartHeight + PADDING.top} 
                stroke="#fafafa" strokeWidth="1" strokeDasharray="3 3" 
              />
              <circle cx={tooltip.x} cy={yScale(tooltip.hours)} r="4" fill="#fafafa" stroke="#111827" strokeWidth="2" />
              <circle cx={tooltip.x} cy={tooltip.y} r="4" fill="#c4b5fd" stroke="#111827" strokeWidth="2" />
            </g>
          )}

          {/* Axis labels */}
          <text x={PADDING.left} y={SVG_HEIGHT} className="text-xs fill-gray-400">90 days ago</text>
          <text x={SVG_WIDTH - PADDING.right} y={SVG_HEIGHT} textAnchor="end" className="text-xs fill-gray-400">Today</text>
        </svg>

        {/* Tooltip box */}
        {tooltip && (
            <div 
                className="absolute bg-gray-800/80 backdrop-blur-sm text-white text-xs rounded-md p-2 pointer-events-none transition-opacity duration-200"
                style={{
                    left: `${tooltip.x > SVG_WIDTH / 2 ? tooltip.x - 120 : tooltip.x + 15}px`, // position left/right of cursor
                    top: `${PADDING.top}px`,
                    width: '110px'
                }}
            >
                <p className="font-bold">{formatDateForTooltip(tooltip.date)}</p>
                <div className="flex justify-between mt-1">
                    <span className="text-gray-300">Logged:</span>
                    <span>{tooltip.hours.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-300">Avg:</span>
                    <span>{tooltip.movingAverage.toFixed(1)}h</span>
                </div>
            </div>
        )}
       </div>
    </div>
  );
};

export default MovingAverageChart;
