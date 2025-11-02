
import React from 'react';

const CodeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-mint-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

interface HeaderProps {
    onWeeklyReviewClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onWeeklyReviewClick }) => {
  return (
    <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <CodeIcon />
            <h1 className="text-3xl font-bold text-gray-100 tracking-tight">
                CodeLog
            </h1>
        </div>
        <button
            onClick={onWeeklyReviewClick}
            className="bg-gray-800 text-sm text-gray-300 font-semibold py-2 px-4 rounded-md hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-mint-500 transition-colors duration-200"
        >
            Weekly Review
        </button>
    </header>
  );
};

export default Header;