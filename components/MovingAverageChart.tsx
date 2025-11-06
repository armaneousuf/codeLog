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


interface TreemapRect {
  x: number;
  y: number;
  width: number;
  height: number;
  tag: string;
  hours: number;
  color: string;
  percent: number;
}


const TechTreemap: React.FC<MovingAverageChartProps> = ({ logs }) => {
  const [hoveredRect, setHoveredRect] = useState<TreemapRect | null>(null);

  const treemapLayout = useMemo(() => {
    const tagHours = new Map<string, number>();
    logs.forEach(log => {
      (log.techBreakdown || []).forEach(tech => {
        tagHours.set(tech.tag, (tagHours.get(tech.tag) || 0) + tech.hours);
      });
    });

    if (tagHours.size === 0) return [];

    const totalHours = Array.from(tagHours.values()).reduce((sum, h) => sum + h, 0);
    if (totalHours === 0) return [];
    
    const sortedTags = Array.from(tagHours.entries())
      .filter(([, hours]) => hours > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, hours]) => ({ tag, hours, percent: (hours / totalHours) * 100 }));

    const rectangles: TreemapRect[] = [];

    function generateRects(items: typeof sortedTags, x: number, y: number, width: number, height: number) {
      if (items.length === 0) return;

      if (items.length === 1) {
        const item = items[0];
        rectangles.push({
          ...item,
          x, y, width, height,
          color: getTagColor(item.tag)
        });
        return;
      }

      const totalValue = items.reduce((sum, i) => sum + i.hours, 0);
      let sum = 0;
      let splitIndex = 0;
      for (let i = 0; i < items.length - 1; i++) {
        sum += items[i].hours;
        if (sum >= totalValue / 2) {
          splitIndex = i;
          break;
        }
      }

      const groupA = items.slice(0, splitIndex + 1);
      const groupB = items.slice(splitIndex + 1);

      const groupAValue = groupA.reduce((sum, i) => sum + i.hours, 0);
      const proportion = groupAValue / totalValue;

      if (width > height) { // Split vertically
        const widthA = width * proportion;
        generateRects(groupA, x, y, widthA, height);
        generateRects(groupB, x + widthA, y, width - widthA, height);
      } else { // Split horizontally
        const heightA = height * proportion;
        generateRects(groupA, x, y, width, heightA);
        generateRects(groupB, x, y + heightA, width, height - heightA);
      }
    }

    generateRects(sortedTags, 0, 0, 100, 100); // Use percentages for layout
    return rectangles;
  }, [logs]);

  if (treemapLayout.length === 0) {
    return (
      <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6 h-full flex flex-col justify-center items-center min-h-[292px]">
        <h2 className="text-xl font-semibold text-white mb-2">Tech Focus Treemap</h2>
        <p className="text-sm text-gray-400 text-center">Log your hours to see your all-time technology distribution.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-white mb-1">Tech Focus Treemap</h2>
      <p className="text-sm text-gray-300 -mt-1 mb-4">All-time technology distribution by hours logged.</p>
      
      <div className="relative aspect-video w-full" onMouseLeave={() => setHoveredRect(null)}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {treemapLayout.map((rect) => (
            <g key={rect.tag} onMouseEnter={() => setHoveredRect(rect)}>
              <rect
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                fill={rect.color}
                stroke="#030712"
                strokeWidth="0.2"
                className="transition-opacity duration-200"
                style={{ opacity: hoveredRect && hoveredRect.tag !== rect.tag ? 0.5 : 1 }}
              />
              {rect.width > 10 && rect.height > 5 && (
                 <text
                    x={rect.x + rect.width / 2}
                    y={rect.y + rect.height / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-white font-semibold pointer-events-none"
                    fontSize={Math.max(Math.min(rect.width / 5, rect.height / 2, 4), 1.5)}
                 >
                    {rect.tag}
                 </text>
              )}
            </g>
          ))}
        </svg>

        {hoveredRect && (
            <div 
              className="absolute top-0 left-0 bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg p-2 text-xs pointer-events-none transition-opacity duration-200 shadow-2xl"
              style={{
                 opacity: 1,
                 transform: `translate(${hoveredRect.x > 50 ? 'calc(-100% - 5px)' : '5px'}, ${hoveredRect.y > 50 ? 'calc(-100% - 5px)' : '5px'})`,
                 left: `${hoveredRect.x > 50 ? hoveredRect.x : hoveredRect.x + hoveredRect.width}%`,
                 top: `${hoveredRect.y > 50 ? hoveredRect.y : hoveredRect.y + hoveredRect.height}%`,
              }}
            >
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: hoveredRect.color }}/>
                    <span className="font-bold text-white">{hoveredRect.tag}</span>
                </div>
                <p className="text-gray-300">
                    <span className="font-mono">{hoveredRect.hours.toFixed(1)} hrs</span>
                    <span className="text-gray-400"> ({hoveredRect.percent.toFixed(1)}%)</span>
                </p>
            </div>
        )}

      </div>
    </div>
  );
};

export default TechTreemap;
