import React, { useMemo } from 'react';
import { LogEntry } from '../types';

interface TagAnalysisProps {
  logs: LogEntry[];
}

const COLORS = [
  '#34d399', '#10b981', '#f97316', '#ec4899', '#8b5cf6', 
  '#ef4444', '#f59e0b', '#22c55e', '#06b6d4', '#6366f1'
];

const TagAnalysis: React.FC<TagAnalysisProps> = ({ logs }) => {
  const tagData = useMemo(() => {
    const tagMap = new Map<string, number>();
    logs.forEach(log => {
      if (log.tags) {
        log.tags.forEach(tag => {
          tagMap.set(tag, (tagMap.get(tag) || 0) + log.hours);
        });
      }
    });
    return Array.from(tagMap.entries())
      .map(([tag, hours]) => ({ tag, hours }))
      .sort((a, b) => b.hours - a.hours);
  }, [logs]);

  if (tagData.length === 0) {
    return null; // Don't render if there are no tags
  }
  
  const totalHours = tagData.reduce((sum, item) => sum + item.hours, 0);

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  let cumulativePercent = 0;

  const chartData = tagData.map(item => {
    const percent = item.hours / totalHours;
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    cumulativePercent += percent;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    const largeArcFlag = percent > 0.5 ? 1 : 0;
    
    const pathData = [
      `M ${startX} ${startY}`, // Move
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
      `L 0 0` // Line to center
    ].join(' ');

    return { ...item, percent, pathData };
  });

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Technology Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="relative w-40 h-40 mx-auto">
            <svg viewBox="-1.2 -1.2 2.4 2.4" style={{transform: 'rotate(-90deg)'}}>
                {chartData.map((item, index) => (
                    <circle 
                        key={item.tag} 
                        cx="0" 
                        cy="0" 
                        r="1" 
                        fill="none"
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth="0.4"
                        strokeDasharray={`${item.percent * (2 * Math.PI)}, ${2 * Math.PI}`}
                        strokeDashoffset={`-${(chartData.slice(0, index).reduce((acc, d) => acc + d.percent, 0)) * (2 * Math.PI)}`}
                    />
                ))}
            </svg>
        </div>
        <div className="space-y-2 text-sm">
            {tagData.slice(0, 10).map(({ tag, hours }, index) => (
                <div key={tag} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-gray-300 truncate">{tag}</span>
                    </div>
                    <span className="font-mono text-gray-400">{hours.toFixed(1)} hrs</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TagAnalysis;