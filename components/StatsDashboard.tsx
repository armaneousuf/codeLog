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
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
                Edit Goals
            </button>
       </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-center">
        <div>
          <p className="text-gray-400 text-sm">Current Streak</p>
          <p className="text-3xl font-bold text-white">
            <span role="img" aria-label="fire">🔥</span> {currentStreak}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Longest Streak</p>
          <p className="text-3xl font-bold text-white">
            <span role="img" aria-label="trophy">🏆</span> {longestStreak}
          </p>
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