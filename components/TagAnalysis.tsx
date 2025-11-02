import React, { useMemo, useState } from 'react';
import { LogEntry } from '../types';
import { TECHNOLOGY_COLORS } from '../lib/techColors';

interface TagAnalysisProps {
  logs: LogEntry[];
}

const FALLBACK_COLORS = [
  '#f97316', '#ec4899', '#8b5cf6', '#ef4444', '#f59e0b', 
  '#22c55e', '#06b6d4', '#6366f1', '#f43f5e', '#eab308'
];

const TagAnalysis: React.FC<TagAnalysisProps> = ({ logs }) => {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

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
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-lg">
         <h2 className="text-xl font-semibold text-gray-200 mb-4">Technology Breakdown</h2>
         <p className="text-gray-400 text-sm">Log your hours with tags to see a breakdown here.</p>
      </div>
    );
  }
  
  const totalHours = tagData.reduce((sum, item) => sum + item.hours, 0);

  const getTagColor = (tag: string, index: number): string => {
    return TECHNOLOGY_COLORS[tag] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
  };

  const chartData = tagData.map(item => {
    const percent = item.hours / totalHours;
    return { ...item, percent };
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
                        stroke={getTagColor(item.tag, index)}
                        strokeWidth="0.4"
                        strokeDasharray={`${item.percent * (2 * Math.PI)}, ${2 * Math.PI}`}
                        strokeDashoffset={`-${(chartData.slice(0, index).reduce((acc, d) => acc + d.percent, 0)) * (2 * Math.PI)}`}
                        className="transition-transform duration-200"
                        transform={hoveredTag === item.tag ? 'scale(1.05)' : 'scale(1)'}
                        onMouseEnter={() => setHoveredTag(item.tag)}
                        onMouseLeave={() => setHoveredTag(null)}
                    />
                ))}
            </svg>
        </div>
        <div className="space-y-2 text-sm">
            {tagData.slice(0, 10).map(({ tag, hours }, index) => (
                <div 
                  key={tag} 
                  className={`flex items-center justify-between p-1 rounded-md transition-colors ${hoveredTag === tag ? 'bg-gray-800' : ''}`}
                  onMouseEnter={() => setHoveredTag(tag)}
                  onMouseLeave={() => setHoveredTag(null)}
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: getTagColor(tag, index) }}></div>
                        <span className="text-gray-300 truncate">{tag}</span>
                    </div>
                    <span className="font-mono text-gray-400 pl-4 flex-shrink-0">{hours.toFixed(1)} hrs</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TagAnalysis;