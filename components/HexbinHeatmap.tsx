
import React from 'react';
import { LogEntry } from '../types';
import { formatDuration } from '../lib/utils';

interface HexbinHeatmapProps {
  logs: LogEntry[];
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
};

// --- Hexagon Math (Flat-Top) ---
const HEX_RADIUS = 10;
const HEX_WIDTH = 2 * HEX_RADIUS;
const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS;
const HORIZONTAL_SPACING_FACTOR = 0.75;
const HORIZONTAL_MARGIN = 20;
const VERTICAL_MARGIN = 30;

const getHexPoints = (cx: number, cy: number): string => {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle_deg = 60 * i; // flat-top
    const angle_rad = (Math.PI / 180) * angle_deg;
    points.push(`${cx + HEX_RADIUS * Math.cos(angle_rad)},${cy + HEX_RADIUS * Math.sin(angle_rad)}`);
  }
  return points.join(' ');
};
// --- End Hexagon Math ---


const HexbinHeatmap: React.FC<HexbinHeatmapProps> = ({ logs }) => {
  const logsMap = new Map<string, LogEntry>(logs.map(log => [log.date, log]));

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);
  startDate.setDate(startDate.getDate() + 1);

  const days: Date[] = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const startDayOfWeek = (startDate.getDay() + 6) % 7; // Monday = 0, Sunday = 6

  const getColor = (hours: number | undefined) => {
    if (hours === undefined || hours <= 0) return 'fill-gray-800/50';
    if (hours <= 1.5) return 'fill-violet-900';
    if (hours <= 3) return 'fill-violet-800';
    if (hours <= 4.5) return 'fill-violet-700';
    if (hours <= 6) return 'fill-violet-600';
    if (hours <= 7.5) return 'fill-violet-500';
    return 'fill-violet-400';
  };
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthLabels = [];
  let lastMonth = -1;
  
  const totalWeeks = Math.ceil((days.length + startDayOfWeek) / 7);

  for (let i = 0; i < totalWeeks; i++) {
    const dayIndexInWeek = i * 7 - startDayOfWeek;
    if(days[dayIndexInWeek]) {
        const month = days[dayIndexInWeek].getMonth();
        if (month !== lastMonth) {
            if (monthLabels.length === 0 || i > monthLabels[monthLabels.length-1].index + 3) {
                monthLabels.push({ label: monthNames[month], index: i });
            }
            lastMonth = month;
        }
    }
  }

  const svgWidth = totalWeeks * HEX_WIDTH * HORIZONTAL_SPACING_FACTOR + HORIZONTAL_MARGIN * 2;
  const svgHeight = 7 * HEX_HEIGHT + VERTICAL_MARGIN * 2 + HEX_HEIGHT/2;


  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-2 sm:p-4 md:p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Contribution Hexmap</h2>
      <div className="flex">
        <div className="flex flex-col text-xs text-gray-400 pr-4 space-y-3 justify-around pt-10">
            <span>Mon</span>
            <span className="h-full"></span>
            <span>Wed</span>
            <span className="h-full"></span>
            <span>Fri</span>
            <span className="h-full"></span>
        </div>
        <div className="flex-1 overflow-x-auto pb-2 min-w-0">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="min-w-[850px]">
                {/* Month Labels */}
                {monthLabels.map((month) => {
                    const xPos = month.index * HEX_WIDTH * HORIZONTAL_SPACING_FACTOR + HORIZONTAL_MARGIN;
                    return (
                        <text key={month.label} x={xPos} y={VERTICAL_MARGIN - 10} className="text-xs fill-current text-gray-400">
                            {month.label}
                        </text>
                    );
                })}

                {/* Hexagons */}
                {days.map((day, index) => {
                    const dateString = day.toISOString().split('T')[0];
                    const dayOfWeek = (day.getDay() + 6) % 7; // Monday = 0
                    
                    const weekNum = Math.floor((index + startDayOfWeek) / 7);

                    const cx = HORIZONTAL_MARGIN + weekNum * HEX_WIDTH * HORIZONTAL_SPACING_FACTOR;
                    const cy = VERTICAL_MARGIN + dayOfWeek * HEX_HEIGHT + (weekNum % 2 === 1 ? HEX_HEIGHT / 2 : 0);

                    const logEntry = logsMap.get(dateString);
                    const hours = logEntry?.hours;
                    
                    return (
                        <g 
                          key={dateString}
                          className="group cursor-pointer"
                        >
                            <polygon
                                points={getHexPoints(cx, cy)}
                                className={`${getColor(hours)} transition-opacity duration-150 group-hover:opacity-75`}
                                stroke="rgba(255, 255, 255, 0.08)"
                                strokeWidth="1"
                            />
                            <title>{`${hours ? `${formatDuration(hours)}` : 'No activity'} on ${formatDate(day)}`}</title>
                        </g>
                    );
                })}
            </svg>
        </div>
      </div>
      <div className="flex justify-end items-center mt-4 space-x-2 text-xs text-gray-400">
        <span>Less</span>
        <div className="w-3 h-3 bg-gray-800/50 rounded-sm"></div>
        <div className="w-3 h-3 bg-violet-900 rounded-sm"></div>
        <div className="w-3 h-3 bg-violet-700 rounded-sm"></div>
        <div className="w-3 h-3 bg-violet-500 rounded-sm"></div>
        <div className="w-3 h-3 bg-violet-400 rounded-sm"></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default HexbinHeatmap;
