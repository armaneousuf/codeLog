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
// Fix: Corrected typo in imported member name to match the export from './lib/achievements'.
import { ALL_ACHIEVEMENTS } from './lib/achievements';
import MovingAverageChart from './components/MovingAverageChart';
import QuoteCard from './components/QuoteCard';
import { GoogleGenAI } from "@google/genai";
import WeeklyReviewModal from './components/WeeklyReviewModal';

const App: React.FC = () => {
  const [logs, setLogs] = useLocalStorage<LogEntry[]>('codingLogs', []);
  const [goals, setGoals] = useLocalStorage<Goals>('codingGoals', { weekly: 20, monthly: 80, yearly: 1000 });
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage<UnlockedAchievements>('unlockedAchievements', {});
  const [lastSeenWeeklyReview, setLastSeenWeeklyReview] = useLocalStorage<string>('lastSeenWeeklyReview', '');


  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isWeeklyReviewOpen, setIsWeeklyReviewOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);
  const [showSaveToast, setShowSaveToast] = useState(false);
  
  const fallbackQuotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" }
  ];

  const fetchQuote = async () => {
    setIsQuoteLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Provide a random, high-quality, inspiring quote for a software developer about coding, problem-solving, or logic from a list of classic, well-known programming quotes. Return a single quote in a JSON array like this: [{"quote": "The quote text.", "author": "Author"}]`,
        config: { 
          temperature: 1,
          responseMimeType: "application/json",
        },
      });
      const rawText = response.text.trim();
      const quotes = JSON.parse(rawText);
      
      if (quotes && quotes.length > 0) {
        setQuote({ text: quotes[0].quote, author: quotes[0].author });
      } else {
         throw new Error("Empty response from API");
      }

    } catch (error) {
      console.error("Failed to fetch quote:", error);
      setQuote(fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]);
    } finally {
      setIsQuoteLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

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
        setShowSaveToast(true);
        setTimeout(() => setShowSaveToast(false), 3000);
    }
  };

  const handleSetGoals = (newGoals: Goals) => {
    setGoals(newGoals);
    setIsGoalsModalOpen(false);
  };
  
  const { weeklyTotal, monthlyTotal, yearlyTotal, totalHours, mostUsedTechWeek, mostUsedTechMonth, mostUsedTechYear } = useMemo(() => {
    const now = new Date();
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfYear = new Date(now.getFullYear(), 0, 1);
    startOfYear.setHours(0, 0, 0, 0);

    let weekly = 0;
    let monthly = 0;
    let yearly = 0;
    
    const weeklyTagHours = new Map<string, number>();
    const monthlyTagHours = new Map<string, number>();
    const yearlyTagHours = new Map<string, number>();

    for (const log of logs) {
      const logDate = new Date(log.date + 'T00:00:00');
      
      const processTags = (map: Map<string, number>) => {
        log.tags?.forEach(tag => {
          map.set(tag, (map.get(tag) || 0) + log.hours);
        });
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
    };
  }, [logs]);

  const currentStreak = useMemo(() => {
    if (logs.length === 0) return 0;
    const logDates = new Set(logs.map(log => log.date));
    let streak = 0;
    let currentDate = new Date();

    if (!logDates.has(currentDate.toISOString().split('T')[0])) {
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    while (logDates.has(currentDate.toISOString().split('T')[0])) {
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
    <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header totalHours={totalHours} />
        <main className="mt-8 grid grid-cols-12 gap-6 lg:gap-8">
          
          <div className="col-span-12 lg:col-span-5 xl:col-span-4">
            <LogForm 
              onAddLog={handleAddLog} 
              logs={logs}
              date={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>

          <div className="col-span-12 lg:col-span-7 xl:col-span-8">
            <StatsDashboard 
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
            />
          </div>

          <div className="col-span-12">
            <Heatmap logs={logs} onDateSelect={setSelectedDate} />
          </div>
          
          <div className="col-span-12 xl:col-span-8">
             <MovingAverageChart logs={logs} />
          </div>
          
          <div className="col-span-12 xl:col-span-4">
            <ProductivityChart logs={logs} />
          </div>

          <div className="col-span-12 md:col-span-6 xl:col-span-4">
            <TagAnalysis logs={logs} />
          </div>

          <div className="col-span-12 md:col-span-6 xl:col-span-4">
            <Achievements
              unlockedCount={Object.keys(unlockedAchievements).length}
              totalCount={ALL_ACHIEVEMENTS.length}
              onView={() => setIsAchievementsModalOpen(true)}
            />
          </div>

          <div className="col-span-12 xl:col-span-4">
            <QuoteCard
              quote={quote.text}
              author={quote.author}
              isLoading={isQuoteLoading}
              onRefresh={fetchQuote}
            />
          </div>
          
          <div className="col-span-12">
            <DataManagement
              logs={logs}
              goals={goals}
              unlockedAchievements={unlockedAchievements}
              setLogs={setLogs}
              setGoals={setGoals}
              setUnlockedAchievements={setUnlockedAchievements}
            />
          </div>
        </main>
        <footer className="text-center text-gray-400 text-sm mt-12 py-4 border-t border-gray-800">
          <p>
            This website was created by{' '}
            <a
              href="https://github.com/armaneousuf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-white underline transition-colors"
            >
              Arman Eousuf
            </a>{' '}
            with the help of Google Gemini.
          </p>
        </footer>
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
      <div className={`fixed bottom-5 right-5 z-50 transition-all duration-300 ${showSaveToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg shadow-2xl p-4 flex items-center space-x-4 max-w-sm overflow-hidden">
          <p className="font-semibold text-white">Log Saved!</p>
        </div>
      </div>
    </div>
  );
};

export default App;
