import React from 'react';

interface QuoteCardProps {
  quote: string;
  author: string;
  isLoading: boolean;
  onRefresh: () => void;
}

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4a14.95 14.95 0 0113.538 7.213M20 20a14.95 14.95 0 01-13.538-7.213" />
  </svg>
);

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, author, isLoading, onRefresh }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 transition-colors hover:border-gray-600 relative">
      <h2 className="text-xl font-semibold text-white mb-4">Quote of the Day</h2>
      {isLoading ? (
        <div className="flex items-center justify-center h-24">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <blockquote className="border-l-4 border-gray-500 pl-4">
            <p className="text-gray-200 italic">"{quote}"</p>
          </blockquote>
          <p className="text-right text-gray-300 mt-2 text-sm">— {author}</p>
        </>
      )}
      <button 
        onClick={onRefresh} 
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        disabled={isLoading}
        aria-label="Refresh quote"
      >
        <RefreshIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};

export default QuoteCard;