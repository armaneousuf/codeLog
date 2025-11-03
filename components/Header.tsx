import React from 'react';

const CodeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

interface HeaderProps {
    totalHours: number;
}

const Header: React.FC<HeaderProps> = ({ totalHours }) => {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
            <CodeIcon />
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight text-white">
                  CodeLog
              </h1>
              <p className="text-sm text-gray-300 -mt-1">Your personal coding companion.</p>
            </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl px-6 py-2 text-right transition-colors hover:border-gray-600">
            <p className="text-sm text-gray-300">Total Hours Logged</p>
            <p className="text-2xl font-bold text-white">{totalHours.toFixed(1)}</p>
        </div>
    </header>
  );
};

export default Header;