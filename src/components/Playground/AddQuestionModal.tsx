import React, { useState } from 'react';
import { X, CheckCircle, Save } from 'lucide-react';
import { Question } from '../../types';

interface AddQuestionModalProps {
  time: number;
  onClose: () => void;
  onAdd: (q: Question) => void;
}

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({ time, onClose, onAdd }) => {
  const [type, setType] = useState<'mcq' | 'boolean' | 'input'>('mcq');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const formatTime = (secs: number) => {
    return `${Math.floor(secs / 60)}:${Math.floor(secs % 60).toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newQuestion: any = {
      id: Date.now().toString(),
      time,
      type,
      question
    };

    if (type === 'mcq') {
      newQuestion.options = options.filter(o => o.trim() !== '');
      newQuestion.answer = options[correctAnswer];
    } else if (type === 'boolean') {
      newQuestion.answer = correctAnswer === 0 ? 'True' : 'False';
    } else {
      newQuestion.answer = options[0]; // Simple text answer matching
    }

    onAdd(newQuestion);
  };

  return (
    <div className="vq-overlay-backdrop" style={{ zIndex: 100 }}>
      <div className="vq-overlay-modal" style={{ maxWidth: '32rem' }}>
        <div className="vq-overlay-top-bar"></div>
        <button 
          onClick={onClose}
          className="vq-btn" 
          style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.25rem', color: 'var(--vq-text-secondary)', background: 'transparent' }}
        >
          <X size={20} />
        </button>

        <h3 className="vq-question-title" style={{ textAlign: 'left', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Save size={20} style={{ color: 'var(--vq-primary)' }}/> Add Question
        </h3>
        
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--vq-text-muted)' }}>Trigger time:</span>
          <span className="vq-badge vq-badge-primary">{formatTime(time)}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="vq-input-wrapper">
            <label className="vq-label">Question Type</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['mcq', 'boolean', 'input'].map(t => (
                <button
                  key={t}
                  type="button"
                  className={`vq-btn vq-btn-sm ${type === t ? 'vq-btn-primary' : 'vq-btn-secondary'}`}
                  onClick={() => setType(t as any)}
                  style={{ flex: 1 }}
                >
                  {t === 'mcq' ? 'Multiple Choice' : t === 'boolean' ? 'True/False' : 'Text Input'}
                </button>
              ))}
            </div>
          </div>

          <div className="vq-input-wrapper">
            <label className="vq-label">Your Question</label>
            <input
              type="text"
              required
              className="vq-input"
              placeholder="E.g. What is the capital of France?"
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
          </div>

          {type === 'mcq' && (
            <div className="vq-input-wrapper">
              <label className="vq-label">Options & Correct Answer</label>
              {options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setCorrectAnswer(i)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: correctAnswer === i ? 'var(--vq-success)' : 'var(--vq-text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    <CheckCircle size={20} />
                  </button>
                  <input
                    type="text"
                    className="vq-input"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={e => {
                      const newOpts = [...options];
                      newOpts[i] = e.target.value;
                      setOptions(newOpts);
                    }}
                    required={i < 2} // At least two options
                  />
                </div>
              ))}
            </div>
          )}

          {type === 'boolean' && (
            <div className="vq-input-wrapper">
              <label className="vq-label">Correct Answer</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" checked={correctAnswer === 0} onChange={() => setCorrectAnswer(0)} /> True
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" checked={correctAnswer === 1} onChange={() => setCorrectAnswer(1)} /> False
                </label>
              </div>
            </div>
          )}

          {type === 'input' && (
            <div className="vq-input-wrapper">
              <label className="vq-label">Correct Answer (Exact Match)</label>
              <input
                type="text"
                required
                className="vq-input"
                placeholder="E.g. Paris"
                value={options[0]}
                onChange={e => setOptions([e.target.value, '', '', ''])}
              />
            </div>
          )}

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="vq-btn vq-btn-ghost">Cancel</button>
            <button type="submit" className="vq-btn vq-btn-primary">Add to Timeline</button>
          </div>
        </form>
      </div>
    </div>
  );
};
