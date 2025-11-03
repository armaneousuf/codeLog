import React from 'react';
import { UnlockedAchievements } from '../types';
import { ALL_ACHIEVEMENTS } from '../lib/achievements';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedAchievements: UnlockedAchievements;
}

const AchievementCard: React.FC<{ achievement: typeof ALL_ACHIEVEMENTS[0]; isUnlocked: boolean; unlockedDate?: string; }> = ({ achievement, isUnlocked, unlockedDate }) => {
  const formattedDate = unlockedDate ? new Date(unlockedDate).toLocaleDateString('en-GB') : '';

  return (
    <div className={`group relative border rounded-lg p-4 flex flex-col items-center text-center transition-all duration-300 ${isUnlocked ? 'bg-gray-700/50 border-gray-500 shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20' : 'bg-black/20 border-gray-700 hover:border-gray-600 hover:bg-black/40'}`}>
        {isUnlocked && <div className="absolute top-2 right-2 text-white text-xs" title={`Unlocked on ${formattedDate}`}>✓</div>}
        <div className={`text-4xl mb-2 transition-transform duration-300 ${isUnlocked ? '' : 'grayscale group-hover:grayscale-0'}`}>{achievement.icon}</div>
        <h3 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-gray-300'}`}>{achievement.name}</h3>
        <p className={`text-xs mt-1 ${isUnlocked ? 'text-gray-200' : 'text-gray-400'}`}>{achievement.description}</p>
    </div>
  );
};


const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose, unlockedAchievements }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-gray-900/60 border border-white/10 rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-3xl transform transition-transform duration-300 scale-95 max-h-[90vh] flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">All Achievements</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto pr-2 -mr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {ALL_ACHIEVEMENTS.map(ach => (
                <AchievementCard 
                    key={ach.id} 
                    achievement={ach} 
                    isUnlocked={!!unlockedAchievements[ach.id]}
                    unlockedDate={unlockedAchievements[ach.id]?.date}
                />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;