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
  const [period, setPeriod] = useState<'daily' | '7d' | '30d'>('7d');

  const tagData = useMemo(() => {
    let filteredLogs = logs;

    if (period === 'daily') {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        filteredLogs = logs.filter(log => log.date === todayStr);
    } else { // '7d' or '30d'
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const daysToLookBack = period === '7d' ? 6 : 29;
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - daysToLookBack);

      filteredLogs = logs.filter(log => new Date(log.date + 'T00:00:00') >= startDate);
    }
    
    const tagMap = new Map<string, number>();
    filteredLogs.forEach(log => {
      if (log.tags) {
        log.tags.forEach(tag => {
          tagMap.set(tag, (tagMap.get(tag) || 0) + log.hours);
        });
      }
    });
    return Array.from(tagMap.entries())
      .map(([tag, hours]) => ({ tag, hours }))
      .sort((a, b) => b.hours - a.hours);
  }, [logs, period]);

  const totalHours = tagData.reduce((sum, item) => sum + item.hours, 0);

  const getTagColor = (tag: string, index: number): string => {
    return TECHNOLOGY_COLORS[tag] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
  };

  const chartData = tagData.map(item => {
    const percent = totalHours > 0 ? item.hours / totalHours : 0;
    return { ...item, percent };
  });
  
  const periodTextMap = {
    'daily': 'today',
    '7d': 'the last 7 days',
    '30d': 'the last 30 days',
  };

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Tech Breakdown</h2>
        <div className="flex bg-black/20 p-1 rounded-lg text-sm">
            <button 
              onClick={() => setPeriod('daily')} 
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${period === 'daily' ? 'bg-white text-black' : 'text-gray-300 hover:bg-white/10'}`}
            >
              Daily
            </button>
            <button 
              onClick={() => setPeriod('7d')} 
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${period === '7d' ? 'bg-white text-black' : 'text-gray-300 hover:bg-white/10'}`}
            >
              7 Days
            </button>
            <button 
              onClick={() => setPeriod('30d')} 
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${period === '30d' ? 'bg-white text-black' : 'text-gray-300 hover:bg-white/10'}`}
            >
              30 Days
            </button>
        </div>
      </div>

      {tagData.length === 0 ? (
        <div className="flex items-center justify-center h-[208px]">
          <p className="text-gray-400 text-sm text-center">
            No tagged logs found for {periodTextMap[period]}.
          </p>
        </div>
      ) : (
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
                          aria-label={`${item.tag}: ${item.hours.toFixed(1)} hours`}
                      />
                  ))}
              </svg>
          </div>
          <div className="space-y-2 text-sm max-h-52 overflow-y-auto pr-2">
              {tagData.slice(0, 10).map(({ tag, hours }, index) => (
                  <div 
                    key={tag} 
                    className={`p-1.5 rounded-md transition-colors ${hoveredTag === tag ? 'bg-white/10' : ''}`}
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
      )}
    </div>
  );
};

export default TagAnalysis;