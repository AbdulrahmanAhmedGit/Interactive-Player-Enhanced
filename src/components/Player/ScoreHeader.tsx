import { Zap } from 'lucide-react';
import { QuizProgress } from '../../types';

export const ScoreHeader: React.FC<{ progress: QuizProgress }> = ({ progress }) => {
  return (
    <div className="vq-score-header">
      <div>
        <Zap size={20} style={{ color: '#eab308' }} />
        <span style={{ fontWeight: 600, color: 'white' }}>Interactive Session</span>
      </div>
      <div>
        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
          Progress: <span style={{ color: 'white', fontWeight: 500 }}>{progress.answeredCount}/{progress.totalQuestions}</span>
        </span>
        <div style={{ height: '1rem', width: 1, background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
          Score: <span style={{ color: '#34d399', fontWeight: 700 }}>{progress.score}</span>
        </span>
      </div>
    </div>
  );
};
