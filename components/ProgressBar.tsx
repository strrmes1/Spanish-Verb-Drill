
import React from 'react';

interface ProgressBarProps {
  correct: number;
  incorrect: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ correct, incorrect, total }) => {
  // Ensure we don't exceed 100% total if cardCount is reached
  const displayTotal = Math.max(total, correct + incorrect);
  const correctPct = displayTotal > 0 ? (correct / displayTotal) * 100 : 0;
  const incorrectPct = displayTotal > 0 ? (incorrect / displayTotal) * 100 : 0;
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-end px-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Correct</span>
          <span className="text-lg font-bold leading-none">{correct}</span>
        </div>
        <div className="text-center pb-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Session Progress</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Wrong</span>
          <span className="text-lg font-bold leading-none">{incorrect}</span>
        </div>
      </div>
      
      <div className="relative h-4 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
        {/* Correct Progress - from Left */}
        <div 
          className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-700 ease-out rounded-l-full shadow-[2px_0_10px_rgba(16,185,129,0.3)]" 
          style={{ width: `${correctPct}%` }}
        />
        {/* Incorrect Progress - from Right */}
        <div 
          className="absolute right-0 top-0 h-full bg-rose-500 transition-all duration-700 ease-out rounded-r-full shadow-[-2px_0_10px_rgba(244,63,94,0.3)]" 
          style={{ width: `${incorrectPct}%` }}
        />
      </div>
      
      <div className="flex justify-center">
        <span className="text-[10px] font-bold text-gray-400">Target: {total} cards</span>
      </div>
    </div>
  );
};

export default ProgressBar;
