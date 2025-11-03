import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LogEntry } from '../types';
import { TECHNOLOGIES } from '../lib/technologies';

interface LogFormProps {
  onAddLog: (log: LogEntry) => void;
  logs: LogEntry[];
  date: string;
  onDateChange: (date: string) => void;
}

const LogForm: React.FC<LogFormProps> = ({ onAddLog, logs, date, onDateChange }) => {
  const today = new Date().toISOString().split('T')[0];
  const [h, setH] = useState('');
  const [m, setM] = useState('');
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState('');

  const justSaved = useRef(false);

  useEffect(() => {
    if (justSaved.current) {
      justSaved.current = false;
      return;
    }
    const existingLog = logs.find(log => log.date === date);
    if (existingLog) {
        const totalHours = existingLog.hours;
        const hoursPart = Math.floor(totalHours);
        const minutesPart = Math.round((totalHours - hoursPart) * 60);
        setH(hoursPart > 0 ? String(hoursPart) : '');
        setM(minutesPart > 0 ? String(minutesPart) : '');
    } else {
        setH('');
        setM('');
    }
    setNote(existingLog?.note || '');
    setSelectedTags(existingLog?.tags || []);
  }, [date, logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hoursNum = parseInt(h, 10) || 0;
    const minutesNum = parseInt(m, 10) || 0;
    const totalHours = hoursNum + (minutesNum / 60);
    
    if (date) {
      onAddLog({ 
        date, 
        hours: totalHours, 
        note, 
        tags: selectedTags,
      });
      justSaved.current = true;
      
      const nextDay = new Date(date + 'T00:00:00');
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayString = nextDay.toISOString().split('T')[0];
      
      if(nextDay <= new Date()) {
        onDateChange(nextDayString);
      }
      
      setH('');
      setM('');
      setNote('');
      setSelectedTags([]);
      setTagSearch('');
    }
  };
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag].sort()
    );
  };

  const filteredTechnologies = useMemo(() => {
    return TECHNOLOGIES
      .filter(tech => tech.toLowerCase().includes(tagSearch.toLowerCase()))
      .sort((a, b) => {
        const aIsSelected = selectedTags.includes(a);
        const bIsSelected = selectedTags.includes(b);
        if (aIsSelected === bIsSelected) return a.localeCompare(b);
        return aIsSelected ? -1 : 1;
      });
  }, [tagSearch, selectedTags]);

  return (
    <div className="bg-gray-950/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:border-white/20">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Log Your Hours</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-1">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full bg-gray-900/50 border border-white/10 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-mint-400"
            max={today}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Time Coded</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                id="hours"
                value={h}
                onChange={(e) => setH(e.target.value)}
                className="w-full bg-gray-900/50 border border-white/10 rounded-md pl-3 pr-10 py-2 text-white focus:ring-2 focus:ring-mint-400"
                placeholder="Hours"
                min="0"
                aria-label="Hours coded"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none">hr</span>
            </div>
            <div className="relative flex-1">
              <input
                type="number"
                id="minutes"
                value={m}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || (Number(val) >= 0 && Number(val) <= 59 && !val.includes('.'))) {
                    setM(val);
                  }
                }}
                className="w-full bg-gray-900/50 border border-white/10 rounded-md pl-3 pr-10 py-2 text-white focus:ring-2 focus:ring-mint-400"
                placeholder="Mins"
                min="0"
                max="59"
                step="1"
                aria-label="Minutes coded"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none">min</span>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-400 mb-1">Note (Optional)</label>
          <textarea
            id="note"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-gray-900/50 border border-white/10 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-mint-400"
            placeholder="What did you work on?"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Technologies (Optional)</label>
          <div className="bg-gray-900/50 border border-white/10 rounded-md p-2">
            <input
                type="text"
                placeholder="Search technologies..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="w-full bg-gray-800 border border-white/10 rounded-md px-3 py-1.5 text-white focus:ring-2 focus:ring-mint-400 text-sm mb-2"
            />
            <div className="max-h-36 overflow-y-auto pr-1">
              <div className="flex flex-wrap gap-2">
                {filteredTechnologies.map(tech => (
                  <button
                    type="button"
                    key={tech}
                    onClick={() => handleTagToggle(tech)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${selectedTags.includes(tech) ? 'bg-mint-500 text-white' : 'bg-gray-700/70 hover:bg-gray-600 text-gray-300'}`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-mint-600 to-mint-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-mint-500 hover:to-mint-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-mint-500 transition-all duration-300 transform hover:scale-105"
          >
            Save Log
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogForm;