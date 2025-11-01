import React, { useMemo, useState, useRef } from 'react';
import { LogEntry } from '../types';

interface MovingAverageChartProps {
  logs: LogEntry[];
}

const MovingAverageChart: React.FC<MovingAverageChartProps> = ({ logs }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string; date: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const data = useMemo(() => {
    if (logs.length === 0) return [];
    
    const logsMap = new Map<string, number>(logs.map(log => [log.date, log.hours]));
    const endDate = new Date();
    const dataPoints = [];
    const windowSize = 7;

    for (let i = 364; i >= 0; i--) {
      const currentDate = new Date();
      currentDate.setDate(endDate.getDate() - i);
      currentDate.setHours(0, 0, 0, 0);

      let sum = 0;
      for (let j = 0; j < windowSize; j++) {
        const dayToSum = new Date(currentDate);
        dayToSum.setDate(currentDate.getDate() - j);
        const dateStringToSum = dayToSum.toISOString().split('T')[0];
        sum += logsMap.get(dateStringToSum) || 0;
      }
      const average = sum / windowSize;
      dataPoints.push({ date: currentDate, average });
    }
    return dataPoints;
  }, [logs]);

  if (data.length === 0) {
    return null;
  }

  const width = 500;
  const height = 150;
  const padding = { top: 10, right: 10, bottom: 20, left: 30 };

  const maxY = Math.max(10, ...data.map(d => d.average)) * 1.1; // Ensure 10hr goal is visible

  const xScale = (index: number) => padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
  const yScale = (value: number) => height - padding.bottom - (value / maxY) * (height - padding.top - padding.bottom);

  const pathData = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.average)}`).join(' ');
  const goalLineY = yScale(10);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const index = Math.round(((x - padding.left) / (width - padding.left - padding.right)) * (data.length - 1));

    if (index >= 0 && index < data.length) {
      const point = data[index];
      setTooltip({
        x: xScale(index),
        y: yScale(point.average),
        text: `${point.average.toFixed(1)} hrs`,
        date: point.date.toLocaleDateString('en-CA'),
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-200 mb-2">7-Day Moving Average</h2>
      <p className="text-sm text-gray-400 mb-4 -mt-1">Daily coding hour average over a rolling 7-day period.</p>
      <div className="relative">
        <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="w-full h-auto">
          {/* Y-Axis Grid Lines & Labels */}
          {[...Array(5)].map((_, i) => {
            const y = padding.top + i * ((height - padding.top - padding.bottom) / 4);
            const value = maxY * (1 - (y - padding.top) / (height - padding.top - padding.bottom));
            return (
              <g key={i}>
                <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#374151" strokeWidth="0.5" />
                <text x={padding.left - 8} y={y + 3} fill="#9ca3af" fontSize="10" textAnchor="end">{value.toFixed(0)}</text>
              </g>
            );
          })}
          
          {/* Goal Line */}
          {goalLineY > padding.top && (
            <>
                <line x1={padding.left} x2={width - padding.right} y1={goalLineY} y2={goalLineY} stroke="#34d399" strokeWidth="1" strokeDasharray="3 3"/>
                <text x={width - padding.right + 4} y={goalLineY + 3} fill="#34d399" fontSize="10">10h</text>
            </>
          )}

          {/* Main Path */}
          <path d={pathData} fill="none" stroke="#38bdf8" strokeWidth="2" />

          {/* Tooltip */}
          {tooltip && (
            <g>
              <circle cx={tooltip.x} cy={tooltip.y} r="4" fill="#38bdf8" stroke="white" strokeWidth="2" />
              <rect x={tooltip.x > width / 2 ? tooltip.x - 90 : tooltip.x + 10} y={tooltip.y - 20} width="80" height="35" fill="rgba(17, 24, 39, 0.8)" rx="4"/>
              <text x={tooltip.x > width / 2 ? tooltip.x - 85 : tooltip.x + 15} y={tooltip.y - 5} fill="white" fontSize="12" fontWeight="bold">{tooltip.text}</text>
              <text x={tooltip.x > width / 2 ? tooltip.x - 85 : tooltip.x + 15} y={tooltip.y + 10} fill="#9ca3af" fontSize="10">{tooltip.date}</text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default MovingAverageChart;
