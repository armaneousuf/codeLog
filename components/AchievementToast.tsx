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
    if (newlyUnlocked.length === 0 || currentAchievement) {
      return;
    }
    const nextId = newlyUnlocked[0];
    const achievement = ALL_ACHIEVEMENTS.find(a => a.id === nextId);
    if (achievement) {
      setCurrentAchievement(achievement);
    }
  }, [newlyUnlocked, currentAchievement]);

  useEffect(() => {
    if (currentAchievement) {
      setVisible(true);
      const visibilityTimer = setTimeout(() => {
        setVisible(false);
      }, 4000);

      const completionTimer = setTimeout(() => {
        onComplete(currentAchievement.id); 
        setCurrentAchievement(null);
      }, 4500);

      return () => {
        clearTimeout(visibilityTimer);
        clearTimeout(completionTimer);
      };
    }
  }, [currentAchievement, onComplete]);


  if (!currentAchievement) {
    return null;
  }

  return (
    <div className={`fixed bottom-5 right-5 z-50 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      <div className="relative bg-gray-800 border border-amber-500/50 rounded-lg shadow-2xl p-4 flex items-center space-x-4 max-w-sm overflow-hidden backdrop-blur-sm bg-opacity-80">
        <div className="text-3xl animate-pulse">{currentAchievement.icon}</div>
        <div>
          <p className="font-semibold text-amber-400">Achievement Unlocked!</p>
          <p className="text-sm text-gray-200">{currentAchievement.name}</p>
        </div>
        <div className="absolute bottom-0 left-0 h-1 bg-amber-400/70 animate-progress"></div>
      </div>
    </div>
  );
};

export default AchievementToast;