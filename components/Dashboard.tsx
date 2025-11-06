import React from 'react';
import { Goals } from '../types';
import StatCard from './StatCard';
import StreakCard from './StreakCard';
import PerformanceIndicator from './PerformanceIndicator';

interface DashboardProps {
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
  todayHours: number;
  yesterdayHours: number;
  thisWeekHours: number;
  lastWeekHours: number;
  thisMonthHours: number;
  lastMonthHours: number;
}


const Dashboard: React.FC<DashboardProps> = ({ 
  weeklyTotal, 
  monthlyTotal, 
  yearlyTotal, 
  goals, 
  onEditGoals, 
  currentStreak, 
  longestStreak,
  mostUsedTechWeek,
  mostUsedTechMonth,
  mostUsedTechYear,
  todayHours,
  yesterdayHours,
  thisWeekHours,
  lastWeekHours,
  thisMonthHours,
  lastMonthHours
}) => {
  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6 h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Command Center</h2>
        <button 
          onClick={onEditGoals}
          className="text-sm text-gray-300 hover:text-white transition-colors font-medium px-3 py-1 rounded-md hover:bg-white/10"
        >
          Edit Goals
        </button>
       </div>

      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="sm:col-span-2 lg:col-span-1">
            <StreakCard title="Current Streak" value={currentStreak} isPrimary />
        </div>
        <StreakCard title="Longest Streak" value={longestStreak} />
        
        <div className="bg-black/20 rounded-xl p-4 flex flex-col justify-between">
            <h3 className="text-gray-300 text-sm font-medium mb-2 text-center">Momentum</h3>
            <div className="flex-grow flex flex-col justify-around gap-2">
                <PerformanceIndicator title="Daily" current={todayHours} previous={yesterdayHours} />
                <PerformanceIndicator title="Weekly" current={thisWeekHours} previous={lastWeekHours} />
                <PerformanceIndicator title="Monthly" current={thisMonthHours} previous={lastMonthHours} />
            </div>
        </div>

        <StatCard title="This Week" currentHours={weeklyTotal} goalHours={goals.weekly} colorTag={mostUsedTechWeek} />
        <StatCard title="This Month" currentHours={monthlyTotal} goalHours={goals.monthly} colorTag={mostUsedTechMonth} />
        <StatCard title="This Year" currentHours={yearlyTotal} goalHours={goals.yearly} colorTag={mostUsedTechYear} />
      </div>
    </div>
  );
};

export default Dashboard;
