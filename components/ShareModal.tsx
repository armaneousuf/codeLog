import React, { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import ShareCard from './ShareCard';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    totalHours: number;
    currentStreak: number;
    longestStreak: number;
    topTech: { tag: string; hours: number }[];
  };
}

const ShareIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, stats }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canShare = !!navigator.share;

  useEffect(() => {
    if (isOpen && !imageDataUrl && !isGenerating) {
      setIsGenerating(true);
      setError(null);
      // Timeout to allow the component to render before capturing
      setTimeout(() => {
        if (cardRef.current) {
          htmlToImage.toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
            .then((dataUrl) => {
              setImageDataUrl(dataUrl);
            })
            .catch((err) => {
              console.error('Failed to generate image', err);
              setError('Could not generate shareable image. Please try again.');
            })
            .finally(() => {
              setIsGenerating(false);
            });
        }
      }, 500);
    } else if (!isOpen) {
        // Reset when closed
        setImageDataUrl(null);
        setError(null);
    }
  }, [isOpen, imageDataUrl, isGenerating]);

  const handleShare = async () => {
    if (!imageDataUrl) return;

    try {
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'codelog-progress.png', { type: 'image/png' });

        if (navigator.share) {
            await navigator.share({
                title: 'My CodeLog Progress',
                text: 'Check out my coding progress!',
                files: [file],
            });
        }
    } catch (err) {
        console.error('Sharing failed', err);
        setError('Sharing failed. You can still download the image.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-gray-900/60 border border-white/10 rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-lg transform transition-transform duration-300 scale-95 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Share Your Progress</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        
        <div className="flex-grow flex items-center justify-center bg-black/20 rounded-lg p-4">
          {isGenerating && <p className="text-gray-300 animate-pulse">Generating your card...</p>}
          {error && <p className="text-red-400 text-center">{error}</p>}
          {imageDataUrl && <img src={imageDataUrl} alt="Your coding progress" className="max-w-full max-h-[50vh] object-contain rounded-md shadow-lg" />}
        </div>
        
        {imageDataUrl && (
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                {canShare && (
                    <button onClick={handleShare} className="flex-1 flex items-center justify-center bg-violet-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all hover:bg-violet-700">
                        <ShareIcon />
                        Share
                    </button>
                )}
                 <a
                    href={imageDataUrl}
                    download="codelog-progress.png"
                    className="flex-1 flex items-center justify-center bg-white/10 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors hover:bg-white/20"
                >
                    <DownloadIcon />
                    Download PNG
                </a>
            </div>
        )}

      </div>
       {/* The component to be screenshotted - positioned off-screen */}
       <div className="fixed -left-[9999px] top-0">
         <div ref={cardRef}>
           <ShareCard {...stats} />
         </div>
       </div>
    </div>
  );
};

export default ShareModal;