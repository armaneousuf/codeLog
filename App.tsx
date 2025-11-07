import React, { useState, useMemo, useEffect } from 'react';
import { LogEntry, Goals, UnlockedAchievements } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import LogForm from './components/LogForm';
import Dashboard from './components/Dashboard';
import HexbinHeatmap from './components/HexbinHeatmap';
import GoalsModal from './components/GoalsModal';
import TagAnalysis from './components/TagAnalysis';
import DataManagement from './components/DataManagement';
import ProductivityChart from './components/ProductivityChart';
import Achievements from './components/Achievements';
import AchievementsModal from './components/AchievementsModal';
import AchievementToast from './components/AchievementToast';
// Fix: Corrected typo in imported member name to match the export from './lib/achievements'.
import { ALL_ACHIEVEMENTS } from './lib/achievements';
import MovingAverageChart from './components/MovingAverageChart';
import WeeklyReviewModal from './components/WeeklyReviewModal';
import LogHistory from './components/LogHistory';
import AdvancedControls from './components/AdvancedControls';
import ReportsPage from './components/ReportsPage';

const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


const App: React.FC = () => {
  const [logs, setLogs] = useLocalStorage<LogEntry[]>('codingLogs', []);
  const [goals, setGoals] = useLocalStorage<Goals>('codingGoals', { weekly: 20, monthly: 80, yearly: 1000 });
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage<UnlockedAchievements>('unlockedAchievements', {});
  const [lastSeenWeeklyReview, setLastSeenWeeklyReview] = useLocalStorage<string>('lastSeenWeeklyReview', '');

  const [view, setView] = useState<'dashboard' | 'reports'>('dashboard');
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isWeeklyReviewOpen, setIsWeeklyReviewOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()));
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);
  const [infoToast, setInfoToast] = useState<string | null>(null);
  
  const handleAddLog = (newLog: LogEntry) => {
    let wasUpdated = false;
    setLogs(prevLogs => {
      const existingLogIndex = prevLogs.findIndex(log => log.date === newLog.date);
      if (existingLogIndex > -1) {
        wasUpdated = true;
        const updatedLogs = [...prevLogs];
        if (newLog.hours <= 0) {
          updatedLogs.splice(existingLogIndex, 1);
        } else {
          updatedLogs[existingLogIndex] = newLog;
        }
        return updatedLogs;
      }
      if (newLog.hours > 0) {
          wasUpdated = true;
          return [...prevLogs, newLog].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      return prevLogs;
    });

    if (wasUpdated) {
      setInfoToast("Log Saved!");
      setTimeout(() => setInfoToast(null), 3000);
    }
  };

  const handleDeleteLog = (date: string) => {
    setLogs(prevLogs => prevLogs.filter(log => log.date !== date));
    setInfoToast("Log Deleted!");
    setTimeout(() => setInfoToast(null), 3000);
  };

  const handleSelectDateForEdit = (date: string) => {
    setSelectedDate(date);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setInfoToast("Form is ready for editing at the top of the page.");
    setTimeout(() => setInfoToast(null), 4000);
  };


  const handleSetGoals = (newGoals: Goals) => {
    setGoals(newGoals);
    setIsGoalsModalOpen(false);
  };
  
  const { weeklyTotal, monthlyTotal, yearlyTotal, totalHours, mostUsedTechWeek, mostUsedTechMonth, mostUsedTechYear, lastYearTotal } = useMemo(() => {
    const now = new Date();
    
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(now.getDate() - daysSinceMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfYear = new Date(now.getFullYear(), 0, 1);
    startOfYear.setHours(0, 0, 0, 0);
    
    const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
    startOfLastYear.setHours(0,0,0,0);
    const endOfLastYear = new Date(startOfYear);
    endOfLastYear.setDate(startOfYear.getDate() - 1);
    endOfLastYear.setHours(23,59,59,999);

    let weekly = 0;
    let monthly = 0;
    let yearly = 0;
    let lastYearly = 0;
    
    const weeklyTagHours = new Map<string, number>();
    const monthlyTagHours = new Map<string, number>();
    const yearlyTagHours = new Map<string, number>();

    for (const log of logs) {
      const logDate = new Date(log.date + 'T00:00:00');
      
      const processTags = (map: Map<string, number>) => {
        if (log.techBreakdown) {
          log.techBreakdown.forEach(tech => {
            map.set(tech.tag, (map.get(tech.tag) || 0) + tech.hours);
          });
        } else if (log.tags) { // Handle old format
          // Distribute total hours evenly among tags for approximation
          const hoursPerTag = log.tags.length > 0 ? log.hours / log.tags.length : 0;
          log.tags.forEach(tag => {
            map.set(tag, (map.get(tag) || 0) + hoursPerTag);
          });
        }
      };

      if (logDate >= startOfYear) {
        yearly += log.hours;
        processTags(yearlyTagHours);
        if (logDate >= startOfMonth) {
          monthly += log.hours;
          processTags(monthlyTagHours);
          if (logDate >= startOfWeek) {
            weekly += log.hours;
            processTags(weeklyTagHours);
          }
        }
      }

      if (logDate >= startOfLastYear && logDate <= endOfLastYear) {
          lastYearly += log.hours;
      }
    }
    
    const findTopTag = (map: Map<string, number>): string | undefined => {
        if (map.size === 0) return undefined;
        return Array.from(map.entries()).sort((a, b) => b[1] - a[1])[0][0];
    };

    const allTimeTotal = logs.reduce((sum, log) => sum + log.hours, 0);
    return { 
        weeklyTotal: weekly, 
        monthlyTotal: monthly, 
        yearlyTotal: yearly, 
        totalHours: allTimeTotal,
        mostUsedTechWeek: findTopTag(weeklyTagHours),
        mostUsedTechMonth: findTopTag(monthlyTagHours),
        mostUsedTechYear: findTopTag(yearlyTagHours),
        lastYearTotal: lastYearly,
    };
  }, [logs]);

  const comparisonStats = useMemo(() => {
    const today = new Date();
    const todayStr = getLocalDateString(today);
    const todayHours = logs.find(l => l.date === todayStr)?.hours || 0;
    
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);
    const yesterdayHours = logs.find(l => l.date === yesterdayStr)?.hours || 0;

    const now = new Date(); // Use a clean date for period calculations
    now.setHours(0, 0, 0, 0);

    // Last Week Calculation
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1)); // Monday start

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
    
    const endOfLastWeek = new Date(startOfThisWeek);
    endOfLastWeek.setDate(startOfThisWeek.getDate() - 1);
    endOfLastWeek.setHours(23, 59, 59, 999);

    const lastWeekHours = logs.filter(log => {
      const logDate = new Date(log.date + 'T00:00:00');
      return logDate >= startOfLastWeek && logDate <= endOfLastWeek;
    }).reduce((sum, log) => sum + log.hours, 0);

    // Last Month Calculation
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const endOfLastMonth = new Date(startOfThisMonth);
    endOfLastMonth.setDate(startOfThisMonth.getDate() - 1);
    endOfLastMonth.setHours(23, 59, 59, 999);
    
    const lastMonthHours = logs.filter(log => {
      const logDate = new Date(log.date + 'T00:00:00');
      return logDate >= startOfLastMonth && logDate <= endOfLastMonth;
    }).reduce((sum, log) => sum + log.hours, 0);

    return {
      todayHours,
      yesterdayHours,
      lastWeekHours,
      lastMonthHours,
    };
  }, [logs]);

  const currentStreak = useMemo(() => {
    if (logs.length === 0) return 0;
    const logDates = new Set(logs.map(log => log.date));
    let streak = 0;
    let currentDate = new Date();

    if (!logDates.has(getLocalDateString(currentDate))) {
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    while (logDates.has(getLocalDateString(currentDate))) {
        streak++;
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

  // Weekly Review Modal Logic
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday
    const isMonday = dayOfWeek === 1;

    if (isMonday) {
      const thisMonday = new Date(today);
      thisMonday.setHours(0, 0, 0, 0);
      const thisMondayStr = thisMonday.toISOString().split('T')[0];
      
      if(lastSeenWeeklyReview !== thisMondayStr) {
        setIsWeeklyReviewOpen(true);
      }
    }
  }, [lastSeenWeeklyReview]);

  const handleCloseWeeklyReview = () => {
    const today = new Date();
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
    thisMonday.setHours(0, 0, 0, 0);
    setLastSeenWeeklyReview(thisMonday.toISOString().split('T')[0]);
    setIsWeeklyReviewOpen(false);
  };

  const lastWeekLogs = useMemo(() => {
    const today = new Date();
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - today.getDay() - 7);
    lastSunday.setHours(0,0,0,0);
    const lastSaturday = new Date(lastSunday);
    lastSaturday.setDate(lastSunday.getDate() + 6);
    lastSaturday.setHours(23,59,59,999);

    return logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= lastSunday && logDate <= lastSaturday;
    });
  }, [logs, isWeeklyReviewOpen]);

  return (
    <div className="min-h-screen font-sans p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header totalHours={totalHours} view={view} setView={setView} />

        {view === 'dashboard' ? (
          <>
            <main className="mt-8 grid grid-cols-12 gap-4 md:gap-8">
              <div className="col-span-12 lg:col-span-4 min-w-0 flex flex-col gap-4 md:gap-8">
                <LogForm 
                  onAddLog={handleAddLog} 
                  logs={logs}
                  date={selectedDate}
                  onDateChange={setSelectedDate}
                />
              </div>

              <div className="col-span-12 lg:col-span-8 min-w-0">
                <Dashboard
                  weeklyTotal={weeklyTotal}
                  monthlyTotal={monthlyTotal}
                  yearlyTotal={yearlyTotal}
                  goals={goals}
                  onEditGoals={() => setIsGoalsModalOpen(true)}
                  currentStreak={currentStreak}
                  longestStreak={longestStreak}
                  mostUsedTechWeek={mostUsedTechWeek}
                  mostUsedTechMonth={mostUsedTechMonth}
                  mostUsedTechYear={mostUsedTechYear}
                  todayHours={comparisonStats.todayHours}
                  yesterdayHours={comparisonStats.yesterdayHours}
                  thisWeekHours={weeklyTotal}
                  lastWeekHours={comparisonStats.lastWeekHours}
                  thisMonthHours={monthlyTotal}
                  lastMonthHours={comparisonStats.lastMonthHours}
                />
              </div>

              <div className="col-span-12 min-w-0">
                <HexbinHeatmap logs={logs} />
              </div>
              
              <div className="col-span-12 xl:col-span-8 min-w-0">
                 <MovingAverageChart logs={logs} />
              </div>
              
              <div className="col-span-12 xl:col-span-4 min-w-0">
                 <TagAnalysis logs={logs} />
              </div>

              <div className="col-span-12 md:col-span-6 min-w-0">
                 <ProductivityChart logs={logs} />
              </div>

              <div className="col-span-12 md:col-span-6 min-w-0">
                <Achievements
                  unlockedCount={Object.keys(unlockedAchievements).length}
                  totalCount={ALL_ACHIEVEMENTS.length}
                  onView={() => setIsAchievementsModalOpen(true)}
                />
              </div>
            </main>

            <div className="mt-8 md:mt-12">
              <AdvancedControls
                logs={logs}
                onDateSelect={handleSelectDateForEdit}
                onDeleteLog={handleDeleteLog}
                goals={goals}
                setLogs={setLogs}
                setGoals={setGoals}
              />
            </div>
            
            <footer className="text-center text-gray-400 text-sm mt-12 py-4">
              <p>
                This website was crafted by{' '}
                <a
                  href="https://github.com/armaneousuf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-white underline transition-colors"
                >
                  Arman Eousuf
                </a>{' '}
                in collaboration with Google Gemini.
              </p>
            </footer>
          </>
        ) : (
          <ReportsPage
            logs={logs}
            thisWeekHours={weeklyTotal}
            lastWeekHours={comparisonStats.lastWeekHours}
            thisMonthHours={monthlyTotal}
            lastMonthHours={comparisonStats.lastMonthHours}
            thisYearHours={yearlyTotal}
            lastYearHours={lastYearTotal}
          />
        )}
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
        isOpen={isWeeklyReviewOpen}
        onClose={handleCloseWeeklyReview}
        lastWeekLogs={lastWeekLogs}
      />
      <AchievementToast
        newlyUnlocked={newlyUnlocked}
        onComplete={(id) => setNewlyUnlocked(prev => prev.filter(aId => aId !== id))}
      />
      <div className={`fixed bottom-5 left-5 z-50 transition-all duration-300 ${infoToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg shadow-2xl p-4 flex items-center space-x-4 max-w-sm overflow-hidden">
          <p className="font-semibold text-white">{infoToast}</p>
        </div>
      </div>
    </div>
  );
};

export default App;