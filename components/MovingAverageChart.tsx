import React, { useMemo, useState } from 'react';
import { LogEntry } from '../types';
import { TECHNOLOGY_COLORS } from '../lib/techColors';

interface MovingAverageChartProps {
  logs: LogEntry[];
}

const FALLBACK_COLORS = [ '#f97316', '#ec4899', '#8b5cf6', '#ef4444', '#f59e0b', '#22c55e', '#06b6d4', '#6366f1' ];
const getTagColor = (tag: string): string => {
    if (TECHNOLOGY_COLORS[tag]) return TECHNOLOGY_COLORS[tag];
    let hash = 0;
    for (let i = 0; i < tag.length; i++) hash = ((hash << 5) - hash) + tag.charCodeAt(i);
    return FALLBACK_COLORS[Math.abs(hash % FALLBACK_COLORS.length)];
};

const TechRadarChart: React.FC<MovingAverageChartProps> = ({ logs }) => {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const chartData = useMemo(() => {
    if (logs.length < 1) return null;

    const allTimeTagHours = new Map<string, number>();
    logs.forEach(log => {
        (log.techBreakdown || []).forEach(tech => {
            allTimeTagHours.set(tech.tag, (allTimeTagHours.get(tech.tag) || 0) + tech.hours);
        });
    });

    const topTags = Array.from(allTimeTagHours.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7)
        .map(entry => entry[0]);

    if (topTags.length < 3) return null; // Radar chart needs at least 3 points

    const sortedLogs = logs.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstDay = new Date(sortedLogs[0].date);
    const lastDay = new Date(sortedLogs[sortedLogs.length - 1].date);
    const totalWeeks = Math.max(1, (lastDay.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24 * 7));

    const avgWeeklyHours = new Map<string, number>();
    topTags.forEach(tag => {
        avgWeeklyHours.set(tag, (allTimeTagHours.get(tag) || 0) / totalWeeks);
    });
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const last7DaysLogs = logs.filter(log => new Date(log.date) >= sevenDaysAgo);

    const last7DaysHours = new Map<string, number>();
    last7DaysLogs.forEach(log => {
        (log.techBreakdown || []).forEach(tech => {
            if (topTags.includes(tech.tag)) {
                last7DaysHours.set(tech.tag, (last7DaysHours.get(tech.tag) || 0) + tech.hours);
            }
        });
    });
    
    let maxValue = 0;
    topTags.forEach(tag => {
        maxValue = Math.max(maxValue, avgWeeklyHours.get(tag) || 0, last7DaysHours.get(tag) || 0);
    });
    maxValue = Math.max(maxValue, 1); // Avoid division by zero

    return {
        labels: topTags,
        datasets: [
            {
                label: 'All-Time Avg.',
                data: topTags.map(tag => (avgWeeklyHours.get(tag) || 0)),
            },
            {
                label: 'Last 7 Days',
                data: topTags.map(tag => (last7DaysHours.get(tag) || 0)),
            }
        ],
        maxValue,
    };
  }, [logs]);

  if (!chartData) {
    return (
      <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6 h-full flex flex-col justify-center items-center min-h-[292px]">
        <h2 className="text-xl font-semibold text-white mb-2">Tech Momentum Radar</h2>
        <p className="text-sm text-gray-400 text-center">Log more hours across at least 3 technologies to see your momentum.</p>
      </div>
    );
  }

  const size = 220;
  const center = size / 2;
  const radius = size * 0.35;
  
  const angleToCoordinate = (angle: number, value: number) => {
    const x = center + value * Math.cos(angle);
    const y = center + value * Math.sin(angle);
    return { x, y };
  };
  
  const getPathCoordinates = (data: number[]) => {
      return data.map((value, i) => {
          const angle = (Math.PI / 2) - (2 * Math.PI * i) / chartData.labels.length;
          const point = angleToCoordinate(angle, (value / chartData.maxValue) * radius);
          return `${point.x},${point.y}`;
      }).join(' ');
  };

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-white mb-1">Tech Momentum Radar</h2>
      <p className="text-sm text-gray-300 -mt-1">Last 7 Days vs. All-Time Weekly Average</p>

      <div className="relative flex justify-center items-center mt-2">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto max-w-[220px] mx-auto">
          {/* Grid Lines & Axes */}
          {[...Array(4)].map((_, i) => (
            <circle key={i} cx={center} cy={center} r={(radius / 4) * (i + 1)} fill="none" stroke="#374151" strokeWidth="0.5" />
          ))}
          {chartData.labels.map((_, i) => {
            const angle = (Math.PI / 2) - (2 * Math.PI * i) / chartData.labels.length;
            const endPoint = angleToCoordinate(angle, radius);
            return <line key={i} x1={center} y1={center} x2={endPoint.x} y2={endPoint.y} stroke="#4b5563" strokeWidth="0.5" />;
          })}

          {/* Data Polygons */}
          <polygon points={getPathCoordinates(chartData.datasets[0].data)} fill="#8b5cf6" fillOpacity="0.2" stroke="#8b5cf6" strokeWidth="1" />
          <polygon points={getPathCoordinates(chartData.datasets[1].data)} fill="#a78bfa" fillOpacity="0.5" stroke="#a78bfa" strokeWidth="1.5" />
          
          {/* Labels & Tooltips */}
          {chartData.labels.map((label, i) => {
            const angle = (Math.PI / 2) - (2 * Math.PI * i) / chartData.labels.length;
            const point = angleToCoordinate(angle, radius * 1.25);
            const isHovered = hoveredLabel === label;
            return (
              <g key={label} onMouseEnter={() => setHoveredLabel(label)} onMouseLeave={() => setHoveredLabel(null)}>
                <text
                    x={point.x} y={point.y}
                    textAnchor="middle" dominantBaseline="middle"
                    className="text-[9px] fill-gray-300 font-semibold transition-all"
                    style={{ fill: isHovered ? getTagColor(label) : undefined, transform: isHovered ? 'scale(1.1)' : 'scale(1)', transformOrigin: `${point.x}px ${point.y}px` }}
                >
                    {label}
                </text>
                 {isHovered && (
                    <foreignObject x={point.x - 35} y={point.y + (point.y < center ? -40 : 10)} width="70" height="35">
                        <div className="bg-black/80 backdrop-blur-sm border border-gray-600 rounded-md p-1 text-center text-[8px] leading-tight">
                            <p className="text-violet-300">7d: <span className="font-bold">{chartData.datasets[1].data[i].toFixed(1)}h</span></p>
                            <p className="text-gray-400">Avg: <span className="font-bold">{chartData.datasets[0].data[i].toFixed(1)}h</span></p>
                        </div>
                    </foreignObject>
                 )}
              </g>
            );
          })}
        </svg>
      </div>

       <div className="flex justify-center items-center gap-4 text-xs text-gray-300 mt-2">
            <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-violet-400/50 border border-violet-400"></div>
                <span>Last 7 Days</span>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-violet-800/50 border border-violet-800"></div>
                <span>All-Time Avg.</span>
            </div>
        </div>
    </div>
  );
};

export default TechRadarChart;
