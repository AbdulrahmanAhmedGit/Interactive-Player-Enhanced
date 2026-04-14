import { useState } from 'react';
import { Question } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface QuestionRendererProps {
  question: Question;
  onSubmit: (answer: string) => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  if (question.type === 'input') {
    return (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(inputValue); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your answer..."
          autoFocus
        />
        <Button type="submit" fullWidth disabled={!inputValue.trim()}>Submit</Button>
      </form>
    );
  }

  if (question.type === 'mcq') {
    return (
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {question.options.map((opt, i) => (
          <Button 
            key={i} 
            variant="secondary" 
            onClick={() => onSubmit(opt)}
            className="vq-text-left"
            fullWidth
          >
            {opt}
          </Button>
        ))}
      </div>
    );
  }

  if (question.type === 'boolean') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <Button variant="secondary" onClick={() => onSubmit('True')}>True</Button>
        <Button variant="secondary" onClick={() => onSubmit('False')}>False</Button>
      </div>
    );
  }

  return null;
};
