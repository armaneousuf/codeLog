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
      setHours('');
      setNote('');
      setSelectedTags([]);
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
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 4.5"
            step="0.1"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full h-24 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="What did you work on?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Technologies</label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-left text-white flex justify-between items-center"
            >
              <span className={selectedTags.length === 0 ? 'text-gray-400' : ''}>
                {selectedTags.length > 0 ? `${selectedTags.length} selected` : 'Select technologies...'}
              </span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {TECHNOLOGIES.map(tech => (
                  <label key={tech} className="flex items-center px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded bg-gray-900 border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                      checked={selectedTags.includes(tech)}
                      onChange={() => handleTagToggle(tech)}
                    />
                    <span className="ml-3">{tech}</span>
                  </label>
                ))}
              </div>
            )}
            {selectedTags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <span key={tag} className="flex items-center bg-blue-900/50 text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className="ml-1.5 -mr-1 p-0.5 text-blue-300 hover:text-white rounded-full hover:bg-blue-800/50"
                      aria-label={`Remove ${tag}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors duration-200">
          Save Log
        </button>
      </form>
    </div>
  );
};

export default LogForm;