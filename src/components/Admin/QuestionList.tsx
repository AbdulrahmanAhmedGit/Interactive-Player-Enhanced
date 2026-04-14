import { Trash2 } from 'lucide-react';
import { Question } from '../../types';

export const QuestionList: React.FC<{ questions: Question[], onDelete: (id: string) => void }> = ({ questions, onDelete }) => {
  if (questions.length === 0) {
    return <div className="vq-empty-state">No questions added yet.</div>;
  }

  const sortedQ = [...questions].sort((a, b) => a.time - b.time);

  return (
    <div className="vq-admin-list-body">
      {sortedQ.map((q) => {
        const id = q.id || String(q.time);
        return (
          <div key={id} className="vq-question-item">
            <div>
              <div className="vq-question-meta">
                <span className="vq-question-time">{q.time}s</span>
                <span className="vq-question-type">{q.type}</span>
              </div>
              <p className="vq-question-text">{q.question}</p>
              <p className="vq-question-answer">
                ✓ {Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}
              </p>
            </div>
            <button 
              onClick={() => onDelete(id)} 
              className="vq-delete-btn"
              aria-label="Delete question"
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
