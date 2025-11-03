import React from 'react';

interface AchievementsProps {
  unlockedCount: number;
  totalCount: number;
  onView: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ unlockedCount, totalCount, onView }) => {
  const percentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Achievements</h2>
        <button 
          onClick={onView}
          className="text-sm text-gray-300 hover:text-white transition-colors font-medium px-3 py-1 rounded-md hover:bg-white/10"
        >
          View All
        </button>
      </div>
      <div className="text-center mb-3">
        <p className="text-3xl font-bold text-white">
          <span role="img" aria-label="trophy">🏆</span> {unlockedCount} / {totalCount}
        </p>
        <p className="text-sm text-gray-300">Unlocked</p>
      </div>
      <div className="w-full bg-black/20 rounded-full h-2.5">
        <div 
          className="bg-violet-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Achievements;