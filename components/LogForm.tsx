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
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const tagSearchInputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
      setTimeout(() => tagSearchInputRef.current?.focus(), 100);
    } else {
      setTagSearch('');
    }
  }, [isDropdownOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hoursNum = parseInt(h, 10) || 0;
    const minutesNum = parseInt(m, 10) || 0;
    const totalHours = hoursNum + (minutesNum / 60);
    
    if (date) {
      onAddLog({ date, hours: totalHours, note, tags: selectedTags });
      justSaved.current = true;
      
      // Clear form for next entry
      setH('');
      setM('');
      setNote('');
      setSelectedTags([]);
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
    <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-lg p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-200 mb-4">Log Your Hours</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-1">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
            max={today}
            required
          />
          {date && <p className="text-xs text-gray-500 mt-1 text-right" aria-live="polite">
            {new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>}
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
                className="w-full bg-gray-800 border border-gray-700 rounded-md pl-3 pr-10 py-2 text-white focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
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
                className="w-full bg-gray-800 border border-gray-700 rounded-md pl-3 pr-10 py-2 text-white focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
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
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
            placeholder="What did you work on?"
          />
        </div>
        
        <div ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-400 mb-1">Technologies (Optional)</label>
          <button type="button" onClick={() => setDropdownOpen(!isDropdownOpen)} className="w-full text-left bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-mint-500">
            {selectedTags.length > 0 ? `${selectedTags.length} selected` : 'Select technologies...'}
          </button>
          {isDropdownOpen && (
             <div className="mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 relative flex flex-col max-h-64">
              <div className="p-2 sticky top-0 bg-gray-800 z-10 border-b border-gray-700">
                <input
                    ref={tagSearchInputRef}
                    type="text"
                    placeholder="Search technologies..."
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-white focus:ring-2 focus:ring-mint-500 focus:border-mint-500 text-sm"
                />
              </div>
              <div className="overflow-y-auto">
                <div className="p-2 grid grid-cols-2 gap-2">
                  {filteredTechnologies.map(tech => (
                    <label key={tech} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tech)}
                        onChange={() => handleTagToggle(tech)}
                        className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-mint-600 focus:ring-mint-500"
                      />
                      <span className="text-sm text-gray-300">{tech}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2.5 py-1 bg-mint-800 text-mint-100 text-xs font-medium rounded-full">
                {tag}
                <button type="button" onClick={() => handleTagToggle(tag)} className="ml-1.5 text-mint-200 hover:text-white focus:outline-none">
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-mint-600 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-mint-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-mint-500 transition-all duration-300 transform hover:scale-105"
          >
            Save Log
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogForm;
