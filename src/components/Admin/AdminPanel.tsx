import { LayoutDashboard } from 'lucide-react';
import { useQuizContext } from '../../context/QuizContext';
import { QuestionForm } from './QuestionForm';
import { QuestionList } from './QuestionList';

export const AdminPanel = () => {
  const { questions, setQuestions } = useQuizContext();

  const handleAdd = (q: any) => {
    setQuestions([...questions, q]);
  };

  const handleDelete = (id: string) => {
    setQuestions(questions.filter(q => (q.id || String(q.time)) !== id));
  };

  return (
    <div className="vq-admin-panel vq-animate-in">
      <div className="vq-admin-header">
        <LayoutDashboard size={32} style={{ color: '#6366f1' }} />
        <h2>Creator Dashboard</h2>
      </div>

      <div className="vq-admin-grid">
        <div>
          <QuestionForm onAdd={handleAdd} />
        </div>
        <div className="vq-admin-list">
          <div className="vq-admin-list-header">
            <h3>Existing Questions ({questions.length})</h3>
          </div>
          <QuestionList questions={questions} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
};
