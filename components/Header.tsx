import React from 'react';

const CodeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-mint-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <CodeIcon />
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-mint-300 to-mint-500">
                CodeLog
            </h1>
        </div>
    </header>
  );
};

export default Header;