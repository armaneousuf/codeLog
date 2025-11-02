import React from 'react';
import { Goals } from '../types';
import StatCard from './StatCard';

interface StatsDashboardProps {
  weeklyTotal: number;
  monthlyTotal: number;
  yearlyTotal: number;
  goals: Goals;
  onEditGoals: () => void;
  currentStreak: number;
  longestStreak: number;
}

const FireIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM10 18a1 1 0 01.707.293l2 2a1 1 0 11-1.414 1.414l-2-2A1 1 0 0110 18zm-7.707-4.293a1 1 0 010-1.414l2-2a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0zM10 4a1 1 0 01-1-1V1a1 1 0 112 0v2a1 1 0 01-1 1zm-4.293 2.293a1 1 0 011.414 0l2 2a1 1 0 11-1.414 1.414l-2-2a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 100 2h2.586l-2.293 2.293a1 1 0 000 1.414L15 12.414V15a1 1 0 01-1 1H6a1 1 0 01-1-1v-2.586l3.707-3.707a1 1 0 000-1.414L6.414 5H9a1 1 0 100-2H5a1 1 0 00-1 1v4a1 1 0 00.293.707l3 3-2 2A1 1 0 006 17h8a1 1 0 00.707-1.707l-2-2 3-3A1 1 0 0016 9V4a1 1 0 00-1-1h-4z" />
    </svg>
);


const StatsDashboard: React.FC<StatsDashboardProps> = ({ 
  weeklyTotal, 
  monthlyTotal, 
  yearlyTotal, 
  goals, 
  onEditGoals, 
  currentStreak, 
  longestStreak,
}) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-lg">
       <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-200">Stats</h2>
            <button 
                onClick={onEditGoals}
                className="text-sm text-mint-400 hover:text-mint-300 transition-colors"
            >
                Edit Goals
            </button>
       </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-center">
        <div className="flex flex-col items-center justify-center">
            <p className="text-gray-400 text-sm mb-1">Current Streak</p>
            <div className="flex items-center gap-2">
                <FireIcon />
                <p className="text-3xl font-bold text-white">{currentStreak}</p>
            </div>
        </div>
        <div className="flex flex-col items-center justify-center">
            <p className="text-gray-400 text-sm mb-1">Longest Streak</p>
            <div className="flex items-center gap-2">
                <TrophyIcon />
                <p className="text-3xl font-bold text-white">{longestStreak}</p>
            </div>
        </div>
      </div>
       
      <div className="space-y-6 mt-6 pt-6 border-t border-gray-800">
        <StatCard title="This Week" currentHours={weeklyTotal} goalHours={goals.weekly} />
        <StatCard title="This Month" currentHours={monthlyTotal} goalHours={goals.monthly} />
        <StatCard title="This Year" currentHours={yearlyTotal} goalHours={goals.yearly} />
      </div>
    </div>
  );
};

export default StatsDashboard;