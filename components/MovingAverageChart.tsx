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

const MovingAverageChart: React.FC<MovingAverageChartProps> = ({ logs }) => {
  const [hoveredDay, setHoveredDay] = useState<{ data: any; event: React.MouseEvent } | null>(null);

  const chartData = useMemo(() => {
    const data: { date: string; totalHours: number; breakdown: { tag: string; hours: number }[] }[] = [];
    const logsMap = new Map<string, LogEntry>(logs.map(log => [log.date, log]));
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const log = logsMap.get(dateString);
      data.push({
        date: dateString,
        totalHours: log?.hours || 0,
        breakdown: log?.techBreakdown || [],
      });
    }
    const maxHours = Math.max(...data.map(d => d.totalHours), 1);
    return { data, maxHours };
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6 h-full flex flex-col justify-center items-center min-h-[292px]">
        <h2 className="text-xl font-semibold text-white mb-2">Daily Focus</h2>
        <p className="text-sm text-gray-400 text-center">Log some hours to see your daily technology breakdown.</p>
      </div>
    );
  }
  
  const tooltipStyle = (): React.CSSProperties => {
    if (!hoveredDay) return { display: 'none' };
    return {
      position: 'fixed',
      top: `${hoveredDay.event.clientY}px`,
      left: `${hoveredDay.event.clientX}px`,
      transform: 'translate(10px, -100%)',
      pointerEvents: 'none',
      zIndex: 50,
    };
  };

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-white mb-1">Daily Focus</h2>
      <p className="text-sm text-gray-300 -mt-1">Last 30 Days by Technology</p>

      <div className="h-52 mt-4 flex items-end justify-between gap-[2px]" onMouseLeave={() => setHoveredDay(null)}>
        {chartData.data.map((day, i) => (
          <div
            key={i}
            className="w-full flex flex-col-reverse group rounded-t-sm overflow-hidden"
            style={{ 
              height: `${day.totalHours > 0 ? Math.max((day.totalHours / chartData.maxHours) * 100, 4) : 2}%`, 
              backgroundColor: '#1f2937'
            }}
            onMouseMove={(e) => setHoveredDay({ data: day, event: e })}
          >
            {day.breakdown.sort((a, b) => a.tag.localeCompare(b.tag)).map((tech) => (
              <div
                key={tech.tag}
                className="w-full transition-all duration-200 group-hover:brightness-125"
                style={{
                  height: `${(tech.hours / day.totalHours) * 100}%`,
                  backgroundColor: getTagColor(tech.tag),
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {hoveredDay && (
        <div
          style={tooltipStyle()}
          className="bg-black/70 backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl p-3 text-xs w-48"
        >
          <p className="font-bold text-white mb-2">
            {new Date(hoveredDay.data.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            <span className="float-right font-mono">{hoveredDay.data.totalHours.toFixed(1)} hrs</span>
          </p>
          <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
            {hoveredDay.data.breakdown.sort((a:any,b:any) => b.hours - a.hours).map((tech: any) => (
              <div key={tech.tag} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: getTagColor(tech.tag) }}></div>
                  <span className="truncate text-gray-300">{tech.tag}</span>
                </div>
                <span className="font-mono text-gray-200 flex-shrink-0 pl-2">{tech.hours.toFixed(1)}</span>
              </div>
            ))}
            {hoveredDay.data.breakdown.length === 0 && <p className="text-gray-400">No activity</p>}
          </div>
        </div>
      )}

      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>30 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
};

export default MovingAverageChart;