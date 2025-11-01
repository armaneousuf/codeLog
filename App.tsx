import React, { useState, useMemo, useEffect } from 'react';
import { LogEntry, Goals, UnlockedAchievements } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import LogForm from './components/LogForm';
import StatsDashboard from './components/StatsDashboard';
import Heatmap from './components/Heatmap';
import GoalsModal from './components/GoalsModal';
import TagAnalysis from './components/TagAnalysis';
import DataManagement from './components/DataManagement';
import ProductivityChart from './components/ProductivityChart';
import Achievements from './components/Achievements';
import AchievementsModal from './components/AchievementsModal';
import AchievementToast from './components/AchievementToast';
import { ALL_ACHIEVEMENTS } from './lib/achievements';

const App: React.FC = () => {
  const [logs, setLogs] = useLocalStorage<LogEntry[]>('codingLogs', []);
  const [goals, setGoals] = useLocalStorage<Goals>('codingGoals', { weekly: 20, monthly: 80, yearly: 1000 });
  const [longestStreak, setLongestStreak] = useLocalStorage<number>('codingLongestStreak', 0);
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage<UnlockedAchievements>('unlockedAchievements', {});
  
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);


  const handleAddLog = (newLog: LogEntry) => {
    setLogs(prevLogs => {
      const existingLogIndex = prevLogs.findIndex(log => log.date === newLog.date);
      if (existingLogIndex > -1) {
        const updatedLogs = [...prevLogs];
        if (newLog.hours <= 0) {
          // Remove the log if hours are 0 or less
          updatedLogs.splice(existingLogIndex, 1);
        } else {
          // Update existing log
          updatedLogs[existingLogIndex] = newLog;
        }
        return updatedLogs;
      }
      if (newLog.hours > 0) {
          // Add new log if hours are positive
          return [...prevLogs, newLog].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      return prevLogs;
    });
  };

  const handleSetGoals = (newGoals: Goals) => {
    setGoals(newGoals);
    setIsGoalsModalOpen(false);
  };
  
  const { weeklyTotal, monthlyTotal, yearlyTotal } = useMemo(() => {
    const now = new Date();
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)); // Monday as start of week
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfYear = new Date(now.getFullYear(), 0, 1);
    startOfYear.setHours(0, 0, 0, 0);

    let weekly = 0;
    let monthly = 0;
    let yearly = 0;

    for (const log of logs) {
      const logDate = new Date(log.date + 'T00:00:00'); // Ensure date is parsed in local time
      if (logDate >= startOfYear) {
        yearly += log.hours;
        if (logDate >= startOfMonth) {
          monthly += log.hours;
          if (logDate >= startOfWeek) {
            weekly += log.hours;
          }
        }
      }
    }
    return { weeklyTotal: weekly, monthlyTotal: monthly, yearlyTotal: yearly };
  }, [logs]);

  const currentStreak = useMemo(() => {
    if (logs.length === 0) return 0;

    const logDates = new Set(logs.map(log => log.date));
    let streak = 0;
    const today = new Date();
    
    // Check if today has a log
    if (logDates.has(today.toISOString().split('T')[0])) {
        streak = 1;
    } else {
        // If no log today, check if yesterday had one to determine if streak is active
        today.setDate(today.getDate() - 1);
        if(!logDates.has(today.toISOString().split('T')[0])) {
            return 0; // No log today or yesterday, so streak is 0.
        }
        // Streak count will start from yesterday
    }
    
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() -1); // Start from the day before the last logged day

    while(true) {
        const dateString = currentDate.toISOString().split('T')[0];
        if (logDates.has(dateString)) {
            streak++;
        } else {
            break;
        }
        currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  }, [logs]);

  useEffect(() => {
    if (currentStreak > longestStreak) {
      setLongestStreak(currentStreak);
    }
  }, [currentStreak, longestStreak, setLongestStreak]);

  useEffect(() => {
    const newUnlockedState: UnlockedAchievements = {};
    const justUnlockedIds: string[] = [];

    ALL_ACHIEVEMENTS.forEach(achievement => {
      // Re-evaluate every achievement based on the current logs and streak
      if (achievement.isUnlocked(logs, currentStreak)) {
        // If the condition is met, ensure it's in our new state object
        const existingUnlock = unlockedAchievements[achievement.id];
        if (existingUnlock) {
          // If it was already unlocked, keep its original data (like the date)
          newUnlockedState[achievement.id] = existingUnlock;
        } else {
          // If it wasn't unlocked before, it's newly unlocked now
          newUnlockedState[achievement.id] = { date: new Date().toISOString() };
          justUnlockedIds.push(achievement.id);
        }
      }
      // If the condition is NOT met, we simply don't add it to newUnlockedState,
      // effectively "revoking" it if it was previously unlocked.
    });

    // To prevent unnecessary re-renders, compare the old and new state.
    const currentUnlockedIds = Object.keys(unlockedAchievements).sort();
    const newUnlockedIds = Object.keys(newUnlockedState).sort();

    if (JSON.stringify(currentUnlockedIds) !== JSON.stringify(newUnlockedIds)) {
      setUnlockedAchievements(newUnlockedState);
    }

    // If we found any achievements that were just unlocked, trigger the toast notification.
    if (justUnlockedIds.length > 0) {
      setNewlyUnlocked(prev => [...prev, ...justUnlockedIds]);
    }
  }, [logs, currentStreak, unlockedAchievements, setUnlockedAchievements, setNewlyUnlocked]);


  return (
    <div className="min-h-screen bg-gray-950 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <LogForm 
              onAddLog={handleAddLog} 
              logs={logs}
              date={selectedDate}
              onDateChange={setSelectedDate} 
            />
            <StatsDashboard 
              weeklyTotal={weeklyTotal}
              monthlyTotal={monthlyTotal}
              yearlyTotal={yearlyTotal}
              goals={goals}
              onEditGoals={() => setIsGoalsModalOpen(true)}
              currentStreak={currentStreak}
              longestStreak={longestStreak}
            />
            <Achievements
              unlockedCount={Object.keys(unlockedAchievements).length}
              totalCount={ALL_ACHIEVEMENTS.length}
              onView={() => setIsAchievementsModalOpen(true)}
            />
            <TagAnalysis logs={logs} />
            <DataManagement
              logs={logs}
              goals={goals}
              longestStreak={longestStreak}
              unlockedAchievements={unlockedAchievements}
              setLogs={setLogs}
              setGoals={setGoals}
              setLongestStreak={setLongestStreak}
              setUnlockedAchievements={setUnlockedAchievements}
            />
          </div>
          <div className="lg:col-span-2 space-y-8">
             <Heatmap logs={logs} onDateSelect={setSelectedDate} />
             <ProductivityChart logs={logs} />
          </div>
        </main>
      </div>
      <GoalsModal
        isOpen={isGoalsModalOpen}
        onClose={() => setIsGoalsModalOpen(false)}
        onSave={handleSetGoals}
        currentGoals={goals}
      />
      <AchievementsModal
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
        unlockedAchievements={unlockedAchievements}
      />
      <AchievementToast
        newlyUnlocked={newlyUnlocked}
        onComplete={(id) => setNewlyUnlocked(prev => prev.filter(aId => aId !== id))}
      />
    </div>
  );
};

export default App;
