import React, { useRef } from 'react';
import { LogEntry, Goals, UnlockedAchievements } from '../types';

interface DataManagementProps {
  logs: LogEntry[];
  goals: Goals;
  unlockedAchievements: UnlockedAchievements;
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  setGoals: React.Dispatch<React.SetStateAction<Goals>>;
  setUnlockedAchievements: React.Dispatch<React.SetStateAction<UnlockedAchievements>>;
}

const DataManagement: React.FC<DataManagementProps> = ({
  logs,
  goals,
  unlockedAchievements,
  setLogs,
  setGoals,
  setUnlockedAchievements,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = {
      logs,
      goals,
      unlockedAchievements,
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

    if (!window.confirm("Are you sure? Importing a file will overwrite your current data.")) {
        if(fileInputRef.current) fileInputRef.current.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("Invalid file content");
        
        const importedData = JSON.parse(text);

        // Basic validation
        if (Array.isArray(importedData.logs) && importedData.goals) {
          setLogs(importedData.logs || []);
          setGoals(importedData.goals);
          setUnlockedAchievements(importedData.unlockedAchievements || {});
          alert("Data imported successfully!");
        } else {
          throw new Error("Invalid data structure in JSON file.");
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
    <div className="bg-gray-900/60 backdrop-blur-lg border border-white/5 rounded-xl shadow-2xl p-6 transition-all duration-300 hover:border-white/10 hover:shadow-mint-500/10">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Data Management</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={handleExport} className="flex-1 text-center bg-gray-700/80 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-mint-500 transition-colors duration-200">
          Export Data
        </button>
        <button onClick={handleImportClick} className="flex-1 text-center bg-gray-700/80 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-mint-500 transition-colors duration-200">
          Import Data
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