import React, { useState, useEffect, useRef } from 'react';
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
  const [hours, setHours] = useState('');
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const justSaved = useRef(false);

  useEffect(() => {
    if (justSaved.current) {
      justSaved.current = false;
      return;
    }
    const existingLog = logs.find(log => log.date === date);
    setHours(existingLog ? String(existingLog.hours) : '');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hoursNum = parseFloat(hours) || 0;
    
    if (date) {
      onAddLog({ date, hours: hoursNum, note, tags: selectedTags });
      justSaved.current = true;
    }
  };
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag].sort()
    );
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Log Your Hours</h2>
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
        </div>
        <div>
          <label htmlFor="hours" className="block text-sm font-medium text-gray-400 mb-1">Hours Coded</label>
          <input
            type="number"
            id="hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
            placeholder="e.g., 4.5"
            step="0.1"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-400 mb-1">Note (Optional)</label>
          <textarea
            id="note"
            rows={3}
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
            <div className="mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div className="p-2 grid grid-cols-2 gap-2">
                {TECHNOLOGIES.map(tech => (
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
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2.5 py-1 bg-mint-800 text-mint-100 text-xs font-medium rounded-full">
                {tag}
                <button type="button" onClick={() => handleTagToggle(tag)} className="ml-1.5 text-mint-200 hover:text-white">
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-mint-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-mint-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-mint-500 transition-colors duration-200"
          >
            Save Log
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogForm;
