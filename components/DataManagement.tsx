import React, { useRef } from 'react';
import { LogEntry, Goals } from '../types';

interface DataManagementProps {
  logs: LogEntry[];
  goals: Goals;
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  setGoals: React.Dispatch<React.SetStateAction<Goals>>;
}

const DataManagement: React.FC<DataManagementProps> = ({
  logs,
  goals,
  setLogs,
  setGoals,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = {
      logs,
      goals,
      exportDate: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codelog_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!window.confirm("Are you sure? Importing a file will overwrite your current logs and/or goals. This action cannot be undone.")) {
        if(fileInputRef.current) fileInputRef.current.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("Invalid file content");
        
        const importedData = JSON.parse(text);

        const importedLogs = importedData.logs;
        const importedGoals = importedData.goals;
        let importOccurred = false;

        if (Array.isArray(importedLogs)) {
            // Basic validation for log entries to ensure they have the minimum required fields
            const validLogs = importedLogs.filter(log => 
              log && typeof log === 'object' && 'date' in log && 'hours' in log
            );
            setLogs(validLogs);
            importOccurred = true;
        }

        if (importedGoals && typeof importedGoals === 'object' && !Array.isArray(importedGoals)) {
            const { weekly, monthly, yearly } = importedGoals;
            if (typeof weekly === 'number' && typeof monthly === 'number' && typeof yearly === 'number') {
                setGoals({ weekly, monthly, yearly });
                importOccurred = true;
            }
        }

        if (importOccurred) {
          alert("Data imported successfully! Your logs and/or goals have been updated.");
        } else {
          throw new Error("Invalid data structure. The file must contain a 'logs' array or a 'goals' object.");
        }
      } catch (error) {
        console.error("Failed to import data:", error);
        alert(`Failed to import data. Please check the file format. Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      } finally {
        if(fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-2">Data Management</h2>
      <p className="text-xs text-gray-400 mb-4">
        Backup your logs and goals, or import them from a file. Note: Achievements are not included.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={handleExport} className="flex-1 text-center bg-white/5 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-violet-500 transition-colors duration-200">
          Export Logs & Goals
        </button>
        <button onClick={handleImportClick} className="flex-1 text-center bg-white/5 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-violet-500 transition-colors duration-200">
          Import Logs & Goals
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="application/json"
        />
      </div>
    </div>
  );
};

export default DataManagement;