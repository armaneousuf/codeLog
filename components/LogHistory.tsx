import React, { useMemo } from 'react';
import { LogEntry } from '../types';

interface LogHistoryProps {
  logs: LogEntry[];
  onDateSelect: (date: string) => void;
  onDeleteLog: (date: string) => void;
}

const PencilIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const formatDate = (dateString: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  const logDate = new Date(dateString + 'T00:00:00');
  
  if (logDate.getTime() === today.getTime()) {
    return 'Today';
  }
  if (logDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }
  return logDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const LogHistory: React.FC<LogHistoryProps> = ({ logs, onDateSelect, onDeleteLog }) => {
  const recentLogs = useMemo(() => {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    tenDaysAgo.setHours(0, 0, 0, 0);

    return logs
      .filter(log => new Date(log.date + 'T00:00:00') >= tenDaysAgo)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [logs]);

  const handleDeleteWithConfirm = (date: string) => {
    if (window.confirm(`Are you sure you want to delete the log for ${date}? This action cannot be undone.`)) {
      onDeleteLog(date);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Log History</h2>
      <p className="text-xs text-gray-400 -mt-3 mb-4">Last 10 days.</p>
      
      {recentLogs.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {recentLogs.map(log => (
            <div
              key={log.date}
              className="group w-full text-left p-3 rounded-lg bg-black/20"
            >
              <div className="flex justify-between items-start">
                <div>
                    <span className="font-semibold text-sm text-gray-200">{formatDate(log.date)}</span>
                    {log.techBreakdown && log.techBreakdown.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {log.techBreakdown.slice(0, 4).map(tech => (
                                <span key={tech.tag} className="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300">
                                    {tech.tag}
                                </span>
                            ))}
                            {log.techBreakdown.length > 4 && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300">
                                + {log.techBreakdown.length - 4} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="font-mono text-sm text-white">{log.hours.toFixed(1)} hrs</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onDateSelect(log.date)} className="p-1.5 rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition-colors" aria-label={`Edit log for ${log.date}`}>
                          <PencilIcon />
                      </button>
                      <button onClick={() => handleDeleteWithConfirm(log.date)} className="p-1.5 rounded-md text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors" aria-label={`Delete log for ${log.date}`}>
                          <TrashIcon />
                      </button>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No logs in the last 10 days.</p>
        </div>
      )}
    </div>
  );
};

export default LogHistory;