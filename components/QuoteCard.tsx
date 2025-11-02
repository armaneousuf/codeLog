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
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6 relative">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Quote of the Day</h2>
      {isLoading ? (
        <div className="flex items-center justify-center h-24">
          <div className="w-6 h-6 border-2 border-mint-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <blockquote className="border-l-4 border-mint-500 pl-4">
            <p className="text-gray-300 italic">"{quote}"</p>
          </blockquote>
          <p className="text-right text-gray-400 mt-2 text-sm">— {author}</p>
        </>
      )}
      <button 
        onClick={onRefresh} 
        className="absolute top-4 right-4 text-gray-500 hover:text-mint-400 transition-colors disabled:opacity-50"
        disabled={isLoading}
        aria-label="Refresh quote"
      >
        <RefreshIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};

export default QuoteCard;
