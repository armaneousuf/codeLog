import React from 'react';

interface AchievementsProps {
  unlockedCount: number;
  totalCount: number;
  onView: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ unlockedCount, totalCount, onView }) => {
  const percentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transition-colors hover:border-gray-600">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Achievements</h2>
        <button 
          onClick={onView}
          className="text-sm text-gray-300 hover:text-white transition-colors font-medium px-3 py-1 rounded-md hover:bg-gray-700"
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
      <div className="w-full bg-gray-900/50 rounded-full h-2.5">
        <div 
          className="bg-white h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Achievements;