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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6c0-2.346 2.02-4.24 4.5-4.24 1.11 0 2.133.41 2.942 1.092z" />
    </svg>
);

const TrophyIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
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
    <div className="bg-gray-900/60 backdrop-blur-lg border border-white/5 rounded-xl shadow-2xl p-6 transition-all duration-300 hover:border-white/10 hover:shadow-mint-500/10 h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Dashboard</h2>
        <button 
          onClick={onEditGoals}
          className="text-sm text-mint-400 hover:text-mint-300 transition-colors font-medium"
        >
          Edit Goals
        </button>
       </div>

      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-800/60 rounded-xl p-6 flex flex-col justify-center items-center text-center transition-all duration-300 hover:bg-gray-800/80 hover:scale-[1.02] hover:shadow-lg">
            <p className="text-gray-400 text-sm mb-2">Current Streak</p>
            <div className="flex items-center gap-3">
                <FireIcon />
                <p className="text-5xl font-bold text-white">{currentStreak}</p>
            </div>
        </div>
        <div className="bg-gray-800/60 rounded-xl p-6 flex flex-col justify-center items-center text-center transition-all duration-300 hover:bg-gray-800/80 hover:scale-[1.02] hover:shadow-lg">
            <p className="text-gray-400 text-sm mb-2">Longest Streak</p>
            <div className="flex items-center gap-3">
                <TrophyIcon />
                <p className="text-5xl font-bold text-white">{longestStreak}</p>
            </div>
        </div>
        <div className="bg-gray-800/60 rounded-xl p-6 sm:col-span-2 flex flex-col sm:flex-row justify-around items-center text-center gap-6">
          <StatCard title="This Week" currentHours={weeklyTotal} goalHours={goals.weekly} />
          <StatCard title="This Month" currentHours={monthlyTotal} goalHours={goals.monthly} />
          <StatCard title="This Year" currentHours={yearlyTotal} goalHours={goals.yearly} />
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;