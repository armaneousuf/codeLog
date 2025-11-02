import React, { useMemo } from 'react';
import { LogEntry, Project } from '../types';

interface WeeklyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  projects: Project[];
}

const StatItem: React.FC<{ label: string; value: string; delta?: number; unit?: string }> = ({ label, value, delta, unit = '' }) => {
    let deltaElement = null;
    if (delta !== undefined) {
        const isPositive = delta >= 0;
        const deltaColor = isPositive ? 'text-green-400' : 'text-red-400';
        const sign = isPositive ? '+' : '';
        deltaElement = <span className={`text-sm ml-2 ${deltaColor}`}>({sign}{delta.toFixed(1)}{unit})</span>
    }
    return (
        <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}{unit}</p>
            {delta && <p className="text-xs text-gray-500">vs prev week {deltaElement}</p>}
        </div>
    );
};

const WeeklyReviewModal: React.FC<WeeklyReviewModalProps> = ({ isOpen, onClose, logs, projects }) => {
  const projectsMap = useMemo(() => new Map(projects.map(p => [p.id, p])), [projects]);
  
  const weeklyData = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    const last7Days: LogEntry[] = [];
    const prev7Days: LogEntry[] = [];
    
    logs.forEach(log => {
      const logDate = new Date(log.date + 'T00:00:00');
      const diffDays = (now.getTime() - logDate.getTime()) / (1000 * 3600 * 24);
      
      if (diffDays <= 7) {
        last7Days.push(log);
      } else if (diffDays > 7 && diffDays <= 14) {
        prev7Days.push(log);
      }
    });

    const calcTotalHours = (arr: LogEntry[]) => arr.reduce((sum, log) => sum + log.hours, 0);
    const last7Total = calcTotalHours(last7Days);
    const prev7Total = calcTotalHours(prev7Days);

    const getTopItems = (arr: LogEntry[], type: 'project' | 'tag') => {
        const map = new Map<string, number>();
        arr.forEach(log => {
            const keys = type === 'project' ? (log.projectId ? [log.projectId] : []) : (log.tags || []);
            keys.forEach(key => {
                map.set(key, (map.get(key) || 0) + log.hours);
            });
        });
        return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);
    };

    return {
      last7Total,
      prev7Total,
      totalDelta: last7Total - prev7Total,
      avgLast7: last7Days.length > 0 ? last7Total / 7 : 0,
      avgPrev7: prev7Days.length > 0 ? prev7Total / 7 : 0,
      topProjects: getTopItems(last7Days, 'project'),
      topTags: getTopItems(last7Days, 'tag'),
    };
  }, [logs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-900 border border-gray-700 rounded-lg p-6 sm:p-8 shadow-2xl w-full max-w-2xl transform transition-transform duration-300 scale-95 max-h-[90vh] flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Weekly Review</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="overflow-y-auto pr-2 -mr-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatItem label="Total Hours (Last 7 Days)" value={weeklyData.last7Total.toFixed(1)} delta={weeklyData.totalDelta} unit="h"/>
                <StatItem label="Daily Average (Last 7 Days)" value={weeklyData.avgLast7.toFixed(1)} delta={weeklyData.avgLast7 - weeklyData.avgPrev7} unit="h"/>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <h3 className="font-semibold text-gray-300 mb-3">Top Projects</h3>
                    <div className="space-y-2">
                        {weeklyData.topProjects.length > 0 ? weeklyData.topProjects.map(([id, hours]) => {
                            const project = projectsMap.get(id);
                            return (
                                <div key={id} className="flex items-center justify-between text-sm bg-gray-800/50 p-2 rounded-md">
                                    <span className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: project?.color || '#888'}}></div>
                                        {project?.name || 'Unknown'}
                                    </span>
                                    <span className="font-mono text-gray-400">{hours.toFixed(1)} hrs</span>
                                </div>
                            )
                        }) : <p className="text-sm text-gray-500">No project hours logged.</p>}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-300 mb-3">Top Technologies</h3>
                    <div className="space-y-2">
                         {weeklyData.topTags.length > 0 ? weeklyData.topTags.map(([tag, hours]) => (
                            <div key={tag} className="flex items-center justify-between text-sm bg-gray-800/50 p-2 rounded-md">
                                <span>{tag}</span>
                                <span className="font-mono text-gray-400">{hours.toFixed(1)} hrs</span>
                            </div>
                         )) : <p className="text-sm text-gray-500">No tagged hours logged.</p>}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReviewModal;