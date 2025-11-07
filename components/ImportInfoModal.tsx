import React, { useState } from 'react';

interface ImportInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const demoJson = `{
  "logs": [],
  "goals": {
    "weekly": 20,
    "monthly": 80,
    "yearly": 1000
  }
}`;

const logEntryExample = `{
  "date": "YYYY-MM-DD",
  "hours": 4.5,
  "techBreakdown": [
    { "tag": "React", "hours": 2.5 },
    { "tag": "CSS", "hours": 2.0 }
  ]
}`;

const ImportInfoModal: React.FC<ImportInfoModalProps> = ({ isOpen, onClose }) => {
  const [copyStatus, setCopyStatus] = useState('Copy');
    
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(demoJson);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy'), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-gray-900/60 border border-white/10 rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-lg transform transition-transform duration-300 scale-95 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-4">How to Import Data</h2>
        <div className="overflow-y-auto pr-2 space-y-4 text-gray-300 text-sm">
            <p>You can import your data from a JSON file. This is useful for transferring data between devices or restoring a backup.</p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>Create a file with a <code className="bg-black/40 px-1 py-0.5 rounded text-violet-300">.json</code> extension.</li>
                <li>Use the JSON structure shown below as a template.</li>
                <li>Populate the <code className="bg-black/40 px-1 py-0.5 rounded text-violet-300">"logs"</code> array with your daily entries (see example log entry).</li>
                <li>Use the "Import Logs & Goals" button and select your file.</li>
            </ol>
            <p className="font-semibold text-gray-200">Base File Structure (Demo):</p>
            <div className="relative">
                <pre className="bg-black/30 border border-gray-700 rounded-lg p-4 text-xs text-amber-300 overflow-x-auto">
                    <code>{demoJson}</code>
                </pre>
                <button 
                    onClick={handleCopy}
                    className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-md bg-white/5 hover:bg-white/10 text-gray-300 transition-colors w-16"
                    aria-label="Copy JSON example"
                >
                    {copyStatus}
                </button>
            </div>
            <p className="font-semibold text-gray-200">Example of a log entry to add inside the `logs` array:</p>
            <pre className="bg-black/30 border border-gray-700 rounded-lg p-4 text-xs text-amber-300 overflow-x-auto">
                <code>{logEntryExample}</code>
            </pre>
        </div>
        <div className="mt-8 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 rounded-lg bg-white text-black font-semibold transition-colors duration-200 hover:bg-gray-200">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportInfoModal;
