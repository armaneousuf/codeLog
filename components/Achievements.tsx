import React from 'react';

interface AchievementsProps {
  unlockedCount: number;
  totalCount: number;
  onView: () => void;
}

const AchievementIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-8 h-8 text-violet-400" fill="currentColor">
    <path d="M500-560ZM200-120v-680h250q-5 20-8 40t-2 40H280v240h290l16 80h134v-46q20 0 40-3t40-9v138H520l-16-80H280v280h-80Zm491-516 139-138-42-42-97 95-39-39-42 43 81 81Zm29-290q83 0 141.5 58.5T920-726q0 83-58.5 141.5T720-526q-83 0-141.5-58.5T520-726q0-83 58.5-141.5T720-926Z"/>
  </svg>
);


const Achievements: React.FC<AchievementsProps> = ({ unlockedCount, totalCount, onView }) => {
  const percentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-4 sm:p-6">
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
        <p className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <AchievementIcon /> 
          <span>{unlockedCount} / {totalCount}</span>
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
