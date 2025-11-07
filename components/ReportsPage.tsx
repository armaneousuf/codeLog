import React, { useState, useMemo } from 'react';
import { LogEntry } from '../types';

const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7 7 7" />
    </svg>
);
  
const ArrowDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7-7-7" />
    </svg>
);
  
const DashIcon: React.FC<{ className?: string }> = ({ className }) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      </svg>
);

const PerformanceReportCard: React.FC<{title: string, current: number, previous: number}> = ({ title, current, previous }) => {
    let percentageChange = 0;
    if (previous > 0) {
        percentageChange = ((current - previous) / previous) * 100;
    } else if (current > 0) {
        percentageChange = 100; 
    }

    const isPositive = percentageChange > 0.1;
    const isNegative = percentageChange < -0.1;
    
    let colorClass = 'text-gray-400';
    let Icon = DashIcon;

    if (isPositive) {
        colorClass = 'text-green-400';
        Icon = ArrowUpIcon;
    } else if (isNegative) {
        colorClass = 'text-red-400';
        Icon = ArrowDownIcon;
    }
    
    const displayPercentage = Math.abs(percentageChange).toFixed(0);

    return (
        <div className="bg-black/20 rounded-xl p-4 flex flex-col">
            <p className="text-gray-300 font-medium mb-4">{title} Performance</p>
            <div className="flex justify-between items-baseline flex-grow">
                <div>
                    <p className="text-xs text-gray-400">This {title.toLowerCase()}</p>
                    <p className="text-2xl font-bold text-white">{current.toFixed(1)} hrs</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 text-right">Last {title.toLowerCase()}</p>
                    <p className="text-lg font-semibold text-gray-300">{previous.toFixed(1)} hrs</p>
                </div>
            </div>
            <div className={`flex items-center gap-1 font-semibold ${colorClass} mt-3 text-lg justify-center border-t border-white/10 pt-3`}>
                <Icon />
                <span>{displayPercentage}%</span>
            </div>
        </div>
    );
}

interface ReportsPageProps {
    logs: LogEntry[];
    thisWeekHours: number;
    lastWeekHours: number;
    thisMonthHours: number;
    lastMonthHours: number;
    thisYearHours: number;
    lastYearHours: number;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ 
    logs,
    thisWeekHours,
    lastWeekHours,
    thisMonthHours,
    lastMonthHours,
    thisYearHours,
    lastYearHours,
}) => {
    const [selectedTech, setSelectedTech] = useState<string | null>(null);

    const allTechs = useMemo(() => {
        const techSet = new Set<string>();
        logs.forEach(log => {
            log.techBreakdown?.forEach(tech => techSet.add(tech.tag));
        });
        return Array.from(techSet).sort();
    }, [logs]);

    const techStats = useMemo(() => {
        if (!selectedTech) return null;

        let totalHours = 0;
        let bestDay = { date: '', hours: 0 };
        let logCount = 0;
        
        logs.forEach(log => {
            const techEntry = log.techBreakdown?.find(t => t.tag === selectedTech);
            if (techEntry && techEntry.hours > 0) {
                totalHours += techEntry.hours;
                logCount++;
                if (techEntry.hours > bestDay.hours) {
                    bestDay = { date: log.date, hours: techEntry.hours };
                }
            }
        });

        return {
            totalHours,
            bestDay,
            averageHours: logCount > 0 ? totalHours / logCount : 0,
            logCount,
        };
    }, [logs, selectedTech]);

    return (
        <main className="mt-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-6">Reports &amp; Analysis</h1>

            <section>
                <h2 className="text-xl font-semibold text-white mb-4">Period-over-Period Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PerformanceReportCard title="Weekly" current={thisWeekHours} previous={lastWeekHours} />
                    <PerformanceReportCard title="Monthly" current={thisMonthHours} previous={lastMonthHours} />
                    <PerformanceReportCard title="Yearly" current={thisYearHours} previous={lastYearHours} />
                </div>
            </section>

            <section className="mt-12">
                <h2 className="text-xl font-semibold text-white mb-4">Technology Deep Dive</h2>
                <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <label htmlFor="tech-select" className="sr-only">Select a technology</label>
                    <select
                        id="tech-select"
                        value={selectedTech || ''}
                        onChange={e => setSelectedTech(e.target.value || null)}
                        className="w-full md:w-1/2 bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-violet-500"
                    >
                        <option value="">-- Select a technology --</option>
                        {allTechs.map(tech => <option key={tech} value={tech}>{tech}</option>)}
                    </select>

                    {selectedTech && techStats ? (
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="bg-black/20 rounded-lg p-3">
                                <p className="text-gray-400 text-sm">Total Hours</p>
                                <p className="text-2xl font-bold text-white">{techStats.totalHours.toFixed(1)}</p>
                            </div>
                            <div className="bg-black/20 rounded-lg p-3">
                                <p className="text-gray-400 text-sm">Total Sessions</p>
                                <p className="text-2xl font-bold text-white">{techStats.logCount}</p>
                            </div>
                            <div className="bg-black/20 rounded-lg p-3">
                                <p className="text-gray-400 text-sm">Avg / Session</p>
                                <p className="text-2xl font-bold text-white">{techStats.averageHours.toFixed(1)}</p>
                            </div>
                            <div className="bg-black/20 rounded-lg p-3">
                                <p className="text-gray-400 text-sm">Best Day</p>
                                <p className="text-2xl font-bold text-white">{techStats.bestDay.hours.toFixed(1)} hrs</p>
                                <p className="text-xs text-gray-500">{new Date(techStats.bestDay.date + 'T00:00:00').toLocaleDateString()}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 text-center text-gray-400 h-24 flex items-center justify-center">
                            <p>Select a technology to see detailed stats.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default ReportsPage;
