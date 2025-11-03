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
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transition-colors hover:border-gray-600">
         <h2 className="text-xl font-semibold text-white mb-4">Tech Breakdown</h2>
         <p className="text-gray-300 text-sm">Log your hours with tags to see a breakdown here.</p>
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
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transition-colors hover:border-gray-600">
      <h2 className="text-xl font-semibold text-white mb-4">Tech Breakdown</h2>
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
                        style={{ transformOrigin: 'center center' }}
                        transform={hoveredTag === item.tag ? 'scale(1.05)' : 'scale(1)'}
                        onMouseEnter={() => setHoveredTag(item.tag)}
                        onMouseLeave={() => setHoveredTag(null)}
                    />
                ))}
            </svg>
        </div>
        <div className="space-y-2 text-sm max-h-52 overflow-y-auto pr-2 -mr-2">
            {tagData.slice(0, 10).map(({ tag, hours }, index) => (
                <div 
                  key={tag} 
                  className={`p-1.5 rounded-md transition-colors ${hoveredTag === tag ? 'bg-gray-700' : ''}`}
                  onMouseEnter={() => setHoveredTag(tag)}
                  onMouseLeave={() => setHoveredTag(null)}
                >
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-2 min-w-0">
                          <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: getTagColor(tag, index) }}></div>
                          <span className="text-gray-200 truncate">{tag}</span>
                      </div>
                      <span className="font-mono text-gray-300 flex-shrink-0 pl-2">{hours.toFixed(1)} hrs</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1">
                      <div
                        className="h-1 rounded-full"
                        style={{
                          backgroundColor: getTagColor(tag, index),
                          width: `${(hours / (tagData[0]?.hours || 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TagAnalysis;