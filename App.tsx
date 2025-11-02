import React, { useState, useMemo, useEffect } from 'react';
import { LogEntry, Goals, UnlockedAchievements, Project } from './types';
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
import ProjectManager from './components/ProjectManager';
import FilterControls from './components/FilterControls';
import WeeklyReviewModal from './components/WeeklyReviewModal';

const App: React.FC = () => {
  const [logs, setLogs] = useLocalStorage<LogEntry[]>('codingLogs', []);
  const [goals, setGoals] = useLocalStorage<Goals>('codingGoals', { weekly: 20, monthly: 80, yearly: 1000 });
  const [projects, setProjects] = useLocalStorage<Project[]>('codingProjects', []);
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage<UnlockedAchievements>('unlockedAchievements', {});
  
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isWeeklyReviewModalOpen, setIsWeeklyReviewModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<{ type: 'tag' | 'project' | null; value: string | null }>({ type: null, value: null });

  const filteredLogs = useMemo(() => {
    if (!activeFilter.type || !activeFilter.value) {
      return logs;
    }
    if (activeFilter.type === 'tag') {
      return logs.filter(log => log.tags?.includes(activeFilter.value as string));
    }
    if (activeFilter.type === 'project') {
      return logs.filter(log => log.projectId === activeFilter.value);
    }
    return logs;
  }, [logs, activeFilter]);


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

    for (const log of filteredLogs) {
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
  }, [filteredLogs]);

  // Streaks and achievements should always be calculated on unfiltered logs.
  const currentStreak = useMemo(() => {
    if (logs.length === 0) return 0;

    const logDates = new Set(logs.map(log => log.date));
    let streak = 0;
    const today = new Date();
    
    if (logDates.has(today.toISOString().split('T')[0])) {
        streak = 1;
    } else {
        today.setDate(today.getDate() - 1);
        if(!logDates.has(today.toISOString().split('T')[0])) {
            return 0;
        }
    }
    
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() -1);

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

  const longestStreak = useMemo(() => {
    if (logs.length === 0) return 0;
    const sortedDates = [...new Set(logs.map(l => l.date))].sort();
    if (sortedDates.length < 2) return sortedDates.length;
    let maxStreak = 1;
    let currentStreakLength = 1;
    for (let i = 1; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i] + 'T00:00:00');
        const prevDate = new Date(sortedDates[i-1] + 'T00:00:00');
        const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            currentStreakLength++;
        } else {
            currentStreakLength = 1;
        }
        if (currentStreakLength > maxStreak) {
            maxStreak = currentStreakLength;
        }
    }
    return maxStreak;
}, [logs]);


  useEffect(() => {
    const newUnlockedState: UnlockedAchievements = {};
    const justUnlockedIds: string[] = [];

    ALL_ACHIEVEMENTS.forEach(achievement => {
      if (achievement.isUnlocked(logs, currentStreak)) {
        const existingUnlock = unlockedAchievements[achievement.id];
        if (existingUnlock) {
          newUnlockedState[achievement.id] = existingUnlock;
        } else {
          newUnlockedState[achievement.id] = { date: new Date().toISOString() };
          justUnlockedIds.push(achievement.id);
        }
      }
    });

    const currentUnlockedIds = Object.keys(unlockedAchievements).sort();
    const newUnlockedIds = Object.keys(newUnlockedState).sort();

    if (JSON.stringify(currentUnlockedIds) !== JSON.stringify(newUnlockedIds)) {
      setUnlockedAchievements(newUnlockedState);
    }

    if (justUnlockedIds.length > 0) {
      setNewlyUnlocked(prev => [...prev, ...justUnlockedIds]);
    }
  }, [logs, currentStreak, unlockedAchievements, setUnlockedAchievements, setNewlyUnlocked]);


  return (
    <div className="min-h-screen bg-gray-950 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header onWeeklyReviewClick={() => setIsWeeklyReviewModalOpen(true)} />
        <FilterControls
            logs={logs}
            projects={projects}
            activeFilter={activeFilter}
            onSetFilter={setActiveFilter}
            onClearFilter={() => setActiveFilter({ type: null, value: null })}
        />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
             <ProjectManager projects={projects} setProjects={setProjects} />
            <LogForm 
              onAddLog={handleAddLog} 
              logs={logs}
              projects={projects}
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
            <TagAnalysis logs={filteredLogs} />
            <DataManagement
              logs={logs}
              goals={goals}
              projects={projects}
              unlockedAchievements={unlockedAchievements}
              setLogs={setLogs}
              setGoals={setGoals}
              setProjects={setProjects}
              setUnlockedAchievements={setUnlockedAchievements}
            />
          </div>
          <div className="lg:col-span-2 space-y-8">
             <Heatmap logs={filteredLogs} onDateSelect={setSelectedDate} />
             <ProductivityChart logs={filteredLogs} />
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
       <WeeklyReviewModal
        isOpen={isWeeklyReviewModalOpen}
        onClose={() => setIsWeeklyReviewModalOpen(false)}
        logs={logs}
        projects={projects}
      />
      <AchievementToast
        newlyUnlocked={newlyUnlocked}
        onComplete={(id) => setNewlyUnlocked(prev => prev.filter(aId => aId !== id))}
      />
    </div>
  );
};

export default App;