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
  mostUsedTechWeek?: string;
  mostUsedTechMonth?: string;
  mostUsedTechYear?: string;
}

const StreakIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 -960 960 960" fill="currentColor">
      <path d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"/>
    </svg>
);

const LongestStreakIcon: React.FC = () => (
   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 -960 960 960" fill="currentColor">
      <path d="m280-80 160-300-320-40 480-460h80L520-580l320 40L360-80h-80Zm222-247 161-154-269-34 63-117-160 154 268 33-63 118Zm-22-153Z"/>
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
  mostUsedTechWeek,
  mostUsedTechMonth,
  mostUsedTechYear
}) => {
  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6 h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Dashboard</h2>
        <button 
          onClick={onEditGoals}
          className="text-sm text-gray-300 hover:text-white transition-colors font-medium px-3 py-1 rounded-md hover:bg-white/10"
        >
          Edit Goals
        </button>
       </div>

      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-black/20 rounded-xl p-6 flex flex-col justify-center items-center text-center transition-colors duration-300 hover:bg-black/40">
            <p className="text-gray-300 text-sm mb-2">Current Streak</p>
            <div className="flex items-center gap-3">
                <StreakIcon />
                <p className="text-5xl font-bold text-white">{currentStreak}</p>
            </div>
        </div>
        <div className="bg-black/20 rounded-xl p-6 flex flex-col justify-center items-center text-center transition-colors duration-300 hover:bg-black/40">
            <p className="text-gray-300 text-sm mb-2">Longest Streak</p>
            <div className="flex items-center gap-3">
                <LongestStreakIcon />
                <p className="text-5xl font-bold text-white">{longestStreak}</p>
            </div>
        </div>
        <div className="bg-black/20 rounded-xl p-6 sm:col-span-2 flex flex-col sm:flex-row justify-around items-center text-center gap-6">
          <StatCard title="This Week" currentHours={weeklyTotal} goalHours={goals.weekly} colorTag={mostUsedTechWeek} />
          <StatCard title="This Month" currentHours={monthlyTotal} goalHours={goals.monthly} colorTag={mostUsedTechMonth} />
          <StatCard title="This Year" currentHours={yearlyTotal} goalHours={goals.yearly} colorTag={mostUsedTechYear} />
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
