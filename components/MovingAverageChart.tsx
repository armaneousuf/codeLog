import React, { useMemo, useState } from 'react';
import { LogEntry } from '../types';
import { TECHNOLOGY_COLORS } from '../lib/techColors';

interface TechConstellationProps {
  logs: LogEntry[];
}

const FALLBACK_COLORS = [ '#f97316', '#ec4899', '#8b5cf6', '#ef4444', '#f59e0b', '#22c55e', '#06b6d4', '#6366f1' ];
const getTagColor = (tag: string): string => {
    if (TECHNOLOGY_COLORS[tag]) return TECHNOLOGY_COLORS[tag];
    let hash = 0;
    for (let i = 0; i < tag.length; i++) hash = ((hash << 5) - hash) + tag.charCodeAt(i);
    return FALLBACK_COLORS[Math.abs(hash % FALLBACK_COLORS.length)];
};

interface Star {
  id: string;
  label: string;
  hours: number;
  color: string;
  x: number;
  y: number;
  radius: number;
}

const TechConstellation: React.FC<TechConstellationProps> = ({ logs }) => {
  const [hoveredStar, setHoveredStar] = useState<Star | null>(null);

  const stars = useMemo<Star[]>(() => {
    const tagHours = new Map<string, number>();
    logs.forEach(log => {
      (log.techBreakdown || []).forEach(tech => {
        tagHours.set(tech.tag, (tagHours.get(tech.tag) || 0) + tech.hours);
      });
    });

    const sortedTags = Array.from(tagHours.entries())
      .filter(([, hours]) => hours > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25);

    if (sortedTags.length === 0) return [];

    const maxHours = sortedTags[0][1];
    
    const width = 500;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    const MIN_RADIUS = 5;
    const MAX_RADIUS = 50;

    const starData: Star[] = [];

    const [centralTag, centralHours] = sortedTags[0];
    starData.push({
      id: centralTag,
      label: centralTag,
      hours: centralHours,
      color: getTagColor(centralTag),
      x: centerX,
      y: centerY,
      radius: MAX_RADIUS,
    });

    const orbitingTags = sortedTags.slice(1);
    const orbitCount = 2;
    const baseOrbitRadius = (Math.min(width, height) / 2) * 0.45;
    
    let tagIdx = 0;
    for (let i = 0; i < orbitCount && tagIdx < orbitingTags.length; i++) {
        const orbitRadius = baseOrbitRadius + (i * 65);
        const remainingOrbits = orbitCount - i;
        const remainingTags = orbitingTags.length - tagIdx;
        const tagsOnThisOrbitCount = Math.ceil(remainingTags / remainingOrbits);
        
        const tagsForThisOrbit = orbitingTags.slice(tagIdx, tagIdx + tagsOnThisOrbitCount);

        tagsForThisOrbit.forEach(([tag, hours], index) => {
            const angle = (index / tagsForThisOrbit.length) * 2 * Math.PI + (Math.random() - 0.5) * 0.3;
            const radiusJitter = orbitRadius * (1 + (Math.random() - 0.5) * 0.15);

            starData.push({
                id: tag,
                label: tag,
                hours: hours,
                color: getTagColor(tag),
                x: centerX + radiusJitter * Math.cos(angle),
                y: centerY + radiusJitter * Math.sin(angle),
                radius: MIN_RADIUS + (Math.sqrt(hours / maxHours)) * (MAX_RADIUS - MIN_RADIUS) * 0.8
            });
        });
        
        tagIdx += tagsOnThisOrbitCount;
    }
    
    return starData;
  }, [logs]);

  if (stars.length === 0) {
    return (
      <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6 h-full flex flex-col justify-center items-center min-h-[400px]">
        <h2 className="text-xl font-semibold text-white mb-2">Tech Constellation</h2>
        <p className="text-sm text-gray-400 text-center">Log your hours to build your personal technology constellation.</p>
      </div>
    );
  }

  const centralStar = stars[0];

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-white mb-1">Tech Constellation</h2>
      <p className="text-sm text-gray-300 -mt-1 mb-4">Your personal map of technologies explored.</p>
      
      <div className="relative aspect-[5/4] w-full" onMouseLeave={() => setHoveredStar(null)}>
        <svg viewBox="0 0 500 400" className="w-full h-full">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {stars.slice(1).map((star) => (
             <line
                key={`${star.id}-line`}
                x1={centralStar.x}
                y1={centralStar.y}
                x2={star.x}
                y2={star.y}
                stroke={hoveredStar?.id === star.id || hoveredStar?.id === centralStar.id ? star.color : 'rgba(107, 114, 128, 0.3)'}
                strokeWidth="0.5"
                strokeDasharray="2 2"
                className="transition-all duration-300"
             />
          ))}

          {stars.map((star) => (
            <g 
                key={star.id} 
                onMouseEnter={() => setHoveredStar(star)} 
                className="cursor-pointer"
            >
              <circle
                cx={star.x}
                cy={star.y}
                r={star.radius}
                fill={star.color}
                className="transition-all duration-300"
                style={{ 
                  transformOrigin: `${star.x}px ${star.y}px`, 
                  transform: hoveredStar?.id === star.id ? 'scale(1.1)' : 'scale(1)',
                  filter: hoveredStar?.id === star.id ? 'url(#glow)' : 'none'
                }}
              />
            </g>
          ))}
          {stars.map(star => star.radius > 12 && (
             <text
                key={`${star.id}-label`}
                x={star.x}
                y={star.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize={star.radius * 0.4}
                className="font-semibold pointer-events-none"
                style={{ textShadow: '0 0 3px black' }}
             >
                {star.label}
             </text>
          ))}
        </svg>

        {hoveredStar && (
            <div 
              className="absolute bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg p-2 text-xs pointer-events-none transition-opacity duration-200 shadow-2xl z-10"
              style={{
                 left: `${hoveredStar.x}px`,
                 top: `${hoveredStar.y}px`,
                 transform: `translate(15px, -100%)`,
              }}
            >
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: hoveredStar.color }}/>
                    <span className="font-bold text-white">{hoveredStar.label}</span>
                </div>
                <p className="text-gray-300">
                    <span className="font-mono">{hoveredStar.hours.toFixed(1)} hrs</span>
                </p>
            </div>
        )}

      </div>
    </div>
  );
};

export default TechConstellation;