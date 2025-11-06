import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LogEntry, TechTime } from '../types';
import { TECHNOLOGIES } from '../lib/technologies';

interface LogFormProps {
  onAddLog: (log: LogEntry) => void;
  logs: LogEntry[];
  date: string;
  onDateChange: (date: string) => void;
}

const LogForm: React.FC<LogFormProps> = ({ onAddLog, logs, date, onDateChange }) => {
  const today = new Date().toISOString().split('T')[0];
  const [tagSearch, setTagSearch] = useState('');
  const [breakdown, setBreakdown] = useState<{ tag: string; h: string; m: string }[]>([]);

  const justSaved = useRef(false);

  useEffect(() => {
    if (justSaved.current) {
      justSaved.current = false;
      return;
    }
    const existingLog = logs.find(log => log.date === date);
    if (existingLog) {
      if (existingLog.techBreakdown) {
        // New format with detailed breakdown
        const newBreakdown = existingLog.techBreakdown.map(tech => {
          const totalHours = tech.hours;
          const hoursPart = Math.floor(totalHours);
          const minutesPart = Math.round((totalHours - hoursPart) * 60);
          return {
            tag: tech.tag,
            h: hoursPart > 0 ? String(hoursPart) : '',
            m: minutesPart > 0 ? String(minutesPart) : '',
          };
        });
        setBreakdown(newBreakdown);
      } else if (existingLog.tags) {
        // Old format, prompt user to fill times
        const newBreakdown = existingLog.tags.map(tag => ({
          tag,
          h: '',
          m: '',
        }));
        setBreakdown(newBreakdown);
      } else {
        setBreakdown([]);
      }
    } else {
      setBreakdown([]);
    }
  }, [date, logs]);

  const totalHours = useMemo(() => {
    return breakdown.reduce((sum, { h, m }) => {
        const hoursNum = parseFloat(h) || 0;
        const minutesNum = parseInt(m, 10) || 0;
        return sum + hoursNum + (minutesNum / 60);
    }, 0);
  }, [breakdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (totalHours === 0) {
      return; // Do not save an empty log
    }
    
    const techBreakdown: TechTime[] = breakdown
      .map(({ tag, h, m }) => {
        const hoursNum = parseFloat(h) || 0; // Use parseFloat for consistency
        const minutesNum = parseInt(m, 10) || 0;
        const calculatedHours = hoursNum + (minutesNum / 60);
        return { tag, hours: calculatedHours };
      })
      .filter(item => item.hours > 0);

    const finalTotalHours = techBreakdown.reduce((sum, item) => sum + item.hours, 0);
    
    if (date) {
      onAddLog({ 
        date, 
        hours: finalTotalHours, 
        techBreakdown,
      });
      justSaved.current = true;
      
      const nextDay = new Date(date + 'T00:00:00');
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayString = nextDay.toISOString().split('T')[0];
      
      if(nextDay <= new Date()) {
        onDateChange(nextDayString);
      }
      
      setBreakdown([]);
      setTagSearch('');
    }
  };
  
  const handleTagAdd = (tag: string) => {
    if (!breakdown.some(item => item.tag === tag)) {
      setBreakdown(prev => [...prev, { tag, h: '', m: '' }].sort((a,b) => a.tag.localeCompare(b.tag)));
    }
    setTagSearch('');
  };

  const handleTagRemove = (tagToRemove: string) => {
    setBreakdown(prev => prev.filter(item => item.tag !== tagToRemove));
  };
  
  const handleTimeChange = (tag: string, unit: 'h' | 'm', value: string) => {
    setBreakdown(prev => prev.map(item => {
      if (item.tag === tag) {
        if (unit === 'm') {
          // Allow empty, or numbers between 0 and 59
          if (value === '' || (Number(value) >= 0 && Number(value) <= 59 && !value.includes('.'))) {
            return { ...item, [unit]: value };
          }
          return item;
        }
        // Allow any non-negative number for hours
        if (value === '' || Number(value) >= 0) {
            return { ...item, [unit]: value };
        }
        return item;
      }
      return item;
    }));
  };

  const handleTimePreset = (tag: string, minutesToAdd: number) => {
    setBreakdown(prev => prev.map(item => {
        if (item.tag === tag) {
            const currentHours = parseInt(item.h, 10) || 0;
            const currentMinutes = parseInt(item.m, 10) || 0;
            let totalMinutes = (currentHours * 60) + currentMinutes + minutesToAdd;
            
            const newHours = Math.floor(totalMinutes / 60);
            const newMinutes = totalMinutes % 60;

            return { ...item, h: String(newHours), m: String(newMinutes) };
        }
        return item;
    }));
  };

  const selectedTags = useMemo(() => breakdown.map(item => item.tag), [breakdown]);

  const filteredTechnologies = useMemo(() => {
    return TECHNOLOGIES
      .filter(tech => tech.toLowerCase().includes(tagSearch.toLowerCase()))
      .filter(tech => !selectedTags.includes(tech)) // Exclude already added tags
      .sort();
  }, [tagSearch, selectedTags]);

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Log Your Hours</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            max={today}
            required
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Time & Tech Breakdown</label>
            <div className="bg-black/30 border border-gray-700 rounded-lg p-2 space-y-3">
                <input
                    type="text"
                    placeholder="Search to add technology..."
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-1.5 text-white focus:ring-2 focus:ring-violet-500 text-sm"
                />
                {tagSearch && (
                    <div className="max-h-36 overflow-y-auto pr-2">
                        <div className="flex flex-wrap gap-2">
                            {filteredTechnologies.map(tech => (
                                <button
                                    type="button"
                                    key={tech}
                                    onClick={() => handleTagAdd(tech)}
                                    className="px-2.5 py-1 text-xs font-medium rounded-full transition-colors bg-gray-700 hover:bg-gray-600 text-gray-200"
                                >
                                    + {tech}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-2 pr-1 max-h-48 overflow-y-auto">
                    {breakdown.map(({tag, h, m}) => (
                        <div key={tag} className="bg-gray-900/50 p-3 rounded-lg">
                            <div className="flex flex-wrap items-center gap-2">
                                <button type="button" onClick={() => handleTagRemove(tag)} className="text-red-400 hover:text-red-300 rounded-full w-5 h-5 flex items-center justify-center bg-red-900/30 hover:bg-red-900/60 transition-colors">&times;</button>
                                <span className="flex-grow font-medium text-sm text-gray-100 truncate" title={tag}>{tag}</span>
                                <div className="flex items-center gap-1.5">
                                    <input type="number" value={h} onChange={e => handleTimeChange(tag, 'h', e.target.value)} placeholder="H" min="0" className="w-16 bg-black/40 border border-gray-600 rounded-md px-2 py-1 text-white text-sm" />
                                    <span className="text-gray-400 text-sm">hr</span>
                                    <input type="number" value={m} onChange={e => handleTimeChange(tag, 'm', e.target.value)} placeholder="M" min="0" max="59" step="1" className="w-16 bg-black/40 border border-gray-600 rounded-md px-2 py-1 text-white text-sm" />
                                    <span className="text-gray-400 text-sm">min</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-white/5">
                                <button type="button" onClick={() => handleTimePreset(tag, 15)} className="text-xs font-semibold px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">+15m</button>
                                <button type="button" onClick={() => handleTimePreset(tag, 30)} className="text-xs font-semibold px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">+30m</button>
                                <button type="button" onClick={() => handleTimePreset(tag, 60)} className="text-xs font-semibold px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">+1h</button>
                            </div>
                        </div>
                    ))}
                    {breakdown.length === 0 && <p className="text-center text-xs text-gray-400 py-2">Add a technology to begin logging time.</p>}
                </div>
            </div>
        </div>
        
        <div className="text-right text-gray-200">
            Total: <span className="font-bold text-lg">{totalHours.toFixed(2)}</span> hours
        </div>

        <div>
          <button
            type="submit"
            disabled={totalHours === 0}
            className="w-full bg-violet-600 text-white font-semibold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-violet-500 transition-all duration-200 hover:bg-violet-700 hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Save Log
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogForm;