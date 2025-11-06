import React, { useState } from 'react';
import { LogEntry, Goals, UnlockedAchievements } from '../types';
import LogHistory from './LogHistory';
import DataManagement from './DataManagement';

interface AdvancedControlsProps {
  logs: LogEntry[];
  goals: Goals;
  unlockedAchievements: UnlockedAchievements;
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  setGoals: React.Dispatch<React.SetStateAction<Goals>>;
  setUnlockedAchievements: React.Dispatch<React.SetStateAction<UnlockedAchievements>>;
  onDateSelect: (date: string) => void;
  onDeleteLog: (date: string) => void;
}

const ChevronIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const AdvancedControls: React.FC<AdvancedControlsProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 sm:p-6 text-left"
        aria-expanded={isOpen}
      >
        <h2 className="text-xl font-bold text-white">History &amp; Data</h2>
        <ChevronIcon className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out grid ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
            <div className="p-4 sm:p-6 pt-0 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                <LogHistory
                    logs={props.logs}
                    onDateSelect={props.onDateSelect}
                    onDeleteLog={props.onDeleteLog}
                />
                <DataManagement
                    logs={props.logs}
                    goals={props.goals}
                    unlockedAchievements={props.unlockedAchievements}
                    setLogs={props.setLogs}
                    setGoals={props.setGoals}
                    setUnlockedAchievements={props.setUnlockedAchievements}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedControls;