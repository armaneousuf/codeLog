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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0117.657 18.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1014.12 11.88a3 3 0 00-4.242 4.241zM12 18a6 6 0 00-6-6c0 2 1 5 6 5s6-3 6-5a6 6 0 00-6 6z" />
    </svg>
);

const TrophyIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
     <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.999l4.873.696a1 1 0 01.878 1.128l-.755 4.152a1 1 0 01-.966.768H4.97a1 1 0 01-.966-.768l-.755-4.152a1 1 0 01.878-1.128L8 3.999V2a1 1 0 01.7-1.046l2.6-.52a1 1 0 011.362.565l.038.085.038-.085a1 1 0 011.362-.565l2.6.52zM4 12h12v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" clipRule="evenodd" />
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
    <div className="bg-gray-950/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:border-white/20 h-full flex flex-col">
       <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-100">Dashboard</h2>
        <button 
          onClick={onEditGoals}
          className="text-sm text-mint-400 hover:text-mint-300 transition-colors font-medium"
        >
          Edit Goals
        </button>
       </div>

      <div className="flex-grow md:flex md:items-center md:justify-between md:gap-8">
        <div className="flex-1 grid grid-cols-2 gap-4 text-center border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8 mb-6 md:mb-0">
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-black/10 transition-transform duration-200 hover:scale-105">
              <p className="text-gray-400 text-sm mb-1">Current Streak</p>
              <div className="flex items-center gap-2">
                  <FireIcon />
                  <p className="text-3xl font-bold text-white">{currentStreak}</p>
              </div>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-black/10 transition-transform duration-200 hover:scale-105">
              <p className="text-gray-400 text-sm mb-1">Longest Streak</p>
              <div className="flex items-center gap-2">
                  <TrophyIcon />
                  <p className="text-3xl font-bold text-white">{longestStreak}</p>
              </div>
          </div>
        </div>
        <div className="flex-[2] grid grid-cols-3 gap-4 text-center">
          <StatCard title="This Week" currentHours={weeklyTotal} goalHours={goals.weekly} />
          <StatCard title="This Month" currentHours={monthlyTotal} goalHours={goals.monthly} />
          <StatCard title="This Year" currentHours={yearlyTotal} goalHours={goals.yearly} />
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;