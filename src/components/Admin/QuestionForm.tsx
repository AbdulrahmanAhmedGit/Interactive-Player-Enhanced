import { useState } from 'react';
import { Plus } from 'lucide-react';
import { QuestionType } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export const QuestionForm: React.FC<{ onAdd: (q: any) => void }> = ({ onAdd }) => {
  const [newQ, setNewQ] = useState({ 
    time: 0, type: 'input' as QuestionType, question: '', answer: '', options: '' 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ.question || !newQ.answer) return;
    
    const formattedQ = {
      id: Math.random().toString(36).substring(7),
      time: Number(newQ.time),
      type: newQ.type,
      question: newQ.question,
      answer: newQ.type === 'input' ? [newQ.answer] : newQ.answer,
      ...(newQ.type === 'mcq' && { options: newQ.options.split(',').map(s => s.trim()) })
    };

    onAdd(formattedQ);
    setNewQ({ time: 0, type: 'input', question: '', answer: '', options: '' });
  };

  return (
    <div className="vq-admin-form-card">
      <h3>
        <Plus size={20} style={{ color: '#34d399' }} /> Manual Entry
      </h3>
      <form onSubmit={handleSubmit} className="vq-admin-form">
        <div className="vq-admin-form-row">
          <Input 
            type="number" 
            label="Time (s)" 
            value={newQ.time} 
            onChange={e => setNewQ(prev => ({...prev, time: Number(e.target.value)}))} 
            required 
          />
          <Select 
            label="Type" 
            value={newQ.type} 
            onChange={e => setNewQ(prev => ({...prev, type: e.target.value as QuestionType}))} 
            options={[
              { value: 'input', label: 'Text Input' },
              { value: 'mcq', label: 'Multiple Choice' },
              { value: 'boolean', label: 'True / False' }
            ]}
          />
        </div>
        <Input 
          type="text" 
          label="Question" 
          value={newQ.question} 
          onChange={e => setNewQ(prev => ({...prev, question: e.target.value}))} 
          required 
        />
        <Input 
          type="text" 
          label="Correct Answer" 
          value={newQ.answer} 
          onChange={e => setNewQ(prev => ({...prev, answer: e.target.value}))} 
          required 
        />
        {newQ.type === 'mcq' && (
          <Input 
            type="text" 
            label="Options (comma separated)" 
            value={newQ.options} 
            onChange={e => setNewQ(prev => ({...prev, options: e.target.value}))} 
            placeholder="Opt 1, Opt 2, Opt 3"
            required 
          />
        )}
        <Button type="submit" fullWidth>Add Question</Button>
      </form>
    </div>
  );
};
