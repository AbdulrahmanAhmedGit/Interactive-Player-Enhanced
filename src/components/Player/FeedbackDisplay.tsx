import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface FeedbackDisplayProps {
  status: 'correct' | 'incorrect';
  onResume: () => void;
  onRetry: () => void;
  allowSkip: boolean;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ status, onResume, onRetry, allowSkip }) => {
  if (status === 'correct') {
    return (
      <div className="vq-feedback vq-feedback-correct vq-animate-zoom">
        <CheckCircle2 size={64} style={{ color: '#10b981' }} />
        <h4>Correct!</h4>
        <Button onClick={onResume} variant="success" fullWidth>Continue</Button>
      </div>
    );
  }

  return (
    <div className="vq-feedback vq-feedback-incorrect vq-animate-shake">
      <XCircle size={64} style={{ color: '#f43f5e' }} />
      <h4>Incorrect</h4>
      <div className="vq-feedback-actions">
        <Button onClick={onRetry} fullWidth>Retry</Button>
        {allowSkip && (
          <Button onClick={onResume} variant="ghost" fullWidth>Skip</Button>
        )}
      </div>
    </div>
  );
};
