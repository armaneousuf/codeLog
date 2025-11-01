import React, { useState, useEffect } from 'react';
import { ALL_ACHIEVEMENTS } from '../lib/achievements';

interface AchievementToastProps {
  newlyUnlocked: string[];
  onComplete: (id: string) => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ newlyUnlocked, onComplete }) => {
  const [visible, setVisible] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<(typeof ALL_ACHIEVEMENTS[0]) | null>(null);

  useEffect(() => {
    if (newlyUnlocked.length > 0 && !currentAchievement) {
      const nextId = newlyUnlocked[0];
      const achievement = ALL_ACHIEVEMENTS.find(a => a.id === nextId);
      if (achievement) {
        setCurrentAchievement(achievement);
        setVisible(true);
        
        const timer = setTimeout(() => {
          setVisible(false);
        }, 4000);
        
        const exitTimer = setTimeout(() => {
          setCurrentAchievement(null);
          onComplete(nextId);
        }, 4500);

        return () => {
          clearTimeout(timer);
          clearTimeout(exitTimer);
        };
      }
    }
  }, [newlyUnlocked, onComplete, currentAchievement]);

  if (!currentAchievement) {
    return null;
  }

  return (
    <div className={`fixed bottom-5 right-5 z-50 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      <div className="bg-gray-800 border border-amber-500/50 rounded-lg shadow-2xl p-4 flex items-center space-x-4 max-w-sm">
        <div className="text-3xl">{currentAchievement.icon}</div>
        <div>
          <p className="font-semibold text-amber-400">Achievement Unlocked!</p>
          <p className="text-sm text-gray-200">{currentAchievement.name}</p>
        </div>
      </div>
    </div>
  );
};

export default AchievementToast;
