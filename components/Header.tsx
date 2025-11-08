import React from 'react';

const CodeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const ShareIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const PalestineFlagIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className} aria-hidden="true">
    {/* Black stripe */}
    <path d="M5,4H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" fill="#000" />
    {/* White stripe */}
    <path fill="#fff" d="M1 11H31V21H1z" />
    {/* Green stripe */}
    <path d="M5,20H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" transform="rotate(180 16 24)" fill="#429543" />
    {/* Red triangle */}
    <path d="M2.271,26.911l12.729-10.911L2.271,5.089c-.778,.73-1.271,1.76-1.271,2.911V24c0,1.151,.493,2.181,1.271,2.911Z" fill="#da403e" />
  </svg>
);


interface HeaderProps {
    totalHours: number;
    onShareClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ totalHours, onShareClick }) => {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
            <CodeIcon />
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-violet-400">
                  CodeLog
              </h1>
              <p className="text-sm text-gray-300 -mt-1">Your personal coding companion.</p>
              <p className="text-sm text-gray-200 mt-2 flex items-center gap-2">
                Free Palestine
                <PalestineFlagIcon className="w-5 h-auto rounded-sm" />
              </p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 px-6 py-2 text-right">
                <p className="text-sm text-gray-300">Total Hours Logged</p>
                <p className="text-2xl font-bold text-white">{totalHours.toFixed(1)}</p>
            </div>
             <button
                onClick={onShareClick}
                className="h-full bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 px-4 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Share your progress"
             >
                <ShareIcon />
            </button>
        </div>
    </header>
  );
};

export default Header;