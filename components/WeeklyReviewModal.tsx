import React, { useMemo } from 'react';
import { LogEntry } from '../types';

interface WeeklyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastWeekLogs: LogEntry[];
}

const WeeklyReviewModal: React.FC<WeeklyReviewModalProps> = ({ isOpen, onClose, lastWeekLogs }) => {
  const stats = useMemo(() => {
    if (lastWeekLogs.length === 0) return null;

    const totalHours = lastWeekLogs.reduce((sum, log) => sum + log.hours, 0);

    const hoursByDay: { [key: number]: number } = {};
    lastWeekLogs.forEach(log => {
      const day = new Date(log.date + 'T00:00:00').getDay();
      hoursByDay[day] = (hoursByDay[day] || 0) + log.hours;
    });
    
    let busiestDayIndex = -1;
    let maxHours = -1;
    Object.entries(hoursByDay).forEach(([day, hours]) => {
      if (hours > maxHours) {
        maxHours = hours;
        busiestDayIndex = parseInt(day, 10);
      }
    });
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const busiestDay = busiestDayIndex > -1 ? days[busiestDayIndex] : 'N/A';
    
    const tagHours = new Map<string, number>();
    lastWeekLogs.forEach(log => {
      log.tags?.forEach(tag => {
        tagHours.set(tag, (tagHours.get(tag) || 0) + log.hours);
      });
    });
    const topTags = Array.from(tagHours.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
      
    return { totalHours, busiestDay, topTags };
  }, [lastWeekLogs]);
  
  const getMotivationalMessage = (hours: number) => {
    if (hours >= 20) return "Incredible week! You're on fire. 🔥";
    if (hours >= 10) return "Great job! Your consistency is paying off. ✨";
    if (hours > 0) return "Well done! Keep building that momentum. 🚀";
    return "A fresh start to a new week! Let's get it. 💪";
  }

  if (!isOpen || !stats) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-gray-900/60 border border-white/10 rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md transform transition-transform duration-300 scale-95" 
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Your Weekly Review</h2>
            <p className="text-sm text-gray-300 mb-6">Here's how you did last week!</p>
        </div>
        
        <div className="space-y-4">
            <div className="bg-black/20 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-300">Total Hours Coded</p>
                <p className="text-4xl font-bold text-white">{stats.totalHours.toFixed(1)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-300">Busiest Day</p>
                    <p className="text-xl font-semibold text-white">{stats.busiestDay}</p>
                </div>
                 <div className="bg-black/20 p-4 rounded-lg">
                    <p className="text-sm text-center text-gray-300 mb-2">Top Tech</p>
                    {stats.topTags.length > 0 ? (
                         <ul className="space-y-1 text-sm text-center">
                            {stats.topTags.map(([tag, hours]) => (
                                <li key={tag} className="text-gray-200">{tag}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-400 text-sm pt-1">No tags used.</p>
                    )}
                </div>
            </div>
             <div className="text-center pt-4">
                <p className="italic text-gray-300">{getMotivationalMessage(stats.totalHours)}</p>
            </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <button onClick={onClose} className="px-6 py-2 rounded-lg bg-white text-black font-semibold transition-colors duration-200 hover:bg-gray-200">
            Start New Week
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReviewModal;