import React from 'react';
import { Question } from '../../types';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  questions: Question[];
  askedQuestions: string[];
  onSeek: (percentage: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentTime, duration, questions, askedQuestions, onSeek 
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    onSeek(pos);
  };

  return (
    <div className="vq-progress-track relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer" onClick={handleProgressClick}>
      <div 
        className="vq-progress-fill absolute top-0 left-0 h-full bg-indigo-500 rounded-full" 
        style={{ width: `${progress}%` }} 
      />
      {duration > 0 && questions.map((q) => {
        const isAsked = askedQuestions.includes(q.id || String(q.time));
        return (
          <div 
            key={q.id || q.time} 
            className={`vq-progress-marker absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full z-10 ${isAsked ? 'vq-marker-passed' : 'vq-marker-upcoming'}`} 
            style={{ left: `${(q.time / duration) * 100}%` }}
          />
        );
      })}
    </div>
  );
};
