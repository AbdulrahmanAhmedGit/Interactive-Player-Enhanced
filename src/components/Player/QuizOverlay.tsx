import { useState } from 'react';
import { Question } from '../../types';
import { QuestionRenderer } from './QuestionRenderer';
import { FeedbackDisplay } from './FeedbackDisplay';

interface QuizOverlayProps {
  question: Question;
  onSubmit: (answer: string) => boolean;
  onResume: () => void;
  allowSkip?: boolean;
  showFeedback?: boolean;
}

export const QuizOverlay: React.FC<QuizOverlayProps> = ({ 
  question, onSubmit, onResume, allowSkip = true, showFeedback = true 
}) => {
  const [feedbackState, setFeedbackState] = useState<'pending' | 'correct' | 'incorrect'>('pending');

  const handleSubmit = (answer: string) => {
    const isCorrect = onSubmit(answer);
    if (showFeedback) {
      setFeedbackState(isCorrect ? 'correct' : 'incorrect');
    } else {
      onResume();
    }
  };

  const handleRetry = () => {
    setFeedbackState('pending');
  };

  return (
    <div className="vq-overlay-backdrop">
      <div className="vq-overlay-modal vq-animate-zoom">
        <div className="vq-overlay-top-bar" />
        
        {feedbackState === 'pending' ? (
          <>
            <h3 className="vq-question-title">{question.question}</h3>
            <QuestionRenderer question={question} onSubmit={handleSubmit} />
          </>
        ) : (
          <FeedbackDisplay 
            status={feedbackState} 
            onResume={onResume} 
            onRetry={handleRetry} 
            allowSkip={allowSkip} 
          />
        )}
      </div>
    </div>
  );
};
