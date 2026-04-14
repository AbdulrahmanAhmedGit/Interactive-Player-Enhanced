import { Trophy, RotateCcw } from 'lucide-react';
import { QuizProgress } from '../../types';
import { Button } from '../ui/Button';

export const CompletionScreen: React.FC<{ progress: QuizProgress, onReplay: () => void }> = ({ progress, onReplay }) => {
  return (
    <div className="vq-overlay-backdrop">
      <div style={{ textAlign: 'center', maxWidth: '24rem', width: '100%', padding: '2rem' }}>
        <div style={{
          width: '5rem', height: '5rem', borderRadius: '50%',
          background: 'rgba(234, 179, 8, 0.15)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
        }}>
          <Trophy size={40} style={{ color: '#eab308' }} />
        </div>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>
          Lesson Complete!
        </h2>
        
        <div style={{
          background: 'var(--vq-bg-card)', border: '1px solid var(--vq-border)',
          borderRadius: 'var(--vq-radius-xl)', padding: '1.5rem', marginBottom: '2rem'
        }}>
          <p style={{ color: 'var(--vq-text-secondary)', marginBottom: '0.5rem' }}>Final Score</p>
          <div style={{ fontSize: '3rem', fontWeight: 900 }}>
            <span className="vq-gradient-text">{progress.score}</span>
            <span style={{ fontSize: '1.25rem', color: 'var(--vq-text-muted)' }}> / {progress.totalQuestions}</span>
          </div>
        </div>

        <Button onClick={onReplay} variant="secondary">
          <RotateCcw size={16} /> Watch Again
        </Button>
      </div>
    </div>
  );
};
