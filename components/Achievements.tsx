import React from 'react';

interface AchievementsProps {
  unlockedCount: number;
  totalCount: number;
  onView: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ unlockedCount, totalCount, onView }) => {
  const percentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-gray-950/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-100">Achievements</h2>
        <button 
          onClick={onView}
          className="text-sm text-mint-400 hover:text-mint-300 transition-colors font-medium"
        >
          View All
        </button>
      </div>
      <div className="text-center mb-3">
        <p className="text-3xl font-bold text-white">
          <span role="img" aria-label="trophy">🏆</span> {unlockedCount} / {totalCount}
        </p>
        <p className="text-sm text-gray-400">Unlocked</p>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-amber-500 to-amber-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Achievements;